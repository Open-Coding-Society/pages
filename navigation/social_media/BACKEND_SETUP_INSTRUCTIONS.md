# Backend Setup Instructions for Social Media / Grading Feedback System

## Overview

This social media / grading feedback system allows students to:
1. Submit their grade feedback on lesson pages
2. View all submissions in a social media feed
3. Reply to posts with threaded comments
4. Connect through JWT authentication (auto-fills name when logged in)

## Backend Files to Add

Add these 3 files to your Spring Boot backend repository: [https://github.com/ApplicatorsCSA/pagesBackend](https://github.com/ApplicatorsCSA/pagesBackend)

### 1. Post.java
**Location:** `src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java`

This is the JPA entity model for posts and comments.

### 2. PostJpaRepository.java
**Location:** `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java`

This is the repository interface for database operations.

### 3. PostApiController.java
**Location:** `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java`

This is the REST API controller with all endpoints.

## Installation Steps

### Step 1: Create the Post Package
```bash
cd pagesBackend
mkdir -p src/main/java/com/nighthawk/spring_portfolio/mvc/post
```

### Step 2: Copy the Files
Copy the three Java files from your frontend repo (`navigation/social_media/`) to the backend:
- `BACKEND_Post.java` → `src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java`
- `BACKEND_PostJpaRepository.java` → `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java`
- `BACKEND_PostApiController.java` → `src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java`

### Step 3: Build and Run
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The database table will be automatically created by JPA/Hibernate.

## API Endpoints

Once the backend is running, you'll have these endpoints available:

### Public Endpoints
- `GET /api/post/page?url={pageUrl}` - Get all posts for a lesson page (no auth required)

### Authenticated Endpoints (require JWT)
- `GET /api/post` - Get all posts by current user
- `GET /api/post/all` - Get all posts from all users (for social feed)
- `POST /api/post` - Create a new post
- `POST /api/post/reply` - Add a reply to a post
- `PUT /api/post/{id}` - Update a post (owner only)
- `DELETE /api/post/{id}` - Delete a post (owner only)

## Testing with Postman

### 1. Login First
POST `http://localhost:8585/authenticate`
```json
{
  "email": "toby@gmail.com",
  "password": "123Toby!"
}
```

Save the JWT cookie from the response.

### 2. Create a Post
POST `http://localhost:8585/api/post`
```json
{
  "content": "This is my submission for the lesson!",
  "gradeReceived": "A (93-96%)",
  "pageUrl": "/hacks/pong/2025-09-03-P0lesson",
  "pageTitle": "Pong Lesson"
}
```

### 3. Get All Posts
GET `http://localhost:8585/api/post/all`

### 4. Add a Reply
POST `http://localhost:8585/api/post/reply`
```json
{
  "parentId": 1,
  "content": "Great work! Keep it up!"
}
```

## Database Schema

The `posts` table will include:

| Column | Type | Description |
|--------|------|-------------|
| id | Long | Primary key |
| person_id | Long | Foreign key to users table |
| student_name | String | Student's name |
| grade_received | String | Grade (optional for replies) |
| content | Text | Post content |
| page_url | String | Lesson page URL |
| page_title | String | Lesson page title |
| timestamp | DateTime | Auto-generated |
| parent_id | Long | For threaded comments (null for main posts) |

## Deployment

Once tested locally:

1. Push the changes to your backend repository
2. Deploy to your server (https://spring.opencodingsociety.com/)
3. The frontend will automatically connect using the javaURI in config.js

## Security Notes

- All write operations require JWT authentication
- Users can only edit/delete their own posts
- Reading posts by page is public (so anyone can view feedback on lessons)
- The social feed requires login to prevent spam

## Troubleshooting

### "Person not found" Error
Make sure you're logged in and the JWT cookie is being sent with requests.

### "CORS Error"
The `@CrossOrigin` annotation in PostApiController allows cross-origin requests. Verify it's present.

### "Table not found"
JPA/Hibernate should auto-create tables. Check `application.properties` for:
```properties
spring.jpa.hibernate.ddl-auto=update
```

## Next Steps

Once the backend is running:
1. Update the frontend grading-feedback.html to use the API
2. Create a social media page to display all posts
3. Test the full flow with login → post → reply

