import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
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
    const image = document.createElement('img');
    image.className = 'ocs__image-frame ocs__image-frame--thumbnail';
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
    progress.textContent = unlocked.includes(challenge.id) ? 'Unlocked' : 'Play to unlock';
    card.append(link, heading, description, progress);
    grid.append(card);
  }
}

async function start() {
  try {
    const store = new OnboardingStore({ pythonURI, fetchOptions });
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
