from app import app, db
from app.models import todo
from flask import abort, jsonify, request
import datetime
import json

@app.route('/api/todos', methods = ['GET'])
def get_all_todos():
    items = todo.Todo.query.all()
    return json.dumps([item.to_dict() for item in items])

@app.route('/api/todos/<int:id>', methods = ['GET'])
def get_todo(id):
    item = todo.Todo.query.get(id)
    if not item:
        abort(404)
    return jsonify(item.to_dict())

@app.route('/api/todos', methods = ['POST'])
def create_todo():
    item = todo.Todo(
        title = request.json['title'],
        done = request.json['done']
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@app.route('/api/todos/<int:id>', methods = ['PUT'])
def update_todo(id):
    item = todo.Todo.query.get(id)
    if not item:
        abort(404)
    item = todo.Todo(
        title = request.json['title'],
        done = request.json['done'],
        id = id
    )

    db.session.merge(item)
    db.session.commit()
    return jsonify(item.to_dict()), 200

@app.route('/api/todos/<int:id>', methods = ['DELETE'])
def delete_todo(id):
    item = todo.Todo.query.get(id)
    if not item:
        abort(404)
    db.session.delete(item)
    db.session.commit()
    return '', 204