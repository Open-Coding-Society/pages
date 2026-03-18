import Enemy from './essentials/Enemy.js';
import Player from './essentials/Player.js';

class Shark extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        
        // Initialize movement properties from sprite data
        this.speed = this.spriteData.speed || 1;
        this.moveDirection = this.spriteData.direction || { x: 1, y: 1 };  // Renamed to avoid conflict
        this.walkingArea = this.spriteData.walkingArea || null;
    }

    /**
     * Override update to include walking area patrol movement
     */
    update() {
        // Move within walking area if defined
        if (this.walkingArea) {
            this.patrolWalkingArea();
        }
        
        // Call parent update (handles drawing, collision, canvas bounds)
        super.update();
    }

    /**
     * Autonomous movement within defined walking area (bouncing behavior)
     */
    patrolWalkingArea() {
        // Update position based on direction and speed
        this.position.x += this.moveDirection.x * this.speed;
        this.position.y += this.moveDirection.y * this.speed;
        
        // Bounce off left/right boundaries and update sprite direction
        if (this.position.x <= this.walkingArea.xMin) {
            this.position.x = this.walkingArea.xMin;
            this.moveDirection.x = 1;  // Move right
            this.direction = 'right';  // Update sprite orientation
        }
        if (this.position.x + this.width >= this.walkingArea.xMax) {
            this.position.x = this.walkingArea.xMax - this.width;
            this.moveDirection.x = -1;  // Move left
            this.direction = 'left';  // Update sprite orientation
        }
        
        // Bounce off top/bottom boundaries
        if (this.position.y <= this.walkingArea.yMin) {
            this.position.y = this.walkingArea.yMin;
            this.moveDirection.y = 1;  // Move down
        }
        if (this.position.y + this.height >= this.walkingArea.yMax) {
            this.position.y = this.walkingArea.yMax - this.height;
            this.moveDirection.y = -1;  // Move up
        }
    }

    handleCollisionEvent() {
        //extract player object
        var player = this.gameEnv.gameObjects.find(obj => obj instanceof Player); 
        //collided object is player
        if (player.id = this.collisionData.touchPoints.other.id) {
            
            console.log("Shark collided with player!");

        // Stop movement
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Explode player object with animation
        this.explode(player.position.x, player.position.y);
        player.destroy();
        this.playerDestroyed = true;

        // Restart level after explosion animation
        setTimeout(() => {
            this.gameEnv.gameControl.currentLevel.restart = true;
        }, 2000); // Adjust delay based on explosion animation duration
        }
    }

    // Override other methods if needed
}


export default Shark;