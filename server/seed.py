from app import app, bcrypt
from models import db, User
from datetime import datetime

def seed_db():
    with app.app_context():
        db.drop_all()
        db.create_all()