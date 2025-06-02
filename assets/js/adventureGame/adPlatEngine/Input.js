/**
 * End Ship Platformer - Input Handler
 * Manages keyboard input and UI interactions
 */

const InputHandler = {
    // State of keys
    keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
    },
    
    /**
     * Initialize input handling
     * @param {Game} game - Game instance
     */
    init: function(game) {
        this.game = game;
        
        // Key down event
        window.addEventListener('keydown', (e) => {
            // Prevent default behavior for game keys
            if (['w', 'a', 's', 'd', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'p', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
            
            this.handleKeyDown(e.key);
        });
        
        // Key up event
        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e.key);
        });
        
        // Set up UI button event listeners
        this.setupUIButtons();
    },
    
    /**
     * Setup all UI button event listeners
     */
    setupUIButtons: function() {
        // Game screen buttons
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.game.currentState === CONFIG.STATES.PLAYING) {
                this.game.pauseGame();
            }
        });
        
        // Pause screen buttons
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.game.resumeGame();
        });
        
        // Game over screen buttons
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.game.initGame();
            });
        }
    },
    
    /**
     * Handle key down events
     * @param {String} key - Key pressed
     */
    handleKeyDown: function(key) {
        // Only process keys if game is in playing state
        if (this.game.currentState === CONFIG.STATES.PLAYING) {
            switch (key) {
                // Player controls (WASD and Arrow keys)
                case 'w':
                case 'ArrowUp':
                    this.keys.up = true;
                    break;
                case 's':
                case 'ArrowDown':
                    this.keys.down = true;
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'd':
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case ' ': // Spacebar for shooting
                    this.keys.space = true;
                    break;
                
                case 'p':
                    if (this.game.currentState === CONFIG.STATES.PLAYING) {
                        this.game.pauseGame();
                    }
                    break;
                case 'Escape':
                    if (this.game.currentState === CONFIG.STATES.PLAYING) {
                        this.game.pauseGame();
                    }
                    break;
            }
        } else if (this.game.currentState === CONFIG.STATES.PAUSED && (key === 'p' || key === 'Escape')) {
            this.game.resumeGame();
        }
    },
    
    /**
     * Handle key up events
     * @param {String} key - Key released
     */
    handleKeyUp: function(key) {
        switch (key) {
            case 'w':
            case 'ArrowUp':
                this.keys.up = false;
                break;
            case 's':
            case 'ArrowDown':
                this.keys.down = false;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'd':
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case ' ': // Spacebar
                this.keys.space = false;
                break;
        }
    },
    
    /**
     * Clears all input states
     */
    clearAll: function() {
        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.space = false;
    }
};