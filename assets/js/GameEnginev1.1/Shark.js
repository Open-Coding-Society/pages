import Enemy from './essentials/Enemy.js';
import Player from './essentials/Player.js';

class Shark extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
    }

    // No need to override update or patrol logic; handled by Npc now

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