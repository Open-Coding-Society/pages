import Player from './Player.js';

const DEFAULT_DRIVER_PHYSICS = Object.freeze({
  maxSpeed: 6,
  reverseSpeed: 2,
  acceleration: 0.2,
  braking: 0.2,
  coasting: 0.05,
  turnRate: 0.1,
});

export function getDriverTurnRate(speed, { maxSpeed, turnRate }) {
  if (speed === 0) return 0;
  const speedFraction = Math.min(Math.abs(speed) / maxSpeed, 1);
  return turnRate * (1 - 0.1 * speedFraction);
}

export default class PlayerDriver extends Player {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);

    Object.assign(this, DEFAULT_DRIVER_PHYSICS, data.driverPhysics);
    this.speed = 0;
    this.heading = Number.isFinite(data.heading) ? data.heading : 0;
    this.gravity = false;
    this.updateDirection();
  }

  updateDirection() {
    this.direction = 'up';
  }

  updateVelocity() {
    this.moved = Object.values(this.pressedKeys).some(Boolean);
  }

  getTurnRate(speed) {
    return getDriverTurnRate(speed, this);
  }

  update() {
    if (this.gameEnv?.gameControl?.isPaused) {
      super.update();
      return;
    }

    this.updateController();
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
      this.heading += steering * this.getTurnRate(this.speed) * Math.sign(this.speed);
    }

    this.updateDirection();
    this.velocity.x = Math.sin(this.heading) * this.speed;
    this.velocity.y = this.speed === 0 ? 0 : -Math.cos(this.heading) * this.speed;
    this.moved = this.speed !== 0;

    super.update(false);
  }
}
