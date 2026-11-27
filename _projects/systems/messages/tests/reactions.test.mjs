// Reactions on a message: the six emoji Spring keeps (its Reaction enum lists the same keys in
// the same order), and what Spring sends read into the shape the message log draws.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom } from './fake-dom.mjs';

const { document } = installFakeDom();
const { ReactionChips, Reactions } = await import('../js/reactions.js');

const person = (uid, name = uid) => ({ uid, name });
const like = (...people) => ({ reaction: 'like', people });

// The log's wording for chips, as LOG_TEXTS has it.
const TEXT = {
  you: 'You', reactionLike: 'Like', reactionLove: 'Love', reactionHaha: 'Haha', reactionWow: 'Wow', reactionSad: 'Sad',
  reactionCelebrate: 'Celebrate', reactionPeople: '{reaction}: {names}', reactionCount: '{reaction}, {count}: {names}',
};

function drawChips(list, { uid = 'ada', before = null } = {}) {
  const toggles = [];
  const main = document.createElement('div');
  if (before) main.appendChild(before);
  const chips = new ReactionChips({ text: TEXT, me: { uid }, onToggle: (key, on) => toggles.push([key, on]) });
  chips.render(main, before, list);
  return { main, chips, toggles, buttons: chipsIn(main) };
}

const chipsIn = main => main.querySelector('.chat-reactions')?.querySelectorAll('button') ?? [];

test('the six kinds are listed in order', () => {
  assert.deepEqual(Reactions.KINDS.map(kind => kind.key), ['like', 'love', 'haha', 'wow', 'sad', 'celebrate']);
  assert.deepEqual(Reactions.KINDS.map(kind => kind.emoji), ['👍', '❤️', '😂', '😮', '😢', '🎉']);
  assert.ok(Object.isFrozen(Reactions.KINDS));
});

test('normalize keeps the table order and drops what it cannot show', () => {
  const shown = Reactions.normalize([
    { reaction: 'wow', people: [person('ben', 'Ben')] },
    like(person('ada', 'Ada')),
    { reaction: 'thumbsdown', people: [person('x')] },
    { reaction: 'sad', people: [] },
    null,
    { reaction: 'love', people: [{ name: 'no uid' }] },
  ]);

  assert.deepEqual(shown, [like(person('ada', 'Ada')), { reaction: 'wow', people: [person('ben', 'Ben')] }]);
  assert.deepEqual(Reactions.normalize(undefined), []);
});

test("normalizeMap reads Spring's object of lists", () => {
  const map = Reactions.normalizeMap({ 42: [like(person('ada'))], 57: [], 60: 'not a list' });

  assert.deepEqual([...map.keys()], ['42']);
  assert.deepEqual(map.get('42'), [like(person('ada'))]);
  assert.equal(Reactions.normalizeMap(null).size, 0);
  assert.equal(Reactions.normalizeMap([like(person('ada'))]).size, 0);
});

test('isMine is decided by uid alone', () => {
  assert.equal(Reactions.isMine(like(person('ada')), 'ada'), true);
  assert.equal(Reactions.isMine(like({ uid: 'other', name: 'ada' }), 'ada'), false);
  assert.equal(Reactions.isMine(like(person('ada')), ''), false);
});

test("a chip's emoji and count are the button's own text", () => {
  const { buttons } = drawChips([like(person('ana', 'Ana'), person('ben', 'Ben'))]);

  assert.equal(buttons.length, 1);
  assert.equal(buttons[0].textContent, '👍 2');
  assert.equal(buttons[0].children.length, 0, 'no span: theme presets recolor spans');
  assert.equal(buttons[0].type, 'button');
});

test('your chips are pressed and filled, others are not', () => {
  const { buttons } = drawChips([like(person('ada', 'Ada')), { reaction: 'wow', people: [person('ben', 'Ben')] }]);

  assert.equal(buttons[0].className, 'ocs__btn small pill accent fill');
  assert.equal(buttons[0].getAttribute('aria-pressed'), 'true');
  assert.equal(buttons[1].className, 'ocs__btn small pill');
  assert.equal(buttons[1].getAttribute('aria-pressed'), 'false');
});

test('a chip names who reacted, you first', () => {
  const { buttons } = drawChips([like(person('ana', 'Ana'), person('ada', 'Ada Lovelace'), person('ben', 'Ben'))]);

  assert.equal(buttons[0].title, 'Like: You, Ana, and Ben');
  assert.equal(buttons[0].getAttribute('aria-label'), 'Like, 3: You, Ana, and Ben');
});

test('mine is decided by uid, not by name', () => {
  const { buttons } = drawChips([like({ uid: 'other', name: 'Ada Lovelace' })], { uid: 'ada' });

  assert.equal(buttons[0].getAttribute('aria-pressed'), 'false');
  assert.equal(buttons[0].title, 'Like: Ada Lovelace');
});

test('clicking a chip asks to toggle yours', () => {
  const { buttons, toggles } = drawChips([like(person('ada')), { reaction: 'wow', people: [person('ben')] }]);

  buttons[0].dispatchEvent(fakeEvent('click'));
  buttons[1].dispatchEvent(fakeEvent('click'));

  assert.deepEqual(toggles, [['like', false], ['wow', true]]);
});

test('the row goes before the action bar, is redrawn in place, and an empty list removes it', () => {
  const actions = document.createElement('div');
  actions.className = 'chat-msg-actions';
  const { main, chips } = drawChips([like(person('ana'))], { before: actions });
  assert.deepEqual(main.children.map(child => child.className), ['chat-reactions', 'chat-msg-actions']);

  chips.render(main, actions, [like(person('ana'), person('ben'))]);
  assert.equal(main.querySelectorAll('.chat-reactions').length, 1);
  assert.equal(chipsIn(main)[0].textContent, '👍 2');

  chips.render(main, actions, []);
  assert.equal(main.querySelector('.chat-reactions'), null);
});

test('setDisabled turns every chip in the row off and back on', () => {
  const { main, chips, buttons } = drawChips([like(person('ana')), { reaction: 'sad', people: [person('ben')] }]);

  chips.setDisabled(main, true);
  assert.deepEqual(buttons.map(chip => chip.disabled), [true, true]);
  chips.setDisabled(main, false);
  assert.deepEqual(buttons.map(chip => chip.disabled), [false, false]);
});

test('a chip that had focus keeps it when the row is redrawn', () => {
  const { main, chips } = drawChips([like(person('ada')), { reaction: 'wow', people: [person('alan')] }]);
  document.body.appendChild(main);
  chipsIn(main)[1].focus();

  chips.render(main, null, [like(person('ada'), person('grace')), { reaction: 'wow', people: [person('alan'), person('ada')] }]);

  assert.equal(document.activeElement, chipsIn(main)[1], 'the Wow chip in the new row has focus');
  assert.equal(document.activeElement.dataset.reaction, 'wow');
});

test('the chip row is not read out by the log as it changes', () => {
  const { main } = drawChips([like(person('ada'))]);
  assert.equal(main.querySelector('.chat-reactions').getAttribute('aria-live'), 'off');
});
