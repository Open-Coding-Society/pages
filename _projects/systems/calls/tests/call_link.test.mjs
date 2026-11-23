import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CallLink } from '../js/call-link.js';
import { CallModel } from '../js/call-model.js';

test('links carry the site\'s baseurl', () => {
  assert.equal(CallLink.forGroup(12, '/pages'), '/pages/calls/?group=12');
  assert.equal(CallLink.forDm(34, '/pages/'), '/pages/calls/?dm=34');
  assert.equal(CallLink.forGroup(12), '/calls/?group=12');
});

test('a link opens the room it names', () => {
  const group = new URL(CallLink.forGroup(12), 'https://pages.example');
  assert.deepEqual(CallModel.contextFromQuery(group.searchParams), { contextType: 'GROUP', contextKey: '12', purpose: null });
  const dm = new URL(CallLink.forDm(34), 'https://pages.example');
  assert.equal(CallModel.contextFromQuery(dm.searchParams).contextType, 'DM');
});

test('ids must be positive whole numbers', () => {
  for (const id of [0, -3, 1.5, '12', NaN, null]) {
    assert.throws(() => CallLink.forGroup(id), TypeError, String(id));
    assert.throws(() => CallLink.forDm(id), TypeError, String(id));
  }
});
