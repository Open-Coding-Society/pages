# ✅ All Ports Fixed to 8587!

## Changes Made

I've updated **both frontend files** to use port **8587** (Flask backend) instead of port **8585** (Java backend).

### Files Fixed

#### ✅ `post.md` - Updated (5 changes)
- Changed: `import { javaURI, ...` → `import { pythonURI, ...`
- Fixed: `/api/id` → `/api/person/get` (Flask endpoint)
- Fixed: `${javaURI}/api/post` → `${pythonURI}/api/post`
- Fixed: `${javaURI}/api/post/all` → `${pythonURI}/api/post/all`
- Fixed: `${javaURI}/api/post/reply` → `${pythonURI}/api/post/reply`

#### ✅ `feed.md` - Updated (4 changes)
- Changed: `import { javaURI, ...` → `import { pythonURI, ...`
- Fixed: `/api/id` → `/api/person/get` (Flask endpoint)
- Fixed: `${javaURI}/api/post/all` → `${pythonURI}/api/post/all`
- Fixed: `${javaURI}/api/post/reply` → `${pythonURI}/api/post/reply`

---

## Port Configuration Summary

| Setting | Before | After |
|---------|--------|-------|
| **Variable** | `javaURI` | `pythonURI` ✅ |
| **Port (Local)** | 8585 | 8587 ✅ |
| **Backend** | Java/Spring | Flask/Python ✅ |
| **Auth Endpoint** | `/api/id` | `/api/person/get` ✅ |

---

## What Happens Now

### Local Development
```
Frontend:  http://localhost:4500
Backend:   http://localhost:8587  ← Flask backend
```

Your frontend will now:
- ✅ Connect to Flask backend on port 8587
- ✅ Use Python endpoints
- ✅ Send requests to `pythonURI`
- ✅ Authenticate with `/api/person/get`

---

## Next Steps

### 1. Make Sure Your Flask Backend is Running on 8587

```bash
cd ~/flaskbackend
source venv/bin/activate
python main.py
```

You should see:
```
* Running on http://127.0.0.1:8587
```

### 2. Add CORS Support (Important!)

Your Flask backend needs CORS to accept requests from the frontend:

```bash
pip install flask-cors
```

Add to `main.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
```

### 3. Refresh Your Frontend

```bash
# If frontend is running, just refresh browser
# Or restart:
cd ~/pages
make
```

### 4. Test It

1. Go to: `http://localhost:4500/social-media`
2. Open browser console (F12)
3. Should see: `✅ User authenticated - enabling post button`
4. Try creating a post!

---

## Verification Checklist

- [x] ✅ `post.md` uses `pythonURI` (port 8587)
- [x] ✅ `feed.md` uses `pythonURI` (port 8587)
- [x] ✅ Auth endpoint updated to `/api/person/get`
- [x] ✅ All API calls point to Flask backend
- [ ] ⏳ Flask backend running on port 8587
- [ ] ⏳ CORS configured in backend
- [ ] ⏳ Frontend tested and working

---

## Common Issues

### ❌ "CORS policy blocked"
**Fix**: Add Flask-CORS to your backend (see QUICK_CORS_FIX.md)

### ❌ "Failed to fetch"
**Fix**: Make sure backend is running on port 8587

### ❌ "401 Unauthorized"
**Fix**: Login again, check JWT cookies are being sent

### ❌ "404 Not Found"
**Fix**: Make sure you copied the backend files and registered `post_api` blueprint

---

## Files Status

| File | Status | Port |
|------|--------|------|
| `post.md` | ✅ Fixed | 8587 |
| `feed.md` | ✅ Fixed | 8587 |
| Backend model | ✅ Ready | - |
| Backend API | ✅ Ready | - |
| Backend running | ⏳ Check | 8587 |
| CORS configured | ⏳ Check | - |

---

## Quick Test Command

Run this in browser console on your social media page:

```javascript
fetch('http://localhost:8587/api/person/get', {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(data => console.log('✅ Backend working!', data))
  .catch(err => console.error('❌ Backend issue:', err));
```

**Expected**: Should return your user info
**If error**: Check backend is running and CORS is configured

---

## 🎉 All Frontend Files Fixed!

Your frontend is now configured to use:
- ✅ **Port 8587** (Flask backend)
- ✅ **pythonURI** variable
- ✅ **Flask endpoints** (`/api/person/get`)

Now just make sure your Flask backend is:
1. Running on port 8587
2. Has CORS enabled
3. Has the post API registered

Then refresh and test! 🚀

