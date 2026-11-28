// The Events viewer runs Mort's shared page viewer bar (_includes/page-viewer.html) on an event
// page opened from a card on /events/. The card's link carries events_view=1, the category and
// the page that was showing; the catalog saved its whole filtered order in sessionStorage, so
// previous and next can cross its pages and Back returns to the same page.
import { EventPager } from './event-pager.js';
import { EventTexts } from './event-texts.js';

const EVENT_PAGE = /^(.*\/events\/)[a-z0-9]+(?:-[a-z0-9]+)*\/$/;

/** Back, previous and next for an event page opened from the catalog. */
export class EventViewer {
  /** Where the catalog keeps its order for the viewer (sessionStorage). */
  static SNAPSHOT_KEY = 'events-viewer';

  /**
   * The catalog context in an event page's address, or null when it wasn't opened from a card.
   * @param {URL} url
   * @returns {{home: string, path: string, category: string, page: number}|null} home is the catalog's path
   */
  static context(url) {
    if (url.searchParams.get('events_view') !== '1') return null;
    const match = EVENT_PAGE.exec(url.pathname);
    if (!match) return null;
    return {
      home: match[1], path: url.pathname,
      category: (url.searchParams.get('events_category') || '').toLowerCase(), page: EventPager.read(url.search, 'events_page'),
    };
  }

  /**
   * An event page's address with the catalog context, or null unless it is an event page on this site.
   * @param {string} href - absolute, or relative to current
   * @param {{home: string, category: string, page: number}} context
   * @param {URL} current - the page's own address
   * @returns {URL|null}
   */
  static eventUrl(href, context, current) {
    let url;
    try {
      url = new URL(href, current);
    } catch (_) {
      return null;
    }
    if (url.origin !== current.origin || !url.pathname.startsWith(context.home)) return null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(url.pathname.slice(context.home.length))) return null;
    url.searchParams.set('events_view', '1');
    if (context.category) url.searchParams.set('events_category', context.category);
    else url.searchParams.delete('events_category');
    url.searchParams.set('events_page', String(context.page));
    return url;
  }

  /**
   * @param {HTMLElement} bar - the page viewer's nav[data-page-viewer]
   * @param {{toolbar: object, texts: object, location: Location, storage: Storage|null, document: Document, console?: Console}} options
   *   toolbar is assets/js/pages/viewer/toolbar.js; texts are the page's words (EventTexts.read)
   */
  constructor(bar, { toolbar, texts, location, storage, document, console: log = globalThis.console }) {
    this.bar = bar;
    this.toolbar = toolbar;
    this.texts = texts;
    this.location = location;
    this.storage = storage;
    this.document = document;
    this.console = log;
  }

  /**
   * Shows the bar: Back to the category and page that were showing, previous and next from the
   * catalog's order (or a note that they are unavailable), and the Microblog button in the bar.
   * @returns {EventViewer}
   */
  start() {
    const current = new URL(this.location.href);
    const context = EventViewer.context(current);
    const status = this.bar.querySelector('[data-viewer-status]');
    this.bar.hidden = false;
    if (!context) {
      status.textContent = this.texts.viewer.unavailable;
      return this;
    }
    this.pointBack(context, current);
    if (!this.linkNeighbors(context, current)) status.textContent = this.texts.viewer.unavailable;
    const microblog = this.document.getElementById('microblog-toggle-btn');
    if (microblog) {
      this.toolbar.mountViewerAction(this.bar.querySelector('[data-viewer-actions]'), microblog, {
        removeClasses: ['microblog-fab', 'microblog-fab-top', 'fill', 'pill'],
      });
    }
    return this;
  }

  /**
   * Points Back at the catalog with the category and the page that was showing.
   * @param {{home: string, category: string, page: number}} context
   * @param {URL} current
   */
  pointBack(context, current) {
    const params = new URLSearchParams();
    if (context.category) params.set('category', context.category);
    const home = new URL(this.bar.dataset.homeUrl || context.home, current).pathname;
    this.bar.querySelector('[data-viewer-home]').setAttribute('href', `${home}${EventPager.write(`?${params}`, 'page', context.page)}`);
  }

  /**
   * Sets previous and next from the catalog's saved order.
   * @param {{path: string, category: string, page: number}} context
   * @param {URL} current
   * @returns {boolean} false when there is no saved order for this category and event
   */
  linkNeighbors(context, current) {
    const snapshot = this.readSnapshot();
    const events = snapshot && snapshot.category === context.category && Array.isArray(snapshot.events) ? snapshot.events : [];
    const index = events.findIndex((event) => event && event.path === context.path);
    if (index < 0) return false;
    const steps = [['[data-viewer-previous]', events[index - 1], this.texts.viewer.previous], ['[data-viewer-next]', events[index + 1], this.texts.viewer.next]];
    for (const [selector, event, words] of steps) {
      if (!event) continue;
      const page = Number.isInteger(event.page) && event.page >= 1 ? event.page : context.page;
      const url = EventViewer.eventUrl(event.url, { ...context, page }, current);
      if (!url) continue;
      const label = EventTexts.fill(words, { title: event.title });
      this.toolbar.setViewerLink(this.bar.querySelector(selector), { href: url.href, label, title: label });
    }
    return true;
  }

  /**
   * The catalog's saved order, or null when there is none or it can't be read.
   * @returns {{category: string, page: number, events: object[]}|null}
   */
  readSnapshot() {
    try {
      return this.storage ? JSON.parse(this.storage.getItem(EventViewer.SNAPSHOT_KEY)) : null;
    } catch (error) {
      this.console.warn('Events: could not read the catalog order for previous and next', error);
      return null;
    }
  }
}
