import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';

/**
 * BossScythe class - the ultimate scythe boss
 * Even larger and more powerful than SuperScythe
 * Extremely dangerous with enhanced abilities
 */
class BossScythe extends Enemy {
    constructor(gameEnv, x, y) {
        const path = gameEnv.path;

        const bossScytheData = {
            id: `boss_scythe_${Math.random().toString(36).substr(2, 9)}`,
            src: path + "/images/mansionGame/scythe.png",
            SCALE_FACTOR: 1, // Largest scythe size (smaller number = bigger)
            ANIMATION_RATE: 10,
            pixels: { width: 64, height: 64 },
            INIT_POSITION: {
                x: x,
                y: y
            },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.6, heightPercentage: 0.6 } // Massive hitbox
        };

        super(bossScytheData, gameEnv);

        // Initialize hittingNPC flag
        this._hittingNPC ??= false;

        // Mark as boss scythe
        this.isBoss = true;
        this.isSuper = true; // Also counts as super for compatibility
        this.isUltra = true; // Also counts as ultra for compatibility
        this.isSpecial = true; // Also counts as special for compatibility

        // Disable dialogue system
        if (this.dialogueSystem) {
            this.dialogueSystem = null;
        }
        
        if (this.removeInteractKeyListeners) {
            this.removeInteractKeyListeners();
        }

        // Ultimate motion properties
        this.velocity = {
            x: (Math.random() - 0.5) * 10, // Fastest movement
            y: Math.random() * 4 + 3
        };

        // State tracking
        this.revComplete = false;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.35; // Fastest spinning

        // Manual image loading
        this.spriteSheet = new Image();
        this.imageLoaded = false;
        this.spriteSheet.onload = () => {
            this.imageLoaded = true;
        };
        this.spriteSheet.src = path + "/images/mansionGame/scythe.png";

        // Visual distinction - diamond blue glow
        this.glowColor = '#00BFFF';

        // Enhanced pulsing effect
        this.pulseTimer = 0;
        this.pulseSpeed = 0.25;

        // Lifetime properties - 45 seconds (longer than SuperScythe)
        this.creationTime = Date.now();
        this.lifespan = 45000; // 45 seconds

        // Auto-destroy radius - massive area
        this.autoDestroyRadius = 700; // Pixels

        // Create boss entrance effect
        this.createBossEntrance(x + this.width/2, y + this.height/2);
    }

    update() {
        if (this.revComplete) return;

        // Check if boss scythe has exceeded its lifespan (45 seconds)
        const currentTime = Date.now();
        if (currentTime - this.creationTime >= this.lifespan) {
            this.revComplete = true;
            this.createBossDestructionExplosion(this.position.x + this.width/2, this.position.y + this.height/2);
            this.destroy();
            return;
        }

        // Boss scythes ignore NPC collisions
        this._hittingNPC = false;

        // Update positioning
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce off screen edges with increased speed
        if (this.position.x <= 0 || this.position.x >= this.gameEnv.innerWidth - this.width) {
            this.velocity.x = -this.velocity.x * 1.1; // Speed up on bounce
            this.position.x = Math.max(0, Math.min(this.gameEnv.innerWidth - this.width, this.position.x));
        }

        if (this.position.y <= 0 || this.position.y >= this.gameEnv.innerHeight - this.height) {
            this.velocity.y = -this.velocity.y * 1.1; // Speed up on bounce
            this.position.y = Math.max(0, Math.min(this.gameEnv.innerHeight - this.height, this.position.y));
        }

        // Cap maximum speed
        this.velocity.x = Math.max(-15, Math.min(15, this.velocity.x));
        this.velocity.y = Math.max(-8, Math.min(8, this.velocity.y));

        // Update rotation
        this.rotationAngle += this.rotationSpeed;

        // Update pulsing
        this.pulseTimer += this.pulseSpeed;

        // Auto-destroy nearby scythes
        this.autoDestroyNearbyScythes();

        // Destroy nearby interceptors
        this.destroyNearbyInterceptors();

        // Check for collisions with player
        this.checkPlayerCollision();

        super.update();
    }

    destroyNearbyInterceptors() {
        // Find all interceptors
        const interceptors = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Interceptor'
        );

        // Destroy interceptors within range
        interceptors.forEach(interceptor => {
            const dx = interceptor.position.x - this.position.x;
            const dy = interceptor.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 400) { // 400 pixel range for interceptor destruction
                interceptor.revComplete = true;
                interceptor.destroy();
                this.createInterceptorDestroyEffect(interceptor.position.x + interceptor.width/2, interceptor.position.y + interceptor.height/2);
            }
        });
    }

    autoDestroyNearbyScythes() {
        // Find and destroy all regular scythes
        const regularScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Scythe' && !obj.isSpecial && !obj.isMini
        );

        // Find and destroy all special scythes
        const specialScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'SpecialScythe' && !obj.isUltra && !obj.isMini
        );

        // Find and destroy all ultra scythes
        const ultraScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'UltraScythe' && !obj.isSuper && !obj.isMini
        );

        // Find and destroy all super scythes
        const superScythes = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'SuperScythe' && !obj.isBoss && !obj.isMini
        );

        // Destroy all scythes within massive radius
        [...regularScythes, ...specialScythes, ...ultraScythes, ...superScythes].forEach(scythe => {
            const dx = scythe.position.x - this.position.x;
            const dy = scythe.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.autoDestroyRadius) {
                scythe.revComplete = true;
                scythe.destroy();
                this.createBossExplosion(scythe.position.x + scythe.width/2, scythe.position.y + scythe.height/2);
            }
        });
    }

    createBossEntrance(x, y) {
        // Create a massive boss entrance effect
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '80px';
                explosion.style.height = '80px';
                explosion.style.background = `radial-gradient(circle, #8B0000, #FF0000, #FFD700)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 0.3;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.6;
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
            }, i * 60);
        }
    }

    createBossDestructionExplosion(x, y) {
        // Create a massive boss destruction effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = x + 'px';
                explosion.style.top = y + 'px';
                explosion.style.width = '100px';
                explosion.style.height = '100px';
                explosion.style.background = `radial-gradient(circle, #FFFFFF, #8B0000, #FF0000)`;
                explosion.style.borderRadius = '50%';
                explosion.style.transform = 'translate(-50%, -50%)';
                explosion.style.pointerEvents = 'none';
                explosion.style.zIndex = '1000';
                
                const gameContainer = this.gameEnv.canvasContainer || document.body;
                gameContainer.appendChild(explosion);

                let scale = 1;
                let opacity = 1;
                const animateExplosion = () => {
                    scale += 0.7;
                    opacity -= 0.04;
                    
                    explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    explosion.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animateExplosion);
                    } else {
                        gameContainer.removeChild(explosion);
                    }
                };
                
                requestAnimationFrame(animateExplosion);
            }, i * 40);
        }
    }

    createInterceptorDestroyEffect(x, y) {
        // Create diamond blue effect for interceptor destruction
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '25px';
        explosion.style.height = '25px';
        explosion.style.background = `radial-gradient(circle, #00BFFF, #FFFFFF)`;
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

    createBossExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        explosion.style.width = '40px';
        explosion.style.height = '40px';
        explosion.style.backgroundColor = '#8B0000';
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
            const bossCenterX = this.position.x + this.width / 2;
            const bossCenterY = this.position.y + this.height / 2;
            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;

            const dx = playerCenterX - bossCenterX;
            const dy = playerCenterY - bossCenterY;
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
        this.createBossDestructionExplosion(this.position.x + this.width/2, this.position.y + this.height/2);
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
        
        const pulseScale = 1 + Math.sin(this.pulseTimer) * 0.25;
        this.ctx.scale(pulseScale, pulseScale);

        // Diamond blue glow with multiple layers
        this.ctx.shadowColor = this.glowColor;
        this.ctx.shadowBlur = 40;

        // Add multiple glow layers for diamond boss effect
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.2, '#00BFFF');
        gradient.addColorStop(0.5, '#1E90FF');
        gradient.addColorStop(0.8, '#4169E1');
        gradient.addColorStop(1, '#000080');
        
        this.ctx.shadowColor = '#00BFFF';
        this.ctx.shadowBlur = 35;

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

export default BossScythe;
