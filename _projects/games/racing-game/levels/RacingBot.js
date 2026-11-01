import PlayerCar from './PlayerCar.js';
import { AUTUMN_BOT_GENOME } from './AutumnBotGenome.js';
import {
  AUTUMN_TRACK_CENTERLINE,
  createRouteFromGenome,
  getBotControls,
  hasReachedRouteWaypoint,
} from './AutumnBotGenetics.js';

const MODES = {
  hardcoded: { label: 'Easy bot' },
  ai: { label: 'Hard bot' },
};

export default class RacingBot extends PlayerCar {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);
    this.heading = Math.PI / 2;
    this.waypointIndex = 1;
    this.setMode('hardcoded');
  }

  handleKeyDown() {}

  handleKeyUp() {}

  get isPlayer() {
    return true;
  }

  setMode(mode) {
    const settings = MODES[mode];
    if (!settings) {
      throw new RangeError(`Unknown racing bot mode: ${mode}`);
    }

    this.mode = mode;
    this.controlLabel = settings.label;
    this.waypointIndex = 1;
    this.route = mode === 'ai'
      ? createRouteFromGenome(AUTUMN_BOT_GENOME)
      : AUTUMN_TRACK_CENTERLINE;
  }

  updateBotControls() {
    const center = this.getCenter();
    const reachDistance = Math.min(this.gameEnv.innerWidth, this.gameEnv.innerHeight) * 0.025;

    if (hasReachedRouteWaypoint(
      center,
      this.route,
      this.waypointIndex,
      this.gameEnv.innerWidth,
      this.gameEnv.innerHeight,
      reachDistance,
    )) {
      this.waypointIndex = (this.waypointIndex + 1) % this.route.length;
    }

    const control = getBotControls({
      position: center,
      heading: this.heading,
      speed: this.speed,
      waypointIndex: this.waypointIndex,
      route: this.route,
      width: this.gameEnv.innerWidth,
      height: this.gameEnv.innerHeight,
      mode: this.mode,
    });
    const { up, down, left, right } = this.keypress;
    this.pressedKeys = {};
    if (control.steer > 0) this.pressedKeys[right] = true;
    if (control.steer < 0) this.pressedKeys[left] = true;
    if (control.throttle > 0) this.pressedKeys[up] = true;
    if (control.throttle < 0) this.pressedKeys[down] = true;
  }

  update() {
    if (this.gameEnv?.gameControl?.isPaused) return;
    this.updateBotControls();
    super.update();
  }

  destroy() {
    window.removeEventListener('keydown', this._boundHandleKeyDown);
    window.removeEventListener('keyup', this._boundHandleKeyUp);
    super.destroy();
  }
}
