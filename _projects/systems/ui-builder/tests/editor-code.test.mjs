// The code view (editor-code.js): the page's HTML block by block, colored like the site's lesson
// code, with a sentence on what each block's markup does and the ocs__ classes it uses.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCodeView, linesText, sectionOutline } from '../js/editor-code.js';
import { addBlock, createPage, setHidden } from '../js/page-model.js';
import { contentRenderers } from '../js/blocks-content.js';
import { blockHTML } from '../js/export.js';
import { ocsClasses, parseHTML } from '../js/pretty-html.js';
import { textOf } from '../js/registry.js';
import { counterIds, loadRegistry, needsRuby, readYaml } from './helpers.mjs';
import { createDocument, text } from './fixtures/live/dom.mjs';

let registry = null;
function editorRegistry() {
  if (!registry) {
    const base = loadRegistry();
    registry = { ...base, text: { ...base.text, editor: readYaml('ui_builder_editor.yml') } };
  }
  return registry;
}
const say = (key, vars) => textOf(editorRegistry(), `editor.${key}`, vars);
const ctxOf = (reg) => ({ registry: reg, baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com', renderers: contentRenderers, sanitizeRich: (raw) => raw });
const blocksOf = (page) => page.sections.flatMap((section) => section.cells.flatMap((cell) => cell.blocks));

// The small fake DOM has no classList; the view's selection marks use it.
function viewDocument() {
  const doc = createDocument();
  const make = doc.createElement;
  doc.createElement = (tag) => {
    const node = make(tag);
    node.classList = {
      toggle(name, on) {
        const names = new Set(node.className.split(/\s+/).filter(Boolean));
        if (on) names.add(name);
        else names.delete(name);
        node.className = [...names].join(' ');
      },
    };
    return node;
  };
  return doc;
}

function drawn(page, { selectedId = null, onSelect } = {}) {
  const reg = editorRegistry();
  const view = createCodeView({ doc: viewDocument(), registry: reg, say, onSelect });
  view.update(page, { ctx: ctxOf(reg), selectedId });
  return view;
}

test('one card per block, in page order, under one heading per section', needsRuby, () => {
  const page = createPage(editorRegistry(), { template: 'team_project', ids: counterIds() });
  const view = drawn(page);
  const cards = view.element.querySelectorAll('.ui-builder-code-block');
  assert.deepEqual(cards.map((card) => card.getAttribute('data-ui-code-node')), blocksOf(page).map((block) => block.id));
  const headings = view.element.querySelectorAll('h3.ocs__section-title').map(text);
  assert.equal(headings.length, page.sections.length);
  assert.equal(headings[0], say('code_section', { n: 1, label: 'One column' }));
  const columns = page.sections.findIndex((section) => section.type === 'columns');
  assert.ok(headings[columns].startsWith(`${columns + 1}. Columns: `), 'a columns section names its layout');
  assert.deepEqual(view.element.querySelectorAll('p.ocs__label').map(text).filter((label) => label.startsWith('Column')), [say('code_column', { n: 1 }), say('code_column', { n: 2 })]);
  assert.equal(text(view.element.querySelector('p.ocs__text')), say('code_lead'));
});

test('the code is colored with the site\'s lesson-code classes, and what a student typed stays text', needsRuby, () => {
  const reg = editorRegistry();
  let page = createPage(reg, { ids: counterIds() });
  page = addBlock(page, reg, { type: 'heading', sectionId: page.sections[0].id, settings: { text: '<script>alert(1)</script> & more' }, ids: counterIds() });
  const view = drawn(page);
  const card = view.element.querySelectorAll('.ui-builder-code-block').pop();
  const code = card.querySelector('pre.highlight code');
  assert.ok(code, 'the code sits in Rouge\'s pre.highlight');
  assert.equal(text(code), '<h2 class="ocs__section-title">&lt;script&gt;alert(1)&lt;/script&gt; &amp; more</h2>');
  assert.deepEqual([...new Set(code.querySelectorAll('span').map((span) => span.className))].sort(), ['na', 'nt', 's']);
  assert.equal(view.element.querySelectorAll('script').length, 0);
});

test('each ocs__ class a block uses is listed with what it draws', needsRuby, () => {
  const page = createPage(editorRegistry(), { template: 'project_showcase', ids: counterIds() });
  const hero = blocksOf(page).find((block) => block.type === 'hero');
  const view = drawn(page);
  const card = view.element.querySelector(`[data-ui-code-node="${hero.id}"]`);
  const items = card.querySelectorAll('ul.ui-builder-code-classes li').map(text);
  const notes = editorRegistry().text.code_classes;
  assert.ok(items.includes(`ocs__badge: ${notes.ocs__badge}`), items.join(' | '));
  assert.ok(items.includes(`ocs__lead: ${notes.ocs__lead}`));
  assert.equal(text(card.querySelectorAll('p.ocs__text')[0]), editorRegistry().blocks.hero.code_note);
});

test('picking a block selects it, and the editor\'s selection is marked', needsRuby, () => {
  const page = createPage(editorRegistry(), { template: 'about_me', ids: counterIds() });
  const [first, second] = blocksOf(page);
  const picked = [];
  const view = drawn(page, { selectedId: second.id, onSelect: (id) => picked.push(id) });
  const cardOf = (id) => view.element.querySelector(`[data-ui-code-node="${id}"]`);
  assert.equal(cardOf(second.id).getAttribute('aria-current'), 'true');
  assert.equal(cardOf(first.id).getAttribute('aria-current'), null);
  const pick = cardOf(first.id).querySelector('button');
  assert.equal(pick.getAttribute('aria-pressed'), 'false');
  pick.click();
  assert.deepEqual(picked, [first.id]);
  view.select(first.id);
  assert.equal(pick.getAttribute('aria-pressed'), 'true');
  assert.ok(pick.className.split(' ').includes('fill'), 'the grammar\'s pressed look');
  assert.equal(cardOf(second.id).getAttribute('aria-current'), null);
});

test('a hidden block says so, an empty one says it draws nothing yet, and an empty page asks for a block', needsRuby, () => {
  const reg = editorRegistry();
  let page = createPage(reg, { ids: counterIds() });
  const ids = counterIds();
  page = addBlock(page, reg, { type: 'heading', sectionId: page.sections[0].id, settings: { text: '' }, ids });
  const empty = blocksOf(page).pop();
  const hero = blocksOf(page)[0];
  page = setHidden(page, hero.id, true);
  const view = drawn(page);
  const says = (id) => view.element.querySelector(`[data-ui-code-node="${id}"]`).querySelectorAll('p.ocs__text').map(text);
  assert.ok(says(hero.id).includes(say('code_hidden')));
  assert.ok(says(empty.id).includes(say('code_nothing')));
  assert.equal(drawn({ ...page, sections: [] }).element.querySelectorAll('p.ocs__text').map(text).pop(), say('code_empty'));
});

test('a section\'s outline is its own tag, with a comment where its blocks go', needsRuby, () => {
  const reg = editorRegistry();
  const page = createPage(reg, { template: 'team_project', ids: counterIds() });
  const columns = page.sections.find((section) => section.type === 'columns');
  const outline = linesText(sectionOutline(columns, ctxOf(reg), say));
  const layout = reg.layouts[columns.settings.layout];
  assert.ok(outline.startsWith(`<section class="${layout.className || layout.class}">`), outline);
  assert.ok(outline.includes(`<!-- ${say('code_column_here', { n: 1 })} -->`) && outline.includes(`<!-- ${say('code_column_here', { n: 2 })} -->`));
  assert.ok(!outline.includes('data-ui'), 'the builder\'s own attributes are left out');
  const stack = page.sections.find((section) => section.type === 'stack');
  assert.equal(linesText(sectionOutline(stack, ctxOf(reg), say)), `<section class="ocs__stack">\n  <!-- ${say('code_blocks_here')} -->\n</section>`);
});

test('every block, frame and ocs__ class the code view can show has its note', needsRuby, () => {
  const reg = editorRegistry();
  for (const [type, def] of Object.entries(reg.blocks)) assert.equal(typeof def.code_note, 'string', `blocks.${type}.code_note`);
  for (const [type, def] of Object.entries(reg.frames)) assert.equal(typeof def.code_note, 'string', `frames.${type}.code_note`);
  const filled = {
    image: { src: 'https://example.com/a.png', alt: 'A diagram', caption: 'Our design' },
    video: { url: 'https://www.youtube.com/watch?v=O5nskjZ_GoI', title: 'Demo' },
    embed: { url: 'https://example.github.io/app/', title: 'Our app' },
    buttons: { links: [{ label: 'Try it', url: 'https://example.com/' }] },
    checklist: { title: 'Done', items: [{ text: 'API', done: true }] },
  };
  const pages = reg.templates.map((template) => createPage(reg, { template: template.key, ids: counterIds() }));
  let extra = createPage(reg, { ids: counterIds() });
  for (const [type, settings] of Object.entries(filled)) extra = addBlock(extra, reg, { type, sectionId: extra.sections[0].id, settings, ids: counterIds() });
  const used = new Set();
  for (const page of [...pages, extra]) {
    for (const block of blocksOf(page)) for (const name of ocsClasses(blockHTML(block, { ...ctxOf(reg), pageSettings: page.page }))) used.add(name);
    for (const section of page.sections) for (const name of ocsClasses(parseHTML(linesText(sectionOutline(section, ctxOf(reg), say))))) used.add(name);
  }
  const missing = [...used].filter((name) => typeof reg.text.code_classes[name] !== 'string');
  assert.deepEqual(missing, []);
  assert.ok(used.size > 25, `${used.size} classes`);
});
