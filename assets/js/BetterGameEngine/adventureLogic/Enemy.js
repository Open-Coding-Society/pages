import Character from './Character.js';
import Player from './Player.js';

class Enemy extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.playerDestroyed = false; // Tracks if the player has been "killed"
    }

    /**
     * Override the update method to handle collision detection.
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

        // Ensure the object stays within the canvas boundaries
        this.stayWithinCanvas();
    }

    /**
     * stayWithinCanvas method ensures that the object stays within the boundaries of the canvas.
     */
    stayWithinCanvas() {
        // Bottom of the canvas
        if (this.transform.y + this.height > this.gameEnv.innerHeight) {
            this.transform.y = this.gameEnv.innerHeight - this.height;
            this.transform.yv = 0;
        }
        // Top of the canvas
        if (this.transform.y < 0) {
            this.transform.y = 0;
            this.transform.yv = 0;
        }
        // Right of the canvas
        if (this.transform.x + this.width > this.gameEnv.innerWidth) {
            this.transform.x = this.gameEnv.innerWidth - this.width;
            this.transform.xv = 0;
        }
        // Left of the canvas
        if (this.transform.x < 0) {
            this.transform.x = 0;
            this.transform.xv = 0;
        }
    }

    /**
     * Check if the Enemy collides with the Player.
     * @returns {boolean} True if the Enemy collides with the Player, False otherwise.
     */
    collisionChecks() {
        for (const gameObj of this.gameEnv.gameObjects) {
            if (gameObj instanceof Player) {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Handle collision with the Player.
     */
    handleCollisionEvent() {
        console.log("Player collided with the Enemy. Player is dead.");
        this.playerDestroyed = true; // Mark the player as "dead"
        // End the level cleanly instead of setting a restart flag that can freeze input
        if (this.gameEnv && this.gameEnv.gameControl && typeof this.gameEnv.gameControl.endLevel === 'function') {
            this.gameEnv.gameControl.endLevel();
        } else if (this.gameEnv && this.gameEnv.gameControl) {
            this.gameEnv.gameControl.currentLevel.continue = false;
        }
    }

    /**
     * Proximity check is no longer needed, so leave it unimplemented.
     */
    checkProximityToPlayer() {
        // No longer needed
    }

    /*
    * Create an explosion effect when the Enemy is destroyed.
    * @param {number} x - The x-coordinate of the explosion.
    * @param {number} y - The y-coordinate of the explosion.
    */
    
    explode(x,y) {
        const shards = 20; // Number of shards
        for (let i = 0; i < shards; i++) {
            const shard = document.createElement('div');
            shard.style.position = 'absolute';
            shard.style.width = '5px';
            shard.style.height = '5px';
            shard.style.backgroundColor = 'red'; // color of the shards
            shard.style.left =  `${x}px`;
            shard.style.top = `${this.gameEnv.top+y}px`;
            this.canvas.parentElement.appendChild(shard); // adds shard to the canvas

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;

            const shardX = Math.cos(angle) * speed;
            const shardY = Math.sin(angle) * speed;

            shard.animate(
                [
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${shardX * 20}px, ${shardY * 20}px)`, opacity: 0 },
                ],
                {
                    duration: 1000,
                    easing: 'ease-out',
                    fill: 'forwards',
                }
            );

            setTimeout(() => {
                shard.remove(); // removes shards after animation
            }, 1000); // 1000 means that the animation should last one second, the delete the remaining shards and cleans up
        }
    }

    /**
     * jump the npc based on the collision.
     * This method must be implemented by subclasses.
     * @abstract
     */
    jump() {
        // To be implemented by subclasses
        throw new Error("Method 'jump()' must be implemented.");
    }
}

export default Enemy;
