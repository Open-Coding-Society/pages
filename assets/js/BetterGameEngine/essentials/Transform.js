// Import the Vec2 class, which handles 2D vector math (position, velocity, etc.)
import { Vec2 } from './Vectors.js';

// Define a Transform class to manage an object's position, movement, and size
export class Transform {
    // Constructor initializes position, velocity, and size
    // spawnX, spawnY: initial position of the object
    // size: optional size parameter, default is 50
    constructor(spawnX, spawnY, size = 50) {
        // The spawn point (initial position) stored as a Vec2
        this.spawn = new Vec2(spawnX, spawnY);

        // Current position of the object, initialized at the spawn point
        this.position = this.spawn;

        // Velocity of the object, initialized to (0, 0)
        this.velocity = new Vec2(0);

        // Size of the object as a Vec2 (square by default)
        this.size = new Vec2(size);
    }

    // Calculate the distance from this object to a target Transform
    // target: another Transform object
    distanceTo(target) {
        // Subtract this.position from target.position and get the length (distance)
        return this.position.length(target.position.sub(this.position));
    }

    // Calculate the angle (in radians) from this object to a target Transform
    pointAt(target) {
        // Compute the direction vector from this.position to target.position
        const dir = target.position.sub(this.position);

        // BUG: 'dx' and 'dy' are not defined here; should use dir.x and dir.y
        // Return the angle using atan2(dy, dx)
        return Math.atan2(dy, dx);
    }
}