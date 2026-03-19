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
 * Control buttons (Save Score, Exit Level, Toggle Leaderboard) appear by default.
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

    // Add margin to game container to avoid collision with top menu (unless disabled for embedded contexts)
    if (!this.environment.disableContainerAdjustment) {
        this._adjustGameContainerPosition();
    }

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

            // Add margin to game container to avoid collision with top menu (unless disabled for embedded contexts)
            if (!this.environment.disableContainerAdjustment) {
                this._adjustGameContainerPosition();
            }

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
            // v1.1 stores the pause code in PauseMenu.js (not "PauseFeature").
            import('./PauseMenu.js').then(mod => {
                const PauseMenu = mod.default;
                // PauseMenu expects the gameControl instance directly
                const pauseMenuInstance = new PauseMenu(this.gameControl, {});
                this.gameControl.pauseFeature = pauseMenuInstance;

                // Initialize ScoreManager through GameEnv (proper OOP)
                if (this.gameControl.gameEnv) {
                    this.gameControl.gameEnv.initScoreManager().then(() => {
                        console.log('ScoreManager initialized successfully');
                    }).catch(err => {
                        console.warn('Failed to initialize ScoreManager:', err);
                    });
                }

            }).catch(err => {
                console.warn('Failed to load PauseMenu:', err);
            });
        } catch (err) {
            console.warn('Error initializing PauseFeature:', err);
        }
    }

    // Return the currently active GameControl (mini-game may set activeGameControl)
    getActiveControl() {
        return (this.activeGameControl && this.activeGameControl !== null) ? this.activeGameControl : this.gameControl;
    }

    /**
     * Show the pause menu modal with 4 options:
     * - Show Score: displays the score counter
     * - Save Score: saves the score to backend
     * - Skip Level: skips to next level
     * - Toggle Leaderboard: shows/hides the leaderboard
     */
    showPauseModal() {
        if (!this.getActiveControl()) return;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('pauseModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Pause the game - MUST call gameControl.pause() to properly save handlers
        const ctrl = this.getActiveControl();
        if (ctrl.pause) {
            ctrl.pause();
        } else if (ctrl.pauseFeature) {
            ctrl.pauseFeature.show();
        }
        
        // Create the modal using CSS classes from pause-modal.scss
        const modal = document.createElement('div');
        modal.id = 'pauseModal';
        
        modal.innerHTML = `
            <div class="pause-modal-content">
                <h2 class="pause-modal-header">Pause Menu</h2>
                <div class="pause-modal-buttons">
                    <button id="pause-toggle-score" class="pause-menu-btn">Toggle Score</button>
                    <button id="pause-save-score" class="pause-menu-btn">Save Score</button>
                    <button id="pause-skip-level" class="pause-menu-btn">Exit Level</button>
                    <button id="pause-toggle-leaderboard" class="pause-menu-btn">Toggle Leaderboard</button>
                    <button id="pause-resume" class="pause-menu-btn primary">Resume</button>
                </div>
            </div>
        `;
        
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
    async _handleToggleScore() {
        console.log('Game: _handleToggleScore called');
        
        // Close modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume the game - MUST call gameControl.resume() to properly restore handlers
        const ctrl = this.getActiveControl();
        if (ctrl) {
            ctrl.isPaused = false;
            if (typeof ctrl.resume === 'function') {
                ctrl.resume();
            } else {
                if (typeof ctrl.restoreInteractionHandlers === 'function') {
                    ctrl.restoreInteractionHandlers();
                }
                if (typeof ctrl.gameLoop === 'function') {
                    ctrl.gameLoop();
                }
            }
        }
        
        // Access scoreManager from GameEnv (proper OOP) - gameEnv is on currentLevel
        const gameEnv = ctrl?.currentLevel?.gameEnv;
        console.log('Game: gameEnv exists?', !!gameEnv);
        console.log('Game: scoreManager exists?', !!gameEnv?.scoreManager);
        
        if (gameEnv) {
            // Auto-initialize scoreManager if not already initialized
            if (!gameEnv.scoreManager) {
                console.log('Game: Initializing scoreManager...');
                await gameEnv.initScoreManager();
                console.log('Game: After init, scoreManager exists?', !!gameEnv.scoreManager);
            }
            
            if (gameEnv.scoreManager) {
                console.log('Game: Calling toggleScoreDisplay...');
                gameEnv.scoreManager.toggleScoreDisplay();
            } else {
                console.error('Game: Failed to initialize scoreManager');
            }
        } else {
            console.error('Game: gameEnv not found on active control');
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
        const ctrl = this.getActiveControl();
        if (ctrl) {
            ctrl.isPaused = false;
            if (typeof ctrl.resume === 'function') {
                ctrl.resume();
            } else {
                if (typeof ctrl.restoreInteractionHandlers === 'function') {
                    ctrl.restoreInteractionHandlers();
                }
                if (typeof ctrl.gameLoop === 'function') {
                    ctrl.gameLoop();
                }
            }
        }
        
        // Access scoreManager from GameEnv (proper OOP) - gameEnv is on currentLevel
        const gameEnv = ctrl?.currentLevel?.gameEnv;
        if (gameEnv) {
            // Auto-initialize scoreManager if not already initialized
            if (!gameEnv.scoreManager) {
                await gameEnv.initScoreManager();
            }
            
            if (gameEnv.scoreManager) {
                try {
                    const buttonEl = document.createElement('button');
                    await gameEnv.scoreManager.saveScore(buttonEl);
                    
                    // Refresh leaderboard to show the new score
                    if (this.leaderboardInstance && typeof this.leaderboardInstance.fetchLeaderboard === 'function') {
                        console.log('Game: Refreshing leaderboard after save');
                        await this.leaderboardInstance.fetchLeaderboard();
                    }
                } catch (error) {
                    console.error('Failed to save score:', error);
                    alert('Failed to save score. Please try again.');
                }
            } else {
                console.error('Failed to initialize scoreManager');
                alert('Score feature not available');
            }
        }
    }

    /**
     * Handle Exit Level option - skips to the next level
     */
    _handleSkipLevel() {
        // Remove modal first
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Unpause the active control first - MUST call resume() to properly restore handlers
        const ctrl = this.getActiveControl();
        if (ctrl) {
            ctrl.isPaused = false;

            if (typeof ctrl.resume === 'function') {
                ctrl.resume();
            } else {
                if (typeof ctrl.restoreInteractionHandlers === 'function') {
                    ctrl.restoreInteractionHandlers();
                }
                if (typeof ctrl.gameLoop === 'function') {
                    ctrl.gameLoop();
                }
            }

            // Try to find and call the correct method to skip level on the active control
            // If this control temporarily replaced its level list (for example
            // when entering the End portal the desert level stashes the original
            // levelClasses to `._originalLevelClasses`), restore the original
            // levelClasses and advance to the logical next level. This prevents
            // transitionToLevel from running into an out-of-bounds index and
            // producing a black screen.
            if (ctrl._originalLevelClasses && Array.isArray(ctrl._originalLevelClasses)) {
                try {
                    const orig = Array.isArray(ctrl._originalLevelClasses) ? [...ctrl._originalLevelClasses] : ctrl._originalLevelClasses;
                    // Try to find where the End level was in the original ordering
                    let endIndex = orig.findIndex(c => c && c.name && /End/i.test(c.name));
                    // If we couldn't find an explicit End class, fallback to current index
                    if (endIndex === -1 && typeof ctrl.currentLevelIndex === 'number') {
                        endIndex = ctrl.currentLevelIndex;
                    }
                    const nextIndex = endIndex >= 0 ? Math.min(endIndex + 1, orig.length - 1) : 0;
                    ctrl.levelClasses = orig;
                    ctrl.currentLevelIndex = nextIndex;
                    // cleanup temporary storage
                    try { delete ctrl._originalLevelClasses; } catch (e) { ctrl._originalLevelClasses = undefined; }
                    console.log('Restored original levelClasses and advancing to index', ctrl.currentLevelIndex);
                    if (typeof ctrl.transitionToLevel === 'function') {
                        ctrl.transitionToLevel();
                        return;
                    }
                } catch (e) {
                    console.warn('Failed to restore original levelClasses during skip:', e);
                }
            }

            if (typeof ctrl.nextLevel === 'function') {
                ctrl.nextLevel();
                console.log('Skipped level via nextLevel() on active control');
            } else if (typeof ctrl.loadNextLevel === 'function') {
                ctrl.loadNextLevel();
                console.log('Skipped level via loadNextLevel() on active control');
            } else if (typeof ctrl.goToNextLevel === 'function') {
                ctrl.goToNextLevel();
                console.log('Skipped level via goToNextLevel() on active control');
            } else if (typeof ctrl.endLevel === 'function') {
                ctrl.endLevel();
                console.log('Skipped level via endLevel() on active control');
            } else if (typeof ctrl.transitionToLevel === 'function') {
                if (typeof ctrl.currentLevelIndex !== 'undefined') {
                    ctrl.currentLevelIndex++;
                }
                ctrl.transitionToLevel();
                console.log('Skipped level via transitionToLevel() on active control');
            } else {
                console.warn('No skip level method found on active control');
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
        
        // Resume the active control first - MUST call resume() to properly restore handlers
        const ctrl = this.getActiveControl();
        if (ctrl) {
            ctrl.isPaused = false;
            if (typeof ctrl.resume === 'function') {
                ctrl.resume();
            } else {
                if (typeof ctrl.restoreInteractionHandlers === 'function') {
                    ctrl.restoreInteractionHandlers();
                }
                if (typeof ctrl.gameLoop === 'function') {
                    ctrl.gameLoop();
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
            
            const ctrlForLeaderboard = this.getActiveControl();
            import('../Leaderboard.js')
                .then(mod => {
                    // Determine parent - use gameContainer if available
                    let parentId = 'gameContainer';
                    if (typeof this.gameContainer === 'string') {
                        parentId = this.gameContainer;
                    } else if (this.gameContainer instanceof HTMLElement) {
                        parentId = this.gameContainer.id || 'gameContainer';
                    }

                    this.leaderboardInstance = new mod.default(ctrlForLeaderboard || this.gameControl, { 
                        gameName: 'AdventureGame',
                        parentId: parentId,
                        initiallyHidden: false
                    });

                    // Force positioning after creation - use fixed positioning
                    setTimeout(() => {
                        const container = document.getElementById('leaderboard-container');
                        if (container) {
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

    /**
     * Close the pause modal and resume the game
     */
    _closePauseModal() {
        const modal = document.getElementById('pauseModal');
        if (modal) {
            modal.remove();
        }
        
        // Resume the active control - use its methods if available
        const ctrl = this.getActiveControl();
        if (ctrl) {
            ctrl.isPaused = false;

            if (typeof ctrl.resume === 'function') {
                ctrl.resume();
            } else {
                if (typeof ctrl.restoreInteractionHandlers === 'function') {
                    ctrl.restoreInteractionHandlers();
                }
                if (typeof ctrl.gameLoop === 'function') {
                    ctrl.gameLoop();
                }
            }

            if (ctrl.pauseFeature && typeof ctrl.pauseFeature.hide === 'function') {
                try {
                    ctrl.pauseFeature.hide();
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
                        // Resume the active control - MUST call resume() to properly restore handlers
                        const ctrl = this.getActiveControl();
                        if (ctrl) {
                            ctrl.isPaused = false;
                            if (typeof ctrl.resume === 'function') {
                                ctrl.resume();
                            }
                        }
                    return;
                }
                
                // Show pause modal if method exists (adventure game)
                    if (typeof this.showPauseModal === 'function') {
                    this.showPauseModal();
                } else {
                    // Fallback: simple pause/resume toggle on active control
                    const ctrl = this.getActiveControl();
                    if (ctrl && ctrl.isPaused) {
                        ctrl.isPaused = false;
                        if (typeof ctrl.resume === 'function') {
                            ctrl.resume();
                        }
                    } else if (ctrl && ctrl.pause) {
                        ctrl.pause();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', this.escapeKeyHandler);
    }

    /**
     * Creates the pause control buttons (Save Score, Exit Level, Toggle Leaderboard).
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
     * - Exit Level button: Advances to the next level
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