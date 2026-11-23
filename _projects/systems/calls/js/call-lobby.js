// The step before a call: a preview of your camera, Mic and Camera toggles, and Join. The lobby
// owns the camera and microphone until a join works; then the room takes them (handOver). While
// someone waits for a teacher, the preview stays and the lobby says why.
import { CallDom } from './call-dom.js';

const MIC_ICONS = ['fa-microphone', 'fa-microphone-slash'];
const CAMERA_ICONS = ['fa-video', 'fa-video-slash'];

/** The lobby card: new CallLobby({...}), then await lobby.start(). */
export class CallLobby {
  constructor({ root, strings, livekit, purpose, onJoin }) {
    this.t = strings.text;
    this.livekit = livekit;
    this.onJoin = onJoin;
    this.audio = null;
    this.video = null;
    this.wants = { audio: true, video: purpose.camera };
    this.missing = false; // a device the browser refused or doesn't have
    this.busy = false;
    this.opening = new Set(); // 'audio' or 'video' while the browser is still asked for it
    this.destroyed = false;
    this.ready = Promise.resolve();
    this.preview = CallDom.video(this.t.camera);
    this.previewTrack = null;
    this.cameraOff = CallDom.el('abbr', 'ocs__avatar', { attrs: { title: this.t.camera_off } });
    this.cameraOff.appendChild(CallDom.el('i', `fas ${CAMERA_ICONS[1]}`, { attrs: { 'aria-hidden': 'true' } }));

    this.card = CallDom.el('div', 'ocs__card ocs__stack', { attrs: { 'data-call': 'lobby' } });
    this.view = CallDom.el('div'); // the preview, or the camera-off avatar
    this.mic = CallDom.button(this.t.mic, 'ocs__btn small', { hook: 'lobby-mic', icon: MIC_ICONS[0] });
    this.camera = CallDom.button(this.t.camera, 'ocs__btn small', { hook: 'lobby-camera', icon: CAMERA_ICONS[0] });
    this.join = CallDom.button(this.t.join, 'ocs__btn medium accent fill', { hook: 'join' });
    this.status = CallDom.el('p', 'ocs__text', { attrs: { role: 'status' } });
    const row = CallDom.el('div', 'ocs__links');
    row.append(this.mic, this.camera, this.join);
    this.card.append(CallDom.el('h2', 'ocs__section-title', { text: this.t.lobby_title }), this.view, row, this.status);
    root.appendChild(this.card);

    this.onMic = () => this.toggle('audio');
    this.onCamera = () => this.toggle('video');
    this.onJoinClick = () => { if (!this.busy) this.onJoin(); };
    this.mic.addEventListener('click', this.onMic);
    this.camera.addEventListener('click', this.onCamera);
    this.join.addEventListener('click', this.onJoinClick);
  }

  /**
   * Asks for the camera and microphone the purpose wants, each on its own, so one missing doesn't
   * stop the other. `ready` settles when both have answered; a Join pressed before then waits for it.
   */
  start() {
    const kinds = ['audio', 'video'].filter((kind) => this.wants[kind]);
    kinds.forEach((kind) => this.opening.add(kind));
    this.draw();
    this.ready = Promise.all(kinds.map((kind) => this.open(kind))).then(() => { if (!this.destroyed) this.draw(); });
    return this.ready;
  }

  /** The tracks to send when the call starts; null for a device that is off. */
  tracks() {
    return { audio: this.audio, video: this.video };
  }

  /** The room now owns the tracks: the lobby won't stop them. */
  handOver() {
    this.previewTrack?.detach(this.preview);
    this.previewTrack = null;
    this.audio = null;
    this.video = null;
  }

  /** Says why the lobby is still here: waiting, or Spring couldn't hand out a token. */
  setStatus(text) {
    this.status.textContent = text;
  }

  /** While a join is in flight (or waiting), Join is off and says so. */
  setBusy(busy) {
    this.busy = busy;
    this.join.disabled = busy;
    this.join.textContent = busy ? this.t.joining : this.t.join;
  }

  destroy() {
    this.destroyed = true;
    this.mic.removeEventListener('click', this.onMic);
    this.camera.removeEventListener('click', this.onCamera);
    this.join.removeEventListener('click', this.onJoinClick);
    this.previewTrack?.detach(this.preview);
    this.audio?.stop();
    this.video?.stop();
    this.audio = null;
    this.video = null;
    this.card.remove();
  }

  async open(kind) {
    this.opening.add(kind);
    try {
      const track = kind === 'audio'
        ? await this.livekit.createLocalAudioTrack()
        : await this.livekit.createLocalVideoTrack(this.livekit.VideoPresets ? { resolution: this.livekit.VideoPresets.h540.resolution } : undefined);
      if (this.destroyed) {
        track.stop(); // the page was left while the browser was still asking
        return;
      }
      this[kind] = track;
      this.wants[kind] = true;
    } catch (error) {
      // NotAllowedError (refused), NotFoundError (no device) or NotReadableError (in use elsewhere).
      console.warn(`Calls: the ${kind === 'audio' ? 'microphone' : 'camera'} is not available`, error);
      this[kind] = null;
      this.wants[kind] = false;
      this.missing = true;
    } finally {
      this.opening.delete(kind);
    }
  }

  async toggle(kind) {
    if (this.opening.has(kind) || this.destroyed) return;
    if (this[kind]) {
      if (kind === 'video') this.previewTrack?.detach(this.preview);
      this[kind].stop();
      this[kind] = null;
      this.wants[kind] = false;
    } else {
      const opened = this.open(kind);
      this.draw();
      await opened;
    }
    if (!this.destroyed) this.draw();
  }

  draw() {
    CallDom.setToggle(this.mic, Boolean(this.audio), MIC_ICONS);
    CallDom.setToggle(this.camera, Boolean(this.video), CAMERA_ICONS);
    this.mic.disabled = this.opening.has('audio');
    this.camera.disabled = this.opening.has('video');
    if (this.video && this.previewTrack !== this.video) {
      this.video.attach(this.preview);
      this.previewTrack = this.video;
    }
    if (!this.video) this.previewTrack = null;
    const shown = this.video ? this.preview : this.cameraOff;
    if (this.view.firstChild !== shown) this.view.replaceChildren(shown);
    if (!this.audio && !this.video && this.missing) this.setStatus(this.t.lobby_no_devices);
  }
}
