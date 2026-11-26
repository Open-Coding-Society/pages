// Reactions on a message: the six emoji, what Spring sends read into the shape the message log
// draws, and the chips under a message. Spring keeps the key, never the emoji, and its Reaction
// enum (mvc/reactions/Reaction.java) lists the same keys in the same order: change both together.

// Fills a text's {slot}s, as file-rows.js does; importing message-log.js's fillText would make
// the two modules import each other.
const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

/**
 * The six reaction kinds, and the readers for Spring's reaction lists.
 */
export class Reactions {
  /**
   * The reactions in the order their chips show: Spring's key, the emoji, and the text key of
   * the label (in the log's texts).
   */
  static KINDS = Object.freeze([
    Object.freeze({ key: 'like', emoji: '👍', textKey: 'reactionLike' }),
    Object.freeze({ key: 'love', emoji: '❤️', textKey: 'reactionLove' }),
    Object.freeze({ key: 'haha', emoji: '😂', textKey: 'reactionHaha' }),
    Object.freeze({ key: 'wow', emoji: '😮', textKey: 'reactionWow' }),
    Object.freeze({ key: 'sad', emoji: '😢', textKey: 'reactionSad' }),
    Object.freeze({ key: 'celebrate', emoji: '🎉', textKey: 'reactionCelebrate' }),
  ]);

  /**
   * One message's reactions as the log draws them.
   * @param {Array} list Spring's list: [{ reaction, people: [{ uid, name }] }]
   * @returns {Array<{reaction: string, people: Array<{uid: string, name: string}>}>} in the order
   *   of KINDS. Unknown keys, malformed entries and people without a uid are left out, and so is
   *   a reaction left with nobody.
   */
  static normalize(list) {
    if (!Array.isArray(list)) return [];
    const byKey = new Map();
    list.forEach(entry => {
      if (!entry || typeof entry !== 'object' || byKey.has(entry.reaction)) return;
      if (!Reactions.KINDS.some(kind => kind.key === entry.reaction)) return;
      const people = (Array.isArray(entry.people) ? entry.people : [])
        .filter(person => person && typeof person.uid === 'string' && person.uid)
        .map(person => ({ uid: person.uid, name: typeof person.name === 'string' && person.name ? person.name : person.uid }));
      if (people.length) byKey.set(entry.reaction, people);
    });
    return Reactions.KINDS
      .filter(kind => byKey.has(kind.key))
      .map(kind => ({ reaction: kind.key, people: byKey.get(kind.key) }));
  }

  /**
   * Every reacted-to message in a chat, from Spring's answer to a reactions GET.
   * @param {object} map { messageId: list }
   * @returns {Map<string, Array>} each list read with normalize. A message whose list comes out
   *   empty is left out, and anything but a plain object gives an empty Map.
   */
  static normalizeMap(map) {
    const result = new Map();
    if (!map || typeof map !== 'object' || Array.isArray(map)) return result;
    Object.entries(map).forEach(([id, list]) => {
      const shown = Reactions.normalize(list);
      if (shown.length) result.set(String(id), shown);
    });
    return result;
  }

  /**
   * Whether you left this reaction. Decided by uid: two people in a group can share a name.
   * @param {{people: Array<{uid: string}>}} entry one reaction from normalize
   * @param {string} uid your uid
   * @returns {boolean}
   */
  static isMine(entry, uid) {
    return Boolean(uid) && Boolean(entry?.people?.some(person => person.uid === uid));
  }
}

/**
 * The row of chips under one message: an emoji and a count for each reaction it has. Your chips
 * are pressed (filled, as Topics' OR/AND buttons are), and clicking a chip adds or takes back
 * yours.
 */
export class ReactionChips {
  #text;
  #uid;
  #onToggle;
  #names = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  /**
   * @param {object} options
   * @param {object} options.text the log's texts: you, a label per kind, reactionPeople and reactionCount
   * @param {{uid: string}} options.me who is looking
   * @param {Function} options.onToggle called as onToggle(reactionKey, on) when a chip is clicked
   */
  constructor({ text, me, onToggle }) {
    this.#text = text;
    this.#uid = me?.uid || '';
    this.#onToggle = onToggle;
  }

  /**
   * Draws a message's chips, in place of any it had.
   * @param {HTMLElement} main the message's body column
   * @param {HTMLElement|null} before what the row goes in front of (the action bar), or null to append it
   * @param {Array} list the message's reactions, from Reactions.normalize; empty removes the row
   */
  render(main, before, list) {
    const old = main.querySelector('.chat-reactions');
    // A chip that had focus (toggled from the keyboard, or sat on while someone's change came
    // in) keeps it in the new row.
    const focused = old && old.contains(document.activeElement) ? document.activeElement.dataset.reaction : null;
    old?.remove();
    if (!list?.length) return;
    const row = document.createElement('div');
    row.className = 'chat-reactions';
    // The log is a live region, and the chips change too often to be read out each time.
    row.setAttribute('aria-live', 'off');
    list.forEach(entry => row.appendChild(this.#chip(entry)));
    if (before && before.parentNode === main) main.insertBefore(row, before);
    else main.appendChild(row);
    if (focused) row.querySelector(`[data-reaction="${focused}"]`)?.focus();
  }

  /**
   * Turns every chip in the row off or back on, as while a change is saving.
   * @param {HTMLElement} main the message's body column
   * @param {boolean} disabled
   */
  setDisabled(main, disabled) {
    main.querySelector('.chat-reactions')?.querySelectorAll('button').forEach(chip => { chip.disabled = disabled; });
  }

  #chip(entry) {
    const kind = Reactions.KINDS.find(each => each.key === entry.reaction);
    const mine = Reactions.isMine(entry, this.#uid);
    const reaction = this.#text[kind.textKey];
    const names = this.#names.format(this.#namesFor(entry, mine));
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.dataset.reaction = entry.reaction;
    chip.className = mine ? 'ocs__btn small pill accent fill' : 'ocs__btn small pill';
    chip.setAttribute('aria-pressed', String(mine));
    chip.title = fill(this.#text.reactionPeople, { reaction, names });
    chip.setAttribute('aria-label', fill(this.#text.reactionCount, { reaction, count: entry.people.length, names }));
    // The emoji and count go straight into the button: theme presets recolor every span.
    chip.textContent = `${kind.emoji} ${entry.people.length}`;
    chip.addEventListener('click', () => this.#onToggle(entry.reaction, !mine));
    return chip;
  }

  // You first, as "You", then everyone else in the order Spring sorted them.
  #namesFor(entry, mine) {
    const others = entry.people.filter(person => person.uid !== this.#uid).map(person => person.name);
    return mine ? [this.#text.you, ...others] : others;
  }
}
