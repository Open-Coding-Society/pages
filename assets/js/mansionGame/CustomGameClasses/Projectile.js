import Character from '../GameEngine/Character.js';
import showDeathScreen from './DeathScreen.js';
import { updatePlayerHealthBar } from './HealthBars.js';

class Projectile extends Character {
    constructor(gameEnv = null, targetx, targety, sourcex, sourcey, type) {
        super({id: type}, gameEnv);

        this.source_coords = { x: sourcex, y: sourcey };
        this.target_coords = { x: targetx, y: targety };
        this.type = type;

        // Get the main path
        const path = gameEnv.path;

        // Calculate angle and velocity to move in a straight line
        const dx = targetx - sourcex;
        const dy = targety - sourcey;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.speed = 5; // adjust as needed
        this.velocity = {
            x: (dx / distance) * this.speed,
            y: (dy / distance) * this.speed
        };

        this.revComplete = false;

        // Load sprite/image based on type
        if (type === "ARROW") {
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            this.width = 60; // scale down if needed
            this.height = 25;
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/mansionGame/arrow.png";
            this.isAnimated = false;
        } else if (type === "FIREBALL") {
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 4; // 2x2 grid
            this.frameCols = 2;
            this.frameRows = 2;
            this.width = 64;
            this.height = 64;
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/mansionGame/staticfireball.png";
            this.frameIndex = 0;
            this.frameCount = 4; // 2x2 grid
            this.frameCols = 2;
            this.frameRows = 2;
            this.width = 64;
            this.height = 64;
            this.isAnimated = false;
        }

        // Start at source position
        this.position = { x: sourcex, y: sourcey };
    }

    update() {
        // Move projectile
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Check if offscreen
        if (
            this.position.x < 0 || this.position.x > this.gameEnv.innerWidth ||
            this.position.y < 0 || this.position.y > this.gameEnv.innerHeight
        ) {
            this.revComplete = true;
            this.destroy();
        }

        // Draw
        this.draw();

        // Check if we are close enouph to the player
        this.execDamage();
    }

    draw() {
        const ctx = this.ctx;
        this.clearCanvas();

        if (!this.imageLoaded) {
            return;  // Don't try to draw until image is loaded
        }

        if (this.isAnimated && this.spriteSheet.complete) {
            // Animate 2x2 sprite sheet
            const frameWidth = this.spriteSheet.width / this.frameCols;
            const frameHeight = this.spriteSheet.height / this.frameRows;
            const col = this.frameIndex % this.frameCols;
            const row = Math.floor(this.frameIndex / this.frameCols);

            ctx.drawImage(
                this.spriteSheet,
                col * frameWidth, row * frameHeight, frameWidth, frameHeight,
                0, 0, this.width, this.height
            );

            // Advance frame
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;

        } else if (this.spriteSheet.complete) {
            // Draw arrow or any single-image projectile
            /*
            ctx.drawImage(
                this.spriteSheet,
                0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
                0, 0, this.width, this.height
            );
            */
           ctx.drawImage(this.spriteSheet, 0, 0, this.width, this.height);
        }

        // Draw to screen
        this.setupCanvas();
    }

    // Deal damage to the player
    execDamage() {
        // Do not apply damage while the battleroom intro/fade is running.
        // The level code sets `window.__battleRoomFadeComplete = true` when
        // the intro finishes. Guarding here ensures projectiles can't harm
        // the player during the loading/intro sequence.
        if (typeof window !== 'undefined' && window.__battleRoomFadeComplete === false) {
            return;
        }

        const players = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Player');
        if (players.length === 0) return null;

        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        // Do distance formula calculation and return
        const xDiff = nearest.position.x - this.position.x;
        const yDiff = nearest.position.y - this.position.y;
        const distanceFromPlayer = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

        // If the player is too close...
        const PLAYER_HIT_DISTANCE = 50;
        const ARROW_DAMAGE = 10;
        const FIREBALL_DAMAGE = 15;
        const DAMAGE_DEALT = this.type == "FIREBALL" ? FIREBALL_DAMAGE : ARROW_DAMAGE;
        if (distanceFromPlayer <= PLAYER_HIT_DISTANCE) {
            this.revComplete = true;
            this.destroy();
            if (!nearest.data) nearest.data = { health: 100 }; // Initialize health if not exists
            nearest.data.health -= DAMAGE_DEALT;
            console.log("Player Health:", nearest.data.health);
            if (nearest.data.health <= 0) {
                console.log("Game over -- the player has been defeated!");
                // Show death screen
                showDeathScreen(nearest);
            }
        }

        // Update the player health bar to accurately show the new health (if available)
        try {
            if (nearest && nearest.data && typeof updatePlayerHealthBar === 'function') {
                const pct = Math.max(0, Math.min(100, nearest.data.health || 0));
                updatePlayerHealthBar(pct);
            }
        } catch (e) {
            console.warn('Failed to update player health bar:', e);
        }
    }

    // Function to execute death
    die() {
        // Find all player objects
        const players = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Player'
        );
        
        if (players.length === 0) return;
        
        // Find nearest player
        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        let player = nearest;
        
        // 1. Play death animation - particle effect
        const playerX = player.position.x;
        const playerY = player.position.y;
        
        // Create explosion effect
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.backgroundColor = 'red';
            particle.style.left = `${playerX + player.width/2}px`;
            particle.style.top = `${playerY + player.height/2}px`;
            particle.style.zIndex = '9999';
            document.body.appendChild(particle);
            
            // Animate particles outward
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const distance = Math.random() * 100 + 50;
            
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;
            
            particle.animate(
                [
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
                ],
                {
                    duration: 1000,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
             
        // 2. Show death message dialog
        const deathMessage = document.createElement('div');
        deathMessage.style.position = 'fixed';
        deathMessage.style.top = '50%';
        deathMessage.style.left = '50%';
        deathMessage.style.transform = 'translate(-50%, -50%)';
        deathMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        deathMessage.style.color = '#FF0000';
        deathMessage.style.padding = '30px';
        deathMessage.style.borderRadius = '10px';
        deathMessage.style.fontFamily = "'Press Start 2P', sans-serif";
        deathMessage.style.fontSize = '24px';
        deathMessage.style.textAlign = 'center';
        deathMessage.style.zIndex = '10000';
        deathMessage.style.border = '3px solid #FF0000';
        deathMessage.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        deathMessage.style.width = '400px';
        deathMessage.innerHTML = `
            <div style="margin-bottom: 20px;">YOU DIED</div>
            <div style="font-size: 16px; margin-bottom: 20px;">The Reaper has taken another victim</div>
            <div style="font-size: 14px;">Respawning in 5 seconds...</div>
        `;
        
        document.body.appendChild(deathMessage);
        
        // Remove message after delay
        setTimeout(() => {
            if (deathMessage.parentNode) {
                deathMessage.parentNode.removeChild(deathMessage);
            }
        }, 5000);
        
        // 3. Reset the level after a short delay using page reload for reliability
        setTimeout(() => {
            // Clean up any lingering resources before reload
            if (self && self.timerInterval) {
                clearInterval(self.timerInterval);
            }
            
            // Force a complete page reload - most reliable way to reset
            location.reload();
        }, 5000); // 2 second delay before reset
    }

    // Carry over the method that is destroying the image once it's offscreen
    destroy() {
        super.destroy();
    }
}

export default Projectile;
