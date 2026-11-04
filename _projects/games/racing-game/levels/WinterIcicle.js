import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

const TRACK_CENTERLINE = [
  { x: 0.08, y: 0.835 },
  { x: 0.2, y: 0.835 },
  { x: 0.36, y: 0.835 },
  { x: 0.52, y: 0.835 },
  { x: 0.68, y: 0.835 },
  { x: 0.8, y: 0.83 },
  { x: 0.85, y: 0.82 },
  { x: 0.89, y: 0.795 },
  { x: 0.915, y: 0.76 },
  { x: 0.925, y: 0.715 },
  { x: 0.925, y: 0.675 },
  { x: 0.91, y: 0.635 },
  { x: 0.885, y: 0.605 },
  { x: 0.85, y: 0.58 },
  { x: 0.81, y: 0.565 },
  { x: 0.78, y: 0.555 },
  { x: 0.755, y: 0.53 },
  { x: 0.74, y: 0.495 },
  { x: 0.74, y: 0.46 },
  { x: 0.755, y: 0.43 },
  { x: 0.78, y: 0.405 },
  { x: 0.815, y: 0.38 },
  { x: 0.855, y: 0.355 },
  { x: 0.89, y: 0.325 },
  { x: 0.915, y: 0.29 },
  { x: 0.915, y: 0.255 },
  { x: 0.895, y: 0.225 },
  { x: 0.865, y: 0.205 },
  { x: 0.81, y: 0.195 },
  { x: 0.68, y: 0.195 },
  { x: 0.52, y: 0.195 },
  { x: 0.36, y: 0.195 },
  { x: 0.25, y: 0.195 },
  { x: 0.205, y: 0.2 },
  { x: 0.165, y: 0.215 },
  { x: 0.13, y: 0.24 },
  { x: 0.1, y: 0.275 },
  { x: 0.08, y: 0.315 },
  { x: 0.08, y: 0.35 },
  { x: 0.095, y: 0.38 },
  { x: 0.12, y: 0.405 },
  { x: 0.16, y: 0.43 },
  { x: 0.2, y: 0.45 },
  { x: 0.235, y: 0.475 },
  { x: 0.26, y: 0.51 },
  { x: 0.27, y: 0.55 },
  { x: 0.265, y: 0.585 },
  { x: 0.245, y: 0.615 },
  { x: 0.215, y: 0.64 },
  { x: 0.175, y: 0.66 },
  { x: 0.14, y: 0.675 },
  { x: 0.12, y: 0.7 },
  { x: 0.11, y: 0.735 },
  { x: 0.115, y: 0.775 },
  { x: 0.135, y: 0.81 },
  { x: 0.16, y: 0.83 },
];

export function getRandomTrackPoint(random = Math.random) {
  const segment = Math.floor(random() * (TRACK_CENTERLINE.length - 1));
  const progress = random();
  const start = TRACK_CENTERLINE[segment];
  const end = TRACK_CENTERLINE[segment + 1];

  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}

export default class WinterIcicle extends Character {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.targetPoint = data.targetPosition;
    this.dropSpeed = data.dropSpeed ?? 8;
    this.landedDuration = data.landedDuration ?? 1400;
    this.landedAt = null;
    this.consumed = false;

    this.updateTargetPosition();
    this.position.x = this.targetPosition.x - this.width / 2;
    this.position.y = this.targetPosition.y - Math.min(140, gameEnv.innerHeight * 0.25);
  }

  resize() {
    super.resize();
    this.width = this.height * (408 / 612);
    if (this.targetPoint) this.updateTargetPosition();
  }

  updateTargetPosition() {
    this.targetPosition = {
      x: this.targetPoint.x * this.gameEnv.innerWidth,
      y: this.targetPoint.y * this.gameEnv.innerHeight - this.height / 2,
    };
  }

  update() {
    if (this.consumed) return;
    if (this.gameEnv?.gameControl?.isPaused) {
      this.draw();
      return;
    }

    this.draw();
    this.collisionChecks();

    if (this.position.y < this.targetPosition.y) {
      this.position.y = Math.min(this.position.y + this.dropSpeed, this.targetPosition.y);
    } else {
      this.landedAt ??= Date.now();
      if (Date.now() - this.landedAt >= this.landedDuration) this.consume();
    }
  }

  consume() {
    if (this.consumed) return;
    this.consumed = true;
    this.canvas?.remove();
    this.canvas = null;
  }
}
