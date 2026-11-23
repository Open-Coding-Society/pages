import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { challengeById } from './onboarding-data.js';
import { configureOnboardingGame } from './onboarding-game.js';
import { OnboardingStore } from './onboarding-store.js';

const root = document.querySelector('[data-onboarding-view]');
const params = new URLSearchParams(location.search);
const challenge = challengeById(params.get('challenge'));
const status = root.querySelector('[data-challenge-status]');
root.querySelector('[data-standalone-back]').hidden = params.has('onboarding_view');

if (!challenge) {
  status.textContent = 'Challenge not found. Return to onboarding to choose one.';
} else if (challenge.direct) {
  location.replace(`${root.dataset.baseurl}${challenge.url}`);
} else {
  root.dataset.challengeId = challenge.id;
  root.querySelector('[data-challenge-title]').textContent = challenge.title;
  root.querySelector('[data-challenge-description]').textContent = challenge.description;

  const shell = root.querySelector('[data-runner-shell]');
  const gate = root.querySelector('[data-gate]');
  const counter = root.querySelector('[data-gate-count]');
  const gateInstructions = root.querySelector('[data-gate-instructions]');
  const error = root.querySelector('[data-gate-error]');
  const reset = root.querySelector('[data-game-reset]');
  const retry = root.querySelector('[data-unlock-retry]');
  const gated = Boolean(challenge.gate);
  const store = gated
    ? new OnboardingStore({ profile: new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) }) })
    : null;
  let controller;
  let progress;
  let busy = false;
  let saving = false;
  let resetOperation = null;
  let revision = 0;
  let session;

  function show(next) {
    progress = next;
    const unlocked = next.unlocked.includes(challenge.id);
    if (session) session.unlocked = unlocked;
    status.textContent = !gated ? 'This challenge is ready to play.'
      : next.offline ? `Account service unavailable. ${unlocked ? 'Unlocked' : 'Playing'} offline. Unlocks transfer to the next signed-in account; guest game profile changes may not. Reconnect to replay.`
      : next.user ? (unlocked ? 'Unlocked and saved to your account.' : 'Play the unlock game to begin.')
      : (unlocked ? 'Unlocked on this browser. Sign in to save it to your account.' : 'Guest play: your unlock will transfer when you sign in.');
    gate.hidden = !gated || unlocked;
    gateInstructions.hidden = challenge.gate !== 'toolchain-snake' || unlocked;
    reset.hidden = !gated;
    reset.disabled = next.offline === true || busy || saving;
  }

  function onProgress(event) {
    if (!session || event.game?.challengeId !== challenge.id) return;
    if (event.status === 'completing') {
      revision++;
      saving = true;
      reset.disabled = true;
      retry.hidden = true;
      status.textContent = 'Saving your unlock...';
    } else if (event.status === 'failed') {
      saving = false;
      reset.disabled = progress.offline === true || busy;
      status.textContent = `Unlock could not be saved: ${event.error} Try again.`;
      retry.hidden = false;
    } else if (event.status === 'completed') {
      saving = false;
      revision++;
      if (!Array.isArray(event.result?.unlocked) || !event.result.unlocked.includes(challenge.id)) {
        status.textContent = 'The saved unlock could not be confirmed. Reload to try again.';
        return;
      }
      show(event.result);
    }
  }

  async function start(next) {
    if (!controller) return;
    session = {
      challenge, unlocked: next.unlocked.includes(challenge.id), counter, error, onProgress,
      onStart() {
        retry.hidden = true;
        error.textContent = '';
        if (!saving) show(progress);
      },
      async save() {
        if (resetOperation) await resetOperation;
        if (session !== this) throw new Error('This game was restarted.');
        const savingControl = this.control;
        try {
          const next = await store.unlock(challenge.id);
          if (session === this && this.control !== savingControl) {
            saving = false;
            revision++;
            show(next);
            if (this.control) {
              controller.stop();
              await start(next);
            }
          }
          return next;
        } catch (failure) {
          if (session === this && this.control !== savingControl) {
            saving = false;
            reset.disabled = progress.offline === true || busy;
            status.textContent = `Unlock could not be saved: ${failure.message} Start the gate again to retry.`;
          }
          throw failure;
        }
      },
    };
    configureOnboardingGame(session);
    error.textContent = '';
    retry.hidden = true;
    shell.hidden = false;
    controller.setCode(`import { createGame } from '@assets/js/projects/onboarding/${challenge.id}-game.js';\nconst { gameLevelClasses, GameControl } = createGame();\nexport { gameLevelClasses, GameControl };`);
    await controller.run();
  }

  async function refresh() {
    if (busy || saving) return;
    busy = true;
    const currentRevision = revision;
    try {
      const next = await store.read();
      if (revision !== currentRevision) return;
      const first = !progress;
      const changed = !first && progress.unlocked.includes(challenge.id) !== next.unlocked.includes(challenge.id);
      show(next);
      if (first) await start(next);
      else if (changed && session?.control) {
        controller.stop();
        await start(next);
      }
    } catch (failure) {
      console.error('Onboarding progress could not load:', failure);
      status.textContent = `Progress could not load: ${failure.message} Reload to try again.`;
    } finally {
      busy = false;
      if (progress) reset.disabled = progress.offline === true || saving;
    }
  }

  retry.addEventListener('click', () => {
    retry.hidden = true;
    session?.control?.retryLevelCompletion();
  });
  reset.addEventListener('click', () => {
    if (busy || saving || !window.confirm("Clear this challenge's unlock and replay its gate? Your avatar, theme and other unlocks will not change.")) return;
    busy = true;
    reset.disabled = true;
    resetOperation = (async () => {
      try {
        const next = await store.reset(challenge.id);
        revision++;
        controller.stop();
        saving = false;
        show(next);
        await start(next);
      } catch (failure) {
        console.error('Onboarding unlock could not be cleared:', failure);
        status.textContent = `Unlock could not be cleared: ${failure.message} Try again.`;
      } finally {
        busy = false;
        reset.disabled = progress.offline === true || saving;
      }
    })();
    resetOperation.finally(() => { resetOperation = null; });
  });

  function ready(found) {
    if (controller) return;
    controller = found;
    if (gated) {
      void refresh();
      window.addEventListener('focus', refresh);
      window.setInterval(() => { if (!progress?.user) void refresh(); }, 10000);
    } else {
      const next = { user: null, unlocked: [] };
      show(next);
      void start(next);
    }
  }

  window.addEventListener('ocs:game-runner-ready', event => {
    if (event.detail.runnerId === 'onboarding') ready(event.detail.controller);
  });
  if (window.OCSGameRunners?.onboarding) ready(window.OCSGameRunners.onboarding);

  if (challenge.id === 'toolchain-trail') {
    const output = root.querySelector('.game-output');
    const stage = root.querySelector('.gameContainer');
    output.classList.add('onboarding-toolchain-stage');
    const fit = () => {
      const scale = Math.min(output.clientWidth / 1600, output.clientHeight / 900);
      if (scale > 0) {
        stage.style.setProperty('--onboarding-stage-scale', scale);
        stage.style.setProperty('--onboarding-stage-x', `${(output.clientWidth - 1600 * scale) / 2}px`);
        stage.style.setProperty('--onboarding-stage-y', `${(output.clientHeight - 900 * scale) / 2}px`);
      }
    };
    new ResizeObserver(fit).observe(output);
    fit();
  }
}
