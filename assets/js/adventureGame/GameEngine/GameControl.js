// GameControl.js with improved level transition handling
import GameLevel from "./GameLevel.js";

class GameControl {
    /**
     * GameControl class to manage the game levels and transitions
     * @param {*} path - The path to the game assets
     * @param {*} levelClasses - The classes of for each game level
     */
    constructor(game, levelClasses) {
        // GameControl properties
        this.game = game; // Reference required for game-in-game logic
        this.path = game.path;
        this.gameContainer = game.gameContainer; // Document element that contains the game
        this.gameCanvas = game.gameCanvas; // Document element that contains the game canvas
        this.levelClasses = levelClasses;
        this.currentLevel = null;
        this.currentLevelIndex = 0;
        this.gameLoopCounter = 0;
        this.isPaused = false;
    // Optional reference to a PauseMenu instance. If set, Escape will toggle it.
    this.pauseMenu = null;
    // Optional per-game PauseMenu configuration (passed to the shared PauseMenu by Game.js)
    // Games can override these values if they want to count a different stat name/label.
    this.pauseMenuOptions = {
        counterVar: 'coinsCollected',
        counterLabel: 'Coins collected'
    };
    // Whether to show per-level counts. We want a single cumulative counter for coins collected.
    this.pauseMenuOptions.counterPerLevel = false;
    // use a unique storage key so stats are per-game
    this.pauseMenuOptions.storageKey = 'pauseMenuStats:adventure';
    this.skipKeyListener = this.handleSkipKey.bind(this);
        this.exitKeyListener = this.handleExitKey.bind(this);
        this.gameOver = null; // Callback for when the game is over 
        this.savedCanvasState = []; // Save the current levels game elements 
        
        // Capture all global interactions for cleaning up during transitions
        this.globalInteractionHandlers = new Set();
        // Save interaction handlers for game-in-game restore functionality
        this.savedInteractionHandlers = new Set();
    }

    
    start() {
        this.addExitKeyListener();
        this.addSkipKeyListener();
        this.transitionToLevel();
    }

    /**
     * Register a global interaction handler that will be cleaned up during transitions
     * @param {Object} handler - Object with handleKeyDownBound and handleKeyUpBound methods
     */
    registerInteractionHandler(handler) {
        if (handler) {
            this.globalInteractionHandlers.add(handler);
        }
    }

    /**
     * Unregister a global interaction handler
     * @param {Object} handler - Handler to remove
     */
    unregisterInteractionHandler(handler) {
        if (handler) {
            this.globalInteractionHandlers.delete(handler);
        }
    }

    /**
     * Clean up all registered global interaction handlers
     * @param {boolean} saveForRestore - Whether to save handlers for later restoration
     */
    cleanupInteractionHandlers(saveForRestore = false) {
        if (saveForRestore) {
            // Save current handlers before cleaning up
            this.savedInteractionHandlers = new Set(this.globalInteractionHandlers);
        }
        
        this.globalInteractionHandlers.forEach(handler => {
            if (handler.removeInteractKeyListeners) {
                handler.removeInteractKeyListeners();
            }
        });
        this.globalInteractionHandlers.clear();
    }

    /**
     * Restore previously saved interaction handlers (for game-in-game functionality)
     */
    restoreInteractionHandlers() {
        this.savedInteractionHandlers.forEach(handler => {
            
            // Try multiple possible method names for adding listeners
            if (handler.bindInteractKeyListeners) {
                handler.bindInteractKeyListeners();
            } else if (handler.addInteractKeyListeners) {
                handler.addInteractKeyListeners();
            } else if (handler.setupEventListeners) {
                handler.setupEventListeners();
            } else if (handler.addEventListener) {
                handler.addEventListener();
            } else if (handler.init) {
                handler.init();
            } else {
                console.log("No suitable add method found for handler");
            }
            
            // Re-register the handler
            this.globalInteractionHandlers.add(handler);
        });
        // Clear saved handlers after restoration
        this.savedInteractionHandlers.clear();
    }

    /**
     * Transitions to the next level in the level by
     * 1. Creating a new GameLevel instance
     * 2. Creating the level using the GameLevelClass
     * 3. Starting the game loop
     */ 
    transitionToLevel() {
        // Clean up any lingering interaction handlers
        this.cleanupInteractionHandlers();

        const GameLevelClass = this.levelClasses[this.currentLevelIndex];
        this.currentLevel = new GameLevel(this);
        this.currentLevel.create(GameLevelClass);
        this.gameLoop();
    }

    /**
     * The main game loop 
     */
    gameLoop() {
        // If the level is not set to continue, handle the level end condition 
        if (!this.currentLevel.continue) {
            this.handleLevelEnd();
            return;
        }
        // If the game level is paused, stop the game loop
        if (this.isPaused) {
            return;
        }
        // Level updates
        this.currentLevel.update();
        this.handleInLevelLogic();
        // Recurse at frame rate speed
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * This method is a placeholder for future logic that needs to be executed during the game loop.
     * For example, a starting page or time-based events
     */
    handleInLevelLogic() {
        // This condition is established for future starting page logic
        if (this.currentLevelIndex === 0 && this.gameLoopCounter === 0) {
            console.log("Start Level.");
        }
        // This counter is established for future time-based logic, like frames per second
        this.gameLoopCounter++;
    }

    /**
     * Handles the level end by
     * 1. Destroying the current level
     * 2. Calling the gameOver callback if it exists
     * 3. Transitioning to the next level
     */
    handleLevelEnd() {
        // NOTE: For adventure game, the pause menu counter (coinsCollected) is NOT incremented here.
        // It is ONLY incremented by coin collection via the collectCoin() method.
        // Level completion or skipping should not affect the coin counter.
        
        // Clean up any lingering interaction handlers
        this.cleanupInteractionHandlers();

        // Destroy current level safely
        try {
            if (this.currentLevel && typeof this.currentLevel.destroy === 'function') {
                this.currentLevel.destroy();
            }
        } catch (e) {
            console.error('Error destroying current level:', e);
        }

        // If there are more levels, advance. Otherwise finish gracefully.
        if (this.currentLevelIndex < this.levelClasses.length - 1) {
            // Inform user and go to next level
            //try { alert("Level ended."); } catch (e) { /* ignore */ }
            if (this.gameOver) {
                this.gameOver();
            } else {
                this.currentLevelIndex++;
                this.transitionToLevel();
            }
        } else {
            // Final level completed: prefer game.returnHome() if available,
            // otherwise call gameOver callback or show a completion message.
            if (this.game && typeof this.game.returnHome === 'function') {
                this.game.returnHome();
            } else if (this.gameOver) {
                this.gameOver();
            } else {
                try { alert("All levels completed."); } catch (e) { /* ignore */ }
            }
            // Ensure no dangling currentLevel reference
            this.currentLevel = null;
        }
    }

    /**
     * Exit key handler to end the current level
     * @param {*} event - The keydown event object
     */
    handleExitKey(event) {
        if (event.key === 'Escape') {
            // If a PauseMenu has been registered, toggle it. Do NOT end level from Escape.
            if (this.pauseMenu) {
                try {
                    const isHidden = this.pauseMenu.container && this.pauseMenu.container.getAttribute('aria-hidden') === 'true';
                    if (isHidden) {
                        this.pause();
                        if (typeof this.pauseMenu.show === 'function') this.pauseMenu.show();
                    } else {
                        if (typeof this.pauseMenu.hide === 'function') this.pauseMenu.hide();
                        this.resume();
                    }
                } catch (e) {
                    console.warn('Error toggling pause menu:', e);
                }
            }
        }
    }

    /**
     * Handle skip-level key (default: 'L')
     */
    handleSkipKey(event) {
        // Don't interfere with typing in inputs
        const tag = event.target && event.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || event.defaultPrevented) return;

        if (event.key === 'l' || event.key === 'L') {
            // If on the last level and no return handler exists, ignore; otherwise allow skip to trigger level-end flow
            if (this.currentLevelIndex >= this.levelClasses.length - 1 && !(this.game && typeof this.game.returnHome === 'function')) {
                return;
            }
            // Call the public API to end/skip the level
            try {
                this.endLevel();
            } catch (e) {
                console.warn('Error skipping level via L key:', e);
            }
        }
    }

    addSkipKeyListener() {
        document.addEventListener('keydown', this.skipKeyListener);
    }

    removeSkipKeyListener() {
        document.removeEventListener('keydown', this.skipKeyListener);
    }

    /**
     * End the current level (public API)
     */
    endLevel() {
        if (this.currentLevel) {
            this.currentLevel.continue = false;
        }
    }

    /**
     * Increment an arbitrary stat on this GameControl (keeps PauseMenu in sync if present)
     */
    incrementStat(statName, amount = 1) {
        try {
            this[statName] = (this[statName] || 0) + Number(amount || 0);
            if (this.stats) this.stats[statName] = this[statName];
            if (this.pauseMenu && typeof this.pauseMenu._updateStatsDisplay === 'function') this.pauseMenu._updateStatsDisplay();
            if (this.pauseMenu && typeof this.pauseMenu._saveStatsToStorage === 'function') this.pauseMenu._saveStatsToStorage();
        } catch (e) {
            console.warn('incrementStat error', e);
        }
    }

    addPoints(amount = 0) {
        try {
            this.points = (this.points || 0) + Number(amount || 0);
            if (!this.stats) this.stats = { points: this.points };
            this.stats.points = this.points;
            if (this.pauseMenu && typeof this.pauseMenu._updateStatsDisplay === 'function') this.pauseMenu._updateStatsDisplay();
            if (this.pauseMenu && typeof this.pauseMenu._saveStatsToStorage === 'function') this.pauseMenu._saveStatsToStorage();
        } catch (e) {
            console.warn('addPoints error', e);
        }
    }

    /**
     * Increment coin collection counter for adventure game pause menu
     */
    collectCoin(amount = 1) {
        try {
            this.coinsCollected = (this.coinsCollected || 0) + Number(amount || 0);
            if (!this.stats) this.stats = {};
            this.stats.coinsCollected = this.coinsCollected;
            if (this.pauseMenu && typeof this.pauseMenu._updateStatsDisplay === 'function') this.pauseMenu._updateStatsDisplay();
            if (this.pauseMenu && typeof this.pauseMenu._saveStatsToStorage === 'function') this.pauseMenu._saveStatsToStorage();
        } catch (e) {
            console.warn('collectCoin error', e);
        }
    }

    /**
     * Called by an attached PauseMenu to show the menu (pauses the game)
     */
    showPauseMenu() {
        if (this.pauseMenu && typeof this.pauseMenu.show === 'function') {
            this.pause();
            this.pauseMenu.show();
        }
    }

    /**
     * Called by an attached PauseMenu to hide the menu (resumes the game)
     */
    hidePauseMenu() {
        if (this.pauseMenu && typeof this.pauseMenu.hide === 'function') {
            this.pauseMenu.hide();
            this.resume();
        }
    }
    
    // Helper method to add exit key listener
    addExitKeyListener() {
        document.addEventListener('keydown', this.exitKeyListener);
    }

    // Helper method to remove exit key listener
    removeExitKeyListener() {
        document.removeEventListener('keydown', this.exitKeyListener);
    }

    // Helper method to save the current canvas id and image data in the game container
    saveCanvasState() {
        const canvasElements = this.gameContainer.querySelectorAll('canvas');
        this.savedCanvasState = Array.from(canvasElements).map(canvas => {
            return {
                id: canvas.id,
                imageData: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
            };
        });
    }

    // Helper method to hide the current canvas state in the game container
    hideCanvasState() {
        const canvasElements = this.gameContainer.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            if (canvas.id !== 'gameCanvas') {
                canvas.style.display = 'none';
            }
        });
    }

    // Helper method to restore the hidden canvas item to be visible
    showCanvasState() {
        this.savedCanvasState.forEach(hidden_canvas => {
            const canvas = document.getElementById(hidden_canvas.id);
            if (canvas) {
                canvas.style.display = 'block';
                canvas.getContext('2d').putImageData(hidden_canvas.imageData, 0, 0);
            }
        });
    }

    /**
     * Game level in Game Level helper method to pause the underlying game level
     * 1. Set the current game level to paused
     * 2. Remove the exit key listener
     * 3. Save the current canvas game containers state
     * 4. Hide the current canvas game containers
     */
    pause() {
        this.isPaused = true;
        this.removeExitKeyListener();
        this.saveCanvasState();
        this.hideCanvasState();
        
        // Save interaction handlers before cleaning up for game-in-game
        this.cleanupInteractionHandlers(true);
     }

     /**
      * Game level in Game Level helper method to resume the underlying game level
      * 1. Set the current game level to not be paused
      * 2. Add the exit key listener
      * 3. Show the current canvas game containers
      * 4. Start the game loop
      */
    resume() {
        this.isPaused = false;
        this.addExitKeyListener();
        this.showCanvasState();
        this.gameLoop();

        // Restore interaction handlers for outer game
        this.restoreInteractionHandlers();
    }
}

export default GameControl;