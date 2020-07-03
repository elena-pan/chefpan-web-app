import mongoengine as db
from passlib.hash import pbkdf2_sha256 as sha256

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)
    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

class Recipe(db.Document):
    name = db.StringField(required=True)
    servings=db.StringField()
    ingredients = db.ListField(db.StringField(), required=True)
    steps = db.ListField(db.StringField(), required=True)
    categories = db.ListField(db.StringField(), required=True)
    notes = db.StringField()
    img = db.StringField()