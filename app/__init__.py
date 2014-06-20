from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

app = Flask(__name__, static_url_path='')
app.config.from_object('config')
db = SQLAlchemy(app)

from app.models import todo
from app.routes import index

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(todo.Todo, methods=['GET', 'POST', 'DELETE', 'PUT'])