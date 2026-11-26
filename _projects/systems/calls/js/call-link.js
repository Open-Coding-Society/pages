// Where another system links to start a call: Messages' Call link in a group or DM. The link is
// the whole invitation; Spring decides who may join when the page opens it.

/** CallLink.forGroup(12, baseurl) gives '/calls/?group=12' under the site's baseurl. */
export class CallLink {
  /** The call of a group, by its Spring id. */
  static forGroup(groupId, baseurl = '') {
    return `${CallLink.base(baseurl)}/calls/?group=${CallLink.id(groupId)}`;
  }

  /** The call of a direct message conversation, by its Spring id. */
  static forDm(conversationId, baseurl = '') {
    return `${CallLink.base(baseurl)}/calls/?dm=${CallLink.id(conversationId)}`;
  }

  static base(baseurl) {
    return String(baseurl ?? '').replace(/\/+$/, '');
  }

  static id(value) {
    if (!Number.isSafeInteger(value) || value < 1) throw new TypeError(`CallLink: an id must be a positive whole number, not ${String(value)}`);
    return value;
  }
}
