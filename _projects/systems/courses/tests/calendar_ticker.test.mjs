// The calendar ticker on course homes (js/announcement-calendar/calendar-ticker.js): which
// calendar events it shows, how each one reads and where it links (TickerItems), and the bar it
// fills on the page (CalendarTicker), run on Messages' fake DOM with Spring's answers stubbed.
import assert from 'node:assert/strict';
import test from 'node:test';
import { splitLinkedDoc } from '../../calendar/js/CalendarDocLinks.js';
import { installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { CalendarTicker, TickerItems } from '../js/announcement-calendar/calendar-ticker.js';
import { createLiveCalendarStore } from '../js/announcement-calendar/calendar-data.js';
import { formatShortDate, parseSchoolCalendar } from '../js/announcement-calendar/calendar-model.js';

// Weeks 13-16 of _data/school_calendar.yml, as ocs_calendar_card_data.html writes them. Week 14
// starts on Tuesday (a non-student day), and Thanksgiving break sits between weeks 14 and 15.
const SCHOOL_CALENDAR = {
  schoolYear: '2026-2027',
  weeks: {
    13: { monday: '2026-11-09', friday: '2026-11-13' },
    14: { monday: '2026-11-16', friday: '2026-11-20', holidays: ['Non-Student Day'], holidayAdjustment: 'tuesday' },
    15: { monday: '2026-11-30', friday: '2026-12-04' },
    16: { monday: '2026-12-07', friday: '2026-12-11' },
  },
};
const WEEKS = parseSchoolCalendar(SCHOOL_CALENDAR).weeks;

const ORIGIN = 'https://pages.opencodingsociety.com';
const LINKS = {
  splitLinkedDoc,
  origin: ORIGIN,
  pageUrl: `${ORIGIN}/navigation/courses/csa/`,
  calendarUrl: '/student/calendar',
};
const event = (fields) => ({ id: '1', date: '2026-11-30', title: 'Live Reviews', description: '', priority: 'P2', ...fields });

/* ── Which days ─────────────────────────────────────────────────────────── */

test('the ticker looks five school days ahead, past Thanksgiving break', () => {
  assert.equal(TickerItems.lastDay(WEEKS, '2026-11-20'), '2026-12-04');
});

test('five school days ahead crosses a weekend into the next school week', () => {
  assert.equal(TickerItems.lastDay(WEEKS, '2026-12-01'), '2026-12-08');
});

test('a closed school day does not count as one of the five', () => {
  // Monday 11-16 is the non-student day, so the five are Tue 11-17 to Fri 11-20, then Mon 11-30.
  assert.equal(TickerItems.lastDay(WEEKS, '2026-11-13'), '2026-11-30');
});

test('without school weeks (a site with no school calendar) the ticker looks a week ahead', () => {
  assert.equal(TickerItems.lastDay([], '2026-11-20'), '2026-11-27');
});

/* ── How each one reads ─────────────────────────────────────────────────── */

test('an event today or tomorrow says so; later ones show their short date', () => {
  assert.equal(TickerItems.dayLabel('2026-11-20', '2026-11-20'), 'Today');
  assert.equal(TickerItems.dayLabel('2026-12-01', '2026-11-30'), 'Tomorrow');
  assert.equal(TickerItems.dayLabel('2026-11-30', '2026-11-20'), formatShortDate('2026-11-30'));
});

test('a title saved as HTML shows only its words', () => {
  assert.equal(TickerItems.plainTitle('<span style="color: red">Unit 3 Quiz</span>'), 'Unit 3 Quiz');
  assert.equal(TickerItems.plainTitle('Q&amp;A night'), 'Q&A night');
  assert.equal(TickerItems.plainTitle('Team&#39;s demo &#x2014; room&nbsp;12'), 'Team\'s demo \u2014 room 12');
});

test('tags are taken out before entities are read, so an escaped tag stays as text', () => {
  assert.equal(TickerItems.plainTitle('<p>Use &lt;br&gt; tags</p>'), 'Use <br> tags');
});

test('a typed title that only looks a little like code stays exactly as typed', () => {
  assert.equal(TickerItems.plainTitle('ArrayList<Integer> practice'), 'ArrayList<Integer> practice');
  assert.equal(TickerItems.plainTitle(' Live   Reviews '), 'Live Reviews');
});

/* ── Where each one links ───────────────────────────────────────────────── */

test('an event with a linked doc opens the doc', () => {
  const linked = event({ description: `Read it first\nLinked doc: ${ORIGIN}/csa/frq-practice` });
  assert.equal(TickerItems.linkFor(linked, LINKS), `${ORIGIN}/csa/frq-practice`);
  const webDoc = event({ description: 'Linked doc: https://docs.google.com/document/d/abc' });
  assert.equal(TickerItems.linkFor(webDoc, LINKS), 'https://docs.google.com/document/d/abc');
});

test('an event without a linked doc opens the calendar', () => {
  assert.equal(TickerItems.linkFor(event({ description: 'Bring notes' }), LINKS), '/student/calendar');
});

test('an event posted from this page opens the calendar, not the page you are on', () => {
  const posted = event({ description: `Unit 3\n\nPosted in CSA announcements: ${ORIGIN}/navigation/courses/csa/` });
  assert.equal(TickerItems.linkFor(posted, LINKS), '/student/calendar');
  const withQuery = event({ description: `Linked doc: ${ORIGIN}/navigation/courses/csa/?context=course` });
  assert.equal(TickerItems.linkFor(withQuery, LINKS), '/student/calendar');
});

test('without the Calendar system\'s linked-doc reader every event opens the calendar', () => {
  const linked = event({ description: `Linked doc: ${ORIGIN}/csa/frq-practice` });
  assert.equal(TickerItems.linkFor(linked, { ...LINKS, splitLinkedDoc: null }), '/student/calendar');
});

/* ── The list ───────────────────────────────────────────────────────────── */

test('items come in date order, urgent first within a day', () => {
  const events = [
    event({ id: 'a', date: '2026-12-02', title: 'Office hours', priority: 'P3' }),
    event({ id: 'b', date: '2026-11-30', title: 'Live Reviews', priority: 'P2' }),
    event({ id: 'c', date: '2026-12-02', title: 'Unit 3 Quiz', priority: 'P0' }),
    event({ id: 'd', date: '2026-12-01', title: 'Sprint check-in', priority: 'P1', description: `Linked doc: ${ORIGIN}/csa/sprint-4` }),
  ];
  const wed = formatShortDate('2026-12-02');
  assert.deepEqual(TickerItems.from(events, { ...LINKS, today: '2026-11-30' }), [
    { text: 'Today: Live Reviews', href: '/student/calendar', urgent: false },
    { text: 'Tomorrow: Sprint check-in', href: `${ORIGIN}/csa/sprint-4`, urgent: false },
    { text: `${wed}: Unit 3 Quiz`, href: '/student/calendar', urgent: true },
    { text: `${wed}: Office hours`, href: '/student/calendar', urgent: false },
  ]);
});

/* ── The bar on the page ────────────────────────────────────────────────── */

const SPRING = 'https://spring.test';
const FETCH_OPTIONS = { method: 'GET', credentials: 'include' };
const PAGE = { origin: ORIGIN, href: `${ORIGIN}/navigation/courses/csa/` };

// Spring's rows as /api/calendar/events/range sends them: "[Px]" in the title, the course in period.
const ROWS = [
  { id: 2, date: '2026-12-01', title: '[P1] Sprint check-in', description: `Linked doc: ${ORIGIN}/csa/sprint-4`, type: 'check-in', period: 'CSA', classPeriod: '', break: false },
  { id: 1, date: '2026-11-20', title: '[P2] Live Reviews', description: '', type: 'daily plan', period: 'CSA', classPeriod: '', break: false },
  { id: 3, date: '2026-12-02', title: '[P0] Unit 3 Quiz', description: '', type: 'grade', period: 'CSA', classPeriod: '', break: false },
  { id: 4, date: '2026-12-02', title: '[P2] CSP lab day', description: '', type: 'event', period: 'CSP', classPeriod: '', break: false },
];

// Where each item sits, by its text: its row's top edge, and the width of a list.
const layout = { top: new Map(), listWidth: 0 };
// Every innerHTML write. The fake DOM keeps innerHTML as text without reading it, so this is how
// a test sees whether the ticker ever hands event text to the HTML parser.
const htmlWrites = [];
const observers = [];
class FakeResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.targets = [];
    observers.push(this);
  }

  observe(target) { this.targets.push(target); }

  disconnect() { this.targets = []; }

  resize(width) { this.callback([{ contentRect: { width } }]); }
}

// A fresh page with the include's empty bar (ocs_calendar_ticker.html) and the school weeks
// (ocs_calendar_card_data.html), and Spring answering every request with `answer`.
function setUp({ status = 200, rows = ROWS, answer } = {}) {
  const { document } = installFakeDom();
  const element = (tag, attributes = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    node.append(...children);
    return node;
  };
  const proto = Object.getPrototypeOf(document.createElement('li'));
  Object.defineProperty(proto, 'offsetTop', { configurable: true, get() { return layout.top.get(this.textContent) ?? 0; } });
  proto.getBoundingClientRect = function getBoundingClientRect() {
    const width = this.tagName === 'UL' ? layout.listWidth : 0;
    return { left: 0, top: 0, right: width, bottom: 0, width, height: 0 };
  };
  if (!Object.prototype.hasOwnProperty.call(proto, 'innerHTMLSpy')) {
    const { get, set } = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
    Object.defineProperty(proto, 'innerHTML', { configurable: true, get, set(value) { htmlWrites.push(value); set.call(this, value); } });
    proto.innerHTMLSpy = true;
  }
  htmlWrites.length = 0;
  layout.top = new Map();
  layout.listWidth = 0;
  observers.length = 0;
  globalThis.ResizeObserver = FakeResizeObserver;

  const track = element('div', { class: 'ocs__ticker-track', 'data-hook': 'track' });
  const viewport = element('div', { class: 'ocs__ticker-viewport' }, track);
  const section = element('section', { class: 'ocs__ticker', 'aria-labelledby': 'ocs-calendar-ticker-csa' },
    element('p', { class: 'ocs__ticker-label', id: 'ocs-calendar-ticker-csa' }, 'Coming up'),
    viewport);
  section.style = { setProperty(name, value) { this[name] = value; } };
  const wrapper = element('div', { 'data-ocs-calendar-ticker': '', 'data-course': 'csa', 'data-calendar-url': '/student/calendar', hidden: '' }, section);
  const data = element('script', { id: 'ocsSchoolCalendarData', type: 'application/json' }, JSON.stringify(SCHOOL_CALENDAR));
  document.body.append(wrapper, data);

  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    if (answer) return answer(url);
    return { ok: status < 400, status, text: async () => JSON.stringify(rows) };
  };
  const mount = (options = {}) => CalendarTicker.mountAll(document.body, {
    javaURI: SPRING, fetchOptions: FETCH_OPTIONS, springEnabled: true, splitLinkedDoc, today: '2026-11-20', location: PAGE, ...options,
  });
  return { document, wrapper, section, track, calls, mount };
}

const lists = (track) => track.querySelectorAll('ul');
const links = (list) => list.querySelectorAll('a');

// Every console.warn while `run` runs.
async function warnings(run) {
  const seen = [];
  const original = console.warn;
  console.warn = (...args) => seen.push(args.join(' '));
  try { await run(); } finally { console.warn = original; }
  return seen;
}

test('on a Flask-only site the ticker asks Spring nothing and stays hidden', async () => {
  const { wrapper, calls, mount } = setUp();
  assert.deepEqual(mount({ springEnabled: false }), []);
  await settle();
  assert.equal(calls.length, 0);
  assert.equal(wrapper.hidden, true);
});

test('it asks Spring for this course\'s events from today to the fifth school day', async () => {
  const { calls, mount } = setUp();
  mount();
  await settle();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${SPRING}/api/calendar/events/range?start=2026-11-20&end=2026-12-04`);
  assert.equal(calls[0].init.credentials, 'include');
});

test('it shows this course\'s events as links, with a hidden copy that closes the loop', async () => {
  const { wrapper, track, mount } = setUp();
  mount();
  await settle();
  assert.equal(wrapper.hidden, false);
  const [list, copy] = lists(track);
  assert.deepEqual(links(list).map((link) => [link.textContent, link.getAttribute('href')]), [
    ['Today: Live Reviews', '/student/calendar'],
    [`${formatShortDate('2026-12-01')}: Sprint check-in`, `${ORIGIN}/csa/sprint-4`],
    [`Urgent ${formatShortDate('2026-12-02')}: Unit 3 Quiz`, '/student/calendar'],
  ]);
  assert.equal(list.getAttribute('aria-hidden'), null);
  assert.equal(copy.getAttribute('aria-hidden'), 'true');
  assert.deepEqual(links(copy).map((link) => link.textContent), links(list).map((link) => link.textContent));
  for (const link of links(copy)) assert.equal(link.getAttribute('tabindex'), '-1');
  for (const link of links(list)) assert.equal(link.getAttribute('tabindex'), null);
});

test('an urgent event starts with an Urgent pill', async () => {
  const { track, mount } = setUp();
  mount();
  await settle();
  const quiz = links(lists(track)[0])[2];
  const pill = quiz.querySelector('span');
  assert.equal(pill.className, 'ocs__status-pill ocs__status-pill--bad');
  assert.equal(pill.textContent, 'Urgent');
  assert.equal(quiz.childNodes[0], pill, 'the pill comes first');
});

test('event text is never read as HTML', async () => {
  const attack = '<img src=x onerror=alert(1)>';
  const { track, mount } = setUp({ rows: [{ ...ROWS[1], title: `[P2] ${attack}` }] });
  mount();
  await settle();
  assert.equal(track.querySelectorAll('img').length, 0);
  assert.equal(links(lists(track)[0])[0].textContent, `Today: ${attack}`);
  assert.deepEqual(htmlWrites, [], 'nothing goes through innerHTML');
});

test('a signed-out visitor sees no bar and no warning', async () => {
  for (const status of [401, 403]) {
    const { wrapper, mount } = setUp({ status });
    const seen = await warnings(async () => { mount(); await settle(); });
    assert.equal(wrapper.hidden, true, `HTTP ${status}`);
    assert.deepEqual(seen, [], `HTTP ${status}`);
  }
});

test('when Spring fails, the console says so and there is no bar', async () => {
  const { wrapper, mount } = setUp({ status: 500 });
  const seen = await warnings(async () => { mount(); await settle(); });
  assert.equal(wrapper.hidden, true);
  assert.equal(seen.length, 1);
  assert.match(seen[0], /Calendar ticker/);
});

test('with nothing coming up there is no bar', async () => {
  const { wrapper, mount } = setUp({ rows: [] });
  mount();
  await settle();
  assert.equal(wrapper.hidden, true);
});

test('it moves only when its items don\'t fit on one row, at one speed for any length', async () => {
  const { section, mount } = setUp();
  const [ticker] = mount();
  await settle();
  assert.equal(section.classList.contains('ocs__ticker--moving'), false, 'everything fits: still');

  layout.top.set('Urgent ' + `${formatShortDate('2026-12-02')}: Unit 3 Quiz`, 24);
  layout.listWidth = 1500;
  ticker.fit();
  assert.equal(section.classList.contains('ocs__ticker--moving'), true, 'one item wrapped: moving');
  assert.equal(section.style['--ocs-ticker-duration'], '30s', '1500px at 50px a second');
});

test('a change in the bar\'s width checks again whether it fits', async () => {
  const { section, mount } = setUp();
  mount();
  await settle();
  const [observer] = observers;
  assert.ok(observer.targets.length, 'it watches the viewport');
  layout.top.set('Today: Live Reviews', 24);
  layout.listWidth = 800;
  observer.resize(600);
  assert.equal(section.classList.contains('ocs__ticker--moving'), true);
  layout.top.clear();
  observer.resize(1400);
  assert.equal(section.classList.contains('ocs__ticker--moving'), false);
});

test('coming back to the tab loads the events again', async () => {
  const { document, calls, mount } = setUp();
  mount();
  await settle();
  document.dispatchEvent({ type: 'visibilitychange' });
  await settle();
  assert.equal(calls.length, 2);
});

test('unmount takes back its listeners and empties the bar', async () => {
  const { document, wrapper, section, track, mount } = setUp();
  const [ticker] = mount();
  await settle();
  ticker.unmount();
  assert.equal(document.listenerCount('visibilitychange'), 0);
  assert.equal(observers[0].targets.length, 0);
  assert.equal(track.childNodes.length, 0);
  assert.equal(wrapper.hidden, true);
  assert.equal(section.classList.contains('ocs__ticker--moving'), false);
});

test('an answer that arrives after unmount changes nothing', async () => {
  let reply;
  const { wrapper, mount } = setUp({ answer: () => new Promise((resolve) => { reply = resolve; }) });
  const [ticker] = mount();
  await settle();
  ticker.unmount();
  reply({ ok: true, status: 200, text: async () => JSON.stringify(ROWS) });
  await settle();
  assert.equal(wrapper.hidden, true);
});

test('the calendar store\'s errors carry the HTTP status, so a signed-out answer can be told apart', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 401, text: async () => '' });
  const store = createLiveCalendarStore({ course: 'csa', javaURI: SPRING, fetchOptions: FETCH_OPTIONS });
  await assert.rejects(store.listRange('2026-11-20', '2026-12-04'), (error) => error.status === 401);
});
