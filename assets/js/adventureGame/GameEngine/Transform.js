
export class Transform {
    constructor(spawnX, spawnY) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.xv = 0;
        this.yv = 0;
        this.speed = 0.4;
    }

    move(dx, dy) {
        rad = (this.dir * Math.PI) / 180;
        this.xv += this.speed * Math.sin(rad);
        this.yv += this.speed * Math.cos(rad);
    }

    distanceTo(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    updatePosition() {

        this.xv *= 0.9;
        this.yv *= 0.9;

        this.x += this.xv;
        this.y += this.yv;

    }

}