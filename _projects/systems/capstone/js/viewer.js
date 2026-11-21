import { SNAPSHOT_KEY, matchingSnapshot, readViewerContext, viewerUrl, writeFilters } from './viewer-model.js';

export function startViewer(bar, { setViewerLink, mountViewerAction, fitViewerAbove }) {
  const current = new URL(window.location.href);
  const context = readViewerContext(current);
  const status = bar.querySelector('[data-viewer-status]');
  const back = bar.querySelector('[data-viewer-home]');
  bar.hidden = false;

  if (!context || !viewerUrl(current.href, context, current)) {
    status.textContent = 'Project navigation is unavailable. Return to Capstone to continue.';
  } else {
    const grid = writeFilters(new URL(bar.dataset.homeUrl, current), context);
    grid.searchParams.set('capstone_return', '1');
    back.href = grid.href;

    let snapshot;
    try {
      snapshot = JSON.parse(window.sessionStorage.getItem(SNAPSHOT_KEY));
    } catch (error) {
      console.warn('Could not read Capstone navigation state:', error);
    }

    if (matchingSnapshot(snapshot, context)) {
      const index = snapshot.projects.findIndex((project) => project?.path === context.project);
      for (const [selector, project] of [
        ['[data-viewer-previous]', snapshot.projects[index - 1]],
        ['[data-viewer-next]', snapshot.projects[index + 1]],
      ]) {
        if (!project) continue;
        const url = viewerUrl(project.url, { ...context, project: project.path }, current);
        if (!url) continue;
        const link = bar.querySelector(selector);
        const direction = selector.includes('previous') ? 'Previous' : 'Next';
        setViewerLink(link, { href: url.href, label: `${direction} project: ${project.title}`, title: `${direction}: ${project.title}` });
      }
    } else {
      status.textContent = 'Previous and next projects are unavailable. Return to Capstone to restore the results.';
    }

    const microblog = document.getElementById('microblog-toggle-btn');
    if (microblog) {
      mountViewerAction(bar.querySelector('[data-viewer-actions]'), microblog, {
        removeClasses: ['microblog-fab', 'microblog-fab-top', 'document-reader__microblog', 'fill', 'pill'],
      });
    }
    const reader = document.querySelector('[data-document-reader]');
    if (reader) fitViewerAbove(bar, reader);

    const content = document.querySelector('.page-content');
    function prepareLink(link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.hasAttribute('download')) return;
      try {
        const url = viewerUrl(href, context, current);
        if (url) link.href = url.href;
      } catch (error) {
        console.warn('Could not preserve Capstone context for a project link:', error);
      }
    }
    content.querySelectorAll('a[href]').forEach(prepareLink);
    for (const type of ['click', 'auxclick', 'contextmenu']) {
      content.addEventListener(type, (event) => {
        const link = event.target.closest('a[href]');
        if (link) prepareLink(link);
      }, true);
    }
  }
}
