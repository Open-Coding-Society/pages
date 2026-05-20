import GameObject from '../MansionLogic/GameObject.js';
import Player from '../MansionLogic/Player.js';

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
        
        return !(
            hitboxX > this.x + this.width ||
            hitboxX + hitboxWidth < this.x ||
            hitboxY > this.y + this.height ||
            hitboxY + hitboxHeight < this.y
        );
    }
}

export default Barrier;