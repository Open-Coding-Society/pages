
export class Camera {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 0.1;
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    follow() {
        this.x += this.speed * (this.targetX - this.x);
        this.y += this.speed * (this.targetY - this.y);
    }
}