import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Projectile from './Projectile.js';

class FightingPlayer extends Player {
    // Construct the class, with a list of stored projectiles
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 500; // 500ms between shots
        this.currentDirection = 'right'; // track facing direction

        // Bind attack to keyboard controls
        if (typeof window !== 'undefined') {
            this._attackHandler = (event) => {
                if (this.isAttackKey(event)) {
                    event.preventDefault();
                    this.attack();
                }
            };
            window.addEventListener('keydown', this._attackHandler);
        }
    }

    // Update spook and the projectiles
    update(...args) {
        super.update(...args);  // Do normal player updating
        
        this.updateCurrentDirection();
        
        // Update and clean up projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());
    }

    // Execute an attack
    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;
        
        const sourceX = this.position.x + this.width / 2;
        const sourceY = this.position.y + this.height / 2;
        const attackVector = this.getAttackVector();
        const attackDistance = 500;
        const targetX = sourceX + attackVector.x * attackDistance;
        const targetY = sourceY + attackVector.y * attackDistance;
        
        // Create arrow projectile
        this.projectiles.push(
            new Projectile(
                this.gameEnv,
                targetX, 
                targetY,
                // Offset source position to start at player center
                sourceX,
                sourceY,
                "PLAYER"  // Special type for player projectiles
            )
        );
        
        this.lastAttackTime = now;
    }

    isAttackKey(event) {
        return event.code === 'Space' || event.key === ' ' || event.code === 'KeyM' || event.key?.toLowerCase() === 'm';
    }

    updateCurrentDirection() {
        if (this.velocity.x === 0 && this.velocity.y === 0) return;

        const horizontal = this.velocity.x > 0 ? 'Right' : this.velocity.x < 0 ? 'Left' : '';
        const vertical = this.velocity.y > 0 ? 'down' : this.velocity.y < 0 ? 'up' : '';

        if (vertical && horizontal) {
            this.currentDirection = `${vertical}${horizontal}`;
            return;
        }

        this.currentDirection = vertical || horizontal.toLowerCase();
    }

    getAttackVector() {
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            return this.normalizeVector(this.velocity.x, this.velocity.y);
        }

        const directionVectors = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            upLeft: { x: -1, y: -1 },
            upRight: { x: 1, y: -1 },
            downLeft: { x: -1, y: 1 },
            downRight: { x: 1, y: 1 }
        };

        const directionVector = directionVectors[this.currentDirection] || directionVectors.right;
        return this.normalizeVector(directionVector.x, directionVector.y);
    }

    normalizeVector(x, y) {
        const length = Math.hypot(x, y) || 1;
        return { x: x / length, y: y / length };
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
