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
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,.35);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 1000;
            overflow: hidden;
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
            background: rgba(255,255,255,0.1);
        }

        .toggle-btn {
            background: rgba(255,255,255,.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 22px;
            cursor: pointer;
        }

        .leaderboard-content {
            background: white;
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
            border-bottom: 1px solid #f1f3f5;
        }

        .rank { font-weight: 800; }
        .username { font-weight: 600; }
        .score { font-weight: 800; color: #667eea; }

        /* Type selection styles */
        .type-selection {
            padding: 24px;
            text-align: center;
        }

        .type-selection h3 {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 18px;
        }

        .type-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .type-btn {
            padding: 14px 20px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .type-btn:hover {
            background: #667eea;
            color: white;
        }

        /* Elementary form styles */
        .elementary-form {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 2px solid #e1e8ed;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
        }

        .submit-btn:hover {
            background: #5568d3;
        }

        .loading, .error {
            padding: 20px;
            text-align: center;
            color: #666;
        }

        .error {
            color: #e74c3c;
        }

        .back-btn {
            background: rgba(255,255,255,.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
        }

        .back-btn:hover {
            background: rgba(255,255,255,.3);
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
        }`;

        container.innerHTML = `
            <div class="leaderboard-header">
                <div>
                    <button id="back-btn" class="back-btn" style="display:none;">← Back</button>
                    🏆 Leaderboard
                    <span id="leaderboard-preview"
                          style="font-size:14px;font-weight:500;margin-left:8px;"></span>
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

        this.isOpen = !this.isOpen;
        content.classList.toggle('hidden', !this.isOpen);
        btn.textContent = this.isOpen ? '−' : '+';

        if (preview) {
            preview.style.display = this.isOpen ? 'none' : 'inline';
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

        // Clear preview
        const preview = document.getElementById('leaderboard-preview');
        if (preview) preview.textContent = '';

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

        document.getElementById('add-score-btn').addEventListener('click', () => {
            this.addElementaryScore();
        });

        // Allow Enter key to submit
        document.getElementById('player-score').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addElementaryScore();
        });

        // Display existing entries if any
        if (this.elementaryEntries.length > 0) {
            this.displayElementaryLeaderboard();
        }
    }

    async addElementaryScore() {
        const nameInput = document.getElementById('player-name');
        const scoreInput = document.getElementById('player-score');

        const name = nameInput.value.trim();
        const score = parseInt(scoreInput.value);

        if (!name || isNaN(score)) {
            alert('Please enter both name and score');
            return;
        }

        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            // POST to backend
            const res = await fetch(
                `${base.replace(/\/$/, '')}/api/leaderboard`,
                {
                    ...fetchOptions,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: name,
                        username: name,
                        score: score,
                        gameName: this.gameName,
                        game: this.gameName
                    })
                }
            );

            if (!res.ok) throw new Error('Failed to save score');

            // Add to local array
            this.elementaryEntries.push({
                user: name,
                username: name,
                score: score,
                gameName: this.gameName,
                game: this.gameName
            });

            // Sort by score descending
            this.elementaryEntries.sort((a, b) => b.score - a.score);

            // Clear inputs
            nameInput.value = '';
            scoreInput.value = '';

            // Fetch updated leaderboard from backend
            await this.fetchElementaryLeaderboard();

        } catch (error) {
            console.error('Error adding score:', error);
            alert('Failed to save score. Please try again.');
        }
    }

    async fetchElementaryLeaderboard() {
        try {
            const base =
                window.javaBackendUrl ||
                (location.hostname === 'localhost' ? 'http://localhost:8585' : javaURI);

            const res = await fetch(
                `${base.replace(/\/$/, '')}/api/leaderboard`,
                { ...fetchOptions, method: 'GET', credentials: 'omit' }
            );

            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            
            // Update local entries with backend data
            this.elementaryEntries = data;
            this.displayElementaryLeaderboard();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            // Fall back to local data if fetch fails
            this.displayElementaryLeaderboard();
        }
    }

    displayElementaryLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const preview = document.getElementById('leaderboard-preview');

        if (!this.elementaryEntries.length) return;

        const top = this.elementaryEntries[0];
        preview.textContent =
            ` – High Score: ${top.user}: ${Number(top.score).toLocaleString()}`;

        let html = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
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
                </tr>
            `;
        });

        html += '</tbody></table>';
        
        // Add button to add more scores
        html += `
            <div style="padding: 12px; border-top: 2px solid #f1f3f5;">
                <button class="submit-btn" id="add-another-btn">Add Another Score</button>
            </div>
        `;

        list.innerHTML = html;

        document.getElementById('add-another-btn').addEventListener('click', () => {
            this.showElementaryForm();
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
                `${base.replace(/\/$/, '')}/api/leaderboard`,
                { ...fetchOptions, method: 'GET', credentials: 'omit' }
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

        if (!Array.isArray(data) || !data.length) {
            list.innerHTML = '<p>No scores yet</p>';
            return;
        }

        const top = data[0];
        preview.textContent =
            ` – High Score: ${top.user || top.username}: ${Number(top.score).toLocaleString()}`;

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

        data.forEach((e, i) => {
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
}