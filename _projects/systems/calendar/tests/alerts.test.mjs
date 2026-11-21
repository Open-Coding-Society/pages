// An event's ticker alert (CalendarAlerts.js): how many days before its date the course home's
// ticker starts showing it, kept as a description line the way the linked doc is.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CalendarAlerts } from '../js/CalendarAlerts.js';
import { joinLinkedDoc, splitLinkedDoc } from '../js/CalendarDocLinks.js';

const origin = 'https://pages.opencodingsociety.com';
const doc = `${origin}/csa/frq-practice`;

test('an alert is written as its own line', () => {
  assert.equal(CalendarAlerts.format(14), 'Alert: 14 days before');
  assert.equal(CalendarAlerts.format(1), 'Alert: 1 day before');
  assert.equal(CalendarAlerts.format(0), 'Alert: 0 days before');
});

test('an alert is a whole number of days from 0 to 365', () => {
  for (const days of [-1, 1.5, 366, Number.NaN, '3', null]) {
    assert.throws(() => CalendarAlerts.format(days), RangeError, `format(${days})`);
  }
});

test('the alert line is read from the end of the description and taken out of it', () => {
  assert.deepEqual(CalendarAlerts.split('Bring notes\nAlert: 14 days before'), { body: 'Bring notes', days: 14 });
  assert.deepEqual(CalendarAlerts.split('Bring notes\nAlert: 1 day before\n'), { body: 'Bring notes', days: 1 });
  assert.deepEqual(CalendarAlerts.split('Alert: 0 days before'), { body: '', days: 0 });
});

test('the alert line is found after an HTML line break from the editor', () => {
  assert.deepEqual(CalendarAlerts.split('<p>Bring notes</p><br>Alert: 3 days before'), { body: '<p>Bring notes</p>', days: 3 });
});

test('the alert line is found just before the linked doc line, which stays', () => {
  assert.deepEqual(
    CalendarAlerts.split(`Bring notes\nAlert: 14 days before\nLinked doc: ${doc}`),
    { body: `Bring notes\nLinked doc: ${doc}`, days: 14 },
  );
});

test('a description without an alert is left as it is', () => {
  assert.deepEqual(CalendarAlerts.split('Bring notes'), { body: 'Bring notes', days: null });
  assert.deepEqual(CalendarAlerts.split(''), { body: '', days: null });
  assert.deepEqual(CalendarAlerts.split(undefined), { body: '', days: null });
});

test('alert words anywhere else are the description\'s own text', () => {
  for (const text of [
    'Alert: 3 days before\nBring notes', // not the last line
    'Bring notes Alert: 3 days before', // not on a line of its own
    'Bring notes\nAlert: soon', // no number of days
    'Bring notes\nAlert: 2 weeks before', // not in days
    'Bring notes\nAlert: 400 days before', // more than a year
  ]) {
    assert.deepEqual(CalendarAlerts.split(text), { body: text, days: null }, text);
  }
});

test('reading the alert line stays fast on a very long description', () => {
  // Any signed-in account can write a description, and every visitor's ticker reads each event's.
  // A pattern that slows down on long runs of blank lines or <br> tags takes over a second at this
  // size (the doc-link reader's leading run: 30k blank lines, about 1.2 s); this one takes about 1 ms.
  const n = 30000;
  const slowForBacktracking = [
    '\n'.repeat(n) + 'x',
    '<br>'.repeat(n / 4) + 'x',
    ' \n'.repeat(n / 2) + 'x',
    'Alert: 1 day before' + '\n'.repeat(n) + 'x',
    'Alert: 1 day before' + '<br>'.repeat(n / 4) + 'x',
  ];
  const started = performance.now();
  for (const text of slowForBacktracking) assert.equal(CalendarAlerts.split(text).days, null);
  assert.ok(performance.now() - started < 500, `took ${Math.round(performance.now() - started)} ms`);
});

test('joining puts the alert line after the text, or leaves the text alone without one', () => {
  assert.equal(CalendarAlerts.join('Bring notes', 14), 'Bring notes\nAlert: 14 days before');
  assert.equal(CalendarAlerts.join('', 3), 'Alert: 3 days before');
  assert.equal(CalendarAlerts.join('Bring notes<br>', null), 'Bring notes<br>');
});

test('joining replaces an alert line the text already ends with', () => {
  assert.equal(CalendarAlerts.join('Bring notes\nAlert: 3 days before', 7), 'Bring notes\nAlert: 7 days before');
  assert.equal(CalendarAlerts.join('Bring notes\nAlert: 3 days before', null), 'Bring notes');
});

test('an alert and a linked doc round-trip through the description, doc line last', () => {
  const description = joinLinkedDoc(CalendarAlerts.join('Bring notes', 14), doc);
  assert.equal(description, `Bring notes\nAlert: 14 days before\nLinked doc: ${doc}`);
  const { body, docUrl } = splitLinkedDoc(description, origin);
  assert.equal(docUrl, doc);
  assert.deepEqual(CalendarAlerts.split(body), { body: 'Bring notes', days: 14 });
});

test('the event window\'s box can be held to a site\'s own limit', () => {
  assert.equal(CalendarAlerts.parse('30', 30), 30);
  assert.throws(() => CalendarAlerts.parse('31', 30), /whole number of days from 0 to 30/);
  assert.throws(() => CalendarAlerts.parse('400', 500), /from 0 to 365/, 'never past what the line can hold');
  // A broken alert_limit_days in a site's config must not stop events from saving.
  assert.equal(CalendarAlerts.parse('45', Number.NaN), 45);
  assert.throws(() => CalendarAlerts.parse('400', Number.NaN), /from 0 to 365/);
});

test('the event window\'s box reads blank as the default and rejects anything but whole days', () => {
  assert.equal(CalendarAlerts.parse(''), null);
  assert.equal(CalendarAlerts.parse('  '), null);
  assert.equal(CalendarAlerts.parse('14'), 14);
  assert.equal(CalendarAlerts.parse(' 0 '), 0);
  for (const value of ['-1', '2.5', '366', 'soon']) {
    assert.throws(() => CalendarAlerts.parse(value), /whole number of days from 0 to 365/, value);
  }
});

test('the event window shows the alert in words', () => {
  assert.equal(CalendarAlerts.describe(null), 'Default');
  assert.equal(CalendarAlerts.describe(0), 'On the day only');
  assert.equal(CalendarAlerts.describe(1), '1 day before');
  assert.equal(CalendarAlerts.describe(14), '14 days before');
});

/* ── The calendar page's Ticker alert field ──────────────────────────────── */

// The page's script is inline in index.md, so Node can't run it. These checks read it as text;
// the browser check in the PR opens, edits and saves an event on the real page.
const page = await readFile(new URL('../index.md', import.meta.url), 'utf8');

// The source of a function: `opening` matches its first line up to the body's `{`, so a
// destructured parameter's braces aren't taken for the body.
function block(source, opening) {
  const match = source.match(opening);
  assert.ok(match, `index.md has no ${opening}`);
  const start = match.index;
  let depth = 0;
  for (let i = start + match[0].length - 1; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`index.md: ${opening} never closes`);
}
const count = (pattern) => (page.match(pattern) || []).length;

test('the page imports CalendarAlerts', () => {
  assert.match(page, /import \{ CalendarAlerts \} from '\{\{site\.baseurl\}\}\/assets\/js\/projects\/calendar\/CalendarAlerts\.js';/);
});

test('the event window has a Ticker alert field: the alert in words, and a box while editing', () => {
  assert.match(page, /<label for="editAlertDays" id="editAlertLabel" class="calendar-event-modal-label">Ticker alert:<\/label>/);
  assert.match(page, /<p id="editAlertDisplay" class="calendar-event-modal-field calendar-event-modal-display"><\/p>/);
  assert.match(page, /<input type="text" id="editAlertDays" inputmode="numeric" class="calendar-event-modal-field issue-form-date-hidden"/);
  // The ticker can't see an alert past calendar_ticker's alert_limit_days, so the box stops there.
  assert.match(page, /id="editAlertDays"[^>]*data-max-days="\{\{ site\.calendar_ticker\.alert_limit_days \| default: 30 \}\}"/);
  assert.match(block(page, /function showAlert\(days\) \{/), /textContent = CalendarAlerts\.describe\(days\)/);
});

test('every description shown in the window has its alert line taken out, like its doc line', () => {
  const parts = block(page, /function descriptionParts\(description\) \{/);
  assert.match(parts, /splitLinkedDoc\(description, window\.location\.origin\)/);
  assert.match(parts, /CalendarAlerts\.split\(/);
  assert.equal(count(/splitLinkedDoc\(/g), 1, 'opening an event and Edit read the description through descriptionParts');
  assert.equal(count(/descriptionParts\(currentEvent\.extendedProps\.description\)/g), 2);
});

test('the alert box is editable exactly when the doc box is', () => {
  // Wherever the doc box changes mode, the alert box changes to the same mode right after.
  const calls = [...page.matchAll(/setDocFieldEditable\((true|false)\);/g)];
  assert.equal(calls.length, 3, 'leaving edit mode, adding an event and Edit');
  for (const call of calls) {
    const next = page.slice(call.index, call.index + 200);
    assert.match(next, new RegExp(`setAlertFieldEditable\\(${call[1]}\\);`), next);
  }
  assert.match(block(page, /function openAddEventModal\(.*\) \{/), /showAlert\(null\);\s*setAlertFieldShown\(true\);/);
});

test('a break\'s window leaves the alert field out, since breaks never show on the ticker', () => {
  assert.equal(count(/setAlertFieldShown\(!isBreak\);/g), 1, 'opening an event or break sets it');
  const shown = block(page, /function setAlertFieldShown\(shown\) \{/);
  assert.match(shown, /editAlertLabel/);
  const editable = block(page, /function setAlertFieldEditable\(editable\) \{/);
  assert.match(editable, /alertFieldShown && !editable/);
  assert.match(editable, /alertFieldShown && editable/);
});

test('saving reads the box and puts the alert line before the doc line', () => {
  const form = block(page, /function readEventForm\(.*\) \{/);
  // A break's field is hidden, so its stored line is kept as it is, never checked against the limit.
  assert.match(form, /CalendarAlerts\.parse\(alertBox\.value, alertFieldShown \? Number\(alertBox\.dataset\.maxDays\) : CalendarAlerts\.MAX_DAYS\)/);
  assert.match(form, /joinLinkedDoc\(CalendarAlerts\.join\(CalendarSafeHtml\.editorHtml\(document\.getElementById\("editDescription"\)\), alertDays\), docUrl\)/);
});
