// The /events/ catalog (img3). Jekyll lists every listed event in date order; the site rebuilds
// only on a push, so the browser updates each card's pill by the clock, moves the events that
// have ended under Past Events (newest first), filters both grids by ?category=, and shows a page
// of each grid at a time (?page= and ?past=), moving only when Earlier or Later is pressed.
// Cards are moved in and out of the grids, never hidden: an ocs__grid-cell's display beats
// [hidden]. Cards not on the page wait in a detached fragment.
import { EventPager } from './event-pager.js';
import { EventTexts } from './event-texts.js';
import { EventTime } from './event-time.js';
import { EventViewer } from './event-viewer.js';

/** The Upcoming Events catalog on /events/. */
export class EventCatalog {
  /**
   * @param {HTMLElement} root - the section[data-event-catalog]
   * @param {{texts: object, pageSize: number, now?: Function, location: Location, history: History,
   *   storage: Storage|null, console?: Console, window?: EventTarget}} options
   *   texts are the page's words (EventTexts.read); pageSize is events.page_size from _config.yml;
   *   now returns the current Date; window receives popstate
   */
  constructor(root, { texts, pageSize, now = () => new Date(), location, history, storage, console: log = globalThis.console, window: target }) {
    this.root = root;
    this.texts = texts;
    this.pageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : null;
    this.now = now;
    this.location = location;
    this.history = history;
    this.storage = storage;
    this.console = log;
    this.window = target;
  }

  /**
   * Sorts the cards into upcoming and past by the clock, then wires the buttons, the pagers and
   * the card links, and shows the page the address asks for.
   * @returns {EventCatalog}
   */
  start() {
    this.waiting = this.root.ownerDocument.createDocumentFragment();
    this.buttons = [...this.root.querySelectorAll('button[data-event-category]')];
    this.lists = this.sortByClock([...this.root.querySelectorAll('[data-event-card]')]);
    this.buttons.forEach((button) => button.addEventListener('click', () => this.choose(button.getAttribute('data-event-category'))));
    for (const name of ['upcoming', 'past']) {
      const pager = this.root.querySelector(`[data-event-pager="${name}"]`);
      for (const link of [pager.querySelector('[data-event-earlier]'), pager.querySelector('[data-event-later]')]) {
        link.addEventListener('click', (event) => this.turn(event, link));
      }
    }
    for (const card of [...this.lists.upcoming, ...this.lists.past]) {
      const link = card.querySelector('[data-event-link]');
      for (const type of ['click', 'auxclick', 'contextmenu']) link.addEventListener(type, () => this.saveOrder(card));
    }
    if (this.window) this.window.addEventListener('popstate', () => this.render());
    this.render();
    return this;
  }

  /**
   * Updates each card's pill by the clock and splits the cards into upcoming (Jekyll's order) and
   * past (newest first). A card in a time zone the browser doesn't know keeps its built pill and
   * stays upcoming, with one warning for the page.
   * @param {HTMLElement[]} cards
   * @returns {{upcoming: HTMLElement[], past: HTMLElement[]}}
   */
  sortByClock(cards) {
    const now = this.now();
    const order = this.texts.lifecycle.map((stage) => stage.key);
    const upcoming = [];
    const past = [];
    let warned = false;
    for (const card of cards) {
      const data = card.dataset;
      let window = null;
      try {
        window = EventTime.window({ day: data.eventDay, start: data.eventStart, end: data.eventEnd, zone: data.eventZone });
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        if (!warned) this.console.warn(`Events: this browser doesn't know the time zone ${data.eventZone}, so its events keep their built stage`, error);
        warned = true;
      }
      if (!window) {
        upcoming.push(card);
        continue;
      }
      EventTexts.showStage(card.querySelector('[data-event-pill]'), this.texts.lifecycle, EventTime.stage(data.eventStage, now, window, order));
      if (window.end <= now) past.push({ card, start: window.start });
      else upcoming.push(card);
    }
    past.sort((first, second) => second.start - first.start);
    return { upcoming, past: past.map((entry) => entry.card) };
  }

  /**
   * Draws the address's category and pages: the pressed button, both grids, the pagers, the empty
   * state, the Past Events part, the card links and the status line.
   */
  render() {
    const search = this.location.search;
    const category = this.categoryIn(search);
    this.buttons.forEach((button) => {
      const pressed = button.getAttribute('data-event-category') === category;
      button.setAttribute('aria-pressed', String(pressed));
      button.classList.toggle('fill', pressed);
    });
    const matches = (card) => !category || EventCatalog.categoriesOf(card).includes(category);
    const upcoming = this.lists.upcoming.filter(matches);
    const past = this.lists.past.filter(matches);
    const shown = this.showPage('upcoming', upcoming, EventPager.read(search, 'page'), search);
    this.showPage('past', past, EventPager.read(search, 'past'), search);
    this.root.querySelector('[data-event-empty]').hidden = upcoming.length > 0;
    this.root.querySelector('[data-event-past]').hidden = past.length === 0;
    this.linkCards(upcoming, past, category);
    this.root.querySelector('[data-event-status]').textContent = this.statusLine(category, upcoming.length, shown);
    this.view = { category, page: shown.page, upcoming };
  }

  /**
   * Puts one page of cards in a grid (the rest wait in the fragment) and points its pager's links.
   * @param {string} name - "upcoming" (?page=) or "past" (?past=)
   * @param {HTMLElement[]} cards - the grid's cards that match the category
   * @param {number} page - the page the address asks for
   * @param {string} search
   * @returns {{page: number, pages: number, items: HTMLElement[]}}
   */
  showPage(name, cards, page, search) {
    const key = name === 'upcoming' ? 'page' : 'past';
    const shown = EventPager.slice(cards, page, this.sizeFor(cards));
    const grid = this.root.querySelector(`[data-event-grid="${name}"]`);
    this.waiting.append(...[...grid.children]);
    grid.append(...shown.items);
    const pager = this.root.querySelector(`[data-event-pager="${name}"]`);
    pager.hidden = shown.pages <= 1;
    this.point(pager.querySelector('[data-event-earlier]'), shown.page > 1 ? EventPager.write(search, key, shown.page - 1) : null);
    this.point(pager.querySelector('[data-event-later]'), shown.page < shown.pages ? EventPager.write(search, key, shown.page + 1) : null);
    return shown;
  }

  /**
   * Points a pager link at a page of this catalog, or turns it off, like img3's grey arrow at an end.
   * @param {HTMLElement} link
   * @param {string|null} search - the page's query, or null when there is nowhere to go
   */
  point(link, search) {
    if (search === null) {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    } else {
      link.setAttribute('href', `${this.location.pathname}${search}`);
      link.removeAttribute('aria-disabled');
    }
  }

  /**
   * Opens a pager link's page in place, as a new history entry, so the browser's Back steps back.
   * A click that opens a new tab or window is left to the browser.
   * @param {Event} event
   * @param {HTMLElement} link
   */
  turn(event, link) {
    const href = link.getAttribute('href');
    if (!href || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.history.pushState(null, '', href);
    this.render();
  }

  /**
   * Chooses a category (or All, the empty key) and goes back to the first page of both grids.
   * @param {string} category
   */
  choose(category) {
    const params = new URLSearchParams(this.location.search);
    if (category) params.set('category', category);
    else params.delete('category');
    params.delete('page');
    params.delete('past');
    const query = params.toString();
    this.history.pushState(null, '', `${this.location.pathname}${query ? `?${query}` : ''}`);
    this.render();
  }

  /**
   * Points each upcoming card at its event with the viewer's context (events_view, the category
   * and the card's page). Past cards open their event plainly: the viewer's order is the upcoming one.
   * @param {HTMLElement[]} upcoming
   * @param {HTMLElement[]} past
   * @param {string} category
   */
  linkCards(upcoming, past, category) {
    const current = new URL(this.location.href);
    const size = this.sizeFor(upcoming);
    upcoming.forEach((card, index) => {
      const context = { home: this.location.pathname, category, page: Math.floor(index / size) + 1 };
      const url = EventViewer.eventUrl(card.dataset.eventUrl, context, current);
      card.querySelector('[data-event-link]').setAttribute('href', url ? `${url.pathname}${url.search}` : card.dataset.eventUrl);
    });
    past.forEach((card) => card.querySelector('[data-event-link]').setAttribute('href', card.dataset.eventUrl));
  }

  /**
   * Saves the whole filtered upcoming order and the page showing, for the viewer on the event page.
   * A storage error only warns.
   * @param {HTMLElement} card - the card whose link was used
   */
  saveOrder(card) {
    if (!this.view.upcoming.includes(card)) return;
    const size = this.sizeFor(this.view.upcoming);
    const events = this.view.upcoming.map((each, index) => {
      const url = new URL(each.dataset.eventUrl, this.location.href);
      return { path: url.pathname, url: url.href, title: each.querySelector('[data-event-link]').textContent.trim(), page: Math.floor(index / size) + 1 };
    });
    try {
      if (!this.storage) throw new Error('sessionStorage is unavailable');
      this.storage.setItem(EventViewer.SNAPSHOT_KEY, JSON.stringify({ category: this.view.category, page: this.view.page, events }));
    } catch (error) {
      this.console.warn('Events: could not save the order for previous and next', error);
    }
  }

  /**
   * The status line: how many upcoming events show, in which category, and which page.
   * @param {string} category
   * @param {number} count - upcoming events in the category
   * @param {{page: number, pages: number}} shown
   * @returns {string}
   */
  statusLine(category, count, shown) {
    const words = this.texts.catalog;
    const button = this.buttons.find((each) => each.getAttribute('data-event-category') === category);
    const name = button ? button.textContent.trim() : category;
    let line = '';
    if (category && count === 0) line = EventTexts.fill(words.none_in, { category: name });
    else if (category) line = EventTexts.fill(count === 1 ? words.showing_one_in : words.showing_in, { count, category: name });
    else if (count > 0) line = EventTexts.fill(count === 1 ? words.showing_one : words.showing, { count });
    return shown.pages > 1 ? `${line} ${EventTexts.fill(words.page_of, shown)}` : line;
  }

  /**
   * The category key an address asks for, if a button has it; otherwise All, the empty key.
   * @param {string} search
   * @returns {string}
   */
  categoryIn(search) {
    const wanted = (new URLSearchParams(search).get('category') || '').toLowerCase();
    return this.buttons.some((button) => button.getAttribute('data-event-category') === wanted) ? wanted : '';
  }

  /**
   * Cards on a page: events.page_size, or all of them when the site set none.
   * @param {HTMLElement[]} cards
   * @returns {number}
   */
  sizeFor(cards) {
    return this.pageSize || Math.max(1, cards.length);
  }

  /**
   * A card's category keys (lowercase), as event-card.html writes them.
   * @param {HTMLElement} card
   * @returns {string[]}
   */
  static categoriesOf(card) {
    try {
      const keys = JSON.parse(card.dataset.eventCategories || '[]');
      return Array.isArray(keys) ? keys : [];
    } catch (_) {
      return [];
    }
  }
}
