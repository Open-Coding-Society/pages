import assert from 'node:assert/strict';
import test from 'node:test';

// The Members dialog. The page passes canManage from Allowances: an account Spring lets add and remove no one
// gets neither in the dialog. Spring marks each member who is a mentor, and the list shows it for everyone.
import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();
const { initMembers } = await import('../js/group-dialogs.js');

const roles = (...names) => names.map(name => ({ name }));
const ana = { id: 1, uid: 'ana', name: 'Ana Student', roles: roles('ROLE_USER') };
const pat = { id: 3, uid: 'pat', name: 'Pat Mentor', roles: roles('ROLE_USER', 'ROLE_MENTOR') };
const group = {
  id: 7, name: 'Team Rocket',
  members: [
    { id: 1, uid: 'ana', name: 'Ana Student', mentor: false },
    { id: 2, uid: 'ben', name: 'Ben Student', mentor: false },
    { id: 3, uid: 'pat', name: 'Pat Mentor', mentor: true },
  ],
};

function open(me, options = {}, shown = group) {
  const make = tag => document.createElement(tag);
  const elements = {
    dialog: make('div'), title: make('h3'), list: make('tbody'), results: make('div'), status: make('p'),
    search: make('input'), searchField: make('div'), deleteSection: make('div'), deleteWarning: make('p'), deleteOpen: make('button'),
  };
  const close = make('button');
  close.setAttribute('data-close', '');
  elements.search.setAttribute('data-focus', '');
  elements.dialog.append(close, elements.title, elements.list, elements.searchField, elements.results, elements.status, elements.deleteSection);
  elements.searchField.appendChild(elements.search);
  const members = initMembers({ elements, api: {}, me, onChanged() {}, onDelete() {}, ...options });
  members.open(shown, null);
  return { ...elements, close };
}

const removeButtons = elements => elements.list.querySelectorAll('button').filter(button => button.textContent === 'Remove');
const names = elements => elements.list.querySelectorAll('tr').map(row => row.childNodes[0].textContent);

test('by default the dialog offers Remove beside the others and the add search', () => {
  const elements = open(ana);
  assert.equal(removeButtons(elements).length, 2);
  assert.equal(elements.searchField.classList.contains('hidden'), false);
});

test('an account that may not manage members sees them with no Remove and no add search', () => {
  const elements = open(pat, { canManage: false });
  assert.equal(removeButtons(elements).length, 0);
  assert.equal(elements.searchField.classList.contains('hidden'), true);
});

test('the list marks the members Spring says are mentors, and you', () => {
  assert.deepEqual(names(open(ana)), ['Ana Student (you)', 'Ben Student', 'Pat Mentor (mentor)']);
  assert.deepEqual(names(open(pat, { canManage: false })), ['Ana Student', 'Ben Student', 'Pat Mentor (you)']);
});

test('the dialog focuses the add search, or Close when the account may not add anyone', () => {
  const managing = open(ana);
  assert.equal(document.activeElement, managing.search);
  const listing = open(pat, { canManage: false });
  assert.equal(document.activeElement, listing.close);
});

test('an add Spring refuses for a reason it names says that reason', async () => {
  const csa = { id: 9, name: 'CSA', members: [{ id: 1, uid: 'ana', name: 'Ana Student', mentor: false }] };
  const api = {
    searchPeople: async () => [{ id: 3, uid: 'pat', name: 'Pat Mentor' }],
    addMember: async () => { throw Object.assign(new Error('POST answered HTTP 403'), { status: 403, reason: 'mentor_class_group' }); },
  };
  const elements = open(ana, { api }, csa);
  elements.search.value = 'Pat';
  elements.search.dispatchEvent(fakeEvent('input'));
  await new Promise(resolve => setTimeout(resolve, 300));
  await settle();
  elements.results.querySelectorAll('button')[0].click();
  await settle();
  assert.equal(elements.status.textContent, 'Mentors can’t be in class groups.');
});
