// The outline (DESIGN §10): an ARIA tree of sections, Columns cells and blocks with a roving
// tabindex, an "Add block" row at the end of every cell and drag and drop as an extra. Every
// action also has a button (row tools, the inspector's toolbar, shortcuts), so dragging is never
// the only way (WCAG 2.5.7). Rows come from page-model outlineOf; treeRows adds the add rows and
// works out what a collapsed row hides.
import { defOf } from './registry.js';
import { outlineOf } from './page-model.js';
import { el, icon, iconButton } from './editor-fields.js';

const listOf = (value) => (Array.isArray(value) ? value : []);

// outlineOf rows + an add row closing each cell (a One column section is one cell), each with
// visible/expanded/hasChildren. A block's setSize counts its cell's add row: it is a sibling.
export function treeRows(rows, { collapsed = new Set() } = {}) {
  const out = [];
  let open = null;
  const close = () => {
    if (!open) return;
    const size = open.blocks.length + 1;
    for (const block of open.blocks) block.setSize = size;
    out.push({
      key: `${open.sectionId}:add-${open.cellIndex}`, id: null, kind: 'add', type: null, depth: open.depth, label: '',
      preview: '', hidden: false, hiddenByParent: open.hiddenByParent, issues: 0, childIssues: 0, sectionId: open.sectionId,
      cellIndex: open.cellIndex, index: open.blocks.length, position: size, setSize: size,
    });
    open = null;
  };
  for (const source of listOf(rows)) {
    const row = { ...source };
    if (row.kind === 'section') {
      close();
      out.push(row);
      if (row.type !== 'columns') open = { sectionId: row.id, cellIndex: 0, depth: row.depth + 1, blocks: [], hiddenByParent: row.hidden };
    } else if (row.kind === 'cell') {
      close();
      out.push(row);
      open = { sectionId: row.sectionId, cellIndex: row.cellIndex, depth: row.depth + 1, blocks: [], hiddenByParent: row.hiddenByParent };
    } else {
      out.push(row);
      if (open) open.blocks.push(row);
    }
  }
  close();
  let hideBelow = Infinity;
  out.forEach((row, index) => {
    const next = out[index + 1];
    row.hasChildren = Boolean(next && next.depth > row.depth);
    if (row.depth <= hideBelow) hideBelow = Infinity;
    row.visible = hideBelow === Infinity;
    row.expanded = row.hasChildren ? !collapsed.has(row.key) : null;
    if (row.visible && row.hasChildren && collapsed.has(row.key)) hideBelow = row.depth;
  });
  return out;
}

// Where a dragged row lands. place is 'before' or 'after' the row it is over. Returns a
// page-model moveNodeTo target, or null when that drop means nothing.
export function dropTargetOf(drag, over, place) {
  if (!drag || !over || drag.key === over.key) return null;
  if (drag.kind === 'section') {
    if (over.kind !== 'section') return null;
    let index = place === 'before' ? over.index : over.index + 1;
    if (drag.index < index) index -= 1;
    return index === drag.index ? null : { index };
  }
  if (drag.kind !== 'block') return null;
  const sameCell = (sectionId, cellIndex) => drag.sectionId === sectionId && drag.cellIndex === cellIndex;
  if (over.kind === 'block') {
    let index = place === 'before' ? over.index : over.index + 1;
    if (sameCell(over.sectionId, over.cellIndex) && drag.index < index) index -= 1;
    if (sameCell(over.sectionId, over.cellIndex) && index === drag.index) return null;
    return { sectionId: over.sectionId, cellIndex: over.cellIndex, index };
  }
  if (over.kind === 'add') return { sectionId: over.sectionId, cellIndex: over.cellIndex };
  if (over.kind === 'cell') return { sectionId: over.sectionId, cellIndex: over.cellIndex, index: 0 };
  return { sectionId: over.id, cellIndex: 0, index: 0 };
}

const domId = (key) => `ui-row-${String(key).replace(/[^a-z0-9-]/gi, '-')}`;

// actions: select(id|null), move(id, delta), duplicate(id), toggleHidden(id), remove(id),
// addBlock({sectionId, cellIndex}), addSection(), drop(id, target).
export function createOutline({ root, doc = globalThis.document, registry, say, actions }) {
  const collapsed = new Set();
  let rows = [];
  let activeKey = null;
  let selectedKey = null;
  let readOnly = false;
  let drag = null;
  const tree = el(doc, 'ul', { class: 'ui-builder-tree', role: 'tree', 'aria-label': say('outline_label') });
  const empty = el(doc, 'p', { class: 'ocs__text', hidden: true }, say('outline_empty'));
  const addSection = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', onclick: () => actions.addSection() }, icon(doc, 'fa-plus'), say('add_section'));
  root.replaceChildren(el(doc, 'h2', { class: 'ocs__section-title' }, say('outline')), empty, tree, el(doc, 'div', { class: 'ocs__links' }, addSection));

  const rowOf = (key) => rows.find((row) => row.key === key) || null;
  const shown = () => rows.filter((row) => row.visible);
  const elementOf = (key) => doc.getElementById(domId(key));

  function labelOf(row) {
    if (row.kind === 'add') return say('add_block');
    return row.label;
  }

  function tools(row) {
    if (row.kind !== 'section' && row.kind !== 'block') return null;
    const button = (name, label, run) => {
      const control = iconButton(doc, { name, label, disabled: readOnly, onclick: (event) => { event.stopPropagation(); run(); } });
      control.tabIndex = -1; // pointer shortcuts; keyboard users have the same actions as keys
      return control;
    };
    return el(doc, 'span', { class: 'ui-builder-row-tools', role: 'group', 'aria-label': say('row_actions', { label: row.label }) },
      button('fa-arrow-up', say('move_up'), () => actions.move(row.id, -1)),
      button('fa-arrow-down', say('move_down'), () => actions.move(row.id, 1)),
      button('fa-clone', say('duplicate'), () => actions.duplicate(row.id)),
      button(row.hidden ? 'fa-eye' : 'fa-eye-slash', say(row.hidden ? 'show' : 'hide'), () => actions.toggleHidden(row.id)),
      button('fa-trash-can', say('remove'), () => actions.remove(row.id)));
  }

  function rowElement(row) {
    const def = row.kind === 'block' ? defOf(registry, 'block', row.type) : row.kind === 'section' ? defOf(registry, 'frame', row.type) : null;
    const iconName = row.kind === 'add' ? 'fa-plus' : row.kind === 'cell' ? 'fa-table-columns' : (def && def.icon) || 'fa-square';
    const labelId = `${domId(row.key)}-label`;
    const badgesId = `${domId(row.key)}-badges`;
    const count = row.issues + row.childIssues;
    // Outside the truncated label, so a long preview never hides them; still part of the name.
    const badges = [
      row.hidden ? el(doc, 'b', { class: 'ocs__status-pill ocs__status-pill--neutral' }, say('hidden_badge')) : null,
      count ? el(doc, 'b', { class: 'ocs__status-pill ocs__status-pill--bad' }, say('issues_badge', { count })) : null,
    ].filter(Boolean);
    const item = el(doc, 'li', {
      id: domId(row.key), class: 'ui-builder-row', role: 'treeitem', 'data-key': row.key, 'data-kind': row.kind,
      'aria-level': row.depth + 1, 'aria-setsize': row.setSize, 'aria-posinset': row.position, 'aria-labelledby': badges.length ? `${labelId} ${badgesId}` : labelId,
      'aria-selected': row.kind === 'add' ? null : String(row.key === selectedKey), 'aria-expanded': row.hasChildren ? String(row.expanded) : null,
      'data-hidden': row.hidden || row.hiddenByParent ? '' : null, tabindex: row.key === activeKey ? '0' : '-1',
      draggable: !readOnly && (row.kind === 'block' || row.kind === 'section') ? 'true' : null,
    },
    el(doc, 'span', { class: 'ui-builder-row-main ocs__truncate', id: labelId },
      icon(doc, iconName), ' ', el(doc, 'strong', null, labelOf(row)),
      row.preview ? [' ', el(doc, 'small', null, row.preview)] : null),
    badges.length ? el(doc, 'span', { class: 'ui-builder-row-badges', id: badgesId }, badges) : null,
    tools(row));
    return item;
  }

  function render() {
    const hadFocus = tree.contains(doc.activeElement);
    const visible = shown();
    if (!rowOf(activeKey) || !rowOf(activeKey).visible) activeKey = selectedKey && rowOf(selectedKey) ? selectedKey : (visible[0] ? visible[0].key : null);
    tree.replaceChildren(...visible.map(rowElement));
    tree.hidden = !visible.length;
    empty.hidden = Boolean(visible.length);
    if (hadFocus && activeKey && elementOf(activeKey)) elementOf(activeKey).focus();
  }

  function focusRow(key) {
    if (!key) return;
    activeKey = key;
    for (const item of tree.children) item.tabIndex = item.getAttribute('data-key') === key ? 0 : -1;
    const target = elementOf(key);
    if (target) target.focus();
  }

  function activate(row) {
    if (!row) return;
    if (row.kind === 'add') actions.addBlock({ sectionId: row.sectionId, cellIndex: row.cellIndex });
    else if (row.kind === 'cell') actions.select(row.sectionId);
    else actions.select(row.id);
  }

  function setCollapsed(row, value) {
    if (!row || !row.hasChildren) return;
    if (value) collapsed.add(row.key);
    else collapsed.delete(row.key);
    rows = treeRows(rows.filter((item) => item.kind !== 'add'), { collapsed });
    render();
    focusRow(row.key);
  }

  tree.addEventListener('keydown', (event) => {
    // Only on the rows themselves: a focused row tool keeps its own Enter and Space.
    if (!event.target || event.target.getAttribute('role') !== 'treeitem') return;
    const current = rowOf(event.target.getAttribute('data-key'));
    if (!current || event.altKey || event.ctrlKey || event.metaKey) return;
    const visible = shown();
    const at = visible.findIndex((row) => row.key === current.key);
    const go = (row) => { if (row) { event.preventDefault(); focusRow(row.key); } };
    switch (event.key) {
      case 'ArrowDown': go(visible[at + 1]); break;
      case 'ArrowUp': go(visible[at - 1]); break;
      case 'Home': go(visible[0]); break;
      case 'End': go(visible[visible.length - 1]); break;
      case 'ArrowRight':
        event.preventDefault();
        if (current.hasChildren && !current.expanded) setCollapsed(current, false);
        else if (current.hasChildren) go(visible[at + 1]);
        break;
      case 'ArrowLeft': {
        event.preventDefault();
        if (current.hasChildren && current.expanded) setCollapsed(current, true);
        else go([...visible.slice(0, at)].reverse().find((row) => row.depth < current.depth));
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        activate(current);
        break;
      default: break;
    }
  });

  tree.addEventListener('click', (event) => {
    const item = event.target.closest('[role="treeitem"]');
    const row = item && rowOf(item.getAttribute('data-key'));
    if (!row) return;
    focusRow(row.key);
    activate(row);
  });

  function placeOf(event, item) {
    const box = item.getBoundingClientRect();
    return event.clientY < box.top + (box.height / 2) ? 'before' : 'after';
  }
  function clearDrop() {
    for (const item of tree.querySelectorAll('[data-drop]')) item.removeAttribute('data-drop');
  }
  tree.addEventListener('dragstart', (event) => {
    const item = event.target.closest('[role="treeitem"]');
    const row = item && rowOf(item.getAttribute('data-key'));
    if (!row || readOnly || (row.kind !== 'block' && row.kind !== 'section')) return;
    drag = row;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', row.label);
  });
  tree.addEventListener('dragover', (event) => {
    const item = event.target.closest('[role="treeitem"]');
    const over = item && rowOf(item.getAttribute('data-key'));
    if (!drag || !over || !dropTargetOf(drag, over, placeOf(event, item))) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    clearDrop();
    item.setAttribute('data-drop', over.kind === 'block' || over.kind === 'section' ? placeOf(event, item) : 'inside');
  });
  tree.addEventListener('dragleave', (event) => { if (!tree.contains(event.relatedTarget)) clearDrop(); });
  tree.addEventListener('dragend', () => { drag = null; clearDrop(); });
  tree.addEventListener('drop', (event) => {
    const item = event.target.closest('[role="treeitem"]');
    const over = item && rowOf(item.getAttribute('data-key'));
    const target = drag && over ? dropTargetOf(drag, over, placeOf(event, item)) : null;
    clearDrop();
    if (!target) return;
    event.preventDefault();
    const id = drag.id;
    drag = null;
    actions.drop(id, target);
  });

  return {
    update(page, { selectedId = null, issues = [], readOnly: locked = false } = {}) {
      readOnly = locked === true;
      addSection.disabled = readOnly;
      const base = outlineOf(page, registry, { issues });
      const selected = base.find((row) => row.id && row.id === selectedId);
      // The selection is always in view: open the section (and column) it is in.
      if (selected) {
        collapsed.delete(selected.sectionId);
        if (selected.kind === 'block') collapsed.delete(`${selected.sectionId}:cell-${selected.cellIndex}`);
      }
      selectedKey = selected ? selected.key : null;
      if (selected && !tree.contains(doc.activeElement)) activeKey = selected.key;
      rows = treeRows(base, { collapsed });
      render();
    },
    focus() {
      focusRow(activeKey || (shown()[0] && shown()[0].key));
      if (!activeKey) addSection.focus();
    },
    focusSelected() { if (selectedKey) focusRow(selectedKey); },
  };
}
