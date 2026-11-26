// Groups: each series' group chat, where its LPs talk with each other and with staff. The chat
// is Messages' own thread pane (thread.js createThread) running on the demo backend: sending,
// editing, deleting, replies, Add to calendar and shared-file notes all work as on /dm. A
// member a moderator muted gets the same pane read-only, with a note saying until when. Under
// the chat are the series' documents, which only staff share.
import { CommunityRoles } from './community-roles.js';
import { Dom } from './dom.js';

/**
 * The Groups tab.
 */
export class GroupsView {
  /**
   * @param {{root: HTMLElement, app: CommunityApp}} options
   */
  constructor({ root, app }) {
    this.root = root;
    this.app = app;
    this.backend = app.backend;
    this.kit = app.kit;
    this.me = app.me;
    this.group = null;
    this.thread = null;
    this.socket = null;
    this.stops = [];
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  mount() {
    this.groups = this.backend.channels().filter(channel => channel.kind === 'series');
    if (!this.groups.length) {
      this.root.replaceChildren(Dom.el('div', 'ocs__callout', this.say('groups.none')));
      return;
    }
    this.pills = Dom.attrs(Dom.el('div', 'ocs__links'), { role: 'group', 'aria-label': this.say('groups.list') });
    this.buttons = new Map(this.groups.map((group) => {
      const button = Dom.button(group.title, { className: 'ocs__btn small pill', onClick: () => this.select(group) });
      this.pills.appendChild(button);
      return [group.id, button];
    }));
    this.title = Dom.el('h3', 'ocs__section-title');
    const report = Dom.button(this.say('groups.report'), { className: 'ocs__btn small', icon: 'fa-flag', onClick: event => this.app.reportDialog.open(this.group, event.currentTarget) });
    // hidden sits on plain divs: ocs__callout and ocs__links set their own layout.
    this.mutedNote = Dom.el('div', 'ocs__callout');
    this.muted = Dom.el('div', '', this.mutedNote);
    this.muted.hidden = true;
    this.chat = Dom.el('div');
    this.documents = Dom.el('div', 'ocs__stack');
    this.root.replaceChildren(Dom.el('div', 'ocs__stack',
      this.pills,
      Dom.el('div', 'ocs__card-header', this.title, Dom.el('div', 'ocs__links', report)),
      this.muted,
      this.chat,
      Dom.el('div', 'ocs__card ocs__stack', Dom.el('strong', '', this.say('groups.documents')), this.documents)));
    this.stops.push(
      this.backend.on('files', ({ channelId }) => { if (channelId === this.group?.id) this.renderDocuments(); }),
      this.backend.on('moderation', () => { if (this.group) this.refreshMute(); }),
    );
    this.select(this.groups[0]);
  }

  /** @param {{channelId: number}} options opens that group */
  focus({ channelId }) {
    const group = this.groups?.find(entry => entry.id === Number(channelId));
    if (group) this.select(group);
  }

  select(group) {
    this.group = group;
    this.buttons.forEach((button, id) => {
      const selected = id === group.id;
      ['accent', 'fill'].forEach(token => button.classList.toggle(token, selected));
      button.setAttribute('aria-pressed', String(selected));
    });
    this.title.textContent = group.title;
    this.openChat();
    this.renderDocuments();
  }

  /** The chat, read-only while the viewer is muted here. */
  openChat() {
    this.thread?.destroy();
    this.socket?.disconnect();
    const mute = this.backend.muteOf(this.group.id);
    this.mutedUntil = mute?.until || '';
    clearTimeout(this.muteTimer);
    // A mute that runs out while the chat is open gives the composer back.
    if (mute) this.muteTimer = setTimeout(() => this.refreshMute(), Math.min(Math.max(0, Date.parse(mute.until) - Date.now()) + 1000, 2 ** 31 - 1));
    this.mutedNote.textContent = mute ? this.say('groups.muted', { group: this.group.title, until: Dom.when(mute.until) }) : '';
    this.muted.hidden = !mute;
    const pane = Dom.threadPane({ readOnly: Boolean(mute), cancel: this.say('groups.cancel_edit'), send: this.say('groups.send') });
    this.chat.replaceChildren(Dom.el('div', 'dm dm--embed', pane.section));
    this.socket = this.backend.openSocket();
    this.thread = this.kit.createThread({
      elements: pane.elements,
      api: this.backend,
      socket: this.socket,
      richText: this.kit.richText,
      me: this.me,
      readOnly: Boolean(mute),
      onSchedule: (message, opener) => this.app.scheduleMessage(message, opener),
      emptyState: { title: this.say('groups.empty_title'), hint: this.say('groups.empty_hint') },
      texts: { placeholder: this.say('groups.placeholder', { group: this.group.title }), deleted: this.say('groups.deleted'), send: this.say('groups.send') },
    });
    this.thread.open('group', this.group.id, { title: this.group.title, subtitle: '' });
  }

  /** A mute that starts or ends while the chat is open changes the pane. */
  refreshMute() {
    const until = this.backend.muteOf(this.group.id)?.until || '';
    if (until !== this.mutedUntil) this.openChat();
  }

  async renderDocuments() {
    const group = this.group;
    let files = [];
    try {
      files = await this.backend.groupFiles(group.id);
    } catch (error) {
      console.warn('Community: could not list the documents', error);
    }
    if (group !== this.group) return;
    const rows = files.map(file => Dom.el('li', 'ocs__stack',
      Dom.el('div', 'ocs__keypoint', Dom.icon('fa-file-lines'), Dom.el('strong', '', file.filename)),
      Dom.el('small', '', this.say('groups.shared_by', { name: file.sharedBy, date: Dom.when(file.sharedAt) })),
      Dom.el('div', 'ocs__links', Dom.button(this.say('groups.download'), { className: 'ocs__btn small', icon: 'fa-download', onClick: () => this.download(file) }))));
    this.documents.replaceChildren(
      rows.length ? Dom.el('ul', 'ocs__entity-list', ...rows) : Dom.el('small', '', this.say('groups.no_documents')),
      CommunityRoles.isStaff(this.me) ? this.sharer() : Dom.el('small', '', this.say('groups.share_hint')));
  }

  /** Saves a shared document, whose bytes come as base64 the way Spring sends them. */
  download(file) {
    const bytes = Uint8Array.from(atob(file.base64Data || ''), character => character.charCodeAt(0));
    this.kit.saveBlob(new Blob([bytes]), file.filename);
  }

  sharer() {
    const input = Dom.attrs(Dom.el('input', 'ocs__input'), { id: 'communityShareFile', type: 'file' });
    const status = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    const share = Dom.button(this.say('groups.share'), {
      className: 'ocs__btn small',
      icon: 'fa-upload',
      onClick: async () => {
        const file = input.files?.[0];
        if (!file) return;
        // Reading the file takes a moment; it goes to the group it was shared in.
        const groupId = this.group.id;
        try {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
          await this.backend.uploadGroupFile(groupId, file.name, dataUrl.slice(dataUrl.indexOf(',') + 1));
          // Sharing re-renders the documents (and this form), so the confirmation goes on the page.
          this.app.notice(this.say('groups.shared', { name: file.name }));
        } catch (error) {
          console.warn('Community: could not share the file', error);
          status.textContent = this.app.texts.refusal(error, 'groups.share_failed', { org: this.app.org });
        }
      },
    });
    return Dom.el('div', 'ocs__stack', Dom.field(this.say('groups.share'), input), Dom.el('div', 'ocs__links', share), status);
  }

  destroy() {
    clearTimeout(this.muteTimer);
    this.thread?.destroy();
    this.socket?.disconnect();
    this.stops.forEach(stop => stop());
    this.stops = [];
  }
}
