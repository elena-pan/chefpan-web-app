from flask import Response, request
from flask_restful import Resource
from db.models import User
import os, jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
jwt_secret = os.environ.get("JWT_SECRET")
jwt_algorithm = os.environ.get("JWT_ALGORITHM")

def validate(userData, register):
    errors = {}
    if 'username' in userData:
        if userData['username'].strip() == "":
            errors['username'] = "Username is required"
    else:
        errors['username'] = "Username is required"
    if 'password' in userData:
        if userData['password'].strip() == "":
            errors['password'] = "Password is required"
        if register:
            if len(userData['password']) < 6 or len(userData['password']) > 30:
                errors['password'] = "Password must be between 6 and 30 characters"
    else:
        errors['password'] = "Password is required"
    if register:
        if 'password2' in userData:
            if userData['password'] != userData['password2']:
                errors['password2'] = "Passwords must match"
        else:
            errors['password2'] = "Confirm password field is required"
    return errors

# User resources

"""
class UserRegistration(Resource):
    def post(self):
        body = request.json
        errors = validate(body, True)
        if errors:
            return errors, 400
        try:
            user = User.objects().get(username=body['username'])
            return {'username':'Username taken'}, 400
        except:
            try:
                user = User(username=body['username'], password=User.generate_hash(body['password'])).save()
                return {'message':"success"}
            except Exception as e:
                return str(e), 500
"""

class UserLogin(Resource):
    def post(self):
        body = request.json
        errors = validate(body, False)
        if errors:
            return errors, 400
        try:
            current_user = User.objects().get(username=body['username'])
        except:
            return {'passwordincorrect': 'Incorrect username/password combination'}, 400
        
        if User.verify_hash(body['password'], current_user.password):
            payload = {
                'id': str(current_user.id),
                'exp': datetime.utcnow() + timedelta(seconds=2592000) # 1 month in seconds
            }
            token = jwt.encode(payload, jwt_secret, jwt_algorithm)
            return {'token': token.decode('utf-8')}
        else:
            return {'passwordincorrect': 'Incorrect username/password combination'}, 400