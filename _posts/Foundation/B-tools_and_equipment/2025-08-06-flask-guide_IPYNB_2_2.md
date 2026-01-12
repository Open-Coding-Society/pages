---
toc: True
layout: post
data: flask
title: Flask and Backend UIs
description: A Holistic Overview of Flask and Backend Operations
categories: ['Python Flask']
permalink: /flask-overview
menu: nav/flask.html
author: Risha Guha
breadcrumb: True 
---

# Flask, Postman, and Backend UIs

**Focus of this Blog:** Backend fundamentals + real-world application via a demo project

---

## 1. Why This Lesson Matters

Most modern apps talk to a backend. This is where user data lives, permissions are handled, and logic runs.

Students often focus on frontend or visuals. Teaching backend logic introduces them to the engine under the hood.

Knowing how to build and test APIs will help students build real, connected applications.

---

## 2. Core Concepts

### Flask (Python Web Framework)

Flask helps turn Python code into web-accessible endpoints (APIs).

**Key ideas:**

- `@app.route()` is how you define an endpoint (like a URL)
- HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
- JSON is the main format used to send/receive data

**Example:**

```python
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    # Save to database
    return {'message': 'User created'}, 201
```

---

### Postman (API Testing Tool)

Postman lets you send requests to your API without needing a full frontend.

**Students and teachers should show how to:**

- Send a `POST` request with JSON
- View the response (status codes, error messages)
- Chain requests: e.g., login → get token → access protected route

---

### Backend UI (Internal Tools / Dashboards)

Often used by admins, teachers, or managers to interact with the backend directly.

**Can include:**

- Tables of users
- Buttons to delete/update
- Calendar views, etc.

Helps bridge the gap between “just APIs” and a full application.

---

## 3. Project Demo (Main Activity)

### What We Demo-ed:

A real, running backend system using Flask that supports:

- User registration & login (with optional token auth)
- Calendar API: create, list, delete events
- Issues API: submit and track feedback/issues
- Backend UI: simple dashboard that pulls data from these APIs

### Suggested Tinkering Extensions for Teachers:

**Use Postman to:**

- Register a user
- Log in, get back a token
- Create a calendar event
- Submit an issue

**Switch to the backend UI and show:**

- The user now appears in the dashboard
- Events and issues are visible/editable
- *Optional:* Edit something in the UI and check if it reflects when you query via Postman again

---

## 4. Key Messages to Pass to Your Students

- You don’t always need a frontend to test things; APIs can be tested standalone.
- A well-structured backend separates logic from presentation. It’s clean, scalable, and reusable.
- Backend UIs are very helpful and make your systems usable by real people.

---

## 5. Tips for Teaching Backend Logic

- Start with teaching the logic behind Postman and backend requests
- Let students build one route at a time and test it as they go.
- Encourage debugging with print statements/logs.
- Keep the UI simple (e.g., a table of users, or just a form) to focus on function over form.

---

## 6. Wrap-Up

**Recap:** Flask handles routes and logic, Postman helps test, backend UI makes it usable.

**Provide access to:**

- The Flask codebase
- A ready-to-import Postman collection
- Simple UI templates or examples

**Optional challenge:** Let students extend the backend with one more API (e.g., notes, assignments)

---

## Try It Yourself!

Ready to dive in?

We’ve set up a simple Flask starter repo to help you explore everything you learned in this recap. It includes:

- A working backend with user registration, calendar, and issue APIs
- Sample Postman collection to test endpoints
- A basic backend UI to view and manage data

 **[View the Flask Starter Repo](https://github.com/Open-Coding-Society/flask)**

### How to Get Started

1. **Clone the Repo:**

   ```bash
   git clone https://github.com/Open-Coding-Society/flask.git
   cd flask
   ```

2. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize and Run the Server:**

   ```bash
   python scripts/db_init.py
   python __init__.py
   python main.py
   ```

4. **Test with Postman or Visit the UI:**

   - Try hitting the endpoints or log in to the localhost UI using Postman

### 🙌 Bonus Challenge

Try adding your own API route — maybe for notes, assignments, or anything else! Then use Postman to test it.

---

**Let us know what you build!**

Tag us on GitHub or submit an issue to share your progress and achievements! 