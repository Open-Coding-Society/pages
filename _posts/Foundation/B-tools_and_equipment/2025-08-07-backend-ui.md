---
toc: True
layout: post
data: flask
title: Backend UI
description: An overview of backend UI for Flask Jinja
categories: ['Python Flask']
permalink: /python/flask/jinja_ui
menu: nav/flask.html
author: Vibha Mandayam
breadcrumb: True 
---

## 1. What is Backend UI?

A **Backend UI** is a web interface that allows admins, teachers, or managers to interact with your app's data and logic on the server side.

For example, it can let you:

- View a list of users
- Edit or delete records
- Manage data like events, tasks, or reports

This UI talks to the backend (server) and helps people use your app without needing code or APIs.

---

## 2. Tools We Will Use

- **Flask**: A simple Python web framework to create web servers and APIs  
- **Jinja2**: The template engine Flask uses to generate HTML pages dynamically  
- **Bootstrap**: A CSS framework to style pages easily and make them responsive  
- **HTML/CSS** basics for page layout and styling  

---


## 3. The Base Template (`base.html`)

This is the main layout shared by all pages.

### What it includes:

- Loading **Bootstrap CSS** and **JavaScript** for styling and components  
- Loading **Font Awesome** icons  
- Loading **jQuery** and **DataTables** for advanced table features  
- A **navbar** included from another file so it stays consistent  
- A cool animated background using Vanta.js (optional)

### How to use it:

---

## 6. Writing a Simple Flask App (`app.py`)

Here’s a minimal Flask app that serves our pages:

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', project="Home")

@app.route('/users')
def users():
    # Example user data
    users_list = [
        {"id": 1, "name": "Alice", "email": "alice@example.com"},
        {"id": 2, "name": "Bob", "email": "bob@example.com"},
        {"id": 3, "name": "Carol", "email": "carol@example.com"},
    ]
    return render_template('users.html', project="Users", users=users_list)

if __name__ == "__main__":
    app.run(debug=True)
```
---
## 7. Creating Pages
Homepage (index.html)

---
## 8. Users Page (u2table.html)
This page shows a table of users.

---
## 9. Running Your App

1. Run the Flask app by pressing the **Play** button on `main.py`.
You should see output like:
Running on http://127.0.0.1:8587
2. Open your browser and go to [http://127.0.0.1:8587](http://127.0.0.1:8587) to see the homepage.

---
## 10. What Did We Learn?

- How to work with a base HTML template in a Flask app  
- How to use Jinja blocks to insert and customize page-specific content  
- How templates and static files are organized in a Flask project  
- How routes connect Flask backend to the templates and pass data  
- How to edit and improve an existing backend UI using tables and Bootstrap styles  
- How DataTables enhances tables with features like search and sorting
