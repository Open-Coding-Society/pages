// EventTime reads an event's day and wall-clock times in its time zone and decides which stage
// its pill shows. The site rebuilds only on a push, so the browser moves a published event to
// Active and Completed by the clock: the pill shows the later of the built stage and the clock's.
import assert from 'node:assert/strict';
import test from 'node:test';
import { EventTime } from '../js/event-time.js';
import { needsRuby, orderOf, readRegistry } from './helpers.mjs';

const LA = 'America/Los_Angeles';

test('a clock is a quoted 24-hour "HH:MM", read as minutes after midnight', () => {
  assert.equal(EventTime.minutes('10:00'), 600);
  assert.equal(EventTime.minutes('00:00'), 0);
  assert.equal(EventTime.minutes('23:59'), 1439);
  for (const clock of ['24:00', '9:00', '10:60', '10:00 AM', '', undefined, null, 600]) {
    assert.equal(EventTime.minutes(clock), null, String(clock));
  }
});

test('a wall-clock time in a time zone becomes the right instant, summer or winter', () => {
  // Daylight time began on March 14, 2027 at 2 AM, so March 15 is UTC-7.
  assert.equal(EventTime.instant('2027-03-15', '10:00', LA).toISOString(), '2027-03-15T17:00:00.000Z');
  assert.equal(EventTime.instant('2027-03-14', '10:00', LA).toISOString(), '2027-03-14T17:00:00.000Z', 'the day of the change, after 2 AM');
  // Read as UTC, 3:30 AM falls before the change, so one reading of the offset would be an hour off.
  assert.equal(EventTime.instant('2027-03-14', '03:30', LA).toISOString(), '2027-03-14T10:30:00.000Z', 'the hour after the change');
  assert.equal(EventTime.instant('2027-03-13', '10:00', LA).toISOString(), '2027-03-13T18:00:00.000Z', 'the day before');
  assert.equal(EventTime.instant('2026-12-05', '10:00', LA).toISOString(), '2026-12-05T18:00:00.000Z', 'winter is UTC-8');
  assert.equal(EventTime.instant('2027-03-15', '10:00', 'UTC').toISOString(), '2027-03-15T10:00:00.000Z');
  assert.equal(EventTime.instant('2027-03-15', '', LA).toISOString(), '2027-03-15T07:00:00.000Z', 'no clock means midnight');
});

test('an unknown time zone is a RangeError', () => {
  for (const zone of ['Pacific/Nowhere', 'Pacific', '']) {
    assert.throws(() => EventTime.instant('2027-03-15', '10:00', zone), RangeError, JSON.stringify(zone));
  }
});

test('an event runs from its start to its end; with no start all day, with no end until its day ends', () => {
  const timed = EventTime.window({ day: '2027-03-15', start: '10:00', end: '13:00', zone: LA });
  assert.deepEqual([timed.start.toISOString(), timed.end.toISOString()], ['2027-03-15T17:00:00.000Z', '2027-03-15T20:00:00.000Z']);
  const allDay = EventTime.window({ day: '2027-03-15', zone: LA });
  assert.deepEqual([allDay.start.toISOString(), allDay.end.toISOString()], ['2027-03-15T07:00:00.000Z', '2027-03-16T07:00:00.000Z']);
  const openEnded = EventTime.window({ day: '2027-03-15', start: '18:00', end: '', zone: LA });
  assert.deepEqual([openEnded.start.toISOString(), openEnded.end.toISOString()], ['2027-03-16T01:00:00.000Z', '2027-03-16T07:00:00.000Z']);
  // The end of a day rolls over months and years.
  assert.equal(EventTime.window({ day: '2027-02-28', zone: 'UTC' }).end.toISOString(), '2027-03-01T00:00:00.000Z');
  assert.equal(EventTime.window({ day: '2028-02-28', zone: 'UTC' }).end.toISOString(), '2028-02-29T00:00:00.000Z');
  assert.equal(EventTime.window({ day: '2027-12-31', zone: 'UTC' }).end.toISOString(), '2028-01-01T00:00:00.000Z');
});

test('the pill shows the later of the built stage and the clock, in Mort\'s order', needsRuby, () => {
  const order = orderOf(readRegistry());
  const window = EventTime.window({ day: '2027-03-15', start: '10:00', end: '13:00', zone: LA });
  const before = new Date('2027-03-15T16:59:00Z');
  const during = new Date('2027-03-15T17:00:00Z');
  const after = new Date('2027-03-15T20:00:00Z');
  const table = [
    // built          before          during          after
    ['published',    'published',    'active',       'completed'],
    ['registration', 'registration', 'active',       'completed'],
    ['active',       'active',       'active',       'completed'],
    ['completed',    'completed',    'completed',    'completed'],
    ['archived',     'archived',     'archived',     'archived'],
    ['draft',        'draft',        'draft',        'draft'],
  ];
  for (const [built, ...expected] of table) {
    assert.deepEqual([before, during, after].map((now) => EventTime.stage(built, now, window, order)), expected, built);
  }
});
