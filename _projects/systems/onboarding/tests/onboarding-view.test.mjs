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
  let fail = false;
  let releaseRead;
  let waitForRead;
  class Store {
    async read() {
      const snapshot = { ...progress, unlocked: [...progress.unlocked] };
      if (waitForRead) await waitForRead;
      return snapshot;
    }
    async unlock(challenge) {
      if (fail) throw new Error('offline');
      progress.unlocked = [challenge];
      return progress;
    }
  }
  const source = readFileSync(new URL('../js/onboarding-view.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '');
  const location = { origin: 'https://site.test', search: `?challenge=${id}${viewerMode ? '&onboarding_view=1' : ''}` };
  const host = { addEventListener: (type, handler) => { listeners[type] = handler; }, setInterval() {} };
  runInNewContext(source, {
    document: { querySelector: () => root }, location, window: host, URL, URLSearchParams,
    pythonURI: '', fetchOptions: {}, Backend: class {}, FlaskProfile: class {}, OnboardingStore: Store,
    challengeById: () => ({ id, title: 'Challenge', description: 'Description', url: '/challenge/' }),
    console: { error() {} },
  });
  await new Promise(resolve => setImmediate(resolve));
  return {
    element, listeners, frameMessages,
    failSave: value => { fail = value; },
    delayRead: () => { waitForRead = new Promise(resolve => { releaseRead = resolve; }); },
    releaseRead: () => { waitForRead = null; releaseRead(); },
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

test('other challenges still switch from the separate gate to their game', async () => {
  const env = await viewer('toolchain-trail');
  const gate = env.element('[data-gate-frame]');
  assert.match(gate.src, /\/onboarding\/gate\//);
  await env.listeners.message({
    origin: 'https://site.test', source: gate.contentWindow,
    data: { type: 'ocs-onboarding-gate-complete' },
  });
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.match(env.element('[data-challenge-frame]').src, /\/challenge\//);
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
  env.failSave(true);
  await env.listeners.message({
    origin: 'https://site.test', source: env.element('[data-gate-frame]').contentWindow,
    data: { type: 'ocs-onboarding-gate-complete' },
  });
  assert.equal(env.element('[data-unlock-retry]').hidden, false);
  env.failSave(false);
  await env.element('[data-unlock-retry]').click();
  assert.match(env.element('[data-challenge-frame]').src, /\/challenge\//);
});
