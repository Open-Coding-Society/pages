/**
 * GameEnvScore - Score Management and Backend Integration for GameEngine v1.1
 * ===========================================================================
 * 
 * PURPOSE:
 * Singleton score manager that tracks and persists game statistics across all levels.
 * Integrates seamlessly with GameEnv's OOP architecture.
 * 
 * ARCHITECTURE:
 * - GameEnv: Owns stats object and scoreConfig (persistent across levels)
 * - GameEnvScore: Manages UI display and backend persistence
 * - Game Objects (Coin, etc.): Write directly to gameEnv.stats
 * - All Levels: Access via this.gameEnv.scoreManager
 * 
 * RESPONSIBILITIES:
 * - Display real-time score counter overlay during gameplay
 * - Sync score display with GameEnv.stats every 100ms
 * - Save game statistics to backend server with user authentication
 * - Build standardized DTOs for backend persistence
 * 
 * PUBLIC METHODS:
 * ├─ toggleScoreDisplay()      - Show/hide score counter
 * ├─ updateScoreDisplay(value) - Update displayed score value
 * ├─ saveScore(buttonEl)       - Save current score to backend
 * └─ destroy()                 - Clean up intervals and resources
 * 
 * PRIVATE METHODS (Internal):
 * ├─ _createScoreCounter()     - Build UI elements for score display
 * ├─ _setupAutoUpdate()        - Initialize 100ms sync interval
 * ├─ _syncScoreDisplay()       - Sync display with GameEnv.stats
 * ├─ _getCounterLabel()        - Get display label from gameEnv.scoreConfig
 * ├─ _getCounterVar()          - Get stat variable name from gameEnv.scoreConfig
 * ├─ _extractGameName()        - Extract game name from URL or instance
 * ├─ _getLoggedInUser()        - Fetch authenticated user from API
 * ├─ _buildServerDto()         - Build data payload for backend
 * └─ _saveStatsToServer()      - POST stats to backend API
 * 
 * GAMEENV CONFIGURATION:
 * Set these in GameEnv.scoreConfig:
 * - counterVar: stat variable to track (e.g., 'coinsCollected')
 * - counterLabel: display label (e.g., 'Coins Collected')
 * - scoreVar: variable used for backend 'score' field (defaults to counterVar)
 * 
 * BACKEND INTEGRATION:
 * - Endpoint: /api/person/get (GET user info)
 * - Endpoint: /api/events/SCORE_COUNTER (POST score data)
 * - Uses shared javaURI and fetchOptions from /assets/js/api/config.js
 * - JWT authentication via cookies (handled by fetchOptions)
 * - Always fetches user before saving (no anonymous saves)
 * 
 * DATA FLOW:
 * Game Object → gameEnv.stats.coinsCollected++
 *            ↓
 * _syncScoreDisplay() reads gameEnv.stats → UI Counter (every 100ms)
 *            ↓
 * saveScore() → _getLoggedInUser() → _buildServerDto(gameEnv.stats) → Backend API
 * 
 * DEPENDENCIES:
 * - GameEnv instance (contains stats, scoreConfig, gameControl)
 * - /assets/js/api/config.js (provides javaURI and fetchOptions)
 * - Backend API (Java Spring server)
 * 
 * USAGE:
 * // Initialized automatically in GameEnv
 * await gameEnv.initScoreManager();
 * 
 * // Access from any level
 * this.gameEnv.scoreManager.toggleScoreDisplay();
 * await this.gameEnv.scoreManager.saveScore(buttonElement);
 * 
 * // Game objects update stats directly
 * this.gameEnv.stats.coinsCollected++;
 */

import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class GameEnvScore {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.isVisible = false; // track current visibility state
        this._createScoreCounter();
        this._setupAutoUpdate();
    }

    /**
     * Create the score counter UI element
     */
    _createScoreCounter() {
        // Clean up any existing score counters (from previous instances)
        const existingCounters = document.querySelectorAll('.pause-score-counter');
        existingCounters.forEach(counter => {
            if (counter.parentNode) {
                counter.parentNode.removeChild(counter);
            }
        });
        
        const parent = this.gameEnv.gameContainer || document.getElementById('gameContainer') || document.body;

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
        this._scoreCounter = scoreCounter;
        
        console.log('GameEnvScore: Score counter created and appended to', parent.tagName || parent.id || 'unknown parent');
    }

    /**
     * Get the counter label from GameEnv.scoreConfig
     */
    _getCounterLabel() {
        return this.gameEnv.scoreConfig.counterLabel || 'Score';
    }

    /**
     * Setup automatic score updates by polling GameEnv.stats
     */
    _setupAutoUpdate() {
        this._updateInterval = setInterval(() => {
            this._syncScoreDisplay();
        }, 100);
    }

    /**
     * Sync the score display with current GameEnv.stats
     */
    _syncScoreDisplay() {
        const varName = this._getCounterVar();
        const currentValue = this.gameEnv.stats[varName] || 0;
        this.updateScoreDisplay(currentValue);
    }

    /**
     * Toggle visibility of the score counter
     */
    toggleScoreDisplay() {
        if (!this._scoreCounter) {
            console.error('GameEnvScore: Cannot toggle - score counter element not found');
            return;
        }
        this.isVisible = !this.isVisible;
        this._scoreCounter.style.display = this.isVisible ? 'block' : 'none';
        console.log('GameEnvScore: Score counter toggled to', this.isVisible ? 'visible' : 'hidden');
    }

    /**
     * Get the counter variable name from GameEnv.scoreConfig
     */
    _getCounterVar() {
        return this.gameEnv.scoreConfig.counterVar || 'levelsCompleted';
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
     * Cleanup when GameEnvScore is destroyed
     */
    destroy() {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = null;
        }
        if (this._scoreCounter && this._scoreCounter.parentNode) {
            this._scoreCounter.parentNode.removeChild(this._scoreCounter);
        }
    }

    /**
     * Extract game name from URL or game instance
     */
    _extractGameName() {
        if (this.gameEnv.game && this.gameEnv.game.gameName) {
            return this.gameEnv.game.gameName;
        }
        if (typeof window === 'undefined') return 'unknown';
        const pathname = window.location.pathname;
        const match = pathname.match(/(\w+Game)/);
        return match ? match[1] : 'unknown';
    }

    /**
     * Get the logged-in user's information from the backend API
     * Returns the person data if authenticated, otherwise null
     */
    async _getLoggedInUser() {
        try {
            if (!javaURI) {
                console.debug('GameEnvScore: No backend configured for user fetch');
                return null;
            }
            
            const url = `${javaURI}/api/person/get`;
            const resp = await fetch(url, fetchOptions);
            
            if (resp.ok) {
                const person = await resp.json();
                console.log('GameEnvScore: logged-in user', person);
                return person;
            } else {
                console.debug('GameEnvScore: User not authenticated, status:', resp.status);
                return null;
            }
        } catch (error) {
            console.error('GameEnvScore: Error getting logged-in user:', error);
            return null;
        }
    }

    /**
     * Build the DTO for backend save - matches AlgorithmicEvent payload structure
     * Always builds a complete DTO with user authentication
     */
    async _buildServerDto() {
        // Always fetch logged-in user information
        const person = await this._getLoggedInUser();
        const uid = person ? person.uid : 'guest';
        const counterVar = this._getCounterVar();
        
        // Get scoreVar - may be different from counterVar
        const scoreVar = this.gameEnv.scoreConfig.scoreVar || counterVar;
        
        // Read directly from GameEnv.stats
        const stats = this.gameEnv.stats;
        const score = stats[scoreVar] ? Number(stats[scoreVar]) : 0;
        const levelsCompleted = stats[counterVar] ? Number(stats[counterVar]) : 0;
        const sessionTime = stats.sessionTime || stats.elapsedMs || stats.timePlayed || 0;
        const gameName = this._extractGameName();

        // Create payload matching AlgorithmicEvent structure
        const dto = {
            payload: {
                user: uid,
                score: score,
                levelsCompleted: levelsCompleted,
                sessionTime: Number(sessionTime) || 0,
                totalPowerUps: Number(stats.totalPowerUps) || 0,
                status: 'PAUSED',
                gameName: gameName,
                variableName: counterVar
            }
        };
        console.log('GameEnvScore: built DTO', dto);
        return dto;
    }

    /**
     * Save stats to the Java backend server
     */
    async _saveStatsToServer() {
        if (!javaURI) return Promise.reject(new Error('No backend configured'));

        const url = `${javaURI}/api/events/SCORE_COUNTER`;
        const dto = await this._buildServerDto();

        try {
            console.debug('GameEnvScore: POST', url, dto);
            const options = { ...fetchOptions, method: 'POST', body: JSON.stringify(dto) };
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
                console.error('GameEnvScore: server POST responded with status', resp.status, text);
                throw new Error('Server POST failed: ' + resp.status);
            }
            console.debug('GameEnvScore: server POST response', body);
            if (body && body.id) {
                this.gameEnv.stats.serverId = body.id;
            }
            return body;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Save current counter/score to Java backend
     * Can be called from PauseMenu or any UI trigger
     */
    async saveScore(buttonEl) {
        if (!buttonEl) return;
        buttonEl.disabled = true;
        const prevText = buttonEl.innerText;
        buttonEl.innerText = 'Saving...';

        try {
            const cv = this._getCounterVar();
            const currentScore = this.gameEnv.stats[cv] || 0;
            console.log(`GameEnvScore: ${cv} = ${currentScore}`, this.gameEnv.stats);

            // Attempt server save
            if (javaURI) {
                try {
                    const resp = await this._saveStatsToServer();
                    console.log('GameEnvScore: saved to backend', resp);
                    alert('Saved to backend!');
                } catch (e) {
                    console.error('GameEnvScore: save to backend failed', e);
                    if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
                        alert('Please login to access this feature.');
                    } else {
                        alert('Save failed!');
                    }
                }
            } else {
                console.warn('GameEnvScore: no backend configured');
                alert('No backend configured');
            }
        } catch (e) {
            console.error('GameEnvScore: save failed', e);
            if (e.message && (e.message.includes('401') || e.message.includes('403'))) {
                alert('Please login to access this feature.');
            } else {
                alert('Save failed!');
            }
        }

        buttonEl.disabled = false;
        buttonEl.innerText = prevText;
    }
}
