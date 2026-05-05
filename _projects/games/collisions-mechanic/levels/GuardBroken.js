// A broken version of Guard.js to show progression in the lesson
import Enemy from '@assets/js/GameEnginev1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1/essentials/Player.js';

class Guard extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.velocity.y = -3
    }

    /**
     * Override the update method to handle collision detection and set a vertical velocity
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

        this.position.y += this.velocity.y;

        // Ensure the object stays within the canvas boundaries
        this.stayWithinCanvas();
    }

    handleCollisionEvent() {
        var player = this.gameEnv.gameObjects.find(obj => obj instanceof Player); 

        console.log("Collision has occurred, player has been destroyed.");

        player.destroy();
        this.playerDestroyed = true;
    }
}

export default Guard;