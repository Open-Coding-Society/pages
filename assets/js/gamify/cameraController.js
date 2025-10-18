import { Transform } from './tools.js';

class Camera {
    constructor() {
        this.transform = new Transform(0, 0, 0, 1, 1);
        this.zoom = this.transform.scale.x;

        this.target = this.transform;
    }

    move(speed, dir) {
        const rad = this.transform.toRadians(dir);
        this.transform.position.x += speed * Math.cos(rad);
        this.transform.position.y += speed * Math.sin(rad);
    }
    
    changPos(x1=0, y1=0) {
        this.transform.position.x += x1;
        this.transform.position.y += y1;
    }

    follow(target) {
        this.transform.position.x += 0.1 * (target.transform.position.x - this.transform.position.x);
        this.transform.position.y += 0.1 * (target.transform.position.y - this.transform.position.y);
        this.transform.turn(0.1 * (target.transform.rotation - this.transform.rotation));
        this.zoom += 0.1 * (target.zoom - this.zoom);
    }
}