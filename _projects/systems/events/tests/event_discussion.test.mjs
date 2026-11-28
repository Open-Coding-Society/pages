// EventDiscussion lists an event's latest questions on the page itself (img2's "Questions and
// Discussion"), read from the Microblog's own storage through Flask's public route, so signed-out
// visitors see them too. Posting still happens in the Microblog panel, which needs a sign-in.
import assert from 'node:assert/strict';
import test from 'node:test';
import { installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { MicroblogTopic } from '../../microblog/js/microblog-topic.js';
import { EventDiscussion } from '../js/event-discussion.js';
import { mark, markedRegistry, needsRuby, pageWords, readRegistry, wordsSpelledBy } from './helpers.mjs';

const PYTHON = 'http://localhost:8587';
const TOPIC = '/events/community-technology-workshop/';
// The page's own fetch options from config.js; the route answers without any sign-in.
const FETCH_OPTIONS = { method: 'GET', mode: 'cors', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' } };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

async function show(answer, topic = MicroblogTopic, registry = readRegistry()) {
  const { document } = installFakeDom();
  const words = pageWords(registry);
  const list = document.createElement('div');
  list.setAttribute('data-event-discussion-list', '');
  list.setAttribute('data-event-topic', TOPIC);
  document.body.append(list);
  const calls = [];
  const warnings = [];
  const fetch = async (url, init) => { calls.push({ url, init }); return answer; };
  await new EventDiscussion(list, {
    topic, pythonURI: PYTHON, fetchOptions: FETCH_OPTIONS, texts: words, shown: registry.discussion.shown,
    fetch, console: { warn: (...args) => warnings.push(args) },
  }).start();
  await settle();
  return { list, calls, warnings, words };
}

const post = (userName, content, timestamp = '2027-03-01T17:00:00') => ({ userName, content, timestamp, userUid: 'uid-hidden' });

test('signed out, the newest questions list with first names only, at most the registry\'s number', needsRuby, async () => {
  const posts = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Mary Jackson', 'Dorothy Vaughan', 'Edsger Dijkstra']
    .map((name, index) => post(name, `Question ${index + 1}`));
  const { list, calls } = await show(json({ microblogs: posts }));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${PYTHON}/api/microblog/page/events_community-technology-workshop?limit=5`);
  const items = list.querySelectorAll('li');
  assert.equal(items.length, 5);
  assert.deepEqual(items.map((item) => item.querySelector('strong').textContent), ['Ada', 'Grace', 'Alan', 'Katherine', 'Mary']);
  assert.ok(!list.textContent.includes('Lovelace'), 'no last names');
  assert.ok(!list.innerHTML.includes('uid-hidden'), 'no uids');
  assert.equal(items[0].querySelector('p').textContent, 'Question 1');
  assert.equal(items[0].querySelector('time').getAttribute('datetime'), '2027-03-01T17:00:00.000Z', 'Flask writes UTC without a zone');
  assert.equal(list.querySelector('ul').className, 'ocs__entity-list');
});

test('before anyone posts, Flask has no topic: the list says there are no questions yet', needsRuby, async () => {
  const { list, words, warnings } = await show(json({ message: 'Page topic not found' }, 404));
  assert.equal(list.querySelector('p').textContent, words.discussion_none);
  assert.deepEqual(warnings, []);
});

test('any other failure says the questions couldn\'t load and warns once', needsRuby, async () => {
  const { list, words, warnings } = await show(json({ message: 'Error retrieving page microblogs' }, 500));
  assert.equal(list.querySelector('p').textContent, words.discussion_failed);
  assert.equal(warnings.length, 1);
});

test('a post is text, never markup, and a post without a name says someone', needsRuby, async () => {
  const { list, words } = await show(json({ microblogs: [post('', '<img src=x onerror=alert(1)>')] }));
  const item = list.querySelector('li');
  assert.equal(item.querySelector('p').textContent, '<img src=x onerror=alert(1)>');
  assert.equal(list.querySelectorAll('img').length, 0);
  assert.equal(item.querySelector('strong').textContent, words.discussion_someone);
});

test('names and times follow the Microblog\'s own rules, handed in with its topic', needsRuby, async () => {
  class OtherRules extends MicroblogTopic {
    static firstName() { return 'First'; }
    static timeLabel() { return 'when'; }
  }
  const { list } = await show(json({ microblogs: [post('Ada Lovelace', 'Hi')] }), OtherRules);
  assert.equal(list.querySelector('strong').textContent, 'First');
  assert.equal(list.querySelector('time').textContent, 'when');
});

test('the list\'s own words come from the registry (a copy with every word marked)', needsRuby, async () => {
  const marked = markedRegistry();
  const none = await show(json({ message: 'Page topic not found' }, 404), MicroblogTopic, marked);
  assert.equal(none.list.textContent, mark('No questions yet. Ask the first one.'));
  const failed = await show(json({ message: 'Error' }, 500), MicroblogTopic, marked);
  assert.equal(failed.list.textContent, mark('Questions couldn\'t load. Refresh to try again.'));
  const nameless = await show(json({ microblogs: [post('', 'Is there parking?')] }), MicroblogTopic, marked);
  assert.equal(nameless.list.querySelector('strong').textContent, mark('Someone'));
  for (const { list } of [none, failed, nameless]) assert.deepEqual(wordsSpelledBy(list.textContent), []);
});
