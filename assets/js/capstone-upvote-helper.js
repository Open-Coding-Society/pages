/**
 * Capstone Projects Integration - Trending & Sorting Helper
 * 
 * Enhances the capstone home page with:
 * - Sorting by most liked projects
 * - Trending projects section
 * - Filtering and display logic
 * - Real-time updates
 */

class CapstoneProjectHelper {
    
    constructor(options = {}) {
        this.apiBase = options.apiBase || 'http://localhost:8585/api/projects';
        this.userId = options.userId || null;
        this.containerSelector = options.containerSelector || '#capstone-grid';
    }
    
    /**
     * Get trending projects from API
     * @param {number} limit - Number of projects to return
     * @returns {Promise<Array>}
     */
    async getTrendingProjects(limit = 10) {
        try {
            const response = await fetch(`${this.apiBase}/trending?limit=${limit}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching trending projects:', error);
            return [];
        }
    }
    
    /**
     * Get leaderboard (top projects by likes)
     * @param {number} limit - Number of projects to return
     * @returns {Promise<Array>}
     */
    async getLeaderboard(limit = 10) {
        try {
            const response = await fetch(`${this.apiBase}/leaderboard?limit=${limit}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }
    
    /**
     * Sort projects by like count
     * @param {Array} projects - Projects to sort
     * @param {string} order - 'asc' or 'desc' (default: 'desc')
     * @returns {Array}
     */
    sortByLikes(projects, order = 'desc') {
        return [...projects].sort((a, b) => {
            const comparison = (a.likesCount || 0) - (b.likesCount || 0);
            return order === 'desc' ? -comparison : comparison;
        });
    }
    
    /**
     * Sort projects by trending score
     * @param {Array} projects - Projects to sort
     * @returns {Array}
     */
    sortByTrending(projects) {
        return [...projects].sort((a, b) => {
            const scoreA = (a.trendingScore || 0);
            const scoreB = (b.trendingScore || 0);
            return scoreB - scoreA;
        });
    }
    
    /**
     * Filter projects by minimum likes
     * @param {Array} projects - Projects to filter
     * @param {number} minLikes - Minimum like count
     * @returns {Array}
     */
    filterByMinLikes(projects, minLikes = 0) {
        return projects.filter(p => (p.likesCount || 0) >= minLikes);
    }
    
    /**
     * Get trending badge for a project
     * @param {Object} project - Project object
     * @returns {string} Badge HTML or empty string
     */
    getTrendingBadge(project) {
        if (project.isPopular) {
            return '<span class="badge-popular" title="Popular">⭐ Popular</span>';
        } else if (project.isTrending) {
            return '<span class="badge-trending" title="Trending">🔥 Trending</span>';
        }
        return '';
    }
    
    /**
     * Add upvote button to project card
     * @param {HTMLElement} cardElement - Project card DOM element
     * @param {string} projectId - Project ID
     */
    addUpvoteButtonToCard(cardElement, projectId) {
        const upvoteContainer = document.createElement('div');
        upvoteContainer.className = 'capstone-upvote-container';
        upvoteContainer.id = `upvote-${projectId}`;
        
        // Initialize upvote button
        const upvote = new UpvoteButton(projectId, this.userId, {
            apiBase: this.apiBase
        });
        upvote.render(upvoteContainer);
        
        // Add to card (typically before or after team info)
        const actionArea = cardElement.querySelector('.capstone-card-actions') || cardElement;
        actionArea.appendChild(upvoteContainer);
    }
    
    /**
     * Create trending projects section
     * @param {number} limit - Number of trending projects to display
     * @returns {Promise<HTMLElement>}
     */
    async createTrendingSection(limit = 5) {
        const section = document.createElement('div');
        section.className = 'capstone-trending-section';
        
        section.innerHTML = '<h3 class="capstone-trending-title">🔥 Trending Now</h3>';
        
        const projects = await this.getTrendingProjects(limit);
        
        if (projects.length === 0) {
            section.innerHTML += '<p class="capstone-trending-empty">No trending projects yet</p>';
            return section;
        }
        
        const list = document.createElement('div');
        list.className = 'capstone-trending-list';
        
        projects.forEach((project, index) => {
            const item = document.createElement('div');
            item.className = 'capstone-trending-item';
            
            item.innerHTML = `
                <div class="trending-rank">#${index + 1}</div>
                <div class="trending-info">
                    <div class="trending-title">${this.escapeHtml(project.title)}</div>
                    <div class="trending-score">
                        <span class="trending-likes">👍 ${project.likes || 0} upvotes</span>
                        <span class="trending-badge">${project.badge || ''}</span>
                    </div>
                </div>
            `;
            
            list.appendChild(item);
        });
        
        section.appendChild(list);
        return section;
    }
    
    /**
     * Create sorting controls
     * @param {Function} onSortChange - Callback when sort changes
     * @returns {HTMLElement}
     */
    createSortControls(onSortChange) {
        const container = document.createElement('div');
        container.className = 'capstone-sort-controls';
        
        const label = document.createElement('label');
        label.textContent = 'Sort by: ';
        label.className = 'capstone-sort-label';
        
        const select = document.createElement('select');
        select.className = 'capstone-sort-select';
        
        const options = [
            { value: 'recent', label: 'Most Recent' },
            { value: 'likes', label: 'Most Liked' },
            { value: 'trending', label: 'Trending' },
            { value: 'popular', label: 'Popular' }
        ];
        
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            if (onSortChange) onSortChange(e.target.value);
        });
        
        label.appendChild(select);
        container.appendChild(label);
        
        return container;
    }
    
    /**
     * Create filter badge (filter by trending/popular)
     * @param {Function} onFilterChange - Callback when filter changes
     * @returns {HTMLElement}
     */
    createFilterBadges(onFilterChange) {
        const container = document.createElement('div');
        container.className = 'capstone-filter-badges';
        
        const filters = [
            { id: 'all', label: 'All Projects', emoji: '' },
            { id: 'trending', label: 'Trending', emoji: '🔥' },
            { id: 'popular', label: 'Popular', emoji: '⭐' }
        ];
        
        filters.forEach(filter => {
            const badge = document.createElement('button');
            badge.className = `capstone-filter-badge ${filter.id === 'all' ? 'active' : ''}`;
            badge.dataset.filter = filter.id;
            badge.textContent = `${filter.emoji} ${filter.label}`;
            
            badge.addEventListener('click', () => {
                // Update active state
                container.querySelectorAll('.capstone-filter-badge').forEach(b => 
                    b.classList.remove('active')
                );
                badge.classList.add('active');
                
                // Trigger callback
                if (onFilterChange) onFilterChange(filter.id);
            });
            
            container.appendChild(badge);
        });
        
        return container;
    }
    
    /**
     * Safe HTML escape
     * @param {string} text - Text to escape
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CapstoneProjectHelper;
}
