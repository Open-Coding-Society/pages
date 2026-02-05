import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class Leaderboard {
    constructor(gameControl = null, options = {}) {
        this.gameControl = gameControl;
        this.gameName = options.gameName || 'Global';
        this.parentId = options.parentId || null;
        this.isOpen = false;
        this.mounted = false;
        this.mode = null; // 'dynamic' or 'elementary'
        this.showingTypeSelection = true;
        this.elementaryEntries = []; // Store elementary entries locally
        this.initiallyHidden = options.initiallyHidden !== false; // Default to hidden

        if (!javaURI) {
            console.error('[Leaderboard] javaURI is not defined');
            return;
        }

        try {
            this.injectStyles();
            this.init();
        } catch (error) {
            console.error('[Leaderboard] Initialization error:', error);
        }
    }

    injectStyles() {
        if (document.getElementById('leaderboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'leaderboard-styles';
        style.textContent = `
        .leaderboard-widget {
            width: 350px;
            background: #1a1a1a;
            border: 2px solid #333;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,.6);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 1000;
            overflow: hidden;
        }

        .leaderboard-widget.initially-hidden {
            display: none;
        }

        /* Embedded inside game canvas */
        .leaderboard-embedded {
            position: absolute;
            top: 20px;
            right: 20px;
        }

        /* Fallback if no parent */
        .leaderboard-fixed {
            position: fixed;
            top: 20px;
            right: 20px;
        }

        .leaderboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            color: white;
            font-size: 20px;
            font-weight: 700;
            background: #2d2d2d;
            border-bottom: 2px solid #444;
        }

        .toggle-btn {
            background: #3a3a3a;
            border: 1px solid #555;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 22px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .toggle-btn:hover {
            background: #4a4a4a;
            border-color: #666;
        }

        .leaderboard-content {
            background: #1a1a1a;
            max-height: 400px;
            overflow-y: auto;
        }

        .leaderboard-content.hidden {
            display: none !important;
        }

        .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
        }

        .leaderboard-table th,
        .leaderboard-table td {
            padding: 12px 8px;
            font-size: 14px;
            border-bottom: 1px solid #333;
        }

        .leaderboard-table th {
            color: #aaa;
            font-weight: 600;
            background: #252525;
        }

        .leaderboard-table td {
            color: #ddd;
        }

        .rank { font-weight: 800; color: #ffd700; }
        .username { font-weight: 600; color: #fff; }
        .score { font-weight: 800; color: #4a9eff; }

        /* Type selection styles */
        .type-selection {
            padding: 24px;
            text-align: center;
        }

        .type-selection h3 {
            margin: 0 0 20px 0;
            color: #fff;
            font-size: 18px;
        }

        .type-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .type-btn {
            padding: 14px 20px;
            border: 2px solid #4a9eff;
            background: #2d2d2d;
            color: #4a9eff;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .type-btn:hover {
            background: #4a9eff;
            color: #1a1a1a;
            border-color: #5aafff;
        }

        /* Elementary form styles */
        .elementary-form {
            padding: 20px;
            background: #1a1a1a;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #ccc;
            font-weight: 600;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 2px solid #333;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            background: #2d2d2d;
            color: #fff;
            transition: border-color 0.2s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #4a9eff;
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background: #4a9eff;
            color: #1a1a1a;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
            transition: all 0.2s;
        }

        .submit-btn:hover {
            background: #5aafff;
            transform: translateY(-1px);
        }

        .loading, .error {
            padding: 20px;
            text-align: center;
            color: #aaa;
        }

        .error {
            color: #ff6b6b;
        }

        .back-btn {
            background: #3a3a3a;
            border: 1px solid #555;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.2s;
        }

        .back-btn:hover {
            background: #4a4a4a;
            border-color: #666;
        }

        .delete-btn {
            background: #ff6b6b;
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .delete-btn:hover {
            background: #ff5252;
            transform: translateY(-1px);
        }
        `;
        document.head.appendChild(style);
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.mount());
        } else {
            this.mount();
        }
    }

    mount() {
        if (this.mounted) return;

        let parent = document.body;
        let embedded = false;

        if (this.parentId) {
            const el = document.getElementById(this.parentId);
            if (el) {
                parent = el;
                embedded = true;

                const style = window.getComputedStyle(parent);
                if (style.position === 'static') {
                    parent.style.position = 'relative';
                }
            }
        }

        const container = document.createElement('div');
        container.id = 'leaderboard-container';
        container.className = `leaderboard-widget ${
            embedded ? 'leaderboard-embedded' : 'leaderboard-fixed'
        }${this.initiallyHidden ? ' initially-hidden' : ''}`;

        container.innerHTML = `
            <div class="leaderboard-header">
                <div>
                    <button id="back-btn" class="back-btn" style="display:none;">← Back</button>
                    <span id="leaderboard-title">🏆 Leaderboard</span>
                    <span id="leaderboard-preview"
                          style="font-size:16px;font-weight:700;margin-left:8px;display:none;">Collapse to choose a leaderboard</span>
                </div>
                <button id="toggle-leaderboard" class="toggle-btn">+</button>
            </div>
            <div class="leaderboard-content hidden" id="leaderboard-content">
                <div id="leaderboard-list"></div>
            </div>
        `;

        parent.appendChild(container);
        this.mounted = true;

        document
            .getElementById('toggle-leaderboard')
            .addEventListener('click', () => this.toggle());

        document
            .getElementById('back-btn')
            .addEventListener('click', () => this.goBack());

        this.showTypeSelection();
    }

    toggle() {
        const content = document.getElementById('leaderboard-content');
        const btn = document.getElementById('toggle-leaderboard');
        const preview = document.getElementById('leaderboard-preview');
        const title = document.getElementById('leaderboard-title');

        this.isOpen = !this.isOpen;
        content.classList.toggle('hidden', !this.isOpen);
        btn.textContent = this.isOpen ? '−' : '+';

        if (preview && title) {
            if (this.isOpen) {
                // When open: show title, hide preview
                title.style.display = 'inline';
                preview.style.display = 'none';
            } else {
                // When collapsed: hide title, show preview
                title.style.display = 'none';
                preview.style.display = 'inline';
            }
        }
    }

    goBack() {
        // Clear any intervals
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }

        // Reset state
        this.mode = null;
        this.showingTypeSelection = true;

        // Hide back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'none';

        // Reset preview to initial text
        const preview = document.getElementById('leaderboard-preview');
        if (preview) preview.textContent = 'Collapse to choose a leaderboard';

        // Show type selection
        this.showTypeSelection();
    }

    showTypeSelection() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        list.innerHTML = `
            <div class="type-selection">
                <h3>Choose Leaderboard Type</h3>
                <div class="type-buttons">
                    <button class="type-btn" id="dynamic-btn">Dynamic Leaderboard</button>
                    <button class="type-btn" id="elementary-btn">Elementary Leaderboard</button>
                </div>
            </div>
        `;

        document.getElementById('dynamic-btn').addEventListener('click', () => {
            this.mode = 'dynamic';
            this.showingTypeSelection = false;
            this.setupDynamicMode();
        });

        document.getElementById('elementary-btn').addEventListener('click', () => {
            this.mode = 'elementary';
            this.showingTypeSelection = false;
            this.setupElementaryMode();
        });
    }

    setupDynamicMode() {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '<p class="loading">Loading dynamic leaderboard…</p>';
        
        // Show back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'inline-block';
        
        // Start auto-updating
        this.fetchLeaderboard();
        this.refreshInterval = setInterval(() => this.fetchLeaderboard(), 30000);
    }

    setupElementaryMode() {
        // Show back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'inline-block';
        
        // Fetch existing data from backend
        this.fetchElementaryLeaderboard().then(() => {
            this.showElementaryForm();
        });
    }

    showElementaryForm() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        // Check if we have existing entries to display
        if (this.elementaryEntries.length > 0) {
            // Show the full leaderboard with "Add Another Score" button
            this.displayElementaryLeaderboard();
        } else {
            // Show the form for first entry
            list.innerHTML = `
                <div class="elementary-form">
                    <div class="form-group">
                        <label for="player-name">Player Name</label>
                        <input type="text" id="player-name" placeholder="Enter name" />
                    </div>
                    <div class="form-group">
                        <label for="player-score">Score</label>
                        <input type="number" id="player-score" placeholder="Enter score" />
                    </div>
                    <button class="submit-btn" id="add-score-btn">Add Score</button>
                </div>
            `;

            // Bind event listeners after innerHTML is set
            const addScoreBtn = document.getElementById('add-score-btn');
            const scoreInput = document.getElementById('player-score');
            
            if (addScoreBtn) {
                addScoreBtn.addEventListener('click', () => {
                    this.addElementaryScore();
                });
            }

            // Allow Enter key to submit
            if (scoreInput) {
                scoreInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addElementaryScore();
                });
            }
        }
    }

    async addElementaryScore() {
        console.log('=== ADD ELEMENTARY SCORE ===');
        const nameInput = document.getElementById('player-name');
        const scoreInput = document.getElementById('player-score');

        const name = nameInput.value.trim();
        const score = parseInt(scoreInput.value);

        if (!name || isNaN(score)) {
            alert('Please enter both name and score');
            return;
        }

        const endpoint = '/api/events/ELEMENTARY_LEADERBOARD';
        console.log('POST endpoint:', endpoint);

        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            const url = `${base.replace(/\/$/, '')}${endpoint}`;
            console.log('Full URL:', url);

            // Create payload matching Java backend AlgorithmicEvent structure
            const requestBody = {
                payload: {
                    user: name,
                    score: score,
                    gameName: this.gameName
                }
            };
            console.log('Payload:', JSON.stringify(requestBody));

            // POST to backend - using include credentials for authentication
            const res = await fetch(
                url,
                {
                    ...fetchOptions,
                    method: 'POST',
                    headers: {
                        ...fetchOptions?.headers,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Changed from 'omit' to 'include'
                    body: JSON.stringify(requestBody)
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Server error:', errorText);
                throw new Error(`Failed to save score: ${res.status} - ${errorText}`);
            }

            const savedEntry = await res.json();
            console.log('Score saved successfully:', savedEntry);

            // Clear inputs
            nameInput.value = '';
            scoreInput.value = '';

            // Fetch updated leaderboard from backend
            await this.fetchElementaryLeaderboard();

        } catch (error) {
            console.error('Error adding score:', error);
            
            // Check if it's a network error
            if (error.message.includes('Failed to fetch')) {
                alert('Network error: Unable to connect to server. Please check if the backend is running.');
            } else {
                alert(`Failed to save score: ${error.message}`);
            }
        }
    }

    async deleteElementaryScore(id) {
        if (!confirm('Are you sure you want to delete this score?')) {
            return;
        }

        console.log('=== DELETE SCORE ===');
        console.log('Deleting ID:', id);

        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            // Note: GenericEventController doesn't have a DELETE endpoint
            // You may need to add one to your backend or handle deletion differently
            const url = `${base.replace(/\/$/, '')}/api/events/ELEMENTARY_LEADERBOARD/${id}`;
            console.log('DELETE URL:', url);

            // DELETE from backend - using include credentials for authentication
            const res = await fetch(
                url,
                {
                    method: 'DELETE',
                    credentials: 'include' // Changed from 'omit' to 'include'
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Delete failed:', res.status, errorText);
                throw new Error(`Failed to delete: ${res.status} - ${errorText}`);
            }

            console.log('Score deleted successfully');

            // Fetch updated leaderboard from backend
            await this.fetchElementaryLeaderboard();

        } catch (error) {
            console.error('Error deleting score:', error);
            alert(`Failed to delete score: ${error.message}`);
        }
    }

    async fetchElementaryLeaderboard() {
        console.log('=== FETCHING ELEMENTARY LEADERBOARD ===');
        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            const url = `${base.replace(/\/$/, '')}/api/events/ELEMENTARY_LEADERBOARD`;
            console.log('Fetching from:', url);

            const res = await fetch(
                url,
                { 
                    method: 'GET', 
                    credentials: 'include' // Changed from 'omit' to 'include'
                }
            );

            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            
            console.log('Received data:', data);
            console.log('Number of entries:', data.length);
            
            // Transform backend data to frontend format
            // Backend returns AlgorithmicEvent with payload field
            this.elementaryEntries = data
                .map(event => ({
                    id: event.id,
                    user: event.payload?.user || 'Anonymous',
                    score: event.payload?.score || 0,
                    gameName: event.payload?.gameName || this.gameName,
                    timestamp: event.timestamp
                }))
                .sort((a, b) => b.score - a.score); // Sort by score descending
            
            console.log('Transformed elementaryEntries:', this.elementaryEntries);
            
            // Force display update
            this.displayElementaryLeaderboard();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            // Don't fall back to local data - show empty if fetch fails
            this.elementaryEntries = [];
            this.displayElementaryLeaderboard();
        }
    }

    displayElementaryLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const preview = document.getElementById('leaderboard-preview');

        if (!list) return;

        let html = '';

        // Only update preview if there are entries
        if (this.elementaryEntries.length > 0) {
            const top = this.elementaryEntries[0];
            if (preview) {
                preview.textContent = `High Score: ${top.user} - ${Number(top.score).toLocaleString()}`;
            }

            html = `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            this.elementaryEntries.forEach((e, i) => {
                html += `
                    <tr>
                        <td class="rank">${i + 1}</td>
                        <td class="username">${this.escape(e.user)}</td>
                        <td class="score">${Number(e.score).toLocaleString()}</td>
                        <td><button class="delete-btn" data-id="${e.id}">Delete</button></td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
        }
        
        // Always show form to add more scores
        html += `
            <div class="elementary-form" style="border-top: 2px solid #333; margin-top: 12px;">
                <div class="form-group">
                    <label for="player-name">Player Name</label>
                    <input type="text" id="player-name" placeholder="Enter name" />
                </div>
                <div class="form-group">
                    <label for="player-score">Score</label>
                    <input type="number" id="player-score" placeholder="Enter score" />
                </div>
                <button class="submit-btn" id="add-score-btn">Add Score</button>
            </div>
        `;

        // Set innerHTML to clear old content and listeners
        list.innerHTML = html;

        // Bind event listeners after setting innerHTML
        const addScoreBtn = document.getElementById('add-score-btn');
        const scoreInput = document.getElementById('player-score');
        
        if (addScoreBtn) {
            addScoreBtn.addEventListener('click', () => {
                this.addElementaryScore();
            });
        }

        // Allow Enter key to submit
        if (scoreInput) {
            scoreInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addElementaryScore();
            });
        }

        // Bind delete button event listeners for each delete button
        const deleteButtons = list.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                this.deleteElementaryScore(id);
            });
        });
    }

    async fetchLeaderboard() {
        if (this.mode !== 'dynamic') return;

        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            const res = await fetch(
                `${base.replace(/\/$/, '')}/api/events/SCORE_COUNTER`,
                { ...fetchOptions, method: 'GET', credentials: 'include' }
            );

            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            this.displayLeaderboard(data);
        } catch {
            list.innerHTML = `<p class="error">Failed to load leaderboard</p>`;
        }
    }

    displayLeaderboard(data) {
        const list = document.getElementById('leaderboard-list');
        const preview = document.getElementById('leaderboard-preview');

        // Transform backend data to frontend format
        // Backend returns: { id, user (User object or null), algoName, payload, timestamp }
        // Frontend needs: { user (string), score, gameName }
        const transformedData = data
            .map(event => ({
                id: event.id,
                user: event.payload?.user || event.payload?.username || 'Anonymous',
                username: event.payload?.user || event.payload?.username || 'Anonymous',
                score: event.payload?.score || 0,
                gameName: event.payload?.gameName || event.payload?.game || 'Unknown',
                game: event.payload?.gameName || event.payload?.game || 'Unknown',
                timestamp: event.timestamp
            }))
            .sort((a, b) => b.score - a.score); // Sort by score descending

        if (!Array.isArray(transformedData) || !transformedData.length) {
            list.innerHTML = '<p>No scores yet</p>';
            return;
        }

        const top = transformedData[0];
        if (preview) {
            preview.textContent = `High Score: ${top.user || top.username} - ${Number(top.score).toLocaleString()}`;
        }

        let html = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Game</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
        `;

        transformedData.forEach((e, i) => {
            html += `
                <tr>
                    <td class="rank">${i + 1}</td>
                    <td class="username">${this.escape(e.user || e.username)}</td>
                    <td>${this.escape(e.gameName || e.game)}</td>
                    <td class="score">${Number(e.score).toLocaleString()}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        list.innerHTML = html;
    }

    escape(str = '') {
        return String(str).replace(/[&<>"']/g, m =>
            ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])
        );
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        document.getElementById('leaderboard-container')?.remove();
    }

    /**
     * Toggle visibility of the entire leaderboard widget
     */
    toggleVisibility() {
        const container = document.getElementById('leaderboard-container');
        if (container) {
            if (container.style.display === 'none' || container.classList.contains('initially-hidden')) {
                container.style.display = 'block';
                container.classList.remove('initially-hidden');
            } else {
                container.style.display = 'none';
            }
        }
    }

    /**
     * Check if leaderboard is currently visible
     */
    isVisible() {
        const container = document.getElementById('leaderboard-container');
        return container && container.style.display !== 'none' && !container.classList.contains('initially-hidden');
    }
}