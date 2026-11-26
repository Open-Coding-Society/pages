// Calendar: Courses' week view (calendar-feed.js mountWeekView), the one on class pages, given
// plain Monday-to-Friday weeks (calendar-weeks.js) instead of the school year's. Its events
// are the [[event:...]] markers on the updates a member can read, plus what they put on their
// own calendar with Add to calendar. Below the week, the next few events in a list.
import { CalendarWeeks } from './calendar-weeks.js';
import { Dom } from './dom.js';

const UPCOMING = 6;
const AHEAD_DAYS = 90;

/**
 * The Calendar tab.
 */
export class CalendarView {
  /**
   * @param {{root: HTMLElement, app: CommunityApp}} options
   */
  constructor({ root, app }) {
    this.root = root;
    this.app = app;
    this.backend = app.backend;
    this.kit = app.kit;
    this.stops = [];
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  mount() {
    this.today = CalendarWeeks.today();
    this.store = this.backend.calendarStore();
    const week = Dom.el('div', 'ocs__card');
    this.detail = Dom.el('div');
    this.upcoming = Dom.el('div', 'ocs__stack');
    this.root.replaceChildren(Dom.el('div', 'ocs__stack',
      Dom.el('small', '', this.say('calendar.hint')),
      week,
      this.detail,
      Dom.el('div', 'ocs__card ocs__stack', Dom.el('strong', '', this.say('calendar.coming_up')), this.upcoming)));
    this.weekHost = week;
    this.mountWeek();
    this.stops.push(this.store.subscribe(() => this.renderUpcoming()));
    this.renderUpcoming();
  }

  // Courses' week view watches its own width and redraws inside that watcher. A hidden tab's
  // width drops to 0 and comes back when it shows, and WebKit reports that redraw as a
  // "ResizeObserver loop" error, so the week view lives only while the tab shows.
  mountWeek() {
    this.week = this.kit.mountWeekView({
      host: this.weekHost,
      weeks: CalendarWeeks.plain(this.today),
      getStore: () => this.store,
      showEmpty: true,
      onSelectEvent: event => this.showEvent(event),
    });
  }

  /** The tab shows again: the week view comes back, on this week, and a new day starts from it. */
  shown() {
    const today = CalendarWeeks.today();
    if (today !== this.today) {
      this.today = today;
      this.renderUpcoming();
    }
    if (!this.week) this.mountWeek();
  }

  /** The tab is hidden: the week view goes until the tab shows again. */
  hidden() {
    this.week?.unmount();
    this.week = null;
  }

  /** Where an event came from: an updates channel, or the member's own calendar. */
  source(event) {
    if (event.source === 'personal') return this.say('calendar.yours');
    const channel = this.backend.channels().find(entry => entry.id === event.channelId);
    return this.say('calendar.from', { channel: channel?.title || '' });
  }

  eventLine(event) {
    return Dom.el('div', 'ocs__keypoint', Dom.pill(this.kit.formatShortDate(event.date), 'good'), Dom.el('strong', '', event.title));
  }

  showEvent(event) {
    this.detail.replaceChildren(Dom.el('div', 'ocs__callout ocs__stack',
      this.eventLine(event),
      Dom.el('small', '', this.source(event)),
      event.description ? Dom.el('div', '', event.description) : null));
  }

  async renderUpcoming() {
    const events = await this.store.listRange(this.today, CalendarWeeks.addDays(this.today, AHEAD_DAYS));
    this.upcoming.replaceChildren(...(events.length
      ? [Dom.el('ul', 'ocs__entity-list', ...events.slice(0, UPCOMING).map(event => Dom.el('li', 'ocs__stack', this.eventLine(event), Dom.el('small', '', this.source(event)))))]
      : [Dom.el('small', '', this.say('calendar.nothing'))]));
  }

  destroy() {
    this.hidden();
    this.stops.forEach(stop => stop());
    this.stops = [];
  }
}
