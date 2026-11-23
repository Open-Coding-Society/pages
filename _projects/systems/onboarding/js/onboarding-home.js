import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { CHALLENGES, viewerPath } from './onboarding-data.js';
import { OnboardingStore } from './onboarding-store.js';

const root = document.querySelector('[data-onboarding]');
const baseurl = root.dataset.baseurl;
const status = root.querySelector('[data-onboarding-status]');
const grid = root.querySelector('[data-onboarding-cards]');

function render(unlocked) {
  grid.replaceChildren();
  for (const challenge of CHALLENGES) {
    const card = document.createElement('article');
    card.className = 'ocs__grid-cell';
    const link = document.createElement('a');
    link.href = viewerPath(challenge.id, baseurl);
    link.setAttribute('aria-label', `Open ${challenge.title}`);
    const image = document.createElement('img');
    image.className = 'ocs__image-frame onboarding__card-image';
    image.src = `${baseurl}${challenge.image}`;
    image.alt = '';
    image.loading = 'lazy';
    link.append(image);
    const heading = document.createElement('h2');
    const title = document.createElement('a');
    title.href = link.href;
    title.textContent = challenge.title;
    heading.append(title);
    const description = document.createElement('p');
    description.textContent = challenge.description;
    const progress = document.createElement('p');
    progress.className = 'ocs__status';
    progress.textContent = challenge.direct ? 'Open builder' : unlocked.includes(challenge.id) ? 'Unlocked' : 'Play to unlock';
    card.append(link, heading, description, progress);
    grid.append(card);
  }
}

async function start() {
  try {
    const profile = new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) });
    const store = new OnboardingStore({ profile });
    const progress = await store.read();
    render(progress.unlocked);
    status.textContent = progress.user
      ? 'Unlocks are saved to your account.'
      : 'Guest unlocks are saved on this browser and transferred when you sign in.';
  } catch (error) {
    console.error('Onboarding progress could not load:', error);
    status.textContent = `Progress could not load: ${error.message} Reload to try again.`;
    render([]);
  }
}

start();
