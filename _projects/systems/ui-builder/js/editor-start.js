// The editor's start screen (DESIGN §10): My pages, Class pages (teachers) and Templates. My pages
// lists store.list(); Templates shows each starting page drawn small with the real renderer (no
// iframe); Import JSON reads a page file. Class pages lets a teacher open drafts, see revisions,
// approve a published page for everyone, unpublish, and approve a whole course for showcase night.
import { createPage, importPageJSON } from './page-model.js';
import { renderPage } from './render.js';
import { contentRenderers } from './blocks-content.js';
import { toDOM } from './vnode.js';
import { el, icon } from './editor-fields.js';
import { formatWhen } from './editor-dialogs.js';
import { publicStateOf } from './editor-session.js';

const listOf = (value) => (Array.isArray(value) ? value : []);

// Ids for pages that are only drawn, never saved.
function drawIds() {
  let n = 0;
  return (kind) => `${kind}-t${String((n += 1)).padStart(5, '0')}`;
}

// The class-pages filters, applied to Spring's summaries.
export function filterClassPages(pages, { status = '', changes = false, requested = false } = {}) {
  return listOf(pages).filter((page) => (!status || page.status === status)
    && (!changes || page.hasUnpublishedChanges === true)
    && (!requested || page.publicRequested === true));
}

export function refOf(summary, cloud) {
  if (summary && summary.ref && typeof summary.ref === 'object') return summary.ref;
  return summary && summary.id !== undefined ? { kind: cloud ? 'spring' : 'local', id: summary.id } : null;
}

// ids/validators feed importPageJSON; errorText(error) words a store error. actions: open(ref), create(templateKey),
// importPage({page, errors}), resumeNew(draft), openDraft(ref) and openPublished(summary) → viewer URLs,
// revisions(ref, summary), approve(ref, summary), unpublish(ref, summary), bulkPublic(course), message(text, {error}).
export function createStartScreen({ root, doc = globalThis.document, registry, say, text, errorText = () => text('store.unknown'), store, draftStore, signedIn, baseurl, pageOrigin, renderRich, ids, validators, actions, editorUrl }) {
  const caps = store.capabilities || {};
  const tabs = [{ key: 'mine', label: say('tab_mine') }];
  if (caps.teacher) tabs.push({ key: 'class', label: text('teacher.class_pages') });
  tabs.push({ key: 'templates', label: say('tab_templates') });
  const panels = {};
  const tabButtons = {};
  const tabList = el(doc, 'div', { class: 'ocs__links ui-builder-tabs', role: 'tablist', 'aria-label': say('tabs_label') });

  function select(key, { focus = false } = {}) {
    for (const tab of tabs) {
      const on = tab.key === key;
      tabButtons[tab.key].setAttribute('aria-selected', String(on));
      tabButtons[tab.key].tabIndex = on ? 0 : -1;
      tabButtons[tab.key].className = on ? 'ocs__btn pill accent fill' : 'ocs__btn pill';
      panels[tab.key].hidden = !on;
    }
    if (focus) tabButtons[key].focus();
    if (key === 'mine') loadMine();
    if (key === 'class') loadClass();
  }

  tabs.forEach((tab, index) => {
    tabButtons[tab.key] = el(doc, 'button', { type: 'button', role: 'tab', id: `ui-tab-${tab.key}`, 'aria-controls': `ui-panel-${tab.key}`, onclick: () => select(tab.key) }, tab.label);
    tabButtons[tab.key].addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      select(tabs[(index + step + tabs.length) % tabs.length].key, { focus: true });
    });
    panels[tab.key] = el(doc, 'div', { class: 'ocs__stack', role: 'tabpanel', id: `ui-panel-${tab.key}`, 'aria-labelledby': `ui-tab-${tab.key}`, hidden: true });
    tabList.appendChild(tabButtons[tab.key]);
  });

  // ---- My pages
  const mineList = el(doc, 'div', { class: 'ocs__grid ocs__grid--card' });
  const mineStatus = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
  const file = el(doc, 'input', { type: 'file', accept: 'application/json,.json', hidden: true });
  const notes = el(doc, 'div', { class: 'ocs__stack' });
  if (!caps.cloud) notes.appendChild(el(doc, 'div', { class: 'ocs__callout' }, icon(doc, 'fa-circle-info'), ' ', say('flask_only')));
  if (caps.cloud && !signedIn) {
    notes.appendChild(el(doc, 'div', { class: 'ocs__callout' }, say('sign_in'), ' ', el(doc, 'a', { class: 'ocs__btn small accent', href: `${baseurl}/login` }, say('sign_in_link'))));
  }
  const unsaved = draftStore.read(draftStore.keyFor(null));
  if (unsaved && unsaved.page) {
    notes.appendChild(el(doc, 'div', { class: 'ocs__callout' }, say('resume_new', { time: formatWhen(unsaved.savedAt) }), ' ',
      el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => actions.resumeNew(unsaved) }, say('resume_open'))));
  }
  panels.mine.append(notes,
    el(doc, 'div', { class: 'ocs__links' },
      el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon accent fill', onclick: () => select('templates', { focus: true }) }, icon(doc, 'fa-plus'), say('new_page')),
      el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon', onclick: () => file.click() }, icon(doc, 'fa-file-import'), say('import_json')), file),
    mineStatus, mineList);

  file.addEventListener('change', async () => {
    const chosen = file.files && file.files[0];
    file.value = '';
    if (!chosen) return;
    const max = (registry.limits || {}).import_max_chars || 5000000;
    if (chosen.size > max * 4) {
      actions.message(say('import_failed', { message: text('errors.import_too_big') }), { error: true });
      return;
    }
    const result = importPageJSON(await chosen.text(), registry, { ids, validators, baseurl, pageOrigin });
    if (!result.page) actions.message(say('import_failed', { message: result.errors.map((issue) => issue.message).join(' ') }), { error: true });
    else actions.importPage(result);
  });

  function pill(label, tone = 'neutral') {
    return el(doc, 'b', { class: `ocs__status-pill ocs__status-pill--${tone}` }, label);
  }

  // Everyone sees the page only while its approval covers the live version (editor-session.js
  // publicStateOf); an approval that ran out or a newer publish needs approving again.
  function approvalPill(summary) {
    const approval = publicStateOf(summary);
    if (approval === 'public') return pill(say('public_pill'), 'good');
    if (approval === 'ended') return pill(say('approval_ended'), 'warn');
    return approval === 'newer' ? pill(say('approval_newer'), 'warn') : null;
  }

  function pageCard(summary) {
    const ref = refOf(summary, caps.cloud);
    const href = ref ? editorUrl(ref) : null;
    const title = summary.title || text('blocks.untitled');
    const status = typeof summary.status === 'string' ? summary.status : (caps.cloud ? 'DRAFT' : 'LOCAL');
    const lease = summary.lease && !summary.lease.mine && summary.lease.holderName ? summary.lease.holderName : '';
    const saved = summary.updatedByName ? say('saved_by', { time: formatWhen(summary.updatedAt), name: summary.updatedByName }) : say('saved_at', { time: formatWhen(summary.updatedAt) });
    // A div, as the template cards are: preset themes repaint every <article> in the page color
    // (and the holiday wallpaper), which takes the card's panel away.
    return el(doc, 'div', { class: 'ocs__card ocs__stack' },
      el(doc, 'h3', { class: 'ocs__section-title' }, href ? el(doc, 'a', { href }, title) : title),
      summary.description ? el(doc, 'p', { class: 'ocs__text' }, summary.description) : null,
      el(doc, 'div', { class: 'ocs__links' },
        pill(say(`status_${['DRAFT', 'PUBLISHED', 'LOCAL', 'DELETED'].includes(status) ? status : 'DRAFT'}`), status === 'PUBLISHED' ? 'good' : 'neutral'),
        summary.hasUnpublishedChanges ? pill(say('changes_pending'), 'warn') : null,
        approvalPill(summary),
        lease ? pill(say('editing_now', { name: lease }), 'warn') : null),
      summary.updatedAt ? el(doc, 'small', null, saved) : null,
      href ? el(doc, 'div', { class: 'ocs__links' }, el(doc, 'a', { class: 'ocs__btn small', href, onclick: (event) => { event.preventDefault(); actions.open(ref); } }, say('open'))) : null);
  }

  let mineLoading = null;
  function loadMine() {
    if (mineLoading || (caps.cloud && !signedIn)) return;
    mineStatus.textContent = say('loading');
    mineLoading = Promise.resolve().then(() => store.list({ scope: 'mine' })).then((pages) => {
      const list = listOf(pages);
      mineStatus.textContent = list.length ? '' : say('mine_empty');
      mineList.replaceChildren(...list.map(pageCard));
    }, (error) => {
      mineStatus.textContent = say('list_failed', { message: errorText(error) });
      mineList.replaceChildren(el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => { mineLoading = null; loadMine(); } }, say('retry')));
    }).finally(() => { mineLoading = null; });
  }

  // ---- Templates: each page drawn at 960px, scaled to its card's width.
  const THUMB_WIDTH = 960;
  const view = doc.defaultView;
  const fitThumb = (frame) => frame.style.setProperty('--ui-thumb-scale', String(Math.max(0.05, frame.clientWidth / THUMB_WIDTH)));
  const thumbs = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver((entries) => entries.forEach((entry) => fitThumb(entry.target))) : null;
  function thumbnail(template) {
    const frame = el(doc, 'div', { class: 'ui-builder-thumb', 'aria-hidden': 'true' });
    frame.inert = true;
    try {
      const page = createPage(registry, { template: template.key, ids: drawIds() });
      const tree = renderPage(page, { registry, mode: 'canvas', baseurl, pageOrigin, renderers: contentRenderers });
      frame.appendChild(el(doc, 'div', { class: 'ui-builder-thumb-page' }, toDOM(tree, { doc, renderRich })));
    } catch (error) {
      console.error('UI Builder: a template could not be drawn', template.key, error);
    }
    if (thumbs) thumbs.observe(frame);
    return frame;
  }
  // A card, not one big button: the drawn page inside isn't phrasing content. The whole card is a
  // pointer target; the button is the keyboard and screen reader one.
  panels.templates.append(el(doc, 'p', { class: 'ocs__text' }, say('templates_lead')),
    el(doc, 'div', { class: 'ocs__hub-grid ui-builder-templates' }, listOf(registry.templates).map((template) => {
      // The name starts with the words the button shows, so "click Use template" works by voice.
      const use = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent fill', 'aria-label': say('template_use', { label: template.label }) }, say('template_start'));
      const card = el(doc, 'div', { class: 'ocs__hub-card ocs__stack', 'data-template': template.key },
        thumbnail(template), el(doc, 'strong', { class: 'ocs__hub-card-title' }, template.label), el(doc, 'p', null, template.help || ''),
        el(doc, 'div', { class: 'ocs__links' }, use));
      card.addEventListener('click', () => actions.create(template.key));
      return card;
    })));

  // ---- Class pages (teachers)
  const classRows = el(doc, 'tbody');
  const classStatus = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
  const course = el(doc, 'select', { class: 'ocs__input', id: 'ui-class-course' }, el(doc, 'option', { value: '' }, say('class_all_courses')),
    listOf(registry.courses).map((option) => el(doc, 'option', { value: option.value }, option.label)));
  const status = el(doc, 'select', { class: 'ocs__input', id: 'ui-class-status' }, el(doc, 'option', { value: '' }, say('class_status_all')),
    ['DRAFT', 'PUBLISHED'].map((value) => el(doc, 'option', { value }, say(`status_${value}`))));
  const changes = el(doc, 'input', { type: 'checkbox', class: 'ocs__toggle-input', id: 'ui-class-changes' });
  const requested = el(doc, 'input', { type: 'checkbox', class: 'ocs__toggle-input', id: 'ui-class-requested' });
  const toggle = (input, label) => el(doc, 'label', { class: 'ocs__toggle' }, input, el(doc, 'span', { class: 'ocs__toggle-track', 'aria-hidden': 'true' }), el(doc, 'span', { class: 'ocs__toggle-label' }, label));
  let classPages = [];
  const bulk = el(doc, 'button', { type: 'button', class: 'ocs__btn', onclick: () => {
    if (!course.value) { actions.message(say('class_bulk_pick'), { error: true }); course.focus(); return; }
    actions.bulkPublic(course.value).then(loadClass);
  } }, '');
  function paintBulk() {
    const label = course.value ? (listOf(registry.courses).find((option) => option.value === course.value) || {}).label : '…';
    bulk.textContent = text('teacher.bulk_public', { course: label || course.value });
  }
  const classTable = el(doc, 'table', { class: 'ocs__table', tabindex: '-1' });
  function paintClass() {
    const shown = filterClassPages(classPages, { status: status.value, changes: changes.checked, requested: requested.checked });
    classStatus.textContent = shown.length ? '' : say('class_empty');
    classRows.replaceChildren(...shown.map((summary) => {
      const ref = refOf(summary, true);
      const published = summary.status === 'PUBLISHED';
      const run = (action, fn) => () => Promise.resolve(fn(ref, summary)).then(() => loadClass()).then(() => refocusRow(summary.id, action));
      return el(doc, 'tr', { 'data-page-id': String(summary.id) },
        el(doc, 'td', null, el(doc, 'strong', null, summary.title || text('blocks.untitled')), summary.ownerName ? [el(doc, 'br'), say('class_owner', { name: summary.ownerName })] : null),
        el(doc, 'td', null, pill(say(`status_${published ? 'PUBLISHED' : 'DRAFT'}`), published ? 'good' : 'neutral'), ' ',
          summary.hasUnpublishedChanges ? pill(say('changes_pending'), 'warn') : null, ' ',
          summary.publicRequested ? pill(text('teacher.public_requested'), 'warn') : null, ' ',
          approvalPill(summary)),
        el(doc, 'td', null, formatWhen(summary.updatedAt)),
        el(doc, 'td', null, el(doc, 'div', { class: 'ocs__links' },
          el(doc, 'a', { class: 'ocs__btn small', href: actions.openDraft(ref), target: '_blank', rel: 'noopener' }, say('class_open_draft')),
          el(doc, 'button', { type: 'button', class: 'ocs__btn small', 'data-ui-action': 'revisions', onclick: () => actions.revisions(ref, summary) }, say('revisions')),
          // The copy Approve shows to everyone, which can differ from the draft.
          published && summary.slug ? el(doc, 'a', { class: 'ocs__btn small', href: actions.openPublished(summary), target: '_blank', rel: 'noopener' }, say('class_open_published')) : null,
          published && publicStateOf(summary) !== 'public' ? el(doc, 'button', { type: 'button', class: 'ocs__btn small accent', 'data-ui-action': 'approve', onclick: run('approve', actions.approve) }, text('teacher.approve_public')) : null,
          published ? el(doc, 'button', { type: 'button', class: 'ocs__btn small', 'data-ui-action': 'unpublish', onclick: run('unpublish', actions.unpublish) }, say('unpublish')) : null)));
    }));
  }
  // Repainting replaces the row whose button had the keyboard: it goes back to the same button of
  // the same page, else that row's first control, else the table. A click elsewhere meanwhile wins.
  function refocusRow(id, action) {
    const active = doc.activeElement;
    if (active && active !== doc.body && doc.contains(active)) return;
    const row = [...classRows.children].find((item) => item.getAttribute('data-page-id') === String(id));
    const controls = row ? [...row.querySelectorAll('a, button')] : [];
    (controls.find((control) => control.getAttribute('data-ui-action') === action) || controls[0] || classTable).focus();
  }
  let classLoading = null;
  function loadClass() {
    if (!caps.teacher || classLoading) return classLoading;
    classStatus.textContent = say('loading');
    classLoading = Promise.resolve().then(() => store.list({ scope: 'class', course: course.value })).then((pages) => {
      classPages = listOf(pages);
      paintClass();
    }, (error) => {
      classStatus.textContent = say('list_failed', { message: errorText(error) });
    }).finally(() => { classLoading = null; });
    return classLoading;
  }
  if (caps.teacher) {
    course.addEventListener('change', () => { paintBulk(); loadClass(); });
    for (const control of [status, changes, requested]) control.addEventListener('change', paintClass);
    paintBulk();
    panels.class.append(el(doc, 'p', { class: 'ocs__text' }, say('class_lead')),
      el(doc, 'div', { class: 'ui-builder-filters' },
        el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: 'ui-class-course' }, say('class_course')), course),
        el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: 'ui-class-status' }, say('class_status')), status),
        toggle(changes, say('class_changes')), toggle(requested, text('teacher.public_requested'))),
      el(doc, 'div', { class: 'ocs__links' }, bulk), classStatus,
      el(doc, 'div', { class: 'ocs__table-wrap' }, classTable));
    classTable.append(el(doc, 'thead', null, el(doc, 'tr', null, ['col_page', 'col_status', 'col_updated', 'col_actions'].map((key) => el(doc, 'th', { scope: 'col' }, say(key))))), classRows);
  }

  // tabindex -1: the app puts the keyboard here when it opens this screen from another one.
  const heading = el(doc, 'h1', { tabindex: '-1' }, say('title'));
  root.replaceChildren(el(doc, 'div', { class: 'ocs__container ocs__container--fill ocs__stack ui-builder-start' },
    heading, el(doc, 'p', { class: 'ocs__text ocs__lead' }, say('start_lead')),
    tabList, Object.values(panels)));
  select('mine');
  return { select, reload: loadMine, heading, destroy() { if (thumbs) thumbs.disconnect(); } };
}
