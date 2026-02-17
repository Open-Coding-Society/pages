// Adventure Game - Game Core

/**
 * GameCore - Main game initialization and management class
 * 
 * Environment Configuration Options:
 * - path: Base path for game assets (required)
 * - gameContainer: DOM element for game container (required)
 * - gameCanvas: Canvas element for rendering (required)
 * - gameLevelClasses: Array of GameLevel classes (required)
 * - pythonURI, javaURI: Backend URIs for API calls (optional)
 * - fetchOptions: Options for fetch requests (optional)
 * 
 * Example:
 * ```javascript
 * const environment = {
 *     path: "{{site.baseurl}}",
 *     gameContainer: document.getElementById("gameContainer"),
 *     gameCanvas: document.getElementById("gameCanvas"),
 *     gameLevelClasses: [GameLevel1, GameLevel2]
 * };
 * ```
 * 
 * Control buttons (Save Score, Skip Level, Toggle Leaderboard) appear by default.
 * Press Escape key to pause/resume the game.
 */
class GameCore {
    constructor(environment, GameControlClass) {
    this.environment = environment;
    this.path = environment.path;
    this.gameContainer = environment.gameContainer;
    this.gameCanvas = environment.gameCanvas;
    this.pythonURI = environment.pythonURI;
    this.javaURI = environment.javaURI;
    this.fetchOptions = environment.fetchOptions;
    this.uid = null;
    this.id = null;
    this.gname = null;

    // Snapshot the starting level list so we can reliably reset after the final level
    this.initialLevelClasses = [...(environment.gameLevelClasses || [])];

    this.initUser();
    const gameLevelClasses = [...this.initialLevelClasses];
    
    // Store leaderboard instance reference
    this.leaderboardInstance = null;
    
    // If GameControlClass provided, use it immediately
    if (GameControlClass) {
        this.gameControl = new GameControlClass(this, gameLevelClasses);
        this.gameControl.start();
        // Initialize PauseFeature for handling pause/resume
        this._initializePauseFeature();
        // Setup Escape key for pause/resume
        this._setupEscapeKey();
    } else {
        // For gamebuilder: defer initialization until GameControl is loaded
        this._initializeGameControlAsync(gameLevelClasses);
        return;
    }

    // Create top control buttons (unless disabled for game runner/builder)
    if (!this.environment.disablePauseMenu) {
        this._createTopControls();
    }

    // Add margin to game container to avoid collision with top menu
    this._adjustGameContainerPosition();

    // Try to dynamically load Scoreboard (for adventure game stats syncing)
    import('../../adventureGame/Scoreboard.js')
        .then(mod => {
            try {
                const Scoreboard = mod.default || mod.Scoreboard;
                // Set gameControl reference so Scoreboard can update stats
                Scoreboard.gameControl = this.gameControl;
                console.log('Scoreboard gameControl reference set');
            }
            catch (e) { console.debug('Scoreboard init (optional):', e); }
        })
        .catch(() => {
            // no-op: Scoreboard is optional
        });

    // Note: Leaderboard is NOT auto-loaded here to avoid shifting the canvas
    // It will be loaded when user clicks "Toggle Leaderboard" in the pause menu
    }

    async _initializeGameControlAsync(gameLevelClasses) {
        try {
            const mod = await import('./GameControl.js');
            const DefaultGameControl = mod.default || mod;
            this.gameControl = new DefaultGameControl(this, gameLevelClasses);
            this.gameControl.start();
            // Initialize PauseFeature for handling pause/resume
            this._initializePauseFeature();
            // Setup Escape key for pause/resume
            this._setupEscapeKey();
            
            // Create top control buttons after GameControl is ready (unless disabled)
            if (!this.environment.disablePauseMenu) {
                this._createTopControls();
            }

            // Add margin to game container to avoid collision with top menu
            this._adjustGameContainerPosition();

            // Note: Leaderboard is NOT auto-loaded here to avoid shifting the canvas
            // It will be loaded when user clicks "Toggle Leaderboard" in the pause menu
        } catch (err) {
            console.error('Failed to initialize GameControl:', err);
        }
    }

    static main(environment, GameControlClass) {
        return new GameCore(environment, GameControlClass);
    }

    returnHome() {
        if (!this.gameControl || !this.initialLevelClasses.length) return;

        try {
            if (this.gameControl.currentLevel && typeof this.gameControl.currentLevel.destroy === 'function') {
                this.gameControl.currentLevel.destroy();
            }
            this.gameControl.cleanupInteractionHandlers();
        } catch (error) {
            console.error("Error during cleanup when returning home:", error);
        }

        // Restore the original level order and restart from the first one
        this.gameControl.levelClasses = [...this.initialLevelClasses];
        this.gameControl.currentLevelIndex = 0;
        this.gameControl.isPaused = false;
        this.gameControl.transitionToLevel();
    }

    loadNextLevel() {
        if (this.gameControl && this.gameControl.currentLevel) {
            this.gameControl.currentLevel.continue = false;
            console.log("Loading next level...");
        } else {
            console.warn("GameControl or currentLevel not available");
        }
    }

    loadPreviousLevel() {
        if (this.gameControl && this.gameControl.currentLevelIndex > 0) {
            try {
                this.gameControl.currentLevel.destroy();
                this.gameControl.cleanupInteractionHandlers();
            } catch (error) {
                console.error("Error during cleanup when returning home:", error);
            }
            this.gameControl.currentLevelIndex--;
            this.gameControl.transitionToLevel();
        } else {
            console.warn("No previous level to load");
        }
    }
    /**
     * Initialize PauseFeature for handling pause/resume logic
     * Also initializes ScoreFeature 
     */
    _initializePauseFeature() {
        if (!this.gameControl) return;
        
        try {
            import('../PauseFeature.js').then(mod => {
                const PauseFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    container: null,
                    options: {}
                };
                this.gameControl.pauseFeature = new PauseFeature(pauseMenuObj);
                
                // Also initialize ScoreFeature for showing/saving score
                import('../ScoreFeature.js').then(scoreMod => {
                    const ScoreFeature = scoreMod.default;
                    this.gameControl.scoreFeature = new ScoreFeature(pauseMenuObj);
                }).catch(err => {
                    console.warn('Failed to load ScoreFeature:', err);
                });
                
            }).catch(err => {
                console.warn('Failed to load PauseFeature:', err);
            });
        } catch (err) {
            console.warn('Error initializing PauseFeature:', err);
        }
    }

    /**
     * Show the pause menu modal with 4 options:
     * - Show Score: displays the score counter
     * - Save Score: saves the score to backend
     * - Skip Level: skips to next level
     * - Toggle Leaderboard: shows/hides the leaderboard
     */
    showPauseModal() {
        if (!this.gameControl) return;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('pauseModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Pause the game - MUST call gameControl.pause() to properly save handlers
        if (this.gameControl.pause) {
            this.gameControl.pause();
        } else if (this.gameControl.pauseFeature) {
            this.gameControl.pauseFeature.show();
        }
        
        // Create the modal
        const modal = document.createElement('div');
        modal.id = 'pauseModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #4a9eff;
            border-radius: 16px;
            padding: 30px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;
        
        modal.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #fff; text-align: center; font-size: 24px;">
                ⏸️ Pause Menu
            </h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button id="pause-toggle-score" class="pause-menu-btn" style="
                    padding: 15px 20px;
                    background: #2d2d4a;
                    border: 2px solid #4a9eff;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">📊 Toggle Score</button>
                
                <button id="pause-save-score" class="pause-menu-btn" style="
                    padding: 15px 20px;
                    background: #2d2d4a;
                    border: 2px solid #4caf50;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">💾 Save Score</button>
                
                <button id="pause-skip-level" class="pause-menu-btn" style="
                    padding: 15px 20px;
                    background: #2d2d4a;
                    border: 2px solid #ff9800;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">⏭️ Skip Level</button>
                
                <button id="pause-toggle-leaderboard" class="pause-menu-btn" style="
                    padding: 15px 20px;
                    background: #2d2d4a;
                    border: 2px solid #e91e63;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">🏆 Toggle Leaderboard</button>
                
                <button id="pause-resume" class="pause-menu-btn" style="
                    padding: 15px 20px;
                    background: #4a9eff;
                    border: 2px solid #4a9eff;
                    color: #fff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                ">▶️ Resume</button>
            </div>
        `;
        
        // Add hover effects via JavaScript
        setTimeout(() => {
            const buttons = modal.querySelectorAll('.pause-menu-btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 4px 12px rgba(74, 158, 255, 0.3)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = 'none';
                });
            });
        }, 0);
        
        // Add to document
        document.body.appendChild(modal);
        
        // Attach event listeners
        document.getElementById('pause-toggle-score').addEventListener('click', () => this._handleToggleScore());
        document.getElementById('pause-save-score').addEventListener('click', () => this._handleSaveScore());
        document.getElementById('pause-skip-level').addEventListener('click', () => this._handleSkipLevel());
        document.getElementById('pause-toggle-leaderboard').addEventListener('click', () => this._handleToggleLeaderboard());
        document.getElementById('pause-resume').addEventListener('click', () => this._closePauseModal());
    }

    /**
     * Handle Toggle Score option - shows/hides the score counter
     */
    _handleToggleScore() {
        // Close modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume the game - MUST call gameControl.resume() to properly restore handlers
        if (this.gameControl) {
            this.gameControl.isPaused = false;
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            } else {
                // Fallback: manually restore handlers if resume doesn't exist
                if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
                    this.gameControl.restoreInteractionHandlers();
                }
                // Restart the game loop
                if (typeof this.gameControl.gameLoop === 'function') {
                    this.gameControl.gameLoop();
                }
            }
        }
        
        // If scoreFeature exists, toggle the score counter
        if (this.gameControl && this.gameControl.scoreFeature) {
            const scoreCounter = document.querySelector('.pause-score-counter');
            if (scoreCounter) {
                const isVisible = scoreCounter.style.display !== 'none';
                scoreCounter.style.display = isVisible ? 'none' : 'block';
            }
            if (typeof this.gameControl.toggleScoreDisplay === 'function') {
                this.gameControl.toggleScoreDisplay();
            }
        } else {
            console.warn('ScoreFeature not initialized');
        }
    }

    /**
     * Handle Save Score option - saves the score to backend
     */
    async _handleSaveScore() {
        // Close modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume the game first - MUST call gameControl.resume() to properly restore handlers
        if (this.gameControl) {
            this.gameControl.isPaused = false;
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            } else {
                // Fallback: manually restore handlers if resume doesn't exist
                if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
                    this.gameControl.restoreInteractionHandlers();
                }
                // Restart the game loop
                if (typeof this.gameControl.gameLoop === 'function') {
                    this.gameControl.gameLoop();
                }
            }
        }
        
        // If scoreFeature exists, save the score
        if (this.gameControl && this.gameControl.scoreFeature) {
            try {
                // Get the button element if available, otherwise create a temporary one
                const buttonEl = document.createElement('button');
                await this.gameControl.scoreFeature.saveScore(buttonEl);
            } catch (error) {
                console.error('Failed to save score:', error);
                alert('Failed to save score. Please try again.');
            }
        } else {
            console.warn('ScoreFeature not initialized');
            alert('Score feature not available');
        }
    }

    /**
     * Handle Skip Level option - skips to the next level
     */
    _handleSkipLevel() {
        // Remove modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Unpause the game first - MUST call gameControl.resume() to properly restore handlers
        if (this.gameControl) {
            this.gameControl.isPaused = false;
            
            // Call resume first to ensure game is running
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            } else {
                // Fallback: manually restore handlers if resume doesn't exist
                if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
                    this.gameControl.restoreInteractionHandlers();
                }
                // Restart the game loop
                if (typeof this.gameControl.gameLoop === 'function') {
                    this.gameControl.gameLoop();
                }
            }
            
            // Try to find and call the correct method to skip level
            // Common method names for skipping level - try in order
            if (typeof this.gameControl.nextLevel === 'function') {
                this.gameControl.nextLevel();
                console.log('Skipped level via nextLevel()');
            } else if (typeof this.gameControl.loadNextLevel === 'function') {
                this.gameControl.loadNextLevel();
                console.log('Skipped level via loadNextLevel()');
            } else if (typeof this.gameControl.goToNextLevel === 'function') {
                this.gameControl.goToNextLevel();
                console.log('Skipped level via goToNextLevel()');
            } else if (typeof this.gameControl.endLevel === 'function') {
                this.gameControl.endLevel();
                console.log('Skipped level via endLevel()');
            } else if (typeof this.gameControl.transitionToLevel === 'function') {
                // Try to advance to next level index
                if (typeof this.gameControl.currentLevelIndex !== 'undefined') {
                    this.gameControl.currentLevelIndex++;
                }
                this.gameControl.transitionToLevel();
                console.log('Skipped level via transitionToLevel()');
            } else {
                console.warn('No skip level method found on gameControl');
            }
        }
    }

    /**
     * Handle Toggle Leaderboard option - shows/hides the leaderboard
     */
    _handleToggleLeaderboard() {
        // Close modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume game first - MUST call gameControl.resume() to properly restore handlers
        if (this.gameControl) {
            this.gameControl.isPaused = false;
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            } else {
                // Fallback: manually restore handlers if resume doesn't exist
                if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
                    this.gameControl.restoreInteractionHandlers();
                }
                // Restart the game loop
                if (typeof this.gameControl.gameLoop === 'function') {
                    this.gameControl.gameLoop();
                }
            }
        }
        
        // Get the game container element
        const gameContainer = this.gameContainer instanceof HTMLElement ? 
            this.gameContainer : document.getElementById('gameContainer');
        
        // Try to find leaderboard container
        let leaderboardContainer = document.getElementById('leaderboard-container');
        
        if (leaderboardContainer) {
            // Toggle visibility
            if (leaderboardContainer.style.display === 'none' || leaderboardContainer.classList.contains('initially-hidden')) {
                leaderboardContainer.style.display = 'block';
                leaderboardContainer.classList.remove('initially-hidden');
                
                // CRITICAL: Always use fixed positioning to avoid being affected by game container
                leaderboardContainer.style.position = 'fixed';
                leaderboardContainer.style.top = '80px';
                leaderboardContainer.style.right = '20px';
                leaderboardContainer.style.left = 'auto';
                leaderboardContainer.style.zIndex = '1000';
            } else {
                leaderboardContainer.style.display = 'none';
            }
            console.log('Leaderboard toggled via DOM');
        } else {
            // Leaderboard container not found - create it
            console.log('Leaderboard container not found, creating new...');
            
            if (this.gameControl) {
                import('../Leaderboard.js')
                    .then(mod => {
                        // Determine parent - use gameContainer if available
                        let parentId = 'gameContainer';
                        if (typeof this.gameContainer === 'string') {
                            parentId = this.gameContainer;
                        } else if (this.gameContainer instanceof HTMLElement) {
                            parentId = this.gameContainer.id || 'gameContainer';
                        }
                        
                        this.leaderboardInstance = new mod.default(this.gameControl, { 
                            gameName: 'AdventureGame',
                            parentId: parentId,
                            initiallyHidden: false
                        });
                        
                        // Force positioning after creation - use fixed positioning
                        setTimeout(() => {
                            const container = document.getElementById('leaderboard-container');
                            if (container) {
                                // CRITICAL: Always use fixed positioning
                                container.style.position = 'fixed';
                                container.style.top = '80px';
                                container.style.right = '20px';
                                container.style.left = 'auto';
                                container.style.zIndex = '1000';
                            }
                        }, 100);
                        
                        console.log('Leaderboard created and shown with fixed positioning');
                    })
                    .catch(err => {
                        console.warn('Failed to create leaderboard:', err);
                    });
            }
        }
    }

    /**
     * Close the pause modal and resume the game
     */
    _closePauseModal() {
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume the game - use gameControl methods directly
        if (this.gameControl) {
            this.gameControl.isPaused = false;
            
            // Call resume on gameControl if available (this handles restoring handlers)
            if (typeof this.gameControl.resume === 'function') {
                this.gameControl.resume();
            } else {
                // Fallback: manually restore handlers if resume doesn't exist
                if (typeof this.gameControl.restoreInteractionHandlers === 'function') {
                    this.gameControl.restoreInteractionHandlers();
                }
                // Restart the game loop
                if (typeof this.gameControl.gameLoop === 'function') {
                    this.gameControl.gameLoop();
                }
            }
            
            // Also try pauseFeature.hide() if it exists
            if (this.gameControl.pauseFeature && typeof this.gameControl.pauseFeature.hide === 'function') {
                try {
                    this.gameControl.pauseFeature.hide();
                } catch (e) {
                    console.warn('pauseFeature.hide() failed:', e);
                }
            }
        }
    }

    /**
     * Setup Escape key listener for pause/resume functionality.
     * This always works regardless of whether pause control buttons are enabled.
     */
    _setupEscapeKey() {
        if (this.escapeKeyHandler) {
            // Already set up, don't add duplicate listeners
            return;
        }
        
        this.escapeKeyHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                
                // If there's already a pause modal open, close it and resume
                const existingModal = document.getElementById('pauseModal');
                if (existingModal) {
                    existingModal.remove();
                    // Resume the game - MUST call gameControl.resume() to properly restore handlers
                    if (this.gameControl) {
                        this.gameControl.isPaused = false;
                        if (typeof this.gameControl.resume === 'function') {
                            this.gameControl.resume();
                        }
                    }
                    return;
                }
                
                // Show pause modal if method exists (adventure game)
                if (typeof this.showPauseModal === 'function') {
                    this.showPauseModal();
                } else {
                    // Fallback: simple pause/resume toggle
                    if (this.gameControl && this.gameControl.isPaused) {
                        this.gameControl.isPaused = false;
                        if (typeof this.gameControl.resume === 'function') {
                            this.gameControl.resume();
                        }
                    } else if (this.gameControl && this.gameControl.pause) {
                        this.gameControl.pause();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', this.escapeKeyHandler);
    }

    /**
     * Creates the pause control buttons (Save Score, Skip Level, Toggle Leaderboard).
     * 
     * These buttons appear by default in the top-left corner.
     * Pause/Resume functionality is handled by the Escape key.
     * 
     * Example usage:
     * ```javascript
     * const environment = {
     *     path: "{{site.baseurl}}",
     *     gameContainer: document.getElementById("gameContainer"),
     *     gameCanvas: document.getElementById("gameCanvas"),
     *     gameLevelClasses: [Level1, Level2]
     * };
     * 
     * const game = Game.main(environment, GameControl);
     * ```
     * 
     * The button bar will appear in the top-left corner with:
     * - Save Score button: Saves current score to backend
     * - Skip Level button: Advances to the next level
     * - Toggle Leaderboard button: Shows/hides the leaderboard
     * 
    /**
     * Creates top controls (buttons, UI elements).
     * Override this method in game-specific classes to add custom UI.
     * Base implementation does nothing - keeps the engine generic.
     * 
     * Example override in AdventureGame.js or MansionGame.js
     */
    _createTopControls() {
        // Base implementation - no default UI
        // Override in game-specific wrappers like:
        // - /assets/js/adventureGame/Game.js
        // - /assets/js/mansionGame/MansionLogic/Game.js
    }

    /**
     * Adjust game container position to avoid collision with top menu
     */
    _adjustGameContainerPosition() {
        // Try multiple possible container IDs
        const possibleIds = ['gameContainer', 'game-container', 'canvas-container', 'gameCanvasContainer'];
        let container = null;
        
        for (const id of possibleIds) {
            const el = document.getElementById(id);
            if (el) {
                container = el;
                break;
            }
        }
        
        // Also try the gameContainer from environment
        if (!container) {
            container = this.gameContainer instanceof HTMLElement ? 
                this.gameContainer : document.getElementById('gameContainer');
        }
        
        // Try to find canvas as fallback
        if (!container) {
            container = document.querySelector('canvas')?.parentElement;
        }
        
        if (container) {
            console.log('Found container to adjust:', container.id || container.tagName);
            
            // Apply style with !important to override any existing styles
            container.style.setProperty('margin-top', '40px', 'important');
            container.style.setProperty('top', '40px', 'important');
            
            // Also try direct style assignment
            container.style.marginTop = '40px';
            container.style.top = '40px';
            
            // If it's the canvas parent, adjust that too
            const parent = container.parentElement;
            if (parent && parent !== document.body) {
                parent.style.marginTop = '40px';
            }
        } else {
            console.warn('Could not find game container to adjust');
        }
    }

    initUser() {
        // Skip user initialization if no backend URIs are configured (e.g., in gamebuilder embed mode)
        if (!this.pythonURI || this.pythonURI === '') {
            console.log('Skipping user initialization - no backend configured');
            return;
        }

        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.warn("Could not fetch user ID (HTTP " + response.status + "), continuing without user data");
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    console.log('No user data available, continuing game without user tracking');
                    return;
                }
                this.uid = data.uid;

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response) return;
                if (!response.ok) {
                    console.warn(`Spring server unavailable (${response.status}), continuing without user data`);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
            })
            .catch(error => {
                console.warn("User initialization failed (non-critical):", error.message);
                // Don't stop the game - user tracking is optional
            });
    }
}

export { GameCore };
export default {
    main: (environment, GameControlClass) => GameCore.main(environment, GameControlClass)
};