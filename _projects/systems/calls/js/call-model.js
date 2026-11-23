// What the call page works out from plain values: which room a link names, the words for each
// answer Spring gives, labels and initials, and the order people show in. No DOM, no network.

// Spring's ids are positive whole numbers (CallRoomService's ID pattern), and a course is a
// class group name such as CSA (courses.class-groups), stored in capitals.
const ID = /^[1-9]\d*$/;
const COURSE = /^[A-Za-z0-9]{1,32}$/;
const PURPOSE = /^[a-z][a-z0-9-]{0,31}$/;
const PLACES = Object.freeze([['group', 'GROUP'], ['dm', 'DM'], ['course', 'COURSE']]);

// Spring's refusal reasons (CallApiRestController, CallModerationService) and the data/calls.yml
// key that says each one.
const REASON_KEYS = Object.freeze({
  WAITING_FOR_SUPERVISOR: 'waiting_supervisor',
  WAITING_FOR_SECOND_ADULT: 'waiting_second_adult',
  REMOVED: 'removed',
  NOT_A_MEMBER: 'not_a_member',
  CALL_NOT_FOUND: 'not_found',
  UNKNOWN_CONTEXT: 'not_found',
  MEDIA_UNAVAILABLE: 'unavailable',
  CALLS_UNAVAILABLE: 'unavailable',
  calls_disabled: 'unavailable',
  NOT_A_MODERATOR: 'not_a_moderator',
  PARTICIPANT_NOT_FOUND: 'participant_gone',
});
const WAITING = new Set(['WAITING_FOR_SUPERVISOR', 'WAITING_FOR_SECOND_ADULT']);

const own = (object, key) => object !== null && typeof object === 'object' && Object.hasOwn(object, key);

/** Pure helpers for the call page, used like Java's Math: CallModel.format(...). */
export class CallModel {
  /**
   * The room a /calls/ link names: ?group=12, ?dm=34 or ?course=csa, with an optional
   * &purpose=standup. A link naming no place, two places or a malformed one gives null.
   * @param {URLSearchParams} params
   * @returns {{contextType: string, contextKey: string, purpose: string|null}|null}
   */
  static contextFromQuery(params) {
    const named = PLACES.filter(([param]) => params.has(param));
    if (named.length !== 1) return null;
    const [param, contextType] = named[0];
    const values = params.getAll(param);
    if (values.length !== 1) return null;
    const value = values[0];
    const valid = contextType === 'COURSE' ? COURSE.test(value) : ID.test(value) && Number.isSafeInteger(Number(value));
    if (!valid) return null;
    const purpose = params.get('purpose');
    return {
      contextType,
      contextKey: contextType === 'COURSE' ? value.toUpperCase() : value,
      purpose: purpose !== null && PURPOSE.test(purpose) ? purpose : null,
    };
  }

  /**
   * A purpose's entry in data/calls.yml; an unknown or missing one is the meeting.
   * @returns {{key: string, label: string, camera: boolean}}
   */
  static purposeView(purpose, strings) {
    const key = own(strings.purposes, purpose) ? purpose : 'meeting';
    const entry = strings.purposes[key];
    return { key, label: entry.label, camera: entry.camera !== false };
  }

  /**
   * Fills {name}-style placeholders from values in one pass, so a value that itself looks like a
   * placeholder stays as it is; a placeholder with no value stays too.
   */
  static format(template, values = {}) {
    return String(template).replace(/\{(\w+)\}/g, (match, key) => (own(values, key) ? String(values[key]) : match));
  }

  /** The words for a reason Spring gave, or the general "That didn't work" for one it may add later. */
  static reasonText(reason, strings) {
    const key = own(REASON_KEYS, reason) ? REASON_KEYS[reason] : 'refused';
    return strings.text[key];
  }

  /** Whether a refused token means "wait": the lobby keeps the preview and asks again. */
  static isWaiting(reason) {
    return WAITING.has(reason);
  }

  /** Initials for an avatar: the first letters of the first and last words. */
  static initials(name) {
    const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    const first = words[0][0];
    return (words.length > 1 ? first + words[words.length - 1][0] : first).toUpperCase();
  }

  /**
   * Labels for the roles in a participant's metadata ({"roles": [...]}, written by Spring's
   * CallTokenService), in the data file's order. Roles without a label are left out.
   */
  static roleLabels(metadata, strings) {
    let roles;
    try {
      roles = JSON.parse(metadata || 'null')?.roles;
    } catch {
      return [];
    }
    if (!Array.isArray(roles)) return [];
    return Object.keys(strings.roles).filter((role) => roles.includes(role)).map((role) => strings.roles[role]);
  }

  /** People in a steady order, so cells don't jump around while people talk: by name, you last. */
  static order(people) {
    const byName = (a, b) => String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' })
      || String(a.identity).localeCompare(String(b.identity));
    return [...people].sort((a, b) => Number(Boolean(a.isSelf)) - Number(Boolean(b.isSelf)) || byName(a, b));
  }

  /** A room's title: its group or course name, "Direct message" for a DM. */
  static title(room, strings) {
    if (!room) return strings.text.page_title;
    if (room.contextType === 'DM') return strings.text.dm_title;
    return room.title || strings.text.page_title;
  }

  /** Spring pauses someone by taking away both sending and hearing (CallGrants.PAUSED). */
  static isPaused(permissions) {
    return Boolean(permissions) && permissions.canPublish === false && permissions.canSubscribe === false;
  }
}
