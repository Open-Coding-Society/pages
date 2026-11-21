// The calendar ticker: an ocs__ticker that shows what's coming up on a course's calendar, so the
// class home says what's going on before anyone asks. Any page can add it with
// {% include ocs_calendar_ticker.html %}; course homes put it above the announcements.
//
// TickerItems decides which events show, how each one reads and where it links. It is pure (no
// DOM, no network), so its rules are tested on their own. CalendarTicker fills the include's
// empty bar with them and keeps it current.
//
// The calendar is in Spring and Spring answers only signed-in visitors, so a Flask-only site, a
// signed-out visitor, or a course with nothing coming up gets no bar at all.

import { createLiveCalendarStore } from './calendar-data.js';
import {
  addDays, formatShortDate, nextSchoolDay, parseSchoolCalendar, PRIORITIES, todayIso,
} from './calendar-model.js';

// The same rule the week strip uses (calendar-feed.js): a closing tag or an entity means the title
// was saved as HTML. A typed title such as "ArrayList<Integer> practice" has neither.
const LOOKS_LIKE_MARKUP = /<\/[a-z][\w-]*\s*>|&(#\d+|#x[\da-f]+|[a-z]+\d*);/i;
const TAG = /<[^>]*>/g;
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const URGENT = PRIORITIES[0]; // P0, labeled Urgent
const PRIORITY_ORDER = PRIORITIES.map((priority) => priority.value);

function decodeEntities(text) {
  return text.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, name) => {
    if (name[0] !== '#') return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
    const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    try { return String.fromCodePoint(code); } catch (_) { return entity; }
  });
}

export class TickerItems {
  /**
   * The last day of the look-ahead: the schoolDays-th school day after today, skipping weekends,
   * breaks and closed days, or `days` after today when there are no school weeks. Both come from
   * calendar_ticker in _config.yml, which the include writes on the bar.
   * @param {Array} weeks - school weeks from parseSchoolCalendar
   * @param {string} today - YYYY-MM-DD
   * @param {{schoolDays: number, days: number}} reach
   * @returns {string} YYYY-MM-DD
   */
  static lastDay(weeks, today, { schoolDays, days }) {
    if (!weeks.length) return addDays(today, days);
    let day = today;
    for (let count = 0; count < schoolDays; count += 1) {
      day = nextSchoolDay(weeks, addDays(day, 1));
    }
    return day;
  }

  /**
   * The last day to ask the calendar for. When the ticker can read events' own alerts, an event
   * as far as alertLimitDays ahead may already be showing, so it asks that far.
   * @param {string} today - YYYY-MM-DD
   * @param {string} lastDay - the look-ahead's last day
   * @param {{alertLimitDays: number, readsAlerts: boolean}} options
   * @returns {string} YYYY-MM-DD
   */
  static fetchUntil(today, lastDay, { alertLimitDays, readsAlerts }) {
    if (!readsAlerts) return lastDay;
    const limit = addDays(today, alertLimitDays);
    return limit > lastDay ? limit : lastDay;
  }

  /**
   * Whether an event is on the ticker today: through the look-ahead's last day, or, when it has
   * its own alert, from that many days before its date. An alert longer than alertLimitDays
   * counts as alertLimitDays. Events before today never are.
   * @param {{date: string, description: string}} event
   * @param {{today: string, lastDay: string, calendarAlerts: object|null, alertLimitDays: number}} options
   *   calendarAlerts is the Calendar system's reader (CalendarAlerts.js), or null without it
   * @returns {boolean}
   */
  static shows(event, { today, lastDay, calendarAlerts, alertLimitDays }) {
    if (event.date < today) return false;
    const days = calendarAlerts ? calendarAlerts.split(event.description).days : null;
    if (days === null) return event.date <= lastDay;
    return event.date <= addDays(today, Math.min(days, alertLimitDays));
  }

  /**
   * "Today", "Tomorrow", or the short date the week strip uses.
   * @param {string} date - the event's day, YYYY-MM-DD
   * @param {string} today - YYYY-MM-DD
   * @returns {string}
   */
  static dayLabel(date, today) {
    if (date === today) return 'Today';
    if (date === addDays(today, 1)) return 'Tomorrow';
    return formatShortDate(date);
  }

  /**
   * An event title as plain words. A title saved as HTML loses its tags; any other title stays
   * as typed. Extra spaces are collapsed either way.
   * @param {string} title
   * @returns {string}
   */
  static plainTitle(title) {
    const raw = String(title ?? '');
    // Tags come out before entities are read, so an escaped tag in the text stays text.
    const text = LOOKS_LIKE_MARKUP.test(raw) ? decodeEntities(raw.replace(TAG, '')) : raw;
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Where an item links: the event's linked doc, or the calendar when it has none. Only a doc on
   * this site counts: anyone signed in can add an event, so a link to another site opens the
   * calendar, where the event shows the link's full address. A linked doc that is the page the
   * ticker is on (an event posted from its announcements) counts as none too.
   * @param {{description: string}} event
   * @param {{splitLinkedDoc: Function|null, origin: string, pageUrl: string, calendarUrl: string}} links
   *   splitLinkedDoc is the Calendar system's reader (CalendarDocLinks.js), or null without it
   * @returns {string}
   */
  static linkFor(event, { splitLinkedDoc, origin, pageUrl, calendarUrl }) {
    const docUrl = splitLinkedDoc ? splitLinkedDoc(event.description, origin).docUrl : '';
    if (!docUrl) return calendarUrl;
    const doc = new URL(docUrl);
    if (doc.origin !== origin) return calendarUrl;
    return doc.pathname === new URL(pageUrl).pathname ? calendarUrl : docUrl;
  }

  /**
   * The ticker's items: the events it shows today (shows), by date, the most urgent first within
   * a day.
   * @param {Array} events - calendar events as calendar-data.js normalizes them
   * @param {object} options
   * @param {string} options.today - YYYY-MM-DD
   * @param {string} options.lastDay - the look-ahead's last day (lastDay)
   * @param {object|null} [options.calendarAlerts] - the Calendar system's alert reader, or null
   * @param {number} [options.alertLimitDays] - needed with calendarAlerts
   * @param {Function|null} options.splitLinkedDoc - and origin, pageUrl, calendarUrl: see linkFor
   * @returns {Array<{text: string, href: string, urgent: boolean}>}
   */
  static from(events, {
    today, lastDay, calendarAlerts = null, alertLimitDays, ...links
  }) {
    const rank = (priority) => {
      const position = PRIORITY_ORDER.indexOf(priority);
      return position === -1 ? PRIORITY_ORDER.length : position;
    };
    return events
      .filter((event) => TickerItems.shows(event, { today, lastDay, calendarAlerts, alertLimitDays }))
      .sort((a, b) => a.date.localeCompare(b.date) || rank(a.priority) - rank(b.priority))
      .map((event) => ({
        text: `${TickerItems.dayLabel(event.date, today)}: ${TickerItems.plainTitle(event.title)}`,
        href: TickerItems.linkFor(event, links),
        urgent: event.priority === URGENT.value,
      }));
  }
}

const SCHOOL_CALENDAR_SELECTOR = 'script[id="ocsSchoolCalendarData"]';
const SIGNED_OUT = new Set([401, 403]);

export class CalendarTicker {
  /** How fast a moving bar slides, so a long and a short list move at the same speed. */
  static PIXELS_PER_SECOND = 50;

  /**
   * Start every calendar ticker the include put inside root. On a site without Spring
   * (spring: false) it starts none and asks Spring nothing.
   * @param {Document|Element} root - usually document
   * @param {object} options
   * @param {string} options.javaURI - Spring's address, from config.js
   * @param {object} options.fetchOptions - from config.js, with the sign-in cookie
   * @param {boolean} options.springEnabled - from config.js
   * @param {Function|null} options.splitLinkedDoc - the Calendar system's linked-doc reader, or null
   * @param {object|null} [options.calendarAlerts] - the Calendar system's alert reader
   *   (CalendarAlerts.js), or null without it: then every event keeps to the look-ahead
   * @param {string} [options.today] - YYYY-MM-DD; the visitor's today when left out
   * @param {{origin: string, href: string}} [options.location] - the page's address
   * @returns {CalendarTicker[]}
   * @throws {RangeError} when a bar's look-ahead setting is missing or not a whole number (reach)
   */
  static mountAll(root, {
    javaURI, fetchOptions, springEnabled, splitLinkedDoc = null, calendarAlerts = null, today = null,
    location = globalThis.location,
  }) {
    if (!springEnabled) return [];
    const data = root.querySelector(SCHOOL_CALENDAR_SELECTOR);
    const weeks = data ? parseSchoolCalendar(JSON.parse(data.textContent)).weeks : [];
    const wrappers = [...root.querySelectorAll('[data-ocs-calendar-ticker]')];
    // Every bar's setting is read before any bar asks Spring, so a broken one stops them all.
    const reaches = wrappers.map((wrapper) => CalendarTicker.reach(wrapper));
    return wrappers.map((wrapper, index) => {
      const ticker = new CalendarTicker(wrapper, {
        store: createLiveCalendarStore({ course: wrapper.dataset.course || 'all', javaURI, fetchOptions }),
        weeks,
        reach: reaches[index],
        calendarAlerts,
        splitLinkedDoc,
        origin: location.origin,
        pageUrl: location.href,
        calendarUrl: wrapper.dataset.calendarUrl,
        today,
      });
      ticker.start();
      return ticker;
    });
  }

  /**
   * How far a bar looks ahead: the include writes calendar_ticker from _config.yml on it as
   * data-school-days-ahead, data-days-ahead and data-alert-limit-days.
   * @param {Element} wrapper - the include's [data-ocs-calendar-ticker] element
   * @returns {{schoolDays: number, days: number, alertLimitDays: number}}
   * @throws {RangeError} when one is missing or not a whole number of days
   */
  static reach(wrapper) {
    const read = (attribute) => {
      const value = wrapper.getAttribute(attribute);
      const days = value === null || value.trim() === '' ? Number.NaN : Number(value);
      if (!Number.isInteger(days) || days < 0) {
        throw new RangeError(
          `Calendar ticker: ${attribute} must be a whole number of days (calendar_ticker in _config.yml), not "${value}"`,
        );
      }
      return days;
    };
    return {
      schoolDays: read('data-school-days-ahead'),
      days: read('data-days-ahead'),
      alertLimitDays: read('data-alert-limit-days'),
    };
  }

  /**
   * @param {Element} wrapper - the include's hidden [data-ocs-calendar-ticker] element
   * @param {object} options
   * @param {{listRange: Function}} options.store - a calendar store from calendar-data.js
   * @param {Array} options.weeks - school weeks; [] when the page has none
   * @param {{schoolDays: number, days: number, alertLimitDays: number}} options.reach - see reach
   * @param {object|null} options.calendarAlerts - the Calendar system's alert reader, or null
   * @param {Function|null} options.splitLinkedDoc
   * @param {string} options.origin
   * @param {string} options.pageUrl
   * @param {string} options.calendarUrl - where an item without a linked doc goes
   * @param {string|null} options.today
   */
  constructor(wrapper, {
    store, weeks, reach, calendarAlerts, splitLinkedDoc, origin, pageUrl, calendarUrl, today,
  }) {
    this.wrapper = wrapper;
    this.section = wrapper.querySelector('.ocs__ticker');
    this.viewport = wrapper.querySelector('.ocs__ticker-viewport');
    this.track = wrapper.querySelector('[data-hook="track"]');
    this.store = store;
    this.weeks = weeks;
    this.reach = reach;
    this.calendarAlerts = calendarAlerts;
    this.links = { splitLinkedDoc, origin, pageUrl, calendarUrl };
    this.today = today;
    this.stopped = false;
    this.observer = null;
    this.onVisible = () => {
      if (document.visibilityState === 'visible') this.refresh();
    };
  }

  /**
   * Load the events, then keep the bar current: reload when the visitor comes back to the tab,
   * and check again whether it fits when its width changes or the page's fonts arrive.
   * @returns {Promise<void>} the first load
   */
  start() {
    document.addEventListener('visibilitychange', this.onVisible);
    if (typeof ResizeObserver === 'function') {
      let width = null;
      this.observer = new ResizeObserver(([entry]) => {
        if (entry.contentRect.width === width) return;
        width = entry.contentRect.width;
        this.fit();
      });
      this.observer.observe(this.viewport);
    }
    document.fonts?.ready.then(() => this.fit());
    return this.refresh();
  }

  /**
   * Ask the calendar for today through the look-ahead (or the alert limit, when alerts can be
   * read) and show what is on the ticker today. Signed out (401 or 403) there is nothing to show;
   * any other failure is logged. Either way the bar stays hidden.
   * @returns {Promise<void>}
   */
  async refresh() {
    const today = this.today || todayIso();
    const { alertLimitDays } = this.reach;
    const lastDay = TickerItems.lastDay(this.weeks, today, this.reach);
    const until = TickerItems.fetchUntil(today, lastDay, { alertLimitDays, readsAlerts: Boolean(this.calendarAlerts) });
    let events;
    try {
      events = await this.store.listRange(today, until);
    } catch (error) {
      if (!SIGNED_OUT.has(error.status)) console.warn('Calendar ticker: could not load the calendar', error);
      events = [];
    }
    if (this.stopped) return;
    this.show(TickerItems.from(events, {
      today, lastDay, calendarAlerts: this.calendarAlerts, alertLimitDays, ...this.links,
    }));
  }

  /**
   * Put the items in the bar, or hide it when there are none. The second list is the copy the
   * grammar slides in behind the first, so screen readers and the Tab key skip it.
   * @param {Array<{text: string, href: string, urgent: boolean}>} items
   */
  show(items) {
    if (!items.length) {
      this.track.replaceChildren();
      this.wrapper.hidden = true;
      return;
    }
    this.track.replaceChildren(CalendarTicker.list(items, false), CalendarTicker.list(items, true));
    this.wrapper.hidden = false;
    this.fit();
  }

  /**
   * Move the bar only when its items don't fit on one row. The grammar still keeps it still on
   * phones, touch screens and with reduced motion, and its Pause switch stops it anywhere.
   */
  fit() {
    const [list] = this.track.children;
    this.section.classList.remove('ocs__ticker--moving');
    if (!list) return;
    const items = [...list.children];
    if (items.every((item) => item.offsetTop === items[0].offsetTop)) return;
    this.section.classList.add('ocs__ticker--moving');
    const seconds = Math.round(list.getBoundingClientRect().width / CalendarTicker.PIXELS_PER_SECOND);
    this.section.style.setProperty('--ocs-ticker-duration', `${seconds}s`);
  }

  /** Stop listening and leave the bar empty and hidden. */
  unmount() {
    this.stopped = true;
    document.removeEventListener('visibilitychange', this.onVisible);
    this.observer?.disconnect();
    this.track.replaceChildren();
    this.wrapper.hidden = true;
    this.section.classList.remove('ocs__ticker--moving');
  }

  /**
   * One list of items as an ocs__ticker-items list of links. Text goes in as text, never HTML.
   * @param {Array<{text: string, href: string, urgent: boolean}>} items
   * @param {boolean} copy - the loop copy: hidden from screen readers, out of the tab order
   * @returns {Element}
   */
  static list(items, copy) {
    const list = document.createElement('ul');
    list.className = 'ocs__ticker-items';
    if (copy) list.setAttribute('aria-hidden', 'true');
    items.forEach(({ text, href, urgent }) => {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      if (copy) link.setAttribute('tabindex', '-1');
      if (urgent) {
        const pill = document.createElement('span');
        pill.className = 'ocs__status-pill ocs__status-pill--bad';
        pill.textContent = URGENT.label;
        link.append(pill, ' ');
      }
      link.append(text);
      const item = document.createElement('li');
      item.append(link);
      list.append(item);
    });
    return list;
  }
}
