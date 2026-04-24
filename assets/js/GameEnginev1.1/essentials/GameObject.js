import Transform from './Transform.js';

/**
 * The GameObject class serves as a base class for all game objects.
 * It mimics an interface by defining abstract methods that must be implemented
 * by any subclass. This ensures that all game objects have a consistent interfaces
 * and can be managed uniformly within GameControl.js.
 * 
 * @class GameObject
 * @method draw - Draws the object on the canvas. Must be implemented by subclasses.
 * @method update - Updates the object's state. Must be implemented by subclasses.
 * @method resize - Resizes the object based on the canvas size. Must be implemented by subclasses.
 * @method destroy - Removes the object from the game environment. Must be implemented by subclasses.
 * @method collisionChecks - Checks for collisions with other game objects.
 * @method isCollision - Detects collisions with other game objects.
 * @method handleCollisionEvent - Updates the collisions array when player is touching the object.
 * @method handleReaction - Handles player reaction / state updates to the collision.
 */
class GameObject {
 
    constructor(gameEnv = null) {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct GameObject instances directly");
        }
        this.gameEnv = gameEnv; 
        this.transform = new Transform(0, 0);
        this.collisionWidth = 0;
        this.collisionHeight = 0;
        this.collisionData = {};
        this.hitbox = {};
        this.state = {
            collisionEvents: [],
            movement: { up: true, down: true, left: true, right: true },
        };
    }

    get position() {
        return this.transform.position;
    }

    set position(value) {
        this.transform.position = value;
    }

    get velocity() {
        return this.transform.velocity;
    }

    set velocity(value) {
        this.transform.velocity = value;
    }

    get x() {
        return this.transform.x;
    }

    set x(value) {
        this.transform.x = value;
    }

    get y() {
        return this.transform.y;
    }

    set y(value) {
        this.transform.y = value;
    }

    get xv() {
        return this.transform.xv;
    }

    set xv(value) {
        this.transform.xv = value;
    }

    get yv() {
        return this.transform.yv;
    }

    set yv(value) {
        this.transform.yv = value;
    }

    setTransformPosition(x, y) {
        this.transform.setPosition(x, y);
    }

    setTransformVelocity(x, y) {
        this.transform.setVelocity(x, y);
    }

    resetTransformToSpawn() {
        this.transform.resetToSpawn();
    }

    /**
     * Updates the object's state.
     * This method must be implemented by subclasses.
     * @abstract
     */
    update() {
        throw new Error("Method 'update()' must be implemented.");
    }

    /**
     * Draws the object on the canvas.
     * This method must be implemented by subclasses.
     * @abstract
     */
    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }

    /**
     * Resizes the object based on the canvas size.
     * This method must be implemented by subclasses.
     * @abstract
     */
    resize() {
        throw new Error("Method 'resize()' must be implemented.");
    }

    /**
     * Removes the object from the game environment.
     * This method must be implemented by subclasses.
     * @abstract
     */
    destroy() {
        throw new Error("Method 'destroy()' must be implemented.");
    }

    /**
     * Check if a point (canvas/game coordinates) is inside this object's hitbox.
     * @param {number} x - X coordinate (canvas/game space)
     * @param {number} y - Y coordinate (canvas/game space)
     * @returns {boolean} True if point is inside hitbox
     */
    isPointInside(x, y) {
        // Use this.position, this.pixels, this.hitbox, etc.
        const px = this.position?.x ?? this.INIT_POSITION?.x ?? 0;
        const py = this.position?.y ?? this.INIT_POSITION?.y ?? 0;
        let width = this.pixels?.width || (this.hitbox?.widthPercentage ? this.hitbox.widthPercentage * (this.gameEnv?.innerWidth || 1) : 32);
        let height = this.pixels?.height || (this.hitbox?.heightPercentage ? this.hitbox.heightPercentage * (this.gameEnv?.innerHeight || 1) : 32);
        return (x >= px && x <= px + width && y >= py && y <= py + height);
    }

    /**
     * Handle click/touch interaction. Override in subclasses for custom behavior.
     */
    handleClick() {
        // Default: do nothing. Subclasses can override for interactivity.
    }

    /**
     * Returns the center point of this object.
     */
    getCenter() {
        return {
            x: (this.x || 0) + ((this.width || 0) / 2),
            y: (this.y || 0) + ((this.height || 0) / 2)
        };
    }

    /**
     * Returns the Euclidean distance from this object to another object.
     * @param {*} other - Another GameObject-like object with x/y coordinates.
     */
    getDistanceTo(other) {
        if (!other) return Infinity;
        const a = this.getCenter();
        const b = typeof other.getCenter === 'function'
            ? other.getCenter()
            : { x: other.x || 0, y: other.y || 0 };
        return Math.hypot(b.x - a.x, b.y - a.y);
    }

    /**
     * Returns true if the other object is within the supplied distance.
     * @param {*} other - Another GameObject-like object.
     * @param {number} distance - Maximum interaction distance.
     */
    isNear(other, distance = 100) {
        return this.getDistanceTo(other) <= distance;
    }

    /** Collision checks
     * uses Player isCollision to detect hit
     * calls collisionAction on hit
     */
    collisionChecks() {
        let collisionDetected = false;

        for (var gameObj of this.gameEnv.gameObjects) {
            if (gameObj.canvas && this != gameObj) {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    collisionDetected = true;
                    this.handleCollisionEvent();
                }
            }
        }

        // Reset collision events if no collisions detected
        if (!collisionDetected) {
            this.state.collisionEvents = [];
        }
    }

    /** Collision detection method
     * usage: if (object.isCollision(platform)) { // action }
     */
    isCollision(other) {
        // Bounding rectangles from Canvas
        const thisRect = this.canvas.getBoundingClientRect();
        const otherRect = other.canvas.getBoundingClientRect();

        // Calculate hitbox constants for this object
        const thisWidthReduction = thisRect.width * (this.hitbox?.widthPercentage || 0.0);
        const thisHeightReduction = thisRect.height * (this.hitbox?.heightPercentage || 0.0);

        // Calculate hitbox constants for other object
        const otherWidthReduction = otherRect.width * (other.hitbox?.widthPercentage || 0.0);
        const otherHeightReduction = otherRect.height * (other.hitbox?.heightPercentage || 0.0);

        // Build hitbox by subtracting reductions from the left, right, and top
        const thisLeft = thisRect.left + thisWidthReduction;
        const thisTop = thisRect.top + thisHeightReduction;
        const thisRight = thisRect.right - thisWidthReduction;
        const thisBottom = thisRect.bottom;

        const otherLeft = otherRect.left + otherWidthReduction;
        const otherTop = otherRect.top + otherHeightReduction;
        const otherRight = otherRect.right - otherWidthReduction;
        const otherBottom = otherRect.bottom;

        // Determine hit and touch points of hit
        const hit = (
            thisLeft < otherRight &&
            thisRight > otherLeft &&
            thisTop < otherBottom &&
            thisBottom > otherTop
        );

        const touchPoints = {
            this: {
                id: this.canvas.id,
                greet: this.spriteData?.greeting || 'Hello',
                top: thisBottom > otherTop && thisTop < otherTop,
                bottom: thisTop < otherBottom && thisBottom > otherBottom,
                left: thisRight > otherLeft && thisLeft < otherLeft,
                right: thisLeft < otherRight && thisRight > otherRight,
            },
            other: {
                id: other.canvas.id,
                greet: other.spriteData?.greeting || 'Hello',
                reaction: other.spriteData?.reaction || null,
                top: otherBottom > thisTop && otherTop < thisTop,
                bottom: otherTop < thisBottom && otherBottom > thisBottom,
                left: otherRight > thisLeft && otherLeft < thisLeft,
                right: otherLeft < thisRight && otherRight > thisRight,
            },
        };

        this.collisionData = { hit, touchPoints };
    }

    /**
     * Update the collisions array when player is touching the object
     * @param {*} objectID 
     */
    handleCollisionEvent() {
        const objectOther = this.collisionData.touchPoints.other;
        // check if the collision type is not already in the collisions array
        if (!this.state.collisionEvents.includes(objectOther.id)) {
            // add the collisionType to the collisions array, making it the current collision
            this.state.collisionEvents.push(objectOther.id);
            // Some games rely on preserving held inputs (for example platformers).
            // Keep legacy key clearing behavior unless an object opts out.
            if (this.clearPressedKeysOnCollision !== false) {
                try {
                    for (const obj of this.gameEnv.gameObjects) {
                        if (obj && typeof obj === 'object' && obj.pressedKeys && typeof obj.pressedKeys === 'object') {
                            obj.pressedKeys = {};
                        }
                    }
                } catch (_) {}
            }

            this.handleCollisionReaction(objectOther);
        }
        this.handleCollisionState();
    }

    /**
     * Handles the reaction to the collision, updated to use dialogue (from end team hack)
     * @param {*} other 
     */
    handleCollisionReaction(other) {
        // Avoid auto-triggering explicit interactables until the player presses E or clicks.
        const targetObject = other && other.id
            ? this.gameEnv.gameObjects.find(obj => obj.spriteData && obj.spriteData.id === other.id)
            : null;
        if (targetObject && typeof targetObject.interact === 'function') {
            return;
        }

        // First check if reaction is a function that can be called
        if (other && other.reaction && typeof other.reaction === "function") {
            other.reaction();
            return;
        }
        
        // If the object has a dialogueSystem, use it instead of console.log
        if (other && other.id) {
            // Try to find the object instance to use its dialogueSystem
            const targetObject = this.gameEnv.gameObjects.find(obj => 
                obj.spriteData && obj.spriteData.id === other.id
            );
            
            if (targetObject && targetObject.dialogueSystem) {
                targetObject.showReactionDialogue();
            } else if (targetObject && targetObject.showItemMessage) {
                targetObject.showItemMessage();
            } else if (other.greeting) {
                // Fallback to greeting if available
                console.log(other.greeting);
            }
        }
    }

    /**
     * Handles Player state updates related to the collision
     */
    handleCollisionState() {
        // handle player reaction based on collision type
        if (this.state.collisionEvents.length > 0) {
            const touchPoints = this.collisionData.touchPoints.this;

            // Reset movement to allow all directions initially
            this.state.movement = { up: true, down: true, left: true, right: true };

            if (touchPoints.top) {
                this.state.movement.down = false;
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                }
            }

            if (touchPoints.bottom) {
                this.state.movement.up = false;
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                }
            }

            if (touchPoints.right) {
                this.state.movement.left = false;
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                }
            }

            if (touchPoints.left) {
                this.state.movement.right = false;
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                }
            }
        }
    }
}

export default GameObject;