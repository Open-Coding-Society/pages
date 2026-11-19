import assert from 'node:assert/strict';
import test from 'node:test';

// The panel sits beside Messages' group chat embed, so it runs on Messages' fake DOM too.
import { fakeEvent, installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { TeamMentorsPanel } from '../js/team-mentors.js';

const roles = (...names) => names.map(name => ({ name }));
const member = (id, name, isMentor = false) => ({ id, uid: name.toLowerCase().split(' ')[0], name, mentor: isMentor });
const student = { id: 1, uid: 'ana', name: 'Ana Student', roles: roles('ROLE_USER') };
const mentor = { id: 3, uid: 'pat', name: 'Pat Mentor', roles: roles('ROLE_USER', 'ROLE_MENTOR') };
const teacher = { id: 8, uid: 'mort', name: 'Mr. Mortensen', roles: roles('ROLE_TEACHER') };
const outsider = { id: 5, uid: 'cy', name: 'Cy Student', roles: roles('ROLE_USER') };

const withMentor = { id: 7, name: 'Team', members: [member(1, 'Ana Student'), member(2, 'Ben Student'), member(3, 'Pat Mentor', true)] };
const noMentor = { id: 7, name: 'Team', members: [member(1, 'Ana Student'), member(2, 'Ben Student')] };

const TEXTS = {
  title: 'Mentors',
  none: 'No mentors yet.',
  findLabel: 'Find a mentor',
  findHint: 'Mentors are accounts a teacher has verified.',
  search: 'Search',
  noResults: 'No mentors match that name.',
  add: 'Add',
  remove: 'Remove',
  added: '{name} can now see this chat.',
  removed: '{name} was removed.',
  reasons: {
    mentor_team_too_small: 'Add at least 2 team members first.',
    team_manages_mentors: 'Only the team or a teacher can do that.',
    failed: "Couldn't save that change. Try again.",
  },
};

function fakeApi({ people = [], add = null, remove = null } = {}) {
  const calls = [];
  return {
    calls,
    searchPeople: async query => { calls.push(`search ${query}`); return { ok: true, status: 200, data: people, reason: '' }; },
    addMember: async (groupId, personId) => {
      calls.push(`add ${groupId} ${personId}`);
      return add ?? { ok: true, status: 200, data: withMentor, reason: '' };
    },
    removeMember: async (groupId, personId) => {
      calls.push(`remove ${groupId} ${personId}`);
      return remove ?? { ok: true, status: 200, data: noMentor, reason: '' };
    },
  };
}

function setUp({ viewer = student, group = withMentor, api = fakeApi() } = {}) {
  const { document } = installFakeDom();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const changes = [];
  const panel = new TeamMentorsPanel(root, { api, group, viewer, texts: TEXTS, onChange: next => changes.push(next) });
  panel.render();
  return { root, panel, api, changes };
}

const buttons = (root, label) => root.querySelectorAll('button').filter(button => button.textContent === label);
const listItems = root => root.querySelectorAll('li');

test('only the members Spring marks as mentors are listed', () => {
  const { root } = setUp();
  const items = listItems(root);
  assert.equal(items.length, 1);
  assert.match(items[0].textContent, /Pat Mentor/);
  assert.equal(items[0].querySelector('strong.ocs__team-name').textContent, 'Pat Mentor');
  assert.equal(items[0].querySelector('small').textContent, 'pat');
});

test('no mentors yet says so', () => {
  const { root } = setUp({ group: noMentor });
  assert.equal(listItems(root).length, 0);
  assert.match(root.textContent, /No mentors yet\./);
});

test('the team and teachers get Remove and the search; a mentor gets the list alone', () => {
  assert.equal(buttons(setUp({ viewer: student }).root, 'Remove').length, 1);
  assert.ok(setUp({ viewer: student }).root.querySelector('form'));
  assert.equal(buttons(setUp({ viewer: teacher }).root, 'Remove').length, 1);
  const asMentor = setUp({ viewer: mentor }).root;
  assert.equal(buttons(asMentor, 'Remove').length, 0);
  assert.equal(asMentor.querySelector('form'), null);
  const asOutsider = setUp({ viewer: outsider }).root;
  assert.equal(asOutsider.querySelector('form'), null);
});

test('canManage matches Spring: a member who is not a mentor, or staff', () => {
  assert.equal(TeamMentorsPanel.canManage(student, withMentor), true);
  assert.equal(TeamMentorsPanel.canManage(teacher, withMentor), true);
  assert.equal(TeamMentorsPanel.canManage(mentor, withMentor), false);
  assert.equal(TeamMentorsPanel.canManage(outsider, withMentor), false);
});

test('the search offers only mentors who are not in the group yet', async () => {
  const newMentor = { id: 9, uid: 'lee', name: 'Lee Mentor', roles: roles('ROLE_USER', 'ROLE_MENTOR') };
  const api = fakeApi({ people: [outsider, mentor, newMentor, { ...teacher, roles: roles('ROLE_MENTOR', 'ROLE_TEACHER') }] });
  const { root } = setUp({ api, group: withMentor });
  root.querySelector('input').value = '  lee ';
  root.querySelector('form').dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(api.calls, ['search lee']);
  const adds = buttons(root, 'Add');
  assert.equal(adds.length, 1);
  assert.match(adds[0].closest('li').textContent, /Lee Mentor/);
});

test('a blank search asks Spring nothing', async () => {
  const api = fakeApi();
  const { root } = setUp({ api });
  root.querySelector('input').value = '   ';
  root.querySelector('form').dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(api.calls, []);
});

test('a search with no mentors says so', async () => {
  const { root } = setUp({ api: fakeApi({ people: [outsider] }) });
  root.querySelector('input').value = 'cy';
  root.querySelector('form').dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.match(root.textContent, /No mentors match that name\./);
});

test('Add calls the members route, redraws from Spring\'s answer and tells the page', async () => {
  const api = fakeApi({ people: [mentor] });
  const { root, changes } = setUp({ api, group: noMentor });
  root.querySelector('input').value = 'pat';
  root.querySelector('form').dispatchEvent(fakeEvent('submit'));
  await settle();
  buttons(root, 'Add')[0].dispatchEvent(fakeEvent('click'));
  await settle();
  assert.deepEqual(api.calls, ['search pat', 'add 7 3']);
  assert.equal(listItems(root).filter(item => /Pat Mentor/.test(item.textContent)).length, 1);
  assert.match(root.querySelector('[role="status"]').textContent, /Pat Mentor can now see this chat\./);
  assert.deepEqual(changes, [withMentor]);
});

test('a refusal shows the words for its reason and changes nothing', async () => {
  const add = { ok: false, status: 403, data: {}, reason: 'mentor_team_too_small' };
  const { root, panel, changes } = setUp({ api: fakeApi({ add }), group: noMentor });
  await panel.add(mentor);
  assert.equal(root.querySelector('[role="status"]').textContent, 'Add at least 2 team members first.');
  assert.equal(listItems(root).length, 0);
  assert.deepEqual(changes, []);
});

test('a refusal with an unknown reason, or no answer, shows the general message', async () => {
  const add = { ok: false, status: 0, data: null, reason: '' };
  const { root, panel } = setUp({ api: fakeApi({ add }), group: noMentor });
  await panel.add(mentor);
  assert.equal(root.querySelector('[role="status"]').textContent, TEXTS.reasons.failed);
});

test('Remove calls the members route and redraws', async () => {
  const api = fakeApi();
  const { root } = setUp({ api });
  buttons(root, 'Remove')[0].dispatchEvent(fakeEvent('click'));
  await settle();
  assert.deepEqual(api.calls, ['remove 7 3']);
  assert.equal(listItems(root).length, 0);
  assert.match(root.textContent, /Pat Mentor was removed\./);
});

test('names are shown as text, never as markup', () => {
  const sneaky = { id: 7, name: 'Team', members: [member(1, 'Ana Student'), member(2, 'Ben'), { id: 4, uid: 'x', name: '<img src=x onerror=alert(1)>', mentor: true }] };
  const { root } = setUp({ group: sneaky });
  assert.equal(root.querySelector('img'), null);
  assert.match(root.textContent, /<img src=x onerror=alert\(1\)>/);
});

test('a name is put into the status exactly, even with $ patterns in it', async () => {
  const odd = { id: 9, uid: 'odd', name: "Ann $& Lee $'", roles: roles('ROLE_USER', 'ROLE_MENTOR') };
  const { root, panel } = setUp({ group: noMentor });
  await panel.add(odd);
  assert.equal(root.querySelector('[role="status"]').textContent, "Ann $& Lee $' can now see this chat.");
});
