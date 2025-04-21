// GameControl.js
import GameLevel from "./GameLevel.js";
import Inventory from "../Inventory.js";

class GameControl {
    /**
     * GameControl class to manage the game levels and transitions
     * @param {*} game - The Game object that holds environment variables
     * @param {*} levelClasses - The classes for each game level
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
        this.nextLevelKeyListener = this.handleNextLevelKey.bind(this);
        this.gameOver = null; // Callback for when the game is over 
        this.savedCanvasState = []; // Save the current levels game elements 
        this.canvasContexts = new Map(); // Store canvas contexts
        
        // Store this instance in the game container for access by other components
        if (this.gameContainer) {
            this.gameContainer.gameControl = this;
        }
        
        // Initialize inventory
        console.log("Initializing inventory in GameControl...");
        this.inventory = Inventory.getInstance();
    }

    // Initialize all canvas contexts
    initializeCanvasContexts() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            if (!this.canvasContexts.has(canvas)) {
                this.canvasContexts.set(canvas, canvas.getContext('2d', { willReadFrequently: true }));
            }
        });
    }

    /**
     * Starts the game by 
     * 1. Adding an exit key listener
     * 2. Initializing canvas contexts
     * 3. Transitioning to the first level
     */
    start() {
        this.addExitKeyListener();
        this.initializeCanvasContexts();
        this.transitionToLevel();
    }

    /**
     * Transitions to the next level in the level by
     * 1. Creating a new GameLevel instance
     * 2. Creating the level using the GameLevelClass
     * 3. Starting the game loop
     */ 
    transitionToLevel() {
        const GameLevelClass = this.levelClasses[this.currentLevelIndex];
        this.currentLevel = new GameLevel(this);
        this.currentLevel.create(GameLevelClass);
        // Initialize contexts for any new canvases created during level creation
        this.initializeCanvasContexts();
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
        if (this.currentLevel.restart) {
            this.restartLevel();
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
        
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        
        // Call the gameOver callback if it exists
        if (this.gameOver) {
            this.gameOver();
        } else {
            this.currentLevelIndex++;
            if (this.currentLevelIndex < this.levelClasses.length) {
                this.transitionToLevel();
            } else {
                console.log("All levels completed, no more levels to transition to.");
            }
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

    handleNextLevelKey(event) {
        if (event.key.toLowerCase() === 't') {
            if (this.currentLevelIndex < this.levelClasses.length - 1) {
                console.log("Hotkey 't' pressed: Transitioning to next level.");
                this.currentLevel.continue = false;
            } else {
                alert("🎉 You're on the final level! There are no more levels to transition to.");
            }
        }
    }
    
    // Helper method to add exit key listener
    addExitKeyListener() {
        document.addEventListener('keydown', this.exitKeyListener);
        document.addEventListener('keydown', this.nextLevelKeyListener);
    }
    

    // Helper method to remove exit key listener
    removeExitKeyListener() {
        document.removeEventListener('keydown', this.exitKeyListener);
        document.removeEventListener('keydown', this.nextLevelKeyListener);
    }
    

    // Helper method to get or create canvas context
    getCanvasContext(canvas) {
        if (!this.canvasContexts.has(canvas)) {
            this.canvasContexts.set(canvas, canvas.getContext('2d', { willReadFrequently: true }));
        }
        return this.canvasContexts.get(canvas);
    }

    // Helper method to save the current canvas id and image data in the game container
    saveCanvasState() {
        const gameContainer = document.getElementById('gameContainer');
        const canvasElements = gameContainer.querySelectorAll('canvas');
        // Ensure all canvas contexts are initialized before saving state
        this.initializeCanvasContexts();
        this.savedCanvasState = Array.from(canvasElements).map(canvas => {
            return {
                id: canvas.id,
                imageData: this.getCanvasContext(canvas).getImageData(0, 0, canvas.width, canvas.height)
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
                this.getCanvasContext(canvas).putImageData(hidden_canvas.imageData, 0, 0);
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
    }

    restartLevel() {
        if (this.currentLevel) { //checks if theres a current level, if so, then..
            this.currentLevel.destroy(); //destroys the current level 
        }
        this.gameLoopCounter = 0; //resets the game loops counter 
        this.transitionToLevel(); //transitions to the same level its currently in 
    }
}

export default GameControl;