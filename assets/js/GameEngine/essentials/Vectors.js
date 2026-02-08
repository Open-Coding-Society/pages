// 2D Vector class
export class Vec2 {
    /**
     * Creates a 2D vector
     * @param {number} x - x component
     * @param {number|null} y - y component (optional, defaults to x)
     */
    constructor(x, y = null) {
        this.x = x;
        this.y = y;

        // If y is not provided, assume a square vector (x, x)
        if (this.y === null) {
            this.y = x;
        }
    }

    // Vector addition: returns a new Vec3 (⚠️ should probably return Vec2)
    add(v) {
        const n = new Vec3(this.x + v.x, this.y + v.y); // ⚠️ Bug: creating Vec3 instead of Vec2
        return n;
    }

    // Vector subtraction: returns a new Vec3 (⚠️ same issue)
    sub(v) {
        const n = new Vec3(this.x - v.x, this.y - v.y);
        return n;
    }

    // Component-wise multiplication
    mult(v) {
        const n = new Vec3(this.x * v.x, this.y * v.y);
        return n;
    }

    // Component-wise division
    div(v) {
        const n = new Vec3(this.x / v.x, this.y / v.y);
        return n;
    }

    // Euclidean length (magnitude) of the vector
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // Returns length as a Vec2 (⚠️ unusual; normally you return a number)
    length2() {
        const len = new Vec2(this.length());
        return len;
    }

    // Normalized vector (unit vector)
    normalized() {
        return this.div(this.length2()); // ⚠️ div expects a Vec2; length2 returns Vec2, so works but unconventional
    }

    // Sum of components
    sum() {
        return this.x + this.y;
    }

    // Dot product with another vector
    dot(v) {
        return this.sum(this.mult(v)); // ⚠️ unconventional: usually dot returns a number, and this.mult(v) gives Vec3
    }
}

// 3D Vector class
export class Vec3 {
    /**
     * Creates a 3D vector
     * @param {number} x - x component
     * @param {number|null} y - y component
     * @param {number|null} z - z component
     */
    constructor(x, y = null, z = null) {
        this.x = x;
        this.y = y;
        this.z = z;

        // Handle missing components
        if (this.y === null && this.z === null) {
            // If only x provided, set y and z equal to x (cube vector)
            this.y = x;
            this.z = x;
        } else if (this.y === null) {
            throw error("Missing z axis"); // ⚠️ likely meant "Missing y axis"
        } else if (this.z === null) {
            throw error("Missing y axis"); // ⚠️ likely meant "Missing z axis"
        }

        // Convenience 2D projections
        this.xy = new Vec2(this.x, this.y);
        this.yz = new Vec2(this.y, this.z);
    }

    // Vector addition
    add(v) {
        const n = new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
        return n;
    }

    // Vector subtraction
    sub(v) {
        const n = new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
        return n;
    }

    // Component-wise multiplication
    mult(v) {
        const n = new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
        return n;
    }

    // Component-wise division
    div(v) {
        const n = new Vec3(this.x / v.x, this.y / v.y, this.z / v.z);
        return n;
    }

    // Euclidean length (magnitude)
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    // Returns length as a Vec3 (⚠️ unusual)
    length3() {
        const len = new Vec3(this.length());
        return len;
    }

    // Normalized vector
    normalized() {
        return this.div(this.length3());
    }

    // Sum of components
    sum() {
        return this.x + this.y + this.z;
    }

    // Dot product with another vector (⚠️ unconventional; dot normally returns a number)
    dot(v) {
        return this.sum(this.mult(v));
    }
}