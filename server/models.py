import re
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.event import listens_for
from datetime import datetime, time

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False) 
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user') 
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    rsvps = db.relationship('RSVP', back_populates='user', cascade='all, delete-orphan', overlaps='events')
    events = db.relationship('Event', secondary='rsvp', back_populates='users', overlaps='rsvps')

   
    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email format")
        return email

    @validates('password')
    def validate_password(self, key, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain at least one special character")
        return password

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "role": self.role, 
            "created_at": self.created_at.isoformat(),
            "events": [event.id for event in self.events]
        }

class ForumThread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    creator = db.relationship('User', backref=db.backref('threads', lazy=True))
    messages = db.relationship('ForumMessage', backref='thread', cascade="all, delete-orphan")

class ForumMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('forum_thread.id'), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    creator = db.relationship('User', backref=db.backref('messages', lazy=True))
    

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200))

    rsvps = db.relationship('RSVP', back_populates='event', lazy=True, overlaps='users')
    users = db.relationship('User', secondary='rsvp', back_populates='events', overlaps='rsvps')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "date": self.date.isoformat(),
            "time": self.time.isoformat(),
            "location": self.location,
            "image_url": self.image_url,
            "users": [user.id for user in self.users]
        }

class RSVP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    
    user_name = db.Column(db.String(80), nullable=False)
    event_name = db.Column(db.String(120), nullable=False)

    user = db.relationship('User', back_populates='rsvps', overlaps='events')
    event = db.relationship('Event', back_populates='rsvps', overlaps='users')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event'),
    )

@listens_for(RSVP, 'before_insert')
@listens_for(RSVP, 'before_update')
def update_rsvp_names(mapper, connection, target):
    user = User.query.get(target.user_id)
    event = Event.query.get(target.event_id)
    if user:
        target.user_name = user.username
    if event:
        target.event_name = event.name

class Incident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) 
    date = db.Column(db.Date, nullable=False) 
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name, 
            'date': self.date.isoformat(), 
            'type': self.type,
            'description': self.description,
            'location': self.location,
            'priority': self.priority,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(250), nullable=False)
    date = db.Column(db.Date, nullable=False)
    dismissed = db.Column(db.Boolean, default=False)  # New field

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "date": self.date.isoformat(),
            "dismissed": self.dismissed
        }

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
        }