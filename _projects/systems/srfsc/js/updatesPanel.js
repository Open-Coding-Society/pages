// ============================================
// updatesPanel.js
// RESPONSIBILITY: Community updates feed with category filter chips.
// ============================================
import { fetchUpdates } from './srfscApi.js';
import { createElement } from './srfscDom.js';

let allUpdates = [];
let activeCategory = 'All';

function renderFeed() {
  const feed = document.getElementById('srfsc-updates');
  const visible = activeCategory === 'All'
    ? allUpdates
    : allUpdates.filter((update) => update.category === activeCategory);

  if (visible.length === 0) {
    feed.replaceChildren(createElement('p', 'srfsc-empty', 'Nothing here yet.'));
    return;
  }
  feed.replaceChildren(...visible.map((update) => {
    const item = createElement('article', 'srfsc-feed__item');
    // Category becomes a modifier class, so map it to a safe slug rather than trusting raw text
    const slug = update.category.toLowerCase().replace(/[^a-z]+/g, '-');
    item.append(
      createElement('span', `srfsc-feed__tag srfsc-feed__tag--${slug}`, update.category),
      createElement('h4', 'srfsc-feed__title', update.title),
      createElement('p', 'srfsc-feed__body', update.body),
    );
    return item;
  }));
}

function bindFilterChips() {
  const chips = document.querySelectorAll('.srfsc-chips__chip');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    activeCategory = chip.dataset.category;
    chips.forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
    renderFeed();
  }));
}

export async function loadUpdatesPanel() {
  try {
    allUpdates = await fetchUpdates(20);
    renderFeed();
  } catch (error) {
    document.getElementById('srfsc-updates').replaceChildren(createElement('p', 'srfsc-empty', error.message));
  }
}

export function initUpdatesPanel() {
  bindFilterChips();
  return loadUpdatesPanel();
}
