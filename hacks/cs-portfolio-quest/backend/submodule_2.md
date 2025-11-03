---
layout: cs-portfolio-lesson
title: "Submodule 2"
description: "Submodule 2 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_2/
parent: "Backend Development"
team: "Encrypters"
submodule: 2
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21
---

# Module 2: Databases & APIs 


In this module, you'll learn how **databases store data** and how **APIs transfer data**. APIs and Databases work together for a functional backend.

---

## Understanding Databases

### What is a Database?

A database is an organized collection of data that can be:
- **Stored**: Save information permanently
- **Retrieved**: Get information quickly
- **Updated**: Change information
- **Deleted**: Remove information

Databases are like organized libraries that make finding and managing data efficient.

---

## SQL vs NoSQL Databases

### Quick Comparison

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|------------------|------------------------|
| **Structure** | Tables with fixed columns | Flexible documents/objects |
| **Relationships** | Foreign keys, JOIN operations | Nested documents |
| **Schema** | Must be defined upfront | Can change anytime |
| **Best for** | Complex queries, transactions | Fast reads, flexible data |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Firebase |

### When to Use Each

**Choose SQL when:**
- Data has clear relationships (users have posts, orders have items)
- Data integrity is critical (banking, healthcare)
- Need complex queries (find all users who posted in January AND have >100 followers)

**Choose NoSQL when:**
- Data structure varies (not all records have same fields)
- Need rapid development (structure can change easily)
- Scaling horizontally (millions of users across many servers)

---

## SQL Fundamentals

### Tables, Columns, and Rows

The following example is a representation of how a Database can be used in a social media app:

**Users Table:**
```
+----+----------+-------------------+------------+
| id | username | email             | created_at |
+----+----------+-------------------+------------+
| 1  | alice    | alice@email.com   | 2024-01-15 |
| 2  | bob      | bob@email.com     | 2024-01-20 |
+----+----------+-------------------+------------+
```

**Posts Table:**
```
+----+---------+------------------+-------+------------+
| id | user_id | message          | likes | created_at |
+----+---------+------------------+-------+------------+
| 1  | 1       | Hello world!     | 10    | 2024-01-16 |
| 2  | 2       | Backend is fun   | 15    | 2024-01-21 |
+----+---------+------------------+-------+------------+
```

When working with SQL databases, knowing the following terms will be crucial:
- **Table**: Collection of related data (users, posts)
- **Column**: Specific attribute (email, username)
- **Row**: Single record (one user, one post)
- **Primary Key**: Unique identifier (id column)
- **Foreign Key**: Links tables together (user_id in posts → id in users)

---

### Data Types

**Common SQL Data Types:**
```sql
VARCHAR(50)    → Variable-length text (usernames, emails)
TEXT           → Long text (blog content)
INT            → Whole numbers (age, count)
DECIMAL(10,2)  → Decimal numbers (prices: 199.99)
DATE           → Date only (2024-01-15)
TIMESTAMP      → Date and time (2024-01-15 14:30:00)
BOOLEAN        → True or False (is_active, email_verified)
```

**Creating a Table:**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Relationships Between Tables

**One-to-Many Example:**
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200),
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**What this means:**
- One user can have many posts
- Each post belongs to one user
- `user_id` in posts MUST match an `id` in users
- Protects data integrity!

---

## Understanding APIs

### What is an API?

**API** = Application Programming Interface

A set of rules that lets programs talk to each other.

### Restaurant Analogy
```
You (Frontend)  →  Waiter (API)  →  Chef (Backend)  →  Kitchen (Database)

1. You order a cheeseburger
2. Waiter takes order to chef
3. Chef gets ingredients from kitchen
4. Waiter brings burger back to you
```

**Key Point**: The API is the what allows connection between the  frontend and backend.

---

## RESTful API Design

### What is REST?

REST = **RE**presentational **S**tate **T**ransfer

Rules for creating predictable, scalable APIs:
- URLs represent resources (things like "users" or "posts")
- HTTP methods represent actions (GET, POST, PUT, DELETE)
- Each request is independent (stateless)
- Responses use standard formats (JSON)

### HTTP Methods

| Method | Purpose | Database Operation | Example |
|--------|---------|-------------------|---------|
| **GET** | Retrieve data | SELECT | Get all posts |
| **POST** | Create data | INSERT | Create new post |
| **PUT** | Replace data | UPDATE | Replace entire post |
| **PATCH** | Update partially | UPDATE | Change just title |
| **DELETE** | Remove data | DELETE | Delete post |

**Good URL Design Examples**:
```
GET    /api/users          → Get all users
GET    /api/users/42       → Get user 42
POST   /api/users          → Create new user
PUT    /api/users/42       → Update user 42
DELETE /api/users/42       → Delete user 42
GET    /api/users/42/posts → Get posts by user 42
```


**Tip**: Use nouns (things), not verbs (actions)

---

## HTTP Request/Response Cycle

### Anatomy of a Request
```
POST /api/posts HTTP/1.1
Host: api.myapp.com
Content-Type: application/json
Authorization: Bearer abc123token

{
  "title": "My First Post",
  "content": "Hello world!"
}
```

**Parts:**
- **Method**: POST (creating data)
- **URL**: /api/posts (the resource)
- **Headers**: Metadata (content type, authentication)
- **Body**: The actual data being sent

### Anatomy of a Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "title": "My First Post",
  "content": "Hello world!",
  "created_at": "2024-10-28T10:30:00Z"
}
```

**Parts:**
- **Status Code**: 201 (success - created)
- **Headers**: Metadata about response
- **Body**: The data being returned

---

## A brief overview of Status Codes


| Code | Meaning | When to Use |
|------|---------|-------------|
| **200 OK** | Success | GET, PUT, PATCH worked |
| **201 Created** | Resource created | POST worked |
| **204 No Content** | Success, no data | DELETE worked |
| **400 Bad Request** | Invalid data | Missing required field |
| **401 Unauthorized** | Not logged in | No auth token |
| **403 Forbidden** | Not allowed | User trying to access admin page |
| **404 Not Found** | Doesn't exist | User 999 doesn't exist |
| **500 Internal Server Error** | Server crashed | Bug in code |
| **503 Service Unavailable** | Server down | Maintenance mode |
These status codes may be returned by the terminal/debug or postman, or in whichever medium that is being used to send a request.

---

## CRUD Operations Through APIs

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete

Now we can learn how APIs and Databases work together. In applications, you will create **API endpoints** to perform CRUD operations. 

### CREATE - Adding Data

**API Endpoint:**
```python
@app.route('/api/users', methods=['POST'])
def create_user():
    # Get data from request
    data = request.json
    
    # Create new user (ORM converts to SQL INSERT)
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    
    # Save to database
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201
```

---

### READ - Retrieving Data via API

**Get All Users:**
```python
@app.route('/api/users', methods=['GET'])
def get_users():
    # Query all users (ORM converts to SQL SELECT)
    users = User.query.all()
    
    return jsonify([user.to_dict() for user in users])
```
**Get Specific User:**
```python
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Find user by ID (ORM adds WHERE clause)
    user = User.query.get_or_404(user_id)
    
    return jsonify(user.to_dict())
```

**Filtering with Query Parameters:**
```python
@app.route('/api/posts', methods=['GET'])
def get_posts():
    # Get query parameters
    category = request.args.get('category')
    limit = request.args.get('limit', 20, type=int)
    
    # Build filtered query
    query = Post.query
    
    if category:
        query = query.filter_by(category=category)
    
    # Sort and limit results
    posts = query.order_by(Post.created_at.desc()).limit(limit).all()
    
    return jsonify([post.to_dict() for post in posts])
```

---

### UPDATE - Modifying Data via API

**Update User:**
```python
@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    # Find user
    user = User.query.get_or_404(user_id)
    
    # Get updated data
    data = request.json
    
    # Update only provided fields
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    
    # Save changes (ORM converts to SQL UPDATE)
    db.session.commit()
    
    return jsonify(user.to_dict())
```


**Make sure to specify the user so that you don't update all users.**
```python
# BAD - Updates ALL users!
User.query.update({'username': 'alice'})
db.session.commit()

# GOOD - Only updates specific user
user = User.query.get(user_id)
user.username = 'alice'
db.session.commit()
```

---

### DELETE - Removing Data via API

**Delete User:**
```python
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Find user
    user = User.query.get_or_404(user_id)
    
    # Delete from database (ORM converts to SQL DELETE)
    db.session.delete(user)
    db.session.commit()
    
    # Return empty response with 204 status
    return '', 204
```

**Be cautious not to delete all data:**
```python
# BAD - Deletes ALL users!
User.query.delete()
db.session.commit()

# GOOD - Only deletes specific user
user = User.query.get(user_id)
db.session.delete(user)
db.session.commit()
```

---

### Summary: CRUD in APIs vs Raw SQL

| Operation | API Code (What You Write) | SQL Generated (Behind the Scenes) |
|-----------|--------------------------|-----------------------------------|
| **CREATE** | `db.session.add(user)` | `INSERT INTO users ...` |
| **READ** | `User.query.all()` | `SELECT * FROM users` |
| **READ ONE** | `User.query.get(42)` | `SELECT * FROM users WHERE id = 42` |
| **UPDATE** | `user.email = 'new@email.com'` | `UPDATE users SET email = '...' WHERE id = 42` |
| **DELETE** | `db.session.delete(user)` | `DELETE FROM users WHERE id = 42` |
---

## A review of Databases and APIs working together

### Scenario: User Creates a New Post

**Step 1: Frontend sends request**
```javascript
fetch('https://api.myapp.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abc123'
  },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Hello world!'
  })
})
```

**Step 2: Backend receives request (Flask)**
```python
@app.route('/api/posts', methods=['POST'])
def create_post():
    # 1. Get data from request
    data = request.json
    
    # 2. Validate data
    if not data.get('title'):
        return jsonify({'error': 'Title required'}), 400
    
    # 3. Create database record
    post = Post(
        title=data['title'],
        content=data['content'],
        user_id=get_current_user_id()
    )
    
    # 4. Save to database
    db.session.add(post)
    db.session.commit()
    
    # 5. Return response
    return jsonify({
        'id': post.id,
        'title': post.title,
        'created_at': post.created_at
    }), 201
```

**Step 3: Database stores data**
```sql
-- ORM generates this SQL automatically
INSERT INTO posts (title, content, user_id, created_at)
VALUES ('My Post', 'Hello world!', 5, '2024-10-28 10:30:00');
```

**Step 4: Response sent back**
```json
{
  "id": 42,
  "title": "My Post",
  "created_at": "2024-10-28T10:30:00Z"
}
```

**Step 5: Frontend displays success**
```javascript
.then(response => response.json())
.then(data => {
  console.log('Post created with ID:', data.id);
  alert('Post created successfully!');
})
```
---


## Testing APIs with Postman

### What is Postman?

Postman is a tool for testing APIs without writing frontend code. 

### Using Postman

1. **Create a new request**
2. **Set HTTP method** (GET, POST, etc.)
3. **Enter URL** (http://localhost:5000/api/posts)
4. **Add headers** if needed (Content-Type, Authorization)
5. **Add body** for POST/PUT requests
6. **Click send and view the response**

### Testing Example Scenarios

**Test 1: Create Post (Success)**
```
POST http://localhost:5000/api/posts
Headers: Content-Type: application/json
Body: {"title": "Test", "content": "Hello"}
Expected: 201 Created
```

### Using Environment Variables

Instead of typing `http://localhost:5000` every time:

1. Create environment: "Local Dev"
2. Add variable: `base_url = http://localhost:5000`
3. Use in requests: `{{base_url}}/api/posts`

---

## JSON Format

### What is JSON?

**JSON** = **J**ava**S**cript **O**bject **N**otation

The standard format for API data exchange.

**Example:**
```json
{
  "id": 42,
  "username": "alice",
  "email": "alice@example.com",
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "likes": 10
    },
    {
      "id": 2,
      "title": "Second Post",
      "likes": 5
    }
  ],
  "is_active": true,
  "created_at": "2024-10-28T10:30:00Z"
}
```

**Features of JSON:**
- Human-readable and machine-parseable
- Supports strings, numbers, booleans, arrays, objects, null
- Language-independent (works with Python, Java, JavaScript, etc.)

---

## Key Takeaways

### Databases
- Store data permanently (survives server restarts)  
- SQL uses tables with relationships (foreign keys)  
- CRUD operations: INSERT, SELECT, UPDATE, DELETE  
  -  Always use WHERE in UPDATE/DELETE to avoid disasters  

### APIs
- REST uses HTTP methods (GET, POST, PUT, DELETE) + URLs  
- Status codes communicate success and errors
- JSON is the standard data format  
- Path parameters identify resources, query parameters - filter them  

### Integration
- APIs expose database data to the world  
- Each API endpoint typically maps to database CRUD operations  
- Backend validates requests before touching database  
- ORMs (like SQLAlchemy) convert Python code to SQL automatically  
- Postman helps test APIs without building a frontend  


## Vocab Short Answers — Module 2

Fill the short vocabulary words that match the clues below. Type your answer (letters only) and click Submit. Only your total score will be shown.

<div id="vocab-crossword" style="border:1px solid #e0e0e0;padding:12px;border-radius:6px;max-width:760px;">
  <ol>
    <li>
      <div style="margin-bottom:6px"><strong>1.</strong> A structured collection of rows and columns in a relational database. (5 letters)</div>
      <input name="w0" maxlength="5" style="width:120px;text-transform:uppercase" />
    </li>

    <li>
      <div style="margin-bottom:6px"><strong>2.</strong> One record in a table. (3 letters)</div>
      <input name="w1" maxlength="3" style="width:80px;text-transform:uppercase" />
    </li>

    <li>
      <div style="margin-bottom:6px"><strong>3.</strong> Common format for API request and response bodies. (4 letters)</div>
      <input name="w2" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>

    <li>
      <div style="margin-bottom:6px"><strong>4.</strong> HTTP method used to create new resources via an API. (4 letters)</div>
      <input name="w3" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>

    <li>
      <div style="margin-bottom:6px"><strong>5.</strong> SQL operation that combines rows from two tables based on a related column. (4 letters)</div>
      <input name="w4" maxlength="4" style="width:100px;text-transform:uppercase" />
    </li>
  </ol>

  <div style="margin-top:12px;">
    <button id="vocab-submit">Submit</button>
    <button id="vocab-reset" type="button" style="margin-left:8px">Reset</button>
    <span id="vocab-result" style="margin-left:12px;font-weight:600"></span>
  </div>
</div>

<script>
(() => {
  const answers = ['TABLE','ROW','JSON','POST','JOIN'];
  const submitBtn = document.getElementById('vocab-submit');
  const resetBtn = document.getElementById('vocab-reset');
  const resultSpan = document.getElementById('vocab-result');
  const container = document.getElementById('vocab-crossword');

  function getInputs() { return Array.from(container.querySelectorAll('input')).map(i => i.value.trim().toUpperCase()); }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vals = getInputs();
    let score = 0;
    for (let i = 0; i < answers.length; i++) if (vals[i] === answers[i]) score += 1;
    resultSpan.textContent = `You scored ${score} / ${answers.length}`;
    container.querySelectorAll('input').forEach(i => i.disabled = true);
    submitBtn.disabled = true;
  });

  resetBtn.addEventListener('click', () => {
    container.querySelectorAll('input').forEach(i => { i.value = ''; i.disabled = false; });
    resultSpan.textContent = '';
    submitBtn.disabled = false;
  });
})();
</script>

## Up Next
In the next submodule, you'll learn about different backend frameworks. Keep progressing in order to receive a certificate for completing this module.
