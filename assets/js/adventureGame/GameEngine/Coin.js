import { Transform } from "./Transform";

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