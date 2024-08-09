from app import app, bcrypt, db
from models import User, Event, RSVP, ContactMessage
from datetime import datetime

def seed_db():
    # Drop all existing tables and recreate them
    db.drop_all()
    db.create_all()

    # Create users
    user1 = User(
        name='Caren Mwaka', 
        username='caren_mwaka', 
        email='caren@example.com', 
        password=bcrypt.generate_password_hash('Password123!').decode('utf-8')
    )
    user2 = User(
        name='Joseph Shonko', 
        username='joseph_shonko', 
        email='shonko@example.com', 
        password=bcrypt.generate_password_hash('Password!123').decode('utf-8')
    )

    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # Create events
    event1 = Event(
        name='Community Clean-Up',
        type='Volunteer',
        date=datetime.strptime('2024-08-10', '%Y-%m-%d').date(),
        time=datetime.strptime('10:00:00', '%H:%M:%S').time(),
        location='Central Park',
        image_url='http://example.com/cleanup.jpg'
    )
    event2 = Event(
        name='Yoga in the Park',
        type='Wellness',
        date=datetime.strptime('2024-08-12', '%Y-%m-%d').date(),
        time=datetime.strptime('08:00:00', '%H:%M:%S').time(),
        location='Riverside Park',
        image_url='http://example.com/yoga.jpg'
    )

    db.session.add(event1)
    db.session.add(event2)
    db.session.commit()

    # Create RSVPs
    rsvp1 = RSVP(event_id=event1.id, user_id=user1.id, username=user1.username)
    rsvp2 = RSVP(event_id=event2.id, user_id=user2.id, username=user2.username)

    db.session.add(rsvp1)
    db.session.add(rsvp2)
    db.session.commit()

    print("Database seeded successfully!")

if __name__ == '__main__':
    with app.app_context():
        seed_db()

        # Optionally seed additional data
        message = ContactMessage(
            full_name="John Doe", 
            email="johndoe@example.com", 
            message="Hello, world!"
        )
        db.session.add(message)
        db.session.commit()

        print("Additional data seeded successfully!")
