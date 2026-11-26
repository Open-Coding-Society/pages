// Texts: words by dotted key with {slot}s filled in.
// Run: node --test _projects/systems/community/tests/texts.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Texts } from '../js/texts.js';

const texts = new Texts({ groups: { muted: 'Muted in {group} until {until}.' }, app: { demo: 'Demo' } });

test('say fills slots and leaves unknown ones as written', () => {
  assert.equal(texts.say('groups.muted', { group: 'Demo Series 1' }), 'Muted in Demo Series 1 until {until}.');
  assert.equal(texts.say('app.demo'), 'Demo');
});

test('a missing key fails loudly', () => {
  assert.throws(() => texts.say('groups.nope'), /no text "groups.nope"/);
  assert.equal(texts.has('groups.nope'), false);
  assert.equal(texts.has('groups'), false, 'a section is not words');
});

test('the table must be an object', () => {
  assert.throws(() => new Texts(null), TypeError);
  assert.throws(() => new Texts(['a']), TypeError);
});
