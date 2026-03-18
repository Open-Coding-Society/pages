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
 * ├─ saveScore(buttonEl)       - Save current score to backend (uses API chaining)
 * └─ destroy()                 - Clean up intervals and resources
 * 
 * PRIVATE METHODS (Internal):
 * ├─ _createScoreCounter()     - Build UI elements for score display
 * ├─ _setupAutoUpdate()        - Initialize 100ms sync interval
 * ├─ _syncScoreDisplay()       - Sync display with GameEnv.stats
 * ├─ _getCounterLabel()        - Get display label from gameEnv.scoreConfig
 * ├─ _getCounterVar()          - Get stat variable name from gameEnv.scoreConfig
 * ├─ _extractGameName()        - Extract game name from URL or instance
 * ├─ _getLoggedInUser()        - Fetch authenticated user from API (returns Promise)
 * ├─ _buildServerDto()         - Build data payload for backend (returns Promise)
 * └─ _saveStatsToServer()      - POST stats to backend API (returns Promise)
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
 * API CHAINING PATTERN:
 * All backend methods use .then()/.catch() chaining for:
 * - Clean sequential operations (_getLoggedInUser → _buildServerDto → _saveStatsToServer)
 * - Centralized error handling with single .catch() block
 * - Elegant promise composition without nested try-catch
 * 
 * DATA FLOW:
 * Game Object → gameEnv.stats.coinsCollected++
 *            ↓
 * _syncScoreDisplay() reads gameEnv.stats → UI Counter (every 100ms)
 *            ↓
 * saveScore() → _saveStatsToServer()
 *            ↓
 * _buildServerDto() → _getLoggedInUser() → fetch(user data)
 *            ↓
 * fetch(POST to backend) → .then(success) → .catch(error) → .finally(cleanup)
 * 
 * DEPENDENCIES:
 * - GameEnv instance (contains stats, scoreConfig, gameControl)
 * - /assets/js/api/config.js (provides javaURI and fetchOptions)
 * - Backend API (Java Spring server)
 * 
 * USAGE:
 * // Initialized automatically in GameEnv
 * gameEnv.initScoreManager();
 * 
 * // Access from any level
 * this.gameEnv.scoreManager.toggleScoreDisplay();
 * this.gameEnv.scoreManager.saveScore(buttonElement);
 * 
 * // Game objects update stats directly
 * this.gameEnv.stats.coinsCollected++;
 */

import { javaURI, fetchOptions } from '/assets/js/api/config.js';

export default class GameEnvScore {
    constructor(gameEnv) {
        this.classId = 'GameEnvScore'; // Class identifier for logging
        this.gameEnv = gameEnv;
        this.isVisible = false; // track current visibility state
        this._createScoreCounter();
        this._setupAutoUpdate();
    }

    // ERROR HANDLERS for backend operations
    ERROR_HANDLERS = {
        'BACKEND_NOT_CONFIGURED': {
            message: 'No backend configured',
            userMessage: 'No backend configured'
        },
        'AUTHENTICATION_REQUIRED': {
            message: 'User authentication required',
            userMessage: 'Please login to access this feature.'
        },
        'PERMISSION_DENIED': {
            message: 'User lacks permission to save scores',
            userMessage: 'You do not have permission to save scores. Contact your teacher.'
        },
        'SERVER_ERROR': {
            message: (statusCode) => `Server error: ${statusCode}`,
            userMessage: 'Save failed! Please try again.'
        },
        'FETCH_USER_ERROR': {
            message: 'Error fetching user information',
            userMessage: 'Unable to verify login. Please try again.'
        },
        'SCORE_COUNTER_NOT_FOUND': {
            message: 'Score counter element not found',
            userMessage: 'Display error'
        },
        'SAVE_FAILED': {
            message: 'Save to backend failed',
            userMessage: 'Save failed!'
        },
        'SAVE_SUCCESS': {
            message: 'Score saved successfully',
            userMessage: 'Saved to backend!'
        },
        'DEFAULT': {
            message: 'Unknown error occurred',
            userMessage: 'Save failed!'
        }
    };

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
        
        console.log(`${this.classId}: Score counter created and appended to`, parent.tagName || parent.id || 'unknown parent');
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
            console.error(`${this.classId}:`, this.ERROR_HANDLERS.SCORE_COUNTER_NOT_FOUND.message);
            return;
        }
        this.isVisible = !this.isVisible;
        this._scoreCounter.style.display = this.isVisible ? 'block' : 'none';
        console.log(`${this.classId}: Score counter toggled to`, this.isVisible ? 'visible' : 'hidden');
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
     * Uses API chaining pattern for elegant error handling
     */
    _getLoggedInUser() {
        if (!javaURI) {
            console.debug(`${this.classId}:`, this.ERROR_HANDLERS.BACKEND_NOT_CONFIGURED.message);
            return Promise.resolve(null);
        }
        
        const url = `${javaURI}/api/person/get`;
        return fetch(url, fetchOptions)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    console.debug(`${this.classId}:`, this.ERROR_HANDLERS.AUTHENTICATION_REQUIRED.message, 'status:', resp.status);
                    return null;
                }
            })
            .then(person => {
                if (person) {
                    console.log(`${this.classId}: logged-in user`, person);
                }
                return person;
            })
            .catch(error => {
                console.error(`${this.classId}:`, this.ERROR_HANDLERS.FETCH_USER_ERROR.message, error);
                return null;
            });
    }

    /**
     * Build the DTO for backend save - matches AlgorithmicEvent payload structure
     * Always builds a complete DTO with user authentication
     * Uses API chaining pattern for sequential operations
     */
    _buildServerDto() {
        // Always fetch logged-in user information
        return this._getLoggedInUser().then(person => {
            // Use person.name for display, fallback to uid, then 'guest'
            const username = person ? (person.name || person.uid) : 'guest';
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
                    user: username,
                    score: score,
                    levelsCompleted: levelsCompleted,
                    sessionTime: Number(sessionTime) || 0,
                    totalPowerUps: Number(stats.totalPowerUps) || 0,
                    status: 'PAUSED',
                    gameName: gameName,
                    variableName: counterVar
                }
            };
            console.log(`${this.classId}: built DTO`, dto);
            return dto;
        });
    }

    /**
     * Save stats to the Java backend server
     * Uses API chaining pattern with centralized error handling
     */
    _saveStatsToServer() {
        if (!javaURI) {
            return Promise.reject(new Error(this.ERROR_HANDLERS.BACKEND_NOT_CONFIGURED.message));
        }

        const url = `${javaURI}/api/events/SCORE_COUNTER`;
        
        return this._buildServerDto()
            .then(dto => {
                console.debug(`${this.classId}: POST`, url, dto);
                const options = { ...fetchOptions, method: 'POST', body: JSON.stringify(dto) };
                return fetch(url, options);
            })
            .then(resp => {
                return resp.text().then(text => ({ resp, text }));
            })
            .then(({ resp, text }) => {
                let body;
                try {
                    body = text ? JSON.parse(text) : null;
                } catch (e) {
                    body = text;
                }
                const ok = resp.ok && (!(body && body.success === false));
                if (!ok) {
                    // Handle specific error codes
                    if (resp.status === 401) {
                        console.error(`${this.classId}:`, this.ERROR_HANDLERS.AUTHENTICATION_REQUIRED.message);
                        throw new Error(this.ERROR_HANDLERS.AUTHENTICATION_REQUIRED.userMessage);
                    } else if (resp.status === 403) {
                        console.error(`${this.classId}:`, this.ERROR_HANDLERS.PERMISSION_DENIED.message);
                        throw new Error(this.ERROR_HANDLERS.PERMISSION_DENIED.userMessage);
                    } else {
                        const errorMsg = typeof this.ERROR_HANDLERS.SERVER_ERROR.message === 'function'
                            ? this.ERROR_HANDLERS.SERVER_ERROR.message(resp.status)
                            : this.ERROR_HANDLERS.SERVER_ERROR.message;
                        console.error(`${this.classId}:`, errorMsg, text);
                        throw new Error(this.ERROR_HANDLERS.SERVER_ERROR.userMessage);
                    }
                }
                console.debug(`${this.classId}:`, this.ERROR_HANDLERS.SAVE_SUCCESS.message, body);
                if (body && body.id) {
                    this.gameEnv.stats.serverId = body.id;
                }
                return body;
            });
    }

    /**
     * Save current counter/score to Java backend
     * Can be called from PauseMenu or any UI trigger
     * Uses API chaining pattern for clean sequential operations
     */
    saveScore(buttonEl) {
        if (!buttonEl) return;
        buttonEl.disabled = true;
        const prevText = buttonEl.innerText;
        buttonEl.innerText = 'Saving...';

        const cv = this._getCounterVar();
        const currentScore = this.gameEnv.stats[cv] || 0;
        console.log(`${this.classId}: ${cv} = ${currentScore}`, this.gameEnv.stats);

        // Attempt server save using API chaining pattern
        if (javaURI) {
            this._saveStatsToServer()
                .then(resp => {
                    console.log(`${this.classId}:`, this.ERROR_HANDLERS.SAVE_SUCCESS.message, resp);
                    // alert(this.ERROR_HANDLERS.SAVE_SUCCESS.userMessage);
                })
                .catch(e => {
                    console.error(`${this.classId}:`, this.ERROR_HANDLERS.SAVE_FAILED.message, e);
                    // Error messages are already set in _saveStatsToServer()
                    alert(e.message || this.ERROR_HANDLERS.DEFAULT.userMessage);
                })
                .finally(() => {
                    buttonEl.disabled = false;
                    buttonEl.innerText = prevText;
                });
        } else {
            console.warn(`${this.classId}:`, this.ERROR_HANDLERS.BACKEND_NOT_CONFIGURED.message);
            alert(this.ERROR_HANDLERS.BACKEND_NOT_CONFIGURED.userMessage);
            buttonEl.disabled = false;
            buttonEl.innerText = prevText;
        }
    }
}
