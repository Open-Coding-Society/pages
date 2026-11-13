// pretty-html.js lays out the page-file markup for the code view. It must never change what the
// markup says: only line breaks and indentation are added, and the builder's data-ui attributes
// left out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codeLines, isBuilderAttribute, LINE_WIDTH, ocsClasses, parseHTML } from '../js/pretty-html.js';
import { blockHTML } from '../js/export.js';
import { contentRenderers } from '../js/blocks-content.js';
import { createPage } from '../js/page-model.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

const textOf = (lines) => lines.map((line) => '  '.repeat(line.depth) + line.tokens.map((token) => token.text).join('')).join('\n');
// The same markup with the layout taken out again: the printer adds only whitespace next to tags
// (line breaks and indentation), so compare with that whitespace gone and the rest collapsed.
const flat = (html) => html.replace(/\s*(<[^>]+>)\s*/g, '$1').replace(/\s+/g, ' ').trim();

test('parses tags, attributes, text, comments and Liquid, and void tags hold no children', () => {
  const root = parseHTML('<p class="ocs__text">a<br>b</p><!-- note -->{% include x.html %}<img src="https://a.test/i.png" alt="">');
  assert.deepEqual(root.children.map((node) => node.type), ['element', 'comment', 'liquid', 'element']);
  const [p, , , img] = root.children;
  assert.deepEqual(p.attrs, [['class', 'ocs__text']]);
  assert.deepEqual(p.children.map((node) => node.type === 'element' ? node.tag : node.text), ['a', 'br', 'b']);
  assert.deepEqual(img.attrs, [['src', 'https://a.test/i.png'], ['alt', '']]);
  assert.equal(img.children.length, 0);
});

test('short elements stay on one line, nested ones indent, and text stays escaped', () => {
  const lines = codeLines('<header class="ocs__stack"><h1>Tom &amp; Jerry &lt;3</h1><p class="ocs__text">Hi <strong>there</strong></p></header>');
  assert.equal(textOf(lines), [
    '<header class="ocs__stack">',
    '  <h1>Tom &amp; Jerry &lt;3</h1>',
    '  <p class="ocs__text">Hi <strong>there</strong></p>',
    '</header>',
  ].join('\n'));
  assert.deepEqual(lines[0].tokens.map((token) => token.kind), ['tag', 'attr', 'value', 'tag']);
});

test('a line too wide splits: each link of a row, then a link\'s own parts', () => {
  const link = (label) => `<a class="ocs__btn" href="https://example.com/${'x'.repeat(30)}" target="_blank" rel="noopener noreferrer nofollow">${label}</a>`;
  const lines = codeLines(`<div class="ocs__links">${link('One')}${link('Two')}</div>`);
  assert.ok(lines.every((line) => line.depth * 2 + line.tokens.reduce((sum, token) => sum + token.text.length, 0) <= LINE_WIDTH + 80), 'no line runs on forever');
  assert.equal(lines.filter((line) => line.tokens[0].text === '<a').length, 2, 'each link starts its own line');
});

test('the builder\'s data-ui attributes can be left out, and unwrap shows what a block draws', () => {
  const html = '<div data-ui-node="b-000001" data-ui-kind="block" data-ui-type="heading"><h2 class="ocs__section-title">Plan</h2></div>';
  assert.equal(textOf(codeLines(html, { hide: isBuilderAttribute, unwrap: true })), '<h2 class="ocs__section-title">Plan</h2>');
  assert.equal(textOf(codeLines(html, { hide: isBuilderAttribute })), '<div>\n  <h2 class="ocs__section-title">Plan</h2>\n</div>');
  assert.ok(isBuilderAttribute('data-ui-cell') && isBuilderAttribute('data-ui-page') && !isBuilderAttribute('data-title'));
});

test('ocsClasses lists each grammar class once, in the order the markup uses them', () => {
  assert.deepEqual(ocsClasses('<div class="ocs__card ocs__stack"><a class="ocs__btn accent fill"></a><b class="ocs__btn">x</b></div>'), ['ocs__card', 'ocs__stack', 'ocs__btn']);
});

test('every template block\'s code is its page-file markup, only laid out', needsRuby, () => {
  const registry = loadRegistry();
  const ctx = { registry, baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com', renderers: contentRenderers, sanitizeRich: (raw) => raw };
  let checked = 0;
  for (const template of registry.templates) {
    const page = createPage(registry, { template: template.key, ids: counterIds() });
    for (const section of page.sections) for (const cell of section.cells) for (const block of cell.blocks) {
      const html = blockHTML(block, { ...ctx, pageSettings: page.page });
      const shown = textOf(codeLines(html, { hide: isBuilderAttribute }));
      const expected = html.replace(/ data-ui-[a-z-]+="[^"]*"/g, '');
      assert.equal(flat(shown), flat(expected), `${template.key}: ${block.type}`);
      checked += 1;
    }
  }
  assert.ok(checked > 20, `checked ${checked} blocks`);
});
