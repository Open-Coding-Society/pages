import Character from './Character.js';
import TouchControls from './TouchControls.js';

// Define non-mutable constants as defaults
const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };


class Player extends Character {
    /**
     * The constructor method is called when a new Player object is created.
     * 
     * @param {Object|null} data - The sprite data for the object. If null, a default red square is used.
     */
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        // Normalize key mappings: allow number or array of keyCodes per direction.
        const rawKeypress = data?.keypress || {up: 87, left: 65, down: 83, right: 68};
        this.keypress = {
            up: Array.isArray(rawKeypress.up) ? rawKeypress.up : [rawKeypress.up],
            left: Array.isArray(rawKeypress.left) ? rawKeypress.left : [rawKeypress.left],
            down: Array.isArray(rawKeypress.down) ? rawKeypress.down : [rawKeypress.down],
            right: Array.isArray(rawKeypress.right) ? rawKeypress.right : [rawKeypress.right]
        };
        this.pressedKeys = {}; // active keys array
        this.bindMovementKeyListners();
        this.gravity = data.GRAVITY || false;
        this.acceleration = 0.001;
        this.time = 0;
        this.moved = false;

        // Initialize touch controls for mobile devices
        // Use the first keyCode from each array for touch controls
        const touchOptions = {
            mapping: {
                up: this.keypress.up[0],
                left: this.keypress.left[0],
                down: this.keypress.down[0],
                right: this.keypress.right[0],
                interact: 69  // E key for interact
            },
            interactLabel: 'E',
            position: 'left',
            id: `touch-controls-${data?.id || 'player'}`
        };
        this.touchControls = new TouchControls(gameEnv, touchOptions);
    }

    /**
     * Binds key event listeners to handle object movement.
     * 
     * This method binds keydown and keyup event listeners to handle object movement.
     * The .bind(this) method ensures that 'this' refers to the object object.
     */
    bindMovementKeyListners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown({ keyCode }) {
        // capture the pressed key in the active keys array
        this.pressedKeys[keyCode] = true;
        // set the velocity and direction based on the newly pressed key
        this.updateVelocityAndDirection();
    }

    /**
     * Handles key up events to stop the player's velocity.
     * 
     * This method stops the player's velocity based on the key released.
     * 
     * @param {Object} event - The keyup event object.
     */
    handleKeyUp({ keyCode }) {
        // remove the lifted key from the active keys array
        if (keyCode in this.pressedKeys) {
            delete this.pressedKeys[keyCode];
        }
        // adjust the velocity and direction based on the remaining keys
        this.updateVelocityAndDirection();
    }

    /**
     * Update the player's velocity and direction based on the pressed keys.
     */
    updateVelocityAndDirection() {
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Helper to see if any of the keyCodes for a direction are active.
        const isActive = (keyArray) => {
            for (let code of keyArray) {
                if (this.pressedKeys[code]) return true;
            }
            return false;
        };

        // Multi-key movements (diagonals: upLeft, upRight, downLeft, downRight)
        if (isActive(this.keypress.up) && isActive(this.keypress.left)) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'upLeft';
        } else if (isActive(this.keypress.up) && isActive(this.keypress.right)) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'upRight';
        } else if (isActive(this.keypress.down) && isActive(this.keypress.left)) {
            this.velocity.y += this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'downLeft';
        } else if (isActive(this.keypress.down) && isActive(this.keypress.right)) {
            this.velocity.y += this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'downRight';
        // Single key movements (left, right, up, down) 
        } else if (isActive(this.keypress.up)) {
            this.velocity.y -= this.yVelocity;
            this.direction = 'up';
            this.moved = true;
        } else if (isActive(this.keypress.left)) {
            this.velocity.x -= this.xVelocity;
            this.direction = 'left';
            this.moved = true;
        } else if (isActive(this.keypress.down)) {
            this.velocity.y += this.yVelocity;
            this.direction = 'down';
            this.moved = true;
        } else if (isActive(this.keypress.right)) {
            this.velocity.x += this.xVelocity;
            this.direction = 'right';
            this.moved = true;
        } else{
            this.moved = false;
        }
    }
    update() {
        super.update();
        if(!this.moved){
            if (this.gravity) {
                    this.time += 1;
                    this.velocity.y += 0.5 + this.acceleration * this.time;
                }
            }
        else{
            this.time = 0;
        }
        }
        
    /**
     * Overrides the reaction to the collision to handle
     *  - clearing the pressed keys array
     *  - stopping the player's velocity
     *  - updating the player's direction   
     * @param {*} other - The object that the player is colliding with
     */
    handleCollisionReaction(other) {    
        this.pressedKeys = {};
        this.updateVelocityAndDirection();
        super.handleCollisionReaction(other);
    }

    /**
     * Clean up player resources including touch controls
     */
    destroy() {
        if (this.touchControls) {
            this.touchControls.destroy();
        }
        super.destroy();
    }


}

export default Player;