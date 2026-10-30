// One open page (EditSession, with its page actions from editor-actions.js) against fake stores
// and dialogs: structure limits, how Spring's refusals are worded, page-wide problems, the team
// pick, conflicts, Publish, Revisions and a teacher's approval. The canvas, outline and inspector
// are stubbed: these tests are about what the session decides, not what it draws.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EditSession } from '../js/editor-edit.js';
import { createInspector } from '../js/editor-inspector.js';
import { createOutline } from '../js/editor-outline.js';
import { errorKeyOf } from '../js/editor-session.js';
import { ApiError, ConflictError, OfflineError } from '../js/page-store.js';
import { createPage, normalizePage, updatePageSettings, updateSettings } from '../js/page-model.js';
import { textOf } from '../js/registry.js';
import { createDocument, settle, text } from './fixtures/live/dom.mjs';
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
const words = (path, vars) => textOf(editorRegistry(), path, vars);

// Ids for what the editor adds (copies, sections), apart from the pages' own s-000001…
function newIds() {
  let n = 0;
  return (kind) => `${kind}-new${String((n += 1)).padStart(4, '0')}`;
}

function fakeDrafts() {
  const records = new Map();
  return {
    keyFor: (ref) => (ref ? `${ref.kind}-${ref.id}` : 'new'),
    read: (key) => records.get(key) || null,
    write: (key, record) => records.set(key, { ...record, savedAt: 1 }),
    clear: (key) => records.delete(key),
  };
}

// A page from raw sections: { type, blocks: [types] } each, ids s-/b- in order.
function pageOf(sections, settings = {}) {
  let n = 0;
  const id = (kind) => `${kind}-${String((n += 1)).padStart(6, '0')}`;
  const raw = {
    schemaVersion: 1, kind: 'ocs-ui-page', page: { title: 'Flood Watch', description: '', byline: '', course: '', width: 'contained', image: '', ...settings },
    sections: sections.map((blocks) => ({ id: id('s'), type: 'stack', settings: {}, hidden: false, cells: [{ blocks: blocks.map((type) => ({ id: id('b'), type, settings: {}, hidden: false })) }] })),
  };
  return normalizePage(raw, editorRegistry(), { ids: counterIds() });
}

function editorFor(page, { store = {}, dialogs = {}, ref = { kind: 'spring', id: '1' }, base = 1, meta = null } = {}) {
  const reg = editorRegistry();
  const doc = createDocument();
  const caps = { cloud: true, publish: true, revisions: true, leases: false, teams: true, visibility: true, teacher: false, ...(store.capabilities || {}) };
  const fullStore = { save: async (r, p, { base: b }) => ({ base: b + 1, meta }), ...store, capabilities: caps };
  const win = { addEventListener() {}, removeEventListener() {}, requestAnimationFrame() {}, location: { hostname: 'pages.opencodingsociety.com', protocol: 'https:' } };
  const app = {
    doc, win, registry: reg, store: fullStore, caps, say, text: words,
    errorText: (error) => { const { key, vars } = errorKeyOf(error); return textOf(reg, key, vars); },
    deps: { draftStore: fakeDrafts() }, dialogs, ids: newIds(), validators: {}, baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com',
    navigate() {}, viewerUrl: ({ slug }) => `/ui-builder/view/?page=${slug}`,
  };
  const feedback = { error: false, toggleAttribute(name, on) { this.error = on; } };
  const shell = { feedbackText: doc.createElement('span'), feedback, dismissWrap: { hidden: true }, outlinePane: { contains: () => false } };
  const edit = new EditSession(app, shell, { ref, page, base, meta });
  // The parts that draw: not under test here.
  Object.assign(edit, {
    outline: { update() {}, focusSelected() {} }, inspector: { update() {} }, bridge: { select() {}, scrollTo() {}, render() {} },
    lease: { show() {}, hide() {} }, updateBar() {},
  });
  edit.refreshPanels();
  const said = () => ({ message: shell.feedbackText.textContent, error: feedback.error });
  const done = () => { clearTimeout(edit.feedbackTimer); edit.session.dispose({ release: false }); };
  return { edit, app, store: fullStore, said, done };
}

const tooManyBlocks = () => words('errors.too_many_blocks', { max: editorRegistry().limits.blocks_per_section });

test('duplicate, move and drop never give a section more blocks than it may hold', needsRuby, () => {
  const max = editorRegistry().limits.blocks_per_section;
  const page = pageOf([Array(max).fill('divider'), ['divider', 'divider']]);
  const full = page.sections[0];
  const other = page.sections[1];
  const { edit, said, done } = editorFor(page);

  edit.duplicate(full.cells[0].blocks[3].id);
  assert.equal(edit.page, page, 'Ctrl+D in a full section changes nothing');
  assert.deepEqual(said(), { message: tooManyBlocks(), error: true });

  edit.move(other.cells[0].blocks[0].id, -1); // up, out of its section into the full one
  assert.equal(edit.page, page, 'Move up into a full section changes nothing');

  edit.drop(other.cells[0].blocks[1].id, { sectionId: full.id, cellIndex: 0, index: 0 });
  assert.equal(edit.page, page, 'a drop into a full section changes nothing');

  edit.move(full.cells[0].blocks[0].id, 1);
  assert.notEqual(edit.page, page, 'moving inside the full section is fine: it adds nothing there');
  edit.duplicate(other.cells[0].blocks[0].id);
  assert.equal(edit.page.sections[1].cells[0].blocks.length, 3, 'a section with room takes the copy');
  done();
});

test("Spring's refusals use the editor's words, with their numbers, or the general refusal", needsRuby, () => {
  const reg = editorRegistry();
  const page = createPage(reg, { template: 'about_me', ids: counterIds() });
  page.page.title = 'T'.repeat(130);
  const hero = page.sections[0].cells[0].blocks[0];
  hero.settings.title = '';
  const { edit, said, done } = editorFor(page);
  const refuse = (...details) => edit.failed(new ApiError({ status: 400, error: 'invalid_spec', details }));
  const local = (nodeId, field) => edit.state.issues.find((issue) => issue.nodeId === nodeId && issue.field === field).message;

  refuse({ nodeId: hero.id, field: 'title', key: 'required' });
  assert.deepEqual(said(), { message: local(hero.id, 'title'), error: true }, 'the matching local issue, worded with its field');
  assert.equal(edit.state.selectedId, hero.id, 'and that block is selected');

  refuse({ nodeId: 'page', field: 'title', key: 'too_long' });
  assert.equal(said().message, local(null, 'title'), "a page field's local issue, max included");

  refuse({ nodeId: null, field: null, key: 'too_big' });
  assert.equal(said().message, words('errors.too_big', { size: JSON.stringify(edit.page).length, max: reg.limits.spec_chars }), 'size and max filled in');

  refuse({ nodeId: null, field: null, key: 'too_many_blocks' });
  assert.equal(said().message, tooManyBlocks());

  for (const key of ['too_many_cells', 'too_long']) {
    refuse({ nodeId: hero.id, field: 'lead', key });
    assert.equal(said().message, words('store.invalid_spec'), `${key}: no words or no number here, so the general refusal`);
    assert.doesNotMatch(said().message, /\{|errors\./);
  }

  edit.failed(new ApiError({ status: 400, error: 'invalid_group' }));
  assert.equal(said().message, words('errors.group_not_allowed'), 'a plain refusal goes through the store wording');
  done();
});

test("a refusal Spring names differently is worded by the editor's own issue on that field", needsRuby, () => {
  const reg = editorRegistry();
  let page = pageOf([['api_data']], { image: 'https://localhost:4100/shot.png' });
  const api = page.sections[0].cells[0].blocks[0];
  page = updateSettings(page, reg, api.id, { source: { url: 'https://flask.opencodingsociety.com/api/jokes', title_path: 'joke text' } });
  const { edit, said, done } = editorFor(page);
  const refuse = (detail) => edit.failed(new ApiError({ status: 400, error: 'invalid_spec', details: [detail] }));
  const local = (nodeId, field) => edit.state.issues.find((issue) => issue.nodeId === nodeId && issue.field === field);

  // Spring checks the gallery picture on every save and calls a picture on the student's computer
  // bad_image; the editor knows that is the reason (loopback_link).
  assert.equal(local(null, 'image').key, 'loopback_link');
  refuse({ nodeId: 'page', field: 'image', key: 'bad_image' });
  assert.deepEqual(said(), { message: local(null, 'image').message, error: true }, 'not "image must be an https:// image link"');
  assert.notEqual(said().message, words('errors.bad_image', { field: 'image' }));

  // Spring names only the settings key (source) and its own key (bad_path); the editor's issue sits inside it.
  assert.equal(local(api.id, 'source.title_path').key, 'bad_api_path');
  refuse({ nodeId: api.id, field: 'source', key: 'bad_path' });
  assert.equal(said().message, local(api.id, 'source.title_path').message);

  // No issue on that field: the registry's words, as before.
  refuse({ nodeId: 'page', field: 'byline', key: 'one_line' });
  assert.equal(said().message, words('errors.one_line', { field: 'byline' }));
  done();
});

// The real outline and inspector on the fake DOM, in place of editorFor's stubs.
function drawPanels(edit) {
  const reg = editorRegistry();
  const outlinePane = edit.doc.createElement('section');
  const inspectorPane = edit.doc.createElement('section');
  edit.doc.body.appendChild(outlinePane);
  edit.doc.body.appendChild(inspectorPane);
  edit.outline = createOutline({ root: outlinePane, doc: edit.doc, registry: reg, say, actions: {} });
  edit.inspector = createInspector({
    root: inspectorPane, doc: edit.doc, registry: reg, say, text: words, richText: {}, actions: {},
    services: { groups: { available: false, list: async () => [] }, openPublished: (slug) => `/ui-builder/view/?page=${slug}`, errorText: () => '' },
  });
  edit.refreshPanels();
  return { outlinePane, inspectorPane };
}

test('problems only a published page has show where a draft\'s do after Publish, until a check finds them gone', needsRuby, async () => {
  const reg = editorRegistry();
  const home = 'https://localhost:8443/app/';
  let page = pageOf([['buttons', 'divider']]);
  const buttons = page.sections[0].cells[0].blocks[0];
  page = updateSettings(page, reg, buttons.id, { links: [{ label: 'Try it', url: home }] });
  const store = { open: async () => ({ page, base: 4, meta: null }) };
  const { edit, said, done } = editorFor(page, { store });
  const { outlinePane, inspectorPane } = drawPanels(edit);
  const shown = () => edit.state.issues.map((issue) => `${issue.field}:${issue.key}`);
  const badges = () => outlinePane.querySelector(`[data-key="${buttons.id}"]`).querySelectorAll('b').map(text);
  const message = words('errors.loopback_link', { field: 'Buttons' });
  assert.deepEqual(shown(), [], 'a draft may link to the team\'s own computer');

  await edit.publish();
  assert.deepEqual(said(), { message: say('publish_fix', { count: 1 }), error: true });
  assert.equal(edit.state.selectedId, buttons.id);
  assert.deepEqual(shown(), ['links.0.url:loopback_link'], 'the reason is no longer only in the count');
  assert.deepEqual(badges(), [say('issues_badge', { count: 1 })], 'counted in the outline');
  assert.ok(text(inspectorPane).includes(message), 'and written under the link, where a draft problem goes');
  assert.equal(inspectorPane.querySelector('input[aria-invalid="true"]').getAttribute('type'), 'url');

  // Checked again with every change: an unrelated one leaves it, fixing the link clears it.
  edit.commit(updatePageSettings(edit.page, reg, { title: 'Flood Watch 2' }));
  assert.deepEqual(shown(), ['links.0.url:loopback_link']);
  edit.commit(updateSettings(edit.page, reg, buttons.id, { links: [{ label: 'Try it', url: 'https://flood.example.com/' }] }));
  assert.deepEqual(shown(), []);
  assert.deepEqual(badges(), []);
  assert.ok(!text(inspectorPane).includes(message));
  // Fixed once, the page is a draft again: it may use the team's computer until the next Publish.
  edit.commit(updateSettings(edit.page, reg, buttons.id, { links: [{ label: 'Try it', url: home }] }));
  assert.deepEqual(shown(), []);

  // Another version of the page (Reload theirs, a restored revision) starts as a draft too.
  await edit.publish();
  assert.deepEqual(shown(), ['links.0.url:loopback_link']);
  await edit.reloadFromStore();
  assert.deepEqual(shown(), []);
  done();
});

test('a problem with the whole page shows in the feedback line until it is fixed', needsRuby, () => {
  const reg = editorRegistry();
  const page = pageOf(Array.from({ length: reg.limits.sections + 1 }, () => []));
  const { edit, said, done } = editorFor(page);
  const message = words('errors.too_many_sections', { max: reg.limits.sections });
  assert.deepEqual(said(), { message, error: true }, 'it has no outline row or field to show it');
  edit.notify('Something else');
  edit.refreshPanels();
  assert.equal(said().message, 'Something else', 'shown once when it appears, not on every redraw');
  edit.notify(message, { error: true });
  edit.remove(edit.page.sections[0].id);
  assert.equal(edit.page.sections.length, reg.limits.sections);
  assert.notEqual(said().message, message, 'cleared once fixed');
  done();
});

test('a team picked while another pick is saving goes with the next save', needsRuby, async () => {
  const requests = [];
  const store = {
    capabilities: { cloud: false },
    save: (ref, page, { base, fields }) => new Promise((resolve) => requests.push({ groupId: fields.groupId, resolve: () => resolve({ base: base + 1, meta: null }) })),
  };
  const { edit, done } = editorFor(pageOf([['divider']]), { store, ref: { kind: 'local', id: 'abcdef123456' } });
  edit.state.pendingTeam = { id: 11, name: 'X' };
  edit.session.change();
  const saving = edit.session.flush();
  await settle();
  edit.state.pendingTeam = { id: 12, name: 'Y' };
  edit.session.change();
  requests[0].resolve();
  await settle();
  assert.deepEqual(edit.state.pendingTeam, { id: 12, name: 'Y' }, "X's answer doesn't drop the pick of Y");
  assert.deepEqual(requests.map((request) => request.groupId), [11, 12]);
  requests[1].resolve();
  await saving;
  assert.equal(edit.state.pendingTeam, undefined, 'done once Y is saved');
  done();
});

test('a Reload theirs that fails offers the choice again instead of leaving saving paused', needsRuby, async () => {
  const page = pageOf([['divider']]);
  const choices = ['reload', 'reload'];
  const asked = [];
  let opens = 0;
  const store = {
    save: async () => { throw new ConflictError({ current: { base: 5, savedByName: 'Grace', savedAt: 1 } }); },
    open: async () => {
      opens += 1;
      if (opens === 1) throw new OfflineError();
      return { page, base: 5, meta: null };
    },
  };
  const dialogs = { conflict: async (options) => { asked.push(options.name); return choices.shift(); } };
  const { edit, said, done } = editorFor(page, { store, dialogs });
  edit.session.change();
  await edit.session.flush().catch(() => {}); // the save conflicts; its dialog opens
  await settle();
  assert.deepEqual(asked, ['Grace', 'Grace'], 'asked again after the reload failed');
  assert.equal(opens, 2);
  assert.equal(edit.session.status().state, 'idle', 'their version loaded the second time');
  assert.equal(said().message, say('conflict_reloaded'));
  done();
});

test('Publish opens the conflict dialog when saving is stuck in a conflict', needsRuby, async () => {
  const conflict = new ConflictError({ current: { base: 5, savedByName: 'Grace', savedAt: 1 } });
  const asked = [];
  const store = { save: async () => { throw conflict; } };
  const dialogs = { conflict: async () => { asked.push('conflict'); return null; } };
  const { edit, done } = editorFor(pageOf([['divider']]), { store, dialogs });
  edit.conflictOpen = true; // its dialog went away without a choice
  edit.session.change();
  await edit.session.flush().catch(() => {});
  edit.conflictOpen = false;
  assert.deepEqual(asked, []);
  await edit.publish();
  await settle();
  assert.deepEqual(asked, ['conflict'], 'Publish no longer does nothing');
  done();
});

test('Keep mine after a Publish conflict saves this page over theirs and says to publish again', needsRuby, async () => {
  const saves = [];
  const store = {
    publish: async () => { throw new ConflictError({ current: { base: 6, savedByName: 'Grace', savedAt: 1 } }); },
    save: async (ref, page, { base, newRevision }) => { saves.push({ base, newRevision }); return { base: base + 1, meta: null }; },
  };
  const dialogs = { publish: async () => 'flood-watch', conflict: async () => 'keep' };
  const { edit, said, done } = editorFor(pageOf([['divider']]), { store, dialogs, base: 5 });
  await edit.publishWithAddress();
  await settle();
  assert.deepEqual(saves, [{ base: 6, newRevision: true }], 'nothing was waiting, and it saved anyway');
  assert.equal(edit.session.base, 7);
  assert.equal(said().message, say('conflict_kept_publish'));
  done();
});

test('a conflict from the save that Publish waits for also says to publish again', needsRuby, async () => {
  const saves = [];
  const store = {
    publish: async () => assert.fail('nothing is published while the save conflicts'),
    save: async (ref, page, { base, newRevision }) => {
      saves.push({ base, newRevision });
      if (saves.length === 1) throw new ConflictError({ current: { base: 8, savedByName: 'Grace', savedAt: 1 } });
      return { base: base + 1, meta: null };
    },
  };
  const dialogs = { conflict: async () => 'keep' };
  const { edit, said, done } = editorFor(pageOf([['divider']]), { store, dialogs, base: 5 });
  edit.session.change();
  await edit.publish();
  await settle();
  assert.deepEqual(saves, [{ base: 5, newRevision: false }, { base: 8, newRevision: true }]);
  assert.equal(said().message, say('conflict_kept_publish'));
  done();
});

// Spring refuses a publish with loopback_source and names the block and field (loopback_url). The
// editor's check before publishing let it through, so nothing was selected or worded for it yet.
test("Spring's loopback_source after Publish selects the block it names and words the problem", needsRuby, async () => {
  const reg = editorRegistry();
  let page = pageOf([['divider', 'text']]);
  const text = page.sections[0].cells[0].blocks[1];
  page = updateSettings(page, reg, text.id, { body: 'Try <a href="https://localhost:8443/">our app</a>.' });
  const refusal = new ApiError({ status: 400, error: 'loopback_source', details: [{ nodeId: text.id, field: 'body', key: 'loopback_url' }] });
  const store = { publish: async () => { throw refusal; } };
  const dialogs = { publish: async () => 'flood-watch' };
  const first = editorFor(page, { store, dialogs });
  await first.edit.publishWithAddress();
  assert.equal(first.edit.state.selectedId, text.id, 'the block Spring names is selected');
  assert.deepEqual(first.said(), { message: words('errors.loopback_url'), error: true });
  first.done();

  // When the editor has its own issue on that field, its words say where the link is.
  const second = editorFor(page, { store, dialogs });
  second.edit.publishCheck = true;
  second.edit.refreshPanels();
  await second.edit.publishWithAddress();
  assert.equal(second.edit.state.selectedId, text.id);
  assert.equal(second.said().message, words('errors.loopback_rich_text', { field: 'Text' }));
  second.done();
});

test('Revisions warn when the newest changes are in no revision, and a stale restore loads theirs', needsRuby, async () => {
  const page = pageOf([['divider']]);
  let refuse = true;
  const restores = [];
  let shown = null;
  const store = {
    save: async (ref, p, { base }) => { if (refuse) throw new ApiError({ status: 400, error: 'invalid_spec' }); return { base: base + 1, meta: null }; },
    restore: async (ref, revisionId, { base }) => {
      restores.push(base);
      if (restores.length === 1) throw new ConflictError({ current: { base: 9, savedByName: 'Grace', savedAt: 1 } });
      return { base: base + 1, meta: null };
    },
    open: async () => ({ page, base: 9, meta: null }),
  };
  const dialogs = { revisions: async (options) => { shown = options; } };
  const { edit, done } = editorFor(page, { store, dialogs, base: 4 });
  edit.session.change();
  await edit.revisions();
  assert.equal(shown.unsaved, true, 'Spring refused the newest changes, so restoring would lose them');
  await assert.rejects(shown.restore({ revisionId: 2, savedAt: 1 }), { name: 'ConflictError' });
  assert.equal(edit.session.base, 9, 'their version is loaded, so Restore again replaces it');
  await shown.restore({ revisionId: 2, savedAt: 1 });
  assert.deepEqual(restores, [4, 9]);
  refuse = false;
  edit.session.change();
  await edit.revisions();
  assert.equal(shown.unsaved, false, 'everything saved: the usual confirm');
  done();
});

test("a teacher's approval names the published version, and a newer one is looked at first", needsRuby, async () => {
  const sent = [];
  const meta = { status: 'PUBLISHED', slug: 'flood-watch', visibility: 'SIGNED_IN', publishedVersion: 6 };
  const store = {
    capabilities: { teacher: true },
    setVisibility: async (ref, options) => {
      sent.push(options.publishedVersion);
      if (sent.length === 1) throw new ApiError({ status: 409, error: 'published_changed', body: { error: 'published_changed', publishedVersion: 7 } });
      return { base: 3, meta: { ...meta, visibility: 'PUBLIC', publishedVersion: 7 } };
    },
    open: async () => ({ page: pageOf([[]]), base: 3, meta: { ...meta, publishedVersion: 7 } }),
  };
  const dialogs = { askUntil: async () => ({ until: null }) };
  const { edit, said, done } = editorFor(pageOf([[]]), { store, dialogs, meta });
  await edit.setVisibility('PUBLIC');
  await settle();
  assert.deepEqual(said(), { message: say('approve_changed'), error: true });
  assert.equal(edit.meta.publishedVersion, 7, 'the newer version is picked up for the next look');
  await edit.setVisibility('PUBLIC');
  assert.deepEqual(sent, [6, 7]);
  done();
});

test("a teacher's approval of a page unpublished since says so in a teacher's words and loads what the page is now", needsRuby, async () => {
  const meta = { status: 'PUBLISHED', slug: 'flood-watch', visibility: 'SIGNED_IN', publishedVersion: 6 };
  let opens = 0;
  const store = {
    capabilities: { teacher: true },
    setVisibility: async () => { throw new ApiError({ status: 409, error: 'not_published', body: { error: 'not_published' } }); },
    open: async () => { opens += 1; return { page: pageOf([[]]), base: 3, meta: { ...meta, status: 'DRAFT', publishedVersion: null } }; },
  };
  const dialogs = { askUntil: async () => ({ until: null }) };
  const { edit, said, done } = editorFor(pageOf([[]]), { store, dialogs, meta });
  await edit.setVisibility('PUBLIC');
  await settle();
  assert.deepEqual(said(), { message: say('approve_unpublished'), error: true });
  assert.notEqual(said().message, words('store.not_published'), 'not the advice for its owner, "Publish the page first"');
  assert.equal(opens, 1);
  assert.equal(edit.meta.status, 'DRAFT', 'the editor stops showing it as published');
  done();
});

test('a student asking for PUBLIC still names the published version, and is never asked for a date', needsRuby, async () => {
  const sent = [];
  const meta = { status: 'PUBLISHED', slug: 'flood-watch', visibility: 'SIGNED_IN', publishedVersion: 6 };
  let asked = 0;
  const store = { capabilities: { teacher: false }, setVisibility: async (ref, options) => { sent.push(options); return { base: 3, meta: { ...meta, publicRequested: true } }; } };
  const dialogs = { askUntil: async () => { asked += 1; return { until: null }; } };
  const { edit, done } = editorFor(pageOf([[]]), { store, dialogs, meta });
  await edit.setVisibility('PUBLIC');
  assert.equal(asked, 0, 'a student is never asked for a date');
  assert.deepEqual(sent, [{ visibility: 'PUBLIC', until: undefined, publishedVersion: 6 }], 'Spring ignores it for a student, but a teacher whose whoami failed still needs it');
  done();
});

test('the lease banner names an unknown editor with a registry word, not a "?"', needsRuby, () => {
  const { edit, said, done } = editorFor(pageOf([[]]));
  edit.leaseChanged({ mine: false, holderName: '' });
  assert.deepEqual(said(), { message: say('lease_banner', { name: say('someone') }), error: false });
  done();
});

// An outline the keys can be pressed in: rows as editor-outline.js marks them.
function outlineRows(edit, rows) {
  const tree = edit.doc.createElement('ul');
  const items = rows.map(([key, kind]) => {
    const item = edit.doc.createElement('li');
    item.setAttribute('role', 'treeitem');
    item.setAttribute('data-key', key);
    item.setAttribute('data-kind', kind);
    tree.appendChild(item);
    return item;
  });
  edit.shell.outlinePane = tree;
  return items;
}
const keyOf = (key, extra = {}) => ({ key, code: '', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...extra });
const blockIds = (page) => page.sections.flatMap((section) => section.cells.flatMap((cell) => cell.blocks.map((block) => block.id)));

test('structure keys act on the outline row or canvas block with the keyboard, which becomes the selection', needsRuby, () => {
  const page = pageOf([['heading', 'text', 'divider']]);
  const [section] = page.sections;
  const [heading, textBlock, divider] = section.cells[0].blocks;
  const { edit, said, done } = editorFor(page, { dialogs: { isOpen: () => false } });
  const [headingRow, textRow, addRow] = outlineRows(edit, [[heading.id, 'block'], [textBlock.id, 'block'], [`${section.id}:add-0`, 'add']]);
  const press = (action, event, options = {}) => {
    if (edit.blocked(action, event, options)) return false;
    edit.shortcut(action, { event, ...options });
    return true;
  };

  edit.select(heading.id); // Enter on the Heading row, then ArrowDown to the Text row
  assert.equal(press('remove', keyOf('Delete', { target: textRow })), true);
  assert.deepEqual(blockIds(edit.page), [heading.id, divider.id], 'Delete removed the row with the keyboard, not the selected one');
  assert.equal(said().message, say('removed', { label: 'Text' }));

  assert.equal(press('remove', keyOf('Delete', { target: addRow })), false, 'an Add block row has no part to remove');
  assert.deepEqual(blockIds(edit.page), [heading.id, divider.id]);

  edit.select(null);
  assert.equal(press('duplicate', keyOf('d', { ctrlKey: true, target: headingRow })), true, 'nothing selected: the focused row still counts');
  assert.equal(blockIds(edit.page).length, 3);

  // From the canvas: the block around the focused element, '' on an add button, null for nothing.
  const fromCanvas = { fromCanvas: true };
  edit.select(heading.id);
  assert.equal(press('move_down', { ...keyOf('ArrowDown', { altKey: true, shiftKey: true }), nodeId: divider.id }, fromCanvas), true);
  assert.equal(edit.state.selectedId, divider.id);
  assert.equal(blockIds(edit.page).at(-1), divider.id, 'the focused Divider moved, not the selected Heading');
  assert.equal(press('remove', { ...keyOf('Delete'), nodeId: '' }, fromCanvas), false);
  assert.equal(press('remove', { ...keyOf('Delete'), nodeId: 'b-gone99' }, fromCanvas), false, 'a part the page no longer has');
  assert.equal(press('remove', { ...keyOf('Delete'), nodeId: null }, fromCanvas), true, 'nothing focused: the selection');
  assert.ok(!blockIds(edit.page).includes(divider.id));
  done();
});

test('"/" opens the block palette only while the outline or the canvas has the keyboard (WCAG 2.1.4)', needsRuby, () => {
  const page = pageOf([['heading']]);
  const { edit, done } = editorFor(page, { dialogs: { isOpen: () => false } });
  const [row] = outlineRows(edit, [[page.sections[0].cells[0].blocks[0].id, 'block']]);
  const button = edit.doc.createElement('button');
  assert.equal(edit.blocked('palette', keyOf('/', { target: button })), true, 'a "/" typed while a button has focus opens nothing');
  assert.equal(edit.blocked('palette', keyOf('/', { target: edit.doc.body })), true);
  assert.equal(edit.blocked('palette', keyOf('/', { target: row })), false);
  assert.equal(edit.blocked('palette', { ...keyOf('/'), nodeId: null }, { fromCanvas: true }), false);
  done();
});

test('a page that opens while a teammate edits it says why every field is locked', needsRuby, () => {
  const { edit, said, done } = editorFor(pageOf([['divider']]));
  edit.leaseChanged({ mine: false, holderName: 'Ada' });
  assert.equal(edit.state.readOnly, true);
  assert.deepEqual(said(), { message: say('lease_banner', { name: 'Ada' }), error: false });
  edit.state.readOnly = false;
  edit.leaseHeld = true;
  edit.leaseChanged({ mine: false, holderName: 'Grace' });
  assert.deepEqual(said(), { message: say('lease_lost', { name: 'Grace' }), error: true }, 'losing the lease mid-edit stays an error');
  done();
});
