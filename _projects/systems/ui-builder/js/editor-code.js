// The editor's code view: the page as the HTML its page file holds, so a student sees what their
// blocks become. Section by section and block by block it shows the markup, indented and colored
// the way the site colors lesson code (Rouge's .highlight classes), a sentence on what the markup
// does (a block's or a frame's code_note in the registry) and the ocs__ grammar classes it uses,
// with what each one draws (text.code_classes). Picking a block here selects it in the editor.
import { blockHTML, sectionHTML } from './export.js';
import { codeLines, isBuilderAttribute, ocsClasses, parseHTML } from './pretty-html.js';
import { defOf } from './registry.js';
import { copyText } from './editor-dialogs.js';
import { el } from './editor-fields.js';

// Rouge's token classes: name.tag, name.attribute, string, comment, keyword.
const TOKEN_CLASSES = { tag: 'nt', attr: 'na', value: 's', comment: 'c', liquid: 'k' };
const INDENT = '  ';

// The lines as plain text, for Copy.
export function linesText(lines) {
  return lines.map((line) => INDENT.repeat(line.depth) + line.tokens.map((token) => token.text).join('')).join('\n');
}

function codeBlock(doc, lines) {
  const code = el(doc, 'code');
  lines.forEach((line, index) => {
    if (index) code.append(doc.createTextNode('\n'));
    if (line.depth) code.append(doc.createTextNode(INDENT.repeat(line.depth)));
    for (const token of line.tokens) {
      const kind = TOKEN_CLASSES[token.kind];
      code.append(kind ? el(doc, 'span', { class: kind }, token.text) : doc.createTextNode(token.text));
    }
  });
  return el(doc, 'div', { class: 'highlight' }, el(doc, 'pre', { class: 'highlight' }, code));
}

const noteOf = (def) => (def && typeof def.code_note === 'string' ? def.code_note : '');

// A comment the code view writes into a section's outline, where its blocks go.
const placeholder = (text) => ({ type: 'comment', text: `<!-- ${String(text).replace(/-{2,}|>/g, ' ')} -->` });

// The section's own markup with a comment where its blocks (or each column's) go.
export function sectionOutline(section, ctx, say) {
  const root = parseHTML(sectionHTML(section, ctx));
  const tag = root.children.find((node) => node.type === 'element');
  if (!tag) return [];
  const cells = tag.children.filter((node) => node.type === 'element' && node.attrs.some(([name]) => name === 'data-ui-cell'));
  if (cells.length) cells.forEach((cell, index) => { cell.children = [placeholder(say('code_column_here', { n: index + 1 }))]; });
  else tag.children = [placeholder(say('code_blocks_here'))];
  return codeLines(root, { hide: isBuilderAttribute });
}

function layoutLabel(registry, section) {
  const def = defOf(registry, 'frame', section.type);
  const field = def && Array.isArray(def.fields) ? def.fields.find((item) => item && item.id === 'layout') : null;
  const layout = section.settings && section.settings.layout;
  const option = field && Array.isArray(field.options) ? field.options.find((item) => item && item.value === layout) : null;
  return option ? option.label : '';
}

export function createCodeView({ doc = globalThis.document, registry, say, onSelect = () => {} }) {
  const element = el(doc, 'div', { class: 'ocs__stack ui-builder-code', role: 'region', 'aria-label': say('code_view_title') });
  let cards = new Map();
  let selected = null;

  function classList(classes) {
    const notes = (registry.text && registry.text.code_classes) || {};
    return el(doc, 'div', { class: 'ocs__stack' },
      el(doc, 'p', { class: 'ocs__label' }, say('code_classes')),
      el(doc, 'ul', { class: 'ocs__text ui-builder-code-classes' }, classes.map((name) => el(doc, 'li', null,
        el(doc, 'code', null, name), typeof notes[name] === 'string' ? `: ${notes[name]}` : ''))));
  }

  function blockCard(block, ctx, pageSettings) {
    const def = defOf(registry, 'block', block.type);
    const html = blockHTML(block, { ...ctx, pageSettings });
    const lines = codeLines(html, { hide: isBuilderAttribute, unwrap: true });
    const classes = ocsClasses(html);
    const pick = el(doc, 'button', { type: 'button', class: 'ocs__btn small', 'aria-pressed': 'false', onclick: () => onSelect(block.id) }, def ? def.label : String(block.type));
    const status = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
    const copy = lines.length ? el(doc, 'button', {
      type: 'button',
      class: 'ocs__btn small',
      onclick: async () => { status.textContent = (await copyText(doc, linesText(lines))) ? say('copied') : say('copy_failed'); },
    }, say('copy')) : null;
    const card = el(doc, 'article', { class: 'ocs__card ocs__stack ui-builder-code-block', 'data-ui-code-node': block.id },
      el(doc, 'div', { class: 'ocs__links' }, pick, copy, status),
      noteOf(def) ? el(doc, 'p', { class: 'ocs__text' }, noteOf(def)) : null,
      block.hidden === true ? el(doc, 'p', { class: 'ocs__text' }, say('code_hidden')) : null,
      lines.length ? [codeBlock(doc, lines), classes.length ? classList(classes) : null] : el(doc, 'p', { class: 'ocs__text' }, say('code_nothing')));
    cards.set(block.id, { card, pick });
    return card;
  }

  function sectionPart(section, index, ctx, pageSettings) {
    const def = defOf(registry, 'frame', section.type);
    const layout = layoutLabel(registry, section);
    const label = [def ? def.label : String(section.type), layout].filter(Boolean).join(': ');
    const cells = Array.isArray(section.cells) ? section.cells : [];
    const outline = sectionOutline(section, ctx, say);
    const many = section.type === 'columns' && cells.length > 1;
    return el(doc, 'section', { class: 'ocs__stack ui-builder-code-section' },
      el(doc, 'h3', { class: 'ocs__section-title' }, say('code_section', { n: index + 1, label })),
      noteOf(def) ? el(doc, 'p', { class: 'ocs__text' }, noteOf(def)) : null,
      section.hidden === true ? el(doc, 'p', { class: 'ocs__text' }, say('code_hidden')) : null,
      outline.length ? codeBlock(doc, outline) : null,
      cells.map((cell, column) => [
        many ? el(doc, 'p', { class: 'ocs__label' }, say('code_column', { n: column + 1 })) : null,
        (Array.isArray(cell && cell.blocks) ? cell.blocks : []).map((block) => blockCard(block, ctx, pageSettings)),
      ]));
  }

  function mark(id) {
    selected = id || null;
    for (const [key, { card, pick }] of cards) {
      const on = key === selected;
      if (on) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
      pick.setAttribute('aria-pressed', String(on));
      pick.classList.toggle('accent', on);
      pick.classList.toggle('fill', on);
    }
  }

  return {
    element,
    // Draws the whole page again: ctx is the editor's export context (exportContext(meta)).
    update(page, { ctx, selectedId = null } = {}) {
      cards = new Map();
      const sections = Array.isArray(page && page.sections) ? page.sections : [];
      const pageSettings = page && page.page ? page.page : {};
      const parts = sections.map((section, index) => sectionPart(section, index, ctx, pageSettings));
      const any = sections.some((section) => (section.cells || []).some((cell) => (cell.blocks || []).length));
      element.replaceChildren(el(doc, 'p', { class: 'ocs__text' }, say('code_lead')), ...(any ? parts : [el(doc, 'p', { class: 'ocs__text' }, say('code_empty'))]));
      mark(selectedId);
    },
    select: mark,
    // Scrolls a block's code into view, as the canvas does for a selection.
    reveal(id) {
      const entry = cards.get(id);
      if (entry && typeof entry.card.scrollIntoView === 'function') entry.card.scrollIntoView({ block: 'nearest' });
    },
  };
}
