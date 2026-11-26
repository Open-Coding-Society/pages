// Plain Monday-to-Friday weeks for the Courses week view (calendar-feed.js mountWeekView). The
// Courses calendar is built on the school year's weeks, with breaks and holidays; an
// organization has neither, so these weeks have the same shape and none of that. index is
// the ISO week number, so the view's "Week 47" means what a calendar says it means.

const DAY_MS = 24 * 3600 * 1000;

/**
 * Plain calendar weeks, used like Java's Math: CalendarWeeks.plain('2026-11-19').
 */
export class CalendarWeeks {
  /**
   * A YYYY-MM-DD day as midnight UTC, so adding days never crosses a clock change.
   * @param {string} iso
   * @returns {Date}
   */
  static parse(iso) {
    const [year, month, day] = String(iso).split('-').map(Number);
    if (!year || !month || !day) throw new TypeError(`CalendarWeeks: not a YYYY-MM-DD day: ${JSON.stringify(iso)}`);
    return new Date(Date.UTC(year, month - 1, day));
  }

  /**
   * Today's local date (or another moment's) as YYYY-MM-DD.
   * @param {Date} now
   * @returns {string}
   */
  static today(now = new Date()) {
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  /**
   * @param {Date} date midnight UTC
   * @returns {string} YYYY-MM-DD
   */
  static format(date) {
    return date.toISOString().slice(0, 10);
  }

  /**
   * @param {string} iso
   * @param {number} days
   * @returns {string}
   */
  static addDays(iso, days) {
    return CalendarWeeks.format(new Date(CalendarWeeks.parse(iso).getTime() + days * DAY_MS));
  }

  /**
   * The Monday of the week a day is in (a Sunday belongs to the week before).
   * @param {string} iso
   * @returns {string}
   */
  static mondayOf(iso) {
    const weekday = CalendarWeeks.parse(iso).getUTCDay() || 7;
    return CalendarWeeks.addDays(iso, 1 - weekday);
  }

  /**
   * The day itself on a weekday, or the Monday after a Saturday or Sunday: the week view
   * shows Monday to Friday.
   * @param {string} iso
   * @returns {string}
   */
  static weekdayOnOrAfter(iso) {
    const weekday = CalendarWeeks.parse(iso).getUTCDay();
    if (weekday === 6) return CalendarWeeks.addDays(iso, 2);
    if (weekday === 0) return CalendarWeeks.addDays(iso, 1);
    return iso;
  }

  /**
   * The ISO 8601 week number: the week whose Thursday is in the year.
   * @param {string} iso
   * @returns {number}
   */
  static isoWeek(iso) {
    const thursday = CalendarWeeks.parse(CalendarWeeks.addDays(CalendarWeeks.mondayOf(iso), 3));
    const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
    return Math.floor((thursday.getTime() - yearStart) / DAY_MS / 7) + 1;
  }

  /**
   * Weeks around a day, shaped like the school weeks the week view reads.
   * @param {string} todayIso
   * @param {{before?: number, after?: number}} options how many weeks before and after
   * @returns {{index: number, monday: string, friday: string, holidays: string[], skipWeek: boolean}[]}
   */
  static plain(todayIso, { before = 4, after = 12 } = {}) {
    const thisMonday = CalendarWeeks.mondayOf(todayIso);
    const weeks = [];
    for (let step = -before; step <= after; step += 1) {
      const monday = CalendarWeeks.addDays(thisMonday, step * 7);
      weeks.push({ index: CalendarWeeks.isoWeek(monday), monday, friday: CalendarWeeks.addDays(monday, 4), holidays: [], skipWeek: false });
    }
    return weeks;
  }
}
