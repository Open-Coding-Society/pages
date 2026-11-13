import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as messagesModel from '../../messages/js/messages-model.js';
import { textOf } from '../js/registry.js';
import { LocalPageStore } from '../js/page-store.js';
import { startViewer, viewRequest } from '../js/viewer.js';
import { createDocument, createEvent, createStorage, createWindow, settle, text } from './fixtures/live/dom.mjs';
import { MODULE_URLS, fakeConversationEmbed, fetchRouter, json, moduleLoader, pageOf } from './fixtures/live/pages.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const SITE = 'https://pages.opencodingsociety.com';
const PYTHON = 'https://flask.opencodingsociety.com';
const CONFIG = Object.freeze({
  springEnabled: true, javaURI: 'https://spring.opencodingsociety.com', javaWebSocketURI: 'https://spring.opencodingsociety.com',
  pythonURI: PYTHON, baseurl: '/preview', fetchOptions: { method: 'GET', credentials: 'include', headers: { 'X-Origin': 'client' } },
});
const RICH_TEXT = { renderRichMessage(container, raw) { container.textContent = raw; }, createRichComposer() { return {}; } };
const GROUP = { id: 7, name: 'Binary Beasts' };

const SPEC = pageOf([[
  ['hero', { badge: 'CSP', title: 'Flood Watch', lead: 'We map floods.', links: [] }],
  ['text', { body: 'Some <b>bold</b> words.' }],
  ['chat', { group: GROUP, title: 'Team chat' }],
  ['video', { url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Demo', caption: '' }],
]]);

const viewOf = (extra = {}) => ({
  slug: 'flood-watch', title: 'Flood Watch', description: '', byline: 'Binary Beasts', course: 'csp', image: '', publishedAt: 5,
  publishedVersion: 3, visibility: 'PUBLIC', spec: SPEC, canEdit: false, pageId: null, madeBy: { owner: 'Ada', group: 'Binary Beasts' },
  groups: { 7: { name: 'Binary Beasts', viewerIsMember: true } }, viewer: { signedIn: true, name: 'Grace' }, ...extra,
});

function fakeStore({ published, open, whoami = async () => ({ personId: 5, name: 'Grace', roles: [], isTeacher: false }) } = {}) {
  const calls = [];
  const record = (name, fn) => async (...args) => {
    calls.push([name, ...args]);
    if (!fn) throw new Error(`${name} was not expected`);
    return fn(...args);
  };
  return {
    calls,
    capabilities: { cloud: true, gallery: true },
    published: record('published', published),
    open: record('open', open),
    whoami: record('whoami', whoami),
    members: record('members', async () => []),
    messageOwner: record('messageOwner', async () => ({ conversationId: 1 })),
  };
}

async function view(registry, { search = '?page=flood-watch', store, config = CONFIG, framed = false, routes = {}, fakes = {} } = {}) {
  const doc = createDocument();
  const win = createWindow(doc, { href: `${SITE}/preview/ui-builder/view/${search}`, framed });
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const chat = fakeConversationEmbed();
  const loader = moduleLoader({ conversationEmbed: chat, ...fakes });
  const router = fetchRouter(routes);
  const viewer = startViewer(root, {
    registry, config, richText: RICH_TEXT, messagesModel, modules: MODULE_URLS, store, doc, win,
    fetchImpl: router.fetchImpl, sessionStorage: null, loadModule: loader.loadModule, navigate: () => {},
  });
  await viewer.ready;
  await settle();
  return { doc, win, root, viewer, chat, loader, router };
}

const say = (registry, key, vars) => textOf(registry, key, vars);

test('the address names one page: ?page, then ?draft, then ?local', needsRuby, () => {
  const registry = loadRegistry();
  assert.deepEqual(viewRequest('?page=flood-watch&draft=3', registry), { mode: 'page', slug: 'flood-watch' });
  assert.deepEqual(viewRequest('?draft=12&local=abcdef', registry), { mode: 'draft', id: 12 });
  assert.deepEqual(viewRequest('?local=abcdef123456', registry), { mode: 'local', id: 'abcdef123456' });
  assert.deepEqual(viewRequest('', registry), { mode: 'none' });
  for (const [search, expected] of [['?page=Flood', { mode: 'page', slug: null }], ['?page=team_3', { mode: 'page', slug: null }],
    ['?page=../x', { mode: 'page', slug: null }], ['?draft=0', { mode: 'draft', id: null }], ['?draft=1e3', { mode: 'draft', id: null }],
    ['?draft=99999999999999999', { mode: 'draft', id: null }], ['?local=../x', { mode: 'local', id: null }]]) {
    assert.deepEqual(viewRequest(search, registry), expected, search);
  }
  // The slug's shape comes from the registry; whether a page has it is Spring's call, reserved words too.
  assert.deepEqual(viewRequest('?page=admin', registry), { mode: 'page', slug: 'admin' }, 'a page published before "admin" was reserved');
  const widened = { ...registry, limits: { ...registry.limits, slug_pattern: '^[a-z0-9_-]{3,64}$' } };
  assert.deepEqual(viewRequest('?page=team_3', widened), { mode: 'page', slug: 'team_3' });
});

test('a published page: attribution bar, the page, its title, and its live blocks', needsRuby, async () => {
  const registry = loadRegistry();
  const store = fakeStore({ published: async () => viewOf({ canEdit: true, pageId: 12 }) });
  const { doc, root, chat, router } = await view(registry, { store });
  const bar = root.querySelector('[data-ui-viewer-bar]');
  assert.equal(text(bar.querySelector('strong.ocs__badge')), say(registry, 'view.attribution'));
  assert.ok(text(bar).includes(say(registry, 'view.made_by_group', { name: 'Ada', group: 'Binary Beasts' })));
  assert.ok(!text(bar).includes('Binary Beasts Binary'), 'the byline is the page\'s, not the bar\'s');
  const [edit, report] = bar.querySelectorAll('a.ocs__btn');
  assert.equal(edit.getAttribute('href'), '/preview/ui-builder/?page=12');
  const mail = report.getAttribute('href');
  assert.ok(mail.startsWith('mailto:?subject='));
  assert.ok(decodeURIComponent(mail).includes(`${SITE}/preview/ui-builder/view/?page=flood-watch`));
  assert.ok(root.querySelector('article[data-ui-page]'));
  assert.equal(text(root.querySelector('h1')), 'Flood Watch');
  assert.equal(doc.title, say(registry, 'view.document_title', { title: 'Flood Watch' }));
  assert.deepEqual(store.calls.map(([name]) => name), ['published', 'whoami']);
  assert.equal(store.calls[0][1], 'flood-watch');
  assert.equal(chat.mounts.length, 1, 'the member sees the group chat');
  assert.deepEqual(router.calls, [], 'Flask is not asked: there is no feedback and the viewer is signed in');
  // The video waits for a press.
  assert.equal(root.querySelector('iframe'), null);
  root.querySelector('button[data-ui-embed-kind]').click();
  assert.equal(root.querySelector('iframe').getAttribute('class'), 'ocs__embed ocs__embed--video');
});

test('signed-out visitors: no names, no Edit, and Flask decides whether they are guests', needsRuby, async () => {
  const registry = loadRegistry();
  const anonymous = viewOf({ madeBy: { owner: null, group: 'Binary Beasts' }, viewer: { signedIn: false, name: null } });
  const out = await view(registry, { store: fakeStore({ published: async () => anonymous }), routes: { [`${PYTHON}/api/id`]: json({ message: 'no' }, 401) } });
  const bar = out.root.querySelector('[data-ui-viewer-bar]');
  assert.ok(text(bar).includes(say(registry, 'view.made_by', { name: 'Binary Beasts' })));
  assert.equal(bar.querySelectorAll('a.ocs__btn').length, 1, 'Report only');
  assert.deepEqual(out.router.calls.map((call) => call.url), [`${PYTHON}/api/id`]);
  assert.equal(out.router.calls[0].init.credentials, 'include');
  const chatStatus = out.root.querySelector('[data-ui-live="chat"] [data-ui-live-status]');
  assert.ok(text(chatStatus).startsWith(say(registry, 'blocks.live_sign_in')));

  const guest = await view(registry, { store: fakeStore({ published: async () => anonymous }), routes: { [`${PYTHON}/api/id`]: json({ uid: 'guest1' }) } });
  assert.equal(text(guest.root.querySelector('[data-ui-live="chat"] [data-ui-live-status]')), say(registry, 'view.guest_comms'));
  assert.equal(guest.chat.mounts.length, 0);
});

test('not found, offline and broken pages each say so; offline offers a retry', needsRuby, async (t) => {
  t.mock.method(console, 'error', () => {});
  const registry = loadRegistry();
  const missing = await view(registry, { store: fakeStore({ published: async () => { throw Object.assign(new Error('x'), { name: 'NotFoundError' }); } }) });
  assert.ok(text(missing.root).startsWith(say(registry, 'view.not_found')));
  assert.equal(missing.root.querySelector('a').getAttribute('href'), '/preview/login');

  let attempts = 0;
  const flaky = fakeStore({
    published: async () => {
      attempts += 1;
      if (attempts === 1) throw Object.assign(new Error('x'), { name: 'OfflineError' });
      return viewOf();
    },
  });
  const noAnswer = await view(registry, { store: flaky });
  assert.ok(text(noAnswer.root).startsWith(say(registry, 'view.no_answer')), 'this browser is online, so OCS is the one not answering');
  noAnswer.root.querySelector('[data-ui-viewer-retry]').click();
  await settle();
  assert.equal(attempts, 2);
  assert.ok(noAnswer.root.querySelector('article[data-ui-page]'), 'the retry shows the page');

  // Only a browser that knows it is offline is told to check its connection.
  Object.defineProperty(globalThis.navigator, 'onLine', { value: false, configurable: true });
  try {
    const offline = await view(registry, { store: fakeStore({ published: async () => { throw Object.assign(new Error('x'), { name: 'OfflineError' }); } }) });
    assert.ok(text(offline.root).startsWith(say(registry, 'view.load_failed')));
  } finally {
    delete globalThis.navigator.onLine;
  }
  const failing = await view(registry, { store: fakeStore({ published: async () => { throw Object.assign(new Error('x'), { name: 'ApiError', status: 502, error: 'server' }); } }) });
  assert.ok(text(failing.root).startsWith(say(registry, 'store.server', { status: 502 })), 'a failing server says so, not "check your connection"');
  assert.ok(failing.root.querySelector('[data-ui-viewer-retry]'));

  const newer = await view(registry, { store: fakeStore({ published: async () => viewOf({ spec: { ...SPEC, schemaVersion: 2 } }) }) });
  assert.equal(text(newer.root), say(registry, 'errors.bad_schema_version'));
  const broken = await view(registry, { store: fakeStore({ published: async () => viewOf({ spec: { schemaVersion: 1, kind: 'ocs-ui-page' } }) }) });
  assert.equal(text(broken.root), say(registry, 'view.broken'));
});

test('a Flask-only site never calls Spring; its pages open from this browser', needsRuby, async () => {
  const registry = loadRegistry();
  const flaskOnly = { ...CONFIG, springEnabled: false };
  const store = fakeStore({});
  const published = await view(registry, { store, config: flaskOnly });
  assert.ok(text(published.root).startsWith(say(registry, 'view.spring_off')));
  const draft = await view(registry, { search: '?draft=12', store, config: flaskOnly });
  assert.ok(text(draft.root).startsWith(say(registry, 'view.spring_off')));
  assert.deepEqual(store.calls, []);

  const local = new LocalPageStore({ storage: createStorage(), makeId: () => 'abcdef123456' });
  const { ref } = await local.create(pageOf([[['hero', { title: 'Mine' }], ['chat', { group: GROUP }]]]));
  const opened = await view(registry, { search: `?local=${ref.id}`, store: local, config: flaskOnly });
  const bar = opened.root.querySelector('[data-ui-viewer-bar]');
  assert.equal(text(bar.querySelector('strong.ocs__badge')), say(registry, 'view.local_badge'));
  assert.equal(bar.querySelector('a.ocs__btn').getAttribute('href'), `/preview/ui-builder/?local=${ref.id}`);
  assert.equal(text(opened.root.querySelector('h1')), 'Mine');
  assert.equal(text(opened.root.querySelector('[data-ui-live="chat"] [data-ui-live-status]')), say(registry, 'blocks.live_needs_spring'));
  assert.deepEqual(opened.router.calls, []);
  const gone = await view(registry, { search: '?local=zzzzzz999999', store: local, config: flaskOnly });
  assert.ok(text(gone.root).startsWith(say(registry, 'view.local_not_found')));
});

test('a draft opens for its editors, with a link to the live page once published', needsRuby, async () => {
  const registry = loadRegistry();
  const store = fakeStore({ open: async () => ({ page: SPEC, base: 4, meta: { slug: 'flood-watch', status: 'PUBLISHED', isOwner: true } }) });
  const { root, chat } = await view(registry, { search: '?draft=12', store });
  assert.deepEqual(store.calls[0], ['open', { kind: 'spring', id: 12 }]);
  const links = root.querySelectorAll('[data-ui-viewer-bar] a.ocs__btn').map((a) => a.getAttribute('href'));
  assert.deepEqual(links, ['/preview/ui-builder/?page=12', '/preview/ui-builder/view/?page=flood-watch']);
  assert.equal(text(root.querySelector('[data-ui-viewer-bar] strong')), say(registry, 'view.draft_badge'));
  assert.equal(chat.mounts.length, 1);
});

test('bad addresses, missing pages and frames are refused before anything loads', needsRuby, async () => {
  const registry = loadRegistry();
  const store = fakeStore({});
  for (const [search, key] of [['?page=Bad_Slug', 'view.not_found'], ['?draft=abc', 'view.draft_not_found'], ['?local=../x', 'view.local_not_found'], ['', 'view.no_page']]) {
    const run = await view(registry, { search, store });
    assert.ok(text(run.root).startsWith(say(registry, key)), search);
  }
  const framed = await view(registry, { store, framed: true });
  assert.ok(text(framed.root).startsWith(say(registry, 'view.framed')));
  const out = framed.root.querySelector('a');
  assert.equal(out.getAttribute('href'), '/preview/ui-builder/view/?page=flood-watch');
  assert.equal(out.getAttribute('target'), '_blank');
  assert.equal(out.getAttribute('rel'), 'noopener noreferrer nofollow');
  assert.deepEqual(store.calls, []);
});

test('pagehide stops the live blocks; a page back from the cache loads again', needsRuby, async () => {
  const registry = loadRegistry();
  const store = fakeStore({ published: async () => viewOf() });
  const { win, chat, viewer } = await view(registry, { store });
  assert.equal(chat.mounts[0].destroyed, false);
  win.dispatchEvent(createEvent('pagehide'));
  assert.equal(chat.mounts[0].destroyed, true);
  win.dispatchEvent(createEvent('pageshow', { persisted: true }));
  await settle();
  assert.equal(store.calls.filter(([name]) => name === 'published').length, 2);
  assert.equal(chat.mounts.length, 2);
  viewer.destroy();
  assert.equal(chat.mounts[1].destroyed, true);
  assert.equal(win.listenerCount('pagehide'), 0);
  assert.equal(win.listenerCount('pageshow'), 0);
});
