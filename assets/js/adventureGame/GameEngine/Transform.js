import { directionOf } from "./Essentials";


export class Transform {
    constructor(x=0, y=0, xv=0, yv=0, dir=0) {
        this.position = {x: x, y: y};
        this.velocity = {x: xv, y: yv};
        this.direction = dir;
    }

    goto(x=0, y=0) {
        this.position = {x: x, y: y};
    }

    move(speed=0) {
        this.position.x += speed * Math.sin(this.direction);
        this.position.y += speed * Math.cos(this.direction);
    }

    pointAt(transform) {
        this.direction = directionOf(this.position.x, this.position.y, transform.position.x, transform.position.y);
    }
}