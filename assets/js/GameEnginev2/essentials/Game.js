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

    // Try to dynamically load the Leaderboard
    import('../features/Leaderboard.js')
        .then(mod => {
            try {
                // Get the actual container element from gameContainer
                let parentId = 'gameContainer'; // default
                
                // If gameContainer is a string ID, use it directly
                if (typeof this.gameContainer === 'string') {
                    parentId = this.gameContainer;
                }
                // If gameContainer is an HTMLElement, get its ID
                else if (this.gameContainer instanceof HTMLElement) {
                    parentId = this.gameContainer.id || 'gameContainer';
                }
                
                // Store leaderboard instance
                this.leaderboardInstance = new mod.default(this.gameControl, { 
                    gameName: 'AdventureGame',
                    parentId: parentId
                }); 
            }
            catch (e) { console.warn('Leaderboard init failed:', e); }
        })
        .catch(() => {
            // no-op: Leaderboard is optional
        });
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
            this._setupEscapeKey();
            
            // Create top control buttons after GameControl is ready (unless disabled)
            if (!this.environment.disablePauseMenu) {
                this._createTopControls();
            }

            // Try to dynamically load the Leaderboard
            import('../features/Leaderboard.js')
                .then(mod => {
                    try {
                        let parentId = 'gameContainer';
                        if (typeof this.gameContainer === 'string') {
                            parentId = this.gameContainer;
                        } else if (this.gameContainer instanceof HTMLElement) {
                            parentId = this.gameContainer.id || 'gameContainer';
                        }
                        // Store leaderboard instance
                        this.leaderboardInstance = new mod.default(this.gameControl, { 
                            gameName: 'AdventureGame',
                            parentId: parentId
                        }); 
                    }
                    catch (e) { console.warn('Leaderboard init failed:', e); }
                })
                .catch(() => {
                    // no-op: Leaderboard is optional
                });
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
     */
    _initializePauseFeature() {
        if (!this.gameControl) return;
        
        try {
            import('../features/PauseFeature.js').then(mod => {
                const PauseFeature = mod.default;
                const pauseMenuObj = {
                    gameControl: this.gameControl,
                    container: null
                };
                this.gameControl.pauseFeature = new PauseFeature(pauseMenuObj);
            }).catch(err => {
                console.warn('Failed to load PauseFeature:', err);
            });
        } catch (err) {
            console.warn('Error initializing PauseFeature:', err);
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
                    if (this.gameControl) this.gameControl.resume();
                    return;
                }
                
                // Show pause modal if method exists (adventure game)
                if (typeof this.showPauseModal === 'function') {
                    this.showPauseModal();
                } else {
                    // Fallback: simple pause/resume toggle
                    if (this.gameControl && this.gameControl.isPaused) {
                        this.gameControl.resume();
                    } else if (this.gameControl) {
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
        // - /assets/js/adventureGame/AdventureGame.js
        // - /assets/js/mansionGame/MansionLogic/Game.js
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