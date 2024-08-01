from app import app, bcrypt
from models import db, User
from datetime import datetime

def seed_db():
    with app.app_context():
        db.drop_all()
        db.create_all()

        users = []
        for username, email, password in [
            ('caren', 'caren@example.com', 'Password1!'),
            ('shonko','shonko@example.com', 'Password2!'),
          
        ]:
            user = User(username=username, email=email,
                        password=bcrypt.generate_password_hash(password).decode('utf-8'))
            db.session.add(user)
            users.append(user)

        try:
            db.session.commit()
            print("Users committed successfully!")
        except Exception as e:
            print(f"Error committing users: {e}")

        for user in users:
            print(f"User ID: {user.id}, Username: {user.username}")

if __name__ == '__main__':
    seed_db()