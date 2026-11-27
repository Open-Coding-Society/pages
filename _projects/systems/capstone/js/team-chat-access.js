/**
 * Who may see a capstone team's chat, decided from the signed-in person and the team's group. Pure: no
 * requests and no page. The rules are Spring's MentorRules, which Spring enforces; this only picks what
 * the page shows, so a mentor's browser never asks for something Spring would refuse.
 */
export class TeamChatAccess {
  /** The role Spring gives a verified mentor. */
  static MENTOR = 'ROLE_MENTOR';

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

  /** Whether the person is one of the group's members, compared by id. */
  static isMember(person, group) {
    return person?.id != null && (group?.members ?? []).some(member => member.id === person.id);
  }

  /**
   * What the person sees: 'chat'; 'not-found' for a teacher when the group doesn't exist;
   * 'mentor-waiting' for a mentor whose own groups leave it out; or 'not-member'. A person who isn't
   * staff only ever sees their own groups, and Spring lists a group to its mentor only once they're in
   * it and it has 2 members who aren't mentors, so the page can't tell which step is missing.
   */
  static viewFor(person, group) {
    if (TeamChatAccess.isStaff(person)) return group ? 'chat' : 'not-found';
    if (TeamChatAccess.isMember(person, group)) return 'chat';
    return TeamChatAccess.isMentor(person) ? 'mentor-waiting' : 'not-member';
  }
}
