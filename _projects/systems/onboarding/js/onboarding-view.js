import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { challengeById } from './onboarding-data.js';
import { OnboardingStore } from './onboarding-store.js';

const root = document.querySelector('[data-onboarding-view]');
const baseurl = root.dataset.baseurl;
const challenge = challengeById(new URLSearchParams(location.search).get('challenge'));
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
  const gameStatus = root.querySelector('[data-game-status]');
  const profile = new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) });
  const store = new OnboardingStore({ profile });
  let busy = false;
  let isGuest = false;
  let unlocked = null;
  let activeFrame = null;
  let paused = false;

  function stop() {
    if (activeFrame) {
      activeFrame.removeAttribute('src');
      activeFrame.hidden = true;
      activeFrame = null;
    }
    paused = false;
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
    activeFrame = unlocked ? challengeFrame : gateFrame;
    const url = new URL(`${baseurl}${unlocked ? challenge.url : '/onboarding/gate/'}`, location.origin);
    url.searchParams.set('onboarding_embed', '1');
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
    const nextUnlocked = progress.unlocked.includes(challenge.id);
    status.textContent = progress.user
      ? (nextUnlocked ? 'Unlocked and saved to your account.' : 'Play the unlock game to begin.')
      : (nextUnlocked ? 'Unlocked on this browser. Sign in to save it to your account.' : 'Guest play: your unlock will transfer when you sign in.');
    gate.hidden = nextUnlocked;
    challengeSection.hidden = !nextUnlocked;
    controls.hidden = false;
    if (unlocked !== nextUnlocked) {
      const shouldStart = unlocked === null || activeFrame !== null;
      stop();
      unlocked = nextUnlocked;
      if (shouldStart) start();
    }
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    try {
      show(await store.read());
    } catch (error) {
      console.error('Onboarding progress could not load:', error);
      status.textContent = `Progress could not load: ${error.message} Reload to try again.`;
    } finally {
      busy = false;
    }
  }

  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', stop);
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
      resetButton.disabled = false;
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
    } else if (event.data?.type === 'ocs-onboarding-gate-complete' && activeFrame === gateFrame && !busy) {
      busy = true;
      status.textContent = 'Saving your unlock...';
      try {
        show(await store.unlock(challenge.id));
      } catch (error) {
        console.error('Onboarding unlock could not save:', error);
        status.textContent = `Unlock could not be saved: ${error.message} Clear cookies and try again.`;
      } finally {
        busy = false;
      }
    }
  });

  refresh();
  window.addEventListener('focus', refresh);
  window.setInterval(() => { if (isGuest) refresh(); }, 10000);
}
