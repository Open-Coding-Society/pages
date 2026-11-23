import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';

export function startIdentityGate(game, { status, store, host = window, Control = GameControl }) {
  const parent = game.gameControl;
  const message = status.querySelector('[data-identity-gate-message]');
  const retry = status.querySelector('[data-identity-gate-retry]');
  let collected = 0;
  let saving = false;
  let nested;

  host.document.body.classList.add('onboarding-identity-gated');
  status.hidden = false;
  message.textContent = 'Collect five moving cookies to enter Identity Forge. Click them or press Space. 0 / 5';

  async function saveUnlock() {
    if (saving) return;
    saving = true;
    retry.hidden = true;
    message.textContent = 'Five cookies collected. Saving your unlock...';
    let progress;
    try {
      progress = await store.unlock('identity-forge');
    } catch (error) {
      console.error('Onboarding unlock could not save:', error);
      message.textContent = `Unlock could not be saved: ${error.message}`;
      retry.hidden = false;
      saving = false;
      return;
    }
    nested.removeExitKeyListener();
    nested.endLevel();
    host.document.removeEventListener('keydown', onKey);
    host.document.body.classList.remove('onboarding-identity-gated');
    status.hidden = true;
    host.parent.postMessage({ type: 'ocs-onboarding-gate-saved', progress }, host.location.origin);
    host.parent.postMessage({ type: 'ocs-onboarding-game-state', paused: false }, host.location.origin);
  }

  class CookieGate {
    constructor(env) {
      const width = env.innerWidth;
      const height = env.innerHeight;
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
          walkingArea: { xMin: width * 0.05, xMax: width * 0.95, yMin: height * 0.08, yMax: height * 0.92 },
          speed: 1.2,
          moveDirection: { x: 1, y: 1 },
          drawCounter: false,
          interact(_clicks, _id, cookie) {
            if (collected === 5 || nested.isPaused || cookie.gateCollected) return;
            cookie.gateCollected = true;
            cookie.visible = false;
            cookie.canvas.style.display = 'none';
            collected += 1;
            message.textContent = `Collect five moving cookies to enter Identity Forge. Click them or press Space. ${collected} / 5`;
            if (collected === 5) void saveUnlock();
          },
        },
        spawn: {
          count: 5,
          ranges: { INIT_POSITION: { x: [width * 0.05, width * 0.8], y: [height * 0.1, height * 0.75] }, speed: [0.9, 1.9] },
          pickOne: { src: sprites, moveDirection: [{ x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }] },
        },
      }];
    }
  }

  function onKey(event) {
    if (event.code !== 'Space' || event.repeat || collected === 5 || nested.isPaused) return;
    event.preventDefault();
    const cookie = nested.currentLevel?.gameEnv.gameObjects.find(object => object instanceof Clicker && !object.gateCollected);
    cookie?.handleClick();
  }

  parent.pause();
  nested = new Control(game, [CookieGate], { parentControl: parent });
  retry.addEventListener('click', saveUnlock);
  host.document.addEventListener('keydown', onKey);
  nested.start();
}
