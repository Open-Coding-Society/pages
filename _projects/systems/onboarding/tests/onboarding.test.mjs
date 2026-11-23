import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, viewerPath } from '../js/onboarding-data.js';
import { OnboardingStore } from '../js/onboarding-store.js';

function setup() {
  const data = new Map();
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  };
  let user = null;
  const profiles = new Map();
  let saveError = 0;
  const fetcher = async (url, options) => {
    const path = new URL(url).pathname;
    let status = 200;
    let body;
    if (path === '/api/id') {
      status = user ? 200 : 401;
      body = user && { uid: user };
    } else if (options.method === 'PUT') {
      status = saveError || 200;
      if (!saveError) {
        body = { ...profiles.get(user), ...JSON.parse(options.body)._game_profile };
        profiles.set(user, body);
      }
    } else {
      body = profiles.get(user);
      if (!body) status = 404;
    }
    return { status, ok: status >= 200 && status < 300, json: async () => body };
  };
  return {
    store: new OnboardingStore({ pythonURI: 'http://flask', fetchOptions: {}, storage, fetcher }),
    signIn: uid => { user = uid; },
    failSave: status => { saveError = status; },
    profiles,
    storage,
  };
}

test('cards have distinct viewer routes and UI Builder is external', () => {
  assert.equal(new Set(CHALLENGES.map(item => item.id)).size, 7);
  assert.equal(CHALLENGES.find(item => item.id === 'ui-builder').external, true);
  assert.equal(viewerPath('identity-forge', '/pages'), '/pages/onboarding/view/?onboarding_view=1&challenge=identity-forge');
});

test('guest unlock transfers once without replacing saved identity; other accounts remain separate', async () => {
  const env = setup();
  await env.store.unlock('identity-forge');
  assert.deepEqual((await env.store.read()).unlocked, ['identity-forge']);
  env.signIn('first');
  env.profiles.set('first', { game_profile: { avatar: 'existing' } });
  assert.deepEqual((await env.store.read()).unlocked, ['identity-forge']);
  assert.deepEqual(env.profiles.get('first').game_profile, { avatar: 'existing' });
  env.signIn('second');
  assert.deepEqual((await env.store.read()).unlocked, []);
  await env.store.unlock('toolchain-trail');
  assert.deepEqual((await env.store.read()).unlocked, ['toolchain-trail']);
  env.signIn('first');
  assert.deepEqual((await env.store.read()).unlocked, ['identity-forge']);
});

test('a failed transfer keeps guest progress for a retry', async () => {
  const env = setup();
  await env.store.unlock('identity-forge');
  env.signIn('first');
  env.failSave(500);
  await assert.rejects(env.store.read(), /HTTP 500/);
  assert.deepEqual(env.store.guestUnlocks(), ['identity-forge']);
  env.failSave(0);
  assert.deepEqual((await env.store.read()).unlocked, ['identity-forge']);
  assert.deepEqual(env.store.guestUnlocks(), []);
});

test('unknown challenges and malformed guest progress are rejected', async () => {
  const env = setup();
  await assert.rejects(env.store.unlock('unknown'), /Unknown challenge/);
  env.storage.setItem('ocs-onboarding-guest-unlocks', JSON.stringify({ bad: true }));
  await assert.rejects(env.store.read(), /invalid/);
});
