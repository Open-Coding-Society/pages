// Who may start a direct message with whom. The demo's rule:
// a member can message staff and moderators, and they can message anyone, but two LPs can't
// message each other; they talk in their series groups, where reports reach a moderator.
// 'co-investors' is an opening an organization can choose later: two LPs who share a series and have
// both turned it on.
import { CommunityRoles } from './community-roles.js';

/**
 * The direct message rule, used like Java's Math: DmPolicy.canStart(sender, recipient).
 */
export class DmPolicy {
  static MODES = Object.freeze(['staff-only', 'co-investors']);

  /**
   * Whether sender may start a direct message with recipient, and why not when they can't.
   * Reasons: 'self', 'not-member', 'lp-to-lp' (staff-only mode), 'not-shared' and
   * 'not-opted-in' (co-investors mode).
   * @param {object} sender
   * @param {object} recipient
   * @param {{mode?: string, sharesSeries?: boolean, bothOptedIn?: boolean}} options
   * @returns {{allowed: boolean, reason: string}}
   * @throws {TypeError} for a mode that isn't one of DmPolicy.MODES
   */
  static canStart(sender, recipient, { mode = 'staff-only', sharesSeries = false, bothOptedIn = false } = {}) {
    if (!DmPolicy.MODES.includes(mode)) throw new TypeError(`DmPolicy: unknown mode ${JSON.stringify(mode)}`);
    const refuse = reason => ({ allowed: false, reason });
    if (!CommunityRoles.isMember(sender) || !CommunityRoles.isMember(recipient)) return refuse('not-member');
    if (sender.id === recipient.id) return refuse('self');
    if (CommunityRoles.canModerate(sender) || CommunityRoles.canModerate(recipient)) return { allowed: true, reason: '' };
    if (mode === 'staff-only') return refuse('lp-to-lp');
    if (!sharesSeries) return refuse('not-shared');
    if (!bothOptedIn) return refuse('not-opted-in');
    return { allowed: true, reason: '' };
  }

  /**
   * Whether two people are both in at least one series.
   * @param {object} a
   * @param {object} b
   * @returns {boolean}
   */
  static sharesSeries(a, b) {
    const mine = new Set(a?.series || []);
    return (b?.series || []).some(id => mine.has(id));
  }

  /**
   * The people sender may start a direct message with, in the order given.
   * @param {object} sender
   * @param {object[]} people
   * @param {{mode?: string, optedIn?: function(object): boolean}} options optedIn says whether
   *   a person has turned on messages from co-investors
   * @returns {object[]}
   */
  static recipientsFor(sender, people, { mode = 'staff-only', optedIn = () => false } = {}) {
    return people.filter(person => DmPolicy.canStart(sender, person, {
      mode,
      sharesSeries: DmPolicy.sharesSeries(sender, person),
      bothOptedIn: optedIn(sender) && optedIn(person),
    }).allowed);
  }
}
