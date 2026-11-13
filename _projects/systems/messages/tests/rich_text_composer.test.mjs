// The shared chat composer (assets/js/chat/rich-text.js) with the two options embeds
// need: enterKey, and destroy(). It runs on the fake DOM, which has no selection or
// editing engine, so this covers which key does what and which listeners come and go.
// What the browser then types into the editor still needs a check in a real browser.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom } from './fake-dom.mjs';

const { document, window } = installFakeDom();

const { createRichComposer } = await import('../../../../assets/js/chat/rich-text.js');

function makeComposer(options = {}) {
  const submitted = [];
  const composer = createRichComposer({ onSubmit: () => submitted.push('submit'), ...options });
  return { composer, submitted };
}

const enter = (props = {}) => fakeEvent('keydown', { key: 'Enter', shiftKey: false, isComposing: false, ...props });

test('by default Enter sends and Shift+Enter leaves the new line to the browser, as in every chat', () => {
  const { composer, submitted } = makeComposer();
  const plain = enter();
  composer.editor.dispatchEvent(plain);
  assert.deepEqual(submitted, ['submit']);
  assert.equal(plain.defaultPrevented, true);

  const shifted = enter({ shiftKey: true });
  composer.editor.dispatchEvent(shifted);
  assert.deepEqual(submitted, ['submit']);
  assert.equal(shifted.defaultPrevented, false);
});

test("enterKey 'newline' makes Enter a line break, the one Shift+Enter gives, and never sends", () => {
  document.commands.length = 0;
  const { composer, submitted } = makeComposer({ enterKey: 'newline' });
  const plain = enter();
  composer.editor.dispatchEvent(plain);
  assert.deepEqual(submitted, []);
  assert.deepEqual(document.commands, ['insertLineBreak']);
  assert.equal(plain.defaultPrevented, true);

  const shifted = enter({ shiftKey: true });
  composer.editor.dispatchEvent(shifted);
  assert.deepEqual(submitted, []);
  assert.equal(shifted.defaultPrevented, false);
});

test("enterKey 'newline' leaves Enter to the browser when it can't insert a line break", () => {
  document.commands.length = 0;
  document.commandResult = () => false;
  try {
    const { composer, submitted } = makeComposer({ enterKey: 'newline' });
    const plain = enter();
    composer.editor.dispatchEvent(plain);
    assert.deepEqual(submitted, []);
    assert.equal(plain.defaultPrevented, false);
  } finally {
    document.commandResult = () => true;
  }
});

test('Enter while an input method is composing is left alone', () => {
  const { composer, submitted } = makeComposer();
  composer.editor.dispatchEvent(enter({ isComposing: true }));
  assert.deepEqual(submitted, []);
});

test('an enterKey other than send or newline is refused', () => {
  assert.throws(() => createRichComposer({ enterKey: 'submit' }), TypeError);
});

test('destroy takes back the document and window listeners and closes an open emoji panel', () => {
  const before = { document: document.listenerCount(), window: window.listenerCount() };
  const counts = () => ({
    selectionchange: document.listenerCount('selectionchange'),
    click: document.listenerCount('click'),
    scroll: window.listenerCount('scroll'),
  });
  const start = counts();
  const { composer } = makeComposer();
  // Focus wires the selection listener; opening the emoji panel wires its two dismiss listeners.
  composer.editor.dispatchEvent(fakeEvent('focusin'));
  const emojiButton = composer.element.querySelector('.rt-emoji-toggle');
  emojiButton.dispatchEvent(fakeEvent('click'));
  assert.ok(document.body.querySelector('.rt-emoji-panel'), 'the emoji panel opens');
  assert.deepEqual(counts(), { selectionchange: start.selectionchange + 1, click: start.click + 1, scroll: start.scroll + 1 });

  composer.destroy();
  assert.ok(!document.body.querySelector('.rt-emoji-panel'), 'the panel is gone');
  assert.deepEqual({ document: document.listenerCount(), window: window.listenerCount() }, before);

  // A destroyed composer adds nothing back.
  composer.editor.dispatchEvent(fakeEvent('focusin'));
  emojiButton.dispatchEvent(fakeEvent('click'));
  assert.ok(!document.body.querySelector('.rt-emoji-panel'), 'the panel stays closed');
  assert.deepEqual({ document: document.listenerCount(), window: window.listenerCount() }, before);
});

test('destroy on a composer that never opened its emoji panel or had focus is harmless', () => {
  const before = { document: document.listenerCount(), window: window.listenerCount() };
  const { composer } = makeComposer();
  composer.destroy();
  assert.deepEqual({ document: document.listenerCount(), window: window.listenerCount() }, before);
});
