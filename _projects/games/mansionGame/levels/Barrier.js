import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';

//cool comment
class Barrier extends GameObject {
    constructor(data, gameEnv) {
        super(gameEnv);
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.color = data.color || 'rgba(255, 0, 0, 0.3)';
        this.visible = data.visible !== undefined ? data.visible : false; // Back to invisible
        this.collisionThickness = 10; // How much to push player back
    }

    update() {
        this.draw();
    }

    draw() {
        if (!this.visible) return;
        if (!this.gameEnv || !this.gameEnv.ctx) return;
        const ctx = this.gameEnv.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'rgba(225, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    resize() {
        // Barriers are positioned relative to canvas size
        // Resizing handled by level reconstruction
    }

    destroy() {
        // No cleanup needed for barriers
    }

    checkCollision(player) {
        // Safety checks
        if (!player || !player.position || !player.width || !player.height) {
            return false;
        }
        
        // Calculate player hitbox - if hitbox percentages aren't defined, use full size
        const hitboxWidthPercent = (player.hitbox && player.hitbox.widthPercentage) || 1;
        const hitboxHeightPercent = (player.hitbox && player.hitbox.heightPercentage) || 1;
        const hitboxWidth = player.width * hitboxWidthPercent;
        const hitboxHeight = player.height * hitboxHeightPercent;
        const hitboxX = player.position.x + (player.width - hitboxWidth) / 2;
        const hitboxY = player.position.y + (player.height - hitboxHeight);
        
        // Check if collision exists
        const hasCollision = !(
            hitboxX > this.x + this.width ||
            hitboxX + hitboxWidth < this.x ||
            hitboxY > this.y + this.height ||
            hitboxY + hitboxHeight < this.y
        );

        if (hasCollision) {
            // Calculate overlap on each axis
            const overlapLeft = (hitboxX + hitboxWidth) - this.x;
            const overlapRight = (this.x + this.width) - hitboxX;
            const overlapTop = (hitboxY + hitboxHeight) - this.y;
            const overlapBottom = (this.y + this.height) - hitboxY;

            // Find minimum overlap to determine push direction
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            // Push player back based on collision side
            if (minOverlap === overlapLeft && overlapLeft < overlapRight) {
                // Collision on left side of barrier
                player.position.x -= overlapLeft + this.collisionThickness;
                if (player.velocity) player.velocity.x = Math.min(0, player.velocity.x || 0);
            } else if (minOverlap === overlapRight && overlapRight < overlapLeft) {
                // Collision on right side of barrier
                player.position.x += overlapRight + this.collisionThickness;
                if (player.velocity) player.velocity.x = Math.max(0, player.velocity.x || 0);
            } else if (minOverlap === overlapTop && overlapTop < overlapBottom) {
                // Collision on top side of barrier
                player.position.y -= overlapTop + this.collisionThickness;
                if (player.velocity) player.velocity.y = Math.min(0, player.velocity.y || 0);
            } else if (minOverlap === overlapBottom && overlapBottom < overlapTop) {
                // Collision on bottom side of barrier
                player.position.y += overlapBottom + this.collisionThickness;
                if (player.velocity) player.velocity.y = Math.max(0, player.velocity.y || 0);
            }
        }

        return hasCollision;
    }
}

export default Barrier;