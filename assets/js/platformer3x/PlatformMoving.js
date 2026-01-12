import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class MovingPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.direction = -1; // Move up
        this.speed = 0.5; // Reduced speed
        this.maxTop = 300;
    
        // Add glow effect
        this.canvas.style.boxShadow = "0 0 10px 5px rgba(0, 255, 255, 0.7)";
    }

    // Required, but no update action
    update() {
        if (GameEnv.destroyedMagicBeam === true) {     
            this.movePlatform();
        }
    }

    movePlatform() {
        let currentPosition = parseInt(this.canvas.style.top) || 0;

        // Only move up
        if (currentPosition <= this.maxTop) { // Changed condition to check if it's below maxTop
            this.direction = 1; // Change direction to move down
        } else if (currentPosition >= (GameEnv.bottom - this.canvas.height)) { // Ensure it stays within the bottom of the game environment
            this.direction = -1;
        }

        this.canvas.style.top = currentPosition + this.direction * this.speed + 'px';
        this.draw();
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }
}

export default MovingPlatform;