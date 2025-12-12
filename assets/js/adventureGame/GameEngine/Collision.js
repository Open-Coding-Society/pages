
import { Transform } from "Transform.js";

class Collision {
    constructor() {
        //
    }

    boxCollide(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        if (Math.abs(dx) < a.width + b.width) {
            if (Math.abs(dy) < a.height + b.height) {
                return true;
            }
        }

        return false;
    }

    ballCollide(a, b) {
        if (a.toDistance(b) < a.width + b.width) {
            return true;
        }
        return false;
    }

    
}