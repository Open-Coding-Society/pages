# 🚀 Setup Instructions for Backend

## One-Line Setup (Easiest!)

Copy this script to your backend and run it:

```bash
# Step 1: Copy the setup script to your backend
cp ~/pages/navigation/social_media/setup_backend.sh ~/flaskbackend/

# Step 2: Go to your backend directory
cd ~/flaskbackend

# Step 3: Run the script
bash setup_backend.sh
```

That's it! The script will:
- ✅ Copy all 3 backend files
- ✅ Check your directory structure
- ✅ Verify files are in the right place
- ✅ Tell you what to do next

---

## What the Script Does

The `setup_backend.sh` script will automatically:

1. **Verify** you're in the right directory
2. **Copy** these 3 files:
   - `model_post.py` → `model/post.py`
   - `api_post.py` → `api/post.py`
   - `init_posts.py` → `scripts/init_posts.py`
3. **Check** if `post_api` is registered in `main.py`
4. **Show** you what to do next

---

## After Running the Script

### 1. Update main.py

Add these two lines to your `main.py`:

```python
# Add import at the top
from api.post import post_api

# Add registration where other blueprints are registered
app.register_blueprint(post_api)
```

### 2. Initialize Database

```bash
python scripts/init_posts.py
```

### 3. Start Your Backend

```bash
python main.py
```

### 4. Test It Works

```bash
# Test the API
curl http://localhost:8887/api/post/all

# Or test in browser after logging in:
# http://localhost:4100/social-media
```

---

## Manual Copy (If Script Doesn't Work)

If you prefer to copy manually:

```bash
# From your backend directory
cd ~/flaskbackend

# Copy files one by one
cp ~/pages/navigation/social_media/model_post.py model/post.py
cp ~/pages/navigation/social_media/api_post.py api/post.py
cp ~/pages/navigation/social_media/init_posts.py scripts/init_posts.py

# Make init script executable
chmod +x scripts/init_posts.py
```

---

## Files You Need

**ONLY these 3 files go to your backend:**

| Source File | Destination in Backend |
|-------------|----------------------|
| `model_post.py` | `model/post.py` |
| `api_post.py` | `api/post.py` |
| `init_posts.py` | `scripts/init_posts.py` |

**Everything else stays in your frontend repo!**

---

## Troubleshooting

### Script says "Pages repo not found"

**Fix:** Edit `setup_backend.sh` and update the `PAGES_REPO` path:

```bash
PAGES_REPO="$HOME/pages"  # ← Change this to your pages path
```

### Script says "Not a Flask backend repo"

**Fix:** Make sure you're running the script FROM your backend directory:

```bash
cd ~/flaskbackend  # Go to backend first
bash setup_backend.sh  # Then run
```

### Permission denied

**Fix:** Make the script executable:

```bash
chmod +x setup_backend.sh
./setup_backend.sh
```

---

## Quick Reference

```bash
# Complete setup in 4 commands:
cp ~/pages/navigation/social_media/setup_backend.sh ~/flaskbackend/
cd ~/flaskbackend
bash setup_backend.sh
python scripts/init_posts.py
```

---

## That's It!

Your backend will have all the files it needs, and your frontend stays clean!

🎉 **Backend and Frontend are completely separated!**

