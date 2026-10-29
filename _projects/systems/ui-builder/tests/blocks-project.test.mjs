import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textOf } from '../js/registry.js';
import { mountApiData, renderApiItems, showStatus, wireEmbeds } from '../js/blocks-project.js';
import { escapeHTML, toHTML } from '../js/vnode.js';
import { createDocument, createEvent, createStorage, text } from './fixtures/live/dom.mjs';
import { ORIGIN, blocksOf, cardOf, drawPage, fetchRouter, json, mountOf, pageOf, statusOf } from './fixtures/live/pages.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const JOKES = 'https://flask.opencodingsociety.com/api/jokes';
const source = (extra = {}) => ({
  url: JOKES, list_path: '', title_path: 'joke', text_path: 'detail', image_path: 'picture', link_path: 'href', value_path: 'haha', label_path: 'kind',
  snapshot: { items: [], fetched_at: 0, from_loopback: false }, ...extra,
});
const ITEMS = [
  { title: 'Ada <b>', text: 'Hi', image: 'https://img.example/a.png', link: 'https://ada.dev/', value: '3', label: 'APIs' },
  { title: 'Bad', text: '', image: 'http://img.example/b.png', link: 'javascript:alert(1)', value: '4', label: '' },
];
const ctxOf = (registry, extra = {}) => ({ registry, baseurl: '', pageOrigin: ORIGIN, ...extra });
const html = (vnode) => toHTML(vnode, { strict: true });
const say = (registry, key, vars) => textOf(registry, key, vars);

test('renderApiItems draws every view with the content blocks\' markup, text only', needsRuby, () => {
  const registry = loadRegistry();
  const ctx = ctxOf(registry);
  const cards = html(renderApiItems(ITEMS, { view: 'cards', source: source() }, ctx));
  assert.match(cards, /^<div class="ocs__grid ocs__grid--card"><div class="ocs__grid-cell"><img class="ocs__image-frame ocs__image-frame--cover" src="https:\/\/img\.example\/a\.png" alt="" loading="lazy" referrerpolicy="no-referrer">/);
  assert.ok(cards.includes('<h4>Ada &lt;b&gt;</h4>'), 'API text is text');
  assert.ok(cards.includes(`<a class="ocs__btn" href="https://ada.dev/" target="_blank" rel="noopener noreferrer nofollow" title="ada.dev">APIs</a>`));
  assert.ok(!cards.includes('javascript:') && !cards.includes('http://img'), 'unsafe links and images never reach the page');

  const list = html(renderApiItems(ITEMS, { view: 'list', source: source() }, ctx));
  assert.ok(list.startsWith('<ul class="ocs__entity-list"><li><strong><a href="https://ada.dev/"'));
  assert.ok(list.includes('<li><strong>Bad</strong></li>'));

  assert.equal(html(renderApiItems(ITEMS, { view: 'stats', source: source() }, ctx)),
    '<div class="ocs__stats"><div class="ocs__stat"><strong class="ocs__stat-value">3</strong><span class="ocs__stat-label">APIs</span></div>'
    + '<div class="ocs__stat"><strong class="ocs__stat-value">4</strong><span class="ocs__stat-label">Bad</span></div></div>');

  const table = html(renderApiItems(ITEMS, { view: 'table', source: source({ text_path: '', label_path: '' }) }, ctx));
  assert.ok(table.startsWith('<div class="ocs__table-wrap"><table class="ocs__table"><thead><tr><th scope="col">joke</th><th scope="col">haha</th><th scope="col">href</th></tr></thead>'));
  assert.ok(table.includes('<td><a href="https://ada.dev/" target="_blank" rel="noopener noreferrer nofollow" title="ada.dev">ada.dev</a></td>'));

  assert.equal(renderApiItems([], { view: 'cards' }, ctx), null);
  assert.equal(renderApiItems([{ link: 'https://x.dev/' }], { view: 'list' }, ctx), null, 'items with nothing to read are left out');
  const ocs = html(renderApiItems([{ title: 'Team', image: 'https://team.opencodingsociety.com/logo.png' }], { view: 'cards' }, ctx));
  assert.ok(ocs.includes('crossorigin="anonymous"'), 'images on the cookie domain load without cookies');
  assert.ok(html(renderApiItems([{ title: 'x', value: '1' }], { view: '__proto__' }, ctx)).startsWith('<div class="ocs__grid'));
});

function apiPage(registry, settings) {
  const page = pageOf([[['api_data', { title: 'Jokes', view: 'list', limit: 5, ...settings }]]]);
  const doc = createDocument();
  const root = drawPage(doc, page, registry);
  const [block] = blocksOf(page);
  return { doc, root, block, card: cardOf(root, block.id), status: statusOf(root, block.id), mount: mountOf(root, block.id) };
}

test('Data from your API fetches once, without cookies, and reuses the reply for five minutes', needsRuby, async () => {
  const registry = loadRegistry();
  const storage = createStorage();
  let time = 1_000_000;
  const router = fetchRouter({ [JOKES]: json([{ joke: 'Why <script>?', haha: 3 }, { joke: 'Two', haha: 1 }, { joke: 'Three' }]) });
  const ctx = ctxOf(registry, { pageProtocol: 'https:', pageKey: 'page-flood', fetchImpl: router.fetchImpl, storage, now: () => time });

  const first = apiPage(registry, { source: source() });
  await mountApiData(first.card, first.block, ctx);
  assert.equal(router.calls.length, 1);
  const { init } = router.calls[0];
  assert.equal(init.credentials, 'omit');
  assert.equal(init.referrerPolicy, 'no-referrer');
  assert.equal(init.redirect, 'error');
  assert.deepEqual(first.mount.querySelectorAll('li').map(text), ['Why <script>?', 'Two', 'Three']);
  assert.equal(first.mount.querySelectorAll('script').length, 0);
  assert.equal(first.status.hidden, true);

  const again = apiPage(registry, { source: source() });
  await mountApiData(again.card, again.block, ctx);
  assert.equal(router.calls.length, 1, 'the second view within five minutes reads sessionStorage');
  assert.equal(again.mount.querySelectorAll('li').length, 3);

  time += 5 * 60 * 1000;
  const later = apiPage(registry, { source: source() });
  await mountApiData(later.card, later.block, ctx);
  assert.equal(router.calls.length, 2, 'after five minutes it asks the API again');
});

test('a failing API shows the saved copy, or says it could not load', needsRuby, async () => {
  const registry = loadRegistry();
  const down = fetchRouter({});
  const ctx = ctxOf(registry, { pageProtocol: 'https:', fetchImpl: down.fetchImpl, storage: null });
  const snapshot = { items: [{ title: 'Saved joke', text: '', image: '', link: '', value: '2', label: '' }], fetched_at: Date.UTC(2026, 9, 1), from_loopback: false };

  const saved = apiPage(registry, { source: source({ snapshot }) });
  await mountApiData(saved.card, saved.block, ctx);
  assert.deepEqual(saved.mount.querySelectorAll('li').map(text), ['Saved joke']);
  assert.ok(text(saved.status).startsWith(say(registry, 'blocks.api_offline_copy', { date: '' }).trim()));

  const nothing = apiPage(registry, { source: source() });
  await mountApiData(nothing.card, nothing.block, ctx);
  assert.equal(text(nothing.status), say(registry, 'live.api_failed', { host: 'flask.opencodingsociety.com' }));
  assert.equal(nothing.mount.childNodes.length, 0);

  const empty = apiPage(registry, { source: source({ url: '' }) });
  await mountApiData(empty.card, empty.block, ctx);
  assert.equal(text(empty.status), say(registry, 'blocks.sample_no_source'));

  const none = fetchRouter({ [JOKES]: json({ jokes: [] }) });
  const blank = apiPage(registry, { source: source({ list_path: 'jokes' }) });
  await mountApiData(blank.card, blank.block, { ...ctx, fetchImpl: none.fetchImpl });
  assert.equal(text(blank.status), say(registry, 'blocks.api_empty'));
});

test('an API on the team\'s computer is never fetched in view; its saved copy shows', needsRuby, async () => {
  const registry = loadRegistry();
  const router = fetchRouter({ 'http://localhost:8587': json([{ joke: 'live' }]) });
  const ctx = ctxOf(registry, { pageProtocol: 'http:', fetchImpl: router.fetchImpl, storage: null });
  const snapshot = { items: [{ title: 'From my laptop' }], fetched_at: Date.UTC(2026, 9, 2), from_loopback: true };
  const view = apiPage(registry, { source: source({ url: 'http://localhost:8587/api/jokes', snapshot }) });
  await mountApiData(view.card, view.block, ctx);
  assert.deepEqual(view.mount.querySelectorAll('li').map(text), ['From my laptop']);
  assert.ok(text(view.status).startsWith(say(registry, 'blocks.api_saved_from_computer', { date: '' }).trim()));
  const bare = apiPage(registry, { source: source({ url: 'http://127.0.0.1:5000/api' }) });
  await mountApiData(bare.card, bare.block, ctx);
  assert.equal(text(bare.status), say(registry, 'live.api_unreachable'));
  assert.equal(router.calls.length, 0);
});

// The review's case: a team saved a copy from localhost, then moved the block to its deployed API.
test('a copy saved on the team\'s computer only stands in once the block reads a deployed API', needsRuby, async () => {
  const registry = loadRegistry();
  const snapshot = { items: [{ title: 'From my laptop' }], fetched_at: Date.UTC(2026, 9, 2), from_loopback: true };
  const deployed = fetchRouter({ [JOKES]: json([{ joke: 'Live joke' }]) });
  const live = apiPage(registry, { source: source({ snapshot }) });
  await mountApiData(live.card, live.block, ctxOf(registry, { pageProtocol: 'https:', fetchImpl: deployed.fetchImpl, storage: null }));
  assert.equal(deployed.calls.length, 1, 'the deployed API is read');
  assert.deepEqual(live.mount.querySelectorAll('li').map(text), ['Live joke']);
  assert.equal(live.status.hidden, true);

  const down = apiPage(registry, { source: source({ snapshot }) });
  await mountApiData(down.card, down.block, ctxOf(registry, { pageProtocol: 'https:', fetchImpl: fetchRouter({}).fetchImpl, storage: null }));
  assert.deepEqual(down.mount.querySelectorAll('li').map(text), ['From my laptop'], 'when it does not answer, the old copy shows');
  assert.ok(text(down.status).startsWith(say(registry, 'blocks.api_saved_from_computer', { date: '' }).trim()), 'still labelled as the laptop copy');
});

test('click-to-load cards open the grammar\'s iframes under their title; edited addresses frame nothing', needsRuby, () => {
  const registry = loadRegistry();
  const page = pageOf([[
    ['video', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Demo', caption: 'Two minutes, no sound' }],
    ['embed', { url: 'https://ada.github.io/flood/', title: 'Flood app', height: 'tall' }],
    ['embed', { url: 'https://ada.github.io/other/', title: 'Other', height: 'short' }],
    ['video', { url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Second', caption: '' }],
  ]]);
  const doc = createDocument();
  const root = drawPage(doc, page, registry);
  const [video, app, other, second] = blocksOf(page);
  const ctx = { registry, pageOrigin: ORIGIN };
  const wiring = wireEmbeds(root, ctx);

  root.querySelector(`[data-ui-node="${video.id}"] button[data-ui-embed-kind]`).click();
  const player = root.querySelector(`[data-ui-node="${video.id}"] iframe`);
  assert.equal(player.getAttribute('class'), 'ocs__embed ocs__embed--video');
  assert.equal(player.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(player.getAttribute('sandbox'), 'allow-scripts allow-same-origin allow-forms allow-popups');
  assert.equal(player.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
  assert.equal(player.getAttribute('title'), 'Demo');
  // Only the button row gives way: the title, host and caption the student wrote stay above it.
  const card = root.querySelector(`[data-ui-node="${video.id}"] [data-ui-embed]`);
  assert.equal(player.parentNode, card);
  assert.equal(text(card.querySelector('h3')), 'Demo');
  assert.equal(text(card.querySelector('p')), 'Two minutes, no sound');
  assert.equal(card.querySelector('button'), null);
  assert.equal(doc.activeElement, player, 'focus moves to what was opened');

  root.querySelector(`[data-ui-node="${app.id}"] button`).click();
  const frame = root.querySelector(`[data-ui-node="${app.id}"] iframe`);
  assert.equal(frame.getAttribute('class'), 'ocs__embed ocs__embed--tall');
  assert.equal(frame.getAttribute('referrerpolicy'), 'no-referrer');
  assert.equal(frame.getAttribute('src'), 'https://ada.github.io/flood/');

  // Addresses edited in devtools are checked again: this site, another provider.
  const otherButton = root.querySelector(`[data-ui-node="${other.id}"] button`);
  otherButton.setAttribute('data-ui-embed-src', `${ORIGIN}/login`);
  otherButton.click();
  assert.equal(root.querySelector(`[data-ui-node="${other.id}"] iframe`), null);
  const secondButton = root.querySelector(`[data-ui-node="${second.id}"] button`);
  secondButton.setAttribute('data-ui-embed-src', 'https://evil.example/embed/dQw4w9WgXcQ');
  secondButton.click();
  assert.equal(root.querySelector(`[data-ui-node="${second.id}"] iframe`), null);

  wiring.destroy();
  secondButton.setAttribute('data-ui-embed-src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  secondButton.click();
  assert.equal(root.querySelector(`[data-ui-node="${second.id}"] iframe`), null, 'nothing loads once unwired');
  const stray = doc.createElement('div');
  root.appendChild(stray);
  assert.equal(root.dispatchEvent(createEvent('click', { target: stray })), true);
});

test('showStatus writes a sentence with an optional link or button, and hides when empty', () => {
  const doc = createDocument();
  const status = doc.createElement('div');
  showStatus(status, 'Sign in to see this.', { link: { text: 'Sign in', href: '/login' } });
  assert.equal(status.innerHTML, `${escapeHTML('Sign in to see this.')} <a href="/login">Sign in</a>`);
  assert.equal(status.hidden, false);
  let pressed = 0;
  const button = showStatus(status, '', { button: { text: 'Try again', onClick: () => { pressed += 1; } } });
  assert.equal(status.innerHTML, '<button class="ocs__btn small" type="button">Try again</button>');
  button.click();
  assert.equal(pressed, 1);
  showStatus(status, '');
  assert.equal(status.hidden, true);
  assert.equal(status.childNodes.length, 0);
});

// A live region shown with its words already in it is often not read out.
test('a hidden status line is shown first and its words move in a moment later', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const doc = createDocument();
  const status = doc.createElement('div');
  status.setAttribute('role', 'status');
  status.hidden = true;
  showStatus(status, 'Posting…');
  assert.equal(status.hidden, false, 'the region is on the page at once');
  assert.equal(status.innerHTML, '<span hidden="">Posting…</span>', 'its words wait, hidden');
  showStatus(status, 'Write your feedback first.', { button: { text: 'Try again', onClick() {} } });
  assert.equal(text(status), 'Write your feedback first. Try again', 'newer words replace the waiting ones');
  t.mock.timers.tick(100);
  assert.equal(status.innerHTML, 'Write your feedback first. <button class="ocs__btn small" type="button">Try again</button>');
  showStatus(status, 'Sent.');
  assert.equal(status.innerHTML, 'Sent.', 'a line already showing changes at once');

  showStatus(status, '');
  showStatus(status, 'Opening Messages…');
  showStatus(status, '');
  t.mock.timers.tick(100);
  assert.equal(status.hidden, true, 'emptied before its words came in: it stays hidden and empty');
  assert.equal(status.childNodes.length, 0);
});
