// An event's day and times are wall-clock values in its time zone, as its front matter writes
// them ("2027-03-15", "10:00", "America/Los_Angeles"). The site rebuilds only on a push, so the
// browser works out which stage an event's pill shows from the visitor's clock.

/** Times of an event page, read in its time zone. */
export class EventTime {
  /**
   * Minutes after midnight of a 24-hour "HH:MM" clock.
   * @param {string} clock - like "10:00"
   * @returns {number|null} 600 for "10:00"; null when it isn't a 24-hour "HH:MM"
   */
  static minutes(clock) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(typeof clock === 'string' ? clock : '');
    return match ? Number(match[1]) * 60 + Number(match[2]) : null;
  }

  /**
   * How many minutes timeZone's clocks are ahead of UTC at an instant (negative west of Greenwich).
   * @param {string} timeZone - an IANA name like America/Los_Angeles, or UTC
   * @param {Date} instant
   * @returns {number}
   * @throws {RangeError} for a time zone the browser doesn't know
   */
  static offsetMinutes(timeZone, instant) {
    if (!timeZone) throw new RangeError('An event needs a time zone');
    const parts = {};
    const format = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    for (const { type, value } of format.formatToParts(instant)) parts[type] = Number(value);
    const wallClock = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return Math.round((wallClock - Math.floor(instant.getTime() / 1000) * 1000) / 60000);
  }

  /**
   * The instant a wall-clock day and time happen in a time zone. A time that happens twice (when
   * the clocks go back) is the first one; a time the clocks skip (when they go forward) moves
   * forward by the gap, so 2:30 on a 2:00-to-3:00 night is 3:30.
   * @param {string} day - "YYYY-MM-DD"
   * @param {string} [clock] - "HH:MM"; midnight when empty
   * @param {string} timeZone - an IANA name like America/Los_Angeles, or UTC
   * @returns {Date}
   * @throws {RangeError} for a time zone the browser doesn't know
   */
  static instant(day, clock, timeZone) {
    const [year, month, date] = day.split('-').map(Number);
    const minutes = EventTime.minutes(clock) ?? 0;
    const asUtc = Date.UTC(year, month - 1, date, Math.floor(minutes / 60), minutes % 60);
    // Read the zone's offset twice: around a daylight-saving change, the offset at the wall-clock
    // time read as UTC can differ from the offset at the real instant.
    const first = asUtc - EventTime.offsetMinutes(timeZone, new Date(asUtc)) * 60000;
    const second = asUtc - EventTime.offsetMinutes(timeZone, new Date(first)) * 60000;
    // When the zone's clock doesn't read the asked time at the second reading, that time was
    // skipped; of the two readings (one with each side's offset), the later one is the shift forward.
    const wallClock = second + EventTime.offsetMinutes(timeZone, new Date(second)) * 60000;
    return new Date(wallClock === asUtc ? second : Math.max(first, second));
  }

  /**
   * The day after a "YYYY-MM-DD" day.
   * @param {string} day
   * @returns {string}
   */
  static nextDay(day) {
    const [year, month, date] = day.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, date + 1)).toISOString().slice(0, 10);
  }

  /**
   * When an event starts and ends. With no start it lasts all day; with no end it lasts until the
   * end of its day.
   * @param {{day: string, start?: string, end?: string, zone: string}} event
   * @returns {{start: Date, end: Date}}
   * @throws {RangeError} for a time zone the browser doesn't know
   */
  static window({ day, start, end, zone }) {
    return {
      start: EventTime.instant(day, start || '', zone),
      end: EventTime.minutes(end) === null ? EventTime.instant(EventTime.nextDay(day), '', zone) : EventTime.instant(day, end, zone),
    };
  }

  /**
   * The stage an event's pill shows: the later, in Mort's order, of the stage it was built with
   * and the clock's (Published before the start, Active during the event, Completed after it).
   * Draft and Archived, the first and last stages, are set by hand and never follow the clock.
   * @param {string} built - the stage the page was built with
   * @param {Date} now
   * @param {{start: Date, end: Date}} window - from EventTime.window
   * @param {string[]} order - the lifecycle keys in Mort's order, from the registry
   * @returns {string}
   */
  static stage(built, now, window, order) {
    if (!order.includes(built) || built === order[0] || built === order[order.length - 1]) return built;
    let clock = 'completed';
    if (now < window.start) clock = 'published';
    else if (now < window.end) clock = 'active';
    return order.indexOf(clock) > order.indexOf(built) ? clock : built;
  }
}
