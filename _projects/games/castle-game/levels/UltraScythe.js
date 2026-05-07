import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';
import SuperScythe from './SuperScythe.js';

/**
 * UltraScythe class - result of fusing two special scythes
 * Extremely powerful, destroys all regular scythes on contact, lasts 30 seconds
 */
class UltraScythe extends Enemy {
    constructor(gameEnv, x, y) {
        const path = gameEnv.path;

        const ultraScytheData = {
            id: `ultra_scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 4, // Even bigger than special scythes
            ANIMATION_RATE: 10,
            pixels: { width: 64, height: 64 },
            INIT_POSITION: {
                x: x,
                y: y
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 } // Larger hitbox
        };

        super(ultraScytheData, gameEnv);

        // Initialize hittingNPC flag
        this._hittingNPC ??= false;

        // Mark as ultra scythe
        this.isUltra = true;
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
            x: (Math.random() - 0.5) * 6, // Slightly slower than special scythes
            y: Math.random() * 2 + 1
        };

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.15; // Faster spinning

        // Track if this ultra scythe has already fused
        this.hasFused = false;

        // Manual image loading
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";

        // Visual distinction - purple/white glow
        this.glowColor = '#ff00ff';

        // Enhanced pulsing effect
        this.pulseTimer = 0;
        this.pulseSpeed = 0.15;

        // Lifetime properties - 30 seconds as requested
        this.creationTime = Date.now();
        this.lifespan = 30000; // 30 seconds

        // Auto-destroy regular scythes on contact
        this.autoDestroyRadius = 300; // Pixels (increased from 150 for larger area)
    }

    update() {
        if (this.revComplete) return;

        // Check if ultra scythe has exceeded its lifespan (30 seconds)
        const currentTime = Date.now();
        if (currentTime - this.creationTime >= this.lifespan) {
            this.revComplete = true;
            this.destroy();
            return;
        }

        // Ultra scythes ignore NPC collisions
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

        // Auto-destroy nearby regular scythes
        this.autoDestroyNearbyScythes();

        // Check for collisions with other ultra scythes
        this.checkUltraScytheCollisions();

        // Check for collisions with player
        this.checkPlayerCollision();

        super.update();
    }

    autoDestroyNearbyScythes() {
        // Find all regular scythes
        const regularScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );

        // Find all special scythes
        const specialScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'SpecialScythe' && !obj.isUltra
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

        // Destroy special scythes on direct contact only
        specialScythes.forEach(specialScythe => {
            const dx = specialScythe.position.x - this.position.x;
            const dy = specialScythe.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use smaller hit distance for direct contact with special scythes
            const HIT_DISTANCE = (this.width + specialScythe.width) / 3;

            if (distance <= HIT_DISTANCE) {
                specialScythe.revComplete = true;
                specialScythe.destroy();
                this.createSmallExplosion(specialScythe.position.x + specialScythe.width/2, specialScythe.position.y + specialScythe.height/2);
            }
        });
    }

    checkUltraScytheCollisions() {
        // Don't check if this ultra scythe has already fused
        if (this.hasFused) return;

        // Find other ultra scythes
        const otherUltraScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'UltraScythe' && 
            obj !== this && 
            !obj.hasFused &&
            !obj.revComplete
        );

        for (const otherUltraScythe of otherUltraScythes) {
            const thisCenterX = this.position.x + this.width / 2;
            const thisCenterY = this.position.y + this.height / 2;
            const otherCenterX = otherUltraScythe.position.x + otherUltraScythe.width / 2;
            const otherCenterY = otherUltraScythe.position.y + otherUltraScythe.height / 2;

            const dx = otherCenterX - thisCenterX;
            const dy = otherCenterY - thisCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const HIT_DISTANCE = (this.width + otherUltraScythe.width) / 3;

            if (distance <= HIT_DISTANCE) {
                // Create a SuperScythe at the midpoint
                const midX = (this.position.x + otherUltraScythe.position.x) / 2;
                const midY = (this.position.y + otherUltraScythe.position.y) / 2;
                
                const superScythe = new SuperScythe(this.gameEnv, midX, midY);
                this.gameEnv.gameObjects.push(superScythe);

                // Mark both ultra scythes as fused and destroy them
                this.hasFused = true;
                otherUltraScythe.hasFused = true;
                this.revComplete = true;
                otherUltraScythe.revComplete = true;
                
                // Create fusion explosion effect
                this.createFusionExplosion(midX + superScythe.width/2, midY + superScythe.height/2);
                
                this.destroy();
                otherUltraScythe.destroy();
                break;
            }
        }
    }

    createFusionExplosion(x, y) {
        // Create a spectacular fusion effect
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '50px';
                explosion.style.height = '50px';
                explosion.style.background = `radial-gradient(circle, #ffd700, #ff00ff, #00ffff)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 0.5;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.5;
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
            }, i * 80);
        }
    }

    createSmallExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '20px';
        explosion.style.height = '20px';
        explosion.style.backgroundColor = '#ff00ff';
        explosion.style.borderRadius = '50%';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '1000';
        
        const gameContainer = this.gameEnv.canvasContainer || document.body;
        gameContainer.appendChild(explosion);

        let scale = 1;
        let opacity = 1;
        const animateExplosion = () => {
            scale += 0.3;
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
            const ultraCenterX = this.position.x + this.width / 2;
            const ultraCenterY = this.position.y + this.height / 2;
            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;

            const dx = playerCenterX - ultraCenterX;
            const dy = playerCenterY - ultraCenterY;
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
        
        const pulseScale = 1 + Math.sin(this.pulseTimer) * 0.15;
        this.ctx.scale(pulseScale, pulseScale);

        // Purple glow with white core
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 20;

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

export default UltraScythe;
