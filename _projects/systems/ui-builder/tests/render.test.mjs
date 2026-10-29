import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defOf, defaultSettings, textOf } from '../js/registry.js';
import { renderBlock, renderPage, renderSection } from '../js/render.js';
import { LIVE_TYPES, contentRenderers, designSample, embedFrame, parseTable } from '../js/blocks-content.js';
import { NEW_TAB_REL, SANDBOX, TAGS, escapeHTML, h, rich, toDOM, toHTML } from '../js/vnode.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';
import { createFakeDocument, elementsOf } from './fixtures/render/fake-dom.mjs';

const ORIGIN = 'https://pages.opencodingsociety.com';
const MODES = ['canvas', 'view', 'export'];
const FIXTURE = fileURLToPath(new URL('./fixtures/specs/valid/all-blocks.json', import.meta.url));

// Stand-ins for rich-content.js: the worst case, a sanitizer that only escapes <, > and &.
const sanitizeRich = (raw) => String(raw).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const renderRich = (container, raw) => container.appendChild(container.ownerDocument.createTextNode(raw));

const ctxFor = (registry, mode, extra = {}) => ({ registry, mode, baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers, ...extra });
const htmlOf = (vnode) => toHTML(vnode, { sanitizeRich, strict: true });
const domOf = (vnode) => toDOM(vnode, { doc: createFakeDocument(), renderRich, strict: true });
const pageHTML = (page, registry, mode, extra) => htmlOf(renderPage(page, ctxFor(registry, mode, extra)));
// Registry text as it appears in markup (its apostrophes come out as &#39;).
const say = (registry, key, vars) => escapeHTML(textOf(registry, key, vars));

// The markup inside one block's wrapper, so golden checks compare exact strings.
function innerOf(markup, type) {
  const match = markup.match(new RegExp(`^<div data-ui-node="b-\\d{6}" data-ui-kind="block" data-ui-type="${type}">([\\s\\S]*)</div>$`));
  assert.ok(match, `${type}: one block wrapper around the markup`);
  return match[1];
}

function builder() {
  const ids = counterIds();
  const block = (type, settings = {}, extra = {}) => ({ id: ids('b'), type, settings, hidden: false, ...extra });
  const stack = (blocks, extra = {}) => ({ id: ids('s'), type: 'stack', settings: {}, hidden: false, cells: [{ blocks }], ...extra });
  const columns = (layout, cells, extra = {}) => ({ id: ids('s'), type: 'columns', settings: { layout }, hidden: false, cells: cells.map((blocks) => ({ blocks })), ...extra });
  const page = (sections, settings = {}) => ({ schemaVersion: 1, kind: 'ocs-ui-page', page: { title: 'Flood Watch', description: '', byline: '', course: 'csp', width: 'contained', image: '', ...settings }, sections });
  return { block, stack, columns, page };
}

const API_SOURCE = {
  url: 'https://flask.opencodingsociety.com/api/jokes', list_path: '', title_path: 'joke', text_path: '', image_path: '',
  link_path: '', value_path: 'haha', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false },
};

// Realistic settings for every block; a test checks the registry adds no block without one here.
const SAMPLES = {
  hero: { badge: 'CSP - Team', title: 'Flood Watch', lead: 'We map floods.', links: [{ label: 'Try it', url: 'https://ada.github.io/flood/' }, { label: 'Lessons', url: '/csp/' }, { label: 'Mail', url: 'mailto:team@example.com' }] },
  heading: { text: 'The problem', level: '3', subtitle: 'Why it matters' },
  text: { body: 'Some <b>bold</b> text.' },
  image: { src: 'https://raw.githubusercontent.com/a/b/main/x.png', alt: 'A map', caption: 'Our map', fit: 'cover' },
  video: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Demo', caption: 'Two minutes' },
  buttons: { links: [{ label: 'One', url: 'https://example.com' }, { label: 'Two', url: '/two/' }], emphasize_first: true },
  card: { title: 'Find me', body: 'Links to my code.', links: [{ label: 'GitHub', url: 'https://github.com/ada' }] },
  callout: { body: 'A note.' },
  keypoints: { items: [{ title: 'Fast', text: 'Really fast.' }, { title: 'Only a title', text: '' }] },
  checklist: { items: [{ text: 'Plan', done: true }, { text: 'Build', done: false }] },
  stats: { items: [{ value: '3', label: 'APIs' }, { value: '12', label: 'Tests' }] },
  table: { data: 'Name | Role\nAda | Lead\n\nGrace', caption: 'Who' },
  link_cards: { items: [{ kicker: 'Repo', title: 'Source', text: 'Our code.', url: 'https://github.com/ada/flood' }, { kicker: '', title: 'Lesson', text: '', url: '/csp/sprint-1/' }] },
  team: { title: 'Our team', items: [{ name: 'Ada Lovelace', role: 'Scrum Master', url: 'https://github.com/ada' }, { name: 'grace', role: '', url: '' }] },
  code: { language: 'python', code: 'print("hi")\n' },
  divider: {},
  chat: { group: { id: 7, name: 'Binary Beasts' }, title: 'Team chat' },
  members: { group: { id: 7, name: 'Binary Beasts' }, title: '' },
  message_me: { label: 'Ask us', note: 'Questions?' },
  kanban: { url: 'https://github.com/orgs/UGRC-CSA/projects/1', filter: 'Team', title: 'Our board' },
  feedback: { title: 'Feedback', prompt: 'What next?' },
  announcements: { course: 'csp', title: 'News', limit: 5 },
  calendar: { course: '', title: 'Calendar' },
  api_data: { source: API_SOURCE, title: 'Jokes', view: 'list', limit: 5 },
  embed: { url: 'https://ada.github.io/flood/', title: 'Flood app', height: 'tall' },
};

const ATTRIBUTE_NAMES = new Set(['class', 'id', 'href', 'src', 'alt', 'title', 'role', 'lang', 'datetime', 'rel', 'target', 'loading',
  'referrerpolicy', 'crossorigin', 'sandbox', 'allow', 'height', 'width', 'scope', 'colspan', 'type', 'open', 'hidden', 'tabindex']);
const nameAllowed = (name) => ATTRIBUTE_NAMES.has(name) || /^aria-[a-z]+$/.test(name) || /^data-ui(?:-[a-z0-9]+)+$/.test(name);
const urlSafe = (value) => /^(?:https:\/\/[^\s"]+|mailto:[^\s"]+|\/(?![/\\])\S*)$/.test(value) && !/^(?:javascript|data|vbscript):/i.test(value);

// Every tag and attribute in the string is one the allowlist names, every URL is safe, and no
// brace survives for Liquid to read.
function assertSafeHTML(markup, where) {
  assert.ok(!/[{}]/.test(markup), `${where}: a raw brace`);
  for (const [, tag, rest] of markup.matchAll(/<([A-Za-z][A-Za-z0-9-]*)([^>]*)>/g)) {
    assert.ok(TAGS.has(tag), `${where}: <${tag}>`);
    for (const [, name, value] of rest.matchAll(/\s([^\s="]+)(?:="([^"]*)")?/g)) {
      assert.ok(nameAllowed(name), `${where}: attribute ${name}`);
      if (name === 'href' || name === 'src') assert.ok(urlSafe(value.replace(/&amp;/g, '&')), `${where}: ${name}="${value}"`);
    }
  }
}

function assertSafeDOM(root, where) {
  for (const element of elementsOf(root)) {
    assert.ok(TAGS.has(element.localName), `${where}: <${element.localName}>`);
    for (const name of element.getAttributeNames()) {
      assert.ok(nameAllowed(name), `${where}: attribute ${name}`);
      if (name === 'href' || name === 'src') assert.ok(urlSafe(element.getAttribute(name)), `${where}: ${name}`);
    }
  }
}

function renderEverywhere(page, registry, where) {
  for (const mode of MODES) {
    const vnode = renderPage(page, ctxFor(registry, mode));
    const markup = htmlOf(vnode);
    assertSafeHTML(markup, `${where} (${mode})`);
    if (mode !== 'export') assertSafeDOM(domOf(vnode), `${where} (${mode})`);
    if (mode === 'canvas') assert.ok(!markup.includes('data-ui-error'), `${where}: a block failed in the canvas`);
  }
}

test('every registry block has a renderer and a sample in these tests', needsRuby, () => {
  const registry = loadRegistry();
  for (const type of Object.keys(registry.blocks)) {
    assert.equal(typeof contentRenderers[type], 'function', type);
    assert.ok(SAMPLES[type], `add sample settings for ${type}`);
  }
  assert.deepEqual([...LIVE_TYPES].sort(), Object.keys(registry.blocks).filter((type) => registry.blocks[type].live === true).sort());
});

test('every block renders with its registry defaults in every mode', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const blocks = Object.keys(registry.blocks).map((type) => block(type, defaultSettings(defOf(registry, 'block', type))));
  const doc = page([stack(blocks)]);
  renderEverywhere(doc, registry, 'defaults');
  const canvas = pageHTML(doc, registry, 'canvas');
  for (const { id } of blocks) assert.ok(canvas.includes(`data-ui-node="${id}"`), `${id} stays selectable in the canvas`);
});

test('a page with every block, the templates and the shared fixture render in every mode', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, columns, page } = builder();
  const types = Object.keys(registry.blocks);
  const full = page([
    stack(types.map((type) => block(type, SAMPLES[type]))),
    columns('sidebar_right', [types.slice(0, 12).map((type) => block(type, SAMPLES[type])), types.slice(12).map((type) => block(type, SAMPLES[type]))]),
  ]);
  renderEverywhere(full, registry, 'full page');
  const view = pageHTML(full, registry, 'view');
  for (const type of types) assert.ok(view.includes(`data-ui-type="${type}"`), `${type} shows on the published page`);
  for (const template of registry.templates) renderEverywhere(template.page, registry, `template ${template.key}`);
  if (existsSync(FIXTURE)) {
    const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    const pages = Array.isArray(fixture) ? fixture : (Array.isArray(fixture.pages) ? fixture.pages : [fixture]);
    pages.forEach((spec, index) => renderEverywhere(spec, registry, `all-blocks.json #${index}`));
  }
});

// Screen readers list a page by its headings, so no template skips a level (axe heading-order):
// the header's h1, then a section heading (h2) before the cards' h3s.
test('every template\'s headings go down one level at a time from its one h1', needsRuby, () => {
  const registry = loadRegistry();
  for (const template of registry.templates) {
    const levels = [...pageHTML(template.page, registry, 'view').matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
    assert.equal(levels[0], 1, `${template.key} starts with its h1`);
    assert.equal(levels.filter((level) => level === 1).length, 1, `${template.key} has one h1`);
    levels.reduce((previous, level) => {
      assert.ok(level <= previous + 1, `${template.key}: h${previous} then h${level}`);
      return level;
    });
  }
});

const HOSTILE = [
  'javascript:alert(1)', ' JaVaScRiPt:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:x',
  '<script>alert(1)</script>', '"><img src=x onerror=alert(1)>', "' onmouseover='alert(1)", '</textarea><svg onload=alert(1)>',
  '{{ site.github }}', '{% include evil.html %}', '{%- raw -%}', '}}{{', '//evil.example/x', '/\\evil.example',
  'https://user:pw@evil.example/', 'https://evil.example/" onmouseover="x', 'http://insecure.example/',
  'https://exa\u200bmple.com/', '<!-- x --> --!>', 'line one\nline two', 'x'.repeat(30000),
];
const ODD_VALUES = [12345, -0, 1e308, true, false, null, {}, [], [1, 2], { toString: 'x' }];

// Settings where every field holds the same hostile value, both as a plain value and in the
// shape the field type stores (lists of links and items, groups, API sources).
function hostileSettings(def, value) {
  const settings = {};
  const shaped = {};
  for (const field of def.fields || []) {
    settings[field.id] = value;
    if (field.type === 'links') shaped[field.id] = [{ label: value, url: value }, { label: 'ok', url: value }];
    else if (field.type === 'items') shaped[field.id] = [hostileSettings({ fields: field.item_fields }, value)[0], value];
    else if (field.type === 'group') shaped[field.id] = { id: value, name: value };
    else if (field.type === 'api') shaped[field.id] = { url: value, title_path: value, snapshot: { items: [{ title: value, link: value }] } };
    else shaped[field.id] = value;
  }
  return [settings, shaped];
}

test('hostile settings never become markup, URLs or Liquid', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  for (const [type, def] of Object.entries(registry.blocks)) {
    for (const value of [...HOSTILE, ...ODD_VALUES]) {
      const blocks = hostileSettings(def, value).map((settings) => block(type, settings));
      renderEverywhere(page([stack(blocks)]), registry, `${type} with ${JSON.stringify(value).slice(0, 40)}`);
    }
  }
  const hero = pageHTML(page([stack([block('hero', { title: '<script>alert(1)</script>', badge: '{{ site.x }}' })])]), registry, 'view');
  assert.ok(hero.includes('<h1>&lt;script&gt;alert(1)&lt;/script&gt;</h1>'), 'hostile text stays visible as text');
  assert.ok(hero.includes('&#123;&#123; site.x &#125;&#125;'));
});

test('prototype keys, odd types and broken shapes are ignored', needsRuby, () => {
  const registry = loadRegistry();
  const spec = JSON.parse(`{"schemaVersion":1,"kind":"ocs-ui-page","page":{"__proto__":{"width":"wide"}},"sections":[
    {"id":"s-000001","type":"stack","cells":[{"blocks":[
      {"id":"b-000002","type":"hero","settings":{"__proto__":{"title":"<b>polluted</b>"},"title":"Clean"}},
      {"id":"b-000003","type":"__proto__","settings":{}},
      {"id":"b-000004","type":"constructor","settings":{}},
      {"id":"b-000005","type":"toString","settings":{}},
      {"id":"b-000006","type":"hero","settings":"not an object"},
      {"id":"<b>","type":"divider","settings":{}},
      null, 42, "block", [1]
    ]}, null, {"blocks": "nope"}]},
    {"id":"s-000007","type":"columns","settings":{"layout":"__proto__"},"cells":[{"blocks":[]},{"blocks":[]}]},
    {"id":"s-000008","type":"columns","settings":{"layout":"constructor"},"cells":"nope"},
    {"id":"s-000009","type":"__proto__","cells":[]},
    null, 7
  ]}`);
  const view = pageHTML(spec, registry, 'view');
  assertSafeHTML(view, 'prototype keys');
  assert.ok(view.startsWith('<article class="ocs__container ocs__stack" data-ui-page>'), 'a page width from the prototype is ignored');
  assert.ok(view.includes('<h1>Clean</h1>'));
  assert.ok(!view.includes('polluted'));
  assert.ok(!/data-ui-type="(?:__proto__|constructor|toString)"/.test(view));
  assert.equal((view.match(/class="ocs__split" data-ui-node="s-00000[78]"/g) || []).length, 2, 'unknown layouts fall back to two columns');
  assert.ok(view.includes('<div data-ui-node data-ui-kind="block" data-ui-type="divider"><hr></div>'), 'a bad id is left out, the block stays');
  const canvas = pageHTML(spec, registry, 'canvas');
  for (const type of ['__proto__', 'constructor', 'toString']) {
    assert.ok(canvas.includes(say(registry, 'blocks.unknown_block', { type })), `the canvas explains ${type}`);
  }
  // Even a registry that names such a block never reaches Object.prototype through the renderers.
  const named = { ...registry, blocks: { ...registry.blocks, constructor: { label: 'Odd', category: 'content', fields: [] } } };
  const odd = htmlOf(renderBlock({ id: 'b-000010', type: 'constructor', settings: {} }, ctxFor(named, 'canvas')));
  assert.ok(odd.includes(say(named, 'blocks.unknown_block', { type: 'constructor' })), odd);
  assert.throws(() => renderPage(spec, { mode: 'view' }), /ctx\.registry is required/);
  assert.equal(htmlOf(renderPage(null, ctxFor(registry, 'view'))), '<article class="ocs__container ocs__stack" data-ui-page></article>');
});

test('content blocks follow the grammar markup', needsRuby, () => {
  const registry = loadRegistry();
  const { block } = builder();
  const one = (type, settings = SAMPLES[type], mode = 'view') => innerOf(htmlOf(renderBlock(block(type, settings), ctxFor(registry, mode))), type);
  const external = (host) => `target="_blank" rel="${NEW_TAB_REL}" title="${host}"`;

  assert.equal(one('hero'), '<header class="ocs__stack"><div><strong class="ocs__badge">CSP - Team</strong></div><h1>Flood Watch</h1>'
    + '<p class="ocs__text ocs__lead">We map floods.</p><div class="ocs__links">'
    + `<a class="ocs__btn accent fill" href="https://ada.github.io/flood/" ${external('ada.github.io')}>Try it</a>`
    + '<a class="ocs__btn" href="/csp/">Lessons</a><a class="ocs__btn" href="mailto:team@example.com" rel="nofollow">Mail</a></div></header>');
  assert.equal(one('hero', { title: '' }), `<header class="ocs__stack"><h1>${say(registry, 'blocks.untitled')}</h1></header>`);
  assert.equal(one('heading'), '<h3 class="ocs__section-title">The problem</h3><p class="ocs__text">Why it matters</p>');
  assert.equal(one('heading', { text: 'Big', level: 'h1' }), '<h2 class="ocs__section-title">Big</h2>');
  assert.equal(one('text'), '<div class="ocs__text">Some &lt;b&gt;bold&lt;/b&gt; text.</div>');
  assert.equal(one('callout'), '<div class="ocs__callout">A note.</div>');
  assert.equal(one('image'), '<figure><img class="ocs__image-frame ocs__image-frame--cover" src="https://raw.githubusercontent.com/a/b/main/x.png" alt="A map" loading="lazy" referrerpolicy="no-referrer"><figcaption>Our map</figcaption></figure>');
  assert.equal(one('image', { src: 'https://team.opencodingsociety.com/x.png', alt: 'x' }), '<figure><img class="ocs__image-frame" src="https://team.opencodingsociety.com/x.png" alt="x" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous"></figure>');
  assert.equal(one('image', { src: '/images/logo.png', alt: 'Logo' }), '<figure><img class="ocs__image-frame" src="/images/logo.png" alt="Logo" loading="lazy"></figure>');
  assert.equal(one('card'), '<section class="ocs__card"><div class="ocs__card-header"><h3 class="ocs__section-title">Find me</h3>'
    + `<a class="ocs__btn" href="https://github.com/ada" ${external('github.com')}>GitHub</a></div><div class="ocs__text">Links to my code.</div></section>`);
  assert.equal(one('buttons', { ...SAMPLES.buttons, emphasize_first: false }), `<div class="ocs__links"><a class="ocs__btn" href="https://example.com/" ${external('example.com')}>One</a><a class="ocs__btn" href="/two/">Two</a></div>`);
  assert.equal(one('buttons'), `<div class="ocs__links"><a class="ocs__btn accent fill" href="https://example.com/" ${external('example.com')}>One</a><a class="ocs__btn" href="/two/">Two</a></div>`);
  assert.equal(one('stats'), '<div class="ocs__stats"><div class="ocs__stat"><strong class="ocs__stat-value">3</strong><span class="ocs__stat-label">APIs</span></div>'
    + '<div class="ocs__stat"><strong class="ocs__stat-value">12</strong><span class="ocs__stat-label">Tests</span></div></div>');
  const done = say(registry, 'blocks.checklist_done');
  const todo = say(registry, 'blocks.checklist_todo');
  assert.equal(one('checklist'), `<ul class="ocs__checklist"><li class="done"><span class="ocs__checklist-box" role="img" aria-label="${done}"></span><span>Plan</span></li>`
    + `<li class="open"><span class="ocs__checklist-box" role="img" aria-label="${todo}"></span><span>Build</span></li></ul>`);
  const check = String.fromCharCode(0x2713);
  assert.equal(one('keypoints'), `<div class="ocs__keypoints"><div class="ocs__keypoint"><b class="ocs__check" aria-hidden="true">${check}</b><span><strong>Fast</strong><br>Really fast.</span></div>`
    + `<div class="ocs__keypoint"><b class="ocs__check" aria-hidden="true">${check}</b><span><strong>Only a title</strong></span></div></div>`);
  assert.equal(one('link_cards'), `<nav class="ocs__nav-grid"><a class="ocs__nav-card" href="https://github.com/ada/flood" ${external('github.com')}>`
    + '<span class="ocs__nav-card-kicker">Repo</span><span class="ocs__nav-card-title">Source</span><span class="ocs__text">Our code.</span><strong class="ocs__status">github.com</strong></a>'
    + '<a class="ocs__nav-card" href="/csp/sprint-1/"><span class="ocs__nav-card-title">Lesson</span></a></nav>');
  assert.equal(one('table'), '<div class="ocs__table-wrap"><table class="ocs__table"><caption>Who</caption><thead><tr><th scope="col">Name</th><th scope="col">Role</th></tr></thead>'
    + '<tbody><tr><td>Ada</td><td>Lead</td></tr><tr><td>Grace</td><td></td></tr></tbody></table></div>');
  assert.equal(one('table', { data: '' }, 'canvas'), `<p class="ocs__text">${say(registry, 'blocks.table_empty')}</p>`);
  assert.equal(one('team'), '<h3 class="ocs__section-title">Our team</h3><ul class="ocs__entity-list">'
    + `<li><div class="ocs__keypoint"><abbr class="ocs__avatar" title="Ada Lovelace">AL</abbr><div><strong><a href="https://github.com/ada" ${external('github.com')}>Ada Lovelace</a></strong><br><span>Scrum Master</span></div></div></li>`
    + `<li><div class="ocs__keypoint"><abbr class="ocs__avatar" title="grace">G</abbr><div><strong>grace</strong><br><span>${say(registry, 'blocks.team_role_none')}</span></div></div></li></ul>`);
  assert.equal(one('code'), `<figure><figcaption>${say(registry, 'blocks.code_label', { language: 'python' })}</figcaption><pre><code>print(&quot;hi&quot;)\n</code></pre></figure>`);
  assert.equal(one('code', { code: 'x = 1' }), '<pre><code>x = 1</code></pre>');
  assert.equal(one('divider'), '<hr>');
});

test('tables split rows on lines and cells on |, within the registry limits', () => {
  assert.deepEqual(parseTable('a | b | c\r\n1|2\n\n  \nx'), [['a', 'b', 'c'], ['1', '2', ''], ['x', '', '']]);
  assert.deepEqual(parseTable('a|b|c', { maxRows: 5, maxCols: 2 }), [['a', 'b']]);
  assert.equal(parseTable('1\n2\n3\n4', { maxRows: 2 }).length, 2);
  assert.deepEqual(parseTable(42), []);
});

test('columns use the registry layouts, one ocs__stack per cell', needsRuby, () => {
  const registry = loadRegistry();
  const { block, columns, page } = builder();
  const expected = { halves: ['ocs__split', 2], thirds: ['ocs__facts', 3], sidebar_left: ['ocs__split ocs__split--aside', 2], sidebar_right: ['ocs__split ocs__split--aside-end', 2] };
  for (const [layout, [className, cells]] of Object.entries(expected)) {
    const section = columns(layout, Array.from({ length: cells }, (_, i) => [block('text', { body: `cell ${i}` })]));
    const markup = htmlOf(renderSection(section, ctxFor(registry, 'view')));
    assert.ok(markup.startsWith(`<section class="${className}" data-ui-node="${section.id}" data-ui-kind="section" data-ui-type="columns">`), layout);
    assert.equal((markup.match(/<div class="ocs__stack" data-ui-cell="\d">/g) || []).length, cells, layout);
    assert.match(markup, new RegExp(`data-ui-cell="${cells - 1}"><div data-ui-node="b-\\d+" data-ui-kind="block" data-ui-type="text"><div class="ocs__text">cell ${cells - 1}</div>`));
  }
  // Cells past the layout's count join the last column instead of disappearing.
  const crowded = columns('halves', [[block('divider')], [block('text', { body: 'second' })], [block('text', { body: 'third' })]]);
  const markup = htmlOf(renderSection(crowded, ctxFor(registry, 'view')));
  assert.equal((markup.match(/data-ui-cell=/g) || []).length, 2);
  assert.match(markup, /data-ui-cell="1">.*second.*third.*<\/div><\/section>$/);
  const stack = htmlOf(renderPage(page([{ id: 's-000099', type: 'stack', cells: [{ blocks: [block('divider')] }, { blocks: [block('divider')] }] }]), ctxFor(registry, 'view')));
  assert.equal((stack.match(/<hr>/g) || []).length, 2, 'a one-column section shows the blocks of every cell');
  assert.ok(stack.includes('<section class="ocs__stack" data-ui-node="s-000099" data-ui-kind="section" data-ui-type="stack"><div data-ui-node'));
});

test('a wide page fills its layout and the page caps sections and blocks', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  assert.ok(pageHTML(page([], { width: 'wide' }), registry, 'view').startsWith('<article class="ocs__container ocs__container--fill ocs__stack" data-ui-page>'));
  const many = page(Array.from({ length: registry.limits.sections + 3 }, () => stack([block('divider')])));
  assert.equal((pageHTML(many, registry, 'view').match(/data-ui-kind="section"/g) || []).length, registry.limits.sections);
  const crowded = page([stack(Array.from({ length: registry.limits.blocks_per_section + 5 }, () => block('divider')))]);
  assert.equal((pageHTML(crowded, registry, 'view').match(/<hr>/g) || []).length, registry.limits.blocks_per_section);
});

test('hidden sections and blocks show only in the canvas, marked data-ui-hidden', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const doc = page([stack([block('heading', { text: 'Shown' }), block('heading', { text: 'Secret block' }, { hidden: true })]), stack([block('heading', { text: 'Secret section' })], { hidden: true })]);
  for (const mode of ['view', 'export']) {
    const markup = pageHTML(doc, registry, mode);
    assert.ok(markup.includes('Shown'));
    assert.ok(!markup.includes('Secret') && !markup.includes('data-ui-hidden'), mode);
  }
  const canvas = pageHTML(doc, registry, 'canvas');
  assert.match(canvas, /<div data-ui-node="b-\d+" data-ui-kind="block" data-ui-type="heading" data-ui-hidden><h2 class="ocs__section-title">Secret block/);
  assert.match(canvas, /<section class="ocs__stack" data-ui-node="s-\d+" data-ui-kind="section" data-ui-type="stack" data-ui-hidden>/);
});

test('a failing block shows a notice in the canvas and is left out of published pages', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const errors = [];
  const renderers = {
    ...contentRenderers,
    hero: () => { throw new Error('renderer bug'); },
    card: () => h('div', null, rich('needs a hook')),
  };
  const doc = page([stack([block('hero', { title: 'x' }), block('card', { title: 'y' }), block('heading', { text: 'Still here' }), block('nope'), block('image', {})])]);
  const extra = { renderers, onError: (error, node) => errors.push([error.message, node.type]) };
  const view = toHTML(renderPage(doc, ctxFor(registry, 'view', extra)));
  assert.ok(view.includes('Still here'));
  assert.ok(!/data-ui-type="(?:hero|card|nope|image)"/.test(view), 'failed, unknown and empty blocks are left out');
  assert.deepEqual(errors.map(([, type]) => type), ['hero', 'card']);
  assert.match(errors[0][0], /renderer bug/);
  assert.match(errors[1][0], /sanitizeRich hook/);
  const canvas = toHTML(renderPage(doc, ctxFor(registry, 'canvas', extra)));
  const notice = say(registry, 'blocks.block_error');
  assert.ok(canvas.includes(`data-ui-type="hero" data-ui-error><div class="ocs__callout">${notice}</div></div>`));
  assert.ok(canvas.includes(`data-ui-type="card" data-ui-error><div class="ocs__callout">${notice}</div></div>`));
  assert.ok(canvas.includes(say(registry, 'blocks.unknown_block', { type: 'nope' })));
  assert.match(canvas, /data-ui-type="image" data-ui-empty><p class="ocs__text">Image<\/p><\/div>/);
  assert.throws(() => toHTML(renderPage(doc, ctxFor(registry, 'view', { renderers: { ...renderers, hero: contentRenderers.hero } })), { strict: true }), /sanitizeRich hook/, 'strict mode still surfaces the error');
});

test('videos and embeds are click-to-load cards with a validated address', needsRuby, () => {
  const registry = loadRegistry();
  const { block } = builder();
  const one = (type, settings, mode = 'view', extra) => htmlOf(renderBlock(block(type, settings), ctxFor(registry, mode, extra)));
  const nocookie = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ';
  const play = say(registry, 'blocks.video_play');
  assert.ok(one('video', SAMPLES.video).includes(`<section class="ocs__card" data-ui-embed="video"><div class="ocs__card-header"><h3 class="ocs__section-title">Demo</h3><strong class="ocs__status">www.youtube-nocookie.com</strong></div>`
    + `<p class="ocs__text">Two minutes</p><div class="ocs__links"><button type="button" class="ocs__btn accent fill" data-ui-embed-kind="video" data-ui-embed-src="${nocookie}" data-ui-embed-title="Demo">${play}</button></div></section>`));
  assert.ok(one('video', SAMPLES.video, 'export').includes(`<a class="ocs__btn accent fill" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="${NEW_TAB_REL}" title="www.youtube.com">${play}</a>`));
  assert.ok(!one('video', SAMPLES.video, 'export').includes('data-ui-embed'));
  assert.ok(one('video', { url: 'https://vimeo.com/1', title: 'Elsewhere' }).includes(say(registry, 'blocks.embed_new_tab', { host: 'vimeo.com' })));
  assert.ok(one('video', { url: 'https://vimeo.com/1', title: 'Elsewhere' }, 'canvas').includes(say(registry, 'blocks.video_unsupported')));
  assert.equal(one('video', { url: 'javascript:alert(1)', title: 'x' }), '', 'nothing to show on a published page');

  const app = one('embed', SAMPLES.embed);
  assert.ok(app.includes('data-ui-embed="app"'));
  assert.ok(app.includes(`data-ui-embed-kind="app" data-ui-embed-src="https://ada.github.io/flood/" data-ui-embed-title="Flood app" data-ui-embed-height="tall">${say(registry, 'blocks.embed_open')}</button>`));
  const team = one('embed', { url: 'https://team.opencodingsociety.com/app', title: 'Team app' });
  assert.ok(team.includes(say(registry, 'blocks.embed_ocs_host', { host: 'team.opencodingsociety.com' })));
  assert.ok(team.includes(`<a class="ocs__btn" href="https://team.opencodingsociety.com/app" target="_blank" rel="${NEW_TAB_REL}" title="team.opencodingsociety.com">${say(registry, 'blocks.embed_new_tab', { host: 'team.opencodingsociety.com' })}</a>`));
  assert.ok(!team.includes('data-ui-embed-src'));
  assert.ok(one('embed', { url: `${ORIGIN}/x`, title: 'Us' }).includes(say(registry, 'blocks.embed_blocked')));
  assert.ok(one('embed', { url: 'https://evil.example/', title: 'x' }, 'view', { blockedHosts: ['evil.example'] }).includes(say(registry, 'blocks.embed_blocked')));
  assert.ok(one('embed', { url: 'http://ada.github.io/', title: 'x' }, 'canvas').includes(say(registry, 'errors.embed_https')));
  assert.equal(one('embed', { url: 'http://ada.github.io/', title: 'x' }), '');
  const exported = one('embed', SAMPLES.embed, 'export');
  assert.ok(exported.includes(`href="https://ada.github.io/flood/" target="_blank"`) && !exported.includes('<button'));
});

test('embedFrame checks the address again and uses the fixed sandbox', needsRuby, () => {
  const registry = loadRegistry();
  const ctx = ctxFor(registry, 'view');
  const nocookie = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=90';
  assert.equal(htmlOf(embedFrame({ kind: 'video', src: nocookie, title: 'Demo' }, ctx)),
    `<iframe class="ocs__embed ocs__embed--video" title="Demo" sandbox="${SANDBOX}" allow="fullscreen; picture-in-picture; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" src="${nocookie}"></iframe>`);
  assert.equal(htmlOf(embedFrame({ kind: 'app', src: 'https://ada.github.io/flood/', title: 'App', height: 'tall' }, ctx)),
    `<iframe class="ocs__embed ocs__embed--tall" title="App" sandbox="${SANDBOX}" allow="fullscreen" referrerpolicy="no-referrer" loading="lazy" src="https://ada.github.io/flood/"></iframe>`);
  assert.match(htmlOf(embedFrame({ kind: 'app', src: 'https://ada.github.io/', height: 'huge' }, ctx)), /ocs__embed--medium/);
  for (const bad of [
    { kind: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }, { kind: 'video', src: 'https://evil.example/embed/dQw4w9WgXcQ' },
    { kind: 'app', src: 'https://team.opencodingsociety.com/' }, { kind: 'app', src: `${ORIGIN}/` }, { kind: 'app', src: 'javascript:alert(1)' },
    { kind: 'app', src: '/same-origin/' }, { kind: 'script', src: 'https://ada.github.io/' }, {},
  ]) {
    assert.equal(embedFrame(bad, ctx), null, JSON.stringify(bad));
  }
});

test('live blocks render the shared card; the canvas fills it with a sample', needsRuby, () => {
  const registry = loadRegistry();
  const { block } = builder();
  const one = (type, settings, mode) => htmlOf(renderBlock(block(type, settings), ctxFor(registry, mode, { pageSettings: { course: 'csp' } })));
  assert.match(one('chat', SAMPLES.chat, 'view'), new RegExp(`<section class="ocs__card" data-ui-live="chat"><div class="ocs__card-header"><h3 class="ocs__section-title">Team chat</h3></div>`
    + `<div data-ui-live-status role="status" id="ui-live-status-b-[a-z0-9]+">${say(registry, 'blocks.live_loading')}</div><div data-ui-live-mount></div></section>`));
  assert.ok(one('members', SAMPLES.members, 'view').includes(`<h3 class="ocs__section-title">${defOf(registry, 'block', 'members').label}</h3>`), 'an empty title falls back to the block name');
  // The kanban and calendar owners draw a card of their own: no card around it, and the title in a
  // plain wrapper that blocks-live.js hides once that card is in.
  for (const type of ['kanban', 'calendar']) {
    assert.match(one(type, SAMPLES[type], 'view'), new RegExp(`<section data-ui-live="${type}"><div data-ui-live-header><div class="ocs__card-header"><h3 class="ocs__section-title">${SAMPLES[type].title}</h3></div></div>`
      + `<div data-ui-live-status role="status" id="ui-live-status-b-[a-z0-9]+">${say(registry, 'blocks.live_loading')}</div><div data-ui-live-mount></div></section>`), type);
    assert.match(one(type, SAMPLES[type], 'canvas'), new RegExp(`<section class="ocs__card" data-ui-live="${type}"><div class="ocs__card-header">`), `${type}: the canvas sample keeps its card`);
  }
  const sample = (type, settings) => one(type, settings, 'canvas');
  assert.match(sample('chat', SAMPLES.chat), new RegExp(`<div data-ui-live-status role="status" id="ui-live-status-b-[a-z0-9]+"></div><div data-ui-live-mount><p class="ocs__text">${say(registry, 'blocks.sample_chat', { group: 'Binary Beasts' })}</p></div>`));
  assert.ok(sample('chat', { group: null }).includes(say(registry, 'blocks.sample_no_group')));
  assert.ok(sample('members', SAMPLES.members).includes(say(registry, 'blocks.sample_members', { group: 'Binary Beasts' })));
  assert.ok(sample('message_me', SAMPLES.message_me).includes('<button type="button" class="ocs__btn accent fill" tabindex="-1">Ask us</button>'));
  assert.ok(sample('message_me', {}).includes(`>${defOf(registry, 'block', 'message_me').fields.find((f) => f.id === 'label').default}</button>`));
  assert.ok(sample('kanban', SAMPLES.kanban).includes(say(registry, 'blocks.sample_kanban', { host: 'github.com' })));
  assert.ok(sample('kanban', { url: '' }).includes(say(registry, 'errors.kanban_bad_url')));
  assert.ok(sample('feedback', SAMPLES.feedback).includes('<p class="ocs__text">What next?</p>'));
  assert.ok(sample('api_data', SAMPLES.api_data).includes(say(registry, 'blocks.sample_api_data', { host: 'flask.opencodingsociety.com' })));
  assert.ok(sample('api_data', { source: null }).includes(say(registry, 'blocks.sample_no_source')));
  for (const type of ['announcements', 'calendar']) {
    const key = `blocks.sample_${type}`;
    const expected = textOf(registry, key) === key ? defOf(registry, 'block', type).help : textOf(registry, key, { course: 'Computer Science Principles' });
    assert.ok(sample(type, SAMPLES[type]).includes(escapeHTML(expected)), type);
  }
  assert.ok(Array.isArray(designSample('feedback', null, ctxFor(registry, 'canvas'))));
});
