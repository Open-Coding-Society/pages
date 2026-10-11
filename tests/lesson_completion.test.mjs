import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const layout = readFileSync(new URL('../_layouts/post.html', import.meta.url), 'utf8');
const updateFunction = layout.match(/  function updateCompleteButton\(isCompleted\) \{[\s\S]*?(?=\n  function updateLessonItems)/)[0];
const completionFunctions = layout.slice(
  layout.indexOf('  function getCompletionData()'),
  layout.indexOf('  function updateCompleteButton('),
);

test('icon-only completion toggles, persists, and restores its accessible state', () => {
  const attributes = new Map();
  const classes = new Set(['fa-circle']);
  const button = { setAttribute: (name, value) => attributes.set(name, value) };
  const icon = {
    classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) },
    closest: () => button,
  };
  const stored = new Map();
  const context = vm.createContext({
    document: { getElementById: id => id === 'complete-icon-topbar' ? icon : null },
    localStorage: {
      getItem: key => stored.get(key),
      setItem: (key, value) => stored.set(key, value),
    },
    STORAGE_KEY: 'csa-lesson-completion',
    CURRENT_LESSON_ID: '/example/',
    window: { dispatchEvent() {} },
    CustomEvent: class {},
    console,
  });
  vm.runInContext(`${completionFunctions}\n${updateFunction}
    function syncCompletionUI() {
      updateCompleteButton(getCompletionData()[CURRENT_LESSON_ID] || false);
    }
    syncCompletionUI();`, context);
  assert.equal(attributes.get('aria-pressed'), 'false');
  context.window.toggleComplete();
  assert.equal(JSON.parse(stored.get('csa-lesson-completion'))['/example/'], true);
  assert.equal(classes.has('fa-circle-check'), true);
  assert.equal(classes.has('fa-circle'), false);
  assert.equal(attributes.get('aria-pressed'), 'true');
  assert.equal(button.title, 'Mark lesson incomplete');
  vm.runInContext('syncCompletionUI();', context);
  assert.equal(attributes.get('aria-pressed'), 'true');
  context.window.toggleComplete();
  assert.equal(JSON.parse(stored.get('csa-lesson-completion'))['/example/'], false);
  assert.equal(classes.has('fa-circle'), true);
  assert.equal(attributes.get('aria-label'), 'Mark lesson complete');
  assert.equal(attributes.get('aria-pressed'), 'false');
});
