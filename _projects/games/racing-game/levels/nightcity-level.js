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
    this.startedAt = null;
    this.finishedAt = null;
    this.lapArmed = false;
    this.previousPlayerPosition = null;
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
    const finishLineX = 0.5;
    const finishLineYMin = 0.7;
    const finishLineYMax = 0.85;

    if (!this.lapArmed) {
      if (Math.abs(position.x - finishLineX) >= 0.04) {
        this.lapArmed = true;
      }
      this.previousPlayerPosition = position;
      return;
    }

    const previousPosition = this.previousPlayerPosition;
    const crossedFinishLine = previousPosition
      && ((previousPosition.x < finishLineX && position.x >= finishLineX)
        || (previousPosition.x > finishLineX && position.x <= finishLineX))
      && previousPosition.y >= finishLineYMin
      && previousPosition.y <= finishLineYMax
      && position.y >= finishLineYMin
      && position.y <= finishLineYMax;

    if (crossedFinishLine) {
      this.currentLap = Math.min(this.currentLap + 1, this.totalLaps);
      this.lapArmed = false;
      if (this.currentLap >= this.totalLaps) {
        this.finishedAt = now;
      }
    }

    this.previousPlayerPosition = position;
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
      src: "/images/projects/racing-game/nightcitylevel.png",
      pixels: { height: 522, width: 815 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: "/images/projects/racing-game/Red_Car.png",
        INIT_POSITION: { x: 0.47, y: 0.76 },
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1600,
        pixels: { height: 768, width: 1152 },
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
        {class: NightCityPlayer, data: player_data},
        {class: NightCityCarSelection, data: {}},
        {class: TimeLapScreen, data: timer_data},
        ...trackBarrierData.map((data) => ({ class: SplineBarrier, data }))
    ];
  }
}

export default GameLevelNightcity;