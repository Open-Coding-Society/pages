import assert from 'node:assert/strict';
import test from 'node:test';

// The team chat is Messages' group chat embed, so its tests run on Messages' fake DOM.
import { installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { CapstoneTeamChat } from '../js/team-chat.js';
import { TeamChatAccess } from '../js/team-chat-access.js';
import { TeamGroupApi } from '../js/team-group-api.js';

const roles = (...names) => names.map(name => ({ name }));
const student = { id: 1, uid: 'ana', name: 'Ana Student', roles: roles('ROLE_USER', 'ROLE_STUDENT') };
const teammate = { id: 2, uid: 'ben', name: 'Ben Student', roles: roles('ROLE_USER') };
const mentor = { id: 3, uid: 'pat', name: 'Pat Mentor', roles: roles('ROLE_USER', 'ROLE_MENTOR') };
const outsider = { id: 5, uid: 'cy', name: 'Cy Student', roles: roles('ROLE_USER') };
const teacher = { id: 8, uid: 'mort', name: 'Mr. Mortensen', roles: roles('ROLE_USER', 'ROLE_TEACHER') };

const asMember = (person, isMentor = false) => ({ id: person.id, uid: person.uid, name: person.name, mentor: isMentor });
const NAME = 'OCS Communication Systems';
const team = { id: 7, name: NAME, members: [asMember(student), asMember(teammate), asMember(mentor, true)] };
const pair = { id: 9, name: NAME, members: [asMember(student), asMember(mentor, true)] };

const TEXTS = {
  loading: 'Loading the team chat…',
  signIn: 'Sign in to see the team chat.',
  unavailable: "The team chat isn't available right now.",
  notMember: "This chat is for {group}'s members and mentors.",
  mentorWaiting: 'You’ll see this chat once a member of {group} adds you.',
  notFound: "There's no group named {group} in Messages yet.",
  openInMessages: 'Open in Messages',
  embed: { placeholder: 'Message the team…' },
  mentors: {
    title: 'Mentors', none: 'No mentors yet.', findLabel: 'Find a mentor', findHint: 'Verified mentors only.',
    search: 'Search', noResults: 'No mentors match.', add: 'Add', remove: 'Remove',
    added: '{name} added.', removed: '{name} removed.', reasons: { failed: 'Try again.' },
  },
};

// --- TeamChatAccess: pure ---

test('a mentor has ROLE_MENTOR and no teacher or admin role, with roles as names or objects', () => {
  assert.equal(TeamChatAccess.isMentor(mentor), true);
  assert.equal(TeamChatAccess.isMentor({ roles: ['ROLE_USER', 'ROLE_MENTOR'] }), true);
  assert.equal(TeamChatAccess.isMentor({ roles: roles('ROLE_MENTOR', 'ROLE_TEACHER') }), false);
  assert.equal(TeamChatAccess.isMentor({ roles: roles('ROLE_MENTOR', 'ROLE_ADMIN') }), false);
  assert.equal(TeamChatAccess.isMentor(student), false);
  assert.equal(TeamChatAccess.isMentor(null), false);
  assert.equal(TeamChatAccess.isStaff(teacher), true);
  assert.equal(TeamChatAccess.isStaff(mentor), false);
});

test('the group is found by its exact name only', () => {
  const groups = [{ id: 1, name: `${NAME} 2` }, { id: 2, name: NAME.toLowerCase() }, team];
  assert.equal(TeamChatAccess.findGroup(groups, NAME), team);
  assert.equal(TeamChatAccess.findGroup(groups.slice(0, 2), NAME), null);
  assert.equal(TeamChatAccess.findGroup(null, NAME), null);
});

test('membership is by id', () => {
  assert.equal(TeamChatAccess.isMember({ id: 2 }, team), true);
  assert.equal(TeamChatAccess.isMember(outsider, team), false);
  assert.equal(TeamChatAccess.isMember(student, null), false);
});

test('what each viewer sees', () => {
  assert.equal(TeamChatAccess.viewFor(student, team), 'chat');
  assert.equal(TeamChatAccess.viewFor(mentor, team), 'chat');
  assert.equal(TeamChatAccess.viewFor(mentor, null), 'mentor-waiting');
  assert.equal(TeamChatAccess.viewFor(student, pair), 'chat');
  assert.equal(TeamChatAccess.viewFor(outsider, team), 'not-member');
  assert.equal(TeamChatAccess.viewFor(outsider, null), 'not-member');
  assert.equal(TeamChatAccess.viewFor(teacher, team), 'chat');
  assert.equal(TeamChatAccess.viewFor(teacher, null), 'not-found');
});

// --- TeamGroupApi: the requests ---

function fakeFetch(answers) {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url, method: options?.method ?? 'GET', credentials: options?.credentials });
    const answer = answers[`${options?.method ?? 'GET'} ${url}`];
    if (answer instanceof Error) throw answer;
    if (!answer) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: answer.status < 400, status: answer.status, json: async () => answer.body };
  };
  return { fetch, calls };
}

const SPRING = 'http://localhost:8585';
const fetchOptions = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };

test('me() reads the signed-in person with the site fetch options', async () => {
  const { fetch, calls } = fakeFetch({ [`GET ${SPRING}/api/person/get`]: { status: 200, body: student } });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.deepEqual(await api.me(), { ok: true, status: 200, data: student, reason: '' });
  assert.equal(calls[0].credentials, 'include');
});

test('the browser fetch is called as a function, not as a method of the api', async () => {
  const original = globalThis.fetch;
  // A browser's fetch throws "Illegal invocation" when called with any other this.
  globalThis.fetch = function (url) {
    if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ url, uid: 'ana' }) });
  };
  try {
    const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions });
    assert.deepEqual(await api.me(), { ok: true, status: 200, data: { url: `${SPRING}/api/person/get`, uid: 'ana' }, reason: '' });
  } finally {
    globalThis.fetch = original;
  }
});

test('findByName answers only the group with that exact name, and encodes it', async () => {
  const url = `${SPRING}/api/groups/search?name=${encodeURIComponent(NAME)}`;
  const { fetch } = fakeFetch({ [`GET ${url}`]: { status: 200, body: [{ id: 1, name: `${NAME} 2` }, team] } });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.equal((await api.findByName(NAME)).data, team);
});

test('adding a member posts to the members route and returns the group', async () => {
  const { fetch, calls } = fakeFetch({ [`POST ${SPRING}/api/groups/7/members/3`]: { status: 200, body: team } });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.deepEqual(await api.addMember(7, 3), { ok: true, status: 200, data: team, reason: '' });
  assert.equal(calls[0].method, 'POST');
});

test('a refusal keeps Spring\'s reason', async () => {
  const body = { error: 'too small', reason: 'mentor_team_too_small' };
  const { fetch } = fakeFetch({ [`POST ${SPRING}/api/groups/9/members/3`]: { status: 403, body } });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.deepEqual(await api.addMember(9, 3), { ok: false, status: 403, data: body, reason: 'mentor_team_too_small' });
});

test('people search and removing a member use their routes', async () => {
  const { fetch, calls } = fakeFetch({
    [`GET ${SPRING}/api/people/search?query=p%26t`]: { status: 200, body: [mentor] },
    [`DELETE ${SPRING}/api/groups/7/members/3`]: { status: 200, body: team },
  });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.deepEqual((await api.searchPeople('p&t')).data, [mentor]);
  assert.equal((await api.removeMember(7, 3)).ok, true);
  assert.deepEqual(calls.map(call => call.method), ['GET', 'DELETE']);
});

test('a success whose body is not JSON is a failure, not an empty answer', async () => {
  const fetch = async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token <'); } });
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
    assert.deepEqual(await api.groupsOf(1), { ok: false, status: 200, data: null, reason: '' });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /\/api\/groups\/person\/1/);
  } finally {
    console.warn = originalWarn;
  }
});

test('a network failure answers status 0 instead of throwing', async () => {
  const { fetch } = fakeFetch({ [`GET ${SPRING}/api/person/get`]: new TypeError('Failed to fetch') });
  const api = new TeamGroupApi({ javaURI: SPRING, fetchOptions, fetch });
  assert.deepEqual(await api.me(), { ok: false, status: 0, data: null, reason: '' });
});

// --- CapstoneTeamChat: what the page shows ---

function fakeApi({ me = null, meStatus = 200, myGroups = [], byName = null } = {}) {
  const calls = [];
  const answer = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, data, reason: '' });
  return {
    calls,
    me: async () => { calls.push('me'); return me ? answer(me) : answer(null, meStatus); },
    groupsOf: async id => { calls.push(`groupsOf ${id}`); return answer(myGroups); },
    findByName: async name => { calls.push(`findByName ${name}`); return answer(byName); },
  };
}

function fakeEmbed() {
  const mounts = [];
  let destroyed = 0;
  return {
    mounts,
    destroyed: () => destroyed,
    module: {
      mountGroupChat: async (root, options) => {
        mounts.push({ root, options });
        return { state: 'ready', destroy: () => { destroyed += 1; } };
      },
    },
  };
}

function setUp({ api, springEnabled = true } = {}) {
  const { document } = installFakeDom();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const embed = fakeEmbed();
  const config = { springEnabled, baseurl: '', javaURI: SPRING };
  const chat = new CapstoneTeamChat(root, {
    groupName: NAME,
    config,
    texts: TEXTS,
    api,
    load: { embed: async () => embed.module, richText: async () => ({ fake: 'richText' }) },
  });
  return { root, embed, chat, config };
}

test('a member gets the chat, with a link to the group in Messages', async () => {
  const api = fakeApi({ me: student, myGroups: [team] });
  const { root, embed, chat, config } = setUp({ api });
  assert.equal(await chat.start(), 'chat');
  assert.equal(embed.mounts.length, 1);
  assert.equal(embed.mounts[0].options.groupId, 7);
  assert.equal(embed.mounts[0].options.config, config);
  assert.deepEqual(embed.mounts[0].options.richText, { fake: 'richText' });
  assert.deepEqual(embed.mounts[0].options.texts, TEXTS.embed);
  assert.equal(root.querySelector('a.ocs__btn').getAttribute('href'), '/dm?group=7');
  assert.deepEqual(api.calls, ['me', 'groupsOf 1']);
});

test('the chat shows the team\'s mentors under it, with the search for a member', async () => {
  const { root, chat } = setUp({ api: fakeApi({ me: student, myGroups: [team] }) });
  await chat.start();
  assert.equal(root.querySelector('h3').textContent, 'Mentors');
  assert.match(root.querySelector('li').textContent, /Pat Mentor/);
  assert.ok(root.querySelector('form'));
});

test('a mentor in the chat sees the team\'s mentors without the search', async () => {
  const { root, chat } = setUp({ api: fakeApi({ me: mentor, myGroups: [team] }) });
  await chat.start();
  assert.match(root.querySelector('li').textContent, /Pat Mentor/);
  assert.equal(root.querySelector('form'), null);
});

test('a mentor is looked up through their own groups only', async () => {
  const api = fakeApi({ me: mentor, myGroups: [team] });
  const { chat } = setUp({ api });
  assert.equal(await chat.start(), 'chat');
  assert.deepEqual(api.calls, ['me', 'groupsOf 3']);
});

test('a mentor whose own groups leave the team out gets a note on how they get in, and no chat', async () => {
  // Spring lists a group to its mentor only once they're in it and it has 2 members who aren't mentors.
  const { root, embed, chat } = setUp({ api: fakeApi({ me: mentor, myGroups: [] }) });
  assert.equal(await chat.start(), 'mentor-waiting');
  assert.equal(embed.mounts.length, 0);
  assert.equal(root.textContent, `You’ll see this chat once a member of ${NAME} adds you.`);
});

test('someone outside the team gets a note and no chat', async () => {
  const api = fakeApi({ me: outsider, myGroups: [] });
  const { root, embed, chat } = setUp({ api });
  assert.equal(await chat.start(), 'not-member');
  assert.equal(embed.mounts.length, 0);
  assert.equal(root.textContent, `This chat is for ${NAME}'s members and mentors.`);
  assert.deepEqual(api.calls, ['me', 'groupsOf 5']);
});

test('a teacher who is not a member finds the group by name', async () => {
  const api = fakeApi({ me: teacher, myGroups: [], byName: team });
  const { embed, chat } = setUp({ api });
  assert.equal(await chat.start(), 'chat');
  assert.equal(embed.mounts[0].options.groupId, 7);
  assert.deepEqual(api.calls, ['me', 'groupsOf 8', `findByName ${NAME}`]);
});

test('a teacher is told when the group is missing', async () => {
  const { root, chat } = setUp({ api: fakeApi({ me: teacher }) });
  assert.equal(await chat.start(), 'not-found');
  assert.equal(root.textContent, `There's no group named ${NAME} in Messages yet.`);
});

test('signed out shows the sign-in link', async () => {
  const { root, chat } = setUp({ api: fakeApi({ meStatus: 401 }) });
  assert.equal(await chat.start(), 'signed-out');
  const link = root.querySelector('a');
  assert.equal(link.getAttribute('href'), '/login');
  assert.equal(link.textContent, TEXTS.signIn);
});

test('when Spring does not answer, the chat says it is unavailable', async () => {
  const { root, chat } = setUp({ api: fakeApi({ meStatus: 0 }) });
  assert.equal(await chat.start(), 'unavailable');
  assert.equal(root.textContent, TEXTS.unavailable);
});

test('when the groups cannot be read, the chat says it is unavailable, not that you are outside the team', async () => {
  const api = fakeApi({ me: student });
  api.groupsOf = async () => ({ ok: false, status: 500, data: null, reason: '' });
  const { root, chat } = setUp({ api });
  assert.equal(await chat.start(), 'unavailable');
  assert.equal(root.textContent, TEXTS.unavailable);
});

test('when the chat cannot load, start() says so instead of throwing', async () => {
  const { document } = installFakeDom();
  const root = document.createElement('div');
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    const chat = new CapstoneTeamChat(root, {
      groupName: NAME, config: { springEnabled: true, baseurl: '' }, texts: TEXTS,
      api: fakeApi({ me: student, myGroups: [team] }),
      load: { embed: async () => { throw new TypeError('Failed to fetch dynamically imported module'); }, richText: async () => ({}) },
    });
    assert.equal(await chat.start(), 'unavailable');
    assert.equal(root.textContent, TEXTS.unavailable);
    assert.equal(warnings.length, 1);
  } finally {
    console.warn = originalWarn;
  }
});

test('destroying before the lookup finishes leaves the element empty and mounts nothing', async () => {
  const api = fakeApi({ me: student, myGroups: [team] });
  let answerGroups;
  api.groupsOf = () => new Promise(resolve => { answerGroups = () => resolve({ ok: true, status: 200, data: [team], reason: '' }); });
  const { root, embed, chat } = setUp({ api });
  const started = chat.start();
  await settle();
  chat.destroy();
  answerGroups();
  await started;
  assert.equal(embed.mounts.length, 0);
  assert.equal(root.childNodes.length, 0);
});

test('destroying while the chat is still mounting takes the chat down when it arrives', async () => {
  const { document } = installFakeDom();
  const root = document.createElement('div');
  let release;
  let destroyed = 0;
  const chat = new CapstoneTeamChat(root, {
    groupName: NAME, config: { springEnabled: true, baseurl: '' }, texts: TEXTS,
    api: fakeApi({ me: student, myGroups: [team] }),
    load: {
      embed: async () => ({
        mountGroupChat: () => new Promise(resolve => { release = () => resolve({ state: 'ready', destroy: () => { destroyed += 1; } }); }),
      }),
      richText: async () => ({}),
    },
  });
  const started = chat.start();
  await settle();
  chat.destroy();
  release();
  await started;
  assert.equal(destroyed, 1);
});

test('a Flask-only site makes no request and shows nothing', async () => {
  const api = fakeApi({ me: student, myGroups: [team] });
  const { root, chat } = setUp({ api, springEnabled: false });
  assert.equal(await chat.start(), 'unavailable');
  assert.deepEqual(api.calls, []);
  assert.equal(root.hidden, true);
});

test('destroy takes the embed down and empties the chat', async () => {
  const { root, embed, chat } = setUp({ api: fakeApi({ me: student, myGroups: [team] }) });
  await chat.start();
  chat.destroy();
  await settle();
  assert.equal(embed.destroyed(), 1);
  assert.equal(root.childNodes.length, 0);
});

test('a note is plain text even when the group name looks like markup', async () => {
  const api = fakeApi({ me: outsider });
  const { document } = installFakeDom();
  const root = document.createElement('div');
  const chat = new CapstoneTeamChat(root, {
    groupName: '<img src=x onerror=alert(1)>', config: { springEnabled: true, baseurl: '' }, texts: TEXTS, api,
    load: { embed: async () => ({}), richText: async () => ({}) },
  });
  await chat.start();
  assert.equal(root.querySelector('img'), null);
  assert.match(root.textContent, /<img src=x onerror=alert\(1\)>/);
});

test('fill puts values into a text and leaves unknown names alone', () => {
  assert.equal(CapstoneTeamChat.fill('Hi {group}, {other}', { group: 'Team' }), 'Hi Team, {other}');
});
