/**
 * Who may see a capstone team's chat, decided from the signed-in person and the team's group. Pure: no
 * requests and no page. The rules are Spring's MentorRules, which Spring enforces; this only picks what
 * the page shows, so a mentor's browser never asks for something Spring would refuse.
 */
export class TeamChatAccess {
  /** The role Spring gives a verified mentor. */
  static MENTOR = 'ROLE_MENTOR';

  /** The fewest members who aren't mentors that a group needs before its mentor can use it. */
  static MIN_TEAM_SIZE = 2;

  /** A person's role names; Spring sends each role as { name } (older answers send plain names). */
  static roleNames(person) {
    return (person?.roles ?? []).map(role => (typeof role === 'string' ? role : role?.name));
  }

  /** True for an account with ROLE_MENTOR and neither ROLE_TEACHER nor ROLE_ADMIN. */
  static isMentor(person) {
    return TeamChatAccess.roleNames(person).includes(TeamChatAccess.MENTOR) && !TeamChatAccess.isStaff(person);
  }

  /** True for a teacher or an admin. */
  static isStaff(person) {
    const names = TeamChatAccess.roleNames(person);
    return names.includes('ROLE_TEACHER') || names.includes('ROLE_ADMIN');
  }

  /** The group with exactly this name, or null. */
  static findGroup(groups, name) {
    return (Array.isArray(groups) ? groups : []).find(group => group?.name === name) ?? null;
  }

  /** How many of the group's members aren't mentors; Spring marks each member's mentor flag. */
  static teamSize(group) {
    return (group?.members ?? []).filter(member => !member.mentor).length;
  }

  /** Whether the person is one of the group's members, compared by id. */
  static isMember(person, group) {
    return person?.id != null && (group?.members ?? []).some(member => member.id === person.id);
  }

  /**
   * What the person sees: 'chat'; 'not-member'; 'team-too-small' for a mentor whose team is below
   * MIN_TEAM_SIZE; or 'not-found' for a teacher when the group doesn't exist. A person who isn't
   * staff only ever sees their own groups, so to them a missing group is 'not-member'.
   */
  static viewFor(person, group) {
    if (TeamChatAccess.isStaff(person)) return group ? 'chat' : 'not-found';
    if (!TeamChatAccess.isMember(person, group)) return 'not-member';
    if (TeamChatAccess.isMentor(person) && TeamChatAccess.teamSize(group) < TeamChatAccess.MIN_TEAM_SIZE) {
      return 'team-too-small';
    }
    return 'chat';
  }
}
