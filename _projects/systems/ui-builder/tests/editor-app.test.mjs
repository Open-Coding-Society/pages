// The editor app (UiBuilderEditor), its start screen and its dialogs on the small fake DOM, with
// fake stores: making pages (one at a time, never over an unsaved one), the teacher's Class pages
// and how store errors are worded in dialogs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UiBuilderEditor } from '../js/editor-app.js';
import { createDialogs } from '../js/editor-dialogs.js';
import { buildShell } from '../js/editor-shell.js';
import { createOutline } from '../js/editor-outline.js';
import { createFieldWidget } from '../js/editor-fields.js';
import { ApiError, ConflictError } from '../js/page-store.js';
import { createPage } from '../js/page-model.js';
import { DraftStore } from '../js/draft-store.js';
import { textOf } from '../js/registry.js';
import { createDocument, createWindow, settle, text } from './fixtures/live/dom.mjs';
import { counterIds, loadRegistry, needsRuby, readYaml } from './helpers.mjs';

let registry = null;
function editorRegistry() {
  if (!registry) {
    const base = loadRegistry();
    registry = { ...base, text: { ...base.text, editor: readYaml('ui_builder_editor.yml') } };
  }
  return registry;
}
const say = (key, vars) => textOf(editorRegistry(), `editor.${key}`, vars);

function fakeDrafts(records = {}) {
  const map = new Map(Object.entries(records));
  return {
    map,
    keyFor: (ref) => (ref ? `${ref.kind}-${ref.id}` : 'new'),
    read: (key) => map.get(key) || null,
    write: (key, record) => map.set(key, { ...record, savedAt: 1 }),
    clear: (key) => map.delete(key),
  };
}

function appWith({ store, drafts = fakeDrafts() }) {
  const doc = createDocument();
  const win = createWindow(doc, { href: 'https://pages.opencodingsociety.com/ui-builder/' });
  win.history.pushState = () => {}; // opening a made page moves to its address
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const app = new UiBuilderEditor(root, {
    win, doc, registry: editorRegistry(), store, draftStore: drafts, config: { baseurl: '' }, ids: counterIds(),
    richText: { renderRichMessage(holder, raw) { holder.textContent = raw; } },
  });
  const opened = [];
  // The editing shell is not under test here: record what would open.
  app.openEditor = (args) => opened.push(args);
  return { app, root, opened };
}

const newPage = () => createPage(editorRegistry(), { ids: counterIds() });

test('a double click on a template makes one page', needsRuby, async () => {
  const made = [];
  const store = {
    capabilities: { cloud: true },
    create: (page) => new Promise((resolve) => setTimeout(() => { made.push(page); resolve({ ref: { kind: 'spring', id: made.length }, base: 0, meta: null }); }, 5)),
  };
  const { app, opened } = appWith({ store });
  const first = app.createFrom(newPage());
  const second = app.createFrom(newPage());
  await Promise.all([first, second]);
  assert.equal(made.length, 1, 'the second click is ignored while the first page is made');
  assert.equal(opened.length, 1);
  assert.deepEqual(opened[0].ref, { kind: 'spring', id: 1 }, 'and the page made is the one that opens');
  await app.createFrom(newPage());
  assert.equal(made.length, 2, 'the next one works once that is done');
});

test("the unsaved page in the 'new' slot is replaced only when the student says so", needsRuby, async () => {
  const unsaved = { baseVersion: null, dirty: true, savedAt: 1, page: newPage() };
  const created = [];
  const store = { capabilities: { cloud: true }, create: async (page) => { created.push(page); return { ref: { kind: 'spring', id: 3 }, base: 0, meta: null }; } };
  const drafts = fakeDrafts({ new: unsaved });
  const { app, opened } = appWith({ store, drafts });
  const answers = [false, true];
  const asked = [];
  app.dialogs = { confirm: async (options) => { asked.push(options.title); return answers.shift(); } };

  assert.equal(await app.createFrom(newPage()), false, 'Cancel keeps the unsaved page');
  assert.equal(created.length, 0);
  assert.equal(drafts.read('new'), unsaved);
  assert.deepEqual(asked, [say('replace_new_title')]);

  assert.equal(await app.createFrom(newPage()), true);
  assert.equal(drafts.read('new'), null, 'thrown away once the student chose a new page');
  assert.equal(opened.length, 1);
});

test("a page made from a template leaves the 'new' slot alone; resuming that page clears it", needsRuby, async () => {
  const unsaved = { baseVersion: null, dirty: false, savedAt: 1, page: newPage() };
  const store = { capabilities: { cloud: true }, create: async () => ({ ref: { kind: 'spring', id: 4 }, base: 0, meta: null }) };
  const drafts = fakeDrafts({ new: unsaved });
  const { app } = appWith({ store, drafts });
  app.dialogs = { confirm: async () => assert.fail('a saved (not dirty) copy needs no question') };
  await app.createFrom(newPage());
  assert.equal(drafts.read('new'), unsaved, 'only the page that came from it clears it');
  await app.createFrom(unsaved.page, { draftBase: true });
  assert.equal(drafts.read('new'), null);
});

test('Class pages link the published copy and approve that version only', needsRuby, async () => {
  const summary = {
    id: 12, ref: { kind: 'spring', id: 12 }, slug: 'flood-watch', title: 'Flood Watch', status: 'PUBLISHED', visibility: 'SIGNED_IN',
    version: 3, publishedVersion: 6, updatedAt: 5, hasUnpublishedChanges: true,
  };
  const approvals = [];
  const store = {
    capabilities: { cloud: true, teacher: true, publish: true, revisions: true },
    list: async ({ scope }) => (scope === 'class' ? [summary] : []),
    setVisibility: async (ref, options) => {
      approvals.push(options);
      throw new ApiError({ status: 409, error: 'published_changed', body: { error: 'published_changed', publishedVersion: 7 } });
    },
  };
  const { app, root } = appWith({ store });
  app.dialogs.askUntil = async () => ({ until: null });
  app.showStart();
  app.start.select('class');
  await settle();
  const links = root.querySelectorAll('a').filter((link) => text(link) === say('class_open_published'));
  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute('href'), '/ui-builder/view/?page=flood-watch', 'the viewer, with the slug: the copy Approve shows');
  assert.equal(links[0].getAttribute('target'), '_blank');
  const approve = root.querySelectorAll('button').find((button) => text(button) === textOf(editorRegistry(), 'teacher.approve_public'));
  approve.click();
  await settle();
  assert.deepEqual(approvals, [{ visibility: 'PUBLIC', until: null, publishedVersion: 6 }]);
  assert.equal(text(app.startNote), say('approve_changed'), 'a newer publish: look again, then approve');
});

test('Class pages tell a teacher who approves a page unpublished since what happened, and list it as a draft', needsRuby, async () => {
  const summary = { id: 12, ref: { kind: 'spring', id: 12 }, slug: 'flood-watch', title: 'Flood Watch', status: 'PUBLISHED', visibility: 'SIGNED_IN', version: 3, publishedVersion: 6, updatedAt: 5 };
  let pages = [summary];
  const store = {
    capabilities: { cloud: true, teacher: true, publish: true, revisions: true },
    list: async ({ scope }) => (scope === 'class' ? pages : []),
    setVisibility: async () => { throw new ApiError({ status: 409, error: 'not_published', body: { error: 'not_published' } }); },
  };
  const { app, root } = appWith({ store });
  app.dialogs.askUntil = async () => ({ until: null });
  app.showStart();
  app.start.select('class');
  await settle();
  pages = [{ ...summary, status: 'DRAFT', publishedVersion: null }]; // the student unpublished it meanwhile
  root.querySelector('tr[data-page-id="12"] [data-ui-action="approve"]').click();
  await settle();
  assert.equal(text(app.startNote), say('approve_unpublished'));
  assert.notEqual(text(app.startNote), textOf(editorRegistry(), 'store.not_published'), 'not the advice for its owner, "Publish the page first"');
  const row = root.querySelector('tr[data-page-id="12"]');
  assert.ok(row.querySelectorAll('b').map(text).includes(say('status_DRAFT')), 'the list is loaded again');
  assert.equal(row.querySelector('[data-ui-action="approve"]'), null);
});

test("a teacher's restore after the student saved again uses the student's version next time", needsRuby, async () => {
  const summary = { id: 12, ref: { kind: 'spring', id: 12 }, slug: null, title: 'Flood Watch', status: 'DRAFT', visibility: 'SIGNED_IN', version: 3, updatedAt: 5 };
  const bases = [];
  const store = {
    capabilities: { cloud: true, teacher: true, revisions: true },
    list: async ({ scope }) => (scope === 'class' ? [summary] : []),
    restore: async (ref, revisionId, { base }) => {
      bases.push(base);
      if (bases.length === 1) throw new ConflictError({ current: { base: 9, savedByName: 'Ada', savedAt: 1 } });
      return { base: 10, meta: null };
    },
  };
  const { app, root } = appWith({ store });
  let shown = null;
  app.dialogs.revisions = async (options) => { shown = options; };
  app.showStart();
  app.start.select('class');
  await settle();
  root.querySelectorAll('button').find((button) => text(button) === say('revisions')).click();
  await settle();
  await assert.rejects(shown.restore({ revisionId: 5 }), { name: 'ConflictError' });
  await shown.restore({ revisionId: 5 });
  assert.deepEqual(bases, [3, 9], 'the list loaded at version 3, and Ada saved version 9 since');
});

test('the revisions dialog words store errors and warns about unsaved changes', needsRuby, async () => {
  const doc = createDocument();
  createWindow(doc);
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const reg = editorRegistry();
  const errorText = (error) => `worded:${error.error}`;
  const dialogs = createDialogs({ root, doc, say, text: (path, vars) => textOf(reg, path, vars), errorText });
  dialogs.revisions({
    unsaved: true,
    load: async () => [{ revisionId: 1, kind: 'SAVE', savedByName: 'Ada', savedAt: 5 }],
    restore: async () => { throw new ApiError({ status: 409, error: 'busy', message: 'UI Builder store: busy (HTTP 409)' }); },
  });
  await settle();
  root.querySelector('.ui-builder-revisions button').click();
  await settle();
  const confirm = root.querySelectorAll('.ocs__modal-card')[1];
  assert.match(text(confirm), /couldn't be saved/, 'the confirm says the newest changes would be lost');
  confirm.querySelectorAll('.ocs__modal-actions button')[1].click();
  await settle();
  assert.equal(text(root.querySelector('output')), 'worded:busy', "the registry's words, never the error's message");
  dialogs.destroy();

  const failing = createDialogs({ root, doc, say, text: (path, vars) => textOf(reg, path, vars), errorText });
  failing.revisions({ load: async () => { throw new ApiError({ status: 502, error: 'server' }); }, restore: async () => {} });
  await settle();
  assert.equal(text(root.querySelector('output')), say('revisions_failed', { message: 'worded:server' }));
  failing.destroy();
});

const emptyStore = (extra = {}) => ({ capabilities: { cloud: false }, list: async () => [], ...extra });

// A school computer is shared: once Spring says who is signed in, the unsaved new page is that
// person's own, so the next student never gets the last one's page; signed out, it is the shared one.
test('signed in, the unsaved new page belongs to that person; signed out, it is the shared one', needsRuby, async () => {
  const memory = new Map();
  const storage = { getItem: (key) => (memory.has(key) ? memory.get(key) : null), setItem: (key, value) => memory.set(key, String(value)), removeItem: (key) => memory.delete(key) };
  const drafts = new DraftStore({ storage });
  drafts.setPerson(41);
  assert.ok(drafts.write(drafts.keyFor(null), { baseVersion: null, dirty: true, page: newPage() }), 'student 41 left an unsaved page');
  drafts.setPerson(null);

  const next = appWith({ store: emptyStore({ whoami: async () => ({ personId: 42, name: 'Alan Turing' }) }), drafts });
  await next.app.whoami();
  assert.equal(drafts.keyFor(null), 'new:42');
  assert.equal(drafts.read(drafts.keyFor(null)), null, "student 41's page is not offered to student 42");
  drafts.setPerson(41);
  assert.ok(drafts.read(drafts.keyFor(null)), "41's page is still there for 41");

  const signedOut = appWith({ store: emptyStore({ whoami: async () => null }), drafts });
  await signedOut.app.whoami();
  assert.equal(drafts.keyFor(null), 'new');
});

test('the start screen speaks through one status region that outlasts its screens', needsRuby, async () => {
  const { app, root } = appWith({ store: emptyStore() });
  const region = root.firstChild;
  assert.equal(region.getAttribute('role'), 'status', 'there before any message, so its first one is read out');
  assert.ok(region.contains(app.startNote));
  app.showStart();
  app.message(say('creating'));
  assert.equal(app.startNote.hidden, false);
  app.showStart();
  await settle();
  assert.equal(root.firstChild, region, 'a new screen keeps the region');
  assert.equal(app.startNote.hidden, true, 'and starts without the last note');
  app.message(say('deleted', { title: 'Flood Watch' }));
  assert.equal(text(region), say('deleted', { title: 'Flood Watch' }));
  assert.equal(region.hidden, false, 'only the callout inside it is ever hidden');
});

test('a screen opened from another one gets the keyboard on its heading; the first one leaves it alone', needsRuby, async () => {
  const store = emptyStore({ open: async () => { throw new ApiError({ status: 502, error: 'server' }); } });
  const { app, root } = appWith({ store });
  const doc = root.ownerDocument;
  app.showStart();
  assert.equal(doc.activeElement, null, 'the page load decides where the keyboard starts');
  app.showStart();
  assert.equal(doc.activeElement, app.start.heading);
  assert.equal(app.start.heading.getAttribute('tabindex'), '-1');
  await app.openRef({ kind: 'spring', id: '7' });
  assert.equal(text(doc.activeElement), say('retry'), 'a page that failed to open: the keyboard is on Try again');
});

// The editing shell needs style, classList and toggleAttribute, which the small fake DOM leaves out.
function shellDocument() {
  const doc = createDocument();
  const make = doc.createElement;
  doc.createElement = (tag) => {
    const node = make(tag);
    node.style = { setProperty() {} };
    node.toggleAttribute = (name, on) => (on ? node.setAttribute(name, '') : node.removeAttribute(name));
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
  const win = createWindow(doc, { href: 'https://pages.opencodingsociety.com/ui-builder/' });
  win.requestAnimationFrame = () => 0;
  win.history.pushState = () => {};
  return { doc, win };
}

test('a page opened from the start screen gets the keyboard on its title, and its name is said a moment later', needsRuby, async (t) => {
  const { doc, win } = shellDocument();
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const store = emptyStore({ save: async (ref, page, { base }) => ({ base: base + 1, meta: null }) });
  const app = new UiBuilderEditor(root, {
    win, doc, registry: editorRegistry(), store, draftStore: fakeDrafts(), config: { baseurl: '' }, ids: counterIds(),
    richText: { renderRichMessage(holder, raw) { holder.textContent = raw; } },
  });
  app.showStart();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const page = newPage();
  page.page.title = 'Flood Watch';
  app.openEditor({ ref: { kind: 'local', id: 'abcdef123456' }, page, base: 0, meta: null });
  const { shell } = app.edit;
  assert.equal(doc.activeElement, shell.title);
  assert.equal(shell.title.getAttribute('aria-label'), say('edit_title', { title: 'Flood Watch' }));
  assert.equal(text(shell.feedbackText), '', 'not yet: the feedback line is as new as the shell');
  t.mock.timers.tick(100);
  assert.equal(text(shell.feedbackText), say('editing', { title: 'Flood Watch' }));
  t.mock.timers.reset();
  await app.leave();
});

test("Class pages offer Approve again once an approval ran out or a newer version waits, and keep the keyboard's place", needsRuby, async () => {
  const now = Date.now();
  const row = (id, extra) => ({ id, ref: { kind: 'spring', id }, slug: `page-${id}`, title: `Page ${id}`, status: 'PUBLISHED', visibility: 'PUBLIC', version: 3, publishedVersion: 3, updatedAt: 5, ...extra });
  let pages = [row(1, { publicUntil: now - 1000 }), row(2, { publicPending: true }), row(3, { publicUntil: now + 86400000 })];
  const store = {
    capabilities: { cloud: true, teacher: true, publish: true, revisions: true },
    list: async ({ scope }) => (scope === 'class' ? pages : []),
    unpublish: async (ref) => { pages = pages.map((page) => (page.id === ref.id ? { ...page, status: 'DRAFT', visibility: 'SIGNED_IN' } : page)); },
  };
  const { app, root } = appWith({ store });
  app.dialogs.confirm = async () => true;
  app.showStart();
  app.start.select('class');
  await settle();
  const rowOf = (id) => root.querySelector(`tr[data-page-id="${id}"]`);
  const pills = (id) => rowOf(id).querySelectorAll('b').map(text);
  const approve = (id) => rowOf(id).querySelector('[data-ui-action="approve"]');
  assert.ok(pills(1).includes(say('approval_ended')) && approve(1), 'ran out: approve it again');
  assert.ok(pills(2).includes(say('approval_newer')) && approve(2), 'published again: approve the new version');
  assert.ok(pills(3).includes(say('public_pill')) && !approve(3), 'still covered: nothing to approve');

  const unpublish = rowOf(2).querySelector('[data-ui-action="unpublish"]');
  unpublish.focus();
  unpublish.click();
  await settle();
  const doc = root.ownerDocument;
  assert.notEqual(rowOf(2).querySelector('[data-ui-action="unpublish"]'), unpublish, 'the table was repainted');
  assert.equal(doc.activeElement, rowOf(2).querySelector('a'), 'its Unpublish is gone, so the keyboard is on that row\'s first control');
});

test('a template button is named by the words it shows, then the template', needsRuby, () => {
  const { app, root } = appWith({ store: emptyStore() });
  app.showStart();
  const card = root.querySelector('[data-template="blank"]');
  const button = card.querySelector('button');
  const label = editorRegistry().templates.find((template) => template.key === 'blank').label;
  assert.equal(text(button), say('template_start'));
  assert.equal(button.getAttribute('aria-label'), say('template_use', { label }));
  assert.ok(button.getAttribute('aria-label').startsWith(text(button)), 'what a voice user says matches the name (WCAG 2.5.3)');
});

test('dialogs name the words a choice depends on, and the delete field names the title to type', needsRuby, () => {
  const doc = createDocument();
  createWindow(doc);
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const reg = editorRegistry();
  const dialogs = createDialogs({ root, doc, say, text: (path, vars) => textOf(reg, path, vars) });
  const described = (card) => (card.getAttribute('aria-describedby') || '').split(' ').map((id) => text(doc.getElementById(id))).join(' ');

  dialogs.conflict({ name: 'Ada', time: '2:41 PM' });
  const conflict = root.querySelector('[role="alertdialog"]');
  assert.equal(described(conflict), `${say('conflict_body', { name: 'Ada', time: '2:41 PM' })} ${say('conflict_keep_note')}`);
  dialogs.destroy();

  const confirming = createDialogs({ root, doc, say, text: (path, vars) => textOf(reg, path, vars) });
  confirming.confirm({ title: 'Unpublish', body: 'Visitors see Not found.', confirmLabel: 'Unpublish' });
  assert.equal(described(root.querySelector('[role="dialog"]')), 'Visitors see Not found.');
  confirming.destroy();

  const deleting = createDialogs({ root, doc, say, text: (path, vars) => textOf(reg, path, vars) });
  deleting.deletePage({ title: 'Flood Watch' });
  const field = root.querySelector('.ocs__modal-card input');
  assert.equal(doc.activeElement, field);
  assert.equal(text(doc.getElementById(field.getAttribute('aria-describedby'))), say('delete_body', { title: 'Flood Watch' }));
  deleting.destroy();
});

// A flex button drops a leading space, so an icon would touch its words without the grammar's
// ocs__btn--icon spacing (as on _layouts/post.html's Submit button).
function assertIconSpacing(scope, where) {
  const buttons = scope.querySelectorAll('button, a').filter((node) => node.querySelector('i') && text(node));
  assert.ok(buttons.length, `${where}: found buttons with an icon and words`);
  for (const button of buttons) {
    assert.match(button.getAttribute('class'), /\bocs__btn ocs__btn--icon\b/, `${where}: ${text(button)}`);
    assert.ok(button.childNodes.every((node) => node.nodeType !== 3 || node.nodeValue === node.nodeValue.trimStart()), `${where}: ${text(button)} has no leading space`);
  }
}

test('every editor button with an icon and words uses the grammar\'s icon spacing', needsRuby, () => {
  const { app, root } = appWith({ store: emptyStore() });
  app.showStart();
  assertIconSpacing(root, 'start screen');

  const { doc } = shellDocument();
  const reg = editorRegistry();
  const shell = buildShell({ doc, registry: reg, say, caps: { publish: true, revisions: true } });
  assertIconSpacing(shell.element, 'top bar');
  shell.destroy();

  const pane = doc.createElement('section');
  doc.body.appendChild(pane);
  createOutline({ root: pane, doc, registry: reg, say, actions: {} });
  assertIconSpacing(pane, 'outline');

  const links = createFieldWidget({ id: 'links', type: 'links', label: 'Buttons', max_items: 3 }, { doc, say, value: [], onChange() {}, nextId: (() => { let n = 0; return () => `ui-t${(n += 1)}`; })() });
  assertIconSpacing(links.element, 'links field');
});

test('Code takes the preview\'s place and Preview brings it back, and Show HTML opens the code at its block', needsRuby, async () => {
  const { doc, win } = shellDocument();
  const root = doc.createElement('div');
  doc.body.appendChild(root);
  const store = emptyStore({ save: async (ref, page, { base }) => ({ base: base + 1, meta: null }) });
  const app = new UiBuilderEditor(root, {
    win, doc, registry: editorRegistry(), store, draftStore: fakeDrafts(), config: { baseurl: '' }, ids: counterIds(),
    richText: { renderRichMessage(holder, raw) { holder.textContent = raw; } },
  });
  app.showStart();
  const page = createPage(editorRegistry(), { template: 'about_me', ids: counterIds() });
  // The About me template's text block needs the rich-text composer, which this test leaves out.
  const blocks = page.sections.flatMap((section) => section.cells.flatMap((cell) => cell.blocks));
  assert.ok(!['text'].includes(blocks[1].type) && !['text'].includes(blocks[3].type));
  app.openEditor({ ref: { kind: 'local', id: 'abcdef123456' }, page, base: 0, meta: null });
  const { shell } = app.edit;
  assert.equal(shell.view, 'preview');
  assert.equal(shell.codePane.hidden, true);
  assert.equal(shell.viewButtons.get('preview').getAttribute('aria-pressed'), 'true');

  shell.viewButtons.get('code').click();
  assert.equal(shell.view, 'code');
  assert.equal(shell.viewport.hidden, true, 'the code shows in the preview\'s place');
  assert.equal(shell.codePane.hidden, false);
  assert.equal(shell.viewButtons.get('code').getAttribute('aria-pressed'), 'true');
  const cards = shell.codePane.querySelectorAll('.ui-builder-code-block');
  assert.deepEqual(cards.map((card) => card.getAttribute('data-ui-code-node')), blocks.map((block) => block.id));

  cards[1].querySelector('button').click();
  assert.equal(app.edit.state.selectedId, blocks[1].id, 'picking a block in the code selects it in the editor');
  assert.equal(shell.codePane.querySelector(`[data-ui-code-node="${blocks[1].id}"]`).getAttribute('aria-current'), 'true');

  shell.viewButtons.get('preview').click();
  assert.equal(shell.view, 'preview');
  assert.equal(shell.viewport.hidden, false);
  assert.equal(shell.codePane.hidden, true);
  assert.equal(app.edit.state.selectedId, blocks[1].id, 'back in Preview, the same block is selected');

  app.edit.nodeAction('show_html', blocks[3].id);
  assert.equal(shell.view, 'code', 'Show HTML opens the code view');
  assert.equal(app.edit.state.selectedId, blocks[3].id);
  assert.equal(shell.codePane.querySelector(`[data-ui-code-node="${blocks[3].id}"]`).getAttribute('aria-current'), 'true');
  await app.leave();
});

test('the feedback line sits above the panes, and an open pane\'s toggle looks pressed', needsRuby, () => {
  const { doc } = shellDocument();
  const shell = buildShell({ doc, registry: editorRegistry(), say, caps: { publish: true, revisions: true } });
  const parts = shell.element.children;
  assert.ok(parts.indexOf(shell.feedback) < parts.indexOf(shell.outlinePane.parentNode), 'Publish\'s answer shows above the window-high panes, not below them');

  const classes = (node) => node.getAttribute('class').split(/\s+/);
  shell.setPane('outline', true);
  assert.equal(shell.outlineToggle.getAttribute('aria-expanded'), 'true');
  assert.ok(classes(shell.outlineToggle).includes('accent') && classes(shell.outlineToggle).includes('fill'), 'the grammar draws fill only with accent');
  assert.ok(!classes(shell.inspectorToggle).includes('fill'), 'the closed pane\'s toggle stays plain');
  shell.setPane('outline', false);
  assert.ok(!classes(shell.outlineToggle).includes('accent') && !classes(shell.outlineToggle).includes('fill'));
  shell.destroy();
});
