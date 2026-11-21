// ============================================
// CalendarAlerts.js
// RESPONSIBILITY: Read and write an event's ticker alert: how many days before its
// date the course home's calendar ticker starts showing it.
// It does NOT: make API calls, render modals, or touch the DOM.
//
// The Spring CalendarEvent has no column for it, so, like the linked doc
// (CalendarDocLinks.js), it is a line in the description: "Alert: 14 days before".
// It goes just before the linked doc line, which stays last. An event without the
// line uses the ticker's default look-ahead (calendar_ticker in _config.yml).
// ============================================

const LINE_BREAK = String.raw`(?:\r?\n|<br\s*\/?>)`;

// On a line of its own, at the end of the description or just before the linked doc
// line. Anywhere else the same words are the description's own text. No repeat in it
// can match what the next part matches, so a long run of blank lines can't make it slow
// (any signed-in account writes descriptions, and every visitor's ticker reads them).
const ALERT_LINE = new RegExp(
  String.raw`(?:^|${LINE_BREAK})[ \t]*Alert:[ \t]*(\d{1,3})[ \t]+days?[ \t]+before[ \t]*`
    + String.raw`(?=$|${LINE_BREAK}(?:\s|<br\s*\/?>)*(?:$|Linked doc:))`,
  'i',
);

export class CalendarAlerts {
  /** The longest alert, in days. */
  static MAX_DAYS = 365;

  /**
   * Whether a value is an alert: a whole number of days from 0 (only on the day) to MAX_DAYS.
   * @param {*} days
   * @returns {boolean}
   */
  static isDays(days) {
    return Number.isInteger(days) && days >= 0 && days <= CalendarAlerts.MAX_DAYS;
  }

  /**
   * Separate the alert line from the rest of an event description.
   * @param {string} description - as stored, with or without the linked doc line after it
   * @returns {{body: string, days: number|null}} the description without the alert line
   *   (a linked doc line stays), and the alert's days, or null when there is none
   */
  static split(description) {
    const text = String(description ?? '');
    const match = text.match(ALERT_LINE);
    const days = match ? Number(match[1]) : null;
    if (!CalendarAlerts.isDays(days)) return { body: text, days: null };
    const before = text.slice(0, match.index);
    const rest = text.slice(match.index + match[0].length);
    return { body: rest.trim() ? before + rest : before.trimEnd(), days };
  }

  /**
   * Put an alert line at the end of a description. Join the linked doc after it
   * (joinLinkedDoc) so the doc line stays last.
   * @param {string} body - description text without the linked doc line
   * @param {number|null} days - the alert, or null for none
   * @returns {string} an alert line the text already ends with is replaced
   */
  static join(body, days) {
    const text = CalendarAlerts.split(body).body.trimEnd();
    if (days === null) return text;
    const line = CalendarAlerts.format(days);
    return text ? `${text}\n${line}` : line;
  }

  /**
   * The alert as its description line.
   * @param {number} days
   * @returns {string} e.g. "Alert: 14 days before"
   * @throws {RangeError} when days is not a whole number from 0 to MAX_DAYS
   */
  static format(days) {
    if (!CalendarAlerts.isDays(days)) throw CalendarAlerts.rangeError(days);
    return `Alert: ${days} ${days === 1 ? 'day' : 'days'} before`;
  }

  /**
   * Read the event window's alert box.
   * @param {string} value - what was typed; blank means the ticker's default
   * @param {number} [maxDays] - the site's limit (calendar_ticker's alert_limit_days), never
   *   more than MAX_DAYS: the ticker can't see an alert further ahead than that. A limit that
   *   isn't a whole number (a broken config) counts as MAX_DAYS, so events can still be saved.
   * @returns {number|null} the days, or null when blank
   * @throws {RangeError} when it is not a whole number from 0 to the limit
   */
  static parse(value, maxDays = CalendarAlerts.MAX_DAYS) {
    const text = String(value ?? '').trim();
    if (!text) return null;
    const days = Number(text);
    const max = CalendarAlerts.isDays(maxDays) ? maxDays : CalendarAlerts.MAX_DAYS;
    if (!CalendarAlerts.isDays(days) || days > max) throw CalendarAlerts.rangeError(text, max);
    return days;
  }

  /**
   * The alert in words, for the event window.
   * @param {number|null} days
   * @returns {string}
   */
  static describe(days) {
    if (days === null) return 'Default';
    if (days === 0) return 'On the day only';
    return `${days} ${days === 1 ? 'day' : 'days'} before`;
  }

  /** @private */
  static rangeError(value, max = CalendarAlerts.MAX_DAYS) {
    return new RangeError(`Ticker alert must be a whole number of days from 0 to ${max}, not "${value}".`);
  }
}
