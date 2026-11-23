import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Clicker from '@assets/js/GameEnginev1.1/essentials/Clicker.js';
import IdentityCookieGate from './identity-cookie-gate-level.js';

export function startIdentityCookieGate(game, { status, store, host = window, Control = GameControl }) {
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

  function onKey(event) {
    if (event.code !== 'Space' || event.repeat || collected === 5 || nested.isPaused) return;
    event.preventDefault();
    const cookie = nested.currentLevel?.gameEnv.gameObjects.find(object => object instanceof Clicker && !object.gateCollected);
    cookie?.handleClick();
  }

  parent.pause();
  game.environment ??= {};
  game.environment.identityCookieGate = {
    isPaused: () => nested?.isPaused === true,
    onCollect: () => {
      if (collected === 5) return;
      collected++;
      message.textContent = `Collect five moving cookies to enter Identity Forge. Click them or press Space. ${collected} / 5`;
      if (collected === 5) void saveUnlock();
    },
    path: game.path,
    width: game.gameContainer?.clientWidth ?? host.innerWidth,
    height: game.gameContainer?.clientHeight ?? host.innerHeight,
  };
  nested = new Control(game, [IdentityCookieGate], { parentControl: parent });
  retry.addEventListener('click', saveUnlock);
  host.document.addEventListener('keydown', onKey);
  nested.start();
}
