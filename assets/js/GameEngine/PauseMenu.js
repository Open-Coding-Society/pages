// PauseMenu.js - reusable pause menu component for mansion games
export default class PauseMenu {
    constructor(gameControl, options = {}) {
        this.gameControl = gameControl;
        this.container = null;
        this.options = Object.assign({
            parentId: 'gameContainer',
            cssPath: '/assets/css/pause-menu.css',
            // optional backend base URL for server persistence (e.g. http://localhost:8585)
            // default to localhost where your Spring Boot usually runs during development
            backendUrl: 'http://localhost:8585',
            // optional playerName and gameType for server-side lookups
            // sensible defaults applied below if not provided
            playerName: null,
            gameType: null
            ,
            // which localStorage key to read auth token from (if present)
            // Note: score persistence no longer uses localStorage
            authTokenKey: 'authToken'
        }, options);

    // configurable counter variable and label
    this.counterVar = this.options.counterVar || 'levelsCompleted';
    this.counterLabelText = this.options.counterLabel || 'Levels completed';
    // single logical score variable name for PauseMenu; can be mapped to any game stat
    this.scoreVar = this.options.scoreVar || this.counterVar;
    // local cached score value (kept in sync with gameControl.stats when present)
    this.score = 0;

        this._ensureCssLoaded();
        this._createDom();
        // Register ourselves on the provided GameControl so Escape can toggle the menu
        try {
            if (this.gameControl) {
                this.gameControl.pauseMenu = this;
            }
        } catch (e) {
            console.warn('PauseMenu: could not register with gameControl', e);
        }
        // Initialize stats storage on the GameControl so other code (and backend) can access it later.
        try {
            if (this.gameControl) {
                if (!this.gameControl.stats) this.gameControl.stats = { levelsCompleted: 0, points: 0 };
                this.stats = this.gameControl.stats;
                // apply sensible defaults for playerName and gameType if not provided
                try {
                    if (!this.options.playerName) {
                        // try authenticated user from window.user (set by login.js), then localStorage, otherwise default to 'guest'
                        try {
                            this.options.playerName = (window.user && window.user.uid) || window.localStorage.getItem('playerName') || 'guest';
                        } catch (e) { this.options.playerName = 'guest'; }
                    }
                    if (!this.options.gameType) {
                        // derive gameType from storageKey suffix or gameControl path
                        try {
                            const sk = this._storageKey();
                            const suffix = sk && sk.indexOf(':') !== -1 ? sk.split(':',2)[1] : null;
                            this.options.gameType = suffix || (this.gameControl && (this.gameControl.game && this.gameControl.game.name)) || 'unknown';
                        } catch (e) { this.options.gameType = 'unknown'; }
                    }
                } catch (e) { /* ignore */ }

                // Load any existing historical stats from backend (high scores, etc.)
                try {
                    if (!this._attemptedServerLoad) {
                        this._attemptedServerLoad = true;
                        try { this._loadStatsFromServer().catch(()=>{}); } catch(e){}
                    }
                } catch (e) { /* ignore */ }

                // Load any existing stats into gameControl so game logic can own the values
                // PauseMenu will only display the configured variable from gameControl.
                // Keep this.stats as a mirror of gameControl.stats when present.
                if (!this.gameControl.stats) this.gameControl.stats = Object.assign({ levelsCompleted: 0, points: 0 }, this.gameControl.stats || {});
                this.stats = this.gameControl.stats;
                // Always start a new run at score 0
                try { this._resetCurrentRunScore(); this._updateStatsDisplay(); } catch (e) { /* ignore */ }
            }
        } catch (e) {
            console.warn('PauseMenu: could not initialize stats on gameControl', e);
        }
    }

    // Returns whether per-level mode is enabled. Preference order:
    // 1. explicit option on this.options
    // 2. per-game option on gameControl.pauseMenuOptions
    // 3. default false
    isPerLevelMode() {
        if (this.options && typeof this.options.counterPerLevel !== 'undefined') return !!this.options.counterPerLevel;
        if (this.gameControl && this.gameControl.pauseMenuOptions && typeof this.gameControl.pauseMenuOptions.counterPerLevel !== 'undefined') return !!this.gameControl.pauseMenuOptions.counterPerLevel;
        return false;
    }

    // Set per-level mode programmatically. This updates both local options and the gameControl's pauseMenuOptions
    // so the mode is consistent for persistence and future PauseMenu instances.
    setPerLevelMode(enabled) {
        const flag = !!enabled;
        if (!this.options) this.options = {};
        this.options.counterPerLevel = flag;
        try {
            if (this.gameControl && this.gameControl.pauseMenuOptions) {
                this.gameControl.pauseMenuOptions.counterPerLevel = flag;
            }
        } catch (e) { /* ignore */ }
        // refresh UI and persist
        this._updateStatsDisplay();
        this._saveStatsToStorage();
    }

    togglePerLevelMode() {
        this.setPerLevelMode(!this.isPerLevelMode());
    }

    _storageKey() {
        // Priority for storage key:
        // 1. explicit option passed to PauseMenu (options.storageKey)
        // 2. per-game option set on GameControl (gameControl.pauseMenuOptions.storageKey)
        // 3. fallback to a path-based key
        if (this.options && this.options.storageKey) return this.options.storageKey;
        if (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.storageKey) {
            return this.gameControl.pauseMenuOptions.storageKey;
        }
        const id = (this.gameControl && (this.gameControl.path || this.gameControl.game?.path)) || 'default';
        return `pauseMenuStats:${id}`;
    }

    // localStorage persistence removed per requirements

    // Removed: _saveStatsToStorage (backend-only saving now)

    // Compose the pause-menu server API base path (defaults to provided option or null)
    _backendBase() {
        return (this.options && this.options.backendUrl) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.backendUrl) || null;
    }

    // Read auth token either from options or from localStorage (key configurable)
    _authToken() {
        try {
            if (this.options && this.options.authToken) return this.options.authToken;
            const key = (this.options && this.options.authTokenKey) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.authTokenKey) || 'authToken';
            // If you have a session token in memory, supply via options; no localStorage dependency.
        } catch (e) {
            /* ignore */
        }
        return null;
    }

    // Resolve the current user id used by the backend (defaults to window.user.uid or playerName option)
    _currentUserId() {
        try {
            if (this.options && this.options.user) return this.options.user;
            if (typeof window !== 'undefined') {
                if (window.user && window.user.uid) return window.user.uid;
                if (window.localStorage) {
                    const stored = window.localStorage.getItem('playerName');
                    if (stored) return stored;
                }
            }
            if (this.options && this.options.playerName) return this.options.playerName;
            if (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.playerName) {
                return this.gameControl.pauseMenuOptions.playerName;
            }
        } catch (e) { /* ignore */ }
        return null;
    }

    // Build the DTO expected by the backend controller (save/update score)
    _buildServerDto() {
        const uid = this._currentUserId();
        const levels = this.stats && this.stats[this.counterVar || 'levelsCompleted'] ? Number(this.stats[this.counterVar || 'levelsCompleted']) : 0;
        const sessionTime = this.stats && (this.stats.sessionTime || this.stats.elapsedMs || this.stats.timePlayed || 0);
        const dto = {
            user: uid,
            score: this.stats && this.stats[this.scoreVar] ? Number(this.stats[this.scoreVar]) : 0,
            levelsCompleted: levels,
            sessionTime: Number(sessionTime) || 0,
            totalPowerUps: (this.stats && Number(this.stats.totalPowerUps)) || 0,
            status: (this.stats && this.stats.status) || 'PAUSED'
        };
        return dto;
    }

    // Attempt to POST or PUT the stats to the backend. Returns a Promise.
    async _saveStatsToServer() {
        const base = this._backendBase();
        if (!base) return Promise.reject(new Error('No backend configured'));
        const apiBase = base.replace(/\/$/, '') + '/api/pausemenu/score';
        const dto = this._buildServerDto();

        try {
            const token = this._authToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            // If we have an existing server id, update via PUT
            const serverId = this.stats && (this.stats.serverId || this.stats._serverId || null);
            if (serverId) {
                const url = `${apiBase}/${serverId}`;
                console.debug('PauseMenu: PUT', url, dto);
                const resp = await fetch(url, {
                    method: 'PUT',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify(dto)
                });
                const text = await resp.text();
                let body;
                try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
                const ok = resp.ok && (!(body && body.success === false));
                if (!ok) {
                    console.error('PauseMenu: server PUT responded with status', resp.status, text);
                    throw new Error('Server PUT failed: ' + resp.status);
                }
                console.debug('PauseMenu: server PUT response', body);
                if (body && body.id) {
                    this.stats.serverId = body.id;
                }
                return body;
            }

            // Create a new server record
            const url = `${apiBase}/save`;
            console.debug('PauseMenu: POST', url, dto);
            const resp = await fetch(url, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(dto)
            });
            const text = await resp.text();
            let body;
            try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
            const ok = resp.ok && (!(body && body.success === false));
            if (!ok) {
                console.error('PauseMenu: server POST responded with status', resp.status, text);
                throw new Error('Server POST failed: ' + resp.status);
            }
            console.debug('PauseMenu: server POST response', body);
            if (body && body.id) {
                this.stats.serverId = body.id;
            }
            return body;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // Removed local storage fallback entirely

    // Load stats from server when possible. If multiple records returned, pick the most recent.
    async _loadStatsFromServer() {
        const base = this._backendBase();
        if (!base) return Promise.reject(new Error('No backend configured'));
        const apiBase = base.replace(/\/$/, '') + '/api/pausemenu/score';
        const player = (this.options && this.options.playerName) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.playerName);
        const gameType = (this.options && this.options.gameType) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.gameType);

        // Prefer loading by known server id when available (aligns with backend getScore)
        const serverId = this.stats && (this.stats.serverId || this.stats._serverId || null);
        if (serverId) {
            try {
                const url = `${apiBase}/${serverId}`;
                const resp = await fetch(url, { method: 'GET', credentials: 'include' });
                if (resp.status === 404) return null; // no stats yet
                if (!resp.ok) throw new Error('Server GET failed: ' + resp.status);
                const body = await resp.json();
                if (body) {
                    const chosen = body;
                    this.stats = Object.assign(this.stats || {}, {
                        levelsCompleted: Number(chosen.levelsCompleted || chosen.levelReached || 0),
                        levelReached: chosen.levelReached || chosen.levelsCompleted || 0,
                        currentScore: chosen.score || chosen.currentScore || 0,
                        sessionTime: chosen.sessionTime || chosen.elapsedMs || 0,
                        totalPowerUps: chosen.totalPowerUps || 0,
                        status: chosen.status || 'PAUSED',
                        serverId: chosen.id || chosen._id || serverId
                    });
                    if (this.gameControl) this.gameControl.stats = this.stats;
                    this._updateStatsDisplay();
                    return this.stats;
                }
            } catch (e) {
                // fallback to legacy lookup below
                console.warn('PauseMenu: load by id failed, falling back to player/game lookup', e);
            }
        }

        if (!player || !gameType) return Promise.reject(new Error('playerName and gameType are required for server load'));

        try {
            const url = `${apiBase}/player/${encodeURIComponent(player)}/game/${encodeURIComponent(gameType)}`;
            const resp = await fetch(url, { method: 'GET', credentials: 'include' });
            if (resp.status === 404) return null; // nothing stored for this player/game
            if (!resp.ok) throw new Error('Server GET failed: ' + resp.status);
            const body = await resp.json();
            if (Array.isArray(body) && body.length > 0) {
                // pick most recent by id or sessionStartTime if present
                const chosen = body[body.length - 1];
                // map server fields back into stats shape we use
                this.stats = Object.assign(this.stats || {}, {
                    levelsCompleted: chosen.getLevelsCompleted ? chosen.getLevelsCompleted : (chosen.levelReached || 0),
                    levelReached: chosen.levelReached || 0,
                    // Do not carry over prior run score into current run
                    currentScore: 0,
                    sessionTime: chosen.sessionTime || chosen.elapsedMs || this.stats?.sessionTime || 0,
                    highScore: chosen.highScore || 0,
                    progressPercentage: chosen.progressPercentage || 0,
                    gameState: chosen.gameState || null,
                    itemsCollected: chosen.itemsCollected || 0,
                    enemiesDefeated: chosen.enemiesDefeated || 0,
                    totalCoins: chosen.totalCoins || 0,
                    totalPowerUps: chosen.totalPowerUps || 0,
                    status: 'PAUSED',
                    serverId: chosen.id || chosen._id || null
                });
                // mirror back to gameControl if present
                if (this.gameControl) this.gameControl.stats = this.stats;
                this._updateStatsDisplay();
                return this.stats;
            }
            return null;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    _ensureCssLoaded() {
        // Add stylesheet if not already present
        const href = this.options.cssPath;
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    }

    _createDom() {
        const parent = document.getElementById(this.options.parentId) || document.body;

        // Main overlay container
        const overlay = document.createElement('div');
        overlay.className = 'pause-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.display = 'none';

        const panel = document.createElement('div');
        panel.className = 'pause-panel';

    // Prominent counter at the top showing configured counter (single unified display)
    const counterWrap = document.createElement('div');
    counterWrap.className = 'pause-counter-wrap';
    const counterLabel = document.createElement('div');
    counterLabel.className = 'pause-counter-label';
    counterLabel.innerText = this.counterLabelText;
    const counterNumber = document.createElement('div');
    counterNumber.className = 'pause-counter-number';
    counterNumber.innerText = '0';
    counterWrap.appendChild(counterLabel);
    counterWrap.appendChild(counterNumber);

    const title = document.createElement('h2');
    title.className = 'pause-title';
    title.innerText = 'Paused';

        const btnResume = document.createElement('button');
        btnResume.className = 'pause-btn resume';
        btnResume.innerText = 'Resume';
        btnResume.addEventListener('click', () => this._onResume());

    const btnSkipLevel = document.createElement('button');
    btnSkipLevel.className = 'pause-btn skip-level';
    btnSkipLevel.innerText = 'Skip Level';
    btnSkipLevel.addEventListener('click', () => this._onEndLevel());

    const btnExit = document.createElement('button');
    btnExit.className = 'pause-btn exit';
    btnExit.innerText = 'Exit to Home';
    btnExit.addEventListener('click', () => this._onExit());

    // Save score button: persists the counter value to backend (or localStorage fallback)
    const btnSave = document.createElement('button');
    btnSave.className = 'pause-btn save-score';
    btnSave.innerText = 'Save Score';
    btnSave.addEventListener('click', () => this._onSaveScore(btnSave));

    // small status message area for save feedback
    const saveMsg = document.createElement('div');
    saveMsg.className = 'pause-save-msg';
    saveMsg.setAttribute('aria-live', 'polite');
    saveMsg.innerText = '';

    // Only append the single counter and controls (remove duplicate stats area)
    panel.appendChild(counterWrap);
    panel.appendChild(title);
    panel.appendChild(btnResume);
    panel.appendChild(btnSkipLevel);
    panel.appendChild(btnSave);
    panel.appendChild(btnExit);
    panel.appendChild(saveMsg);
        overlay.appendChild(panel);

        parent.appendChild(overlay);
        this.container = overlay;

        // keyboard handler: Esc to close, P to toggle
        this._boundKeyHandler = (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                this._onResume();
            }
        };

        // reference to the single counter node for updates
        this._counterNumber = counterNumber;
        this._saveStatusNode = saveMsg;
    }

    // UI handler for Save Score button
    async _onSaveScore(buttonEl) {
        try {
            if (!buttonEl) return;
            buttonEl.disabled = true;
            const prevText = buttonEl.innerText;
            buttonEl.innerText = 'Saving...';

            // ensure the stats object has the latest displayed counter value
            try {
                const cv = this.counterVar || 'levelsCompleted';
                const val = Number(this.score || 0);
                if (!this.stats) this.stats = {};
                this.stats[cv] = val;
            } catch (e) { /* ignore */ }

            // attempt server save if configured; no localStorage fallback
            const backend = this._backendBase();
            if (backend) {
                try {
                    const resp = await this._saveStatsToServer();
                    // server returned successfully
                    console.log('PauseMenu: saved to backend', resp);
                    if (this._saveStatusNode) this._saveStatusNode.innerText = 'Saved to backend';
                } catch (e) {
                    console.error('PauseMenu: save to backend failed', e);
                    if (this._saveStatusNode) this._saveStatusNode.innerText = 'Backend save failed';
                }
            } else {
                // no backend configured
                console.warn('PauseMenu: no backend configured');
                if (this._saveStatusNode) this._saveStatusNode.innerText = 'No backend configured';
            }

            // small visual confirmation timeout
            setTimeout(() => { if (this._saveStatusNode) this._saveStatusNode.innerText = ''; }, 3000);

            buttonEl.disabled = false;
            buttonEl.innerText = prevText;
        } catch (e) {
            try { buttonEl.disabled = false; buttonEl.innerText = 'Save Score'; } catch (e) {}
            console.error('PauseMenu: unexpected error during save', e);
            if (this._saveStatusNode) this._saveStatusNode.innerText = 'Save failed';
            setTimeout(() => { if (this._saveStatusNode) this._saveStatusNode.innerText = ''; }, 3000);
        }
    }

    // Public method to save current counter to backend (returns Promise)
    async saveStats() {
        // ensure stats reflect current displayed score
        const cv = this.counterVar || 'levelsCompleted';
        this.stats = this.stats || {};
        this.stats[cv] = Number(this.score || 0);
        const backend = this._backendBase();
        if (backend) {
            return this._saveStatsToServer();
        }
        // no backend configured
        return Promise.reject(new Error('No backend configured'));
    }

    show() {
        if (!this.container) return;
        this.container.style.display = 'flex';
        this.container.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', this._boundKeyHandler);
        // trap focus to first button
        const btn = this.container.querySelector('button');
        if (btn) btn.focus();
        // refresh stats display when opened
        this._updateStatsDisplay();
    }

    hide() {
        if (!this.container) return;
        this.container.style.display = 'none';
        this.container.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', this._boundKeyHandler);
    }

    _onResume() {
        if (this.gameControl && typeof this.gameControl.hidePauseMenu === 'function') {
            this.gameControl.hidePauseMenu();
        } else if (this.gameControl && typeof this.gameControl.resume === 'function') {
            this.hide();
            this.gameControl.resume();
        }
    }

    _onRestart() {
        // Restart removed from UI; keep method in case external callers use it.
        if (this.gameControl && typeof this.gameControl.restartLevel === 'function') {
            this.hide();
            this.gameControl.restartLevel();
        }
    }

    _onEndLevel() {
        // End the current level by signaling the GameControl's public API.
        // Prefer calling controller helpers (hidePauseMenu/resume + endLevel).
        // Fallback: synthesize an 'L' keydown event for controllers that listen for it.
        try {
            if (!this.gameControl) return;

            // Hide our UI and let the controller resume if it provides helpers.
            if (typeof this.gameControl.hidePauseMenu === 'function') {
                try { this.gameControl.hidePauseMenu(); } catch (e) { /* ignore */ }
            } else if (typeof this.gameControl.resume === 'function') {
                try { this.gameControl.resume(); } catch (e) { /* ignore */ }
            } else {
                // fallback to hiding our UI if controller doesn't provide resume helper
                this.hide();
            }

            if (typeof this.gameControl.endLevel === 'function') {
                this.gameControl.endLevel();
                return;
            }

            // Fallback: if controllers listen for the 'L' key to skip levels,
            // synthesize a keydown event. This preserves existing controller behavior
            // without requiring changes to GameControl.
            const event = new KeyboardEvent('keydown', {
                key: 'L',
                code: 'KeyL',
                keyCode: 76,
                which: 76,
                bubbles: true,
            });
            document.dispatchEvent(event);
        } catch (e) {
            console.warn('PauseMenu: could not end level:', e);
        }
    }

    _onExit() {
        // return home via Game instance if available
        const fallback = (this.options && this.options.homeUrl) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.homeUrl) || 'https://pages.opencodingsociety.com/homepage/';
        try {
            const original = String(window.location.href);
            if (this.gameControl && this.gameControl.game && typeof this.gameControl.game.returnHome === 'function') {
                try {
                    this.hide();
                } catch (e) { /* ignore */ }
                try {
                    this.gameControl.game.returnHome();
                } catch (e) {
                    // if returnHome throws, fallback below
                }

                // If returnHome didn't navigate away within 300ms, navigate to fallback
                setTimeout(() => {
                    try {
                        if (String(window.location.href) === original) {
                            window.location.href = fallback;
                        }
                    } catch (e) {
                        window.location.href = fallback;
                    }
                }, 300);
                return;
            }
        } catch (e) {
            // proceed to fallback
        }

        // final fallback: navigate to canonical homepage
        window.location.href = fallback;
    }

    _updateStatsDisplay() {
        try {
            const cv = this.counterVar || 'levelsCompleted';
            const perLevel = (this.options && this.options.counterPerLevel) || (this.gameControl && this.gameControl.pauseMenuOptions && this.gameControl.pauseMenuOptions.counterPerLevel);
            let val = 0;
            if (perLevel) {
                const levelKey = (this.gameControl && typeof this.gameControl.currentLevelIndex !== 'undefined') ? String(this.gameControl.currentLevelIndex) : ((this.gameControl && this.gameControl.currentLevel && this.gameControl.currentLevel.id) || '0');
                val = (this.stats && this.stats.levels && (this.stats.levels[levelKey] || 0)) || 0;
            } else {
                // Only show/count when playing (not paused)
                const isPlaying = (this.gameControl && (this.gameControl.isPlaying === true || this.gameControl.isPaused === false));
                val = isPlaying ? ((this.stats && typeof this.stats[cv] !== 'undefined') ? (this.stats[cv] || 0) : (this.gameControl && typeof this.gameControl[cv] !== 'undefined' ? (this.gameControl[cv] || 0) : 0)) : (this.stats && typeof this.stats[cv] !== 'undefined' ? (this.stats[cv] || 0) : 0);
            }
            this.score = val;
            if (this._counterNumber) this._counterNumber.innerText = String(val);
        } catch (e) {
            /* ignore */
        }
    }

    // Public helper to increment points (also exposed as gameControl.addPoints)
    addPoints(amount = 0) {
        try {
            // Only increment while actively playing
            const isPlaying = (this.gameControl && (this.gameControl.isPlaying === true || this.gameControl.isPaused === false));
            if (!isPlaying) return;
            this.stats.points = (this.stats.points || 0) + Number(amount || 0);
            this._updateStatsDisplay();
        } catch (e) {
            console.warn('PauseMenu.addPoints error', e);
        }
    }

    // Reset current run score to 0 (call when entering the game)
    _resetCurrentRunScore() {
        try {
            const cv = this.counterVar || 'levelsCompleted';
            this.stats = this.stats || {};
            this.stats[cv] = 0;
            this.stats.points = 0;
        } catch (e) { /* ignore */ }
    }

    // Return current stats object for backend saving or inspection
    getStats() {
        return Object.assign({}, (this.stats || { levelsCompleted: 0, points: 0 }));
    }
}
