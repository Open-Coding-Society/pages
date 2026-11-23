import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { CHALLENGES, viewerPath } from '../js/onboarding-data.js';
import { OnboardingStore } from '../js/onboarding-store.js';
import { FlaskProfile } from '../../profile/js/profile-backend.js';

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
  const profile = {
    signedInAccount: async () => user ? { uid: user } : null,
    gameProfile: async () => profiles.get(user) ?? null,
    updateGameProfile: async fields => {
      if (saveError) throw new Error(`HTTP ${saveError}`);
      const saved = { ...profiles.get(user), ...fields };
      profiles.set(user, saved);
      return saved;
    },
  };
  return {
    store: new OnboardingStore({ profile, storage }),
    signIn: uid => { user = uid; },
    failSave: status => { saveError = status; },
    profiles,
    storage,
  };
}

test('builders open directly while games use the viewer', () => {
  assert.equal(new Set(CHALLENGES.map(item => item.id)).size, 7);
  assert.equal(CHALLENGES.find(item => item.id === 'identity-forge').gate, 'identity-cookie');
  assert.equal(CHALLENGES.find(item => item.id === 'toolchain-trail').gate, 'toolchain-cookie');
  assert.equal(CHALLENGES.find(item => item.id === 'wayfinding-world').gate, undefined);
  assert.equal(viewerPath('ui-builder', '/pages'), '/pages/ui-builder/');
  assert.equal(viewerPath('game-workbench', '/pages'), '/pages/gamebuilder/v2/');
  assert.equal(viewerPath('identity-forge', '/pages'), '/pages/onboarding/view/?onboarding_view=1&challenge=identity-forge');
});

test('home redirects to onboarding while retaining the special host destination', () => {
  const source = readFileSync(new URL('../../../../index.md', import.meta.url), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replaceAll('{{ site.baseurl }}', '/pages')
    .replace("{{ '/onboarding/' | relative_url | jsonify }}", '"/pages/onboarding/"');
  for (const [hostname, expected] of [
    ['localhost', '/pages/onboarding/'],
    ['vanshikak210.github.io', '/pages/capstone/shoreline-volunteer/'],
  ]) {
    let destination;
    runInNewContext(script, { window: { location: { hostname, replace: url => { destination = url; } } } });
    assert.equal(destination, expected);
  }
});

test('cards use distinct available illustrations rather than game backgrounds', () => {
  assert.equal(new Set(CHALLENGES.map(item => item.image)).size, CHALLENGES.length);
  for (const challenge of CHALLENGES) {
    assert.doesNotMatch(challenge.image, /projects\/cs-pathway\/bg/);
    const path = challenge.image.startsWith('/images/projects/onboarding/')
      ? new URL(`../images/${challenge.image.split('/').pop()}`, import.meta.url)
      : new URL(`../../../../${challenge.image.slice(1)}`, import.meta.url);
    assert.ok(existsSync(path), `${challenge.title}: ${challenge.image}`);
  }
});

test('replay clears only the selected unlock and preserves identity and other unlocks', async () => {
  const env = setup();
  await env.store.unlock('identity-forge');
  await env.store.unlock('toolchain-trail');
  env.signIn('first');
  env.profiles.set('first', { game_profile: { avatar: 'existing' } });
  await env.store.read();
  assert.deepEqual((await env.store.reset('identity-forge')).unlocked, ['toolchain-trail']);
  assert.deepEqual(env.profiles.get('first').game_profile, { avatar: 'existing' });
  assert.equal(env.profiles.get('first')['onboarding_unlock_identity-forge'], false);
  env.signIn(null);
  await env.store.unlock('identity-forge');
  await env.store.unlock('toolchain-trail');
  assert.deepEqual((await env.store.reset('identity-forge')).unlocked, ['toolchain-trail']);
});

test('a failed account replay keeps the saved and guest unlocks', async () => {
  const env = setup();
  await env.store.unlock('identity-forge');
  env.signIn('first');
  env.failSave(500);
  await assert.rejects(env.store.reset('identity-forge'), /500/);
  assert.deepEqual(env.store.guestUnlocks(), ['identity-forge']);
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

test('an unreachable account service permits browser-only play and transfers later', async () => {
  const env = setup();
  const data = new Map();
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  };
  let offline = true;
  const flask = { request: async (path, options) => {
    if (offline) throw Object.assign(new Error('unreachable'), { status: 0, cause: new TypeError('Failed to fetch') });
    if (path === '/api/id') return { uid: 'first' };
    if (options?.method === 'PUT') {
      env.profiles.set('first', options.body._game_profile);
      return env.profiles.get('first');
    }
    return env.profiles.get('first') ?? null;
  } };
  const store = new OnboardingStore({ profile: new FlaskProfile({ flask }), storage });
  assert.deepEqual(await store.read(), { user: null, unlocked: [], offline: true });
  assert.deepEqual(await store.unlock('identity-forge'), { user: null, unlocked: ['identity-forge'], offline: true });
  await assert.rejects(store.reset('identity-forge'), /Reconnect/);
  offline = false;
  assert.deepEqual((await store.read()).unlocked, ['identity-forge']);
  assert.equal(env.profiles.get('first')['onboarding_unlock_identity-forge'], true);
  assert.deepEqual(store.guestUnlocks(), []);
});

test('account errors other than an unreachable service remain errors', async () => {
  const env = setup();
  const flask = { request: async () => { throw Object.assign(new Error('HTTP 500'), { status: 500 }); } };
  const store = new OnboardingStore({ profile: new FlaskProfile({ flask }), storage: env.storage });
  await assert.rejects(store.read(), /500/);
  await assert.rejects(store.unlock('identity-forge'), /500/);
  assert.deepEqual(store.guestUnlocks(), []);
});
