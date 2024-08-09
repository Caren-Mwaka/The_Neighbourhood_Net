from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
from sqlalchemy.orm import validates
from werkzeug.exceptions import HTTPException
import re
from datetime import datetime

# Initialize Flask application
app = Flask(__name__)

# Configure app
app.config['SECRET_KEY'] = 'your-unique-secret-key'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)

# Enable CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    rsvps = db.relationship('RSVP', back_populates='user', cascade='all, delete-orphan')
    events = db.relationship('Event', secondary='rsvp', back_populates='users')

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format")
        return email

    @validates('password')
    def validate_password(self, key, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain at least one special character")
        return password

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "events": [event.id for event in self.events]
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200))
    rsvps = db.relationship('RSVP', back_populates='event', lazy=True)
    users = db.relationship('User', secondary='rsvp', back_populates='events')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "date": self.date.isoformat(),
            "time": self.time.isoformat(),
            "location": self.location,
            "image_url": self.image_url,
            "users": [user.id for user in self.users]
        }

class RSVP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    user = db.relationship('User', back_populates='rsvps')
    event = db.relationship('Event', back_populates='rsvps')

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "username": self.username,
            "event": self.event.to_dict()
        }

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<ContactMessage {self.full_name}>'

# Routes and Resources
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return {'message': f'Hello, {current_user}!'}

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    response = e.get_response()
    response.data = jsonify({"error": e.name, "message": e.description}).data
    response.content_type = "application/json"
    return response

class Index(Resource):
    def get(self):
        return {"index": "Welcome to the Neighbourhood Net"}

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
            return {"error": "User not found"}, 404

        users = User.query.all()
        return {"users": [user.to_dict() for user in users]}, 200

class RegisterResource(Resource):
    def post(self):
        data = request.json
        name = data.get("name")
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password or not name:
            return {"error": "Missing fields"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password=hashed_password, name=name)
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201

class LoginResource(Resource):
    def post(self):
        data = request.json
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            token = create_access_token(identity=user.username)
            return {"message": "Logged in successfully", "token": token}, 200
        return {"error": "Invalid credentials"}, 401

class EventResource(Resource):
    def get(self, event_id=None):
        if event_id:
            event = Event.query.get(event_id)
            if event:
                return event.to_dict(), 200
            return {"error": "Event not found"}, 404

        events = Event.query.all()
        return {"events": [event.to_dict() for event in events]}, 200

    def post(self):
        data = request.json
        name = data.get('name')
        type_ = data.get('type')
        date = datetime.strptime(data.get('date'), '%Y-%m-%d').date() if data.get('date') else None
        time = datetime.strptime(data.get('time'), '%H:%M:%S').time() if data.get('time') else None
        location = data.get('location')
        image_url = data.get('image_url')

        if not name or not type_ or not date or not time or not location:
            return {"error": "Missing fields"}, 400

        new_event = Event(name=name, type=type_, date=date, time=time, location=location, image_url=image_url)
        db.session.add(new_event)
        db.session.commit()
        return new_event.to_dict(), 201

    def put(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}, 404

        data = request.json
        event.name = data.get('name', event.name)
        event.type = data.get('type', event.type)
        event.date = datetime.strptime(data.get('date'), '%Y-%m-%d').date() if data.get('date') else event.date
        event.time = datetime.strptime(data.get('time'), '%H:%M:%S').time() if data.get('time') else event.time
        event.location = data.get('location', event.location)
        event.image_url = data.get('image_url', event.image_url)

        db.session.commit()
        return event.to_dict(), 200

    def delete(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}, 404

        db.session.delete(event)
        db.session.commit()
        return {"message": "Event deleted"}, 200

class RSVPResource(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        event_id = data.get('event_id')

        if not event_id:
            return {'error': 'Invalid data'}, 400

        user = User.query.filter_by(username=get_jwt_identity()).first()
        if not user:
            return {'error': 'User not found'}, 404

        rsvp = RSVP(event_id=event_id, user_id=user.id, username=user.username)
        db.session.add(rsvp)
        db.session.commit()
        return {'message': 'RSVP successful'}, 201

    @jwt_required()
    def delete(self, rsvp_id):
        rsvp = RSVP.query.get(rsvp_id)
        if not rsvp:
            return {'error': 'RSVP not found'}, 404

        db.session.delete(rsvp)
        db.session.commit()
        return {'message': 'RSVP deleted'}, 200

# Register resources with API
api.add_resource(Index, '/')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(EventResource, '/events', '/events/<int:event_id>')
api.add_resource(RSVPResource, '/rsvp', '/rsvp/<int:rsvp_id>')

# Route to handle contact message submission
@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    full_name = data.get('fullName')
    email = data.get('email')
    message = data.get('message')

    if not full_name or not email or not message:
        return jsonify({"error": "Please provide all required fields"}), 400

    # Create a new contact message
    new_message = ContactMessage(full_name=full_name, email=email, message=message)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"message": "Message sent successfully!"}), 201

# Run the application
if __name__ == '__main__':
    app.run(debug=True, port=5555)
