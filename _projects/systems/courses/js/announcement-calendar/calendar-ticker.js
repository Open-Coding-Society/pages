// The calendar ticker: an ocs__ticker that shows what's coming up on a course's calendar, so the
// class home says what's going on before anyone asks. Any page can add it with
// {% include ocs_calendar_ticker.html %}; course homes put it above the announcements.
//
// TickerItems decides which events show, how each one reads and where it links. It is pure (no
// DOM, no network), so its rules are tested on their own.

import { addDays, formatShortDate, nextSchoolDay, PRIORITIES } from './calendar-model.js';

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
  /** How many school days after today the ticker reaches. */
  static SCHOOL_DAYS_AHEAD = 5;

  /** How many days ahead it reaches on a page with no school calendar. */
  static DAYS_AHEAD_WITHOUT_WEEKS = 7;

  /**
   * The last day the ticker shows: the fifth school day after today, skipping weekends, breaks
   * and closed days, or a week ahead when there are no school weeks.
   * @param {Array} weeks - school weeks from parseSchoolCalendar
   * @param {string} today - YYYY-MM-DD
   * @returns {string} YYYY-MM-DD
   */
  static lastDay(weeks, today) {
    if (!weeks.length) return addDays(today, TickerItems.DAYS_AHEAD_WITHOUT_WEEKS);
    let day = today;
    for (let count = 0; count < TickerItems.SCHOOL_DAYS_AHEAD; count += 1) {
      day = nextSchoolDay(weeks, addDays(day, 1));
    }
    return day;
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
   * Where an item links: the event's linked doc, or the calendar when it has none. A linked doc
   * that is the page the ticker is on (an event posted from its announcements) counts as none.
   * @param {{description: string}} event
   * @param {{splitLinkedDoc: Function|null, origin: string, pageUrl: string, calendarUrl: string}} links
   *   splitLinkedDoc is the Calendar system's reader (CalendarDocLinks.js), or null without it
   * @returns {string}
   */
  static linkFor(event, { splitLinkedDoc, origin, pageUrl, calendarUrl }) {
    const docUrl = splitLinkedDoc ? splitLinkedDoc(event.description, origin).docUrl : '';
    if (!docUrl) return calendarUrl;
    const doc = new URL(docUrl);
    const here = new URL(pageUrl);
    return doc.origin + doc.pathname === here.origin + here.pathname ? calendarUrl : docUrl;
  }

  /**
   * The ticker's items: by date, the most urgent first within a day.
   * @param {Array} events - calendar events as calendar-data.js normalizes them
   * @param {{today: string, splitLinkedDoc: Function|null, origin: string, pageUrl: string, calendarUrl: string}} options
   * @returns {Array<{text: string, href: string, urgent: boolean}>}
   */
  static from(events, { today, ...links }) {
    const rank = (priority) => {
      const position = PRIORITY_ORDER.indexOf(priority);
      return position === -1 ? PRIORITY_ORDER.length : position;
    };
    return [...events]
      .sort((a, b) => a.date.localeCompare(b.date) || rank(a.priority) - rank(b.priority))
      .map((event) => ({
        text: `${TickerItems.dayLabel(event.date, today)}: ${TickerItems.plainTitle(event.title)}`,
        href: TickerItems.linkFor(event, links),
        urgent: event.priority === URGENT.value,
      }));
  }
}
