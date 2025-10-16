# 🚀 Quick Start Guide - Social Media System

## What Was Created

I've built a complete backend-connected social media and grading feedback system for your Nighthawk Coders website!

### ✅ Backend Files (Java Spring Boot)
Located in `/Users/akshay/pages/navigation/social_media/`:
1. **BACKEND_Post.java** - Database model for posts and comments
2. **BACKEND_PostJpaRepository.java** - Database access layer
3. **BACKEND_PostApiController.java** - REST API endpoints
4. **BACKEND_SETUP_INSTRUCTIONS.md** - Detailed backend setup guide

### ✅ Frontend Files  
1. **grading-feedback-backend.html** - Backend-connected feedback form for lesson pages
2. **feed.md** - Full social media feed page showing all posts from all users
3. **README.md** - Complete documentation
4. **QUICK_START.md** - This file!

## How It Works

### When a User Logs In:
1. JWT authentication connects them to the backend
2. Their name is auto-filled in submission forms
3. They can submit grade feedback on any lesson
4. They can reply to anyone's posts with threaded comments
5. They can view a social media feed of ALL student submissions

### Data Flow:
```
Student logs in → JWT token stored in cookie
                ↓
Student submits feedback → POST /api/post → MySQL database
                ↓
All students can see posts → GET /api/post/all → Display in feed
                ↓
Students reply → POST /api/post/reply → Nested under parent post
```

## Next Steps to Get It Working

### Step 1: Copy Backend Files to Your Backend Repo

```bash
# Navigate to your backend repository
cd ~/vscode/pagesBackend

# Create the post package directory
mkdir -p src/main/java/com/nighthawk/spring_portfolio/mvc/post

# Copy the 3 Java files
cp ~/vscode/pages/navigation/social_media/BACKEND_Post.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java

cp ~/vscode/pages/navigation/social_media/BACKEND_PostJpaRepository.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java

cp ~/vscode/pages/navigation/social_media/BACKEND_PostApiController.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java
```

### Step 2: Run the Backend

```bash
cd ~/vscode/pagesBackend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8585` and automatically create the `posts` table in your database.

### Step 3: Test Locally

1. **Start your frontend:**
   ```bash
   cd ~/vscode/pages
   make
   ```

2. **Login:**
   - Go to http://127.0.0.1:4100/login
   - Login with your test account (e.g., toby@gmail.com / 123Toby!)

3. **Test on a lesson page:**
   - Navigate to any lesson that has the feedback form
   - For example: http://127.0.0.1:4100/hacks/pong/2025-09-03-P0lesson
   - Scroll to the bottom and submit feedback
   - Reply to your post

4. **View the social feed:**
   - Go to http://127.0.0.1:4100/social-feed
   - You should see all posts from all users
   - Search and filter posts
   - Reply to posts

### Step 4: Update a Lesson Page to Use Backend Version

Open any lesson file (e.g., `/hacks/pong/2025-09-03-P0lesson.md`) and replace:

```liquid
{%- include grading-feedback.html -%}
```

With:

```liquid
{%- include grading-feedback-backend.html -%}
```

### Step 5: Deploy to Production

#### Deploy Backend:
```bash
cd ~/vscode/pagesBackend
git add .
git commit -m "Add social media post API"
git push origin master
```

Your backend will automatically deploy to https://spring.opencodingsociety.com/

#### Deploy Frontend:
```bash
cd ~/vscode/pages
git add .
git commit -m "Add backend-connected social media system"
git push origin main
```

GitHub Pages will automatically rebuild and deploy to https://pages.opencodingsociety.com/

## Testing Checklist

- [ ] Backend running on localhost:8585
- [ ] Frontend running on localhost:4100
- [ ] Can login successfully
- [ ] Can submit feedback on a lesson page
- [ ] Submission appears below the form
- [ ] Can reply to a post
- [ ] Reply appears nested under the post
- [ ] Can view social feed at /social-feed
- [ ] Social feed shows all posts from all users
- [ ] Can search/filter posts in feed
- [ ] Can reply to posts from feed
- [ ] Backend deployed to https://spring.opencodingsociety.com/
- [ ] Frontend deployed to https://pages.opencodingsociety.com/

## API Endpoints Available

Once your backend is running, these endpoints are available:

### GET /api/post/page?url={pageUrl}
Get all posts for a specific lesson (public, no auth required)

### GET /api/post/all (requires JWT)
Get all posts from all users for the social feed

### POST /api/post (requires JWT)
Create a new post/submission

### POST /api/post/reply (requires JWT)
Add a reply to a post

### PUT /api/post/{id} (requires JWT)
Update your own post

### DELETE /api/post/{id} (requires JWT)
Delete your own post

## File Locations

### Frontend (pages repository):
- `_includes/grading-feedback-backend.html` - Feedback form component
- `navigation/social_media/feed.md` - Social media feed page
- `navigation/social_media/README.md` - Full documentation
- `navigation/social_media/BACKEND_*.java` - Backend code to copy

### Backend (pagesBackend repository):
- `src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java`
- `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java`
- `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java`

## Features Summary

### ✅ What It Does:
- Students submit grade feedback on lessons with JWT authentication
- All submissions stored in MySQL database (persistent)
- Threaded comments/replies on any post
- Social media feed showing all student work
- Search and filter functionality
- Real-time updates (auto-refresh every 30 seconds)
- Auto-fills student name from login session

### ✅ What It Replaces:
- Old localStorage-based system (data only on local browser)
- Now data is shared across all users
- Now you can build a true social media experience

## Need Help?

1. Read the full `README.md` in the same folder
2. Check `BACKEND_SETUP_INSTRUCTIONS.md` for detailed backend setup
3. Test with Postman using the examples in README.md
4. Check browser console for errors
5. Verify backend is running: http://localhost:8585/api/post/all

## What's Different from Before?

### OLD System (localStorage):
- ❌ Data stored in browser only
- ❌ Can't see other students' posts
- ❌ Data lost when clearing cache
- ❌ No social media page
- ❌ No search/filter

### NEW System (Backend):
- ✅ Data stored in MySQL database
- ✅ See all students' posts
- ✅ Permanent storage
- ✅ Full social media feed at /social-feed
- ✅ Search and filter posts
- ✅ JWT authentication
- ✅ Auto-refresh for real-time updates

---

**You're all set!** Follow the steps above and you'll have a working social media grading system! 🎉

For detailed information, see **README.md** in this same folder.

