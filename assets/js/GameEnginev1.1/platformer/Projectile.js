/**
 * End Ship Platformer - Projectile Classes
 * Contains arrow projectiles and projectile management
 */

/**
 * Arrow projectile fired by the player
 */
class Projectile {
    /**
     * Create a projectile
     * @param {Number} x - Starting X position
     * @param {Number} y - Starting Y position
     * @param {Number} direction - Direction of travel (1 for right, -1 for left)
     * @param {String} type - Type of projectile ('arrow', 'fireball', etc.)
     */
    constructor(x, y, direction, type = 'arrow') {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PROJECTILE.WIDTH;
        this.height = CONFIG.PROJECTILE.HEIGHT;
        
        this.direction = direction;
        this.speed = CONFIG.PROJECTILE.SPEED;
        this.velocityX = this.speed * this.direction;
        this.velocityY = 0;
        
        this.type = type;
        this.damage = CONFIG.PROJECTILE.DAMAGE;
        
        // Visual properties
        this.color = CONFIG.PROJECTILE.COLOR || "#FFD700"; // Gold color
        this.trailParticles = [];
        
        // State
        this.isActive = true;
        this.distanceTraveled = 0;
        this.maxDistance = CONFIG.PROJECTILE.MAX_DISTANCE;
        
        // Animation
        this.frameIndex = 0;
        this.frameTick = 0;
    }
    
    /**
     * Update projectile position and state
     */
    update() {
        if (!this.isActive) return;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Track distance traveled
        this.distanceTraveled += Math.abs(this.velocityX);
        
        // Add trail particle
        if (this.frameTick % 3 === 0) { // Every 3 frames
            this.trailParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                life: 10,
                maxLife: 10
            });
        }
        
        // Update trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];
            particle.life--;
            
            if (particle.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
        
        // Check if projectile has traveled too far
        if (this.distanceTraveled > this.maxDistance) {
            this.isActive = false;
            return;
        }
        
        // Check world bounds
        if (this.x < 0 || this.x > CONFIG.CANVAS.WIDTH || 
            this.y < 0 || this.y > CONFIG.CANVAS.HEIGHT) {
            this.isActive = false;
            return;
        }
        
        // Check wall collisions
        if (CONFIG.ENVIRONMENT.WALLS) {
            for (const wall of CONFIG.ENVIRONMENT.WALLS) {
                if (this.x + this.width > wall.x &&
                    this.x < wall.x + wall.width &&
                    this.y + this.height > wall.y &&
                    this.y < wall.y + wall.height) {
                    this.isActive = false;
                    return;
                }
            }
        }
        
        // Check platform collisions
        for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                this.isActive = false;
                return;
            }
        }
        
        // Check floor collision
        if (CONFIG.ENVIRONMENT.FLOOR_ACTIVE !== false && 
            this.y + this.height >= CONFIG.ENVIRONMENT.FLOOR_Y) {
            this.isActive = false;
            return;
        }
        
        this.frameTick++;
    }
    
    /**
     * Check collision with an enemy
     * @param {Enemy} enemy - Enemy to check collision with
     * @returns {Boolean} Whether collision occurred
     */
    checkEnemyCollision(enemy) {
        if (!this.isActive || !enemy.isAlive) return false;
        
        const projectileHitbox = this.getHitbox();
        const enemyHitbox = enemy.getHitbox();
        
        if (Utils.checkCollision(projectileHitbox, enemyHitbox)) {
            // Hit the enemy
            enemy.takeDamage(this.damage);
            this.isActive = false;
            return true;
        }
        
        return false;
    }
    
    /**
     * Get hitbox for collision detection
     * @returns {Object} Hitbox {x, y, width, height}
     */
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    /**
     * Draw the projectile
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.isActive) return;
        
        // Draw trail particles
        for (const particle of this.trailParticles) {
            const alpha = particle.life / particle.maxLife;
            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = this.color;
            ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        }
        
        ctx.globalAlpha = 1;
        
        // Draw arrow
        ctx.fillStyle = this.color;
        
        if (this.type === 'arrow') {
            // Draw arrow shape
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            // Arrow head (triangle)
            ctx.beginPath();
            if (this.direction > 0) {
                // Pointing right
                ctx.moveTo(this.x + this.width, centerY);
                ctx.lineTo(this.x + this.width - 8, centerY - 4);
                ctx.lineTo(this.x + this.width - 8, centerY + 4);
            } else {
                // Pointing left
                ctx.moveTo(this.x, centerY);
                ctx.lineTo(this.x + 8, centerY - 4);
                ctx.lineTo(this.x + 8, centerY + 4);
            }
            ctx.closePath();
            ctx.fill();
            
            // Arrow shaft
            ctx.fillRect(
                this.direction > 0 ? this.x : this.x + 8,
                centerY - 1,
                this.width - 8,
                2
            );
            
            // Arrow fletching
            ctx.fillStyle = "#8B4513"; // Brown
            if (this.direction > 0) {
                ctx.fillRect(this.x, centerY - 3, 6, 2);
                ctx.fillRect(this.x, centerY + 1, 6, 2);
            } else {
                ctx.fillRect(this.x + this.width - 6, centerY - 3, 6, 2);
                ctx.fillRect(this.x + this.width - 6, centerY + 1, 6, 2);
            }
        } else {
            // Simple rectangle for other projectile types
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Debug hitbox
        if (CONFIG.GAME.DEBUG_MODE) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
