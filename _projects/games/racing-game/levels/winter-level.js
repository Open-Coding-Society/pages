import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';

class TimeLapScreen extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.data = data;
    this.totalLaps = Number.isFinite(data.totalLaps) ? data.totalLaps : 3;
    this.currentLap = Number.isFinite(data.currentLap) ? data.currentLap : 1;
    this.startedAt = performance.now();
    this.panel = { x: 18, y: 18, width: 240, height: 92 };
  }

  update() {
    this.draw();
  }

  draw() {
    const ctx = this.gameEnv && this.gameEnv.ctx;
    if (!ctx) {
      return;
    }

    const elapsedMs = performance.now() - this.startedAt;
    const timeLabel = this.formatTime(elapsedMs);
    const lapLabel = 'Lap ' + this.currentLap + '/' + this.totalLaps;
    const { x, y, width, height } = this.panel;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TIME', x + 16, y + 28);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(timeLabel, x + 16, y + 56);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('LAP', x + 16, y + 80);
    ctx.fillStyle = '#bbf7d0';
    ctx.fillText(lapLabel, x + 72, y + 80);
  }

  formatTime(ms) {
    const totalSeconds = Math.max(0, ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds * 10) % 10);
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + tenths;
  }

  resize() {
    this.draw();
  }

  destroy() {
    const gameObjects = this.gameEnv && this.gameEnv.gameObjects;
    const index = gameObjects ? gameObjects.indexOf(this) : -1;
    if (index !== -1 && gameObjects) {
      gameObjects.splice(index, 1);
    }
  }
}

class GameLevelWinter {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
      name: "Winter Course",
      greeting: "Welcome to the Winter Level!",
      src: "/images/projects/racing-game/Winter_Track.png",
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        SCALE_FACTOR: 20,
        STEP_FACTOR: 1200,
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 1, start: 0, columns: 1 },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };
    const timer_data = {
      currentLap: 1,
      totalLaps: 3
    };
    this.classes = [
        {class: GameEnvBackground, data: background_data},
        {class: Player, data: player_data},
        {class: TimeLapScreen, data: timer_data}
    ];
  }
}

export default GameLevelWinter;