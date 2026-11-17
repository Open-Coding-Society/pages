// The message log a host can reword, show read-only and reformat (formatBody), as the
// embedded chats do, while /dm keeps its own wording.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom } from './fake-dom.mjs';

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
  assert.equal(element.querySelector('[data-key="m2"]').querySelector('.chat-msg-image-link').target, '_blank');
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

// The image viewer. A plain click opens it over the conversation; the ways people ask
// for a new tab on purpose are left to the browser.
function withImage(options = {}) {
  const made = makeLog(options);
  made.log.append(message('m1', '', { image: '/images/plan.png' }), false);
  made.link = made.element.querySelector('.chat-msg-image-link');
  return made;
}

test('a plain click on a sent image opens the viewer instead of following the link', () => {
  const { log, link } = withImage();
  const event = fakeEvent('click');
  link.dispatchEvent(event);
  assert.ok(event.defaultPrevented, 'the link is not followed');
  assert.ok(log.isViewerOpen(), 'the viewer is open');
  const image = document.body.querySelector('.chat-image-viewer-image');
  assert.equal(image.src, '/images/plan.png');
  assert.equal(image.alt, 'Image from Grace Hopper');
  log.destroy();
});

test('the viewer is not opened by the clicks that mean "open in a new tab"', () => {
  for (const props of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const { log, link } = withImage();
    const event = fakeEvent('click', props);
    link.dispatchEvent(event);
    assert.ok(!event.defaultPrevented, `${JSON.stringify(props)} is left to the browser`);
    assert.ok(!log.isViewerOpen(), `${JSON.stringify(props)} opens no viewer`);
    log.destroy();
  }
});

test('the viewer closes on the image, the backdrop and Escape, and stops listening after', () => {
  const { log, link } = withImage();
  link.dispatchEvent(fakeEvent('click'));
  document.body.querySelector('.chat-image-viewer-image').dispatchEvent(fakeEvent('click'));
  assert.ok(!log.isViewerOpen(), 'clicking the image closes it');

  link.dispatchEvent(fakeEvent('click'));
  const viewer = document.body.querySelector('.chat-image-viewer');
  viewer.dispatchEvent(fakeEvent('click', { target: viewer }));
  assert.ok(!log.isViewerOpen(), 'clicking the backdrop closes it');

  link.dispatchEvent(fakeEvent('click'));
  document.dispatchEvent(fakeEvent('keydown', { key: 'Escape' }));
  assert.ok(!log.isViewerOpen(), 'Escape closes it');

  // Closed, so Escape is no longer listened for: nothing is left on the document.
  const after = fakeEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(after);
  assert.ok(!after.defaultPrevented, 'the Escape listener was taken back on close');
  log.destroy();
});

test('a click inside the viewer that is not the backdrop leaves it open', () => {
  const { log, link } = withImage();
  link.dispatchEvent(fakeEvent('click'));
  const viewer = document.body.querySelector('.chat-image-viewer');
  const close = viewer.querySelector('.chat-image-viewer-close');
  viewer.dispatchEvent(fakeEvent('click', { target: close }));
  assert.ok(log.isViewerOpen(), 'the backdrop handler ignores clicks on its children');
  close.dispatchEvent(fakeEvent('click'));
  assert.ok(!log.isViewerOpen(), 'the close button closes it');
  log.destroy();
});

test('deleting a message whose image is open closes the viewer', () => {
  const { log, link } = withImage();
  link.dispatchEvent(fakeEvent('click'));
  assert.ok(log.isViewerOpen());
  log.markDeleted('m1');
  assert.ok(!log.isViewerOpen(), 'the viewer does not outlive the image it was showing');
  log.destroy();
});

test('destroy takes the viewer off the page', () => {
  const { log, link } = withImage();
  link.dispatchEvent(fakeEvent('click'));
  assert.ok(document.body.querySelector('.chat-image-viewer'), 'built on first use');
  log.destroy();
  assert.ok(!document.body.querySelector('.chat-image-viewer'), 'and removed again');
});

test('a host can reword the viewer close button', () => {
  const { log, link } = withImage({ texts: { closeImage: 'Bild schließen' } });
  link.dispatchEvent(fakeEvent('click'));
  const close = document.body.querySelector('.chat-image-viewer-close');
  assert.equal(close.getAttribute('aria-label'), 'Bild schließen');
  log.destroy();
});

test('reveal scrolls to a message and marks it, and only the newest find stays marked', () => {
  const { element, log } = makeLog();
  log.append(message('m1', 'first'), false);
  log.append(message('m2', 'second'), false);
  const first = element.querySelector('[data-key="m1"]');
  const second = element.querySelector('[data-key="m2"]');

  assert.equal(log.reveal('m1'), true);
  assert.equal(first.classList.contains('is-found'), true);
  assert.deepEqual(first.scrolledIntoView, { block: 'center' });

  assert.equal(log.reveal('m2'), true);
  assert.equal(first.classList.contains('is-found'), false);
  assert.equal(second.classList.contains('is-found'), true);
});

test('reveal says when the message is not in the log', () => {
  const { log } = makeLog();
  log.append(message('m1', 'first'), false);
  assert.equal(log.reveal('m9'), false);
});
