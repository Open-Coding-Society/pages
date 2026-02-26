/**
 * End Ship Platformer - Enemy Classes
 * Contains enemy AI and behavior
 */

/**
 * Goomba-like enemy that moves side to side and follows physics
 */
class Enemy {
    /**
     * Create an enemy
     * @param {Number} x - Starting X position
     * @param {Number} y - Starting Y position
     */
    constructor(x, y) {
        // Position and dimensions
        this.x = x;
        this.y = y;
        this.width = CONFIG.ENEMY.WIDTH;
        this.height = CONFIG.ENEMY.HEIGHT;
        
        // Physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxSpeed = CONFIG.ENEMY.SPEED;
        this.acceleration = 0.5;
        this.friction = 0.90;
        this.airFriction = 0.95;
        this.isGrounded = false;
        this.direction = Math.random() < 0.5 ? -1 : 1; // Random starting direction
        
        // Combat properties
        this.maxHealth = CONFIG.ENEMY.MAX_HEALTH;
        this.health = CONFIG.ENEMY.MAX_HEALTH;
        this.type = 'enemy';
        
        // Enemy-specific properties
        this.color = CONFIG.ENEMY.COLOR || "#8B0000"; // Dark red
        this.movementDirection = this.direction;
        this.directionChangeChance = CONFIG.ENEMY.DIRECTION_CHANGE_CHANCE || 0.015; // 1.5% per tick
        
        // Movement boundaries (middle 25%-75% of screen)
        this.leftBoundary = CONFIG.CANVAS.WIDTH * 0.25;
        this.rightBoundary = CONFIG.CANVAS.WIDTH * 0.75;
        
        // Animation properties
        this.state = 'idle';
        this.frameIndex = 0;
        this.frameTick = 0;
        this.frameDelay = 8;
        this.bobOffset = 0;
        
        // State
        this.isAlive = true;
        this.deathTimer = 0;
        this.deathDuration = 30; // Frames to show death animation
    }
    
    /**
     * Update enemy behavior and physics
     */
    update() {
        if (!this.isAlive) {
            this.handleDeath();
            return;
        }
        
        // AI behavior - random direction changes
        if (Math.random() < this.directionChangeChance) {
            this.movementDirection *= -1; // Reverse direction
        }
        
        // Check boundaries and reverse direction if needed
        if (this.x <= this.leftBoundary && this.movementDirection < 0) {
            this.movementDirection = 1;
        } else if (this.x + this.width >= this.rightBoundary && this.movementDirection > 0) {
            this.movementDirection = -1;
        }
        
        // Apply movement
        if (this.movementDirection > 0) {
            this.velocityX += this.acceleration;
            this.direction = 1;
        } else {
            this.velocityX -= this.acceleration;
            this.direction = -1;
        }
        
        // Apply friction
        if (this.isGrounded) {
            this.velocityX *= this.friction;
        } else {
            this.velocityX *= this.airFriction;
        }
        
        // Apply gravity
        this.velocityY += CONFIG.GAME.GRAVITY;
        
        // Clamp horizontal velocity to max speed
        if (Math.abs(this.velocityX) > this.maxSpeed) {
            this.velocityX = Math.sign(this.velocityX) * this.maxSpeed;
        }
        
        // Very small velocities are set to 0
        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Reset grounded state
        this.isGrounded = false;
        
        // Check if on ground
        let onMainFloor = false;
        if (CONFIG.ENVIRONMENT.FLOOR_ACTIVE !== false) {
            // Check for pit exceptions
            let inPit = false;
            
            if (CONFIG.ENVIRONMENT.PITS) {
                for (const pit of CONFIG.ENVIRONMENT.PITS) {
                    if (this.x + this.width > pit.x && this.x < pit.x + pit.width) {
                        inPit = true;
                        break;
                    }
                }
            }
            
            if (!inPit && this.y + this.height >= CONFIG.ENVIRONMENT.FLOOR_Y) {
                this.y = CONFIG.ENVIRONMENT.FLOOR_Y - this.height;
                this.velocityY = 0;
                this.isGrounded = true;
                onMainFloor = true;
            }
        }
        
        // Check platforms if not on main floor
        if (!onMainFloor) {
            for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
                if (this.x + this.width > platform.x &&
                    this.x < platform.x + platform.width &&
                    this.velocityY > 0 &&
                    this.y + this.height >= platform.y &&
                    this.y < platform.y) {
                    
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isGrounded = true;
                    break;
                }
            }
        }
        
        // Check if fallen out of world
        if (this.y > CONFIG.ENVIRONMENT.WORLD_BOUNDS.BOTTOM) {
            this.handleOutOfBounds();
        }
        
        // Keep in horizontal bounds
        this.x = Utils.clamp(this.x, this.leftBoundary, this.rightBoundary - this.width);
        
        // Update state
        if (this.health <= 0) {
            this.state = 'die';
        } else if (!this.isGrounded) {
            this.state = 'jump';
        } else if (Math.abs(this.velocityX) > 0.1) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }
        
        // Update animation
        this.frameTick++;
        if (this.frameTick >= this.frameDelay) {
            this.frameTick = 0;
            this.frameIndex = (this.frameIndex + 1) % this.getFrameCount();
        }
        
        // Update bobbing animation
        this.bobOffset = Math.sin(this.frameIndex * 0.3) * 2;
    }
    
    /**
     * Handle death state
     */
    handleDeath() {
        this.deathTimer++;
        
        // Remove enemy after death animation
        if (this.deathTimer >= this.deathDuration) {
            this.shouldRemove = true;
        }
    }
    
    /**
     * Kill this enemy (called when hit by projectile)
     */
    kill() {
        if (this.isAlive) {
            this.isAlive = false;
            this.deathTimer = 0;
            this.state = 'die';
            this.velocityX = 0; // Stop moving
        }
    }
    
    /**
     * Take damage from projectiles
     * @param {Number} damage - Amount of damage to take
     */
    takeDamage(damage) {
        if (!this.isAlive) return;
        
        this.health -= damage;
        
        if (this.health <= 0) {
            this.kill();
        }
    }
    
    /**
     * Check collision with player and handle interactions
     * @param {Player} player - The player character
     * @returns {String} Collision type: 'kill_player' or null
     */
    checkPlayerCollision(player) {
        if (!this.isAlive || !player || player.health <= 0) {
            return null;
        }
        
        const playerHitbox = player.getHitbox();
        const enemyHitbox = this.getHitbox();
        
        // Check if collision exists
        if (Utils.checkCollision(playerHitbox, enemyHitbox)) {
            // Enemy kills player on any collision (no more stomping)
            return 'kill_player';
        }
        
        return null;
    }
    
    /**
     * Handle what happens when enemy falls out of bounds
     */
    handleOutOfBounds() {
        // Remove enemy if it falls out of bounds
        this.shouldRemove = true;
    }
    
    /**
     * Gets the hitbox for collision detection
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
     * Gets the number of frames for current animation state
     * @returns {Number} Frame count
     */
    getFrameCount() {
        switch (this.state) {
            case 'idle': return 4;
            case 'run': return 6;
            case 'die': return 6;
            default: return 4;
        }
    }
    
    /**
     * Draw the enemy on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.isAlive && this.deathTimer > this.deathDuration / 2) {
            // Fade out during death
            const alpha = 1 - (this.deathTimer - this.deathDuration / 2) / (this.deathDuration / 2);
            ctx.globalAlpha = alpha;
        }
        
        // Calculate draw position with bobbing effect
        const drawY = this.y + (this.isAlive ? this.bobOffset : 0);
        
        // Draw enemy body
        ctx.fillStyle = this.isAlive ? this.color : '#4A4A4A'; // Gray when dead
        ctx.fillRect(this.x, drawY, this.width, this.height);
        
        // Draw simple face if alive
        if (this.isAlive) {
            // Eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + 8, drawY + 8, 6, 6);
            ctx.fillRect(this.x + this.width - 14, drawY + 8, 6, 6);
            
            // Eye pupils
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + 10, drawY + 10, 2, 2);
            ctx.fillRect(this.x + this.width - 12, drawY + 10, 2, 2);
            
            // Simple mouth
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + this.width/2 - 4, drawY + this.height - 12, 8, 2);
        }
        
        // Reset alpha
        ctx.globalAlpha = 1;
        
        // Draw debug info if enabled
        if (CONFIG.GAME.DEBUG_MODE) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.fillText(`HP: ${Math.floor(this.health)}`, this.x, drawY - 5);
            ctx.fillText(`Dir: ${this.movementDirection}`, this.x, drawY - 15);
        }
    }
}