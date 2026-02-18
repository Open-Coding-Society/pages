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
        // Alert the user that the level has ended
        if (this.currentLevelIndex < this.levelClasses.length - 1) {
            alert("Level ended.");
        } else {
            alert("All levels completed.");
        }
        
        // Clean up any lingering interaction handlers
        this.cleanupInteractionHandlers();
        
        this.currentLevel.destroy();
        
        // Call the gameOver callback if it exists
        if (this.gameOver) {
            this.gameOver();
        } else {
            this.currentLevelIndex++;
            this.transitionToLevel();
        }
    }

    /**
     * Exit key handler to end the current level
     * @param {*} event - The keydown event object
     */
    handleExitKey(event) {
        if (event.key === 'Escape') {
            this.currentLevel.continue = false;
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
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        this.savedCanvasState = Array.from(canvasElements).map(canvas => {
            return {
                id: canvas.id,
                imageData: canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
            };
        });
    }

    // Helper method to hide the current canvas state in the game container
    hideCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            if (canvas.id !== 'gameCanvas') {
                canvas.style.display = 'none';
            }
        });
    }

    // Helper method to restore the hidden canvas item to be visible
    showCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
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