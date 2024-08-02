# seed.py
from app import app, bcrypt
from models import db, User, Event, RSVP
from datetime import datetime

def seed_db():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Add initial users
        user1 = User(username='john_doe', email='john@example.com', password=bcrypt.generate_password_hash('password123').decode('utf-8'))
        user2 = User(username='jane_doe', email='jane@example.com', password=bcrypt.generate_password_hash('password123').decode('utf-8'))

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        # Add initial events
        event1 = Event(
            name='Community Clean-Up',
            type='Volunteer',
            date=datetime.strptime('2024-08-10', '%Y-%m-%d'),
            time=datetime.strptime('10:00:00', '%H:%M:%S').time(),
            location='Central Park',
            image_url='http://example.com/cleanup.jpg'
        )
        event2 = Event(
            name='Yoga in the Park',
            type='Wellness',
            date=datetime.strptime('2024-08-12', '%Y-%m-%d'),
            time=datetime.strptime('08:00:00', '%H:%M:%S').time(),
            location='Riverside Park',
            image_url='http://example.com/yoga.jpg'
        )

        db.session.add(event1)
        db.session.add(event2)
        db.session.commit()

        
        # Add initial RSVP records
        rsvp1 = RSVP(event_id=1, user_name='john_doe', user_email='john@example.com')
        rsvp2 = RSVP(event_id=2, user_name='jane_doe', user_email='jane@example.com')

        db.session.add(rsvp1)
        db.session.add(rsvp2)
        db.session.commit()

        print("Database seeded successfully!")
if __name__ == '__main__':
    seed_db()
