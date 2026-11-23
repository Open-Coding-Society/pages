// One LiveKit room for the call page. It connects with Spring's join token, sends the lobby's
// camera and microphone, plays everyone else's sound from a hidden element the page owns, and
// turns LiveKit's events into a few plain ones the page redraws on. It is handed the LiveKit
// namespace (window.LivekitClient on the page, a fake in the tests) instead of reading a global.
import { CallModel } from './call-model.js';

// Simulcast's layers follow each viewer's tile size (adaptiveStream) and are only sent while
// someone watches them (dynacast), which keeps a call light on school Wi-Fi.
const ROOM_OPTIONS = Object.freeze({ adaptiveStream: true, dynacast: true });

/**
 * A call in progress. onChange({type}) fires with 'people' (someone joined, left, talked or
 * switched something), 'paused' and 'resumed' (Spring's safety rules took this person's media
 * away or gave it back), 'audio' (the browser held the sound back or let it go), 'device' (a
 * lobby track couldn't be sent) and, last of all, {type: 'disconnected', reason} with 'left',
 * 'removed', 'ended' or 'lost'.
 */
export class CallRoom {
  constructor({ livekit, audioSink, onChange }) {
    this.livekit = livekit;
    this.audioSink = audioSink;
    this.onChange = onChange;
    this.room = null;
    this.wants = { microphone: false, camera: false }; // what to put back after a pause
    this.handlers = [];
    this.lobbyTracks = []; // stopped when the call ends
    this.audioElements = new Map(); // remote audio track -> its <audio> in the sink
    this.paused = false;
    this.leaving = false;
    this.connected = false; // until room.connect() resolves, Disconnected means the attempt failed
    this.ended = false;
  }

  /** Connects, then sends the lobby's tracks; either may be null. Rejects if LiveKit can't be reached. */
  async connect(url, token, { audio = null, video = null } = {}) {
    const { Room, RoomEvent } = this.livekit;
    this.room = new Room({ ...ROOM_OPTIONS });
    const people = () => this.changed('people');
    [
      RoomEvent.ParticipantConnected, RoomEvent.ParticipantDisconnected, RoomEvent.TrackMuted, RoomEvent.TrackUnmuted,
      RoomEvent.LocalTrackPublished, RoomEvent.LocalTrackUnpublished, RoomEvent.ActiveSpeakersChanged,
    ].forEach((event) => this.listen(event, people));
    this.listen(RoomEvent.TrackSubscribed, (track) => { this.play(track); people(); });
    this.listen(RoomEvent.TrackUnsubscribed, (track) => { this.silence(track); people(); });
    this.listen(RoomEvent.ParticipantPermissionsChanged, (_, participant) => this.permissionsChanged(participant));
    this.listen(RoomEvent.AudioPlaybackStatusChanged, () => this.changed('audio'));
    // livekit-client reports a failed attempt as Disconnected before connect() rejects; that is a
    // join that never happened, which connect()'s rejection reports, not a call that ended.
    this.listen(RoomEvent.Disconnected, (code) => {
      if (this.connected) this.finish(this.leaving ? 'left' : this.reasonFor(code));
    });
    try {
      await this.room.connect(url, token);
    } catch (error) {
      this.unlisten();
      throw error;
    }
    this.connected = true;
    for (const [track, want] of [[audio, 'microphone'], [video, 'camera']]) {
      if (!track) continue;
      this.lobbyTracks.push(track);
      try {
        await this.room.localParticipant.publishTrack(track);
        this.wants[want] = true;
      } catch (error) {
        console.warn('Calls: a lobby track could not be sent', error);
        track.stop();
        this.changed('device');
      }
    }
    this.changed('people');
  }

  /** Turns the microphone on or off; rejects if the browser won't allow it. */
  async setMicrophone(on) {
    await this.room.localParticipant.setMicrophoneEnabled(on);
    this.wants.microphone = on;
  }

  /** Turns the camera on or off; rejects if the browser won't allow it. */
  async setCamera(on) {
    await this.room.localParticipant.setCameraEnabled(on);
    this.wants.camera = on;
  }

  /** Starts or stops sharing a screen; rejects if the person cancels the browser's picker. */
  async setScreenShare(on) {
    await this.room.localParticipant.setScreenShareEnabled(on);
  }

  /** Lets the call's sound play after the browser held it back; call it from a click. */
  async startAudio() {
    await this.room?.startAudio();
  }

  /** Who is in the call and what they send, as plain values for the page to draw. */
  snapshot() {
    if (!this.room) return { people: [], screens: [], paused: false, audioBlocked: false };
    const local = this.room.localParticipant;
    const people = [this.view(local, true), ...[...this.room.remoteParticipants.values()].map((p) => this.view(p, false))];
    return {
      people,
      screens: people.filter((p) => p.screen).map((p) => ({ identity: p.identity, name: p.name, isSelf: p.isSelf, track: p.screen })),
      paused: CallModel.isPaused(local.permissions),
      audioBlocked: this.room.canPlaybackAudio === false,
    };
  }

  /** Leaves the call. The page calls it when the person presses Leave or the page goes away. */
  async disconnect() {
    if (!this.room || this.ended) return;
    this.leaving = true;
    try {
      await this.room.disconnect();
    } finally {
      this.finish('left');
    }
  }

  view(participant, isSelf) {
    const { Source } = this.livekit.Track;
    const live = (source) => {
      const publication = participant.getTrackPublication(source);
      return publication?.track && !publication.isMuted ? publication.track : null;
    };
    const camera = live(Source.Camera);
    return {
      identity: participant.identity,
      name: participant.name || participant.identity,
      isSelf,
      speaking: Boolean(participant.isSpeaking),
      micOn: Boolean(participant.isMicrophoneEnabled),
      cameraOn: Boolean(camera),
      camera,
      screen: live(Source.ScreenShare),
      paused: CallModel.isPaused(participant.permissions),
      metadata: participant.metadata || '',
    };
  }

  // Spring pauses someone (CallSupervisor) by taking away publishing and subscribing; when it
  // gives them back, whatever the person had on comes back on.
  permissionsChanged(participant) {
    if (participant !== this.room.localParticipant) {
      this.changed('people');
      return;
    }
    const paused = CallModel.isPaused(participant.permissions);
    if (paused === this.paused) return;
    this.paused = paused;
    if (paused) {
      this.changed('paused');
      return;
    }
    const local = this.room.localParticipant;
    const restores = [];
    if (this.wants.microphone) restores.push(local.setMicrophoneEnabled(true));
    if (this.wants.camera) restores.push(local.setCameraEnabled(true));
    Promise.allSettled(restores).then((results) => {
      if (this.ended) return;
      if (results.some((result) => result.status === 'rejected')) this.changed('device');
      this.changed('resumed');
    });
  }

  play(track) {
    if (track.kind !== 'audio' || this.audioElements.has(track)) return;
    const element = track.attach();
    this.audioSink.appendChild(element);
    this.audioElements.set(track, element);
  }

  silence(track) {
    const element = this.audioElements.get(track);
    if (!element) return;
    track.detach(element);
    element.remove();
    this.audioElements.delete(track);
  }

  reasonFor(code) {
    const { DisconnectReason } = this.livekit;
    if (code === DisconnectReason.PARTICIPANT_REMOVED) return 'removed';
    if (code === DisconnectReason.ROOM_DELETED) return 'ended';
    if (code === DisconnectReason.CLIENT_INITIATED) return 'left';
    return 'lost';
  }

  // The end of the call, once, however it ended: no listeners, no tracks, no sound left behind.
  finish(reason) {
    if (this.ended) return;
    this.ended = true;
    this.unlisten();
    const local = this.room.localParticipant;
    Object.values(this.livekit.Track.Source).forEach((source) => local.getTrackPublication(source)?.track?.stop());
    this.lobbyTracks.forEach((track) => track.stop());
    [...this.audioElements.keys()].forEach((track) => this.silence(track));
    this.onChange({ type: 'disconnected', reason });
  }

  changed(type) {
    if (!this.ended) this.onChange({ type });
  }

  listen(event, handler) {
    this.room.on(event, handler);
    this.handlers.push([event, handler]);
  }

  unlisten() {
    this.handlers.forEach(([event, handler]) => this.room.off(event, handler));
    this.handlers = [];
  }
}
