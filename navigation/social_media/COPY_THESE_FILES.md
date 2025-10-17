# 📋 Copy These Files to Your Flask Backend

## Quick Reference: What to Copy Where

You need to copy **3 files** from this directory to your Flask backend repository.

## 🔄 File Mapping

| Source (in pages repo) | Destination (in flask backend) |
|------------------------|-------------------------------|
| `model_post.py` | `model/post.py` |
| `api_post.py` | `api/post.py` |
| `init_posts.py` | `scripts/init_posts.py` |

## 📝 Copy Commands

### If your Flask backend is at `~/flaskbackend`:

```bash
# Navigate to your backend
cd ~/flaskbackend

# Copy the model
cp ~/pages/navigation/social_media/model_post.py model/post.py

# Copy the API
cp ~/pages/navigation/social_media/api_post.py api/post.py

# Copy the init script
cp ~/pages/navigation/social_media/init_posts.py scripts/init_posts.py

# Make init script executable
chmod +x scripts/init_posts.py

echo "✅ Files copied successfully!"
```

### If your backend is somewhere else:

Replace `~/flaskbackend` with your actual backend path:

```bash
BACKEND_PATH="~/path/to/your/backend"  # Change this!

cp ~/pages/navigation/social_media/model_post.py $BACKEND_PATH/model/post.py
cp ~/pages/navigation/social_media/api_post.py $BACKEND_PATH/api/post.py
cp ~/pages/navigation/social_media/init_posts.py $BACKEND_PATH/scripts/init_posts.py
chmod +x $BACKEND_PATH/scripts/init_posts.py
```

## ⚙️ After Copying: Update main.py

Edit your backend's `main.py` file and add:

```python
# At the top with other imports
from api.post import post_api

# Where you register blueprints (near app.register_blueprint calls)
app.register_blueprint(post_api)
```

## 🗄️ Initialize Database

```bash
cd ~/flaskbackend  # or your backend path
source venv/bin/activate
python scripts/init_posts.py
```

## ✅ Verification Checklist

After copying:

- [ ] File exists: `model/post.py`
- [ ] File exists: `api/post.py`
- [ ] File exists: `scripts/init_posts.py`
- [ ] Updated: `main.py` imports `post_api`
- [ ] Updated: `main.py` registers `post_api` blueprint
- [ ] Ran: `python scripts/init_posts.py`
- [ ] Backend starts without errors: `python main.py`
- [ ] Can access: `http://localhost:8887/api/post/all`

## 🚀 Full Setup Script

Copy and run this entire script:

```bash
#!/bin/bash

# Configuration - UPDATE THIS PATH!
BACKEND_PATH=~/flaskbackend  # ← Change to your backend path
PAGES_PATH=~/pages           # ← Change if needed

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Flask Social Media Backend${NC}\n"

# Step 1: Copy files
echo -e "${BLUE}📁 Copying backend files...${NC}"
cp $PAGES_PATH/navigation/social_media/model_post.py $BACKEND_PATH/model/post.py
cp $PAGES_PATH/navigation/social_media/api_post.py $BACKEND_PATH/api/post.py
cp $PAGES_PATH/navigation/social_media/init_posts.py $BACKEND_PATH/scripts/init_posts.py
chmod +x $BACKEND_PATH/scripts/init_posts.py

echo -e "${GREEN}✅ Files copied${NC}\n"

# Step 2: Check if blueprint is registered
echo -e "${BLUE}🔍 Checking main.py...${NC}"
if grep -q "from api.post import post_api" $BACKEND_PATH/main.py; then
    echo -e "${GREEN}✅ Blueprint import found${NC}"
else
    echo -e "${RED}⚠️  Need to add: from api.post import post_api${NC}"
fi

if grep -q "register_blueprint(post_api)" $BACKEND_PATH/main.py; then
    echo -e "${GREEN}✅ Blueprint registration found${NC}"
else
    echo -e "${RED}⚠️  Need to add: app.register_blueprint(post_api)${NC}"
fi

echo ""

# Step 3: Initialize database
echo -e "${BLUE}🗄️  Initializing database...${NC}"
cd $BACKEND_PATH
source venv/bin/activate
python scripts/init_posts.py

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Update main.py if needed (check warnings above)"
echo "  2. Start backend: python main.py"
echo "  3. Test: curl http://localhost:8887/api/post/all"
```

Save as `setup_backend.sh`, make executable, and run:

```bash
chmod +x setup_backend.sh
./setup_backend.sh
```

## 📞 Need Help?

- Read: `FLASK_README.md` - Overview and features
- Read: `FLASK_BACKEND_SETUP.md` - Detailed setup guide
- Check: Browser console for frontend errors
- Test: `curl http://localhost:8887/api/post/all` for backend

---

**That's it!** Copy the 3 files, update main.py, and initialize the database. 🎉

