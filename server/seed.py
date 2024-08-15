
from app import app, db, bcrypt
from models import User, Event, RSVP, Incident, Notification, ForumThread, ForumMessage
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

rsvps = [
    {'user_id': 1, 'event_id': 1},
    {'user_id': 2, 'event_id': 2},
    {'user_id': 3, 'event_id': 3},
    {'user_id': 1, 'event_id': 4},
    {'user_id': 2, 'event_id': 5},
    {'user_id': 3, 'event_id': 6},
    {'user_id': 1, 'event_id': 7},
    {'user_id': 2, 'event_id': 8},
]

incidents = [
    {'name': 'Broken Streetlight', 'date': '2024-08-01', 'type': 'Infrastructure Issues', 'priority': 'high', 'location': 'Main St', 'description': 'The streetlight at Main St and 1st Ave is not working.'},
    {'name': 'Loud Noise Complaint', 'date': '2024-08-05', 'type': 'Safety Concerns', 'priority': 'medium', 'location': '2nd Ave', 'description': 'Loud music coming from a house on 2nd Ave.'},
]

notifications = [
    {'title': 'Scheduled Maintenance', 'message': 'The server will be down for maintenance on August 20th from 2:00 AM to 4:00 AM.', 'date': '2024-08-18'},
    {'title': 'New Event Added', 'message': 'A new event, "Tech Innovators Expo", has been added to the calendar.', 'date': '2024-08-10'},
    {'title': 'Incident Reported', 'message': 'An incident has been reported: Broken Streetlight on Main St.', 'date': '2024-08-01'},
    {'title': 'Welcome!', 'message': 'Welcome to the Neighbourhood Network! Stay tuned for more updates.', 'date': '2024-08-01'},
    {'title': 'Weekly Roundup', 'message': 'Here’s what happened in your neighborhood this week.', 'date': '2024-08-11'},
]

def parse_time(time_str):
    return time(*map(int, time_str.split(':'))) if time_str else None

forum_threads = [
    {'title': 'General Discussion', 'creator_id': 1},
    {'title': 'Event Planning', 'creator_id': 2},
]

forum_messages = [
    {'text': 'Hello everyone, welcome to the forum!', 'thread_id': 1, 'creator_id': 1, 'created_at': datetime.now()},
    {'text': 'Looking forward to the next event!', 'thread_id': 2, 'creator_id': 2, 'created_at': datetime.now()},
]

with app.app_context():
    db.drop_all()
    db.create_all()

    for user_data in users:
        user = User(
            name=user_data['name'],
            username=user_data['username'],
            email=user_data['email'],
            password=bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
            role=user_data.get('role', 'user')
        )
        db.session.add(user)
        db.session.commit()

    for event_data in events:
        db.session.add(Event(
            name=event_data['name'],
            type=event_data['type'],
            date=datetime.strptime(event_data['date'], '%Y-%m-%d').date(),
            time=parse_time(event_data['time']),
            location=event_data['location'],
            image_url=event_data['image_url']
        ))

    for rsvp_data in rsvps:
        rsvp = RSVP(**rsvp_data)
        db.session.add(rsvp)

    for incident_data in incidents:
        db.session.add(Incident(
            name=incident_data['name'],
            date=datetime.strptime(incident_data['date'], '%Y-%m-%d').date(),
            type=incident_data['type'],
            priority=incident_data['priority'],
            location=incident_data['location'],
            description=incident_data['description']
        ))

    for notification_data in notifications:
        db.session.add(Notification(
            title=notification_data['title'],
            message=notification_data['message'],
            date=datetime.strptime(notification_data['date'], '%Y-%m-%d').date()
        ))

    for thread_data in forum_threads:
        db.session.add(ForumThread(
            title=thread_data['title'],
            creator_id=thread_data['creator_id']
        ))

    for message_data in forum_messages:
        db.session.add(ForumMessage(
            text=message_data['text'],
            thread_id=message_data['thread_id'],
            creator_id=message_data['creator_id'],
            created_at=message_data['created_at']
        ))
        
    db.session.commit()

    print("Database seeded successfully!")
