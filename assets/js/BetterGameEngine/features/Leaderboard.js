import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class Leaderboard {
    constructor(gameControl = null, options = {}) {
        this.gameControl = gameControl;
        this.gameName = options.gameName || 'Global';
        this.parentId = options.parentId || null; // NEW: Accept parentId option
        this.isOpen = true;
        this.mounted = false;
        
        // Validate javaURI exists
        if (!javaURI) {
            console.error('[Leaderboard] javaURI is not defined - cannot initialize leaderboard');
            return;
        }
        
        console.log('[Leaderboard] Initializing with javaURI:', javaURI);
        console.log('[Leaderboard] Parent ID:', this.parentId); // NEW: Log parent
        
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
            position: absolute !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 350px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,.35);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            z-index: 999999 !important;
            overflow: hidden;
            display: block !important;
            visibility: visible !important;
        }

        /* Fixed positioning for when NOT in a game container */
        .leaderboard-widget.fixed-position {
            position: fixed !important;
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
            line-height: 1;
            transition: all 0.3s ease;
        }

        .toggle-btn:hover {
            background: rgba(255,255,255,.3);
            transform: scale(1.1);
        }

        .leaderboard-content {
            background: white;
            max-height: 400px;
            overflow-y: auto;
            display: block;
        }

        .leaderboard-content.hidden {
            display: none !important;
        }

        .leaderboard-list {
            padding: 16px;
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
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #6c757d;
            text-align: left;
        }

        .leaderboard-table td {
            padding: 12px 8px;
            font-size: 14px;
            border-bottom: 1px solid #f1f3f5;
        }

        .leaderboard-table tbody tr {
            background: white;
            transition: background-color 0.2s ease;
        }

        .leaderboard-table tbody tr:hover {
            background: #f8f9fa;
        }

        .rank { 
            font-weight: 800;
            color: #495057;
            font-size: 16px;
        }
        
        .username {
            font-weight: 600;
            color: #212529;
        }

        .game-name {
            color: #6c757d;
            font-size: 12px;
        }

        .score { 
            font-weight: 800; 
            color: #667eea;
            font-size: 16px;
        }

        .loading, .error, .empty {
            padding: 40px 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }

        .error { 
            color: #dc3545;
            font-weight: 600;
        }

        /* Scrollbar */
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
        `;
        document.head.appendChild(style);
        console.log('[Leaderboard] Styles injected');
    }

    init() {
        console.log('[Leaderboard] Init called, readyState:', document.readyState);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Leaderboard] DOMContentLoaded fired, mounting...');
                this.mount();
            });
        } else {
            console.log('[Leaderboard] DOM already ready, mounting immediately...');
            this.mount();
        }

        this.refreshInterval = setInterval(() => {
            console.log('[Leaderboard] Auto-refresh triggered');
            this.fetchLeaderboard();
        }, 30000);
    }

    mount() {
        console.log('[Leaderboard] Mount called');
        
        // Don't mount if already mounted
        if (this.mounted) {
            console.log('[Leaderboard] Already mounted, skipping');
            return;
        }
        
        const existing = document.getElementById('leaderboard-container');
        if (existing) {
            console.log('[Leaderboard] Removing existing container');
            existing.remove();
        }

        const container = document.createElement('div');
        container.id = 'leaderboard-container';
        container.className = 'leaderboard-widget';
        
        // NEW: Determine parent element
        let parentElement = document.body;
        let useFixedPosition = true;
        
        if (this.parentId) {
            const parent = document.getElementById(this.parentId);
            if (parent) {
                parentElement = parent;
                useFixedPosition = false;
                console.log('[Leaderboard] Mounting to parent:', this.parentId);
                
                // Ensure parent has position relative for absolute positioning to work
                const parentStyle = window.getComputedStyle(parent);
                if (parentStyle.position === 'static') {
                    parent.style.position = 'relative';
                    console.log('[Leaderboard] Set parent position to relative');
                }
            } else {
                console.warn('[Leaderboard] Parent element not found:', this.parentId);
            }
        }
        
        // Apply appropriate positioning class
        if (useFixedPosition) {
            container.classList.add('fixed-position');
            container.style.cssText = 'position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 999999 !important; display: block !important;';
        } else {
            container.style.cssText = 'position: absolute !important; bottom: 20px !important; right: 20px !important; z-index: 999999 !important; display: block !important;';
        }

        container.innerHTML = `
            <div class="leaderboard-header">
                🏆 Leaderboard
                <button id="toggle-leaderboard" class="toggle-btn">−</button>
            </div>
            <div class="leaderboard-content" id="leaderboard-content">
                <div class="leaderboard-list" id="leaderboard-list">
                    <p class="loading">Loading leaderboard…</p>
                </div>
            </div>
        `;

        parentElement.appendChild(container);
        this.mounted = true;
        console.log('[Leaderboard] Container appended to:', parentElement.id || 'body');
        console.log('[Leaderboard] Container in DOM?', document.getElementById('leaderboard-container') !== null);

        const toggleBtn = document.getElementById('toggle-leaderboard');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
            console.log('[Leaderboard] Toggle button listener attached');
        }

        this.fetchLeaderboard();
    }

    toggle() {
        const content = document.getElementById('leaderboard-content');
        const btn = document.getElementById('toggle-leaderboard');
        if (!content || !btn) return;

        this.isOpen = !this.isOpen;
        content.classList.toggle('hidden', !this.isOpen);
        btn.textContent = this.isOpen ? '−' : '+';
        console.log('[Leaderboard] Toggled, isOpen:', this.isOpen);
    }

    async fetchLeaderboard() {
        console.log('[Leaderboard] fetchLeaderboard called');
        const list = document.getElementById('leaderboard-list');
        if (!list) {
            console.warn('[Leaderboard] List element not found');
            return;
        }

        list.innerHTML = '<p class="loading">Loading…</p>';

        try {
            // Determine backend URL with same priority as PauseMenu
            let backendBase = null;
            
            // Priority 1: Check for window.javaBackendUrl
            if (typeof window !== 'undefined' && window.javaBackendUrl) {
                backendBase = String(window.javaBackendUrl);
            }
            // Priority 2: localhost development shortcut
            else if (typeof window !== 'undefined' && window.location && 
                     (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                backendBase = 'http://localhost:8585';
            }
            // Priority 3: Use imported javaURI from config
            else if (javaURI) {
                backendBase = String(javaURI);
            }
            // Priority 4: Same-origin fallback
            else if (typeof window !== 'undefined' && window.location && window.location.origin) {
                backendBase = String(window.location.origin);
            }
            
            if (!backendBase) {
                throw new Error('No backend URL configured');
            }
            
            const url = `${backendBase.replace(/\/$/, '')}/api/leaderboard`;
            console.log('[Leaderboard] Fetching from:', url);
            
            // Use fetchOptions from config with GET method, but override credentials
            const requestOptions = {
                ...fetchOptions,    // Copy all properties from fetchOptions
                method: 'GET',      // Override to use GET method
                credentials: 'omit' // Override credentials to omit for public leaderboard
            };
            
            console.log('[Leaderboard] Fetch options:', requestOptions);
            
            const res = await fetch(url, requestOptions);
            console.log('[Leaderboard] Response status:', res.status);
            
            if (!res.ok) {
                const errorMsg = 'Error: ' + res.status;
                console.log(errorMsg);
                throw new Error(`HTTP ${res.status}`);
            }
            
            const data = await res.json();
            console.log('[Leaderboard] Data received:', data);
            this.displayLeaderboard(data);
        } catch (err) {
            console.error('[Leaderboard] Fetch error:', err);
            
            // More user-friendly error messages
            let errorMsg = 'Failed to load leaderboard';
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || 
                err.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMsg = 'Cannot connect to server - is it running on port 8585?';
            } else if (err.message.includes('CORS')) {
                errorMsg = 'Possible CORS or Service Down error';
            } else if (err.message.includes('404')) {
                errorMsg = 'Leaderboard endpoint not found';
            } else if (err.message.includes('500')) {
                errorMsg = 'Server error - please try again later';
            } else if (err.message.includes('No backend URL')) {
                errorMsg = 'Backend URL not configured';
            }
            
            list.innerHTML = `<p class="error">${errorMsg}<br/><small>${err.message}</small></p>`;
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
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Game</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
        `;

        data.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            // Handle both camelCase and snake_case field names from backend
            const user = entry.user || entry.username || 'Unknown';
            const gameName = entry.gameName || entry.game_name || entry.game || 'Unknown';
            const score = entry.score || 0;
            
            html += `
            <tr>
                <td class="rank">${medal || (index + 1)}</td>
                <td class="username">${this.escape(user)}</td>
                <td class="game-name">${this.escape(gameName)}</td>
                <td class="score">${Number(score).toLocaleString()}</td>
            </tr>
            `;
        });

        html += '</tbody></table>';
        list.innerHTML = html;
        console.log('[Leaderboard] Displayed', data.length, 'entries');
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
        const container = document.getElementById('leaderboard-container');
        if (container) {
            container.remove();
        }
    }
}