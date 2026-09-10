import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import showEndScreen from './ArcheryEndScreen.js';

/*
 * Projectile code reused from the Mansion Game boss fight from CSSE Tri 1.
 * This class represents the arrows that the player shoots.
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
        this.speed = 10; // adjust as needed
        this.velocity = {
            x: 0,
            y: -this.speed  // Always move upwards
        };

        this.revComplete = false;
        this.stuck = false;
        this.stuckTarget = null;
        this.offset = {x: 0, y: 0};

        this.spriteSheet = new Image();
        this.frameIndex = 0;
        this.frameCount = 1; // single frame
        this.width = 60; // scale down if needed
        this.height = 70;  // Made even taller to fix vertical squashing
        this.spriteSheet.onload = () => this.imageLoaded = true;
        this.spriteSheet.src = path + "/images/sorcerers/arrow.png";

        // Start at source position
        this.position = { x: sourcex, y: sourcey };
    }

    update() {
        // Move projectile
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // If stuck to target, update position to follow target
        if (this.stuck && this.stuckTarget) {
            this.position.x = this.stuckTarget.position.x + this.offset.x;
            this.position.y = this.stuckTarget.position.y + this.offset.y;
        }

        // Check if offscreen (only if not stuck)
        if (!this.stuck && (
            this.position.x < 0 || this.position.x > this.gameEnv.innerWidth ||
            this.position.y < 0 || this.position.y > this.gameEnv.innerHeight
        )) {
            this.revComplete = true;
            this.destroy();
        }

        // Draw (this sets canvas dimensions)
        this.draw();

        // Update canvas position after drawing
        this.setupCanvas();

        // Check if we are close enough to the target to damage it
        this.execDamage();
    }

    draw() {
        const ctx = this.ctx;
        this.clearCanvas();

        if (!this.imageLoaded) {
            return;
        }

        const travelAngle = Math.atan2(this.velocity.y, this.velocity.x); // radians

        const baseAngle = (this.type === 'ARROW' || this.type === 'PLAYER') ? Math.PI : 0;

        let drawAngle = travelAngle - baseAngle;

        if (this.stuck) {
            drawAngle = Math.PI / 2;
        }

        const srcW = this.spriteSheet.naturalWidth || this.spriteSheet.width;
        const srcH = this.spriteSheet.naturalHeight || this.spriteSheet.height;
        const dstW = Math.max(1, Math.floor(this.width));
        const dstH = Math.max(1, Math.floor(this.height));

        const maxDim = Math.ceil(Math.sqrt(dstW * dstW + dstH * dstH)) + 10;
        this.canvas.width = maxDim;
        this.canvas.height = maxDim;

        // draw
        ctx.save();
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.rotate(drawAngle);
        ctx.drawImage(
            this.spriteSheet,
            0, 0, srcW, srcH,
            -dstW / 2, -dstH / 2, dstW, dstH
        );
        ctx.restore();
    
        // Draw to screen
        this.setupCanvas();
    }

    // Deal damage to the target
    execDamage() {
            
        const targets = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Enemy');
        if (targets.length === 0) return null;
        let nearestTarget = targets[0];
        let minDist = Infinity;

        // Find the closest target (this is taken from the mansion game but if i decide to add more targets later this makes it easier)
        for (const target of targets) {
            const dx = target.position.x - this.position.x;
            const dy = target.position.y - this.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                nearestTarget = target;
            }
        }
        const TARGET_SIZE = 160; // 160x100

        const xDiff = Math.abs((nearestTarget.position.x + TARGET_SIZE / 2) - this.position.x);
        const yDiff = Math.abs((nearestTarget.position.y) - this.position.y);


        if (!this.stuck && xDiff <= TARGET_SIZE/2.0 && yDiff <= TARGET_SIZE/2.0) {
            this.stuck = true;
            this.stuckTarget = nearestTarget;
            this.offset.x = this.position.x - nearestTarget.position.x;
            this.offset.y = this.position.y - nearestTarget.position.y;
            this.velocity = {x: 0, y: 0}; // stop moving
            nearestTarget.hitsRemaining -= 1;
            console.log(`Target hit, now has ${nearestTarget.hitsRemaining} health`);

            if (nearestTarget.hitsRemaining <= 0){
                try { showEndScreen(this.gameEnv); } catch (e) { console.warn('Error showing victory screen:', e); }
                
            }

        }
        
    }

    // Removes the projectile
    die() {
        this.destroy();
    }

    // Carry over the method that is destroying the image once it's offscreen
    destroy() {
        super.destroy();
    }
}

export default Projectile;
