import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesProject, normalizeSearch } from '../js/model.js';
import { readFileSync } from 'node:fs';
import { CapstoneApiError, createCapstoneApi } from '../js/mentor-api.js';
import { cardState, countStates, describeState, matchesChoiceFilter, resetMessage, resettableCount } from '../js/mentor-model.js';

test('search normalization ignores accents and letter case', () => {
  assert.equal(normalizeSearch('  Café Robotics  '), 'cafe robotics');
});

test('project filters combine course, school year, and every search word', () => {
  const project = {
    course: 'CSP',
    year: '2026-2027',
    text: 'Poway Veterans Organization accessibility chatbot',
  };
  assert.equal(matchesProject(project, { course: 'CSP', year: '2026-2027', query: 'veterans chat' }), true);
  assert.equal(matchesProject(project, { course: 'CSA', year: '2026-2027' }), false);
  assert.equal(matchesProject(project, { course: 'all', year: '2025-2026' }), false);
  assert.equal(matchesProject(project, { query: 'chatbot missing' }), false);
});

const mentoring = {
  actions: { interested: 'Interested', skip: 'Skip', 'remove-interest': 'Remove interest', 'undo-skip': 'Undo skip',
    apply: 'Apply now', 'apply-again': 'Apply again', cancel: 'Cancel request' },
  states: {
    default: { actions: ['interested', 'skip', 'apply'] },
    interested: { pill: 'Interested', tone: 'neutral', actions: ['remove-interest', 'skip', 'apply'] },
    skipped: { pill: 'Skipped', tone: 'neutral', actions: ['undo-skip'] },
    pending: { pill: 'Pending approval', tone: 'warn', actions: ['cancel'] },
    approved: { pill: 'Mentoring', tone: 'good', actions: [] },
    denied: { pill: 'Not approved', tone: 'bad', actions: ['interested', 'skip', 'apply-again'] },
  },
  filters: [
    { id: 'all', states: [] },
    { id: 'interested', states: ['interested'] },
    { id: 'applied', states: ['pending', 'approved', 'denied'] },
    { id: 'skipped', states: ['skipped'] },
  ],
  text: { reset_none: 'none', reset_one: 'one', reset_many: '{count} projects', error_failed: 'failed', error_unreachable: 'offline' },
};
const labels = (state) => describeState(mentoring, state).actions.map((action) => action.label);

test('the data file drives each card state, and it matches the data on disk', () => {
  assert.deepEqual(labels('default'), ['Interested', 'Skip', 'Apply now']);
  assert.deepEqual(labels('skipped'), ['Undo skip']);
  assert.deepEqual(labels('pending'), ['Cancel request']);
  assert.deepEqual(labels('approved'), []);
  assert.deepEqual(labels('denied'), ['Interested', 'Skip', 'Apply again']);
  assert.throws(() => describeState(mentoring, 'made-up'), /Unknown Capstone card state/);
  const yaml = readFileSync(new URL('../data/capstone_mentoring.yml', import.meta.url), 'utf8');
  for (const [state, { actions }] of Object.entries(mentoring.states)) {
    assert.match(yaml, new RegExp(`  ${state}:[\\s\\S]*?actions: \\[${actions.join(', ')}\\]`));
  }
});

test('Apply is the only primary action', () => {
  for (const state of Object.keys(mentoring.states)) {
    for (const action of describeState(mentoring, state).actions) {
      assert.equal(action.primary, action.id.startsWith('apply'));
    }
  }
});

test('a project with no stored choice is in the default state', () => {
  assert.equal(cardState({}, '/capstone/a/'), 'default');
  assert.equal(cardState(null, '/capstone/a/'), 'default');
  assert.equal(cardState({ '/capstone/a/': { status: 'pending' } }, '/capstone/a/'), 'pending');
});

test('filters select the right states, and a game card shows only under All', () => {
  const shown = (filter) => Object.keys(mentoring.states).filter((state) => matchesChoiceFilter(mentoring, state, filter));
  assert.equal(shown('all').length, 6);
  assert.deepEqual(shown('interested'), ['interested']);
  assert.deepEqual(shown('applied'), ['pending', 'approved', 'denied']);
  assert.deepEqual(shown('skipped'), ['skipped']);
  assert.equal(matchesChoiceFilter(mentoring, null, 'all'), true);
  assert.equal(matchesChoiceFilter(mentoring, null, 'applied'), false);
});

test('counts and Reset leave pending, approved, and denied out of what Reset changes', () => {
  const choices = {
    '/capstone/a/': { status: 'interested' }, '/capstone/b/': { status: 'skipped' },
    '/capstone/c/': { status: 'pending' }, '/capstone/d/': { status: 'approved' }, '/capstone/e/': { status: 'denied' },
  };
  assert.deepEqual(countStates(Object.keys(choices), choices), { interested: 1, pending: 1, approved: 1, skipped: 1 });
  assert.equal(resettableCount(choices), 2);
  assert.equal(resetMessage(mentoring, 0), 'none');
  assert.equal(resetMessage(mentoring, 1), 'one');
  assert.equal(resetMessage(mentoring, 2), '2 projects');
});

function fakeApi(response) {
  const calls = [];
  const api = createCapstoneApi({
    javaURI: 'http://spring.test',
    fetchOptions: { credentials: 'include', headers: {} },
    text: mentoring.text,
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (response instanceof Error) throw response;
      return response;
    },
  });
  return { api, calls };
}

test('the API client sends the agreed routes and never a mentor id', async () => {
  const { api, calls } = fakeApi({ ok: true, status: 200, json: async () => ({}) });
  await api.setChoice('/capstone/a/', 'skipped');
  await api.requestProject('/capstone/a/');
  await api.cancelRequest('/capstone/a/');
  await api.resetChoices();
  await api.approvedMentors();
  assert.deepEqual(calls.map(({ url, options }) => `${options.method} ${url.replace('http://spring.test/api/person/capstones', '')}`),
    ['PUT /choice', 'POST /request', 'DELETE /request', 'DELETE /choices', 'GET /mentors']);
  assert.deepEqual(JSON.parse(calls[0].options.body), { project: '/capstone/a/', status: 'skipped' });
  assert.equal(calls[3].options.credentials, 'include');
  assert.equal(calls[4].options.credentials, 'omit');
});

test('a refused action reports the server message, and a network failure is clear', async () => {
  const refused = fakeApi({ ok: false, status: 409, json: async () => ({ message: 'Undo skip first.' }) });
  await assert.rejects(refused.api.requestProject('/capstone/a/'),
    (error) => error instanceof CapstoneApiError && error.status === 409 && error.message === 'Undo skip first.');
  await assert.rejects(fakeApi(new Error('down')).api.resetChoices(), /offline/);
});
