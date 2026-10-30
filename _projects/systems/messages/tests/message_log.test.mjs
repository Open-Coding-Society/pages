// The message log a host can reword, show read-only and reformat (formatBody), as the
// embedded chats do, while /dm keeps its own wording.
import assert from 'node:assert/strict';
import test from 'node:test';

import { installFakeDom } from './fake-dom.mjs';

installFakeDom();

const { LOG_TEXTS, createMessageLog, fillText, shownBody, withTexts } = await import('../js/message-log.js');

const me = { uid: 'ada', name: 'Ada Lovelace', pfp: null };
// Bodies arrive as stored HTML; this stub keeps them as text so a test can read them.
const richText = {
  renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
};

function makeLog(options = {}) {
  const element = document.createElement('div');
  const edits = [];
  const log = createMessageLog(element, {
    richText, me, onEdit: message => edits.push(message), onDelete() {}, ...options,
  });
  return { element, log, edits };
}

const message = (id, body, extra = {}) => ({
  id, key: id, senderKey: 'Grace Hopper', senderName: 'Grace Hopper', senderPfp: null,
  body, sentAt: null, edited: false, deleted: false, image: null, ...extra,
});
const bodyOf = (element, key) => element.querySelector(`[data-key="${key}"]`).querySelector('.chat-msg-body');

test('fillText fills each {slot} and leaves one without a value as written', () => {
  assert.equal(fillText('{sender} shared {filename}', { sender: 'Ada', filename: 'plan.pdf' }), 'Ada shared plan.pdf');
  assert.equal(fillText('Image from {name}', {}), 'Image from {name}');
  assert.equal(fillText('No slots', { name: 'x' }), 'No slots');
});

test('withTexts keeps the defaults a host leaves out and ignores keys and values it cannot use', () => {
  const merged = withTexts({ you: 'You', edited: '(edited)' }, { you: 'Du', edited: 42, extra: 'unused' });
  assert.deepEqual(merged, { you: 'Du', edited: '(edited)' });
  assert.throws(() => withTexts(LOG_TEXTS, null), TypeError);
  assert.throws(() => withTexts(LOG_TEXTS, ['Du']), TypeError);
});

test('shownBody shows what formatBody makes of a message, and the body as sent if formatBody fails', t => {
  const warn = t.mock.method(console, 'warn', () => {});
  const sent = message('m1', 'hello');
  assert.equal(shownBody(sent, null), 'hello');
  assert.equal(shownBody(sent, (body, shown) => `${shown.senderName}: ${body}`), 'Grace Hopper: hello');
  assert.equal(shownBody(sent, () => { throw new Error('boom'); }), 'hello');
  assert.equal(warn.mock.callCount(), 1);
});

test('a log made without texts says what /dm says', () => {
  const { element, log } = makeLog();
  log.append(message('m1', 'mine', { edited: true }), true);
  log.append(message('m2', 'gone', { deleted: true }), false);
  const mine = element.querySelector('[data-key="m1"]');
  assert.equal(mine.querySelector('.chat-msg-sender').textContent, 'You');
  assert.equal(mine.querySelector('.chat-msg-edited').textContent, '(edited)');
  assert.deepEqual(mine.querySelectorAll('.chat-msg-action').map(button => button.getAttribute('aria-label')), ['Edit message', 'Delete message']);
  const gone = bodyOf(element, 'm2');
  assert.equal(gone.textContent, 'This message was deleted.');
  assert.ok(gone.classList.contains('is-deleted'));
});

test('texts reword the log', () => {
  const { element, log } = makeLog({ texts: { you: 'Du', deleted: 'Gelöscht.', imageFrom: 'Bild von {name}' } });
  log.append(message('m1', 'hallo'), true);
  log.append(message('m2', '', { image: '/images/plan.png' }), false);
  log.markDeleted('m1');
  assert.equal(element.querySelector('[data-key="m1"]').querySelector('.chat-msg-sender').textContent, 'Du');
  assert.equal(bodyOf(element, 'm1').textContent, 'Gelöscht.');
  assert.equal(element.querySelector('[data-key="m2"]').querySelector('img.ocs__image-frame').alt, 'Bild von Grace Hopper');
});

test('a read-only log offers no edit or delete, even on your own messages', () => {
  const { element, log } = makeLog({ readOnly: true });
  log.append(message('m1', 'mine'), true);
  assert.ok(!element.querySelector('.chat-msg-actions'), 'no .chat-msg-actions is built');
});

test('formatBody changes what a message and its edits show, but Edit still loads the body as sent', () => {
  const { element, log, edits } = makeLog({ formatBody: body => body.toUpperCase() });
  log.append(message('m1', 'first draft'), true);
  assert.equal(bodyOf(element, 'm1').textContent, 'FIRST DRAFT');
  log.updateBody('m1', 'second draft');
  assert.equal(bodyOf(element, 'm1').textContent, 'SECOND DRAFT');
  element.querySelector('[data-key="m1"]').querySelector('.chat-msg-action').dispatchEvent({ type: 'click' });
  assert.equal(edits[0].body, 'second draft');
});

test('a formatBody that is not a function is refused when the log is made', () => {
  assert.throws(() => makeLog({ formatBody: 'uppercase' }), TypeError);
});
