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

test('with onSchedule, anyone\'s message gets an Add to calendar button; edit and delete stay on your own', () => {
  const scheduled = [];
  const { element, log } = makeLog({ onSchedule: (shown, opener) => scheduled.push([shown.id, opener]) });
  log.append(message('m1', 'lunch friday'), false);
  log.append(message('m2', 'ok', { senderKey: 'ada' }), true);

  const labels = key => element.querySelector(`[data-key="${key}"]`).querySelectorAll('.chat-msg-action').map(b => b.getAttribute('aria-label'));
  assert.deepEqual(labels('m1'), ['Add to calendar']);
  assert.deepEqual(labels('m2'), ['Add to calendar', 'Edit message', 'Delete message']);

  const button = element.querySelector('[data-key="m1"]').querySelector('.chat-msg-action');
  button.dispatchEvent(fakeEvent('click'));
  assert.deepEqual(scheduled, [['m1', button]]);
});

test('no Add to calendar button in a read-only log, on a deleted message, or without onSchedule', () => {
  const readOnly = makeLog({ onSchedule() {}, readOnly: true });
  readOnly.log.append(message('m1', 'hi'), false);
  assert.equal(readOnly.element.querySelector('.chat-msg-action'), null);

  const { element, log } = makeLog({ onSchedule() {} });
  log.append(message('m2', '', { deleted: true }), false);
  assert.equal(element.querySelector('.chat-msg-action'), null);

  const plain = makeLog();
  plain.log.append(message('m3', 'hi'), false);
  assert.equal(plain.element.querySelector('.chat-msg-actions'), null);
});

// ── GitHub cards ─────────────────────────────────────────────────────────────────────
// linkCards(html) is what the page passes: GitHubCards.forBody, a box of cards or null.
function cardLog(options = {}) {
  const asked = [];
  const { element, log } = makeLog({
    linkCards: html => {
      asked.push(html);
      if (!/github\.com/.test(html)) return null;
      const box = document.createElement('div');
      const card = document.createElement('a');
      card.className = 'ocs__nav-card ocs__nav-card--compact';
      box.appendChild(card);
      return box;
    },
    onReply() {},
    ...options,
  });
  return { element, log, asked };
}
const mainOf = (element, key) => element.querySelector(`[data-key="${key}"]`).querySelector('.chat-msg-main');
const partsOf = (element, key) => mainOf(element, key).children.map(child => child.className);

test('a message with a GitHub link gets its cards last, before the action bar', () => {
  const { element, log } = cardLog();
  log.append(message('m1', 'look https://github.com/Open-Coding-Society/pages/pull/2066'), false);
  log.append(message('m2', 'no links here'), false);

  assert.deepEqual(partsOf(element, 'm1'), ['chat-msg-meta', 'chat-msg-body', 'chat-cards', 'chat-msg-actions']);
  assert.equal(mainOf(element, 'm2').querySelector('.chat-cards'), null);
});

test('an edit redraws the cards, and a deleted message drops them', () => {
  const { element, log } = cardLog();
  log.append(message('m1', 'see https://github.com/a/b/pull/1'), true);

  log.updateBody('m1', 'nothing to show now');
  assert.equal(mainOf(element, 'm1').querySelector('.chat-cards'), null);
  log.updateBody('m1', 'back: https://github.com/a/b/pull/2');
  assert.deepEqual(partsOf(element, 'm1'), ['chat-msg-meta', 'chat-msg-body', 'chat-cards', 'chat-msg-actions']);

  log.markDeleted('m1');
  assert.equal(mainOf(element, 'm1').querySelector('.chat-cards'), null);
});

test('a link only inside the quote of a reply makes no card', () => {
  const { log, asked } = cardLog({ richText: { ...richText, extractReplyMarker: body => ({ reply: { id: '9' }, html: body.replace(/^\[\[reply:[^\]]*\]\]/, '') }) } });
  log.append(message('m1', '[[reply:9|Grace|see https://github.com/a/b/pull/1]] thanks!'), false);

  assert.deepEqual(asked, [' thanks!']);
});

test('cards come from what the message shows: a link formatBody takes out makes no card', () => {
  const { element, log, asked } = cardLog({ formatBody: body => body.replace(/https:\/\/\S+/g, '(link removed)') });
  log.append(message('m1', 'see https://github.com/a/b/pull/1'), false);

  assert.deepEqual(asked, ['see (link removed)']);
  assert.equal(mainOf(element, 'm1').querySelector('.chat-cards'), null);
});

// ── Pins ─────────────────────────────────────────────────────────────────────────────
// A pin is a message of its own ([[pin:<id>]]); the log draws it as a one-line note and
// marks the message it pins.
const pinRow = (id, senderName, body, extra = {}) => ({ ...message(id, body, extra), senderKey: senderName, senderName });

test('a pin message shows as a note that names who pinned what, and the message gets marked', () => {
  const pinned = [];
  const { element, log } = makeLog({ onPin: (stored, isPinned) => pinned.push([stored.id, isPinned]) });
  log.append(pinRow('m1', 'Grace', 'Demo is Friday at 3'), false);
  log.append(pinRow('m2', 'Ada Lovelace', '[[pin:m1]]'), true);
  const note = element.querySelector('.chat-pin-note');
  assert.match(note.textContent, /You pinned a message:/);
  assert.match(note.textContent, /Demo is Friday at 3/);
  const target = element.querySelector('[data-key="m1"]');
  assert.equal(target.classList.contains('is-pinned'), true);
  assert.match(target.textContent, /Pinned/);
  const pinButton = target.querySelector('[data-action="pin"]');
  assert.equal(pinButton.getAttribute('aria-label'), 'Unpin');
  assert.equal(pinButton.getAttribute('aria-pressed'), 'true');
  pinButton.dispatchEvent(fakeEvent('click'));
  assert.deepEqual(pinned, [['m1', true]]);
  assert.equal(log.isPinned('m1'), true);
  assert.equal(element.querySelector('[data-key="m2"]').querySelector('[data-action="pin"]'), null, 'a pin note has no Pin button');
});

test('an unpin, or deleting the pin message, takes the pin away', () => {
  const { element, log } = makeLog({ onPin() {} });
  log.append(pinRow('m1', 'Grace', 'hello'), false);
  log.append(pinRow('p1', 'Grace', '[[pin:m1]]'), false);
  assert.equal(log.isPinned('m1'), true);
  log.markDeleted('p1');
  assert.equal(log.isPinned('m1'), false);
  assert.equal(element.querySelector('.chat-pin-note'), null);
  log.append(pinRow('p2', 'Alan', '[[pin:m1]]'), false);
  log.append(pinRow('p3', 'Alan', '[[unpin:m1]]'), false);
  assert.equal(log.isPinned('m1'), false);
  assert.match(element.textContent, /Alan unpinned a message:/);
  assert.equal(element.querySelector('[data-key="m1"]').classList.contains('is-pinned'), false);
});

test('a pinned message that is deleted drops out, and a read-only log has no Pin buttons', () => {
  const { element, log } = makeLog({ onPin() {} });
  log.append(pinRow('m1', 'Grace', 'hello'), false);
  log.append(pinRow('p1', 'Grace', '[[pin:m1]]'), false);
  log.markDeleted('m1');
  assert.equal(log.isPinned('m1'), false);
  assert.equal(element.querySelector('[data-key="m1"]').querySelector('.chat-msg-pinned'), null);

  const readOnly = makeLog({ readOnly: true });
  readOnly.log.append(pinRow('m1', 'Grace', 'hello'), false);
  readOnly.log.append(pinRow('p1', 'Grace', '[[pin:m1]]'), false);
  assert.equal(readOnly.element.querySelector('[data-action="pin"]'), null);
  assert.equal(readOnly.log.isPinned('m1'), true, 'the mark still shows who pinned what');
});

test('list() gives the messages as loaded, oldest first, pin notes included', () => {
  const { log } = makeLog({ onPin() {} });
  log.append(pinRow('m1', 'Grace', 'hello'), false);
  log.append(pinRow('p1', 'Grace', '[[pin:m1]]'), false);
  assert.deepEqual(log.list().map(stored => stored.key), ['m1', 'p1']);
});

test('the log says when its messages change: an append, an edit, a delete', () => {
  let changes = 0;
  const { log } = makeLog({ onChange: () => { changes += 1; } });
  log.append(pinRow('m1', 'Grace', 'hello'), false);
  log.updateBody('m1', 'hello there');
  log.markDeleted('m1');
  assert.equal(changes, 3);
});

test('a message edited into a pin marker shows as text and pins nothing, now and after a reload', () => {
  const { element, log } = makeLog({ onPin() {} });
  log.append(pinRow('m1', 'Grace', 'hello'), false);
  log.append(pinRow('m2', 'Grace', 'typo'), false);
  log.updateBody('m2', '[[pin:m1]]');
  assert.equal(log.isPinned('m1'), false);
  assert.equal(element.querySelector('.chat-pin-note'), null);

  const reloaded = makeLog({ onPin() {} });
  reloaded.log.append(pinRow('m1', 'Grace', 'hello'), false);
  reloaded.log.append(pinRow('m2', 'Grace', '[[pin:m1]]', { edited: true }), false);
  assert.equal(reloaded.log.isPinned('m1'), false);
  assert.equal(reloaded.element.querySelector('.chat-pin-note'), null);
  assert.match(bodyOf(reloaded.element, 'm2').textContent, /\[\[pin:m1\]\]/);
});
