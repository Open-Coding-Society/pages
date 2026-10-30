// One page open in the editor (DESIGN §10): the undo history, the selection, the structure
// commands (add, move, duplicate, hide, remove; buttons, keys, drag and the canvas all end here),
// publishing, exports, revisions, leases and conflicts. Every change goes through commit():
// history (typing merges per field), validation, outline, inspector, canvas, then the session.
import {
  addBlock, addSection, countLive, duplicateNode, findNode, moveNode, moveNodeTo, removeNode,
  setHidden, updatePageSettings, updateSettings, validatePage,
} from './page-model.js';
import { defOf } from './registry.js';
import { createHistory } from './history.js';
import { pageToJSON } from './export.js';
import { suggestSlug } from './url-rules.js';
import { createCanvasBridge } from './canvas-bridge.js';
import { createShortcuts, isMacPlatform } from './editor-shortcuts.js';
import { createOutline } from './editor-outline.js';
import { createInspector } from './editor-inspector.js';
import { createPalette } from './editor-palette.js';
import { createCodeView } from './editor-code.js';
import { createLeaseBanner, formatWhen } from './editor-dialogs.js';
import { canPublish, createSession, fieldsOf, publishStateOf, saveStateOf } from './editor-session.js';
import { el } from './editor-fields.js';
import { pageActions } from './editor-actions.js';

const FEEDBACK_MS = 4000;
const CLOSE_FLUSH_MS = 3000;
// The registry limit each page-wide refusal names as {max}.
const REFUSAL_LIMITS = { too_many_sections: 'sections', too_many_blocks: 'blocks_per_section', too_many_live: 'live_blocks', too_big: 'spec_chars' };
const own = (value, key) => (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined);
const blockCount = (section) => section.cells.reduce((sum, cell) => sum + cell.blocks.length, 0);
const issueId = (issue) => JSON.stringify([issue.nodeId, issue.field, issue.key]);

// A node's registry label ("Card", "Columns"), or '' when it isn't on the page.
export function nodeLabel(registry, page, id) {
  const loc = findNode(page, id);
  const def = loc ? defOf(registry, loc.kind === 'section' ? 'frame' : 'block', loc.node.type) : null;
  return def ? def.label : '';
}

export class EditSession {
  constructor(app, shell, { ref, page, base, meta }) {
    Object.assign(this, { app, shell, doc: app.doc, win: app.win, registry: app.registry, store: app.store, caps: app.caps, say: app.say, text: app.text });
    this.limits = this.registry.limits || {};
    this.state = { selectedId: null, issues: [], readOnly: false, pendingTeam: undefined, realData: false };
    this.pageIssue = ''; // the page-wide problem the feedback line shows (showPageIssue)
    this.publishCheck = false; // Publish found problems: check the page as Publish does (checkIssues)
    this.history = createHistory(page, { limit: this.limits.history_limit || 100 });
    this.session = createSession({
      store: this.store, draftStore: app.deps.draftStore, ref, base, meta, win: this.win,
      getPage: () => this.page, getFields: () => this.fields(),
      onStatus: () => this.updateBar(),
      onSaved: ({ fields }) => {
        // Only the team this save carried is done: one picked while it was on its way goes next.
        const sent = own(fields, 'groupId');
        const picked = this.state.pendingTeam;
        if (sent !== undefined && picked !== undefined && (picked ? picked.id : null) === sent) this.state.pendingTeam = undefined;
        this.refreshPanels();
      },
      onConflict: (error) => this.conflict(error),
      onError: (error) => this.failed(error),
      onLease: (lease) => this.leaseChanged(lease),
      onCreated: (created) => {
        this.app.navigate(created.ref, { replace: true });
        this.session.startLease().catch(() => {});
        this.refreshPanels();
      },
    });
  }

  get page() { return this.history.present.page; }
  get ref() { return this.session.ref; }
  get meta() { return this.session.meta; }

  fields() {
    const fields = fieldsOf(this.page);
    if (this.state.pendingTeam !== undefined) fields.groupId = this.state.pendingTeam ? this.state.pendingTeam.id : null;
    return fields;
  }

  start({ dirty = false, notes = [], error = null } = {}) {
    const { shell, doc, say } = this;
    const dialogs = this.app.dialogs;
    this.outline = createOutline({ root: shell.outlinePane, doc, registry: this.registry, say, actions: {
      select: (id) => this.select(id), move: (id, delta) => this.move(id, delta), duplicate: (id) => this.duplicate(id),
      toggleHidden: (id) => this.toggleHidden(id), remove: (id) => this.remove(id), addBlock: (target) => this.openPalette(target),
      addSection: () => this.openSections(), drop: (id, target) => this.drop(id, target),
    } });
    this.inspector = createInspector({
      root: shell.inspectorPane, doc, registry: this.registry, say, text: this.text, richText: this.app.deps.richText,
      services: {
        groups: this.app.groups(), errorText: (error) => this.app.errorText(error),
        showCode: (code) => dialogs.textExport({ title: say('code_title'), content: code, filename: 'api-data.js', mime: 'text/javascript' }),
        openPublished: (slug) => this.app.viewerUrl({ slug }),
      },
      apiOptions: { pageOrigin: this.app.pageOrigin, pageHost: this.win.location.hostname, pageProtocol: this.win.location.protocol, baseurl: this.app.baseurl, cookieDomain: (this.registry.security || {}).cookie_domain || '' },
      actions: {
        changeSettings: (id, patch, meta) => this.commit(updateSettings(this.page, this.registry, id, patch), meta),
        changePage: (patch, meta) => this.commit(updatePageSettings(this.page, this.registry, patch), meta),
        nodeAction: (name, id) => this.nodeAction(name, id),
        changeTeam: (group) => { this.state.pendingTeam = group; this.session.change(); this.notify(say('team_saving')); this.refreshPanels(); },
        refreshEditors: () => this.mutate(() => this.store.refreshEditors(this.ref), say('team_refreshed')),
        setVisibility: (value) => this.setVisibility(value),
        unpublish: () => this.unpublish(),
        deletePage: () => this.deletePage(),
      },
    });
    this.palette = createPalette({ doc, registry: this.registry, say, dialogs });
    this.codeView = createCodeView({ doc, registry: this.registry, say, onSelect: (id) => this.select(id, { from: 'code' }) });
    shell.codePane.append(this.codeView.element);
    this.lease = createLeaseBanner(shell.banners, { doc, say, onTakeOver: () => this.takeOver() });
    this.bridge = createCanvasBridge({
      iframe: shell.iframe, baseurl: this.app.baseurl, win: this.win,
      onSelect: (id) => this.select(id, { from: 'canvas' }), onAddRequest: (target) => this.openPalette(target),
      onKey: (event) => this.shortcuts.handle(event, { fromCanvas: true }),
      onStatus: (status) => {
        shell.failed.hidden = status !== 'failed';
        shell.canvasStatus.textContent = status === 'loading' ? say('canvas_loading') : '';
      },
    });
    this.shortcuts = createShortcuts({ target: doc, mac: isMacPlatform(this.win.navigator), onAction: (action, info) => this.shortcut(action, info), isBlocked: (action, event, info) => this.blocked(action, event, info) });
    this.wireBar();
    this.unload = (event) => {
      const status = this.session.status();
      if (!status.pending && !status.saving && status.state !== 'error' && status.state !== 'conflict') return;
      event.preventDefault();
      event.returnValue = say('leave_warning');
    };
    this.win.addEventListener('beforeunload', this.unload);
    const wide = shell.paneOpen('outline');
    shell.setPane('outline', wide);
    shell.setPane('inspector', wide);
    this.offerRecovery();
    this.refresh();
    if (dirty) this.session.change();
    if (error) this.notify(error, { error: true });
    else if (notes.length) this.notify(this.importNote(notes));
    if (this.ref) this.session.startLease().catch(() => {});
  }

  importNote(notes) {
    const dropped = notes.filter((note) => note.key === 'unknown_type');
    if (dropped.length) return this.say('import_dropped', { types: dropped.map((note) => note.message).join(' ') });
    return this.say('import_issues', { count: notes.length });
  }

  wireBar() {
    const { shell, say } = this;
    shell.title.addEventListener('click', () => { this.select(null); this.focusInspector(); });
    for (const [name, button] of shell.viewButtons) button.addEventListener('click', () => this.setView(name));
    shell.undo.addEventListener('click', () => this.undo());
    shell.redo.addEventListener('click', () => this.redo());
    shell.realInput.addEventListener('change', () => { this.state.realData = shell.realInput.checked; this.drawCanvas(); });
    shell.reload.addEventListener('click', () => this.bridge.reload());
    shell.dismiss.addEventListener('click', () => this.notify(''));
    shell.publish.addEventListener('click', () => this.publish());
    shell.preview.addEventListener('click', (event) => {
      event.preventDefault();
      if (!this.ref) return;
      const url = this.previewUrl();
      // Opened inside the click so it isn't blocked; it gets the address once the draft is saved.
      const tab = this.win.open('about:blank', '_blank');
      if (tab) tab.opener = null;
      this.session.flush().catch(() => {}).finally(() => {
        if (tab) tab.location.href = url;
        else this.notify('', { link: { href: url, label: say('preview_draft') } }); // pop-ups blocked: a link instead
      });
    });
    const menu = {
      export_page: () => this.exportFile(),
      export_json: () => this.app.dialogs.textExport({ title: say('json_title'), help: say('json_help'), content: pageToJSON(this.page), filename: `${this.fileName()}.json`, mime: 'application/json' }),
      show_html: () => this.showHtml(this.state.selectedId),
      revisions: () => this.revisions(),
      page_settings: () => { this.select(null); this.focusInspector(); },
    };
    for (const [name, item] of shell.menuItems) item.addEventListener('click', () => menu[name]());
  }

  previewUrl() {
    return this.ref.kind === 'local' ? this.app.viewerUrl({ local: this.ref.id }) : this.app.viewerUrl({ draft: this.ref.id });
  }

  fileName() {
    const meta = this.meta;
    return meta && meta.slug ? meta.slug : suggestSlug(own(this.page.page, 'title'));
  }

  labelOf(id) {
    return nodeLabel(this.registry, this.page, id);
  }

  // ---- drawing

  refresh() {
    this.drawCanvas();
    this.refreshPanels();
  }

  refreshPanels() {
    const { page } = this;
    this.state.issues = this.checkIssues(page);
    const state = { ...this.state, ref: this.ref, meta: this.meta || {}, capabilities: this.caps };
    this.outline.update(page, state);
    this.inspector.update(page, state);
    this.updateBar();
    this.showPageIssue();
    this.drawCode();
  }

  // The code view is drawn only while it shows; switching to it draws it at once.
  drawCode() {
    if (this.closed || !this.codeView || this.shell.view !== 'code') return;
    this.codeView.update(this.page, { ctx: this.app.exportContext(this.meta), selectedId: this.state.selectedId });
  }

  // Preview and Code show the same selection: the one that comes into view is scrolled to it.
  setView(name) {
    this.shell.setView(name);
    const id = this.state.selectedId;
    if (this.shell.view === 'code') {
      this.drawCode();
      if (id) this.codeView.reveal(id);
    } else if (id) {
      this.bridge.scrollTo(id);
    }
  }

  // The problems the outline and the inspector show. A draft may use the student's own computer
  // (links, pictures, an API there), so those problems wait for Publish. Once Publish has found
  // problems (publishCheck), every change is checked as Publish checks it, so they show where a
  // draft's do. The first check that finds none of them left turns publishCheck off again, as
  // loading another version of the page does (reloadFromStore).
  checkIssues(page) {
    const options = { validators: this.app.validators, baseurl: this.app.baseurl, pageOrigin: this.app.pageOrigin };
    const draft = validatePage(page, this.registry, options);
    if (!this.publishCheck) return draft;
    const published = validatePage(page, this.registry, { ...options, publish: true });
    const known = new Set(draft.map(issueId));
    if (published.some((issue) => !known.has(issueId(issue)))) return published;
    this.publishCheck = false;
    return draft;
  }

  drawCanvas() {
    if (this.drawQueued) return;
    this.drawQueued = true;
    this.win.requestAnimationFrame(() => {
      this.drawQueued = false;
      if (!this.closed) this.bridge.render(this.page, { realData: this.state.realData });
    });
  }

  updateBar() {
    const { shell, say, caps } = this;
    if (!shell || this.closed || !this.outline) return;
    const status = this.session.status();
    const meta = this.meta;
    const dirty = status.pending || status.saving;
    const title = own(this.page.page, 'title') || this.text('blocks.untitled');
    shell.title.textContent = title;
    shell.title.setAttribute('aria-label', say('edit_title', { title }));
    const save = saveStateOf(status, { cloud: caps.cloud, readOnly: this.state.readOnly, created: Boolean(this.ref), formatTime: (ms) => formatWhen(ms) });
    shell.saveState.textContent = say(save.key, save.vars);
    shell.saveState.className = `ocs__status-pill ocs__status-pill--${['save_conflict', 'save_error', 'save_retry'].includes(save.key) ? 'bad' : 'neutral'}`;
    const published = publishStateOf(meta, { publish: caps.publish, dirty });
    shell.publishState.hidden = !published;
    shell.publishState.textContent = published ? say(published) : '';
    shell.publishState.className = `ocs__status-pill ocs__status-pill--${published === 'pub_live' ? 'good' : 'neutral'}`;
    shell.undo.disabled = this.state.readOnly || !this.history.canUndo();
    shell.redo.disabled = this.state.readOnly || !this.history.canRedo();
    const isLive = Boolean(meta && meta.status === 'PUBLISHED' && meta.slug);
    shell.publish.textContent = say(isLive ? 'publish_changes' : 'publish');
    const allowed = Boolean(this.ref) && canPublish(meta, { publish: caps.publish, dirty, readOnly: this.state.readOnly });
    shell.publish.disabled = !allowed;
    shell.publish.title = allowed ? '' : say('publish_none');
    shell.liveWrap.hidden = !isLive;
    if (isLive) shell.live.href = this.app.viewerUrl({ slug: meta.slug });
    shell.previewWrap.hidden = !this.ref;
    if (this.ref) shell.preview.href = this.previewUrl();
    const hasApi = this.page.sections.some((section) => section.cells.some((cell) => cell.blocks.some((block) => block.type === 'api_data')));
    shell.realData.hidden = !hasApi;
    const selected = findNode(this.page, this.state.selectedId);
    shell.menuItems.get('show_html').disabled = !selected || selected.kind !== 'block';
    if (shell.menuItems.has('revisions')) shell.menuItems.get('revisions').disabled = !this.ref;
  }

  notify(message, { error = false, link = null } = {}) {
    const { shell } = this;
    clearTimeout(this.feedbackTimer);
    shell.feedbackText.replaceChildren(message || '');
    if (link) shell.feedbackText.append(' ', el(this.doc, 'a', { href: link.href, target: '_blank', rel: 'noopener' }, link.label));
    shell.feedback.toggleAttribute('data-error', Boolean(error && message));
    shell.dismissWrap.hidden = !(error && message);
    // Errors stay until dismissed or replaced; routine news fades.
    if (message && !error) this.feedbackTimer = setTimeout(() => this.notify(''), FEEDBACK_MS);
  }

  failed(error) {
    const details = Array.isArray(error && error.details) ? error.details : [];
    const first = details.find((detail) => detail && detail.key);
    if (first) {
      this.notify(this.refusalText(first), { error: true });
      if (first.nodeId) this.select(first.nodeId);
      return;
    }
    this.notify(this.app.errorText(error), { error: true });
  }

  // Spring's refusal of one part of the page, in the words the editor has for the same problem:
  // the matching local issue (already worded with its numbers), else the editor's own issue on that
  // field, which says more when Spring names the problem differently (bad_image for a gallery
  // picture on the student's computer, loopback_link here), else the registry text with the limit
  // it names. Words that still miss a number, or no words at all, give the general refusal.
  refusalText(detail) {
    const nodeId = detail.nodeId === 'page' ? null : detail.nodeId || null;
    const onNode = this.state.issues.filter((issue) => (issue.nodeId || null) === nodeId);
    const local = onNode.filter((issue) => issue.key === detail.key);
    // Spring names a settings key; the editor's issue can sit inside it ("links.0.url").
    const field = typeof detail.field === 'string' ? detail.field : '';
    const onField = field ? onNode.find((issue) => typeof issue.field === 'string' && (issue.field === field || issue.field.startsWith(`${field}.`))) : null;
    const match = local.find((issue) => issue.field === detail.field) || local[0] || onField;
    if (match) return match.message;
    const path = `errors.${detail.key}`;
    const message = this.text(path, { field: detail.field || '', ...this.limitVars(detail.key) });
    return message === path || /\{\w+\}/.test(message) ? this.text('store.invalid_spec') : message;
  }

  limitVars(key) {
    const vars = {};
    const limit = own(REFUSAL_LIMITS, key);
    if (limit && Number.isInteger(this.limits[limit])) vars.max = this.limits[limit];
    if (key === 'too_big') vars.size = JSON.stringify(this.page).length;
    return vars;
  }

  // Problems with the whole page (too big to save, too many sections or live blocks) have no row
  // in the outline and no field in the inspector, so the feedback line shows the first one when it
  // appears or changes, and clears it once it is fixed.
  showPageIssue() {
    const issue = this.state.issues.find((item) => !item.nodeId && !item.field);
    const message = issue ? issue.message : '';
    if (message === this.pageIssue) return;
    const showing = Boolean(this.pageIssue) && this.shell.feedbackText.textContent === this.pageIssue;
    this.pageIssue = message;
    if (message) this.notify(message, { error: true });
    else if (showing) this.notify('');
  }

  // ---- selection and changes

  select(id, { from = 'app' } = {}) {
    const loc = id ? findNode(this.page, id) : null;
    this.state.selectedId = loc ? id : null;
    this.bridge.select(this.state.selectedId);
    if (from !== 'canvas' && this.state.selectedId) this.bridge.scrollTo(this.state.selectedId);
    if ((from === 'canvas' || from === 'code') && !this.shell.paneOpen('inspector')) this.shell.setPane('inspector', true);
    this.refreshPanels();
    if (from !== 'code' && this.state.selectedId && this.shell.view === 'code') this.codeView.reveal(this.state.selectedId);
  }

  focusInspector() {
    if (!this.shell.paneOpen('inspector')) this.shell.setPane('inspector', true);
    this.inspector.focusFirst();
  }

  commit(next, { coalesceKey = null, selectedId = this.state.selectedId, announce = '' } = {}) {
    if (this.state.readOnly || this.closed || next === this.page) return false;
    if (!this.history.push(next, { coalesceKey, selectedId })) return false;
    this.state.selectedId = selectedId && findNode(next, selectedId) ? selectedId : null;
    this.session.change();
    this.refresh();
    this.bridge.select(this.state.selectedId);
    if (announce) this.notify(announce);
    return true;
  }

  step(entry, done, none) {
    if (!entry) { this.notify(this.say(none)); return; }
    this.state.selectedId = entry.selectedId && findNode(entry.page, entry.selectedId) ? entry.selectedId : null;
    this.session.change();
    this.refresh();
    this.bridge.select(this.state.selectedId);
    this.notify(this.say(done));
  }

  undo() { if (!this.state.readOnly) this.step(this.history.undo(), 'undone', 'nothing_to_undo'); }

  redo() { if (!this.state.readOnly) this.step(this.history.redo(), 'redone', 'nothing_to_redo'); }

  nodeAction(name, id = this.state.selectedId) {
    const run = { move_up: () => this.move(id, -1), move_down: () => this.move(id, 1), duplicate: () => this.duplicate(id), toggle_hidden: () => this.toggleHidden(id), remove: () => this.remove(id), select_parent: () => this.selectParent(id), show_html: () => this.showHtml(id) }[name];
    if (run && id) run();
  }

  describeMove(page, id) {
    const loc = findNode(page, id);
    const label = this.labelOf(id);
    if (!loc) return '';
    if (loc.kind === 'section') return this.say('moved', { label, position: loc.sectionIndex + 1, total: page.sections.length });
    const total = loc.section.cells[loc.cellIndex].blocks.length;
    if (loc.section.type !== 'columns') return this.say('moved', { label, position: loc.index + 1, total });
    return this.say('moved_cell', { label, column: this.say('outline_column', { n: loc.cellIndex + 1 }), position: loc.index + 1, total });
  }

  move(id, delta) {
    const next = moveNode(this.page, id, delta);
    if (next === this.page) this.notify(this.say('moved_none', { label: this.labelOf(id) }));
    else if (this.overBlockLimit(next, id, this.sectionIdOf(id))) this.tooManyBlocks();
    else this.commit(next, { selectedId: id, announce: this.describeMove(next, id) });
  }

  drop(id, target) {
    const next = moveNodeTo(this.page, id, target);
    if (next === this.page) return;
    if (this.overBlockLimit(next, id, this.sectionIdOf(id))) this.tooManyBlocks();
    else this.commit(next, { selectedId: id, announce: this.describeMove(next, id) });
  }

  overLiveLimit(page) {
    return countLive(page, this.registry) > (this.limits.live_blocks || 8);
  }

  sectionIdOf(id) {
    const loc = findNode(this.page, id);
    return loc && loc.kind === 'block' ? loc.section.id : null;
  }

  // Whether block `id`, where it sits in `next`, leaves its section with more blocks than a section
  // may hold (the canvas would leave the extra one out, and Spring refuses the page). A move
  // within its own section (fromSectionId) adds nothing there.
  overBlockLimit(next, id, fromSectionId = null) {
    const loc = findNode(next, id);
    if (!loc || loc.kind !== 'block' || loc.section.id === fromSectionId) return false;
    return blockCount(loc.section) > this.limits.blocks_per_section;
  }

  tooManyBlocks() {
    this.notify(this.text('errors.too_many_blocks', { max: this.limits.blocks_per_section }), { error: true });
  }

  duplicate(id) {
    const loc = findNode(this.page, id);
    if (!loc) return;
    const newId = this.app.ids(loc.kind === 'section' ? 's' : 'b');
    const next = duplicateNode(this.page, id, { ids: this.app.ids, newId });
    if (loc.kind === 'section' && this.page.sections.length >= this.limits.sections) { this.notify(this.text('errors.too_many_sections', { max: this.limits.sections }), { error: true }); return; }
    if (loc.kind === 'block' && this.overBlockLimit(next, newId)) { this.tooManyBlocks(); return; }
    if (this.overLiveLimit(next)) { this.notify(this.say('live_limit', { max: this.limits.live_blocks }), { error: true }); return; }
    this.commit(next, { selectedId: newId, announce: this.say('duplicated', { label: this.labelOf(id) }) });
  }

  toggleHidden(id) {
    const loc = findNode(this.page, id);
    if (!loc) return;
    const hide = loc.node.hidden !== true;
    this.commit(setHidden(this.page, id, hide), { selectedId: id, announce: this.say(hide ? 'hidden_done' : 'shown_done', { label: this.labelOf(id) }) });
  }

  remove(id) {
    const loc = findNode(this.page, id);
    if (!loc) return;
    const label = this.labelOf(id);
    let after = null;
    if (loc.kind === 'block') {
      const blocks = loc.section.cells[loc.cellIndex].blocks;
      after = (blocks[loc.index + 1] || blocks[loc.index - 1] || loc.section).id;
    } else {
      const sections = this.page.sections;
      after = (sections[loc.sectionIndex + 1] || sections[loc.sectionIndex - 1] || {}).id || null;
    }
    this.commit(removeNode(this.page, id), { selectedId: after, announce: this.say('removed', { label }) });
  }

  selectParent(id = this.state.selectedId) {
    const loc = findNode(this.page, id);
    this.select(loc && loc.kind === 'block' ? loc.section.id : null);
  }

  // Where a new block goes: after the selected block, at the end of the selected section's first
  // cell, else at the end of the last section.
  insertTarget(page) {
    const loc = findNode(page, this.state.selectedId);
    if (loc && loc.kind === 'block') return { sectionId: loc.section.id, cellIndex: loc.cellIndex, index: loc.index + 1 };
    if (loc) return { sectionId: loc.node.id, cellIndex: 0 };
    const last = page.sections[page.sections.length - 1];
    return last ? { sectionId: last.id, cellIndex: last.cells.length - 1 } : null;
  }

  addBlockAt(type, target) {
    let page = this.page;
    let where = target || this.insertTarget(page);
    if (!where) {
      const sectionId = this.app.ids('s');
      page = addSection(page, this.registry, { type: 'stack', newId: sectionId });
      where = { sectionId, cellIndex: 0 };
    }
    const section = findNode(page, where.sectionId);
    if (section && blockCount(section.node) >= this.limits.blocks_per_section) { this.tooManyBlocks(); return; }
    const newId = this.app.ids('b');
    const next = addBlock(page, this.registry, { type, sectionId: where.sectionId, cellIndex: where.cellIndex, index: where.index, ids: this.app.ids, newId });
    if (next === page) return;
    const label = (defOf(this.registry, 'block', type) || {}).label || type;
    if (this.commit(next, { selectedId: newId, announce: this.say('added', { label }) })) {
      this.bridge.scrollTo(newId);
      this.focusInspector();
    }
  }

  openPalette(target = null) {
    if (this.state.readOnly) return;
    this.palette.openBlocks({ capabilities: { spring: this.caps.cloud === true, flask: true }, liveCount: countLive(this.page, this.registry), onPick: (item) => this.addBlockAt(item.type, target) });
  }

  openSections() {
    if (this.state.readOnly) return;
    if (this.page.sections.length >= this.limits.sections) { this.notify(this.text('errors.too_many_sections', { max: this.limits.sections }), { error: true }); return; }
    this.palette.openSections({ onPick: ({ type, layout }) => {
      const loc = findNode(this.page, this.state.selectedId);
      const newId = this.app.ids('s');
      const next = addSection(this.page, this.registry, { type, layout, index: loc ? loc.sectionIndex + 1 : this.page.sections.length, newId });
      this.commit(next, { selectedId: newId, announce: this.say('added', { label: nodeLabel(this.registry, next, newId) || type }) });
    } });
  }
}

// Publishing, exports, revisions, leases, conflicts and closing live in editor-actions.js.
Object.assign(EditSession.prototype, pageActions);
