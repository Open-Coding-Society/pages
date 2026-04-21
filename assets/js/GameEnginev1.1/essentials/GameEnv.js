/**
 * GameEnv manages the game environment.
 * 
 * The focus of the file is the canvas management and the calculation of the game area dimensions. 
 * All calculations are based on the window size, header, and footer.
 * 
 * This code uses an instance-based class pattern, which allows each GameLevel to have its own GameEnv.
 * 
 * The instance-based class pattern ensures that there can be multiple instances of the game environment,
 * providing a separate point of reference for each game level. This approach helps maintain
 * consistency and simplifies the management of shared resources like the canvas and its dimensions.
 * 
 * @class GameEnv
 * @property {Object} container - The DOM element that contains the game.
 * @property {Object} canvas - The canvas element.
 * @property {Object} ctx - The 2D rendering context of the canvas.
 * @property {number} innerWidth - The inner width of the game area.
 * @property {number} innerHeight - The inner height of the game area.
 * @property {number} top - The top offset of the game area.
 * @property {number} bottom - The bottom offset of the game area.
 * @property {string} canvasId - The unique ID of the canvas element for this instance.
 */
class GameEnv {
    static canvasCounter = 0; // Static counter for unique canvas IDs
    
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.canvasId = null;
        this.innerWidth = 0;
        this.innerHeight = 0;
        this.top = 0;
        this.bottom = 0;
        /* Below properties are not part of is-A or has-A relationships,
        *  they are references for easy accessibility in game objects */
        this.game = null; // Reference to the Game static environment variables
        this.path = ''; // Reference to the resource path
        this.gameControl = null; // Reference to the GameControl instance
        this.gameObjects = []; // Reference list of game objects instances
        
        /* Game statistics - shared across all levels */
        this.stats = {
            coinsCollected: 0,
            levelsCompleted: 0,
            sessionTime: 0,
            totalPowerUps: 0
        };
        
        /* Score configuration - can be overridden per game */
        this.scoreConfig = {
            counterVar: 'coinsCollected',
            counterLabel: 'Coins Collected',
            scoreVar: 'coinsCollected'
        };
        
        /* ScoreManager instance - initialized when needed */
        this.scoreManager = null;
    }

    /**
     * Create the game environment by setting up the canvas and calculating dimensions.
     * 
     * This method sets the canvas element, calculates the top and bottom offsets,
     * and determines the inner width and height of the game area. It then sizes the canvas
     * to fit within the calculated dimensions.
     */
    create() {
        this.setCanvas();
        this.setTop();
        this.setBottom();
        
        // Check if dimensions are overridden in environment (for game-runner/builder)
        // Otherwise use window dimensions
        if (this.game?.environment?.innerWidth !== undefined) {
            this.innerWidth = this.game.environment.innerWidth;
        } else {
            this.innerWidth = window.innerWidth;
        }
        
        if (this.game?.environment?.innerHeight !== undefined) {
            this.innerHeight = this.game.environment.innerHeight;
        } else {
            this.innerHeight = window.innerHeight - this.top - this.bottom;
        }
        
        this.size();
    }

    /**
     * Initialize the score manager for tracking and persisting scores.
     * This should be called once during game initialization.
     * Lazy loads the GameEnvScore class and creates a singleton instance.
     */
    async initScoreManager() {
        console.log('GameEnv: initScoreManager called');
        
        // Only initialize once
        if (this.scoreManager) {
            console.log('GameEnv: ScoreManager already exists, returning existing instance');
            return this.scoreManager;
        }
        
        try {
            console.log('GameEnv: Importing GameEnvScore module...');
            const module = await import(`${this.path}/assets/js/GameEnginev1.1/essentials/GameEnvScore.js`);
            console.log('GameEnv: Module imported successfully', module);
            const GameEnvScore = module.default;
            console.log('GameEnv: Creating GameEnvScore instance...');
            this.scoreManager = new GameEnvScore(this);
            console.log('GameEnv: ScoreManager initialized successfully', this.scoreManager);
            return this.scoreManager;
        } catch (error) {
            console.error('GameEnv: Failed to initialize ScoreManager:', error);
            console.error('GameEnv: Error stack:', error.stack);
            return null;
        }
    }

    /**
     * Sets the canvas element and its 2D rendering context.
     * Creates a new canvas dynamically with a unique ID to avoid conflicts.
     * Uses the container reference passed from environment, or searches for 'gameContainer' as fallback.
     */
    setCanvas() {
        // Use the container reference if provided (from environment), otherwise search by ID
        this.container = this.gameContainer || document.getElementById('gameContainer') || document.body;
        
        // Create canvas dynamically with unique ID
        this.canvasId = `gameCanvas-${GameEnv.canvasCounter++}`;
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    /**
     * Sets the top offset based on the height of the header element.
     */
    setTop() {
        // In builder/embedded mode, align game space to container top (no header offset)
        // Check if container was set (after setCanvas) or if gameContainer was provided
        if (this.container || this.gameContainer) {
            this.top = 0;
            return;
        }
        const header = document.querySelector('header');
        this.top = header ? header.offsetHeight : 0;
    }

    /**
     * Sets the bottom offset based on the height of the footer element.
     */
    setBottom() {
        const footer = document.querySelector('footer');
        this.bottom = footer ? footer.offsetHeight : 0;
    }

    /**
     * Sizes the canvas to fit within the calculated dimensions.
     */
    size() {
        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        this.canvas.style.width = `${this.innerWidth}px`;
        this.canvas.style.height = `${this.innerHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = `${this.top}px`;
    }


    resize() {
        // Resize should not create a new canvas (that causes duplicated layers/entities).
        // Instead, recompute dimensions and resize the existing canvas.
        this.setTop();
        this.setBottom();

        if (this.game?.environment?.innerWidth !== undefined) {
            this.innerWidth = this.game.environment.innerWidth;
        } else {
            this.innerWidth = window.innerWidth;
        }

        if (this.game?.environment?.innerHeight !== undefined) {
            this.innerHeight = this.game.environment.innerHeight;
        } else {
            this.innerHeight = window.innerHeight - this.top - this.bottom;
        }

        if (this.canvas && this.ctx) {
            this.size();
        }
    }

 
    clear() {
        if (!this.ctx) {
            return;
        }
        this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }

    /**
     * Destroy the game environment and clean up the canvas.
     * Removes the canvas element from the DOM.
     */
    destroy() {
        // Remove canvas from DOM
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear references
        this.canvas = null;
        this.ctx = null;
        this.canvasId = null;
    }
}

export default GameEnv;