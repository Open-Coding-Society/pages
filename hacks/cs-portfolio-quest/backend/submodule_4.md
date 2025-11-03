---
layout: cs-portfolio-lesson
title: "Submodule 4"
description: "Submodule 4 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_4/
parent: "Backend Development"
team: "Encrypters"
submodule: 4
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21
---

# Module 4: Flask – Python Backend


## Overview
In this module, you’ll build a **functional social media API** from scratch using **Flask**, a Python microframework designed for simplicity and flexibility.  
By the end, you’ll have a working backend that supports **user management** and **post creation**, connected to a database via **SQLAlchemy**.


---


## Why Flask?


### 🪶 Lightweight & Minimalist
Flask follows a *microframework philosophy*: start with the basics and add components only as you need them.


### 🐍 Python Ecosystem
Flask leverages Python’s simplicity and integrates smoothly with libraries like **pandas**, **NumPy**, and **AI/ML frameworks**.


### ⚙️ Flexible & Unopinionated
Flask doesn’t force a specific structure — you can choose your own tools, libraries, and file organization.


---


## Flask Fundamentals


### 1. Setup
```bash
# 1. Create a project folder
mkdir social_api && cd social_api


# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate


# 3. Install Flask and SQLAlchemy
pip install flask flask_sqlalchemy flask_cors
```


**Project structure:**
```
social_api/
 ├── app.py
 ├── models.py
 ├── routes/
 │   ├── users.py
 │   └── posts.py
 └── __init__.py
```


---


### 2. Routing Basics
```python
from flask import Flask


app = Flask(__name__)


@app.route('/')
def home():
    return {"message": "Welcome to the Social Media API!"}


if __name__ == '__main__':
    app.run(debug=True)
```


---


### 3. Request Handling
```python
from flask import Flask, request


app = Flask(__name__)


@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return {"you_sent": data}, 200
```


---


## Building the Social Media Backend


### User Management


#### 1. User Registration (POST /api/users)
```python
@app.route('/api/users', methods=['POST'])
def register_user():
    data = request.json
    # TODO: Add validation and save to database
    return {"message": "User registered successfully!"}, 201
```


#### 2. User Authentication (Login/Logout)
```python
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # TODO: Verify credentials
    return {"message": "Login successful!"}, 200


@app.route('/api/logout', methods=['POST'])
def logout():
    # TODO: Handle user logout
    return {"message": "Logout successful!"}, 200
```


---


### Posts / Messages System


#### Create Post (POST /api/posts)
```python
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    # TODO: Save post to database
    return {"message": "Post created successfully!"}, 201
```


#### Retrieve Posts (GET /api/posts)
```python
@app.route('/api/posts', methods=['GET'])
def get_posts():
    # TODO: Add pagination logic
    return {"posts": []}, 200
```


#### Update Post (PUT /api/posts/:id)
```python
@app.route('/api/posts/<int:id>', methods=['PUT'])
def update_post(id):
    data = request.json
    # TODO: Update post in database
    return {"message": f"Post {id} updated!"}, 200
```


#### Delete Post (DELETE /api/posts/:id)
```python
@app.route('/api/posts/<int:id>', methods=['DELETE'])
def delete_post(id):
    # TODO: Delete post from database
    return {"message": f"Post {id} deleted!"}, 200
```


---


## Database Integration


### SQLAlchemy Setup
```python
from flask_sqlalchemy import SQLAlchemy


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social.db'
db = SQLAlchemy(app)
```


### Creating Models
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
```


---


## Best Practices


### 1. Blueprints
Organize your routes into modular components for better scalability.
```python
from flask import Blueprint


users_bp = Blueprint('users', __name__)


@users_bp.route('/api/users')
def get_users():
    return {"users": []}
```


### 2. Input Validation
Always validate user input before performing database operations.
```python
if not data.get('username') or not data.get('password'):
    return {"error": "Missing fields"}, 400
```


### 3. CORS Configuration
Allow your frontend to communicate with your backend securely.
```python
from flask_cors import CORS
CORS(app)
```


---


## Summary
- Flask is **lightweight**, **flexible**, and **easy to extend**.
- You can build powerful backends with minimal code.
- Combining Flask with SQLAlchemy, Blueprints, and CORS makes it production-ready.


---


**Next Steps:**  
Continue by connecting your Flask API to a frontend (like React or Vue) and test endpoints with Postman or Thunder Client.


