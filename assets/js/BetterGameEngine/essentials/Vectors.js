export class Vec2 {
    constructor(x, y=null) {
        this.x = x;
        this.y = y;

        if (this.y === null) {
            this.y = x;
        }
    }

    add(v) {
        const n = new Vec3(this.x + v.x, this.y + v.y);
        return n;
    }

    sub(v) {
        const n = new Vec3(this.x - v.x, this.y - v.y);
        return n;
    }

    mult(v) {
        const n = new Vec3(this.x * v.x, this.y * v.y);
        return n;
    }

    div(v) {
        const n = new Vec3(this.x / v.x, this.y / v.y);
        return n;
    }

    length() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    length2() {
        const len = new Vec2(this.length());
        return len;
    }

    normalized() {
        return this.div(this.length2());
    }

    sum() {
        return this.x + this.y;
    }

    dot(v) {
        return this.sum(this.mult(v));
    }
}

export class Vec3 {
    constructor(x, y=null, z=null) {
        this.x = x;
        this.y = y;
        this.z = z;

        if (this.y === null && this.z === null) {
            this.y = x;
            this.z = x;
        } else if (this.y === null) {
            throw error("Missing z axis");
        } else if (this.z === null) {
            throw error("Missing y axis");
        }

        this.xy = new Vec2(this.x, this.y);
        this.yz = new Vec2(this.y, this.z);
    }

    add(v) {
        const n = new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
        return n;
    }

    sub(v) {
        const n = new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
        return n;
    }

    mult(v) {
        const n = new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
        return n;
    }

    div(v) {
        const n = new Vec3(this.x / v.x, this.y / v.y, this.z / v.z);
        return n;
    }

    length() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    length3() {
        const len = new Vec3(this.length());
        return len;
    }

    normalized() {
        return this.div(this.length3());
    }

    sum() {
        return this.x + this.y + this.z;
    }

    dot(v) {
        return this.sum(this.mult(v));
    }
}