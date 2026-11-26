// The demo's data and rules, all in the browser. It starts from an organization's setup file
// (data/demo.yml) and keeps what happens while the page is open: messages and their
// versions, direct messages, documents, polls, pending updates, reports, mutes and the
// moderator log. Every rule a real server has to make is made here, not in the page, so the
// demo shows where each check belongs (README, "Roles and rules"). Nothing is erased:
// an edit adds a version, and a deleted or hidden message keeps its text for the records.
import { CalendarWeeks } from './calendar-weeks.js';
import { ChannelRules } from './channel-rules.js';
import { CommunityRoles } from './community-roles.js';
import { DmPolicy } from './dm-policy.js';
import { ModerationRules } from './moderation.js';

// The microblog's vote reply (assets/js/api/microblog.js): the marker, then the choice's index.
const VOTE_MARKER = '[[microblog:vote]]';

/**
 * A refused request, the way a server refuses one: an HTTP status and a reason word that
 * data/texts.yml has under errors.
 */
export class RuleError extends Error {
  /**
   * @param {string} reason such as 'staff-only'
   * @param {{status?: number, message?: string}} options
   */
  constructor(reason, { status = 403, message = '' } = {}) {
    super(message || `Community: refused (${reason})`);
    this.name = 'RuleError';
    this.status = status;
    this.reason = reason;
  }
}

/**
 * The demo's state and its server-side rules. Calls act as the current viewer (viewAs).
 */
export class DemoStore {
  /**
   * @param {object} setup the organization's setup (data/demo.yml)
   * @param {{now?: function(): Date, encodeEventMarker?: function, extractEventMarkers?: function}} options
   *   the two marker functions are Courses' (calendar-model.js); events need them
   */
  constructor(setup, { now = () => new Date(), encodeEventMarker = null, extractEventMarkers = null } = {}) {
    if (!setup || !Array.isArray(setup.people) || !Array.isArray(setup.channels)) {
      throw new TypeError('DemoStore: the setup needs people and channels');
    }
    this.setup = setup;
    this.now = now;
    this.extractEventMarkers = extractEventMarkers;
    this.lastId = 1000;
    this.people = new Map(setup.people.map(person => [person.id, {
      id: person.id, uid: person.uid, name: person.name,
      roles: person.roles.map(name => ({ name })), series: [...(person.series || [])],
    }]));
    this.channels = new Map(setup.channels.map(channel => [channel.id, { ...channel }]));
    this.messages = new Map([...this.channels.keys()].map(id => [id, []]));
    this.files = new Map([...this.channels.keys()].map(id => [id, []]));
    this.polls = new Map([...this.channels.keys()].map(id => [id, []]));
    this.conversations = new Map();
    this.reports = [];
    this.mutes = new Map();
    this.log = [];
    this.pending = [];
    this.personalEvents = new Map();
    this.viewerId = setup.personas?.[0] ?? setup.people[0].id;
    this.seed(encodeEventMarker);
  }

  /* ---------- helpers ---------- */

  /** @returns {number} a new id, unique in this store */
  newId() {
    this.lastId += 1;
    return this.lastId;
  }

  /**
   * Plain text as safe HTML, for the setup's text.
   * @param {string} text
   * @returns {string}
   */
  static escape(text) {
    return String(text ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[character]));
  }

  /**
   * Text as base64, the way Spring sends a shared file's bytes.
   * @param {string} text
   * @returns {string}
   */
  static base64(text) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(String(text))));
  }

  /** @returns {string} now as an ISO time */
  stamp() {
    return this.now().toISOString();
  }

  /**
   * @param {number} minutes
   * @returns {string} that many minutes before now, as an ISO time
   */
  ago(minutes) {
    return new Date(this.now().getTime() - Number(minutes || 0) * 60 * 1000).toISOString();
  }

  /** @returns {string} today's local date as YYYY-MM-DD */
  today() {
    const date = this.now();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /* ---------- the setup ---------- */

  seed(encodeEventMarker) {
    const keyed = new Map();
    for (const item of this.setup.messages || []) {
      let html = DemoStore.escape(item.text);
      if (item.event) {
        if (typeof encodeEventMarker !== 'function') throw new TypeError('DemoStore: the setup has events, so pass encodeEventMarker');
        html = `${html} ${encodeEventMarker({
          // A seeded event never lands on a weekend, which the Monday-Friday week leaves out.
          id: `e${this.newId()}`, date: CalendarWeeks.weekdayOnOrAfter(CalendarWeeks.addDays(this.today(), item.event.days_from_today)),
          priority: 'P2', type: 'event', title: item.event.title, periods: [], description: '',
        })}`;
      }
      const message = this.addMessage(item.channel, item.by, html, this.ago(item.minutes_ago));
      if (item.key) keyed.set(item.key, message);
    }
    for (const item of this.setup.files || []) {
      this.files.get(item.channel).push({
        filename: item.name, base64Data: DemoStore.base64(item.text), sharedBy: item.by, sharedAt: this.ago(item.minutes_ago),
      });
    }
    for (const item of this.setup.polls || []) {
      const at = this.ago(item.minutes_ago);
      this.polls.get(item.channel).push({
        id: this.newId(), channelId: item.channel, userId: item.by, userName: this.person(item.by).name,
        content: item.question, survey: { options: [...item.options] }, createdAt: at,
        replies: (item.votes || []).map(vote => ({
          id: this.newId(), userId: vote.by, userName: this.person(vote.by).name, content: `${VOTE_MARKER} ${vote.choice}`, createdAt: at,
        })),
      });
    }
    for (const item of this.setup.reports || []) {
      const message = keyed.get(item.message);
      this.reports.push({
        id: this.newId(), channelId: message.channelId, messageId: message.id, reporterId: item.by,
        reason: item.reason, note: item.note || '', at: this.ago(item.minutes_ago), status: 'open', resolution: null,
      });
    }
    for (const item of this.setup.dms || []) {
      const conversation = { id: this.newId(), participantIds: [...item.between], messages: [] };
      for (const entry of item.messages) {
        const at = this.ago(entry.minutes_ago);
        const body = DemoStore.escape(entry.text);
        conversation.messages.push({
          id: this.newId(), senderId: entry.by, body, sentAt: at, image: null, edited: false, deleted: null, versions: [{ html: body, at }],
        });
      }
      this.conversations.set(conversation.id, conversation);
    }
    for (const item of this.setup.pending_updates || []) {
      this.pending.push({ id: this.newId(), channelId: item.channel, authorId: item.by, html: DemoStore.escape(item.text), at: this.ago(item.minutes_ago) });
    }
  }

  /* ---------- people and channels ---------- */

  /**
   * Acts as another person from now on.
   * @param {number} personId
   */
  viewAs(personId) {
    this.person(personId);
    this.viewerId = Number(personId);
  }

  /** @returns {object} the current viewer */
  viewer() {
    return this.person(this.viewerId);
  }

  /**
   * @param {number|string} id
   * @returns {object}
   * @throws {RuleError} 404 when there's no such person
   */
  person(id) {
    const person = this.people.get(Number(id));
    if (!person) throw new RuleError('not-found', { status: 404 });
    return person;
  }

  /**
   * @param {number|string} id
   * @returns {object}
   * @throws {RuleError} 404 when there's no such channel
   */
  channel(id) {
    const channel = this.channels.get(Number(id));
    if (!channel) throw new RuleError('not-found', { status: 404 });
    return channel;
  }

  /** @returns {object[]} the channels the viewer can read, in setup order */
  readableChannels() {
    return ChannelRules.readable(this.viewer(), [...this.channels.values()]);
  }

  requireRead(channel) {
    if (!ChannelRules.canRead(this.viewer(), channel)) throw new RuleError('not-member');
  }

  /**
   * Checks the viewer may follow a live topic, as a server checks a socket subscription: a
   * group's topic needs read access to that group, and a direct message's topic needs the
   * viewer in the conversation. Any other topic doesn't exist here.
   * @param {string} topic such as /topic/group/201 or /topic/dm/7
   */
  requireFollow(topic) {
    const [, kind, id] = /^\/topic\/(group|dm)\/(\d+)$/.exec(String(topic ?? '')) || [];
    if (kind === 'group') this.requireRead(this.channel(Number(id)));
    else if (kind === 'dm') this.conversation(Number(id));
    else throw new RuleError('not-found', { status: 404 });
  }

  requireModerator() {
    if (!CommunityRoles.canModerate(this.viewer())) throw new RuleError('moderators-only');
  }

  requireStaff() {
    if (!CommunityRoles.isStaff(this.viewer())) throw new RuleError('staff-only');
  }

  /**
   * A person's mute in a channel while it lasts; an ended mute is null.
   * @param {number} channelId
   * @param {number} personId
   * @returns {{until: string, by: number, note: string}|null}
   */
  muteOf(channelId, personId) {
    const mute = this.mutes.get(`${Number(channelId)}:${Number(personId)}`) || null;
    return ModerationRules.isMuted(mute, this.now()) ? mute : null;
  }

  /* ---------- group messages ---------- */

  addMessage(channelId, authorId, html, at, image = null) {
    const message = { id: this.newId(), channelId, authorId, html, sentAt: at, image, edited: false, deleted: null, versions: [{ html, at }] };
    this.messages.get(channelId).push(message);
    return message;
  }

  /**
   * A channel's messages that members see: none deleted or hidden.
   * @param {number} channelId
   * @returns {object[]}
   */
  liveMessages(channelId) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    return this.messages.get(channel.id).filter(message => !message.deleted);
  }

  /**
   * A message's latest words, from a group or a direct conversation, for the records: a pin
   * row shows what was pinned. Staff only, like the rest of the records; '' when it's gone.
   * @param {{channelId?: number|null, conversationId?: number|null}} where
   * @param {string|number} messageId
   * @returns {string}
   */
  recordedHtml({ channelId = null, conversationId = null }, messageId) {
    this.requireStaff();
    const list = channelId ? this.messages.get(Number(channelId)) : this.conversations.get(conversationId)?.messages;
    const message = list?.find(entry => String(entry.id) === String(messageId));
    return message ? message.versions.at(-1).html : '';
  }

  findMessage(channelId, messageId) {
    const message = this.messages.get(Number(channelId))?.find(entry => String(entry.id) === String(messageId));
    if (!message) throw new RuleError('not-found', { status: 404 });
    return message;
  }

  /**
   * Posts in a series group as the viewer. Updates channels take approved updates only.
   * @param {number} channelId
   * @param {string} html
   * @param {string|null} image
   * @returns {object} the saved message
   */
  post(channelId, html, image = null) {
    const channel = this.channel(channelId);
    const me = this.viewer();
    const verdict = ChannelRules.canPost(me, channel, { muted: Boolean(this.muteOf(channel.id, me.id)) });
    if (!verdict.allowed) throw new RuleError(verdict.reason);
    if (channel.kind === ChannelRules.UPDATES) throw new RuleError('needs-approval');
    if (!String(html ?? '').trim() && !image) throw new RuleError('bad-request', { status: 400 });
    return this.addMessage(channel.id, me.id, String(html ?? ''), this.stamp(), image);
  }

  ownMessage(channelId, messageId) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    const message = this.findMessage(channel.id, messageId);
    if (message.deleted) throw new RuleError('not-found', { status: 404 });
    if (message.authorId !== this.viewer().id) throw new RuleError('not-author');
    return message;
  }

  /**
   * Edits the viewer's own message; the old text stays as a version.
   * @returns {object} the message
   */
  edit(channelId, messageId, html) {
    const message = this.ownMessage(channelId, messageId);
    // A sent update is never edited: a correction is a new update, approved like any other.
    if (this.channel(channelId).kind === ChannelRules.UPDATES) throw new RuleError('needs-approval');
    if (this.muteOf(message.channelId, message.authorId)) throw new RuleError('muted');
    message.html = String(html ?? '');
    message.edited = true;
    message.versions.push({ html: message.html, at: this.stamp() });
    return message;
  }

  /**
   * Deletes the viewer's own message for members; the records keep it.
   * @returns {object} the message
   */
  remove(channelId, messageId) {
    const message = this.ownMessage(channelId, messageId);
    message.deleted = { kind: 'delete', by: this.viewer().id, at: this.stamp(), note: '' };
    return message;
  }

  /* ---------- updates and approval ---------- */

  submitUpdate(channelId, html) {
    const channel = this.channel(channelId);
    if (channel.kind !== ChannelRules.UPDATES) throw new RuleError('bad-request', { status: 400 });
    const verdict = ChannelRules.canPost(this.viewer(), channel);
    if (!verdict.allowed) throw new RuleError(verdict.reason);
    const text = String(html ?? '').trim();
    if (!text) throw new RuleError('bad-request', { status: 400 });
    const pending = { id: this.newId(), channelId: channel.id, authorId: this.viewer().id, html: text, at: this.stamp() };
    this.pending.push(pending);
    return pending;
  }

  /** @returns {object[]} updates waiting for a second staff member */
  pendingUpdates() {
    this.requireStaff();
    return [...this.pending];
  }

  /**
   * Sends a waiting update, under its writer's name. The writer can't approve their own.
   * @returns {object} the published message
   */
  approveUpdate(pendingId) {
    this.requireStaff();
    const index = this.pending.findIndex(entry => String(entry.id) === String(pendingId));
    if (index < 0) throw new RuleError('not-found', { status: 404 });
    const pending = this.pending[index];
    if (pending.authorId === this.viewer().id) throw new RuleError('own-update');
    this.pending.splice(index, 1);
    const message = this.addMessage(pending.channelId, pending.authorId, pending.html, this.stamp());
    this.addLog({ action: 'approve', channelId: pending.channelId, messageId: message.id, personId: pending.authorId });
    return message;
  }

  /* ---------- polls ---------- */

  pollsFor(channelId) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    return this.polls.get(channel.id);
  }

  /**
   * A poll in an updates channel, from staff. options are already cleaned (the microblog's
   * normalizeSurveyOptions).
   */
  createPoll(channelId, question, options) {
    const channel = this.channel(channelId);
    if (channel.kind !== ChannelRules.UPDATES) throw new RuleError('bad-request', { status: 400 });
    this.requireRead(channel);
    this.requireStaff();
    const content = String(question ?? '').trim();
    if (!content) throw new RuleError('bad-request', { status: 400 });
    const me = this.viewer();
    const poll = {
      id: this.newId(), channelId: channel.id, userId: me.id, userName: me.name, content,
      survey: { options: [...options] }, replies: [], createdAt: this.stamp(),
    };
    this.polls.get(channel.id).push(poll);
    return poll;
  }

  /**
   * A vote as a microblog marker reply, stamped with the viewer. The latest vote counts.
   */
  vote(pollId, index) {
    const poll = [...this.polls.values()].flat().find(entry => String(entry.id) === String(pollId));
    if (!poll) throw new RuleError('not-found', { status: 404 });
    this.requireRead(this.channel(poll.channelId));
    if (!Number.isInteger(index) || index < 0 || index >= poll.survey.options.length) {
      throw new RuleError('bad-request', { status: 400 });
    }
    const me = this.viewer();
    poll.replies.push({ id: this.newId(), userId: me.id, userName: me.name, content: `${VOTE_MARKER} ${index}`, createdAt: this.stamp() });
    return poll;
  }

  /* ---------- documents ---------- */

  filesFor(channelId) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    return this.files.get(channel.id);
  }

  /** Shares a document in a series group. Only staff do. */
  shareFile(channelId, filename, base64Data) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    if (channel.kind !== ChannelRules.SERIES) throw new RuleError('bad-request', { status: 400 });
    this.requireStaff();
    const name = String(filename ?? '').trim();
    if (!name) throw new RuleError('bad-request', { status: 400 });
    const file = { filename: name, base64Data: String(base64Data ?? ''), sharedBy: this.viewer().id, sharedAt: this.stamp() };
    this.files.get(channel.id).push(file);
    return file;
  }

  /* ---------- direct messages ---------- */

  conversationsOf(person = this.viewer()) {
    return [...this.conversations.values()].filter(conversation => conversation.participantIds.includes(person.id));
  }

  /**
   * The viewer's conversation with one other person, started under the DM rule.
   * @param {number[]} otherPersonIds exactly one id
   */
  startConversation(otherPersonIds) {
    const ids = (otherPersonIds || []).map(Number);
    if (ids.length !== 1) throw new RuleError('bad-request', { status: 400 });
    const me = this.viewer();
    const other = this.person(ids[0]);
    const verdict = DmPolicy.canStart(me, other, {
      mode: this.setup.dm_policy || 'staff-only', sharesSeries: DmPolicy.sharesSeries(me, other), bothOptedIn: false,
    });
    if (!verdict.allowed) throw new RuleError(verdict.reason);
    const existing = this.conversationsOf(me).find(conversation => conversation.participantIds.includes(other.id));
    if (existing) return existing;
    const conversation = { id: this.newId(), participantIds: [me.id, other.id], messages: [] };
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  conversation(id) {
    const conversation = this.conversations.get(Number(id));
    if (!conversation) throw new RuleError('not-found', { status: 404 });
    if (!conversation.participantIds.includes(this.viewer().id)) throw new RuleError('not-member');
    return conversation;
  }

  dmPost(conversationId, body, image = null) {
    const conversation = this.conversation(conversationId);
    if (!String(body ?? '').trim() && !image) throw new RuleError('bad-request', { status: 400 });
    const at = this.stamp();
    const message = {
      id: this.newId(), senderId: this.viewer().id, body: String(body ?? ''), sentAt: at, image, edited: false, deleted: null,
      versions: [{ html: String(body ?? ''), at }],
    };
    conversation.messages.push(message);
    return { conversation, message };
  }

  ownDm(conversationId, messageId) {
    const conversation = this.conversation(conversationId);
    const message = conversation.messages.find(entry => String(entry.id) === String(messageId));
    if (!message || message.deleted) throw new RuleError('not-found', { status: 404 });
    if (message.senderId !== this.viewer().id) throw new RuleError('not-author');
    return { conversation, message };
  }

  dmEdit(conversationId, messageId, body) {
    const found = this.ownDm(conversationId, messageId);
    found.message.body = String(body ?? '');
    found.message.edited = true;
    found.message.versions.push({ html: found.message.body, at: this.stamp() });
    return found;
  }

  dmDelete(conversationId, messageId) {
    const found = this.ownDm(conversationId, messageId);
    found.message.deleted = { kind: 'delete', by: this.viewer().id, at: this.stamp(), note: '' };
    return found;
  }

  /* ---------- reports and moderation ---------- */

  /**
   * A member reports someone else's message. The same member's second report on the same
   * message returns the first.
   */
  report({ channelId, messageId, reason, note = '' }) {
    const channel = this.channel(channelId);
    this.requireRead(channel);
    const message = this.findMessage(channel.id, messageId);
    if (message.deleted) throw new RuleError('not-found', { status: 404 });
    const me = this.viewer();
    if (message.authorId === me.id) throw new RuleError('self');
    let checked;
    try {
      checked = ModerationRules.checkReport({ reason, note });
    } catch (error) {
      throw new RuleError('bad-request', { status: 400, message: error.message });
    }
    const existing = this.reports.find(entry => entry.status === 'open' && entry.reporterId === me.id
      && entry.channelId === channel.id && entry.messageId === message.id);
    if (existing) return existing;
    const report = {
      id: this.newId(), channelId: channel.id, messageId: message.id, reporterId: me.id,
      reason: checked.reason, note: checked.note, at: this.stamp(), status: 'open', resolution: null,
    };
    this.reports.push(report);
    return report;
  }

  /** @returns {object[]} open reports, oldest first, each with its message */
  openReports() {
    this.requireModerator();
    return this.reports
      .filter(report => report.status === 'open')
      .map(report => ({ ...report, message: this.findMessage(report.channelId, report.messageId) }));
  }

  /**
   * A moderator's action on a report. Hide hides the message; mute and remove hide it too,
   * then mute its writer in that group or take them out of the series. Dismiss changes
   * nothing. Every action is logged, and closes the other open reports on that message
   * unless it's a dismissal.
   * @returns {{report: object, message: object, effects: object}}
   */
  resolveReport(reportId, request) {
    this.requireModerator();
    const report = this.reports.find(entry => String(entry.id) === String(reportId) && entry.status === 'open');
    if (!report) throw new RuleError('not-found', { status: 404 });
    let action;
    try {
      action = ModerationRules.checkAction(request);
    } catch (error) {
      throw new RuleError('bad-request', { status: 400, message: error.message });
    }
    const me = this.viewer();
    const channel = this.channel(report.channelId);
    const message = this.findMessage(report.channelId, report.messageId);
    const author = this.person(message.authorId);
    if (['mute', 'remove'].includes(action.action) && CommunityRoles.canModerate(author)) throw new RuleError('protected');
    const at = this.stamp();
    const effects = {};
    if (action.action !== 'dismiss') {
      if (!message.deleted) message.deleted = { kind: 'hide', by: me.id, at, note: action.note };
      effects.hidden = true;
    }
    if (action.action === 'mute') {
      const mute = { until: ModerationRules.muteUntil(this.now(), action.hours), by: me.id, note: action.note };
      this.mutes.set(`${channel.id}:${author.id}`, mute);
      effects.mutedUntil = mute.until;
    }
    if (action.action === 'remove') {
      author.series = author.series.filter(id => id !== channel.series);
      effects.removedFrom = channel.series;
    }
    for (const entry of this.reports) {
      const sameMessage = entry.channelId === report.channelId && entry.messageId === report.messageId;
      if (entry.status === 'open' && (entry === report || (sameMessage && action.action !== 'dismiss'))) {
        entry.status = 'resolved';
        entry.resolution = { ...action, by: me.id, at };
      }
    }
    this.addLog({
      action: action.action, channelId: channel.id, messageId: message.id, personId: author.id,
      until: effects.mutedUntil || '', note: action.note,
    });
    return { report, message, effects };
  }

  addLog(entry) {
    this.log.unshift({ id: this.newId(), at: this.stamp(), actorId: this.viewer().id, note: '', until: '', ...entry });
  }

  /** @returns {object[]} the moderator log, newest first */
  logEntries() {
    this.requireModerator();
    return [...this.log];
  }

  /** @returns {object[]} every version of a message, for moderators */
  versionsOf(channelId, messageId) {
    this.requireModerator();
    return this.findMessage(channelId, messageId).versions;
  }

  /**
   * Everything the records keep, for staff: each version of each message (group and direct),
   * deletions by senders, and the moderator log. personId is who the entry is about.
   * @returns {object[]}
   */
  recordEntries() {
    this.requireStaff();
    const entries = [];
    const addVersions = (base, message, authorId) => {
      message.versions.forEach((version, index) => entries.push({
        ...base, at: version.at, personId: authorId, actorId: authorId, kind: index === 0 ? 'message' : 'edit', html: version.html, note: '',
      }));
      if (message.deleted?.kind === 'delete') {
        entries.push({ ...base, at: message.deleted.at, personId: authorId, actorId: authorId, kind: 'delete', html: message.versions.at(-1).html, note: '' });
      }
    };
    for (const [channelId, messages] of this.messages) {
      messages.forEach(message => addVersions({ channelId, conversationId: null }, message, message.authorId));
    }
    for (const conversation of this.conversations.values()) {
      conversation.messages.forEach(message => addVersions({ channelId: null, conversationId: conversation.id }, message, message.senderId));
    }
    // Hide, mute and remove all hide the message, so each leaves a row with the hidden text;
    // the rest of an action (the mute, the removal, a dismissal, an approval) is its own row.
    for (const entry of this.log) {
      const message = entry.messageId ? this.messages.get(entry.channelId)?.find(item => item.id === entry.messageId) : null;
      const base = { channelId: entry.channelId, conversationId: null, at: entry.at, personId: entry.personId, actorId: entry.actorId, note: entry.note, logEntry: entry };
      if (['hide', 'mute', 'remove'].includes(entry.action)) entries.push({ ...base, kind: 'hide', html: message?.versions.at(-1).html || '' });
      if (entry.action !== 'hide') entries.push({ ...base, kind: 'action', html: '' });
    }
    return entries;
  }

  /* ---------- calendar ---------- */

  /**
   * The events a person sees: those in the updates they can read, plus their own.
   * @returns {object[]} in Courses' event shape
   */
  eventsFor(person = this.viewer()) {
    const events = [];
    if (typeof this.extractEventMarkers === 'function') {
      for (const channel of ChannelRules.readable(person, [...this.channels.values()])) {
        if (channel.kind !== ChannelRules.UPDATES) continue;
        for (const message of this.messages.get(channel.id)) {
          if (message.deleted) continue;
          this.extractEventMarkers(message.html).events.forEach(event => events.push({ ...event, channelId: channel.id, source: 'update' }));
        }
      }
    }
    return [...events, ...(this.personalEvents.get(person.id) || [])];
  }

  /**
   * An event on the viewer's own calendar, from Messages' Add to calendar request
   * ({ title, date, description }).
   */
  addPersonalEvent({ title, date, description = '' } = {}) {
    const name = String(title ?? '').trim();
    if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) throw new RuleError('bad-request', { status: 400 });
    const me = this.viewer();
    const event = {
      id: `p${this.newId()}`, date, title: name, description: String(description ?? ''), type: 'event', priority: 'P2', periods: [], source: 'personal',
    };
    this.personalEvents.set(me.id, [...(this.personalEvents.get(me.id) || []), event]);
    return event;
  }

  removePersonalEvent(id) {
    const me = this.viewer();
    this.personalEvents.set(me.id, (this.personalEvents.get(me.id) || []).filter(event => event.id !== String(id)));
  }
}
