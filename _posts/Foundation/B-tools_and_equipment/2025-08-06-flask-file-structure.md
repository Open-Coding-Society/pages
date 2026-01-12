---
toc: True
layout: post
data: flask
title: Flask File Structure
description: An overview of the file structure of flask
categories: ['Python Flask']
permalink: /python/flask/anatomy
author: Anusha Khobare
breadcrumb: True 
---
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Flask Project Structure Explained - Interactive Guide</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 2rem;
    line-height: 1.6;
    color: #ffffff; /* All text white */
    background: none;
    background-color: #000000; /* Black background for contrast */
  }

  /* File tree styles */
  .file-tree {
    max-width: 600px;
    margin: 0 auto 3rem;
    background: none;
    border: none;
    padding: 1rem 2rem;
    user-select: none;
    font-family: Consolas, monospace;
    font-size: 1rem;
    white-space: pre;
    cursor: default;
    color: #ffffff; /* White text */
  }

  .clickable {
    color: #ffffff; /* White text */
    cursor: pointer;
    border-radius: 4px;
    outline: none;
    text-decoration: underline; /* Underline links */
  }
  .clickable:hover, .clickable:focus {
    background-color: rgba(255, 255, 255, 0.1); /* subtle white highlight */
    color: #ffffff;
  }

  .indent-1 { padding-left: 1.5em; }
  .indent-2 { padding-left: 3em; }
  .indent-3 { padding-left: 4.5em; }

  /* Lesson section card style */
  section.lesson-section {
    max-width: 700px;
    margin: 2rem auto;
    background: none;
    border: 1.5px solid #ffffff; /* white outline */
    border-left: 6px solid #ffffff;
    border-radius: 8px;
    padding: 1.5rem 2rem;
    box-shadow: none;
    scroll-margin-top: 80px;
    color: #ffffff; /* White text */
  }

  section.lesson-section h2 {
    margin-top: 0;
    color: #ffffff; /* White heading */
    font-weight: 700;
    border-bottom: 2px solid #ffffff;
    padding-bottom: 0.3rem;
    font-size: 1.6rem;
  }

  section.lesson-section p {
    font-size: 1rem;
    margin: 1rem 0;
    color: #ffffff; /* White text */
  }

  section.lesson-section pre {
    background-color: transparent;
    border: 1px solid #ffffff; /* white border */
    border-radius: 6px;
    padding: 1rem 1.2rem;
    font-size: 1rem;
    overflow-x: auto;
    font-family: 'Courier New', Courier, monospace;
    color: #ffffff; /* White code text */
  }

  /* Headings for sub files */
  .subfile-header {
    font-weight: 600;
    margin-top: 1rem;
    color: #ffffff; /* White text */
  }
</style>
</head>
<body>

<h1 style="text-align:center; color:#ffffff; margin-bottom:2rem;">Flask Project Structure: Explained</h1>

<div class="file-tree" aria-label="Flask project file structure">
/flask-app
│
├── <span class="clickable" role="button" tabindex="0" onclick="scrollToSection('init-py')">init.py</span>
├── <span class="clickable" role="button" tabindex="0" onclick="scrollToSection('main-py')">main.py</span>
│
├── <span class="clickable" role="button" tabindex="0" onclick="scrollToSection('api-folder')">/api</span>
│   ├── users.py
│   ├── calendar.py
│   └── issues.py
│
├── <span class="clickable" role="button" tabindex="0" onclick="scrollToSection('models-folder')">/models</span>
│   ├── user.py
│   ├── event.py
│   └── issue.py
│
├── /scripts
│   <span class="clickable indent-2" role="button" tabindex="0" onclick="scrollToSection('db-init-py')">└── db_init.py</span>
│
├── /templates
│   <span class="clickable indent-2" role="button" tabindex="0" onclick="scrollToSection('dashboard-html')">└── dashboard.html</span>
│
├── /static
│   <span class="clickable indent-2" role="button" tabindex="0" onclick="scrollToSection('styles-css')">└── styles.css</span>
│
└── <span class="clickable" role="button" tabindex="0" onclick="scrollToSection('requirements-txt')">requirements.txt</span>
</div>

<!-- Sections for clickable files -->

<section id="main-py" class="lesson-section" tabindex="-1">
  <h2>main.py</h2>
  <p><strong>Purpose:</strong> Entry point of your app. Runs the server using Flask.</p>
  <pre>from __init__ import create_app
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
  </pre>
</section>

<section id="init-py" class="lesson-section" tabindex="-1">
  <h2>__init__.py</h2>
  <p><strong>Purpose:</strong> App configuration and Blueprint registration.</p>
  <p>Sets up Flask and brings together all your routes.</p>
  <pre>from flask import Flask
from api.users import user_api
from api.calendar import calendar_api

def create_app():
    app = Flask(__name__)
    app.register_blueprint(user_api)
    app.register_blueprint(calendar_api)
    return app
  </pre>
</section>

<section id="api-folder" class="lesson-section" tabindex="-1">
  <h2>/api folder</h2>
  <p>This folder contains the API route handler files such as <code>users.py</code>, <code>calendar.py</code>, and <code>issues.py</code>.</p>
</section>

<section id="models-folder" class="lesson-section" tabindex="-1">
  <h2>/models folder</h2>
  <p>This folder contains database model files like <code>user.py</code>, <code>event.py</code>, and <code>issue.py</code>.</p>
</section>

<section id="users-py" class="lesson-section" tabindex="-1">
  <h2>/api/users.py</h2>
  <p>Handles user-related routes like <code>/register</code> and <code>/login</code>.</p>
  <p>Defines HTTP endpoints and returns JSON responses for user actions.</p>
</section>

<section id="calendar-py" class="lesson-section" tabindex="-1">
  <h2>/api/calendar.py</h2>
  <p>Handles calendar-related routes like <code>/calendar/create</code>.</p>
  <p>Defines HTTP endpoints and returns JSON responses for calendar events.</p>
</section>

<section id="issues-py" class="lesson-section" tabindex="-1">
  <h2>/api/issues.py</h2>
  <p>Handles issue reporting routes like <code>/issues/report</code>.</p>
  <p>Defines HTTP endpoints and returns JSON responses for issues.</p>
</section>

<section id="user-py" class="lesson-section" tabindex="-1">
  <h2>/models/user.py</h2>
  <p>Defines the User database model using SQLAlchemy.</p>
  <pre># models/user.py
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
  </pre>
</section>

<section id="event-py" class="lesson-section" tabindex="-1">
  <h2>/models/event.py</h2>
  <p>Defines the Event database model (example).</p>
  <pre># models/event.py
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    date = db.Column(db.DateTime)
  </pre>
</section>

<section id="issue-py" class="lesson-section" tabindex="-1">
  <h2>/models/issue.py</h2>
  <p>Defines the Issue database model (example).</p>
  <pre># models/issue.py
class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255))
  </pre>
</section>

<section id="db-init-py" class="lesson-section" tabindex="-1">
  <h2>scripts/db_init.py</h2>
  <p>Utility script to initialize the database.</p>
  <pre># scripts/db_init.py
from __init__ import create_app
from models import db

app = create_app()
with app.app_context():
    db.create_all()
  </pre>
</section>

<section id="dashboard-html" class="lesson-section" tabindex="-1">
  <h2>templates/dashboard.html</h2>
  <p>HTML template using Jinja2 for backend UI or dashboard.</p>
  <pre>&lt;h1&gt;User Dashboard&lt;/h1&gt;
&lt;ul&gt;
  {% raw %}{% for user in users %}{% endraw %}
    &lt;li&gt;{{ user.username }}&lt;/li&gt;
  {% raw %}{% endfor %}{% endraw %}
&lt;/ul&gt;
  </pre>
</section>

<section id="styles-css" class="lesson-section" tabindex="-1">
  <h2>static/styles.css</h2>
  <p>CSS file for styling frontend views served by Flask.</p>
</section>

<section id="requirements-txt" class="lesson-section" tabindex="-1">
  <h2>requirements.txt</h2>
  <p>Dependency file listing Python packages required for the app.</p>
  <p>Install all dependencies with:</p>
  <pre>pip install -r requirements.txt</pre>
</section>

<script>
  // Smooth scroll to section
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

</body>
</html>
