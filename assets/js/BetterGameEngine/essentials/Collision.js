import { Vec2 } from 'Vectors.js';
import { Transform } from "../Transform.js";

class Collider {
    constructor() {
        //
    }

    boxCollide(a, b) {
        const dir = b.sub(a);

        if (Math.abs(dir.position.x) < a.size.x + b.size.x) {
            if (Math.abs(dir.position.y) < a.size.y + b.size.y) {
                return true;
            }
        }

        return false;
    }

    ballCollide(a, b) {
        if (a.toDistance(b) < a.size.x + b.size.x) {
            return true;
        }
        return false;
    }
}