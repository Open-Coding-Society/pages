package com.nighthawk.spring_portfolio.mvc.post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.nighthawk.spring_portfolio.mvc.person.Person;
import com.nighthawk.spring_portfolio.mvc.person.PersonDetailsService;

import java.util.*;
import java.util.stream.Collectors;

/**
 * PostApiController - REST API for Social Media / Grading Feedback System
 * 
 * This file should be placed in: 
 * pagesBackend/src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostApiController.java
 * 
 * API Endpoints:
 * - POST /api/post - Create a new post/submission
 * - GET /api/post - Get all posts for current user
 * - GET /api/post/all - Get all posts (for social media feed)
 * - GET /api/post/page?url={pageUrl} - Get all posts for a specific lesson page
 * - POST /api/post/reply - Add a reply to a post
 * - PUT /api/post/{id} - Update a post
 * - DELETE /api/post/{id} - Delete a post
 */

@RestController
@RequestMapping("/api/post")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
public class PostApiController {
    
    @Autowired
    private PostJpaRepository postRepository;
    
    @Autowired
    private PersonDetailsService personDetailsService;
    
    /**
     * GET /api/post - Get all posts by current user
     * Requires JWT authentication
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getMyPosts(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // Get current user
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Get user's posts
            List<Post> posts = postRepository.findByPerson(person);
            List<Map<String, Object>> postsData = posts.stream()
                    .map(Post::toMap)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(postsData, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/post/all - Get all posts from all users (main posts only)
     * Requires JWT authentication
     */
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // Verify user is authenticated
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Get all main posts (not replies)
            List<Post> posts = postRepository.findByParentIsNullOrderByTimestampDesc();
            List<Map<String, Object>> postsData = posts.stream()
                    .map(Post::toMap)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(postsData, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * GET /api/post/page?url={pageUrl} - Get all posts for a specific lesson page
     * No authentication required (public access to view posts on lessons)
     */
    @GetMapping("/page")
    public ResponseEntity<List<Map<String, Object>>> getPostsByPage(
            @RequestParam("url") String pageUrl) {
        
        try {
            // Get posts for the specified page
            List<Post> posts = postRepository.findByPageUrlAndParentIsNullOrderByTimestampDesc(pageUrl);
            List<Map<String, Object>> postsData = posts.stream()
                    .map(Post::toMap)
                    .collect(Collectors.toList());
            
            return new ResponseEntity<>(postsData, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/post - Create a new post/submission
     * Requires JWT authentication
     */
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> postData) {
        
        try {
            // Get current user
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Validate required fields
            String content = (String) postData.get("content");
            if (content == null || content.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Content is required");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            
            // Get optional fields
            String gradeReceived = (String) postData.get("gradeReceived");
            String pageUrl = (String) postData.get("pageUrl");
            String pageTitle = (String) postData.get("pageTitle");
            
            // Create new post
            Post post = new Post(person, content, gradeReceived, pageUrl, pageTitle);
            Post savedPost = postRepository.save(post);
            
            return new ResponseEntity<>(savedPost.toMap(), HttpStatus.CREATED);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Error creating post: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * POST /api/post/reply - Add a reply to a post
     * Requires JWT authentication
     */
    @PostMapping("/reply")
    public ResponseEntity<Map<String, Object>> createReply(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> replyData) {
        
        try {
            // Get current user
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Validate required fields
            String content = (String) replyData.get("content");
            Object parentIdObj = replyData.get("parentId");
            
            if (content == null || content.trim().isEmpty() || parentIdObj == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Content and parentId are required");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            
            // Convert parentId to Long
            Long parentId;
            if (parentIdObj instanceof Integer) {
                parentId = ((Integer) parentIdObj).longValue();
            } else if (parentIdObj instanceof Long) {
                parentId = (Long) parentIdObj;
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Invalid parentId format");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            
            // Find parent post
            Optional<Post> parentPostOpt = postRepository.findById(parentId);
            if (!parentPostOpt.isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Parent post not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
            
            Post parentPost = parentPostOpt.get();
            
            // Create reply
            Post reply = new Post(person, content, parentPost);
            Post savedReply = postRepository.save(reply);
            
            return new ResponseEntity<>(savedReply.toMap(), HttpStatus.CREATED);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Error creating reply: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * PUT /api/post/{id} - Update a post
     * Requires JWT authentication and ownership
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        try {
            // Get current user
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Find post
            Optional<Post> postOpt = postRepository.findById(id);
            if (!postOpt.isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Post not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
            
            Post post = postOpt.get();
            
            // Check ownership
            if (!post.getPerson().getId().equals(person.getId())) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Unauthorized to edit this post");
                return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
            }
            
            // Update fields
            if (updates.containsKey("content")) {
                post.setContent((String) updates.get("content"));
            }
            if (updates.containsKey("gradeReceived")) {
                post.setGradeReceived((String) updates.get("gradeReceived"));
            }
            
            Post savedPost = postRepository.save(post);
            return new ResponseEntity<>(savedPost.toMap(), HttpStatus.OK);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Error updating post: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * DELETE /api/post/{id} - Delete a post
     * Requires JWT authentication and ownership
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        try {
            // Get current user
            Person person = personDetailsService.getByEmail(userDetails.getUsername());
            if (person == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            
            // Find post
            Optional<Post> postOpt = postRepository.findById(id);
            if (!postOpt.isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Post not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
            
            Post post = postOpt.get();
            
            // Check ownership
            if (!post.getPerson().getId().equals(person.getId())) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Unauthorized to delete this post");
                return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
            }
            
            // Delete post
            postRepository.delete(post);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Error deleting post: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


