import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Bullet from './Bullet.js';

class ShooterPlayer extends Player {
    constructor(data, gameEnv) {
        super(data, gameEnv); // Calls the original Player constructor
        this.bullets = [];
        this.shootCooldown = data.shootCooldown || 500; // milliseconds between shots
        this.lastShotTime = 0;
        this.facing = 'up'; // Default facing direction
    }

    update() {
        super.update(); // Keep the top-down movement logic

        // Update facing direction based on movement
        if (this.velocity.x > 0) this.facing = 'right';
        else if (this.velocity.x < 0) this.facing = 'left';
        else if (this.velocity.y > 0) this.facing = 'down';
        else if (this.velocity.y < 0) this.facing = 'up';

        // Check for Q key press to shoot
        if (this.pressedKeys[81]) { // Q key
            this.shoot();
        }

        // Update bullets
        this.updateBullets();
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < this.shootCooldown) return;

        this.lastShotTime = currentTime;

        // Create bullet data based on facing direction
        let velocity = { x: 0, y: 0 };
        switch (this.facing) {
            case 'up': velocity.y = -6; break;
            case 'down': velocity.y = 6; break;
            case 'left': velocity.x = -6; break;
            case 'right': velocity.x = 6; break;
        }

        const bulletData = {
        // Center the bullet based on the player's current visual size
        x: this.position.x + (this.width / 2), 
        y: this.position.y + (this.height / 2),
        velocity: velocity,
        gameEnv: this.gameEnv,
        shooter: this,
        direction: this.facing
        };

       
        const bullet = new Bullet(bulletData);
        this.bullets.push(bullet);
        bullet.zIndex = 1000; // Force to the very front layer
        this.gameEnv.gameObjects.push(bullet);
        console.log('Bullet spawned at', this.position.x, this.position.y, 'facing', this.facing);


    }

    updateBullets() {
        // Remove destroyed bullets
        this.bullets = this.bullets.filter(bullet => {
            return this.gameEnv.gameObjects.includes(bullet);
        });
    }

    destroy() {
        // Clean up bullets when player is destroyed
        this.bullets.forEach(bullet => bullet.destroy());
        super.destroy();
    }
}

export default ShooterPlayer;