import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEW_TAB_REL, SANDBOX, TAGS, boundary, comment, h, isVNode, liquid, rich, toDOM, toHTML } from '../js/vnode.js';
import { createRichHooks, secureRichTree } from '../js/rich-content.js';
import { build, createFakeDocument, elementsOf } from './fixtures/render/fake-dom.mjs';

const strict = { strict: true };

test('h flattens children and skips null, undefined and booleans', () => {
  const node = h('p', null, 'a', [null, ['b', false, [true, undefined, 3]]], h('br'));
  assert.equal(toHTML(node, strict), '<p>ab3<br></p>');
  assert.ok(isVNode(node));
  assert.equal(isVNode({ kind: 'element', tag: 'p', attrs: {}, children: [] }), false);
  assert.throws(() => h('p', 'text'), /must be an object or null/);
  assert.throws(() => h('p', h('b')), /must be an object or null/);
});

test('toHTML escapes text and attribute values, braces included', () => {
  const html = toHTML(h('p', { title: `"'<>&{}` }, `<b>&{{ site.x }}{% raw %}'"`), strict);
  assert.equal(html, '<p title="&quot;&#39;&lt;&gt;&amp;&#123;&#125;">&lt;b&gt;&amp;&#123;&#123; site.x &#125;&#125;&#123;% raw %&#125;&#39;&quot;</p>');
  assert.equal(toHTML(h('p', null, 'a\u0000b\u0007c\u007f\td\ne'), strict), '<p>abc\td\ne</p>');
});

test('liquid is written verbatim; everything else, rich HTML included, is brace-escaped', () => {
  const tag = '{% include ocs_kanban_board.html url="https://github.com/orgs/x/projects/1" filter="Team A" %}';
  const sanitizeRich = (raw) => `<b>${raw}</b>`;
  const html = toHTML([h('div', null, liquid(tag), rich('{{ evil }}')), comment('note {{x}} --> <b>')], { sanitizeRich, strict: true });
  assert.equal(html, `<div>${tag}<b>&#123;&#123; evil &#125;&#125;</b></div><!-- note &#123;&#123;x&#125;&#125; --&gt; &lt;b&gt; -->`);
});

test('liquid() accepts only one include tag with plain values', () => {
  for (const bad of [
    '{{ site.github }}', '{% raw %}', '{% include x.html %}{% include y.html %}', '{% include ../x.html %}',
    '{% include x.html url="a"b" %}', '{% include x.html url="{{ y }}" %}', '{% include x.html url="%}" %}',
    '{% include x.html title="<script>" %}', '{%- include x.html -%}', ' {% include x.html %}', 42, null,
  ]) {
    assert.throws(() => liquid(bad), /liquid\(\) takes one/, String(bad));
  }
  assert.ok(isVNode(liquid('{% include ocs_calendar_card.html course="csp" %}')));
});

test('a plain object shaped like a node is never treated as one', () => {
  const forged = JSON.parse('{"kind":"liquid","text":"{% include evil.html %}"}');
  assert.throws(() => toHTML(h('div', null, forged), strict), /not a node/);
  assert.equal(toHTML(h('div', null, forged, 'kept')), '<div>kept</div>');
  const forgedElement = { kind: 'element', tag: 'script', attrs: {}, children: ['alert(1)'] };
  assert.equal(toHTML(h('div', null, forgedElement)), '<div></div>');
});

test('tags outside the allowlist throw in strict mode and are unwrapped otherwise', () => {
  for (const tag of ['script', 'style', 'svg', 'object', 'embed', 'form', 'input', 'textarea', 'link', 'meta', 'base', 'math', 'SCRIPT', 'P']) {
    assert.ok(!TAGS.has(tag));
    assert.throws(() => toHTML(h(tag, null, 'x'), strict), /not allowed/, tag);
    assert.equal(toHTML(h('div', null, h(tag, { onclick: 'x' }, 'kept text'))), '<div>kept text</div>', tag);
  }
});

test('attributes outside the allowlist throw in strict mode and are dropped otherwise', () => {
  const bad = [
    ['a', { onclick: 'alert(1)' }], ['a', { ONCLICK: 'x' }], ['div', { style: 'color:red' }], ['iframe', { srcdoc: '<b>' }],
    ['button', { formaction: 'https://x.example' }], ['a', { href: 'javascript:alert(1)' }], ['a', { href: ' javascript:x' }],
    ['a', { href: 'http://example.com' }], ['a', { href: '//evil.example' }], ['a', { href: '/\\evil.example' }],
    ['a', { href: 'https://user:pw@example.com' }], ['a', { href: 'data:text/html,x' }], ['img', { src: 'mailto:a@b.c' }],
    ['img', { src: 'data:image/png;base64,AAAA' }], ['iframe', { src: '/same/origin/page' }], ['div', { id: 'main' }],
    ['iframe', { sandbox: 'allow-scripts allow-same-origin allow-top-navigation' }], ['iframe', { allow: 'camera' }],
    ['a', { target: '_top' }], ['button', { type: 'submit' }], ['div', { tabindex: '5' }], ['div', { class: 'a"b' }],
    ['div', { class: '' }], ['td', { colspan: '0' }], ['img', { loading: 'auto' }], ['img', { crossorigin: 'use-credentials' }],
    ['a', { title: { toString: () => 'x' } }], ['a', { title: ['x'] }], ['div', { 'data-x': '1' }], ['div', { 'data-ui-': '1' }],
    ['div', { 'aria-': 'x' }], ['p', { hidden: 'until-found' }],
  ];
  for (const [tag, attrs] of bad) {
    const [name] = Object.keys(attrs);
    assert.throws(() => toHTML(h(tag, attrs), strict), /not allowed/, `${tag} ${name}`);
    assert.equal(toHTML(h(tag, attrs)), ['img'].includes(tag) ? `<${tag}>` : `<${tag}></${tag}>`, `${tag} ${name}`);
  }
});

test('allowed attributes keep their values, and a new tab always gets the safe rel', () => {
  const html = toHTML(h('a', { class: 'ocs__btn accent fill', href: 'https://example.com/x?a=1&b=2', rel: 'opener', target: '_blank', title: 'example.com', 'aria-label': 'Go', 'data-ui-node': 'b-000001' }, 'Go'), strict);
  assert.equal(html, `<a class="ocs__btn accent fill" href="https://example.com/x?a=1&amp;b=2" target="_blank" rel="${NEW_TAB_REL}" title="example.com" aria-label="Go" data-ui-node="b-000001">Go</a>`);
  assert.equal(toHTML(h('a', { href: 'mailto:team@example.com' }, 'Mail'), strict), '<a href="mailto:team@example.com">Mail</a>');
  assert.equal(toHTML(h('a', { href: '/csp/sprint-1/' }, 'Site'), strict), '<a href="/csp/sprint-1/">Site</a>');
  assert.equal(toHTML(h('img', { src: '/images/a.png', alt: '', loading: 'lazy', width: 120, height: '80' }), strict), '<img src="/images/a.png" alt="" loading="lazy" width="120" height="80">');
  const frame = h('iframe', { src: 'https://ada.github.io/app/', title: 'App', sandbox: SANDBOX, allow: '', referrerpolicy: 'no-referrer', crossorigin: 'anonymous' });
  assert.equal(toHTML(frame, strict), `<iframe src="https://ada.github.io/app/" title="App" sandbox="${SANDBOX}" allow="" referrerpolicy="no-referrer" crossorigin="anonymous"></iframe>`);
  assert.equal(toHTML(h('div', { hidden: true, 'data-ui-hidden': '', 'data-ui-flag': true, 'data-ui-off': false, 'aria-hidden': true, tabindex: -1, id: 'ui-b-000001-title' }), strict),
    '<div hidden data-ui-hidden data-ui-flag aria-hidden="true" tabindex="-1" id="ui-b-000001-title"></div>');
  assert.equal(toHTML(h('th', { scope: 'col', colspan: 2 }, 'x'), strict), '<th scope="col" colspan="2">x</th>');
  assert.equal(toHTML(h('details', { open: '' }, h('summary', null, 's')), strict), '<details open><summary>s</summary></details>');
});

test('void elements take no children', () => {
  assert.throws(() => toHTML(h('br', null, 'x'), strict), /can't have children/);
  assert.equal(toHTML(h('hr', null, 'x')), '<hr>');
});

test('rich nodes need their hooks, and liquid never reaches the DOM', () => {
  assert.throws(() => toHTML(rich('<b>x</b>')), /sanitizeRich hook/);
  const doc = createFakeDocument();
  assert.throws(() => toDOM(rich('<b>x</b>'), { doc }), /renderRich hook/);
  assert.throws(() => toDOM(liquid('{% include ocs_calendar_card.html course="csp" %}'), { doc }), /only for the page-file export/);
  assert.throws(() => toDOM(comment('x'), { doc, strict: true }), /only for the page-file export/);
  assert.equal(toDOM(h('p', null, comment('x'), 'kept'), { doc }).outerHTML, '<p>kept</p>');
  assert.equal(toHTML(rich(42), { sanitizeRich: (raw) => `[${raw}]` }), '[]');
});

test('toDOM builds nodes with createElement, setAttribute and createTextNode only', () => {
  const doc = createFakeDocument();
  const renderRich = (container, raw) => container.appendChild(build(container.ownerDocument, ['b', {}, raw]));
  const tree = h('section', { class: 'ocs__card', 'data-ui-live': 'chat' },
    h('h3', { class: 'ocs__section-title' }, 'Title ', 3),
    h('div', { class: 'ocs__text' }, 'before ', rich('rich'), ' after'),
    h('a', { href: 'javascript:alert(1)', onclick: 'x', target: '_blank' }, 'link'),
    h('script', null, 'unwrapped'));
  const node = toDOM(tree, { doc, renderRich });
  assert.equal(node.outerHTML, `<section class="ocs__card" data-ui-live="chat"><h3 class="ocs__section-title">Title 3</h3><div class="ocs__text">before <b>rich</b> after</div><a target="_blank" rel="${NEW_TAB_REL}">link</a>unwrapped</section>`);
  const used = new Set(doc.calls.map(([name]) => name));
  assert.deepEqual([...used].sort(), ['createDocumentFragment', 'createElement', 'createTextNode', 'setAttribute']);
  assert.ok(!doc.calls.some(([name, tag]) => name === 'createElement' && tag === 'script'));
  assert.throws(() => toDOM(tree, { doc, renderRich, strict: true }), /not allowed/);
});

test('toDOM returns the single node, or a fragment for several', () => {
  const doc = createFakeDocument();
  assert.equal(toDOM(h('p', null, 'x'), { doc }).localName, 'p');
  assert.equal(toDOM('text', { doc }).nodeType, 3);
  const many = toDOM([h('p'), h('p')], { doc });
  assert.equal(many.nodeType, 11);
  assert.equal(many.childNodes.length, 2);
  assert.equal(toDOM(null, { doc }).childNodes.length, 0);
  assert.throws(() => toDOM(h('p'), { doc: {} }), /needs a document/);
});

test('a boundary renders its fallback when its child fails, and rethrows in strict mode', () => {
  const errors = [];
  const fallback = h('div', { 'data-ui-error': '' }, 'broken');
  const failing = boundary(h('div', null, 'partial ', rich('x')), { fallback, onError: (error) => errors.push(error.message) });
  const tree = h('article', null, h('p', null, 'before'), failing, h('p', null, 'after'));
  assert.equal(toHTML(tree), '<article><p>before</p><div data-ui-error>broken</div><p>after</p></article>');
  const doc = createFakeDocument();
  assert.equal(toDOM(tree, { doc }).outerHTML, '<article><p>before</p><div data-ui-error="">broken</div><p>after</p></article>');
  assert.equal(errors.length, 2);
  assert.match(errors[0], /sanitizeRich hook/);
  assert.throws(() => toHTML(tree, strict), /sanitizeRich hook/);
  assert.equal(toHTML(boundary(h('p', null, 'fine'), { fallback })), '<p>fine</p>');
  assert.equal(toHTML(boundary(rich('x'))), '', 'no fallback renders nothing');
});

test('secureRichTree keeps the rich-text subset and re-checks every link', () => {
  const doc = createFakeDocument();
  const root = build(doc, ['div', {},
    ['b', { style: 'color:red' }, 'bold'],
    ['a', { href: 'http://insecure.example/' }, 'insecure'],
    ['a', { href: 'https://ok.example/x', onclick: 'x', target: '_self', rel: 'opener' }, ['i', { title: 't' }, 'ok']],
    ['a', { href: 'javascript:alert(1)' }, 'js'],
    ['a', { href: 'mailto:team@example.com' }, 'mail'],
    ['a', { href: '/site/path' }, 'site'],
    ['a', { href: '//evil.example/' }, 'protocol-relative'],
    ['span', { class: 'rt-size-lg evil', style: 'x' }, 'big'],
    ['span', {}, 'plain'],
    ['img', { src: 'x', onerror: 'alert(1)' }],
    ['script', {}, 'alert(2)'],
    ['ul', { class: 'x' }, ['li', { onclick: 'x' }, 'item']],
  ]);
  secureRichTree(root, { baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' });
  assert.equal(root.innerHTML, [
    '<b>bold</b>', 'insecure',
    `<a href="https://ok.example/x" target="_blank" rel="${NEW_TAB_REL}"><i>ok</i></a>`,
    'js', `<a href="mailto:team@example.com" target="_blank" rel="${NEW_TAB_REL}">mail</a>`, 'site', 'protocol-relative',
    '<span class="rt-size-lg">big</span>', 'plain', 'alert(2)', '<ul><li>item</li></ul>',
  ].join(''));
});

test('secureRichTree turns a link to the reader\'s own computer into its text, in any spelling', () => {
  const doc = createFakeDocument();
  // The URL parser writes [::ffff:127.0.0.1] as [::ffff:7f00:1] and [0::0] as [::]: secureLink checks that host.
  const loopback = ['https://localhost:8443/demo', 'https://LOCALHOST./x', 'https://app.localhost/', 'https://127.0.0.1:4100/',
    'https://127.1/', 'https://2130706433/', 'https://0x7f.0.0.1/', 'https://[::1]/', 'https://[0:0:0:0:0:0:0:1]/', 'https://0.0.0.0/',
    'https://[::ffff:127.0.0.1]:8443/', 'https://[0:0:0:0:0:ffff:7f00:1]/', 'https://[::]/', 'https://[0::0]/'];
  const root = build(doc, ['div', {}, ...loopback.map((href, n) => ['a', { href }, `local${n}`]),
    ['a', { href: 'https://localhost.example.com/' }, 'remote']]);
  secureRichTree(root, { baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' });
  assert.equal(root.innerHTML, `${loopback.map((_, n) => `local${n}`).join('')}<a href="https://localhost.example.com/" target="_blank" rel="${NEW_TAB_REL}">remote</a>`);
});

test('the rich hooks sanitize through rich-text.js and only touch the rich nodes', () => {
  const doc = createFakeDocument();
  const seen = [];
  const richText = {
    renderRichMessage(container, raw) {
      seen.push(raw);
      container.appendChild(build(container.ownerDocument, ['span', {}, 'hi ', ['a', { href: 'http://x.example/' }, 'old'], ' ', ['a', { href: 'https://x.example/' }, 'new']]));
    },
  };
  const hooks = createRichHooks({ richText, baseurl: '/b', pageOrigin: 'https://pages.opencodingsociety.com', doc });
  const tree = h('div', null, h('a', { href: '/b/about/' }, 'ours'), rich('<b>raw</b>'));
  const node = toDOM(tree, { doc, renderRich: hooks.renderRich });
  assert.equal(node.outerHTML, `<div><a href="/b/about/">ours</a>hi old <a href="https://x.example/" target="_blank" rel="${NEW_TAB_REL}">new</a></div>`);
  assert.equal(hooks.sanitizeRich(42), `hi old <a href="https://x.example/" target="_blank" rel="${NEW_TAB_REL}">new</a>`);
  assert.deepEqual(seen, ['<b>raw</b>', '']);
  for (const element of elementsOf(node)) assert.ok(TAGS.has(element.localName));
  assert.throws(() => createRichHooks({ richText: {} }), /rich-text\.js module/);
});
