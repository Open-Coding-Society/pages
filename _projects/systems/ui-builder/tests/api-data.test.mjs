import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textOf } from '../js/registry.js';
import {
  WHOLE_REPLY, codeSnippet, doctor, fetchJson, fieldsOf, findListPath, getPath, guessListPath, guessMapping, listIn, mapItems, privateKeys,
} from '../js/api-data.js';
import { runSnippet, snippetItems } from './fixtures/snippet.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const PAGE = { mode: 'view', pageHost: 'pages.opencodingsociety.com', pageProtocol: 'https:' };
const JOKES = 'https://flask.opencodingsociety.com/api/jokes';
const MAP = { baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com', cookieDomain: 'opencodingsociety.com', limit: 50, itemChars: 500 };

// A reply body that streams chunks, or keeps streaming forever; `state.cancelled` records a cancel.
function bodyOf(chunks, { endless = false } = {}) {
  const state = { cancelled: false, pulls: 0 };
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    pull(controller) {
      state.pulls += 1;
      if (endless) controller.enqueue(encoder.encode('x'.repeat(1000)));
      else if (chunks.length) controller.enqueue(typeof chunks[0] === 'string' ? encoder.encode(chunks.shift()) : chunks.shift());
      else controller.close();
    },
    cancel() { state.cancelled = true; },
  });
  return { stream, state };
}

function reply(status, text, headers = {}) {
  const body = bodyOf([text]);
  return { body, response: { status, headers: new Headers({ 'content-type': 'application/json', ...headers }), body: body.stream } };
}

function fetchOf(...answers) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const answer = answers[Math.min(calls.length, answers.length) - 1];
    return typeof answer === 'function' ? answer(url, options) : answer;
  };
  return { calls, fetchImpl };
}

const typeError = () => { throw new TypeError('Failed to fetch'); };
const run = (fetchImpl, url = JOKES, options = {}) => fetchJson(url, { fetchImpl, timeoutMs: 1000, maxChars: 64, ...PAGE, ...options });

test('getPath reads own properties and indexes only', () => {
  const json = { data: { items: [{ name: 'Ada', tags: ['x', 'y'] }] }, 'a-b': 1, list: [] };
  assert.equal(getPath(json, 'data.items[0].name'), 'Ada');
  assert.equal(getPath(json, 'data.items.0.tags[1]'), 'y');
  assert.equal(getPath(json, 'a-b'), 1);
  assert.equal(getPath(json, ''), json);
  assert.equal(getPath('plain', '.'), 'plain');
  for (const path of ['data.items[5].name', 'data.nope', 'data.items.x', 'list.length', 'data.toString', 'constructor', '__proto__', 'data.__proto__', 'a b', 'a;b', 'x'.repeat(121), 7, null]) {
    assert.equal(getPath(json, path), undefined, String(path));
  }
  assert.equal(getPath(JSON.parse('{"__proto__":{"x":1}}'), '__proto__.x'), undefined);
});

test('findListPath finds the list of items in a reply', () => {
  assert.equal(findListPath([{ a: 1 }]), '');
  assert.equal(findListPath({ count: 2, data: { items: [{ a: 1 }, { a: 2 }] } }), 'data.items');
  assert.equal(findListPath({ tags: ['a', 'b', 'c'], posts: [{ id: 1 }] }), 'posts', 'lists of objects win');
  assert.equal(findListPath({ a: { b: [{ x: 1 }] }, c: [{ x: 1 }] }), 'c', 'shallower wins');
  assert.equal(findListPath({ short: [{ x: 1 }], long: [{ x: 1 }, { x: 2 }] }), 'long', 'then longer');
  assert.equal(findListPath({ a: { b: { c: { d: { e: [{ x: 1 }] } } } } }), null, 'only three levels down');
  assert.equal(findListPath({ 'bad key': [{ x: 1 }], __proto__: [] }), null);
  for (const value of [null, 'x', 7, { a: 1 }]) assert.equal(findListPath(value), null);
  const cyclic = { a: {} };
  cyclic.a.self = cyclic;
  assert.equal(findListPath(cyclic), null, 'cycles end');
});

test('guessListPath guesses the reply itself or a list of objects, never an empty or plain list', () => {
  assert.equal(guessListPath([{ a: 1 }]), '');
  assert.equal(guessListPath([]), '', 'a reply that is a list is the items, even when empty');
  assert.equal(guessListPath({ count: 2, results: [{ a: 1 }, { a: 2 }] }), 'results');
  assert.equal(guessListPath({ tags: ['a'], data: { posts: [{ id: 1 }] } }), 'data.posts', 'a list of objects wherever it is');
  for (const json of [{ joke: 'Why?', comments: [] }, { joke: 'Why?', tags: ['pun'] }, { data: { items: [] } }, { joke: 'Why?' }, null, 'x', 7]) {
    assert.equal(guessListPath(json), null, JSON.stringify(json));
  }
});

test('listIn: the mapped list, else the list in the reply, else one object as a list of one', () => {
  const reply = { data: { items: [{ a: 1 }, { a: 2 }] }, meta: { tags: ['x'] } };
  assert.equal(listIn(reply, 'data.items').length, 2);
  assert.equal(listIn(reply, '').length, 2, 'no list_path: the list the reply holds');
  assert.deepEqual(listIn({ users: [{ name: 'Ada' }] }, undefined), [{ name: 'Ada' }]);
  assert.deepEqual(listIn([1, 2, 3], ''), [1, 2, 3]);
  assert.deepEqual(listIn({ joke: 'Why?' }, ''), [{ joke: 'Why?' }], 'a reply with no list is one item');
  assert.deepEqual(listIn(reply, 'data.items[0]'), [{ a: 1 }], 'a path to one object is a list of one');
  for (const [json, path] of [[reply, 'missing'], [reply, 'meta.tags[0]'], ['text', ''], [null, ''], [reply, 'a b']]) {
    assert.deepEqual(listIn(json, path), [], `${JSON.stringify(json)} at ${path}`);
  }
  // The Flask starter maps joke and haha with no list picked. A reply whose only list is empty or
  // holds plain values stays one joke, as published pages showed it; a list of objects is guessed.
  const starter = { title_path: 'joke', value_path: 'haha' };
  const shown = (json) => mapItems(listIn(json, ''), starter, MAP).map((item) => `${item.title}|${item.value}`);
  assert.deepEqual(shown({ joke: 'Why?', haha: 3, comments: [] }), ['Why?|3']);
  assert.deepEqual(shown({ joke: 'Why?', haha: 3, tags: ['pun'] }), ['Why?|3']);
  assert.deepEqual(shown({ count: 2, results: [{ joke: 'A', haha: 1 }, { joke: 'B', haha: 2 }] }), ['A|1', 'B|2']);
});

// "" is a list not picked yet, which is guessed; "The whole reply" is stored as "." and never is.
test('listIn: the whole reply (".") is the reply itself, never the list inside it', () => {
  assert.equal(WHOLE_REPLY, '.');
  const reply = { team: 'Flood Watch', users: [{ name: 'Ada' }, { name: 'Alan' }] };
  assert.equal(getPath(reply, WHOLE_REPLY), reply);
  assert.deepEqual(listIn(reply, WHOLE_REPLY), [reply], 'one object is one item');
  assert.deepEqual(listIn(reply, ''), reply.users, 'not picked yet: the list it holds');
  assert.deepEqual(listIn([{ name: 'Ada' }], WHOLE_REPLY), [{ name: 'Ada' }], 'a reply that is a list is the items');
  for (const json of ['text', 7, null]) assert.deepEqual(listIn(json, WHOLE_REPLY), [], String(json));
});

// Show code is run, not read: its own small getPath, findItems and loadItems must find the block's
// items. A list not picked yet ("") is found when the code runs, so no Test is needed first.
test('Show code draws the items the block shows: the whole reply as one item, a picked list as its items, a list not picked yet as the block finds it', async () => {
  const team = { team: 'Flood Watch', users: [{ team: 'Ada' }, { team: 'Alan' }] };
  const users = [{ name: 'Ada' }, { name: 'Alan' }];
  const cases = [
    [team, { list_path: WHOLE_REPLY, title_path: 'team' }, ['Flood Watch']],
    [team, { list_path: 'users', title_path: 'team' }, ['Ada', 'Alan']],
    [team, { list_path: 'users[1]', title_path: 'team' }, ['Alan']],
    [team, { list_path: '', title_path: 'team' }, ['Ada', 'Alan']],
    [{ count: 2, users }, { list_path: '', title_path: 'name' }, ['Ada', 'Alan']],
    [{ count: 2, users }, { list_path: 'users', title_path: 'name' }, ['Ada', 'Alan']],
    [[{ joke: 'Ha' }, { joke: 'Ho' }], { list_path: WHOLE_REPLY, title_path: 'joke' }, ['Ha', 'Ho']],
    [[{ joke: 'Ha' }, { joke: 'Ho' }], { list_path: '', title_path: 'joke' }, ['Ha', 'Ho']],
    [{ joke: 'Why?', comments: [] }, { list_path: '', title_path: 'joke' }, ['Why?']],
    [{ joke: 'Why?', tags: ['pun'] }, { list_path: '', title_path: 'joke' }, ['Why?']],
    ['text', { list_path: WHOLE_REPLY, title_path: 'joke' }, []],
    ['text', { list_path: '', title_path: 'joke' }, []],
  ];
  for (const [reply, mapping, drawn] of cases) {
    const source = { url: JOKES, ...mapping };
    const label = `${JSON.stringify(reply).slice(0, 30)} at "${source.list_path}"`;
    assert.deepEqual(mapItems(listIn(reply, source.list_path), source, MAP).map((item) => item.title), drawn, `the block: ${label}`);
    assert.deepEqual(await runSnippet(codeSnippet(source), reply), drawn, `Show code: ${label}`);
  }
  // A path a student types into that code's LIST_PATH is read as it is, not found.
  const typed = codeSnippet({ url: JOKES, list_path: '', title_path: 'name' }).replace('const LIST_PATH = "";', 'const LIST_PATH = "staff";');
  assert.deepEqual(await runSnippet(typed, { users, staff: [{ name: 'Bo' }] }), ['Bo']);
});

// The code for a list not picked yet must find what listIn finds, limits included: the same list
// (the reply's own values), or the reply as one item, for any reply an API could send.
test('Show code finds a list not picked yet exactly as listIn does, down to the limits of the guess', async () => {
  const one = [{ x: 1 }];
  const two = [{ x: 1 }, { x: 2 }];
  const numbers = (count) => Array.from({ length: count }, (_, index) => index);
  const keyed = Object.fromEntries(Array.from({ length: 600 }, (_, index) => [`k${index}`, { n: index }]));
  keyed.k10 = { list: one };
  keyed.k550 = { list: two }; // longer, but past the 500 objects the guess looks at
  const replies = [
    [], [1, 2], two, 'text', 7, null, true,
    { joke: 'Why?' }, { joke: 'Why?', comments: [] }, { joke: 'Why?', tags: ['pun'] }, { data: { items: [] } },
    { count: 2, users: two }, { team: 'x', users: two }, { data: { items: two } }, { tags: ['a'], data: { posts: one } },
    { short: one, long: two }, { first: [{ x: 1 }], second: [{ x: 2 }] }, { b: [{ x: 1 }], 1: [{ x: 2 }] }, // the longest, else the first
    { a: { list: [{ x: 1 }, { x: 2 }, { x: 3 }] }, top: one }, // nearest the top wins over longer
    { a: { b: { c: { list: one } } } }, { a: { b: { c: { d: { list: one } } } } }, // four names deep at most
    { 'my list': two, ok: one }, { 'v1.users': two }, // names a path can't hold
    JSON.parse('{"__proto__":[{"x":1},{"x":2}],"constructor":[{"x":1},{"x":2},{"x":3}],"items":[{"x":1}]}'),
    { ['a'.repeat(60)]: { ['b'.repeat(60)]: two }, z: { y: one } }, // a path of 121 characters
    { late: [...numbers(20), { x: 1 }, { x: 2 }], early: one }, { edge: [...numbers(19), { x: 1 }] }, // the first 20 entries
    { grid: [[{ x: 1 }]], holes: [null, { x: 1 }] }, { a: [{ b: two }] },
    keyed,
  ];
  for (const reply of replies) {
    const label = String(JSON.stringify(reply)).slice(0, 60);
    const items = await snippetItems(codeSnippet({ url: JOKES, list_path: '' }), reply);
    const expected = listIn(reply, '');
    assert.equal(items.length, expected.length, label);
    assert.ok(items.every((item, index) => item === expected[index]), `the same items: ${label}`);
  }
});

test('fieldsOf lists item fields with their types; privateKeys flags the ones a page must never show', () => {
  const items = [{ id: 1, name: null, author: { name: 'Ada', email: 'a@x' }, 'bad key': 1, tags: [] }, { name: 'Bo', password: 'x', __proto__: 1 }];
  const fields = fieldsOf(items);
  assert.deepEqual(fields, [
    { path: 'id', type: 'number' }, { path: 'name', type: 'string' }, { path: 'author', type: 'object' }, { path: 'author.name', type: 'string' },
    { path: 'author.email', type: 'string' }, { path: 'tags', type: 'array' }, { path: 'password', type: 'string' },
  ]);
  assert.deepEqual(fieldsOf(['a', 'b']), [{ path: '.', type: 'string' }]);
  assert.deepEqual(fieldsOf('x'), []);
  assert.equal(fieldsOf([Object.fromEntries(Array.from({ length: 300 }, (_, i) => [`k${i}`, i]))]).length, 100);
  assert.deepEqual(privateKeys(fields), ['author.email', 'password']);
  const names = ['uid', 'UserUid', 'user_uid', 'EMAIL', 'sid', 'passwd', 'token', 'jwt', 'secret', 'grade', 'grades_q1', 'ap_exam', 'phone', 'address', 'birthday', 'dob', 'data.items[0].Token'];
  assert.deepEqual(privateKeys(names), names);
  assert.deepEqual(privateKeys(['emails', 'my_email', 'username', 'id', 'title', 7, null]), []);
  assert.deepEqual(privateKeys('x'), []);
});

test('guessMapping picks likely fields for each slot and never a private one', () => {
  assert.deepEqual(guessMapping(fieldsOf([{ id: 1, joke: 'Ha', haha: 3, boohoo: 1 }])), { title_path: 'joke', text_path: '', image_path: '', link_path: '', value_path: 'haha', label_path: 'joke' });
  const posts = fieldsOf([{ email: 'a@x', title: 'Post', description: 'Long', image_url: 'https://x/a.png', html_url: 'https://x', likes: 4, category: 'News' }]);
  assert.deepEqual(guessMapping(posts), { title_path: 'title', text_path: 'description', image_path: 'image_url', link_path: 'html_url', value_path: 'likes', label_path: 'category' });
  assert.equal(guessMapping(fieldsOf([{ email: 'a@x', note: 'n' }])).title_path, 'note', 'the first plain string, never the email');
  assert.equal(guessMapping(fieldsOf([{ user_id: 1, total_steps: 9 }])).value_path, 'total_steps', 'ids are not numbers to show');
  assert.equal(guessMapping(fieldsOf(['a'])).title_path, '.');
  assert.deepEqual(guessMapping(null), { title_path: '', text_path: '', image_path: '', link_path: '', value_path: '', label_path: '' });
});

test('mapItems makes trimmed, capped strings and safe links only', () => {
  const items = [
    { t: '  Hello  ', n: 3, b: true, o: { x: 1 }, img: 'https://x.example/a.png', link: 'javascript:alert(1)', email: 'a@x', rel: '/static/b.png' },
    { t: 'x'.repeat(600), img: 'data:image/png;base64,AA', link: 'https://x.example/page', n: null },
    { t: `${'x'.repeat(499)}${String.fromCodePoint(0x1f600)}`, link: '/csp/', img: `https://x.example/${'a'.repeat(500)}` },
  ];
  const mapping = { title_path: 't', text_path: 'o', image_path: 'img', link_path: 'link', value_path: 'n', label_path: 'email', junk: 1 };
  const out = mapItems(items, mapping, MAP);
  assert.deepEqual(out[0], { title: 'Hello', text: '', image: 'https://x.example/a.png', link: '', value: '3', label: '' }, 'private label stays empty');
  assert.equal(out[1].title.length, 500);
  assert.deepEqual([out[1].image, out[1].link, out[1].value], ['', 'https://x.example/page', '']);
  assert.equal(out[2].title, 'x'.repeat(499), 'no half surrogate pair at the cut');
  assert.deepEqual([out[2].link, out[2].image], ['/csp/', ''], 'site paths pass; over-long links are refused, not cut');
  assert.equal(mapItems(items, { value_path: 'b' }, MAP)[0].value, 'true');
  assert.equal(mapItems(items, { image_path: 'rel' }, { ...MAP, sourceUrl: 'https://api.example/api/x' })[0].image, 'https://api.example/static/b.png', 'relative to the API');
  assert.equal(mapItems(items, { image_path: 'rel' }, { ...MAP, sourceUrl: 'http://localhost:8587/api' })[0].image, '');
  assert.equal(mapItems(items, mapping, { ...MAP, limit: 1 }).length, 1);
  assert.deepEqual(mapItems('x', mapping, MAP), []);
  assert.deepEqual(mapItems([{ a: 1 }], JSON.parse('{"__proto__":{"title_path":"a"}}'), MAP)[0].title, '');
  assert.throws(() => mapItems(items, mapping, { ...MAP, limit: undefined }), /limit/);
  assert.throws(() => mapItems(items, mapping, { ...MAP, itemChars: 0 }), /itemChars/);
});

test('fetchJson sends no cookies, no referrer and no redirects, and reads JSON', async () => {
  const { response } = reply(200, '[{"joke":"Ha"}]');
  const { calls, fetchImpl } = fetchOf(response);
  let time = 100;
  const result = await run(fetchImpl, JOKES, { now: () => (time += 25) });
  assert.deepEqual(result, {
    ok: true, status: 200, ms: 25, contentType: 'application/json', url: JOKES, host: 'flask.opencodingsociety.com',
    loopback: false, timeoutMs: 1000, maxChars: 64, json: [{ joke: 'Ha' }],
  });
  const { signal, ...options } = calls[0].options;
  assert.deepEqual(options, { method: 'GET', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', cache: 'no-store', headers: { Accept: 'application/json' } });
  assert.equal(typeof signal.aborted, 'boolean');
  const bom = await run(fetchOf(reply(200, `${String.fromCharCode(0xfeff)}{"a":1}`).response).fetchImpl);
  assert.deepEqual(bom.json, { a: 1 });
});

test('fetchJson applies the API link policy before any request', async () => {
  const { calls, fetchImpl } = fetchOf(typeError);
  assert.deepEqual([(await run(fetchImpl, 'javascript:alert(1)')).error, (await run(fetchImpl, 'http://example.com/api')).error], ['policy', 'mixed_content']);
  const local = await run(fetchImpl, 'http://localhost:8587/api/jokes');
  assert.deepEqual([local.error, local.reason, local.loopback], ['policy', 'policy_loopback_view', true]);
  assert.equal((await run(fetchImpl, 'https://10.0.0.1/api')).reason, 'policy_private_host');
  assert.equal(calls.length, 0);
  const editing = await run(fetchOf(reply(200, '[]').response).fetchImpl, 'http://localhost:8587/api/jokes', { mode: 'edit' });
  assert.deepEqual([editing.ok, editing.loopback], [true, true]);
  const typo = await run(fetchImpl, 'http:/localhost:8587/api/jokes', { mode: 'edit' });
  assert.deepEqual([typo.error, typo.reason], ['policy', 'policy_loopback_form'], 'Spring would refuse it, so it is not read either');
  assert.equal(calls.length, 0);
});

test('fetchJson names HTTP failures and drops their bodies unread', async () => {
  for (const [status, error] of [[401, 'auth'], [403, 'auth'], [404, 'not_found'], [500, 'http'], [502, 'http'], [301, 'http']]) {
    const { body, response } = reply(status, 'oops');
    const result = await run(fetchOf(response).fetchImpl);
    assert.deepEqual([result.ok, result.status, result.error], [false, status, error]);
    assert.equal(body.state.cancelled, true, `${status} body cancelled`);
  }
  assert.equal((await run(fetchOf(reply(200, '<!doctype html><p>Hi').response).fetchImpl)).error, 'not_json');
  assert.equal((await run(fetchOf(reply(200, '  \n ').response).fetchImpl)).error, 'empty');
});

test('fetchJson caps the reply by Content-Length and while it streams', async () => {
  const declared = reply(200, '[]', { 'content-length': '65' });
  assert.equal((await run(fetchOf(declared.response).fetchImpl)).error, 'too_big');
  assert.equal(declared.body.state.cancelled, true);
  const endless = bodyOf([], { endless: true });
  const streamed = await run(fetchOf({ status: 200, headers: new Headers(), body: endless.stream }).fetchImpl, JOKES, { maxChars: 5000 });
  assert.equal(streamed.error, 'too_big');
  assert.equal(endless.state.cancelled, true);
  assert.ok(endless.state.pulls < 10);
  const exact = await run(fetchOf(reply(200, `"${'x'.repeat(62)}"`).response).fetchImpl);
  assert.equal(exact.ok, true, 'exactly maxChars bytes is fine');
  const bytes = bodyOf([new Uint8Array([91, 49]), new Uint8Array([93])]);
  assert.deepEqual((await run(fetchOf({ status: 200, headers: new Headers(), body: bytes.stream }).fetchImpl)).json, [1]);
  const noStream = { status: 200, headers: new Headers(), body: null, text: async () => 'x'.repeat(65) };
  assert.equal((await run(fetchOf(noStream).fetchImpl)).error, 'too_big');
});

test('fetchJson tells a CORS block from a dead server with a no-cors probe', async () => {
  const blocked = fetchOf(typeError, { status: 0, type: 'opaque' });
  assert.equal((await run(blocked.fetchImpl)).error, 'blocked_read');
  const { signal, ...probe } = blocked.calls[1].options;
  assert.deepEqual(probe, { mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' });
  assert.equal((await run(fetchOf(typeError, typeError).fetchImpl)).error, 'network');
  const other = fetchOf(() => { throw new RangeError('x'); });
  assert.equal((await run(other.fetchImpl)).error, 'network');
  assert.equal(other.calls.length, 1, 'only a TypeError is worth probing');
  const broken = { status: 200, headers: new Headers(), body: new ReadableStream({ pull(controller) { controller.error(new TypeError('reset')); } }) };
  assert.equal((await run(fetchOf(broken).fetchImpl)).error, 'network');
});

test('fetchJson gives up after timeoutMs', async () => {
  const hang = (url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  });
  const result = await run(hang, JOKES, { timeoutMs: 20 });
  assert.deepEqual([result.ok, result.error, result.timeoutMs], [false, 'timeout', 20]);
  const slowBody = { status: 200, headers: new Headers(), body: new ReadableStream({ pull: () => new Promise(() => {}) }) };
  assert.equal((await run(fetchOf(slowBody).fetchImpl, JOKES, { timeoutMs: 20 })).error, 'timeout');
  await assert.rejects(fetchJson(JOKES, { fetchImpl: 'x', timeoutMs: 1, maxChars: 1 }), /fetchImpl/);
  await assert.rejects(fetchJson(JOKES, { fetchImpl: hang, timeoutMs: 0, maxChars: 1 }), /timeoutMs/);
  await assert.rejects(fetchJson(JOKES, { fetchImpl: hang, timeoutMs: 1, maxChars: 1.5 }), /maxChars/);
});

test('doctor explains every result with registry text and the exact fix', needsRuby, () => {
  const registry = loadRegistry();
  const options = { url: JOKES, pageOrigin: 'https://pages.opencodingsociety.com/ui-builder/' };
  const base = { ok: false, status: 0, ms: 12, host: 'flask.opencodingsociety.com', url: JOKES, loopback: false, timeoutMs: 8000, maxChars: 512000 };
  const cases = [
    [{ ...base, ok: true, json: [{ joke: 'Ha', email: 'a@x' }, { joke: 'Ho' }] }, ['ok:ok', 'warning:private_keys']],
    [{ ...base, ok: true, json: [{ joke: 'Ha' }] }, ['ok:ok_one']],
    // Nothing picked and no list of objects to guess: the list the reply holds is named.
    [{ ...base, ok: true, json: { data: { items: [] } } }, ['ok:ok_object', 'info:ok_list_empty']],
    [{ ...base, ok: true, json: { tags: ['pun', 'dad'] } }, ['ok:ok_object', 'info:ok_list_plain']],
    [{ ...base, ok: true, json: { name: 'x' } }, ['ok:ok_object', 'warning:empty']],
    [{ ...base, ok: true, json: [], loopback: true }, ['ok:ok', 'info:policy_loopback_view']],
    [{ ...base, error: 'policy', reason: 'policy_https' }, ['error:policy_https']],
    [{ ...base, error: 'policy', reason: 'policy_loopback_form' }, ['error:policy_loopback_form']],
    [{ ...base, error: 'policy', reason: 'odd' }, ['error:policy']],
    [{ ...base, error: 'mixed_content' }, ['error:mixed_content']],
    [{ ...base, error: 'timeout', loopback: true }, ['error:timeout', 'info:loopback_hint']],
    [{ ...base, error: 'network' }, ['error:network']],
    [{ ...base, error: 'blocked_read' }, ['error:blocked_read', 'action:open_link']],
    [{ ...base, error: 'auth', status: 401 }, ['error:auth']],
    [{ ...base, error: 'not_found', status: 404 }, ['error:not_found']],
    [{ ...base, error: 'http', status: 502 }, ['error:http', 'action:open_link']],
    [{ ...base, error: 'not_json', status: 200 }, ['error:not_json', 'action:open_link']],
    [{ ...base, error: 'too_big' }, ['error:too_big']],
    [{ ...base, error: 'empty' }, ['error:empty']],
    [{ ...base, error: 'surprise' }, ['error:network']],
  ];
  for (const [result, expected] of cases) {
    const advice = doctor(result, options);
    assert.deepEqual(advice.map((a) => `${a.level}:${a.key}`), expected, JSON.stringify(result).slice(0, 60));
    for (const { key, vars } of advice) {
      const text = textOf(registry, `doctor.${key}`, vars);
      assert.notEqual(text, `doctor.${key}`, `text.doctor.${key} exists`);
      assert.ok(!/\{\w+\}/.test(text) || key === 'policy', `${key} has all its values: ${text}`);
    }
  }
  const [blocked] = doctor({ ...base, error: 'blocked_read' }, options);
  assert.equal(textOf(registry, 'doctor.blocked_read', blocked.vars).includes('add https://pages.opencodingsociety.com to allowed_origins'), true);
  assert.deepEqual(doctor({ ...base, error: 'timeout' }, options)[0].vars, { seconds: 8 });
  // One item is not "1 items", and the list the reply holds is named by its path.
  const said = (json) => doctor({ ...base, ok: true, json }, options).map(({ key, vars }) => textOf(registry, `doctor.${key}`, vars));
  const [single] = said([{ joke: 'Ha' }]);
  assert.match(single, /\b1 item\b/);
  assert.doesNotMatch(single, /\b1 items\b/);
  assert.match(said([{ joke: 'Ha' }, { joke: 'Ho' }])[0], /\b2 items\b/);
  assert.match(said({ data: { items: [] } })[1], /\bdata\.items\b/);
  assert.match(said({ joke: 'Ha', tags: ['pun'] })[1], /\btags\b/);
  assert.deepEqual(doctor({ ...base, ok: true, json: [{ email: 'x' }] }, { ...options, privateKeyList: [] }).map((a) => a.key), ['ok_one']);
  assert.deepEqual(doctor({ ...base, ok: true, json: [{ a: 1 }] }, { ...options, privateKeyList: ['token', 'sid'] })[1].vars, { keys: 'token, sid' });
  assert.deepEqual(doctor(null), []);
});

// Test connection describes the items the block will show (listIn at the block's list_path), not
// the list findListPath would pick: a different count there contradicts the preview.
test('doctor counts the items the block shows at its list_path, and checks those for private fields', () => {
  const base = { ok: true, status: 200, ms: 12, host: 'team.example', url: 'https://team.example/api', loopback: false };
  const report = (json, listPath) => doctor({ ...base, json }, { listPath })
    .map(({ key, vars }) => [key, vars.count ?? vars.keys ?? vars.path].filter((part) => part !== undefined).join(':'));
  const team = { team: 'Flood Watch', users: [{ name: 'Ada' }, { name: 'Alan' }] };
  assert.deepEqual(report(team, WHOLE_REPLY), ['ok_one:1'], 'the whole reply is one item, not the two users');
  assert.deepEqual(report(team, ''), ['ok:2'], 'not picked yet: the list the block guesses');
  assert.deepEqual(report({ a: [{ n: 1 }], b: [{ n: 1 }, { n: 2 }, { n: 3 }] }, 'a'), ['ok_one:1'], 'the picked list, not the longer one');
  assert.deepEqual(report({ users: [] }, 'users'), ['ok:0'], 'a picked list that is empty for now');
  assert.deepEqual(report(team, 'users[0]'), ['ok_one:1'], 'a path to one object is one item');
  assert.deepEqual(report({ users: [{ name: 'Ada' }] }, 'jokes'), ['ok:0'], 'a picked list that is not in this reply');
  // Nothing picked and no list of objects to guess: the block shows the reply as one item, and
  // the report names the list the reply holds, which is right but empty for now or of plain values.
  assert.deepEqual(report({ data: { items: [] } }, ''), ['ok_object', 'ok_list_empty:data.items'], 'the route is right; its list is empty for now');
  assert.deepEqual(report({ joke: 'Why?', haha: 3, comments: [] }, ''), ['ok_object', 'ok_list_empty:comments']);
  assert.deepEqual(report({ joke: 'Why?', tags: ['pun'] }, ''), ['ok_object', 'ok_list_plain:tags']);
  assert.deepEqual(report({ names: ['Ada'], none: [] }, ''), ['ok_object', 'ok_list_plain:names'], 'the longer list of the two');
  assert.deepEqual(report({ joke: 'Why?' }, ''), ['ok_object', 'empty'], 'a reply with no list at all');
  assert.deepEqual(report({ data: { items: [] } }, 'data.items'), ['ok:0'], 'once picked, the list is counted');
  // The longer list (staff) is the guess; the block may show users or the whole reply instead.
  const mixed = { email: 'team@x.example', users: [{ name: 'Ada' }], staff: [{ name: 'Bo' }, { name: 'Cy', token: 't' }] };
  assert.deepEqual(report(mixed, ''), ['ok:2', 'private_keys:token']);
  assert.deepEqual(report(mixed, 'users'), ['ok_one:1'], 'nothing private in the list the block shows');
  assert.deepEqual(report(mixed, WHOLE_REPLY), ['ok_one:1', 'private_keys:email']);
  assert.deepEqual(report({ name: 'Ada', email: 'a@x.example' }, ''), ['ok_object', 'empty', 'private_keys:email'], 'one object is shown, so its fields count');
});

test('codeSnippet is plain JavaScript that starts with the CPT acknowledgment', () => {
  const code = codeSnippet({ url: ` ${JOKES}</script> `, list_path: 'data.items', title_path: 'joke', text_path: 'email', value_path: 'a b', label_path: 7, junk: 1 });
  const lines = code.split('\n');
  assert.match(lines[0], /^\/\/ Generated by the OCS UI Builder\. CPT rules: if you reuse this code, say that the OCS UI Builder generated it\.$/);
  assert.ok(code.includes(`const API_URL = "${JOKES}\\u003c/script>";`), 'the link is a string literal that cannot end a <script>');
  assert.ok(code.includes('const LIST_PATH = "data.items";'));
  assert.ok(code.includes('const FIELDS = {"title":"joke","text":"","image":"","link":"","value":"","label":""};'), 'private and invalid paths are left out');
  assert.ok(!code.includes('innerHTML') && code.includes("credentials: 'omit'") && code.includes("redirect: 'error'"));
  assert.doesNotThrow(() => new Function(code), 'it parses');
  assert.ok(!code.includes('findItems'), 'a picked list is read as it is, with no finding of its own');
  const finding = codeSnippet({ url: JOKES, list_path: '', title_path: 'joke' });
  assert.ok(finding.includes('const LIST_PATH = "";') && finding.includes('function findItems(reply)'), 'a list not picked yet is found when the code runs');
  assert.ok(!finding.includes('innerHTML'));
  assert.doesNotThrow(() => new Function(finding), 'that parses too');
  assert.ok(codeSnippet(null).includes('const API_URL = "";'));
  assert.ok(codeSnippet(JSON.parse('{"__proto__":{"url":"https://evil.example"}}')).includes('const API_URL = "";'));
});
