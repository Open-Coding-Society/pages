// ScoreFeature.js (copied from GameEnginev2)
import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class ScoreFeature {
    constructor(pauseMenu, scoreSettings = null) {
        this.pauseMenu = pauseMenu;
        this.scoreSettings = scoreSettings || null;
        this.isVisible = false;            // track current visibility state
        this._loadScoreSettings();
        this._createScoreCounter();
        this._setupAutoUpdate();

        // if the pauseMenu has a gameControl, make it easier to toggle from elsewhere
        if (this.pauseMenu.gameControl) {
            this.pauseMenu.gameControl.toggleScoreDisplay = () => this.toggleScoreDisplay();
        }
    }

    /**
     * Load game-specific score settings if available
     */
    _loadScoreSettings() {
        // If scoreSettings already provided, use it
        if (this.scoreSettings) return;
        
        // Try to detect and load game-specific settings
        try {
            // Try mansion game settings
            if (window.location.pathname.includes('mansion')) {
                import('../mansionGame/scoreSettings.js')
                    .then(mod => {
                        this.scoreSettings = mod.default || mod.scoreSettings;
                        console.log('ScoreFeature: loaded mansion game settings');
                        if (this._scoreLabel) {
                            this._scoreLabel.innerText = this._getCounterLabel();
                        }
                        this._syncScoreDisplay();
                    })
                    .catch(e => console.debug('Mansion settings not found:', e));
            }
            // Try adventure game settings
            else if (window.location.pathname.includes('adventure') || window.location.pathname.includes('gamify')) {
                import('./scoreSettings.js')
                    .then(mod => {
                        this.scoreSettings = mod.default || mod.scoreSettings;
                        console.log('ScoreFeature: loaded adventure game settings');
                        if (this._scoreLabel) {
                            this._scoreLabel.innerText = this._getCounterLabel();
                        }
                        this._syncScoreDisplay();
                    })
                    .catch(e => console.debug('Adventure settings not found:', e));
            }
        } catch (e) {
            console.debug('Could not load game-specific settings:', e);
        }
    }

    /**
     * Create the score counter UI element below the buttons
     */
    _createScoreCounter() {
        if (!this.pauseMenu.gameControl) return;
        
        const parent = (this.pauseMenu.gameControl && this.pauseMenu.gameControl.gameContainer) 
            || document.getElementById(this.pauseMenu.options.parentId) 
            || document.body;

        const scoreCounter = document.createElement('div');
        scoreCounter.className = 'pause-score-counter';
        scoreCounter.style.position = 'fixed';
        scoreCounter.style.top = '80px';
        scoreCounter.style.left = '10px';
        scoreCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        scoreCounter.style.color = '#fff';
        scoreCounter.style.padding = '10px 15px';
        scoreCounter.style.borderRadius = '5px';
        scoreCounter.style.fontSize = '16px';
        scoreCounter.style.fontWeight = 'bold';
        scoreCounter.style.zIndex = '9998';
        scoreCounter.style.minWidth = '150px';
        scoreCounter.style.textAlign = 'center';
        scoreCounter.style.display = 'none';
        
        const scoreLabel = document.createElement('div');
        scoreLabel.style.fontSize = '12px';
        scoreLabel.style.color = '#aaa';
        scoreLabel.style.marginBottom = '5px';
        const labelText = this._getCounterLabel();
        scoreLabel.innerText = labelText;
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'pause-score-value';
        scoreValue.style.fontSize = '24px';
        scoreValue.innerText = '0';
        
        scoreCounter.appendChild(scoreLabel);
        scoreCounter.appendChild(scoreValue);
        parent.appendChild(scoreCounter);
        
        this._scoreValue = scoreValue;
        this._scoreLabel = scoreLabel;
        this._scoreCounter = scoreCounter;   // keep reference for toggle
    }

    /**
     * Get the counter label from settings or pauseMenu
     */
    _getCounterLabel() {
        if (this.scoreSettings && this.scoreSettings.counterLabel) {
            return this.scoreSettings.counterLabel;
        }
        return this.pauseMenu.counterLabelText || 'Score';
    }

    /**
     * Setup automatic score updates by polling gameControl stats
     */
    _setupAutoUpdate() {
        // Update score display every 100ms to keep it in sync
        this._updateInterval = setInterval(() => {
            this._syncScoreDisplay();
        }, 100);
    }

    /**
     * Sync the score display with current gameControl stats
     */
    _syncScoreDisplay() {
        if (!this.pauseMenu.gameControl) return;
        
        const varName = this._getCounterVar();
        const stats = this.pauseMenu.gameControl.stats || this.pauseMenu.gameControl;
        const currentValue = stats[varName] || this.pauseMenu.gameControl[varName] || 0;
        
        this.updateScoreDisplay(currentValue);
    }

    /**
     * Toggle visibility of the score counter
     */
    toggleScoreDisplay() {
        if (!this._scoreCounter) return;
        this.isVisible = !this.isVisible;
        this._scoreCounter.style.display = this.isVisible ? 'block' : 'none';
    }

    /**
     * Get the counter variable name from settings or pauseMenu
     */
    _getCounterVar() {
        if (this.scoreSettings && this.scoreSettings.counterVar) {
            return this.scoreSettings.counterVar;
        }
        return this.pauseMenu.counterVar || 'levelsCompleted';
    }

    /**
     * Update the score counter display
     */
    updateScoreDisplay(value) {
        if (this._scoreValue) {
            this._scoreValue.innerText = String(value || 0);
        }
    }

    /**
     * Cleanup when ScoreFeature is destroyed
     */
    destroy() {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = null;
        }
    }

    /**
     * Get the backend base URL with proper priority
     */
    _getBackendBase() {
        const opt = (this.pauseMenu.options && this.pauseMenu.options.backendUrl) 
            || (this.pauseMenu.gameControl && this.pauseMenu.gameControl.pauseMenuOptions && this.pauseMenu.gameControl.pauseMenuOptions.backendUrl);
        if (opt) return opt;
        
        try {
            if (typeof window !== 'undefined') {
                if (window.javaBackendUrl) return String(window.javaBackendUrl);
                if (window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                    return 'http://localhost:8585';
                }
            }
            if (javaURI) return String(javaURI);
            if (typeof window !== 'undefined' && window.location && window.location.origin) return String(window.location.origin);
        } catch (e) { /* ignore */ }
        return null;
    }

    /**
     * Build fetch options with proper headers and authentication
     */
    _getFetchOptions(method = 'GET', body = null) {
        const options = {
            ...fetchOptions,
            method,
            headers: {
                ...fetchOptions?.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        return options;
    }

    /**
     * Extract game name from URL or game instance
     */
    _extractGameName() {
        if (this.pauseMenu.gameControl && this.pauseMenu.gameControl.game && this.pauseMenu.gameControl.game.gameName) {
            return this.pauseMenu.gameControl.game.gameName;
        }
        if (typeof window === 'undefined') return 'unknown';
        const pathname = window.location.pathname;
        const match = pathname.match(/(\w+Game)/);
        return match ? match[1] : 'unknown';
    }

    /**
     * Get the logged-in user's username from JWT token
     * Returns the username if authenticated, otherwise 'guest'
     */
    _getLoggedInUser() {
        try {
            // Get JWT token from cookie
            const cookieName = 'jwt_java_spring';
            const cookies = document.cookie.split(';');
            let jwtToken = null;
            
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === cookieName) {
                    jwtToken = value;
                    break;
                }
            }
            
            if (!jwtToken) {
                return 'guest';
            }
            
            // Decode JWT token (it's base64 encoded)
            // JWT format: header.payload.signature
            const parts = jwtToken.split('.');
            if (parts.length !== 3) {
                return 'guest';
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            const payloadObj = JSON.parse(decodedPayload);
            
            // The username is stored in the 'sub' (subject) field of the JWT
            return payloadObj.sub || 'guest';
            
        } catch (error) {
            console.error('Error getting logged-in user:', error);
            return 'guest';
        }
    }

    /**
     * Build the DTO for backend save - matches AlgorithmicEvent payload structure
     */
    _buildServerDto() {
        // Use custom DTO builder if scoreSettings provided it
        if (this.scoreSettings && typeof this.scoreSettings.buildDto === 'function') {
            return this.scoreSettings.buildDto(this.pauseMenu);
        }
        
        // Build DTO matching AlgorithmicEvent structure
        const uid = this._getLoggedInUser(); // Get actual logged-in user or 'guest'
        const varName = this._getCounterVar();
        
        // Always ensure stats is synced with gameControl.stats
        if (this.pauseMenu.gameControl && this.pauseMenu.gameControl.stats) {
            this.pauseMenu.stats = this.pauseMenu.gameControl.stats;
        }
        
        const levels = this.pauseMenu.stats && this.pauseMenu.stats[varName] ? Number(this.pauseMenu.stats[varName]) : 0;
        const sessionTime = this.pauseMenu.stats && (this.pauseMenu.stats.sessionTime || this.pauseMenu.stats.elapsedMs || this.pauseMenu.stats.timePlayed || 0);
        const gameName = this._extractGameName();

        // Create payload matching AlgorithmicEvent structure
        const dto = {
            payload: {
                user: uid,
                score: this.pauseMenu.stats && this.pauseMenu.stats[this.pauseMenu.scoreVar] ? Number(this.pauseMenu.stats[this.pauseMenu.scoreVar]) : 0,
                levelsCompleted: levels,
                sessionTime: Number(sessionTime) || 0,
                totalPowerUps: (this.pauseMenu.stats && Number(this.pauseMenu.stats.totalPowerUps)) || 0,
                status: 'PAUSED',
                gameName: gameName,
                variableName: varName
            }
        };
        console.log('ScoreFeature: built DTO', dto);
        return dto;
    }

    /**
     * Save stats to the Java backend server
     */
    async _saveStatsToServer() {
        const base = this._getBackendBase();
        if (!base) return Promise.reject(new Error('No backend configured'));

        const apiBase = base.replace(/\/$/, '') + '/api/events/SCORE_COUNTER';
        const dto = this._buildServerDto();

        try {
            // For events API, we always POST (no PUT/update)
            // The GenericEventController only has POST and GET endpoints
            const url = `${apiBase}`;
            console.debug('ScoreFeature: POST', url, dto);
            const options = this._getFetchOptions('POST', dto);
            const resp = await fetch(url, options);
            const text = await resp.text();
            let body;
            try {
                body = text ? JSON.parse(text) : null;
            } catch (e) {
                body = text;
            }
            const ok = resp.ok && (!(body && body.success === false));
            if (!ok) {
                console.error('ScoreFeature: server POST responded with status', resp.status, text);
                throw new Error('Server POST failed: ' + resp.status);
            }
            console.debug('ScoreFeature: server POST response', body);
            if (body && body.id && this.pauseMenu.stats) {
                this.pauseMenu.stats.serverId = body.id;
            }
            return body;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Save current counter/score to Java backend
     */
    async saveScore(buttonEl) {
        if (!buttonEl) return;
        buttonEl.disabled = true;
        const prevText = buttonEl.innerText;
        buttonEl.innerText = 'Saving...';

        try {
            const cv = this._getCounterVar();
            
            // Ensure stats object exists on gameControl
            if (!this.pauseMenu.gameControl.stats) {
                this.pauseMenu.gameControl.stats = {};
            }
            
            // Always sync pauseMenu.stats to gameControl.stats (they should be the same object)
            this.pauseMenu.stats = this.pauseMenu.gameControl.stats;
            
            // Update the counter variable with current score
            const currentScore = this.pauseMenu.score;
            console.log(`ScoreFeature: setting ${cv} to ${currentScore}`);
            this.pauseMenu.stats[cv] = Number(currentScore || 0);

            // Attempt server save
            const backend = this._getBackendBase();
            if (backend) {
                try {
                    const resp = await this._saveStatsToServer();
                    console.log('ScoreFeature: saved to backend', resp);
                    alert('Saved to backend!');
                    if (this.pauseMenu._saveStatusNode) {
                        this.pauseMenu._saveStatusNode.innerText = 'Score saved to backend!';
                    }
                } catch (e) {
                    console.error('ScoreFeature: save to backend failed', e);
                    // Check for authentication errors (401 or 403 status)
                    if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
                        alert('Please login to access this feature.');
                        if (this.pauseMenu._saveStatusNode) {
                            this.pauseMenu._saveStatusNode.innerText = 'Please login to access this feature.';
                        }
                    } else {
                        alert('Save failed!');
                        if (this.pauseMenu._saveStatusNode) {
                            this.pauseMenu._saveStatusNode.innerText = 'Backend save failed';
                        }
                    }
                }
            } else {
                console.warn('ScoreFeature: no backend configured');
                alert('No backend configured');
                if (this.pauseMenu._saveStatusNode) {
                    this.pauseMenu._saveStatusNode.innerText = 'No backend configured';
                }
            }
        } catch (e) {
            console.error('ScoreFeature: save failed', e);
            // Check for authentication errors (401 or 403 status)
            if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
                alert('Please login to access this feature.');
                if (this.pauseMenu._saveStatusNode) {
                    this.pauseMenu._saveStatusNode.innerText = 'Please login to access this feature.';
                }
            } else {
                alert('Save failed!');
                if (this.pauseMenu._saveStatusNode) {
                    this.pauseMenu._saveStatusNode.innerText = 'Save failed';
                }
            }
        }

        setTimeout(() => {
            if (this.pauseMenu._saveStatusNode) {
                this.pauseMenu._saveStatusNode.innerText = '';
            }
        }, 3000);

        buttonEl.disabled = false;
        buttonEl.innerText = prevText;
    }
}
