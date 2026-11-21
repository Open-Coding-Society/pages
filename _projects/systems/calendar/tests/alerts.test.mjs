// An event's ticker alert (CalendarAlerts.js): how many days before its date the course home's
// ticker starts showing it, kept as a description line the way the linked doc is.
import test from 'node:test';
import assert from 'node:assert/strict';
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
