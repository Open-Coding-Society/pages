import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import '../../../../assets/js/GameEnginev1.1/test/register-assets.mjs';

const { startIdentityCookieGate } = await import('../js/identity-cookie-gate-runner.js');
const { default: GameLevel } = await import('../../../../assets/js/GameEnginev1.1/essentials/GameLevel.js');

test('Identity Forge driver reads its base URL from the page container', () => {
  const root = { id: 'onboarding-identity-game', dataset: { baseurl: '/pages' } };
  const game = {};
  const started = [];
  const source = readFileSync(new URL('../js/identity-forge-driver.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '');
  runInNewContext(source, {
    pythonURI: '',
    fetchOptions: {},
    Backend: class {},
    FlaskProfile: class {},
    OnboardingStore: class {},
    GameLevelCsPath0Forge: class {},
    startFullPageLevel: options => {
      started.push(options);
      return game;
    },
    startIdentityCookieGate: () => assert.fail('The gate should not start outside an embedded gate session.'),
    document: {
      getElementById: () => root,
      querySelector: () => ({}),
    },
    location: { search: '' },
    window: { parent: null },
    URLSearchParams,
  });
  assert.equal(started.length, 1);
  assert.equal(started[0].containerId, root.id);
  assert.equal(started[0].path, '/pages');
});

test('Identity Forge cookie gate saves, retries failures, then ends through GameControl', async () => {
  const keys = new Map();
  const messages = [];
  const classes = new Set();
  const message = { textContent: '' };
  const retry = { hidden: true, addEventListener(_type, listener) { this.click = listener; } };
  const status = { hidden: true, querySelector: selector => selector.includes('message') ? message : retry };
  const host = {
    innerWidth: 700,
    innerHeight: 500,
    parent: { postMessage: value => messages.push(value) },
    location: { origin: 'https://site.test' },
    document: {
      body: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } },
      addEventListener: (type, handler) => keys.set(type, handler),
      removeEventListener: type => keys.delete(type),
    },
  };
  const parent = { pause() { this.isPaused = true; } };
  const game = { gameControl: parent };
  const progress = { user: null, unlocked: ['identity-forge'] };
  let attempts = 0;
  const store = { async unlock() {
    if (++attempts === 1) throw new Error('offline');
    return progress;
  } };
  let nested;
  class FakeControl {
    constructor(_game, levels, options) {
      nested = this;
      assert.equal(options.parentControl, parent);
      const level = new levels[0]({ game, innerWidth: 700, innerHeight: 500, path: '/pages' });
      const descriptors = new GameLevel(parent).expandDescriptor(level.classes[0]);
      this.currentLevel = { gameEnv: { gameObjects: descriptors.map(({ class: Clicker, data }) => {
        const cookie = Object.create(Clicker.prototype);
        Object.assign(cookie, { interact: data.interact, spriteData: data, canvas: { style: {} }, clcks: 0 });
        return cookie;
      }) } };
    }
    start() {}
    removeExitKeyListener() { this.removedExit = true; }
    endLevel() { this.ended = true; }
  }
  const oldError = console.error;
  console.error = () => {};
  try {
    startIdentityCookieGate(game, { status, store, host, Control: FakeControl });
    assert.equal(parent.isPaused, true);
    const cookies = nested.currentLevel.gameEnv.gameObjects;
    cookies[0].handleClick();
    cookies[0].handleClick();
    assert.match(message.textContent, /1 \/ 5/);
    nested.isPaused = true;
    cookies[1].handleClick();
    assert.match(message.textContent, /1 \/ 5/);
    nested.isPaused = false;
    keys.get('keydown')({ code: 'Space', preventDefault() {} });
    cookies.slice(2).forEach(cookie => cookie.handleClick());
    await new Promise(resolve => setImmediate(resolve));
    assert.match(message.textContent, /offline/);
    assert.equal(retry.hidden, false);
    assert.equal(nested.ended, undefined);
    await retry.click();
    assert.equal(nested.ended, true);
    assert.equal(nested.removedExit, true);
    assert.equal(status.hidden, true);
    assert.equal(classes.size, 0);
    assert.equal(keys.size, 0);
    assert.deepEqual(messages[0], { type: 'ocs-onboarding-gate-saved', progress });
  } finally {
    console.error = oldError;
  }
});
