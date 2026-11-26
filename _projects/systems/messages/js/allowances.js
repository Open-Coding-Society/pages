import { hasRole } from './messages-model.js';

/**
 * What the Messages page offers the signed-in account, and what it says about it. Spring decides what an account
 * may do, and the page mirrors its rules so it never offers what Spring would refuse. Spring's MentorRules keep an
 * account with ROLE_MENTOR and no teacher or admin role to its team's groups: it starts no direct messages, doesn't
 * find or make groups, and adds or removes no one. Everyone else keeps all three.
 *
 * The page passes these answers to its shared parts (the sidebar, the dialogs, the thread), which never check the
 * mentor role themselves.
 */
export class Allowances {
  static TEAM_GROUPS_ONLY_ROLE = 'ROLE_MENTOR';
  // Spring treats a teacher or admin who also has the mentor role as a teacher or admin.
  static OVERRIDING_ROLES = Object.freeze(['ROLE_TEACHER', 'ROLE_ADMIN']);

  static TEXTS = Object.freeze({
    noDirectMessages: 'Direct messages are off for your account. Talk with people in your groups.',
    idleHint: 'Pick one of your groups.',
    rejoinFromFindGroup: 'You can join it again from Find a group.',
    rejoinByMember: 'A member of the group can add you back.',
  });

  /**
   * @param {object} person the signed-in account, as Spring's /api/person/get answers it
   * @returns {{directMessages: boolean, findGroups: boolean, manageMembers: boolean}} frozen answers
   */
  static for(person) {
    const teamGroupsOnly = hasRole(person, Allowances.TEAM_GROUPS_ONLY_ROLE)
      && !Allowances.OVERRIDING_ROLES.some(role => hasRole(person, role));
    return Object.freeze({
      directMessages: !teamGroupsOnly,
      findGroups: !teamGroupsOnly,
      manageMembers: !teamGroupsOnly,
    });
  }

  /** What an empty Direct messages list says to this account, or undefined for the usual words. */
  static emptyDirectMessagesText(allowed) {
    return allowed.directMessages ? undefined : Allowances.TEXTS.noDirectMessages;
  }

  /** Words for the thread pane that replace its defaults for this account (THREAD_TEXTS keys). */
  static threadTexts(allowed) {
    return allowed.directMessages && allowed.findGroups ? {} : { idleHint: Allowances.TEXTS.idleHint };
  }

  /** What Leave tells this account about coming back to a group. */
  static rejoinNote(allowed) {
    return allowed.findGroups ? Allowances.TEXTS.rejoinFromFindGroup : Allowances.TEXTS.rejoinByMember;
  }

  /** Shows and enables a control the account may use; hides one it may not, so it can't be reached. */
  static offer(control, allowed) {
    if (allowed) {
      control.classList.remove('hidden');
      control.disabled = false;
    } else {
      control.classList.add('hidden');
    }
  }

  /** The tag beside a group member's name: Spring marks each member who is a mentor. */
  static memberTag(member) {
    return member?.mentor === true ? 'mentor' : '';
  }
}
