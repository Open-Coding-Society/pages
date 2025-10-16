package com.nighthawk.spring_portfolio.mvc.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nighthawk.spring_portfolio.mvc.person.Person;

import java.util.List;
import java.util.Optional;

/**
 * PostJpaRepository for Post CRUD operations
 * 
 * This file should be placed in: 
 * pagesBackend/src/main/java/com/nighthawk/spring_portfolio/mvc/post/PostJpaRepository.java
 * 
 * Provides database access methods for Post entities
 */

@Repository
public interface PostJpaRepository extends JpaRepository<Post, Long> {
    
    /**
     * Find all posts by a specific user
     */
    List<Post> findByPerson(Person person);
    
    /**
     * Find all posts for a specific page URL (main posts only, not replies)
     */
    List<Post> findByPageUrlAndParentIsNullOrderByTimestampDesc(String pageUrl);
    
    /**
     * Find all main posts (no parent) ordered by timestamp
     */
    List<Post> findByParentIsNullOrderByTimestampDesc();
    
    /**
     * Find all replies for a specific parent post
     */
    List<Post> findByParentOrderByTimestampAsc(Post parent);
    
    /**
     * Find all posts by a specific user on a specific page
     */
    List<Post> findByPersonAndPageUrl(Person person, String pageUrl);
    
    /**
     * Count posts by a specific user
     */
    long countByPerson(Person person);
    
    /**
     * Count replies for a specific post
     */
    @Query("SELECT COUNT(p) FROM Post p WHERE p.parent.id = :parentId")
    long countRepliesByParentId(@Param("parentId") Long parentId);
    
    /**
     * Find recent posts (limit by count)
     */
    @Query(value = "SELECT * FROM posts WHERE parent_id IS NULL ORDER BY timestamp DESC LIMIT :limit", 
           nativeQuery = true)
    List<Post> findRecentMainPosts(@Param("limit") int limit);
}

