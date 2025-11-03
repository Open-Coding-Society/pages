import Character from '../GameEngine/Character.js';
import showDeathScreen from './DeathScreen.js';
import { updatePlayerHealthBar } from "./HealthBars.js";

class Boomerang extends Character {
    constructor(gameEnv = null, sourcex, sourcey, targetx, targety) {
        // Use minimal placeholder data; sprite will override it
        super({ id: 'scythe' }, gameEnv);

        this.source_coords = { x: sourcex, y: sourcey };
        this.target_coords = { x: targetx, y: targety };

        // Ellipse calculations
        this.ellipse_center = {
            x: (sourcex + targetx) / 2,
            y: (sourcey + targety) / 2
        };

        this.ellipse_width = Math.sqrt((targetx - sourcex) ** 2 + (targety - sourcey) ** 2);
        this.ellipse_height = this.ellipse_width / 4; // tweakable
        this.ellipse_tilt = Math.atan2(targety - sourcey, targetx - sourcex);

        this.radian_prog = 0;
        this.radian_limit = 2 * Math.PI;
        this.projectileSpeed = 0.025;  // radians per update

        this.revComplete = false;

        // Load scythe image
        this.spriteSheet = new Image();
        this.spriteSheet.onload = () => this.imageLoaded = true;
        this.spriteSheet.src = (gameEnv?.path || "") + "/images/mansionGame/scythe.png";

        // Logical display size (scale down 300x280 px to reasonable in-game size)
        this.width = 64;  // adjust to fit game world
        this.height = Math.floor(64 * 280 / 300); // preserve aspect ratio
        this.isAnimated = false;

        this.position = { x: sourcex, y: sourcey };
    }

    update() {
        if (this.revComplete) return;

        // Check for colision
        /*
        const BOOMERANG_KILL_DISTANCE = 40;
        const SCYTHE_DAMAGE = 20;
        const players = this.gameEnv.gameObjects.filter(obj =>  // Find all player objects
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return;  // If there are no players, then the boomerang has no purpose
        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= BOOMERANG_KILL_DISTANCE) {
                this.revComplete = true;
                this.destroy();
                // player.data.health -= SCYTHE_DAMAGE;
                // const pct = Math.max(0, Math.min(100, player.data.health || 0));
                // console.log(`Player ${player.id} hit by boomerang! Health now at ${pct}.`);
                // updatePlayerHealthBar(pct);
                break;
            }
        }
        */

        if (this.radian_prog >= this.radian_limit) {
            // The Boomerang has done it's job, it can now be destroyed
            this.revComplete = true;
            this.destroy();
        } else {
            // Update boomerang position
            this.radian_prog += this.projectileSpeed;

            const cosProg = Math.cos(this.radian_prog);
            const sinProg = Math.sin(this.radian_prog);
            const cosTilt = Math.cos(this.ellipse_tilt);
            const sinTilt = Math.sin(this.ellipse_tilt);

            const x_coord = this.ellipse_center.x + 
                            (this.ellipse_width / 2) * cosProg * cosTilt - 
                            this.ellipse_height * sinProg * sinTilt;

            const y_coord = this.ellipse_center.y + 
                            (this.ellipse_width / 2) * cosProg * sinTilt + 
                            this.ellipse_height * sinProg * cosTilt;

            this.position.x = x_coord;
            this.position.y = y_coord;
        }

        this.draw();

        // Check if we are close enouph to the player
        this.execDamage();
    }

    draw() {
        if (!this.imageLoaded) return;

        const ctx = this.ctx;
        this.clearCanvas();

        const dstW = Math.max(1, Math.floor(this.width));
        const dstH = Math.max(1, Math.floor(this.height));

        this.canvas.width = dstW;
        this.canvas.height = dstH;

        ctx.save();
        ctx.translate(dstW / 2, dstH / 2);

        // Optional: rotate based on progress for a spinning effect
        const rotationAngle = this.radian_prog * 2; // tweak multiplier for visual spin
        ctx.rotate(rotationAngle);

        ctx.drawImage(
            this.spriteSheet,
            0, 0, this.spriteSheet.naturalWidth, this.spriteSheet.naturalHeight,
            -dstW / 2, -dstH / 2, dstW, dstH
        );
        ctx.restore();

        this.setupCanvas();
    }

    destroy() {
        super.destroy();
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

        // Find all enemies
        const enemies = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'Boss' || obj.constructor.name === 'Enemy'
        );
        let ATTACK_MODIFIER;
        if (enemies.length === 0) {
            ATTACK_MODIFIER = 1;
        } else {
            const enemy = enemies[0];
            if (enemy.stage >= 3) {
                ATTACK_MODIFIER = 1.2;
            } else {
                ATTACK_MODIFIER = 1;
            }
        }

        // If the player is too close...
        const HIT_DISTANCE = 50;
        const SCYTHE_DAMAGE = Math.round(15 * ATTACK_MODIFIER);
        
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

        if (distanceFromPlayer <= HIT_DISTANCE) {
            this.revComplete = true;
            this.destroy();
            if (!nearest.data) nearest.data = { health: 100 }; // Initialize health if not exists
            nearest.data.health -= SCYTHE_DAMAGE;
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
}
export default Boomerang;
