from app import app, db, bcrypt
from models import User, Event, RSVP, Incident
from datetime import datetime, time

# Define some sample data
users = [
    {'name': 'Alice Smith', 'username': 'alice', 'email': 'alice@example.com', 'password': 'Password123!', 'role': 'admin'},
    {'name': 'Bob Johnson', 'username': 'bob', 'email': 'bob@example.com', 'password': 'Password123!', 'role': 'user'},
    {'name': 'Charlie Brown', 'username': 'charlie', 'email': 'charlie@example.com', 'password': 'Password123!', 'role': 'user'},
]

events = [
    {'name': 'Neighborhood Clean-up', 'type': 'Environmental Hazards', 'date': '2024-08-15', 'time': '10:00', 'location': 'Park', 'image_url': 'http://example.com/image1.jpg'},
    {'name': 'Community Safety Workshop', 'type': 'Safety Concerns', 'date': '2024-08-20', 'time': '14:00', 'location': 'Community Center', 'image_url': 'http://example.com/image2.jpg'},
]

incidents = [
    {'name': 'Broken Streetlight', 'date': '2024-08-01', 'type': 'Infrastructure Issues', 'priority': 'high', 'location': 'Main St', 'description': 'The streetlight at Main St and 1st Ave is not working.'},
    {'name': 'Loud Noise Complaint', 'date': '2024-08-05', 'type': 'Safety Concerns', 'priority': 'medium', 'location': '2nd Ave', 'description': 'Loud music coming from a house on 2nd Ave.'},
]

# Function to convert time string to datetime.time object
def parse_time(time_str):
    if time_str:
        hours, minutes = map(int, time_str.split(':'))
        return time(hours, minutes)
    return None

# Seed the database
with app.app_context():
    db.drop_all()  # Drop all tables
    db.create_all()  # Create all tables

    # Add users
    for user_data in users:
        hashed_password = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
        user = User(
            name=user_data['name'],
            username=user_data['username'],
            email=user_data['email'],
            password=hashed_password,
            role=user_data.get('role', 'user')  # Default to 'user' if no role is provided
        )
        db.session.add(user)

    # Add events
    for event_data in events:
        event = Event(
            name=event_data['name'],
            type=event_data['type'],
            date=datetime.strptime(event_data['date'], '%Y-%m-%d').date(),
            time=parse_time(event_data['time']),
            location=event_data['location'],
            image_url=event_data['image_url']
        )
        db.session.add(event)

    # Add incidents
    for incident_data in incidents:
        incident = Incident(
            name=incident_data['name'],
            date=datetime.strptime(incident_data['date'], '%Y-%m-%d').date(),
            type=incident_data['type'],
            priority=incident_data['priority'],
            location=incident_data['location'],
            description=incident_data['description']
        )
        db.session.add(incident)

    db.session.commit()
    print("Database seeded successfully!")
