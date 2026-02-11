import Background from './Background.js';

/** Parallax Background GameObject
 * - Tiling: draw multiple of the image to fill the gameCanvas extents
 * - Scrolling: adds velocity or position updates to the update(), to scroll the background
 */
export class BackgroundParallax extends Background {
    /**
     * Constructor is called by GameLevel create() method
     * @param {Object} data - The data object for the background
     * @param {Object} gameEnv - The game environment object for convenient access to game properties 
     */
    constructor(data = null, gameEnv = null) {
        // Set default ID and zIndex for parallax backgrounds
        const parallaxData = {
            ...data,
            id: data.id || "parallax-background",
            zIndex: data.zIndex || "1"
        };
        
        // Call parent constructor which handles image loading and canvas creation
        super(parallaxData, gameEnv);
        
        // Parallax-specific properties
        this.position = data.position || { x: 0, y: 0 };
        this.velocity = data.velocity || { x: 0, y: 0 };
        
        // Store reference to parent's onload to extend it
        const parentOnload = this.image.onload;
        
        // Extend the image.onload to add parallax-specific setup
        this.image.onload = () => {
            // Call parent onload first
            if (parentOnload) {
                parentOnload.call(this);
            }
            
            // Set opacity for parallax effect
            this.canvas.style.opacity = data.opacity || "0.3";
            
            // Reposition canvas to be first in container (behind everything)
            const gameContainer = document.getElementById("gameContainer");
            if (gameContainer && this.canvas.parentNode) {
                if (gameContainer.firstChild !== this.canvas) {
                    gameContainer.insertBefore(this.canvas, gameContainer.firstChild);
                }
            }
        };
    }

    /**
     * Update is called by GameLoop on all GameObjects 
     * Overrides parent to add parallax scrolling
     */
    update() {
        // Update the position for parallax scrolling
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Wrap the position to prevent overflow
        // For rightward movement (positive velocity.x), wrap when completing a full width cycle
        if (this.velocity.x > 0 && this.position.x >= this.width) {
            this.position.x = 0;
        }
        // For leftward movement (negative velocity.x), wrap when going too far left
        if (this.velocity.x < 0 && this.position.x <= -this.width) {
            this.position.x = 0;
        }
        
        // For downward movement (positive velocity.y), wrap at bottom
        if (this.velocity.y > 0 && this.position.y >= this.height) {
            this.position.y = 0;
        }
        // For upward movement (negative velocity.y), wrap at top
        if (this.velocity.y < 0 && this.position.y <= -this.height) {
            this.position.y = 0;
        }

        // Draw the background image
        this.draw();
    }

    /**
     * Draws the background image with tiling and scrolling
     * Overrides parent to add parallax tiling effect
     */
    draw() {
        if (!this.isInitialized) {
            return; // Skip drawing if not initialized
        }

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
    
        // Calculate the wrapped position, Scrolling
        let xWrapped = this.position.x % this.width;
        let yWrapped = this.position.y % this.height;
    
        if (xWrapped > 0) {
            xWrapped -= this.width;
        }
        if (yWrapped > 0) {
            yWrapped -= this.height;
        }
   
        // Calculate the number of draws needed to fill the canvas, Tiling
        const numHorizontalDraws = Math.ceil(canvasWidth / this.width) + 1;
        const numVerticalDraws = Math.ceil(canvasHeight / this.height) + 1;

        // Clear the canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw the background image multiple times to fill the canvas, Tiling
        for (let i = 0; i < numHorizontalDraws; i++) {
            for (let j = 0; j < numVerticalDraws; j++) {
                this.ctx.drawImage(
                    this.image, // Source image
                    0, 0, this.width, this.height, // Source rectangle
                    xWrapped + i * this.width, yWrapped + j * this.height, this.width, this.height); // Destination rectangle
            }
        }
    }
}

export default BackgroundParallax;