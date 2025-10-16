---
layout: page
title: Social Media - Create Post
permalink: /social-media
search_exclude: false
show_reading_time: false
---

<style>
.social-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #0f0;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.page-header p {
  color: #888;
  font-size: 1.1rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #444;
}

.tab-btn {
  background: none;
  border: none;
  color: #888;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #0f0;
}

.tab-btn.active {
  color: #0f0;
  border-bottom-color: #0f0;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.create-post-container {
  background: #1a1a1a;
  border: 2px solid #0f0;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.create-post-container h3 {
  color: #0f0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #0f0;
  font-weight: bold;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 0.75rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0f0;
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.submit-btn {
  background: #0f0;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #0c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
}

.submit-btn:disabled {
  background: #555;
  cursor: not-allowed;
  transform: none;
}

.message {
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  display: none;
}

.message.success {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #0f0;
  color: #0f0;
}

.message.error {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #f00;
  color: #f00;
}

.login-warning {
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid #ffa500;
  color: #ffa500;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 2rem;
}

.login-warning a {
  color: #0f0;
  font-weight: bold;
  text-decoration: underline;
}

.posts-container {
  margin-top: 2rem;
}

.post-card {
  background: #1a1a1a;
  border: 1px solid #444;
  border-left: 3px solid #0f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.post-card:hover {
  border-color: #0f0;
  box-shadow: 0 4px 12px rgba(0, 255, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.post-author {
  flex: 1;
}

.post-author-name {
  color: #0f0;
  font-weight: bold;
  font-size: 1.2rem;
}

.post-meta {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.post-grade {
  background: #222;
  color: #0f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9rem;
}

.post-content {
  color: #ccc;
  line-height: 1.6;
  margin: 1rem 0;
  padding: 1rem;
  background: #222;
  border-radius: 4px;
  white-space: pre-wrap;
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  background: #333;
  color: #0f0;
  border: 1px solid #0f0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #0f0;
  color: #000;
}

.replies-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.reply-count {
  color: #0f0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.reply-item {
  background: #222;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-left: 2px solid #666;
  border-radius: 4px;
  margin-left: 1.5rem;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.reply-author {
  color: #0f0;
  font-weight: bold;
  font-size: 0.9rem;
}

.reply-timestamp {
  color: #666;
  font-size: 0.8rem;
}

.reply-content {
  color: #aaa;
  line-height: 1.5;
  font-size: 0.95rem;
}

.reply-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.reply-form textarea {
  width: 100%;
  background: #222;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.75rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
}

.reply-form textarea:focus {
  outline: none;
  border-color: #0f0;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.reply-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.reply-btn {
  background: #0f0;
  color: #000;
  font-weight: bold;
}

.reply-btn:hover {
  background: #0c0;
}

.cancel-btn {
  background: #333;
  color: #fff;
}

.cancel-btn:hover {
  background: #444;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #0f0;
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.empty-state h3 {
  color: #0f0;
  margin-bottom: 1rem;
}
</style>

<div class="social-container">
  <div class="page-header">
    <h1>💬 Student Social Media</h1>
    <p>Share your thoughts, get feedback, and connect with classmates</p>
  </div>

  <div id="loginWarning" class="login-warning" style="display: none;">
    ⚠️ You must be <a href="{{ site.baseurl }}/login">logged in</a> to create posts or reply.
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab-btn active" onclick="switchTab('create')">✍️ Create Post</button>
    <button class="tab-btn" onclick="switchTab('feed')">📱 View Feed</button>
  </div>

  <!-- Create Post Tab -->
  <div id="createTab" class="tab-content active">
    <div class="create-post-container">
      <h3>📝 Create a New Post</h3>
      
      <form class="post-form" id="createPostForm">
        <div class="form-group">
          <label for="postGrade">Grade (Optional)</label>
          <select id="postGrade" name="postGrade">
            <option value="">Select grade (optional)...</option>
            <option value="A+ (97-100%)">A+ (97-100%)</option>
            <option value="A (93-96%)">A (93-96%)</option>
            <option value="A- (90-92%)">A- (90-92%)</option>
            <option value="B+ (87-89%)">B+ (87-89%)</option>
            <option value="B (83-86%)">B (83-86%)</option>
            <option value="B- (80-82%)">B- (80-82%)</option>
            <option value="C+ (77-79%)">C+ (77-79%)</option>
            <option value="C (73-76%)">C (73-76%)</option>
            <option value="C- (70-72%)">C- (70-72%)</option>
            <option value="D (60-69%)">D (60-69%)</option>
            <option value="F (Below 60%)">F (Below 60%)</option>
            <option value="Not Yet Graded">Not Yet Graded</option>
          </select>
        </div>

        <div class="form-group">
          <label for="postContent">What's on your mind? *</label>
          <textarea id="postContent" name="postContent" placeholder="Share your thoughts, ask questions, or discuss what you're learning..." required></textarea>
        </div>

        <button type="submit" class="submit-btn" id="submitPostBtn">Post to Feed</button>
      </form>

      <div id="createMessage" class="message"></div>
    </div>
  </div>

  <!-- Feed Tab -->
  <div id="feedTab" class="tab-content">
    <div id="loadingMessage" class="loading">Loading posts...</div>
    <div id="postsContainer" class="posts-container"></div>
  </div>
</div>

<script type="module">
import { javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

let allPosts = [];
let isLoggedIn = false;

// Switch tabs
window.switchTab = function(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  if (tab === 'create') {
    document.getElementById('createTab').classList.add('active');
  } else {
    document.getElementById('feedTab').classList.add('active');
    loadAllPosts();
  }
};

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    isLoggedIn = response.ok;
    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    isLoggedIn = false;
    return false;
  }
}

// Create post
async function createPost(postData) {
  try {
    const response = await fetch(`${javaURI}/api/post`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Load all posts
async function loadAllPosts() {
  document.getElementById('loadingMessage').style.display = 'block';
  
  try {
    const response = await fetch(`${javaURI}/api/post/all`, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to load posts');
    }
    allPosts = await response.json();
    displayPosts(allPosts);
  } catch (error) {
    console.error('Error loading posts:', error);
    showMessage('feedMessage', 'Error loading posts. Please try again later.', 'error');
  } finally {
    document.getElementById('loadingMessage').style.display = 'none';
  }
}

// Display posts
function displayPosts(posts) {
  const container = document.getElementById('postsContainer');
  
  if (!posts || posts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No Posts Yet</h3>
        <p>Be the first to share something!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = posts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <div class="post-author">
          <div class="post-author-name">${escapeHtml(post.studentName)}</div>
          <div class="post-meta">${formatDate(post.timestamp)}</div>
        </div>
        ${post.gradeReceived ? `<div class="post-grade">${escapeHtml(post.gradeReceived)}</div>` : ''}
      </div>
      
      <div class="post-content">${escapeHtml(post.content)}</div>
      
      ${post.replies && post.replies.length > 0 ? `
        <div class="replies-section">
          <div class="reply-count">💬 ${post.replyCount} ${post.replyCount === 1 ? 'Reply' : 'Replies'}</div>
          ${post.replies.map(reply => `
            <div class="reply-item">
              <div class="reply-header">
                <span class="reply-author">${escapeHtml(reply.studentName)}</span>
                <span class="reply-timestamp">${formatDate(reply.timestamp)}</span>
              </div>
              <div class="reply-content">${escapeHtml(reply.content)}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${isLoggedIn ? `
        <div class="post-actions">
          <button class="action-btn" onclick="showReplyForm(${post.id})">💬 Reply</button>
        </div>
        <div class="reply-form" id="replyForm${post.id}" style="display: none;">
          <textarea id="replyContent${post.id}" placeholder="Write your reply..."></textarea>
          <div class="reply-actions">
            <button class="reply-btn" onclick="submitReply(${post.id})">Post Reply</button>
            <button class="cancel-btn" onclick="hideReplyForm(${post.id})">Cancel</button>
          </div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Reply functions
window.showReplyForm = function(postId) {
  if (!isLoggedIn) {
    alert('Please log in to reply');
    return;
  }
  
  // Hide all other reply forms
  document.querySelectorAll('.reply-form').forEach(form => {
    form.style.display = 'none';
  });
  
  const form = document.getElementById(`replyForm${postId}`);
  if (form) {
    form.style.display = 'block';
    document.getElementById(`replyContent${postId}`).focus();
  }
};

window.hideReplyForm = function(postId) {
  const form = document.getElementById(`replyForm${postId}`);
  if (form) {
    form.style.display = 'none';
    document.getElementById(`replyContent${postId}`).value = '';
  }
};

window.submitReply = async function(postId) {
  const content = document.getElementById(`replyContent${postId}`).value.trim();
  
  if (!content) {
    alert('Please enter your reply');
    return;
  }
  
  try {
    const response = await fetch(`${javaURI}/api/post/reply`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        parentId: postId,
        content: content
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to post reply');
    }
    
    window.hideReplyForm(postId);
    await loadAllPosts(); // Reload to show new reply
  } catch (error) {
    console.error('Error posting reply:', error);
    alert('Error posting reply: ' + error.message);
  }
};

// Show message
function showMessage(elementId, message, type) {
  const msgDiv = document.getElementById(elementId);
  msgDiv.textContent = message;
  msgDiv.className = 'message ' + type;
  msgDiv.style.display = 'block';
  
  setTimeout(() => {
    msgDiv.style.display = 'none';
  }, 5000);
}

// Helper functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Form submission
const form = document.getElementById('createPostForm');
const submitBtn = document.getElementById('submitPostBtn');
const loginWarning = document.getElementById('loginWarning');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!isLoggedIn) {
    loginWarning.style.display = 'block';
    showMessage('createMessage', 'Please log in to create posts', 'error');
    return;
  }
  
  const formData = {
    gradeReceived: document.getElementById('postGrade').value || null,
    content: document.getElementById('postContent').value.trim(),
    pageUrl: window.location.pathname,
    pageTitle: 'Social Media Post'
  };
  
  if (!formData.content) {
    showMessage('createMessage', 'Please enter some content', 'error');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Posting...';
  
  try {
    await createPost(formData);
    showMessage('createMessage', '✅ Post created successfully!', 'success');
    form.reset();
    
    // Switch to feed tab to show the new post
    setTimeout(() => {
      document.querySelector('.tab-btn:nth-child(2)').click();
    }, 1500);
  } catch (error) {
    showMessage('createMessage', 'Error creating post: ' + error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Post to Feed';
  }
});

// Initialize
(async function() {
  const authOk = await checkAuth();
  
  if (!authOk) {
    loginWarning.style.display = 'block';
    submitBtn.disabled = true;
  }
})();
</script>

