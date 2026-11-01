import EnginePlayer from '@assets/js/GameEnginev1.1/essentials/Player.js';

const ARROW_KEYS = new Set([37, 38, 39, 40]);
const ICICLE_SLOWDOWN_DURATION = 2000;
const ICICLE_SLOWDOWN_MULTIPLIER = 0.5;
const BOOST_DURATION = 1000;
const BOOST_MULTIPLIER = 2;
const BOOST_COOLDOWN = 3000;

export default class Player extends EnginePlayer {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.keysPressed = {};
    this.currentSpeed = data.currentSpeed ?? 0;
    this.maxSpeed = data.maxSpeed;
    this.acceleration = data.acceleration;
    this.deceleration = data.deceleration;
    this.reverseSpeed = data.reverseSpeed;
    this.boostKey = data.boostKey;
    this.temporarySpeedMultiplier = 1;
    this.slowdownUntil = 0;
    this.boostUntil = 0;
    this.boostCooldownUntil = 0;
  }

  handleKeyDown(event) {
    const target = event.target;
    const editing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || '');
    const control = this.gameEnv?.gameControl;
    if (editing || event.altKey || event.ctrlKey || event.metaKey || !control || control.isPaused) return;
    if (this.gameEnv.container?.isConnected === false) return;

    const wasPressed = this.keysPressed[event.keyCode];
    this.keysPressed[event.keyCode] = true;
    if (event.keyCode === this.boostKey && !wasPressed) this.startBoost();

    if (ARROW_KEYS.has(event.keyCode) && Object.values(this.keypress).includes(event.keyCode)) {
      event.preventDefault();
    }
    super.handleKeyDown(event);
    this.updateMovementSpeed();
  }

  handleKeyUp(event) {
    this.keysPressed[event.keyCode] = false;
    if (super.handleKeyUp) {
      super.handleKeyUp(event);
    }
  }

  handleCollisionReaction(other) {
    if (other?.id?.startsWith('winter-icicle-')) {
      this.applyIcicleSlowdown();
      const icicle = this.gameEnv.gameObjects.find((object) => object.spriteData?.id === other.id);
      icicle?.consume?.();
    }

    super.handleCollisionReaction(other);
  }

  applyIcicleSlowdown(now = Date.now()) {
    this.temporarySpeedMultiplier = ICICLE_SLOWDOWN_MULTIPLIER;
    this.slowdownUntil = now + ICICLE_SLOWDOWN_DURATION;
  }

  startBoost(now = Date.now()) {
    if (now < this.boostCooldownUntil) return false;

    this.boostUntil = now + BOOST_DURATION;
    this.boostCooldownUntil = now + BOOST_COOLDOWN;
    this.updateMovementSpeed(now);
    return true;
  }

  move(now = Date.now()) {
    if (now >= this.boostUntil || this.currentSpeed <= 0) {
      super.move();
      return;
    }

    const velocityX = this.velocity.x;
    const velocityY = this.velocity.y;
    const maxStep = Math.max(1, Math.min(this.width, this.height) * 0.1);
    const steps = Math.ceil(Math.hypot(velocityX, velocityY) / maxStep);
    let blockedX = false;
    let blockedY = false;

    for (let step = 0; step < steps; step += 1) {
      this.velocity.x = blockedX ? 0 : velocityX / steps;
      this.velocity.y = blockedY ? 0 : velocityY / steps;
      super.move();

      if (velocityX !== 0 && this.velocity.x === 0) blockedX = true;
      if (velocityY !== 0 && this.velocity.y === 0) blockedY = true;

      for (const barrier of this.gameEnv.gameObjects) {
        if (barrier !== this && typeof barrier.resolvePlayerCollision === 'function') {
          barrier.resolvePlayerCollision();
        }
      }
    }

    this.velocity.x = blockedX ? 0 : velocityX;
    this.velocity.y = blockedY ? 0 : velocityY;
  }

  updateVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.moved = false;

    const keysPressed = this.keysPressed ?? this.pressedKeys;
    const { up, down, left, right } = this.keypress;

    if (keysPressed[right] || keysPressed[left]) {
      this.moved = true;
      if (keysPressed[right]) this.velocity.x += this.xVelocity;
      else if (keysPressed[left]) this.velocity.x -= this.xVelocity;
    }

    if (keysPressed[up] || keysPressed[down]) {
      this.moved = true;
      if (keysPressed[up]) this.velocity.y -= this.yVelocity;
      else if (keysPressed[down]) this.velocity.y += this.yVelocity;
    }
  }

  update() {
    super.update();

    // ONLY run acceleration physics if this specific car has maxSpeed defined
    if (this.maxSpeed !== undefined) {
      const upKey = this.keypress.up;
      const downKey = this.keypress.down;
      const accelerating =
        this.keysPressed[upKey]
        || this.keysPressed[this.keypress.left]
        || this.keysPressed[this.keypress.right];

      if (accelerating) {
        this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);
      } else if (this.keysPressed[downKey]) {
        this.currentSpeed = Math.max(this.currentSpeed - this.acceleration, this.reverseSpeed);
      } else {
        if (this.currentSpeed > 0) {
          this.currentSpeed = Math.max(this.currentSpeed - this.deceleration, 0);
        } else if (this.currentSpeed < 0) {
          this.currentSpeed = Math.min(this.currentSpeed + this.deceleration, 0);
        }
      }

      this.updateMovementSpeed();
    }
  }

  updateMovementSpeed(now = Date.now()) {
    if (this.maxSpeed === undefined) return;

    if (now >= this.slowdownUntil) this.temporarySpeedMultiplier = 1;
    const boostMultiplier = now < this.boostUntil && this.currentSpeed > 0
      ? BOOST_MULTIPLIER
      : 1;
    const speedRatio = Math.min(Math.abs(this.currentSpeed) / this.maxSpeed, 1);
    const effectiveMultiplier = this.temporarySpeedMultiplier * boostMultiplier;
    this.xVelocity = (this.scale.width / this.stepFactor) * 3 * speedRatio * effectiveMultiplier;
    this.yVelocity = (this.scale.height / this.stepFactor) * 3 * speedRatio * effectiveMultiplier;
    this.updateVelocity();
  }
}