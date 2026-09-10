import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

/**
 * Interceptor class that fires upward to destroy scythes
 * Based on the Projectile class pattern but designed for defensive gameplay
 */
class Interceptor extends Character {
    constructor(gameEnv, spawnX, spawnY) {
        super({ id: 'interceptor' }, gameEnv);
        
        this.source_coords = { x: spawnX, y: spawnY };
        this.type = 'INTERCEPTOR';
        
        // Find nearest scythe and set target coordinates
        this.target_coords = this.findNearestScythe();
        
        // Get the main path
        const path = gameEnv.path;
        
        // Movement properties - moves toward target
        this.speed = 10; // Faster than regular projectiles for interception
        this.turnRate = 0.05; // How quickly interceptor can change direction (smaller = slower)
        
        // Calculate velocity vector toward target
        if (this.target_coords) {
            const dx = this.target_coords.x - spawnX;
            const dy = this.target_coords.y - spawnY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.velocity = {
                    x: (dx / distance) * this.speed,
                    y: (dy / distance) * this.speed
                };
            } else {
                // Fallback to upward movement if no valid target
                this.velocity = { x: 0, y: -this.speed };
            }
        } else {
            // Fallback to upward movement if no scythes found
            this.velocity = { x: 0, y: -this.speed };
        }
        
        this.revComplete = false;
        this.hasIntercepted = false;
        
        // Visual properties
        this.spriteSheet = new Image();
        this.frameIndex = 0;
        this.frameCount = 1;
        this.width = 40; // Smaller than arrow
        this.height = 50;
        this.spriteSheet.onload = () => this.imageLoaded = true;
        this.spriteSheet.src = path + "/images/castleGame/arrow.png"; // Use arrow sprite as base
        
        // Start at source position
        this.position = { x: spawnX, y: spawnY };
        
        // Add glow effect for visual distinction
        this.glowColor = '#00ffff'; // Cyan glow for interceptor
        
        // Trail effect properties
        this.trailEnabled = false; // Toggle to enable/disable trail effect
        this.trailTimer = 0;
        this.trailInterval = 2; // Create trail every 2 frames
        this.trails = []; // Array to store trail elements
    }
    
    /**
     * Finds the nearest scythe at the time of interceptor creation
     * @returns {Object|null} - Coordinates of nearest scythe or null if none found
     */
    findNearestScythe() {
        // Find all scythe objects, but exclude special scythes
        const scythes = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );
        
        if (scythes.length === 0) {
            return null;
        }
        
        let nearestScythe = null;
        let minDistance = Infinity;
        
        for (const scythe of scythes) {
            // Calculate distance from spawn position to scythe
            const dx = scythe.position.x + scythe.width / 2 - this.source_coords.x;
            const dy = scythe.position.y + scythe.height / 2 - this.source_coords.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestScythe = scythe;
            }
        }

        if (nearestScythe) {
            return {
                x: nearestScythe.position.x + nearestScythe.width / 2,
                y: nearestScythe.position.y + nearestScythe.height / 2
            };
        }

        return null;
    }

    update() {
        if (this.revComplete) return;

        // Move interceptor in straight line toward target
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Create trail effect (only if enabled)
        if (this.trailEnabled) {
            this.trailTimer++;
            if (this.trailTimer >= this.trailInterval) {
                this.createTrailParticle();
                this.trailTimer = 0;
            }
        }
        
        // Check if offscreen (in any direction)
        if (this.position.x < -this.width || 
            this.position.x > this.gameEnv.innerWidth ||
            this.position.y < -this.height || 
            this.position.y > this.gameEnv.innerHeight) {
            this.revComplete = true;
            this.destroy();
            return;
        }
        
        // Check for scythe interceptions and update velocity
        this.checkScytheInterceptionAndUpdateVelocity();

        // Draw and setup canvas
        this.draw();
        this.setupCanvas();
    }

    checkScytheInterceptionAndUpdateVelocity() {
        if (this.hasIntercepted) return;
        
        // Find all scythe objects, but exclude special scythes
        const scythes = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );
        
        if (scythes.length === 0) return;
        
        // Find nearest scythe
        let nearestScythe = null;
        let minDistance = Infinity;
        
        for (const scythe of scythes) {
            // Calculate distance from interceptor to scythe
            const interceptorCenterX = this.position.x + this.width / 2;
            const interceptorCenterY = this.position.y + this.height / 2;
            const scytheCenterX = scythe.position.x + scythe.width / 2;
            const scytheCenterY = scythe.position.y + scythe.height / 2;
            
            const dx = scytheCenterX - interceptorCenterX;
            const dy = scytheCenterY - interceptorCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestScythe = scythe;
            }
        }
        
        if (nearestScythe) {
            // Update velocity to track the nearest scythe with gradual turning
            const interceptorCenterX = this.position.x + this.width / 2;
            const interceptorCenterY = this.position.y + this.height / 2;
            const scytheCenterX = nearestScythe.position.x + nearestScythe.width / 2;
            const scytheCenterY = nearestScythe.position.y + nearestScythe.height / 2;
            
            const dx = scytheCenterX - interceptorCenterX;
            const dy = scytheCenterY - interceptorCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Calculate desired velocity toward target
                const desiredVelX = (dx / distance) * this.speed;
                const desiredVelY = (dy / distance) * this.speed;
                
                // Gradually turn toward target (slower direction change)
                this.velocity.x += (desiredVelX - this.velocity.x) * this.turnRate;
                this.velocity.y += (desiredVelY - this.velocity.y) * this.turnRate;
            }
            
            // Check for interception
            const INTERCEPTION_DISTANCE = (this.width + nearestScythe.width) / 2.5;
            if (distance <= INTERCEPTION_DISTANCE) {
                this.handleInterception(nearestScythe);
            }
        }
    }

    checkScytheInterception() {
        if (this.hasIntercepted) return;

        // Find all scythe objects, but exclude special scythes
        const scythes = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Scythe' && !obj.isSpecial
        );

        if (scythes.length === 0) return;

        for (const scythe of scythes) {
            // Calculate distance between interceptor and scythe
            const interceptorCenterX = this.position.x + this.width / 2;
            const interceptorCenterY = this.position.y + this.height / 2;
            const scytheCenterX = scythe.position.x + scythe.width / 2;
            const scytheCenterY = scythe.position.y + scythe.height / 2;

            const dx = scytheCenterX - interceptorCenterX;
            const dy = scytheCenterY - interceptorCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Interception distance threshold
            const INTERCEPTION_DISTANCE = (this.width + scythe.width) / 2.5;

            if (distance <= INTERCEPTION_DISTANCE) {
                this.handleInterception(scythe);
                break;
            }
        }
    }
    
    handleInterception(scythe) {
        this.hasIntercepted = true;
        this.revComplete = true;
        
        // Add 75% interception accuracy (25% chance to miss)
        const accuracy = 0.75; // 75% accuracy
        const willHit = Math.random() < accuracy;
        
        if (willHit) {
            // Successful interception - destroy the scythe
            this.createInterceptionEffect();
            scythe.destroy();
            
            // Notify the game level about successful interception for scoring
            if (typeof window !== 'undefined' && window.currentGameLevel && window.currentGameLevel.onScytheDestroyed) {
                window.currentGameLevel.onScytheDestroyed();
            } else if (this.gameEnv && this.gameEnv.gameControl) {
                // Fallback: Try multiple paths to find the level
                const level = this.gameEnv.gameControl.currentLevel || 
                           this.gameEnv.currentLevel || 
                           this.gameEnv.gameControl.game?.currentLevel;
                
                if (level && level.onScytheDestroyed) {
                    level.onScytheDestroyed();
                } else {
                    console.warn('Could not find level with onScytheDestroyed method');
                }
            }
        } else {
            // Failed interception - just create a miss effect, don't destroy scythe
            this.createMissEffect();
        }
        
        // Destroy this interceptor regardless of hit/miss
        this.destroy();
    }

    createInterceptionEffect() {
        // Create a simple visual effect at the interception point
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${this.position.x + this.width / 2}px;
            top: ${this.position.y + this.height / 2}px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, #00ffff, #0088ff, transparent);
            pointer-events: none;
            z-index: 1000;
            animation: interceptorExplosion 0.5s ease-out forwards;
        `;

        // Add CSS animation if not already present
        if (!document.getElementById('interceptor-styles')) {
            const style = document.createElement('style');
            style.id = 'interceptor-styles';
            style.textContent = `
                @keyframes interceptorExplosion {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const gameContainer = this.gameEnv.canvasContainer || this.gameEnv.container || document.body;
        gameContainer.appendChild(effect);

        // Remove effect after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }

    createMissEffect() {
        // Create a miss effect (different color/animation from successful hit)
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${this.position.x + this.width / 2}px;
            top: ${this.position.y + this.height / 2}px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: radial-gradient(circle, #ff6666, #ff0000, transparent);
            pointer-events: none;
            z-index: 1000;
            animation: interceptorMiss 0.3s ease-out forwards;
        `;

        // Add CSS animation for miss effect if not already present
        if (!document.getElementById('interceptor-miss-styles')) {
            const style = document.createElement('style');
            style.id = 'interceptor-miss-styles';
            style.textContent = `
                @keyframes interceptorMiss {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const gameContainer = this.gameEnv.canvasContainer || this.gameEnv.container || document.body;
        gameContainer.appendChild(effect);

        // Remove effect after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 300);
    }
    
    createTrailParticle() {
        // Create trail particle at interceptor's current position
        const trail = document.createElement('div');
        const particleX = this.position.x + this.width / 2;
        const particleY = this.position.y + this.height / 2;
        
        trail.style.cssText = `
            position: absolute;
            left: ${particleX}px;
            top: ${particleY}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.8), rgba(0, 136, 255, 0.4), transparent);
            pointer-events: none;
            z-index: 999;
            animation: trailFade 0.8s ease-out forwards;
        `;
        
        // Add CSS animation for trail fade if not already present
        if (!document.getElementById('interceptor-trail-styles')) {
            const style = document.createElement('style');
            style.id = 'interceptor-trail-styles';
            style.textContent = `
                @keyframes trailFade {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        const gameContainer = this.gameEnv.canvasContainer || this.gameEnv.container || document.body;
        gameContainer.appendChild(trail);
        this.trails.push(trail);
        
        // Remove trail particle after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            const index = this.trails.indexOf(trail);
            if (index > -1) {
                this.trails.splice(index, 1);
            }
        }, 800);
    }

    draw() {
        const ctx = this.ctx;
        this.clearCanvas();

        if (!this.imageLoaded) {
            return;
        }

        // Set canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Calculate rotation angle based on movement direction
        const travelAngle = Math.atan2(this.velocity.y, this.velocity.x);
        const drawAngle = travelAngle + Math.PI; // Adjust for sprite orientation

        // Draw interceptor with glow effect
        ctx.save();

        // Translate to center and rotate
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.rotate(drawAngle);
        
        // Add glow shadow
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 10;
        
        // Draw the sprite
        ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -this.width / 2, -this.height / 2, this.width, this.height
        );
        
        ctx.restore();
    }

    destroy() {
        // Clean up all trail particles
        this.trails.forEach(trail => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        });
        this.trails = [];
        
        // Remove from gameObjects array
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }

        // Remove canvas from container
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // Call parent destroy if it exists
        if (super.destroy) {
            super.destroy();
        }
    }
}

export default Interceptor;
