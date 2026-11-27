// What Messages (/dm) shows for calls, through CallEntry: a Call link for the open group or DM,
// and, when Spring says a call is live there, a line with a Join link, but only after
// GET /api/calls/{id} confirms it, so a faked frame shows nothing.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { CallEntry } from '../js/call-entry.js';
import { CONFIG, answer, readStrings, scriptedFetch } from './helpers.mjs';

const LIVE_GROUP = Object.freeze({ id: 5, state: 'LIVE', title: 'Team Turing', contextType: 'GROUP', contextKey: '12', purpose: 'meeting', participantCount: 3 });
const frame = (callId = 5, state = 'live', count = 3) => ({ type: 'call', callId, state, count });

function setUp(route = () => answer(200, LIVE_GROUP)) {
  const { document } = installFakeDom();
  const strings = readStrings();
  const scripted = scriptedFetch(CONFIG.javaURI, route);
  const entry = new CallEntry({ javaURI: CONFIG.javaURI, fetchOptions: CONFIG.fetchOptions, baseurl: '/pages', text: strings.text, fetch: scripted.fetch });
  const link = document.createElement('a');
  link.className = 'dm__action hidden';
  const notice = document.createElement('p');
  entry.attach({ link, notice });
  return { entry, link, notice, calls: scripted.calls, t: strings.text };
}

test('the Call link names the open group or DM, and nothing is asked of Spring', () => {
  const { entry, link, calls, t } = setUp();
  assert.equal(link.textContent, t.call);
  assert.equal(link.classList.contains('hidden'), true, 'hidden until a conversation opens');
  entry.open('group', 12);
  assert.equal(link.getAttribute('href'), '/pages/calls/?group=12');
  assert.equal(link.classList.contains('hidden'), false);
  entry.open('dm', 34);
  assert.equal(link.getAttribute('href'), '/pages/calls/?dm=34');
  assert.equal(calls.length, 0);
});

test('a live call, once Spring confirms it, shows how many are in it and a Join link', async () => {
  const { entry, notice, calls, t } = setUp();
  entry.open('group', 12);
  entry.frame('group', 12, frame());
  await settle();
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), ['GET /api/calls/5']);
  assert.ok(notice.textContent.startsWith('A call is on with 3 in it.'));
  const join = notice.querySelector('a');
  assert.equal(join.textContent, t.join);
  assert.equal(join.getAttribute('href'), '/pages/calls/?group=12');
});

test('fakedFrameShowsNothingUntilRestConfirms', async () => {
  for (const route of [
    () => answer(403, { reason: 'NOT_A_MEMBER' }),
    () => answer(404, { reason: 'CALL_NOT_FOUND' }),
    () => answer(200, { ...LIVE_GROUP, contextKey: '99' }), // another group's live call
    () => answer(200, { ...LIVE_GROUP, contextType: 'DM' }),
    () => answer(200, { ...LIVE_GROUP, state: 'IDLE', participantCount: 0 }),
    () => { throw new TypeError('Failed to fetch'); },
  ]) {
    const { entry, notice } = setUp(route);
    entry.open('group', 12);
    entry.frame('group', 12, frame());
    await settle();
    assert.equal(notice.textContent, '');
  }
});

test('a call that ends clears the line without asking Spring', async () => {
  const { entry, notice, calls } = setUp();
  entry.open('group', 12);
  entry.frame('group', 12, frame());
  await settle();
  entry.frame('group', 12, frame(5, 'idle', 0));
  await settle();
  assert.equal(notice.textContent, '');
  assert.equal(calls.length, 1);
});

test('a frame for a conversation that is no longer open shows nothing', async () => {
  let release;
  const { entry, notice } = setUp(() => new Promise((resolve) => { release = () => resolve(answer(200, LIVE_GROUP)); }));
  entry.open('group', 12);
  entry.frame('group', 12, frame());
  entry.open('dm', 34);
  release();
  await settle();
  assert.equal(notice.textContent, '');
});

test('opening another conversation clears the line', async () => {
  const { entry, notice } = setUp();
  entry.open('group', 12);
  entry.frame('group', 12, frame());
  await settle();
  entry.open('group', 13);
  assert.equal(notice.textContent, '');
});

test('a frame with a bad call id asks nothing', async () => {
  const { entry, notice, calls } = setUp();
  entry.open('group', 12);
  entry.frame('group', 12, frame('5'));
  entry.frame('group', 12, frame(0));
  await settle();
  assert.equal(calls.length, 0);
  assert.equal(notice.textContent, '');
});

test('before attach, every call is safe', () => {
  installFakeDom();
  const entry = new CallEntry({ javaURI: CONFIG.javaURI, fetchOptions: CONFIG.fetchOptions, text: readStrings().text });
  entry.open('group', 12);
  entry.frame('group', 12, frame());
  entry.close();
});
