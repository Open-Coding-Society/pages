/**
 * End Ship Platformer - Character Classes
 * Contains base Character class and Player class
 */

/**
 * Base Character class with common properties and methods
 */
class Character {
    constructor(x, y, width, height, speed, jumpForce, maxHealth, type) {
        // Position and dimensions
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        // Physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.maxSpeed = speed;
        this.acceleration = 0.8;     // How quickly character accelerates
        this.friction = 0.90;        // Friction factor (0-1) where 1 = no friction
        this.airFriction = 0.95;     // Less friction in the air
        this.jumpForce = jumpForce;
        this.isJumping = false;
        this.isGrounded = false;
        this.direction = 1; // 1 for right, -1 for left
        this.forcesX = [];  // Array of forces applied to the character
        this.forcesY = [];  // Array of forces applied to the character
        
        // Combat properties
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.type = type; // 'player'
        
        // Animation states
        this.state = 'idle'; // idle, run, jump, die
        this.frameIndex = 0;
        this.frameTick = 0;
        this.frameDelay = 5; // Update frame every 5 game ticks
    }
    
    /**
     * Updates character state and position
     */
    update() {
        // Apply acceleration to velocity
        this.velocityX += this.accelerationX;
        
        // Apply forces
        for (let i = this.forcesX.length - 1; i >= 0; i--) {
            const force = this.forcesX[i];
            this.velocityX += force.value;
            
            // Reduce remaining force duration
            force.duration--;
            if (force.duration <= 0) {
                this.forcesX.splice(i, 1);
            }
        }
        
        for (let i = this.forcesY.length - 1; i >= 0; i--) {
            const force = this.forcesY[i];
            this.velocityY += force.value;
            
            // Reduce remaining force duration
            force.duration--;
            if (force.duration <= 0) {
                this.forcesY.splice(i, 1);
            }
        }
        
        // Apply friction based on whether character is in the air or on ground
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
        
        // Very small velocities are set to 0 to prevent endless tiny sliding
        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }
        
        // Keep track of positions before movement
        const previousX = this.x;
        const previousY = this.y;
        const wasGrounded = this.isGrounded;
        
        // Update position - split X and Y updates for better collision
        this.x += this.velocityX;
        
        // Check wall collisions after X movement
        if (CONFIG.ENVIRONMENT.WALLS) {
            for (const wall of CONFIG.ENVIRONMENT.WALLS) {
                // Check if character collides with wall
                if (this.x + this.width > wall.x &&
                    this.x < wall.x + wall.width &&
                    this.y + this.height > wall.y &&
                    this.y < wall.y + wall.height) {
                    
                    // Push back based on direction of movement
                    if (this.velocityX > 0) {
                        // Moving right, hit left side of wall
                        this.x = wall.x - this.width;
                    } else if (this.velocityX < 0) {
                        // Moving left, hit right side of wall
                        this.x = wall.x + wall.width;
                    }
                    
                    // Stop horizontal movement
                    this.velocityX = 0;
                    break;
                }
            }
        }
        
        // Now update vertical position
        this.y += this.velocityY;
        
        // Reset grounded state
        this.isGrounded = false;
        
        // Check if on ground (if floor is active in this area)
        let onMainFloor = false;
        if (CONFIG.ENVIRONMENT.FLOOR_ACTIVE !== false) { // Default to true if not specified
            // Check for pit exceptions (areas with no floor)
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
                this.isJumping = false;
                onMainFloor = true;
            }
        }
        
        // If not on main floor, check platforms
        if (!onMainFloor) {
            // Improved platform collision detection with trajectory checking
            for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
                if (this.x + this.width > platform.x &&
                    this.x < platform.x + platform.width) {
                    
                    // Check if we're within landing range and moving downward
                    const bottomBeforeMove = previousY + this.height;
                    const bottomAfterMove = this.y + this.height;
                    
                    // Check if we crossed the platform's top surface this frame
                    if (this.velocityY > 0 && // Moving downward
                        bottomBeforeMove <= platform.y && // Was above platform before
                        bottomAfterMove >= platform.y) {  // Is at or below platform now
                        
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.isGrounded = true;
                        this.isJumping = false;
                        break;
                    }
                    // Additional check for when velocity is very high
                    else if (this.velocityY > 5 && // Fast downward velocity
                            wasGrounded && // Was on ground last frame
                            bottomAfterMove >= platform.y && // Below platform now
                            bottomAfterMove <= platform.y + 20) { // Not too far below
                        
                        this.y = platform.y - this.height;
                        this.velocityY = 0;
                        this.isGrounded = true;
                        this.isJumping = false;
                        break;
                    }
                    // Check for platform bottom collision (hitting head)
                    else if (this.velocityY < 0 && // Moving upward
                            previousY >= platform.y + platform.height && // Was below platform
                            this.y < platform.y + platform.height) { // Now overlapping
                        
                        this.y = platform.y + platform.height;
                        this.velocityY = 0; // Stop upward movement
                        break;
                    }
                }
            }
        }
        
        // Check if player has fallen out of the world
        if (CONFIG.ENVIRONMENT.WORLD_BOUNDS && 
            this.y > CONFIG.ENVIRONMENT.WORLD_BOUNDS.BOTTOM) {
            this.handleOutOfBounds();
        }
        
        // Keep in horizontal bounds
        if (CONFIG.ENVIRONMENT.WORLD_BOUNDS) {
            this.x = Utils.clamp(
                this.x, 
                CONFIG.ENVIRONMENT.WORLD_BOUNDS.LEFT, 
                CONFIG.ENVIRONMENT.WORLD_BOUNDS.RIGHT - this.width
            );
        } else {
            // Fallback to canvas bounds
            this.x = Utils.clamp(this.x, 0, CONFIG.CANVAS.WIDTH - this.width);
        }
        
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
        
        // Update animation frames
        this.frameTick++;
        if (this.frameTick >= this.frameDelay) {
            this.frameTick = 0;
            this.frameIndex = (this.frameIndex + 1) % this.getFrameCount();
        }
    }

    /**
     * Handle what happens when character falls out of bounds
     */
    handleOutOfBounds() {
        // For player characters, reset position to a spawn point
        if (this.type === 'player') {
            this.x = CONFIG.PLAYER.START_X;
            this.y = CONFIG.PLAYER.START_Y;
            this.velocityX = 0;
            this.velocityY = 0;
            this.health -= 10; // Lose health when falling out of bounds
            
            // Check if player is now dead
            if (this.health <= 0) {
                // Handle game over
                if (window.game) {
                    window.game.setGameState(CONFIG.STATES.GAME_OVER);
                }
            }
        }
    }

    /**
     * Makes the character jump
     */
    jump() {
        if (this.isGrounded && this.state !== 'die') {
            this.velocityY = -this.jumpForce;
            this.isJumping = true;
            this.isGrounded = false;
        }
    }
    
    /**
     * Makes the character move left
     */
    moveLeft() {
        if (this.state !== 'die') {
            this.accelerationX = -this.acceleration;
            this.direction = -1;
        }
    }

    /**
     * Makes the character move right
     */
    moveRight() {
        if (this.state !== 'die') {
            this.accelerationX = this.acceleration;
            this.direction = 1;
        }
    }

    /**
     * Stops character horizontal movement
     */
    stopMoving() {
        this.accelerationX = 0;
        // Don't immediately reset velocity - let friction handle deceleration
    }
    
    /**
     * Apply a force to the character
     * @param {Number} forceX - X component of force
     * @param {Number} forceY - Y component of force
     * @param {Number} duration - How many frames to apply force
     */
    applyForce(forceX, forceY, duration = 1) {
        if (this.state !== 'die') {
            if (forceX !== 0) {
                this.forcesX.push({
                    value: forceX,
                    duration: duration
                });
            }
            
            if (forceY !== 0) {
                this.forcesY.push({
                    value: forceY,
                    duration: duration
                });
            }
        }
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
            case 'jump': return 2;
            case 'die': return 6;
            default: return 1;
        }
    }
}

/**
 * Player character controlled by user input
 */
class Player extends Character {
    /**
     * Create a player character
     */
    constructor() {
        super(
            CONFIG.PLAYER.START_X,
            CONFIG.PLAYER.START_Y,
            CONFIG.PLAYER.WIDTH,
            CONFIG.PLAYER.HEIGHT,
            CONFIG.PLAYER.SPEED,
            CONFIG.PLAYER.JUMP_FORCE,
            CONFIG.PLAYER.MAX_HEALTH,
            'player'
        );
        
        // Basic player properties
        this.color = CONFIG.PLAYER.COLOR || "#9b30ff"; // Purple for End theme
        this.name = "Player 1";
    }
    
    /**
     * Draws the player on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // Draw player body with End theme colors
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw head
        ctx.fillStyle = '#d8a8ff'; // Light purple for head
        ctx.fillRect(this.x + 10, this.y, this.width - 20, 20);
        
        // Draw direction indicator (eye)
        ctx.fillStyle = '#00ffea'; // Cyan for eye (End portal particle color)
        ctx.fillRect(
            this.direction > 0 ? this.x + this.width - 15 : this.x + 5,
            this.y + 5,
            10,
            10
        );
        
        // Draw debug info if enabled
        if (CONFIG.GAME.DEBUG_MODE) {
            ctx.fillStyle = '#d8a8ff'; // Light purple
            ctx.font = '10px Arial';
            ctx.fillText(`HP: ${Math.floor(this.health)}/${this.maxHealth}`, this.x, this.y - 5);
        }
    }
}