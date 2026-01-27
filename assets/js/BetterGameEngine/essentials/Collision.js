// Import Vec2 for 2D vector math
import { Vec2 } from 'Vectors.js';

// Import Transform class, which contains position, size, and other properties
import { Transform } from "../Transform.js";

// Define a Collider class to handle collision detection between objects
class Collider {
    constructor() {
        // Empty constructor for now; no instance-specific properties needed
    }

    /**
     * Axis-Aligned Bounding Box (AABB) collision detection
     * Checks if two rectangular objects (a and b) overlap
     * @param {Transform} a - first object
     * @param {Transform} b - second object
     * @returns {boolean} true if colliding, false otherwise
     */
    boxCollide(a, b) {
        // Attempt to calculate the difference vector between objects
        const dir = b.sub(a); // ⚠️ Issue: 'b' and 'a' are likely Transform objects, not Vec2. Should use b.position.sub(a.position)

        // Check overlap in the X-axis
        if (Math.abs(dir.position.x) < a.size.x + b.size.x) {
            // Check overlap in the Y-axis
            if (Math.abs(dir.position.y) < a.size.y + b.size.y) {
                return true; // Boxes overlap
            }
        }

        return false; // No collision
    }

    /**
     * Ball (circle) collision detection
     * Checks if two circular objects overlap based on their radii (size.x assumed as radius)
     * @param {Transform} a - first object
     * @param {Transform} b - second object
     * @returns {boolean} true if colliding, false otherwise
     */
    ballCollide(a, b) {
        // Use a custom method to calculate distance between objects
        if (a.toDistance(b) < a.size.x + b.size.x) {
            return true; // Circles are overlapping
        }
        return false; // No collision
    }
}