from app import app, db, bcrypt
from models import User, Event, RSVP, Incident
from datetime import datetime, time


users = [
    {'name': 'Alice Smith', 'username': 'alice', 'email': 'alice@example.com', 'password': 'Password123!', 'role': 'admin'},
    {'name': 'Bob Johnson', 'username': 'bob', 'email': 'bob@example.com', 'password': 'Password123!', 'role': 'user'},
    {'name': 'Charlie Brown', 'username': 'charlie', 'email': 'charlie@example.com', 'password': 'Password123!', 'role': 'user'},
]

events = [
    {'name': 'Summer Sports Festival', 'type': 'sports', 'date': '2024-08-06', 'time': '10:00', 'location': 'Uhuru Park', 'image_url': ''},
    {'name': 'Jazz in the Park', 'type': 'music', 'date': '2024-08-06', 'time': '10:00', 'location': 'Uhuru Park', 'image_url': ''},
    {'name': 'Green Earth Day', 'type': 'environment', 'date': '2024-08-06', 'time': '10:00', 'location': 'Uhuru Park', 'image_url': ''},
    {'name': 'Food Truck Festival', 'type': 'food', 'date': '2024-08-06', 'time': '10:00', 'location': 'Uhuru Park', 'image_url': ''},
    {'name': 'Tech Innovators Expo', 'type': 'tech', 'date': '2024-08-10', 'time': '12:00', 'location': 'Nairobi Convention Center', 'image_url': 'https://plus.unsplash.com/premium_photo-1661540865559-56bc639e539e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGV2ZW50fGVufDB8fDB8fHww'},
    {'name': 'Youth Fair', 'type': 'youth', 'date': '2024-08-12', 'time': '09:00', 'location': 'Kenyatta Stadium', 'image_url': ''},
    {'name': 'Film Screening: Wildlife Wonders', 'type': 'arts', 'date': '2024-08-15', 'time': '18:00', 'location': 'Uhuru Gardens', 'image_url': ''},
    {'name': 'Craft Beer Festival', 'type': 'food', 'date': '2024-08-18', 'time': '14:00', 'location': 'Westlands Park', 'image_url': 'https://images.pexels.com/photos/5935229/pexels-photo-5935229.jpeg?auto=compress&cs=tinysrgb&w=600'},
    {'name': 'City Marathon', 'type': 'sports', 'date': '2024-08-22', 'time': '06:00', 'location': 'City Center', 'image_url': 'https://images.pexels.com/photos/10313669/pexels-photo-10313669.jpeg?auto=compress&cs=tinysrgb&w=600'},
    {'name': 'Cultural Dance Showcase', 'type': 'arts', 'date': '2024-08-25', 'time': '17:00', 'location': 'National Theatre', 'image_url': 'https://images.pexels.com/photos/2170387/pexels-photo-2170387.jpeg?auto=compress&cs=tinysrgb&w=600'}
]

incidents = [
    {'name': 'Broken Streetlight', 'date': '2024-08-01', 'type': 'Infrastructure Issues', 'priority': 'high', 'location': 'Main St', 'description': 'The streetlight at Main St and 1st Ave is not working.'},
    {'name': 'Loud Noise Complaint', 'date': '2024-08-05', 'type': 'Safety Concerns', 'priority': 'medium', 'location': '2nd Ave', 'description': 'Loud music coming from a house on 2nd Ave.'},
]


def parse_time(time_str):
    return time(*map(int, time_str.split(':'))) if time_str else None


with app.app_context():
    db.drop_all()
    db.create_all()

    
    for user_data in users:
        db.session.add(User(
            name=user_data['name'],
            username=user_data['username'],
            email=user_data['email'],
            password=bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
            role=user_data.get('role', 'user')
        ))

   
    for event_data in events:
        db.session.add(Event(
            name=event_data['name'],
            type=event_data['type'],
            date=datetime.strptime(event_data['date'], '%Y-%m-%d').date(),
            time=parse_time(event_data['time']),
            location=event_data['location'],
            image_url=event_data['image_url']
        ))

    
    for incident_data in incidents:
        db.session.add(Incident(
            name=incident_data['name'],
            date=datetime.strptime(incident_data['date'], '%Y-%m-%d').date(),
            type=incident_data['type'],
            priority=incident_data['priority'],
            location=incident_data['location'],
            description=incident_data['description']
        ))

    db.session.commit()
    print("Database seeded successfully!")
