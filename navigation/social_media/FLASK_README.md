# 🎉 Flask Backend for Social Media System

**Python/Flask Backend** for the student social media and grading feedback system.

## 📁 Files Created

In the `navigation/social_media/` directory:

| File | Purpose | Where to Copy |
|------|---------|---------------|
| `model_post.py` | SQLAlchemy Post model | → `{flask-backend}/model/post.py` |
| `api_post.py` | Flask REST API routes | → `{flask-backend}/api/post.py` |
| `init_posts.py` | Database initialization script | → `{flask-backend}/scripts/init_posts.py` |
| `FLASK_BACKEND_SETUP.md` | Complete setup guide | (For reference) |
| `FLASK_README.md` | This file | (For reference) |

## 🚀 Quick Start (5 Steps)

### 1️⃣ Copy Files to Your Flask Backend

```bash
# Example: If your backend is at ~/flaskbackend
cd ~/flaskbackend

# Copy model
cp ~/pages/navigation/social_media/model_post.py model/post.py

# Copy API
cp ~/pages/navigation/social_media/api_post.py api/post.py

# Copy init script
cp ~/pages/navigation/social_media/init_posts.py scripts/init_posts.py
chmod +x scripts/init_posts.py
```

### 2️⃣ Register the API Blueprint

Edit your `main.py` (or wherever you initialize Flask):

```python
# Add this import at the top
from api.post import post_api

# Register the blueprint (where other blueprints are registered)
app.register_blueprint(post_api)
```

### 3️⃣ Initialize the Database

```bash
cd ~/flaskbackend
source venv/bin/activate  # Activate your virtual environment

# Run the initialization script
python scripts/init_posts.py
```

This will:
- Create the `posts` table in your database
- Add sample posts (optional)

### 4️⃣ Start Your Backend

```bash
python main.py
```

Your backend should start on `http://localhost:8887` (or your configured port).

### 5️⃣ Test the Connection

#### Test from Browser Console

1. Login to your frontend: `http://localhost:4100/login`
2. Open browser console (F12)
3. Test the API:

```javascript
// Get all posts
fetch('http://localhost:8887/api/post/all', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log);
```

#### Test Creating a Post

Navigate to: `http://localhost:4100/social-media`

- Login if you haven't already
- Fill out the post form
- Click "Post to Feed"
- Switch to "View Feed" tab to see your post

## 📊 API Endpoints

All endpoints require JWT authentication (except `/api/post/page`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/post` | Create a new post | ✅ Yes |
| GET | `/api/post/all` | Get all posts with replies | ✅ Yes |
| GET | `/api/post/page?url={url}` | Get posts for a page | ❌ No |
| GET | `/api/post/{id}` | Get specific post | ✅ Yes |
| PUT | `/api/post/{id}` | Update your post | ✅ Yes |
| DELETE | `/api/post/{id}` | Delete your post | ✅ Yes |
| POST | `/api/post/reply` | Reply to a post | ✅ Yes |
| GET | `/api/post/user/{id}` | Get user's posts | ✅ Yes |

## 🧪 Testing Examples

### Create a Post

```bash
curl -X POST http://localhost:8887/api/post \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "content": "Just finished the Flask tutorial!",
    "gradeReceived": "A+ (97-100%)",
    "pageUrl": "/hacks/flask",
    "pageTitle": "Flask Tutorial"
  }'
```

### Get All Posts

```bash
curl -X GET http://localhost:8887/api/post/all \
  -H "Cookie: jwt=YOUR_JWT_TOKEN"
```

### Reply to a Post

```bash
curl -X POST http://localhost:8887/api/post/reply \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "parentId": 1,
    "content": "Great work! Keep it up!"
  }'
```

## 🗄️ Database Schema

### Posts Table

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _user_id INTEGER NOT NULL,
    _parent_id INTEGER,
    _content TEXT NOT NULL,
    _grade_received VARCHAR(50),
    _page_url VARCHAR(500),
    _page_title VARCHAR(200),
    _timestamp DATETIME NOT NULL,
    _updated_at DATETIME,
    FOREIGN KEY (_user_id) REFERENCES users(id),
    FOREIGN KEY (_parent_id) REFERENCES posts(id)
);
```

### Relationships

- **User → Post**: One user can have many posts
- **Post → Post**: One post can have many replies (threaded comments)

## 🔧 Troubleshooting

### ❌ "ImportError: No module named 'model.post'"

**Fix:** Make sure you copied `model_post.py` to `model/post.py` in your backend.

### ❌ "Table posts doesn't exist"

**Fix:** Run the initialization script:
```bash
python scripts/init_posts.py
```

### ❌ "401 Unauthorized"

**Fix:** Make sure you're logged in. The JWT cookie needs to be sent with requests.

### ❌ Posts not showing in frontend

**Fixes:**
1. Check browser console for errors
2. Verify backend is running: `curl http://localhost:8887/api/post/all`
3. Check `config.js` has the correct backend URL
4. Make sure you're logged in

### ❌ CORS errors

**Fix:** Make sure your Flask app has CORS enabled:
```python
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=['http://localhost:4100'])
```

## 📦 Dependencies

Make sure these are in your `requirements.txt`:

```txt
Flask>=2.3.0
Flask-SQLAlchemy>=3.0.0
Flask-RESTful>=0.3.10
Flask-CORS>=4.0.0
PyJWT>=2.8.0
```

## 🎯 Integration with Frontend

Your frontend files (`post.md` and `feed.md`) are already configured to work with this backend!

They expect these endpoints:
- ✅ `POST /api/post` - Create posts
- ✅ `GET /api/post/all` - Get all posts
- ✅ `POST /api/post/reply` - Create replies
- ✅ `GET /api/person/get` - Check authentication (already exists)

All you need to do is:
1. Copy the backend files to your Flask repo
2. Register the blueprint
3. Initialize the database
4. Start the server

## 📱 Frontend Pages

The frontend has two main pages:

### `/social-media` (post.md)
- Create new posts
- View posts in a feed
- Reply to posts
- Tabs: "Create Post" and "View Feed"

### `/social-feed` (feed.md)
- Browse all posts from all users
- Filter by student name or content
- Filter by grade
- Real-time updates (auto-refresh every 30s)
- Reply to any post

## 🚀 Deployment

### Local Development
```bash
python main.py
```

### Production (with Gunicorn)
```bash
gunicorn --bind 0.0.0.0:8887 --workers 4 main:app
```

### Docker
```bash
docker-compose up --build
```

## 🎓 How It Works

### Data Flow

```
Student Login → JWT Token Stored in Cookie
       ↓
Student Creates Post → POST /api/post → Database
       ↓
All Students View Feed → GET /api/post/all → Display Posts
       ↓
Student Replies → POST /api/post/reply → Database (linked to parent)
       ↓
Feed Updates → Shows threaded replies
```

### Authentication Flow

1. User logs in via `/api/user/authenticate`
2. Backend sets JWT cookie
3. All subsequent requests include the cookie
4. Backend validates JWT and gets `current_user` from `g.current_user`
5. Posts are created with the authenticated user's ID

## 📚 File Locations

### In Your Pages Repo (Frontend)
```
pages/
├── navigation/social_media/
│   ├── post.md                    # Create post page
│   ├── feed.md                    # Social feed page
│   ├── model_post.py              # Backend model (copy to backend)
│   ├── api_post.py                # Backend API (copy to backend)
│   ├── init_posts.py              # Init script (copy to backend)
│   ├── FLASK_BACKEND_SETUP.md     # Setup guide
│   └── FLASK_README.md            # This file
└── assets/js/api/config.js        # Backend URL configuration
```

### In Your Flask Backend Repo
```
flaskbackend/
├── model/
│   ├── user.py
│   └── post.py                    # ← Copy model_post.py here
├── api/
│   ├── user.py
│   └── post.py                    # ← Copy api_post.py here
├── scripts/
│   └── init_posts.py              # ← Copy init_posts.py here
├── main.py                        # ← Update: register post_api
└── instance/volumes/
    └── flask.db                   # SQLite database
```

## ✅ Features

- ✅ JWT authentication integrated
- ✅ Create posts with optional grades
- ✅ Threaded replies (nested comments)
- ✅ Persistent database storage (SQLite/MySQL)
- ✅ User attribution (posts linked to users)
- ✅ Search and filter posts
- ✅ Real-time feed updates
- ✅ Edit and delete your own posts
- ✅ View posts by page/lesson
- ✅ RESTful API design

## 🎉 Summary

You now have:
1. ✅ Flask backend model for posts (`model/post.py`)
2. ✅ Flask REST API endpoints (`api/post.py`)
3. ✅ Database initialization script (`scripts/init_posts.py`)
4. ✅ Complete setup documentation
5. ✅ Frontend pages ready to use (`post.md`, `feed.md`)
6. ✅ Removed old Java backend files from git

## 📖 Next Steps

1. **Copy files** to your Flask backend repo
2. **Register blueprint** in main.py
3. **Initialize database** with init_posts.py
4. **Start backend** and test
5. **Login** to frontend and create posts
6. **Deploy** to production

Need more help? Check `FLASK_BACKEND_SETUP.md` for detailed instructions!

---

**Happy coding! 🚀**

