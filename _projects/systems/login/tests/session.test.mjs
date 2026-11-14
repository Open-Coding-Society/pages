import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FlaskSession, SpringSession, createSession } from '../js/session.js';
import { fakeBackend, refuse, unreachable } from './fake-backend.mjs';

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

// Spring can accept the password and still not keep the browser signed in (its cookie dropped),
// which the account read catches.
test('signIn reports Spring as refused when the Spring account read fails', async () => {
  const flask = fakeBackend({ 'POST /api/authenticate': { message: 'signed in' } });
  const spring = fakeBackend({ 'POST /authenticate': 'Authenticated', 'GET /api/person/get': refuse(401, null, 'GET', '/api/person/get') });
  const result = await new SpringSession({ flask, spring }).signIn('adalovelace', 'pw');
  assert.deepEqual(result, { flask: { message: 'signed in' }, spring: false });
});

test('sign-up and sign-in send the account and the credentials to both backends unchanged', async () => {
  const flask = fakeBackend({ 'POST /api/user': { uid: 'adalovelace' }, 'POST /api/authenticate': { message: 'signed in' } });
  const spring = fakeBackend({ 'POST /authenticate': 'Authenticated', 'GET /api/person/get': { id: 42 } });
  const session = new SpringSession({ flask, spring });
  const student = { ...account, accountType: 'student', idToken: 'google-id-token' };
  await (await session.signUp(student)).spring;
  await session.signIn('adalovelace', 'secret-Password-1');
  const sent = { name: 'Ada Lovelace', uid: 'adalovelace', password: 'secret-Password-1', accountType: 'student', idToken: 'google-id-token' };
  assert.deepEqual(flask.bodies['POST /api/user'], sent);
  assert.deepEqual(spring.bodies['POST /api/person/create'], sent);
  const credentials = { uid: 'adalovelace', password: 'secret-Password-1' };
  assert.deepEqual(flask.bodies['POST /api/authenticate'], credentials);
  assert.deepEqual(spring.bodies['POST /authenticate'], credentials);
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

// An expired Flask cookie makes DELETE /api/authenticate answer 401, and logout must still finish.
test('signOut still signs out of Spring when Flask refuses or is unreachable', async () => {
  for (const flaskAnswer of [refuse(401, null, 'DELETE', '/api/authenticate'), unreachable()]) {
    const spring = fakeBackend();
    await new SpringSession({ flask: fakeBackend({ 'DELETE /api/authenticate': flaskAnswer }), spring }).signOut();
    assert.deepEqual(spring.calls, ['POST /api/logout']);
  }
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

test('currentUser resolves null when Flask answers something other than a user', async () => {
  assert.equal(await new FlaskSession({ flask: fakeBackend({ 'GET /api/id': '<html>proxy page</html>' }) }).currentUser(), null);
  assert.equal(await new FlaskSession({ flask: fakeBackend({ 'GET /api/id': null }) }).currentUser(), null);
});
