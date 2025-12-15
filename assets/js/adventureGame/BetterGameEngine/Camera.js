import { Transform } from "./Transform";

export class Camera {
    constructor(x, y) {
        this.transform = new Transform(x, y);
    }

    follow(target) {
        
    }
}

export const camera = new Camera(0, 0);