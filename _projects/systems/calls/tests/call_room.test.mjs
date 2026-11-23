import assert from 'node:assert/strict';
import { test } from 'node:test';

import { installFakeDom } from '../../messages/tests/fake-dom.mjs';
import { CallRoom } from '../js/call-room.js';
import { DisconnectReason, Track, createFakeLiveKit, mediaError } from './fake-livekit.mjs';

installFakeDom();

async function joined({ failures, audio = true, video = true } = {}) {
  const livekit = createFakeLiveKit({ failures });
  const events = [];
  const sink = document.createElement('div');
  const room = new CallRoom({ livekit, audioSink: sink, onChange: (event) => events.push(event) });
  const tracks = {
    audio: audio ? await livekit.createLocalAudioTrack() : null,
    video: video ? await livekit.createLocalVideoTrack() : null,
  };
  await room.connect('ws://localhost:7880', 'jwt', tracks);
  return { livekit, lkRoom: livekit.lk.rooms[0], room, events, sink, tracks };
}

const self = (room) => room.snapshot().people.find((p) => p.isSelf);
const person = (room, identity) => room.snapshot().people.find((p) => p.identity === identity);

test('joining connects with the token and sends the lobby\'s camera and microphone', async () => {
  const { lkRoom, room, tracks } = await joined();
  assert.equal(lkRoom.url, 'ws://localhost:7880');
  assert.equal(lkRoom.token, 'jwt');
  assert.deepEqual(lkRoom.localParticipant.published, [tracks.audio, tracks.video]);
  assert.equal(lkRoom.options.adaptiveStream, true);
  assert.equal(lkRoom.options.dynacast, true);
  const me = self(room);
  assert.equal(me.micOn, true);
  assert.equal(me.cameraOn, true);
  assert.equal(me.camera, tracks.video);
});

test('joining with no devices still joins, to listen', async () => {
  const { lkRoom, room } = await joined({ audio: false, video: false });
  assert.equal(lkRoom.connected, true);
  assert.deepEqual(lkRoom.localParticipant.published, []);
  assert.equal(self(room).micOn, false);
  assert.equal(self(room).cameraOn, false);
});

test('someone who joins shows with their camera, and their voice plays from the sink', async () => {
  const { lkRoom, room, events, sink } = await joined();
  lkRoom.join({ identity: 'ada-id', name: 'Ada Lovelace', metadata: '{"roles":["ROLE_TEACHER"]}' });
  const ada = person(room, 'ada-id');
  assert.equal(ada.name, 'Ada Lovelace');
  assert.equal(ada.cameraOn, true);
  assert.equal(ada.camera.kind, 'video');
  assert.equal(ada.metadata, '{"roles":["ROLE_TEACHER"]}');
  assert.equal(sink.querySelectorAll('audio').length, 1);
  assert.ok(events.some((e) => e.type === 'people'));

  lkRoom.leave('ada-id');
  assert.equal(person(room, 'ada-id'), undefined);
  assert.equal(sink.querySelectorAll('audio').length, 0);
});

test('a person with no name shows by identity', async () => {
  const { lkRoom, room } = await joined();
  lkRoom.join({ identity: 'x-id', name: '' });
  assert.equal(person(room, 'x-id').name, 'x-id');
});

test('speaking marks who is talking', async () => {
  const { lkRoom, room } = await joined();
  lkRoom.join({ identity: 'ada-id', name: 'Ada' });
  lkRoom.speak(['ada-id']);
  assert.equal(person(room, 'ada-id').speaking, true);
  assert.equal(self(room).speaking, false);
});

test('the mic and camera buttons change what the call sends', async () => {
  const { room } = await joined();
  await room.setMicrophone(false);
  await room.setCamera(false);
  assert.equal(self(room).micOn, false);
  assert.equal(self(room).cameraOn, false);
  assert.equal(self(room).camera, null);
  await room.setMicrophone(true);
  assert.equal(self(room).micOn, true);
  assert.deepEqual(room.wants, { microphone: true, camera: false });
});

test('a device the browser refuses rejects, and what you wanted stays as it was', async () => {
  const { room } = await joined({ failures: { camera: mediaError('NotAllowedError') }, video: false });
  await assert.rejects(room.setCamera(true), /NotAllowedError/);
  assert.equal(room.wants.camera, false);
});

test('a screen share shows as a screen, and stops', async () => {
  const { room } = await joined();
  await room.setScreenShare(true);
  const screens = room.snapshot().screens;
  assert.equal(screens.length, 1);
  assert.equal(screens[0].identity, 'me-id');
  assert.equal(screens[0].track.source, Track.Source.ScreenShare);
  await room.setScreenShare(false);
  assert.equal(room.snapshot().screens.length, 0);
});

test('a refused screen share rejects', async () => {
  const { room } = await joined({ failures: { screen: mediaError('NotAllowedError') } });
  await assert.rejects(room.setScreenShare(true));
  assert.equal(room.snapshot().screens.length, 0);
});

test('paused takes the tracks away; resumed puts back what you had on', async () => {
  const { lkRoom, room, events } = await joined();
  await room.setCamera(false);
  lkRoom.pauseSelf(true);
  assert.equal(room.snapshot().paused, true);
  assert.equal(events.at(-1).type, 'paused');
  assert.equal(self(room).micOn, false);

  lkRoom.pauseSelf(false);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(room.snapshot().paused, false);
  assert.equal(events.at(-1).type, 'resumed');
  assert.equal(self(room).micOn, true, 'the mic was on, so it comes back');
  assert.equal(self(room).cameraOn, false, 'the camera was off, so it stays off');
});

test('each way a call ends says why', async () => {
  const cases = [
    [DisconnectReason.PARTICIPANT_REMOVED, 'removed'],
    [DisconnectReason.ROOM_DELETED, 'ended'],
    [DisconnectReason.UNKNOWN_REASON, 'lost'],
    [undefined, 'lost'],
  ];
  for (const [code, why] of cases) {
    const { lkRoom, events } = await joined();
    lkRoom.end(code);
    assert.deepEqual(events.at(-1), { type: 'disconnected', reason: why }, String(code));
  }
});

test('leaving says you left, stops every track and takes back every listener', async () => {
  const { lkRoom, room, events, sink, tracks } = await joined();
  lkRoom.join({ identity: 'ada-id', name: 'Ada' });
  await room.setScreenShare(true);
  const screen = self(room).screen;
  await room.disconnect();
  assert.deepEqual(events.at(-1), { type: 'disconnected', reason: 'left' });
  assert.equal(lkRoom.listenerCount(), 0);
  assert.equal(tracks.audio.stopped, true);
  assert.equal(tracks.video.stopped, true);
  assert.equal(screen.stopped, true);
  assert.equal(sink.querySelectorAll('audio').length, 0);
  await room.disconnect();
  assert.equal(lkRoom.disconnects, 1, 'a second disconnect does nothing');
});

test('sound the browser holds back is reported, and a click starts it', async () => {
  const { lkRoom, room, events } = await joined();
  lkRoom.blockAudio();
  assert.equal(events.at(-1).type, 'audio');
  assert.equal(room.snapshot().audioBlocked, true);
  await room.startAudio();
  assert.equal(lkRoom.audioStarts, 1);
  assert.equal(room.snapshot().audioBlocked, false);
});

test('a connection that fails rejects, takes back its listeners and leaves the lobby\'s preview running', async () => {
  const livekit = createFakeLiveKit({ failures: { connect: new Error('could not connect') } });
  const events = [];
  const room = new CallRoom({ livekit, audioSink: document.createElement('div'), onChange: (event) => events.push(event) });
  const video = await livekit.createLocalVideoTrack();
  await assert.rejects(room.connect('ws://x', 'jwt', { audio: null, video }), /could not connect/);
  assert.equal(livekit.lk.rooms[0].listenerCount(), 0);
  assert.equal(video.stopped, false, 'the lobby still owns its preview until a join works');
  assert.deepEqual(events, [], 'a join that never connected is not a call that disconnected');
});
