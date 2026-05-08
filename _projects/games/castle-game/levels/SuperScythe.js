import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';
import BossScythe from './BossScythe.js';

/**
 * SuperScythe class - result of fusing two ultra scythes
 * The most powerful scythe type, lasts 30 seconds
 */
class SuperScythe extends Enemy {
    constructor(gameEnv, x, y) {
        const path = gameEnv.path;

        const superScytheData = {
            id: `super_scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 2, // Largest scythe size (smaller number = bigger scythe)
            ANIMATION_RATE: 10,
            pixels: { width: 64, height: 64 },
            INIT_POSITION: {
                x: x,
                y: y
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 } // Largest hitbox for biggest scythe
        };

        super(superScytheData, gameEnv);

        // Initialize hittingNPC flag
        this._hittingNPC ??= false;

        // Mark as super scythe
        this.isSuper = true;
        this.isUltra = true; // Also counts as ultra for compatibility
        this.isSpecial = true; // Also counts as special for compatibility

        // Disable dialogue system
        if (this.dialogueSystem) {
            this.dialogueSystem = null;
        }
        
        if (this.removeInteractKeyListeners) {
            this.removeInteractKeyListeners();
        }

        // Enhanced motion properties
        this.velocity = {
            x: (Math.random() - 0.5) * 8, // Fastest movement
            y: Math.random() * 3 + 2
        };

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.25; // Fastest spinning

        // Track if this super scythe has already fused
        this.hasFused = false;

        // Manual image loading
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";

        // Visual distinction - golden/white rainbow glow
        this.glowColor = '#ffd700';

        // Enhanced pulsing effect
        this.pulseTimer = 0;
        this.pulseSpeed = 0.2;

        // Lifetime properties - 30 seconds as requested
        this.creationTime = Date.now();
        this.lifespan = 30000; // 30 seconds

        // Auto-destroy radius - largest area
        this.autoDestroyRadius = 500; // Pixels

        // Create formation explosion effect
        this.createFormationExplosion(x + this.width/2, y + this.height/2);
    }

    update() {
        if (this.revComplete) return;

        // Check if super scythe has exceeded its lifespan (30 seconds)
        const currentTime = Date.now();
        if (currentTime - this.creationTime >= this.lifespan) {
            this.revComplete = true;
            this.createDestructionExplosion(this.position.x + this.width/2, this.position.y + this.height/2);
            this.destroy();
            return;
        }

        // Super scythes ignore NPC collisions
        this._hittingNPC = false;

        // Update positioning
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce off screen edges
        if (this.position.x <= 0 || this.position.x >= this.gameEnv.innerWidth - this.width) {
            this.velocity.x = -this.velocity.x;
            this.position.x = Math.max(0, Math.min(this.gameEnv.innerWidth - this.width, this.position.x));
        }

        if (this.position.y <= 0 || this.position.y >= this.gameEnv.innerHeight - this.height) {
            this.velocity.y = -this.velocity.y;
            this.position.y = Math.max(0, Math.min(this.gameEnv.innerHeight - this.height, this.position.y));
        }

        // Update rotation
        this.rotationAngle += this.rotationSpeed;

        // Update pulsing
        this.pulseTimer += this.pulseSpeed;

        // Auto-destroy nearby scythes
        this.autoDestroyNearbyScythes();

        // Check for collisions with other super scythes
        this.checkSuperScytheCollisions();

        // Check for collisions with player
        this.checkPlayerCollision();

        super.update();
    }

    autoDestroyNearbyScythes() {
        // Find and destroy all regular scythes
        const regularScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );

        // Find and destroy all special scythes
        const specialScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'SpecialScythe' && !obj.isUltra
        );

        // Find and destroy all ultra scythes
        const ultraScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'UltraScythe' && !obj.isSuper
        );

        // Destroy regular scythes within radius
        regularScythes.forEach(scythe => {
            const dx = scythe.position.x - this.position.x;
            const dy = scythe.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.autoDestroyRadius) {
                scythe.revComplete = true;
                scythe.destroy();
                this.createSmallExplosion(scythe.position.x + scythe.width/2, scythe.position.y + scythe.height/2);
            }
        });

        // Destroy special scythes within radius
        specialScythes.forEach(specialScythe => {
            const dx = specialScythe.position.x - this.position.x;
            const dy = specialScythe.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.autoDestroyRadius) {
                specialScythe.revComplete = true;
                specialScythe.destroy();
                this.createSmallExplosion(specialScythe.position.x + specialScythe.width/2, specialScythe.position.y + specialScythe.height/2);
            }
        });

        // Destroy ultra scythes within radius
        ultraScythes.forEach(ultraScythe => {
            const dx = ultraScythe.position.x - this.position.x;
            const dy = ultraScythe.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.autoDestroyRadius) {
                ultraScythe.revComplete = true;
                ultraScythe.destroy();
                this.createSmallExplosion(ultraScythe.position.x + ultraScythe.width/2, ultraScythe.position.y + ultraScythe.height/2);
            }
        });
    }

    checkSuperScytheCollisions() {
        // Don't check if this super scythe has already fused
        if (this.hasFused) return;

        // Find other super scythes
        const otherSuperScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'SuperScythe' && 
            obj !== this && 
            !obj.hasFused &&
            !obj.revComplete
        );

        for (const otherSuperScythe of otherSuperScythes) {
            const thisCenterX = this.position.x + this.width / 2;
            const thisCenterY = this.position.y + this.height / 2;
            const otherCenterX = otherSuperScythe.position.x + otherSuperScythe.width / 2;
            const otherCenterY = otherSuperScythe.position.y + otherSuperScythe.height / 2;

            const dx = otherCenterX - thisCenterX;
            const dy = otherCenterY - thisCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const HIT_DISTANCE = (this.width + otherSuperScythe.width) / 3;

            if (distance <= HIT_DISTANCE) {
                // Create a BossScythe at the midpoint
                const midX = (this.position.x + otherSuperScythe.position.x) / 2;
                const midY = (this.position.y + otherSuperScythe.position.y) / 2;
                
                const bossScythe = new BossScythe(this.gameEnv, midX, midY);
                this.gameEnv.gameObjects.push(bossScythe);

                // Mark both super scythes as fused and destroy them
                this.hasFused = true;
                otherSuperScythe.hasFused = true;
                this.revComplete = true;
                otherSuperScythe.revComplete = true;
                
                // Create ultimate fusion explosion effect
                this.createUltimateFusionExplosion(midX + bossScythe.width/2, midY + bossScythe.height/2);
                
                this.destroy();
                otherSuperScythe.destroy();
                break;
            }
        }
    }

    createUltimateFusionExplosion(x, y) {
        // Create the most spectacular fusion effect for boss creation
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '80px';
                explosion.style.height = '80px';
                explosion.style.background = `radial-gradient(circle, #8B0000, #ffd700, #ff00ff, #00ffff)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 0.3;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.7;
                    opacity -= 0.06;
                    
                    explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    explosion.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animateExplosion);
                    } else {
                        gameContainer.removeChild(explosion);
                    }
                };
                
                requestAnimationFrame(animateExplosion);
            }, i * 50);
        }
    }

    createFormationExplosion(x, y) {
        // Create a spectacular formation effect
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '40px';
                explosion.style.height = '40px';
                explosion.style.background = `radial-gradient(circle, #ffd700, #ff6b35, #ff00ff)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 0.5;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.4;
                    opacity -= 0.08;
                    
                    explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    explosion.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animateExplosion);
                    } else {
                        gameContainer.removeChild(explosion);
                    }
                };
                
                requestAnimationFrame(animateExplosion);
            }, i * 100);
        }
    }

    createDestructionExplosion(x, y) {
        // Create a massive destruction effect
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '60px';
                explosion.style.height = '60px';
                explosion.style.background = `radial-gradient(circle, #ffffff, #ffd700, #ff6b35)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 1;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.5;
                    opacity -= 0.05;
                    
                    explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    explosion.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animateExplosion);
                    } else {
                        gameContainer.removeChild(explosion);
                    }
                };
                
                requestAnimationFrame(animateExplosion);
            }, i * 50);
        }
    }

    createSmallExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '30px';
        explosion.style.height = '30px';
        explosion.style.backgroundColor = '#ffd700';
        explosion.style.borderRadius = '50%';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '1000';
        
        const gameContainer = this.gameEnv.canvasContainer || document.body;
        gameContainer.appendChild(explosion);

        let scale = 1;
        let opacity = 1;
        const animateExplosion = () => {
            scale += 0.4;
            opacity -= 0.1;
            
            explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
            explosion.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateExplosion);
            } else {
                gameContainer.removeChild(explosion);
            }
        };
        
        requestAnimationFrame(animateExplosion);
    }

    checkPlayerCollision() {
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' ||
            (obj.isPlayer !== undefined && obj.isPlayer)
        );

        if (players.length === 0) return;

        for (const player of players) {
            const superCenterX = this.position.x + this.width / 2;
            const superCenterY = this.position.y + this.height / 2;
            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;

            const dx = playerCenterX - superCenterX;
            const dy = playerCenterY - superCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const HIT_DISTANCE = (this.width + player.width) / 3;

            if (distance <= HIT_DISTANCE) {
                this.handleCollisionWithPlayer();
                break;
            }
        }
    }

    handleCollisionWithPlayer() {
        this.revComplete = true;
        this.createDestructionExplosion(this.position.x + this.width/2, this.position.y + this.height/2);
        this.destroy();

        const player = this.gameEnv.gameObjects.find(obj => obj.constructor.name === 'Player');
        showDeathScreen(player);
    }

    draw() {
        if (!this.imageLoaded) {
            return;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotationAngle);
        
        const pulseScale = 1 + Math.sin(this.pulseTimer) * 0.2;
        this.ctx.scale(pulseScale, pulseScale);

        // Golden rainbow glow effect
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 30;

        // Add multiple glow layers for rainbow effect
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ffd700');
        gradient.addColorStop(0.6, '#ff6b35');
        gradient.addColorStop(1, '#ff00ff');
        
        this.ctx.shadowColor = '#ffd700';
        this.ctx.shadowBlur = 25;

        this.ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width / 2, -this.height / 2, this.width, this.height
        );

        this.ctx.restore();
        this.setupCanvas();
    }

    canBeIntercepted() {
        return false;
    }

    handleInterceptorCollision(interceptor) {
        return false;
    }

    destroy() {
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        if (super.destroy) {
            super.destroy();
        }
    }
}

export default SuperScythe;
