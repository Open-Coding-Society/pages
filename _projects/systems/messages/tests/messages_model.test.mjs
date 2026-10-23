import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canDeleteGroup, canFormGroups, classifyDmEvent, classifyGroupEvent, confirmsGroupName, conversationLabel, dayLabel,
  deleteGroupWarning, dmMessage, downloadName, groupMessage, groupSubtitle, initialsFor, isAdmin, isClassGroup,
  isCourseChannel, isGroupMember, isImageFile, pfpSrc, sortGroups, tintFor,
} from '../js/messages-model.js';

test('dmMessage keeps the sender uid as the key that marks your own messages', () => {
  const message = dmMessage({
    id: 7, senderUid: 'ada', senderName: 'Ada Lovelace', senderPfp: '/images/ada.png', body: '<b>hi</b>',
    sentAt: '2026-10-20T10:00:00Z', edited: true,
  });
  assert.deepEqual(message, {
    id: '7', key: '7', senderKey: 'ada', senderName: 'Ada Lovelace', senderPfp: '/images/ada.png',
    body: '<b>hi</b>', sentAt: '2026-10-20T10:00:00Z', edited: true, deleted: false, image: null,
  });
});

test('dmMessage empties the body of a deleted message, however the backend marks it', () => {
  for (const flag of [{ deleted: true }, { isDeleted: true }, { deletedAt: '2026-10-20T10:01:00Z' }]) {
    const message = dmMessage({ id: 1, senderUid: 'ada', body: 'secret', ...flag });
    assert.equal(message.deleted, true);
    assert.equal(message.body, '');
  }
});

test('dmMessage names an unnamed sender by uid and keys a message without an id by sender and time', () => {
  const message = dmMessage({ senderUid: 'ada', body: 'hi', sentAt: '2026-10-20T10:00:00Z' });
  assert.equal(message.senderName, 'ada');
  assert.equal(message.id, '');
  assert.equal(message.key, 'ada|2026-10-20T10:00:00Z');
});

test('groupMessage reads a saved group chat message, whose only sender field is the display name', () => {
  const message = groupMessage({
    id: 'uuid-1', name: 'Ada Lovelace', message: 'hello team', date: '2026-10-20T10:00:00Z', image: null, edited: false,
  });
  assert.deepEqual(message, {
    id: 'uuid-1', key: 'uuid-1', senderKey: 'Ada Lovelace', senderName: 'Ada Lovelace', senderPfp: null,
    body: 'hello team', sentAt: '2026-10-20T10:00:00Z', edited: false, deleted: false, image: null,
  });
});

test('groupMessage keys an old message that has no id by sender, time and text', () => {
  const message = groupMessage({ name: 'Ada', message: 'hi', date: '2026-01-01T00:00:00Z', image: 'abc' });
  assert.equal(message.id, '');
  assert.equal(message.key, 'Ada|2026-01-01T00:00:00Z|hi');
  assert.equal(message.image, 'abc');
});

test('classifyGroupEvent turns a broadcast message into a message with its saved id', () => {
  const event = classifyGroupEvent({
    context: 'sendMessageServer', groupId: 3, messageId: 'uuid-2', sender: 'Grace Hopper', message: 'hi', date: '2026-10-20T10:00:00Z',
  });
  assert.equal(event.type, 'message');
  assert.equal(event.message.id, 'uuid-2');
  assert.equal(event.message.senderKey, 'Grace Hopper');
  assert.equal(event.message.body, 'hi');
});

test('classifyGroupEvent reads edits, deletes, shared files and errors', () => {
  assert.deepEqual(classifyGroupEvent({ context: 'editMessageServer', messageId: 'm1', message: 'new' }),
    { type: 'edit', id: 'm1', body: 'new' });
  assert.deepEqual(classifyGroupEvent({ context: 'deleteMessageServer', messageId: 'm1' }), { type: 'delete', id: 'm1' });
  assert.deepEqual(classifyGroupEvent({ context: 'sendFileServer', sender: null, filename: 'plan.pdf' }),
    { type: 'file', sender: '', filename: 'plan.pdf' });
  assert.deepEqual(classifyGroupEvent({ context: 'errorServer', error: 'Group not found' }), { type: 'error', text: 'Group not found' });
});

test('classifyGroupEvent ignores presence, typing and malformed frames', () => {
  for (const context of ['joinGroupServer', 'leaveGroupServer', 'heartbeatServer', 'typingStartServer', 'typingStopServer']) {
    assert.equal(classifyGroupEvent({ context }).type, 'other');
  }
  assert.equal(classifyGroupEvent(null).type, 'other');
});

test('classifyDmEvent ignores a frame for another conversation', () => {
  assert.equal(classifyDmEvent({ conversationId: 9, id: 1, body: 'hi' }, 4, () => false).type, 'other');
});

test('classifyDmEvent reads every way the DM backend marks a delete', () => {
  const known = () => true;
  for (const flags of [{ deleted: true }, { type: 'deleted' }, { type: 'message-deleted' }, { type: 'MESSAGE_DELETED' }]) {
    assert.deepEqual(classifyDmEvent({ conversationId: 4, id: 12, ...flags }, 4, known), { type: 'delete', id: '12', senderUid: '' });
  }
});

test('classifyDmEvent reads an edit, including a known message sent again with a new body', () => {
  assert.deepEqual(classifyDmEvent({ conversationId: 4, id: 12, type: 'edited', body: 'v2' }, 4, () => false),
    { type: 'edit', id: '12', body: 'v2' });
  assert.deepEqual(classifyDmEvent({ conversationId: 4, id: 12, editType: 'update', messageBody: 'v3' }, 4, () => false),
    { type: 'edit', id: '12', body: 'v3' });
  assert.deepEqual(classifyDmEvent({ conversationId: 4, id: 12, body: 'v4' }, 4, id => id === '12'),
    { type: 'edit', id: '12', body: 'v4' });
});

test('classifyDmEvent does not mistake a typed new-message frame for an edit when it was already drawn', () => {
  // A catch-up fetch can draw a message before its live frame arrives.
  const event = classifyDmEvent({ conversationId: 4, id: 12, type: 'message', senderUid: 'grace', body: 'hi' }, 4, () => true);
  assert.equal(event.type, 'message');
  assert.equal(event.message.key, '12');
});

test('classifyDmEvent turns a new message into a message', () => {
  const event = classifyDmEvent({ conversationId: 4, id: 13, senderUid: 'grace', senderName: 'Grace', body: 'yo' }, 4, () => false);
  assert.equal(event.type, 'message');
  assert.equal(event.message.key, '13');
  assert.equal(event.message.senderKey, 'grace');
});

test('conversationLabel lists the other people, by name or uid', () => {
  assert.equal(conversationLabel({ participants: [{ name: 'Ada Lovelace', uid: 'ada' }, { uid: 'grace' }] }), 'Ada Lovelace, grace');
  assert.equal(conversationLabel({ participants: [] }), 'Conversation');
  assert.equal(conversationLabel({}), 'Conversation');
});

test('groupSubtitle shows period, course and member count, leaving out what a group lacks', () => {
  assert.equal(groupSubtitle({ period: '3', course: 'CSA', members: [{}, {}] }), 'Period 3 · CSA · 2 members');
  assert.equal(groupSubtitle({ period: '', course: 'CSP', members: [{}] }), 'CSP · 1 member');
  assert.equal(groupSubtitle({ members: [] }), '0 members');
});

test('isAdmin and canFormGroups read Spring roles, as objects or as names', () => {
  const admin = { roles: [{ id: 1, name: 'ROLE_USER' }, { id: 2, name: 'ROLE_ADMIN' }] };
  const teacher = { roles: ['ROLE_TEACHER'] };
  const student = { roles: [{ name: 'ROLE_STUDENT' }] };
  assert.equal(isAdmin(admin), true);
  assert.equal(isAdmin(teacher), false);
  assert.equal(canFormGroups(admin), true);
  assert.equal(canFormGroups(teacher), true);
  assert.equal(canFormGroups(student), false);
  assert.equal(canFormGroups(null), false);
});

test('isGroupMember matches the person id', () => {
  const group = { members: [{ id: 4 }, { id: 9 }] };
  assert.equal(isGroupMember(group, 9), true);
  assert.equal(isGroupMember(group, 5), false);
  assert.equal(isGroupMember({}, 5), false);
});

test('isCourseChannel spots the groups the course pages keep for their own chats', () => {
  for (const name of ['lessons', 'csa-announcements', 'CSSE-announcements', 'csp-week-12']) {
    assert.equal(isCourseChannel({ name }), true, name);
  }
  for (const name of ['CSA', 'Team Turing', 'week-12 study group', 'announcements team']) {
    assert.equal(isCourseChannel({ name }), false, name);
  }
});

test('isClassGroup spots the class groups that profile classes keep in step', () => {
  assert.equal(isClassGroup({ name: 'CSA' }), true);
  assert.equal(isClassGroup({ name: 'csse' }), true);
  assert.equal(isClassGroup({ name: 'CSA Study Group' }), false);
});

test('canDeleteGroup offers Delete to site admins only', () => {
  const team = { name: 'Fruit Empire' };
  assert.equal(canDeleteGroup({ roles: [{ name: 'ROLE_USER' }, { name: 'ROLE_ADMIN' }] }, team), true);
  assert.equal(canDeleteGroup({ roles: ['ROLE_TEACHER'] }, team), false);
  assert.equal(canDeleteGroup({ roles: [{ name: 'ROLE_STUDENT' }] }, team), false);
  assert.equal(canDeleteGroup(null, team), false);
});

test('canDeleteGroup never offers Delete on a class group, the same rule as Leave', () => {
  const admin = { roles: [{ name: 'ROLE_ADMIN' }] };
  for (const name of ['CSA', 'csse', 'CSP', 'CSH']) {
    assert.equal(canDeleteGroup(admin, { name }), false, name);
  }
  assert.equal(canDeleteGroup(admin, { name: 'CSA Study Group' }), true);
});

test('confirmsGroupName needs the whole name typed, with the same capitals', () => {
  const group = { name: 'Fruit Empire' };
  assert.equal(confirmsGroupName('Fruit Empire', group), true);
  for (const typed of ['', 'Fruit', 'Fruit Empir', 'fruit empire', 'Fruit Empire!', 'Fruit Empire Team']) {
    assert.equal(confirmsGroupName(typed, group), false, typed);
  }
});

test('confirmsGroupName ignores extra spaces, which the page does not show in a name', () => {
  assert.equal(confirmsGroupName('  Fruit Empire ', { name: 'Fruit Empire' }), true);
  assert.equal(confirmsGroupName('Team Turing', { name: 'Team  Turing' }), true);
});

test('confirmsGroupName never confirms a group without a name', () => {
  assert.equal(confirmsGroupName('', { name: '' }), false);
  assert.equal(confirmsGroupName(' ', { name: '   ' }), false);
  assert.equal(confirmsGroupName('', {}), false);
});

test('deleteGroupWarning names the group and how many members lose it', () => {
  const team = deleteGroupWarning({ name: 'Fruit Empire', members: [{}, {}, {}, {}] });
  assert.match(team, /Fruit Empire/);
  assert.match(team, /all 4 members/i);
  const solo = deleteGroupWarning({ name: 'Solo Project', members: [{}] });
  assert.match(solo, /Solo Project/);
  assert.match(solo, /its only member/i);
  assert.doesNotMatch(solo, /all 1|1 members/i);
});

test('deleteGroupWarning says the group\'s grades and submitted assignments are deleted too', () => {
  // Spring deletes a group's grades with it, and its submissions cascade.
  const warning = deleteGroupWarning({ name: 'Fruit Empire', members: [{}, {}] });
  assert.match(warning, /grades/);
  assert.match(warning, /assignments/);
});

test('sortGroups orders by name with numbers in counting order, without changing the input', () => {
  const groups = [{ name: 'Team 10' }, { name: 'csa' }, { name: 'Team 2' }];
  assert.deepEqual(sortGroups(groups).map(group => group.name), ['csa', 'Team 2', 'Team 10']);
  assert.equal(groups[0].name, 'Team 10');
});

test('initialsFor uses the first and last names', () => {
  assert.equal(initialsFor('Ada King Lovelace'), 'AL');
  assert.equal(initialsFor('grace'), 'G');
  assert.equal(initialsFor('  '), '?');
});

test('tintFor gives the same name the same one of five tints', () => {
  assert.equal(tintFor('Ada Lovelace'), tintFor('Ada Lovelace'));
  for (const name of ['a', 'b', 'Ada', 'Grace Hopper', '']) {
    assert.match(tintFor(name), /^tint-[1-5]$/);
  }
});

test('pfpSrc passes paths and URLs through and wraps raw base64 image data', () => {
  assert.equal(pfpSrc('/images/toby.png'), '/images/toby.png');
  assert.equal(pfpSrc('https://example.com/a.png'), 'https://example.com/a.png');
  assert.equal(pfpSrc('iVBORw0KGgo'), 'data:image/png;base64,iVBORw0KGgo');
  assert.equal(pfpSrc(null), null);
});

test('dayLabel says Today and Yesterday for the last two days', () => {
  const now = new Date(2026, 9, 21, 15, 0);
  assert.equal(dayLabel(new Date(2026, 9, 21, 8, 0), now), 'Today');
  assert.equal(dayLabel(new Date(2026, 9, 20, 23, 59), now), 'Yesterday');
  assert.notEqual(dayLabel(new Date(2026, 9, 18, 12, 0), now), 'Yesterday');
});

test('isImageFile and downloadName read a shared file name', () => {
  assert.equal(isImageFile('Diagram.PNG'), true);
  assert.equal(isImageFile('notes.pdf'), false);
  assert.equal(downloadName('a/b\\plan.pdf'), 'plan.pdf');
  assert.equal(downloadName(''), 'file');
});
