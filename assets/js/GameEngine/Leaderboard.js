import { javaURI, fetchOptions } from '/assets/js/api/config.js';

class Leaderboard {
    constructor(gameControl = null, options = {}) {
        this.gameControl = gameControl;
        this.gameName = options.gameName || 'Global';
        this.isOpen = true; // ✅ TRACK STATE
        this.injectStyles();
        this.init();
    }

    injectStyles() {
        if (document.getElementById('leaderboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'leaderboard-styles';
        style.textContent = `
        .leaderboard-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,.35);
            font-family: system-ui, -apple-system, BlinkMacSystemFont;
            z-index: 999999;
            overflow: hidden;
        }

        .leaderboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            color: white;
            font-size: 20px;
            font-weight: 700;
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
            line-height: 1;
        }

        .leaderboard-content {
            background: white;
            max-height: 400px;
            overflow-y: auto;
            display: block;
        }

        .leaderboard-content.hidden {
            display: none;
        }

        .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 10px;
            font-size: 14px;
            text-align: left;
        }

        th {
            background: #f1f3f5;
            font-weight: 700;
        }

        .rank { font-weight: 800; }
        .score { font-weight: 800; color: #667eea; }

        .loading, .error, .empty {
            padding: 30px;
            text-align: center;
            color: #6c757d;
        }

        .error { color: #dc3545; }
        `;
        document.head.appendChild(style);
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.mount());
        } else {
            this.mount();
        }

        this.refreshInterval = setInterval(() => this.fetchLeaderboard(), 30000);
    }

    mount() {
        const existing = document.getElementById('leaderboard-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'leaderboard-container';
        container.className = 'leaderboard-widget';

        container.innerHTML = `
            <div class="leaderboard-header">
                🏆 Leaderboard
                <button id="toggle-leaderboard" class="toggle-btn">−</button>
            </div>
            <div class="leaderboard-content" id="leaderboard-content">
                <div id="leaderboard-list">
                    <p class="loading">Loading leaderboard…</p>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        document
            .getElementById('toggle-leaderboard')
            .addEventListener('click', () => this.toggle());

        this.fetchLeaderboard();
    }

    toggle() {
        const content = document.getElementById('leaderboard-content');
        const btn = document.getElementById('toggle-leaderboard');
        if (!content || !btn) return;

        this.isOpen = !this.isOpen;

        content.classList.toggle('hidden', !this.isOpen);
        btn.textContent = this.isOpen ? '−' : '+';
    }

    async fetchLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        list.innerHTML = '<p class="loading">Loading…</p>';

        try {
            const res = await fetch(`${javaURI}/api/leaderboard`, fetchOptions);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.displayLeaderboard(data);
        } catch (err) {
            console.error('[Leaderboard] Fetch error:', err);
            list.innerHTML = '<p class="error">Failed to load leaderboard</p>';
        }
    }

    displayLeaderboard(data) {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        if (!Array.isArray(data) || data.length === 0) {
            list.innerHTML = '<p class="empty">No scores yet</p>';
            return;
        }

        let html = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>User</th>
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
                <td>${this.escape(e.user)}</td>
                <td>${this.escape(e.gameName)}</td>
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
}

/* 🔥 AUTO-BOOT 🔥 */
window.addEventListener('DOMContentLoaded', () => {
    new Leaderboard();
});

export default Leaderboard;
