import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';

export default class ToolchainTrailGate {
  static definition = { id: 'toolchain-cookie-gate', title: 'Toolchain Cookie Gate', goal: 5 };

  constructor(env) {
    const { challenge, store, counter, button, errorMessage } =
      env.game.environment.toolchainCookieGate;
    this.progress = { ...ToolchainTrailGate.definition, challengeId: challenge.id, current: 0 };
    this.gameControl = env.gameControl;
    this.store = store;
    this.challenge = challenge;
    this.errorMessage = errorMessage;
    this.savedProgress = null;
    this.onKey = event => {
      if (event.code !== 'Space' || event.repeat || this.isComplete() || this.gameControl.isPaused) return;
      event.preventDefault();
      const object = env.gameObjects.find(item => item.spriteData?.id === 'toolchain-cookie');
      object?.handleClick();
    };
    counter.textContent = `Cookies: ${this.progress.current} / ${this.progress.goal}`;
    const cookie = {
      id: 'toolchain-cookie',
      greeting: false,
      src: `${env.path}/hacks/cookie-clicker/assets/baseCookie.png`,
      SCALE_FACTOR: 3,
      pixels: { height: 512, width: 512 },
      INIT_POSITION: { x: env.innerWidth * 0.35, y: env.innerHeight * 0.15 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      speed: 0,
      interact: () => {
        if (this.isComplete() || this.gameControl.isPaused) return;
        this.progress.current++;
        counter.textContent = `Cookies: ${this.progress.current} / ${this.progress.goal}`;
        this.gameControl.reportProgress();
        if (this.isComplete()) button.disabled = true;
      },
    };
    this.classes = [{ class: Clicker, data: cookie }];
  }

  initialize() {
    document.addEventListener('keydown', this.onKey);
  }

  destroy() {
    document.removeEventListener('keydown', this.onKey);
  }

  getProgress() {
    return this.progress;
  }

  isComplete() {
    return this.progress.current >= this.progress.goal;
  }

  async onComplete() {
    this.errorMessage.textContent = '';
    this.savedProgress = await this.store.unlock(this.challenge.id);
    return this.savedProgress;
  }

  onCompletionError(error) {
    this.errorMessage.textContent = `Unlock could not be saved: ${error.message}`;
  }
}
