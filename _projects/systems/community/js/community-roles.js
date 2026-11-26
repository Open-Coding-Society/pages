// Who a person is in a Community: an LP, a moderator or staff. These are role names in a
// person's roles list, the model Spring uses (Person.roles as JSON, one hasRole(name)
// question). Spring sends each role as { name }; a setup file lists plain names.

/**
 * Role checks for Community members, used like Java's Math: CommunityRoles.canModerate(person).
 */
export class CommunityRoles {
  static LP = 'ROLE_LP';
  static MODERATOR = 'ROLE_MODERATOR';
  static STAFF = 'ROLE_STAFF';

  /** The tabs every member gets, in order. */
  static TABS = Object.freeze(['updates', 'groups', 'inbox', 'calendar']);

  /**
   * Whether a person has a role, given as a plain name or as Spring's { name }.
   * @param {object|null} person
   * @param {string} roleName such as CommunityRoles.STAFF
   * @returns {boolean}
   */
  static has(person, roleName) {
    return (person?.roles || []).some(role => (typeof role === 'string' ? role : role?.name) === roleName);
  }

  /**
   * Staff write updates, share documents and export records.
   * @param {object|null} person
   * @returns {boolean}
   */
  static isStaff(person) {
    return CommunityRoles.has(person, CommunityRoles.STAFF);
  }

  /**
   * Staff and moderators work the review queue.
   * @param {object|null} person
   * @returns {boolean}
   */
  static canModerate(person) {
    return CommunityRoles.isStaff(person) || CommunityRoles.has(person, CommunityRoles.MODERATOR);
  }

  /**
   * Whether a person has any Community role at all.
   * @param {object|null} person
   * @returns {boolean}
   */
  static isMember(person) {
    return CommunityRoles.canModerate(person) || CommunityRoles.has(person, CommunityRoles.LP);
  }

  /**
   * A person's highest role, as a word for labels.
   * @param {object|null} person
   * @returns {'staff'|'moderator'|'lp'|'none'}
   */
  static roleOf(person) {
    if (CommunityRoles.isStaff(person)) return 'staff';
    if (CommunityRoles.has(person, CommunityRoles.MODERATOR)) return 'moderator';
    if (CommunityRoles.has(person, CommunityRoles.LP)) return 'lp';
    return 'none';
  }

  /**
   * The tabs a person sees: every member's, plus review for those who moderate. A person
   * with no Community role sees none.
   * @param {object|null} person
   * @returns {string[]}
   */
  static tabsFor(person) {
    if (!CommunityRoles.isMember(person)) return [];
    return CommunityRoles.canModerate(person) ? [...CommunityRoles.TABS, 'review'] : [...CommunityRoles.TABS];
  }
}
