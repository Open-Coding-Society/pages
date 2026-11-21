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
  assert.match(page, /<label for="editAlertDays" class="calendar-event-modal-label">Ticker alert:<\/label>/);
  assert.match(page, /<p id="editAlertDisplay" class="calendar-event-modal-field calendar-event-modal-display"><\/p>/);
  assert.match(page, /<input type="text" id="editAlertDays" inputmode="numeric" class="calendar-event-modal-field issue-form-date-hidden"/);
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
  assert.equal(count(/setAlertFieldEditable\((true|false)\)/g), count(/setDocFieldEditable\((true|false)\)/g));
  assert.match(block(page, /function openAddEventModal\(.*\) \{/), /showAlert\(null\);/);
});

test('saving reads the box and puts the alert line before the doc line', () => {
  const form = block(page, /function readEventForm\(.*\) \{/);
  assert.match(form, /CalendarAlerts\.parse\(document\.getElementById\('editAlertDays'\)\.value\)/);
  assert.match(form, /joinLinkedDoc\(CalendarAlerts\.join\(CalendarSafeHtml\.editorHtml\(document\.getElementById\("editDescription"\)\), alertDays\), docUrl\)/);
});
