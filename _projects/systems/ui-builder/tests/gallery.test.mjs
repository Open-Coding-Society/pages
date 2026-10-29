import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textOf } from '../js/registry.js';
import { filterGallery, galleryRequest, startGallery } from '../js/gallery.js';
import { createDocument, createEvent, createWindow, settle, text } from './fixtures/live/dom.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const SITE = 'https://pages.opencodingsociety.com';
const CONFIG = Object.freeze({ springEnabled: true, baseurl: '/preview' });
const PAGES = [
  { slug: 'flood-watch', title: 'Flood Watch', description: 'Maps of rising rivers.', byline: 'Binary Beasts', course: 'csp', image: 'https://raw.githubusercontent.com/a/b/main/map.png', publishedAt: 3, visibility: 'PUBLIC' },
  { slug: 'café-bot', title: 'Bad slug', description: '', byline: '', course: '', image: '', publishedAt: 2, visibility: 'PUBLIC' },
  { slug: 'rain-api', title: 'Rain API', description: 'A Flask backend.', byline: 'Cloud Crew', course: 'csa', image: 'http://insecure.example/x.png', publishedAt: 1, visibility: 'SIGNED_IN' },
];

function fakeStore({ gallery = async () => PAGES, whoami = async () => ({ personId: 1 }) } = {}) {
  const calls = [];
  return {
    calls,
    capabilities: { gallery: true },
    gallery: async (options) => { calls.push(['gallery', options]); return gallery(options); },
    whoami: async () => { calls.push(['whoami']); return whoami(); },
  };
}

async function open(registry, { search = '', store = fakeStore(), config = CONFIG } = {}) {
  const doc = createDocument();
  const win = createWindow(doc, { href: `${SITE}/preview/ui-builder/gallery/${search}` });
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const gallery = startGallery(root, { registry, config, store, doc, win });
  await gallery.ready;
  return {
    doc, win, root, store, gallery,
    cards: () => root.querySelectorAll('a.ocs__nav-card'),
    count: () => text(root.querySelector('p[role="status"]')),
    search: root.querySelector('#ui-gallery-search'),
    course: root.querySelector('#ui-gallery-course'),
  };
}

const say = (registry, key, vars) => textOf(registry, key, vars);

test('the address keeps a known course and a short search', needsRuby, () => {
  const registry = loadRegistry();
  assert.deepEqual(galleryRequest('?course=csp&q=%20flood%20', registry), { course: 'csp', q: 'flood' });
  assert.deepEqual(galleryRequest('?course=__proto__', registry), { course: '', q: '' });
  assert.equal(galleryRequest(`?q=${'x'.repeat(300)}`, registry).q.length, 100);
  assert.deepEqual(filterGallery(PAGES, 'BEASTS rivers', registry).map((item) => item.slug), ['flood-watch'], 'every word, any field');
  assert.deepEqual(filterGallery(PAGES, 'principles', registry).map((item) => item.slug), ['flood-watch'], 'the course name counts');
  assert.equal(filterGallery(PAGES, '  ', registry), PAGES);
});

test('published pages show as nav cards that open the viewer', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await open(registry);
  const cards = run.cards();
  assert.equal(cards.length, 2, 'a malformed slug is never linked');
  assert.equal(cards[0].getAttribute('href'), '/preview/ui-builder/view/?page=flood-watch');
  assert.equal(text(cards[0].querySelector('.ocs__nav-card-kicker')), 'Computer Science Principles');
  assert.equal(text(cards[0].querySelector('.ocs__nav-card-title')), 'Flood Watch');
  assert.ok(text(cards[0]).includes(say(registry, 'gallery.by', { byline: 'Binary Beasts' })));
  const image = cards[0].querySelector('img');
  assert.equal(image.getAttribute('src'), PAGES[0].image);
  assert.equal(image.getAttribute('alt'), '');
  assert.equal(image.getAttribute('referrerpolicy'), 'no-referrer');
  assert.equal(cards[1].querySelector('img'), null, 'an http picture is left out');
  assert.equal(text(cards[1].querySelector('strong.ocs__status')), say(registry, 'gallery.members_only'));
  assert.equal(run.count(), say(registry, 'gallery.count', { count: 2 }));
  assert.equal(run.root.querySelector('nav.ocs__nav-grid').getAttribute('aria-label'), say(registry, 'gallery.results_label'));
  assert.equal(run.root.querySelector('label[for="ui-gallery-search"]').getAttribute('class'), 'ocs__label');
  assert.deepEqual(run.store.calls, [['gallery', { course: '' }], ['whoami']]);
  assert.equal(run.root.querySelector('h1').parentNode.localName, 'header');
});

test('cards follow the registry\'s slug pattern, and each slug is encoded into its link', needsRuby, async () => {
  const registry = loadRegistry();
  const pages = [...PAGES, { slug: 'team_3', title: 'Team 3', description: '', byline: '', course: 'csp', image: '', publishedAt: 0, visibility: 'PUBLIC' }];
  const narrow = await open(registry, { store: fakeStore({ gallery: async () => pages }) });
  assert.equal(narrow.cards().length, 2, 'the default pattern has no underscores');
  const widened = { ...registry, limits: { ...registry.limits, slug_pattern: '^[a-z0-9_&=-]{3,64}$' } };
  const run = await open(widened, { store: fakeStore({ gallery: async () => [...pages, { ...pages[3], slug: 'x&q=1' }] }) });
  assert.deepEqual(run.cards().map((card) => card.getAttribute('href').replace('/preview/ui-builder/view/?page=', '')), ['flood-watch', 'rain-api', 'team_3', 'x%26q%3D1']);
});

test('search filters in the browser and course asks Spring, both kept in the address', needsRuby, async () => {
  const registry = loadRegistry();
  const run = await open(registry, { search: '?q=rain' });
  assert.equal(run.search.value, 'rain');
  assert.deepEqual(run.cards().map((card) => card.getAttribute('href')), ['/preview/ui-builder/view/?page=rain-api']);
  assert.equal(run.count(), say(registry, 'gallery.count_one'));
  run.search.value = 'nothing like it';
  run.search.dispatchEvent(createEvent('input'));
  assert.equal(run.cards().length, 0);
  assert.equal(run.count(), say(registry, 'gallery.empty_filtered'));
  assert.equal(run.win.history.replaced.at(-1), '/preview/ui-builder/gallery/?q=nothing+like+it');

  run.search.value = '';
  run.search.dispatchEvent(createEvent('input'));
  run.course.value = 'csa';
  run.course.dispatchEvent(createEvent('change'));
  await settle();
  assert.deepEqual(run.store.calls.filter(([name]) => name === 'gallery').map(([, options]) => options), [{ course: '' }, { course: 'csa' }]);
  assert.equal(run.win.history.replaced.at(-1), '/preview/ui-builder/gallery/?course=csa');
  run.course.value = '';
  run.course.dispatchEvent(createEvent('change'));
  await settle();
  assert.equal(run.store.calls.filter(([name]) => name === 'gallery').length, 2, 'a course already shown is not asked for again');

  const preset = await open(registry, { search: '?course=csp' });
  assert.equal(preset.course.value, 'csp');
  assert.deepEqual(preset.store.calls[0], ['gallery', { course: 'csp' }]);
});

test('empty, failing and signed-out galleries each say so', needsRuby, async (t) => {
  t.mock.method(console, 'error', () => {});
  const registry = loadRegistry();
  const empty = await open(registry, { store: fakeStore({ gallery: async () => [] }) });
  assert.equal(empty.count(), say(registry, 'gallery.empty'));

  // This browser is online, so an OfflineError means OCS didn't answer, not "check your connection".
  let fail = true;
  const flaky = await open(registry, {
    store: fakeStore({ gallery: async () => { if (fail) throw Object.assign(new Error('x'), { name: 'OfflineError' }); return PAGES; } }),
  });
  assert.ok(text(flaky.root).includes(say(registry, 'gallery.no_answer')), 'OCS is the one not answering');
  fail = false;
  flaky.root.querySelector('.ocs__callout').parentNode.querySelector('button').click();
  await settle();
  assert.equal(flaky.cards().length, 2);

  // A failing server says so (store wording), not "check your connection".
  const server = await open(registry, { store: fakeStore({ gallery: async () => { throw Object.assign(new Error('x'), { name: 'ApiError', status: 502, error: 'server' }); } }) });
  assert.ok(text(server.root).includes(say(registry, 'store.server', { status: 502 })));

  // Only a browser that knows it is offline is told to check its connection.
  Object.defineProperty(globalThis.navigator, 'onLine', { value: false, configurable: true });
  try {
    const offline = await open(registry, { store: fakeStore({ gallery: async () => { throw Object.assign(new Error('x'), { name: 'OfflineError' }); } }) });
    assert.ok(text(offline.root).includes(say(registry, 'gallery.load_failed')));
  } finally {
    delete globalThis.navigator.onLine;
  }

  const anonymous = await open(registry, { store: fakeStore({ whoami: async () => null }) });
  const note = anonymous.root.querySelector('a[href="/preview/login"]');
  assert.ok(note, 'signed-out visitors are told they see only public pages, and how to see more');
  assert.ok(text(note.parentNode).startsWith(say(registry, 'gallery.signed_out')));
  const member = await open(registry);
  assert.equal(member.root.querySelector('a[href="/preview/login"]'), null);
});

test('a Flask-only site shows a notice and asks Spring nothing', needsRuby, async () => {
  const registry = loadRegistry();
  const store = fakeStore();
  const run = await open(registry, { config: { ...CONFIG, springEnabled: false }, store });
  assert.equal(text(run.root.querySelector('.ocs__callout')), say(registry, 'gallery.spring_off'));
  assert.equal(run.search, null);
  assert.deepEqual(store.calls, []);
  assert.equal(run.root.querySelector('a.ocs__btn').getAttribute('href'), '/preview/ui-builder/', 'making a page still works');
});
