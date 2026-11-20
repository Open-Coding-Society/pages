// Run with the engine tests (see test/README.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import LapRace from '../essentials/LapRace.js';
import PlayerDriver from '../essentials/PlayerDriver.js';

const finishLine = { x: 0.5, top: 0.7, bottom: 0.9 };
const checkpoint = { x: 0.5, top: 0.15, bottom: 0.35 };
// The same lap as lap-tracker.test.mjs, in 0-1 canvas coordinates.
const oneLap = [
  { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.9, y: 0.5 },
  { x: 0.55, y: 0.2 }, { x: 0.45, y: 0.2 }, { x: 0.1, y: 0.5 },
  { x: 0.45, y: 0.8 }, { x: 0.55, y: 0.8 }
];

// A driver with only the state LapRace reads; the canvas is 100x100, so centres map 1:1 to percentages.
function car(name) {
  const driver = Object.create(PlayerDriver.prototype);
  Object.assign(driver, { spriteData: { name }, speed: 0, pressedKeys: {}, centre: { x: 0, y: 0 } });
  driver.getCenter = () => ({ x: driver.centre.x * 100, y: driver.centre.y * 100 });
  return driver;
}

function race(cars, totalLaps = 1) {
  const gameEnv = { innerWidth: 100, innerHeight: 100, gameObjects: [...cars], gameControl: { isPaused: false } };
  const lapRace = new LapRace({ totalLaps, finishLine, checkpoint }, gameEnv);
  gameEnv.gameObjects.push(lapRace);
  return lapRace;
}

test('the first car to finish every lap wins and every car stops', () => {
  const red = car('Red Car');
  const blue = car('Blue Car');
  const lapRace = race([red, blue]);
  for (const point of oneLap) {
    red.centre = point;
    red.speed = 3;
    blue.speed = 2;
    blue.pressedKeys = { 87: true };
    lapRace.trackLaps();
  }
  assert.equal(lapRace.winnerName, 'Red Car');
  assert.equal(blue.speed, 0);
  assert.deepEqual(blue.pressedKeys, {});
});

test('the race has no winner until the last lap is done', () => {
  const red = car('Red Car');
  const lapRace = race([red], 2);
  for (const point of oneLap) {
    red.centre = point;
    lapRace.trackLaps();
  }
  assert.equal(lapRace.winnerName, null);
  assert.equal(lapRace.raceStarted, false, 'the timer waits for a car to move');
});

test('the race only counts PlayerDriver cars and removes itself on destroy', () => {
  const red = car('Red Car');
  const lapRace = race([red, { name: 'tree' }]);
  assert.deepEqual(lapRace.getCars(), [red]);
  lapRace.destroy();
  assert.equal(lapRace.gameEnv.gameObjects.includes(lapRace), false);
});
