# 💬 Social Media / Grading Feedback System

## Overview

This is a complete **backend-connected social media and grading feedback system** for the Nighthawk Coders website. When students log in, they can:

1. ✅ Submit grade feedback on lesson pages
2. 💬 Reply to posts with threaded comments
3. 📱 View a social media feed of all submissions
4. 🔐 Auto-login integration (auto-fills name from JWT)

## Features

### For Students
- Submit grading feedback on any lesson page
- Comment/reply to other students' submissions
- View a social feed of all student work
- Search and filter posts by grade or content
- Real-time updates every 30 seconds

### For Teachers
- View all student submissions in one place
- Provide feedback through threaded comments
- Track student engagement and grades
- Filter and search through all submissions

## System Architecture

```
Frontend (pages repo)          Backend (pagesBackend repo)
─────────────────────          ─────────────────────────────
- grading-feedback-backend.html → POST /api/post (create)
- feed.md (social media page)  → GET /api/post/all (read all)
                                → GET /api/post/page?url= (by lesson)
                                → POST /api/post/reply (reply)
                                → PUT /api/post/{id} (update)
                                → DELETE /api/post/{id} (delete)

Database: JPA/Hibernate (SQLite/MySQL)
Auth: JWT (Spring Security)
```

## Setup Instructions

### 1. Backend Setup (Spring Boot)

Clone your backend repository:
```bash
cd ~/vscode
git clone https://github.com/ApplicatorsCSA/pagesBackend.git
cd pagesBackend
```

Copy the backend files from your frontend repo:
```bash
# Create the post package directory
mkdir -p src/main/java/com/nighthawk/spring_portfolio/mvc/post

# Copy the Java files
cp ~/vscode/pages/navigation/social_media/BACKEND_Post.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java

cp ~/vscode/pages/navigation/social_media/BACKEND_PostJpaRepository.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java

cp ~/vscode/pages/navigation/social_media/BACKEND_PostApiController.java \
   src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java
```

Build and run:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The backend should start on `http://localhost:8585`

### 2. Frontend Setup

The frontend files are already created in your pages repository:

**Pages:**
- `/navigation/social_media/feed.md` - Social media feed page
- `/_includes/grading-feedback-backend.html` - Backend-connected feedback form

**To use on a lesson page:**
1. Open any lesson markdown file (e.g., `/hacks/pong/2025-09-03-P0lesson.md`)
2. Replace the old `{%- include grading-feedback.html -%}` with:
   ```liquid
   {%- include grading-feedback-backend.html -%}
   ```

### 3. Test the System

#### Step 1: Login
1. Go to https://pages.opencodingsociety.com/login (or your local site)
2. Login with your test account (e.g., `toby@gmail.com` / `123Toby!`)

#### Step 2: Submit Feedback on a Lesson
1. Navigate to any lesson page that includes the feedback form
2. Select a grade
3. Write your submission
4. Click "Submit Feedback"
5. You should see your post appear below

#### Step 3: Reply to a Post
1. On the same lesson page, click "💬 Add Reply / Feedback" on any post
2. Write your reply
3. Click "Post Reply"
4. Your reply should appear nested under the post

#### Step 4: View Social Feed
1. Navigate to `/social-feed` (or https://pages.opencodingsociety.com/social-feed)
2. You should see ALL posts from ALL users across ALL lessons
3. Use the search and filter controls to find specific posts
4. Reply to posts directly from the feed

## API Endpoints

### Public Endpoints
- `GET /api/post/page?url={pageUrl}` - Get posts for a specific lesson (no auth required)

### Authenticated Endpoints (require JWT)
- `GET /api/post` - Get all posts by current user
- `GET /api/post/all` - Get all posts from all users
- `POST /api/post` - Create a new post
- `POST /api/post/reply` - Add a reply to a post
- `PUT /api/post/{id}` - Update a post (owner only)
- `DELETE /api/post/{id}` - Delete a post (owner only)

## Testing with Postman

### 1. Login
```http
POST http://localhost:8585/authenticate
Content-Type: application/json

{
  "email": "toby@gmail.com",
  "password": "123Toby!"
}
```

Save the JWT cookie from the response.

### 2. Create a Post
```http
POST http://localhost:8585/api/post
Content-Type: application/json
Cookie: jwt=<your-jwt-token>

{
  "content": "This is my submission for the OOP lesson!",
  "gradeReceived": "A (93-96%)",
  "pageUrl": "/hacks/pong/2025-09-03-P0lesson",
  "pageTitle": "Pong Lesson - OOP Concepts"
}
```

### 3. Get All Posts
```http
GET http://localhost:8585/api/post/all
Cookie: jwt=<your-jwt-token>
```

### 4. Add a Reply
```http
POST http://localhost:8585/api/post/reply
Content-Type: application/json
Cookie: jwt=<your-jwt-token>

{
  "parentId": 1,
  "content": "Great work! Your OOP understanding is solid!"
}
```

### 5. Get Posts for a Specific Lesson
```http
GET http://localhost:8585/api/post/page?url=/hacks/pong/2025-09-03-P0lesson
```

## Database Schema

The `posts` table:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Long | Primary Key | Auto-generated |
| person_id | Long | Foreign Key, Not Null | References users table |
| student_name | String(100) | Not Null | Student's name |
| grade_received | String(50) | Nullable | Grade (null for replies) |
| content | Text | Not Null | Post content |
| page_url | String(500) | Nullable | Lesson page URL |
| page_title | String(200) | Nullable | Lesson page title |
| timestamp | DateTime | Not Null | Auto-generated |
| parent_id | Long | Foreign Key, Nullable | For threaded comments |

## File Structure

```
Frontend (pages repository):
├── _includes/
│   ├── grading-feedback.html           (old localStorage version)
│   └── grading-feedback-backend.html   (new backend version) ✨
├── navigation/social_media/
│   ├── feed.md                         (social media feed page) ✨
│   ├── README.md                       (this file) ✨
│   ├── BACKEND_SETUP_INSTRUCTIONS.md   (backend setup guide) ✨
│   ├── BACKEND_Post.java               (Java model) ✨
│   ├── BACKEND_PostJpaRepository.java  (Java repository) ✨
│   └── BACKEND_PostApiController.java  (Java API controller) ✨

Backend (pagesBackend repository):
└── src/main/java/com/nighthawk/spring_portfolio/mvc/post/
    ├── Post.java                       (copy from BACKEND_Post.java)
    ├── PostJpaRepository.java          (copy from BACKEND_PostJpaRepository.java)
    └── PostApiController.java          (copy from BACKEND_PostApiController.java)
```

## Features Comparison

| Feature | Old (localStorage) | New (Backend) |
|---------|-------------------|---------------|
| Data Storage | Browser localStorage | MySQL Database |
| Multi-user | ❌ Only see own posts | ✅ See all users' posts |
| Persistence | ❌ Lost if clear cache | ✅ Permanent storage |
| Social Feed | ❌ Not available | ✅ Full social media page |
| Search/Filter | ❌ Not available | ✅ Search and filter posts |
| Authentication | ⚠️ Basic (name field) | ✅ JWT authentication |
| Real-time Updates | ❌ Manual refresh | ✅ Auto-refresh (30s) |

## Deployment

### Backend Deployment
1. Push your changes to GitHub:
   ```bash
   cd pagesBackend
   git add .
   git commit -m "Add social media post API"
   git push origin master
   ```

2. Deploy to your server (https://spring.opencodingsociety.com/)
   - The deploy process should automatically pick up the changes
   - Database tables will be auto-created by JPA/Hibernate

### Frontend Deployment
1. Push your changes:
   ```bash
   cd pages
   git add .
   git commit -m "Add backend-connected social media system"
   git push origin main
   ```

2. GitHub Pages will automatically rebuild and deploy

## Troubleshooting

### "Person not found" Error
**Problem:** JWT authentication failing  
**Solution:** Make sure you're logged in at `/login` first

### "CORS Error"
**Problem:** Cross-origin request blocked  
**Solution:** The `@CrossOrigin` annotation in `PostApiController` should handle this. Verify it's present.

### "Table 'posts' doesn't exist"
**Problem:** Database table not created  
**Solution:** Check `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```

### Posts not appearing
**Problem:** Data not loading  
**Solution:** 
1. Check browser console for errors
2. Verify backend is running: `http://localhost:8585/api/post/all`
3. Check JWT cookie is being sent

### Can't reply to posts
**Problem:** Reply button not working  
**Solution:** Ensure you're logged in. The system checks authentication before allowing replies.

## Security Notes

- ✅ All write operations require JWT authentication
- ✅ Users can only edit/delete their own posts
- ✅ Reading posts by page is public (anyone can view lesson feedback)
- ✅ Social feed requires login to prevent spam
- ⚠️ XSS protection: All user input is escaped before display

## Next Steps / Future Enhancements

1. **Notifications** - Notify users when someone replies to their post
2. **Likes/Reactions** - Add emoji reactions to posts
3. **User Profiles** - View all posts by a specific user
4. **Rich Text Editor** - Support markdown or rich text in posts
5. **Image Upload** - Allow students to upload screenshots
6. **Tags/Categories** - Organize posts by topic
7. **Admin Dashboard** - Teacher view to moderate posts

## Credits

Created for Nighthawk Coders by the Applicators CSA Team  
Backend: [https://github.com/ApplicatorsCSA/pagesBackend](https://github.com/ApplicatorsCSA/pagesBackend)  
Frontend: [https://pages.opencodingsociety.com/](https://pages.opencodingsociety.com/)

## Support

For issues or questions:
1. Check this README
2. Review the `BACKEND_SETUP_INSTRUCTIONS.md`
3. Ask in the team Discord/Slack
4. Create an issue on GitHub

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Status:** ✅ Production Ready



