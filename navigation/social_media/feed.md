---
layout: page
title: Social Feed
permalink: /social-feed
search_exclude: false
show_reading_time: false
---

<style>
.social-feed-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}

.feed-header {
  text-align: center;
  margin-bottom: 3rem;
}

.feed-header h1 {
  color: #0f0;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.feed-header p {
  color: #888;
  font-size: 1.1rem;
}

.filter-controls {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filter-controls h3 {
  color: #0f0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group input,
.filter-group select {
  background: #222;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  color: #fff;
  font-size: 0.95rem;
}

.filter-group button {
  background: #0f0;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-group button:hover {
  background: #0c0;
  transform: translateY(-2px);
}

.feed-stats {
  background: #1a1a1a;
  border-left: 3px solid #0f0;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 4px;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  color: #888;
}

.stat strong {
  color: #0f0;
  font-size: 1.2rem;
  margin-right: 0.5rem;
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

.post-lesson {
  display: inline-block;
  background: #222;
  color: #888;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.post-lesson a {
  color: #0f0;
  text-decoration: none;
}

.post-lesson a:hover {
  text-decoration: underline;
}

.post-content {
  color: #ccc;
  line-height: 1.6;
  margin: 1rem 0;
  padding: 1rem;
  background: #222;
  border-radius: 4px;
}

.post-replies {
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
.cancel-reply-btn {
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

.cancel-reply-btn {
  background: #333;
  color: #fff;
}

.cancel-reply-btn:hover {
  background: #444;
}

.add-reply-btn {
  background: #333;
  color: #0f0;
  border: 1px solid #0f0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-reply-btn:hover {
  background: #0f0;
  color: #000;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #0f0;
  font-size: 1.2rem;
}

.error-message {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #f00;
  color: #f00;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  margin: 2rem 0;
}

.success-message {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #0f0;
  color: #0f0;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  margin: 2rem 0;
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

.login-prompt {
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid #ffa500;
  color: #ffa500;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 2rem;
}

.login-prompt a {
  color: #0f0;
  font-weight: bold;
  text-decoration: underline;
}
</style>

<div class="social-feed-container">
  <div class="feed-header">
    <h1>💬 Student Social Feed</h1>
    <p>See what everyone is working on and share feedback</p>
  </div>

  <div id="loginPrompt" class="login-prompt" style="display: none;">
    ⚠️ You must be <a href="{{ site.baseurl }}/login">logged in</a> to view the social feed and interact with posts.
  </div>

  <div id="filterControls" class="filter-controls" style="display: none;">
    <h3>🔍 Filter Posts</h3>
    <div class="filter-group">
      <input type="text" id="searchInput" placeholder="Search by student name or content...">
      <select id="gradeFilter">
        <option value="">All Grades</option>
        <option value="A">A Range</option>
        <option value="B">B Range</option>
        <option value="C">C Range</option>
        <option value="D">D Range</option>
        <option value="F">F Range</option>
        <option value="Not Yet Graded">Not Yet Graded</option>
      </select>
      <button onclick="applyFilters()">Apply Filters</button>
      <button onclick="clearFilters()">Clear</button>
    </div>
  </div>

  <div id="feedStats" class="feed-stats" style="display: none;">
    <div class="stat">
      <strong id="totalPosts">0</strong> Total Posts
    </div>
    <div class="stat">
      <strong id="totalReplies">0</strong> Total Replies
    </div>
    <div class="stat">
      <strong id="activeStudents">0</strong> Active Students
    </div>
  </div>

  <div id="loadingMessage" class="loading">
    Loading posts...
  </div>

  <div id="errorMessage" class="error-message" style="display: none;"></div>
  <div id="successMessage" class="success-message" style="display: none;"></div>

  <div id="feedContainer"></div>
</div>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

let allPosts = [];
let filteredPosts = [];
let isLoggedIn = false;

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch(`${pythonURI}/api/person/get`, fetchOptions);
    isLoggedIn = response.ok;
    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    isLoggedIn = false;
    return false;
  }
}

// Load all posts
async function loadAllPosts() {
  try {
    // No authentication needed to view posts
    const response = await fetch(`${pythonURI}/api/post/all`, fetchOptions);
    if (!response.ok) {
      throw new Error('Failed to load posts');
    }
    allPosts = await response.json();
    filteredPosts = [...allPosts];
    updateStats();
    displayPosts(filteredPosts);
    document.getElementById('filterControls').style.display = 'block';
    document.getElementById('feedStats').style.display = 'flex';
  } catch (error) {
    console.error('Error loading posts:', error);
    showError('Error loading posts. Please try again later.');
  } finally {
    document.getElementById('loadingMessage').style.display = 'none';
  }
}

// Display posts
function displayPosts(posts) {
  const container = document.getElementById('feedContainer');
  
  if (!posts || posts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No Posts Yet</h3>
        <p>Be the first to submit feedback on a lesson!</p>
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
      
      ${post.pageTitle ? `
        <div class="post-lesson">
          📚 Lesson: <a href="${post.pageUrl}">${escapeHtml(post.pageTitle)}</a>
        </div>
      ` : ''}
      
      <div class="post-content">${escapeHtml(post.content)}</div>
      
      ${post.replies && post.replies.length > 0 ? `
        <div class="post-replies">
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
      
      <button class="add-reply-btn" onclick="showReplyForm(${post.id})">💬 Add Reply</button>
      <div class="reply-form" id="replyForm${post.id}" style="display: none;">
        <textarea id="replyContent${post.id}" placeholder="Write your feedback or reply..."></textarea>
        <div class="reply-actions">
          <button class="reply-btn" onclick="submitReply(${post.id})">Post Reply</button>
          <button class="cancel-reply-btn" onclick="hideReplyForm(${post.id})">Cancel</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Update stats
function updateStats() {
  const totalPosts = allPosts.length;
  const totalReplies = allPosts.reduce((sum, post) => sum + (post.replyCount || 0), 0);
  const activeStudents = new Set(allPosts.map(post => post.studentName)).size;
  
  document.getElementById('totalPosts').textContent = totalPosts;
  document.getElementById('totalReplies').textContent = totalReplies;
  document.getElementById('activeStudents').textContent = activeStudents;
}

// Apply filters
window.applyFilters = function() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const gradeFilter = document.getElementById('gradeFilter').value;
  
  filteredPosts = allPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.studentName.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm);
    
    const matchesGrade = gradeFilter === '' ||
      (post.gradeReceived && post.gradeReceived.startsWith(gradeFilter));
    
    return matchesSearch && matchesGrade;
  });
  
  displayPosts(filteredPosts);
};

window.clearFilters = function() {
  document.getElementById('searchInput').value = '';
  document.getElementById('gradeFilter').value = '';
  filteredPosts = [...allPosts];
  displayPosts(filteredPosts);
};

// Reply functions
window.showReplyForm = function(postId) {
  if (!isLoggedIn) {
    showError('Please log in to reply to posts');
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
    showError('Please enter your reply');
    return;
  }
  
  try {
    const response = await fetch(`${pythonURI}/api/post/reply`, {
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
    
    showSuccess('✅ Reply posted successfully!');
    window.hideReplyForm(postId);
    await loadAllPosts(); // Reload to show new reply
  } catch (error) {
    console.error('Error posting reply:', error);
    showError('Error posting reply: ' + error.message);
  }
};

// Helper functions
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

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
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  // Otherwise show date
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Initialize
(async function() {
  const authOk = await checkAuth();
  
  if (!authOk) {
    document.getElementById('loginPrompt').style.display = 'block';
  }
  
  // Load posts regardless of authentication (viewing is public)
  await loadAllPosts();
  
  // Auto-refresh every 30 seconds
  setInterval(loadAllPosts, 30000);
})();
</script>

<!-- Gemini AI Chat Widget -->
{% include social_media/gemini-chat-widget.html %}
