import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDocUrl,
  splitLinkedDoc,
  joinLinkedDoc,
  readDocLaunchParams
} from '../js/CalendarDocLinks.js';

const origin = 'https://pages.opencodingsociety.com';

test('a site path or web link becomes an absolute doc URL', () => {
  assert.equal(normalizeDocUrl('/csa/calendar-card', origin), `${origin}/csa/calendar-card`);
  assert.equal(normalizeDocUrl(' https://example.com/doc ', origin), 'https://example.com/doc');
});

test('text that is not a web link is rejected', () => {
  assert.equal(normalizeDocUrl('', origin), '');
  assert.equal(normalizeDocUrl('Calendar smart card', origin), '');
  assert.equal(normalizeDocUrl('javascript:alert(1)', origin), '');
  assert.equal(normalizeDocUrl('data:text/html,hi', origin), '');
});

test('a linked doc round-trips through the event description', () => {
  const description = joinLinkedDoc('Read before class', `${origin}/csa/x`);
  assert.equal(description, `Read before class\nLinked doc: ${origin}/csa/x`);
  assert.deepEqual(splitLinkedDoc(description, origin), { body: 'Read before class', docUrl: `${origin}/csa/x` });
});

test('an event can hold only a linked doc', () => {
  const description = joinLinkedDoc('', `${origin}/csa/x`);
  assert.deepEqual(splitLinkedDoc(description, origin), { body: '', docUrl: `${origin}/csa/x` });
});

test('removing the doc leaves the description text alone', () => {
  assert.equal(joinLinkedDoc('Notes<br>', ''), 'Notes<br>');
  assert.deepEqual(splitLinkedDoc('Notes', origin), { body: 'Notes', docUrl: '' });
});

test('the doc line is found after HTML line breaks from the editor', () => {
  const description = `Notes<br><br>Linked doc: ${origin}/csa/x`;
  assert.deepEqual(splitLinkedDoc(description, origin), { body: 'Notes', docUrl: `${origin}/csa/x` });
});

test('a sprint-synced lesson URL counts as the linked doc and is not added twice', () => {
  const synced = `Formative - Week 3\n${origin}/csa/lesson`;
  const { body, docUrl } = splitLinkedDoc(synced, origin);
  assert.equal(body, synced);
  assert.equal(docUrl, `${origin}/csa/lesson`);
  assert.equal(joinLinkedDoc(body, docUrl), synced);
});

test('outside links in the text are not taken as the linked doc', () => {
  assert.equal(splitLinkedDoc('See https://example.com/page', origin).docUrl, '');
});

test('a doc page launch reads the doc and title', () => {
  assert.deepEqual(readDocLaunchParams('?doc=%2Fcsa%2Fcalendar-card&title=Calendar+smart+card', origin), {
    docUrl: `${origin}/csa/calendar-card`,
    title: 'Calendar smart card'
  });
});

test('a launch without a doc, or with an outside doc, is ignored', () => {
  assert.equal(readDocLaunchParams('?issue=4', origin), null);
  assert.equal(readDocLaunchParams('?doc=https%3A%2F%2Fevil.example%2Fx', origin), null);
});
