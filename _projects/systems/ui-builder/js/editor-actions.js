// EditSession's page-level actions (mixed into its prototype by editor-edit.js): shortcuts,
// publish (flush the autosave, validate as Spring will, confirm the address, publish), the page
// file / HTML exports, revisions, visibility, unpublish and delete, the edit lease (read-only
// while someone else edits), the conflict choice, crash recovery and closing the page.
import { findNode, normalizePage, validatePage } from './page-model.js';
import { pageToMarkdown } from './export.js';
import { slugIssue, suggestSlug } from './url-rules.js';
import { formatWhen } from './editor-dialogs.js';
import { el } from './editor-fields.js';

const STRUCTURE = new Set(['duplicate', 'move_up', 'move_down', 'remove']);
// Keys that act on one part of the page: the part the keyboard is on, when it is on one.
const ON_PART = new Set([...STRUCTURE, 'escape', 'palette']);
const CLOSE_FLUSH_MS = 3000;
const titleOf = (page) => (page && page.page && typeof page.page.title === 'string' ? page.page.title : '');

export const pageActions = {
  // The block or section a key acts on: the one whose outline row has the keyboard (or, from
  // the canvas, whose content does), else the selection. null on an Add block or Column row or a
  // canvas add button, where a structure key has no part to act on.
  keyTarget(event, { fromCanvas } = {}) {
    let focused;
    if (fromCanvas) {
      // canvas.js says '' for its add buttons and null when nothing in the page has focus.
      focused = event && typeof event.nodeId === 'string' ? event.nodeId : undefined;
    } else {
      const row = event && event.target;
      if (row && typeof row.getAttribute === 'function' && row.getAttribute('role') === 'treeitem' && this.shell.outlinePane.contains(row)) {
        const kind = row.getAttribute('data-kind');
        focused = kind === 'block' || kind === 'section' ? row.getAttribute('data-key') : '';
      }
    }
    if (focused === undefined) return this.state.selectedId;
    return focused && findNode(this.page, focused) ? focused : null;
  },

  shortcut(action, { event, fromCanvas } = {}) {
    // The part the keyboard is on becomes the selection first, so the inspector and the canvas
    // show what the key changed (arrows in the outline move focus, not the selection).
    if (ON_PART.has(action)) {
      const target = this.keyTarget(event, { fromCanvas });
      if (target && target !== this.state.selectedId) this.select(target);
    }
    const id = this.state.selectedId;
    const run = {
      undo: () => this.undo(), redo: () => this.redo(), duplicate: () => this.duplicate(id), move_up: () => this.move(id, -1),
      move_down: () => this.move(id, 1), remove: () => this.remove(id), palette: () => this.openPalette(),
      escape: () => this.selectParent(), regions: () => this.cycleRegion(Boolean(event && event.shiftKey)),
    }[action];
    if (run) run();
    // A structure key pressed in the outline keeps the keyboard on the tree, on the moved row.
    if (!fromCanvas && STRUCTURE.has(action) && this.shell.outlinePane.contains(this.doc.activeElement)) this.outline.focusSelected();
  },

  blocked(action, event, { fromCanvas } = {}) {
    if (this.closed || this.app.dialogs.isOpen()) return true;
    if (action === 'regions') return false;
    if (this.state.readOnly && action !== 'escape') return true;
    // "/" works only while the outline or the canvas has the keyboard, so a "/" that speech
    // input types while a button has focus opens nothing (WCAG 2.1.4).
    if (action === 'palette') return !fromCanvas && !this.shell.outlinePane.contains(event && event.target);
    if (ON_PART.has(action) && !this.keyTarget(event, { fromCanvas })) return true;
    // Delete and Backspace change the page only from the outline, the canvas or no focus at all,
    // never from a button in the inspector or the top bar.
    if (action === 'remove' && !fromCanvas) {
      const target = event && event.target;
      return !(target === this.doc.body || this.shell.outlinePane.contains(target));
    }
    return false;
  },

  // Ctrl+`: outline → canvas → inspector → top bar (Shift goes back), opening a closed pane.
  cycleRegion(back) {
    const { shell } = this;
    const regions = [
      { has: (node) => shell.outlinePane.contains(node), focus: () => { if (!shell.paneOpen('outline')) shell.setPane('outline', true); this.outline.focus(); } },
      { has: (node) => node === shell.iframe, focus: () => this.bridge.focus() },
      { has: (node) => shell.inspectorPane.contains(node), focus: () => this.focusInspector() },
      { has: (node) => shell.element.firstChild.contains(node), focus: () => shell.title.focus() },
    ];
    const at = regions.findIndex((region) => region.has(this.doc.activeElement));
    const next = at === -1 ? (back ? regions.length - 1 : 0) : (at + (back ? -1 : 1) + regions.length) % regions.length;
    regions[next].focus();
  },

  async mutate(run, message) {
    try {
      const result = await run();
      if (result && result.base !== undefined) this.session.setBase(result.base);
      if (result && result.meta) this.session.setMeta(result.meta);
      if (message) this.notify(message);
      this.refreshPanels();
      return result;
    } catch (error) {
      this.failed(error);
      return null;
    }
  },

  async reloadFromStore() {
    const opened = await this.store.open(this.ref);
    const page = normalizePage(opened.page, this.registry, { ids: this.app.ids });
    const keep = findNode(page, this.state.selectedId) ? this.state.selectedId : null;
    this.history.reset(page, { selectedId: keep });
    this.session.reset({ base: opened.base, meta: opened.meta });
    this.state.selectedId = keep;
    this.publishCheck = false; // another version: nobody asked to publish it yet
    this.refresh();
    this.bridge.select(keep);
  },

  // Someone else holds the lease: read-only with a Take over button. Once it is ours again (taken
  // over, or theirs ran out), pick up their saves unless this tab still has changes to send.
  leaseChanged({ mine, holderName }) {
    if (!mine) {
      if (this.state.readOnly) return;
      this.state.readOnly = true;
      this.session.pause();
      this.lease.show(holderName);
      // The banner isn't a live region: the feedback line says why every field is locked.
      if (this.leaseHeld) this.notify(this.say('lease_lost', { name: holderName }), { error: true });
      else this.notify(this.say('lease_banner', { name: holderName || this.say('someone') }));
      this.leaseHeld = false;
      this.refreshPanels();
      return;
    }
    this.leaseHeld = true;
    if (!this.state.readOnly) return;
    const finish = () => {
      this.state.readOnly = false;
      this.lease.hide();
      this.notify(this.say('lease_taken'));
      this.refreshPanels();
    };
    if (this.session.status().pending) {
      this.session.resume();
      finish();
    } else {
      this.reloadFromStore().then(() => { this.session.resume(); finish(); }, (error) => this.failed(error));
    }
  },

  takeOver() {
    return this.session.takeLease().catch((error) => this.failed(error));
  },

  // publishing: the conflict came from Publish (its POST, or the save it waits for first), so
  // nothing was published, and after Keep mine saves, the student is told to publish again.
  async conflict(error, { publishing = this.publishing === true } = {}) {
    if (this.conflictOpen || this.closed) return;
    this.conflictOpen = true;
    const current = (error && error.current) || {};
    let askAgain = false;
    try {
      const choice = await this.app.dialogs.conflict({ name: current.savedByName || '', time: formatWhen(current.savedAt), local: !this.caps.revisions });
      if (choice === 'keep') {
        this.session.keepMine(current.base);
        // A failed save reports itself (its own conflict dialog or error).
        if (publishing) this.session.flush().then(() => this.notify(this.say('conflict_kept_publish')), () => {});
      } else if (choice === 'reload') {
        try {
          await this.reloadFromStore();
          this.notify(this.say('conflict_reloaded'));
        } catch (failure) {
          this.failed(failure);
          // Their version didn't load and saving is still paused: ask again, or the editor would
          // stay stuck with nothing able to reopen this choice.
          askAgain = this.session.status().state === 'conflict';
        }
      }
    } catch (failure) {
      this.failed(failure);
    } finally {
      this.conflictOpen = false;
    }
    if (askAgain && !this.closed) this.conflict(error, { publishing });
  },

  // A crash copy in this browser that differs from what the store has: offer it back. Restoring
  // keeps the copy's base version, so changes saved elsewhere since then come up as a conflict.
  offerRecovery() {
    const drafts = this.app.deps.draftStore;
    const key = drafts.keyFor(this.ref);
    const draft = this.ref ? drafts.read(key) : null;
    if (!draft || !draft.dirty || !draft.page) return;
    const page = normalizePage(draft.page, this.registry, { ids: this.app.ids });
    if (JSON.stringify(page) === JSON.stringify(this.page)) {
      drafts.clear(key);
      return;
    }
    const { doc, say } = this;
    const box = el(doc, 'div', { class: 'ui-builder-wrap' });
    const restore = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent', onclick: () => {
      box.remove();
      if (draft.baseVersion !== undefined && draft.baseVersion !== null) this.session.setBase(draft.baseVersion);
      this.commit(page, { selectedId: null });
    } }, say('recover_restore'));
    const discard = el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => { box.remove(); drafts.clear(key); } }, say('recover_discard'));
    box.appendChild(el(doc, 'div', { class: 'ocs__callout', role: 'status' }, say('recover_body', { time: formatWhen(draft.savedAt) }), ' ', restore, ' ', discard));
    this.shell.banners.appendChild(box);
  },

  absoluteViewer(slug) {
    return `${this.app.pageOrigin}${this.app.viewerUrl({ slug })}`;
  },

  async publish() {
    const { say } = this;
    if (!this.caps.publish) { this.notify(say('publish_local')); return; }
    if (this.publishing || this.state.readOnly) return;
    this.publishing = true;
    try {
      const before = this.session.status();
      if (before.pending || before.saving || !this.ref) this.notify(say('publish_wait'));
      await this.session.flush();
      if (!this.ref) return;
      const issues = validatePage(this.page, this.registry, { validators: this.app.validators, baseurl: this.app.baseurl, pageOrigin: this.app.pageOrigin, publish: true });
      if (issues.length) {
        this.notify(say('publish_fix', { count: issues.length }), { error: true });
        // Problems only a published page has (a link to the student's own computer) show in the
        // inspector and the outline too from now on, until they are fixed (checkIssues).
        this.publishCheck = true;
        const first = issues.find((issue) => issue.nodeId);
        this.select(first ? first.nodeId : null);
        return;
      }
      await this.publishWithAddress();
    } catch (failure) {
      // A conflict gets its dialog (conflict() does nothing while one is open); a paused autosave
      // means read-only.
      if (failure && failure.name === 'ConflictError') this.conflict(failure, { publishing: true });
      else if (failure && failure.code !== 'autosave_paused') this.failed(failure);
    } finally {
      this.publishing = false;
    }
  },

  async publishWithAddress() {
    const { say } = this;
    const meta = this.meta || {};
    const locked = Boolean(meta.slug);
    let slug = locked ? meta.slug : suggestSlug(titleOf(this.page));
    let error = '';
    for (;;) {
      const chosen = await this.app.dialogs.publish({
        address: (value) => this.absoluteViewer(value), slug, slugLocked: locked, error,
        checkSlug: (value) => this.store.slugAvailable(value), issueOf: (value) => slugIssue(value, this.registry),
      });
      if (typeof chosen !== 'string' || !chosen) return;
      slug = chosen;
      try {
        const result = await this.store.publish(this.ref, locked ? { base: this.session.base } : { base: this.session.base, slug });
        this.session.setBase(result.base);
        this.session.setMeta(result.meta);
        const address = this.absoluteViewer((result.meta && result.meta.slug) || slug);
        this.notify(say('published', { address }), { link: { href: address, label: say('open_live') } });
        this.refreshPanels();
        return;
      } catch (failure) {
        const code = failure && failure.error;
        if ((failure && failure.name === 'SlugTakenError') || code === 'slug_taken') { error = say('slug_taken'); continue; }
        if (['slug_reserved', 'invalid_slug', 'slug_required'].includes(code)) { error = this.text(`errors.${code === 'slug_reserved' ? 'slug_reserved' : 'slug_invalid'}`); continue; }
        if (failure && failure.name === 'ConflictError') { this.conflict(failure, { publishing: true }); return; }
        // A link to the student's computer that the check before publishing missed: Spring names the
        // block and the field, so failed() selects the block and refusalText words the problem.
        if (code === 'loopback_source') { this.failed(failure); return; }
        this.notify(say('publish_failed', { message: this.app.errorText(failure) }), { error: true });
        return;
      }
    }
  },

  exportFile() {
    try {
      const content = pageToMarkdown(this.page, this.app.exportContext(this.meta));
      this.app.dialogs.textExport({ title: this.say('export_title'), help: this.say('export_help'), content, filename: `${this.fileName()}.md`, mime: 'text/markdown' });
    } catch (error) {
      this.failed(error);
    }
  },

  // Show HTML: the code view, at this block.
  showHtml(id) {
    const loc = findNode(this.page, id);
    if (!loc || loc.kind !== 'block') return;
    this.select(id);
    this.setView('code');
  },

  async revisions() {
    if (!this.ref || !this.caps.revisions) return;
    // The newest draft becomes a revision first. Changes that can't be saved (a refused page, no
    // connection) are in no revision, so the restore confirm says they will be lost.
    const saved = await this.session.flush().then(() => true, () => false);
    const status = this.session.status();
    await this.app.dialogs.revisions({
      readOnly: this.state.readOnly,
      unsaved: !saved || status.pending || status.saving,
      load: () => this.store.revisions(this.ref),
      restore: async (revision) => {
        try {
          await this.store.restore(this.ref, revision.revisionId, { base: this.session.base });
        } catch (failure) {
          // Saved somewhere else since: load that version, so Restore again replaces it.
          if (failure && failure.name === 'ConflictError') await this.reloadFromStore();
          throw failure;
        }
        await this.reloadFromStore();
        this.notify(this.say('restored', { time: formatWhen(revision.savedAt) }));
      },
    });
  },

  async setVisibility(value) {
    let until;
    let publishedVersion;
    if (value === 'PUBLIC') {
      // Every PUBLIC request names the published copy the editor can see now (Open live page), so a
      // teacher whose whoami failed still passes it. Spring ignores it for a student's request.
      publishedVersion = (this.meta || {}).publishedVersion;
      if (this.caps.teacher) {
        const answer = await this.app.dialogs.askUntil();
        if (!answer) return;
        until = answer.until === null ? undefined : answer.until;
      }
    }
    await this.mutate(() => this.store.setVisibility(this.ref, { visibility: value, until, publishedVersion }).catch((failure) => {
      // A newer publish replaced that copy, or the page was unpublished since: pick up what the
      // page is now (the version for the next look and approval, or no published copy at all).
      if (failure && (failure.error === 'published_changed' || failure.error === 'not_published')) this.reloadMeta();
      throw failure;
    }), this.say('visibility_done'));
  },

  // The page's summary (publish state, visibility) from the store again; the page and its
  // unsaved changes stay as they are.
  async reloadMeta() {
    try {
      const opened = await this.store.open(this.ref);
      this.session.setMeta(opened.meta);
      this.refreshPanels();
    } catch (failure) {
      this.failed(failure);
    }
  },

  async unpublish() {
    const meta = this.meta || {};
    const sure = await this.app.dialogs.confirm({ title: this.say('unpublish_title'), body: this.say('unpublish_body', { address: meta.slug ? this.absoluteViewer(meta.slug) : titleOf(this.page) }), confirmLabel: this.say('unpublish') });
    if (sure) await this.mutate(() => this.store.unpublish(this.ref), this.say('unpublished'));
  },

  async deletePage() {
    const title = titleOf(this.page) || this.text('blocks.untitled');
    if (!(await this.app.dialogs.deletePage({ title }))) return;
    try {
      if (this.ref) await this.store.remove(this.ref);
      const drafts = this.app.deps.draftStore;
      drafts.clear(drafts.keyFor(this.ref));
      this.deleted = true;
      this.app.navigate(null);
      await this.app.route();
      this.app.message(this.say('deleted', { title }));
    } catch (error) {
      this.failed(error);
    }
  },

  // Leaving the page (back to My pages, another page): send what is pending, briefly; whatever
  // doesn't make it stays in this browser's draft copy.
  async close() {
    if (this.closed) return;
    const status = this.session.status();
    if (!this.deleted && (status.pending || status.saving)) {
      let timer;
      try {
        await Promise.race([this.session.flush(), new Promise((resolve, reject) => { timer = setTimeout(() => reject(new Error('timeout')), CLOSE_FLUSH_MS); })]);
      } catch (_) {
        this.session.writeDraft();
      } finally {
        clearTimeout(timer);
      }
    }
    this.closed = true;
    clearTimeout(this.feedbackTimer);
    this.win.removeEventListener('beforeunload', this.unload);
    this.session.dispose({ release: !this.deleted });
    this.bridge.destroy();
    this.shortcuts.destroy();
    this.inspector.destroy();
    this.shell.destroy();
  },
};
