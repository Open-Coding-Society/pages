import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
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
} else {
  root.querySelector('[data-challenge-title]').textContent = challenge.title;
  root.querySelector('[data-challenge-description]').textContent = challenge.description;
  challengeLink.href = `${baseurl}${challenge.url}`;
  root.querySelector('[data-challenge-note]').textContent = challenge.external
    ? 'UI Builder opens in a new tab because it cannot be embedded.'
    : 'Play here or open the challenge in a new tab.';

  let store;
  let busy = false;
  let isGuest = false;

  function show(progress) {
    isGuest = !progress.user;
    const unlocked = progress.unlocked.includes(challenge.id);
    status.textContent = progress.user
      ? (unlocked ? 'Unlocked and saved to your account.' : 'Play the unlock game to begin.')
      : (unlocked ? 'Unlocked on this browser. Sign in to save it to your account.' : 'Guest play: your unlock will transfer when you sign in.');
    gate.hidden = unlocked;
    challengeSection.hidden = !unlocked;
    if (!unlocked && !gateFrame.getAttribute('src')) gateFrame.src = `${baseurl}/onboarding/gate/`;
    if (unlocked && gateFrame.getAttribute('src')) gateFrame.removeAttribute('src');
    if (unlocked && !challenge.external && !challengeFrame.getAttribute('src')) {
      challengeFrame.src = `${baseurl}${challenge.url}`;
      challengeFrame.hidden = false;
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

  window.addEventListener('message', async event => {
    if (event.origin !== location.origin || event.source !== gateFrame.contentWindow ||
        event.data?.type !== 'ocs-onboarding-gate-complete' || busy) return;
    busy = true;
    status.textContent = 'Saving your unlock...';
    try {
      show(await store.unlock(challenge.id));
    } catch (error) {
      console.error('Onboarding unlock could not save:', error);
      status.textContent = `Unlock could not be saved: ${error.message} Reload and try again.`;
    } finally {
      busy = false;
    }
  });

  try {
    store = new OnboardingStore({ pythonURI, fetchOptions });
    refresh();
    window.addEventListener('focus', refresh);
    window.setInterval(() => { if (isGuest) refresh(); }, 10000);
  } catch (error) {
    console.error('Onboarding could not start:', error);
    status.textContent = `Onboarding could not start: ${error.message}`;
  }
}
