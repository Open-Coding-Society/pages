// Import the Vec2 class, which handles 2D vector math (position, velocity, etc.)
import { Vec2 } from './Vectors.js';

// Define a Transform class to manage an object's position, movement, and size
export class Transform {
    // Constructor initializes position and velocity
    // spawnX, spawnY: initial position of the object
    constructor(spawnX = 0, spawnY = 0) {
        // Direct x, y position properties for compatibility with Character.js
        this.x = spawnX;
        this.y = spawnY;
        
        // Velocity properties
        this.xv = 0;
        this.yv = 0;
        
        // The spawn point (initial position) stored as a Vec2 for advanced physics
        this.spawn = new Vec2(spawnX, spawnY);

        // Current position as Vec2 (synced with x, y)
        this.position = new Vec2(spawnX, spawnY);

        // Velocity as Vec2 (synced with xv, yv)
        this.velocity = new Vec2(0, 0);
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
        // Return the angle using atan2(dy, dx)
        return Math.atan2(dir.y, dir.x);
    }
}