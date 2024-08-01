from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound

app = Flask(__name__)


app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
jwt = JWTManager(app)
api = Api(app)


def generate_token(user):
    return create_access_token(identity=user.username)


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
        return {"index": "Welcome to the Home Haven"}

class UserResource(Resource):
    def post(self):
        if request.path.endswith('/login'):
            return self.login()
        else:
            return self.register()

    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
            return {"error": "User not found"}, 404
        
        users = User.query.all()
        return {"users": [user.to_dict() for user in users]}, 200

    def register(self):
        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")

        if not username or not email or not password:
            return {"error": "Missing fields"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201

    def login(self):
        email = request.json.get("email") 
        password = request.json.get("password")

        user = User.query.filter_by(email=email).first()  
        if user and bcrypt.check_password_hash(user.password, password):
            token = generate_token(user)
            return {"message": "Logged in successfully", "token": token}, 200
        return {"error": "Invalid credentials"}, 401

api.add_resource(Index, '/')
api.add_resource(UserResource, '/users', '/users/<int:user_id>', '/login', '/register')

if __name__ == '__main__':
    app.run(debug=True)
