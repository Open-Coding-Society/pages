// Run with: node --test _projects/games/racing-game/tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import LapTracker, { getCrossingDirection } from '../levels/LapTracker.js';
import SpeedBoost from '../levels/SpeedBoost.js';

const finishLine = { x: 0.5, top: 0.7, bottom: 0.9 };

// Moves a car through the given centres and returns how many times it finished.
function drive(tracker, car, centres) {
  return centres.filter((centre) => tracker.update(car, centre)).length;
}

// One lap to the right: from behind the finish line, over it, round the top of the track, and back over it.
const oneLap = [
  { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 },
  { x: 0.9, y: 0.5 },
  { x: 0.55, y: 0.2 }, { x: 0.45, y: 0.2 },
  { x: 0.1, y: 0.5 },
  { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }
];

test('crossing direction is +1 moving right, -1 moving left, 0 when missing the line', () => {
  assert.equal(getCrossingDirection({ x: 0.4, y: 0.8 }, { x: 0.6, y: 0.8 }, finishLine), 1);
  assert.equal(getCrossingDirection({ x: 0.6, y: 0.8 }, { x: 0.4, y: 0.8 }, finishLine), -1);
  assert.equal(getCrossingDirection({ x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 }, finishLine), 0, 'passes above the line');
  assert.equal(getCrossingDirection({ x: 0.4, y: 0.8 }, { x: 0.45, y: 0.8 }, finishLine), 0, 'does not reach the line');
});

test('a lap counts after going round the far side of the track', () => {
  const tracker = new LapTracker({ finishLine, totalLaps: 3 });
  const car = {};
  drive(tracker, car, oneLap.slice(0, 5));
  assert.equal(tracker.hasPassedCheckpoint(car), true, 'halfway mark shows after the top of the track');
  drive(tracker, car, oneLap.slice(5));
  assert.equal(tracker.getLapsCompleted(car), 1);
  assert.equal(tracker.hasPassedCheckpoint(car), false, 'halfway mark resets for the next lap');
});

test('crossing the start line at the start does not count as a lap', () => {
  const tracker = new LapTracker({ finishLine, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [{ x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }]);
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('wiggling back and forth over the finish line does not count laps', () => {
  const tracker = new LapTracker({ finishLine, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [
    { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }
  ]);
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('driving the track backwards does not count laps', () => {
  const tracker = new LapTracker({ finishLine, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [...oneLap].reverse());
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('the final lap finishes the race once, and each car is tracked separately', () => {
  const tracker = new LapTracker({ finishLine, totalLaps: 2 });
  const redCar = {};
  const blueCar = {};
  const finishes = drive(tracker, redCar, [...oneLap, ...oneLap.slice(2), ...oneLap.slice(2)]);
  drive(tracker, blueCar, oneLap);
  assert.equal(finishes, 1);
  assert.equal(tracker.getLapsCompleted(redCar), 2);
  assert.equal(tracker.getLapsCompleted(blueCar), 1);
});

test('rejects a level with a missing finish line or bad lap count', () => {
  assert.throws(() => new LapTracker({ totalLaps: 3 }), /finishLine/);
  assert.throws(() => new LapTracker({ finishLine: { x: 0.5, top: 0.9, bottom: 0.7 }, totalLaps: 3 }), /finishLine/);
  assert.throws(() => new LapTracker({ finishLine, totalLaps: 0 }), /totalLaps/);
});

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
