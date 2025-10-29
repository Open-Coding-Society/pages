import Character from './Character.js';  // We do this as a Charecter can actually draw itself to the screen

// Template class -- VERIFY THIS
class Projectile extends Character {
    constructor(speed, data = null, gameEnv = null) {
        super(data, gameEnv);
        this.speed = speed;
    }

    // The function to make the player move towards the projectile
    update(speed) {
        // Draw the projectile to the screen
        this.draw();

        /* Direct copy-paste from the Enderman in the adventure game -- VERIFY THIS WORKS
        Also clean this up later to be a global function that can be used by both Projectile class & the Reaper class. */
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Player'
        );

        if (players.length === 0) return;
        
        // Find nearest player
        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        // Move towards nearest player
        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);

        // Update position
        this.position.x += Math.cos(angle) * speed;
        this.position.y += Math.sin(angle) * speed;
    }
}

export default Projectile;