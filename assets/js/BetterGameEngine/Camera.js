// Import the Transform class, which likely handles position, rotation, and scale
import { Transform } from "./Transform";

// Define a Camera class to manage the view of the game world
export class Camera {
    // The constructor initializes the camera at a specific position (x, y)
    constructor(x, y) {
        // Create a Transform object to track the camera's position
        this.transform = new Transform(x, y);
    }

    // Method to make the camera follow a target object
    // The target is expected to have a 'transform' property with x and y coordinates
    follow(target) {
        // Currently empty — you would update this.transform based on target.transform here
    }
}

// Create a default camera instance at position (0, 0)
export const camera = new Camera(0, 0);
