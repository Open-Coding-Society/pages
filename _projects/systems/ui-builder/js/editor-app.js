// The UI Builder editor at /ui-builder/ (DESIGN §10): routes ?page= / ?local= / ?new= to the
// editing shell, anything else to the start screen. The shell joins the outline, the canvas
// iframe, the inspector and the top bar around one page held in the undo history; every change
// is validated, drawn and handed to the session (drafts, autosave, leases). The page bootstrap
// passes the store it picked once (Spring or this browser); here only store.capabilities count.
import { textOf } from './registry.js';
import { createPage, normalizePage } from './page-model.js';
import { contentRenderers } from './blocks-content.js';
import { createRichHooks } from './rich-content.js';
import { createDialogs, formatWhen } from './editor-dialogs.js';
import { errorKeyOf, fieldsOf } from './editor-session.js';
import { createStartScreen } from './editor-start.js';
import { buildShell } from './editor-shell.js';
import { EditSession } from './editor-edit.js';
import { el } from './editor-fields.js';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
// How long a new live region is on the page before its first words go in.
const ANNOUNCE_MS = 100;
// The same id rules as the stores and the draft keys (page-store.js LOCAL_ID, draft-store.js).
const SPRING_ID = /^[1-9]\d{0,15}$/;
const LOCAL_ID = /^[a-z0-9]{6,32}$/;
const TEMPLATE_KEY = /^[a-z0-9_]{1,40}$/;

// ids(kind) → 's-' | 'b-' + 8 random base36 characters (DESIGN §5).
export function randomIds(cryptoImpl = globalThis.crypto) {
  return (kind) => {
    const bytes = new Uint8Array(8);
    cryptoImpl.getRandomValues(bytes);
    return `${kind}-${Array.from(bytes, (byte) => ALPHABET[byte % 36]).join('')}`;
  };
}

// ?page=<springId> | ?local=<localId> | ?new=<templateKey>; anything else is the start screen.
export function parseEditorUrl(search) {
  const params = new URLSearchParams(String(search || ''));
  const page = params.get('page');
  if (page !== null) return SPRING_ID.test(page) ? { mode: 'edit', ref: { kind: 'spring', id: page } } : { mode: 'start', bad: true };
  const local = params.get('local');
  if (local !== null) return LOCAL_ID.test(local) ? { mode: 'edit', ref: { kind: 'local', id: local } } : { mode: 'start', bad: true };
  const template = params.get('new');
  if (template !== null) return TEMPLATE_KEY.test(template) ? { mode: 'new', template } : { mode: 'start', bad: true };
  return { mode: 'start' };
}

export function editorPath(baseurl, ref) {
  const root = `${String(baseurl || '').replace(/\/+$/, '')}/ui-builder/`;
  if (!ref) return root;
  return `${root}?${ref.kind === 'local' ? 'local' : 'page'}=${encodeURIComponent(ref.id)}`;
}

export function viewerPath(baseurl, { slug, draft, local } = {}) {
  const root = `${String(baseurl || '').replace(/\/+$/, '')}/ui-builder/view/`;
  if (slug) return `${root}?page=${encodeURIComponent(slug)}`;
  if (draft) return `${root}?draft=${encodeURIComponent(draft)}`;
  return `${root}?local=${encodeURIComponent(local)}`;
}

export function isFramed(win) {
  try {
    return win.top !== win.self;
  } catch (_) {
    return true; // a cross-origin top window: framed by someone else
  }
}

export class UiBuilderEditor {
  constructor(root, deps) {
    this.root = root;
    this.deps = deps;
    this.win = deps.win || globalThis.window;
    this.doc = deps.doc || globalThis.document;
    this.registry = deps.registry;
    this.store = deps.store;
    this.baseurl = (deps.config && deps.config.baseurl) || '';
    this.pageOrigin = this.win.location.origin;
    this.ids = deps.ids || randomIds(this.win.crypto);
    this.say = (key, vars) => textOf(this.registry, `editor.${key}`, vars);
    this.text = (path, vars) => textOf(this.registry, path, vars);
    // Store errors in the registry's words, never the error's own message or code. An error that
    // isn't the store's is a bug, and its plain wording would hide it, so the console gets it too.
    this.errorText = (error) => {
      const { key, vars } = errorKeyOf(error);
      if (key === 'store.unknown') console.error('UI Builder:', error);
      return textOf(this.registry, key, vars);
    };
    const parse = deps.parseBoardUrl;
    this.validators = typeof parse === 'function' ? { kanban: { url: (value) => {
      const board = parse(value);
      if (!board) return { key: 'kanban_bad_url' };
      return board.personal ? { key: 'kanban_personal' } : null;
    } } } : {};
    this.kanbanCanonicalUrl = (value) => {
      const board = typeof parse === 'function' ? parse(value) : null;
      return board && !board.personal ? board.url : null;
    };
    this.hooks = createRichHooks({ richText: deps.richText, baseurl: this.baseurl, pageOrigin: this.pageOrigin, doc: this.doc });
    this.view = el(this.doc, 'div', { class: 'ui-builder-view' });
    // The start screen's note, in a status region that lasts as long as the app: a region that
    // appears together with its words is often not read out, so it isn't redrawn with each screen.
    this.startNote = el(this.doc, 'div', { class: 'ocs__callout', hidden: true });
    this.root.replaceChildren(el(this.doc, 'div', { role: 'status' }, this.startNote), this.view);
    this.dialogs = createDialogs({ root: this.root, doc: this.doc, say: this.say, text: this.text, shell: this.view, errorText: this.errorText });
    this.edit = null;
    this.signedIn = true;
    this.groupsPromise = null;
    this.routing = 0;
    this.creating = false;
    this.shownScreen = false;
  }

  // Read each time: a Spring store learns it serves a teacher only after whoami().
  get caps() { return this.store.capabilities || {}; }

  editorUrl(ref) { return editorPath(this.baseurl, ref); }

  viewerUrl(target) { return viewerPath(this.baseurl, target); }

  // Spring: who is signed in, and whether they teach (store.capabilities.teacher follows it).
  async whoami() {
    if (typeof this.store.whoami !== 'function') return null;
    try {
      const person = await this.store.whoami();
      this.signedIn = Boolean(person);
      // Keep this person's unsaved new-page draft apart from the next person's on a shared computer.
      const drafts = this.deps.draftStore;
      if (drafts && typeof drafts.setPerson === 'function') drafts.setPerson(person ? person.personId : null);
      return person;
    } catch (_) {
      return null; // offline: the list call below reports it
    }
  }

  // Back/forward can start a route while another is still loading; only the newest one draws.
  async route() {
    const token = ++this.routing;
    await this.leave();
    const target = parseEditorUrl(this.win.location.search);
    if (this.caps.cloud && !this.checkedWho) {
      this.checkedWho = true;
      await this.whoami();
    }
    if (token !== this.routing) return undefined;
    if (target.mode === 'edit') return this.openRef(target.ref, token);
    if (target.mode === 'new') {
      const made = await this.createFrom(this.makePage(target.template), { replace: true, token });
      // The student kept an earlier unsaved page: the start screen offers to open it.
      if (made === false && token === this.routing) {
        this.navigate(null, { replace: true });
        this.showStart();
      }
      return undefined;
    }
    return this.showStart();
  }

  navigate(ref, { replace = false } = {}) {
    const url = editorPath(this.baseurl, ref);
    if (replace) this.win.history.replaceState(null, '', url);
    else this.win.history.pushState(null, '', url);
  }

  message(text, { error = false } = {}) {
    if (this.edit) this.edit.notify(text, { error });
    else {
      this.startNote.textContent = text;
      this.startNote.hidden = !text;
    }
  }

  // The first screen leaves the keyboard where the page load put it. Every later one replaces
  // the screen whose control had it, so the keyboard goes to the new screen's heading or title.
  focusScreen(target) {
    if (this.shownScreen && target) target.focus();
    this.shownScreen = true;
  }

  makePage(template) {
    try {
      return createPage(this.registry, { template, ids: this.ids });
    } catch (_) {
      return createPage(this.registry, { ids: this.ids });
    }
  }

  showStart() {
    // A plain block: inside a flex stack the container's auto margins would shrink it to its content.
    const holder = el(this.doc, 'div');
    this.message(''); // a new screen starts without the last one's note
    this.view.replaceChildren(holder);
    const viewer = (ref) => viewerPath(this.baseurl, { draft: ref.id });
    const refresh = (summary) => () => this.message(this.say('approve_done', { title: summary.title || '' }));
    const fail = (error) => this.message(this.errorText(error), { error: true });
    this.start = createStartScreen({
      root: holder, doc: this.doc, registry: this.registry, say: this.say, text: this.text, errorText: this.errorText, store: this.store,
      draftStore: this.deps.draftStore, signedIn: this.signedIn, baseurl: this.baseurl, pageOrigin: this.pageOrigin,
      renderRich: this.hooks.renderRich, ids: this.ids, validators: this.validators, editorUrl: (ref) => editorPath(this.baseurl, ref),
      actions: {
        open: (ref) => { this.navigate(ref); this.route(); },
        create: (key) => this.createFrom(this.makePage(key)),
        importPage: ({ page, errors }) => this.createFrom(page, { notes: errors }),
        resumeNew: (draft) => this.createFrom(normalizePage(draft.page, this.registry, { ids: this.ids }), { draftBase: true }),
        openDraft: viewer,
        openPublished: (summary) => viewerPath(this.baseurl, { slug: summary.slug }),
        message: (text, options) => this.message(text, options),
        revisions: (ref, summary) => {
          let base = summary.version;
          return this.dialogs.revisions({
            load: () => this.store.revisions(ref),
            // The student may have saved since this list loaded. That refusal says who saved, and
            // Restore again uses their version.
            restore: (revision) => this.store.restore(ref, revision.revisionId, { base }).catch((error) => {
              if (error && error.name === 'ConflictError' && error.current.base !== null) base = error.current.base;
              throw error;
            }),
          });
        },
        // The approval is for this row's published copy (Open published copy): Spring refuses it
        // with published_changed if a newer publish has replaced that copy.
        approve: async (ref, summary) => {
          const answer = await this.dialogs.askUntil();
          if (!answer) return;
          await this.store.setVisibility(ref, { visibility: 'PUBLIC', until: answer.until, publishedVersion: summary.publishedVersion }).then(refresh(summary), fail);
        },
        unpublish: async (ref, summary) => {
          const sure = await this.dialogs.confirm({ title: this.say('unpublish_title'), body: this.say('unpublish_body', { address: summary.slug ? viewerPath(this.baseurl, { slug: summary.slug }) : summary.title }), confirmLabel: this.say('unpublish') });
          if (sure) await this.store.unpublish(ref).catch(fail);
        },
        bulkPublic: async (course) => {
          const answer = await this.dialogs.askUntil();
          if (!answer) return;
          await this.store.bulkPublic({ course, until: answer.until })
            .then((result) => this.message(this.say('class_bulk_done', { count: (result && result.updated) || 0 })), fail);
        },
      },
    });
    this.focusScreen(this.start.heading);
  }

  // A page that isn't in the store yet: try to create it now; if that fails it opens unsaved and
  // the session creates it with the first save. draftBase: the page is the unsaved new-page draft
  // ('new:<personId>' for a signed-in person, plain 'new' signed out or Flask-only).
  // One create at a time, or a double click on a template makes a second page nobody opens.
  // Resolves false when the student keeps an earlier unsaved page instead.
  async createFrom(page, { replace = false, notes = [], draftBase = false, token } = {}) {
    if (this.creating) return undefined;
    this.creating = true;
    try {
      if (!draftBase && !(await this.mayReplaceUnsaved())) return false;
      const mine = token === undefined ? ++this.routing : token;
      this.message(this.say('creating'));
      let created = null;
      try {
        created = await this.store.create(page, { fields: fieldsOf(page) });
      } catch (error) {
        this.pendingError = this.say('create_failed', { message: this.errorText(error) });
      }
      if (mine !== this.routing) return undefined;
      await this.leave();
      if (created) {
        this.navigate(created.ref, { replace });
        if (draftBase) this.deps.draftStore.clear(this.deps.draftStore.keyFor(null)); // that draft is saved now
      }
      this.openEditor({ ref: created ? created.ref : null, page, base: created ? created.base : null, meta: created ? created.meta : null, dirty: !created || draftBase, notes });
      return true;
    } finally {
      this.creating = false;
    }
  }

  // A page saved nowhere has its only copy in this browser's new-page draft ('new:<personId>' for
  // a signed-in person, plain 'new' signed out or Flask-only), which another new page would take
  // over. So the student chooses first: start over, or cancel and open that page.
  async mayReplaceUnsaved() {
    const drafts = this.deps.draftStore;
    const key = drafts.keyFor(null);
    const unsaved = drafts.read(key);
    if (!unsaved || !unsaved.dirty || !unsaved.page) return true;
    const sure = await this.dialogs.confirm({ title: this.say('replace_new_title'), body: this.say('replace_new_body', { time: formatWhen(unsaved.savedAt) }), confirmLabel: this.say('replace_new_confirm') });
    if (sure) drafts.clear(key);
    return sure;
  }

  async openRef(ref, token = this.routing) {
    this.message('');
    this.view.replaceChildren(el(this.doc, 'div', { class: 'ocs__loading' }, el(this.doc, 'div', { class: 'ocs__spinner' })), el(this.doc, 'p', { class: 'ocs__text' }, this.say('loading')));
    let opened;
    try {
      opened = await this.store.open(ref);
    } catch (error) {
      if (token !== this.routing) return;
      const retry = el(this.doc, 'button', { type: 'button', class: 'ocs__btn', onclick: () => this.route() }, this.say('retry'));
      this.view.replaceChildren(el(this.doc, 'div', { class: 'ocs__container ocs__stack' },
        el(this.doc, 'div', { class: 'ocs__callout', role: 'alert' }, this.say('load_failed', { message: this.errorText(error) })),
        el(this.doc, 'div', { class: 'ocs__links' }, retry, el(this.doc, 'a', { class: 'ocs__btn', href: editorPath(this.baseurl, null) }, this.say('back')))));
      this.focusScreen(retry);
      return;
    }
    if (token !== this.routing) return;
    const page = normalizePage(opened.page, this.registry, { ids: this.ids });
    this.openEditor({ ref, page, base: opened.base, meta: opened.meta || null });
  }

  openEditor({ ref, page, base, meta, dirty = false, notes = [] }) {
    this.message('');
    const shell = buildShell({ doc: this.doc, registry: this.registry, say: this.say, caps: this.caps, baseurl: this.baseurl });
    this.view.replaceChildren(shell.element);
    const edit = new EditSession(this, shell, { ref, page, base, meta });
    this.edit = edit;
    const error = this.pendingError;
    edit.start({ dirty, notes, error });
    this.pendingError = null;
    // The title button opens Page settings and is named after the page.
    this.focusScreen(shell.title);
    // The feedback line is as new as the shell, so which page is open is said a moment later,
    // unless an error or an import note is showing.
    if (!error && !notes.length) {
      setTimeout(() => {
        if (this.edit === edit && !shell.feedbackText.textContent) edit.notify(this.say('editing', { title: shell.title.textContent }));
      }, ANNOUNCE_MS);
    }
  }

  async leave() {
    const edit = this.edit;
    this.edit = null;
    if (this.start) this.start.destroy();
    this.start = null;
    if (edit) await edit.close();
  }

  // The student's groups for group fields and the team picker, loaded once, minus class groups
  // and course channels (Spring filters them too; this keeps an old server honest).
  groups() {
    if (!this.caps.teams || typeof this.store.myGroups !== 'function') return { available: false, list: () => Promise.resolve([]) };
    const model = this.deps.messagesModel || {};
    const allowed = (group) => !(typeof model.isClassGroup === 'function' && model.isClassGroup(group))
      && !(typeof model.isCourseChannel === 'function' && model.isCourseChannel(group));
    return {
      available: true,
      list: () => {
        this.groupsPromise = this.groupsPromise || this.store.myGroups().then((list) => (Array.isArray(list) ? list.filter(allowed) : []));
        this.groupsPromise.catch(() => { this.groupsPromise = null; });
        return this.groupsPromise;
      },
    };
  }

  exportContext(meta) {
    return {
      registry: this.registry, baseurl: this.baseurl, pageOrigin: this.pageOrigin, renderers: contentRenderers,
      sanitizeRich: this.hooks.sanitizeRich, validators: { kanbanCanonicalUrl: this.kanbanCanonicalUrl }, slug: meta && meta.slug ? meta.slug : undefined,
    };
  }
}

export function startEditor(root, deps) {
  const win = deps.win || globalThis.window;
  const doc = deps.doc || globalThis.document;
  if (!root) throw new Error('UI Builder: the editor root element is missing');
  const say = (key) => textOf(deps.registry, `editor.${key}`);
  if (isFramed(win)) {
    root.replaceChildren(el(doc, 'div', { class: 'ocs__callout' }, say('framed'), ' ',
      el(doc, 'a', { class: 'ocs__btn small', href: win.location.href, target: '_top' }, say('framed_open'))));
    return null;
  }
  const app = new UiBuilderEditor(root, deps);
  win.addEventListener('popstate', () => app.route());
  app.route();
  return app;
}
