// The whole call page on the Messages system's fake DOM, with a fake LiveKit and a scripted
// Spring: what it shows for each answer, the lobby, the call, the moderator's tools, and that
// leaving the page takes back everything it started.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { CallPage } from '../js/call-page.js';
import { DisconnectReason, createFakeLiveKit, mediaError } from './fake-livekit.mjs';
import { CONFIG, answer, readStrings, scriptedFetch } from './helpers.mjs';

const ROOM = Object.freeze({ id: 7, state: 'IDLE', title: 'Team Turing', contextType: 'GROUP', contextKey: '12', purpose: 'meeting', participantCount: 0 });
const TOKEN = Object.freeze({ url: 'ws://localhost:7880', token: 'jwt', expiresIn: 600, canModerate: false });
const TEACHER = '{"roles":["ROLE_STUDENT","ROLE_TEACHER"]}';

// Each answer in a list is used once, then the last one repeats.
function spring(overrides = {}) {
  const queues = Object.fromEntries(Object.entries(overrides).map(([key, value]) => [key, [].concat(value)]));
  return (method, path) => {
    const key = `${method} ${path}`;
    if (queues[key]) {
      const queue = queues[key];
      const next = queue.length > 1 ? queue.shift() : queue[0];
      return typeof next === 'function' ? next() : next;
    }
    if (key === 'POST /api/calls') return answer(200, ROOM);
    if (key === 'POST /api/calls/7/token') return answer(200, TOKEN);
    if (method === 'POST' && path.startsWith('/api/calls/7/')) return answer(204);
    return answer(404, { reason: 'CALL_NOT_FOUND' });
  };
}

function fakeEmbed() {
  const mounts = [];
  const mount = (kind) => async (element, options) => {
    const handle = { kind, element, options, destroyed: false, state: 'ready' };
    handle.destroy = () => { handle.destroyed = true; };
    mounts.push(handle);
    return handle;
  };
  return { mountGroupChat: mount('group'), mountConversation: mount('dm'), mounts };
}

function manualTimers() {
  const pending = new Map();
  let next = 0;
  return {
    set: (fn, ms) => { next += 1; pending.set(next, { fn, ms }); return next; },
    clear: (id) => { pending.delete(id); },
    pending,
    async runAll() {
      const due = [...pending.entries()];
      pending.clear();
      due.forEach(([, { fn }]) => fn());
      await settle();
    },
  };
}

async function open({
  search = '?group=12', springEnabled = true, failures, holdDevices = false, routes = spring(), canShare = true, embed = fakeEmbed(), strings = readStrings(),
} = {}) {
  const { document } = installFakeDom();
  const livekit = createFakeLiveKit({ failures, holdDevices });
  const root = document.createElement('div');
  document.body.appendChild(root);
  const scripted = scriptedFetch(CONFIG.javaURI, routes);
  const timers = manualTimers();
  let loads = 0;
  const page = new CallPage({
    root,
    strings,
    config: { ...CONFIG, springEnabled },
    richText: { renderRichMessage() {}, createRichComposer() {} },
    embed,
    search,
    navigator: canShare ? { mediaDevices: { getDisplayMedia() {} } } : { mediaDevices: {} },
    loadLiveKit: async () => { loads += 1; return livekit; },
    fetch: scripted.fetch,
    timers,
  });
  // CallPage.start is `new` and then begin(); a test with held devices needs the page while
  // begin() still waits for them.
  const begun = page.begin();
  if (!holdDevices) await begun;
  await settle();
  return { page, begun, root, livekit, calls: scripted.calls, loads: () => loads, embed, timers, t: strings.text, strings };
}

const hook = (root, name) => root.querySelector(`[data-call="${name}"]`);
const lkRoom = (env) => env.livekit.lk.rooms.at(-1);

async function click(element) {
  assert.ok(element, 'the button is on the page');
  element.click();
  await settle();
}

async function joinCall(options = {}) {
  const env = await open(options);
  await click(hook(env.root, 'join'));
  return env;
}

const cells = (root) => root.querySelectorAll('.ocs__grid-cell');
const cellOf = (root, identity) => root.querySelector(`[data-identity="${identity}"]`);
const pills = (element) => element.querySelectorAll('.ocs__status-pill').map((pill) => pill.textContent);
const callouts = (root) => root.querySelectorAll('.ocs__callout').map((callout) => callout.textContent);

test('a Flask-only site sends nothing to Spring and says calls are off', async () => {
  const env = await open({ springEnabled: false });
  assert.equal(env.page.state, 'unavailable');
  assert.equal(env.calls.length, 0);
  assert.equal(env.loads(), 0);
  assert.deepEqual(callouts(env.root), [env.t.turned_off]);
});

test('a link to no group or DM says where calls start', async () => {
  const env = await open({ search: '' });
  assert.equal(env.page.state, 'no-room');
  assert.equal(env.calls.length, 0);
  assert.equal(env.root.querySelector('a.ocs__btn').getAttribute('href'), '/dm');
});

test('signed out shows the sign-in link and never loads LiveKit', async () => {
  const env = await open({ routes: spring({ 'POST /api/calls': answer(401, { reason: 'unauthorized' }) }) });
  assert.equal(env.page.state, 'signed-out');
  assert.equal(env.root.querySelector('a.ocs__btn').getAttribute('href'), '/login');
  assert.equal(env.loads(), 0);
});

test('Spring with calls off reads as unavailable', async () => {
  const env = await open({ routes: spring({ 'POST /api/calls': answer(404, { reason: 'calls_disabled' }) }) });
  assert.equal(env.page.state, 'unavailable');
  assert.ok(callouts(env.root).includes(env.t.unavailable));
});

test('someone outside the group is told only members can join', async () => {
  const env = await open({ routes: spring({ 'POST /api/calls': answer(403, { reason: 'NOT_A_MEMBER' }) }) });
  assert.equal(env.page.state, 'refused');
  assert.ok(callouts(env.root).includes(env.t.not_a_member));
});

test('the lobby opens the group\'s room, names it and previews the camera', async () => {
  const env = await open({ search: '?group=12&purpose=standup' });
  assert.equal(env.page.state, 'lobby');
  assert.deepEqual(env.calls[0].body, { contextType: 'GROUP', contextKey: '12', purpose: 'standup' });
  assert.equal(env.root.querySelector('h1').textContent, 'Team Turing');
  const preview = env.root.querySelector('video');
  assert.ok(preview.classList.contains('ocs__embed--video'));
  assert.equal(preview.srcObject, env.livekit.lk.previews.find((track) => track.kind === 'video'));
  assert.equal(preview.getAttribute('playsinline'), '');
  assert.equal(hook(env.root, 'join').textContent, env.t.join);
});

test('turning the camera off in the lobby stops it and says so', async () => {
  const env = await open();
  const video = env.livekit.lk.previews.find((track) => track.kind === 'video');
  await click(hook(env.root, 'lobby-camera'));
  assert.equal(video.stopped, true);
  assert.equal(env.root.querySelector('video'), null);
  assert.equal(env.root.querySelector('abbr.ocs__avatar').getAttribute('title'), env.t.camera_off);
  assert.equal(hook(env.root, 'lobby-camera').getAttribute('aria-pressed'), 'false');
  await click(hook(env.root, 'lobby-camera'));
  assert.ok(env.root.querySelector('video'), 'and comes back on');
  assert.equal(hook(env.root, 'lobby-camera').getAttribute('aria-pressed'), 'true');
});

test('deniedCameraStillJoinsListenOnly', async () => {
  const denied = mediaError('NotAllowedError');
  const env = await joinCall({ failures: { camera: denied, microphone: denied } });
  assert.equal(env.page.state, 'ready');
  assert.deepEqual(lkRoom(env).localParticipant.published, []);
  assert.equal(hook(env.root, 'mic').getAttribute('aria-pressed'), 'false');
});

test('the lobby says when there is no camera or microphone', async () => {
  const denied = mediaError('NotFoundError');
  const env = await open({ failures: { camera: denied, microphone: denied } });
  assert.ok(env.root.textContent.includes(env.t.lobby_no_devices));
});

const roomWith = (participantCount) => answer(200, { ...ROOM, state: 'LIVE', participantCount });
const tokenAsks = (env) => env.calls.filter((c) => c.path === '/api/calls/7/token').length;

test('waitingRetriesUntilAllowed', async () => {
  const env = await open({
    routes: spring({
      'POST /api/calls/7/token': [answer(403, { reason: 'WAITING_FOR_SUPERVISOR' }), answer(200, TOKEN)],
      'GET /api/calls/7': [roomWith(1), roomWith(2)], // a teacher arrives
    }),
  });
  await click(hook(env.root, 'join'));
  assert.equal(env.page.state, 'waiting');
  assert.ok(env.root.textContent.includes(env.t.waiting_supervisor));
  assert.ok(env.root.querySelector('video'), 'the preview stays while waiting');
  assert.equal([...env.timers.pending.values()][0].ms, env.strings.wait_retry_seconds * 1000);
  await env.timers.runAll();
  assert.equal(env.page.state, 'ready');
  assert.equal(tokenAsks(env), 2);
});

// Every refused token is a red "403" line in the browser's console, so while nobody comes or
// goes the lobby looks at the room (a 200) instead of asking for a token again.
test('while nobody comes or goes, waiting asks Spring for the room, not for another token', async () => {
  const env = await open({
    routes: spring({ 'POST /api/calls/7/token': answer(403, { reason: 'WAITING_FOR_SUPERVISOR' }), 'GET /api/calls/7': roomWith(1) }),
  });
  await click(hook(env.root, 'join'));
  for (let look = 1; look < env.strings.wait_looks_per_try; look += 1) {
    await env.timers.runAll();
    assert.equal(tokenAsks(env), 1, `look ${look}`);
    assert.equal(env.page.state, 'waiting');
  }
  await env.timers.runAll();
  assert.equal(tokenAsks(env), 2, 'it asks again anyway after wait_looks_per_try looks');
});

test('waiting asks for a token again when Spring can\'t say who is in', async () => {
  const env = await open({
    routes: spring({
      'POST /api/calls/7/token': [answer(403, { reason: 'WAITING_FOR_SUPERVISOR' }), answer(200, TOKEN)],
      'GET /api/calls/7': answer(503, { reason: 'CALLS_UNAVAILABLE' }),
    }),
  });
  await click(hook(env.root, 'join'));
  await env.timers.runAll();
  assert.equal(env.page.state, 'ready');
});

test('someone removed from the call can\'t come back in', async () => {
  const env = await open({ routes: spring({ 'POST /api/calls/7/token': answer(403, { reason: 'REMOVED' }) }) });
  await click(hook(env.root, 'join'));
  assert.equal(env.page.state, 'refused');
  assert.ok(callouts(env.root).includes(env.t.removed));
  assert.ok(env.livekit.lk.previews.every((track) => track.stopped));
});

test('a 503 for the token says try again, and Join works again', async () => {
  const env = await open({
    routes: spring({ 'POST /api/calls/7/token': [answer(503, { reason: 'MEDIA_UNAVAILABLE' }, { 'Retry-After': '30' }), answer(200, TOKEN)] }),
  });
  await click(hook(env.root, 'join'));
  assert.equal(env.page.state, 'lobby');
  assert.ok(env.root.textContent.includes(env.t.unavailable));
  assert.equal(hook(env.root, 'join').disabled, false);
  await click(hook(env.root, 'join'));
  assert.equal(env.page.state, 'ready');
});

test('in the call, each person has a cell; you come last', async () => {
  const env = await joinCall();
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada Lovelace', metadata: TEACHER });
  await settle();
  const all = cells(env.root);
  assert.equal(all.length, 2);
  assert.equal(all[0].dataset.identity, 'ada-id');
  assert.equal(all[1].dataset.identity, 'me-id');
  const video = cellOf(env.root, 'ada-id').querySelector('video');
  assert.equal(video.srcObject, lkRoom(env).remoteParticipants.get('ada-id').getTrackPublication('camera').track);
  assert.ok(pills(cellOf(env.root, 'ada-id')).includes('Teacher'));
  assert.ok(env.root.textContent.includes(env.t.you));
  assert.equal(hook(env.root, 'status').textContent, '2 in the call');
});

test('a person without a camera shows initials, and leaving takes their cell', async () => {
  const env = await joinCall();
  lkRoom(env).join({ identity: 'bo-id', name: 'Bo Diddley', camera: false });
  await settle();
  const avatar = cellOf(env.root, 'bo-id').querySelector('abbr');
  assert.equal(avatar.textContent, 'BD');
  assert.equal(avatar.getAttribute('title'), 'Bo Diddley');
  lkRoom(env).leave('bo-id');
  await settle();
  assert.equal(cellOf(env.root, 'bo-id'), null);
});

test('a cell keeps its video element while people come and go', async () => {
  const env = await joinCall();
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  const first = cellOf(env.root, 'ada-id').querySelector('video');
  lkRoom(env).join({ identity: 'cy-id', name: 'Cy' });
  lkRoom(env).speak(['cy-id']);
  await settle();
  assert.equal(cellOf(env.root, 'ada-id').querySelector('video'), first);
});

test('speaking and muted show as words', async () => {
  const env = await joinCall();
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada', microphone: false });
  lkRoom(env).speak(['me-id']);
  await settle();
  assert.ok(pills(cellOf(env.root, 'me-id')).includes(env.t.speaking));
  assert.ok(pills(cellOf(env.root, 'ada-id')).includes(env.t.muted));
});

test('the mic button keeps its label and reports its state', async () => {
  const env = await joinCall();
  const mic = hook(env.root, 'mic');
  assert.equal(mic.getAttribute('aria-pressed'), 'true');
  assert.equal(mic.textContent, env.t.mic);
  await click(mic);
  assert.equal(hook(env.root, 'mic').getAttribute('aria-pressed'), 'false');
  assert.equal(hook(env.root, 'mic').textContent, env.t.mic);
  assert.equal(lkRoom(env).localParticipant.isMicrophoneEnabled, false);
  await click(hook(env.root, 'camera'));
  assert.equal(hook(env.root, 'camera').getAttribute('aria-pressed'), 'false');
  assert.equal(lkRoom(env).localParticipant.isCameraEnabled, false);
});

test('noDisplayMediaHidesShare', async () => {
  const env = await joinCall({ canShare: false });
  assert.equal(hook(env.root, 'share'), null);
  const withShare = await joinCall();
  assert.ok(hook(withShare.root, 'share'));
});

test('a shared screen shows above the cells with whose it is', async () => {
  const env = await joinCall();
  const ada = lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  lkRoom(env).subscribe('ada-id', 'screen_share');
  await settle();
  const screen = hook(env.root, 'screens').querySelector('video');
  assert.equal(screen.srcObject, ada.getTrackPublication('screen_share').track);
  assert.ok(hook(env.root, 'screens').textContent.includes('Ada’s screen'));
});

test('sharing your screen and stopping', async () => {
  const env = await joinCall();
  await click(hook(env.root, 'share'));
  assert.equal(hook(env.root, 'share').getAttribute('aria-pressed'), 'true');
  assert.equal(hook(env.root, 'share').textContent, env.t.share);
  await click(hook(env.root, 'share'));
  assert.equal(hook(env.root, 'share').getAttribute('aria-pressed'), 'false');
});

test('a refused screen share says so', async () => {
  const env = await joinCall({ failures: { screen: mediaError('NotAllowedError') } });
  await click(hook(env.root, 'share'));
  assert.ok(callouts(env.root).includes(env.t.share_failed));
});

test('paused by the safety rules: a notice, and the buttons wait', async () => {
  const env = await joinCall();
  lkRoom(env).pauseSelf(true);
  await settle();
  assert.ok(callouts(env.root).includes(env.t.paused_notice));
  assert.equal(hook(env.root, 'mic').disabled, true);
  lkRoom(env).pauseSelf(false);
  await settle();
  assert.ok(!callouts(env.root).includes(env.t.paused_notice));
  assert.equal(hook(env.root, 'mic').disabled, false);
});

test('sound the browser holds back gets a button', async () => {
  const env = await joinCall();
  lkRoom(env).blockAudio();
  await settle();
  await click(hook(env.root, 'start-audio'));
  assert.equal(lkRoom(env).audioStarts, 1);
  assert.equal(hook(env.root, 'start-audio'), null);
});

test('removed during the call: a notice and no way back in', async () => {
  const env = await joinCall();
  lkRoom(env).end(DisconnectReason.PARTICIPANT_REMOVED);
  await settle();
  assert.equal(env.page.state, 'ended');
  assert.ok(callouts(env.root).includes(env.t.removed));
  assert.equal(hook(env.root, 'rejoin'), null);
});

test('a call that drops offers Rejoin; one a teacher ends does not', async () => {
  const lost = await joinCall();
  lkRoom(lost).end(DisconnectReason.UNKNOWN_REASON);
  await settle();
  assert.ok(callouts(lost.root).includes(lost.t.disconnected));
  assert.ok(hook(lost.root, 'rejoin'));
  const ended = await joinCall();
  lkRoom(ended).end(DisconnectReason.ROOM_DELETED);
  await settle();
  assert.ok(callouts(ended.root).includes(ended.t.ended));
  assert.equal(hook(ended.root, 'rejoin'), null);
});

test('Leave ends your part of the call', async () => {
  const env = await joinCall();
  await click(hook(env.root, 'leave'));
  assert.equal(env.page.state, 'ended');
  assert.ok(callouts(env.root).includes(env.t.left));
  assert.ok(hook(env.root, 'rejoin'));
});

test('only moderators get Pause, Remove and End', async () => {
  const student = await joinCall();
  lkRoom(student).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  assert.equal(hook(student.root, 'end'), null);
  assert.equal(student.root.querySelector('[data-action="remove"]'), null);

  const teacher = await joinCall({ routes: spring({ 'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }) }) });
  lkRoom(teacher).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  assert.ok(hook(teacher.root, 'end'));
  assert.ok(teacher.root.querySelector('[data-action="pause"][data-identity="ada-id"]'));
  assert.equal(teacher.root.querySelector('[data-action="pause"][data-identity="me-id"]'), null, 'no tools on yourself');
});

test('Pause asks Spring; a paused person gets Resume', async () => {
  const env = await joinCall({ routes: spring({ 'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }) }) });
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  await click(env.root.querySelector('[data-action="pause"][data-identity="ada-id"]'));
  assert.ok(env.calls.some((c) => c.method === 'POST' && c.path === '/api/calls/7/participants/ada-id/pause'));
  const ada = lkRoom(env).remoteParticipants.get('ada-id');
  ada.permissions = { canPublish: false, canSubscribe: false, canPublishData: false };
  lkRoom(env).emit('participantPermissionsChanged', {}, ada);
  await settle();
  assert.ok(env.root.querySelector('[data-action="resume"][data-identity="ada-id"]'));
  assert.ok(pills(cellOf(env.root, 'ada-id')).includes(env.t.paused));
});

test('a refused Resume says why', async () => {
  const env = await joinCall({
    routes: spring({
      'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }),
      'POST /api/calls/7/participants/ada-id/resume': answer(409, { reason: 'WAITING_FOR_SUPERVISOR' }),
    }),
  });
  const ada = lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  ada.permissions = { canPublish: false, canSubscribe: false, canPublishData: false };
  lkRoom(env).emit('participantPermissionsChanged', {}, ada);
  await settle();
  await click(env.root.querySelector('[data-action="resume"][data-identity="ada-id"]'));
  assert.ok(callouts(env.root).includes(env.t.stays_paused), 'the teacher hears that Ada stays paused, not that they wait');
});

test('Remove asks first, and Cancel sends nothing', async () => {
  const env = await joinCall({ routes: spring({ 'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }) }) });
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  await click(env.root.querySelector('[data-action="remove"][data-identity="ada-id"]'));
  const dialog = env.root.querySelector('[role="dialog"]');
  assert.ok(dialog.textContent.includes('Remove Ada?'));
  await click(hook(env.root, 'cancel'));
  assert.equal(env.root.querySelector('[role="dialog"]'), null);
  assert.ok(!env.calls.some((c) => c.path.endsWith('/remove')));

  await click(env.root.querySelector('[data-action="remove"][data-identity="ada-id"]'));
  await click(hook(env.root, 'confirm'));
  assert.ok(env.calls.some((c) => c.method === 'POST' && c.path === '/api/calls/7/participants/ada-id/remove'));
});

test('End for everyone asks first, then ends the room', async () => {
  const env = await joinCall({ routes: spring({ 'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }) }) });
  await click(hook(env.root, 'end'));
  assert.ok(env.root.querySelector('[role="dialog"]').textContent.includes(env.t.end_title));
  await click(hook(env.root, 'confirm'));
  assert.ok(env.calls.some((c) => c.method === 'POST' && c.path === '/api/calls/7/end'));
});

test('a group call has the group\'s chat beside it', async () => {
  const env = await open();
  const [chat] = env.embed.mounts;
  assert.equal(chat.kind, 'group');
  assert.equal(chat.options.groupId, 12);
  assert.equal(chat.options.heading, '');
  assert.equal(chat.options.config.javaURI, CONFIG.javaURI);
});

test('a DM call has the conversation beside it', async () => {
  const env = await open({
    search: '?dm=34',
    routes: spring({ 'POST /api/calls': answer(200, { ...ROOM, contextType: 'DM', contextKey: '34', title: null }) }),
  });
  assert.equal(env.embed.mounts[0].kind, 'dm');
  assert.equal(env.embed.mounts[0].options.conversationId, 34);
  assert.equal(env.root.querySelector('h1').textContent, env.t.dm_title);
});

test('a course call has no chat beside it', async () => {
  const env = await open({
    search: '?course=csa',
    routes: spring({ 'POST /api/calls': answer(200, { ...ROOM, contextType: 'COURSE', contextKey: 'CSA', title: 'CSA' }) }),
  });
  assert.equal(env.embed.mounts.length, 0);
  assert.equal(hook(env.root, 'chat'), null);
});

test('destroyStopsTracksAndListeners', async () => {
  const env = await joinCall();
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  const room = lkRoom(env);
  env.page.destroy();
  await settle();
  assert.equal(room.connected, false);
  assert.equal(room.listenerCount(), 0);
  assert.ok(env.livekit.lk.previews.every((track) => track.stopped));
  assert.ok(env.embed.mounts.every((mount) => mount.destroyed));
  assert.equal(env.root.childNodes.length, 0);
});

test('leaving the lobby before joining stops the preview and the retries', async () => {
  const env = await open({ routes: spring({ 'POST /api/calls/7/token': answer(403, { reason: 'WAITING_FOR_SUPERVISOR' }) }) });
  await click(hook(env.root, 'join'));
  assert.equal(env.timers.pending.size, 1);
  env.page.destroy();
  assert.equal(env.timers.pending.size, 0);
  assert.ok(env.livekit.lk.previews.every((track) => track.stopped));
  assert.equal(env.livekit.lk.rooms.length, 0, 'never connected');
});

test('CallPage.start resolves with the page once the lobby is ready', async () => {
  const { document } = installFakeDom();
  const root = document.createElement('div');
  const scripted = scriptedFetch(CONFIG.javaURI, spring());
  const page = await CallPage.start({
    root, strings: readStrings(), config: CONFIG, embed: fakeEmbed(), search: '?group=12', navigator: { mediaDevices: {} },
    loadLiveKit: async () => createFakeLiveKit(), fetch: scripted.fetch, timers: manualTimers(),
  });
  assert.equal(page.state, 'lobby');
  page.destroy();
});

test('a Join pressed while the camera and microphone are still opening waits for them, then sends them', async () => {
  const env = await open({ holdDevices: true });
  assert.ok(hook(env.root, 'join'), 'the lobby is up while the browser asks for the devices');
  await click(hook(env.root, 'join'));
  assert.equal(lkRoom(env), undefined, 'nothing connects before the devices answer');
  env.livekit.lk.release();
  await env.begun;
  await settle();
  assert.equal(env.page.state, 'ready');
  assert.deepEqual(lkRoom(env).localParticipant.published.map((track) => track.kind), ['audio', 'video']);
});

test('the lobby\'s toggles wait while a device is still opening', async () => {
  const env = await open({ holdDevices: true });
  assert.equal(hook(env.root, 'lobby-camera').disabled, true);
  assert.equal(hook(env.root, 'lobby-mic').disabled, true);
  env.livekit.lk.release();
  await env.begun;
  await settle();
  assert.equal(hook(env.root, 'lobby-camera').disabled, false);
  assert.equal(hook(env.root, 'lobby-mic').disabled, false);
});

test('leaving while the camera is still opening stops it when it arrives', async () => {
  const env = await open({ holdDevices: true });
  env.page.destroy();
  env.livekit.lk.release();
  await env.begun;
  await settle();
  assert.equal(env.livekit.lk.previews.length, 2);
  assert.ok(env.livekit.lk.previews.every((track) => track.stopped), 'a track that arrives after the page is gone is stopped');
  assert.equal(env.root.childNodes.length, 0);
});

test('a call of up to four shows big cells, two a row; a bigger one uses the card grid', async () => {
  const env = await joinCall();
  const grid = hook(env.root, 'cells');
  assert.ok(grid.classList.contains('ocs__grid--col2'), 'just you');
  ['a', 'b', 'c'].forEach((name) => lkRoom(env).join({ identity: `${name}-id`, name }));
  await settle();
  assert.ok(grid.classList.contains('ocs__grid--col2'), `${env.strings.large_cells_up_to} people`);
  assert.ok(!grid.classList.contains('ocs__grid--card'));
  lkRoom(env).join({ identity: 'd-id', name: 'd' });
  await settle();
  assert.ok(grid.classList.contains('ocs__grid--card'), 'five people');
  assert.ok(!grid.classList.contains('ocs__grid--col2'));
  assert.ok(grid.classList.contains('ocs__grid'));
});

test('a teacher\'s Manage sits on the person\'s own row', async () => {
  const env = await joinCall({ routes: spring({ 'POST /api/calls/7/token': answer(200, { ...TOKEN, canModerate: true }) }) });
  lkRoom(env).join({ identity: 'ada-id', name: 'Ada' });
  await settle();
  const row = hook(env.root, 'people').querySelector('[data-person="ada-id"]');
  assert.ok(row.textContent.startsWith('Ada'));
  assert.ok(row.querySelector('details')?.querySelector('[data-action="pause"]'), 'Manage is in Ada\'s row');
});

test('a connection that fails keeps the lobby, its camera and Join', async () => {
  const env = await open({ failures: { connect: new Error('could not establish pc connection') } });
  await click(hook(env.root, 'join'));
  assert.equal(env.page.state, 'lobby');
  assert.ok(hook(env.root, 'lobby'), 'the lobby is still on the page');
  assert.ok(env.root.textContent.includes(env.t.unavailable));
  assert.equal(hook(env.root, 'join').disabled, false);
  assert.equal(hook(env.root, 'rejoin'), null);
  assert.ok(env.livekit.lk.previews.every((track) => !track.stopped), 'the preview keeps running for the next try');
});

