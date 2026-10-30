// The inspector on the small fake DOM: where the keyboard goes when a change rebuilds it, and what
// Page settings offers for each state of a teacher's approval.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInspector } from '../js/editor-inspector.js';
import { setHidden } from '../js/page-model.js';
import { textOf } from '../js/registry.js';
import { createDocument, createEvent, createWindow, settle, text } from './fixtures/live/dom.mjs';
import { pageOf } from './fixtures/live/pages.mjs';
import { runSnippet } from './fixtures/snippet.mjs';
import { loadRegistry, needsRuby, readYaml } from './helpers.mjs';

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

function inspectorFor({ groups = { available: false, list: async () => [] } } = {}) {
  const doc = createDocument();
  createWindow(doc);
  const root = doc.createElement('section');
  root.setAttribute('tabindex', '-1');
  doc.body.appendChild(root);
  const calls = [];
  const record = (name) => (...args) => calls.push([name, ...args]);
  const inspector = createInspector({
    root, doc, registry: editorRegistry(), say, text: words, richText: {},
    services: { groups, openPublished: (slug) => `/ui-builder/view/?page=${slug}`, errorText: (error) => `store-words:${error && error.name}` },
    actions: {
      changeSettings: record('changeSettings'), changePage: record('changePage'), nodeAction: record('nodeAction'), changeTeam: record('changeTeam'),
      refreshEditors: record('refreshEditors'), setVisibility: record('setVisibility'), unpublish: record('unpublish'), deletePage: record('deletePage'),
    },
  });
  const action = (name) => root.querySelector(`[data-ui-action="${name}"]`);
  return { doc, root, inspector, calls, action };
}

const stateOf = (extra = {}) => ({ selectedId: null, issues: [], readOnly: false, ref: { kind: 'spring', id: '1' }, meta: {}, capabilities: {}, ...extra });

test('a rebuild gives the keyboard back to the button that does the same, else to the pane', needsRuby, () => {
  let page = pageOf([[['heading', { text: 'Rain' }], ['heading', { text: 'Wind' }]]]);
  const [rain, wind] = page.sections[0].cells[0].blocks;
  const { doc, root, inspector, action } = inspectorFor();
  inspector.update(page, stateOf({ selectedId: rain.id }));

  const hide = action('toggle_hidden');
  hide.focus();
  page = setHidden(page, rain.id, true);
  inspector.update(page, stateOf({ selectedId: rain.id }));
  assert.notEqual(action('toggle_hidden'), hide, 'Hide rebuilt the toolbar');
  assert.equal(doc.activeElement, action('toggle_hidden'), 'and the keyboard is on Show now');
  assert.equal(doc.activeElement.getAttribute('aria-label'), say('show'));

  // Remove selects the next block: the keyboard stays on Remove, now for that block.
  action('remove').focus();
  inspector.update(page, stateOf({ selectedId: wind.id }));
  assert.equal(doc.activeElement, action('remove'));

  // Select its section: a section has no such button, so the pane itself takes the keyboard.
  action('select_parent').focus();
  inspector.update(page, stateOf({ selectedId: page.sections[0].id }));
  assert.equal(doc.activeElement, root);

  // A rebuild while the keyboard is somewhere else leaves it there.
  const outside = doc.createElement('button');
  doc.body.appendChild(outside);
  outside.focus();
  inspector.update(page, stateOf({ selectedId: wind.id }));
  assert.equal(doc.activeElement, outside);
});

test('picking a team keeps the keyboard on the team list while Page settings is rebuilt', needsRuby, async () => {
  const groups = { available: true, list: async () => [{ id: 11, name: 'Binary Beasts' }, { id: 12, name: 'Byte Club' }] };
  const page = pageOf([[]]);
  const { doc, root, inspector } = inspectorFor({ groups });
  const state = (extra) => stateOf({ capabilities: { teams: true }, meta: { isOwner: true, groupId: 11, groupName: 'Binary Beasts' }, ...extra });
  inspector.update(page, state());
  await settle();
  const team = () => root.querySelector('[data-ui-field="team"] select');
  const before = team();
  before.focus();
  // An arrow key in a closed list changes the team at once in Chrome on Windows.
  inspector.update(page, state({ pendingTeam: { id: 12, name: 'Byte Club' } }));
  await settle();
  assert.notEqual(team(), before, 'the pick rebuilt Page settings');
  assert.equal(doc.activeElement, team(), 'and the keyboard is on the new team list');
  assert.equal(team().value, '12');
});

test('an approval that ran out, or a newer publish, can be approved or asked for again', needsRuby, () => {
  const page = pageOf([[]]);
  const now = Date.now();
  const published = { status: 'PUBLISHED', slug: 'flood-watch', publishedVersion: 6 };
  const shown = (meta, teacher) => {
    const { root, inspector, action } = inspectorFor();
    inspector.update(page, stateOf({ meta: { ...published, ...meta }, capabilities: { visibility: true, publish: true, teacher } }));
    const field = root.querySelector('[data-ui-field="visibility"]');
    return {
      pills: field.querySelectorAll('b').map(text), approve: Boolean(action('approve')), ask: Boolean(action('ask_public')),
      members: Boolean(action('members_only')), sentence: text(field.querySelector('p')),
    };
  };

  const ended = shown({ visibility: 'PUBLIC', publicUntil: now - 1000 }, true);
  assert.deepEqual(ended.pills, [say('approval_ended')]);
  assert.equal(ended.approve, true, 'the teacher can approve it again');
  assert.equal(ended.sentence, say('visibility_signed_in'), 'visitors get nothing now');
  assert.equal(ended.members, true);

  const newer = shown({ visibility: 'PUBLIC', publicPending: true }, false);
  assert.deepEqual(newer.pills, [say('approval_newer')]);
  assert.equal(newer.ask, true, 'the student can ask again');
  assert.equal(newer.sentence, say('visibility_public'), 'visitors still get the approved copy');

  const asked = shown({ visibility: 'PUBLIC', publicPending: true, publicRequested: true }, false);
  assert.deepEqual(asked.pills, [say('approval_newer'), words('teacher.public_requested')]);
  assert.equal(asked.ask, false, 'asked once already');

  const live = shown({ visibility: 'PUBLIC', publicUntil: now + 86400000 }, true);
  assert.deepEqual(live.pills, []);
  assert.equal(live.approve, false, 'nothing to approve while the approval covers the live page');
  assert.equal(live.members, true);

  const members = shown({ visibility: 'SIGNED_IN' }, true);
  assert.deepEqual([members.approve, members.members], [true, false]);
});

test('the team picker words a load failure through the store, never the error message', needsRuby, async () => {
  const error = Object.assign(new Error('raw network text'), { name: 'OfflineError' });
  const groups = { available: true, list: async () => { throw error; } };
  const { root, inspector } = inspectorFor({ groups });
  inspector.update(pageOf([[]]), stateOf({ capabilities: { teams: true }, meta: { isOwner: true } }));
  await settle();
  const note = text(root.querySelector('[data-ui-field="team"] .ui-builder-note'));
  assert.ok(note.includes(say('group_failed', { message: 'store-words:OfflineError' })), note);
  assert.ok(!note.includes('raw network text'), 'the error\'s own message never reaches a student');
});

test('a teacher approving a page with unpublished changes is told it shows the published copy', needsRuby, () => {
  const page = pageOf([[]]);
  const base = { status: 'PUBLISHED', slug: 'flood-watch', publishedVersion: 6, visibility: 'SIGNED_IN' };
  const field = (meta, teacher) => {
    const { root, inspector } = inspectorFor();
    inspector.update(page, stateOf({ meta: { ...base, ...meta }, capabilities: { visibility: true, publish: true, teacher } }));
    return root.querySelector('[data-ui-field="visibility"]');
  };
  const changed = field({ hasUnpublishedChanges: true }, true);
  assert.ok(text(changed).includes(say('approve_shows_published')), 'the note warns the canvas shows the draft');
  const link = changed.querySelector('a[href="/ui-builder/view/?page=flood-watch"]');
  assert.ok(link, 'and links the published copy the teacher would approve');
  assert.equal(text(link), say('class_open_published'));

  const clean = field({ hasUnpublishedChanges: false }, true);
  assert.ok(!text(clean).includes(say('approve_shows_published')), 'no note when the draft matches the published copy');
  const student = field({ hasUnpublishedChanges: true }, false);
  assert.ok(!text(student).includes(say('approve_shows_published')), 'a student asking, not approving, gets no note');
});

test('Page settings lists the page-wide problems that have no field of their own', needsRuby, () => {
  const page = pageOf([[]]);
  const { root, inspector } = inspectorFor();
  const issues = [{ nodeId: null, field: null, key: 'too_many_sections', message: 'A page can have at most 25 sections.' }];
  inspector.update(page, stateOf({ issues }));
  const box = root.querySelector('.ui-builder-page-issues');
  assert.ok(box && !box.hidden, 'the list is shown');
  assert.ok(text(box).includes('A page can have at most 25 sections.'));
  assert.ok(text(box).includes(say('page_issues_title')));
  inspector.update(page, stateOf({ issues: [] }));
  assert.equal(root.querySelector('.ui-builder-page-issues').hidden, true, 'and hidden once the page is fixed');
});

test('Test connection fills in a list not picked yet, without touching mapped fields', needsRuby, async () => {
  const doc = createDocument();
  createWindow(doc);
  const root = doc.createElement('section');
  root.setAttribute('tabindex', '-1');
  doc.body.appendChild(root);
  const patches = [];
  const fetchImpl = async () => new Response(JSON.stringify({ users: [{ name: 'Ada' }, { name: 'Alan' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  const inspector = createInspector({
    root, doc, registry: editorRegistry(), say, text: words, richText: {},
    services: { groups: { available: false, list: async () => [] } },
    apiOptions: { fetchImpl, pageHost: 'pages.opencodingsociety.com', pageProtocol: 'https:', baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' },
    actions: { changeSettings: (id, patch) => patches.push(patch) },
  });
  // The Flask starter's shape: a slot is already mapped (title), so Test keeps the fields.
  // list_path "" (not picked yet) is filled in with the list the reply holds.
  const page = pageOf([[['api_data', { title: 'Users', view: 'list', source: { url: 'https://team.example/api/users', list_path: '', title_path: 'name', snapshot: { items: [], fetched_at: 0, from_loopback: false } } }]]]);
  const block = page.sections[0].cells[0].blocks[0];
  inspector.update(page, stateOf({ selectedId: block.id }));
  const testButton = [...root.querySelectorAll('.ui-builder-api button')].find((button) => text(button) === say('api_test'));
  testButton.click();
  await settle();
  const last = patches[patches.length - 1];
  assert.equal(last.source.list_path, 'users', 'the list path is filled from the reply');
  assert.equal(last.source.title_path, 'name', 'the mapped field is left as it was');
});

// An API block's inspector, its reply served by a fake fetch; patches records each change, and
// shown each snippet Show code opened.
function apiInspector(reply, source) {
  const doc = createDocument();
  createWindow(doc);
  const root = doc.createElement('section');
  doc.body.appendChild(root);
  const patches = [];
  const shown = [];
  const fetchImpl = async () => new Response(JSON.stringify(reply), { status: 200, headers: { 'content-type': 'application/json' } });
  const inspector = createInspector({
    root, doc, registry: editorRegistry(), say, text: words, richText: {},
    services: { groups: { available: false, list: async () => [] }, showCode: (code) => shown.push(code) },
    apiOptions: { fetchImpl, pageHost: 'pages.opencodingsociety.com', pageProtocol: 'https:', baseurl: '', pageOrigin: 'https://pages.opencodingsociety.com' },
    actions: { changeSettings: (id, patch) => patches.push(patch) },
  });
  const empty = { url: 'https://team.example/api/team', list_path: '', title_path: '', text_path: '', image_path: '', link_path: '', value_path: '', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false } };
  const page = pageOf([[['api_data', { title: 'Team', view: 'list', source: { ...empty, ...source } }]]]);
  inspector.update(page, stateOf({ selectedId: page.sections[0].cells[0].blocks[0].id }));
  const selects = () => root.querySelectorAll('.ui-builder-api select');
  const press = async (key) => {
    [...root.querySelectorAll('.ui-builder-api button')].find((button) => text(button) === say(key)).click();
    await settle();
  };
  const pickList = (value) => {
    selects()[0].value = value;
    selects()[0].dispatchEvent(createEvent('change'));
  };
  const report = () => root.querySelectorAll('.ui-builder-checks li').map((line) => [line.getAttribute('data-level'), text(line)]);
  return { patches, shown, listSelect: () => selects()[0], titleSelect: () => selects()[1], test: () => press('api_test'), press, pickList, report };
}

const optionsOf = (select) => select.querySelectorAll('option').map((option) => [option.getAttribute('value'), text(option)]);
// A report line's words after the time the reply took ({ms} differs on every run).
const afterTime = (key, vars) => words(`doctor.${key}`, vars).split('{ms}').pop();

// "The whole reply" used to be stored as "", which every reader now takes as "not picked yet" and
// guesses: a reply holding a list showed that list, and Test wrote the list's path over the choice.
test('Which list keeps "The whole reply" (".") apart from a list not picked yet (""), and Test keeps it', needsRuby, async () => {
  const reply = { team: 'Flood Watch', users: [{ name: 'Ada' }, { name: 'Alan' }] };
  const fresh = apiInspector(reply, {});
  assert.deepEqual(optionsOf(fresh.listSelect()), [['', say('api_list_auto')], ['.', say('api_list_whole')]]);
  assert.equal(fresh.listSelect().value, '', 'a new block has no list picked yet');
  fresh.listSelect().value = '.';
  fresh.listSelect().dispatchEvent(createEvent('change'));
  assert.equal(fresh.patches[fresh.patches.length - 1].source.list_path, '.', 'the whole reply is stored as "."');

  // The first test guesses the fields of the whole reply, not of the list inside it.
  await fresh.test();
  const first = fresh.patches[fresh.patches.length - 1].source;
  assert.deepEqual([first.list_path, first.title_path], ['.', 'team']);
  assert.deepEqual(optionsOf(fresh.listSelect()).map(([value]) => value), ['', '.', 'users'], 'the reply\'s lists are still offered');
  assert.equal(fresh.listSelect().value, '.');
  assert.ok(optionsOf(fresh.titleSelect()).some(([value]) => value === 'team'), 'fields come from the whole reply');

  // Slots mapped: a picked list stays, the whole reply or a path that is no list in this reply.
  for (const list_path of ['.', 'users[0]']) {
    const mapped = apiInspector(reply, { list_path, title_path: 'team' });
    await mapped.test();
    assert.deepEqual(mapped.patches, [], `Test keeps ${list_path}`);
    assert.equal(mapped.listSelect().value, list_path);
  }
  // Only a list not picked yet is filled in, as the Flask starter's is.
  const starter = apiInspector(reply, { title_path: 'name' });
  await starter.test();
  assert.equal(starter.patches[starter.patches.length - 1].source.list_path, 'users');
});

// Test connection's count and Show code's code follow the list the block shows: the canvas
// preview and the published page read {count, users} with list_path "" as the users list.
test('the report and Show code follow Which list, and Show code finds a list not picked yet as the block does', needsRuby, async () => {
  const reply = { count: 2, users: [{ name: 'Ada' }, { name: 'Alan' }] };
  const api = apiInspector(reply, {});
  await api.test();
  assert.deepEqual([api.patches[api.patches.length - 1].source.list_path, api.patches[api.patches.length - 1].source.title_path], ['users', 'name']);
  assert.ok(api.report()[0][1].endsWith(afterTime('ok', { count: 2 })), api.report()[0][1]);
  await api.press('show_code');
  assert.ok(api.shown[0].includes('const LIST_PATH = "users";'), 'the list Test filled in goes in as it is');
  assert.ok(!api.shown[0].includes('findItems'), 'with no finding of its own');
  assert.deepEqual(await runSnippet(api.shown[0], reply), ['Ada', 'Alan']);

  // Back to "Find the list for me" (""): the block finds users again, and so does Show code's code.
  api.pickList('');
  assert.ok(api.report()[0][1].endsWith(afterTime('ok', { count: 2 })), 'still the two users');
  await api.press('show_code');
  assert.ok(api.shown[1].includes('const LIST_PATH = "";'), 'the code finds the list when it runs');
  assert.deepEqual(await runSnippet(api.shown[1], reply), ['Ada', 'Alan']);

  // The whole reply is one item, and the report says so at once.
  api.pickList('.');
  assert.deepEqual(api.report().map(([level]) => level), ['ok']);
  assert.ok(api.report()[0][1].endsWith(afterTime('ok_one')), api.report()[0][1]);
  await api.press('show_code');
  assert.ok(api.shown[2].includes('const LIST_PATH = ".";'), 'a picked list goes in as it is');

  // Before any Test, Show code draws what the block shows: the users, not the reply as one item.
  for (const shape of [reply, { team: 'Flood Watch', users: reply.users }]) {
    const untested = apiInspector(shape, { title_path: 'name' });
    await untested.press('show_code');
    assert.ok(untested.shown[0].includes('const LIST_PATH = "";'));
    assert.deepEqual(await runSnippet(untested.shown[0], shape), ['Ada', 'Alan'], JSON.stringify(shape));
  }
});

// The Flask starter maps joke and haha with no list picked. The published page shows a reply whose
// only list is empty or holds plain values as one joke; Test used to write that list in instead.
// The report names that list rather than say the reply has none.
test('Test connection leaves a list not picked yet alone when the reply holds no list of objects, and names the list it holds', needsRuby, async () => {
  const cases = [
    [{ joke: 'Why?', haha: 3, comments: [] }, 'ok_list_empty', 'comments'],
    [{ joke: 'Why?', haha: 3, tags: ['pun'] }, 'ok_list_plain', 'tags'],
  ];
  for (const [reply, key, path] of cases) {
    const label = JSON.stringify(reply);
    const api = apiInspector(reply, { title_path: 'joke', value_path: 'haha' });
    await api.test();
    assert.deepEqual(api.patches, [], `list_path stays "": ${label}`);
    const [connected, found, ...rest] = api.report();
    assert.ok(connected[1].endsWith(afterTime('ok_object')), connected[1]);
    assert.deepEqual(found, ['info', words(`doctor.${key}`, { path })], label);
    assert.deepEqual(rest, [], `no warning that the reply has no list: ${label}`);

    await api.press('api_snapshot_save');
    const saved = api.patches[api.patches.length - 1].source.snapshot.items;
    assert.deepEqual(saved.map((item) => [item.title, item.value]), [['Why?', '3']], `the saved copy has the one joke: ${label}`);
    await api.press('show_code');
    assert.deepEqual(await runSnippet(api.shown[0], reply), ['Why?'], `Show code draws the one joke: ${label}`);
  }
});

test('Delete page shows its icon apart from its words', needsRuby, () => {
  const { root, inspector, action } = inspectorFor();
  inspector.update(pageOf([[]]), stateOf());
  const button = action('delete_page');
  assert.match(button.getAttribute('class'), /\bocs__btn--icon\b/);
  assert.equal(button.childNodes[1].nodeValue, say('delete_page'), 'the words sit right in the button, with no leading space');
  assert.ok(root.contains(button));
});
