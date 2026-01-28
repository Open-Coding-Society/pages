// ScoreFeature.js
import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class ScoreFeature {
    constructor(pauseMenu) {
        this.pauseMenu = pauseMenu;
        this._createScoreCounter();
        this._setupAutoUpdate();
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
        scoreCounter.style.top = '120px';
        scoreCounter.style.left = '20px';
        scoreCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        scoreCounter.style.color = '#fff';
        scoreCounter.style.padding = '10px 15px';
        scoreCounter.style.borderRadius = '5px';
        scoreCounter.style.fontSize = '16px';
        scoreCounter.style.fontWeight = 'bold';
        scoreCounter.style.zIndex = '9998';
        scoreCounter.style.minWidth = '150px';
        scoreCounter.style.textAlign = 'center';
        
        const scoreLabel = document.createElement('div');
        scoreLabel.style.fontSize = '12px';
        scoreLabel.style.color = '#aaa';
        scoreLabel.style.marginBottom = '5px';
        scoreLabel.innerText = this.pauseMenu.counterLabelText || 'Score';
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'pause-score-value';
        scoreValue.style.fontSize = '24px';
        scoreValue.innerText = '0';
        
        scoreCounter.appendChild(scoreLabel);
        scoreCounter.appendChild(scoreValue);
        parent.appendChild(scoreCounter);
        
        this._scoreValue = scoreValue;
        this._scoreLabel = scoreLabel;
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
        
        const varName = this.pauseMenu.counterVar || 'levelsCompleted';
        const stats = this.pauseMenu.gameControl.stats || this.pauseMenu.gameControl;
        const currentValue = stats[varName] || this.pauseMenu.gameControl[varName] || 0;
        
        this.updateScoreDisplay(currentValue);
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
     * Build fetch options with proper headers
     */
    _getFetchOptions(method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
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
     * Build the DTO for backend save
     */
    _buildServerDto() {
        const uid = 'guest';
        const varName = this.pauseMenu.counterVar || 'levelsCompleted';
        const levels = this.pauseMenu.stats && this.pauseMenu.stats[varName] ? Number(this.pauseMenu.stats[varName]) : 0;
        const sessionTime = this.pauseMenu.stats && (this.pauseMenu.stats.sessionTime || this.pauseMenu.stats.elapsedMs || this.pauseMenu.stats.timePlayed || 0);
        const gameName = this._extractGameName();

        const dto = {
            user: uid,
            score: this.pauseMenu.stats && this.pauseMenu.stats[this.pauseMenu.scoreVar] ? Number(this.pauseMenu.stats[this.pauseMenu.scoreVar]) : 0,
            levelsCompleted: levels,
            sessionTime: Number(sessionTime) || 0,
            totalPowerUps: (this.pauseMenu.stats && Number(this.pauseMenu.stats.totalPowerUps)) || 0,
            status: 'PAUSED',
            gameName: gameName,
            variableName: varName
        };
        return dto;
    }

    /**
     * Save stats to the Java backend server
     */
    async _saveStatsToServer() {
        const base = this._getBackendBase();
        if (!base) return Promise.reject(new Error('No backend configured'));

        const apiBase = base.replace(/\/$/, '') + '/api/pausemenu/score';
        const dto = this._buildServerDto();

        try {
            // Check if we have an existing server ID to update
            const serverId = this.pauseMenu.stats && (this.pauseMenu.stats.serverId || this.pauseMenu.stats._serverId || null);
            if (serverId) {
                const url = `${apiBase}/${serverId}`;
                console.debug('ScoreFeature: PUT', url, dto);
                const options = this._getFetchOptions('PUT', dto);
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
                    console.error('ScoreFeature: server PUT responded with status', resp.status, text);
                    throw new Error('Server PUT failed: ' + resp.status);
                }
                console.debug('ScoreFeature: server PUT response', body);
                if (body && body.id && this.pauseMenu.stats) {
                    this.pauseMenu.stats.serverId = body.id;
                }
                return body;
            }

            // Create a new server record
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
            const cv = this.pauseMenu.counterVar || 'levelsCompleted';
            if (!this.pauseMenu.stats) this.pauseMenu.stats = {};
            this.pauseMenu.stats[cv] = Number(this.pauseMenu.score || 0);

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
                    alert('Save failed!');
                    if (this.pauseMenu._saveStatusNode) {
                        this.pauseMenu._saveStatusNode.innerText = 'Backend save failed';
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
            alert('Save failed!');
            if (this.pauseMenu._saveStatusNode) {
                this.pauseMenu._saveStatusNode.innerText = 'Save failed';
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
