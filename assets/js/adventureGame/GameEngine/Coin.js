import { Transform } from "./Transform.js";
import GameObject from './GameObject.js';

// Low-level utility Coin class (kept for compatibility)
export class Coin {
    constructor(x, y, points, size) {
        this.transform = new Transform(x, y);
        this.points = points;
        this.size = size;
    }

    collide(target) {
        const dist = this.transform.distanceTo(target);
        if (dist < this.size) {
            return true;
        }
        return false;
    }

    draw(ctx, canvas) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.transform.x + canvas.width/2, this.transform.y + canvas.height/2, this.size, this.size);
    }
};

// GameObject-compatible wrapper so coins can be used in GameLevel classes
export default class CoinObject extends GameObject {
    constructor(data = {}, gameEnv = null) {
        super(gameEnv);
        this.spriteData = data;
        // Position on canvas (defaults near top-left)
        this.x = (data.INIT_POSITION && data.INIT_POSITION.x) || (data.x || 50);
        this.y = (data.INIT_POSITION && data.INIT_POSITION.y) || (data.y || 50);
        this.points = data.points || 1;
        this.size = data.size || 16;
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };
    }

    update() {
        this.draw();
    }

    draw() {
        const ctx = this.gameEnv && this.gameEnv.ctx;
        if (!ctx) return;
        ctx.fillStyle = this.spriteData.color || 'yellow';
        // draw a simple square coin; position is absolute canvas coords
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    resize() {
        // Nothing special to do on resize for the coin
        this.draw();
    }

    destroy() {
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
}