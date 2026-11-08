import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BackendError } from '../js/backend.js';
import { FlaskSession, SpringSession, createSession } from '../js/session.js';

// A fake backend: `answers` maps "METHOD /path" to a value to resolve, or to a function that
// throws. Every request is recorded as "METHOD /path".
function fakeBackend(answers = {}) {
  const calls = [];
  return {
    calls,
    async request(path, { method = 'GET' } = {}) {
      const key = `${method} ${path}`;
      calls.push(key);
      const answer = answers[key];
      return typeof answer === 'function' ? answer() : answer ?? null;
    },
  };
}
const refuse = (status, body = null, method = 'POST', path = '/') => () => { throw new BackendError({ status, method, path, body }); };
const unreachable = () => () => { throw new BackendError({ status: 0, method: 'GET', path: '/', cause: new TypeError('Failed to fetch') }); };
const springMustNotBeCalled = { request: async (path) => { throw new Error(`Spring was called: ${path}`); } };
const account = { name: 'Ada Lovelace', uid: 'adalovelace', password: 'secret-Password-1' };

test('FlaskSession never calls Spring', async () => {
  const flask = fakeBackend({ 'POST /api/user': { uid: 'adalovelace' }, 'GET /api/id': { uid: 'adalovelace' } });
  const session = new FlaskSession({ flask, spring: springMustNotBeCalled });
  assert.equal(session.usesSpring, false);
  const created = await session.signUp(account);
  assert.equal(created.spring, null);
  await session.signIn('adalovelace', 'secret-Password-1');
  await session.signOut();
  assert.deepEqual(await session.currentUser(), { uid: 'adalovelace' });
  assert.deepEqual(flask.calls, ['POST /api/user', 'POST /api/authenticate', 'DELETE /api/authenticate', 'GET /api/id']);
});

test("signIn passes on Flask's answer, which the page needs for re-verification", async () => {
  const answer = { message: 'signed in', verification_required: true };
  const session = new FlaskSession({ flask: fakeBackend({ 'POST /api/authenticate': answer }) });
  assert.deepEqual(await session.signIn('adalovelace', 'pw'), { flask: answer });
});

test('signIn throws when Flask rejects', async () => {
  const flask = fakeBackend({ 'POST /api/authenticate': refuse(401) });
  const spring = fakeBackend();
  await assert.rejects(new SpringSession({ flask, spring }).signIn('adalovelace', 'wrong'), (error) => error.status === 401);
});

test('signIn reports a Spring-only failure', async () => {
  const flask = fakeBackend({ 'POST /api/authenticate': { message: 'signed in' } });
  const spring = fakeBackend({ 'POST /authenticate': refuse(401) });
  const result = await new SpringSession({ flask, spring }).signIn('adalovelace', 'pw');
  assert.deepEqual(result, { flask: { message: 'signed in' }, spring: false });
  assert.deepEqual(spring.calls, ['POST /authenticate']);
});

test('signIn signs in to Spring and reads the Spring account', async () => {
  const flask = fakeBackend({ 'POST /api/authenticate': { message: 'signed in' } });
  const spring = fakeBackend({ 'POST /authenticate': 'Authenticated', 'GET /api/person/get': { id: 42 } });
  assert.equal((await new SpringSession({ flask, spring }).signIn('adalovelace', 'pw')).spring, true);
  assert.deepEqual(spring.calls, ['POST /authenticate', 'GET /api/person/get']);
});

test("signUp rejects with Flask's own message, or names the status", async () => {
  const refused = new FlaskSession({ flask: fakeBackend({ 'POST /api/user': refuse(400, { message: 'User adalovelace already exists' }) }) });
  await assert.rejects(refused.signUp(account), { message: 'User adalovelace already exists' });
  const broken = new FlaskSession({ flask: fakeBackend({ 'POST /api/user': refuse(500, '<html>proxy error</html>') }) });
  await assert.rejects(broken.signUp(account), { message: 'Flask signup failed (500)' });
  const nonsense = new FlaskSession({ flask: fakeBackend({ 'POST /api/user': 'null-ish text' }) });
  await assert.rejects(nonsense.signUp(account), { message: 'Flask signup failed (200)' });
  const said = new FlaskSession({ flask: fakeBackend({ 'POST /api/user': { success: false, message: 'Closed' } }) });
  await assert.rejects(said.signUp(account), { message: 'Closed' });
});

test('signUp rejects with status 0 when Flask is unreachable', async () => {
  const session = new FlaskSession({ flask: fakeBackend({ 'POST /api/user': unreachable() }) });
  await assert.rejects(session.signUp(account), (error) => error.status === 0);
});

test('signUp keeps the Flask account when Spring fails, and says why', async () => {
  const flask = fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } });
  const taken = new SpringSession({ flask, spring: fakeBackend({ 'POST /api/person/create': refuse(409, { error: 'uid taken' }) }) });
  assert.deepEqual(await (await taken.signUp(account)).spring, { created: false, error: 'uid taken' });
  const plain = new SpringSession({ flask, spring: fakeBackend({ 'POST /api/person/create': refuse(500, 'oops') }) });
  assert.deepEqual(await (await plain.signUp(account)).spring, { created: false, error: 'HTTP 500' });
  const down = new SpringSession({ flask, spring: fakeBackend({ 'POST /api/person/create': unreachable() }) });
  assert.deepEqual(await (await down.signUp(account)).spring, { created: false, error: 'Spring server unreachable' });
});

test('signUp resolves after Flask, before Spring answers', async () => {
  let answerSpring;
  const spring = { request: () => new Promise((resolve) => { answerSpring = resolve; }) };
  const session = new SpringSession({ flask: fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } }), spring });
  const created = await session.signUp(account);
  assert.equal(created.flask, true);
  answerSpring({ id: 42 });
  assert.deepEqual(await created.spring, { created: true, error: '' });
});

test('signUp asks nothing of Spring when Flask refuses', async () => {
  const spring = fakeBackend();
  await assert.rejects(new SpringSession({ flask: fakeBackend({ 'POST /api/user': refuse(400, { message: 'no' }) }), spring }).signUp(account));
  assert.deepEqual(spring.calls, []);
});

test('signOut still signs out of Flask when Spring is down', async () => {
  const flask = fakeBackend();
  const spring = fakeBackend({ 'POST /api/logout': unreachable() });
  await new SpringSession({ flask, spring }).signOut();
  assert.deepEqual(flask.calls, ['DELETE /api/authenticate']);
  assert.deepEqual(spring.calls, ['POST /api/logout']);
});

test('currentUser resolves null when signed out or unreachable', async () => {
  assert.equal(await new FlaskSession({ flask: fakeBackend({ 'GET /api/id': refuse(401, null, 'GET', '/api/id') }) }).currentUser(), null);
  assert.equal(await new FlaskSession({ flask: fakeBackend({ 'GET /api/id': unreachable() }) }).currentUser(), null);
});

test('springSignedIn resolves false when Spring refuses, and rejects when it is unreachable', async () => {
  const flask = fakeBackend();
  assert.equal(await new SpringSession({ flask, spring: fakeBackend({ 'GET /api/person/get': { id: 42 } }) }).springSignedIn(), true);
  assert.equal(await new SpringSession({ flask, spring: fakeBackend({ 'GET /api/person/get': refuse(401) }) }).springSignedIn(), false);
  await assert.rejects(new SpringSession({ flask, spring: fakeBackend({ 'GET /api/person/get': unreachable() }) }).springSignedIn());
});

test('createSession picks the class from the spring backend', () => {
  const flask = fakeBackend();
  assert.ok(createSession({ flask, spring: null }) instanceof FlaskSession);
  assert.equal(createSession({ flask, spring: null }) instanceof SpringSession, false);
  assert.ok(createSession({ flask, spring: fakeBackend() }) instanceof SpringSession);
});

test('a guest gets no Spring account, even on a site with Spring', async () => {
  const flask = fakeBackend({ 'POST /api/user': { uid: 'guest1' } });
  const spring = fakeBackend();
  const session = new SpringSession({ flask, spring });
  assert.equal(session.createsSpringAccount({ accountType: 'student' }), true);
  assert.equal(session.createsSpringAccount({ accountType: 'guest' }), false);
  assert.equal(new FlaskSession({ flask }).createsSpringAccount({ accountType: 'student' }), false);
  const created = await session.signUp({ ...account, accountType: 'guest' });
  assert.equal(created.spring, null);
  assert.deepEqual(spring.calls, []);
});
