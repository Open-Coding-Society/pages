// Pure helpers for the Messages page: no DOM, no fetch. Direct messages and group
// chats arrive in different shapes; both become one message shape here so a single
// message list can show either:
//   { id, key, senderKey, senderName, senderPfp, body, sentAt, edited, deleted, image }
// `senderKey` is what marks your own messages: a uid for DMs, but the display name for
// groups, because a saved group message stores only its sender's name.

const asId = value => (value === undefined || value === null ? '' : String(value));

export function dmMessage(raw) {
  const deleted = Boolean(raw.deleted || raw.isDeleted || raw.deletedAt);
  const id = asId(raw.id);
  return {
    id,
    key: id || `${raw.senderUid}|${raw.sentAt}`,
    senderKey: raw.senderUid || '',
    senderName: raw.senderName || raw.senderUid || 'Unknown',
    senderPfp: raw.senderPfp || null,
    body: deleted ? '' : (raw.body ?? ''),
    sentAt: raw.sentAt || null,
    edited: Boolean(raw.edited),
    deleted,
    image: null,
  };
}

export function groupMessage(raw) {
  const id = asId(raw.id);
  const name = raw.name || '';
  return {
    id,
    key: id || `${name}|${raw.date}|${raw.message}`,
    senderKey: name,
    senderName: name || 'Unknown',
    senderPfp: null,
    body: raw.message ?? '',
    sentAt: raw.date || null,
    edited: Boolean(raw.edited),
    deleted: false,
    image: raw.image || null,
  };
}

// A frame from /topic/group/{id}. Presence, typing and heartbeat frames are 'other':
// this page doesn't show who is online.
export function classifyGroupEvent(event) {
  switch (event?.context) {
    case 'sendMessageServer':
      return {
        type: 'message',
        message: groupMessage({
          id: event.messageId, name: event.sender, message: event.message, date: event.date, image: event.image,
        }),
      };
    case 'editMessageServer':
      return { type: 'edit', id: asId(event.messageId), body: event.message ?? '' };
    case 'deleteMessageServer':
      return { type: 'delete', id: asId(event.messageId) };
    case 'sendFileServer':
      return { type: 'file', sender: event.sender || '', filename: event.filename || '' };
    case 'errorServer':
      return { type: 'error', text: event.error || 'The chat server reported an error.' };
    default:
      return { type: 'other' };
  }
}

// A frame from /topic/dm/{id}. The DM backend has marked edits and deletes in several
// ways over time, so this accepts each of them. Spring now types every frame ("message"
// or "edited"); only an untyped frame for a message already shown counts as an edit.
export function classifyDmEvent(event, activeConversationId, isKnown) {
  if (!event || event.conversationId !== activeConversationId) return { type: 'other' };
  const id = asId(event.id);
  const type = String(event.type || '').toLowerCase();
  if (event.deleted === true || ['deleted', 'message-deleted', 'message_deleted'].includes(type)) {
    return { type: 'delete', id, senderUid: event.senderUid || '' };
  }
  const body = event.body ?? event.messageBody;
  const isEdit = ['edited', 'message-edited'].includes(type)
    || ['update', 'edited'].includes(event.editType)
    || (!type && isKnown(id) && body !== undefined);
  if (isEdit) return { type: 'edit', id, body: body ?? '' };
  return { type: 'message', message: dmMessage(event) };
}

export function conversationLabel(conversation) {
  const names = (conversation?.participants || []).map(person => person.name || person.uid);
  return names.length ? names.join(', ') : 'Conversation';
}

export function groupSubtitle(group) {
  const count = (group.members || []).length;
  return [
    group.period ? `Period ${group.period}` : '',
    group.course || '',
    `${count} member${count === 1 ? '' : 's'}`,
  ].filter(Boolean).join(' · ');
}

function hasRole(person, roleName) {
  return (person?.roles || []).some(role => (typeof role === 'string' ? role : role?.name) === roleName);
}

export const isAdmin = person => hasRole(person, 'ROLE_ADMIN');

export const canFormGroups = person => isAdmin(person) || hasRole(person, 'ROLE_TEACHER');

export const isGroupMember = (group, personId) => (group.members || []).some(member => member.id === personId);

// The course pages chat in groups named "lessons", "<course>-announcements" and
// "<course>-week-<n>" (_projects/systems/courses/_includes/*_chat.html). Those aren't
// groups to join here.
export const isCourseChannel = group => /^(lessons|[a-z]+-announcements|[a-z]+-week-\d+)$/i.test(group.name || '');

// Spring's courses.class-groups. Profile class changes add and remove these memberships
// (PUT /api/groups/class-memberships), and the calendar reads them, so they aren't left here.
const CLASS_GROUPS = ['CSSE', 'CSP', 'CSA', 'CSH'];

export const isClassGroup = group => CLASS_GROUPS.includes(String(group.name || '').toUpperCase());

// Only site admins delete groups, and never a class group, for the same reason it has no Leave.
export const canDeleteGroup = (person, group) => isAdmin(person) && !isClassGroup(group);

// A page shows a run of spaces as one, so a name typed as it looks still matches.
const collapseSpaces = text => String(text ?? '').trim().replace(/\s+/g, ' ');

// Delete waits for the group's name typed out, so one stray click can't delete a group.
export function confirmsGroupName(typed, group) {
  const name = collapseSpaces(group?.name);
  return name !== '' && collapseSpaces(typed) === name;
}

// Spring deletes a group's grades with it, and the assignments it submitted cascade. Its
// chat and files stay in S3 under its name, where this page can't open them, so members
// lose them, but they aren't erased.
export function deleteGroupWarning(group) {
  const count = (group.members || []).length;
  const who = count === 1 ? 'Its only member loses' : `All ${count} members lose`;
  return `Deleting ${group.name} also deletes its grades and any assignments it submitted. ${who} the group, its chat and its files. This can’t be undone.`;
}

export function sortGroups(groups) {
  return [...groups].sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true, sensitivity: 'base' }));
}

export function initialsFor(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// One of the five avatar tints in the shared chat styles, the same one for a name every time.
export function tintFor(name) {
  const text = String(name || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return `tint-${(hash % 5) + 1}`;
}

// Person.pfp is either a path/URL (seeded accounts, e.g. "/images/toby.png") or raw
// base64 image data (uploaded photos) with no "data:" prefix of its own.
export function pfpSrc(pfp) {
  if (!pfp) return null;
  if (/^(https?:)?\/\//.test(pfp) || pfp.startsWith('/') || pfp.startsWith('data:')) return pfp;
  return `data:image/png;base64,${pfp}`;
}

const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const dayKey = date => String(startOfDay(date));

export function dayLabel(date, now = new Date()) {
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export const isImageFile = filename => /\.(png|jpe?g|gif|webp|svg)$/i.test(filename || '');

// The last path segment, so a shared file can't name a download outside the folder.
export const downloadName = filename => String(filename || '').split(/[\\/]/).pop() || 'file';
