// The calendar ticker on course homes (js/announcement-calendar/calendar-ticker.js): which
// calendar events it shows, how each one reads and where it links (TickerItems).
import assert from 'node:assert/strict';
import test from 'node:test';
import { splitLinkedDoc } from '../../calendar/js/CalendarDocLinks.js';
import { TickerItems } from '../js/announcement-calendar/calendar-ticker.js';
import { formatShortDate, parseSchoolCalendar } from '../js/announcement-calendar/calendar-model.js';

// Weeks 13-16 of _data/school_calendar.yml, as ocs_calendar_card_data.html writes them. Week 14
// starts on Tuesday (a non-student day), and Thanksgiving break sits between weeks 14 and 15.
const WEEKS = parseSchoolCalendar({
  schoolYear: '2026-2027',
  weeks: {
    13: { monday: '2026-11-09', friday: '2026-11-13' },
    14: { monday: '2026-11-16', friday: '2026-11-20', holidays: ['Non-Student Day'], holidayAdjustment: 'tuesday' },
    15: { monday: '2026-11-30', friday: '2026-12-04' },
    16: { monday: '2026-12-07', friday: '2026-12-11' },
  },
}).weeks;

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
