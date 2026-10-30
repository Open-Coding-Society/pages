import EnginePlayer from '@assets/js/GameEnginev1.1/essentials/Player.js';

export default class Player extends EnginePlayer {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);

    this.speed = 0;
    this.maxSpeed = 6;
    this.reverseSpeed = 2;
    this.acceleration = 0.20;
    this.braking = 0.2;
    this.coasting = 0.05;
    this.turnRate = 0.1 / speed;
    this.heading = 0; // Radians; 0 points upward.
    this.gravity = false;
    this.updateDirection();
  }

  updateDirection() {
    this.direction = 'up';
  }

  drawSprite() {
    if (!this.spriteReady) {
      this.drawDefaultSquare();
      return;
    }

    const pixels = this.spriteData.pixels || {
      width: this.spriteSheet.naturalWidth,
      height: this.spriteSheet.naturalHeight,
    };
    const orientation = this.spriteData.orientation || { rows: 1, columns: 1 };
    const frameWidth = Math.max(1, Math.round(pixels.width / orientation.columns));
    const frameHeight = Math.max(1, Math.round(pixels.height / orientation.rows));
    const directionData = this.spriteData.up || {};
    const frameX = (directionData.start || 0) * frameWidth;
    const frameY = (directionData.row || 0) * frameHeight;
    const canvasSize = Math.max(frameWidth, frameHeight);

    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;

    this.ctx.save();
    this.ctx.translate(canvasSize / 2, canvasSize / 2);
    this.ctx.rotate(this.heading);
    this.ctx.drawImage(
      this.spriteSheet,
      frameX, frameY, frameWidth, frameHeight,
      -canvasSize / 2, -canvasSize / 2, canvasSize, canvasSize
    );
    this.ctx.restore();
  }

  // Engine input handlers call this on keydown/keyup.
  // Key presses update the sprite from the current heading, not the pressed key.
  updateVelocity() {
    this.moved = Object.values(this.pressedKeys).some(Boolean);
  }

  update() {
    if (this.gameEnv?.gameControl?.isPaused) {
      super.update();
      return;
    }

    const { up, down, left, right } = this.keypress;

    if (this.pressedKeys[up]) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else if (this.pressedKeys[down]) {
      this.speed = this.speed > 0
        ? Math.max(this.speed - this.braking, 0)
        : Math.max(this.speed - this.acceleration, -this.reverseSpeed);
    } else if (this.speed > 0) {
      this.speed = Math.max(this.speed - this.coasting, 0);
    } else {
      this.speed = Math.min(this.speed + this.coasting, 0);
    }

    const steering =
      (this.pressedKeys[right] ? 1 : 0) -
      (this.pressedKeys[left] ? 1 : 0);

    if (this.speed !== 0) {
      this.heading += steering * this.turnRate * Math.sign(this.speed);
    }

    this.updateDirection();
    this.velocity.x = Math.sin(this.heading) * this.speed;
    this.velocity.y = -Math.cos(this.heading) * this.speed;
    this.moved = this.speed !== 0;

    // Character uses this velocity for collision checks and movement.
    super.update();
  }
}