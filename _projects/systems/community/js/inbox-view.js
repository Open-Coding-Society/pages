// Inbox: direct messages, under the DM rule (dm-policy.js): an LP messages staff and
// moderators, and staff message anyone. The conversation is Messages' own thread pane in its
// direct-message mode, on the demo backend. New message offers only the people the rule
// allows, and the backend refuses anyone else.
import { CommunityRoles } from './community-roles.js';
import { DmPolicy } from './dm-policy.js';
import { Dom } from './dom.js';

/**
 * The Inbox tab.
 */
export class InboxView {
  /**
   * @param {{root: HTMLElement, app: CommunityApp}} options
   */
  constructor({ root, app }) {
    this.root = root;
    this.app = app;
    this.backend = app.backend;
    this.kit = app.kit;
    this.me = app.me;
    this.conversation = null;
    this.thread = null;
    this.socket = null;
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  /** The other person in a conversation. */
  otherIn(conversation) {
    return conversation.participants.find(person => person.uid !== this.me.uid) || conversation.participants[0];
  }

  mount() {
    this.pills = Dom.attrs(Dom.el('div', 'ocs__links'), { role: 'group', 'aria-label': this.say('inbox.list') });
    const start = Dom.button(this.say('inbox.new'), { className: 'ocs__btn small', icon: 'fa-pen-to-square', onClick: event => this.app.newMessage.open(event.currentTarget) });
    this.title = Dom.el('h3', 'ocs__section-title');
    this.chat = Dom.el('div');
    this.root.replaceChildren(Dom.el('div', 'ocs__stack',
      Dom.el('small', '', this.say(CommunityRoles.canModerate(this.me) ? 'inbox.rule_staff' : 'inbox.rule_lp')),
      Dom.el('div', 'ocs__card-header', this.pills, Dom.el('div', 'ocs__links', start)),
      this.title,
      this.chat));
    this.load();
  }

  async load(openId = null) {
    let conversations = [];
    try {
      conversations = await this.backend.conversations();
    } catch (error) {
      console.warn('Community: could not load conversations', error);
    }
    // The viewer may have changed while this waited; that view is gone, so nothing opens.
    if (this.destroyed) return;
    this.conversations = conversations;
    this.buttons = new Map(conversations.map((conversation) => {
      const button = Dom.button(this.otherIn(conversation).name, { className: 'ocs__btn small pill', onClick: () => this.select(conversation) });
      return [conversation.id, button];
    }));
    this.pills.replaceChildren(...(conversations.length ? this.buttons.values() : [Dom.el('small', '', this.say('inbox.none'))]));
    const first = conversations.find(conversation => conversation.id === openId) || conversations[0];
    if (first) this.select(first);
  }

  /** Opens a conversation the New message dialog started. */
  openConversation(conversation) {
    this.app.show('inbox');
    this.load(conversation.id);
  }

  select(conversation) {
    this.conversation = conversation;
    this.buttons.forEach((button, id) => {
      const selected = id === conversation.id;
      ['accent', 'fill'].forEach(token => button.classList.toggle(token, selected));
      button.setAttribute('aria-pressed', String(selected));
    });
    const other = this.otherIn(conversation);
    this.title.textContent = other.name;
    this.thread?.destroy();
    this.socket?.disconnect();
    const pane = Dom.threadPane({ readOnly: false, cancel: this.say('inbox.cancel'), send: this.say('groups.send') });
    this.chat.replaceChildren(Dom.el('div', 'dm dm--embed', pane.section));
    this.socket = this.backend.openSocket();
    this.thread = this.kit.createThread({
      elements: pane.elements,
      api: this.backend,
      socket: this.socket,
      richText: this.kit.richText,
      me: this.me,
      onSchedule: (message, opener) => this.app.scheduleMessage(message, opener),
      emptyState: { title: this.say('inbox.empty_title'), hint: this.say('inbox.empty_hint') },
      texts: { placeholder: this.say('inbox.placeholder', { name: other.name }), send: this.say('groups.send') },
    });
    this.thread.open('dm', conversation.id, { title: other.name, subtitle: '' });
  }

  destroy() {
    this.destroyed = true;
    this.thread?.destroy();
    this.socket?.disconnect();
  }
}

/**
 * The New message dialog (#communityNewDialog in the page), made once for the page.
 */
export class NewMessageDialog {
  /**
   * @param {{app: CommunityApp}} options
   */
  constructor({ app }) {
    this.app = app;
    const id = name => app.byId(`communityNew${name}`);
    this.el = { dialog: id('Dialog'), form: id('Form'), rule: id('Rule'), to: id('To'), status: id('Status') };
    this.dialog = app.kit.createDialog(this.el.dialog);
    this.el.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  open(opener) {
    const me = this.app.backend.viewer();
    const people = DmPolicy.recipientsFor(me, this.app.backend.people(), { mode: this.app.setup.dm_policy || 'staff-only' });
    this.el.rule.textContent = this.app.texts.say(CommunityRoles.canModerate(me) ? 'inbox.rule_staff' : 'inbox.rule_lp', { org: this.app.org });
    this.el.to.replaceChildren(...people.map((person) => {
      const option = Dom.el('option', '', this.app.personLabel(person));
      option.value = String(person.id);
      return option;
    }));
    this.el.status.textContent = '';
    this.dialog.open(opener);
  }

  async submit() {
    try {
      const conversation = await this.app.backend.startConversation([Number(this.el.to.value)]);
      this.dialog.close();
      this.app.show('inbox');
      this.app.views.get('inbox').openConversation(conversation);
    } catch (error) {
      console.warn('Community: could not start the conversation', error);
      this.el.status.textContent = this.app.texts.refusal(error, 'inbox.start_failed', { org: this.app.org });
    }
  }
}
