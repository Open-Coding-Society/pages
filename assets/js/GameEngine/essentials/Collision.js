import { Transform } from './Transform.js';

/**
 * Collision detection class for handling collisions between game objects
 * Supports both rectangular (AABB) and circular collision detection
 */
class Collision {
    /**
     * Creates a new Collision detector instance
     */
    constructor() {
        // No instance-specific properties needed
    }

    /**
     * Axis-Aligned Bounding Box (AABB) collision detection
     * Checks if two rectangular objects overlap by comparing their positions and dimensions
     * 
     * @param {Object} a - First object with x, y, width, and height properties
     * @param {Object} b - Second object with x, y, width, and height properties
     * @returns {boolean} true if objects are colliding, false otherwise
     */
    boxCollide(a, b) {
        // Calculate the distance between centers on X and Y axes
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        // Check if the horizontal distance is less than combined widths
        if (Math.abs(dx) < a.width + b.width) {
            // Check if the vertical distance is less than combined heights
            if (Math.abs(dy) < a.height + b.height) {
                return true; // Collision detected
            }
        }

        return false; // No collision
    }

    /**
     * Circle/Ball collision detection
     * Checks if two circular objects overlap by comparing their distance to combined radii
     * 
     * @param {Object} a - First object with x, y, width properties (width acts as radius)
     * @param {Object} b - Second object with x, y, width properties (width acts as radius)
     * @returns {boolean} true if circles are colliding, false otherwise
     */
    ballCollide(a, b) {
        // Calculate distance between centers and compare to sum of radii
        if (a.toDistance(b) < a.width + b.width) {
            return true; // Collision detected
        }
        return false; // No collision
    }
}

export default Collision;
