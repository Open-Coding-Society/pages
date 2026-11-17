import GameObject from './GameObject.js';
import LapTracker from './LapTracker.js';
import PlayerDriver from './PlayerDriver.js';

const CHECKER_SIZE = 8;

/**
 * LapRace - a basic lap race for any level with PlayerDriver cars.
 *
 * Data:
 * - totalLaps: laps needed to win (default 3)
 * - finishLine, checkpoint: { x, top, bottom } in 0-1 canvas coordinates (see LapTracker)
 *
 * It draws the finish line, a lap and time panel, and a winner banner, and it
 * stops every car once someone has won. Games that need more (boosts, bots,
 * restart prompts) can extend it or use LapTracker directly.
 */
export default class LapRace extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.totalLaps = Number.isInteger(data.totalLaps) ? data.totalLaps : 3;
    this.finishLine = data.finishLine;
    this.lapTracker = new LapTracker({
      finishLine: data.finishLine,
      checkpoint: data.checkpoint,
      totalLaps: this.totalLaps,
    });
    this.elapsedMs = 0;
    this.lastFrameAt = null;
    this.raceStarted = false;
    this.winnerName = null;
  }

  getCars() {
    return (this.gameEnv?.gameObjects || []).filter((object) => object instanceof PlayerDriver);
  }

  update() {
    const isPaused = Boolean(this.gameEnv?.gameControl?.isPaused);
    if (!isPaused) {
      this.trackLaps();
      this.updateTimer();
    }
    this.draw();
  }

  trackLaps() {
    for (const car of this.getCars()) {
      const center = car.getCenter();
      const normalized = { x: center.x / this.gameEnv.innerWidth, y: center.y / this.gameEnv.innerHeight };
      const justFinished = this.lapTracker.update(car, normalized);
      if (justFinished && this.winnerName === null) {
        this.winnerName = car.spriteData?.name || car.spriteData?.id || 'A car';
      }
      if (car.speed !== 0) this.raceStarted = true;
    }
    // Once someone wins, every car stops and ignores its keys.
    if (this.winnerName !== null) {
      for (const car of this.getCars()) {
        car.pressedKeys = {};
        car.speed = 0;
      }
    }
  }

  updateTimer() {
    const now = performance.now();
    const isRacing = this.raceStarted && this.winnerName === null && this.lastFrameAt !== null;
    if (isRacing) this.elapsedMs += now - this.lastFrameAt;
    this.lastFrameAt = now;
  }

  formatTime(ms) {
    const totalSeconds = Math.max(0, ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
  }

  draw() {
    const ctx = this.gameEnv?.ctx;
    if (!ctx) return;
    ctx.save();
    this.drawFinishLine(ctx);
    this.drawPanel(ctx);
    if (this.winnerName !== null) {
      this.drawBanner(ctx, `${this.winnerName} wins! ${this.formatTime(this.elapsedMs)}`);
    } else if (!this.raceStarted) {
      this.drawBanner(ctx, `Drive right over the finish line. ${this.totalLaps} laps to win!`);
    }
    ctx.restore();
  }

  drawFinishLine(ctx) {
    const x = this.finishLine.x * this.gameEnv.innerWidth;
    const top = this.finishLine.top * this.gameEnv.innerHeight;
    const bottom = this.finishLine.bottom * this.gameEnv.innerHeight;
    for (let row = 0; top + row * CHECKER_SIZE < bottom; row++) {
      for (let column = 0; column < 2; column++) {
        ctx.fillStyle = (row + column) % 2 === 0 ? '#ffffff' : '#111827';
        const height = Math.min(CHECKER_SIZE, bottom - (top + row * CHECKER_SIZE));
        ctx.fillRect(x - CHECKER_SIZE + column * CHECKER_SIZE, top + row * CHECKER_SIZE, CHECKER_SIZE, height);
      }
    }
  }

  drawPanel(ctx) {
    const cars = this.getCars();
    const width = 190;
    const height = 30 + cars.length * 20;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(8, 8, width, height);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(this.formatTime(this.elapsedMs), 16, 28);
    ctx.font = '13px sans-serif';
    cars.forEach((car, index) => {
      const laps = Math.min(this.lapTracker.getLapsCompleted(car), this.totalLaps);
      const name = car.spriteData?.name || `Car ${index + 1}`;
      ctx.fillText(`${name}: lap ${Math.min(laps + 1, this.totalLaps)}/${this.totalLaps}`, 16, 48 + index * 20);
    });
  }

  drawBanner(ctx, text) {
    const centerX = this.gameEnv.innerWidth / 2;
    const centerY = this.gameEnv.innerHeight / 2;
    ctx.font = 'bold 20px sans-serif';
    const width = ctx.measureText(text).width + 40;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(centerX - width / 2, centerY - 24, width, 48);
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.fillText(text, centerX, centerY + 7);
  }

  resize() {
    this.draw();
  }

  destroy() {
    const gameObjects = this.gameEnv?.gameObjects;
    const index = gameObjects ? gameObjects.indexOf(this) : -1;
    if (index !== -1) gameObjects.splice(index, 1);
  }
}
