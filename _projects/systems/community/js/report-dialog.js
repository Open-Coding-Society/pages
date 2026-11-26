// Report a message: pick one of the group's recent messages from other members, a reason and
// an optional note, and it goes to the moderators' review queue. The reported member never
// sees who reported them. Report lives in the group's header because Messages' message rows
// have no place for another action yet; a Report item in each message's More menu is a
// shared change for Messages (see the Community README).
import { Dom } from './dom.js';
import { ModerationRules } from './moderation.js';

const RECENT = 8;

/**
 * The Report a message dialog (#communityReportDialog in the page).
 */
export class ReportDialog {
  /**
   * @param {{app: CommunityApp}} options
   */
  constructor({ app }) {
    this.app = app;
    const id = name => app.byId(`communityReport${name}`);
    this.el = { dialog: id('Dialog'), form: id('Form'), pick: id('Pick'), reason: id('Reason'), note: id('Note'), status: id('Status'), send: id('Send') };
    this.channel = null;
    this.legend = this.el.pick.querySelector('legend');
    this.dialog = app.kit.createDialog(this.el.dialog, { onClose: () => { this.channel = null; } });
    this.el.reason.replaceChildren(...ModerationRules.REASONS.map((reason) => {
      const option = Dom.el('option', '', app.texts.say(`report.reasons.${reason}`));
      option.value = reason;
      return option;
    }));
    this.el.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  /**
   * @param {object} channel the series group
   * @param {HTMLElement} opener
   */
  async open(channel, opener) {
    const { backend, kit } = this.app;
    this.channel = channel;
    const me = backend.viewer();
    let messages = [];
    try {
      messages = (await backend.groupMessages(channel.id)).map(kit.groupMessage);
    } catch (error) {
      console.warn('Community: could not load messages to report', error);
    }
    // A pin is a message in Messages ([[pin:<id>]]) but has no words of its own to report.
    const others = messages
      .filter(message => message.senderKey !== me.name && !kit.Conversation.extractPinMarker(message.body).action)
      .slice(-RECENT).reverse();
    const choices = others.map((message, index) => {
      const radio = Dom.attrs(Dom.el('input'), { type: 'radio', name: 'communityReportMessage', value: message.id, id: `communityReportMessage${index}`, required: true });
      if (index === 0) radio.checked = true;
      const { html } = kit.richText.extractReplyMarker(message.body);
      const label = Dom.el('label', 'ocs__keypoint', radio, Dom.avatar(message.senderName),
        Dom.el('div', '', Dom.el('strong', '', message.senderName), ' ', Dom.el('small', '', Dom.when(message.sentAt)),
          Dom.el('div', '', kit.richText.replyExcerpt(html))));
      label.htmlFor = radio.id;
      return label;
    });
    this.el.pick.replaceChildren(this.legend, ...(choices.length ? choices : [Dom.el('small', '', this.say('report.none'))]));
    this.el.reason.value = ModerationRules.REASONS[0];
    this.el.note.value = '';
    this.el.send.disabled = !choices.length;
    this.el.status.textContent = '';
    this.dialog.open(opener);
  }

  async submit() {
    const picked = this.el.pick.querySelector('input[name="communityReportMessage"]:checked');
    if (!this.channel || !picked || this.el.send.disabled) return;
    this.el.send.disabled = true;
    try {
      await this.app.backend.report({ channelId: this.channel.id, messageId: picked.value, reason: this.el.reason.value, note: this.el.note.value });
      this.dialog.close();
      this.app.notice(this.say('report.sent'));
    } catch (error) {
      console.warn('Community: could not send the report', error);
      this.el.status.textContent = this.app.texts.refusal(error, 'report.failed', { org: this.app.org });
    } finally {
      this.el.send.disabled = false;
    }
  }
}
