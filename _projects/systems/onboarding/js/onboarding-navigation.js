import { CHALLENGES, viewerPath } from './onboarding-data.js';

export function startViewer(bar, { setViewerLink }) {
  const id = new URLSearchParams(location.search).get('challenge');
  const index = CHALLENGES.findIndex(challenge => challenge.id === id);
  const baseurl = document.querySelector('[data-onboarding-view]').dataset.baseurl;
  bar.hidden = false;
  if (index < 0) {
    bar.querySelector('[data-viewer-status]').textContent = 'Challenge not found. Return to onboarding.';
    return;
  }
  for (const [selector, item, direction] of [
    ['[data-viewer-previous]', CHALLENGES[index - 1], 'Previous'],
    ['[data-viewer-next]', CHALLENGES[index + 1], 'Next'],
  ]) {
    setViewerLink(bar.querySelector(selector), item ? {
      href: viewerPath(item.id, baseurl),
      label: `${direction}: ${item.title}`,
      title: `${direction}: ${item.title}`,
    } : null);
  }
}
