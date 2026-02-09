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
 */
class GameEnv {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.innerWidth = 0;
        this.innerHeight = 0;
        this.top = 0;
        this.bottom = 0;
        this.canvasOffsetLeft = 0;
        this.canvasOffsetTop = 0;
        this.canvasScaleX = 1;
        this.canvasScaleY = 1;
        /* Below properties are not part of is-A or has-A relationships,
        *  they are references for easy accessibility in game objects */
        this.game = null; // Reference to the Game static environment variables
        this.path = ''; // Reference to the resource path
        this.gameControl = null; // Reference to the GameControl instance
        this.gameObjects = []; // Reference list of game objects instancces    
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
        // Use fixed dimensions for consistent game size
        this.innerWidth = this.game?.innerWidth || window.innerWidth;
        this.innerHeight = (this.game?.innerHeight || window.innerHeight) - this.top - this.bottom;
        this.size();
    }

    /**
     * Sets the canvas element and its 2D rendering context.
     */
    setCanvas() {
        // Determine container first (may be element, id string, or missing)
        let containerCandidate = this.game?.gameContainer || document.getElementById('gameContainer') || document.body;
        if (typeof containerCandidate === 'string') {
            const el = document.getElementById(containerCandidate);
            if (el) containerCandidate = el;
            else containerCandidate = document.body;
        }
        this.container = containerCandidate;

        // Canvas detection strategy (in order):
        // 1) explicit this.game.gameCanvas (element or id)
        // 2) data attribute selectors inside container ([data-game-canvas])
        // 3) first <canvas> inside the container
        // 4) well-known ids (#gameCanvas, #game-canvas)
        // 5) document.querySelector('canvas')
        // 6) create a canvas and append to container

        let candidate = null;
        const provided = this.game?.gameCanvas;
        if (provided) {
            if (typeof provided === 'string') candidate = document.getElementById(provided);
            else if (provided instanceof HTMLCanvasElement) candidate = provided;
            else if (provided instanceof Element) {
                // If it's an element but not a canvas, try to find a canvas inside it
                candidate = provided.querySelector && provided.querySelector('canvas');
            }
        }

        if (!candidate && this.container && this.container.querySelector) {
            candidate = this.container.querySelector('[data-game-canvas]') || this.container.querySelector('canvas');
        }

        if (!candidate) candidate = document.getElementById('gameCanvas') || document.getElementById('game-canvas') || document.querySelector('canvas');

        if (!candidate) {
            // Create a canvas if none found
            candidate = document.createElement('canvas');
            candidate.id = 'gameCanvas';
            if (this.container && this.container.appendChild) this.container.appendChild(candidate);
            else document.body.appendChild(candidate);
        }

        this.canvas = candidate;
        // Safely get 2D context
        try {
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        } catch (e) {
            console.warn('Unable to get 2D context for canvas:', e);
            this.ctx = null;
        }
    }

    /**
     * Sets the top offset based on the height of the header element.
     */
    setTop() {
        // Default to 0 - game container should handle its own positioning
        const header = document.querySelector('header');
        this.top = header ? header.offsetHeight : 0;
    }

    /**
     * Sets the bottom offset based on the height of the footer element.
     */
    setBottom() {
        // Default to 0 - game container should handle its own positioning
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

        // Track canvas offset relative to container for accurate object positioning
        const containerRect = this.container?.getBoundingClientRect?.();
        const canvasRect = this.canvas?.getBoundingClientRect?.();
        if (containerRect && canvasRect) {
            this.canvasOffsetLeft = canvasRect.left - containerRect.left;
            this.canvasOffsetTop = canvasRect.top - containerRect.top;
            this.canvasScaleX = this.canvas.width ? canvasRect.width / this.canvas.width : 1;
            this.canvasScaleY = this.canvas.height ? canvasRect.height / this.canvas.height : 1;
        } else {
            this.canvasOffsetLeft = 0;
            this.canvasOffsetTop = 0;
            this.canvasScaleX = 1;
            this.canvasScaleY = 1;
        }
    }


    resize() {
        this.create();
    }

 
    clear() {
        this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }
}

export default GameEnv;