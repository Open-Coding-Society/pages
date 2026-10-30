// The editor's outline (DESIGN §10): one row per section, Columns cell and block for the ARIA
// tree, with a short preview of each block's own words, hidden flags and issue counts.
import { defOf, textOf } from './registry.js';
import { clip, isObject, listOf, own, plainText, validatePage } from './page-rules.js';

const PREVIEW_FIELDS = ['title', 'text', 'name', 'label', 'body', 'code', 'caption', 'alt'];
const PREVIEW_MAX = 48;
const COLUMN_TEXT = 'editor.outline_column';
const sectionsOf = (page) => listOf(own(page, 'sections'));
const cellsOf = (section) => listOf(own(section, 'cells'));
const blocksOf = (cell) => listOf(own(cell, 'blocks'));

// Sections are depth 0; only Columns sections get cell rows ("Column 2", depth 1); blocks are
// depth 1 in One column and 2 in Columns. position/setSize place a row among its siblings
// (aria-posinset/setsize); issues counts the node's own problems, childIssues those inside it.

function previewText(field, value, nested) {
  switch (field.type) {
    case 'text': case 'textarea': case 'table': return typeof value === 'string' ? value : '';
    case 'richtext': return typeof value === 'string' ? plainText(value) : '';
    case 'links': {
      const link = listOf(value).find((item) => typeof own(item, 'label') === 'string' && item.label.trim());
      return link ? link.label : '';
    }
    case 'items': return nested ? '' : previewOf(field.item_fields, listOf(value)[0], true);
    case 'group': return typeof own(value, 'name') === 'string' ? value.name : '';
    default: return '';
  }
}

// A short label from the block's own words: title, text or name first, then any other text.
function previewOf(fields, settings, nested = false) {
  const rank = (field) => {
    const at = PREVIEW_FIELDS.indexOf(field.id);
    return at === -1 ? PREVIEW_FIELDS.length : at;
  };
  for (const field of [...listOf(fields)].sort((a, b) => rank(a) - rank(b))) {
    const text = clip(previewText(field, own(settings, field.id), nested), PREVIEW_MAX);
    if (text) return text;
  }
  return '';
}

function columnLabel(registry, def, number) {
  const text = textOf(registry, COLUMN_TEXT, { n: number });
  return text === COLUMN_TEXT ? `${def ? def.label : ''} ${number}`.trim() : text;
}

function layoutLabel(def, settings) {
  const field = listOf(def && def.fields).find((candidate) => candidate.id === 'layout');
  const option = field && listOf(field.options).find((candidate) => candidate && candidate.value === own(settings, 'layout'));
  return option ? option.label : '';
}

const typeLabel = (def, type) => (def ? def.label : clip(typeof type === 'string' ? type : '', 32));

export function outlineOf(page, registry, { issues, validators, baseurl, pageOrigin } = {}) {
  const list = Array.isArray(issues) ? issues : validatePage(page, registry, { validators, baseurl, pageOrigin });
  const counts = new Map();
  for (const issue of list) {
    if (issue && typeof issue.nodeId === 'string') counts.set(issue.nodeId, (counts.get(issue.nodeId) || 0) + 1);
  }
  const rows = [];
  const sections = sectionsOf(page);
  sections.forEach((section, sectionIndex) => {
    if (!isObject(section)) return;
    const id = own(section, 'id');
    const def = defOf(registry, 'frame', section.type);
    const columns = section.type === 'columns';
    const hidden = section.hidden === true;
    const cells = cellsOf(section);
    const sectionRow = {
      key: id, id, kind: 'section', type: section.type, depth: 0, label: typeLabel(def, section.type),
      preview: columns ? layoutLabel(def, own(section, 'settings')) : '', hidden, hiddenByParent: false,
      issues: counts.get(id) || 0, childIssues: 0, sectionId: id, cellIndex: null, index: sectionIndex,
      position: sectionIndex + 1, setSize: sections.length,
    };
    rows.push(sectionRow);
    cells.forEach((cell, cellIndex) => {
      const cellRow = columns ? {
        key: `${id}:cell-${cellIndex}`, id: null, kind: 'cell', type: null, depth: 1, label: columnLabel(registry, def, cellIndex + 1),
        preview: '', hidden: false, hiddenByParent: hidden, issues: 0, childIssues: 0, sectionId: id, cellIndex,
        index: cellIndex, position: cellIndex + 1, setSize: cells.length,
      } : null;
      if (cellRow) rows.push(cellRow);
      const blocks = blocksOf(cell);
      blocks.forEach((block, index) => {
        if (!isObject(block)) return;
        const blockId = own(block, 'id');
        const blockDef = defOf(registry, 'block', block.type);
        const count = counts.get(blockId) || 0;
        rows.push({
          key: blockId, id: blockId, kind: 'block', type: block.type, depth: columns ? 2 : 1, label: typeLabel(blockDef, block.type),
          preview: blockDef ? previewOf(blockDef.fields, own(block, 'settings')) : '', hidden: block.hidden === true,
          hiddenByParent: hidden, issues: count, childIssues: 0, sectionId: id, cellIndex, index,
          position: index + 1, setSize: blocks.length,
        });
        sectionRow.childIssues += count;
        if (cellRow) cellRow.childIssues += count;
      });
    });
  });
  return rows;
}
