
export class Transform {
    constructor(spawnX = 0, spawnY = 0) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.x = spawnX;
        this.y = spawnY;
        this.xv = 0;
        this.yv = 0;
        this.speed = 0.4;
        this.dir = 0;
        this.friction = 0.9;
    }

    setPosition(x = this.x, y = this.y) {
        this.x = Number.isFinite(x) ? x : this.x;
        this.y = Number.isFinite(y) ? y : this.y;
    }

    setVelocity(xv = this.xv, yv = this.yv) {
        this.xv = Number.isFinite(xv) ? xv : this.xv;
        this.yv = Number.isFinite(yv) ? yv : this.yv;
    }

    move(dx = null, dy = null) {
        if (Number.isFinite(dx) || Number.isFinite(dy)) {
            this.xv += Number.isFinite(dx) ? dx : 0;
            this.yv += Number.isFinite(dy) ? dy : 0;
            return;
        }

        const radians = (this.dir * Math.PI) / 180;
        this.xv += this.speed * Math.sin(radians);
        this.yv += this.speed * Math.cos(radians);
    }

    updatePosition(friction = this.friction) {
        this.xv *= friction;
        this.yv *= friction;
        this.x += this.xv;
        this.y += this.yv;
    }

    reset() {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.xv = 0;
        this.yv = 0;
    }
}