/**
 * @module workspace-contract-tests
 * @description Persistence and runner-save contracts for protecting student work.
 * @data In-memory Storage and runner fixtures simulate incomplete drafts,
 * failed writes, conflicting tabs, manual source edits, and awaited saves.
 * @usage Run with Node's test runner alongside the existing builder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createDefaultBuilderState, createNpcState } from '../js/builder-state.mjs';
import { createWorkspaceStore, parseWorkspace, serializeWorkspace } from '../js/workspace-store.mjs';
import { createGameRunnerController } from '../../../../assets/js/pages/runners/core/GameRunnerController.js';
import { BaseRunner } from '../../../../assets/js/pages/runners/core/BaseRunner.js';
import { EditorManager } from '../../../../assets/js/pages/runners/core/EditorManager.js';

function workspace() {
  const builderState = createDefaultBuilderState('alien_planet', 'chill_guy');
  builderState.npcs = [createNpcState(0, 'chill_guy'), createNpcState(1, 'chill_guy')];
  builderState.barriers = [{
    id: 'barrier-1', name: 'Wall', visible: false,
    points: [{ x: 0.1, y: 0.2 }, { x: 0.8, y: 0.4 }]
  }];
  return {
    schemaVersion: 1, kind: 'ocs-gamebuilder-workspace', builderState,
    editorCode: '// My manually edited code\n', lastGeneratedCode: '// Generated code\n',
    engineVersion: 'GameEnginev1.1', collapsed: false,
    editing: { activeBarrierId: null, barrierEditSnapshot: null, nextNpcIndex: 2, nextBarrierIndex: 1 }
  };
}

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

test('workspace JSON preserves exact manual code, NPCs, hidden barriers and engine selection', () => {
  const document = workspace();
  assert.deepEqual(parseWorkspace(serializeWorkspace(document)), document);
  document.editorCode = '';
  document.engineVersion = 'GameEnginev1';
  assert.deepEqual(parseWorkspace(serializeWorkspace(document)), document);
});

test('unfinished forms and an active barrier retain undo/cancel recovery state', () => {
  const document = workspace();
  document.builderState.player.position.x = '';
  document.builderState.name = '';
  document.editing.activeBarrierId = 'barrier-1';
  document.editing.barrierEditSnapshot = structuredClone(document.builderState.barriers[0].points);
  document.builderState.barriers[0].points.pop();
  assert.deepEqual(parseWorkspace(serializeWorkspace(document)), document);
  document.editing.barrierEditSnapshot = [];
  document.builderState.barriers[0].points = [];
  assert.deepEqual(parseWorkspace(serializeWorkspace(document)), document);
});

test('rejects malformed, unsupported and unknown fields without conversion', () => {
  assert.throws(() => parseWorkspace('{'), SyntaxError);
  for (const change of [
    (doc) => { doc.schemaVersion = 2; },
    (doc) => { doc.editorCode = null; },
    (doc) => { doc.builderState.npcs[0].id = 'bad"selector'; },
    (doc) => { doc.builderState.npcs.push(doc.builderState.npcs[0]); },
    (doc) => { doc.builderState.player.position.x = null; },
    (doc) => { doc.builderState.player.GRAVITY = true; },
    (doc) => { doc.editing.activeBarrierId = 'missing'; },
    (doc) => { doc.builderState.barriers[0].points[0].x = 5; }
  ]) {
    const document = workspace();
    change(document);
    assert.throws(() => serializeWorkspace(document), /Invalid workspace/);
  }
});

test('draft changes do not overwrite the explicit save', () => {
  const memory = storage();
  const store = createWorkspaceStore(memory, 'test');
  store.read('draft');
  store.read('saved');
  const document = workspace();
  store.write('saved', document);
  document.builderState.name = 'Next experiment';
  store.write('draft', document);
  const reopened = createWorkspaceStore(memory, 'test');
  assert.equal(reopened.read('saved').document.builderState.name, 'My Game');
  assert.equal(reopened.read('draft').document.builderState.name, 'Next experiment');
});

test('quota errors retain the last valid draft and permit a later retry', () => {
  const memory = storage();
  const store = createWorkspaceStore(memory, 'test');
  store.read('draft');
  store.write('draft', workspace());
  const original = memory.getItem('test:draft');
  const write = memory.setItem;
  memory.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => store.write('draft', workspace()), /Quota exceeded/);
  assert.equal(memory.getItem('test:draft'), original);
  memory.setItem = write;
  assert.doesNotThrow(() => store.write('draft', workspace()));
});

test('another tab cannot silently overwrite a newer draft', () => {
  const memory = storage();
  const first = createWorkspaceStore(memory, 'test');
  const second = createWorkspaceStore(memory, 'test');
  first.read('draft');
  second.read('draft');
  first.write('draft', workspace());
  assert.throws(() => second.write('draft', workspace()), /Another tab/);
  assert.equal(first.read('draft').document.editorCode, workspace().editorCode);
});

test('corrupt stored documents are not modified by reading', () => {
  const memory = storage();
  memory.setItem('test:draft', '{"schemaVersion":999}');
  const store = createWorkspaceStore(memory, 'test');
  assert.throws(() => store.read('draft'), /Invalid workspace/);
  assert.equal(memory.getItem('test:draft'), '{"schemaVersion":999}');
});

function controllerFixture() {
  let code = '// current';
  let saved = '// previous';
  const events = [];
  const runner = {
    storageKey: 'runner-key',
    storage: { get: () => saved },
    getValue: () => code,
    setValue: (value) => { code = value; },
    saveToStorage: (value) => { saved = value; },
    onCodeChange: () => {},
    updateStatus: () => {}
  };
  const controller = createGameRunnerController({
    runner, runnerId: 'test-runner',
    container: { dispatchEvent: (event) => events.push(event) },
    engineSelect: { value: 'GameEnginev1.1', options: [{ value: 'GameEnginev1.1' }] },
    run() {}, stop() {}
  });
  return { controller, runner, events };
}

test('successful source save emits exactly one snapshot and exposes it for late subscribers', async () => {
  const { controller, events } = controllerFixture();
  assert.equal(controller.getSaveState().source, '// previous');
  assert.equal(events.length, 0);
  const result = await controller.save();
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'ocs:runner-saved');
  assert.equal(events[0].bubbles, true);
  assert.equal(result.source, '// current');
  assert.deepEqual(controller.getSaveState(), result);
  controller.setCode('// later edit');
  assert.equal(controller.getSaveState().source, '// current');
});

test('failed source save emits no saved event or workspace hook', async () => {
  const { controller, runner, events } = controllerFixture();
  let workspaceCalled = false;
  controller.setSaveHandler(() => { workspaceCalled = true; });
  runner.saveToStorage = () => { throw new Error('Storage blocked'); };
  await assert.rejects(controller.save(), /Storage blocked/);
  assert.equal(events.length, 0);
  assert.equal(workspaceCalled, false);
  assert.equal(controller.getSaveState().source, '// previous');
});

test('runner save awaits workspace persistence and reports its failure separately', async () => {
  const { controller, events } = controllerFixture();
  let finish;
  controller.setSaveHandler(() => new Promise((resolve) => { finish = resolve; }));
  let completed = false;
  const pending = controller.save().then(() => { completed = true; });
  await Promise.resolve();
  assert.equal(completed, false);
  finish();
  await pending;
  assert.equal(completed, true);
  controller.setSaveHandler(() => { throw new Error('Workspace full'); });
  await assert.rejects(controller.save(), /Workspace full/);
  assert.equal(events.length, 2);
});

test('save button never flashes success after its save action fails', async () => {
  let click;
  let flashed = false;
  const button = { addEventListener: (_, callback) => { click = callback; }, disabled: false };
  const statuses = [];
  const runner = {
    getHookElement: (hook) => hook === 'save' ? button : null,
    flashButton: () => { flashed = true; },
    updateStatus: (status) => statuses.push(status),
    containerId: 'test'
  };
  BaseRunner.prototype.bindEditorButtons.call(runner, {
    saveAction: () => { throw new Error('Storage full'); }
  });
  const original = console.error;
  console.error = () => {};
  try { await click(); } finally { console.error = original; }
  assert.equal(flashed, false);
  assert.deepEqual(statuses, ['Save failed: Storage full']);
  assert.equal(button.disabled, false);
});

test('textarea fallback restores saved text and emits student typing changes', () => {
  let input;
  const textarea = { value: '', addEventListener: (_, listener) => { input = listener; } };
  const changes = [];
  const editor = new EditorManager({ id: 'test', querySelector: () => textarea }, {
    onChange: (code) => changes.push(code)
  });
  const original = console.warn;
  console.warn = () => {};
  try { editor.initialize({ initialCode: '// restored manually edited code' }); }
  finally { console.warn = original; }
  assert.equal(textarea.value, '// restored manually edited code');
  textarea.value = '// Student typed a change';
  input();
  assert.deepEqual(changes, ['// restored manually edited code', '// Student typed a change']);
});

test('ordinary runner Save retains its storage behavior without a workspace handler', async () => {
  let click;
  let saved = false;
  let flashed = false;
  const button = { addEventListener: (_, listener) => { click = listener; } };
  const runner = {
    getHookElement: (hook) => hook === 'save' ? button : null,
    saveToStorage: () => { saved = true; },
    flashButton: () => { flashed = true; }
  };
  BaseRunner.prototype.bindEditorButtons.call(runner);
  await click();
  assert.equal(saved, true);
  assert.equal(flashed, true);
});

test('workspace actions extend the runner toolbar without duplicate save or startup generation', () => {
  const page = readFileSync(new URL('../index.md', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../js/app.mjs', import.meta.url), 'utf8');
  const actions = readFileSync(new URL('../../../../_includes/runners/fragments/workspace-actions.html', import.meta.url), 'utf8');
  const runner = readFileSync(new URL('../../../../_includes/runners/game.html', import.meta.url), 'utf8');
  assert.match(page, /workspace_controls=true/);
  assert.doesNotMatch(page, /data-workspace-action|ocs__gamebuilder-save-controls/);
  assert.doesNotMatch(app, /generateButton\.click\(\)/);
  assert.match(runner, /include\.workspace_controls/);
  assert.doesNotMatch(actions, /data-workspace-action="(?:save|new)"/);
  for (const action of ['load', 'export', 'import', 'export-code']) {
    assert.match(actions, new RegExp(`data-workspace-action="${action}"`));
  }
  assert.equal((actions.match(/aria-label=/g) || []).length, 4);
  assert.equal((actions.match(/ocs__btn utility ocs__btn--icon/g) || []).length, 4);
});

test('Clear restores runner construction defaults without changing workspace panels', () => {
  let click;
  const button = { addEventListener: (_, listener) => { click = listener; } };
  const operations = [];
  const runner = {
    getHookElement: (hook) => hook === 'clear' ? button : null,
    clearStorage: () => operations.push('clear-source-storage'),
    setValue: (value) => operations.push(value),
    flashButton: () => {}
  };
  BaseRunner.prototype.bindEditorButtons.call(runner, {
    resetValue: '', canClear: () => true, onClear: () => operations.push('stop')
  });
  click();
  assert.deepEqual(operations, ['clear-source-storage', '', 'stop']);
});
