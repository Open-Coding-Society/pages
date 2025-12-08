// Leaderboard.js - ES6 Module version with integrated CSS and corrected API calls
export default class Leaderboard {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.API_BASE_URL = options.apiBaseUrl || '/api/gamer';
        this.injectStyles();
        this.init();
    }
    
    injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('leaderboard-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'leaderboard-styles';
        styleElement.textContent = `
/* Leaderboard Widget Styles */
.leaderboard-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 100px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 9999;
    overflow: hidden;
    transition: all 0.3s ease;
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.leaderboard-header h3 {
    margin: 0;
    color: white;
    font-size: 20px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    line-height: 1;
}

.toggle-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.leaderboard-content {
    background: white;
    max-height: 400px;
    overflow-y: auto;
    display: none;
}

.leaderboard-actions {
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.leaderboard-actions input {
    padding: 10px 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.leaderboard-actions input:focus {
    outline: none;
    border-color: #667eea;
}

.action-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.refresh-btn {
    background: #28a745;
    color: white;
}

.refresh-btn:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.leaderboard-list {
    padding: 16px;
    min-height: 200px;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table thead {
    background: #f8f9fa;
    position: sticky;
    top: 0;
}

.leaderboard-table th {
    padding: 12px 8px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: #6c757d;
    letter-spacing: 0.5px;
}

.leaderboard-row {
    border-bottom: 1px solid #f1f3f5;
    transition: background-color 0.2s ease;
    animation: slideIn 0.3s ease;
}

.leaderboard-row:hover {
    background-color: #f8f9fa;
}

.leaderboard-row:last-child {
    border-bottom: none;
}

.leaderboard-table td {
    padding: 12px 8px;
    font-size: 14px;
}

.rank {
    font-weight: 700;
    color: #fdfeffff;
    font-size: 16px;
    width: 50px;
}

.username {
    font-weight: 600;
    color: #f8fcffff;
}

.score {
    font-weight: 700;
    color: #667eea;
    font-size: 16px;
}

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.delete-btn:hover {
    background: #c82333;
    transform: scale(1.05);
}

.loading, .error, .empty {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
    font-size: 14px;
}

.error {
    color: #dc3545;
}

/* Scrollbar styling */
.leaderboard-content::-webkit-scrollbar {
    width: 8px;
}

.leaderboard-content::-webkit-scrollbar-track {
    background: #f1f3f5;
}

.leaderboard-content::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
}

.leaderboard-content::-webkit-scrollbar-thumb:hover {
    background: #5568d3;
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
    .leaderboard-widget {
        width: calc(100vw - 20px);
        bottom: 10px;
        right: 10px;
    }
    
    .leaderboard-header h3 {
        font-size: 18px;
    }
    
    .leaderboard-table th,
    .leaderboard-table td {
        padding: 8px 4px;
        font-size: 12px;
    }
    
    .rank {
        width: 40px;
        font-size: 14px;
    }
    
    .score {
        font-size: 14px;
    }
}

/* Animation for new entries */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
        `;
        
        document.head.appendChild(styleElement);
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
                <button id="toggle-leaderboard" class="toggle-btn">+</button>
            </div>
            <div class="leaderboard-content" style="display: none;">
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
            // GET /api/gamer/leaderboard
            const response = await fetch(`${this.API_BASE_URL}/leaderboard`);
            
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
        
        if (!data || data.length === 0) {
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
                    <td><button class="delete-btn" data-username="${this.escapeHtml(entry.username)}">Reset</button></td>
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
            // POST /api/gamer/score
            // Backend expects: { username: string, score: int }
            const response = await fetch(`${this.API_BASE_URL}/score`, {
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
            } else if (response.status === 404) {
                alert('Player not found. Please register first!');
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Failed to submit score. Please try again.');
        }
    }
    
    async handleDeleteScore(event) {
        const username = event.target.dataset.username;
        
        if (!confirm(`Are you sure you want to reset ${username}'s score to 0?`)) {
            return;
        }
        
        try {
            // POST /api/gamer/score with score of 0
            // Note: Backend only updates if new score is HIGHER than current
            // For a proper reset, we need to add a DELETE endpoint to the backend
            const response = await fetch(`${this.API_BASE_URL}/score`, {
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
                alert('Note: Score can only be updated if it\'s higher than current score.\nTo fully reset, you may need to add a DELETE endpoint to your backend.');
                this.fetchLeaderboard();
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error resetting score:', error);
            alert('Failed to reset score');
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
        // Optionally remove styles
        const styles = document.getElementById('leaderboard-styles');
        if (styles) {
            styles.remove();
        }
    }
}