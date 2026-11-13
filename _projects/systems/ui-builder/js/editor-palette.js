// The block palette and the section picker (DESIGN §10): an ocs__modal raised above the site's
// sticky header (as /dm does) with a search box and the registry's categories. Arrow keys move
// through the choices, Enter inserts; blocks this site or page can't take stay listed, disabled,
// with the reason (no Spring or Flask, the live-block limit).
import { framesOf, paletteOf, textOf } from './registry.js';
import { foldText } from './url-rules.js';
import { el, icon } from './editor-fields.js';

// Groups whose label or help match every word of the query; empty groups are dropped.
export function filterPalette(groups, query) {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return groups;
  return groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      const haystack = foldText(`${item.label} ${item.help || ''} ${item.type}`);
      return words.every((word) => haystack.includes(word));
    }),
  })).filter((group) => group.items.length);
}

// One column, then Columns once per layout, as one list.
export function sectionChoices(registry, say) {
  const out = [];
  for (const frame of framesOf(registry)) {
    const def = registry.frames[frame.type];
    const layout = (def.fields || []).find((field) => field.id === 'layout');
    if (!layout) {
      out.push({ type: frame.type, layout: undefined, label: frame.label, help: frame.help, icon: frame.icon });
      continue;
    }
    for (const option of layout.options || []) {
      out.push({ type: frame.type, layout: option.value, label: say('section_columns', { layout: option.label }), help: frame.help, icon: frame.icon });
    }
  }
  return out;
}

export function createPalette({ doc = globalThis.document, registry, say, dialogs }) {
  let dialog = null;

  function choiceButton(item, onPick) {
    const reason = item.disabled ? textOf(registry, item.reasonKey, { max: (registry.limits || {}).live_blocks }) : '';
    const button = el(doc, 'button', {
      type: 'button', class: 'ui-builder-choice', role: 'option', 'aria-selected': 'false',
      'aria-disabled': item.disabled ? 'true' : null, 'data-choice': '',
      onclick: () => { if (!item.disabled) onPick(item); },
    }, icon(doc, item.icon), ' ', el(doc, 'strong', null, item.label), ' ',
    el(doc, 'small', null, item.disabled ? say('palette_reason', { reason }) : (item.help || '')));
    return button;
  }

  // Arrow keys move a highlighted option (aria-activedescendant on the search box); Enter picks it.
  function keyboard(search, list, pick) {
    const options = () => [...list.querySelectorAll('[data-choice]')];
    let active = -1;
    const highlight = (index) => {
      const all = options();
      active = all.length ? Math.max(0, Math.min(index, all.length - 1)) : -1;
      all.forEach((option, at) => {
        option.setAttribute('aria-selected', String(at === active));
        if (!option.id) option.id = `ui-choice-${at}-${Math.random().toString(36).slice(2, 8)}`;
      });
      if (active >= 0) {
        search.setAttribute('aria-activedescendant', all[active].id);
        all[active].scrollIntoView({ block: 'nearest' });
      } else {
        search.removeAttribute('aria-activedescendant');
      }
    };
    search.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); highlight(active + 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); highlight(active - 1); }
      else if (event.key === 'Enter') {
        event.preventDefault();
        const all = options();
        const chosen = all[active >= 0 ? active : all.findIndex((option) => option.getAttribute('aria-disabled') !== 'true')];
        if (chosen) pick(chosen);
      }
    });
    return { reset: () => highlight(options().findIndex((option) => option.getAttribute('aria-disabled') !== 'true')) };
  }

  function show({ title, groups, onPick, searchable }) {
    const listId = `ui-palette-${Date.now().toString(36)}`;
    const search = el(doc, 'input', { class: 'ocs__input', type: 'search', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': listId, 'aria-autocomplete': 'list', 'aria-label': say('palette_search'), placeholder: say('palette_search'), hidden: !searchable });
    const list = el(doc, 'div', { class: 'ui-builder-palette', id: listId, role: 'listbox', 'aria-label': title });
    const count = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
    const items = new Map();
    let finished = false;
    const pick = (item) => {
      if (finished) return;
      finished = true;
      dialog.finish(item);
    };
    function paint() {
      items.clear();
      const shown = filterPalette(groups, search.value);
      list.replaceChildren(...shown.map((group) => el(doc, 'div', { role: 'group', 'aria-label': group.label },
        group.label ? el(doc, 'h3', { class: 'ui-builder-palette-group' }, group.label) : null,
        group.items.map((item) => {
          const button = choiceButton(item, pick);
          items.set(button, item);
          return button;
        }))));
      const total = shown.reduce((sum, group) => sum + group.items.length, 0);
      count.textContent = total ? say('palette_count', { count: total }) : say('palette_empty', { query: search.value.trim() });
      nav.reset();
    }
    const nav = keyboard(search, list, (button) => { const item = items.get(button); if (item && !item.disabled) pick(item); });
    search.addEventListener('input', paint);
    // Without a search box the choices themselves take the arrow keys.
    list.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const all = [...list.querySelectorAll('[data-choice]')];
      const at = all.indexOf(doc.activeElement);
      const next = all[at + (event.key === 'ArrowDown' ? 1 : -1)];
      if (next) { event.preventDefault(); next.focus(); }
    });
    paint();
    dialog = dialogs.open({ title, body: [search, count, list], focus: () => (searchable ? search : list.querySelector('[data-choice]')) });
    dialog.card.classList.add('ui-builder-palette-card');
    return dialog.result.then((item) => (item ? onPick(item) : null));
  }

  return {
    // capabilities: {spring, flask}; liveCount: live blocks already on the page.
    openBlocks({ capabilities, liveCount, onPick }) {
      const groups = paletteOf(registry, { capabilities, liveCount });
      return show({ title: say('palette_title'), groups, onPick, searchable: true });
    },
    openSections({ onPick }) {
      return show({ title: say('sections_title'), groups: [{ category: 'layout', label: '', items: sectionChoices(registry, say).map((item) => ({ ...item, disabled: false })) }], onPick, searchable: false });
    },
    isOpen: () => Boolean(dialog) && dialogs.isOpen(),
  };
}
