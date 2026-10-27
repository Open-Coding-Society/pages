import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';

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

class GameLevelNightcity {
  constructor(gameEnv = {}) {
    const background_data = {
      name: "Night City Course",
      greeting: "Welcome to the Night City!",
      src: "/images/projects/racing-game/nightcitylevel.png",
      pixels: { height: 522, width: 815 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Directions_red_car.png",
        INIT_POSITION: { x: 0.47, y: 0.76 },
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1600,
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
    const trackBarrierData = [
      {
        id: 'nightcity-outer-track-barrier',
        visible: false,
        collisionWidth: 12,
        coordinateSpace: 'normalized',
        splinePoints: [
          { x: 0.13, y: 0.24 },
          { x: 0.19, y: 0.21 },
          { x: 0.25, y: 0.24 },
          { x: 0.31, y: 0.30 },
          { x: 0.38, y: 0.32 },
          { x: 0.44, y: 0.29 },
          { x: 0.49, y: 0.26 },
          { x: 0.55, y: 0.29 },
          { x: 0.61, y: 0.36 },
          { x: 0.67, y: 0.39 },
          { x: 0.74, y: 0.37 },
          { x: 0.82, y: 0.35 },
          { x: 0.88, y: 0.39 },
          { x: 0.91, y: 0.45 },
          { x: 0.89, y: 0.51 },
          { x: 0.85, y: 0.54 },
          { x: 0.79, y: 0.54 },
          { x: 0.73, y: 0.51 },
          { x: 0.67, y: 0.47 },
          { x: 0.62, y: 0.47 },
          { x: 0.59, y: 0.52 },
          { x: 0.60, y: 0.58 },
          { x: 0.65, y: 0.62 },
          { x: 0.72, y: 0.62 },
          { x: 0.79, y: 0.61 },
          { x: 0.85, y: 0.65 },
          { x: 0.88, y: 0.71 },
          { x: 0.87, y: 0.77 },
          { x: 0.83, y: 0.81 },
          { x: 0.77, y: 0.82 },
          { x: 0.71, y: 0.79 },
          { x: 0.67, y: 0.75 },
          { x: 0.64, y: 0.70 },
          { x: 0.60, y: 0.68 },
          { x: 0.56, y: 0.70 },
          { x: 0.54, y: 0.75 },
          { x: 0.56, y: 0.80 },
          { x: 0.61, y: 0.83 },
          { x: 0.66, y: 0.84 }
        ]
      },
      {
        id: 'nightcity-inner-track-barrier',
        visible: false,
        collisionWidth: 12,
        coordinateSpace: 'normalized',
        splinePoints: [
          { x: 0.39, y: 0.36 },
          { x: 0.33, y: 0.37 },
          { x: 0.28, y: 0.34 },
          { x: 0.24, y: 0.30 },
          { x: 0.20, y: 0.29 },
          { x: 0.16, y: 0.31 },
          { x: 0.14, y: 0.36 },
          { x: 0.16, y: 0.40 },
          { x: 0.21, y: 0.42 },
          { x: 0.28, y: 0.43 },
          { x: 0.34, y: 0.41 },
          { x: 0.40, y: 0.37 },
          { x: 0.46, y: 0.35 },
          { x: 0.51, y: 0.37 },
          { x: 0.55, y: 0.42 },
          { x: 0.56, y: 0.47 },
          { x: 0.53, y: 0.51 },
          { x: 0.48, y: 0.53 },
          { x: 0.43, y: 0.56 },
          { x: 0.40, y: 0.61 },
          { x: 0.41, y: 0.66 },
          { x: 0.45, y: 0.70 },
          { x: 0.51, y: 0.72 },
          { x: 0.56, y: 0.71 },
          { x: 0.60, y: 0.69 },
          { x: 0.63, y: 0.67 },
          { x: 0.67, y: 0.67 },
          { x: 0.70, y: 0.70 },
          { x: 0.72, y: 0.74 },
          { x: 0.71, y: 0.78 },
          { x: 0.68, y: 0.80 },
          { x: 0.63, y: 0.79 },
          { x: 0.59, y: 0.76 },
          { x: 0.55, y: 0.72 },
          { x: 0.51, y: 0.70 },
          { x: 0.48, y: 0.71 },
          { x: 0.46, y: 0.75 },
          { x: 0.47, y: 0.79 },
          { x: 0.51, y: 0.82 }
        ]
      }
    ];
    this.classes = [
        {class: GameEnvBackground, data: background_data},
        {class: Player, data: player_data},
        {class: TimeLapScreen, data: timer_data},
        ...trackBarrierData.map((data) => ({ class: SplineBarrier, data }))
    ];
  }
}

export default GameLevelNightcity;