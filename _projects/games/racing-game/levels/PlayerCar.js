import PlayerDriver from '@assets/js/GameEnginev1.1/essentials/PlayerDriver.js';
import { getRacingTurnRate, RACING_CAR_PHYSICS } from './RacingCarPhysics.js';

export default class Player extends PlayerDriver {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);

    Object.assign(this, RACING_CAR_PHYSICS);
  }

  getTurnRate(speed) {
    return getRacingTurnRate(speed);
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

  update() {
    if (this.gameEnv?.gameControl?.isPaused) {
      super.update();
      return;
    }
    if (this.raceFinished) {
      this.pressedKeys = {};
      this.speed = 0;
      this.velocity.x = 0;
      this.velocity.y = 0;
      super.update();
      return;
    }
    super.update();
  }
}