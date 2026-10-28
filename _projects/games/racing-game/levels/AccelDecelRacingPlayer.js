import EnginePlayer from '@assets/js/GameEnginev1.1/essentials/Player.js';

const ARROW_KEYS = new Set([37, 38, 39, 40]);

export default class Player extends EnginePlayer {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.keysPressed = {};
    this.currentSpeed = data.currentSpeed ?? 0;
    this.maxSpeed = data.maxSpeed;
    this.acceleration = data.acceleration;
    this.deceleration = data.deceleration;
    this.reverseSpeed = data.reverseSpeed;
  }

  handleKeyDown(event) {
    const target = event.target;
    const editing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || '');
    const control = this.gameEnv?.gameControl;
    if (editing || event.altKey || event.ctrlKey || event.metaKey || !control || control.isPaused) return;
    if (this.gameEnv.container?.isConnected === false) return;

    this.keysPressed[event.keyCode] = true;

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

  updateMovementSpeed() {
    if (this.maxSpeed === undefined) return;

    const speedRatio = Math.min(Math.abs(this.currentSpeed) / this.maxSpeed, 1);
    this.xVelocity = (this.scale.width / this.stepFactor) * 3 * speedRatio;
    this.yVelocity = (this.scale.height / this.stepFactor) * 3 * speedRatio;
    this.updateVelocity();
  }
}