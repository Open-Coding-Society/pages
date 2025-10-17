# 🚀 Flask Backend Setup Guide - Social Media System

## Overview

This guide will help you set up the Python/Flask backend for the social media system. The backend provides REST API endpoints for creating posts, replies, and managing the social feed.

## Architecture

```
Flask Backend
├── model/post.py          # SQLAlchemy database model
├── api/post.py           # REST API endpoints
└── __init__.py           # Flask app initialization
```

## Prerequisites

- Python 3.9+
- Flask backend repository cloned
- Virtual environment activated
- Database configured (SQLite or MySQL)

## Step 1: Copy Backend Files to Flask Backend Repo

You need to copy the Python files from your pages repository to your Flask backend repository.

### Option A: Manual Copy

```bash
# Navigate to your Flask backend directory
cd ~/path/to/your/flask-backend

# Copy the model file
cp ~/pages/navigation/social_media/model_post.py model/post.py

# Copy the API file
cp ~/pages/navigation/social_media/api_post.py api/post.py
```

### Option B: If Your Backend Is in a Separate Repo

```bash
# Example if your backend is at ~/flaskbackend
cp ~/pages/navigation/social_media/model_post.py ~/flaskbackend/model/post.py
cp ~/pages/navigation/social_media/api_post.py ~/flaskbackend/api/post.py
```

## Step 2: Update Flask App Initialization

You need to register the Post API blueprint in your main Flask app.

### Edit `main.py` or `__init__.py`

Add these imports at the top:

```python
from api.post import post_api
```

Register the blueprint (add this where other blueprints are registered):

```python
# Register Post API
app.register_blueprint(post_api)
```

### Example Full Registration Section

```python
# In your main.py or __init__.py
from api.user import user_api
from api.post import post_api  # Add this

# Register blueprints
app.register_blueprint(user_api)
app.register_blueprint(post_api)  # Add this
```

## Step 3: Initialize the Database

The Post model needs to be added to your database schema.

### Option A: Using Flask Shell

```bash
# Activate your virtual environment
source venv/bin/activate  # On Mac/Linux
# or
venv\Scripts\activate  # On Windows

# Open Flask shell
python

# In Python shell:
>>> from __init__ import app, db
>>> from model.post import Post
>>> with app.app_context():
...     db.create_all()
...     print("Posts table created!")
>>> exit()
```

### Option B: Using Initialization Script

Create a file `scripts/init_posts.py`:

```python
#!/usr/bin/env python3
"""Initialize the posts table in the database"""

from __init__ import app, db
from model.post import Post, init_posts

def init():
    """Initialize posts table"""
    with app.app_context():
        # Create tables
        db.create_all()
        print("✅ Posts table created")
        
        # Optionally add sample data
        try:
            init_posts()
            print("✅ Sample posts added")
        except Exception as e:
            print(f"ℹ️  {e}")

if __name__ == '__main__':
    init()
```

Make it executable and run:

```bash
chmod +x scripts/init_posts.py
./scripts/init_posts.py
```

## Step 4: Test the Backend

### Start Your Flask Server

```bash
# Make sure you're in the backend directory with venv activated
python main.py
# or
./main.py
```

Your server should start on `http://localhost:8887` (or your configured port).

### Test with cURL (Authentication Required)

First, you need to login to get a JWT token:

```bash
# Login (replace with your test credentials)
curl -X POST http://localhost:8887/api/user/authenticate \
  -H "Content-Type: application/json" \
  -d '{"uid": "toby", "password": "123Toby!"}'
```

This will return a response with a cookie. Copy the `Set-Cookie` value.

### Test Creating a Post

```bash
curl -X POST http://localhost:8887/api/post \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "content": "This is my first post!",
    "gradeReceived": "A+ (97-100%)",
    "pageUrl": "/hacks/test",
    "pageTitle": "Test Lesson"
  }'
```

### Test Getting All Posts

```bash
curl -X GET http://localhost:8887/api/post/all \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE"
```

### Test Creating a Reply

```bash
curl -X POST http://localhost:8887/api/post/reply \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -d '{
    "parentId": 1,
    "content": "Great post!"
  }'
```

## Step 5: Test with Frontend

### Update Frontend Configuration

Make sure your frontend's `config.js` points to your Flask backend:

```javascript
// In assets/js/api/config.js
export const javaURI = 'http://localhost:8887';  // Your Flask backend URL
```

### Test the Full Flow

1. Start your Flask backend:
   ```bash
   cd ~/flask-backend
   python main.py
   ```

2. Start your Jekyll frontend:
   ```bash
   cd ~/pages
   make
   ```

3. Open browser to `http://localhost:4100`

4. Login with your credentials

5. Navigate to `/social-media` or `/social-feed`

6. Test creating posts and replies

## API Endpoints Reference

### Authentication Required

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/post` | Create a new post |
| GET | `/api/post/all` | Get all posts with replies |
| GET | `/api/post/{id}` | Get a specific post |
| PUT | `/api/post/{id}` | Update your post |
| DELETE | `/api/post/{id}` | Delete your post |
| POST | `/api/post/reply` | Reply to a post |
| GET | `/api/post/user/{id}` | Get posts by user |

### Public (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/post/page?url={url}` | Get posts for a page |

## Troubleshooting

### Error: "No module named 'model.post'"

**Solution:** Make sure you copied `model_post.py` to `model/post.py` in your backend directory.

### Error: "Table 'posts' doesn't exist"

**Solution:** Run the database initialization:
```bash
python scripts/init_posts.py
```

### Error: "401 Unauthorized"

**Solution:** Make sure you're logged in and the JWT cookie is being sent with requests. Check that `fetchOptions` in your frontend includes credentials.

### CORS Issues

**Solution:** Make sure your Flask app has CORS configured:
```python
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=['http://localhost:4100'])
```

### Posts Not Showing Up

**Solutions:**
1. Check browser console for errors
2. Verify backend is running: `http://localhost:8887/api/post/all`
3. Check that you're logged in
4. Verify the API URL in `config.js` is correct

## Database Schema

### Posts Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| _user_id | INTEGER | Foreign key to users table |
| _parent_id | INTEGER | Foreign key to posts (for replies) |
| _content | TEXT | Post content |
| _grade_received | VARCHAR(50) | Grade (optional) |
| _page_url | VARCHAR(500) | Lesson URL (optional) |
| _page_title | VARCHAR(200) | Lesson title (optional) |
| _timestamp | DATETIME | Creation timestamp |
| _updated_at | DATETIME | Last update timestamp |

### Relationships

- **User** → **Post**: One-to-many (user can have many posts)
- **Post** → **Post**: One-to-many (post can have many replies)

## Deployment

### Local Testing
```bash
python main.py
```

### Production Deployment (with Gunicorn)
```bash
gunicorn --bind 0.0.0.0:8887 main:app
```

### Docker Deployment
```bash
docker-compose up --build
```

### AWS EC2 Deployment
See your existing deployment scripts in the backend repo.

## File Structure in Backend Repo

After copying files, your backend should look like:

```
flask-backend/
├── model/
│   ├── __init__.py
│   ├── user.py
│   └── post.py          # ← NEW FILE
├── api/
│   ├── __init__.py
│   ├── user.py
│   └── post.py          # ← NEW FILE
├── scripts/
│   ├── db_init.py
│   └── init_posts.py    # ← OPTIONAL NEW FILE
├── main.py              # ← UPDATE: register post_api
└── requirements.txt
```

## Dependencies

Make sure these are in your `requirements.txt`:

```txt
Flask>=2.3.0
Flask-SQLAlchemy>=3.0.0
Flask-RESTful>=0.3.10
Flask-CORS>=4.0.0
PyJWT>=2.8.0
```

Install with:
```bash
pip install -r requirements.txt
```

## Next Steps

1. ✅ Copy backend files
2. ✅ Register blueprint in main.py
3. ✅ Initialize database
4. ✅ Test API endpoints
5. ✅ Connect frontend
6. 🚀 Deploy to production

## Support

- Check the main README.md for frontend integration
- Review QUICK_START.md for testing checklist
- Examine the frontend JavaScript in post.md and feed.md

---

**You're ready to go!** 🎉

Your Flask backend now supports the social media system with full JWT authentication and database persistence.

