import os, jwt, re, json, datetime
from flask import Flask, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from flask_restful import Api
from dotenv import load_dotenv
from flask_mongoengine import MongoEngine
from mongoengine.queryset.visitor import Q
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from functools import wraps
from google.cloud import storage
from db.models import Recipe, User
import resources

app = Flask(__name__, static_folder='./client/build')

load_dotenv()
mongo_uri = os.environ.get("MONGO_URI")
jwt_secret = os.environ.get("JWT_SECRET")
jwt_algorithm = os.environ.get("JWT_ALGORITHM")
sendgrid_api_key = os.environ.get("SENDGRID_API_KEY")
sendgrid_from_email = os.environ.get("SENDGRID_FROM_EMAIL")

UPLOAD_FOLDER = '/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['MONGODB_SETTINGS'] = {
    'host': mongo_uri
}

db = MongoEngine()
db.init_app(app)
api = Api(app)

api.add_resource(resources.UserRegistration, '/api/users/register')
api.add_resource(resources.UserLogin, '/api/users/login')

def validateContactForm(contactFormData):
    errors = {}
    if 'name' in contactFormData:
        if contactFormData['name'].strip() == "":
            errors['name'] = "Name is required"
    else:
        errors['Name'] = "Name is required"
    if 'email' in contactFormData:
        emailRegex = re.compile(r'''(
            [a-zA-Z0-9._%+-]+   # username
            @                   # @ symbol
            [a-zA-Z0-9.-]+      # domain name
            (\.[a-zA-Z]{2,4})    # dot-something
            )''', re.VERBOSE)

        if contactFormData['email'].strip() == "":
            errors['email'] = "Email is required"
        elif not emailRegex.match(contactFormData['email']):
            errors['email'] = "Email is invalid"
    else:
        errors['Email'] = "Email is required"
    if 'subject' in contactFormData:
        if contactFormData['subject'].strip() == "":
            errors['subject'] = "Subject is required"
    else:
        errors['subject'] = "Subject is required"
    if 'message' in contactFormData:
        if contactFormData['message'].strip() == "":
            errors['message'] = "Message cannot be empty"
    else:
        errors['message'] = "Message cannot be empty"
    return errors

def validateRecipe(recipeData):
    errors = {}
    if 'name' in recipeData:
        if recipeData['name'].strip() == "":
            errors['name'] = "Recipe name is required"
    else:
        errors['name'] = "Recipe name is required"
    if 'ingredients' in recipeData:
        if len(recipeData['ingredients']) < 1:
            errors['ingredients'] = "Ingredients are required"
    else:
        errors['ingredients'] = "Ingredients are required"
    if 'steps' in recipeData:
        if len(recipeData['steps']) < 1:
            errors['steps'] = "Directions are required"
    else:
        errors['steps'] = "Directions are required"
    if 'categories' in recipeData:
        if len(recipeData['categories']) < 1:
            errors['categories'] = "Categories are required"
    else:
        errors['categories'] = "Categories are required"
    return errors

def auth_middleware(f):
    @wraps(f)
    def middleware(*args, **kwargs):
        request.user = None
        token = request.headers.get('authorization', None)
        if token:
            try:
                payload = jwt.decode(token, jwt_secret, algorithms=[jwt_algorithm])

            except (jwt.DecodeError, jwt.ExpiredSignatureError):
                return {'message': 'Invalid or expired token'}, 400

            request.user = User.objects.get(id=payload['id'])
        else:
            return "", 401
        return f(*args, **kwargs)
    return middleware

@app.route('/api/recipes/add/generate-upload-signed-url-v4', methods=['POST'])
@auth_middleware
def generate_upload_signed_url_v4():
    """Generates a v4 signed URL for uploading a blob using HTTP PUT.

    Note that this method requires a service account key file. You cannot use
    this if you are using Application Default Credentials from Google Compute
    Engine or from the Google Cloud SDK.
    """
    bucket_name = 'recipe-imgs'
    blob_name = request.json['name']
    if not blob_name.endswith('.jpg') and not blob_name.endswith('.jpeg') and not blob_name.endswith('.png'):
        return {"notimg":"Upload must be jpg, jpeg, or png file"}, 400
    method = request.json['method'] # PUT

    storage_client = storage.Client.from_service_account_json(process.env.GOOGLE_API_CREDENTIALS)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        # This URL is valid for 15 minutes
        expiration=datetime.timedelta(minutes=15),
        # Allow PUT requests using this URL.
        method=method
    )
    
    return url

@app.route('/api/contact/send-email', methods=['POST'])
def contact_form():
    body = request.json
    errors = validateContactForm(body)
    if errors:
        return errors, 400
    message = Mail(
        from_email=sendgrid_from_email,
        to_emails=sendgrid_from_email,
        subject='Elemations Contact Form: ' + body['subject'],
        html_content='<p><b>Name: </b>%s</p><p><b>Email: </b>%s</p><p><b>Message: </b>%s</p>' %(body['name'], body['email'], body['message']))
    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        sg.send(message)
        return Response({ 'success': True })
    except Exception as e:
        return Response(str(e), 500)

@app.route('/api/users/user', methods=['DELETE'])
@auth_middleware
def delete_user():
    try:
        request.user.delete()
        return Response({ 'success': True })
    except Exception as e:
        return Response(str(e), 500)

@app.route('/api/recipes')
def get_recipes():
    return Response(Recipe.objects.all().to_json())

@app.route('/api/recipes/<id>')
def get_recipe(id):
    try: 
        recipe = Recipe.objects.get(id=id)
        return Response(recipe.to_json())
    except:
        return "", 400

@app.route('/api/recipes/category/<category>')
def get_recipes_category(category):
        recipes = []
        categories = category.split("-")
        for category in categories:
            categoryRegex = re.compile(category)
            recipes2 = Recipe.objects(Q(categories=categoryRegex) | Q(ingredients=categoryRegex))
            for recipe in recipes2:
                recipes.append(recipe.to_json())
        recipes = list(set(recipes)) # remove duplicates
        recipes = [json.loads(x) for x in recipes]
        return Response(json.dumps(recipes))

@app.route('/api/recipes/add', methods=['POST'])
@auth_middleware
def add_recipe():
    body = request.json
    errors = validateRecipe(body)
    if errors:
        return errors, 400
    try:
        recipe = Recipe(**body).save()
        return Response(recipe.to_json())
    except Exception as e:
        return Response(str(e), 400)

@app.route('/api/recipes/<id>', methods=['PUT'])
@auth_middleware
def update_recipe(id):
    body = request.json
    errors = validateRecipe(body)
    if errors:
        return errors, 400
    try:
        recipe = Recipe.objects.get(id=id)
        recipe.name = body['name']
        recipe.ingredients = body['ingredients']
        recipe.steps = body['steps']
        recipe.categories = body['categories']
        if 'servings' in body:
            recipe.servings = body['servings']
        if 'notes' in body:
            recipe.notes = body['notes']
        if 'img' in body:
            recipe.img = body['img']
        recipe.save()
        return Response(recipe.to_json())
    except Exception as e:
        return Response(str(e), 400)

@app.route('/api/recipes/<id>', methods=['DELETE'])
@auth_middleware
def delete_recipe(id):
    try: 
        # If image delete from cloud storage
        recipe = Recipe.objects.get(id=id)
        if 'img' in recipe:
            blob_name = recipe['img'].split('/')[-1]

            storage_client = storage.Client.from_service_account_json(process.env.GOOGLE_API_CREDENTIALS)
            bucket = storage_client.bucket('recipe-imgs')
            blob = bucket.blob(blob_name)
            blob.delete()

        id = recipe.id
        recipe.delete()
        return { 'id': str(id) }
    except Exception as e:
        return Response(str(e), 400)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()