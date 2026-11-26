// The Members dialog (group-dialogs.js initMembers) with a stub API: who gets Add and
// Remove. A class group's members come from the classes on each student's Profile, so
// there only teachers and admins change them; in any other group, its members can.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document, window } = installFakeDom();

const { initMembers } = await import('../js/group-dialogs.js');

const student = { id: 1, uid: 'ada', name: 'Ada Lovelace', roles: [{ name: 'ROLE_USER' }, { name: 'ROLE_STUDENT' }] };
const grace = { id: 2, uid: 'grace', name: 'Grace Hopper' };
const teacher = { id: 3, uid: 'dorothy', name: 'Dorothy Vaughan', roles: [{ name: 'ROLE_USER' }, { name: 'ROLE_TEACHER' }] };
const admin = { id: 4, uid: 'admin', name: 'Site Admin', roles: [{ name: 'ROLE_ADMIN' }] };

// The same parts as #membersDialog in dm.md: the add field holds the [data-focus] search.
// The page keeps one Members dialog and opens it for whichever group is showing.
function makeMembers(me, api = {}) {
  const make = (tag, attributes = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  };
  const elements = {
    dialog: make('div'), title: make('h3'), actionHeader: make('th'), list: make('tbody'), searchField: make('div'),
    search: make('input', { 'data-focus': '' }), results: make('div'), status: make('p'),
    deleteSection: make('section'), deleteWarning: make('p'), deleteOpen: make('button'),
  };
  const close = make('button', { 'data-close': '' });
  elements.dialog.classList.add('hidden');
  elements.searchField.appendChild(elements.search);
  elements.deleteSection.append(elements.deleteWarning, elements.deleteOpen);
  elements.dialog.append(close, elements.title, elements.actionHeader, elements.list, elements.searchField,
    elements.results, elements.status, elements.deleteSection);
  document.body.appendChild(elements.dialog);
  const members = initMembers({ elements, api, me, onChanged: () => {}, onDelete: () => {} });
  return {
    elements,
    close,
    show: group => members.open({ id: 9, members: [me, grace], ...group }, make('button')),
    // Events don't bubble in the fake DOM, so the click goes to the dialog, aimed at Close.
    shut: () => elements.dialog.dispatchEvent(fakeEvent('click', { target: close })),
    rows: () => elements.list.querySelectorAll('tr').map(row => row.querySelectorAll('td').map(td => td.textContent)),
    removes: () => elements.list.querySelectorAll('button').filter(button => button.textContent === 'Remove'),
    controlsShown: () => !elements.searchField.classList.contains('hidden') && !elements.actionHeader.classList.contains('hidden'),
  };
}

function openMembers(me, group) {
  const dialog = makeMembers(me);
  dialog.show(group);
  return { elements: dialog.elements, close: dialog.close, rows: dialog.rows(), removes: dialog.removes() };
}

test('a student sees who is in a class group, with no Add or Remove', () => {
  for (const name of ['CSA', 'CSSE', 'CSP', 'CSH']) {
    const { elements, close, rows, removes } = openMembers(student, { name });
    assert.equal(elements.title.textContent, `Members of ${name}`);
    assert.deepEqual(rows, [['Ada Lovelace (you)', '@ada'], ['Grace Hopper', '@grace']], name);
    assert.equal(removes.length, 0, name);
    assert.equal(elements.actionHeader.classList.contains('hidden'), true, name);
    assert.equal(elements.searchField.classList.contains('hidden'), true, name);
    // The search is hidden, so focus goes to Close and stays inside the dialog.
    assert.equal(document.activeElement, close, name);
  }
});

test('a teacher or an admin still adds and removes people in a class group', () => {
  for (const me of [teacher, admin]) {
    const { elements, rows, removes } = openMembers(me, { name: 'CSA' });
    assert.deepEqual(rows.map(row => row.length), [3, 3], me.uid);
    assert.equal(removes.length, 1, me.uid);
    assert.equal(elements.actionHeader.classList.contains('hidden'), false, me.uid);
    assert.equal(elements.searchField.classList.contains('hidden'), false, me.uid);
    assert.equal(document.activeElement, elements.search, me.uid);
  }
});

test('in a group that isn’t a class group, a student still adds and removes people', () => {
  const { elements, rows, removes } = openMembers(student, { name: 'Team Turing' });
  assert.deepEqual(rows.map(row => row.length), [3, 3]);
  assert.equal(removes.length, 1);
  assert.equal(elements.actionHeader.classList.contains('hidden'), false);
  assert.equal(elements.searchField.classList.contains('hidden'), false);
  assert.equal(document.activeElement, elements.search);
});

test('the one Members dialog shows each group’s own controls as it opens', () => {
  const dialog = makeMembers(student);
  dialog.show({ name: 'CSA' });
  assert.equal(dialog.controlsShown(), false);
  dialog.shut();
  dialog.show({ name: 'Team Turing' });
  assert.equal(dialog.controlsShown(), true);
  assert.equal(dialog.removes().length, 1);
  dialog.shut();
  dialog.show({ name: 'CSA' });
  assert.equal(dialog.controlsShown(), false);
  assert.equal(dialog.removes().length, 0);
});

test('a teacher who removes someone from a class group keeps Add and Remove', async () => {
  const alan = { id: 5, uid: 'alan', name: 'Alan Turing' };
  const removed = [];
  const api = {
    removeMember: async (groupId, personId) => {
      removed.push([groupId, personId]);
      return { id: 9, name: 'CSA', members: [teacher, alan] };
    },
  };
  window.confirm = () => true;
  const dialog = makeMembers(teacher, api);
  dialog.show({ name: 'CSA', members: [teacher, grace, alan] });
  dialog.removes().find(button => button.parentNode.parentNode.querySelectorAll('td')[0].textContent === 'Grace Hopper').click();
  await settle();
  assert.deepEqual(removed, [[9, 2]]);
  assert.deepEqual(dialog.rows(), [['Alan Turing', '@alan', 'Remove'], ['Dorothy Vaughan (you)', '@dorothy', '']]);
  assert.equal(dialog.controlsShown(), true);
});
