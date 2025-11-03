---
layout: cs-portfolio-lesson
title: "Submodule 3"
description: "Submodule 3 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_3/
parent: "Backend Development"
team: "Encrypters"
submodule: 3
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21

---

# # Module 3: APIs & HTTP Requests - The Communication Layer

## Welcome to the World of APIs! 🔌

APIs are how different software applications talk to each other. Think of them as waiters in a restaurant - they take your order (request), bring it to the kitchen (backend), and deliver your food (response).

---

## 1. What is an API?

### API = Application Programming Interface

**Simple Definition**: A set of rules that lets one program talk to another

### Real-World Analogies

**Restaurant Analogy**:
```
You (Frontend)  →  Waiter (API)  →  Chef (Backend)  →  Kitchen (Database)

You: "I'd like a cheeseburger"
Waiter: Takes order to chef
Chef: Gets ingredients from kitchen and makes the order
Waiter: Brings burger back to you
You: Enjoy your meal!
```

**Electrical Outlet Analogy**:
```
Your Phone (Frontend)  →  Charging Cable (API)  →  Outlet (Backend)  →  Power Grid (Database)

- You don't need to know how the power grid works
- You just plug in your phone
- The outlet provides a standardized interface
- Any device with the right plug can use it
```

### Why APIs Matter

**Without APIs** ❌:
```
Weather App needs weather data
→ Must directly access weather company's database
→ Need database password
→ Need to know database structure
→ If database changes, app breaks
→ Security nightmare!
```

**With APIs** ✅:
```
Weather App makes request to Weather API
→ GET https://api.weather.com/current?city=NewYork
→ API handles database, security, formatting
→ Returns simple JSON: {"temp": 72, "condition": "sunny"}
→ App displays weather
→ Database can change without breaking app
```

---

## 2. RESTful API Design

### What is REST?

REST = **RE**presentational **S**tate **T**ransfer

A set of rules for creating APIs that are:
- **Predictable**: Follow common patterns everyone understands
- **Scalable**: Can grow to millions of users
- **Stateless**: Each request is independent
- **Resource-based**: URLs represent "things" (resources)

### The Six REST Principles

#### 1. Client-Server Separation

Frontend and backend are separate and independent.
```
Frontend (React/Vue)  ←  HTTP/JSON  →  Backend (Flask/Spring)
     ↓                                        ↓
Can be updated                        Can be updated
independently                         independently
```

#### 2. Stateless

Server doesn't remember previous requests.

**Bad (Stateful)** ❌:
```
Request 1: POST /login (username, password)
           → Server stores: "User 123 is logged in"

Request 2: GET /profile
           → Server remembers: "Oh, this is User 123"
           
Problem: What if server restarts? User forgotten!
```

**Good (Stateless)** ✅:
```
Request 1: POST /login (username, password)
           → Returns: { "token": "abc123xyz" }

Request 2: GET /profile
           Headers: { "Authorization": "Bearer abc123xyz" }
           → Server decodes token: "This is User 123"
           
Benefit: Every request is self-contained!
```

#### 3. Cacheable

Responses should indicate if they can be cached.
```
Request: GET /posts/popular

Response Headers:
Cache-Control: max-age=3600  ← Can cache for 1 hour
ETag: "abc123"               ← Version identifier

Next request (within 1 hour):
→ Browser uses cached version (faster!)
```

#### 4. Uniform Interface

All APIs follow same patterns.

**Resource-Based URLs**:
```
GET    /users          → Collection of users
GET    /users/5        → Specific user
POST   /users          → Create user
PUT    /users/5        → Update user 5
DELETE /users/5        → Delete user 5
```

#### 5. Layered System

Client doesn't know if talking directly to server or through intermediaries.
```
Client  →  Load Balancer  →  API Gateway  →  Backend Server  →  Database

Client only sees: https://api.myapp.com
(Doesn't know about the layers in between)
```

#### 6. Code on Demand (Optional)

Server can send executable code (rarely used in modern REST APIs).
```
Response can include:
- JavaScript to run in browser
- Configuration scripts
- Rarely used in modern REST APIs
```

---

## 3. Designing RESTful URLs

### Resource Naming Conventions

**Rules**:
1. Use **nouns** (things), not verbs (actions)
2. Use **plural** for collections
3. Use **lowercase**
4. Use **hyphens**, not underscores
5. Keep URLs simple and intuitive

**Good Examples** ✅:
```
GET    /users                  → All users
GET    /users/42               → User 42
GET    /users/42/posts         → Posts by user 42
GET    /posts/100/comments     → Comments on post 100
GET    /categories/tech/posts  → Posts in tech category
```

**Bad Examples** ❌:
```
GET    /getAllUsers            → Verb in URL
GET    /user/42                → Singular (should be plural)
GET    /Users/42               → Uppercase
GET    /user_posts/42          → Underscore
GET    /getUserPostsById?id=42 → Verb + complicated
```

### HTTP Methods (The Action)

The URL says **WHAT** (resource), the method says **HOW** (action).

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | GET /posts → View all posts |
| **POST** | Create new resource | POST /posts → Create new post |
| **PUT** | Replace entire resource | PUT /posts/5 → Replace post 5 completely |
| **PATCH** | Update part of resource | PATCH /posts/5 → Update just title of post 5 |
| **DELETE** | Remove resource | DELETE /posts/5 → Delete post 5 |

### Real-World Example: Blog API

**Complete RESTful API Design**:
```
USERS
-----
GET    /api/users              → List all users (with pagination)
POST   /api/users              → Register new user
GET    /api/users/{id}         → Get specific user
PUT    /api/users/{id}         → Update user completely
PATCH  /api/users/{id}         → Update user partially (e.g., just email)
DELETE /api/users/{id}         → Delete user

POSTS
-----
GET    /api/posts              → List all posts
POST   /api/posts              → Create new post
GET    /api/posts/{id}         → Get specific post
PUT    /api/posts/{id}         → Update post
DELETE /api/posts/{id}         → Delete post

RELATIONSHIPS
-------------
GET    /api/users/{id}/posts   → All posts by user
GET    /api/posts/{id}/comments → All comments on post
POST   /api/posts/{id}/comments → Add comment to post
POST   /api/posts/{id}/likes    → Like a post
DELETE /api/posts/{id}/likes    → Unlike a post

SEARCH & FILTERING
------------------
GET    /api/posts?author=alice           → Posts by alice
GET    /api/posts?category=tech          → Posts in tech category
GET    /api/posts?sort=created_at&order=desc → Newest posts first
GET    /api/posts?page=2&limit=10        → Pagination
```

---

## 4. Request Components

### Anatomy of an HTTP Request
```
POST /api/users HTTP/1.1                          ← Method, Path, Protocol
Host: api.myapp.com                               ← Where to send request
Content-Type: application/json                    ← Data format
Authorization: Bearer eyJhbGciOiJI...             ← Authentication
Accept: application/json                          ← Expected response format
User-Agent: Mozilla/5.0                           ← Client info

{                                                 ← Request Body
  "username": "alice",
  "email": "alice@example.com",
  "password": "SecurePass123"
}
```

### 1. HTTP Methods

Already covered (GET, POST, PUT, PATCH, DELETE)

| Method | Purpose | Safe? | Idempotent? |
|--------|---------|-------|-------------|
| GET | Retrieve data | Yes | Yes |
| POST | Create new data | No | No |
| PUT | Replace entire resource | No | Yes |
| PATCH | Update partial resource | No | Yes |
| DELETE | Remove data | No | Yes |

**Safe** = Doesn't modify data (read-only)  
**Idempotent** = Same effect if called once or multiple times

### 2. URL Components
```
https://api.myapp.com:443/api/users/42/posts?sort=date&limit=10#section1

https://          → Protocol (secure)
api.myapp.com     → Domain (hostname)
:443              → Port (default for HTTPS)
/api/users/42/posts → Path (resource)
?sort=date&limit=10 → Query parameters
#section1         → Fragment (rarely used in APIs)
```

### 3. Headers

**Common Request Headers**:
```
Authorization: Bearer abc123token
→ Authentication credentials

Content-Type: application/json
→ Format of data being sent

Accept: application/json
→ Format client wants back

User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
→ Information about client

Accept-Language: en-US,en;q=0.9
→ Preferred language

Cookie: sessionId=abc123; userId=42
→ Client-side stored data

X-API-Key: your-api-key-here
→ Custom API authentication
```

### 4. Path Parameters

Part of the URL path, identify specific resources.
```
GET /api/users/42/posts/100

Path parameters:
- userId: 42
- postId: 100
```

**In Flask**:
```python
@app.route('/api/users/<int:user_id>/posts/<int:post_id>')
def get_user_post(user_id, post_id):
    # user_id = 42
    # post_id = 100
    post = Post.query.filter_by(id=post_id, user_id=user_id).first()
    return jsonify(post.to_dict())
```

### 5. Query Parameters

After the `?`, used for filtering, sorting, pagination.
```
GET /api/posts?category=tech&sort=date&order=desc&page=2&limit=10

Query parameters:
- category: tech
- sort: date
- order: desc
- page: 2
- limit: 10
```

**In Flask**:
```python
@app.route('/api/posts')
def get_posts():
    category = request.args.get('category')  # 'tech'
    sort = request.args.get('sort')          # 'date'
    order = request.args.get('order')        # 'desc'
    page = request.args.get('page', 1)       # 2 (default 1)
    limit = request.args.get('limit', 20)    # 10 (default 20)
    
    # Use these to filter/sort database query
    # ...
```

### 6. Request Body

Data sent to server (only for POST, PUT, PATCH).

**JSON Format** (most common):
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "age": 25,
  "interests": ["coding", "reading"],
  "profile": {
    "bio": "Backend developer",
    "location": "San Francisco"
  }
}
```

**In Flask**:
```python
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json  # Parse JSON body
    
    username = data.get('username')
    email = data.get('email')
    age = data.get('age')
    
    # Validation
    if not username or not email:
        return jsonify({'error': 'Username and email required'}), 400
    
    new_user = User(username=username, email=email, age=age)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201
```

---

## 5. Response Components

### Anatomy of an HTTP Response
```
HTTP/1.1 200 OK                                   ← Protocol, Status Code
Content-Type: application/json                    ← Data format
Cache-Control: max-age=3600                       ← Caching rules
X-RateLimit-Remaining: 99                         ← Custom header

{                                                 ← Response Body
  "id": 42,
  "username": "alice",
  "email": "alice@example.com",
  "created_at": "2024-10-28T10:30:00Z"
}
```

### HTTP Status Codes (Response Messages)

Status codes tell you what happened with your request.

#### 2xx - Success! ✅

| Code | Meaning | When to Use |
|------|---------|-------------|
| **200 OK** | Success | GET, PUT, PATCH successful |
| **201 Created** | Resource created | POST successful |
| **204 No Content** | Success, no data to return | DELETE successful |

**Examples**:
```python
# 200 OK - Retrieved data
@app.route('/api/posts/<int:id>')
def get_post(id):
    post = Post.query.get_or_404(id)
    return jsonify(post.to_dict()), 200

# 201 Created - Created new resource
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    new_post = Post(title=data['title'], content=data['content'])
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_dict()), 201

# 204 No Content - Deleted successfully
@app.route('/api/posts/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return '', 204
```

#### 3xx - Redirect 🔄

| Code | Meaning | When to Use |
|------|---------|-------------|
| **301 Moved Permanently** | Resource moved forever | Old URL → new URL |
| **302 Found** | Resource temporarily moved | Temporary redirect |
| **304 Not Modified** | Cached version is still good | Client has fresh cache |

#### 4xx - Client Error (You Made a Mistake) ❌

| Code | Meaning | When to Use |
|------|---------|-------------|
| **400 Bad Request** | Invalid data | Missing required fields, wrong format |
| **401 Unauthorized** | Not logged in | No auth token provided |
| **403 Forbidden** | Logged in but not allowed | Trying to access admin-only resource |
| **404 Not Found** | Resource doesn't exist | /users/999 where user 999 doesn't exist |
| **409 Conflict** | Resource conflict | Trying to create user with existing email |
| **422 Unprocessable Entity** | Validation failed | Email format invalid, age negative |
| **429 Too Many Requests** | Rate limit exceeded | Too many API calls |

**Examples**:
```python
# 400 Bad Request - Missing required data
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    # ...

# 401 Unauthorized - No token provided
@app.route('/api/profile')
def get_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Authentication required'}), 401
    # ...

# 403 Forbidden - Not allowed to access
@app.route('/api/admin/users')
def admin_users():
    user = get_current_user()
    if not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    # ...

# 404 Not Found - Resource doesn't exist
@app.route('/api/posts/<int:id>')
def get_post(id):
    post = Post.query.get(id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    return jsonify(post.to_dict())
```

#### 5xx - Server Error (We Made a Mistake) 💥

| Code | Meaning | When to Use |
|------|---------|-------------|
| **500 Internal Server Error** | Something broke | Unexpected error in code |
| **502 Bad Gateway** | Bad response from upstream | Microservice communication failed |
| **503 Service Unavailable** | Server down | Maintenance mode, overloaded |

---

## 6. CRUD Operations in Detail

### CREATE - POST Requests

**Creating a New Post**:

**Request**:
```
POST /api/posts
Content-Type: application/json
Authorization: Bearer abc123token

{
  "title": "My First Post",
  "content": "Hello world!",
  "category": "tech"
}
```

**Flask Implementation**:
```python
@app.route('/api/posts', methods=['POST'])
def create_post():
    # 1. Get and validate data
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    title = data.get('title')
    content = data.get('content')
    category = data.get('category')
    
    # 2. Validate required fields
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    # 3. Get authenticated user
    user_id = get_user_from_token(request.headers.get('Authorization'))
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    # 4. Create post
    new_post = Post(
        title=title,
        content=content,
        category=category,
        user_id=user_id
    )
    
    # 5. Save to database
    db.session.add(new_post)
    db.session.commit()
    
    # 6. Return created resource
    return jsonify({
        'id': new_post.id,
        'title': new_post.title,
        'content': new_post.content,
        'category': new_post.category,
        'created_at': new_post.created_at.isoformat()
    }), 201
```

**Response**:
```json
{
  "id": 42,
  "title": "My First Post",
  "content": "Hello world!",
  "category": "tech",
  "created_at": "2024-10-28T10:30:00Z"
}
```

---

### READ - GET Requests

#### Get All Posts (Collection)

**Request**:
```
GET /api/posts?page=1&limit=10&sort=created_at&order=desc
```

**Flask Implementation**:
```python
@app.route('/api/posts', methods=['GET'])
def get_posts():
    # 1. Get query parameters
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    sort_by = request.args.get('sort', 'created_at')
    order = request.args.get('order', 'desc')
    category = request.args.get('category')
    
    # 2. Build query
    query = Post.query
    
    # 3. Apply filters
    if category:
        query = query.filter_by(category=category)
    
    # 4. Apply sorting
    if order == 'desc':
        query = query.order_by(getattr(Post, sort_by).desc())
    else:
        query = query.order_by(getattr(Post, sort_by).asc())
    
    # 5. Paginate
    paginated_posts = query.paginate(page=page, per_page=limit, error_out=False)
    
    # 6. Format response
    return jsonify({
        'posts': [post.to_dict() for post in paginated_posts.items],
        'total': paginated_posts.total,
        'page': page,
        'pages': paginated_posts.pages,
        'has_next': paginated_posts.has_next,
        'has_prev': paginated_posts.has_prev
    }), 200
```

**Response**:
```json
{
  "posts": [
    {
      "id": 42,
      "title": "Post Title",
      "content": "Post content...",
      "author": "alice",
      "created_at": "2024-10-28T10:30:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "pages": 16,
  "has_next": true,
  "has_prev": false
}
```

#### Get Single Post

**Request**:
```
GET /api/posts/42
```

**Flask Implementation**:
```python
@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    # 1. Find post
    post = Post.query.get(post_id)
    
    # 2. Check if exists
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    # 3. Return post data
    return jsonify(post.to_dict()), 200
```

**Response**:
```json
{
  "id": 42,
  "title": "My First Post",
  "content": "Hello world!",
  "author": {
    "id": 5,
    "username": "alice"
  },
  "category": "tech",
  "likes": 15,
  "created_at": "2024-10-28T10:30:00Z",
  "updated_at": "2024-10-28T10:30:00Z"
}
```

---

### UPDATE - PUT vs PATCH

#### PUT - Replace Entire Resource

**Request**:
```
PUT /api/posts/42
Content-Type: application/json
Authorization: Bearer abc123token

{
  "title": "Updated Title",
  "content": "Updated content",
  "category": "programming"
}
```

**Flask Implementation**:
```python
@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post_put(post_id):
    # 1. Get post
    post = Post.query.get_or_404(post_id)
    
    # 2. Check authorization
    user_id = get_user_from_token(request.headers.get('Authorization'))
    if post.user_id != user_id:
        return jsonify({'error': 'Not authorized'}), 403
    
    # 3. Get data
    data = request.json
    
    # 4. Replace ALL fields
    post.title = data.get('title')
    post.content = data.get('content')
    post.category = data.get('category')
    post.updated_at = datetime.utcnow()
    
    # 5. Save
    db.session.commit()
    
    return jsonify(post.to_dict()), 200
```

#### PATCH - Update Partial Resource

**Request**:
```
PATCH /api/posts/42
Content-Type: application/json
Authorization: Bearer abc123token

{
  "title": "Just changing the title"
}
```

**Flask Implementation**:
```python
@app.route('/api/posts/<int:post_id>', methods=['PATCH'])
def update_post_patch(post_id):
    # 1. Get post
    post = Post.query.get_or_404(post_id)
    
    # 2. Check authorization
    user_id = get_user_from_token(request.headers.get('Authorization'))
    if post.user_id != user_id:
        return jsonify({'error': 'Not authorized'}), 403
    
    # 3. Get data
    data = request.json
    
    # 4. Update ONLY provided fields
    if 'title' in data:
        post.title = data['title']
    if 'content' in data:
        post.content = data['content']
    if 'category' in data:
        post.category = data['category']
    
    post.updated_at = datetime.utcnow()
    
    # 5. Save
    db.session.commit()
    
    return jsonify(post.to_dict()), 200
```

---

### DELETE - Remove Resource

**Request**:
```
DELETE /api/posts/42
Authorization: Bearer abc123token
```

**Flask Implementation**:
```python
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    # 1. Get post
    post = Post.query.get_or_404(post_id)
    
    # 2. Check authorization
    user_id = get_user_from_token(request.headers.get('Authorization'))
    if post.user_id != user_id:
        return jsonify({'error': 'Not authorized'}), 403
    
    # 3. Delete
    db.session.delete(post)
    db.session.commit()
    
    # 4. Return success (no content)
    return '', 204
```

**Response**:
```
HTTP/1.1 204 No Content
```

---

## 7. Testing APIs with Postman

### What is Postman?

**Postman** is a tool for testing APIs without writing frontend code. Think of it as a "browser for APIs".

### Getting Started with Postman

1. **Download**: Get Postman from [postman.com](https://www.postman.com/)
2. **Create Account**: Sign up (free)
3. **Create Workspace**: Your project area

### Creating Your First Request

#### Step 1: Set Up a GET Request

**Testing: Get All Posts**

1. Click "New" → "HTTP Request"
2. Set method to `GET`
3. Enter URL: `http://localhost:5000/api/posts`
4. Click "Send"

**Expected Response**:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "content": "Content here..."
    }
  ],
  "total": 1,
  "page": 1
}
```

#### Step 2: Set Up a POST Request

**Testing: Create New Post**

1. Method: `POST`
2. URL: `http://localhost:5000/api/posts`
3. Click "Headers" tab
   - Key: `Content-Type`
   - Value: `application/json`
4. Click "Body" tab
   - Select "raw"
   - Select "JSON" from dropdown
   - Enter:
```json
   {
     "title": "Test Post",
     "content": "This is a test",
     "category": "tech"
   }
```
5. Click "Send"

**Expected Response**:
```json
{
  "id": 42,
  "title": "Test Post",
  "content": "This is a test",
  "category": "tech",
  "created_at": "2024-10-28T10:30:00Z"
}
```

Status: `201 Created`

#### Step 3: Adding Authentication

**Testing: Authenticated Requests**

1. Click "Headers" tab
2. Add header:
   - Key: `Authorization`
   - Value: `Bearer your_token_here`
3. Click "Send"

---

### Using Environment Variables in Postman

Instead of typing `http://localhost:5000` every time, use variables:

1. Click gear icon (top right) → "Manage Environments"
2. Click "Add"
3. Name: "Local Development"
4. Add variable:
   - Variable: `base_url`
   - Initial Value: `http://localhost:5000`
   - Current Value: `http://localhost:5000`
5. Click "Add"
6. Select "Local Development" from dropdown

Now in requests, use: `{{base_url}}/api/posts`

---

### Creating a Postman Collection

**Collection** = Group of related requests

1. Click "New" → "Collection"
2. Name: "Blog API"
3. Add requests:
```
Blog API (Collection)
│
├── Users
│   ├── Register User (POST /api/users)
│   ├── Login (POST /api/login)
│   └── Get Profile (GET /api/profile)
│
├── Posts
│   ├── Get All Posts (GET /api/posts)
│   ├── Get Single Post (GET /api/posts/:id)
│   ├── Create Post (POST /api/posts)
│   ├── Update Post (PUT /api/posts/:id)
│   └── Delete Post (DELETE /api/posts/:id)
│
└── Comments
    ├── Get Comments (GET /api/posts/:id/comments)
    └── Add Comment (POST /api/posts/:id/comments)
```

---

### Testing Different Scenarios

#### Test 1: Successful Creation
```
POST /api/posts
Body: {"title": "Test", "content": "Content"}
Expected: 201 Created
```

#### Test 2: Missing Required Field
```
POST /api/posts
Body: {"content": "Content"}  // No title
Expected: 400 Bad Request
```

#### Test 3: Unauthorized Access
```
POST /api/posts
Headers: (no Authorization header)
Body: {"title": "Test", "content": "Content"}
Expected: 401 Unauthorized
```

#### Test 4: Not Found
```
GET /api/posts/9999
Expected: 404 Not Found
```

#### Test 5: Update Own Post
```
PATCH /api/posts/42
Headers: Authorization: Bearer valid_token
Body: {"title": "Updated"}
Expected: 200 OK
```

#### Test 6: Update Someone Else's Post
```
PATCH /api/posts/42
Headers: Authorization: Bearer different_user_token
Body: {"title": "Updated"}
Expected: 403 Forbidden
```

---

## 8. Complete Example: Full API Flow

### Scenario: User Creates a Post

**Step 1: User Action (Frontend)**
```javascript
// User clicks "Post" button
fetch('https://myapp.com/api/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer abc123token'
    },
    body: JSON.stringify({
        title: 'My First Post',
        content: 'Hello world!'
    })
})
```

**Step 2: Backend Receives Request (Flask)**
```python
@app.route('/api/posts', methods=['POST'])
def create_post():
    # Get data from request
    data = request.json
    title = data.get('title')
    content = data.get('content')
    
    # Get user from token
    user_id = get_user_from_token(request.headers.get('Authorization'))
    
    # Create post in database
    new_post = Post(
        title=title,
        content=content,
        user_id=user_id
    )
    db.session.add(new_post)
    db.session.commit()
    
    # Send response
    return jsonify({
        'id': new_post.id,
        'title': new_post.title,
        'created_at': new_post.created_at
    }), 201
```

**Step 3: Database Operation (SQL Generated by ORM)**
```sql
INSERT INTO posts (title, content, user_id, created_at)
VALUES ('My First Post', 'Hello world!', 5, '2024-10-28 10:30:00');
```

**Step 4: Response Sent Back to Frontend**
```json
{
    "id": 42,
    "title": "My First Post",
    "created_at": "2
}
```

