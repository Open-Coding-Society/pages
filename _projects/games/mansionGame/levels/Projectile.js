import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import showDeathScreen from './DeathScreen.js';
import { updatePlayerHealthBar } from './HealthBars.js';
import showEndScreen from './EndScreen.js';

/*
    Projectile class for the Reaper boss fireball & arrow attacks + player attack
    - Moves towards it's target
    - Damages target once reached, then self-destroys
    - Three sub attack types: FIREBALL, ARROW, and PLAYER
*/

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
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        this.speed = type === "PUMPKIN" ? 4 : 5; // adjust as needed
        this.velocity = {
            x: (dx / distance) * this.speed,
            y: (dy / distance) * this.speed
        };

        if (type === "PUMPKIN") {
            this.flightProgress = 0;
            this.flightDuration = Math.max(16, Math.floor(distance / this.speed));
            this.arcHeight = Math.min(220, distance * 0.35);
            this.spinAngle = 0;
        }

        this.revComplete = false;

        // Load sprite/image based on type
        if (type === "ARROW" || type === "PLAYER") {
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            this.width = 60; // scale down if needed
            this.height = 25;
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/projects/mansionGame/arrow.png";
        } else if (type === "PUMPKIN") {
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            this.width = 48;
            this.height = 48;
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/projects/mansionGame/pumpkin.png";
        } else if (type === "FIREBALL") {
            // Fireball is a single-frame static image (178x123 source). Use a scaled size preserving aspect ratio.
            this.spriteSheet = new Image();
            this.frameIndex = 0;
            this.frameCount = 1; // single frame
            // source aspect ~ 178 / 123 => width is larger; scale to a reasonable in-game size
            this.width = 64;
            this.height = 44; // keep aspect roughly (64 * 123 / 178 ≈ 44)
            this.spriteSheet.onload = () => this.imageLoaded = true;
            this.spriteSheet.src = path + "/images/projects/mansionGame/staticfireball.png";
        }
        this.isAnimated = false;

        // Start at source position
        this.position = { x: sourcex, y: sourcey };
    }

    update() {
        // Move projectile
        if (this.type === 'PUMPKIN') {
            this.flightProgress = Math.min(1, this.flightProgress + 1 / this.flightDuration);
            const t = this.flightProgress;
            const baseX = this.source_coords.x + (this.target_coords.x - this.source_coords.x) * t;
            const baseY = this.source_coords.y + (this.target_coords.y - this.source_coords.y) * t;
            const arcOffset = Math.sin(Math.PI * t) * this.arcHeight;
            this.position.x = baseX;
            this.position.y = baseY - arcOffset;

            if (t >= 1) {
                this.revComplete = true;
                this.destroy();
                return;
            }
        } else {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }

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
        // Rotate projectile to face travel direction (handles diagonal travel)
        // Compute angle of travel
        const travelAngle = Math.atan2(this.velocity.y, this.velocity.x); // radians

        // Base angle depends on how the sprite image faces by default
        // Arrow image faces left -> baseAngle = PI
        // Fireball image faces right -> baseAngle = 0
        const baseAngle = (this.type === 'ARROW' || this.type === 'PLAYER') ? Math.PI : 0;

        // Angle to rotate the sprite so it faces travel direction
        let drawAngle = travelAngle - baseAngle;

        if (this.type === 'PUMPKIN') {
            this.spinAngle = (this.spinAngle + 0.25) % (Math.PI * 2);
            drawAngle = this.spinAngle;
        }

        if (this.isAnimated && this.spriteSheet.complete) {
            const frameWidth = Math.floor(this.spriteSheet.width / this.frameCols);
            const frameHeight = Math.floor(this.spriteSheet.height / this.frameRows);
            const col = this.frameIndex % this.frameCols;
            const row = Math.floor(this.frameIndex / this.frameRows);

            // Use logical display dimensions for rotation to avoid clipping
            const dstW = Math.max(1, Math.floor(this.width));
            const dstH = Math.max(1, Math.floor(this.height));

            // Resize canvas to destination size
            this.canvas.width = dstW;
            this.canvas.height = dstH;

            // Draw rotated frame centered
            ctx.save();
            ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            ctx.rotate(drawAngle);
            ctx.drawImage(
                this.spriteSheet,
                col * frameWidth, row * frameHeight, frameWidth, frameHeight,
                -dstW / 2, -dstH / 2, dstW, dstH
            );
            ctx.restore();

            // Advance frame
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;

        } else if (this.spriteSheet.complete) {
            // Non-animated: draw the full image scaled to desired logical size
            const srcW = this.spriteSheet.naturalWidth || this.spriteSheet.width;
            const srcH = this.spriteSheet.naturalHeight || this.spriteSheet.height;
            const dstW = Math.max(1, Math.floor(this.width));
            const dstH = Math.max(1, Math.floor(this.height));

            // Resize canvas to destination size
            this.canvas.width = dstW;
            this.canvas.height = dstH;

            // Draw rotated image centered on canvas
            ctx.save();
            ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            ctx.rotate(drawAngle);
            ctx.drawImage(
                this.spriteSheet,
                0, 0, srcW, srcH,
                -dstW / 2, -dstH / 2, dstW, dstH
            );
            ctx.restore();
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

        // If the player is too close...
        const PLAYER_HIT_DISTANCE = 50;
        const REAPER_HORIZONTAL_HIT_DISTANCE = 75;
        const REAPER_VERTICAL_HIT_DISTANCE = 100;

        const ARROW_DAMAGE = 20;
        const PLAYER_DAMAGE = 120;  // Control how much damage per hit the player does
        const FIREBALL_DAMAGE = 20;
        const PUMPKIN_DAMAGE = 20;
        const PUMPKIN_SPLASH_DAMAGE = 20;
        const DAMAGE_DEALT = this.type == "FIREBALL" ? FIREBALL_DAMAGE : this.type == "ARROW" ? ARROW_DAMAGE : this.type == "PUMPKIN" ? PUMPKIN_DAMAGE : PLAYER_DAMAGE;

        const isPlayerProjectile = this.type === 'PLAYER' || this.type === 'PUMPKIN';

        if (isPlayerProjectile) {
            const enemies = this.gameEnv.gameObjects.filter(obj =>
                obj.constructor.name === 'Boss' || obj.constructor.name === 'Zombie'
            );
            if (enemies.length === 0) return null;

            const hitEnemy = enemies.find(enemy => {
                const dx = (enemy.position.x + enemy.width / 2) - this.position.x;
                const dy = (enemy.position.y + enemy.height / 2) - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const threshold = enemy.constructor.name === 'Boss' ? 95 : 45;
                return dist <= threshold;
            });

            if (!hitEnemy) return null;

            this.revComplete = true;
            this.destroy();

            if (this.type === 'PUMPKIN') {
                this.spawnPumpkinExplosion(this.position.x, this.position.y);
                const splashRadius = 220;
                enemies.forEach(enemy => {
                    const dx = (enemy.position.x + enemy.width / 2) - this.position.x;
                    const dy = (enemy.position.y + enemy.height / 2) - this.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= splashRadius) {
                        this.applyDamageToEnemy(enemy, PUMPKIN_SPLASH_DAMAGE);
                    }
                });
            } else {
                this.applyDamageToEnemy(hitEnemy, DAMAGE_DEALT);
            }

        } else {
            const players = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer');
            if (players.length === 0) return null;

            let nearest = players[0];
            let minDist = Infinity;

            // Find the closest player
            for (const player of players) {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = player;
                }
            }

            // Do distance formula calculation
            const xDiff = nearest.position.x - this.position.x;
            const yDiff = nearest.position.y - this.position.y;
            const distanceFromPlayer = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

            if (distanceFromPlayer <= PLAYER_HIT_DISTANCE) {
                this.revComplete = true;
                this.destroy();
                if (!nearest.data) nearest.data = { health: 100, maxHealth: 100 }; // Initialize health if not exists
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
                    const maxHealth = nearest.data.maxHealth || 100;
                    const pct = Math.max(0, Math.min(100, (nearest.data.health / maxHealth) * 100));
                    updatePlayerHealthBar(pct);
                }
            } catch (e) {
                console.warn('Failed to update player health bar:', e);
            }
        }
    }

    applyDamageToEnemy(enemy, amount) {
        if (enemy.constructor.name === 'Boss') {
            enemy.healthPoints -= amount;
            console.log("Reaper Health:", enemy.healthPoints);
            if (enemy.healthPoints <= 0) {
                console.log("Game over -- the player has won!");
                try { showEndScreen(this.gameEnv); } catch (e) { console.warn('Error showing victory screen:', e); }
            }
            return;
        }

        if (enemy.constructor.name === 'Zombie') {
            if (typeof enemy.takeDamage === 'function') {
                enemy.takeDamage(amount);
            } else if (typeof enemy.healthPoints === 'number') {
                enemy.healthPoints -= amount;
                if (enemy.healthPoints <= 0 && enemy.destroy) enemy.destroy();
            }
        }
    }

    spawnPumpkinExplosion(x, y) {
        if (!this.gameEnv || !this.gameEnv.container) return;

        const burst = document.createElement('div');
        Object.assign(burst.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255, 140, 0, 0.9)',
            boxShadow: '0 0 30px 15px rgba(255, 140, 0, 0.7), 0 0 60px 25px rgba(255, 80, 0, 0.5)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: '200'
        });

        this.gameEnv.container.appendChild(burst);
        burst.animate(
            [
                { transform: 'translate(-50%, -50%) scale(0.7)', opacity: 1 },
                { transform: 'translate(-50%, -50%) scale(2.2)', opacity: 0 }
            ],
            { duration: 420, easing: 'ease-out', fill: 'forwards' }
        );

        setTimeout(() => burst.remove(), 460);
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
        showDeathScreen(player);
    }

    // Carry over the method that is destroying the image once it's offscreen
    destroy() {
        super.destroy();
    }
}

export default Projectile;
