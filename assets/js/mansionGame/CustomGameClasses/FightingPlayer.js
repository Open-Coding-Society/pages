import Player from '../GameEngine/Player.js';
import Projectile from './Projectile.js';

class FightingPlayer extends Player {
    // Construct the class, with a list of stored projectiles
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 500; // 500ms between shots
        this.currentDirection = 'right'; // track facing direction

        // Bind attack to spacebar
        if (typeof window !== 'undefined') {
            this._attackHandler = (event) => {
                if (event.code === 'Space' || event.key === ' ') {
                    this.attack();
                }
            };
            window.addEventListener('keydown', this._attackHandler);
        }
    }

    // Update spook and the projectiles
    update(...args) {
        super.update(...args);  // Do normal player updating
        
        // Track facing direction based on movement
        if (this.velocity.x > 0) this.currentDirection = 'right';
        else if (this.velocity.x < 0) this.currentDirection = 'left';
        
        // Update and clean up projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());
    }

    // Execute an attack
    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;
        
        // Calculate target point in direction player is facing
        const facingRight = this.currentDirection === 'right';
        // Shoot arrow 500 pixels in facing direction
        const targetX = this.position.x + (facingRight ? 500 : -500);
        const targetY = this.position.y;
        
        // Create arrow projectile
        this.projectiles.push(
            new Projectile(
                this.gameEnv,
                targetX, 
                targetY,
                // Offset source position to start at player center
                this.position.x + this.width/2,
                this.position.y + this.height/2,
                "PLAYER"  // Special type for player projectiles
            )
        );
        
        this.lastAttackTime = now;
    }

    // Clean up event listeners when destroyed
    destroy() {
        if (typeof window !== 'undefined' && this._attackHandler) {
            window.removeEventListener('keydown', this._attackHandler);
        }
        super.destroy();
    }
}

export default FightingPlayer;