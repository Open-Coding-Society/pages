import Player from './Player.js';
import Barrier from './Barrier.js';

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

  /** Hitbox insets on each side, from the player's hitbox percentages. */
  getCollisionInsets() {
    return {
      left: this.width * (this.hitbox?.widthPercentage || 0) / 2,
      right: this.width * (this.hitbox?.widthPercentage || 0) / 2,
      top: this.height * (this.hitbox?.heightPercentage || 0) / 2,
      bottom: this.height * (this.hitbox?.heightPercentage || 0) / 2,
    };
  }

  getWorldCollisionBounds() {
    const insets = this.getCollisionInsets();
    return {
      left: this.position.x + insets.left,
      right: this.position.x + this.width - insets.right,
      top: this.position.y + insets.top,
      bottom: this.position.y + this.height - insets.bottom,
    };
  }

  /** The game object the latest collision touched, if it is still in the level. */
  getCollidedObject() {
    const otherId = this.collisionData?.touchPoints?.other?.id;
    if (!otherId || !this.gameEnv?.gameObjects) return null;
    return this.gameEnv.gameObjects.find((obj) => obj?.canvas?.id === otherId) || null;
  }

  /**
   * Barrier contacts act as platforms: land on top, stop under a ceiling, and
   * stop at a side wall. Other objects keep the normal Player collision rules.
   */
  handleCollisionState() {
    const touchPoints = this.collisionData?.touchPoints?.this;
    if (!touchPoints) return;

    const platform = this.getCollidedObject();
    if (!(platform instanceof Barrier)) {
      super.handleCollisionState();
      return;
    }

    const bounds = this.getWorldCollisionBounds();
    const radius = Math.min(bounds.right - bounds.left, bounds.bottom - bounds.top)
      * (this.hitbox?.radiusPercentage ?? 0.5);
    const isFallingOrResting = this.verticalVelocity <= 0;
    const isRising = this.verticalVelocity > 0;

    // Resolve one contact face; overlapping top/side extents must not cancel a jump.
    if (touchPoints.top) {
      if (isFallingOrResting) {
        this.position.y = platform.y - this.height / 2 - radius;
        this.land();
      }
    } else if (touchPoints.bottom && isRising) {
      this.position.y = platform.y + platform.height - this.height / 2 + radius;
      this.hitCeiling();
    } else if (touchPoints.left) {
      this.velocity.x = 0;
      this.position.x = platform.x - this.width / 2 - radius;
    } else if (touchPoints.right) {
      this.velocity.x = 0;
      this.position.x = platform.x + platform.width - this.width / 2 + radius;
    }
    this.setupCanvas();
  }

  handleCollisionReaction(other) {
    // Platforms are handled in handleCollisionState, not as a bump reaction.
    if (this.getCollidedObject() instanceof Barrier) return;
    super.handleCollisionReaction(other);
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
