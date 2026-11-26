// The demo backend answers the calls OCS Messages makes to Spring, in Spring's shapes, and
// makes every server-side rule the README lists. The other systems' own modules read its answers.
// Run: node --test _projects/systems/community/tests/demo_backend.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DemoStore } from '../js/demo-store.js';
import { DemoBackend } from '../js/demo-backend.js';
import { Texts } from '../js/texts.js';
import { classifyDmEvent, classifyGroupEvent, dmMessage, groupMessage } from '../../messages/js/messages-model.js';
import { plainText } from '../../messages/js/schedule-model.js';
import { Conversation } from '../../messages/js/conversation-model.js';
import { loadCalendarModel, loadChatReply, loadMicroblog, loadSetup, loadTexts, NOW } from './fixtures.mjs';

const { encodeEventMarker, extractEventMarkers } = await loadCalendarModel();
const { stripChatMarkers } = await loadChatReply();
const { getSurveyResults, normalizeSurveyOptions } = await loadMicroblog();

const HOUR = 3600 * 1000;

// A store and backend on a clock the test can move.
function make() {
  const clock = { at: NOW.getTime() };
  const store = new DemoStore(loadSetup(), { now: () => new Date(clock.at), encodeEventMarker, extractEventMarkers });
  const backend = new DemoBackend(store, {
    texts: new Texts(loadTexts()), plainText, stripChatMarkers, normalizeSurveyOptions, extractPinMarker: Conversation.extractPinMarker,
  });
  return { store, backend, clock };
}

const refused = (status, reason) => (error) => {
  assert.equal(error.status, status, `status ${error.status}: ${error.message}`);
  if (reason) assert.equal(error.reason, reason);
  return true;
};

function follow(backend, topic) {
  const frames = [];
  const socket = backend.openSocket();
  socket.follow(topic, frame => frames.push(frame));
  return { frames, socket };
}

async function sideDeal(backend) {
  backend.viewAs(12);
  const raw = await backend.groupMessages(201);
  return raw.find(message => message.message.includes('side deal'));
}

test('group messages normalize with Messages\' groupMessage', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const messages = (await backend.groupMessages(201)).map(groupMessage);
  assert.equal(messages[0].senderName, 'Demo LP 2');
  assert.match(messages[0].body, /hiring plan/);
  assert.equal(new Date(messages[0].sentAt).getTime(), NOW.getTime() - 2600 * 60 * 1000);
  assert.ok(messages.every(message => message.id && message.key === message.id));
});

test('a send reaches a follower as a message frame, and the answer is the chat', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const { frames } = follow(backend, '/topic/group/201');
  const answer = await backend.sendGroupMessage(201, 'Hello from the test', null);
  const change = classifyGroupEvent(frames[0]);
  assert.equal(change.type, 'message');
  assert.equal(change.message.senderName, 'Demo LP 1');
  assert.equal(change.message.body, 'Hello from the test');
  assert.equal(answer.map(groupMessage).at(-1).id, change.message.id);
});

test('edits and deletes reach followers in Spring\'s frames', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const [{ id }] = (await backend.sendGroupMessage(201, 'first', null)).slice(-1);
  const { frames } = follow(backend, '/topic/group/201');
  await backend.editGroupMessage(201, id, 'second');
  await backend.deleteGroupMessage(201, id);
  assert.deepEqual(frames.map(frame => classifyGroupEvent(frame).type), ['edit', 'delete']);
  assert.equal(classifyGroupEvent(frames[0]).body, 'second');
  await assert.rejects(backend.editGroupMessage(201, id, 'gone'), refused(404), 'a deleted message can\'t be edited');
  const lpOnes = (await backend.groupMessages(201)).find(message => message.author === 'Demo LP 1');
  backend.viewAs(12);
  await assert.rejects(backend.editGroupMessage(201, lpOnes.id, 'not mine'), refused(403, 'not-author'));
  await assert.rejects(backend.deleteGroupMessage(201, lpOnes.id), refused(403, 'not-author'));
});

test('a direct message round-trips through dmMessage and classifyDmEvent', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const [conversation] = await backend.conversations();
  assert.deepEqual(conversation.participants.map(person => person.name).sort(), ['Demo LP 1', 'Demo Staff 1']);
  const history = (await backend.dmMessages(conversation.id)).map(dmMessage);
  assert.equal(history[0].senderName, 'Demo Staff 1');
  const { frames } = follow(backend, `/topic/dm/${conversation.id}`);
  const saved = await backend.sendDm(conversation.id, 'One more question', null);
  const change = classifyDmEvent(frames[0], conversation.id, () => false);
  assert.equal(change.type, 'message');
  assert.equal(change.message.senderKey, 'demo-lp-1');
  assert.equal(classifyDmEvent(saved, conversation.id, () => false).message.body, 'One more question');
});

test('an LP cannot post in updates, and staff post there only through approval', async () => {
  const { backend } = make();
  backend.viewAs(11);
  await assert.rejects(backend.sendGroupMessage(100, 'hi all', null), refused(403, 'staff-only'));
  backend.viewAs(1);
  await assert.rejects(backend.sendGroupMessage(100, 'straight out', null), refused(403, 'needs-approval'));
});

test('a member of another series cannot read it', async () => {
  const { backend } = make();
  backend.viewAs(14);
  await assert.rejects(backend.groupMessages(201), refused(403, 'not-member'));
  assert.deepEqual(backend.channels().map(channel => channel.id), [100, 102, 202]);
});

test('an LP cannot start a direct message with another LP', async () => {
  const { backend } = make();
  backend.viewAs(11);
  await assert.rejects(backend.startConversation([12]), refused(403, 'lp-to-lp'));
  const existing = await backend.startConversation([1]);
  assert.equal(existing.id, (await backend.conversations())[0].id, 'the conversation with Demo Staff 1 already exists');
  backend.viewAs(14);
  await assert.rejects(backend.dmMessages(existing.id), refused(403), 'only its two people read a conversation');
});

test('staff cannot approve their own update; another staff member can, and it reaches the channel', async () => {
  const { backend } = make();
  backend.viewAs(1);
  const [pending] = await backend.pendingUpdates();
  assert.equal(pending.channelId, 103);
  await assert.rejects(backend.approveUpdate(pending.id), refused(403, 'own-update'));
  const { frames } = follow(backend, '/topic/group/103');
  backend.viewAs(2);
  const approved = await backend.approveUpdate(pending.id);
  assert.equal(approved.pushText, 'New update for Demo Series 3');
  assert.equal(classifyGroupEvent(frames[0]).message.senderName, 'Demo Staff 1', 'the update goes out under its writer');
  assert.deepEqual(await backend.pendingUpdates(), []);
  backend.viewAs(13);
  assert.ok((await backend.groupMessages(103)).some(message => message.message.includes('what to expect')));
  backend.viewAs(11);
  await assert.rejects(backend.pendingUpdates(), refused(403));
});

test('a vote counts with the microblog\'s getSurveyResults, and voting again moves it', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const [poll] = await backend.polls(100);
  assert.equal(getSurveyResults(poll, 11).total, 4);
  await backend.vote(poll.id, 1);
  let results = getSurveyResults((await backend.polls(100))[0], 11);
  assert.equal(results.myChoice, 1);
  assert.equal(results.total, 5);
  await backend.vote(poll.id, 2);
  results = getSurveyResults((await backend.polls(100))[0], 11);
  assert.deepEqual([results.myChoice, results.total], [2, 5]);
  await assert.rejects(backend.vote(poll.id, 7), refused(400));
});

test('staff start polls; the choices are checked the microblog\'s way', async () => {
  const { backend } = make();
  backend.viewAs(11);
  await assert.rejects(backend.createPoll(100, 'Lunch?', ['Yes', 'No']), refused(403, 'staff-only'));
  backend.viewAs(2);
  await assert.rejects(backend.createPoll(100, 'Lunch?', ['Only one']), refused(400));
  const poll = await backend.createPoll(100, 'Lunch?', [' Yes ', 'No', '']);
  assert.deepEqual(poll.survey.options, ['Yes', 'No']);
});

test('hide removes an edited message and keeps every version', async () => {
  const { backend } = make();
  const message = await sideDeal(backend);
  backend.viewAs(19);
  await backend.editGroupMessage(201, message.id, 'Never mind.');
  backend.viewAs(3);
  const [report] = await backend.reports();
  assert.equal(report.message.id, message.id);
  assert.deepEqual(report.versions.map(version => version.html), [message.message, 'Never mind.']);
  const { frames } = follow(backend, '/topic/group/201');
  await backend.resolveReport(report.id, { action: 'hide', note: 'Selling to members' });
  assert.equal(classifyGroupEvent(frames[0]).type, 'delete');
  assert.deepEqual(await backend.reports(), []);
  backend.viewAs(12);
  assert.ok(!(await backend.groupMessages(201)).some(entry => entry.id === message.id));
  backend.viewAs(3);
  assert.equal((await backend.versions(201, message.id)).length, 2);
  assert.match((await backend.moderationLog())[0].text, /Hid Demo LP 9's message in Demo Series 1/);
});

test('a muted member\'s send is refused, and allowed once the mute ends', async () => {
  const { backend, clock } = make();
  backend.viewAs(3);
  const [report] = await backend.reports();
  await backend.resolveReport(report.id, { action: 'mute', hours: 24 });
  backend.viewAs(19);
  await assert.rejects(backend.sendGroupMessage(201, 'still here', null), refused(403, 'muted'));
  assert.equal(new Date(backend.muteOf(201, 19).until).getTime(), NOW.getTime() + 24 * HOUR);
  clock.at += 24 * HOUR + 1;
  assert.equal(backend.muteOf(201, 19), null);
  await backend.sendGroupMessage(201, 'back again', null);
});

test('removing a member takes the series away', async () => {
  const { backend } = make();
  backend.viewAs(3);
  const [report] = await backend.reports();
  await backend.resolveReport(report.id, { action: 'remove' });
  backend.viewAs(19);
  await assert.rejects(backend.groupMessages(201), refused(403, 'not-member'));
  assert.ok(!backend.channels().some(channel => channel.id === 201));
});

test('reports check the reason, and nobody reports their own message', async () => {
  const { backend } = make();
  const message = await sideDeal(backend);
  backend.viewAs(19);
  await assert.rejects(backend.report({ channelId: 201, messageId: message.id, reason: 'spam' }), refused(403, 'self'));
  backend.viewAs(11);
  await assert.rejects(backend.report({ channelId: 201, messageId: message.id, reason: 'rude' }), refused(400));
  const report = await backend.report({ channelId: 201, messageId: message.id, reason: 'spam', note: 'again' });
  assert.equal(report.status, 'open');
  await assert.rejects(backend.reports(), refused(403), 'an LP has no review queue');
});

test('a message is sent as the current viewer', async () => {
  const { backend } = make();
  backend.viewAs(11);
  backend.viewAs(12);
  assert.equal((await backend.currentPerson()).name, 'Demo LP 2');
  const { frames } = follow(backend, '/topic/group/201');
  await backend.sendGroupMessage(201, 'who am I', null);
  assert.equal(frames[0].sender, 'Demo LP 2');
});

test('only staff share documents in a series', async () => {
  const { backend } = make();
  backend.viewAs(11);
  await assert.rejects(backend.uploadGroupFile(201, 'mine.txt', btoa('x')), refused(403, 'staff-only'));
  backend.viewAs(1);
  const { frames } = follow(backend, '/topic/group/201');
  await backend.uploadGroupFile(201, 'notes.txt', btoa('made up'));
  assert.deepEqual(classifyGroupEvent(frames[0]), { type: 'file', sender: 'Demo Staff 1', filename: 'notes.txt' });
  backend.viewAs(12);
  assert.deepEqual((await backend.groupFiles(201)).map(file => file.filename), ['Demo Company A one-pager (made up).txt', 'notes.txt']);
});

test('the calendar store lists events from update markers, and your own', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const calendar = backend.calendarStore();
  const titles = async () => (await calendar.listRange('2026-11-01', '2026-12-31')).map(event => `${event.date} ${event.title}`);
  assert.deepEqual(await titles(), ['2026-11-20 Demo Series 1 Q&A call', '2026-11-26 Demo LP call', '2026-12-03 Demo Series 2 closing date']);
  await backend.addCalendarEvent({ title: 'Read the one-pager', date: '2026-11-20', description: '', type: 'personal', period: 'Personal' });
  assert.ok((await titles()).includes('2026-11-20 Read the one-pager'));
  backend.viewAs(16);
  assert.deepEqual(await titles(), ['2026-11-26 Demo LP call'], 'Demo LP 6 is only in Demo Series 3');
});

test('a mute leaves a hidden-message row and an action row in the records', async () => {
  const { backend } = make();
  backend.viewAs(3);
  const [report] = await backend.reports();
  await backend.resolveReport(report.id, { action: 'mute', hours: 24, note: 'Selling to members' });
  backend.viewAs(1);
  const { csv } = await backend.exportCsv({ personId: 19 });
  const lines = csv.trim().split('\r\n').slice(1);
  assert.equal(lines.length, 3, 'the message, its hiding, and the mute');
  assert.match(lines[1], /hidden by a moderator,"Anyone want in on a side deal.*",Demo Moderator: Selling to members$/);
  assert.match(lines[2], /moderator action,"?Hid Demo LP 9's message and muted them in Demo Series 1 until .*"?,Demo Moderator: Selling to members$/);
});

test('records export holds edits and moderator actions, for staff only', async () => {
  const { backend } = make();
  const message = await sideDeal(backend);
  backend.viewAs(19);
  await backend.editGroupMessage(201, message.id, '=HYPERLINK("x")');
  backend.viewAs(3);
  const [report] = await backend.reports();
  await backend.resolveReport(report.id, { action: 'hide' });
  await assert.rejects(backend.exportCsv({}), refused(403), 'moderators don\'t export');
  backend.viewAs(1);
  const { csv, count } = await backend.exportCsv({ personId: 19 });
  const lines = csv.trim().split('\r\n');
  assert.equal(lines[0], 'at,channel,person,kind,text,note');
  assert.equal(count, lines.length - 1);
  assert.ok(lines.some(line => line.includes(',edit,\'=HYPERLINK') || line.includes(',edit,"\'=HYPERLINK')), 'the edit is there, as text');
  assert.ok(lines.some(line => line.includes('hidden by a moderator')));
});

test('a pin from Messages reads as a pin in the records, with the pinned message\'s words', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const [{ id }] = (await backend.sendGroupMessage(201, 'Pin this one', null)).slice(-1);
  await backend.sendGroupMessage(201, Conversation.pinMarker(id), null);
  await backend.sendGroupMessage(201, Conversation.unpinMarker(id), null);
  backend.viewAs(1);
  const { csv } = await backend.exportCsv({ personId: 11 });
  const rows = csv.trim().split('\r\n').slice(1).map(line => line.split(','));
  const kinds = rows.map(row => row[3]);
  assert.ok(kinds.includes('pinned a message'), kinds.join(' | '));
  assert.ok(kinds.includes('unpinned a message'), kinds.join(' | '));
  for (const row of rows.filter(entry => /pinned a message/.test(entry[3]))) assert.equal(row[4], 'Pin this one', row.join(','));
  assert.ok(rows.every(row => row[4] !== ''), 'no record row is left without words');
});

test('the live feed follows the same rules as reading: only groups and conversations you are in', async () => {
  const { backend } = make();
  backend.viewAs(11);
  const [conversation] = await backend.conversations();
  backend.viewAs(19);
  assert.throws(() => backend.subscribe('/topic/group/202', () => {}), refused(403, 'not-member'));
  assert.throws(() => backend.subscribe(`/topic/dm/${conversation.id}`, () => {}), refused(403, 'not-member'));
  assert.throws(() => backend.subscribe('/topic/anything', () => {}), refused(404));
  const { frames } = follow(backend, '/topic/group/202');
  backend.viewAs(14);
  await backend.sendGroupMessage(202, 'Only Demo Series 2 should see this', null);
  assert.equal(frames.length, 0, 'a refused follow hears nothing');
  const { frames: allowed } = follow(backend, '/topic/group/202');
  await backend.sendGroupMessage(202, 'Demo Series 2 sees this', null);
  assert.equal(allowed.length, 1, 'a member still hears their own group');
});

test('nobody edits a sent update: a correction goes through approval like any other', async () => {
  const { backend } = make();
  backend.viewAs(1);
  const update = (await backend.groupMessages(101)).find(message => message.author === 'Demo Staff 1');
  assert.ok(update, 'Demo Staff 1 has an update in Demo Series 1 updates');
  await assert.rejects(backend.editGroupMessage(101, update.id, 'Changed after approval'), refused(403, 'needs-approval'));
  assert.equal((await backend.groupMessages(101)).find(message => message.id === update.id).message, update.message);
});

test('deleting an update that carries an event tells the calendar', async () => {
  const { backend } = make();
  backend.viewAs(2);
  const update = (await backend.groupMessages(102)).find(message => message.author === 'Demo Staff 2' && message.message.includes('[[event:'));
  assert.ok(update, 'Demo Staff 2 has an update with an event in Demo Series 2 updates');
  const heard = [];
  const stop = backend.calendarStore().subscribe(() => heard.push('calendar'));
  await backend.deleteGroupMessage(102, update.id);
  stop?.();
  assert.equal(heard.length, 1);
});
