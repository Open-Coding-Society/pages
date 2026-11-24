import test from 'node:test';
import assert from 'node:assert/strict';
import '../../../../assets/js/GameEnginev1.1/test/register-assets.mjs';

const { configureOnboardingGame, createOnboardingGame } = await import('../js/onboarding-game.js');
const { default: IdentityForgeGate } = await import('../js/identity-forge-gate.js');
const { default: ToolchainTrailGate } = await import('../js/toolchain-trail-gate.js');
const { SnakePlayer, SnakeApple } = await import('../js/toolchain-snake.js');
const { default: GameLevel } = await import('../../../../assets/js/GameEnginev1.1/essentials/GameLevel.js');

test('each game composes only its own gate and level, skipping a saved gate', () => {
  class Level {}
  class Gate {}
  const session = {
    challenge: { id: 'toolchain-trail', gate: 'toolchain-snake' }, unlocked: false,
    counter: {}, error: {}, onProgress() {}, save() {},
  };
  configureOnboardingGame(session);
  let game = createOnboardingGame(Level, Gate);
  assert.deepEqual(game.gameLevelClasses, [Gate, Level]);
  const host = { path: '', environment: {}, gameContainer: {} };
  const control = new game.GameControl(host, game.gameLevelClasses);
  assert.deepEqual(host.environment.fixedStage, { width: 1600, height: 900 });
  assert.equal(session.control, control);
  session.unlocked = true;
  game = createOnboardingGame(Level, Gate);
  assert.deepEqual(game.gameLevelClasses, [Level]);
  game = createOnboardingGame(Level);
  assert.deepEqual(game.gameLevelClasses, [Level]);
});

test('Identity gate collects distinct cookies, respects pause and saves before finishing', async t => {
  const oldDocument = globalThis.document;
  let key;
  globalThis.document = {
    addEventListener(_type, listener) { key = listener; },
    removeEventListener(_type, listener) { assert.equal(listener, key); key = null; },
  };
  t.after(() => { globalThis.document = oldDocument; });
  const events = [];
  const session = {
    challenge: { id: 'identity-forge', gate: 'identity-cookie' }, unlocked: false,
    counter: {}, onProgress: event => events.push(event), save: async () => 'saved',
  };
  configureOnboardingGame(session);
  const { GameControl, gameLevelClasses } = createOnboardingGame(class {}, IdentityForgeGate);
  const game = { path: '', gameContainer: {}, environment: { innerWidth: 800, innerHeight: 500 } };
  const control = new GameControl(game, gameLevelClasses);
  const env = { game, path: '', gameObjects: [] };
  const gate = new IdentityForgeGate(env);
  control.currentLevel = { gameLevel: gate };
  const descriptors = new GameLevel(control).expandDescriptor(gate.classes[0]);
  env.gameObjects = descriptors.map(({ class: Clicker, data }) => {
    const cookie = Object.create(Clicker.prototype);
    Object.assign(cookie, { interact: data.interact, spriteData: data, canvas: { style: {} }, clcks: 0 });
    return cookie;
  });
  env.gameObjects[0].handleClick();
  env.gameObjects[0].handleClick();
  assert.equal(events.at(-1).game.current, 1);
  control.isPaused = true;
  key({ code: 'Space', preventDefault() {} });
  env.gameObjects[1].handleClick();
  assert.equal(events.at(-1).game.current, 1);
  control.isPaused = false;
  key({ code: 'Space', preventDefault() {} });
  env.gameObjects.slice(2).forEach(cookie => cookie.handleClick());
  assert.equal(gate.isComplete(), true);
  assert.equal(events.at(-1).game.current, 5);
  assert.equal(await gate.onComplete(), 'saved');
  gate.destroy();
  assert.equal(key, null);
});

function snakeFixture() {
  const control = { isPaused: false, reportProgress() {} };
  const counter = {};
  const env = {
    gameControl: control, gameObjects: [],
    game: { environment: { toolchainSnakeGate: {
      challenge: { id: 'toolchain-trail' }, save: async () => 'saved', counter, errorMessage: {},
    } } },
  };
  const gate = new ToolchainTrailGate(env);
  const player = Object.create(SnakePlayer.prototype);
  Object.assign(player, {
    gameEnv: env, gate, segments: [{ x: 4, y: 6 }],
    direction: { x: 1, y: 0 }, nextDirection: { x: 1, y: 0 },
  });
  const apple = Object.create(SnakeApple.prototype);
  apple.cell = { x: 5, y: 6 };
  env.gameObjects = [player, apple];
  return { player, apple, gate, control, counter };
}

test('snake steers without reversing and ignores input while paused', () => {
  const { player, control } = snakeFixture();
  const key = keyCode => player.handleKeyDown({ keyCode, preventDefault() {} });
  key(65);
  assert.deepEqual(player.nextDirection, { x: 1, y: 0 });
  key(87);
  assert.deepEqual(player.nextDirection, { x: 0, y: -1 });
  control.isPaused = true;
  key(83);
  assert.deepEqual(player.nextDirection, { x: 0, y: -1 });
});

test('snake grows on apples and resets after hitting walls or its body', () => {
  const { player, apple, gate, counter } = snakeFixture();
  player.step();
  assert.equal(player.segments.length, 2);
  assert.equal(counter.textContent, 'Apples: 1 / 5');
  assert.equal(player.segments.some(segment => segment.x === apple.cell.x && segment.y === apple.cell.y), false);
  player.segments = [{ x: 19, y: 6 }, { x: 18, y: 6 }];
  player.step();
  assert.equal(player.segments.length, 1);
  assert.equal(gate.progress.current, 0);
  player.segments = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }];
  player.direction = player.nextDirection = { x: 0, y: 1 };
  player.step();
  assert.deepEqual(player.segments, [{ x: 4, y: 6 }]);
  assert.equal(counter.textContent, 'Apples: 0 / 5');
});

test('snake moves on elapsed time and does not catch up after pause', t => {
  const { player, control } = snakeFixture();
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  player.draw = () => {};
  player.resetAnimationClock();
  now = 219;
  player.update();
  assert.equal(player.segments[0].x, 4);
  now = 220;
  player.update();
  assert.equal(player.segments[0].x, 5);
  control.isPaused = true;
  now = 5000;
  player.update();
  assert.equal(player.segments[0].x, 5);
  player.resetAnimationClock();
  control.isPaused = false;
  player.update();
  assert.equal(player.segments[0].x, 5);
  now = 5220;
  player.update();
  assert.equal(player.segments[0].x, 6);
});

test('Toolchain gate retries a failed save before advancing to its game', async t => {
  const originalCreate = GameLevel.prototype.create;
  const originalDestroy = GameLevel.prototype.destroy;
  const previousDocument = globalThis.document;
  const previousFrame = globalThis.requestAnimationFrame;
  const previousError = console.error;
  const frames = [];
  globalThis.document = { addEventListener() {}, removeEventListener() {} };
  globalThis.requestAnimationFrame = callback => frames.push(callback);
  console.error = () => {};
  GameLevel.prototype.create = function (Level) {
    this.continue = true;
    this.gameEnv.innerWidth = 1600;
    this.gameEnv.innerHeight = 900;
    this.gameLevel = new Level(this.gameEnv);
  };
  GameLevel.prototype.destroy = function () { this.gameLevel.destroy?.(); };
  t.after(() => {
    GameLevel.prototype.create = originalCreate;
    GameLevel.prototype.destroy = originalDestroy;
    globalThis.document = previousDocument;
    globalThis.requestAnimationFrame = previousFrame;
    console.error = previousError;
  });

  let attempts = 0;
  const statuses = [];
  const session = {
    challenge: { id: 'toolchain-trail', gate: 'toolchain-snake' }, unlocked: false,
    counter: {}, error: {},
    onProgress: event => statuses.push(event.status),
    async save() {
      if (++attempts === 1) throw new Error('save failed');
      return { unlocked: ['toolchain-trail'] };
    },
  };
  configureOnboardingGame(session);
  class Game { constructor() { this.classes = []; } }
  const { GameControl, gameLevelClasses } = createOnboardingGame(Game, ToolchainTrailGate);
  const host = { path: '', environment: {}, gameContainer: null };
  const control = new GameControl(host, gameLevelClasses);
  control.transitionToLevel();
  const gate = control.currentLevel.gameLevel;
  const snake = Object.create(SnakePlayer.prototype);
  const apple = Object.create(SnakeApple.prototype);
  Object.assign(snake, {
    gameEnv: control.currentLevel.gameEnv, gate, segments: [{ x: 4, y: 6 }],
    direction: { x: 1, y: 0 }, nextDirection: { x: 1, y: 0 },
  });
  control.currentLevel.gameEnv.gameObjects = [snake, apple];
  for (let x = 5; x <= 9; x++) {
    apple.cell = { x, y: 6 };
    snake.step();
  }
  assert.equal(snake.segments.length, 6);
  assert.equal(session.counter.textContent, 'Apples: 5 / 5');
  control.currentLevel.gameEnv.gameObjects = [];
  frames.shift()();
  await new Promise(resolve => setImmediate(resolve));
  assert.match(session.error.textContent, /save failed/);
  assert.equal(control.currentLevelIndex, 0);
  control.retryLevelCompletion();
  await new Promise(resolve => setImmediate(resolve));
  frames.shift()();
  assert.equal(attempts, 2);
  assert.equal(control.currentLevelIndex, 1);
  assert.ok(control.currentLevel.gameLevel instanceof Game);
  assert.ok(statuses.includes('failed'));
  assert.ok(statuses.includes('completed'));
  control.destroy();
});
