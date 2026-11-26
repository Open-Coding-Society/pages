// The demo's backend: the calls OCS Messages makes to Spring (the same names and shapes as
// createMessagesApi in _projects/systems/messages/js/messages-api.js), answered from a
// DemoStore in the browser, plus the Community calls a real server would add (README, "The demo
// backend"). Every call is async and refuses the way a server does, with a
// status and a reason, so Messages' own thread pane runs on it unchanged. Live changes go out
// as frames in Spring's shapes on the same topics (/topic/group/{id}, /topic/dm/{id}).
import { ChannelRules } from './channel-rules.js';
import { Records } from './records.js';
import { RuleError } from './demo-store.js';

/**
 * A socket for one pane, following one topic at a time, like Messages' chat-socket.js. It's
 * connected from the start: there's no network to wait for.
 */
export class DemoSocket {
  /**
   * @param {DemoBackend} backend
   */
  constructor(backend) {
    this.backend = backend;
    this.connected = true;
    this.stopFollowing = null;
  }

  /** @returns {Promise<boolean>} always connected */
  async connect() {
    this.connected = true;
    return true;
  }

  /**
   * Replaces the topic being followed. Does nothing once disconnected, and hears nothing on a
   * topic the viewer may not follow, as a server's socket turns that subscription away.
   * @param {string} topic
   * @param {function(object): void} onEvent
   */
  follow(topic, onEvent) {
    this.unfollow();
    if (!this.connected) return;
    try {
      this.stopFollowing = this.backend.subscribe(topic, onEvent);
    } catch (error) {
      if (!(error instanceof RuleError)) throw error;
      console.warn(`Community: not allowed to follow ${topic}`);
    }
  }

  unfollow() {
    this.stopFollowing?.();
    this.stopFollowing = null;
  }

  disconnect() {
    this.unfollow();
    this.connected = false;
  }

  /** @returns {boolean} */
  isConnected() {
    return this.connected;
  }
}

/**
 * Messages' API contract and the Community calls, over a DemoStore.
 */
export class DemoBackend {
  /**
   * @param {DemoStore} store
   * @param {{texts: Texts, plainText?: function(string): string, stripChatMarkers?: function(string): string,
   *   normalizeSurveyOptions?: function(string[]): string[], extractPinMarker?: function(string): object}} kit
   *   the words, Messages' plainText, rich-text.js's stripChatMarkers, the microblog's
   *   normalizeSurveyOptions and Messages' Conversation.extractPinMarker (a pin is a message there)
   */
  constructor(store, {
    texts, plainText = html => String(html), stripChatMarkers = text => String(text), normalizeSurveyOptions = options => options,
    extractPinMarker = raw => ({ action: null, id: null, html: String(raw ?? '') }),
  } = {}) {
    if (!texts) throw new TypeError('DemoBackend: pass the texts');
    this.store = store;
    this.texts = texts;
    this.plainText = plainText;
    this.stripChatMarkers = stripChatMarkers;
    this.normalizeSurveyOptions = normalizeSurveyOptions;
    this.extractPinMarker = extractPinMarker;
    this.topics = new Map();
    this.listeners = new Map();
  }

  /* ---------- live frames and change events ---------- */

  /**
   * Follows a topic; returns a function that stops.
   * @param {string} topic
   * @param {function(object): void} handler
   * @returns {function(): void}
   * @throws {RuleError} when the viewer may not follow the topic
   */
  subscribe(topic, handler) {
    this.store.requireFollow(topic);
    if (!this.topics.has(topic)) this.topics.set(topic, new Set());
    this.topics.get(topic).add(handler);
    return () => this.topics.get(topic)?.delete(handler);
  }

  publish(topic, frame) {
    [...(this.topics.get(topic) || [])].forEach(handler => handler({ ...frame }));
  }

  /** @returns {DemoSocket} a socket for one pane */
  openSocket() {
    return new DemoSocket(this);
  }

  /**
   * Listens for a change the views redraw on: 'reports', 'pending', 'polls', 'files',
   * 'calendar', 'moderation', 'viewer'. Returns a function that stops.
   * @param {string} name
   * @param {function(object): void} handler
   * @returns {function(): void}
   */
  on(name, handler) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(handler);
    return () => this.listeners.get(name)?.delete(handler);
  }

  emit(name, detail = {}) {
    [...(this.listeners.get(name) || [])].forEach(handler => handler(detail));
  }

  /* ---------- people and channels (synchronous, for the page) ---------- */

  personJson(person) {
    return { id: person.id, uid: person.uid, name: person.name, roles: person.roles.map(role => ({ ...role })), series: [...person.series] };
  }

  /** Acts as another person; the views rebuild for them. */
  viewAs(personId) {
    this.store.viewAs(personId);
    this.emit('viewer', { personId: Number(personId) });
  }

  /** @returns {object} the viewer, shaped like Spring's /api/person/get */
  viewer() {
    return this.personJson(this.store.viewer());
  }

  /** @returns {object[]} everyone in the setup */
  people() {
    return [...this.store.people.values()].map(person => this.personJson(person));
  }

  /** @returns {object[]} the channels the viewer can read */
  channels() {
    return this.store.readableChannels().map(channel => ({ ...channel }));
  }

  /** @returns {object|undefined} a series from the setup */
  series(id) {
    return (this.store.setup.series || []).find(entry => entry.id === id);
  }

  /**
   * A person's mute in a channel while it lasts, or null.
   * @param {number} channelId
   * @param {number} personId the viewer when left out
   */
  muteOf(channelId, personId = this.store.viewerId) {
    const mute = this.store.muteOf(channelId, personId);
    return mute ? { ...mute } : null;
  }

  /* ---------- Messages' contract: the person ---------- */

  async currentPerson() {
    return this.viewer();
  }

  /* ---------- Messages' contract: group chats ---------- */

  groupJson(message) {
    const author = this.store.person(message.authorId);
    return {
      id: message.id, author: author.name, author_uid: author.uid, message: message.html,
      date: message.sentAt, edited: message.edited, image: message.image,
    };
  }

  async groupMessages(groupId) {
    return this.store.liveMessages(groupId).map(message => this.groupJson(message));
  }

  async sendGroupMessage(groupId, message, image = null) {
    const saved = this.store.post(groupId, message, image);
    this.publish(`/topic/group/${saved.channelId}`, {
      context: 'sendMessageServer', messageId: saved.id, sender: this.store.person(saved.authorId).name,
      message: saved.html, date: saved.sentAt, image: saved.image,
    });
    return this.groupMessages(saved.channelId);
  }

  async editGroupMessage(groupId, messageId, message) {
    const saved = this.store.edit(groupId, messageId, message);
    this.publish(`/topic/group/${saved.channelId}`, { context: 'editMessageServer', messageId: saved.id, message: saved.html });
    return this.groupJson(saved);
  }

  async deleteGroupMessage(groupId, messageId) {
    const saved = this.store.remove(groupId, messageId);
    this.publish(`/topic/group/${saved.channelId}`, { context: 'deleteMessageServer', messageId: saved.id });
    // A deleted update takes its events off the calendar.
    if (this.store.channel(saved.channelId).kind === ChannelRules.UPDATES) this.emit('calendar', {});
    return null;
  }

  async groupFiles(groupId) {
    return this.store.filesFor(groupId).map(file => ({
      filename: file.filename, base64Data: file.base64Data, sharedBy: this.store.person(file.sharedBy).name, sharedAt: file.sharedAt,
    }));
  }

  async uploadGroupFile(groupId, filename, base64Data) {
    const file = this.store.shareFile(groupId, filename, base64Data);
    const sender = this.store.person(file.sharedBy).name;
    this.publish(`/topic/group/${Number(groupId)}`, { context: 'sendFileServer', sender, filename: file.filename });
    this.emit('files', { channelId: Number(groupId) });
    return { filename: file.filename, sharedBy: sender, sharedAt: file.sharedAt };
  }

  async markGroupRead() {
    return null;
  }

  /* ---------- Messages' contract: direct messages ---------- */

  conversationJson(conversation) {
    return {
      id: conversation.id,
      participants: conversation.participantIds.map((id) => {
        const person = this.store.person(id);
        return { id: person.id, uid: person.uid, name: person.name };
      }),
    };
  }

  dmJson(conversation, message) {
    const sender = this.store.person(message.senderId);
    return {
      id: message.id, conversationId: conversation.id, senderUid: sender.uid, senderName: sender.name,
      body: message.deleted ? '' : message.body, sentAt: message.sentAt, edited: message.edited,
      deleted: Boolean(message.deleted), image: message.image,
    };
  }

  async conversations() {
    return this.store.conversationsOf().map(conversation => this.conversationJson(conversation));
  }

  async startConversation(otherPersonIds) {
    return this.conversationJson(this.store.startConversation(otherPersonIds));
  }

  async dmMessages(conversationId) {
    const conversation = this.store.conversation(conversationId);
    return conversation.messages.map(message => this.dmJson(conversation, message));
  }

  async sendDm(conversationId, body, image = null) {
    const { conversation, message } = this.store.dmPost(conversationId, body, image);
    const frame = { type: 'message', ...this.dmJson(conversation, message) };
    this.publish(`/topic/dm/${conversation.id}`, frame);
    return frame;
  }

  async editDm(conversationId, messageId, body) {
    const { conversation, message } = this.store.dmEdit(conversationId, messageId, body);
    this.publish(`/topic/dm/${conversation.id}`, { type: 'edited', conversationId: conversation.id, id: message.id, body: message.body });
    return this.dmJson(conversation, message);
  }

  async deleteDm(conversationId, messageId) {
    const { conversation, message } = this.store.dmDelete(conversationId, messageId);
    this.publish(`/topic/dm/${conversation.id}`, {
      type: 'deleted', conversationId: conversation.id, id: message.id, deleted: true, senderUid: this.store.person(message.senderId).uid,
    });
    return null;
  }

  async markDmRead() {
    return null;
  }

  /* ---------- Messages' contract: Add to calendar ---------- */

  async addCalendarEvent(request) {
    const event = this.store.addPersonalEvent(request);
    this.emit('calendar', { event });
    return event;
  }

  /**
   * The viewer's calendar in the shape Courses' week view reads (calendar-data.js stores).
   * @returns {object}
   */
  calendarStore() {
    const inRange = (start, end) => this.store.eventsFor()
      .filter(event => event.date >= start && event.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
    return {
      mode: 'preview',
      listRange: async (start, end) => inRange(start, end),
      listBreaks: async () => [],
      status: id => (this.store.eventsFor().some(event => event.id === String(id)) ? 'active' : 'removed'),
      subscribe: handler => this.on('calendar', handler),
      createEvent: async event => this.addCalendarEvent(event),
      deleteEvent: async (id) => {
        this.store.removePersonalEvent(id);
        this.emit('calendar', {});
      },
    };
  }

  /* ---------- Community: updates and approval ---------- */

  /**
   * What a phone notification says about an update: where it is, never what it says, since a
   * lock screen shows it to anyone nearby.
   * @param {number} channelId
   * @returns {string}
   */
  pushText(channelId) {
    const channel = this.store.channel(channelId);
    if (channel.series) return this.texts.say('push.update_series', { series: this.series(channel.series)?.title || channel.title });
    return this.texts.say('push.update_all', { org: this.store.setup.org?.short || '' });
  }

  pendingJson(pending) {
    return {
      id: pending.id, channelId: pending.channelId, channelTitle: this.store.channel(pending.channelId).title,
      authorId: pending.authorId, author: this.store.person(pending.authorId).name, html: pending.html, at: pending.at,
      pushText: this.pushText(pending.channelId),
    };
  }

  async submitUpdate(channelId, html) {
    const pending = this.store.submitUpdate(channelId, html);
    this.emit('pending', {});
    return this.pendingJson(pending);
  }

  async pendingUpdates() {
    return this.store.pendingUpdates().map(pending => this.pendingJson(pending));
  }

  async approveUpdate(pendingId) {
    const message = this.store.approveUpdate(pendingId);
    this.publish(`/topic/group/${message.channelId}`, {
      context: 'sendMessageServer', messageId: message.id, sender: this.store.person(message.authorId).name,
      message: message.html, date: message.sentAt, image: null,
    });
    this.emit('pending', {});
    this.emit('calendar', {});
    this.emit('moderation', {});
    return { message: this.groupJson(message), pushText: this.pushText(message.channelId) };
  }

  /* ---------- Community: polls (the microblog's surveys) ---------- */

  pollJson(poll) {
    return { ...poll, survey: { options: [...poll.survey.options] }, replies: poll.replies.map(reply => ({ ...reply })) };
  }

  async polls(channelId) {
    return this.store.pollsFor(channelId).map(poll => this.pollJson(poll));
  }

  async createPoll(channelId, question, options) {
    let cleaned;
    try {
      cleaned = this.normalizeSurveyOptions(options);
    } catch (error) {
      throw new RuleError('bad-request', { status: 400, message: error.message });
    }
    const poll = this.store.createPoll(channelId, question, cleaned);
    this.emit('polls', { channelId: poll.channelId });
    return this.pollJson(poll);
  }

  async vote(pollId, index) {
    const poll = this.store.vote(pollId, index);
    this.emit('polls', { channelId: poll.channelId });
    return this.pollJson(poll);
  }

  /* ---------- Community: reports and moderation ---------- */

  reportJson(report) {
    return {
      id: report.id, channelId: report.channelId, messageId: report.messageId, reporterId: report.reporterId,
      reporter: this.store.person(report.reporterId).name, reason: report.reason, note: report.note, at: report.at, status: report.status,
    };
  }

  async report(request) {
    const report = this.store.report(request);
    this.emit('reports', {});
    return this.reportJson(report);
  }

  async reports() {
    return this.store.openReports().map(report => ({
      ...this.reportJson(report),
      channelTitle: this.store.channel(report.channelId).title,
      message: this.groupJson(report.message),
      versions: report.message.versions.map(version => ({ ...version })),
    }));
  }

  async resolveReport(reportId, request) {
    const { report, message } = this.store.resolveReport(reportId, request);
    if (message.deleted) this.publish(`/topic/group/${message.channelId}`, { context: 'deleteMessageServer', messageId: message.id });
    this.emit('reports', {});
    this.emit('moderation', {});
    this.emit('calendar', {});
    return this.reportJson(report);
  }

  /**
   * A time for a sentence, like "Fri 10:00 AM".
   * @param {string} iso
   * @returns {string}
   */
  static when(iso) {
    return new Date(iso).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  /**
   * One log entry as a sentence (data/texts.yml, log section).
   * @param {object} entry
   * @returns {string}
   */
  logText(entry) {
    const channel = entry.channelId ? this.store.channel(entry.channelId) : null;
    const person = entry.personId ? this.store.person(entry.personId) : null;
    return this.texts.say(`log.${entry.action}`, {
      author: person?.name || '', name: person?.name || '', channel: channel?.title || '',
      until: entry.until ? DemoBackend.when(entry.until) : '',
    });
  }

  async moderationLog() {
    return this.store.logEntries().map(entry => ({
      ...entry, actor: this.store.person(entry.actorId).name, text: this.logText(entry),
    }));
  }

  async versions(channelId, messageId) {
    return this.store.versionsOf(channelId, messageId).map(version => ({ ...version }));
  }

  /* ---------- Community: records ---------- */

  /**
   * Plain text of a body: no markup and no chat markers.
   * @param {string} html
   * @returns {string}
   */
  plain(html) {
    return this.stripChatMarkers(this.plainText(String(html ?? '')));
  }

  recordRow(entry) {
    const channel = entry.channelId ? this.store.channel(entry.channelId).title : this.texts.say('records.dm');
    const actor = entry.actorId ? this.store.person(entry.actorId).name : '';
    const byModerator = entry.kind === 'hide' || entry.kind === 'action';
    // Messages keeps a pin as a message of its own ([[pin:<id>]]), so its row names the pin and
    // shows the words that were pinned.
    const pin = entry.kind === 'message' ? this.extractPinMarker(entry.html) : { action: null };
    return {
      at: entry.at,
      channel,
      person: entry.personId ? this.store.person(entry.personId).name : '',
      kind: this.texts.say(`records.${pin.action || entry.kind}`),
      text: entry.kind === 'action' ? this.logText(entry.logEntry)
        : this.plain(pin.action ? this.store.recordedHtml(entry, pin.id) : entry.html),
      note: byModerator ? [actor, entry.note].filter(Boolean).join(': ') : entry.note,
    };
  }

  /**
   * The records as CSV, for staff: one person (or everyone) between two days.
   * @param {{personId?: number|string, from?: string, to?: string}} filter
   * @returns {Promise<{csv: string, count: number}>}
   */
  async exportCsv({ personId = '', from = '', to = '' } = {}) {
    const rows = Records.filter(this.store.recordEntries(), { personId, from, to }).map(entry => this.recordRow(entry));
    return { csv: Records.toCsv(rows), count: rows.length };
  }
}
