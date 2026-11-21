import { readSnapshot, viewerDocumentUrl, neighbors } from './viewer-model.js';
import { readState, writeState } from './model.js';

export function startViewer(bar, { setViewerLink, mountViewerAction, fitViewerAbove }) {
  const current = new URL(window.location.href);
  const home = new URL(bar.dataset.homeUrl, current);
  const base = home.pathname.replace(/\/topics\/?$/, '');
  const status = bar.querySelector('[data-viewer-status]');
  home.search = writeState(readState(current.search));
  home.searchParams.set('topics_return', '1');
  bar.querySelector('[data-viewer-home]').href = home.href;
  bar.hidden = false;

  const snapshot = readSnapshot(current.search);
  if (snapshot) {
    const adjacent = neighbors(snapshot, current.pathname, base, current.origin);
    for (const [direction, document] of [['previous', adjacent[0]], ['next', adjacent[1]]]) {
      if (!document) continue;
      const label = direction === 'previous' ? 'Previous' : 'Next';
      setViewerLink(bar.querySelector(`[data-viewer-${direction}]`), {
        href: viewerDocumentUrl(document, base, current.search, current.origin).href,
        label: `${label} document: ${document.title}`,
        title: `${label}: ${document.title}`,
      });
    }
    if (!adjacent.length) status.textContent = 'This document is not in the saved results. Return to Topic Filters to restore navigation.';
  } else {
    status.textContent = 'Previous and next documents are unavailable. Return to Topic Filters to restore the results.';
  }

  const microblog = document.getElementById('microblog-toggle-btn');
  if (microblog) {
    mountViewerAction(bar.querySelector('[data-viewer-actions]'), microblog, {
      removeClasses: ['microblog-fab', 'microblog-fab-top', 'document-reader__microblog', 'fill', 'pill'],
    });
  }
  const reader = document.querySelector('[data-document-reader]');
  if (reader) {
    reader.classList.add('document-reader--viewer-focused');
    fitViewerAbove(bar, reader);
  }
}
