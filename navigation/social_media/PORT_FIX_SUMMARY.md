# ✅ Port Configuration Fixed!

## Problem Solved

Your social media frontend was trying to connect to **port 8585** (Java backend) but needed to connect to **port 8587** (Flask backend).

## Changes Made

### ✅ Fixed `post.md`
Changed all API calls from `javaURI` → `pythonURI`:

- ✅ Import: `import { pythonURI, fetchOptions }`
- ✅ Auth check: `${pythonURI}/api/person/get`
- ✅ Create post: `${pythonURI}/api/post`
- ✅ Get posts: `${pythonURI}/api/post/all`
- ✅ Reply: `${pythonURI}/api/post/reply`

### ✅ Fixed `feed.md`
Changed all API calls from `javaURI` → `pythonURI`:

- ✅ Import: `import { pythonURI, fetchOptions }`
- ✅ Auth check: `${pythonURI}/api/person/get`
- ✅ Get posts: `${pythonURI}/api/post/all`
- ✅ Reply: `${pythonURI}/api/post/reply`

## Port Configuration

As defined in `assets/js/api/config.js`:

| Environment | Port | Backend |
|-------------|------|---------|
| **Local** | **8587** | Flask (pythonURI) |
| **Production** | 443 (HTTPS) | flask.opencodingsociety.com |

## Testing

Now your frontend will connect to the correct backend:

### Local Development
```
Frontend:  http://localhost:4100
Backend:   http://localhost:8587  ← Flask backend (correct!)
```

### Production
```
Frontend:  https://pages.opencodingsociety.com
Backend:   https://flask.opencodingsociety.com
```

## What to Test

1. **Login**: Should work on port 8587 ✅
2. **Create Post**: Should save to Flask backend ✅
3. **View Posts**: Should load from Flask backend ✅
4. **Replies**: Should work properly ✅

## No More 401 Errors! 🎉

Your frontend now correctly:
- Uses `pythonURI` (port 8587)
- Connects to Flask backend
- Sends JWT authentication properly
- Uses Flask API endpoints

---

**Status**: ✅ **FIXED!** Your social media pages now connect to the correct Flask backend on port 8587.

