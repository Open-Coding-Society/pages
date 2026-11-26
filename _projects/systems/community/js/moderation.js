// What a report and a moderator's action can be. A member reports a message with a reason;
// a moderator hides the message, mutes its sender for a while, removes them from the group,
// or dismisses the report. Each action is logged with who did it and why.

/**
 * Report and action rules, used like Java's Math: ModerationRules.checkReport(report).
 */
export class ModerationRules {
  static REASONS = Object.freeze(['spam', 'selling', 'private-info', 'harassment', 'other']);
  static ACTIONS = Object.freeze(['hide', 'mute', 'remove', 'dismiss']);
  static MUTE_HOURS = Object.freeze([24, 168]);
  static NOTE_LIMIT = 500;

  /**
   * A note, trimmed, or a TypeError when it's too long.
   * @param {string} note
   * @returns {string}
   */
  static cleanNote(note = '') {
    const text = String(note ?? '').trim();
    if (text.length > ModerationRules.NOTE_LIMIT) {
      throw new TypeError(`Keep the note under ${ModerationRules.NOTE_LIMIT} characters.`);
    }
    return text;
  }

  /**
   * A report's reason and note, checked.
   * @param {{reason: string, note?: string}} report
   * @returns {{reason: string, note: string}}
   * @throws {TypeError} for an unknown reason or a note that is too long
   */
  static checkReport({ reason, note = '' } = {}) {
    if (!ModerationRules.REASONS.includes(reason)) throw new TypeError(`Unknown report reason ${JSON.stringify(reason)}`);
    return { reason, note: ModerationRules.cleanNote(note) };
  }

  /**
   * A moderator's action, checked. A mute needs one of MUTE_HOURS; other actions take none.
   * @param {{action: string, hours?: number, note?: string}} request
   * @returns {{action: string, hours: number, note: string}}
   * @throws {TypeError} for an unknown action, a bad mute length or a note that is too long
   */
  static checkAction({ action, hours = 0, note = '' } = {}) {
    if (!ModerationRules.ACTIONS.includes(action)) throw new TypeError(`Unknown moderator action ${JSON.stringify(action)}`);
    if (action === 'mute' && !ModerationRules.MUTE_HOURS.includes(hours)) {
      throw new TypeError(`A mute lasts ${ModerationRules.MUTE_HOURS.join(' or ')} hours, not ${hours}`);
    }
    return { action, hours: action === 'mute' ? hours : 0, note: ModerationRules.cleanNote(note) };
  }

  /**
   * When a mute that starts now ends.
   * @param {Date} now
   * @param {number} hours one of MUTE_HOURS
   * @returns {string} an ISO time
   */
  static muteUntil(now, hours) {
    if (!ModerationRules.MUTE_HOURS.includes(hours)) throw new TypeError(`A mute lasts ${ModerationRules.MUTE_HOURS.join(' or ')} hours`);
    return new Date(now.getTime() + hours * 3600 * 1000).toISOString();
  }

  /**
   * Whether a mute is still on. A mute ends by itself when its time runs out.
   * @param {{until: string}|null} mute
   * @param {Date} now
   * @returns {boolean}
   */
  static isMuted(mute, now) {
    return Boolean(mute) && new Date(mute.until).getTime() > now.getTime();
  }
}
