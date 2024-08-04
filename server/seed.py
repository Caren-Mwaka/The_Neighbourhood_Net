from app import app, bcrypt
from models import db, User, Event, RSVP
from datetime import datetime

def seed_db():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Add initial users
        user1 = User(name='John Doe', username='john_doe', email='john@example.com', password=bcrypt.generate_password_hash('Password123!').decode('utf-8'))
        user2 = User(name='Jane Doe', username='jane_doe', email='jane@example.com', password=bcrypt.generate_password_hash('Password!123').decode('utf-8'))
        
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
        rsvp1 = RSVP(event_id=event1.id, user_id=user1.id, username=user1.username)  # Use IDs
        rsvp2 = RSVP(event_id=event2.id, user_id=user2.id, username=user2.username)  # Use IDs

        db.session.add(rsvp1)
        db.session.add(rsvp2)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_db()
