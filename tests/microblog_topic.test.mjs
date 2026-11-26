// MicroblogTopic: the Microblog's one copy of Flask's page key, and the public read of a page
// topic's newest posts that the Events pages show (signed out too). Flask's GET
// /api/microblog/page/<key> answers 404 "Page topic not found" until the first post makes the
// topic, so a 404 means "no posts yet", not a failure.
import assert from 'node:assert/strict';
import test from 'node:test';
import { MicroblogTopic } from '../_projects/systems/microblog/js/microblog-topic.js';

const PYTHON = 'https://flask.opencodingsociety.com';
const FETCH_OPTIONS = Object.freeze({ method: 'GET', mode: 'cors', credentials: 'include', headers: { 'X-Origin': 'client' } });

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function recorder(answer) {
  const calls = [];
  return {
    calls,
    fetch: async (url, init) => {
      calls.push({ url, init });
      return typeof answer === 'function' ? answer(url, init) : answer;
    },
  };
}

test('the key is the one Flask makes from the topic path', () => {
  assert.equal(MicroblogTopic.pageKey('/events/community-technology-workshop/'), 'events_community-technology-workshop');
  assert.equal(MicroblogTopic.pageKey('/ui-builder/view/?page=flood-watch'), 'ui-builder_view_page_flood-watch');
  // 150 characters: Flask keeps the first 100, then drops the "_" left at the end.
  const long = `/${'a'.repeat(99)}/${'b'.repeat(48)}/`;
  assert.equal(long.length, 150);
  assert.equal(MicroblogTopic.pageKey(long), 'a'.repeat(99));
});

test('latest reads the topic\'s newest posts through the public route, with the page\'s fetch options', async () => {
  const posts = [{ userName: 'Ada Lovelace', content: 'Is there parking?', timestamp: '2027-03-01T17:00:00' }];
  const flask = recorder(json({ microblogs: [...posts, 'not a post'], count: 2 }));
  const answer = await MicroblogTopic.latest({
    pythonURI: `${PYTHON}/`, fetchOptions: FETCH_OPTIONS, path: '/events/community-technology-workshop/', limit: 5, fetch: flask.fetch,
  });
  assert.deepEqual(answer, { posts, missing: false });
  assert.equal(flask.calls.length, 1);
  assert.equal(flask.calls[0].url, `${PYTHON}/api/microblog/page/events_community-technology-workshop?limit=5`);
  assert.equal(flask.calls[0].init.method, 'GET');
  assert.equal(flask.calls[0].init.credentials, 'include');
});

test('a 404 means nobody has posted yet: no posts and missing', async () => {
  const flask = recorder(json({ message: 'Page topic not found' }, 404));
  const answer = await MicroblogTopic.latest({ pythonURI: PYTHON, fetchOptions: FETCH_OPTIONS, path: '/events/x/', limit: 5, fetch: flask.fetch });
  assert.deepEqual(answer, { posts: [], missing: true });
});

test('any other answer, or no answer, is an error the page reports', async () => {
  const broken = recorder(json({ message: 'Error retrieving page microblogs' }, 500));
  await assert.rejects(MicroblogTopic.latest({ pythonURI: PYTHON, path: '/events/x/', limit: 5, fetch: broken.fetch }), /500/);
  const offline = { fetch: async () => { throw new TypeError('Failed to fetch'); } };
  await assert.rejects(MicroblogTopic.latest({ pythonURI: PYTHON, path: '/events/x/', limit: 5, fetch: offline.fetch }), TypeError);
});

test('a 200 without a list of posts counts as no posts', async () => {
  const odd = recorder(json({ topic: {} }));
  assert.deepEqual(await MicroblogTopic.latest({ pythonURI: PYTHON, path: '/events/x/', limit: 5, fetch: odd.fetch }), { posts: [], missing: false });
});
