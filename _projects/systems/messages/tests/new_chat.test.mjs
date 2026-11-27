import assert from 'node:assert/strict';
import test from 'node:test';

// New chat. The page passes canMessage from Allowances: Spring refuses any direct message that includes an
// account without direct messages (a mentor talks only in group chats), so those people aren't offered. A start
// Spring refuses anyway says why.
import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();
const { initNewChat } = await import('../js/new-chat.js');
const { Allowances } = await import('../js/allowances.js');

const roles = (...names) => names.map(name => ({ name }));
const me = { id: 1, uid: 'ana', name: 'Ana Student', roles: roles('ROLE_USER') };
const ben = { id: 2, uid: 'ben', name: 'Ben Student', roles: roles('ROLE_USER') };
const pat = { id: 3, uid: 'pat', name: 'Pat Mentor', roles: roles('ROLE_USER', 'ROLE_MENTOR') };

function open({ found = [], start = async () => ({ id: 9 }) } = {}) {
  const make = tag => document.createElement(tag);
  const elements = {
    open: make('button'), dialog: make('div'), form: make('form'), search: make('input'), results: make('div'),
    selected: make('p'), status: make('p'), start: make('button'),
  };
  elements.dialog.append(elements.form);
  elements.form.append(elements.search, elements.results, elements.selected, elements.status, elements.start);
  const api = { searchPeople: async () => found, startConversation: start };
  initNewChat({ elements, api, me, onStarted() {}, canMessage: person => Allowances.for(person).directMessages });
  elements.open.click();
  return elements;
}

async function search(elements, query) {
  elements.search.value = query;
  elements.search.dispatchEvent(fakeEvent('input'));
  await new Promise(resolve => setTimeout(resolve, 300));
  await settle();
}

const offered = elements => elements.results.querySelectorAll('button').map(button => button.textContent);

test('people Spring won’t let anyone message are left out of the results', async () => {
  const elements = open({ found: [ben, pat] });
  await search(elements, 'student');
  assert.deepEqual(offered(elements), ['Ben Student (@ben)']);
});

test('when everyone who matches talks in group chats only, the dialog says so', async () => {
  const elements = open({ found: [pat] });
  await search(elements, 'pat');
  assert.deepEqual(offered(elements), []);
  assert.equal(elements.status.textContent, 'Everyone who matches talks in group chats only.');
});

test('a start Spring refuses for a reason it names says that reason', async () => {
  const refused = async () => { throw Object.assign(new Error('POST answered HTTP 403'), { status: 403, reason: 'mentor_no_direct_messages' }); };
  const elements = open({ found: [ben], start: refused });
  await search(elements, 'ben');
  elements.results.querySelectorAll('button')[0].click();
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.equal(elements.status.textContent,
    'This chat would include a mentor, and mentors don’t use direct messages. Talk in your team’s group instead.');
});

test('any other failed start still says to try again', async () => {
  const failed = async () => { throw Object.assign(new Error('POST answered HTTP 500'), { status: 500, reason: '' }); };
  const elements = open({ found: [ben], start: failed });
  await search(elements, 'ben');
  elements.results.querySelectorAll('button')[0].click();
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.equal(elements.status.textContent, 'Could not start the chat. Try again.');
});
