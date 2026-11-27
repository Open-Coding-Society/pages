// A stand-in for livekit-client's UMD namespace (window.LivekitClient, 2.23.0): the parts the
// calls modules use, with the same event names, track sources and disconnect reasons, plus
// helpers a test drives the room with (someone joins, speaks, is paused, the room ends).

class Emitter {
  constructor() {
    this.handlers = new Map();
  }

  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event).push(handler);
    return this;
  }

  off(event, handler) {
    const list = this.handlers.get(event) ?? [];
    this.handlers.set(event, list.filter((h) => h !== handler));
    return this;
  }

  emit(event, ...args) {
    [...(this.handlers.get(event) ?? [])].forEach((handler) => handler(...args));
  }

  listenerCount() {
    return [...this.handlers.values()].reduce((sum, list) => sum + list.length, 0);
  }
}

export const RoomEvent = Object.freeze({
  ParticipantConnected: 'participantConnected',
  ParticipantDisconnected: 'participantDisconnected',
  TrackSubscribed: 'trackSubscribed',
  TrackUnsubscribed: 'trackUnsubscribed',
  TrackMuted: 'trackMuted',
  TrackUnmuted: 'trackUnmuted',
  LocalTrackPublished: 'localTrackPublished',
  LocalTrackUnpublished: 'localTrackUnpublished',
  ActiveSpeakersChanged: 'activeSpeakersChanged',
  ParticipantPermissionsChanged: 'participantPermissionsChanged',
  AudioPlaybackStatusChanged: 'audioPlaybackChanged',
  Disconnected: 'disconnected',
  Reconnecting: 'reconnecting',
  Reconnected: 'reconnected',
});

export const Track = Object.freeze({
  Source: Object.freeze({ Camera: 'camera', Microphone: 'microphone', ScreenShare: 'screen_share', ScreenShareAudio: 'screen_share_audio' }),
  Kind: Object.freeze({ Audio: 'audio', Video: 'video' }),
});

// livekit-client's protobuf DisconnectReason numbers.
export const DisconnectReason = Object.freeze({ UNKNOWN_REASON: 0, CLIENT_INITIATED: 1, PARTICIPANT_REMOVED: 4, ROOM_DELETED: 5 });

const FULL = Object.freeze({ canPublish: true, canSubscribe: true, canPublishData: true });
const PAUSED = Object.freeze({ canPublish: false, canSubscribe: false, canPublishData: false });

export class FakeTrack {
  constructor(kind, source) {
    this.kind = kind;
    this.source = source;
    this.stopped = false;
    this.isMuted = false;
    this.elements = [];
  }

  attach(element) {
    const target = element ?? document.createElement(this.kind);
    if (!this.elements.includes(target)) this.elements.push(target);
    target.srcObject = this;
    return target;
  }

  detach(element) {
    const gone = element ? this.elements.filter((e) => e === element) : [...this.elements];
    this.elements = this.elements.filter((e) => !gone.includes(e));
    gone.forEach((e) => { e.srcObject = null; });
    return element ? element : gone;
  }

  stop() {
    this.stopped = true;
  }
}

class FakeParticipant {
  constructor({ identity, name = identity, metadata = '' }) {
    this.identity = identity;
    this.name = name;
    this.metadata = metadata;
    this.isSpeaking = false;
    this.permissions = { ...FULL };
    this.publications = new Map(); // source -> { source, track, isMuted, kind }
  }

  getTrackPublication(source) {
    return this.publications.get(source);
  }

  enabled(source) {
    const publication = this.publications.get(source);
    return Boolean(publication?.track) && !publication.isMuted;
  }

  get isMicrophoneEnabled() { return this.enabled(Track.Source.Microphone); }

  get isCameraEnabled() { return this.enabled(Track.Source.Camera); }

  get isScreenShareEnabled() { return this.enabled(Track.Source.ScreenShare); }
}

class FakeLocalParticipant extends FakeParticipant {
  constructor(room, options) {
    super(options);
    this.room = room;
    this.published = []; // every track published, in order
  }

  async publishTrack(track) {
    this.publications.set(track.source, { source: track.source, track, isMuted: false, kind: track.kind });
    this.published.push(track);
    this.room.emit(RoomEvent.LocalTrackPublished, this.publications.get(track.source), this);
  }

  async setEnabled(source, kind, on, failure) {
    if (failure) throw failure;
    const publication = this.publications.get(source);
    if (on && !publication) {
      await this.publishTrack(new FakeTrack(kind, source));
      return;
    }
    if (!publication) return;
    if (source === Track.Source.ScreenShare && !on) {
      publication.track.stop();
      this.publications.delete(source);
      this.room.emit(RoomEvent.LocalTrackUnpublished, publication, this);
      return;
    }
    publication.isMuted = !on;
    this.room.emit(on ? RoomEvent.TrackUnmuted : RoomEvent.TrackMuted, publication, this);
  }

  setMicrophoneEnabled(on) { return this.setEnabled(Track.Source.Microphone, 'audio', on, this.room.lk.failures.microphone); }

  setCameraEnabled(on) { return this.setEnabled(Track.Source.Camera, 'video', on, this.room.lk.failures.camera); }

  setScreenShareEnabled(on) { return this.setEnabled(Track.Source.ScreenShare, 'video', on, on ? this.room.lk.failures.screen : null); }
}

/**
 * One fake LiveKit namespace. `failures` makes devices or the connection fail; with `holdDevices`,
 * the camera and microphone open only when the test calls lk.release(), like a browser waiting on
 * its permission prompt.
 */
export function createFakeLiveKit({ failures = {}, holdDevices = false } = {}) {
  const lk = { failures: { camera: null, microphone: null, screen: null, connect: null, ...failures }, rooms: [], previews: [], held: [] };
  lk.release = () => { lk.held.splice(0).forEach((open) => open()); };

  class Room extends Emitter {
    constructor(options = {}) {
      super();
      this.options = options;
      this.lk = lk;
      this.localParticipant = new FakeLocalParticipant(this, { identity: 'me-id', name: 'Me', metadata: '' });
      this.remoteParticipants = new Map();
      this.canPlaybackAudio = true;
      this.connected = false;
      this.disconnects = 0;
      this.audioStarts = 0;
      lk.rooms.push(this);
    }

    async connect(url, token) {
      if (lk.failures.connect) {
        // livekit-client reports a failed attempt as Disconnected before connect() rejects.
        this.emit(RoomEvent.Disconnected, DisconnectReason.UNKNOWN_REASON);
        throw lk.failures.connect;
      }
      this.url = url;
      this.token = token;
      this.connected = true;
    }

    async disconnect() {
      this.disconnects += 1;
      if (!this.connected) return;
      this.connected = false;
      this.emit(RoomEvent.Disconnected, DisconnectReason.CLIENT_INITIATED);
    }

    async startAudio() {
      this.audioStarts += 1;
      if (lk.failures.audio) throw lk.failures.audio;
      this.canPlaybackAudio = true;
      this.emit(RoomEvent.AudioPlaybackStatusChanged, true);
    }

    // What a test does to the room.

    join({ identity, name = identity, metadata = '', camera = true, microphone = true }) {
      const remote = new FakeParticipant({ identity, name, metadata });
      this.remoteParticipants.set(identity, remote);
      this.emit(RoomEvent.ParticipantConnected, remote);
      if (camera) this.subscribe(identity, Track.Source.Camera);
      if (microphone) this.subscribe(identity, Track.Source.Microphone);
      return remote;
    }

    subscribe(identity, source) {
      const remote = this.remoteParticipants.get(identity);
      const kind = source === Track.Source.Microphone || source === Track.Source.ScreenShareAudio ? 'audio' : 'video';
      const track = new FakeTrack(kind, source);
      const publication = { source, track, isMuted: false, kind };
      remote.publications.set(source, publication);
      this.emit(RoomEvent.TrackSubscribed, track, publication, remote);
      return track;
    }

    unsubscribe(identity, source) {
      const remote = this.remoteParticipants.get(identity);
      const publication = remote.publications.get(source);
      remote.publications.delete(source);
      this.emit(RoomEvent.TrackUnsubscribed, publication.track, publication, remote);
    }

    leave(identity) {
      const remote = this.remoteParticipants.get(identity);
      [...remote.publications.keys()].forEach((source) => this.unsubscribe(identity, source));
      this.remoteParticipants.delete(identity);
      this.emit(RoomEvent.ParticipantDisconnected, remote);
    }

    speak(identities) {
      const everyone = [this.localParticipant, ...this.remoteParticipants.values()];
      everyone.forEach((p) => { p.isSpeaking = identities.includes(p.identity); });
      this.emit(RoomEvent.ActiveSpeakersChanged, everyone.filter((p) => p.isSpeaking));
    }

    // Spring's CallSupervisor pausing or resuming this browser's participant.
    pauseSelf(paused = true) {
      const before = { ...this.localParticipant.permissions };
      this.localParticipant.permissions = { ...(paused ? PAUSED : FULL) };
      if (paused) {
        // LiveKit unpublishes the tracks of someone who may no longer publish, and livekit-client
        // stops them (stopLocalTrackOnUnpublish), so a resume needs new ones.
        [...this.localParticipant.publications.values()].forEach((publication) => {
          this.localParticipant.publications.delete(publication.source);
          publication.track.stop();
          this.emit(RoomEvent.LocalTrackUnpublished, publication, this.localParticipant);
        });
      }
      this.emit(RoomEvent.ParticipantPermissionsChanged, before, this.localParticipant);
    }

    blockAudio() {
      this.canPlaybackAudio = false;
      this.emit(RoomEvent.AudioPlaybackStatusChanged, false);
    }

    end(reason) {
      this.connected = false;
      this.emit(RoomEvent.Disconnected, reason);
    }
  }

  // The failure is read when the device is asked for, so a test can let a refused device through later.
  const preview = (kind, source, key) => async () => {
    if (holdDevices) await new Promise((resolve) => lk.held.push(resolve));
    if (lk.failures[key]) throw lk.failures[key];
    const track = new FakeTrack(kind, source);
    lk.previews.push(track);
    return track;
  };

  return {
    lk,
    Room,
    RoomEvent,
    Track,
    DisconnectReason,
    createLocalAudioTrack: preview('audio', Track.Source.Microphone, 'microphone'),
    createLocalVideoTrack: preview('video', Track.Source.Camera, 'camera'),
  };
}

/** A DOMException-like error, as getUserMedia rejects with. */
export function mediaError(name = 'NotAllowedError') {
  return Object.assign(new Error(name), { name });
}
