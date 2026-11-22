// Reactions on a message: the six emoji and what Spring sends, read into the shape the message
// log draws. Spring keeps the key, never the emoji, and its Reaction enum
// (mvc/reactions/Reaction.java) lists the same keys in the same order: change both together.

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
