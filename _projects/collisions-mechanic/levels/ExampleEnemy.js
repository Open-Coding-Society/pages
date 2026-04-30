import Enemy from './essentials/Enemy.js';
import Player from './essentials/Player.js';

class ExampleEnemy extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
    }

    handleCollisionEvent() {
        var player = this.gameEnv.gameObjects.find(obj => obj instanceof Player); 

        console.log("Collision has occurred, player has been destroyed.");

        this.explode(player.position.x, player.position.y);
        player.destroy();
        this.playerDestroyed = true;
    }
}