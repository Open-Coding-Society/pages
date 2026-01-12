---
layout: post
toc: True
title: Microblog Reference 
description: Instructor-Led Demonstration of API Consumption with Promise Patterns for Digital Citizenship Quest Projects
permalink: /python/flask/api/microblog/reference
author: John Mortensen
---


## Microblog System Architecture: Layered AI Approach

This article is the main technical reference for the microblog system, which uses a layered approach to enable interactive, AI-powered microblogging on any lesson or article page.

### Architectural Overview

**1. Layout Layer (`_layouts/opencs.html`):**
- Handles the inclusion of all required dependencies (Tailwind CSS, jQuery, and microblog scripts).
- Injects the microblog overlay panel and floating button into the page.
- Reads frontmatter (e.g., `microblog: True`) to determine whether to activate the microblog UI.
- Ensures the microblog panel is available and styled consistently across all enabled pages.

**2. JavaScript Layer (`assets/js/api/microblog.js`):**
- Handles all UI interactivity: opening/closing the panel, posting, replying, and updating the display.
- Manages API calls to the backend (fetching, posting, reacting, etc.).
- Implements error handling, loading states, and user feedback.
- Uses modern JavaScript patterns (Promises, async/await) for robust, maintainable code.

**3. Backend/API Layer:**
- Provides RESTful endpoints for microblog operations (GET, POST, reply, react).
- Can be extended or replaced as needed for different deployments.

### How It Works

1. Add `layout: opencs` and `microblog: True` to your page’s frontmatter.
2. The layout automatically injects the microblog overlay and loads all dependencies.
3. The JavaScript file (`microblog.js`) detects the UI, wires up event handlers, and manages all API interactions.
4. Users can post, reply, and react in real time, with all updates reflected instantly in the panel.

---

## Enabling and Extending Microblogging

To extend or customize, edit `_layouts/opencs.html` for layout changes, or `assets/js/api/microblog.js` for UI/API logic.

---

## API Endpoints

The JavaScript layer communicates with the following endpoints:

- `GET /microblog` - Retrieve all microblog posts
- `POST /microblog` - Create a new microblog post
- `POST /microblog/reply` - Reply to a microblog post
- `POST /microblog/reaction` - Add reaction to a post

---

## Example: JavaScript API Consumption and UI Logic

The following demonstrations show how the microblog.js file interacts with the API and manages UI updates. These patterns are used throughout the system for robust, user-friendly microblogging.

## Part 1: Instructor Introduction and Demonstration

### Learning Objectives

Students will observe and understand:

1. How to consume REST APIs using JavaScript promises
2. Error handling patterns for robust applications
3. Promise chaining for sequential API operations
4. Debugging techniques for API integration issues

### API Endpoints for Demonstration

**Microblog API Endpoints:**

- `GET /microblog` - Retrieve all microblog posts
- `POST /microblog` - Create a new microblog post
- `POST /microblog/reply` - Reply to a microblog post
- `POST /microblog/reaction` - Add reaction to a post

---

## Part 2: Live Demonstration - Basic API Consumption

### Demonstration 1: Simple GET Request with Promise Pattern

**Instructor Demonstrates:**

```javascript
// Basic Promise Pattern - Instructor demonstrates live
function fetchMicroblogPosts() {
    const apiUrl = 'http://127.0.0.1:8887/api/microblog';
    
    return fetch(apiUrl)
        .then(response => {
            // Instructor explains: Always check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Microblog posts retrieved:', data);
            return data; // Return for further chaining
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            // Instructor demonstrates: Always provide user feedback
            displayErrorMessage('Failed to load posts. Please try again.');
            return []; // Return empty array as fallback
        });
}
```

**Instructor Commentary:**

- "Notice how we always check `response.ok` before proceeding"
- "The `return` statements allow us to chain promises"
- "Error handling provides user feedback, not just console logs"

---

## Part 3: Demonstration - Promise Chaining Patterns

### Demonstration 2: Creating Posts with Error Handling

**Instructor Demonstrates Two Patterns:**

#### Pattern A: Returnable Promise Chain

```javascript
// Pattern A: Returns promise for further chaining
function createMicroblogPost(postData) {
    const apiUrl = 'http://127.0.0.1:8887/api/microblog';
    
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.status}`);
        }
        return response.json();
    })
    .then(newPost => {
        console.log('Post created successfully:', newPost);
        return newPost; // Available for chaining
    })
    .catch(error => {
        console.error('Error creating post:', error);
        throw error; // Re-throw for caller to handle
    });
}

// Usage with chaining
createMicroblogPost({ content: "My quest discovery!" })
    .then(newPost => {
        updateUI(newPost);
        return fetchMicroblogPosts(); // Chain another API call
    })
    .then(allPosts => {
        displayPosts(allPosts);
    })
    .catch(error => {
        displayErrorMessage('Operation failed: ' + error.message);
    });
```

#### Pattern B: Direct Execution

```javascript
// Pattern B: Handles everything internally
async function createPostAndRefresh(postData) {
    try {
        const response = await fetch('http://127.0.0.1:8887/api/microblog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newPost = await response.json();
        console.log('Post created:', newPost);
        
        // Refresh the display
        const allPosts = await fetchMicroblogPosts();
        displayPosts(allPosts);
        
        showSuccessMessage('Post created successfully!');
        
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage('Failed to create post: ' + error.message);
    }
}
```

**Instructor Explains:**

- "Pattern A returns promises for flexible chaining"
- "Pattern B handles everything internally using async/await"
- "Choose based on whether you need the result elsewhere"

---

## Part 4: Error Handling Demonstration

### Demonstration 3: Common Mistakes and Solutions

**Instructor Shows Wrong Way First:**

```javascript
// ❌ WRONG WAY - Instructor demonstrates what NOT to do
function badApiCall() {
    fetch('http://127.0.0.1:8887/api/microblog')
        .then(response => response.json()) // Missing error check!
        .then(data => {
            // This might not work if response failed
            document.getElementById('posts').innerHTML = data.map(post => 
                `<p>${post.content}</p>`
            ).join('');
        }); // No error handling!
}
```

**Then Shows Correct Way:**

```javascript
// ✅ CORRECT WAY - Instructor demonstrates best practices
function properApiCall() {
    fetch('http://127.0.0.1:8887/api/microblog')
        .then(response => {
            // Always check response status
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Validate data before using
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received');
            }
            
            // Safely update UI
            const postsContainer = document.getElementById('posts');
            if (postsContainer) {
                postsContainer.innerHTML = data.map(post => 
                    `<div class="post">
                        <p>${escapeHtml(post.content || 'No content')}</p>
                        <small>Posted: ${new Date(post.timestamp).toLocaleDateString()}</small>
                    </div>`
                ).join('');
            }
        })
        .catch(error => {
            console.error('API call failed:', error);
            displayErrorMessage('Unable to load posts. Please check your connection.');
        });
}

// Utility function for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

---

## Part 5: Interactive Form Demonstration

### Demonstration 4: Quest Project Integration

**Complete Form Handler for Digital Citizenship Quests:**

```javascript
// Quest Microblog Integration - Instructor demonstrates live
class QuestMicroblog {
    constructor(apiBaseUrl = 'http://127.0.0.1:8887/api') {
        this.apiUrl = apiBaseUrl;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Instructor demonstrates: Proper event handling
        const form = document.getElementById('quest-post-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePostSubmission(e);
            });
        }
        
        // Load posts when page loads
        this.loadQuestPosts();
    }
    
    async handlePostSubmission(event) {
        const formData = new FormData(event.target);
        const postData = {
            content: formData.get('content'),
            quest_topic: formData.get('quest_topic'), // Digital Citizenship topic
            student_name: formData.get('student_name')
        };
        
        // Instructor demonstrates: User feedback during operation
        this.showLoadingState(true);
        
        try {
            const result = await this.createPost(postData);
            
            // Success feedback
            this.showSuccessMessage('Quest post shared successfully!');
            
            // Clear form
            event.target.reset();
            
            // Refresh display
            await this.loadQuestPosts();
            
        } catch (error) {
            this.showErrorMessage('Failed to share quest post: ' + error.message);
        } finally {
            this.showLoadingState(false);
        }
    }
    
    createPost(postData) {
        return fetch(`${this.apiUrl}/microblog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        });
    }
    
    async loadQuestPosts() {
        try {
            const posts = await fetch(`${this.apiUrl}/microblog`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch: ${response.status}`);
                    }
                    return response.json();
                });
            
            this.displayPosts(posts);
            
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showErrorMessage('Unable to load quest posts.');
        }
    }
    
    displayPosts(posts) {
        const container = document.getElementById('quest-posts-display');
        if (!container) return;
        
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="no-posts">No quest posts yet. Be the first to share!</p>';
            return;
        }
        
        container.innerHTML = posts.map(post => `
            <div class="quest-post" data-post-id="${post.id}">
                <div class="quest-header">
                    <h4>${escapeHtml(post.student_name || 'Anonymous')}</h4>
                    <span class="quest-topic">${escapeHtml(post.quest_topic || 'General')}</span>
                </div>
                <div class="quest-content">
                    <p>${escapeHtml(post.content)}</p>
                </div>
                <div class="quest-actions">
                    <button onclick="questBlog.addReaction(${post.id}, 'like')">👍 Like</button>
                    <button onclick="questBlog.showReplyForm(${post.id})">💬 Reply</button>
                </div>
                <div id="replies-${post.id}" class="replies-container"></div>
            </div>
        `).join('');
    }
    
    showLoadingState(isLoading) {
        const button = document.querySelector('#quest-post-form button[type="submit"]');
        if (button) {
            button.disabled = isLoading;
            button.textContent = isLoading ? 'Sharing...' : 'Share Quest Post';
        }
    }
    
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Instructor demonstrates: Proper user feedback
        const messageDiv = document.getElementById('message-display') || this.createMessageDiv();
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    
    createMessageDiv() {
        const div = document.createElement('div');
        div.id = 'message-display';
        div.className = 'message';
        document.body.insertBefore(div, document.body.firstChild);
        return div;
    }
}

// Utility function (demonstrated by instructor)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.questBlog = new QuestMicroblog();
});
```

---

## Part 6: HTML Form for Quest Integration

### HTML Structure for Digital Citizenship Quests

```html
<!-- Quest Microblog Form - Instructor demonstrates HTML structure -->
<div class="quest-microblog-container">
    <div class="quest-header">
        <h2>Share Your Digital Citizenship Quest Discovery</h2>
        <p>Document your learning journey for the Night at the Museum showcase!</p>
    </div>
    
    <form id="quest-post-form" class="quest-form">
        <div class="form-group">
            <label for="student_name">Your Name:</label>
            <input type="text" id="student_name" name="student_name" required 
                   placeholder="Enter your name">
        </div>
        
        <div class="form-group">
            <label for="quest_topic">Quest Topic:</label>
            <select id="quest_topic" name="quest_topic" required>
                <option value="">Select Digital Citizenship Topic</option>
                <option value="digital_footprint">Digital Footprint</option>
                <option value="online_safety">Online Safety</option>
                <option value="digital_literacy">Digital Literacy</option>
                <option value="cyberbullying">Cyberbullying Prevention</option>
                <option value="privacy_security">Privacy & Security</option>
                <option value="digital_ethics">Digital Ethics</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="content">Share Your Discovery:</label>
            <textarea id="content" name="content" required 
                      placeholder="What did you learn? How will you apply this knowledge? What would you tell other students?"
                      rows="4"></textarea>
        </div>
        
        <button type="submit">Share Quest Post</button>
    </form>
    
    <div id="message-display" class="message" style="display: none;"></div>
    
    <div class="quest-posts-section">
        <h3>Quest Discoveries from Fellow Students</h3>
        <div id="quest-posts-display" class="posts-container">
            <!-- Posts will be dynamically loaded here -->
        </div>
    </div>
</div>
```

---

## Part 7: CSS for Quest Experience

### Styling for Engaging User Experience

```css
/* Quest Microblog Styles - Instructor demonstrates UX considerations */
.quest-microblog-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.quest-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
}

.quest-form {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

button[type="submit"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
}

button[type="submit"]:hover {
    transform: translateY(-2px);
}

button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.message {
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
    font-weight: 500;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.quest-post {
    background: white;
    margin: 15px 0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-left: 4px solid #667eea;
}

.quest-header h4 {
    margin: 0 0 5px 0;
    color: #333;
}

.quest-topic {
    background: #667eea;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.quest-content p {
    margin: 15px 0;
    line-height: 1.6;
    color: #555;
}

.quest-actions {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.quest-actions button {
    background: #f8f9fa;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 20px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.quest-actions button:hover {
    background: #e9ecef;
}

.no-posts {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 40px;
}

/* Loading states */
.loading {
    opacity: 0.6;
    pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
    .quest-microblog-container {
        margin: 10px;
        padding: 15px;
    }
    
    .quest-form {
        padding: 20px;
    }
}
```

---

## Part 8: Testing and Debugging Demonstration

### Instructor Demonstrates Testing with Browser Console

**Debugging Techniques:**

```javascript
// Instructor demonstrates debugging in browser console
// 1. Test API connectivity
fetch('http://127.0.0.1:8887/api/microblog')
    .then(r => r.json())
    .then(data => console.log('API Response:', data))
    .catch(err => console.error('API Error:', err));

// 2. Test form data extraction
const testFormData = new FormData();
testFormData.append('content', 'Test post');
testFormData.append('quest_topic', 'digital_footprint');
console.log('Form data:', Object.fromEntries(testFormData));

// 3. Test error handling
questBlog.showErrorMessage('This is a test error message');

// 4. Simulate API failure
fetch('http://127.0.0.1:8887/api/invalid-endpoint')
    .then(r => {
        console.log('Response status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .catch(err => console.log('Expected error caught:', err.message));
```

---

## Part 9: Reading Materials and Resources

### Essential Concepts for Students

**Promise Patterns:**

- [MDN Promise Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

**Error Handling:**

- Always check `response.ok` before processing
- Provide user-friendly error messages
- Use try-catch with async/await

**API Integration Best Practices:**

- Validate data before using it
- Escape HTML to prevent XSS attacks
- Provide loading states for user feedback

---

## Part 10: Step-by-Step Implementation Guide

### Implementation Checklist for Students

1. **Setup Phase:**
   - [ ] Copy HTML structure into your project
   - [ ] Add CSS styles for quest theme
   - [ ] Verify API endpoints are accessible

2. **JavaScript Integration:**
   - [ ] Initialize QuestMicroblog class
   - [ ] Test basic fetch functionality
   - [ ] Implement form submission handler

3. **Error Handling:**
   - [ ] Add response status checks
   - [ ] Implement user feedback messages
   - [ ] Test error scenarios

4. **Testing Phase:**
   - [ ] Test with valid data
   - [ ] Test with invalid data
   - [ ] Test network failure scenarios
   - [ ] Verify all user feedback works

5. **Quest Integration:**
   - [ ] Customize for your Digital Citizenship topic
   - [ ] Add project-specific styling
   - [ ] Prepare for Night at the Museum showcase

---

## Summary: Key Demonstration Points

### What Students Observed

1. **Promise Pattern Implementation** - Both returnable and direct execution styles
2. **Proper Error Handling** - Status checking, user feedback, and fallback strategies
3. **Security Considerations** - HTML escaping and data validation
4. **User Experience Design** - Loading states, success/error messages, and responsive design
5. **Debugging Techniques** - Console testing, error simulation, and troubleshooting workflows

### Next Steps for Quest Projects

Students will adapt these patterns for their specific Digital Citizenship topics, creating engaging interactive experiences that demonstrate their learning for the Night at the Museum showcase.

**Assessment Integration:** This demonstration supports hands-on quest development where students apply these API consumption patterns to create meaningful digital citizenship learning experiences.
