import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';

/**
 * @class PlayerBase class
 * @description PlayeiBase.js key objective is to handle the user controlled player's actions and animations. 
 * 
 * The PlayerBase class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The PlayerBase object.  
 * 
 * @extends Character
 */
export class PlayerBase extends Character {
    /**
     * Initial environment of the player.
     * @property {string} collision - The current object the player is interacting with (e.g., 'floor', 'wall', 'platform').
     * @property {Array} collisions - The collisions that the player has had.
     * @property {string} animation - The current animation state of the player (e.g., 'idle', 'walk', 'run', 'jump').
     * @property {string} direction - The direction the player is facing (e.g., 'left', 'right').
     * @property {Object} movement - The directions in which the player can move.
     * @property {boolean} movement.up - Whether the player can move up.
     * @property {boolean} movement.down - Whether the player can move down.
     * @property {boolean} movement.left - Whether the player can move left.
     * @property {boolean} movement.right - Whether the player can move right.
     * @property {boolean} movement.falling - Whether the player is falling.
     * @property {boolean} isDying - Whether the player is dying.
     * @property {boolean} isFinishing - Whether the player is on the finishline.
     */

    // This object represents the initial state of the player when the game starts.
    initEnvironmentState = {
        // environment
        collision: 'floor',
        collisions: [],
        // player
        animation: 'idle',
        direction: 'right',
        movement: {up: false, down: false, left: true, right: true, falling: false},
        isDying: false,
        isFinishing: false,
    };

    /** GameObject: Constructor for Player object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data); // Call the Character class's constructor

        // Player Data
        GameEnv.player = this; // Global player object
        this.name = GameEnv.userID; // name of the player

        // Player control data
        this.state = {...this.initEnvironmentState}; // Player and environment states 
        this.playerData = data; // GameSetup data
        this.pressedKeys = {}; // active keys array
        this.runSpeed = this.speed * 3; // dash speed
        this.shouldBeSynced = true; // multi-player sync

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);
    }

    /**
     * GameObject: Destructor for Player Object
     * This method is used to remove the event listeners for keydown and keyup events.
     * After removing the event listeners, it calls the parent class's destroy player object. 
     * This method overrides standard GameObject.destroy.
     * @override
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }

    /**
     * gameLoop: updates the player's state, animation and position.
     * @override
     */
    update() {
        // player methods
        this.updateAnimation();
        this.updateMovement();
 
        // super actions need to be after; this is to preserve player order of operations
        super.update();
    }
  
    /**
     * gameLoop helper: Udate Player jump height
     */
    updateJump() {
        // Jump height is 35% of the screen bottom, same as screen height
        this.setY(this.y - (this.bottom * 0.35)); 
    }

    /**
     * gameLoop: updates the player's movement based on the player's animation (idle, walk, run, jump, etc.)
     */ 
    updateMovement() {
        switch (this.state.animation) {
            case 'idle':
                break;
            case 'jump':
                // Check condition for player to jump
                if (this.state.movement.up && !this.state.movement.falling) {
                    // jump
                    GameEnv.playSound("PlayerJump");
                    this.updateJump();
                    // start falling
                    this.state.movement.falling = true;
                }
                // break is purposely omitted to allow default case to run 
            default:
                // Player is moving left
                if (this.state.direction === 'left' && this.state.movement.left && 'a' in this.pressedKeys) {
                    // Decrease the player's x position according to run or walk animation and related speed
                    this.setX(this.x - (this.state.animation === 'run' ? this.runSpeed : this.speed));
                // Player is moving right
                } else if (this.state.direction === 'right' && this.state.movement.right && 'd' in this.pressedKeys){
                    // Increase the player's x position according to run or walk animation and related speed
                    this.setX(this.x + (this.state.animation === 'run' ? this.runSpeed : this.speed));
                }
        }
        GameEnv.PlayerPosition.playerX = this.x
        GameEnv.PlayerPosition.playerY = this.y
        
    }

    /**
     * gameLoop: updates the player's animation (idle, walk, run, jump, etc.)
     */
    updateAnimation() {
        switch (this.state.animation) {
            case 'idle':
                this.setSpriteAnimation(this.playerData.idle[this.state.direction]);
                break;
            case 'walk':
                this.setSpriteAnimation(this.playerData.walk[this.state.direction]);
                break;
            case 'run':
                this.setSpriteAnimation(this.playerData.run[this.state.direction]);
                break;
            case 'jump':
                this.setSpriteAnimation(this.playerData.jump[this.state.direction]);
                break;
            default:
                console.error(`Invalid state: ${this.state.animation}`);
        }
    }


    /**
     * User Event: updates the player's state, key pressed is mapped to player's animation state  
     * @param {*} key 
     */
    updateAnimationState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.animation = 'walk';
                break;
            case 'w':
              if (this.state.movement.up == false) {
                this.state.movement.up = true;
                this.state.animation = 'jump';
              }
              break;
            case 's':
                if ("a" in this.pressedKeys || "d" in this.pressedKeys) {
                    this.state.animation = 'run';
                }
                break;
            default:
                this.state.animation = 'idle';
                break;
        }
    }

    /**
     * User Event: Handles the keydown event.
     * This method checks the pressed key, then conditionally:
     * - adds the key to the pressedKeys object
     * - sets the player's animation
     * - adjusts the game environment
     *
     * @param {Event} event - The keydown event.
     */    
    
    handleKeyDown(event) {
        const key = event.key;
        if (!(event.key in this.pressedKeys)) {
            //If both 'a' and 'd' are pressed, then only 'd' will be inputted
            //Originally if this is deleted, player would stand still. 
            if (this.pressedKeys['a'] && key === 'd') {
                delete this.pressedKeys['a']; // Remove "a" key from pressedKeys
                return; //(return) = exit early
            } else if (this.pressedKeys['d'] && key === 'a') {
                // If "d" is pressed and "a" is pressed afterward, ignore "a" key
                return;
            }
            // Set the direction when a or d key is pressed
            if (key === 'a') {
                this.state.direction = 'left';
            } else if (key === 'd') {
                this.state.direction = 'right';
            }
            // Record the pressed key
            this.pressedKeys[event.key] = true;
            // Update the player's animation state based on the pressed key
            this.updateAnimationState(key);
            GameEnv.transitionHide = true;
            GameControl.startTimer()
        }

        // parallax background speed starts on player movement
        GameEnv.updateParallaxDirection(key)
    }

    /**
     * User Event: Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * 
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        const key = event.key;
        if (key in this.pressedKeys) {
            delete this.pressedKeys[key];
            if (Object.keys(this.pressedKeys).length > 0) {
                // If there are still keys in pressedKeys, update the state to the last one
                const lastKey = Object.keys(this.pressedKeys)[Object.keys(this.pressedKeys).length - 1];
                this.updateAnimationState(lastKey);
                GameEnv.updateParallaxDirection(lastKey)
            } else {
                // If there are no more keys in pressedKeys, update the state to null
                this.updateAnimationState(null);
                GameEnv.updateParallaxDirection(null)
            }
        }
    }
    

    /**
     * gameLoop: Collision action handler for the Player.
     * This method overrides GameObject.collisionAction. 
     * @override
     */
    collisionAction() {
        this.handleCollisionStart();
        this.handleCollisionEnd();
        this.setActiveCollision();
        this.handlePlayerReaction();
    }
   
    /**
     * gameLoop: Watch for Player collision events 
     */
    handleCollisionStart() {
        this.handleCollisionEvent("jumpPlatform");
        this.handleCollisionEvent("wall");
        this.handleCollisionEvent("floor");
    }

    /**
     * gameLoop helper: Adds the collisionType to the collisions array when player is touching the object
     * @param {*} collisionType 
     */
    handleCollisionEvent(collisionType) {
        // check if player is touching the "collisionType" object
        if (this.collisionData.touchPoints.other.id === collisionType) {
            // check if the collisionType is not already in the collisions array
            if (!this.state.collisions.includes(collisionType)) {
                // add the collisionType to the collisions array, making it the current collision
                this.state.collisions.push(collisionType);
            }
        }
    }
   
    /**
     * gameLoop: Tears down Player collision events
     */
    handleCollisionEnd() {
        // test if this.state.collision is floor, if so, do nothing as it is the default state
        if (this.state.collision === "floor") { 
        // else if collision exists in collisions array and it is not the current collision
        } else if (this.state.collisions.includes(this.state.collision) && this.collisionData.touchPoints.other.id !== this.state.collision ) {
            // filter out the collision from the array, or in other words, remove the collision
            this.state.collisions = this.state.collisions.filter(collision => collision !== this.state.collision);
        }
    }
   
    /**
     * gameLoop: Sets Player collision state from most recent collision in collisions array
     */
    setActiveCollision() {
        // check array for any remaining collisions
        if (this.state.collisions.length > 0) {
            // the array contains collisions, set the the last collision in the array
            this.state.collision = this.state.collisions[this.state.collisions.length - 1];
        } else {
            // the array is empty, set to floor collision (default state)
            this.state.collision = "floor";
        }
    }
   
    /**
     * gameloop: Handles Player reaction / state updates to the collision
     */
    // Assuming you have some kind of input handling system

    handlePlayerReaction() {
        // gravity on is default for player/character
        this.gravityEnabled = true;

        // handle player reaction based on collision type
        switch (this.state.collision) {
            // 1. Player is on a jump platform
            case "jumpPlatform":
                // Player is on top of wall
                if (this.collisionData.touchPoints.this.onTopofOther) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;

                // Player is touching the wall with right side
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                    this.y -= 4;
                
                // Player is touching the wall with left side
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                    this.y -= 4;
                }
                break;
               
            // 2. Player is on or touching a wall 
            case "wall":
                // Player is on top of the wall
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;
                // Player is touching the wall with right side
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                // Player is touching the wall with left side
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                }
                break;

            
            // 4. Player is in default state
            case "floor":
                // Player is on the floor
                if (this.onTop) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                // Player is falling, there are no collisions, but is in default state 
                } else { 
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: true};
                }
                break;
            
            
        }
    }

}

export default PlayerBase;