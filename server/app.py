from flask import Flask, jsonify, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.exceptions import NotFound
from models import db, User, Room, Booking, Review  
from flask_bcrypt import Bcrypt
from datetime import datetime