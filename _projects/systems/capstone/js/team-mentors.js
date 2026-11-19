import { TeamChatAccess } from './team-chat-access.js';

/**
 * The team's mentors, under its chat on a capstone page. Everyone in the chat sees who mentors the team.
 * A member who isn't a mentor, or a teacher, can also find a verified mentor and add them, or remove one:
 * Mort's "the team manages Mentors and adds them to a group". Spring decides (MentorRules); when it
 * refuses, the panel shows the page's words for Spring's reason. Names are always set as text.
 */
export class TeamMentorsPanel {
  /** The most search results shown at once. */
  static MAX_RESULTS = 8;

  /**
   * @param {HTMLElement} root The element the panel fills.
   * @param {object} options
   * @param {object} options.api A TeamGroupApi.
   * @param {object} options.group The team group as Spring sent it, members marked mentor or not.
   * @param {object} options.viewer The signed-in person.
   * @param {object} options.texts The page's words (team_chat.yml, mentors).
   * @param {Function} [options.onChange] Called with the group after Spring accepts a change.
   */
  constructor(root, { api, group, viewer, texts, onChange = () => {} }) {
    this.root = root;
    this.api = api;
    this.group = group;
    this.viewer = viewer;
    this.texts = texts;
    this.onChange = onChange;
    this.results = [];
    this.searched = false;
    this.status = '';
    this.busy = false;
  }

  /** The group's members that Spring marks as mentors. */
  static mentorsOf(group) {
    return (group?.members ?? []).filter(member => member.mentor);
  }

  /** Whether the viewer may add and remove the group's mentors, by Spring's rule. */
  static canManage(viewer, group) {
    return !TeamChatAccess.isMentor(viewer)
      && (TeamChatAccess.isStaff(viewer) || TeamChatAccess.isMember(viewer, group));
  }

  /** People from a search who are mentors and not in the group yet. */
  static candidatesFrom(people, group) {
    return (Array.isArray(people) ? people : [])
      .filter(person => TeamChatAccess.isMentor(person) && !TeamChatAccess.isMember(person, group))
      .slice(0, TeamMentorsPanel.MAX_RESULTS);
  }

  /** The words for Spring's refusal reason, or the general message. */
  static reasonText(reason, texts) {
    return texts.reasons?.[reason] ?? texts.reasons?.failed ?? '';
  }

  /** Draws the panel from its current state. */
  render() {
    const stack = TeamMentorsPanel.element('div', 'ocs__stack');
    const title = TeamMentorsPanel.element('h3');
    title.textContent = this.texts.title;
    stack.appendChild(title);

    const manage = TeamMentorsPanel.canManage(this.viewer, this.group);
    const mentors = TeamMentorsPanel.mentorsOf(this.group);
    if (mentors.length) {
      stack.appendChild(this.list(mentors, manage ? { label: this.texts.remove, act: person => this.remove(person) } : null));
    } else {
      stack.appendChild(TeamMentorsPanel.callout(this.texts.none));
    }

    if (manage) {
      stack.appendChild(this.searchForm());
      if (this.results.length) {
        stack.appendChild(this.list(this.results, { label: this.texts.add, act: person => this.add(person) }));
      } else if (this.searched) {
        stack.appendChild(TeamMentorsPanel.callout(this.texts.noResults));
      }
    }

    if (this.status) {
      const status = TeamMentorsPanel.element('p');
      status.setAttribute('role', 'status');
      status.textContent = this.status;
      stack.appendChild(status);
    }
    this.root.replaceChildren(stack);
  }

  /** Looks up verified mentors whose name or email holds the query. */
  async search(query) {
    const text = String(query ?? '').trim();
    if (!text || this.busy) return;
    const answer = await this.run(() => this.api.searchPeople(text));
    this.searched = true;
    this.results = answer.ok ? TeamMentorsPanel.candidatesFrom(answer.data, this.group) : [];
    this.status = answer.ok ? '' : TeamMentorsPanel.reasonText(answer.reason, this.texts);
    this.render();
  }

  /** Adds a mentor to the group. */
  async add(person) {
    await this.change(() => this.api.addMember(this.group.id, person.id), this.texts.added, person);
  }

  /** Takes a mentor out of the group. */
  async remove(person) {
    await this.change(() => this.api.removeMember(this.group.id, person.id), this.texts.removed, person);
  }

  async change(request, doneText, person) {
    if (this.busy) return;
    const answer = await this.run(request);
    if (answer.ok && answer.data?.members) {
      this.group = answer.data;
      this.results = [];
      this.searched = false;
      // A function, so a $ in a name isn't read as a replacement pattern.
      this.status = String(doneText).replace('{name}', () => person.name);
      this.onChange(this.group);
    } else {
      this.status = TeamMentorsPanel.reasonText(answer.reason, this.texts);
    }
    this.render();
  }

  /** Runs one request at a time, so a double click can't send two. */
  async run(request) {
    this.busy = true;
    try {
      return await request();
    } finally {
      this.busy = false;
    }
  }

  list(people, action) {
    const list = TeamMentorsPanel.element('ul', 'ocs__entity-list');
    people.forEach(person => {
      const item = TeamMentorsPanel.element('li');
      // ocs__team stacks a name over its detail, as a capstone page's team list does.
      const who = TeamMentorsPanel.element('div', 'ocs__team');
      const name = TeamMentorsPanel.element('strong', 'ocs__team-name');
      name.textContent = person.name;
      const uid = TeamMentorsPanel.element('small');
      uid.textContent = person.uid;
      who.append(name, uid);
      item.appendChild(who);
      if (action) {
        const links = TeamMentorsPanel.element('div', 'ocs__links');
        const button = TeamMentorsPanel.element('button', 'ocs__btn small');
        button.type = 'button';
        button.textContent = action.label;
        button.addEventListener('click', () => action.act(person));
        links.appendChild(button);
        item.appendChild(links);
      }
      list.appendChild(item);
    });
    return list;
  }

  searchForm() {
    const form = TeamMentorsPanel.element('form');
    form.setAttribute('role', 'search');
    const field = TeamMentorsPanel.element('div', 'ocs__field');
    const label = TeamMentorsPanel.element('label', 'ocs__label');
    label.setAttribute('for', 'team-mentor-search');
    label.textContent = this.texts.findLabel;
    const input = TeamMentorsPanel.element('input', 'ocs__input');
    input.id = 'team-mentor-search';
    input.type = 'search';
    input.setAttribute('autocomplete', 'off');
    const hint = TeamMentorsPanel.element('small');
    hint.textContent = this.texts.findHint;
    field.append(label, input, hint);
    const links = TeamMentorsPanel.element('div', 'ocs__links');
    const submit = TeamMentorsPanel.element('button', 'ocs__btn small accent');
    submit.type = 'submit';
    submit.textContent = this.texts.search;
    links.appendChild(submit);
    form.append(field, links);
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.search(input.value);
    });
    return form;
  }

  static callout(text) {
    const note = TeamMentorsPanel.element('div', 'ocs__callout');
    note.textContent = text;
    return note;
  }

  static element(tag, className = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }
}
