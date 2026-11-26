// Calls' one hook in Messages (/dm): a Call link for the open group or DM, and a line with a
// Join link while a call is on there. Spring tells open chats about a call with a frame on their
// topic ({"context":"callServer","callId",...}), but anyone who can send on a group topic could
// fake one, so the line shows only after GET /api/calls/{id} confirms a live call in this same
// group or DM that the viewer may join. Messages makes one only when calls are on.
import { CallLink } from './call-link.js';
import { CallModel } from './call-model.js';
import { CallsApi } from './calls-api.js';

const CONTEXT_TYPES = Object.freeze({ group: 'GROUP', dm: 'DM' });

/** new CallEntry({javaURI, fetchOptions, baseurl, text}); attach({link, notice}); then open() and frame() as Messages goes. */
export class CallEntry {
  constructor({ javaURI, fetchOptions, baseurl = '', text, fetch = null }) {
    this.api = new CallsApi({ javaURI, fetchOptions, fetch });
    this.baseurl = baseurl;
    this.t = text;
    this.link = null;
    this.notice = null;
    this.current = null; // the open conversation, {kind, id}
    this.asked = 0; // numbers each confirmation, so only the newest one shows
  }

  /** The page's Call link (hidden with the shared .hidden class until a conversation opens) and the line for a live call. */
  attach({ link, notice }) {
    this.link = link;
    this.notice = notice;
    link.textContent = this.t.call;
    link.classList.add('hidden');
  }

  /** A group or DM opened: the link points at its call, and any line about another call goes. */
  open(kind, id) {
    this.current = Object.hasOwn(CONTEXT_TYPES, kind) ? { kind, id } : null;
    this.asked += 1;
    this.clear();
    if (!this.link) return;
    if (!this.current) {
      this.link.classList.add('hidden');
      return;
    }
    this.link.setAttribute('href', kind === 'group' ? CallLink.forGroup(id, this.baseurl) : CallLink.forDm(id, this.baseurl));
    this.link.classList.remove('hidden');
  }

  /** No conversation is open. */
  close() {
    this.current = null;
    this.asked += 1;
    this.clear();
    this.link?.classList.add('hidden');
  }

  /** A call frame arrived on the open conversation's topic ({callId, state, count} from Messages' model). */
  async frame(kind, id, change) {
    if (!this.notice || !this.isOpen(kind, id)) return;
    const ticket = ++this.asked;
    if (change.state !== 'live' || !(change.count > 0)) {
      this.clear();
      return;
    }
    if (!Number.isSafeInteger(change.callId) || change.callId < 1) return;
    let room;
    try {
      room = await this.api.get(change.callId);
    } catch {
      room = null; // not a member, gone, or Spring unreachable: nothing to show
    }
    if (ticket !== this.asked || !this.isOpen(kind, id)) return;
    const confirmed = room && room.state === 'LIVE' && room.participantCount > 0
      && room.contextType === CONTEXT_TYPES[kind] && room.contextKey === String(id);
    if (!confirmed) {
      this.clear();
      return;
    }
    const join = document.createElement('a');
    join.className = 'ocs__btn small accent fill';
    join.setAttribute('href', this.link?.getAttribute('href') ?? '');
    join.textContent = this.t.join;
    this.notice.replaceChildren(document.createTextNode(`${CallModel.format(this.t.live_call, { count: room.participantCount })} `), join);
  }

  isOpen(kind, id) {
    return this.current?.kind === kind && this.current.id === id;
  }

  clear() {
    this.notice?.replaceChildren();
  }
}
