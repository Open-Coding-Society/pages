import Game from '@assets/js/GameEnginev1.1/essentials/Game.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { challengeById } from './onboarding-data.js';
import ToolchainCookieGate from './toolchain-cookie-gate-level.js';
import { OnboardingStore } from './onboarding-store.js';
import { connectGameControls } from './game-bridge.js';

const root = document.querySelector('.onboarding-gate');
const stage = document.getElementById('onboarding-gate-stage');
const counter = root.querySelector('[data-gate-count]');
const button = root.querySelector('[data-gate-click]');
const errorMessage = root.querySelector('[data-gate-error]');
const challenge = challengeById(new URLSearchParams(location.search).get('challenge'));
const store = new OnboardingStore({ profile: new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) }) });
let allowSave;

try {
  if (!challenge || challenge.gate !== 'toolchain-cookie' || window.parent === window) {
    throw new Error('Choose a challenge with a Toolchain cookie gate.');
  }
  const gameLevelClasses = [ToolchainCookieGate];
  const game = Game.main({
    path: root.dataset.baseurl,
    gameContainer: stage,
    gameLevelClasses,
    toolchainCookieGate: {
      challenge,
      store,
      counter,
      button,
      errorMessage,
      waitForSave: () => new Promise(resolve => {
        allowSave = resolve;
      }),
    },
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
    if (!game.gameControl.currentLevel?.gameLevel.savedProgress) {
      errorMessage.textContent = 'The Toolchain gate ended before the unlock was saved. Restart the gate to try again.';
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
        event.data.gameId !== ToolchainCookieGate.definition.id) return;
    if (event.data.action === 'allow' && allowSave) {
      const resolve = allowSave;
      allowSave = null;
      resolve();
    } else if (event.data.action === 'retry') {
      game.gameControl.retryLevelCompletion();
    }
  });
  button.addEventListener('click', () => {
    const cookie = game.gameControl.currentLevel?.gameEnv.gameObjects.find(object => object.spriteData?.id === 'toolchain-cookie');
    if (!cookie) {
      errorMessage.textContent = 'The Toolchain gate is still loading. Try again.';
      return;
    }
    cookie.handleClick();
  });
} catch (error) {
  console.error('Toolchain gate could not start:', error);
  errorMessage.textContent = `The Toolchain gate could not start: ${error.message}`;
}
