// The call's toolbar, in the grammar's viewer bar (it sticks to the top while the call scrolls):
// how many are in the call, then Mic, Camera, Share screen and Leave. Share screen is only offered
// where the browser can share one; iPhone Safari can't.
import { CallDom } from './call-dom.js';
import { CallModel } from './call-model.js';

const ICONS = Object.freeze({
  mic: ['fa-microphone', 'fa-microphone-slash'],
  camera: ['fa-video', 'fa-video-slash'],
  share: ['fa-desktop', 'fa-desktop'],
});

/** new CallControls({...}); render(state) after every change. Each on* callback gets no arguments. */
export class CallControls {
  constructor({ root, strings, canShare, onMic, onCamera, onShare, onLeave }) {
    this.t = strings.text;
    this.bar = CallDom.el('div', 'ocs__viewer', { attrs: { role: 'toolbar', 'aria-label': this.t.controls } });
    this.status = CallDom.el('p', 'ocs__viewer__status', { attrs: { 'data-call': 'status', role: 'status' } });
    const actions = CallDom.el('div', 'ocs__viewer__actions ocs__links');
    this.mic = CallDom.button(this.t.mic, 'ocs__btn small', { hook: 'mic', icon: ICONS.mic[0] });
    this.camera = CallDom.button(this.t.camera, 'ocs__btn small', { hook: 'camera', icon: ICONS.camera[0] });
    this.share = canShare ? CallDom.button(this.t.share, 'ocs__btn small', { hook: 'share', icon: ICONS.share[0] }) : null;
    this.leave = CallDom.button(this.t.leave, 'ocs__btn small alert-red', { hook: 'leave', icon: 'fa-phone-slash' });
    actions.append(...[this.mic, this.camera, this.share, this.leave].filter(Boolean));
    this.bar.append(this.status, actions);
    root.appendChild(this.bar);
    this.listeners = [[this.mic, onMic], [this.camera, onCamera], [this.share, onShare], [this.leave, onLeave]]
      .filter(([button]) => button);
    this.listeners.forEach(([button, handler]) => button.addEventListener('click', handler));
  }

  /** count: people in the call; micOn, cameraOn, sharing: yours; paused: the safety rules hold your media. */
  render({ count, micOn, cameraOn, sharing, paused }) {
    this.status.textContent = CallModel.format(this.t.people_count, { count });
    CallDom.setToggle(this.mic, micOn, ICONS.mic);
    CallDom.setToggle(this.camera, cameraOn, ICONS.camera);
    this.mic.disabled = paused;
    this.camera.disabled = paused;
    if (this.share) {
      CallDom.setToggle(this.share, sharing, ICONS.share);
      this.share.disabled = paused;
    }
  }

  destroy() {
    this.listeners.forEach(([button, handler]) => button.removeEventListener('click', handler));
    this.bar.remove();
  }
}
