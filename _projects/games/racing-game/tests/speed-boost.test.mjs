// Run with: node --test _projects/games/racing-game/tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import SpeedBoost from '../levels/SpeedBoost.js';

test('boost runs for three seconds and cannot be triggered again while active', () => {
  const boost = new SpeedBoost();
  assert.equal(boost.activate(), true);
  assert.equal(boost.isActive, true);
  assert.equal(boost.chargeFraction, 0);
  assert.equal(boost.activate(), false);

  boost.update(2999);
  assert.equal(boost.isActive, true);
  boost.update(1);
  assert.equal(boost.isActive, false);
  assert.equal(boost.chargeFraction, 0);
});

test('recharge starts after the boost and completes after five seconds', () => {
  const boost = new SpeedBoost();
  boost.activate();
  boost.update(3000);
  assert.equal(boost.activate(), false);

  boost.update(2500);
  assert.equal(boost.chargeFraction, 0.5);
  boost.update(2499);
  assert.equal(boost.activate(), false);
  boost.update(1);
  assert.equal(boost.chargeFraction, 1);
  assert.equal(boost.activate(), true);
});

test('elapsed time must be a non-negative finite number', () => {
  const boost = new SpeedBoost();
  assert.throws(() => boost.update(-1), /non-negative finite number/);
  assert.throws(() => boost.update(Infinity), /non-negative finite number/);
});
