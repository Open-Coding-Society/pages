// Reactions on a message: the six emoji Spring keeps (its Reaction enum lists the same keys in
// the same order), and what Spring sends read into the shape the message log draws.
import assert from 'node:assert/strict';
import test from 'node:test';

const { Reactions } = await import('../js/reactions.js');

const person = (uid, name = uid) => ({ uid, name });
const like = (...people) => ({ reaction: 'like', people });

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
