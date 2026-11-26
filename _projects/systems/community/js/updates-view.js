// Updates: staff to the members, read like a course's announcement channel. The messages are
// drawn by Messages' own log (message-log.js) with the chat's classes; an [[event:...]] marker
// on an update (Courses' calendar-model.js) shows as a line and lands on the calendar. Every
// member gets Reply in your group and Add to calendar on each update. Nobody edits a sent
// update: a correction is a new one, which a second staff member approves like any other.
// Polls are the microblog's surveys, counted with its getSurveyResults.
import { CommunityRoles } from './community-roles.js';
import { Dom } from './dom.js';

/**
 * The Updates tab.
 */
export class UpdatesView {
  /**
   * @param {{root: HTMLElement, app: CommunityApp}} options
   */
  constructor({ root, app }) {
    this.root = root;
    this.app = app;
    this.backend = app.backend;
    this.kit = app.kit;
    this.me = app.me;
    this.channel = null;
    this.logChannel = null; // the channel whose messages the log is showing
    this.early = []; // live changes that arrive before that channel's history
    this.ticket = 0;
    this.stops = [];
  }

  say(key, values = {}) {
    return this.app.texts.say(key, { org: this.app.org, ...values });
  }

  mount() {
    const { richText } = this.kit;
    this.channels = this.backend.channels().filter(channel => channel.kind === 'updates');
    this.pills = Dom.attrs(Dom.el('div', 'ocs__links'), { role: 'group', 'aria-label': this.say('updates.channels') });
    this.buttons = new Map(this.channels.map((channel) => {
      const button = Dom.button(channel.title, { className: 'ocs__btn small pill', onClick: () => this.select(channel) });
      this.pills.appendChild(button);
      return [channel.id, button];
    }));
    const staff = CommunityRoles.isStaff(this.me);
    this.polls = Dom.el('div', 'ocs__stack');
    this.logElement = Dom.attrs(Dom.el('div', 'dm__log'), { role: 'log', 'aria-live': 'polite', tabindex: '0' });
    this.log = this.kit.createMessageLog(this.logElement, {
      richText,
      me: this.me,
      // Only an own message gets edit and delete, and every update is drawn as someone else's.
      onEdit: () => {},
      onDelete: () => {},
      // The channel the log is showing, which lags the pills while a new channel loads.
      onReply: message => this.logChannel && this.app.replyInGroup(message, this.logChannel, this.root.ownerDocument.activeElement),
      onSchedule: (message, opener) => this.app.scheduleMessage(message, opener),
      texts: { replyMessage: this.say('updates.reply') },
      formatBody: body => this.formatBody(body),
    });
    // The updates come first and their polls after, so a phone opens on the news.
    this.root.replaceChildren(Dom.el('div', 'ocs__stack',
      this.pills,
      Dom.el('small', '', this.say(staff ? 'updates.hint_staff' : 'updates.hint_lp')),
      Dom.el('div', 'dm dm--embed', Dom.el('section', 'dm__thread', this.logElement)),
      this.polls,
      staff ? this.writer() : null));
    this.socket = this.backend.openSocket();
    this.stops.push(this.backend.on('polls', ({ channelId }) => {
      if (channelId === this.channel?.id) this.renderPolls();
    }));
    if (this.channels.length) this.select(this.channels[0]);
  }

  /**
   * An update's body as the log shows it: the words, then one line per event it carries.
   * @param {string} body
   * @returns {string} HTML for the chat's sanitizer
   */
  formatBody(body) {
    const { html, events } = this.kit.extractEventMarkers(String(body ?? ''));
    const lines = events.map(event => Dom.escape(this.say('updates.event_line', {
      title: event.title, date: this.kit.formatShortDate(event.date),
    })));
    return [html, ...lines].filter(Boolean).join('<br>');
  }

  /** @param {{channelId: number}} options opens that channel */
  focus({ channelId }) {
    const channel = this.channels.find(entry => entry.id === Number(channelId));
    if (channel) this.select(channel);
  }

  select(channel) {
    this.channel = channel;
    this.buttons.forEach((button, id) => {
      const selected = id === channel.id;
      ['accent', 'fill'].forEach(token => button.classList.toggle(token, selected));
      button.setAttribute('aria-pressed', String(selected));
    });
    this.socket.follow(`/topic/group/${channel.id}`, frame => this.onFrame(channel.id, frame));
    this.loadLog();
    this.renderPolls();
  }

  async loadLog() {
    const ticket = ++this.ticket;
    const channel = this.channel;
    // Until this channel's history arrives, the log shows the last one's, and live messages
    // for this channel wait in `early`.
    this.logChannel = null;
    this.early = [];
    let raw;
    try {
      raw = await this.backend.groupMessages(channel.id);
    } catch (error) {
      if (ticket !== this.ticket) return;
      this.log.clear();
      this.log.showEmpty(this.app.texts.refusal(error, 'errors.generic', { org: this.app.org }));
      return;
    }
    if (ticket !== this.ticket) return;
    this.log.clear();
    if (!raw.length) this.log.showEmpty(this.say('updates.empty_title'), this.say('updates.empty_hint'));
    const messages = raw.map(this.kit.groupMessage);
    messages.forEach(message => this.log.append(message, false));
    this.logChannel = channel;
    const loaded = new Set(messages.map(message => String(message.id)));
    this.early.forEach(frame => this.applyFrame(frame, loaded));
    this.early = [];
  }

  onFrame(channelId, frame) {
    if (channelId !== this.channel?.id) return;
    if (this.logChannel !== this.channel) this.early.push(frame);
    else this.applyFrame(frame);
  }

  /**
   * One live change to the log. A new message the history already had isn't added twice.
   * @param {object} frame a Spring group frame
   * @param {Set<string>} [loaded] ids of the messages the history brought
   */
  applyFrame(frame, loaded = new Set()) {
    const change = this.kit.classifyGroupEvent(frame);
    if (change.type === 'message' && !loaded.has(String(change.message.id))) this.log.append(change.message, false);
    else if (change.type === 'edit') this.log.updateBody(change.id, change.body);
    else if (change.type === 'delete') this.log.markDeleted(change.id);
  }

  /* ---------- polls ---------- */

  votes(count) {
    return count === 1 ? this.say('updates.vote_one') : this.say('updates.votes', { count });
  }

  async renderPolls() {
    const channel = this.channel;
    const polls = await this.backend.polls(channel.id).catch(() => []);
    if (channel !== this.channel) return;
    this.polls.replaceChildren(...polls.map(poll => this.pollCard(poll)));
  }

  // Each choice is one of OCS's picker cards (ocs__hub-card), the grammar Profile's persona
  // groups use: the member's own vote is the selected card.
  pollCard(poll) {
    const results = this.kit.getSurveyResults(poll, this.me.id);
    const choices = Dom.attrs(Dom.el('div', 'ocs__hub-grid'), { role: 'group', 'aria-label': poll.content });
    const status = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    results.options.forEach((option, index) => {
      const mine = results.myChoice === index;
      const percent = results.total ? Math.round((option.votes / results.total) * 100) : 0;
      const choice = Dom.el('button', mine ? 'ocs__hub-card ocs__hub-card--selected' : 'ocs__hub-card',
        Dom.el('strong', 'ocs__hub-card-title', option.label),
        Dom.el('small', '', this.say('updates.share', { votes: this.votes(option.votes), percent })),
        mine ? Dom.el('div', '', Dom.pill(this.say('updates.your_vote'), 'good')) : null);
      choice.type = 'button';
      Dom.attrs(choice, { 'aria-pressed': String(mine) });
      choice.addEventListener('click', () => this.vote(poll.id, index, status));
      choices.appendChild(choice);
    });
    return Dom.el('div', 'ocs__card ocs__stack',
      Dom.el('div', 'ocs__card-header', Dom.el('strong', '', poll.content), Dom.pill(this.votes(results.total))),
      choices,
      status);
  }

  async vote(pollId, index, status) {
    try {
      await this.backend.vote(pollId, index);
    } catch (error) {
      console.warn('Community: could not save the vote', error);
      status.textContent = this.say('updates.vote_failed');
    }
  }

  /* ---------- staff: write an update, start a poll ---------- */

  writer() {
    const { richText } = this.kit;
    this.composer = richText.createRichComposer({ placeholder: this.say('updates.write'), maxLength: 2000, onSubmit: () => this.submitUpdate() });
    this.writerStatus = Dom.attrs(Dom.el('p', 'ocs__text'), { role: 'status' });
    const send = Dom.button(this.say('updates.send_for_approval'), { className: 'ocs__btn accent fill', icon: 'fa-paper-plane', onClick: () => this.submitUpdate() });
    this.question = Dom.attrs(Dom.el('input', 'ocs__input'), { id: 'communityPollQuestion', type: 'text', maxlength: '200' });
    this.choices = Dom.attrs(Dom.el('textarea', 'ocs__input'), { id: 'communityPollChoices', rows: '3' });
    const post = Dom.button(this.say('updates.poll_post'), { className: 'ocs__btn', icon: 'fa-square-poll-vertical', onClick: () => this.createPoll() });
    const poll = Dom.el('details', '',
      Dom.el('summary', '', this.say('updates.new_poll')),
      Dom.el('div', 'ocs__stack',
        Dom.field(this.say('updates.poll_question'), this.question),
        Dom.field(this.say('updates.poll_choices'), this.choices),
        Dom.el('div', 'ocs__links', post)));
    return Dom.el('div', 'ocs__card ocs__stack',
      Dom.el('strong', '', this.say('updates.write')), this.composer.element, Dom.el('div', 'ocs__links', send), this.writerStatus, poll);
  }

  async submitUpdate() {
    if (!this.composer || this.composer.isEmpty() || this.composer.isOverLimit()) return;
    try {
      await this.backend.submitUpdate(this.channel.id, this.composer.getHTML());
      this.composer.clear();
      this.writerStatus.textContent = this.say('updates.sent_for_approval');
    } catch (error) {
      console.warn('Community: could not send the update', error);
      this.writerStatus.textContent = this.app.texts.refusal(error, 'updates.send_failed', { org: this.app.org });
    }
  }

  async createPoll() {
    try {
      await this.backend.createPoll(this.channel.id, this.question.value, this.choices.value.split('\n'));
      this.question.value = '';
      this.choices.value = '';
      this.writerStatus.textContent = this.say('updates.poll_posted');
    } catch (error) {
      // The microblog's own words say what's wrong with the choices.
      this.writerStatus.textContent = error.status === 400 && !String(error.message).startsWith('Community:')
        ? error.message
        : this.app.texts.refusal(error, 'errors.generic', { org: this.app.org });
    }
  }

  destroy() {
    this.ticket += 1;
    this.socket?.disconnect();
    this.log?.destroy();
    this.composer?.destroy();
    this.stops.forEach(stop => stop());
    this.stops = [];
  }
}
