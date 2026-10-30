import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { blockHTML, frontMatterText, pageToJSON, pageToMarkdown } from '../js/export.js';
import { contentRenderers } from '../js/blocks-content.js';
import { defOf, textOf } from '../js/registry.js';
import { suggestSlug } from '../js/url-rules.js';
import { escapeHTML } from '../js/vnode.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

const ORIGIN = 'https://pages.opencodingsociety.com';
const char = (code) => String.fromCharCode(code);
const sanitizeRich = (raw) => String(raw).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

// Stands in for kanban-board.js parseBoardUrl(url)?.url: the canonical board address or null.
function kanbanCanonicalUrl(url) {
  const match = /^https:\/\/github\.com\/(?:(orgs)\/([A-Za-z0-9-]+)\/projects\/(\d+)(?:\/\S*)?|([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)\/issues\/?)$/.exec(url);
  if (!match) return null;
  return match[1] ? `https://github.com/orgs/${match[2]}/projects/${match[3]}` : `https://github.com/${match[4]}/${match[5]}/issues`;
}

const ctxFor = (registry, extra = {}) => ({
  registry, baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers, sanitizeRich, strict: true,
  validators: { kanbanCanonicalUrl }, ...extra,
});

function builder() {
  const ids = counterIds();
  const block = (type, settings = {}, extra = {}) => ({ id: ids('b'), type, settings, hidden: false, ...extra });
  const stack = (blocks, extra = {}) => ({ id: ids('s'), type: 'stack', settings: {}, hidden: false, cells: [{ blocks }], ...extra });
  const page = (sections, settings = {}) => ({ schemaVersion: 1, kind: 'ocs-ui-page', page: { title: 'Flood Watch', description: 'Maps', byline: '', course: 'csp', width: 'contained', image: '', ...settings }, sections });
  return { block, stack, page };
}

function split(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'the file starts with front matter');
  return { frontMatter: match[1], body: match[2] };
}

// Parsed with Ruby's YAML, the parser Jekyll uses.
function parseFrontMatter(markdown) {
  const { frontMatter } = split(markdown);
  return JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.safe_load($stdin.read))'], { input: frontMatter, encoding: 'utf8' }));
}

// Every {{ or {% left in the body, which must all be the generated include tags.
const liquidIn = (body) => body.match(/\{[{%][^}]*[}%]\}/g) || [];

test('pageToJSON writes pretty JSON in a stable key order', () => {
  const page = {
    sections: [{ cells: [{ blocks: [{ settings: { lead: 'b', title: 'a', badge: 'c' }, hidden: false, type: 'hero', id: 'b-000002' }] }], hidden: false, settings: {}, type: 'stack', id: 's-000001' }],
    page: { image: '', width: 'contained', course: 'csp', byline: '', description: '', title: 'Flood Watch' },
    kind: 'ocs-ui-page',
    schemaVersion: 1,
  };
  const text = pageToJSON(page);
  assert.ok(text.endsWith('}\n'));
  assert.deepEqual(JSON.parse(text), page);
  const parsed = JSON.parse(text);
  assert.deepEqual(Object.keys(parsed), ['schemaVersion', 'kind', 'page', 'sections']);
  assert.deepEqual(Object.keys(parsed.page), ['title', 'description', 'byline', 'course', 'width', 'image']);
  assert.deepEqual(Object.keys(parsed.sections[0]), ['id', 'type', 'settings', 'hidden', 'cells']);
  assert.deepEqual(Object.keys(parsed.sections[0].cells[0].blocks[0]), ['id', 'type', 'settings', 'hidden']);
  assert.deepEqual(Object.keys(parsed.sections[0].cells[0].blocks[0].settings), ['title', 'badge', 'lead']);
  assert.match(text, /^\{\n {2}"schemaVersion": 1,\n {2}"kind": "ocs-ui-page",/);
  const reordered = JSON.parse(JSON.stringify({ schemaVersion: 1, kind: 'ocs-ui-page', sections: page.sections, page: page.page }));
  assert.equal(pageToJSON(reordered), text, 'the same page gives the same file');
  const withProto = JSON.parse('{"schemaVersion":1,"__proto__":{"polluted":true},"kind":"ocs-ui-page"}');
  const out = JSON.parse(pageToJSON(withProto));
  assert.ok(Object.prototype.hasOwnProperty.call(out, '__proto__'), 'a __proto__ key stays plain data');
  assert.equal({}.polluted, undefined);
});

test('front matter values stay one quoted YAML string whatever the title holds', needsRuby, () => {
  const registry = loadRegistry();
  const { page } = builder();
  const title = `Flood: Watch # [beta] {x} {{ site.x }} "quoted" \\ back\nlayout: evil${char(0x2028)}permalink: /x/${char(0x85)}${char(13)}end${char(0x7f)}${char(0xd800)}`;
  const description = `- item\n---\nlayout: evil ${char(0x2029)}${char(0x9b)}tail${char(0xfeff)}`;
  const markdown = pageToMarkdown(page([], { title, description }), ctxFor(registry));
  const data = parseFrontMatter(markdown);
  assert.deepEqual(Object.keys(data), ['layout', 'title', 'description', 'permalink']);
  assert.equal(data.layout, 'opencs');
  assert.equal(data.title, 'Flood: Watch # [beta] {x} {{ site.x }} "quoted" \\ back layout: evil permalink: /x/ end');
  assert.equal(data.description, '- item --- layout: evil tail');
  assert.equal(data.permalink, `/student-pages/${suggestSlug(data.title)}/`);
  assert.equal(split(markdown).frontMatter.split('\n').length, 4, 'one line per key');
  assert.equal(frontMatterText(42), '');
  assert.equal(frontMatterText(`a${char(0xd83d)}${char(0xde00)}b`), `a${char(0xd83d)}${char(0xde00)}b`, 'surrogate pairs (emoji) are kept');
});

test('the permalink uses the published slug when it is valid, else one made from the title', needsRuby, () => {
  const registry = loadRegistry();
  const { page } = builder();
  const permalink = (extra, settings) => parseFrontMatter(pageToMarkdown(page([], settings), ctxFor(registry, extra))).permalink;
  assert.equal(permalink({ slug: 'binary-beasts' }), '/student-pages/binary-beasts/');
  for (const slug of ['admin', '../etc', 'A', 'x"y', 42, '']) assert.equal(permalink({ slug }), '/student-pages/flood-watch/', String(slug));
  assert.equal(permalink({}, { title: '!!!' }), '/student-pages/my-page/');
  assert.equal(permalink({}, { title: '' }), `/student-pages/${suggestSlug(textOf(registry, 'blocks.untitled'))}/`);
});

test('the permalink carries a one-line YAML comment from the registry', needsRuby, () => {
  const registry = loadRegistry();
  const { page } = builder();
  const withNote = { ...registry, text: { ...registry.text, editor: { export_permalink_note: 'Check no other page uses this address.\nlayout: evil' } } };
  const markdown = pageToMarkdown(page([]), ctxFor(withNote));
  assert.ok(split(markdown).frontMatter.endsWith('permalink: "/student-pages/flood-watch/" # Check no other page uses this address. layout: evil'));
  assert.equal(parseFrontMatter(markdown).layout, 'opencs', 'the comment never becomes a key');
});

test('the body is the export render: hidden nodes out, every brace escaped', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const evil = '{% include evil.html %} {{ site.github }} }}{{';
  const doc = page([
    stack([block('hero', { title: evil, badge: evil, lead: evil, links: [{ label: evil, url: 'https://example.com/{{x}}' }] }), block('text', { body: `<b>${evil}</b>` }),
      block('heading', { text: 'Secret' }, { hidden: true }), block('table', { data: `${evil} | b` }), block('code', { code: evil })]),
    stack([block('heading', { text: 'Secret too' })], { hidden: true }),
  ]);
  const { body } = split(pageToMarkdown(doc, ctxFor(registry)));
  assert.deepEqual(liquidIn(body), []);
  assert.ok(!/[{}]/.test(body), 'no brace survives');
  assert.ok(body.startsWith('<article class="ocs__container ocs__stack" data-ui-page>'), 'Markdown keeps one HTML block as it is');
  assert.ok(body.endsWith('</article>\n'));
  assert.ok(!body.includes('Secret'));
  assert.ok(body.includes('&#123;% include evil.html %&#125;'));
  assert.ok(body.includes('href="https://example.com/%7B%7Bx%7D%7D"'), 'URLs are normalized and percent-encoded');
});

test('kanban boards become an include built only from validated values', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const body = (settings, extra) => split(pageToMarkdown(page([stack([block('kanban', settings)])]), ctxFor(registry, extra))).body;
  const note = `<!-- ${escapeHTML(textOf(registry, 'blocks.needs_live_viewer', { label: defOf(registry, 'block', 'kanban').label }))} -->`;

  const board = body({ url: 'https://github.com/orgs/UGRC-CSA/projects/1/views/2', filter: 'Team', title: 'Our board {{ x }}' });
  assert.ok(board.includes('<h3 class="ocs__section-title">Our board &#123;&#123; x &#125;&#125;</h3>{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="Team" %}'));
  assert.deepEqual(liquidIn(board), ['{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="Team" %}']);
  assert.ok(body({ url: 'https://github.com/ada/flood-watch/issues', filter: '' }).includes('{% include ocs_kanban_board.html url="https://github.com/ada/flood-watch/issues" %}'));
  for (const filter of ['Team" title="{{ evil }}', 'x'.repeat(41), 'a%}b', 'Team\nx', { name: 'Team' }, ['Team']]) {
    const out = body({ url: 'https://github.com/orgs/UGRC-CSA/projects/1', filter });
    assert.deepEqual(liquidIn(out), ['{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" %}'], JSON.stringify(filter));
  }
  // Numbers are text everywhere a string is expected, and "42" is a plain value.
  assert.deepEqual(liquidIn(body({ url: 'https://github.com/orgs/UGRC-CSA/projects/1', filter: 42 })), ['{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="42" %}']);
  for (const url of ['https://github.com/users/x', 'https://evil.example/orgs/x/projects/1', 'javascript:alert(1)', '', '{% include x.html %}']) {
    const out = body({ url, title: 'T' });
    assert.ok(out.includes(note), url);
    assert.deepEqual(liquidIn(out), [], url);
  }
  assert.ok(body({ url: 'https://github.com/orgs/a/projects/1' }, { validators: {} }).includes(note), 'no validator, no include');
  const lying = { validators: { kanbanCanonicalUrl: () => 'https://github.com/x" onload="y' } };
  assert.deepEqual(liquidIn(body({ url: 'https://github.com/orgs/a/projects/1' }, lying)), [], 'a validator result is checked again');
});

test('the real kanban-board.js validator gives the same canonical address', needsRuby, async (t) => {
  let parseBoardUrl;
  try {
    ({ parseBoardUrl } = await import(new URL('../../../../assets/js/kanban-board.js', import.meta.url)));
  } catch (error) {
    t.skip(`assets/js/kanban-board.js did not load in Node: ${error.message}`);
    return;
  }
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const validators = { kanbanCanonicalUrl: (url) => parseBoardUrl(url)?.url ?? null };
  for (const url of ['https://github.com/orgs/UGRC-CSA/projects/1', 'https://github.com/ada/flood-watch/issues/']) {
    const { body } = split(pageToMarkdown(page([stack([block('kanban', { url })])]), ctxFor(registry, { validators })));
    assert.deepEqual(liquidIn(body), [`{% include ocs_kanban_board.html url="${kanbanCanonicalUrl(url)}" %}`], url);
  }
});

test('calendars become an include with a registry course code or "all"', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const includes = (settings, pageCourse) => liquidIn(split(pageToMarkdown(page([stack([block('calendar', settings)])], { course: pageCourse }), ctxFor(registry))).body);
  const tag = (course) => [`{% include ocs_calendar_card.html course="${course}" %}`];
  assert.deepEqual(includes({ course: 'csa' }, 'csp'), tag('csa'));
  assert.deepEqual(includes({ course: '' }, 'csp'), tag('csp'), 'empty means the page course');
  assert.deepEqual(includes({ course: '' }, ''), tag('all'));
  for (const course of ['csp" sample="true', 'CSP', 'all', 'nope', '{{ x }}', 7, null]) assert.deepEqual(includes({ course }, 'csh'), tag('csh'), String(course));
  assert.deepEqual(includes({ course: 'nope' }, 'nope'), tag('all'));
  const { body } = split(pageToMarkdown(page([stack([block('calendar', { course: 'csa', title: 'Class <calendar>' })])]), ctxFor(registry)));
  assert.ok(body.includes('<h3 class="ocs__section-title">Class &lt;calendar&gt;</h3>{% include ocs_calendar_card.html course="csa" %}'), 'the title is a heading, never a parameter');
});

test('every other live block exports the registry note, and embeds export as links', needsRuby, () => {
  const registry = loadRegistry();
  const { block, stack, page } = builder();
  const others = ['chat', 'members', 'message_me', 'feedback', 'announcements', 'api_data'];
  const blocks = others.map((type) => block(type, { title: 'Live {{ x }}', group: { id: 1, name: 'G' }, url: 'https://x.example/' }));
  const { body } = split(pageToMarkdown(page([stack([...blocks, block('video', { url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Demo' }), block('embed', { url: 'https://ada.github.io/app/', title: 'App' })])]), ctxFor(registry)));
  for (const type of others) {
    const note = escapeHTML(textOf(registry, 'blocks.needs_live_viewer', { label: defOf(registry, 'block', type).label }));
    assert.ok(body.includes(`data-ui-type="${type}"><!-- ${note} --></div>`), type);
  }
  assert.ok(!body.includes('Live'), 'live titles are not exported for blocks that need the viewer');
  assert.ok(!body.includes('data-ui-embed') && !body.includes('<button') && !body.includes('<iframe'));
  assert.ok(body.includes('href="https://youtu.be/dQw4w9WgXcQ"'));
  assert.ok(body.includes('href="https://ada.github.io/app/"'));
  assert.deepEqual(liquidIn(body), []);
});

test('blockHTML shows one block as the page file would, hidden or not', needsRuby, () => {
  const registry = loadRegistry();
  const { block } = builder();
  const hidden = block('heading', { text: 'Draft {{ x }}' }, { hidden: true });
  assert.equal(blockHTML(hidden, ctxFor(registry)), `<div data-ui-node="${hidden.id}" data-ui-kind="block" data-ui-type="heading"><h2 class="ocs__section-title">Draft &#123;&#123; x &#125;&#125;</h2></div>`);
  const calendar = block('calendar', { course: '' });
  assert.ok(blockHTML(calendar, ctxFor(registry, { pageSettings: { course: 'csa' } })).includes('{% include ocs_calendar_card.html course="csa" %}'));
  assert.equal(blockHTML(null, ctxFor(registry)), '');
  assert.throws(() => blockHTML(hidden, {}), /ctx\.registry is required/);
  assert.throws(() => pageToMarkdown({}, null), /ctx\.registry is required/);
});

test('every template exports to a page file that parses', needsRuby, () => {
  const registry = loadRegistry();
  for (const template of registry.templates) {
    const markdown = pageToMarkdown(template.page, ctxFor(registry));
    const data = parseFrontMatter(markdown);
    assert.equal(data.title, template.page.page.title, template.key);
    for (const tag of liquidIn(split(markdown).body)) assert.match(tag, /^\{% include ocs_(?:kanban_board|calendar_card)\.html /, template.key);
  }
});
