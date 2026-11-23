import Game from '@assets/js/GameEnginev1.1/essentials/Game.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';
import { connectGameControls } from './game-bridge.js';

const root = document.querySelector('.onboarding-gate');
const stage = document.getElementById('onboarding-gate-stage');
const counter = root.querySelector('[data-gate-count]');
const button = root.querySelector('[data-gate-click]');

class CookieGate {
  constructor(env) {
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
      interact(clicks) {
        counter.textContent = `Cookies: ${Math.min(clicks, 5)} / 5`;
        if (clicks === 5) {
          button.disabled = true;
          window.parent.postMessage({ type: 'ocs-onboarding-gate-complete' }, location.origin);
        }
      },
    };
    this.classes = [{ class: Clicker, data: cookie }];
  }
}

try {
  const game = Game.main({
    path: root.dataset.baseurl,
    gameContainer: stage,
    gameLevelClasses: [CookieGate],
    innerWidth: stage.clientWidth,
    innerHeight: stage.clientHeight,
    disablePauseMenu: true,
    disableContainerAdjustment: true,
  }, GameControl);
  connectGameControls(game, { onPauseChange: paused => { button.disabled = paused; } });
  button.addEventListener('click', () => {
    const cookie = game.gameControl.currentLevel.gameEnv.gameObjects.find(object => object.spriteData?.id === 'onboarding-cookie');
    if (!cookie) {
      root.querySelector('[data-gate-error]').textContent = 'The cookie game is still loading. Try again.';
      return;
    }
    cookie.handleClick();
  });
} catch (error) {
  console.error('Cookie game could not start:', error);
  root.querySelector('[data-gate-error]').textContent = `The cookie game could not start: ${error.message}`;
}
