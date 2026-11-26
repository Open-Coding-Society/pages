// Reply in your group: a reply to an update goes into one of the member's series groups with
// the update quoted, using Messages' own reply marker ([[reply:...]] from chat-reply.js), so it
// shows as a quoted reply in that group's chat. Nobody replies to every member at once.
// An LP in two series picks the group; an LP in none is told why.
import { ChannelRules } from './channel-rules.js';
import { Dom } from './dom.js';

/**
 * The Reply in your group dialog (#communityReplyDialog in the page).
 */
export class ReplyDialog {
  /**
   * @param {{app: CommunityApp}} options
   */
  constructor({ app }) {
    this.app = app;
    const id = name => app.byId(`communityReply${name}`);
    this.el = {
      dialog: id('Dialog'), form: id('Form'), quote: id('Quote'), groupField: id('GroupField'),
      group: id('Group'), composerHost: id('Composer'), status: id('Status'), send: id('Send'),
    };
    this.reply = null;
    this.sending = false;
    this.dialog = app.kit.createDialog(this.el.dialog, { onClose: () => { this.reply = null; } });
    this.composer = app.kit.richText.createRichComposer({ placeholder: app.texts.say('reply.placeholder'), maxLength: 2000, onSubmit: () => this.submit() });
    this.el.composerHost.replaceChildren(this.composer.element);
    this.el.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  /**
   * @param {object} message the update, in Messages' message shape
   * @param {object} updatesChannel where the update was posted
   * @param {HTMLElement} opener gets focus back when the dialog closes
   */
  open(message, updatesChannel, opener) {
    const { backend, kit } = this.app;
    const me = backend.viewer();
    const targets = ChannelRules.replyTargets(me, updatesChannel, backend.channels(), { isMuted: channelId => Boolean(backend.muteOf(channelId)) });
    const { html } = kit.extractEventMarkers(message.body);
    this.reply = { id: message.id, sender: message.senderName, excerpt: kit.richText.replyExcerpt(html) };
    this.el.quote.replaceChildren(kit.richText.renderReplyQuote(this.reply));
    this.el.group.replaceChildren(...targets.map((channel) => {
      const option = Dom.el('option', '', channel.title);
      option.value = String(channel.id);
      return option;
    }));
    // One group needs no choice; none means there's nowhere to reply.
    this.el.groupField.hidden = targets.length < 2;
    this.composer.clear();
    this.composer.setEnabled(targets.length > 0);
    this.el.send.disabled = targets.length === 0;
    this.el.status.textContent = targets.length ? '' : this.say('reply.no_group');
    this.dialog.open(opener);
    if (targets.length) this.composer.focus();
  }

  async submit() {
    if (this.sending || !this.reply || this.el.send.disabled) return;
    if (this.composer.isEmpty()) {
      this.el.status.textContent = this.say('reply.empty');
      return;
    }
    const { backend, kit } = this.app;
    const channelId = Number(this.el.group.value);
    const title = this.el.group.selectedOptions[0]?.textContent || '';
    this.sending = true;
    this.el.send.disabled = true;
    try {
      await backend.sendGroupMessage(channelId, kit.richText.addReplyMarker(this.composer.getHTML(), this.reply), null);
      this.dialog.close();
      this.app.openGroup(channelId);
      this.app.notice(this.say('reply.sent', { group: title }));
    } catch (error) {
      console.warn('Community: could not post the reply', error);
      this.el.status.textContent = this.app.texts.refusal(error, 'reply.failed', { org: this.app.org });
    } finally {
      this.sending = false;
      this.el.send.disabled = false;
    }
  }

  destroy() {
    this.composer.destroy();
  }
}
