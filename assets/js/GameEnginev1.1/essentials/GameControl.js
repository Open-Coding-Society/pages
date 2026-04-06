// CanvasClickHandler: enables click-to-interact for all game objects
class CanvasClickHandler {
    constructor(gameEnv, gameContainer) {
        this.gameEnv = gameEnv;
        this.gameContainer = gameContainer;
        this._boundClick = this.handleCanvasClick.bind(this);
        console.log('[CanvasClickHandler] constructor:', {
            gameEnv: !!gameEnv,
            gameContainer: gameContainer,
            containerId: gameContainer && gameContainer.id
        });
    }

    bindInteractKeyListeners() {
        if (!this.gameContainer) {
            console.warn('[CanvasClickHandler] No gameContainer to bind click listener');
            return;
        }
        this.gameContainer.addEventListener('click', this._boundClick);
        console.log('[CanvasClickHandler] Click listener bound to', this.gameContainer, 'id:', this.gameContainer.id);
        // Optionally add touch support here
    }

    removeInteractKeyListeners() {
        this.gameContainer.removeEventListener('click', this._boundClick);
        // Optionally remove touch support here
    }

    handleCanvasClick(event) {
        // Find the topmost canvas under the click point
        const containerRect = this.gameContainer.getBoundingClientRect();
        const x = event.clientX - containerRect.left;
        const y = event.clientY - containerRect.top;
        // Get all canvases in the container, in DOM order (last is topmost)
        const canvases = Array.from(this.gameContainer.querySelectorAll('canvas'));
        let clickedCanvas = null;
        for (let i = canvases.length - 1; i >= 0; i--) {
            const canvas = canvases[i];
            const rect = canvas.getBoundingClientRect();
            const cx = event.clientX - rect.left;
            const cy = event.clientY - rect.top;
            if (
                cx >= 0 && cy >= 0 &&
                cx <= rect.width && cy <= rect.height &&
                canvas.style.display !== 'none' &&
                canvas.style.visibility !== 'hidden' &&
                canvas.style.opacity !== '0'
            ) {
                clickedCanvas = canvas;
                break;
            }
        }
        console.log('[CanvasClickHandler] handleCanvasClick fired', {
            event,
            container: this.gameContainer,
            clickedCanvas: clickedCanvas && clickedCanvas.id,
            x, y
        });
        if (!clickedCanvas) return;
        // Find the game object whose canvas id matches
        const obj = this.gameEnv.gameObjects.find(o => o.canvas && o.canvas.id === clickedCanvas.id);
        if (obj && typeof obj.handleClick === 'function') {
            obj.handleClick(event);
        }
    }
}
// GameControl.js with improved level transition handling
import GameLevel from "./GameLevel.js";

class GameControl {
    /**
     * GameControl class to manage the game levels and transitions
     * @param {*} path - The path to the game assets
     * @param {*} levelClasses - The classes of for each game level
     */
    constructor(game, levelClasses, options = {}) {
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
        this.exitKeyListener = this.handleExitKey.bind(this);
        this.gameOver = null; // Callback for when the game is over 
        this.savedCanvasState = []; // Save the current levels game elements 
        
        // Capture all global interactions for cleaning up during transitions
        this.globalInteractionHandlers = new Set();
        // Save interaction handlers for game-in-game restore functionality
        this.savedInteractionHandlers = new Set();
        // Parent control when this is a nested "game-in-game" control
        this.parentControl = options.parentControl || null;
        this.isNested = !!this.parentControl;

        // If nested, snapshot parent level state so we can restore it later
        if (this.isNested) {
            try {
                this.parentControl._savedLevelClasses = Array.isArray(this.parentControl.levelClasses) ? [...this.parentControl.levelClasses] : this.parentControl.levelClasses;
                this.parentControl._savedCurrentLevelIndex = typeof this.parentControl.currentLevelIndex !== 'undefined' ? this.parentControl.currentLevelIndex : 0;
            } catch (e) {
                console.warn('Could not snapshot parent control state for nested game:', e);
            }
        }
        // Track whether the animation loop is currently running to avoid duplicates
        this._loopRunning = false;
    }

    /**
     * Set up canvas click handler for object interaction
     */
    setupCanvasClickHandler() {
        if (this.gameEnv && this.gameContainer) {
            this._canvasClickHandler = new CanvasClickHandler(this.gameEnv, this.gameContainer);
            this._canvasClickHandler.bindInteractKeyListeners();
            this.registerInteractionHandler(this._canvasClickHandler);
        }
    }

    
    start() {
        // If this is a nested control (game-in-game), hide/disable the parent
        // control's canvases and handlers so the nested game renders cleanly.
        if (this.isNested && this.parentControl) {
            try {
                // Only hide/save parent canvases once per nested session. The
                // parent GameControl.pause() already saved/restored handlers,
                // so avoid calling cleanupInteractionHandlers() here which would
                // overwrite the saved handlers with an empty set.
                if (!this.parentControl._nestedCanvasHidden) {
                    if (typeof this.parentControl.saveCanvasState === 'function') this.parentControl.saveCanvasState();
                    if (typeof this.parentControl.hideCanvasState === 'function') this.parentControl.hideCanvasState();
                    this.parentControl._nestedCanvasHidden = true;
                }
            } catch (e) {
                console.warn('Failed to prepare parent control for nested game:', e);
            }
        }

        // Mark this GameControl as the currently active control on the Game host
        try {
            if (this.game) this.game.activeGameControl = this;
        } catch (e) {}

        this.addExitKeyListener();
        this.setupCanvasClickHandler();
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
            console.log('Saved interaction handlers:', this.savedInteractionHandlers.size);
        }
        
        console.log('Cleaning up handlers:', this.globalInteractionHandlers.size);
        this.globalInteractionHandlers.forEach(handler => {
            if (handler && handler.removeInteractKeyListeners && typeof handler.removeInteractKeyListeners === 'function') {
                handler.removeInteractKeyListeners();
            }
        });
        this.globalInteractionHandlers.clear();
    }

    /**
     * Restore previously saved interaction handlers (for game-in-game functionality)
     */
    restoreInteractionHandlers() {
        // Ensure savedInteractionHandlers is initialized
        if (!this.savedInteractionHandlers) {
            console.warn('No saved interaction handlers');
            this.savedInteractionHandlers = new Set();
            return;
        }
        
        console.log('Restoring interaction handlers:', this.savedInteractionHandlers.size);
        
        this.savedInteractionHandlers.forEach(handler => {
            if (!handler) {
                console.warn('Handler is null/undefined');
                return;
            }
            
            // Try multiple possible method names for adding listeners
            if (handler.bindInteractKeyListeners && typeof handler.bindInteractKeyListeners === 'function') {
                console.log('Binding interact key listeners');
                handler.bindInteractKeyListeners();
            } else if (handler.addInteractKeyListeners && typeof handler.addInteractKeyListeners === 'function') {
                console.log('Adding interact key listeners');
                handler.addInteractKeyListeners();
            } else if (handler.setupEventListeners && typeof handler.setupEventListeners === 'function') {
                console.log('Setting up event listeners');
                handler.setupEventListeners();
            } else if (handler.addEventListener && typeof handler.addEventListener === 'function') {
                console.log('Adding event listener');
                handler.addEventListener();
            } else if (handler.init && typeof handler.init === 'function') {
                console.log('Initializing handler');
                handler.init();
            } else {
                console.warn("Handler missing add method:", handler.constructor?.name || 'Unknown');
            }
            
            // Re-register the handler
            this.globalInteractionHandlers.add(handler);
        });
        // Clear saved handlers after restoration
        this.savedInteractionHandlers.clear();
        console.log('Restored. Global handlers count:', this.globalInteractionHandlers.size);
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

        // If there's an existing level instance, destroy it before creating the next one.
        // This ensures canvases and game objects from the previous level are removed
        // and prevents leftover player canvases that can't be controlled.
        if (this.currentLevel && typeof this.currentLevel.destroy === 'function') {
            try {
                this.currentLevel.destroy();
            } catch (e) {
                console.error('Error destroying previous level:', e);
            }
            this.currentLevel = null;
        }

        const GameLevelClass = this.levelClasses[this.currentLevelIndex];
        this.currentLevel = new GameLevel(this);
        this.currentLevel.create(GameLevelClass);

        // Set gameEnv after level is created (if not already set by GameLevel)
        if (this.currentLevel && this.currentLevel.gameEnv) {
            this.gameEnv = this.currentLevel.gameEnv;
        }

        // Now that gameEnv is set, set up the canvas click handler
        this.setupCanvasClickHandler();

        // Only start the game loop if it's not already running to avoid duplicate loops
        if (!this._loopRunning) {
            this.gameLoop();
        }
    }

    /**
     * The main game loop 
     */
    gameLoop() {
        // Mark loop as running so transitionToLevel won't start another one
        this._loopRunning = true;
        if (!this.currentLevel) {
            this._loopRunning = false;
            return;
        }
        if (!this.currentLevel.continue) {
            this.handleLevelEnd();
            return;
        }

        if (!this.isPaused) {
        this.currentLevel.update();
        this.handleInLevelLogic();
        }

        // Always continue loop
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
        // Ensure the running-loop flag is cleared so new transitions can start the loop
        this._loopRunning = false;

        // Notify the user that the level has ended
        if (this.currentLevelIndex < this.levelClasses.length - 1) {
            console.log("Level ended.");
        } else {
            console.log("All levels or sublevels completed.");
        }
        
        // Clean up any lingering interaction handlers
        this.cleanupInteractionHandlers();
        
        this.currentLevel.destroy();
        this.currentLevel = null;
        
        // Call the gameOver callback if it exists
        // If this control was registered as the active game on the host, unset it
        try {
            if (this.game && this.game.activeGameControl === this) {
                this.game.activeGameControl = null;
            }
        } catch (e) {}

        // If this is a nested game (game-in-game), attempt to restore the parent control
        if (this.isNested && this.parentControl) {
            try {
                // Restore parent's level classes and index if we saved them
                if (this.parentControl._savedLevelClasses) {
                    this.parentControl.levelClasses = Array.isArray(this.parentControl._savedLevelClasses) ? [...this.parentControl._savedLevelClasses] : this.parentControl._savedLevelClasses;
                }
                this.parentControl.currentLevelIndex = typeof this.parentControl._savedCurrentLevelIndex !== 'undefined' ? this.parentControl._savedCurrentLevelIndex : 0;

                // Mark parent as active control and resume its paused level
                if (this.game) this.game.activeGameControl = this.parentControl;
                // Use resume() instead of transitionToLevel() to preserve the paused level state
                // transitionToLevel() would destroy and recreate the level, resetting player position
                if (typeof this.parentControl.resume === 'function') {
                    this.parentControl.resume();
                    // The parent may have had its canvases hidden when the nested
                    // game started. Explicitly restore the parent's canvases so the
                    // screen is visible again.
                    try {
                        if (typeof this.parentControl.showCanvasState === 'function') {
                            this.parentControl.showCanvasState();
                                // Clear nested-hidden flag so future nested games can hide again
                                try { this.parentControl._nestedCanvasHidden = false; } catch (e) {}
                        }
                    } catch (e) {
                        console.warn('Failed to restore parent canvas state after nested game:', e);
                    }
                }
            } catch (e) {
                console.warn('Failed to restore parent control after nested game ended:', e);
            }
            // Return here so we don't call gameOver callback which could interfere with parent restoration
            return;
        }

        if (this.gameOver) {
            this.gameOver();
        } else if (!this.isNested) {
            this.currentLevelIndex++;
            this.transitionToLevel();
        }
    }

    /**
     * End the current level (for skip feature)
     */
    endLevel() {
        if (this.currentLevel) {
            this.currentLevel.continue = false;
        }
    }

    /**
     * Exit key handler to toggle pause menu if available, otherwise toggle pause/resume
     * @param {*} event - The keydown event object
     */
    handleExitKey(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            // If pause menu exists (in GameEngine v1), let it handle the escape key
            // Otherwise fall back to direct pause/resume toggle
            if (this.isPaused) {
                this.resume();
            } else {
                // Prefer showing the host game's pause modal when available
                try {
                    if (this.game && typeof this.game.showPauseModal === 'function') {
                        this.game.showPauseModal();
                    } else if (typeof this.pause === 'function') {
                        this.pause();
                    }
                } catch (e) {
                    console.warn('Error invoking pause menu or pause():', e);
                    if (typeof this.pause === 'function') this.pause();
                }
            }
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
        const gameContainer = this.gameContainer;
        const canvasElements = gameContainer.querySelectorAll('canvas');
        // Only save non-background canvases to avoid overwriting dynamic background
        // layers which redraw themselves on resume.
        this.savedCanvasState = Array.from(canvasElements)
            .filter(canvas => {
                const id = canvas.id || '';
                // Exclude canvases with ids that indicate background layers
                return !/background/i.test(id);
            })
            .map(canvas => {
                try {
            return {
                id: canvas.id,
                imageData: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
            };
                } catch (e) {
                    console.warn('Could not capture canvas imageData for', canvas.id, e);
                    return { id: canvas.id, imageData: null };
                }
        });
    }

    // Helper method to hide the current canvas state in the game container
    hideCanvasState() {
        const gameContainer = this.gameContainer;
        const canvasElements = gameContainer.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            if (canvas.id !== 'gameCanvas') {
                canvas.style.display = 'none';
            }
        });
    }

    // Helper method to restore the hidden canvas item to be visible
    showCanvasState() {
        const gameContainer = this.gameContainer;
        this.savedCanvasState.forEach(hidden_canvas => {
            const canvas = document.getElementById(hidden_canvas.id);
            if (canvas) {
                canvas.style.display = 'block';
                if (hidden_canvas.imageData) {
                    try {
                canvas.getContext('2d').putImageData(hidden_canvas.imageData, 0, 0);
                    } catch (e) {
                        console.warn('Failed to restore canvas imageData for', hidden_canvas.id, e);
                    }
                }
            }
        });
    }

    /**
     * Game level in Game Level helper method to pause the underlying game level
     * 1. Set the current game level to paused
     * 2. Remove the exit key listener
     * Keeps the canvas visible - characters remain on screen
     */
    pause() {
        // Don't save handlers twice - only save on the first pause
        // if (this.isPaused) {
        //     console.log('Already paused, skipping duplicate pause');
        //     return;
        // }
        
        console.log('Pause called on GameControl', {
            isNested: this.isNested,
            parentPresent: !!this.parentControl,
            currentLevelIndex: this.currentLevelIndex,
            canvasCount: document.querySelectorAll('canvas').length
        });
        this.isPaused = true;
        this.removeExitKeyListener();
        // Do not save or hide canvas state on pause. Pausing should only
        // freeze updates and remove input handlers; saving/restoring
        // canvas image data can reintroduce stale layers and duplicate NPCs.
        
        // Save interaction handlers before cleaning up for game-in-game
        this.cleanupInteractionHandlers(true);

        // Notify current level (if it provides an onPause handler)
        try {
            if (this.currentLevel && this.currentLevel.gameLevel && typeof this.currentLevel.gameLevel.onPause === 'function') {
                this.currentLevel.gameLevel.onPause();
            }
        } catch (e) {
            console.warn('Error calling level onPause:', e);
        }
     }

     /**
      * Game level in Game Level helper method to resume the underlying game level
      * 1. Set the current game level to not be paused
      * 2. Add the exit key listener
      * 3. Start the game loop
      */
    resume() {
        console.log('Resume called on GameControl', {
            isNested: this.isNested,
            parentPresent: !!this.parentControl,
            currentLevelIndex: this.currentLevelIndex,
            canvasCount: document.querySelectorAll('canvas').length
        });
        this.isPaused = false;
        this.addExitKeyListener();
        // Do not restore saved canvas image data here. Resuming should
        // only restore input handlers and let the existing rendering
        // continue from the current canvas state.
        // Do NOT call gameLoop() here. The main loop continues to run while
        // paused (it skips updates when `isPaused` is true). Restarting the
        // loop here can create duplicate loops and speed up game objects.

        // Restore interaction handlers for outer game
        this.restoreInteractionHandlers();

        // Notify current level (if it provides an onResume handler)
        try {
            if (this.currentLevel && this.currentLevel.gameLevel && typeof this.currentLevel.gameLevel.onResume === 'function') {
                this.currentLevel.gameLevel.onResume();
            }
        } catch (e) {
            console.warn('Error calling level onResume:', e);
        }
    }
}

export default GameControl;