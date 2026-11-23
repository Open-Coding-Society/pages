import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

async function viewer(id, { offline = false, viewerMode = true } = {}) {
  const elements = new Map();
  const frameMessages = [];
  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        hidden: false,
        disabled: false,
        textContent: '',
        classList: { add() {}, remove() {}, toggle() {} },
        setAttribute() {},
        removeAttribute(name) { delete this[name]; },
        addEventListener(type, handler) { this[type] = handler; },
        contentWindow: { postMessage: message => frameMessages.push(message) },
      });
    }
    return elements.get(selector);
  }
  const root = { dataset: { baseurl: '' }, querySelector: element };
  const listeners = {};
  const progress = { user: null, unlocked: [], ...(offline ? { offline: true } : {}) };
  let progressReads = 0;
  let releaseRead;
  let waitForRead;
  let releaseReset;
  let waitForReset;
  class Store {
    async read() {
      progressReads++;
      const snapshot = { ...progress, unlocked: [...progress.unlocked] };
      if (waitForRead) await waitForRead;
      return snapshot;
    }
    async reset() {
      if (waitForReset) await waitForReset;
      return { ...progress, unlocked: [] };
    }
  }
  const source = readFileSync(new URL('../js/onboarding-view.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '');
  const location = { origin: 'https://site.test', search: `?challenge=${id}${viewerMode ? '&onboarding_view=1' : ''}` };
  const host = { addEventListener: (type, handler) => { listeners[type] = handler; }, setInterval() {}, confirm: () => true };
  runInNewContext(source, {
    document: { querySelector: () => root }, location, window: host, URL, URLSearchParams,
    pythonURI: '', fetchOptions: {}, Backend: class {}, FlaskProfile: class {}, OnboardingStore: Store,
    challengeById: () => ({
      id,
      title: 'Challenge',
      description: 'Description',
      url: '/challenge/',
      ...(id === 'identity-forge' ? { gate: 'identity-cookie' } : {}),
      ...(id === 'toolchain-trail' ? { gate: 'toolchain-cookie' } : {}),
    }),
    console: { error() {} },
  });
  await new Promise(resolve => setImmediate(resolve));
  return {
    element, listeners, frameMessages,
    get progressReads() { return progressReads; },
    delayRead: () => { waitForRead = new Promise(resolve => { releaseRead = resolve; }); },
    releaseRead: () => { waitForRead = null; releaseRead(); },
    delayReset: () => { waitForReset = new Promise(resolve => { releaseReset = resolve; }); },
    releaseReset: () => { waitForReset = null; releaseReset(); },
  };
}

test('offline progress starts the game and explains browser-only storage', async () => {
  const env = await viewer('identity-forge', { offline: true });
  assert.match(env.element('[data-challenge-frame]').src, /onboarding_gate=1/);
  assert.match(env.element('[data-challenge-status]').textContent, /Playing offline/);
  assert.equal(env.element('[data-game-reset]').disabled, true);
  assert.equal(env.element('[data-standalone-back]').hidden, true);
  const standalone = await viewer('identity-forge', { viewerMode: false });
  assert.equal(standalone.element('[data-standalone-back]').hidden, false);
});

test('Identity Forge keeps the game frame when the nested level saves', async () => {
  const env = await viewer('identity-forge');
  const frame = env.element('[data-challenge-frame]');
  assert.match(frame.src, /onboarding_gate=1/);
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.equal(env.element('[data-challenge-open]').hidden, true);
  const originalSrc = frame.src;
  await env.listeners.message({
    origin: 'https://site.test', source: frame.contentWindow,
    data: { type: 'ocs-onboarding-gate-saved', progress: { user: null, unlocked: ['identity-forge'] } },
  });
  assert.equal(frame.src, originalSrc);
  assert.equal(env.element('[data-challenge-open]').hidden, false);
  assert.equal(env.frameMessages.length, 0);
});

test('Toolchain Trail switches from its cookie gate to the game', async () => {
  const env = await viewer('toolchain-trail');
  const gate = env.element('[data-gate-frame]');
  assert.match(gate.src, /\/onboarding\/gate\//);
  assert.match(gate.src, /challenge=toolchain-trail/);
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'toolchain-cookie-gate', challengeId: 'toolchain-trail' }, status: 'completed', result: { user: null, unlocked: ['toolchain-trail'] } },
  });
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.match(env.element('[data-challenge-frame]').src, /\/challenge\//);
});

test('ungated challenges open directly without showing cookie unlock controls', async () => {
  const env = await viewer('wayfinding-world');
  assert.match(env.element('[data-challenge-frame]').src, /\/challenge\//);
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.equal(env.element('[data-challenge]').hidden, false);
  assert.equal(env.element('[data-challenge-open]').hidden, false);
  assert.equal(env.element('[data-game-reset]').hidden, true);
  assert.equal(env.progressReads, 0);
});

test('a stale progress refresh does not undo a completed nested level', async () => {
  const env = await viewer('identity-forge');
  env.delayRead();
  const refresh = env.listeners.focus();
  await env.listeners.message({
    origin: 'https://site.test', source: env.element('[data-challenge-frame]').contentWindow,
    data: { type: 'ocs-onboarding-gate-saved', progress: { user: null, unlocked: ['identity-forge'] } },
  });
  assert.equal(env.frameMessages.length, 0);
  env.releaseRead();
  await refresh;
  assert.equal(env.element('[data-challenge-open]').hidden, false);
  assert.match(env.element('[data-challenge-status]').textContent, /Unlocked/);
});

test('the separate gate can retry a failed save', async () => {
  const env = await viewer('toolchain-trail');
  const gate = env.element('[data-gate-frame]');
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'other', challengeId: 'wayfinding-world' }, status: 'completing' },
  });
  assert.equal(env.frameMessages.length, 0);
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'toolchain-cookie-gate', challengeId: 'toolchain-trail' }, status: 'completing' },
  });
  assert.match(env.element('[data-challenge-status]').textContent, /Saving/);
  assert.equal(env.frameMessages.at(-1).action, 'allow');
  assert.equal(env.frameMessages.at(-1).gameId, 'toolchain-cookie-gate');
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'toolchain-cookie-gate', challengeId: 'toolchain-trail' }, status: 'failed', error: 'offline' },
  });
  assert.equal(env.element('[data-unlock-retry]').hidden, false);
  await env.element('[data-unlock-retry]').click();
  assert.equal(env.frameMessages.at(-1).type, 'ocs-game-completion-control');
  assert.equal(env.frameMessages.at(-1).action, 'retry');
  assert.equal(env.frameMessages.at(-1).gameId, 'toolchain-cookie-gate');
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'toolchain-cookie-gate', challengeId: 'toolchain-trail' }, status: 'completed', result: { user: null, unlocked: ['toolchain-trail'] } },
  });
  assert.match(env.element('[data-challenge-frame]').src, /\/challenge\//);
});

test('a gate save waits for an in-flight replay and is discarded when replay succeeds', async () => {
  const env = await viewer('toolchain-trail');
  env.delayReset();
  const reset = env.element('[data-game-reset]').click();
  const gate = env.element('[data-gate-frame]');
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-game-progress', game: { id: 'toolchain-cookie-gate', challengeId: 'toolchain-trail' }, status: 'completing' },
  });
  assert.equal(env.frameMessages.length, 0);
  env.releaseReset();
  await reset;
  assert.equal(env.frameMessages.length, 0);
  assert.match(gate.src, /\/onboarding\/gate\//);
});
