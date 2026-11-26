// The Events adapter for Mort's shared page viewer. _includes/page-viewer.html imports this
// module when an event page's address has events_view=1 and calls adapter.startViewer(bar,
// toolbar), so this one export is a function; the work is in EventViewer.
import { EventTexts } from './event-texts.js';
import { EventViewer } from './event-viewer.js';

/**
 * Starts the viewer bar on an event page opened from /events/.
 * @param {HTMLElement} bar - the page viewer's nav[data-page-viewer]
 * @param {object} toolbar - assets/js/pages/viewer/toolbar.js
 * @returns {EventViewer}
 */
export function startViewer(bar, toolbar) {
  let storage = null;
  try {
    storage = window.sessionStorage;
  } catch (error) {
    console.warn('Events: sessionStorage is unavailable, so previous and next are too', error);
  }
  return new EventViewer(bar, { toolbar, texts: EventTexts.read(document), location: window.location, storage, document, console }).start();
}
