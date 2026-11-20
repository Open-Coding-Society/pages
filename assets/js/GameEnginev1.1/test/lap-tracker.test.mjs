// Run with the engine tests (see test/README.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import LapTracker, { getCrossingDirection } from '../essentials/LapTracker.js';

const finishLine = { x: 0.5, top: 0.7, bottom: 0.9 };
const checkpoint = { x: 0.5, top: 0.15, bottom: 0.35 };

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
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 3 });
  const car = {};
  drive(tracker, car, oneLap.slice(0, 5));
  assert.equal(tracker.hasPassedCheckpoint(car), true, 'halfway mark shows after the top of the track');
  drive(tracker, car, oneLap.slice(5));
  assert.equal(tracker.getLapsCompleted(car), 1);
  assert.equal(tracker.hasPassedCheckpoint(car), false, 'halfway mark resets for the next lap');
});

test('crossing the start line at the start does not count as a lap', () => {
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [{ x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }]);
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('crossing the far-side checkpoint in the wrong direction cannot complete a lap', () => {
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [
    { x: 0.45, y: 0.8 },
    { x: 0.45, y: 0.2 },
    { x: 0.55, y: 0.2 },
    { x: 0.45, y: 0.8 },
    { x: 0.55, y: 0.8 },
  ]);

  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('wiggling back and forth over the finish line does not count laps', () => {
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [
    { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }
  ]);
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('driving the track backwards does not count laps', () => {
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 3 });
  const car = {};
  drive(tracker, car, [...oneLap].reverse());
  assert.equal(tracker.getLapsCompleted(car), 0);
});

test('the final lap finishes the race once, and each car is tracked separately', () => {
  const tracker = new LapTracker({ finishLine, checkpoint, totalLaps: 2 });
  const redCar = {};
  const blueCar = {};
  const finishes = drive(tracker, redCar, [...oneLap, ...oneLap.slice(2), ...oneLap.slice(2)]);
  drive(tracker, blueCar, oneLap);
  assert.equal(finishes, 1);
  assert.equal(tracker.getLapsCompleted(redCar), 2);
  assert.equal(tracker.getLapsCompleted(blueCar), 1);
});

test('rejects missing or invalid lines and lap counts', () => {
  assert.throws(() => new LapTracker({ totalLaps: 3 }), /finishLine/);
  assert.throws(() => new LapTracker({ finishLine, totalLaps: 3 }), /checkpoint/);
  assert.throws(() => new LapTracker({
    finishLine: { x: 0.5, top: 0.9, bottom: 0.7 },
    checkpoint,
    totalLaps: 3,
  }), /finishLine/);
  assert.throws(() => new LapTracker({
    finishLine,
    checkpoint: { x: 0.5, top: 0.35, bottom: 0.15 },
    totalLaps: 3,
  }), /checkpoint/);
  assert.throws(() => new LapTracker({ finishLine, checkpoint, totalLaps: 0 }), /totalLaps/);
});
