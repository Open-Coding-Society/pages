import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';

export default class IdentityForgeGate {
  constructor(env) {
    const gate = env.game.environment.identityCookieGate;
    const sprites = [
      `${env.path}/hacks/cookie-clicker/assets/baseCookie.png`,
      `${env.path}/hacks/cookie-clicker/assets/grandma.png`,
    ];
    this.classes = [{
      class: Clicker,
      data: {
        id: 'Identity Gate Cookie',
        greeting: false,
        src: sprites[0],
        SCALE_FACTOR: 7,
        pixels: { height: 512, width: 512 },
        INIT_POSITION: { x: 0, y: 0 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        up: { row: 0, start: 0, columns: 1 },
        left: { row: 0, start: 0, columns: 1 },
        right: { row: 0, start: 0, columns: 1 },
        walkingArea: {
          xMin: gate.width * 0.05,
          xMax: gate.width * 0.95,
          yMin: gate.height * 0.08,
          yMax: gate.height * 0.92,
        },
        speed: 1.2,
        moveDirection: { x: 1, y: 1 },
        drawCounter: false,
        interact(_clicks, _id, cookie) {
          if (gate.isPaused() || cookie.gateCollected) return;
          cookie.gateCollected = true;
          cookie.visible = false;
          cookie.canvas.style.display = 'none';
          gate.onCollect();
        },
      },
      spawn: {
        count: 5,
        ranges: {
          INIT_POSITION: {
            x: [gate.width * 0.05, gate.width * 0.8],
            y: [gate.height * 0.1, gate.height * 0.75],
          },
          speed: [0.9, 1.9],
        },
        pickOne: {
          src: sprites,
          moveDirection: [{ x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }],
        },
      },
    }];
    this.gate = gate;
    this.env = env;
    this.onKey = event => {
      if (event.code !== 'Space' || event.repeat || this.isComplete() || this.gate.isPaused()) return;
      event.preventDefault();
      const cookie = this.env.gameObjects.find(object => object instanceof Clicker && !object.gateCollected);
      cookie?.handleClick();
    };
    document.addEventListener('keydown', this.onKey);
  }

  getProgress() {
    return this.gate.progress;
  }

  isComplete() {
    return this.gate.progress.current >= this.gate.progress.goal;
  }

  onComplete() {
    return this.gate.save();
  }

  destroy() {
    document.removeEventListener('keydown', this.onKey);
  }
}
