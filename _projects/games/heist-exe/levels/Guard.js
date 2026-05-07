import Enemy from '@assets/js/GameEnginev1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1/essentials/Player.js';

class Guard extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.velocity.y = -3 // Set an initial vertical velocity for the guard in the constructor. Because it is in the constructor, this velocity will be set as soon as the level starts.
    }

    /**
     * Override the update method to handle collision detection and update the vertical velocity
     */
    update() {
        // Update begins by drawing the object
        this.draw();

        if (this.spriteData && typeof this.spriteData.update === 'function') {
            this.spriteData.update.call(this);
        }
        // Check for collision with the player
        if (!this.playerDestroyed && this.collisionChecks()) {
            this.handleCollisionEvent();
        }

        this.position.y += this.velocity.y; // update position

        // Ensure the object stays within the canvas boundaries
        this.stayWithinCanvas();
    }

    /**
     * stayWithinCanvas method ensures that the object stays within the boundaries of the canvas.
     * With this override, we can also reverse the velocity whenever the guard hits the edges of the canvas.
     */
    stayWithinCanvas() {
        // Bottom of the canvas
        if (this.position.y + this.height > this.gameEnv.innerHeight) {
            this.position.y = this.gameEnv.innerHeight - this.height;
            this.velocity.y *= -1; // Reverse vertical velocity to create a "bounce" effect
            console.log(this.velocity.y);
        }
        // Top of the canvas
        if (this.position.y < 0) {
            this.position.y = 1;
            this.velocity.y *= -1; // Reverse vertical velocity to create a "bounce" effects
            console.log(this.velocity.y);
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

    handleCollisionEvent() {
        var player = this.gameEnv.gameObjects.find(obj => obj instanceof Player); 

        console.log("Collision has occurred, player has been destroyed.");

        player.destroy();
        this.playerDestroyed = true;
    }
}

export default Guard;