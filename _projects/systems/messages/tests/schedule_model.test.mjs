// What a message becomes as a calendar event: the date and time found in its text, the
// title suggested, and the request sent to Spring.
import assert from 'node:assert/strict';
import test from 'node:test';

const {
  MAX_TITLE_LENGTH, buildCalendarEvent, clockLabel, dateKey, dateLabel, guessEventDate, guessEventTime, plainText, suggestTitle,
} = await import('../js/schedule-model.js');

const wednesday = new Date(2026, 10, 18, 15, 0); // Wed Nov 18 2026

test('plainText drops markup, decodes entities and keeps line breaks', () => {
  assert.equal(plainText('<p>Fish &amp; chips</p><p>at <strong>noon</strong></p>'), 'Fish & chips\nat noon');
  assert.equal(plainText('a<br>b'), 'a\nb');
  assert.equal(plainText(null), '');
});

test('guessEventDate reads written dates', () => {
  assert.equal(guessEventDate('due 2026-12-01', wednesday), '2026-12-01');
  assert.equal(guessEventDate('lunch 11/20', wednesday), '2026-11-20');
  assert.equal(guessEventDate('due Nov 20th', wednesday), '2026-11-20');
  assert.equal(guessEventDate('dec 3, 2027', wednesday), '2027-12-03');
  assert.equal(guessEventDate('on 3/4/27', wednesday), '2027-03-04');
});

test('a day without a year that has passed means next year; an impossible day is ignored', () => {
  assert.equal(guessEventDate('on Nov 1', wednesday), '2027-11-01');
  assert.equal(guessEventDate('Feb 30', wednesday), null);
  assert.equal(guessEventDate('13/45', wednesday), null);
});

test('guessEventDate reads today, tomorrow and weekdays from the given clock', () => {
  assert.equal(guessEventDate('today', wednesday), '2026-11-18');
  assert.equal(guessEventDate('see you tomorrow', wednesday), '2026-11-19');
  assert.equal(guessEventDate('friday at 3', wednesday), '2026-11-20');
  assert.equal(guessEventDate('wednesday', wednesday), '2026-11-25', 'the same weekday means next week, not today');
  assert.equal(guessEventDate('next monday', wednesday), '2026-11-30');
  assert.equal(guessEventDate('nothing here', wednesday), null);
});

test('a date is named by the local calendar, not UTC', () => {
  assert.equal(dateKey(new Date(2026, 0, 1, 23, 30)), '2026-01-01');
});

test('guessEventTime reads am/pm, 24-hour and noon', () => {
  assert.equal(guessEventTime('at 3pm'), '15:00');
  assert.equal(guessEventTime('9:30 am'), '09:30');
  assert.equal(guessEventTime('12am'), '00:00');
  assert.equal(guessEventTime('12 pm'), '12:00');
  assert.equal(guessEventTime('meet 15:45'), '15:45');
  assert.equal(guessEventTime('at noon'), '12:00');
  assert.equal(guessEventTime('see you friday'), null);
});

test('clockLabel and dateLabel word a time and a day', () => {
  assert.equal(clockLabel('15:30'), '3:30 PM');
  assert.equal(clockLabel('00:05'), '12:05 AM');
  assert.equal(clockLabel(''), '');
  assert.equal(dateLabel('2026-11-20'), 'Fri, Nov 20');
  assert.equal(dateLabel('nope'), '');
});

test('suggestTitle takes the first sentence, or the start of a long message', () => {
  assert.equal(suggestTitle('<p>The Sprint review is on Friday. Bring your laptop</p>'), 'The Sprint review is on Friday.');
  assert.equal(suggestTitle('quick sync'), 'quick sync');
  assert.equal(suggestTitle(''), '');
  const long = suggestTitle('word '.repeat(60), 40);
  assert.ok(long.length <= 40 && long.endsWith('…'));
});

test('buildCalendarEvent makes the request Spring takes, and never names an individual', () => {
  const event = buildCalendarEvent({
    title: ' Sprint   review ', date: '2026-11-20', time: '15:00', text: '<p>Review on Friday</p>', chatUrl: 'https://x.test/dm?dm=5',
  });
  assert.equal(event.title, 'Sprint review · 3:00 PM');
  assert.equal(event.date, '2026-11-20');
  assert.equal(event.type, 'event');
  assert.equal(event.description, 'Time: 3:00 PM\n\nReview on Friday\n\nFrom a chat: https://x.test/dm?dm=5');
  assert.equal(Object.hasOwn(event, 'individual'), false, 'a blank individual would show a private message to everyone');
});

test('without a time the title and note carry none', () => {
  const event = buildCalendarEvent({ title: 'Lunch', date: '2026-11-20', text: 'lunch' });
  assert.equal(event.title, 'Lunch');
  assert.equal(event.description, 'lunch');
});

test('title and description stay inside the 255 characters Spring stores', () => {
  const event = buildCalendarEvent({
    title: 'x'.repeat(400), date: '2026-11-20', time: '09:00', text: 'y'.repeat(900), chatUrl: `https://x.test/${'z'.repeat(40)}`,
  });
  assert.ok(event.title.length <= 255);
  assert.ok(event.description.length <= 255);
  assert.ok(event.description.endsWith(`https://x.test/${'z'.repeat(40)}`), 'the link back is kept, the note is what is cut');
  assert.ok(MAX_TITLE_LENGTH <= 255);
});

// The calendar page shows a description as HTML. A "<" is the only thing that starts a tag,
// so none may reach it, however many times the message was escaped.
test('a description never holds a "<", whether the message typed one or only looked like one', () => {
  const stored = [
    '<p>Lunch Friday? &lt;img src=x onerror=&quot;go()&quot;&gt;</p>', // typed <img ...>
    '<p>Lunch Friday? &amp;lt;img src=x onerror=&amp;quot;go()&amp;quot;&amp;gt;</p>', // typed &lt;img ...&gt;
    '<p>1 < 2 and 3 <b>bold</b></p>',
  ];
  for (const body of stored) {
    const { description } = buildCalendarEvent({ title: 'Lunch', date: '2026-11-20', text: body, chatUrl: 'https://x.test/dm?dm=5' });
    assert.ok(!description.includes('<'), `no raw "<" from ${body}\n  got ${JSON.stringify(description)}`);
  }
  // The words are all still there: a "<" is only written another way.
  const typed = buildCalendarEvent({ title: 'x', date: '2026-11-20', text: '<p>a &lt; b</p>' });
  assert.equal(typed.description, 'a &lt; b');
});

test('a message is turned into text once: what it escaped is not unescaped a second time', () => {
  // Typed as the characters &lt;b&gt; and stored with the & escaped. Once gives back what was typed.
  const event = buildCalendarEvent({ title: 'x', date: '2026-11-20', text: '<p>&amp;lt;b&amp;gt;</p>' });
  assert.equal(event.description, '&lt;b&gt;');
  assert.equal(suggestTitle('<p>&amp;lt;b&amp;gt; is a tag</p>'), '&lt;b&gt; is a tag');
});

test('a note full of "<" still fits the 255 characters Spring stores', () => {
  const event = buildCalendarEvent({
    title: 'x', date: '2026-11-20', time: '09:00', text: '&lt;'.repeat(300), chatUrl: `https://x.test/${'z'.repeat(40)}`,
  });
  assert.ok(event.description.length <= 255, `${event.description.length} characters`);
  assert.ok(!event.description.includes('<'));
  assert.ok(event.description.endsWith(`https://x.test/${'z'.repeat(40)}`));
});

test('an event needs a title and a real day', () => {
  assert.throws(() => buildCalendarEvent({ title: '  ', date: '2026-11-20' }), /title/);
  assert.throws(() => buildCalendarEvent({ title: 'a', date: '2026-02-30' }), /date/);
  assert.throws(() => buildCalendarEvent({ title: 'a', date: '' }), /date/);
});
