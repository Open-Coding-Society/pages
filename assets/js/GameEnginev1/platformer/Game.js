/**
 * Platformer Game Engine
 * Main game logic and rendering
 */
class Game {
    constructor(backgroundImageSrc = null) {
        // Initialize canvas
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on CONFIG
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
    
        // Game state
        this.currentState = CONFIG.STATES.PLAYING;
        this.lastTime = 0;
        
        // Game objects
        this.player1 = null;
        this.enemies = [];
        this.projectiles = [];
        
        // Victory tracking
        this.enemiesKilled = 0;
        this.totalEnemies = 0;
        this.victoryLinkShown = false;
        
        // Background image handling
        this.backgroundImage = null;
        this.backgroundLoaded = false;
        
        // Load background image if provided
        if (backgroundImageSrc) {
            this.loadBackgroundImage(backgroundImageSrc);
        }
        
        // Initialize input handler
        InputHandler.init(this);
        
        // Initialize UI
        UI.init();
        
        // Create player immediately
        this.initGame();
        
        // Make game instance globally accessible
        window.game = this;
        
        // Start game loop
        this.gameLoop(performance.now());
    }
    
    /**
     * Load background image
     * @param {String} imageSrc - Path to the background image
     */
    loadBackgroundImage(imageSrc) {
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
            console.log('Background image loaded successfully');
        };
        this.backgroundImage.onerror = () => {
            console.error('Failed to load background image:', imageSrc);
            this.backgroundLoaded = false;
        };
        this.backgroundImage.src = imageSrc;
    }
    
    /**
     * Set a new background image
     * @param {String} imageSrc - Path to the new background image
     */
    setBackgroundImage(imageSrc) {
        this.backgroundLoaded = false;
        this.loadBackgroundImage(imageSrc);
    }
    
    /**
     * Handle canvas resize - called externally when window resizes
     */
    handleResize() {
        // Update canvas dimensions
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
        
        // Force a redraw
        if (this.currentState !== CONFIG.STATES.PLAYING) {
            this.drawGame();
        }
    }
    
    /**
     * Initialize game by creating player and setting up UI
     */
    initGame() {
        // Remove any existing victory overlay
        const existingOverlay = document.getElementById('victory-overlay');
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }
        
        // Create player
        this.player1 = new Player();
        
        // Reset player health
        this.player1.health = this.player1.maxHealth;
        
        // Initialize shooting properties
        this.player1.lastShotTime = 0;
        
        // Create enemies
        this.spawnEnemies();
        
        // Clear projectiles
        this.projectiles = [];
        
        // Update UI
        UI.updateHealthBars(this.player1);
        UI.showMessage("Level Started!", 2000);
        
        // Start game
        this.setGameState(CONFIG.STATES.PLAYING);
    }
    
    /**
     * Spawn enemies at configured locations
     */
    spawnEnemies() {
        this.enemies = [];
        this.enemiesKilled = 0;
        this.victoryLinkShown = false;
        
        if (CONFIG.ENEMY.SPAWN_POINTS) {
            for (const spawnPoint of CONFIG.ENEMY.SPAWN_POINTS) {
                const enemy = new Enemy(spawnPoint.x, spawnPoint.y);
                this.enemies.push(enemy);
            }
        }
        
        this.totalEnemies = this.enemies.length;
        console.log(`Spawned ${this.enemies.length} enemies`);
    }
    
    /**
     * Sets the game state and updates UI
     * @param {String} state - New game state
     */
    setGameState(state) {
        this.currentState = state;
    
        // Hide all screens
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        // Show appropriate screen
        switch (state) {
            case CONFIG.STATES.PLAYING:
                // Game screen already visible
                break;
            case CONFIG.STATES.PAUSED:
                document.getElementById('pause-screen').classList.remove('hidden');
                break;
            case CONFIG.STATES.GAME_OVER:
                document.getElementById('game-over-screen').classList.remove('hidden');
                break;
        }
    }
    
    /**
     * Pauses the game
     */
    pauseGame() {
        if (this.currentState === CONFIG.STATES.PLAYING) {
            this.setGameState(CONFIG.STATES.PAUSED);
        }
    }
    
    /**
     * Resumes the game
     */
    resumeGame() {
        if (this.currentState === CONFIG.STATES.PAUSED) {
            this.setGameState(CONFIG.STATES.PLAYING);
            this.lastTime = performance.now();
        }
    }
    
    /**
     * Main game loop
     * @param {Number} timestamp - Current time
     */
    gameLoop(timestamp) {
        // Calculate delta time (time since last frame)
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Clear canvas with fallback color
        this.ctx.fillStyle = '#0c0015'; // Dark purple-black for End theme
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Handle game states
        switch (this.currentState) {
            case CONFIG.STATES.PLAYING:
                this.updateGame(deltaTime);
                this.drawGame();
                break;
                
            case CONFIG.STATES.PAUSED:
            case CONFIG.STATES.GAME_OVER:
                this.drawGame(); // Draw current state without updating
                break;
        }
        
        // Continue the loop
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Updates game state
     * @param {Number} deltaTime - Time since last frame
     */
    updateGame(deltaTime) {
        if (this.currentState !== CONFIG.STATES.PLAYING || !this.player1) return;
        
        // Handle player input
        this.handlePlayerInput();
        
        // Update game objects
        this.player1.update();
        
        // Update enemies
        this.updateEnemies();
        
        // Update projectiles
        this.updateProjectiles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update UI
        UI.updateHealthBars(this.player1);
    }
    
    /**
     * Update all projectiles
     */
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update();
            
            // Remove inactive projectiles
            if (!projectile.isActive) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    /**
     * Update all enemies
     */
    updateEnemies() {
        // Update each enemy
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();
            
            // Remove dead enemies that have finished their death animation
            if (enemy.shouldRemove) {
                this.enemies.splice(i, 1);
                this.enemiesKilled++;
                
                // Check for victory condition
                this.checkVictoryCondition();
            }
        }
    }
    
    /**
     * Check if all enemies are defeated and show victory link
     */
    checkVictoryCondition() {
        if (this.enemiesKilled >= this.totalEnemies && !this.victoryLinkShown) {
            this.victoryLinkShown = true;
            this.showVictoryLink();
        }
    }
    
    /**
     * Show victory link after defeating all enemies
     */
    showVictoryLink() {
        // Create victory overlay
        const victoryOverlay = document.createElement('div');
        victoryOverlay.id = 'victory-overlay';
        victoryOverlay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(39, 15, 51, 0.95);
            border: 1px solid #9b30ff;
            border-radius: 6px;
            padding: 15px;
            z-index: 1000;
            font-family: 'Minecraft', 'Courier New', monospace;
            max-width: 250px;
        `;
        
        // Victory message
        const victoryTitle = document.createElement('h3');
        victoryTitle.textContent = 'You have successfully defeated all enemies.';
        victoryTitle.style.cssText = `
            color: #d8a8ff;
            font-size: 16px;
            margin: 0 0 10px 0;
        `;
        
        // Victory link button
        const victoryLink = document.createElement('a');
        victoryLink.href = '../../../../gamify/end'; // this could be ../../../../navigation/adventureGame/end.md but that gave me the pretty print bs so idrk
        victoryLink.target = '_blank';
        victoryLink.textContent = 'Claim Elytra & Return →';
        victoryLink.style.cssText = `
            display: inline-block;
            background-color: #9b30ff;
            color: #0c0015;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            margin-right: 8px;
            transition: background-color 0.2s ease;
        `;
        
        // Simple hover effect
        victoryLink.addEventListener('mouseenter', () => {
            victoryLink.style.backgroundColor = '#b347ff';
        });
        
        victoryLink.addEventListener('mouseleave', () => {
            victoryLink.style.backgroundColor = '#9b30ff';
        });
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            color: #9565c9;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 8px;
            transition: color 0.2s ease;
        `;
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(victoryOverlay);
        });
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.color = '#d8a8ff';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.color = '#9565c9';
        });
        
        // Assemble the overlay
        victoryOverlay.appendChild(victoryTitle);
        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(victoryLink);
        buttonContainer.appendChild(closeButton);
        victoryOverlay.appendChild(buttonContainer);
        
        // Add to page
        document.body.appendChild(victoryOverlay);
        
        console.log('Elytra Retrieved! You may now return to the end.');
    }
    
    /**
     * Check collisions between player and enemies
     */
    checkCollisions() {
        if (!this.player1 || this.player1.health <= 0) return;
        
        // Check player-enemy collisions
        for (const enemy of this.enemies) {
            const collisionResult = enemy.checkPlayerCollision(this.player1);
            
            if (collisionResult === 'kill_player') {
                // Enemy kills player
                this.player1.health -= 50; // Significant damage
                
                // Apply knockback to player
                const knockbackDirection = this.player1.x < enemy.x ? -1 : 1;
                this.player1.applyForce(knockbackDirection * 8, -5, 10);
    
                // Check if player is dead
                if (this.player1.health <= 0) {
                    this.player1.health = 0;
                    UI.showMessage("Game Over!", 3000);
                    setTimeout(() => {
                        this.setGameState(CONFIG.STATES.GAME_OVER);
                    }, 200);
                }
            }
        }
        
        // Check projectile-enemy collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            for (const enemy of this.enemies) {
                if (projectile.checkEnemyCollision(enemy)) {
                    
                    // Remove the projectile
                    this.projectiles.splice(i, 1);
                    break; // Exit enemy loop since projectile is gone
                }
            }
        }
    }
    
    /**
     * Handle player input from keyboard
     */
    handlePlayerInput() {
        if (!this.player1) return;
        
        // Movement
        if (InputHandler.keys.up) {
            this.player1.jump();
        }
        
        if (InputHandler.keys.left) {
            this.player1.moveLeft();
        } else if (InputHandler.keys.right) {
            this.player1.moveRight();
        } else {
            this.player1.stopMoving();
        }
        
        // Shooting
        if (InputHandler.keys.space) {
            this.handlePlayerShoot();
        }
    }
    
    /**
     * Handle player shooting
     */
    handlePlayerShoot() {
        if (!this.player1) return;
        
        const currentTime = performance.now();
        
        // Check cooldown
        if (!this.player1.lastShotTime || 
            currentTime - this.player1.lastShotTime >= CONFIG.PLAYER.PROJECTILE_COOLDOWN) {
            
            // Create projectile
            const projectileX = this.player1.direction > 0 ? 
                this.player1.x + this.player1.width : 
                this.player1.x - CONFIG.PROJECTILE.WIDTH;
            const projectileY = this.player1.y + this.player1.height / 2 - CONFIG.PROJECTILE.HEIGHT / 2;
            
            const projectile = new Projectile(projectileX, projectileY, this.player1.direction);
            this.projectiles.push(projectile);
            
            this.player1.lastShotTime = currentTime;
            
            // Visual feedback
            UI.showMessage("Arrow shot!", 500);
        }
    }
    
    /**
     * Draws the background
     */
    drawBackground() {
        if (this.backgroundLoaded && this.backgroundImage) {
            // Draw the background image to fit the entire canvas
            this.ctx.drawImage(
                this.backgroundImage, 
                0, 0, 
                this.canvas.width, 
                this.canvas.height
            );
        } else {
            // Fallback: draw solid color background
            this.ctx.fillStyle = '#0c0015'; // Dark purple-black for End theme
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    /**
     * Draws game objects
     */
    drawGame() {
        // Save the canvas state
        this.ctx.save();
        
        // Draw background first
        this.drawBackground();
        
        // Draw floor
        this.ctx.fillStyle = '#16081c'; // Dark purple for End theme
        this.ctx.fillRect(0, CONFIG.ENVIRONMENT.FLOOR_Y, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.FLOOR_Y);
        
        // Check if pits exist and draw them
        if (CONFIG.ENVIRONMENT.PITS && Array.isArray(CONFIG.ENVIRONMENT.PITS)) {
            // Draw pits (erase parts of the floor)
            this.ctx.globalCompositeOperation = 'destination-out';
            for (const pit of CONFIG.ENVIRONMENT.PITS) {
                this.ctx.fillRect(pit.x, pit.y, pit.width, pit.height);
            }
            this.ctx.globalCompositeOperation = 'source-over';
        }
        
        // Draw platforms
        this.ctx.fillStyle = '#4b1a68'; // Medium purple for End theme
        for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        
        // Draw walls if they exist
        if (CONFIG.ENVIRONMENT.WALLS && Array.isArray(CONFIG.ENVIRONMENT.WALLS)) {
            this.ctx.fillStyle = '#270f33'; // Darker purple for End theme
            for (const wall of CONFIG.ENVIRONMENT.WALLS) {
                this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            }
        }
        
        // Draw game objects
        if (this.player1) this.player1.draw(this.ctx);
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        // Draw projectiles
        for (const projectile of this.projectiles) {
            projectile.draw(this.ctx);
        }
        
        // Restore the canvas state
        this.ctx.restore();
    }
}