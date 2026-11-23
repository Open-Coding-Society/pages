// /calls/: the page a group's, DM's or course's call happens on. It asks Spring for the room the
// link names, shows the lobby, gets a join token (waiting, and asking again, while the safety
// rules say a teacher has to be there first), then runs the call with the room's chat and people
// beside it. A Flask-only site sends nothing. The page script imports config.js, rich-text.js and
// Messages' conversation-embed.js with {{ site.baseurl }} and hands them in, so the modules here
// only import each other.
import { CallConfirm } from './call-confirm.js';
import { CallControls } from './call-controls.js';
import { CallDom } from './call-dom.js';
import { CallLobby } from './call-lobby.js';
import { CallModel } from './call-model.js';
import { CallPeople } from './call-people.js';
import { CallRoom } from './call-room.js';
import { CallStage } from './call-stage.js';
import { CallsApi, CallsApiError } from './calls-api.js';
import { LiveKitScript } from './livekit-script.js';

// How each way a call ends reads, and whether Rejoin makes sense after it.
const ENDINGS = Object.freeze({
  left: { key: 'left', rejoin: true },
  lost: { key: 'disconnected', rejoin: true },
  removed: { key: 'removed', rejoin: false },
  ended: { key: 'ended', rejoin: false },
});

/**
 * const page = await CallPage.start({root, strings, config, richText, embed});
 * page.state is 'unavailable', 'no-room', 'signed-out', 'refused', 'lobby', 'waiting', 'ready'
 * or 'ended'; page.destroy() leaves the call and takes back everything the page started.
 */
export class CallPage {
  static async start(options) {
    const page = new CallPage(options);
    await page.begin();
    return page;
  }

  constructor({
    root, strings, config, richText = null, embed = null, search = globalThis.location?.search ?? '',
    navigator = globalThis.navigator, loadLiveKit = () => LiveKitScript.load(), fetch = null,
    timers = { set: (fn, ms) => setTimeout(fn, ms), clear: (id) => clearTimeout(id) },
  }) {
    this.root = root;
    this.strings = strings;
    this.t = strings.text;
    this.config = config;
    this.richText = richText;
    this.embed = embed;
    this.search = search;
    this.canShare = typeof navigator?.mediaDevices?.getDisplayMedia === 'function';
    this.loadLiveKit = loadLiveKit;
    this.timers = timers;
    this.api = config.springEnabled === false ? null : new CallsApi({ javaURI: config.javaURI, fetchOptions: config.fetchOptions, fetch });
    this.baseurl = String(config.baseurl ?? '').replace(/\/+$/, '');
    this.state = 'loading';
    this.notices = new Map(); // kind -> its callout
    this.retry = null;
    this.joining = false;
    this.destroyed = false;
  }

  async begin() {
    // A Flask-only site (spring: false in _config.yml) never calls Spring.
    if (!this.api) return this.stop('unavailable', CallDom.callout(this.t.turned_off));
    this.context = CallModel.contextFromQuery(new URLSearchParams(this.search));
    if (!this.context) return this.stop('no-room', CallDom.callout(this.t.no_room), this.links(CallDom.link(this.t.to_messages, `${this.baseurl}/dm`)));
    this.root.replaceChildren(CallDom.callout(this.t.loading));
    try {
      this.room = await this.api.open(this.context);
      if (this.destroyed) return undefined;
      this.livekit = await this.loadLiveKit();
    } catch (error) {
      if (!this.destroyed) this.refuse(error);
      return undefined;
    }
    if (this.destroyed) return undefined;
    this.layout();
    await this.mountChat();
    if (this.destroyed) return undefined;
    this.lobby = new CallLobby({
      root: this.main,
      strings: this.strings,
      livekit: this.livekit,
      purpose: CallModel.purposeView(this.room.purpose ?? this.context.purpose, this.strings),
      onJoin: () => this.join(),
    });
    await this.lobby.start();
    // A Join pressed while the devices were opening may already be on its way.
    if (!this.destroyed && this.state === 'loading') this.state = 'lobby';
    return undefined;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.retry !== null) this.timers.clear(this.retry);
    this.retry = null;
    this.confirm?.destroy();
    this.lobby?.destroy();
    this.lobby = null;
    this.teardownCall();
    this.call?.disconnect();
    this.chat?.destroy();
    this.chat = null;
    this.root.replaceChildren();
  }

  // The page: the room's name, notices, then the call (or lobby) beside its people and chat.
  layout() {
    const header = CallDom.el('div', 'ocs__card-header');
    header.appendChild(CallDom.el('h1', '', { text: CallModel.title(this.room, this.strings) }));
    const purpose = CallModel.purposeView(this.room.purpose, this.strings);
    if (purpose.key !== 'meeting') header.appendChild(CallDom.pill(purpose.label));
    this.noticeArea = CallDom.el('div', 'ocs__stack', { attrs: { 'data-call': 'notices' } });
    this.main = CallDom.el('div', 'ocs__stack', { attrs: { 'data-call': 'main' } });
    this.aside = CallDom.el('div', 'ocs__stack', { attrs: { 'data-call': 'aside' } });
    const split = CallDom.el('div', 'ocs__split ocs__split--aside-end');
    split.append(this.main, this.aside);
    // Everyone else's sound plays from here; it is a plain wrapper, so `hidden` holds.
    this.sink = CallDom.el('div', '', { attrs: { hidden: '', 'data-call': 'sound' } });
    const page = CallDom.el('section', 'ocs__stack');
    page.append(header, this.noticeArea, split, this.sink);
    this.root.replaceChildren(page);
    this.confirm = new CallConfirm({ root: this.root, strings: this.strings });
  }

  // A group's or DM's own chat, through Messages' embed; a course call has none.
  async mountChat() {
    const { contextType, contextKey } = this.context;
    if (contextType === 'COURSE' || !this.embed) return;
    const card = CallDom.el('div', 'ocs__card ocs__stack', { attrs: { 'data-call': 'chat' } });
    const holder = CallDom.el('div');
    card.append(CallDom.el('h2', 'ocs__section-title', { text: this.t.chat }), holder);
    this.aside.appendChild(card);
    const options = { config: this.config, richText: this.richText, heading: '' };
    try {
      this.chat = contextType === 'GROUP'
        ? await this.embed.mountGroupChat(holder, { ...options, groupId: Number(contextKey) })
        : await this.embed.mountConversation(holder, { ...options, conversationId: Number(contextKey) });
    } catch (error) {
      console.warn('Calls: the chat beside the call could not open', error);
      card.remove();
    }
    if (this.destroyed) this.chat?.destroy();
  }

  async join() {
    if (this.joining || this.destroyed) return;
    this.joining = true;
    this.lobby.setBusy(true);
    try {
      const token = await this.api.token(this.room.id);
      if (!this.destroyed) await this.enter(token);
    } catch (error) {
      if (!this.destroyed) this.joinRefused(error);
    } finally {
      this.joining = false;
    }
  }

  joinRefused(error) {
    const reason = error instanceof CallsApiError ? error.reason : null;
    if (CallModel.isWaiting(reason)) {
      // The safety rules: a mentor or a minor waits until a teacher (or a second adult) is in.
      this.lobby.setStatus(CallModel.reasonText(reason, this.strings));
      this.state = 'waiting';
      this.waitForChange();
      return;
    }
    if (error instanceof CallsApiError && [401, 403, 404].includes(error.status) && reason !== 'calls_disabled') {
      this.refuse(error);
      return;
    }
    // Spring or LiveKit can't be reached right now: say so and let Join try again.
    this.lobby.setStatus(CallModel.reasonText(reason ?? 'MEDIA_UNAVAILABLE', this.strings));
    this.lobby.setBusy(false);
    this.state = 'lobby';
  }

  // Every refused token shows as a red 403 line in the browser's console, so while someone waits
  // the page looks at the room instead (a 200), and asks for a token again only when someone has
  // come or gone, Spring can't say, or wait_looks_per_try looks have passed.
  async waitForChange() {
    const before = await this.peopleInRoom();
    if (this.destroyed) return;
    let looks = 0;
    const look = async () => {
      this.retry = null;
      const now = await this.peopleInRoom();
      if (this.destroyed) return;
      looks += 1;
      if (now === null || before === null || now !== before || looks >= this.strings.wait_looks_per_try) {
        this.lobby?.setBusy(false);
        this.join();
        return;
      }
      this.retry = this.timers.set(look, this.strings.wait_retry_seconds * 1000);
    };
    this.retry = this.timers.set(look, this.strings.wait_retry_seconds * 1000);
  }

  async peopleInRoom() {
    try {
      return (await this.api.get(this.room.id)).participantCount;
    } catch {
      return null;
    }
  }

  async enter(token) {
    // The camera and microphone the lobby is still opening go with you, not after you.
    await this.lobby.ready;
    if (this.destroyed) return;
    const call = new CallRoom({ livekit: this.livekit, audioSink: this.sink, onChange: (event) => this.changed(event) });
    try {
      await call.connect(token.url, token.token, this.lobby.tracks());
    } catch (error) {
      console.warn('Calls: could not connect to the call', error);
      this.lobby.setStatus(this.t.unavailable);
      this.lobby.setBusy(false);
      this.state = 'lobby';
      return;
    }
    this.call = call;
    if (this.destroyed) {
      call.disconnect();
      return;
    }
    this.lobby.handOver();
    this.lobby.destroy();
    this.lobby = null;
    this.controls = new CallControls({
      root: this.main,
      strings: this.strings,
      canShare: this.canShare,
      onMic: () => this.toggle('microphone'),
      onCamera: () => this.toggle('camera'),
      onShare: () => this.toggle('screen'),
      onLeave: () => this.call?.disconnect(),
    });
    this.stage = new CallStage({ root: this.main, strings: this.strings });
    this.people = new CallPeople({
      root: this.aside,
      strings: this.strings,
      canModerate: Boolean(token.canModerate),
      onAction: (action, person) => this.moderate(action, person),
      onEnd: () => this.endForAll(),
    });
    this.aside.insertBefore(this.people.card, this.aside.firstChild);
    this.state = 'ready';
    this.redraw();
  }

  changed(event) {
    if (this.destroyed) return;
    if (event.type === 'disconnected') {
      this.ended(event.reason);
      return;
    }
    if (event.type === 'paused') this.notice('paused', CallDom.callout(this.t.paused_notice));
    if (event.type === 'resumed') this.notice('paused', null);
    if (event.type === 'device') this.notice('error', CallDom.callout(this.t.device_failed));
    this.redraw();
  }

  redraw() {
    if (!this.stage || !this.call) return;
    const snapshot = this.call.snapshot();
    const self = snapshot.people.find((person) => person.isSelf);
    this.controls.render({
      count: snapshot.people.length, micOn: self.micOn, cameraOn: self.cameraOn, sharing: Boolean(self.screen), paused: snapshot.paused,
    });
    this.stage.render(snapshot);
    this.people.render(snapshot);
    if (snapshot.audioBlocked && !this.notices.has('audio')) this.notice('audio', this.soundNotice());
    if (!snapshot.audioBlocked) this.notice('audio', null);
  }

  // Browsers hold back sound a page starts without a click; this is the click.
  soundNotice() {
    const callout = CallDom.callout(`${this.t.audio_blocked} `);
    const button = CallDom.button(this.t.start_audio, 'ocs__btn small accent fill', { hook: 'start-audio' });
    button.addEventListener('click', () => {
      this.call?.startAudio().catch((error) => console.warn('Calls: the sound could not start', error));
    }, { once: true });
    callout.appendChild(button);
    return callout;
  }

  async toggle(device) {
    const snapshot = this.call.snapshot();
    const self = snapshot.people.find((person) => person.isSelf);
    this.notice('error', null);
    try {
      if (device === 'microphone') await this.call.setMicrophone(!self.micOn);
      if (device === 'camera') await this.call.setCamera(!self.cameraOn);
      if (device === 'screen') await this.call.setScreenShare(!self.screen);
    } catch (error) {
      console.warn(`Calls: the ${device} did not switch`, error);
      this.notice('error', CallDom.callout(device === 'screen' ? this.t.share_failed : this.t.device_failed));
    }
    this.redraw();
  }

  async moderate(action, person) {
    this.notice('error', null);
    if (action === 'remove') {
      const sure = await this.confirm.ask({
        title: CallModel.format(this.t.remove_title, { name: person.name }), text: this.t.remove_text, confirm: this.t.remove,
      });
      if (!sure) return;
    }
    try {
      await this.api[action](this.room.id, person.identity);
    } catch (error) {
      const reason = error instanceof CallsApiError ? error.reason : null;
      // 409 WAITING_FOR_SUPERVISOR on Resume is about the other person: the rules keep them paused.
      const words = action === 'resume' && CallModel.isWaiting(reason) ? this.t.stays_paused : CallModel.reasonText(reason, this.strings);
      this.notice('error', CallDom.callout(words));
    }
  }

  async endForAll() {
    const sure = await this.confirm.ask({ title: this.t.end_title, text: this.t.end_text, confirm: this.t.end_for_all });
    if (!sure) return;
    try {
      await this.api.end(this.room.id);
    } catch (error) {
      this.notice('error', CallDom.callout(CallModel.reasonText(error instanceof CallsApiError ? error.reason : null, this.strings)));
    }
  }

  // The call is over for this page: say why, keep the chat, offer Rejoin when coming back makes sense.
  ended(reason) {
    const ending = ENDINGS[reason] ?? ENDINGS.lost;
    this.teardownCall();
    this.notices.forEach((callout) => callout.remove());
    this.notices.clear();
    const parts = [CallDom.callout(this.t[ending.key])];
    if (ending.rejoin) parts.push(this.links(CallDom.link(this.t.rejoin, this.search || '?', 'ocs__btn accent fill', 'rejoin')));
    this.main.replaceChildren(...parts);
    this.state = 'ended';
  }

  teardownCall() {
    this.confirm?.close(false);
    this.controls?.destroy();
    this.stage?.destroy();
    this.people?.destroy();
    this.controls = null;
    this.stage = null;
    this.people = null;
  }

  // Why the room or the token was refused, as the page's only content.
  refuse(error) {
    const status = error instanceof CallsApiError ? error.status : 0;
    const reason = error instanceof CallsApiError ? error.reason : null;
    if (status === 401) {
      this.stop('signed-out', CallDom.callout(this.t.signed_out), this.links(CallDom.link(this.t.sign_in, `${this.baseurl}/login`)));
      return;
    }
    if ((status === 403 || status === 404 || status === 400) && reason !== 'calls_disabled') {
      this.stop('refused', CallDom.callout(CallModel.reasonText(reason, this.strings)));
      return;
    }
    this.stop('unavailable', CallDom.callout(this.t.unavailable), this.links(CallDom.link(this.t.try_again, this.search || '?')));
  }

  stop(state, ...nodes) {
    this.lobby?.destroy();
    this.lobby = null;
    this.chat?.destroy();
    this.chat = null;
    this.root.replaceChildren(...nodes);
    this.state = state;
  }

  links(...children) {
    const row = CallDom.el('p', 'ocs__links');
    row.append(...children);
    return row;
  }

  // One callout per kind of notice ('paused', 'audio', 'error'); null takes it away.
  notice(kind, callout) {
    this.notices.get(kind)?.remove();
    this.notices.delete(kind);
    if (!callout || !this.noticeArea) return;
    this.notices.set(kind, callout);
    this.noticeArea.appendChild(callout);
  }
}
