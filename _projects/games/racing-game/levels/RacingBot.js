import PlayerCar from './PlayerCar.js';
import { AUTUMN_BOT_GENOME } from './AutumnBotGenome.js';
import {
  createEasyRoute,
  createRouteFromGenome,
  createSuperEasyRoute,
  advanceRouteWaypoint,
  getBotControls,
  recoverRouteWaypoint,
} from './AutumnBotGenetics.js';
import { getRacingTurnRate } from './RacingCarPhysics.js';

const MODES = {
  superEasy: { label: 'Easy bot' },
  hardcoded: { label: 'Medium bot' },
  ai: { label: 'Hard bot' },
};
const CONE_COLLISION_ID = 'cone-1';
const SPIN_SPEED = 0.8;
const SPIN_DISTANCE = Math.PI * 2;

export default class RacingBot extends PlayerCar {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);
    this.heading = Math.PI / 2;
    this.waypointIndex = 1;
    this.raceStarted = false;
    this.spinRecovery = null;
    this.routeSeed = Number.isInteger(data.routeSeed)
      ? data.routeSeed
      : Math.floor(Math.random() * 0x100000000);
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
    this.raceStarted = false;
    this.raceFinished = false;
    this.spinRecovery = null;
    this.route = mode === 'ai'
      ? createRouteFromGenome(AUTUMN_BOT_GENOME)
      : mode === 'superEasy' ? createSuperEasyRoute(this.routeSeed) : createEasyRoute();
  }

  updateBotControls() {
    const center = this.getCenter();
    const reachDistance = Math.min(this.gameEnv.innerWidth, this.gameEnv.innerHeight) * 0.025;
    if (this.mode === 'ai' && this.state?.collisionEvents?.length) {
      this.waypointIndex = recoverRouteWaypoint(
        center,
        this.route,
        this.waypointIndex,
        this.gameEnv.innerWidth,
        this.gameEnv.innerHeight,
        reachDistance * 1.5,
      );
    }
    this.waypointIndex = advanceRouteWaypoint(
      center,
      this.route,
      this.waypointIndex,
      this.gameEnv.innerWidth,
      this.gameEnv.innerHeight,
      reachDistance,
    );

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

  updateSpinRecoveryControls() {
    const { up, down, right } = this.keypress;
    this.pressedKeys = { [right]: true };
    if (this.spinRecovery.phase === 'braking') {
      if (this.speed > 0) this.pressedKeys[down] = true;
      else if (this.speed < 0) this.pressedKeys[up] = true;
      else this.spinRecovery.phase = 'spinning';
      return;
    }

    if (this.speed < SPIN_SPEED - 0.1) this.pressedKeys[up] = true;
    else if (this.speed > SPIN_SPEED + 0.1) this.pressedKeys[down] = true;
  }

  updateSpinRecoveryProgress(previousHeading) {
    if (!this.spinRecovery || this.spinRecovery.phase !== 'spinning') return;
    let headingChange = this.heading - previousHeading;
    headingChange = ((headingChange + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    this.spinRecovery.turned += Math.max(0, headingChange);
    if (this.spinRecovery.turned < SPIN_DISTANCE) return;

    this.spinRecovery = null;
    const center = this.getCenter();
    this.waypointIndex = recoverRouteWaypoint(
      center,
      this.route,
      this.waypointIndex,
      this.gameEnv.innerWidth,
      this.gameEnv.innerHeight,
      Math.min(this.gameEnv.innerWidth, this.gameEnv.innerHeight) * 0.04,
    );
  }

  update() {
    if (this.gameEnv?.gameControl?.isPaused) return;
    if (this.raceFinished) {
      super.update();
      return;
    }
    if (this.mode === 'superEasy' && !this.spinRecovery
        && this.state?.collisionEvents?.includes(CONE_COLLISION_ID)) {
      this.spinRecovery = { phase: 'braking', turned: 0 };
    }
    if (!this.raceStarted && this.mode !== 'ai') {
      const playerStarted = this.gameEnv?.gameObjects?.some((object) => (
        object !== this
        && object instanceof PlayerCar
        && Number.isFinite(object.speed)
        && object.speed !== 0
      ));
      if (playerStarted) this.raceStarted = true;
    }
    if (this.mode === 'ai') this.raceStarted = true;

    if (!this.raceStarted) {
      this.pressedKeys = {};
      super.update();
      return;
    }

    if (this.spinRecovery) {
      this.updateSpinRecoveryControls();
      const previousHeading = this.heading;
      super.update();
      this.updateSpinRecoveryProgress(previousHeading);
      return;
    }

    this.updateBotControls();
    super.update();
  }

  destroy() {
    window.removeEventListener('keydown', this._boundHandleKeyDown);
    window.removeEventListener('keyup', this._boundHandleKeyUp);
    super.destroy();
  }
}
