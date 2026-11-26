import { TeamChatAccess } from './team-chat-access.js';

/**
 * The team chat on a capstone page. It finds the team's group for the signed-in person, then shows
 * Messages' group chat (mountGroupChat) with a link to the group in Messages, or a note saying why not.
 * Each view's words come from the page (texts). One per page; destroy() takes it down.
 */
export class CapstoneTeamChat {
  /**
   * @param {HTMLElement} root The element the chat fills; a plain wrapper, so hidden works on it.
   * @param {object} options
   * @param {string} options.groupName The team group's exact name, from capstone_project.team_group.
   * @param {object} options.config config.js: springEnabled, baseurl, javaURI, javaWebSocketURI, fetchOptions.
   * @param {object} options.texts The page's words: loading, signIn, unavailable, notMember, mentorWaiting,
   *   notFound, openInMessages, and embed (passed to the chat as its texts).
   * @param {object} options.api A TeamGroupApi.
   * @param {object} options.load embed() and richText() load Messages' embed and the composer when needed.
   */
  constructor(root, { groupName, config, texts, api, load }) {
    this.root = root;
    this.groupName = groupName;
    this.config = config;
    this.texts = texts;
    this.api = api;
    this.load = load;
    this.chat = null;
    this.destroyed = false;
  }

  /** Puts values into a text's {name} slots; names with no value stay as written. */
  static fill(template, values) {
    return String(template ?? '').replace(/\{(\w+)\}/g, (slot, name) => (name in values ? String(values[name]) : slot));
  }

  /**
   * Shows what the signed-in person may see and answers which view that was: 'chat', 'not-member',
   * 'mentor-waiting', 'not-found', 'signed-out' or 'unavailable'.
   */
  async start() {
    // A Flask-only site (spring: false) never calls Spring. The include isn't rendered there either.
    if (this.config.springEnabled === false) {
      this.root.hidden = true;
      return 'unavailable';
    }
    this.showNote(this.texts.loading);

    const me = await this.api.me();
    // destroy() may run while a request is out; after each one, stop if it did.
    if (this.destroyed) return 'unavailable';
    if (!me.ok || !me.data?.uid) return this.showSignedOutOrUnavailable(me.status);

    const { group, failed } = await this.findTeamGroup(me.data);
    if (this.destroyed) return 'unavailable';
    if (failed) return this.showUnavailable();
    const view = TeamChatAccess.viewFor(me.data, group);
    if (view !== 'chat') {
      this.showNote(CapstoneTeamChat.fill(this.noteFor(view), { group: this.groupName }));
      return view;
    }
    try {
      await this.showChat(group);
    } catch (error) {
      // The chat's code didn't load (a network error) or wouldn't mount: say so rather than leave a broken box.
      console.warn('Team chat: the chat could not be shown', error);
      return this.showUnavailable();
    }
    return view;
  }

  /** Takes the chat down and empties the element. */
  destroy() {
    this.destroyed = true;
    this.chat?.destroy();
    this.chat = null;
    this.root.replaceChildren();
  }

  /**
   * The team group as this person may see it, as { group, failed }: failed when Spring couldn't answer.
   * Everyone looks through their own groups first, so a mentor never asks for a route that refuses
   * mentors; a teacher who isn't a member then searches by name.
   */
  async findTeamGroup(person) {
    const mine = await this.api.groupsOf(person.id);
    if (!mine.ok) return { group: null, failed: true };
    const group = TeamChatAccess.findGroup(mine.data, this.groupName);
    if (group || !TeamChatAccess.isStaff(person)) return { group, failed: false };
    const byName = await this.api.findByName(this.groupName);
    return byName.ok ? { group: byName.data, failed: false } : { group: null, failed: true };
  }

  async showChat(group) {
    const room = document.createElement('div');
    const links = document.createElement('div');
    links.className = 'ocs__links';
    const open = document.createElement('a');
    open.className = 'ocs__btn small';
    open.setAttribute('href', `${this.config.baseurl ?? ''}/dm?group=${encodeURIComponent(group.id)}`);
    open.textContent = this.texts.openInMessages;
    links.appendChild(open);
    this.root.replaceChildren(room, links);

    const [embed, richText] = await Promise.all([this.load.embed(), this.load.richText()]);
    if (this.destroyed) return;
    const chat = await embed.mountGroupChat(room, {
      groupId: group.id,
      config: this.config,
      richText,
      heading: '',
      texts: this.texts.embed ?? {},
    });
    // destroy() may have run while the chat was mounting.
    if (this.destroyed) chat.destroy();
    else this.chat = chat;
  }

  showSignedOutOrUnavailable(status) {
    if ([401, 403, 404].includes(status)) {
      const note = this.note();
      const link = document.createElement('a');
      link.setAttribute('href', `${this.config.baseurl ?? ''}/login`);
      link.textContent = this.texts.signIn;
      note.appendChild(link);
      this.root.replaceChildren(note);
      return 'signed-out';
    }
    return this.showUnavailable();
  }

  showUnavailable() {
    this.showNote(this.texts.unavailable);
    return 'unavailable';
  }

  noteFor(view) {
    return { 'not-member': this.texts.notMember, 'mentor-waiting': this.texts.mentorWaiting, 'not-found': this.texts.notFound }[view];
  }

  showNote(message) {
    const note = this.note();
    note.textContent = message;
    this.root.replaceChildren(note);
  }

  note() {
    const note = document.createElement('div');
    note.className = 'ocs__callout';
    note.setAttribute('role', 'status');
    return note;
  }
}
