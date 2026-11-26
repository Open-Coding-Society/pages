// Moderation rules, records export and the plain calendar weeks.
// Run: node --test _projects/systems/community/tests/moderation_records.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ModerationRules } from '../js/moderation.js';
import { Records } from '../js/records.js';
import { CalendarWeeks } from '../js/calendar-weeks.js';
import { NOW } from './fixtures.mjs';

test('checkReport keeps a known reason and a trimmed note', () => {
  assert.deepEqual(ModerationRules.checkReport({ reason: 'selling', note: '  side deal  ' }), { reason: 'selling', note: 'side deal' });
  assert.deepEqual(ModerationRules.checkReport({ reason: 'spam' }), { reason: 'spam', note: '' });
});

test('checkReport refuses an unknown reason or a note that is too long', () => {
  assert.throws(() => ModerationRules.checkReport({ reason: 'rude' }), TypeError);
  assert.throws(() => ModerationRules.checkReport({ reason: 'other', note: 'x'.repeat(501) }), TypeError);
});

test('checkAction needs a known action, and a mute needs one of the mute lengths', () => {
  assert.deepEqual(ModerationRules.checkAction({ action: 'mute', hours: 24 }), { action: 'mute', hours: 24, note: '' });
  assert.deepEqual(ModerationRules.checkAction({ action: 'hide', note: ' spam ' }), { action: 'hide', hours: 0, note: 'spam' });
  assert.throws(() => ModerationRules.checkAction({ action: 'ban' }), TypeError);
  assert.throws(() => ModerationRules.checkAction({ action: 'mute', hours: 3 }), TypeError);
});

test('a mute ends on its own', () => {
  const until = ModerationRules.muteUntil(NOW, 24);
  assert.equal(new Date(until).getTime() - NOW.getTime(), 24 * 3600 * 1000);
  assert.equal(ModerationRules.isMuted({ until }, NOW), true);
  assert.equal(ModerationRules.isMuted({ until }, new Date(new Date(until).getTime() + 1)), false);
  assert.equal(ModerationRules.isMuted(null, NOW), false);
  assert.throws(() => ModerationRules.muteUntil(NOW, 2), TypeError);
});

const entries = [
  { at: '2026-11-17T09:00:00', personId: 12, kind: 'message', text: 'hello' },
  { at: '2026-11-18T23:59:00', personId: 19, kind: 'message', text: 'side deal' },
  { at: '2026-11-19T08:00:00', personId: 19, kind: 'edit', text: 'side deal!' },
  { at: '2026-11-19T09:00:00', personId: 3, kind: 'action', text: 'Hid a message' },
];

test('filter by person and by date, both ends included', () => {
  assert.deepEqual(Records.filter(entries, { personId: 19 }).map(entry => entry.text), ['side deal', 'side deal!']);
  assert.deepEqual(Records.filter(entries, { from: '2026-11-18', to: '2026-11-18' }).map(entry => entry.text), ['side deal']);
  assert.equal(Records.filter(entries, {}).length, 4);
  assert.equal(Records.filter(entries, { from: '2026-11-19' }).length, 2);
});

test('toCsv guards formulas and quotes', () => {
  const csv = Records.toCsv([
    { at: '2026-11-19T09:00:00', channel: 'Demo Series 1', person: 'Demo LP 9', kind: 'message', text: '=SUM(A1)', note: '' },
    { at: '2026-11-19T09:01:00', channel: 'Demo Series 1', person: 'Demo LP 2', kind: 'message', text: 'a,"b"\nnext line', note: '@me' },
  ]);
  const lines = csv.split('\r\n');
  assert.equal(lines[0], 'at,channel,person,kind,text,note');
  assert.equal(lines[1], "2026-11-19T09:00:00,Demo Series 1,Demo LP 9,message,'=SUM(A1),");
  assert.equal(lines[2], '2026-11-19T09:01:00,Demo Series 1,Demo LP 2,message,"a,""b""\nnext line",\'@me');
  assert.equal(csv.endsWith('\r\n'), true);
});

test('safeCell also writes a cell that starts with a line break as text', () => {
  assert.equal(Records.safeCell('\n=1+1'), "'\n=1+1");
  assert.equal(Records.safeCell('\r\n@SUM(A1)'), "'\r\n@SUM(A1)");
});

test('safeCell leaves ordinary text alone', () => {
  assert.equal(Records.safeCell('Demo LP call'), 'Demo LP call');
  assert.equal(Records.safeCell(null), '');
  assert.equal(Records.safeCell('+1 more'), "'+1 more");
  assert.equal(Records.safeCell('-5'), "'-5");
});

test('the export file is named after the organization, in plain lowercase', () => {
  assert.equal(Records.fileName('Demo Org'), 'demo-org-records.csv');
  assert.equal(Records.fileName('  A & B / C  '), 'a-b-c-records.csv');
  assert.equal(Records.fileName(''), 'community-records.csv');
  assert.equal(Records.fileName(undefined), 'community-records.csv');
});

test('plain weeks start on Mondays and number like ISO weeks', () => {
  const weeks = CalendarWeeks.plain('2026-11-19', { before: 1, after: 1 });
  assert.deepEqual(weeks.map(week => week.monday), ['2026-11-09', '2026-11-16', '2026-11-23']);
  assert.deepEqual(weeks[1], { index: 47, monday: '2026-11-16', friday: '2026-11-20', holidays: [], skipWeek: false });
  assert.equal(CalendarWeeks.isoWeek('2027-01-01'), 53, 'a Friday that belongs to the last week of 2026');
  assert.equal(CalendarWeeks.isoWeek('2026-01-01'), 1);
  assert.equal(CalendarWeeks.mondayOf('2026-11-22'), '2026-11-16', 'a Sunday belongs to the week before');
  assert.deepEqual(['2026-11-20', '2026-11-21', '2026-11-22'].map(CalendarWeeks.weekdayOnOrAfter), ['2026-11-20', '2026-11-23', '2026-11-23']);
});
