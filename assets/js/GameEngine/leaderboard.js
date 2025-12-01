// Leaderboard.js - ES6 Module version
export default class Leaderboard {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.API_BASE_URL = options.apiBaseUrl || '/gamer';
        this.init();
    }
    
    init() {
        this.createLeaderboardHTML();
        this.fetchLeaderboard();
        this.attachEventListeners();
        
        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => this.fetchLeaderboard(), 30000);
    }
    
    createLeaderboardHTML() {
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.id = 'leaderboard-container';
        leaderboardContainer.className = 'leaderboard-widget';
        
        leaderboardContainer.innerHTML = `
            <div class="leaderboard-header">
                <h3>🏆 Leaderboard</h3>
                <button id="toggle-leaderboard" class="toggle-btn">−</button>
            </div>
            <div class="leaderboard-content">
                <div class="leaderboard-actions">
                    <input type="text" id="username-input" placeholder="Username" />
                    <input type="number" id="score-input" placeholder="Score" min="0" />
                    <button id="submit-score-btn" class="action-btn submit-btn">Submit Score</button>
                    <button id="refresh-leaderboard-btn" class="action-btn refresh-btn">Refresh</button>
                </div>
                <div id="leaderboard-list" class="leaderboard-list">
                    <p class="loading">Loading leaderboard...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(leaderboardContainer);
    }
    
    async fetchLeaderboard() {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '<p class="loading">Loading...</p>';
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/gamer`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            
            const leaderboardData = await response.json();
            this.displayLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            listContainer.innerHTML = '<p class="error">Failed to load leaderboard</p>';
        }
    }
    
    displayLeaderboard(data) {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;
        
        if (data.length === 0) {
            listContainer.innerHTML = '<p class="empty">No scores yet!</p>';
            return;
        }
        
        let html = '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Action</th></tr></thead><tbody>';
        
        data.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            html += `
                <tr class="leaderboard-row">
                    <td class="rank">${medal || (index + 1)}</td>
                    <td class="username">${this.escapeHtml(entry.username)}</td>
                    <td class="score">${entry.highScore.toLocaleString()}</td>
                    <td><button class="delete-btn" data-username="${this.escapeHtml(entry.username)}">Delete</button></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        listContainer.innerHTML = html;
        
        // Re-attach delete button listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDeleteScore(e));
        });
    }
    
    async submitScore() {
        const username = document.getElementById('username-input').value.trim();
        const score = parseInt(document.getElementById('score-input').value);
        
        if (!username) {
            alert('Please enter a username');
            return;
        }
        
        if (isNaN(score) || score < 0) {
            alert('Please enter a valid score');
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/updateScore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    score: score
                })
            });
            
            if (response.ok) {
                alert('Score submitted successfully!');
                document.getElementById('username-input').value = '';
                document.getElementById('score-input').value = '';
                this.fetchLeaderboard();
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Failed to submit score');
        }
    }
    
    async handleDeleteScore(event) {
        const username = event.target.dataset.username;
        
        if (!confirm(`Are you sure you want to delete ${username}'s score?`)) {
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/updateScore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    score: 0
                })
            });
            
            if (response.ok) {
                alert('Score deleted successfully!');
                this.fetchLeaderboard();
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error deleting score:', error);
            alert('Failed to delete score');
        }
    }
    
    toggleLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        if (!container) return;
        
        const content = container.querySelector('.leaderboard-content');
        const toggleBtn = document.getElementById('toggle-leaderboard');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleBtn.textContent = '−';
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = '+';
        }
    }
    
    attachEventListeners() {
        document.getElementById('submit-score-btn')?.addEventListener('click', () => this.submitScore());
        document.getElementById('refresh-leaderboard-btn')?.addEventListener('click', () => this.fetchLeaderboard());
        document.getElementById('toggle-leaderboard')?.addEventListener('click', () => this.toggleLeaderboard());
        
        // Allow Enter key to submit score
        document.getElementById('score-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitScore();
            }
        });
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        const container = document.getElementById('leaderboard-container');
        if (container) {
            container.remove();
        }
    }
}