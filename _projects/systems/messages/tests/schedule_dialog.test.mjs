// The "Add to calendar" dialog with a stub API: what it starts from, what it sends,
// and what it says when saving works or fails.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { initScheduleDialog } = await import('../js/schedule-dialog.js');

function makeDialog({ addCalendarEvent, ...options }) {
  const make = tag => document.createElement(tag);
  const elements = {
    dialog: make('div'), form: make('form'), title: make('input'), date: make('input'),
    time: make('input'), status: make('p'), save: make('button'),
  };
  elements.dialog.classList.add('hidden');
  elements.dialog.appendChild(elements.form);
  const sent = [];
  const done = [];
  const dialog = initScheduleDialog({
    elements,
    api: { addCalendarEvent: event => { sent.push(event); return addCalendarEvent(event); } },
    chatUrl: () => 'https://x.test/dm?dm=5',
    onScheduled: text => done.push(text),
    now: () => new Date(2026, 10, 18, 15, 0),
    ...options,
  });
  const submit = () => elements.form.dispatchEvent(fakeEvent('submit'));
  return { elements, sent, done, dialog, submit };
}

const message = body => ({ id: 7, key: '7', body });

test('opening starts from what the message says', () => {
  const { elements, dialog } = makeDialog({ addCalendarEvent: async () => ({}) });
  dialog.open(message('<p>Sprint review is on Friday at 3pm. Bring a laptop</p>'));
  assert.equal(elements.dialog.classList.contains('hidden'), false);
  assert.equal(elements.title.value, 'Sprint review is on Friday at 3pm.');
  assert.equal(elements.date.value, '2026-11-20');
  assert.equal(elements.time.value, '15:00');
});

test('a message with no date starts on today and no time', () => {
  const { elements, dialog } = makeDialog({ addCalendarEvent: async () => ({}) });
  dialog.open(message('see you there'));
  assert.equal(elements.date.value, '2026-11-18');
  assert.equal(elements.time.value, '');
});

test('saving sends the event once, closes, and reports where it went', async () => {
  const { elements, sent, done, dialog, submit } = makeDialog({ addCalendarEvent: async () => ({}) });
  dialog.open(message('Sprint review Friday 3pm'));
  elements.title.value = 'Sprint review';
  submit();
  submit(); // a second press while the first is saving
  await settle();

  assert.equal(sent.length, 1);
  assert.equal(sent[0].title, 'Sprint review · 3:00 PM');
  assert.equal(sent[0].date, '2026-11-20');
  assert.equal(Object.hasOwn(sent[0], 'individual'), false);
  assert.equal(elements.dialog.classList.contains('hidden'), true);
  assert.deepEqual(done, ['Added “Sprint review · 3:00 PM” to your calendar for Fri, Nov 20.']);
});

// What the dialog does end to end with a message that tries to put markup in the calendar:
// the title box shows plain text, and the saved description holds no "<". The second body
// is the one that got through when the dialog converted a message and the model did it again.
test('a message that spells out markup is saved as text, not as markup', async () => {
  for (const body of [
    '<p>Lunch Friday? &lt;img src=x onerror=&quot;go()&quot;&gt;</p>',
    '<p>Lunch Friday? &amp;lt;img src=x onerror=&amp;quot;go()&amp;quot;&amp;gt;</p>',
  ]) {
    const { elements, sent, dialog, submit } = makeDialog({ addCalendarEvent: async () => ({}) });
    dialog.open(message(body));
    assert.equal(elements.title.value, 'Lunch Friday?');
    submit();
    await settle();
    assert.equal(sent.length, 1);
    assert.ok(!sent[0].description.includes('<'), `no raw "<" in ${JSON.stringify(sent[0].description)}`);
    assert.ok(!sent[0].title.includes('<'));
  }
});

// A reply is stored as "[[reply:<id>|<sender>|<excerpt>]] <its own html>" (chat-reply.js).
// That is not what the person wrote, so it must not reach the title or the note. The page
// gives the dialog richText.stripChatMarkers; this stand-in does the same for a reply's.
test('a reply is saved without its marker', async () => {
  const stripMarkers = text => text.replace(/\[\[reply:[^\]]*\]\]/g, '').trim();
  const reply = '[[reply:42|Grace%20Hopper|Can%20we%20meet%3F]] <p>Yes, Friday at 3pm works.</p>';

  const { elements, sent, dialog, submit } = makeDialog({ addCalendarEvent: async () => ({}), stripMarkers });
  dialog.open(message(reply));
  assert.equal(elements.title.value, 'Yes, Friday at 3pm works.');
  assert.equal(elements.date.value, '2026-11-20', 'the day is still found in what was said');
  assert.equal(elements.time.value, '15:00');
  submit();
  await settle();
  assert.ok(!/\[\[|\]\]/.test(sent[0].title + sent[0].description), `no marker in ${JSON.stringify(sent[0])}`);

  // Without it (a host whose richText predates replies) the body is used as stored.
  const plain = makeDialog({ addCalendarEvent: async () => ({}) });
  plain.dialog.open(message(reply));
  assert.match(plain.elements.title.value, /^\[\[reply:42/);
});

test('an empty title is refused without asking Spring', async () => {
  const { elements, sent, dialog, submit } = makeDialog({ addCalendarEvent: async () => ({}) });
  dialog.open(message('hello'));
  elements.title.value = '   ';
  submit();
  await settle();
  assert.equal(sent.length, 0);
  assert.match(elements.status.textContent, /title/);
  assert.equal(elements.dialog.classList.contains('hidden'), false);
});

test('a failed save keeps the dialog open, says why and allows another try', async t => {
  t.mock.method(console, 'warn', () => {});
  let calls = 0;
  const { elements, done, dialog, submit } = makeDialog({
    addCalendarEvent: async () => {
      calls += 1;
      if (calls === 1) throw Object.assign(new Error('nope'), { status: 401 });
      return {};
    },
  });
  dialog.open(message('lunch tomorrow'));
  submit();
  await settle();
  assert.match(elements.status.textContent, /signed out/);
  assert.equal(elements.save.disabled, false);
  assert.equal(elements.dialog.classList.contains('hidden'), false);
  assert.deepEqual(done, []);

  submit();
  await settle();
  assert.equal(calls, 2);
  assert.equal(done.length, 1);
});
