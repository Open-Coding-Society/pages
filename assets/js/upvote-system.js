/**
 * Project Upvote System - Frontend Component
 * 
 * Production-ready upvote/like system with:
 * - Smooth animations
 * - Optimistic UI updates
 * - Error handling
 * - Responsive design
 * - Modern glowing effects
 * 
 * Usage:
 * 1. Include this script before using
 * 2. Create UpvoteButton instances for each project
 * 3. Pass project ID and user ID
 * 
 * Example:
 *   const upvote = new UpvoteButton('project-1', userId, {
 *     apiBase: 'http://localhost:8585/api/projects'
 *   });
 *   upvote.render(containerElement);
 */

class UpvoteButton {
    /**
     * Constructor
     * @param {string} projectId - Unique project identifier
     * @param {number|null} userId - Current user ID (null if not authenticated)
     * @param {object} options - Configuration options
     */
    constructor(projectId, userId = null, options = {}) {
        this.projectId = projectId;
        this.userId = userId;
        this.apiBase = options.apiBase || 'http://localhost:8585/api/projects';
        
        // State
        this.likeCount = 0;
        this.isLiked = false;
        this.isTrending = false;
        this.isPopular = false;
        this.isLoading = false;
        this.hasError = false;
        
        // DOM elements
        this.container = null;
        this.button = null;
        this.countElement = null;
        
        this.initialize();
    }
    
    /**
     * Initialize the component
     */
    async initialize() {
        try {
            await this.fetchLikeStatus();
        } catch (error) {
            console.error('Error initializing upvote:', error);
            this.hasError = true;
        }
    }
    
    /**
     * Fetch current like status from server
     */
    async fetchLikeStatus() {
        try {
            const url = `${this.apiBase}/${this.projectId}/likes` +
                       (this.userId ? `?userId=${this.userId}` : '');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.likeCount = data.totalLikes || 0;
            this.isLiked = data.userLiked || false;
            this.isTrending = data.isTrending || false;
            this.isPopular = data.isPopular || false;
            
            if (this.countElement) {
                this.updateCountDisplay();
            }
            
        } catch (error) {
            console.error('Error fetching like status:', error);
            throw error;
        }
    }
    
    /**
     * Toggle like (add or remove)
     */
    async toggleLike(event) {
        event.preventDefault();
        
        if (!this.userId) {
            this.showToast('Please log in to like projects', 'info');
            return;
        }
        
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.setButtonLoading(true);
        
        try {
            const method = this.isLiked ? 'DELETE' : 'POST';
            const endpoint = this.isLiked ? 'like' : 'like';
            
            const response = await fetch(
                `${this.apiBase}/${this.projectId}/${endpoint}`,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': String(this.userId)
                    },
                    credentials: 'include'
                }
            );
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Optimistic update already applied, but sync with server
            this.likeCount = data.totalLikes;
            this.isLiked = data.userLiked;
            this.isTrending = data.isTrending || false;
            this.isPopular = data.isPopular || false;
            
            // Trigger celebration animation
            if (this.isLiked) {
                this.celebrateUpvote();
                this.checkMilestone();
            }
            
            this.updateDisplay();
            this.showToast(
                this.isLiked ? 'Project upvoted! 🎉' : 'Upvote removed',
                'success'
            );
            
        } catch (error) {
            console.error('Error toggling like:', error);
            
            // Revert optimistic update
            this.isLiked = !this.isLiked;
            this.likeCount = this.isLiked ? this.likeCount + 1 : this.likeCount - 1;
            this.updateDisplay();
            
            this.showToast('Failed to update like: ' + error.message, 'error');
        } finally {
            this.isLoading = false;
            this.setButtonLoading(false);
        }
    }
    
    /**
     * Render the upvote button
     */
    render(containerElement) {
        this.container = containerElement;
        
        // Clear container
        this.container.innerHTML = '';
        
        // Create button wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'upvote-wrapper';
        
        // Create button
        this.button = document.createElement('button');
        this.button.className = `upvote-button ${this.isLiked ? 'liked' : ''} ${this.isLoading ? 'loading' : ''}`;
        this.button.setAttribute('title', 'Upvote this project');
        this.button.setAttribute('aria-label', `Upvote. Current upvotes: ${this.likeCount}`);
        
        // Icon
        const icon = document.createElement('span');
        icon.className = 'upvote-icon';
        icon.innerHTML = this.isLiked ? '👍' : '👍';
        
        // Count
        this.countElement = document.createElement('span');
        this.countElement.className = 'upvote-count';
        this.countElement.textContent = this.formatCount(this.likeCount);
        
        // Badge
        const badge = document.createElement('span');
        badge.className = 'upvote-badge';
        if (this.isPopular) {
            badge.textContent = '⭐';
            badge.setAttribute('title', 'Popular');
        } else if (this.isTrending) {
            badge.textContent = '🔥';
            badge.setAttribute('title', 'Trending');
        }
        
        // Assemble button
        this.button.appendChild(icon);
        this.button.appendChild(this.countElement);
        if (badge.textContent) {
            this.button.appendChild(badge);
        }
        
        // Add click handler
        this.button.addEventListener('click', (e) => this.toggleLike(e));
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'upvote-tooltip';
        tooltip.textContent = this.userId ? 'Upvote this project' : 'Log in to upvote';
        
        wrapper.appendChild(this.button);
        wrapper.appendChild(tooltip);
        this.container.appendChild(wrapper);
    }
    
    /**
     * Update display after like change
     */
    updateDisplay() {
        if (!this.button) return;
        
        // Update button state
        this.button.classList.toggle('liked', this.isLiked);
        this.button.setAttribute('aria-label', 
            `Upvote. Current upvotes: ${this.likeCount}. ${this.isLiked ? 'You upvoted this.' : ''}`);
        
        // Update count
        this.updateCountDisplay();
        
        // Update badge
        const badge = this.button.querySelector('.upvote-badge');
        if (badge) {
            if (this.isPopular) {
                badge.textContent = '⭐';
                badge.setAttribute('title', 'Popular');
            } else if (this.isTrending) {
                badge.textContent = '🔥';
                badge.setAttribute('title', 'Trending');
            } else {
                badge.textContent = '';
            }
        }
    }
    
    /**
     * Update count display with animation
     */
    updateCountDisplay() {
        if (!this.countElement) return;
        
        const oldText = this.countElement.textContent;
        const newText = this.formatCount(this.likeCount);
        
        if (oldText !== newText) {
            // Add count change animation
            this.countElement.classList.add('count-changing');
            this.countElement.textContent = newText;
            
            setTimeout(() => {
                this.countElement.classList.remove('count-changing');
            }, 300);
        }
    }
    
    /**
     * Format count for display (1K, 1.5K, etc.)
     */
    formatCount(count) {
        if (count < 1000) return String(count);
        if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
        return (count / 1000000).toFixed(1) + 'M';
    }
    
    /**
     * Apply optimistic update (before server response)
     */
    applyOptimisticUpdate() {
        if (this.isLiked) {
            this.isLiked = false;
            this.likeCount--;
        } else {
            this.isLiked = true;
            this.likeCount++;
        }
        this.updateDisplay();
    }
    
    /**
     * Set button loading state
     */
    setButtonLoading(loading) {
        if (!this.button) return;
        
        this.button.classList.toggle('loading', loading);
        this.button.disabled = loading;
        
        if (loading) {
            this.button.setAttribute('aria-busy', 'true');
        } else {
            this.button.removeAttribute('aria-busy');
        }
    }
    
    /**
     * Celebrate upvote with animation
     */
    celebrateUpvote() {
        if (!this.button) return;
        
        // Add celebration class
        this.button.classList.add('celebrating');
        
        // Create confetti particles
        this.createConfetti();
        
        // Remove animation class after duration
        setTimeout(() => {
            this.button.classList.remove('celebrating');
        }, 600);
    }
    
    /**
     * Create confetti animation
     */
    createConfetti() {
        if (!this.button) return;
        
        const rect = this.button.getBoundingClientRect();
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        
        for (let i = 0; i < 8; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'upvote-confetti';
            confetti.textContent = '✨';
            
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(confetti);
            
            // Animate
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 2;
            
            let x = startX, y = startY;
            let vx_curr = vx, vy_curr = vy;
            const gravity = 0.1;
            
            const animate = () => {
                x += vx_curr;
                y += vy_curr;
                vy_curr += gravity;
                
                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';
                confetti.style.opacity = '1';
                
                if (y < window.innerHeight) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    /**
     * Check for milestone likes (10, 50, 100, etc.)
     */
    checkMilestone() {
        const milestones = [10, 25, 50, 100, 250, 500, 1000];
        
        if (milestones.includes(this.likeCount)) {
            this.showMilestoneNotification(this.likeCount);
        }
    }
    
    /**
     * Show milestone notification
     */
    showMilestoneNotification(count) {
        const message = `🎉 This project reached ${count} upvotes!`;
        
        const notification = document.createElement('div');
        notification.className = 'upvote-milestone';
        notification.innerHTML = `
            <div class="upvote-milestone-content">
                <span class="milestone-emoji">🌟</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `upvote-toast upvote-toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Get serializable state
     */
    getState() {
        return {
            projectId: this.projectId,
            userId: this.userId,
            likeCount: this.likeCount,
            isLiked: this.isLiked,
            isTrending: this.isTrending,
            isPopular: this.isPopular
        };
    }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpvoteButton;
}
