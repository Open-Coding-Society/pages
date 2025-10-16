package com.nighthawk.spring_portfolio.mvc.post;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.nighthawk.spring_portfolio.mvc.person.Person;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Post Model for Social Media / Grading Feedback System
 * 
 * This file should be placed in your backend's src/main/java/com/nighthawk/spring_portfolio/mvc/post/
 * Example: pagesBackend/src/main/java/com/nighthawk/spring_portfolio/mvc/post/Post.java
 * 
 * Database Schema:
 * - id: Primary key
 * - person: Foreign key to Person table (the user who created the post)
 * - studentName: Name of the student (from user profile)
 * - gradeReceived: Grade selected from dropdown
 * - content: The main submission/comment content
 * - pageUrl: URL of the lesson page
 * - pageTitle: Title of the lesson page
 * - timestamp: Auto-generated creation time
 * - parent: For threaded comments (null for main posts)
 * - replies: List of replies to this post
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    // Foreign key to Person table
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;
    
    @NotEmpty
    @Column(length = 100)
    private String studentName;
    
    @Column(length = 50)
    private String gradeReceived;  // Can be null for reply comments
    
    @NotEmpty
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 500)
    private String pageUrl;
    
    @Column(length = 200)
    private String pageTitle;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    // Threading - for replies/comments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Post parent;
    
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> replies = new ArrayList<>();
    
    // Constructor for creating a new post
    public Post(Person person, String content, String gradeReceived, 
                String pageUrl, String pageTitle) {
        this.person = person;
        this.studentName = person.getName();
        this.content = content;
        this.gradeReceived = gradeReceived;
        this.pageUrl = pageUrl;
        this.pageTitle = pageTitle;
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor for creating a reply
    public Post(Person person, String content, Post parent) {
        this.person = person;
        this.studentName = person.getName();
        this.content = content;
        this.parent = parent;
        this.pageUrl = parent.getPageUrl();
        this.pageTitle = parent.getPageTitle();
        this.timestamp = LocalDateTime.now();
    }
    
    /**
     * Lifecycle callback to set timestamp before persisting
     */
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (studentName == null && person != null) {
            studentName = person.getName();
        }
    }
    
    /**
     * Convert Post to a Map for JSON serialization
     * Includes nested replies
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("personId", this.person != null ? this.person.getId() : null);
        map.put("studentName", this.studentName);
        map.put("gradeReceived", this.gradeReceived);
        map.put("content", this.content);
        map.put("pageUrl", this.pageUrl);
        map.put("pageTitle", this.pageTitle);
        map.put("timestamp", this.timestamp != null ? this.timestamp.toString() : null);
        map.put("parentId", this.parent != null ? this.parent.getId() : null);
        
        // Add replies
        List<Map<String, Object>> repliesData = new ArrayList<>();
        if (this.replies != null) {
            for (Post reply : this.replies) {
                repliesData.add(reply.toMap());
            }
        }
        map.put("replies", repliesData);
        map.put("replyCount", repliesData.size());
        
        return map;
    }
    
    /**
     * Helper method to add a reply
     */
    public void addReply(Post reply) {
        replies.add(reply);
        reply.setParent(this);
    }
    
    /**
     * Helper method to remove a reply
     */
    public void removeReply(Post reply) {
        replies.remove(reply);
        reply.setParent(null);
    }
}


