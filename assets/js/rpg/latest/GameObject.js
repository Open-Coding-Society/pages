import GameEnv from './GameEnv.js';

// Define non-mutable constants as defaults
const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };

/**
 * GameObject is a dynamic class that manages the data and events for objects like a player and more.
 * 
 * The focus of this class is to handle the object's state, rendering, and key events.
 * 
 * This class uses a classic Java class pattern which is nice for managing object data and events.
 * 
 * The classic Java class pattern provides a structured way to define the properties and methods
 * associated with the object. This approach helps encapsulate the object's state and behavior,
 * making the code more modular and easier to maintain. By using this pattern, we can create
 * multiple instances of the GameObject class, each with its own state and behavior.
 * 
 * @abstract GameObject
 * @property {Object} position - The current position of the object.
 * @property {Object} velocity - The current velocity of the object.
 * @property {Object} scale - The scale of the object based on the game environment.
 * @property {number} size - The size of the object.
 * @property {number} width - The width of the object.
 * @property {number} height - The height of the object.
 * @property {number} xVelocity - The velocity of the object along the x-axis.
 * @property {number} yVelocity - The velocity of the object along the y-axis.
 * @property {Image} spriteSheet - The sprite sheet image for the object.
 * @property {number} frameIndex - The current frame index for animation.
 * @property {number} frameCount - The total number of frames for each direction.
 * @property {Object} spriteData - The data for the sprite sheet.
 * @property {number} frameCounter - Counter to control the animation rate.
 * @method resize - Resizes the object based on the game environment.
 * @method draw - Draws the object on the canvas.
 * @method update - Updates the object's position and ensures it stays within the canvas boundaries.
 * @method bindEventListeners - Binds key event listeners to handle object movement.
 * @method handleKeyDown - Handles key down events to change the object's velocity.
 * @method handleKeyUp - Handles key up events to stop the object's velocity.
 */
class GameObject {
    // This object represents the initial state of the player when the game starts.
    initEnvironmentState = {
        // environment
        collision: '',
        collisions: [],
        // object 
        animation: 'idle',
        direction: 'right',
        movement: {up: true, down: true, left: true, right: true },
        isDying: false,
        isFinishing: false,
    };
    
    /**
     * The constructor method is called when a new GameObject object is created.
     * 
     * @param {Object|null} data - The sprite data for the object. If null, a default red square is used.
     */
    constructor(data = null) {
        this.state = {...this.initEnvironmentState}; // Object control data 
        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.id = data.name || "default";
        this.canvas.width = data.pixels.width || 0;
        this.canvas.height = data.pixels.height || 0;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        document.getElementById("gameContainer").appendChild(this.canvas);

        // Set initial object properties 
        this.x = 0;
        this.y = 0;
        this.frame = 0;
        this.collisionWidth = 0;
        this.collisionHeight = 0;
        this.collisionData = {};
        this.hitbox = data?.hitbox || {};
        
        // Initialize the object's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Check if sprite data is provided
        if (data && data.src) {
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
            this.position = data.INIT_POSITION || INIT_POSITION;
    
            // Load the sprite sheet
            this.spriteSheet = new Image();
            this.spriteSheet.src = data.src;

            // Initialize animation properties
            this.frameIndex = 0; // index reference to current frame
            this.frameCounter = 0; // count each frame rate refresh
            this.direction = 'down'; // Initial direction
            this.spriteData = data;
        } else {
            // Default to red square
            this.scaleFactor = SCALE_FACTOR;
            this.stepFactor = STEP_FACTOR;
            this.animationRate = ANIMATION_RATE;
            this.position = INIT_POSITION;

            // No sprite sheet for default
            this.spriteSheet = null;
        }

        // Initialize the object's position and velocity
        this.velocity = { x: 0, y: 0 };

        // Add this object to the gameLoop
        GameEnv.gameObjects.push(this);

        // Set the initial size and velocity of the object
        this.resize();

        // Bind event listeners to allow object movement
        this.bindEventListeners();
    }

    /**
     * Resizes the object based on the game environment.
     * 
     * This method adjusts the object's size and velocity based on the scale of the game environment.
     * It also adjusts the object's position proportionally based on the previous and current scale.
     */
    resize() {
        // Calculate the new scale resulting from the window resize
        const newScale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };

        // Adjust the object's position proportionally
        this.position.x = (this.position.x / this.scale.width) * newScale.width;
        this.position.y = (this.position.y / this.scale.height) * newScale.height;

        // Update the object's scale to the new scale
        this.scale = newScale;

        // Recalculate the object's size based on the new scale
        this.size = this.scale.height / this.scaleFactor; 

        // Recalculate the object's velocity steps based on the new scale
        this.xVelocity = this.scale.width / this.stepFactor;
        this.yVelocity = this.scale.height / this.stepFactor;

        // Set the object's width and height to the new size (object is a square)
        this.width = this.size;
        this.height = this.size;
    }

    /**
     * Draws the object on the canvas.
     * 
     * This method renders the object using the sprite sheet if provided, otherwise a red square.
     */
    draw() {
        if (this.spriteSheet) {
            // Sprite Sheet frame size: pixels = total pixels / total frames
            const frameWidth = this.spriteData.pixels.width / this.spriteData.orientation.columns;
            const frameHeight = this.spriteData.pixels.height / this.spriteData.orientation.rows;
    
            // Sprite Sheet direction data source (e.g., front, left, right, back)
            const directionData = this.spriteData[this.direction];
    
            // Sprite Sheet x and y declarations to store coordinates of current frame
            let frameX, frameY;
            // Sprite Sheet x and y current frame: coordinate = (index) * (pixels)
            frameX = (directionData.start + this.frameIndex) * frameWidth;
            frameY = directionData.row * frameHeight;
    
            // Set up the canvas dimensions and styles
            this.canvas.width = frameWidth;
            this.canvas.height = frameHeight;
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = `${this.position.x}px`;
            this.canvas.style.top = `${GameEnv.top+this.position.y}px`;
    
            // Clear the canvas before drawing
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
            // Draw the current frame of the sprite sheet
            this.ctx.drawImage(
                this.spriteSheet,
                frameX, frameY, frameWidth, frameHeight, // Source rectangle
                0, 0, this.canvas.width, this.canvas.height // Destination rectangle
            );
    
            // Update the frame index for animation at a slower rate
            this.frameCounter++;
            if (this.frameCounter % this.animationRate === 0) {
                this.frameIndex = (this.frameIndex + 1) % directionData.columns;
            }
        } else {
            // Draw default red square
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    /**
     * Updates the object's position and ensures it stays within the canvas boundaries.
     * 
     * This method updates the object's position based on its velocity and ensures that the object
     * stays within the boundaries of the canvas.
     */
    update() {
        // Update begins by drawing the object object
        this.draw();

        this.collisionChecks();

        // Update or change position according to velocity events
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Ensure the object stays within the canvas boundaries
        // Bottom of the canvas
        if (this.position.y + this.height > GameEnv.innerHeight) {
            this.position.y = GameEnv.innerHeight - this.height;
            this.velocity.y = 0;
        }
        // Top of the canvas
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
        // Right of the canvas
        if (this.position.x + this.width > GameEnv.innerWidth) {
            this.position.x = GameEnv.innerWidth - this.width;
            this.velocity.x = 0;
        }
        // Left of the canvas
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
    }

    /**
     * Binds key event listeners to handle object movement.
     * 
     * This method binds keydown and keyup event listeners to handle object movement.
     * The .bind(this) method ensures that 'this' refers to the object object.
     */
    bindEventListeners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * Handles key down events to change the object's velocity.
     * 
     * This method updates the object's velocity based on the key pressed.
     * 
     * @param {Object} event - The keydown event object.
     * @abstract
     */
    handleKeyDown({ keyCode }) {
        throw new Error('Method "handleKeyDown()" must be implemented');
    }

    /**
     * Handles key up events to stop the object's velocity.
     * 
     * This method stops the object's velocity based on the key released.
     * 
     * @param {Object} event - The keyup event object.
     * @abstract
     */
    handleKeyUp({ keyCode }) {
        throw new Error('Method "handleKeyUp()" must be implemented');
    }

    setX(x) {
        if (x < 0) {
            x = 0;
        }
        this.x = x;
    }

    setY(y) {
        if (y < GameEnv.top) {
            y = GameEnv.top;
        }
        if (y > GameEnv.bottom) {
            y = GameEnv.bottom;
        }
        this.y = y;
    }

    /* Destroy Game Object
    * remove canvas element of object
    * remove object from GameObject array
    */
    destroy() {
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            // Remove the canvas from the DOM
            this.canvas.parentNode.removeChild(this.canvas);
            GameEnv.gameObjects.splice(index, 1);
        }
    }
    
    /* Collision checks
     * uses GameObject isCollision to detect hit
     * calls collisionAction on hit
    */
    collisionChecks() {
        for (var gameObj of GameEnv.gameObjects){
            if (gameObj.canvas && this != gameObj) {
                this.isCollision(gameObj);
                if (this.collisionData.hit){
                    this.collisionAction();
                }
            }
        }
    }

    /* Collision detection method
     * usage: if (object.isCollision(platform)) { // action }
    */
    isCollision(other) {
        // Bounding rectangles from Canvas
        const thisRect = this.canvas.getBoundingClientRect();
        const otherRect = other.canvas.getBoundingClientRect();
    
        // Calculate center points of rectangles
        const thisCenterX = (thisRect.left + thisRect.right) / 2;
        const otherCenterX = (otherRect.left + otherRect.right) / 2;

        // Calculate new center points of rectangles
        const thisRectWidth = thisRect.right - thisRect.left;
        const thisRectLeftNew = otherCenterX - thisRectWidth / 2;
    
        // Calculate hitbox constants
        var widthPercentage = this.hitbox?.widthPercentage || 0.0;
        var heightPercentage = this.hitbox?.heightPercentage || 0.0;
    
        // Calculate hitbox reductions from the width and height
        const widthReduction = thisRect.width * widthPercentage;
        const heightReduction = thisRect.height * heightPercentage;
    
        // Build hitbox by subtracting reductions from the left, right, top, and bottom
        const thisLeft = thisRect.left + widthReduction;
        const thisTop = thisRect.top + heightReduction;
        const thisRight = thisRect.right - widthReduction;
        const thisBottom = thisRect.bottom;
        const tolerance = 10; // Adjust as needed

        // Determine hit and touch points of hit
        this.collisionData = {
            hit: (
                thisLeft < otherRect.right &&
                thisRight > otherRect.left &&
                thisTop < otherRect.bottom &&
                thisBottom > otherRect.top
            ),
            touchPoints: {
                this: {
                    id: this.canvas.id,
                    top: thisRect.bottom > otherRect.top,
                    bottom: thisRect.bottom <= otherRect.top,
                    left: thisCenterX > otherCenterX,
                    right: thisCenterX <= otherCenterX,
                },
                other: {
                    id: other.canvas.id,
                    top: thisRect.bottom < otherRect.top,
                    bottom: thisRect.bottom >= otherRect.top,
                    left: thisCenterX < otherCenterX, 
                    right: thisCenterX >= otherCenterX,
                },
            },
        };
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
        this.handleCollisionEvent("npc");
        this.handleCollisionEvent("player");
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
        if (this.state.collisions.includes(this.state.collision) && this.collisionData.touchPoints.other.id !== this.state.collision ) {
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
            // the array is empty, set to empty (default state)
            this.state.collision = "";
        }
    }
   
    /**
     * gameloop: Handles Player reaction / state updates to the collision
     */
    // Assuming you have some kind of input handling system

    handlePlayerReaction() {
        // handle player reaction based on collision type
        switch (this.state.collision) {
            // 1. Player is on top of npc
            case "npc":
            case "player":

                if (this.collisionData.touchPoints.this.top) {
                    this.state.movement = { up: true, down: false, left: true, right: true};
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0;
                    }
                
                }

                if (this.collisionData.touchPoints.this.bottom) {
                    this.state.movement = { up: false, down: true, left: true, right: true};
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0;
                    }

                } 
                
                if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: true, down: true, left: true, right: false };
                    if (this.velocity.x > 0) {
                        this.velocity.x = 0;
                    }
                
                }
                
                if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: true, down: true, left: false, right: true};
                    if (this.velocity.x < 0) {
                        this.velocity.x = 0;
                    }
                }
                break;
        }
    }
 
}

export default GameObject;