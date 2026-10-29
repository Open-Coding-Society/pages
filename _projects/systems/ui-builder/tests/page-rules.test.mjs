import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defOf, textOf } from '../js/registry.js';
import { tableRows, validatePage, validateSettings } from '../js/page-model.js';
import { loadRegistry, needsRuby } from './helpers.mjs';

const SITE = { baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' };
const FIXTURES = fileURLToPath(new URL('./fixtures/specs/', import.meta.url));

// A raw page with one One column section holding `blocks` (each [type, settings, extra]).
function pageOf(blocks, { page = {}, sections } = {}) {
  return {
    schemaVersion: 1,
    kind: 'ocs-ui-page',
    page: { title: 'Test page', description: '', byline: '', course: '', width: 'contained', image: '', ...page },
    sections: sections || [{
      id: 's-000001', type: 'stack', settings: {}, hidden: false,
      cells: [{ blocks: blocks.map(([type, settings, extra = {}], index) => ({ id: `b-${String(index + 1).padStart(6, '0')}`, type, settings, hidden: false, ...extra })) }],
    }],
  };
}

const keysOf = (issues) => issues.map((issue) => `${issue.field}:${issue.key}`);
const check = (type, settings, options = {}) => keysOf(validateSettings(defOf(loadRegistry(), 'block', type), settings, loadRegistry(), { type, ...SITE, ...options }));

function fixtures(dir) {
  return readdirSync(`${FIXTURES}${dir}`).filter((name) => name.endsWith('.json')).sort()
    .map((name) => ({ name, page: JSON.parse(readFileSync(`${FIXTURES}${dir}/${name}`, 'utf8')) }));
}

test('the shared and client valid fixtures pass as drafts and as published pages', needsRuby, () => {
  const registry = loadRegistry();
  const valid = [...fixtures('valid'), ...fixtures('client/valid')];
  assert.ok(valid.some((f) => f.name === 'all-blocks.json'));
  for (const { name, page } of valid) {
    assert.deepEqual(validatePage(page, registry, SITE), [], name);
    assert.deepEqual(validatePage(page, registry, { ...SITE, publish: true }), [], `${name} published`);
  }
});

test('the all-blocks fixture uses every block, both frames and every column layout', needsRuby, () => {
  const registry = loadRegistry();
  const page = JSON.parse(readFileSync(`${FIXTURES}valid/all-blocks.json`, 'utf8'));
  const types = new Set(page.sections.flatMap((s) => s.cells.flatMap((c) => c.blocks.map((b) => b.type))));
  assert.deepEqual([...types].sort(), Object.keys(registry.blocks).sort());
  assert.deepEqual(new Set(page.sections.map((s) => s.type)), new Set(['stack', 'columns']));
  assert.deepEqual(new Set(page.sections.filter((s) => s.type === 'columns').map((s) => s.settings.layout)), new Set(['halves', 'thirds', 'sidebar_left', 'sidebar_right']));
});

// Spring's fixtures (copied byte for byte) and the client's own; the key is what this validator reports.
const BROKEN = {
  'backslash-site-path.json': 'bad_url', 'bad-id.json': 'bad_id', 'body-script.json': 'bad_body', 'depth-13.json': 'too_deep',
  'duplicate-id.json': 'duplicate_id', 'html-key.json': 'bad_key', 'javascript-link.json': 'bad_url',
  'loopback-url-on-publish.json': 'policy_loopback_view', 'on-key.json': 'bad_key', 'snapshot-extra-key.json': 'bad_snapshot',
  'too-many-sections.json': 'too_many_sections', 'userinfo-url.json': 'bad_url', 'wrong-kind.json': 'bad_page',
  'dot-segment-link.json': 'bad_url', 'dot-segment-encoded-link.json': 'bad_url', 'https-typo-image.json': 'bad_image',
  'userinfo-empty-host-link.json': 'bad_url', 'rich-text-quoted-gt.json': 'bad_body', 'long-gallery-image.json': 'too_long', 'blank-long-gallery-image.json': 'too_long',
  'rich-text-tel-link.json': 'bad_body', 'rich-text-noscript.json': 'bad_body', 'rich-text-unknown-attribute.json': 'bad_body',
  'bad-api-path.json': 'bad_api_path', 'bad-envelope.json': 'bad_page', 'bad-type.json': 'unknown_type', 'data-image.json': 'bad_image',
  'handler-in-body.json': 'bad_body', 'http-link.json': 'bad_url', 'javascript-in-body.json': 'bad_body', 'long-title.json': 'too_long',
  'mailto-outside-links.json': 'bad_url', 'protocol-relative-link.json': 'bad_url', 'too-many-blocks.json': 'too_many_blocks',
  'too-many-cells.json': 'bad_cells', 'too-many-live.json': 'too_many_live',
  'https-loopback-link-on-publish.json': 'loopback_link', 'https-loopback-image-on-publish.json': 'loopback_link',
  'rich-text-loopback-link-on-publish.json': 'loopback_link', 'rich-text-padded-reference.json': 'bad_body',
  'rich-text-padded-loopback-on-publish.json': 'loopback_link', 'ipv6-mapped-loopback-link-on-publish.json': 'loopback_link',
};

test('every invalid fixture fails for its own rule; *-on-publish files are valid drafts', needsRuby, () => {
  const registry = loadRegistry();
  const invalid = [...fixtures('invalid'), ...fixtures('client/invalid')];
  assert.ok(invalid.length >= 13);
  for (const { name, page } of invalid) {
    const published = validatePage(page, registry, { ...SITE, publish: true }).map((issue) => issue.key);
    const draft = validatePage(page, registry, SITE).map((issue) => issue.key);
    if (BROKEN[name]) assert.ok(published.includes(BROKEN[name]), `${name}: ${published}`);
    else assert.ok(published.length > 0, `${name} (a new Spring fixture) must fail`);
    if (name.endsWith('-on-publish.json')) assert.deepEqual(draft, [], `${name} is a valid draft`);
    else assert.deepEqual(draft, published, `${name} fails the same way as a draft`);
  }
});

test('text fields: required, one line, length from the field or the registry default', needsRuby, () => {
  const registry = loadRegistry();
  assert.deepEqual(check('hero', { title: '' }), ['title:required']);
  assert.deepEqual(check('hero', { title: '   ' }), ['title:required']);
  assert.deepEqual(check('hero', { title: 'a\nb' }), ['title:one_line']);
  for (const code of [0x0d, 0x0b, 0x85, 0x2028, 0x2029]) {
    assert.deepEqual(check('hero', { title: `a${String.fromCharCode(code)}b` }), ['title:one_line'], code.toString(16));
  }
  assert.deepEqual(check('hero', { title: 'x'.repeat(121) }), ['title:too_long']);
  assert.deepEqual(check('hero', { title: 'x'.repeat(120), badge: 'x'.repeat(41) }), ['badge:too_long']);
  assert.deepEqual(check('hero', { title: 'ok', lead: 'line one\nline two' }), [], 'textarea allows line breaks');
  assert.deepEqual(check('hero', { title: 42 }), ['title:bad_value']);
  assert.deepEqual(check('hero', { title: ['x'] }), ['title:bad_value']);
  // Fields without max use limits.text_max.
  const field = { id: 'note', type: 'text', label: 'Note' };
  const issues = validateSettings({ fields: [field] }, { note: 'x'.repeat(registry.limits.text_max + 1) }, registry);
  assert.equal(issues[0].message, textOf(registry, 'errors.too_long', { field: 'Note', max: registry.limits.text_max }));
  assert.equal(validateSettings(defOf(registry, 'block', 'hero'), {}, registry)[0].message, 'Title is required.');
});

test('rich text: visible text for required, and the script/frame/handler rule Spring applies', needsRuby, () => {
  assert.deepEqual(check('text', { body: '<p> </p><br>&nbsp;' }), ['body:required']);
  assert.deepEqual(check('text', { body: '<p>Hi <b>there</b></p><a href="https://x.example">link</a>' }), []);
  const bad = [
    '<script>alert(1)</script>', '<SCRIPT src=x>', '< script>alert(1)</script>', '<scr\tipt>', '<iframe src=x>', '<object>', '<embed>',
    '<a href="javascript:alert(1)">x</a>', '<a href="java\tscript:alert(1)">x</a>', '<a href="java&#9;script:x">x</a>',
    '<a href="&#106;avascript:x">x</a>', '<a href="&#x6A;avascript&colon;x">x</a>', `<a href="java${String.fromCharCode(0x200b)}script:x">x</a>`,
    '<b onclick="x()">x</b>', '<img src=x onerror=alert(1)>', '<b/onmouseover=x>y</b>', "<b class='a'onclick=x>", '<b`onclick=x>',
    `<b${String.fromCharCode(0xa0)}onclick=x>`, '<p>unclosed <img src=x onerror=alert(1)',
    // Tags end where the browser ends them: a ">" in a quoted value doesn't, a stray quote opens nothing.
    '<a title=">" href="javascript:alert(1)" onclick="alert(1)">x</a>', "<a title='>' onclick=x>y</a>", '<a x"y=1 onclick=alert(1)>hi</a>',
    '<a x=="><b title=">" onclick=alert(1)>x</b>', '< x="><b title=">" onclick=alert(1)>', '<!-- a="--><b title="x>" onclick=alert(1)>',
    '<textarea><b title="</textarea><img src=x title=">" onerror=alert(1)>', '</b onclick=x>',
  ];
  for (const body of bad) assert.deepEqual(check('text', { body }), ['body:bad_body'], body);
  // Text outside tags is shown as text, as in Spring: students may write about JavaScript.
  for (const body of ['Type javascript:void(0) in the console', 'Turn onlights= on', '&lt;script&gt; is escaped', '<a href="https://x.example/?q=javascript">x</a>',
    'a < b and c > d', '<a title="x > y" href="https://x.example">ok</a>', '<!-- a note --> javascript: is a link scheme']) {
    assert.deepEqual(check('text', { body }), [], body);
  }
  assert.deepEqual(check('text', { body: 'x'.repeat(4001) }), ['body:too_long']);
  assert.deepEqual(check('callout', { body: `<p>${'x'.repeat(1994)}</p>` }), ['body:too_long'], 'the callout max is 2000');
});

// Spring parses the body with jsoup too (UiBuilderSpecRules.unsafeElements); the client mirrors
// that pass so a body it accepts is one Spring accepts. These are the cases the client used to let
// through and Spring refused: addresses whose scheme isn't http/https/mailto, the elements jsoup
// reads differently, and an attribute whose name starts with "on" even with no "=".
test('rich text: the elements and attributes Spring\'s jsoup pass refuses', needsRuby, () => {
  for (const body of ['<a href="tel:5551234">Call</a>', '<a href="sms:5551234">Text</a>', '<a href="ftp://x.example/f">File</a>',
    '<a href="vbscript:x">x</a>', '<noscript>x</noscript>', '<template>x</template>', '<math><mi>x</mi></math>', '<svg></svg>',
    '<b one>x</b>', '<a cite="urn:isbn:1">x</a>', '<img srcset="data:image/png;base64,AAAA">']) {
    assert.deepEqual(check('text', { body }), ['body:bad_body'], body);
  }
  // Everything the rich-text composer writes still passes: formatting, lists, font/size spans, links.
  for (const body of ['<b>b</b> <i>i</i> <u>u</u> <s>s</s><br><ul><li>a</li></ul><ol><li>b</li></ol>',
    '<span class="rt-font-serif">x</span> <span class="rt-size-lg">y</span> <span class="rt-font-mono rt-size-sm">z</span>',
    '<a href="https://x.example" target="_blank" rel="noopener noreferrer">x</a>', '<a href="mailto:a@b.example" target="_blank" rel="noopener noreferrer">y</a>']) {
    assert.deepEqual(check('text', { body }), [], body);
  }
});

test('url, image, choice, course, toggle and number fields', needsRuby, () => {
  const team = (url) => check('team', { items: [{ name: 'Ada', role: '', url }] });
  assert.deepEqual(team('https://github.com/ada'), []);
  assert.deepEqual(team('/csp/'), []);
  assert.deepEqual(team(''), [], 'optional links may be empty');
  for (const url of ['mailto:ada@example.com', 'http://x.example', 'javascript:alert(1)', '//evil.example', '/\\evil.example', 'https://u:p@x.example', 'ftp://x']) {
    assert.deepEqual(team(url), ['items.0.url:bad_url'], url);
  }
  assert.deepEqual(team(`https://x.example/${'a'.repeat(20000)}`), ['items.0.url:too_long']);
  const image = (src) => check('image', { src, alt: 'A river', caption: '', fit: 'cover' });
  assert.deepEqual(image('https://raw.githubusercontent.com/a/b/main/x.png'), []);
  assert.deepEqual(image('/images/x.png'), []);
  for (const src of ['data:image/png;base64,AAAA', 'http://x.example/a.png', 'blob:https://x/1', '']) {
    assert.deepEqual(image(src), [src ? 'src:bad_image' : 'src:required'], src);
  }
  assert.deepEqual(image(7), ['src:bad_value']);
  assert.deepEqual(check('image', { src: '/x.png', alt: 'x', fit: 'stretch' }), ['fit:bad_choice']);
  assert.deepEqual(check('heading', { text: 'Hi', level: 2 }), ['level:bad_choice'], 'stored choices are strings');
  assert.deepEqual(check('announcements', { course: '' }), ['course:required']);
  assert.deepEqual(check('announcements', { course: 'cs999' }), ['course:bad_choice']);
  assert.deepEqual(check('calendar', { course: '' }), [], 'empty means the page course');
  assert.deepEqual(check('checklist', { items: [{ text: 'x', done: 'yes' }] }), ['items.0.done:bad_toggle']);
  for (const limit of [0, 51, 2.5, '5', null]) assert.deepEqual(check('api_data', { source: { url: '' }, limit }).at(-1), 'limit:bad_number', String(limit));
  assert.equal(validateSettings(defOf(loadRegistry(), 'block', 'announcements'), { course: 'csp', limit: 99 }, loadRegistry())[0].message, 'How many announcements must be a whole number from 1 to 20.');
});

test('links lists: mailto allowed, every row needs a one-line label and a link', needsRuby, () => {
  assert.deepEqual(check('buttons', { links: [{ label: 'Mail', url: 'mailto:a@example.com' }, { label: 'Site', url: '/about/' }] }), []);
  assert.deepEqual(check('buttons', { links: [] }), ['links:required']);
  assert.deepEqual(check('buttons', { links: 'nope' }), ['links:bad_list']);
  assert.deepEqual(check('buttons', { links: [null, { label: '', url: '' }, { label: 'a\nb', url: 'javascript:x' }, { label: 'x'.repeat(61), url: 'https://x.example' }] }), [
    'links.0:bad_list', 'links.1.label:required', 'links.1.url:required', 'links.2.label:one_line', 'links.2.url:bad_url', 'links.3.label:too_long',
  ]);
  const five = Array.from({ length: 5 }, () => ({ label: 'x', url: 'https://x.example' }));
  assert.deepEqual(check('buttons', { links: five }), ['links:too_many']);
  assert.deepEqual(check('card', { title: 'x', links: five.slice(0, 2) }), ['links:too_many'], 'card allows one button');
});

test('items lists check every item against its item fields', needsRuby, () => {
  assert.deepEqual(check('keypoints', { items: [{ title: 'A', text: 'B' }] }), []);
  assert.deepEqual(check('keypoints', { items: [{ title: '' }, 'x', { title: 'x'.repeat(81) }] }), ['items.0.title:required', 'items.1:bad_list', 'items.2.title:too_long']);
  assert.deepEqual(check('stats', { items: Array.from({ length: 7 }, () => ({ value: '1', label: 'x' })) }), ['items:too_many']);
  assert.deepEqual(check('link_cards', { items: {} }), ['items:bad_list']);
});

test('tables: rows are non-blank lines and cells split on |, within the registry limits', needsRuby, () => {
  const { table_rows: rows, table_cols: cols } = loadRegistry().limits;
  assert.deepEqual(tableRows('A | B\n\n  \nC|D|\r\nE'), [['A', 'B'], ['C', 'D', ''], ['E']]);
  assert.deepEqual(check('table', { data: 'Name | Role\nAda | Lead' }), []);
  assert.deepEqual(check('table', { data: '' }), ['data:required']);
  assert.deepEqual(check('table', { data: Array(rows + 1).fill('a').join('\n') }), ['data:table_too_big']);
  assert.deepEqual(check('table', { data: `${Array(rows).fill('a').join('\n')}\n\n\n` }), [], 'blank lines are not rows');
  assert.deepEqual(check('table', { data: Array(cols + 1).fill('x').join('|') }), ['data:table_too_big']);
});

test('groups are null or {id, name} with a positive whole-number id', needsRuby, () => {
  assert.deepEqual(check('chat', { group: { id: 42, name: 'Binary Beasts' } }), []);
  assert.deepEqual(check('chat', { group: null }), ['group:required']);
  for (const group of [{ id: '42', name: 'x' }, { id: 0, name: 'x' }, { id: 1.5, name: 'x' }, { id: 1 }, { id: 1, name: 'a\nb' }, 'Binary Beasts', [42]]) {
    assert.deepEqual(check('chat', { group }), ['group:bad_group'], JSON.stringify(group));
  }
});

test('API sources: the link policy, mapping paths and the saved copy', needsRuby, () => {
  const registry = loadRegistry();
  const source = (extra) => ({ url: 'https://flask.opencodingsociety.com/api/jokes', list_path: '', title_path: 'joke', snapshot: { items: [], fetched_at: 0, from_loopback: false }, ...extra });
  const api = (extra, options) => check('api_data', { source: source(extra) }, options);
  assert.deepEqual(api({}), []);
  assert.deepEqual(api({ url: '' }), ['source:bad_api']);
  assert.deepEqual(check('api_data', { source: 'https://x.example' }), ['source:bad_api']);
  assert.deepEqual(api({ url: 'http://localhost:8587/api/jokes' }), [], 'drafts may read the student computer');
  assert.deepEqual(api({ url: 'http://localhost:8587/api/jokes' }, { publish: true }), ['source:policy_loopback_view']);
  assert.deepEqual(api({ url: 'http://localhost:8587/api/jokes' }, { publish: true, pageOrigin: 'http://localhost:4500' }), ['source:policy_loopback_view'], 'a local site does not unlock it for visitors');
  assert.deepEqual(api({ url: 'http://example.com/api' }), ['source:mixed_content']);
  assert.deepEqual(api({ url: 'https://10.0.0.1/api' }), ['source:policy_private_host']);
  const [issue] = validateSettings(defOf(registry, 'block', 'api_data'), { source: source({ url: 'http://example.com/api' }) }, registry, SITE);
  assert.equal(issue.message, textOf(registry, 'doctor.mixed_content'));
  assert.deepEqual(api({ title_path: 'a b', label_path: 'x'.repeat(121), image_path: 7 }), ['source.title_path:bad_api_path', 'source.image_path:bad_api_path', 'source.label_path:bad_api_path']);
  assert.deepEqual(api({ text_path: 'data.items[0].name' }), []);
  const item = { title: 'x', text: '', image: '', link: '', value: '', label: '' };
  const snapshot = (value) => api({ snapshot: value });
  assert.deepEqual(snapshot({ items: [item], fetched_at: 1, from_loopback: true }), []);
  assert.deepEqual(snapshot({ items: [{ ...item, link: 'mailto:ada@example.com' }] }), [], 'a saved copy keeps the email links the live block shows');
  const bad = [
    { items: Array(registry.limits.api_snapshot_items + 1).fill(item) }, { items: [{ ...item, title: 'x'.repeat(501) }] },
    { items: [{ ...item, email: 'a@b.c' }] }, { items: [{ ...item, value: 3 }] }, { items: [{ ...item, link: 'javascript:x' }] },
    { items: [{ ...item, image: 'http://x.example/a.png' }] }, { items: 'x' }, { fetched_at: -1 }, { from_loopback: 'yes' }, [],
    { items: Array(50).fill({ ...item, text: 'x'.repeat(480), title: 'x'.repeat(480), label: 'x'.repeat(480) }) },
  ];
  for (const value of bad) assert.deepEqual(snapshot(value), ['source.snapshot:bad_snapshot'], JSON.stringify(value).slice(0, 80));
  assert.deepEqual(api({ list_path: '.' }), [], '"The whole reply" is a path Spring accepts too');
});

// Spring's urlIssue refuses every url, src, image or link on the student's own computer once a page
// is published (loopback_url), and its imageAllowed refuses the gallery picture there even in a draft.
test('a published page refuses links and pictures on the student\'s own computer, as Spring does', needsRuby, () => {
  const registry = loadRegistry();
  const publish = { publish: true };
  const home = 'https://localhost:8443/app/';
  const both = (type, settings) => [check(type, settings), check(type, settings, publish)];
  assert.deepEqual(both('buttons', { links: [{ label: 'Try it', url: home }] }), [[], ['links.0.url:loopback_link']]);
  assert.deepEqual(both('hero', { title: 'Flood Watch', links: [{ label: 'Try it', url: 'https://team.localhost/' }] }), [[], ['links.0.url:loopback_link']]);
  assert.deepEqual(both('image', { src: 'https://127.0.0.1:4100/team.png', alt: 'Our team' }), [[], ['src:loopback_link']]);
  assert.deepEqual(both('embed', { url: 'https://[::1]:8443/', title: 'App' }), [[], ['url:loopback_link']]);
  assert.deepEqual(both('kanban', { url: 'https://0.0.0.0/board' }), [[], ['url:loopback_link']]);
  assert.deepEqual(both('link_cards', { items: [{ title: 'Docs', text: '', url: 'https://LOCALHOST./docs' }] }), [[], ['items.0.url:loopback_link']]);
  assert.deepEqual(both('team', { items: [{ name: 'Ada', role: 'Lead', url: home }] }), [[], ['items.0.url:loopback_link']]);
  assert.deepEqual(both('video', { url: home, title: 'Demo' }), [['url:video_bad_url'], ['url:loopback_link']], 'the address is the first problem');
  const [issue] = validateSettings(defOf(registry, 'block', 'image'), { src: home, alt: 'x' }, registry, { ...SITE, publish: true });
  assert.equal(issue.message, textOf(registry, 'errors.loopback_link', { field: 'Image link' }));
  // Other addresses, site paths and email links stay as they were.
  for (const url of ['https://flood.example.com/', 'https://localhost.example.com/', 'https://127.1/', '/csp/', 'mailto:team@example.com']) {
    assert.deepEqual(check('buttons', { links: [{ label: 'Go', url }] }, publish), [], url);
  }

  // The saved copy of an API block is checked the same way; the API link keeps its own rule.
  const item = { title: 'Ada', text: '', image: '', link: '', value: '', label: '' };
  const api = (items) => both('api_data', { source: { url: 'https://flask.opencodingsociety.com/api/jokes', title_path: 'joke', snapshot: { items, fetched_at: 1, from_loopback: false } } });
  assert.deepEqual(api([{ ...item, image: 'https://localhost/a.png' }]), [[], ['source.snapshot:loopback_snapshot']]);
  assert.deepEqual(api([item, { ...item, link: 'https://127.0.0.1/x' }]), [[], ['source.snapshot:loopback_snapshot']]);
  assert.deepEqual(api([{ ...item, link: 'https://flood.example.com/', image: '/images/a.png' }]), [[], []]);
  assert.deepEqual(both('api_data', { source: { url: 'https://localhost/api/jokes', title_path: 'joke' } }), [['source:policy_private_host'], ['source:policy_private_host']]);

  // The gallery picture: refused in a draft as well, with one problem either way.
  const picture = (image, options) => keysOf(validatePage(pageOf([], { page: { image } }), registry, { ...SITE, ...options }));
  assert.deepEqual(picture('https://localhost:4100/shot.png'), ['image:loopback_link']);
  assert.deepEqual(picture('https://localhost:4100/shot.png', publish), ['image:loopback_link']);
  assert.deepEqual(picture('https://flood.example.com/shot.png'), []);
  const [gallery] = validatePage(pageOf([], { page: { image: 'https://127.0.0.1/shot.png' } }), registry, SITE);
  assert.equal(gallery.message, textOf(registry, 'errors.loopback_link', { field: 'Gallery picture' }));
});

// Links and pictures inside rich text follow the same rule on publish (Spring's loopback_url for an
// href or src in a body); a draft keeps them while the team tries its app.
test('a published page refuses rich-text links to the student\'s own computer; a draft keeps them', needsRuby, () => {
  const registry = loadRegistry();
  const publish = { publish: true };
  const both = (type, body) => [check(type, { body }), check(type, { body }, publish)];
  for (const body of ['Try <a href="http://localhost:4000/">our app</a>.', '<a href="https://localhost:8443/demo">our app</a>',
    '<a href="https://127.0.0.1:4100/x" target="_blank" rel="noopener noreferrer">x</a>', '<b><a href="https://team.localhost/">x</a></b>',
    '<a href="HTTPS://LOCALHOST./">x</a>', '<a href=https://0.0.0.0/>x</a>', 'Our team <img src="https://[::1]:8443/team.png">',
    // References decoded, as a browser and Spring's jsoup decode them; every run from < to > read too, as Spring does.
    '<a href="https://local&#104;ost/">x</a>', '<a href="https://localhost:8443/?a=1&amp;b=2">x</a>', 'See <textarea><a href="https://localhost/">x</a></textarea>',
    // Named references for the punctuation of an address, which Spring's jsoup decodes too.
    '<a href="https:&sol;&sol;localhost/">x</a>', '<a href="https://127&period;0&period;0&period;1:4100/">x</a>']) {
    assert.deepEqual(both('text', body), [[], ['body:loopback_link']], body);
  }
  const [issue] = validateSettings(defOf(registry, 'block', 'callout'), { body: 'See <a href="http://localhost:4000/">it</a>' }, registry, { ...SITE, ...publish });
  assert.equal(issue.message, textOf(registry, 'errors.loopback_rich_text', { field: 'Note' }), 'the words say the link is in the text');
  // Other addresses, a loopback address outside href and src or in a comment, and one read as typed
  // with a hidden character (no address, so the page never shows it as a link) stay as they were.
  for (const body of ['<a href="https://flood.example.com/">x</a>', '<a href="https://localhost.example.com/">x</a>',
    '<a href="https://127.1/">x</a>', '<a href="mailto:team@example.com">x</a>', '<a href="/csp/">x</a>', '<a title="https://localhost/" href="https://flood.example.com/">x</a>',
    '<!-- <a href="https://localhost/">old</a> --> Our app', `<a href="https://local${String.fromCharCode(0x200b)}host/">x</a>`]) {
    assert.deepEqual(both('text', body), [[], []], body);
  }
  // One problem a field: unsafe markup and length come first.
  assert.deepEqual(both('text', '<a href="https://localhost/" onclick="x()">x</a>'), [['body:bad_body'], ['body:bad_body']]);
  assert.deepEqual(both('text', `<a href="https://localhost/">${'x'.repeat(4001)}</a>`), [['body:too_long'], ['body:too_long']]);
});

// Spring finds these with jsoup (UiBuilderSpecRules.linksToComputer); each was a body one side
// refused and the other took. A published page must be refused by both or by neither.
test('rich-text links are read as jsoup reads them, so publish agrees with Spring', needsRuby, () => {
  const S = String.fromCharCode;
  const both = (body) => [check('text', { body }), check('text', { body }, { publish: true })];
  const refused = [[], ['body:loopback_link']];
  for (const body of [
    // Every digit of a reference; windows-1252 for 128 to 159 ("…" is no hidden character).
    '<a href="https://&#00000000108;ocalhost/">x</a>', '<a href="https://&#x00000006c;ocalhost/">x</a>', '<a href="https://localhost/&#133;">x</a>',
    // A name that starts with "=", one trimmed of a control character, and a NUL that goes on the name before it.
    '<a = href="https://localhost/">x</a>', `<a ${S(1)}href="https://localhost/">x</a>`, `<a ${S(1)}href\n${S(0)}x="https://example.com/" href="https://localhost/">x</a>`,
    // Table parts inside a table, tags a select keeps or that close it, and a complete tag in a select.
    '<table><td href="https://localhost/">x</td></table>', '<table><tr><td><table></table><td src="https://localhost/x.png">x', '<select><b href="https://localhost/">x</b></select>',
    'Pick <select><input title=">" src="https://localhost/x.png"></select>', '<select><option title=">" href="https://localhost/">x</option></select>',
    // A textarea with no end tag: its text stops at the first tag. A run read like the body ("<<title"),
    // 512 attributes, and a NUL, which jsoup reads as U+FFFD.
    '<textarea><a title=">" href="https://localhost/">x</a>', '<!--<textarea><<title href="https://localhost/">x',
    `<a${' x'.repeat(511)} href="https://localhost/">x</a>`, `<a href="https://localhost/${S(0)}">x</a>`,
    // A form after a closed one, and a tag after a CDATA section (jsoup reads one up to "]]>"), after
    // a title's text cut short at its first tag, and after a style's end tag.
    '<form></form><form title=">" href="https://localhost/">x', '<![CDATA[x]]><a title=">" href="https://localhost/">x</a>',
    '<title>x</b<a title=">" href="https://localhost/">x', '<style></x </style><a title=">" href="https://localhost/">x']) {
    assert.deepEqual(both(body), refused, body);
  }
  for (const body of [
    // Names exactly as written, with their ";"; codes past U+10FFFF; 0, spaces and U+001C, which make no address.
    '<a href="https&Colon;//localhost/">x</a>', '<a href="https&COLON;//localhost/">x</a>', '<a href="https://localhost&Period;/">x</a>',
    '<a href="http://localhost&QUEST;x">x</a>', '<a href="https:&sol&sol;localhost/">x</a>', '<a href="https://local&#x110000;host/">x</a>',
    '<a href="https://localhost/&#0;">x</a>', '<a href="https://localhost/&nbsp;x">x</a>', '<a href="https://localhost/&nbsp/x">x</a>',
    '<a href="https://localhost/&ThinSpace;x">x</a>', '<a href="&#x1c;https://localhost/">x</a>',
    // The first of two hrefs, a tag the text cuts off, and tags jsoup leaves out.
    '<a href="https://example.com/" href="https://localhost/">x</a>', 'end <a href="https://localhost/"', 'end <a href="https://localhost/>x',
    `<a${S(1)}href="https://localhost/">x</a>`, '<html href="https://localhost/"><head src="https://localhost/"><body href="https://localhost/">x',
    '<frameset><frame src="https://localhost/">x', '<td href="https://localhost/">x</td>', '<table></table><tr href="https://localhost/">x',
    '<select><a title=">" href="https://localhost/">x</a></select>', `<a${' x'.repeat(512)} href="https://localhost/">x</a>`,
    '<textarea><a title=">" href="https://localhost/">x</a></textarea>', '<form><form title=">" href="https://localhost/">x',
    '<![CDATA[ > <a title=">" href="https://localhost/">x</a>',
    // An end tag's name runs to a space, "/" or ">", so "</x</style>" ends no style and "</TEXTAREA<a" is text.
    '<style></x</style><a title=">" href="https://localhost/">x', '<textarea></TEXTAREA<a title=">" href="https://localhost/">x']) {
    assert.deepEqual(both(body), [[], []], body);
  }
});

test('rich text: references in a tag are read loosely and as jsoup reads them, so Spring refuses no body the editor takes', needsRuby, () => {
  const S = String.fromCharCode;
  for (const body of ['<a href="java&#0000000115;cript:alert(1)">x</a>', '<a href="&#x000000006a;avascript:x">x</a>', '<b java&#0000000115;cript:x>x</b>',
    '<b data-java&#x000000073;cript:x>x</b>', '<b title="java&Tabscript:x">x</b>',
    '<b title="java&NewLinescript:x">x</b>', '<b title="java&nbsp;script:x">x</b>', '<a href="tel&nbsp;:1">x</a>', '<a href="&fjlig;x:1">x</a>',
    '<a href="a&plus;b:x">x</a>', `<a ${S(1)}href="tel:1">x</a>`, `<b ${S(1)}onclick>x</b>`, '<textarea><a title=">" data-x="javascript:x">']) {
    assert.deepEqual(check('text', { body }), ['body:bad_body'], body);
  }
});

test('block rules: video and embed links, and injected validators such as kanban', needsRuby, () => {
  assert.deepEqual(check('video', { url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Demo' }), []);
  assert.deepEqual(check('video', { url: 'https://vimeo.com/1', title: 'Demo' }), ['url:video_bad_url']);
  assert.deepEqual(check('embed', { url: '/my-app/', title: 'App' }), ['url:embed_https']);
  assert.deepEqual(check('embed', { url: 'https://team.opencodingsociety.com/', title: 'App' }), [], 'cookie-domain apps render a link card instead');
  const calls = [];
  const validators = { kanban: { url: (value, settings) => { calls.push([value, settings.title]); return value.includes('/users/') ? { key: 'kanban_personal', vars: { field: 'ignored' } } : null; } } };
  assert.deepEqual(check('kanban', { url: 'https://github.com/orgs/x/projects/1', title: 'Board' }, { validators }), []);
  const issues = validateSettings(defOf(loadRegistry(), 'block', 'kanban'), { url: 'https://github.com/users/ada/projects/1' }, loadRegistry(), { type: 'kanban', validators });
  assert.deepEqual(keysOf(issues), ['url:kanban_personal']);
  assert.equal(issues[0].message, textOf(loadRegistry(), 'errors.kanban_personal'));
  assert.deepEqual(check('kanban', { url: '' }, { validators }), ['url:required'], 'validators never see empty values');
  assert.deepEqual(check('kanban', { url: 'javascript:x' }, { validators }), ['url:bad_url'], 'or values that failed the type check');
  assert.deepEqual(calls, [['https://github.com/orgs/x/projects/1', 'Board'], ['https://github.com/users/ada/projects/1', undefined]]);
  assert.throws(() => check('kanban', { url: 'https://github.com/a/b/issues' }, { validators: { kanban: { url: () => 'bad' } } }), /must return null or \{key, vars\}/);
});

test('page fields and page limits', needsRuby, () => {
  const registry = loadRegistry();
  const { limits } = registry;
  assert.deepEqual(keysOf(validatePage(pageOf([], { page: { title: '', course: 'nope', width: 'huge', image: 'data:x' } }), registry, SITE)), ['title:required', 'image:bad_image', 'width:bad_choice', 'course:bad_choice']);
  // Spring strips page fields with Java's strip(), which also removes U+001C-U+001F; blank there is blank here.
  for (const title of ['\x1c', ' \x1d ', '\x1e\x1f']) {
    assert.deepEqual(keysOf(validatePage(pageOf([], { page: { title } }), registry, SITE)), ['title:required'], JSON.stringify(title));
  }
  // Length before blankness, as Spring checks: a gallery picture of 501 spaces is too long, not empty.
  assert.deepEqual(keysOf(validatePage(pageOf([], { page: { image: ' '.repeat(501) } }), registry, SITE)), ['image:too_long']);
  // Spring keeps the gallery picture in a 500-character column, so a longer link is refused, never cut.
  const picture = (length) => `https://lh3.googleusercontent.com/d/${'x'.repeat(length - 36)}`;
  assert.deepEqual(keysOf(validatePage(pageOf([], { page: { image: picture(500) } }), registry, SITE)), []);
  const [tooLong] = validatePage(pageOf([], { page: { image: picture(501) } }), registry, SITE);
  assert.deepEqual([tooLong.field, tooLong.key], ['image', 'too_long']);
  assert.equal(tooLong.message, 'Gallery picture can be at most 500 characters.');
  const sections = (count) => Array.from({ length: count }, (_, i) => ({ id: `s-${String(i + 1).padStart(6, '0')}`, type: 'stack', settings: {}, hidden: false, cells: [{ blocks: [] }] }));
  assert.deepEqual(keysOf(validatePage(pageOf([], { sections: sections(limits.sections) }), registry)), []);
  assert.deepEqual(keysOf(validatePage(pageOf([], { sections: sections(limits.sections + 1) }), registry)), ['null:too_many_sections']);
  const dividers = Array.from({ length: limits.blocks_per_section + 1 }, () => ['divider', {}]);
  assert.deepEqual(keysOf(validatePage(pageOf(dividers), registry)), ['null:too_many_blocks']);
  const live = Array.from({ length: limits.live_blocks + 1 }, (_, i) => ['message_me', { label: 'Hi', note: '' }, { hidden: i === 0 }]);
  const issues = validatePage(pageOf(live), registry);
  assert.deepEqual(keysOf(issues), ['null:too_many_live'], 'hidden live blocks count: drafts save them');
  assert.equal(issues[0].message, textOf(registry, 'errors.too_many_live', { max: limits.live_blocks }));
  const big = validatePage(pageOf([['code', { language: '', code: 'x'.repeat(6000) }]], { sections: undefined }), registry);
  assert.deepEqual(big, []);
  const huge = pageOf(Array.from({ length: 40 }, () => ['code', { language: '', code: 'x'.repeat(5999) }]));
  assert.deepEqual(keysOf(validatePage(huge, registry)), ['null:too_big']);
});

test('structure: envelope, ids, types, cells, shapes, key names and depth', needsRuby, () => {
  const registry = loadRegistry();
  const keys = (page) => keysOf(validatePage(page, registry));
  for (const page of [null, [], 'page', 42, { schemaVersion: '1', kind: 'ocs-ui-page' }, { ...pageOf([]), kind: 'other' }]) {
    assert.deepEqual(keys(page), ['null:bad_page'], JSON.stringify(page));
  }
  assert.deepEqual(keys({ ...pageOf([]), page: 'x' }), ['page:bad_page']);
  assert.deepEqual(keys({ ...pageOf([]), sections: {} }), ['sections:bad_page']);
  const blockPage = (block) => pageOf([], { sections: [{ id: 's-000001', type: 'stack', settings: {}, hidden: false, cells: [{ blocks: [block] }] }] });
  assert.deepEqual(keys(blockPage({ id: 's-000002', type: 'divider', settings: {} })), ['id:bad_id'], 'block ids start with b-');
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: 'marquee', settings: {} })), ['type:unknown_type']);
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: '__proto__', settings: {} })), ['type:unknown_type']);
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: 'divider', settings: [], hidden: 'no' })), ['hidden:bad_page', 'settings:bad_page']);
  assert.deepEqual(keys(blockPage('divider')), ['blocks:bad_page']);
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: 'divider', settings: {}, onclick: 'x', nested: { HTML: 1, Script: 2, deep: [{ OnLoad: 1 }] } })), ['onclick:bad_key', 'HTML:bad_key', 'Script:bad_key', 'OnLoad:bad_key']);
  assert.deepEqual(keys({ ...pageOf([]), onload: 1, page: { title: 'x', constructor: 1 } }), ['constructor:bad_key', 'onload:bad_key']);
  assert.deepEqual(keys(JSON.parse('{"schemaVersion":1,"kind":"ocs-ui-page","page":{"title":"x"},"sections":[],"__proto__":{"polluted":1}}')), ['__proto__:bad_key']);
  const message = validatePage(blockPage({ id: 'b-000002', type: 'x'.repeat(5000), settings: {} }), registry)[0].message;
  assert.ok(message.length < 120, 'hostile type names are cut before they reach a message');
  const columns = (layout, cells) => pageOf([], { sections: [{ id: 's-000001', type: 'columns', settings: { layout }, hidden: false, cells }] });
  assert.deepEqual(keys(columns('thirds', [{ blocks: [] }, { blocks: [] }, { blocks: [] }])), []);
  assert.deepEqual(keys(columns('thirds', [{ blocks: [] }, { blocks: [] }])), ['cells:bad_cells']);
  assert.deepEqual(keys(columns('__proto__', [{ blocks: [] }, { blocks: [] }])), ['layout:bad_choice'], 'an unknown layout is checked as the default');
  assert.deepEqual(keys(columns('halves', 'x')), ['cells:bad_page']);
  assert.deepEqual(keys(columns('halves', [{ blocks: [] }, { nope: 1 }])), ['cells:bad_page']);
  const twins = pageOf([['divider', {}], ['divider', {}]]);
  twins.sections[0].cells[0].blocks[1].id = 'b-000001';
  assert.deepEqual(keysOf(validatePage(twins, registry)), ['id:duplicate_id']);
  assert.equal(validatePage(twins, registry)[0].nodeId, 'b-000001');
  // The deepest legal page (an API saved copy) is exactly at the limit; one more level fails.
  const deep = (levels) => (levels === 0 ? 'x' : [deep(levels - 1)]);
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: 'divider', settings: { extra: deep(4) } })), []);
  assert.deepEqual(keys(blockPage({ id: 'b-000002', type: 'divider', settings: { extra: deep(5) } })), ['null:too_deep']);
  const cyclic = blockPage({ id: 'b-000002', type: 'divider', settings: {} });
  cyclic.sections[0].cells[0].blocks[0].settings.self = cyclic;
  assert.deepEqual(keys(cyclic), ['null:too_deep'], 'a cyclic object ends at the depth limit');
});

test('hostile pages stay bounded: issues are capped and nothing throws', needsRuby, () => {
  const registry = loadRegistry();
  const links = Array.from({ length: 5000 }, () => ({ label: '', url: 'javascript:x' }));
  const started = Date.now();
  const issues = validatePage(pageOf([['buttons', { links }]]), registry);
  assert.ok(issues.length <= 1000 && issues.length > 900, String(issues.length));
  assert.ok(Date.now() - started < 2000);
  for (const settings of [null, 'x', [], 7, { links: { length: 3 } }, { links: [1, true, null] }]) {
    assert.doesNotThrow(() => validatePage(pageOf([['buttons', settings]]), registry));
  }
  assert.deepEqual(validateSettings(null, null, registry), []);
});
