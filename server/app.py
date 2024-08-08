from flask import Flask, jsonify, request, session
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User, Event, RSVP, Incident
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound
from datetime import datetime


app = Flask(__name__)

app.config['SECRET_KEY'] = 'your-unique-secret-key'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
CORS(app)
jwt = JWTManager(app)
api = Api(app)

def generate_token(user):
    return create_access_token(identity=user.username)

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return {'message': f'Hello, {current_user}!'}

@app.errorhandler(NotFound)
def handle_not_found(e):
    return jsonify({"error": "Not Found", "message": "The requested resource does not exist."}), 404

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
        name = request.json.get("name")
        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")

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
        email = request.json.get("email")
        password = request.json.get("password")
        
        print("Email:", email)
        print("Password:", password)

        user = User.query.filter_by(email=email).first()
        if not user:
            print("User not found")
            return {"error": "Invalid credentials"}, 401

        if not bcrypt.check_password_hash(user.password, password):
            print("Password check failed")
            return {"error": "Invalid credentials"}, 401

        token = create_access_token(identity={'username': user.username, 'role': user.role})
        return {"message": "Logged in successfully", "token": token, "role": user.role}, 200

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
        date = data.get('date')
        time = data.get('time')
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
        event.date = data.get('date', event.date)
        event.time = data.get('time', event.time)
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
        data = request.get_json()
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

class IncidentResource(Resource):
    def get(self, incident_id=None):
        if incident_id:
            incident = Incident.query.get(incident_id)
            if incident:
                return incident.to_dict(), 200
            return {"error": "Incident not found"}, 404

        incidents = Incident.query.all()
        return {"incidents": [incident.to_dict() for incident in incidents]}, 200

    def post(self):
        data = request.json
        name = data.get('name')
        date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
        type_ = data.get('type')
        priority = data.get('priority')
        location = data.get('location')
        description = data.get('description')

        if not name or not date or not type_ or not priority or not location or not description:
            return {"error": "Missing fields"}, 400

        new_incident = Incident(name=name, date=date, type=type_, priority=priority, location=location, description=description)
        db.session.add(new_incident)
        db.session.commit()
        return new_incident.to_dict(), 201

    def put(self, incident_id):
        incident = Incident.query.get(incident_id)
        if not incident:
            return {"error": "Incident not found"}, 404

        data = request.json
        incident.name = data.get('name', incident.name)
        incident.date = datetime.strptime(data.get('date', incident.date), '%Y-%m-%d').date()  
        incident.type = data.get('type', incident.type)
        incident.priority = data.get('priority', incident.priority)
        incident.location = data.get('location', incident.location)
        incident.description = data.get('description', incident.description)

        db.session.commit()
        return incident.to_dict(), 200

    def delete(self, incident_id):
        incident = Incident.query.get(incident_id)
        if not incident:
            return {"error": "Incident not found"}, 404

        db.session.delete(incident)
        db.session.commit()
        return {"message": "Incident deleted"}, 200

api.add_resource(IncidentResource, '/incidents', '/incidents/<int:id>')
api.add_resource(Index, '/')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(EventResource, '/events', '/events/<int:event_id>')
api.add_resource(RSVPResource, '/rsvp', '/rsvp/<int:rsvp_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
