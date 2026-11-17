// Run with the engine tests (see test/README.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import ClickerGame from '../essentials/ClickerGame.js';

// A 400x400 canvas; with power-ups the bottom 90 pixels hold the shop.
function game(data = {}) {
  const gameEnv = { innerWidth: 400, innerHeight: 400, gameObjects: [], gameControl: { isPaused: false } };
  const clicker = new ClickerGame({ goalScore: 100, ...data }, gameEnv);
  gameEnv.gameObjects.push(clicker);
  return clicker;
}

function clickTarget(clicker, index = 0) {
  const target = clicker.targets[index];
  clicker.handlePoint(target.x * clicker.gameEnv.innerWidth, target.y * clicker.playHeight);
}

function clickCard(clicker, index = 0) {
  const card = clicker.shopCards()[index];
  clicker.handlePoint((card.left + card.right) / 2, (card.top + card.bottom) / 2);
}

const extraClick = { name: 'Grandma', cost: 3, effect: 'per-click', amount: 2 };
const autoClick = { name: 'Oven', cost: 2, effect: 'auto-click', amount: 5 };

test('clicking a target scores a point and clicking empty space does not', () => {
  const clicker = game();
  clickTarget(clicker);
  clicker.handlePoint(1, 1);
  assert.equal(clicker.points, 1);
});

test('buying a per-click power-up spends points and adds its amount to each click', () => {
  const clicker = game({ powerUps: [extraClick] });
  clickCard(clicker);
  assert.equal(clicker.powerUps[0].owned, 0, 'cannot buy without enough points');

  for (let i = 0; i < 3; i++) clickTarget(clicker);
  clickCard(clicker);
  assert.equal(clicker.points, 0);
  assert.equal(clicker.powerUps[0].owned, 1);
  clickTarget(clicker);
  assert.equal(clicker.points, 3);
  assert.equal(clicker.earned, 6, 'spent points still count toward the goal');
});

test('auto-click power-ups add points every whole second', () => {
  const clicker = game({ powerUps: [autoClick] });
  clickTarget(clicker);
  clickTarget(clicker);
  clickCard(clicker);
  clicker.tick(999);
  assert.equal(clicker.points, 0);
  clicker.tick(2001);
  assert.equal(clicker.points, 15);
});

test('earning the goal wins and stops further clicks', () => {
  const clicker = game({ goalScore: 2, winMessage: 'Yum!' });
  clickTarget(clicker);
  clickTarget(clicker);
  assert.equal(clicker.hasWon, true);
  clickTarget(clicker);
  assert.equal(clicker.points, 2);
});

test('moving targets bounce inside the play area', () => {
  const clicker = game({ targetCount: 4, targetSpeed: 5 });
  assert.equal(clicker.targets.length, 4);
  for (let frame = 0; frame < 500; frame++) clicker.moveTargets();
  const radius = clicker.targetSize / 2;
  for (const target of clicker.targets) {
    assert.ok(target.x * 400 >= radius - 1e-9 && target.x * 400 <= 400 - radius + 1e-9);
    assert.ok(target.y * 400 >= radius - 1e-9 && target.y * 400 <= 400 - radius + 1e-9);
  }
});
