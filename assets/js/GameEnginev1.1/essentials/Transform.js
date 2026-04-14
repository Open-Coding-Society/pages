
class TransformValidation {
    // Coerce any input to a finite number by falling back when input is invalid.
    // This prevents NaN/Infinity from leaking into game state.
    // Return a finite number or a safe fallback.
    static number(value, fallback = 0) {
        return Number.isFinite(value) ? value : fallback;
    }

    // Validate object-like input used by position/velocity setters.
    // If invalid (null, primitive, etc.), keep the existing object.
    // Return an object-like value or a fallback object.
    static object(value, fallback = {}) {
        return value && typeof value === "object" ? value : fallback;
    }

    // Clamp damping to [0, 1] where:
    // 0 means velocity is fully removed in one frame,
    // 1 means velocity is preserved with no decay.
    // Keep damping in the stable range used for velocity decay.
    static clampDamping(value, fallback = 0.9) {
        const numeric = TransformValidation.number(value, fallback);
        return Math.max(0, Math.min(1, numeric));
    }

    // Direction is considered valid only when it is a finite numeric degree value.
    // This helper centralizes directional-input checks.
    // Identify whether directional movement input is valid.
    static hasDirection(value) {
        return Number.isFinite(value);
    }
}

class TransformState {
    // Pure data container for transform values.
    // No trigonometry or frame integration logic belongs in this class.
    // Owns mutable transform data only (spawn, position, velocity, speed).
    constructor(spawnX = 0, spawnY = 0, speed = 0.4) {
        // Initial spawn point used for reset behavior.
        this.spawn = {
            x: TransformValidation.number(spawnX, 0),
            y: TransformValidation.number(spawnY, 0),
        };

        // Start current position at spawn by default.
        this.position = {
            x: this.spawn.x,
            y: this.spawn.y,
        };

        // Velocity starts at rest.
        this.velocity = { x: 0, y: 0 };

        // Default speed scalar used by direction-based movement.
        this.speed = TransformValidation.number(speed, 0.4);
    }

    // Mutate position safely while preserving existing values on bad input.
    setPosition(x, y) {
        this.position.x = TransformValidation.number(x, this.position.x);
        this.position.y = TransformValidation.number(y, this.position.y);
    }

    // Mutate velocity safely while preserving existing values on bad input.
    setVelocity(x, y) {
        this.velocity.x = TransformValidation.number(x, this.velocity.x);
        this.velocity.y = TransformValidation.number(y, this.velocity.y);
    }

    // Update movement speed scalar safely.
    setSpeed(speed) {
        this.speed = TransformValidation.number(speed, this.speed);
    }

    // Restore position to spawn and clear active velocity.
    // Useful for respawn/checkpoint style behavior.
    resetToSpawn() {
        this.position.x = this.spawn.x;
        this.position.y = this.spawn.y;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

class TransformMotion {
    // Stateless motion helpers live here so TransformState remains data-focused.

    // Add directional impulse to velocity.
    // Degrees are converted to radians for Math.sin/Math.cos usage.
    // Convert direction + magnitude into velocity impulse.
    static applyDirection(state, dirDegrees = 0, magnitude = null) {
        const direction = TransformValidation.number(dirDegrees, 0);
        const speed = TransformValidation.number(magnitude, state.speed);
        const radians = (direction * Math.PI) / 180;

        // This coordinate system treats +x as sin(theta) and +y as cos(theta).
        state.velocity.x += speed * Math.sin(radians);
        state.velocity.y += speed * Math.cos(radians);
    }

    // Apply immediate translation directly to position.
    // This bypasses velocity and is useful for teleport/manual nudges.
    // Apply direct positional movement.
    static applyDelta(state, dx = 0, dy = 0) {
        state.position.x += TransformValidation.number(dx, 0);
        state.position.y += TransformValidation.number(dy, 0);
    }

    // One frame of simple physics:
    // 1) damp velocity,
    // 2) integrate velocity into position.
    // Advance physics one step by damping velocity and integrating into position.
    static integrate(state, damping = 0.9) {
        const clampedDamping = TransformValidation.clampDamping(damping, 0.9);

        // Apply friction/air resistance style decay.
        state.velocity.x *= clampedDamping;
        state.velocity.y *= clampedDamping;

        // Move by the remaining velocity.
        state.position.x += state.velocity.x;
        state.position.y += state.velocity.y;
    }
}

class Transform {
    // Public API wrapper that keeps old calling style while delegating logic
    // to focused state/motion helper classes.
    // Facade that exposes a backward-compatible API over state + motion modules.
    constructor(spawnX = 0, spawnY = 0, speed = 0.4) {
        this.state = new TransformState(spawnX, spawnY, speed);
    }

    // Spawn x accessor.
    get spawnX() {
        return this.state.spawn.x;
    }

    // Spawn x mutator with validation.
    set spawnX(value) {
        this.state.spawn.x = TransformValidation.number(value, this.state.spawn.x);
    }

    // Spawn y accessor.
    get spawnY() {
        return this.state.spawn.y;
    }

    // Spawn y mutator with validation.
    set spawnY(value) {
        this.state.spawn.y = TransformValidation.number(value, this.state.spawn.y);
    }

    // Position x accessor.
    get x() {
        return this.state.position.x;
    }

    // Position x mutator with validation.
    set x(value) {
        this.state.position.x = TransformValidation.number(value, this.state.position.x);
    }

    // Position y accessor.
    get y() {
        return this.state.position.y;
    }

    // Position y mutator with validation.
    set y(value) {
        this.state.position.y = TransformValidation.number(value, this.state.position.y);
    }

    // Velocity x accessor.
    get xv() {
        return this.state.velocity.x;
    }

    // Velocity x mutator with validation.
    set xv(value) {
        this.state.velocity.x = TransformValidation.number(value, this.state.velocity.x);
    }

    // Velocity y accessor.
    get yv() {
        return this.state.velocity.y;
    }

    // Velocity y mutator with validation.
    set yv(value) {
        this.state.velocity.y = TransformValidation.number(value, this.state.velocity.y);
    }

    // Speed accessor.
    get speed() {
        return this.state.speed;
    }

    // Speed mutator routed through TransformState for consistency.
    set speed(value) {
        this.state.setSpeed(value);
    }

    // Full position object accessor.
    // Note: returns internal reference for backward compatibility.
    get position() {
        return this.state.position;
    }

    // Position object mutator accepting { x, y }.
    // Each axis is validated independently.
    set position(value) {
        const next = TransformValidation.object(value, this.state.position);
        this.state.setPosition(next.x, next.y);
    }

    // Full velocity object accessor.
    // Note: returns internal reference for backward compatibility.
    get velocity() {
        return this.state.velocity;
    }

    // Velocity object mutator accepting { x, y }.
    // Each axis is validated independently.
    set velocity(value) {
        const next = TransformValidation.object(value, this.state.velocity);
        this.state.setVelocity(next.x, next.y);
    }

    // Direct proxy to state-level position setter.
    setPosition(x, y) {
        this.state.setPosition(x, y);
    }

    // Direct proxy to state-level velocity setter.
    setVelocity(x, y) {
        this.state.setVelocity(x, y);
    }

    // Reset current transform to spawn configuration.
    resetToSpawn() {
        this.state.resetToSpawn();
    }

    // Move by explicit delta values in world/screen units.
    // Move directly by position delta only.
    moveBy(dx = 0, dy = 0) {
        TransformMotion.applyDelta(this.state, dx, dy);
    }

    // Add directional impulse using degrees and optional magnitude.
    // If magnitude is null, current speed is used.
    // Accelerate in a direction only.
    moveInDirection(dirDegrees = 0, magnitude = null) {
        TransformMotion.applyDirection(this.state, dirDegrees, magnitude);
    }

    // Legacy move API:
    // - if dirDegrees is valid, perform directional acceleration,
    // - otherwise treat args as direct delta movement.
    // Backward-compatible entry point. Delegates to a single-purpose method.
    move(dx = 0, dy = 0, dirDegrees = null) {
        if (TransformValidation.hasDirection(dirDegrees)) {
            this.moveInDirection(dirDegrees);
            return;
        }

        this.moveBy(dx, dy);
    }

    // Advance transform one frame using velocity + damping.
    // Integrate velocity into position using damping.
    updatePosition(damping = 0.9) {
        TransformMotion.integrate(this.state, damping);
    }
}

export { Transform, TransformValidation, TransformState, TransformMotion };
export default Transform;