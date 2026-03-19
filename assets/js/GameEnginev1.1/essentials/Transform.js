
class TransformValidation {
    static number(value, fallback = 0) {
        return Number.isFinite(value) ? value : fallback;
    }

    static object(value, fallback = {}) {
        return value && typeof value === "object" ? value : fallback;
    }
}

class TransformState {
    constructor(spawnX = 0, spawnY = 0, speed = 0.4) {
        this.spawn = {
            x: TransformValidation.number(spawnX, 0),
            y: TransformValidation.number(spawnY, 0),
        };

        this.position = {
            x: this.spawn.x,
            y: this.spawn.y,
        };

        this.velocity = { x: 0, y: 0 };
        this.speed = TransformValidation.number(speed, 0.4);
    }

    setPosition(x, y) {
        this.position.x = TransformValidation.number(x, this.position.x);
        this.position.y = TransformValidation.number(y, this.position.y);
    }

    setVelocity(x, y) {
        this.velocity.x = TransformValidation.number(x, this.velocity.x);
        this.velocity.y = TransformValidation.number(y, this.velocity.y);
    }

    setSpeed(speed) {
        this.speed = TransformValidation.number(speed, this.speed);
    }

    resetToSpawn() {
        this.position.x = this.spawn.x;
        this.position.y = this.spawn.y;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

class TransformMotion {
    static applyDirection(state, dirDegrees = 0, magnitude = null) {
        const direction = TransformValidation.number(dirDegrees, 0);
        const speed = TransformValidation.number(magnitude, state.speed);
        const radians = (direction * Math.PI) / 180;

        state.velocity.x += speed * Math.sin(radians);
        state.velocity.y += speed * Math.cos(radians);
    }

    static applyDelta(state, dx = 0, dy = 0) {
        state.position.x += TransformValidation.number(dx, 0);
        state.position.y += TransformValidation.number(dy, 0);
    }

    static integrate(state, damping = 0.9) {
        const clampedDamping = Math.max(0, Math.min(1, TransformValidation.number(damping, 0.9)));

        state.velocity.x *= clampedDamping;
        state.velocity.y *= clampedDamping;

        state.position.x += state.velocity.x;
        state.position.y += state.velocity.y;
    }
}

class Transform {
    constructor(spawnX = 0, spawnY = 0, speed = 0.4) {
        this.state = new TransformState(spawnX, spawnY, speed);
    }

    get spawnX() {
        return this.state.spawn.x;
    }

    set spawnX(value) {
        this.state.spawn.x = TransformValidation.number(value, this.state.spawn.x);
    }

    get spawnY() {
        return this.state.spawn.y;
    }

    set spawnY(value) {
        this.state.spawn.y = TransformValidation.number(value, this.state.spawn.y);
    }

    get x() {
        return this.state.position.x;
    }

    set x(value) {
        this.state.position.x = TransformValidation.number(value, this.state.position.x);
    }

    get y() {
        return this.state.position.y;
    }

    set y(value) {
        this.state.position.y = TransformValidation.number(value, this.state.position.y);
    }

    get xv() {
        return this.state.velocity.x;
    }

    set xv(value) {
        this.state.velocity.x = TransformValidation.number(value, this.state.velocity.x);
    }

    get yv() {
        return this.state.velocity.y;
    }

    set yv(value) {
        this.state.velocity.y = TransformValidation.number(value, this.state.velocity.y);
    }

    get speed() {
        return this.state.speed;
    }

    set speed(value) {
        this.state.setSpeed(value);
    }

    get position() {
        return this.state.position;
    }

    set position(value) {
        const next = TransformValidation.object(value, this.state.position);
        this.state.setPosition(next.x, next.y);
    }

    get velocity() {
        return this.state.velocity;
    }

    set velocity(value) {
        const next = TransformValidation.object(value, this.state.velocity);
        this.state.setVelocity(next.x, next.y);
    }

    setPosition(x, y) {
        this.state.setPosition(x, y);
    }

    setVelocity(x, y) {
        this.state.setVelocity(x, y);
    }

    resetToSpawn() {
        this.state.resetToSpawn();
    }

    move(dx = 0, dy = 0, dirDegrees = null) {
        if (Number.isFinite(dirDegrees)) {
            TransformMotion.applyDirection(this.state, dirDegrees);
            return;
        }

        TransformMotion.applyDelta(this.state, dx, dy);
    }

    updatePosition(damping = 0.9) {
        TransformMotion.integrate(this.state, damping);
    }
}

export { Transform, TransformValidation, TransformState, TransformMotion };
export default Transform;