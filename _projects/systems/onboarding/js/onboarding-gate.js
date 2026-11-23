import Game from '@assets/js/GameEnginev1.1/essentials/Game.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';
import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { challengeById } from './onboarding-data.js';
import { OnboardingStore } from './onboarding-store.js';
import { connectGameControls } from './game-bridge.js';

const root = document.querySelector('.onboarding-gate');
const stage = document.getElementById('onboarding-gate-stage');
const counter = root.querySelector('[data-gate-count]');
const button = root.querySelector('[data-gate-click]');
const errorMessage = root.querySelector('[data-gate-error]');
const challenge = challengeById(new URLSearchParams(location.search).get('challenge'));
const store = new OnboardingStore({ profile: new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) }) });
let savedProgress;
let allowSave;

class CookieGate {
  static definition = { id: 'cookie-gate', title: 'Cookie Gate', goal: 5 };

  constructor(env) {
    this.progress = { ...CookieGate.definition, challengeId: challenge.id, current: 0 };
    this.gameControl = env.gameControl;
    counter.textContent = `Cookies: ${this.progress.current} / ${this.progress.goal}`;
    const cookie = {
      id: 'onboarding-cookie',
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

  getProgress() {
    return this.progress;
  }

  isComplete() {
    return this.progress.current >= this.progress.goal;
  }

  async onComplete() {
    errorMessage.textContent = '';
    await new Promise(resolve => {
      allowSave = resolve;
    });
    savedProgress = await store.unlock(challenge.id);
    return savedProgress;
  }

  onCompletionError(error) {
    errorMessage.textContent = `Unlock could not be saved: ${error.message}`;
  }
}

try {
  if (!challenge || challenge.direct || window.parent === window) throw new Error('Choose a valid challenge from onboarding.');
  const game = Game.main({
    path: root.dataset.baseurl,
    gameContainer: stage,
    gameLevelClasses: [CookieGate],
    innerWidth: stage.clientWidth,
    innerHeight: stage.clientHeight,
    disablePauseMenu: true,
    disableContainerAdjustment: true,
    onProgress: progress => {
      window.parent.postMessage({ type: 'ocs-game-progress', ...progress }, location.origin);
    },
  }, GameControl);
  game.gameControl.reportProgress();
  game.gameControl.gameOver = () => {
    game.gameControl.removeExitKeyListener();
    if (!savedProgress) {
      errorMessage.textContent = 'The cookie game ended before the unlock was saved. Restart the game to try again.';
      return;
    }
  };
  connectGameControls(game, {
    onPauseChange: paused => {
      button.disabled = paused || game.gameControl.currentLevel?.gameLevel.isComplete();
    },
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent ||
        event.data?.type !== 'ocs-game-completion-control' ||
        event.data.gameId !== CookieGate.definition.id) return;
    if (event.data.action === 'allow' && allowSave) {
      const resolve = allowSave;
      allowSave = null;
      resolve();
    } else if (event.data.action === 'retry') {
      game.gameControl.retryLevelCompletion();
    }
  });
  button.addEventListener('click', () => {
    const cookie = game.gameControl.currentLevel?.gameEnv.gameObjects.find(object => object.spriteData?.id === 'onboarding-cookie');
    if (!cookie) {
      errorMessage.textContent = 'The cookie game is still loading. Try again.';
      return;
    }
    cookie.handleClick();
  });
} catch (error) {
  console.error('Cookie game could not start:', error);
  errorMessage.textContent = `The cookie game could not start: ${error.message}`;
}
