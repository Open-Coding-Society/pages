import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from './RacingPlayer.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';


class GameLevelNightCity {
 constructor(gameEnv) {
   const path = gameEnv.path;
   const background_data = {
     name: "Night City Course",
     greeting: "Welcome to the Night City!",
     src: path + '/images/projects/racing-game/nightcitylevel.png',
     pixels: { height: 360, width: 643 }
   };
   const player_data = {
       name: "Red Car",
       greeting: "I'm the red car!",
       src: path + '/images/projects/racing-game/Directions_red_car.png',
       SCALE_FACTOR: 20,
       STEP_FACTOR: 1100,
       INIT_POSITION: { x: 360 / 750, y: 500 / 570},
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
   }
   const other_data = {
       name: "Blue Car",
       greeting: "I'm the blue car!",
       src: path + '/images/projects/racing-game/Directions_blue_car.png',
       SCALE_FACTOR: 20,
       STEP_FACTOR: 1100,
       INIT_POSITION: {x: 340 / 740, y: 500 / 585},
       pixels: { height: 1024, width: 1536 },
       orientation: { rows: 4, columns: 4 },
       up:        { row: 3, start: 0, columns: 1 },
       upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
       right:     { row: 3, start: 2, columns: 1, rotate: Math.PI },
       downRight: { row: 2, start: 0, columns: 1 },
       down:      { row: 0, start: 0, columns: 1 },
       downLeft:  { row: 0, start: 2, columns: 1 },
       left:      { row: 3, start: 2, columns: 1 },
       upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
       hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
       keypress: { up: 38, left: 37, down: 40, right: 39 } // Arrow keys
   }
   const barrierData1 = {
     id: "barrier-2",
     coordinateSpace: "normalized",
     splinePoints: [{"x":0.4386,"y":0.9956},{"x":0.4372,"y":0.8907},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.3255,"y":0.8884},{"x":0.2055,"y":0.8661},{"x":0.1103,"y":0.7947},{"x":0.0745,"y":0.6965},{"x":0.0883,"y":0.6094},{"x":0.149,"y":0.5424},{"x":0.1972,"y":0.5402},{"x":0.251,"y":0.6049},{"x":0.3283,"y":0.6875},{"x":0.4124,"y":0.7121},{"x":0.5076,"y":0.7143},{"x":0.5793,"y":0.6831},{"x":0.5683,"y":0.6295},{"x":0.5255,"y":0.5916},{"x":0.4359,"y":0.5826},{"x":0.349,"y":0.5514},{"x":0.2828,"y":0.4755},{"x":0.1903,"y":0.4554},{"x":0.1338,"y":0.3929},{"x":0.1338,"y":0.2947},{"x":0.1834,"y":0.2277},{"x":0.2593,"y":0.2166},{"x":0.32,"y":0.2679},{"x":0.3986,"y":0.3192},{"x":0.4662,"y":0.2947},{"x":0.5214,"y":0.2344},{"x":0.5807,"y":0.2054},{"x":0.6979,"y":0.2188},{"x":0.8014,"y":0.2366},{"x":0.8648,"y":0.2902},{"x":0.9145,"y":0.4041},{"x":0.9131,"y":0.4956},{"x":0.8497,"y":0.5424},{"x":0.7572,"y":0.5424},{"x":0.7324,"y":0.5737},{"x":0.771,"y":0.6072},{"x":0.8345,"y":0.6116},{"x":0.8979,"y":0.6719},{"x":0.9255,"y":0.7634},{"x":0.891,"y":0.8505},{"x":0.7972,"y":0.8929},{"x":0.6731,"y":0.8929},{"x":0.5848,"y":0.8951},{"x":0.5821,"y":0.9911}],
     visible: false,
     hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
     fromOverlay: true,
   };
   const barrierData2 = {
     id: "barrier-3",
     coordinateSpace: "normalized",
     splinePoints: [{"x":0.5145,"y":0.8125},{"x":0.3034,"y":0.8058},{"x":0.189,"y":0.7523},{"x":0.1393,"y":0.6764},{"x":0.1393,"y":0.6764},{"x":0.1641,"y":0.625},{"x":0.1986,"y":0.6429},{"x":0.2372,"y":0.6965},{"x":0.3186,"y":0.7657},{"x":0.4676,"y":0.7857},{"x":0.6083,"y":0.7701},{"x":0.651,"y":0.6898},{"x":0.629,"y":0.5782},{"x":0.629,"y":0.5782},{"x":0.531,"y":0.5179},{"x":0.4331,"y":0.5157},{"x":0.3628,"y":0.4621},{"x":0.2897,"y":0.4018},{"x":0.2193,"y":0.3862},{"x":0.1917,"y":0.3326},{"x":0.1917,"y":0.3326},{"x":0.2179,"y":0.288},{"x":0.2538,"y":0.2947},{"x":0.3103,"y":0.3438},{"x":0.4179,"y":0.3907},{"x":0.4869,"y":0.3728},{"x":0.5545,"y":0.2969},{"x":0.6372,"y":0.2746},{"x":0.7683,"y":0.2924},{"x":0.7683,"y":0.2924},{"x":0.8428,"y":0.3795},{"x":0.8469,"y":0.4576},{"x":0.7683,"y":0.4621},{"x":0.68,"y":0.5134},{"x":0.6634,"y":0.6049},{"x":0.7255,"y":0.6674},{"x":0.8179,"y":0.6942},{"x":0.8441,"y":0.759},{"x":0.8014,"y":0.8036},{"x":0.5145,"y":0.8125}],
     visible: false,
     hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
     fromOverlay: true,
   };
   const barrierData3 = {
     id: "barrier-4",
     coordinateSpace: "normalized",
     splinePoints: [{"x":0.4474,"y":0.9352},{"x":0.4568,"y":0.933},{"x":0.458,"y":0.9932}],
     visible: false,
     hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
     fromOverlay: true,
   };
   const barrierData4 = {
     id: "barrier-5",
     coordinateSpace: "normalized",
     splinePoints: [{"x":0.4386,"y":0.9956},{"x":0.4372,"y":0.8907},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.3255,"y":0.8884},{"x":0.2055,"y":0.8661},{"x":0.1103,"y":0.7947},{"x":0.0745,"y":0.6965},{"x":0.0883,"y":0.6094},{"x":0.149,"y":0.5424},{"x":0.1972,"y":0.5402},{"x":0.251,"y":0.6049},{"x":0.3283,"y":0.6875},{"x":0.4124,"y":0.7121},{"x":0.5076,"y":0.7143},{"x":0.5793,"y":0.6831},{"x":0.5683,"y":0.6295},{"x":0.5255,"y":0.5916},{"x":0.4359,"y":0.5826},{"x":0.349,"y":0.5514},{"x":0.2828,"y":0.4755},{"x":0.1903,"y":0.4554},{"x":0.1338,"y":0.3929},{"x":0.1338,"y":0.2947},{"x":0.1834,"y":0.2277},{"x":0.2593,"y":0.2166},{"x":0.32,"y":0.2679},{"x":0.3986,"y":0.3192},{"x":0.4662,"y":0.2947},{"x":0.5214,"y":0.2344},{"x":0.5807,"y":0.2054},{"x":0.6979,"y":0.2188},{"x":0.8014,"y":0.2366},{"x":0.8648,"y":0.2902},{"x":0.9145,"y":0.4041},{"x":0.9131,"y":0.4956},{"x":0.8497,"y":0.5424},{"x":0.7572,"y":0.5424},{"x":0.7324,"y":0.5737},{"x":0.771,"y":0.6072},{"x":0.8345,"y":0.6116},{"x":0.8979,"y":0.6719},{"x":0.9255,"y":0.7634},{"x":0.891,"y":0.8505},{"x":0.7972,"y":0.8929},{"x":0.6731,"y":0.8929},{"x":0.5848,"y":0.8951},{"x":0.5821,"y":0.9911}],
     visible: false,
     hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
     fromOverlay: true,
   };
  
   const lap_data = {
     totalLaps: 3,
     finishLine: { x: 0.568, top: 0.841, bottom: 0.939 },
     drawFinishLine: true,
     hudPosition: { x: 0.01, y: 0.02 }
   };
   this.classes = [
       {class: GameEnvBackground, data: background_data},
       {class: Player, data: player_data},
       {class: Player, data: other_data},
       { class: SplineBarrier, data: barrierData1 },
       { class: SplineBarrier, data: barrierData2 },
       { class: SplineBarrier, data: barrierData3 },
       { class: SplineBarrier, data: barrierData4 },
       { class: TimeLapScreen, data: lap_data },
   ]
 }
}

class GameLevelNightCity {
  constructor(gameEnv) {
    const path = gameEnv.path;
import LapTracker from './LapTracker.js';

class TimeLapScreen extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.data = data;
    this.totalLaps = Number.isFinite(data.totalLaps) ? data.totalLaps : 3;
    this.currentLap = 1;
    this.startedAt = null;
    this.finishedAt = null;
    this.lapTracker = new LapTracker({
      finishLine: { x: 0.5, top: 0.7, bottom: 0.85 },
      checkpoint: { x: 0.5, top: 0.22, bottom: 0.34 },
      totalLaps: this.totalLaps,
    });
    this.player = gameEnv?.gameObjects?.find((object) => object instanceof NightCityPlayer);
    this.panel = { x: 18, y: 18, width: 240, height: 138 };
  }

  update() {
    if (this.player?.selected) {
      const now = performance.now();
      if (this.startedAt === null) {
        this.startedAt = now;
      }
      this.updateLapProgress(now);
    }
    this.draw();
  }

  updateLapProgress(now) {
    if (this.finishedAt !== null || !this.player) {
      return;
    }

    const center = this.player.getCenter();
    const position = {
      x: center.x / this.gameEnv.innerWidth,
      y: center.y / this.gameEnv.innerHeight
    };
    const justFinished = this.lapTracker.update(this.player, position);
    this.currentLap = Math.min(
      this.lapTracker.getLapsCompleted(this.player) + 1,
      this.totalLaps
    );
    if (justFinished) {
      this.finishedAt = now;
    }
  }

  draw() {
    const ctx = this.gameEnv && this.gameEnv.ctx;
    if (!ctx) {
      return;
    }

    const elapsedMs = this.startedAt === null
      ? 0
      : (this.finishedAt ?? performance.now()) - this.startedAt;
    const timeLabel = this.formatTime(elapsedMs);
    const lapLabel = this.finishedAt === null ? 'Lap ' + this.currentLap + '/' + this.totalLaps : 'FINISH!';
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

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(this.player?.getBoostLabel() || 'BOOST READY', x + 16, y + 105);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px sans-serif';
    ctx.fillText('WASD DRIVE   SPACE DRIFT   SHIFT BOOST', x + 16, y + 126);
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

class NightCityPlayer extends Player {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);
    this.isPlayer = true;
    this.selected = false;
    this.visible = false;
    this.heading = -Math.PI / 2;
    this.motionVelocity = { x: 0, y: 0 };
    this.lastPhysicsUpdate = performance.now();
    this.boostDuration = 3000;
    this.boostCooldown = 12000;
    this.boostEndsAt = 0;
    this.boostReadyAt = 0;
    this.normalTopSpeed = 0.34;
    this.boostTopSpeed = 0.38;
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode ?? event.which ?? (event.key === 'Shift' ? 16 : event.key === ' ' ? 32 : 0);
    if (keyCode === 16 || keyCode === 32) {
      event.preventDefault();
    }
    if (keyCode === 16 && !event.repeat) {
      this.activateBoost();
    }
    super.handleKeyDown({ keyCode });
  }

  handleKeyUp(event) {
    const keyCode = event.keyCode ?? event.which ?? (event.key === 'Shift' ? 16 : event.key === ' ' ? 32 : 0);
    super.handleKeyUp({ keyCode });
  }

  updateVelocity() {
    this.moved = Boolean(
      this.pressedKeys[this.keypress.up]
      || this.pressedKeys[this.keypress.down]
      || this.pressedKeys[this.keypress.left]
      || this.pressedKeys[this.keypress.right]
    );
  }

  updateDirection() {}

  selectCar(src) {
    this.spriteData.src = src;
    this.spriteReady = false;
    this.spriteSheet = new Image();
    this.spriteSheet.onload = () => {
      this.spriteReady = true;
      this.resize();
    };
    this.spriteSheet.onerror = () => {
      console.error(`Night City car sprite failed to load: ${src}`);
    };
    this.spriteSheet.src = src;
    this.lastPhysicsUpdate = performance.now();
    this.selected = true;
    this.visible = true;
  }

  activateBoost(now = performance.now()) {
    if (!this.selected || now < this.boostReadyAt) {
      return;
    }
    this.boostEndsAt = now + this.boostDuration;
    this.boostReadyAt = now + this.boostCooldown;
  }

  getBoostLabel(now = performance.now()) {
    if (now < this.boostEndsAt) {
      return `BOOST ${((this.boostEndsAt - now) / 1000).toFixed(1)}s`;
    }
    if (now < this.boostReadyAt) {
      return `BOOST RECHARGING ${Math.ceil((this.boostReadyAt - now) / 1000)}s`;
    }
    return 'BOOST READY';
  }

  update() {
    if (!this.selected) {
      this.draw();
      return;
    }

    if (this.gameEnv?.gameControl?.isPaused) {
      this.draw();
      return;
    }

    this.updateDrivingPhysics(performance.now());
    super.update();
  }

  updateDrivingPhysics(now) {
    const elapsedSeconds = Math.min(Math.max(now - this.lastPhysicsUpdate, 0), 50) / 1000;
    this.lastPhysicsUpdate = now;
    if (elapsedSeconds === 0) return;

    const steering = Number(Boolean(this.pressedKeys[this.keypress.right]))
      - Number(Boolean(this.pressedKeys[this.keypress.left]));
    const throttle = Number(Boolean(this.pressedKeys[this.keypress.up]))
      - Number(Boolean(this.pressedKeys[this.keypress.down]));
    const driftRequested = this.pressedKeys[32] && steering !== 0;

    const referenceSize = Math.min(this.gameEnv.innerWidth, this.gameEnv.innerHeight);
    const normalTopSpeed = referenceSize * this.normalTopSpeed;
    const topSpeed = referenceSize * (now < this.boostEndsAt ? this.boostTopSpeed : this.normalTopSpeed);
    const currentSpeed = Math.hypot(this.motionVelocity.x, this.motionVelocity.y);
    const speedRatio = Math.min(currentSpeed / Math.max(normalTopSpeed * 0.65, 1), 1);
    const reverse = Math.cos(this.heading) * this.motionVelocity.x
      + Math.sin(this.heading) * this.motionVelocity.y < -1;

    this.heading += steering * (reverse ? -1 : 1) * 2.2 * (0.25 + speedRatio * 0.75) * elapsedSeconds;
    this.heading = ((this.heading + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

    const forwardX = Math.cos(this.heading);
    const forwardY = Math.sin(this.heading);
    const rightX = -forwardY;
    const rightY = forwardX;
    let forwardSpeed = this.motionVelocity.x * forwardX + this.motionVelocity.y * forwardY;
    let lateralSpeed = this.motionVelocity.x * rightX + this.motionVelocity.y * rightY;

    forwardSpeed += throttle * referenceSize * 0.72 * elapsedSeconds;
    if (now < this.boostEndsAt && forwardSpeed > 0) {
      forwardSpeed += referenceSize * 0.38 * elapsedSeconds;
    }
    forwardSpeed = Math.max(-referenceSize * 0.1, forwardSpeed);
    forwardSpeed *= Math.exp(-0.45 * elapsedSeconds);
    lateralSpeed *= Math.exp(-(driftRequested ? 1.4 : 7) * elapsedSeconds);

    const speed = Math.hypot(forwardSpeed, lateralSpeed);
    if (speed > topSpeed) {
      const speedScale = topSpeed / speed;
      forwardSpeed *= speedScale;
      lateralSpeed *= speedScale;
    }

    this.motionVelocity.x = forwardX * forwardSpeed + rightX * lateralSpeed;
    this.motionVelocity.y = forwardY * forwardSpeed + rightY * lateralSpeed;
    this.direction = this.getSpriteDirection();
    this.velocity.x = this.motionVelocity.x * elapsedSeconds;
    this.velocity.y = this.motionVelocity.y * elapsedSeconds;
  }

  getSpriteDirection() {
    const octant = (Math.round(this.heading / (Math.PI / 4)) + 8) % 8;
    return ['right', 'downRight', 'down', 'downLeft', 'left', 'upLeft', 'up', 'upRight'][octant];
  }
}

class NightCityCarSelection extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.player = gameEnv?.gameObjects?.find((object) => object instanceof NightCityPlayer);
    if (!this.player) {
      throw new Error('Night City car selection requires a NightCityPlayer');
    }

    this.element = document.createElement('div');
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-labelledby', 'nightcity-car-title');
    Object.assign(this.element.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '30',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2, 6, 23, 0.68)',
      fontFamily: 'sans-serif'
    });

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      padding: '24px',
      border: '2px solid #facc15',
      borderRadius: '12px',
      background: '#0f172a',
      color: '#f8fafc',
      textAlign: 'center'
    });

    const title = document.createElement('h2');
    title.id = 'nightcity-car-title';
    title.textContent = 'Choose your car';
    panel.appendChild(title);

    const buttons = document.createElement('div');
    Object.assign(buttons.style, { display: 'flex', gap: '12px', justifyContent: 'center' });
    buttons.append(
    this.createCarButton('Red car', '#dc2626', '/images/projects/racing-game/Red_Car.png'),
    this.createCarButton('Blue car', '#2563eb', '/images/projects/racing-game/Blue_Car.png')
    );
    panel.appendChild(buttons);
    this.element.appendChild(panel);
    gameEnv.container.appendChild(this.element);
  }

  createCarButton(label, color, sprite) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', `Choose the ${label.toLowerCase()}`);
    Object.assign(button.style, {
      padding: '12px 20px',
      border: '0',
      borderRadius: '8px',
      background: color,
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    });
    button.addEventListener('click', () => {
      this.player.selectCar(sprite);
      this.element.remove();
    });
    return button;
  }

  update() {}

  draw() {}

  resize() {}

  destroy() {
    this.element.remove();
    const index = this.gameEnv?.gameObjects?.indexOf(this) ?? -1;
    if (index >= 0) this.gameEnv.gameObjects.splice(index, 1);
  }
}

class GameLevelNightcity {
  constructor(gameEnv = {}) {
    const background_data = {
      name: "Night City Course",
      greeting: "Welcome to the Night City!",
      src: path + '/images/projects/racing-game/nightcitylevel.png',
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: path + '/images/projects/racing-game/Directions_red_car.png',
        SCALE_FACTOR: 20,
        STEP_FACTOR: 1100,
        INIT_POSITION: { x: 360 / 750, y: 500 / 570},
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
    }
    const other_data = {
        name: "Blue Car",
        greeting: "I'm the blue car!",
        src: path + '/images/projects/racing-game/Directions_blue_car.png',
        SCALE_FACTOR: 20,
        STEP_FACTOR: 1100,
        INIT_POSITION: {x: 340 / 740, y: 500 / 585},
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 3, start: 2, columns: 1, rotate: Math.PI },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        keypress: { up: 38, left: 37, down: 40, right: 39 } // Arrow keys
    }
    const barrierData1 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.4386,"y":0.9956},{"x":0.4372,"y":0.8907},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.3255,"y":0.8884},{"x":0.2055,"y":0.8661},{"x":0.1103,"y":0.7947},{"x":0.0745,"y":0.6965},{"x":0.0883,"y":0.6094},{"x":0.149,"y":0.5424},{"x":0.1972,"y":0.5402},{"x":0.251,"y":0.6049},{"x":0.3283,"y":0.6875},{"x":0.4124,"y":0.7121},{"x":0.5076,"y":0.7143},{"x":0.5793,"y":0.6831},{"x":0.5683,"y":0.6295},{"x":0.5255,"y":0.5916},{"x":0.4359,"y":0.5826},{"x":0.349,"y":0.5514},{"x":0.2828,"y":0.4755},{"x":0.1903,"y":0.4554},{"x":0.1338,"y":0.3929},{"x":0.1338,"y":0.2947},{"x":0.1834,"y":0.2277},{"x":0.2593,"y":0.2166},{"x":0.32,"y":0.2679},{"x":0.3986,"y":0.3192},{"x":0.4662,"y":0.2947},{"x":0.5214,"y":0.2344},{"x":0.5807,"y":0.2054},{"x":0.6979,"y":0.2188},{"x":0.8014,"y":0.2366},{"x":0.8648,"y":0.2902},{"x":0.9145,"y":0.4041},{"x":0.9131,"y":0.4956},{"x":0.8497,"y":0.5424},{"x":0.7572,"y":0.5424},{"x":0.7324,"y":0.5737},{"x":0.771,"y":0.6072},{"x":0.8345,"y":0.6116},{"x":0.8979,"y":0.6719},{"x":0.9255,"y":0.7634},{"x":0.891,"y":0.8505},{"x":0.7972,"y":0.8929},{"x":0.6731,"y":0.8929},{"x":0.5848,"y":0.8951},{"x":0.5821,"y":0.9911}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-3",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.5145,"y":0.8125},{"x":0.3034,"y":0.8058},{"x":0.189,"y":0.7523},{"x":0.1393,"y":0.6764},{"x":0.1393,"y":0.6764},{"x":0.1641,"y":0.625},{"x":0.1986,"y":0.6429},{"x":0.2372,"y":0.6965},{"x":0.3186,"y":0.7657},{"x":0.4676,"y":0.7857},{"x":0.6083,"y":0.7701},{"x":0.651,"y":0.6898},{"x":0.629,"y":0.5782},{"x":0.629,"y":0.5782},{"x":0.531,"y":0.5179},{"x":0.4331,"y":0.5157},{"x":0.3628,"y":0.4621},{"x":0.2897,"y":0.4018},{"x":0.2193,"y":0.3862},{"x":0.1917,"y":0.3326},{"x":0.1917,"y":0.3326},{"x":0.2179,"y":0.288},{"x":0.2538,"y":0.2947},{"x":0.3103,"y":0.3438},{"x":0.4179,"y":0.3907},{"x":0.4869,"y":0.3728},{"x":0.5545,"y":0.2969},{"x":0.6372,"y":0.2746},{"x":0.7683,"y":0.2924},{"x":0.7683,"y":0.2924},{"x":0.8428,"y":0.3795},{"x":0.8469,"y":0.4576},{"x":0.7683,"y":0.4621},{"x":0.68,"y":0.5134},{"x":0.6634,"y":0.6049},{"x":0.7255,"y":0.6674},{"x":0.8179,"y":0.6942},{"x":0.8441,"y":0.759},{"x":0.8014,"y":0.8036},{"x":0.5145,"y":0.8125}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData3 = {
      id: "barrier-4",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.4474,"y":0.9352},{"x":0.4568,"y":0.933},{"x":0.458,"y":0.9932}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData4 = {
      id: "barrier-5",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.4386,"y":0.9956},{"x":0.4372,"y":0.8907},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.4372,"y":0.8929},{"x":0.3255,"y":0.8884},{"x":0.2055,"y":0.8661},{"x":0.1103,"y":0.7947},{"x":0.0745,"y":0.6965},{"x":0.0883,"y":0.6094},{"x":0.149,"y":0.5424},{"x":0.1972,"y":0.5402},{"x":0.251,"y":0.6049},{"x":0.3283,"y":0.6875},{"x":0.4124,"y":0.7121},{"x":0.5076,"y":0.7143},{"x":0.5793,"y":0.6831},{"x":0.5683,"y":0.6295},{"x":0.5255,"y":0.5916},{"x":0.4359,"y":0.5826},{"x":0.349,"y":0.5514},{"x":0.2828,"y":0.4755},{"x":0.1903,"y":0.4554},{"x":0.1338,"y":0.3929},{"x":0.1338,"y":0.2947},{"x":0.1834,"y":0.2277},{"x":0.2593,"y":0.2166},{"x":0.32,"y":0.2679},{"x":0.3986,"y":0.3192},{"x":0.4662,"y":0.2947},{"x":0.5214,"y":0.2344},{"x":0.5807,"y":0.2054},{"x":0.6979,"y":0.2188},{"x":0.8014,"y":0.2366},{"x":0.8648,"y":0.2902},{"x":0.9145,"y":0.4041},{"x":0.9131,"y":0.4956},{"x":0.8497,"y":0.5424},{"x":0.7572,"y":0.5424},{"x":0.7324,"y":0.5737},{"x":0.771,"y":0.6072},{"x":0.8345,"y":0.6116},{"x":0.8979,"y":0.6719},{"x":0.9255,"y":0.7634},{"x":0.891,"y":0.8505},{"x":0.7972,"y":0.8929},{"x":0.6731,"y":0.8929},{"x":0.5848,"y":0.8951},{"x":0.5821,"y":0.9911}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    
    const lap_data = {
      totalLaps: 3,
      finishLine: { x: 0.568, top: 0.841, bottom: 0.939 },
      drawFinishLine: true,
      hudPosition: { x: 0.01, y: 0.02 }
    const timer_data = {
      totalLaps: 3
    };
    this.classes = [
        {class: GameEnvBackground, data: background_data},
        {class: Player, data: player_data},
        {class: Player, data: other_data},
        { class: SplineBarrier, data: barrierData1 },
        { class: SplineBarrier, data: barrierData2 },
        { class: SplineBarrier, data: barrierData3 },
        { class: SplineBarrier, data: barrierData4 },
        { class: TimeLapScreen, data: lap_data },
    ]
  }
  destroy () {
    cleanupRacingLevel(this.gameEnv);
  }
}

export default GameLevelNightCity;
