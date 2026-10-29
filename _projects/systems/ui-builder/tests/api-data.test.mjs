import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textOf } from '../js/registry.js';
import {
  codeSnippet, doctor, fetchJson, fieldsOf, findListPath, getPath, guessMapping, mapItems, privateKeys,
} from '../js/api-data.js';
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
    [{ ...base, ok: true, json: [{ joke: 'Ha', email: 'a@x' }] }, ['ok:ok', 'warning:private_keys']],
    [{ ...base, ok: true, json: { data: { items: [] } } }, ['ok:ok']],
    [{ ...base, ok: true, json: { name: 'x' } }, ['ok:ok_object', 'warning:empty']],
    [{ ...base, ok: true, json: [], loopback: true }, ['ok:ok', 'info:policy_loopback_view']],
    [{ ...base, error: 'policy', reason: 'policy_https' }, ['error:policy_https']],
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
  assert.deepEqual(doctor({ ...base, ok: true, json: [{ email: 'x' }] }, { ...options, privateKeyList: [] }).map((a) => a.key), ['ok']);
  assert.deepEqual(doctor({ ...base, ok: true, json: [{ a: 1 }] }, { ...options, privateKeyList: ['token', 'sid'] })[1].vars, { keys: 'token, sid' });
  assert.deepEqual(doctor(null), []);
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
  assert.ok(codeSnippet(null).includes('const API_URL = "";'));
  assert.ok(codeSnippet(JSON.parse('{"__proto__":{"url":"https://evil.example"}}')).includes('const API_URL = "";'));
});
