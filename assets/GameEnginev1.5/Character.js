import GameObject from './GameObject.js';

// Define non-mutable constants as defaults
const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };
const PIXELS = {height: 16, width: 16};

/**
 * Character is a dynamic class that manages the data and events for objects like player and NPCs.
 * 
 * The focus of this class is to handle the object's state, rendering, and key events.
 * 
 * This class uses a classic Java class pattern which is nice for managing object data and events.
 * 
 * The classic Java class pattern provides a structured way to define the properties and methods
 * associated with the object. This approach helps encapsulate the object's state and behavior,
 * making the code more modular and easier to maintain. By using this pattern, we can create
 * multiple instances of the Player class, each with its own state and behavior.
 * 
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
 * @method draw - Draws the object on the canvas.
 * @method update - Updates the object's position and ensures it stays within the canvas boundaries.
 * @method resize - Resizes the object based on the game environment.
 * @method destroy - Removes the object from the game environment.    
 */
class Character extends GameObject {
    /**
     * The constructor method is called when a new Player object is created.
     * 
     * @param {Object|null} data - The sprite data for the object. If null, a default red square is used.
     */
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.data = data;
        this.state = {
            ...this.state,
            animation: 'idle',
            direction: 'right',
            isDying: false,
            isFinishing: false,
        }; // Object control data

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.id = data.id || "default";
        this.canvas.width = data.pixels?.width || PIXELS.width;
        this.canvas.height = data.pixels?.height || PIXELS.height;
        this.hitbox = data?.hitbox || {};
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        document.getElementById("gameContainer").appendChild(this.canvas);
        this.canvas.style = "image-rendering: pixelated;";

        // Set initial object properties 
        this.x = 0;
        this.y = 0;
        this.frame = 0;
        
        // Initialize the object's properties 
        this.scale = { width: this.gameEnv.innerWidth, height: this.gameEnv.innerHeight };
        this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
        this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
        this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
        this.position = data.INIT_POSITION || INIT_POSITION;
        
        // Always set spriteData, even if there's no sprite sheet
        this.spriteData = data;
        
        // Check if sprite data is provided
        if (data && data.src) {
            // Load the sprite sheet
            this.spriteSheet = new Image();

            // mark when the sprite image has finished loading
            this.spriteReady = false;
            this.spriteSheet.onload = () => {
                this.spriteReady = true;
                // If pixels weren't provided or look invalid, populate from image natural size
                try {
                    if (!this.spriteData.pixels || this.spriteData.pixels.width === undefined || this.spriteData.pixels.height === undefined) {
                        this.spriteData.pixels = { width: this.spriteSheet.naturalWidth, height: this.spriteSheet.naturalHeight };
                    }
                    if (!this.spriteData.orientation) {
                        this.spriteData.orientation = { rows: 1, columns: 1 };
                    }
                    // Recalculate size in case dimensions changed
                    this.resize();
                    // Diagnostic logging to help ensure frames are calculated correctly
                    try {
                        const pixels = this.spriteData.pixels;
                        const orientation = this.spriteData.orientation;
                        const frameW = Math.max(1, Math.round(pixels.width / orientation.columns));
                        const frameH = Math.max(1, Math.round(pixels.height / orientation.rows));
                        console.log("[Character] Sprite loaded:", this.spriteSheet.src,
                                    "natural:", this.spriteSheet.naturalWidth + 'x' + this.spriteSheet.naturalHeight,
                                    "pixels:", pixels.width + 'x' + pixels.height,
                                    "orientation:", orientation.columns + 'x' + orientation.rows,
                                    "frame:", frameW + 'x' + frameH);

                        const dirs = ['up','right','down','left','upRight','upLeft','downRight','downLeft'];
                        dirs.forEach(d => {
                            const dd = this.spriteData[d];
                            if (!dd) return;
                            const row = dd.row || 0;
                            const cols = dd.columns || orientation.columns || 1;
                            console.log(`[Character] direction ${d}: row=${row}, columns=${cols}`);
                        });
                    } catch (logErr) {
                        console.warn('Character sprite diagnostics failed', logErr);
                    }
                } catch (err) {
                    console.warn('Error during sprite onload processing', err);
                }
            };
            this.spriteSheet.onerror = (e) => {
                console.warn('Failed to load sprite sheet:', data.src, e);
            };
            this.spriteSheet.src = data.src;

            // Initialize animation properties
            this.frameIndex = 0; // index reference to current frame
            this.frameCounter = 0; // count each frame rate refresh
            this.direction = 'down'; // Initial direction
        }

        // Initialize the object's position and velocity
        this.velocity = { x: 0, y: 0 };

        // Set the initial size and velocity of the object
        this.resize();
    }


    /**
     * Manages the object's look, state, and movement. 
     * 
     */
    update() {
        this.draw();
        this.collisionChecks();
        this.move();
    }


   /**
     * Draws the object on the canvas.
     * 
     * This method renders the object using the sprite sheet if provided, otherwise a red square.
     */
    draw() {
        // Clear the canvas before drawing
        this.clearCanvas();

        if (this.spriteSheet) {
            // Draw the sprite sheet frame
            this.drawSprite();
            // Update the frame index for animation
            this.updateAnimationFrame();
        } else {
            // Draw default red square
            this.drawDefaultSquare();
        }

        // Set up the canvas dimensions and styles
        this.setupCanvas();
    }

    /**
     * Clears the canvas before drawing.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the current frame of the sprite sheet.
     */
    drawSprite() {
        // If sprite hasn't loaded yet, draw a placeholder
        if (!this.spriteReady) {
            this.drawDefaultSquare();
            return;
        }

        // Calculate the frame dimensions
        const pixels = this.spriteData.pixels || { width: this.spriteSheet.naturalWidth, height: this.spriteSheet.naturalHeight };
        const orientation = this.spriteData.orientation || { rows: 1, columns: 1 };
        const frameWidth = Math.max(1, Math.round(pixels.width / orientation.columns));
        const frameHeight = Math.max(1, Math.round(pixels.height / orientation.rows));

        // Calculate the frame position on the sprite sheet
        const directionData = this.spriteData[this.direction] || {};
        const frameX = ((directionData.start || 0) + (this.frameIndex || 0)) * frameWidth;
        const frameY = (directionData.row || 0) * frameHeight;

        // Set the canvas dimensions based on the frame size
    // Set the canvas dimensions based on the frame size (integers)
    this.canvas.width = frameWidth;
    this.canvas.height = frameHeight;

        // Apply transformations (rotation, mirroring, spinning)
        this.applyTransformations(directionData);

        // Apply visual effects (e.g., grayscale, blur)
        this.applyFilters(directionData);

        // Draw the sprite sheet frame
        this.ctx.drawImage(
            this.spriteSheet,
            frameX, frameY, frameWidth, frameHeight, // Source rectangle
            0, 0, this.canvas.width, this.canvas.height // Destination rectangle
        );
    }

    /**
     * Updates the frame index for animation at a slower rate.
     */
    updateAnimationFrame() {
        this.frameCounter++;
        if (this.frameCounter % this.animationRate === 0) {
            const directionData = this.spriteData[this.direction] || {};
            const frames = directionData.columns || this.spriteData.orientation.columns || 1;
            this.frameIndex = (this.frameIndex + 1) % frames;
        }
    }

    /**
     * Draws a default red square on the canvas.
     */
    drawDefaultSquare() {
        this.ctx.fillStyle = this.data?.fillStyle || 'red';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Sets up the canvas dimensions and styles.
     */
    setupCanvas() {
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.position.x}px`;
        this.canvas.style.top = `${this.gameEnv.top + this.position.y}px`;
        
        // Use the zIndex from data if provided, otherwise use a default of 10
        this.canvas.style.zIndex = (this.data && this.data.zIndex !== undefined) ? this.data.zIndex : "10";
    }

    /**
     * Applies transformations like rotation, mirroring, and spinning.
     */
    applyTransformations(directionData) {
        if (directionData.rotate || directionData.mirror || directionData.spin) {
            // Translate to the center of the sprite
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

            // Apply rotation
            if (directionData.rotate) {
                this.ctx.rotate(directionData.rotate);
            }

            // Apply mirroring
            if (directionData.mirror) {
                this.ctx.scale(-1, 1); // Flip horizontally
            }

            // Apply spinning
            if (directionData.spin) {
                this.ctx.rotate(Math.PI / Math.floor(Math.random() * directionData.spin + 1));
            }

            // Translate back to the upper-left corner
            this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        }
    }

    /**
     * Applies visual effects like grayscale and blur.
     */
    applyFilters(directionData) {
        if (directionData.explode) {
            this.ctx.filter = 'grayscale(50%) blur(5px)';
        } else {
            this.ctx.filter = 'none'; // Reset filters
        }
    } 


    /**
     * Move the object and ensures it stays within the canvas boundaries.
     * 
     * This method changes the object's position based on its velocity and ensures that the object
     * stays within the boundaries of the canvas.
     */
    move(x, y) {

        if(x != undefined){
            this.position.x = x;
        }
        if(x != undefined){
            this.position.y = y;
        }
        
        // Update or change position according to velocity events
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Ensure the object stays within the canvas boundaries
        // Bottom of the canvas
        if (this.position.y + this.height > this.gameEnv.innerHeight) {
            this.position.y = this.gameEnv.innerHeight - this.height;
            this.velocity.y = 0;
        }
        // Top of the canvas
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
        // Right of the canvas
        if (this.position.x + this.width > this.gameEnv.innerWidth) {
            this.position.x = this.gameEnv.innerWidth - this.width;
            this.velocity.x = 0;
        }
        // Left of the canvas
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
    }
    

    /**
     * Resizes the object based on the game environment.
     * 
     * This method adjusts the object's size and velocity based on the scale of the game environment.
     * It also adjusts the object's position proportionally based on the previous and current scale.
     */
    resize() {
        // Calculate the new scale resulting from the window resize
        const newScale = { width: this.gameEnv.innerWidth, height: this.gameEnv.innerHeight };

        // Adjust the object's position proportionally
        this.position.x = (this.position.x / this.scale.width) * newScale.width;
        this.position.y = (this.position.y / this.scale.height) * newScale.height;

        // Update the object's scale to the new scale
        this.scale = newScale;

        // Recalculate the object's size based on the new scale
        this.size = this.scale.height / this.scaleFactor; 

        // Recalculate the object's velocity steps based on the new scale (3x faster)
        this.xVelocity = (this.scale.width / this.stepFactor) * 3;
        this.yVelocity = (this.scale.height / this.stepFactor) * 3;

        // Set the object's width and height to the new size (object is a square)
        this.width = this.size;
        this.height = this.size;
    }
    

    /* Destroy Game Object
     * remove canvas element of object
     * remove object from this.gameEnv.gameObjects array
     */
    destroy()
    {
      // Check if canvas exists before trying to remove it
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas)
      }
    
      // Remove from gameObjects array if not already removed
      const index = this.gameEnv.gameObjects.indexOf(this)
      if (index !== -1) {
        this.gameEnv.gameObjects.splice(index, 1)
      }
    }
    
}

export default Character;
