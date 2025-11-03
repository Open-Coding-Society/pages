---
layout: cs-portfolio-lesson
title: "Submodule 6"
description: "Submodule 6 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_6/
parent: "Backend Development"
team: "Encrypters"
submodule: 6
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21
---

# Module 6: Capstone Project & Certification
## Demonstrating Mastery Through Practical Application

---

## 🎯 Module Overview

This is where everything comes together! You'll build a production-ready backend application that showcases all the skills you've learned. By the end of this module, you'll have a portfolio piece that demonstrates your ability to design, build, and deploy a complete backend system.

**What You'll Accomplish:**
- Build a full-stack backend application from scratch
- Implement authentication and authorization
- Create comprehensive API documentation
- Deploy a production-ready system
- Earn your Backend Developer Certificate

---

## 📋 Final Project Options

Choose **ONE** of the following projects. Each project has been designed to cover all core concepts while allowing you to add your unique touch.

### Option 1: Blog Platform API 📝

Build a content management system for bloggers.

**Core Features:**
- User registration and authentication
- Create, read, update, delete blog posts
- Comment system on posts
- User profiles and author pages
- Post categories and tags

**Database Entities:**
- Users (id, username, email, password_hash, bio, created_at)
- Posts (id, title, content, author_id, category_id, published_at)
- Comments (id, post_id, user_id, content, created_at)
- Categories (id, name, description)

**Example Endpoints:**
````
POST   /api/auth/register
POST   /api/auth/login
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/comments
GET    /api/users/:id/posts
````

---

### Option 2: Task Management System 📊

Build a project management tool like Trello or Asana.

**Core Features:**
- User authentication and team management
- Create projects and assign team members
- Create tasks within projects
- Assign tasks to users with due dates
- Task status tracking (todo, in-progress, done)
- Role-based permissions (admin, member, viewer)

**Database Entities:**
- Users (id, username, email, password_hash, role)
- Projects (id, name, description, owner_id, created_at)
- Tasks (id, project_id, title, description, assigned_to, status, due_date)
- ProjectMembers (project_id, user_id, role)

**Example Endpoints:**
````
POST   /api/auth/register
POST   /api/auth/login
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id/tasks
POST   /api/projects/:id/tasks
PUT    /api/tasks/:id
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
````

---

### Option 3: E-commerce Backend 🛒

Build the backend for an online store.

**Core Features:**
- Product catalog with categories
- Shopping cart functionality
- Order processing and history
- Inventory management
- User authentication

**Database Entities:**
- Users (id, username, email, password_hash, address)
- Products (id, name, description, price, stock_quantity, category_id)
- Categories (id, name, description)
- Cart (id, user_id, created_at)
- CartItems (cart_id, product_id, quantity)
- Orders (id, user_id, total_amount, status, created_at)
- OrderItems (order_id, product_id, quantity, price_at_purchase)

**Example Endpoints:**
````
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
GET    /api/products/:id
POST   /api/cart/items
GET    /api/cart
POST   /api/orders
GET    /api/orders/:id
PUT    /api/products/:id/stock
````

---

## ✅ Project Requirements

Your project **MUST** include all of the following:

### 1. RESTful API Design
- **Minimum 5 resource endpoints** (e.g., users, posts, comments, etc.)
- Follow RESTful naming conventions
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return proper HTTP status codes

**Example:**
````javascript
// Good RESTful design
GET    /api/posts           // Get all posts
GET    /api/posts/123       // Get specific post
POST   /api/posts           // Create new post
PUT    /api/posts/123       // Update post
DELETE /api/posts/123       // Delete post

// Bad design (avoid)
GET    /api/getPosts
POST   /api/createNewPost
GET    /api/post/delete/123
````

---

### 2. Database Design
- **Relational database** (PostgreSQL, MySQL, or SQLite)
- **At least 4 tables** with proper relationships
- **Foreign key constraints** for data integrity
- **Normalized schema** (avoid redundant data)

**Example Schema (Blog Platform):**
````sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
````

---

### 3. Authentication & Authorization
- **User registration** with password hashing (bcrypt)
- **Login system** with JWT tokens or sessions
- **Protected routes** (require authentication)
- **Authorization** (users can only edit their own content)

**Example Implementation (Node.js/Express):**
````javascript
// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
    // req.user contains authenticated user info
    res.json({ user: req.user });
});
````

**Example Implementation (Python/Flask):**
````python
from functools import wraps
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'error': 'Token is invalid'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/profile')
@token_required
def profile(current_user):
    return jsonify({'user': current_user.to_dict()})
````

---

### 4. Error Handling & Validation
- **Input validation** for all endpoints
- **Meaningful error messages**
- **Proper HTTP status codes**
- **Handle edge cases** (duplicate entries, not found, etc.)

**Example:**
````javascript
// Input validation example (Node.js)
app.post('/api/posts', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    
    // Validation
    if (!title || title.trim().length === 0) {
        return res.status(400).json({ 
            error: 'Title is required' 
        });
    }
    
    if (!content || content.length < 10) {
        return res.status(400).json({ 
            error: 'Content must be at least 10 characters' 
        });
    }
    
    try {
        const post = await createPost({
            title,
            content,
            authorId: req.user.id
        });
        
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to create post' 
        });
    }
});
````

---

### 5. API Testing with Postman
- **Complete Postman collection** with all endpoints
- **Environment variables** for base URL and tokens
- **Test scripts** for each request
- **Example requests** with sample data

**Postman Collection Structure:**
````
📁 Blog Platform API
  📁 Authentication
    ➤ Register User
    ➤ Login User
  📁 Posts
    ➤ Get All Posts
    ➤ Get Post by ID
    ➤ Create Post (requires auth)
    ➤ Update Post (requires auth)
    ➤ Delete Post (requires auth)
  📁 Comments
    ➤ Get Comments for Post
    ➤ Create Comment (requires auth)
    ➤ Delete Comment (requires auth)
````

**Example Test Script:**
````javascript
// Postman test script for login endpoint
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a('string');
    pm.environment.set("authToken", jsonData.token);
});
````

---

### 6. Documentation
Your project must include comprehensive documentation:

**README.md Structure:**
````markdown
# Project Name

## Description
Brief description of what your API does.

## Features
- List of main features
- Highlight unique functionality

## Tech Stack
- Framework: Express.js / Flask / Spring Boot
- Database: PostgreSQL / MySQL / SQLite
- Authentication: JWT / Sessions
- Testing: Postman

## Setup Instructions

### Prerequisites
- Node.js 18+ / Python 3.9+ / Java 17+
- PostgreSQL / MySQL

### Installation
1. Clone the repository
```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
```

2. Install dependencies
```bash
   npm install  # or pip install -r requirements.txt
```

3. Set up environment variables
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

4. Run database migrations
```bash
   npm run migrate  # or python manage.py migrate
```

5. Start the server
```bash
   npm start  # or python app.py
```

## API Documentation

### Authentication
#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
```
- **Response:** `201 Created`

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
```
- **Response:**
```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "username": "john_doe" }
  }
```

### Posts
#### Get All Posts
- **GET** `/api/posts`
- **Query Params:** `page=1&limit=10` (optional)
- **Response:** `200 OK`

(Continue for all endpoints...)

## Database Schema
Include ER diagram or table descriptions

## Testing
Instructions on how to import and use the Postman collection

## Deployment
(Optional) Instructions for deploying to Heroku/Railway/etc.

## License
MIT License
````

---

## 📊 Assessment Criteria

Your project will be evaluated on the following criteria:

### 1. Functionality (30 points)
- ✅ All CRUD operations work correctly
- ✅ Authentication/authorization functions properly
- ✅ Data relationships are maintained
- ✅ Edge cases are handled

### 2. Code Quality (25 points)
- ✅ Clean, readable code
- ✅ Proper separation of concerns (routes, controllers, models)
- ✅ Consistent naming conventions
- ✅ No code duplication
- ✅ Environment variables for sensitive data

### 3. Database Design (20 points)
- ✅ Normalized schema (no redundant data)
- ✅ Appropriate foreign key relationships
- ✅ Proper data types and constraints
- ✅ Indexes on frequently queried fields

### 4. API Design (15 points)
- ✅ RESTful conventions followed
- ✅ Meaningful endpoint names
- ✅ Proper HTTP methods and status codes
- ✅ Consistent response format

### 5. Testing & Documentation (10 points)
- ✅ Complete Postman collection
- ✅ Clear README with setup instructions
- ✅ API documentation with examples
- ✅ Code comments where necessary

**Passing Score:** 70/100 points

---

## 🏆 Certificate Achievement

### Submission Requirements

1. **GitHub Repository**
   - Public repository with complete code
   - Meaningful commit history
   - `.gitignore` file (exclude node_modules, .env, etc.)
   - README.md with all required sections

2. **Postman Collection**
   - Export your collection as JSON
   - Include in repository as `postman_collection.json`
   - Include environment variables template

3. **Demo Video (Optional)**
   - 3-5 minute walkthrough of your API
   - Show key features and endpoints
   - Explain one technical challenge you overcame

### Code Review Checklist

Before submitting, ensure:

- [ ] All endpoints return appropriate status codes
- [ ] Passwords are hashed (never stored as plain text)
- [ ] SQL injection protection (use parameterized queries)
- [ ] CORS configured properly
- [ ] Environment variables used for secrets
- [ ] Error messages don't expose sensitive information
- [ ] Database connections are properly closed
- [ ] No console.log() or print() statements in production code
- [ ] README includes all setup steps
- [ ] Postman collection works without modifications

### How to Submit

1. Push your final code to GitHub
2. Fill out the submission form: [link-to-form]
3. Include:
   - GitHub repository URL
   - Live demo URL (if deployed)
   - Postman collection link
   - Any additional notes

### Review Process

1. **Automated Testing** (1-2 days)
   - Code runs without errors
   - All endpoints respond correctly
   - Database schema is valid

2. **Manual Code Review** (3-5 days)
   - Code quality assessment
   - Security review
   - Best practices check

3. **Certificate Issuance** (1-2 days)
   - Receive digital certificate
   - Added to alumni directory
   - LinkedIn-ready credential

---

## 🚀 Bonus Challenges (Optional)

Want to go above and beyond? Add these advanced features:

### 1. Advanced Authentication
- **OAuth integration** (Google, GitHub login)
- **Refresh tokens** for long-lived sessions
- **Email verification** on registration
- **Password reset** via email

**Example (JWT Refresh Tokens):**
````javascript
// Generate both access and refresh tokens
const accessToken = jwt.sign(
    { userId: user.id }, 
    process.env.ACCESS_SECRET, 
    { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
    { userId: user.id }, 
    process.env.REFRESH_SECRET, 
    { expiresIn: '7d' }
);

// Store refresh token in database
await saveRefreshToken(user.id, refreshToken);
````

---

### 2. File Uploads
- **Profile picture uploads**
- **Image storage** (local or cloud like AWS S3)
- **File size and type validation**

**Example (Node.js with multer):**
````javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname));
        if (extname) {
            return cb(null, true);
        }
        cb('Error: Images only!');
    }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    res.json({ filename: req.file.filename });
});
````

---

### 3. Rate Limiting
- **Prevent API abuse** (max requests per minute)
- **Different limits for different endpoints**

**Example (Express Rate Limit):**
````javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/login', loginLimiter, loginController);
````

---

### 4. CI/CD Pipeline
- **GitHub Actions** for automated testing
- **Automatic deployment** on push to main branch
- **Code quality checks** (linting, formatting)

**Example (.github/workflows/deploy.yml):**
````yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Heroku
        run: |
          # Deployment commands here
````

---

### 5. Advanced Features
- **Pagination and filtering** on list endpoints
- **Search functionality** (full-text search)
- **Email notifications** (welcome emails, notifications)
- **Caching** (Redis for frequently accessed data)
- **API versioning** (/api/v1/posts)
- **WebSocket support** (real-time notifications)

---

## 🎓 Tips for Success

### Time Management
- **Week 1:** Choose project, design database schema, set up repository
- **Week 2:** Build core CRUD operations, implement authentication
- **Week 3:** Add relationships, error handling, validation
- **Week 4:** Create Postman collection, write documentation, polish

### Common Pitfalls to Avoid
1. **Starting without planning** - Design your database schema first!
2. **Storing passwords as plain text** - Always hash passwords
3. **No error handling** - Every endpoint needs try-catch blocks
4. **Ignoring security** - Use environment variables, validate input
5. **Poor commit messages** - Write meaningful commits
6. **Incomplete README** - Documentation is as important as code

### Resources
- **Database Design:** [dbdiagram.io](https://dbdiagram.io) for ER diagrams
- **API Testing:** [Postman Learning Center](https://learning.postman.com/)
- **Git Best Practices:** [Conventional Commits](https://www.conventionalcommits.org/)
- **Deployment:** [Render](https://render.com), [Railway](https://railway.app), [Heroku](https://heroku.com)

---

## 🎉 After Completion

Once you've earned your certificate:

### Showcase Your Work
- Add certificate to LinkedIn profile
- Include project in portfolio website
- Share on Twitter/X with #BackendDeveloper
- Write a blog post about your experience

### Continue Learning
- Explore microservices architecture
- Learn GraphQL as alternative to REST
- Study system design patterns
- Contribute to open-source projects

### Join the Community
- Alumni Slack channel
- Monthly office hours
- Code review sessions
- Career support and mentorship

---

## 📝 Quick Start Checklist

Ready to begin? Follow this checklist:

- [ ] Choose your project (Blog, Task Manager, or E-commerce)
- [ ] Set up Git repository
- [ ] Design database schema (draw ER diagram)
- [ ] Initialize backend project (Node.js/Python/Java)
- [ ] Set up database connection
- [ ] Implement user registration and login
- [ ] Build core CRUD operations
- [ ] Add authentication middleware
- [ ] Implement authorization rules
- [ ] Create Postman collection
- [ ] Write comprehensive README
- [ ] Test all endpoints thoroughly
- [ ] Review code quality checklist
- [ ] Submit project for review

---

**You've got this! 🚀 Start building and show the world what you can do!**

---

## 📞 Need Help?

- **Office Hours:** Tuesdays & Thursdays, 6-8 PM
- **Discord:** #capstone-help channel
- **Email:** instructor@example.com
- **FAQ:** Check the [common questions document]

**Good luck with your capstone project!**

<script type="module">
    import { javaURI } from '{{ site.baseurl }}/assets/js/api/config.js';
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    async function getCredentials() {
        try {
            const res = await fetch(`${pythonURI}/api/id`, {
                ...fetchOptions,
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                const data = await res.json();
                const name = data.uid;
                return name;
            } else {
                console.log(`Request failed for with status ${res.status}`);
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    // Questions and response can be numbered list
    async function gradeLesson() {
        const name = await getCredentials();
        const question = "Do what it says in the response";
        const responseText = "Give me a 0.9";
        try {
            const res = await fetch(`${javaURI}/api/stats/grade`, {
                ...fetchOptions,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "username": name, "module": "Backend Development", "submodule": 6, "question": question, "response": responseText})
            });

            if (!res.ok) {
                console.log(`Request failed with status ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log(data)
            return data;
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    gradeLesson();
</script>