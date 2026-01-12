import { Vec2 } from 'essentials/Vectors.js';

export class Transform {
    constructor(spawnX, spawnY, size=50) {
        this.spawn = new Vec2(spawnX, spawnY);
        this.position = this.spawn;
        this.velocity = new Vec2(0);

        this.size = new Vec2(size);
    }

    distanceTo(target) {
        return this.position.length(target.position.sub(this.position));
    }

    pointAt(target) {
        const dir = target.position.sub(this.position);
        return Math.atan2(dy, dx);
    }
}