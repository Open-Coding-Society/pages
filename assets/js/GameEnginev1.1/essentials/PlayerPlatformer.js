import Player from './Player.js';

export default class PlayerPlatformer extends Player {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);

    // This class owns gravity; do not also apply Player's legacy gravity.
    this.gravity = false;
    this.verticalVelocity = 0;
    this.gravityAcceleration = data.gravityAcceleration ?? 0.4;
    this.jumpVelocity = data.jumpVelocity ?? Math.max(8, this.yVelocity * 1.5);
    this.isGrounded = false;
    this._groundedThisFrame = false;
    this._skipGravityThisFrame = false;
    this._jumpPressedLatch = false;
    this.clearPressedKeysOnCollision = false;
  }

  hasSupport() {
    return this.isGrounded;
  }

  onJump() {}

  land() {
    this.verticalVelocity = 0;
    this.velocity.y = 0;
    this.isGrounded = true;
    this._groundedThisFrame = true;
    this._skipGravityThisFrame = true;
  }

  hitCeiling() {
    this.verticalVelocity = 0;
    this.velocity.y = 0;
  }

  updateVelocity() {
    this.velocity.x = 0;
    this.moved = false;

    if (this.pressedKeys[this.keypress.right]) {
      this.velocity.x = this.xVelocity;
      this.moved = true;
    } else if (this.pressedKeys[this.keypress.left]) {
      this.velocity.x = -this.xVelocity;
      this.moved = true;
    }

    const upPressed = Boolean(this.pressedKeys[this.keypress.up]);
    if (upPressed && this.hasSupport() && !this._jumpPressedLatch) {
      this.verticalVelocity = this.jumpVelocity;
      this.isGrounded = false;
      this._groundedThisFrame = false;
      this._skipGravityThisFrame = false;
      this._jumpPressedLatch = true;
      this.moved = true;
      this.onJump();
    }

    if (!upPressed) {
      this._jumpPressedLatch = false;
    }
  }

  updateDirection() {
    if (this.pressedKeys[this.keypress.right]) {
      this.direction = 'right';
    } else if (this.pressedKeys[this.keypress.left]) {
      this.direction = 'left';
    }
  }

  update() {
    if (this.gameEnv?.gameControl?.isPaused) {
      this.draw();
      return;
    }

    this.updateController();
    this.updateVelocity();
    this.updateDirection();

    if (!this._skipGravityThisFrame) {
      this.verticalVelocity -= this.gravityAcceleration;
    }
    this._groundedThisFrame = false;
    this._skipGravityThisFrame = false;

    // Positive verticalVelocity is upward; canvas Y increases downward.
    this.velocity.y = -this.verticalVelocity;
    // Resolve platform contacts after movement, without Player's second gravity pass.
    this.move();
    this.draw();
    this.collisionChecks();
    this.setupCanvas();

    this.isGrounded = this._groundedThisFrame;
    this.velocity.y = -this.verticalVelocity;
  }
}
