import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { challengeById } from './onboarding-data.js';
import { OnboardingStore } from './onboarding-store.js';

const root = document.querySelector('[data-onboarding-view]');
const baseurl = root.dataset.baseurl;
const params = new URLSearchParams(location.search);
const challenge = challengeById(params.get('challenge'));
root.querySelector('[data-standalone-back]').hidden = params.has('onboarding_view');
const status = root.querySelector('[data-challenge-status]');
const gate = root.querySelector('[data-gate]');
const gateFrame = root.querySelector('[data-gate-frame]');
const challengeSection = root.querySelector('[data-challenge]');
const challengeFrame = root.querySelector('[data-challenge-frame]');
const challengeLink = root.querySelector('[data-challenge-open]');

if (!challenge) {
  status.textContent = 'Challenge not found. Return to onboarding to choose one.';
} else if (challenge.direct) {
  location.replace(`${baseurl}${challenge.url}`);
} else {
  root.querySelector('[data-challenge-title]').textContent = challenge.title;
  root.querySelector('[data-challenge-description]').textContent = challenge.description;
  root.querySelector('[data-challenge-note]').textContent = 'Play here or open the challenge in a new tab.';
  challengeLink.href = `${baseurl}${challenge.url}`;

  const controls = root.querySelector('[data-game-controls]');
  const startButton = root.querySelector('[data-game-start]');
  const pauseButton = root.querySelector('[data-game-pause]');
  const stopButton = root.querySelector('[data-game-stop]');
  const fullscreenButton = root.querySelector('[data-game-fullscreen]');
  const resetButton = root.querySelector('[data-game-reset]');
  const retryButton = root.querySelector('[data-unlock-retry]');
  const gameStatus = root.querySelector('[data-game-status]');
  const profile = new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) });
  const store = new OnboardingStore({ profile });
  let busy = false;
  let isGuest = false;
  let isOffline = false;
  let unlocked = null;
  let activeFrame = null;
  let pendingGate = false;
  let progressRevision = 0;
  let paused = false;
  const identityGate = challenge.id === 'identity-forge';

  function stop() {
    if (activeFrame) {
      activeFrame.removeAttribute('src');
      activeFrame.hidden = true;
      activeFrame = null;
    }
    paused = false;
    pendingGate = false;
    retryButton.hidden = true;
    startButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true;
    fullscreenButton.disabled = true;
    pauseButton.classList.remove('run');
    pauseButton.classList.add('pause');
    pauseButton.title = 'Pause Game';
    pauseButton.setAttribute('aria-label', 'Pause Game');
    gameStatus.textContent = 'Game stopped.';
  }

  function start() {
    if (activeFrame || unlocked === null) return;
    activeFrame = unlocked || identityGate ? challengeFrame : gateFrame;
    const url = new URL(`${baseurl}${unlocked || identityGate ? challenge.url : '/onboarding/gate/'}`, location.origin);
    url.searchParams.set('onboarding_embed', '1');
    if (identityGate && !unlocked) url.searchParams.set('onboarding_gate', '1');
    activeFrame.src = url.href;
    activeFrame.hidden = false;
    startButton.disabled = true;
    stopButton.disabled = false;
    fullscreenButton.disabled = false;
    pauseButton.disabled = true;
    gameStatus.textContent = 'Game starting...';
  }

  function show(progress) {
    isGuest = !progress.user;
    isOffline = progress.offline === true;
    const nextUnlocked = progress.unlocked.includes(challenge.id);
    status.textContent = progress.offline
      ? `Account service unavailable. ${nextUnlocked ? 'Unlocked' : 'Playing'} offline. Unlocks transfer to the next signed-in account; guest game profile changes may not. Reconnect to replay.`
      : progress.user
      ? (nextUnlocked ? 'Unlocked and saved to your account.' : 'Play the unlock game to begin.')
      : (nextUnlocked ? 'Unlocked on this browser. Sign in to save it to your account.' : 'Guest play: your unlock will transfer when you sign in.');
    resetButton.disabled = isOffline;
    gate.hidden = nextUnlocked || identityGate;
    challengeSection.hidden = !nextUnlocked && !identityGate;
    challengeLink.hidden = !nextUnlocked;
    root.querySelector('[data-challenge-note]').textContent = nextUnlocked
      ? 'Play here or open the challenge in a new tab.'
      : 'Collect five moving cookies in the game to unlock Identity Forge.';
    controls.hidden = false;
    if (unlocked !== nextUnlocked) {
      if (identityGate && unlocked === false && nextUnlocked && activeFrame === challengeFrame) {
        unlocked = true;
        return;
      }
      const shouldStart = unlocked === null || activeFrame !== null;
      stop();
      unlocked = nextUnlocked;
      if (shouldStart) start();
    }
  }

  async function saveGate() {
    if (busy) {
      pendingGate = true;
      return;
    }
    if (activeFrame !== gateFrame) return;
    busy = true;
    retryButton.hidden = true;
    status.textContent = 'Saving your unlock...';
    try {
      show(await store.unlock(challenge.id));
    } catch (error) {
      console.error('Onboarding unlock could not save:', error);
      status.textContent = `Unlock could not be saved: ${error.message} Try again.`;
      if (activeFrame === gateFrame) retryButton.hidden = false;
    } finally {
      busy = false;
      if (pendingGate && activeFrame === gateFrame) {
        pendingGate = false;
        void saveGate();
      }
    }
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    const revision = progressRevision;
    try {
      const progress = await store.read();
      if (revision === progressRevision) show(progress);
    } catch (error) {
      console.error('Onboarding progress could not load:', error);
      if (revision === progressRevision) status.textContent = `Progress could not load: ${error.message} Reload to try again.`;
    } finally {
      busy = false;
      if (pendingGate) {
        pendingGate = false;
        void saveGate();
      }
    }
  }

  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', stop);
  retryButton.addEventListener('click', saveGate);
  pauseButton.addEventListener('click', () => {
    if (!activeFrame) return;
    pauseButton.disabled = true;
    activeFrame.contentWindow.postMessage({ type: 'ocs-onboarding-game-control', action: paused ? 'resume' : 'pause' }, location.origin);
  });
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (activeFrame) await activeFrame.requestFullscreen();
    } catch (error) {
      console.error('Fullscreen could not be opened:', error);
      gameStatus.textContent = `Fullscreen could not be opened: ${error.message}`;
    }
  });
  resetButton.addEventListener('click', async () => {
    if (busy || !window.confirm("Clear this challenge's unlock and replay its cookie game? Your avatar, theme and other unlocks will not change.")) return;
    busy = true;
    resetButton.disabled = true;
    try {
      const progress = await store.reset(challenge.id);
      stop();
      unlocked = null;
      show(progress);
    } catch (error) {
      console.error('Onboarding unlock could not be cleared:', error);
      status.textContent = `Unlock could not be cleared: ${error.message} Try again.`;
    } finally {
      busy = false;
      resetButton.disabled = isOffline;
      if (pendingGate) {
        pendingGate = false;
        void saveGate();
      }
    }
  });

  window.addEventListener('message', async event => {
    if (event.origin !== location.origin || !activeFrame || event.source !== activeFrame.contentWindow) return;
    if (event.data?.type === 'ocs-onboarding-game-ready') {
      pauseButton.disabled = false;
      gameStatus.textContent = 'Game running.';
    } else if (event.data?.type === 'ocs-onboarding-game-state') {
      paused = event.data.paused === true;
      const label = paused ? 'Resume Game' : 'Pause Game';
      pauseButton.classList.toggle('pause', !paused);
      pauseButton.classList.toggle('run', paused);
      pauseButton.title = label;
      pauseButton.setAttribute('aria-label', label);
      pauseButton.disabled = false;
      gameStatus.textContent = event.data.error || (paused ? 'Game paused.' : 'Game running.');
    } else if (event.data?.type === 'ocs-onboarding-gate-saved' && identityGate &&
      activeFrame === challengeFrame && Array.isArray(event.data.progress?.unlocked) &&
      event.data.progress.unlocked.includes(challenge.id)) {
      progressRevision++;
      show(event.data.progress);
    } else if (event.data?.type === 'ocs-onboarding-gate-complete' && activeFrame === gateFrame) {
      await saveGate();
    }
  });

  refresh();
  window.addEventListener('focus', refresh);
  window.setInterval(() => { if (isGuest) refresh(); }, 10000);
}
