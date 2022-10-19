from flask import Flask, url_for, redirect, session, render_template
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = 'random secret'
# oauth config
oauth = OAuth(app)
oauth.register(name='google',
               client_id='',
               client_sectet='',
               access_token_url='https://accounts.google.com/o/auth2/token',
               access_tokern_params=None,
               authorize_url='https://accounts.google.com/o/oauth2/auth',
               authorize_params=None,
               api_base_url='https://www.googleapis.com/oauth2/v1',
               client_kwargs={'scope': 'openid profile email'})


@app.route('/')
def hello_world():
    return "Hello, World!"


@app.route('/login')
def login():
    google = oauth.create_client('google')
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    # do something with the token and profile
    return redirect('/')
