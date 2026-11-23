import test from 'node:test';
import assert from 'node:assert/strict';
import '../../../../assets/js/GameEnginev1.1/test/register-assets.mjs';

const { configureOnboardingGame, createOnboardingGame } = await import('../js/onboarding-game.js');
const { default: IdentityForgeGate } = await import('../js/identity-forge-gate.js');
const { default: ToolchainTrailGate } = await import('../js/toolchain-trail-gate.js');
const { default: GameLevel } = await import('../../../../assets/js/GameEnginev1.1/essentials/GameLevel.js');

test('each game composes only its own gate and level, skipping a saved gate', () => {
  class Level {}
  class Gate {}
  const session = {
    challenge: { id: 'toolchain-trail', gate: 'toolchain-cookie' }, unlocked: false,
    counter: {}, cookieButton: {}, error: {}, onProgress() {}, save() {},
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

test('Toolchain gate supports Space and removes its keyboard listener', t => {
  const oldDocument = globalThis.document;
  let key;
  globalThis.document = {
    addEventListener(_type, listener) { key = listener; },
    removeEventListener(_type, listener) { assert.equal(listener, key); key = null; },
  };
  t.after(() => { globalThis.document = oldDocument; });
  let clicks = 0;
  const env = {
    path: '', innerWidth: 800, innerHeight: 450,
    gameControl: { isPaused: false },
    gameObjects: [{ spriteData: { id: 'toolchain-cookie' }, handleClick() { clicks++; } }],
    game: { environment: { toolchainCookieGate: {
      challenge: { id: 'toolchain-trail' }, store: {}, counter: {}, button: {}, errorMessage: {},
    } } },
  };
  const gate = new ToolchainTrailGate(env);
  gate.initialize();
  key({ code: 'Space', preventDefault() {} });
  assert.equal(clicks, 1);
  env.gameControl.isPaused = true;
  key({ code: 'Space', preventDefault() {} });
  assert.equal(clicks, 1);
  gate.destroy();
  assert.equal(key, null);
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
    if (this.gameLevel instanceof ToolchainTrailGate) {
      this.gameEnv.gameObjects = [{ handleClick: () => this.gameLevel.classes[0].data.interact() }];
    }
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
    challenge: { id: 'toolchain-trail', gate: 'toolchain-cookie' }, unlocked: false,
    counter: {}, cookieButton: {}, error: {},
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
  const cookie = control.currentLevel.gameEnv.gameObjects[0];
  for (let i = 0; i < 6; i++) cookie.handleClick();
  assert.equal(session.counter.textContent, 'Cookies: 5 / 5');
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
