// The Teacher Dashboard's Lesson Summary dialog against a stub document and API:
// it opens once, loads the clicked lesson's summary, and follows the site theme.
import assert from 'node:assert/strict';
import test from 'node:test';

function stubNode(tag) {
  return {
    tag,
    id: '',
    className: '',
    children: [],
    attributes: {},
    listeners: {},
    style: {},
    dataset: {},
    textContent: '',
    classList: {
      owner: null,
      add(name) { this.owner.className = `${this.owner.className} ${name}`.trim(); },
      remove(name) { this.owner.className = this.owner.className.split(' ').filter(part => part !== name).join(' '); },
      contains(name) { return this.owner.className.split(' ').includes(name); },
    },
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    focus() {},
    querySelector(selector) {
      const match = selector.startsWith('[data-')
        ? node => selector.slice(6, -1).replace(/-./g, part => part[1].toUpperCase()) in (node.dataset || {})
        : node => (node.className || '').split(' ').includes(selector.slice(1));
      return findAll(this, match).find(node => node !== this) || null;
    },
  };
}

function findAll(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.children || []) findAll(child, predicate, found);
  return found;
}

function stubDocument(theme) {
  const body = stubNode('body');
  return {
    body,
    documentElement: { theme },
    createElement(tag) {
      const node = stubNode(tag);
      node.classList.owner = node;
      return node;
    },
    createTextNode: text => ({ tag: '#text', textContent: text }),
    getElementById: id => findAll(body, node => node.id === id)[0] || null,
    addEventListener() {},
  };
}

globalThis.getComputedStyle = root => ({ getPropertyValue: name => (name === '--theme' ? ` ${root.theme} ` : '') });

const summaryFrom = responseCount => ({
  responseCount,
  averages: { lesson: 4, engage: 4, popcorn: 4, homework: 4 },
  counts: { lesson: [0, 0, 0, responseCount, 0], engage: [0, 0, 0, responseCount, 0], popcorn: [0, 0, 0, responseCount, 0], homework: [0, 0, 0, responseCount, 0] },
  pros: ['Clear'], grows: ['Slower'],
});

test('the dialog loads the clicked lesson\'s summary and reuses itself', async () => {
  const root = stubDocument('dark');
  globalThis.document = root;
  const { openLessonSummary, isLightTheme } = await import('../js/lesson-feedback-teacher.js');
  const requested = [];
  const api = { loadSummary: async id => { requested.push(id); return summaryFrom(2); } };

  await openLessonSummary({ assignment: { id: 7, name: '1.02 Variables' }, root, api });
  await openLessonSummary({ assignment: { id: 8, name: 'Loops' }, root, api });

  assert.deepEqual(requested, [7, 8]);
  const dialogs = findAll(root.body, node => node.id === 'lesson-summary-modal');
  assert.equal(dialogs.length, 1, 'one dialog, reused');
  assert.equal(dialogs[0].querySelector('.ocs__modal-title').textContent, 'Lesson Summary · Loops');
  assert.equal(dialogs[0].getAttribute('aria-hidden'), 'false');
  const card = findAll(dialogs[0], node => /\blesson-summary\b/.test(node.className))[0];
  assert.doesNotMatch(card.className, /--light/, 'the default site theme is dark');
  assert.equal(isLightTheme({ theme: 'base' }), true);
});

test('a refused request shows Spring\'s message in the dialog', async () => {
  const root = stubDocument('base');
  globalThis.document = root;
  const { openLessonSummary } = await import('../js/lesson-feedback-teacher.js');
  const api = { loadSummary: async () => { throw new Error('Only teachers and graders can see the Lesson Summary.'); } };

  await openLessonSummary({ assignment: { id: 7, name: 'Lesson' }, root, api });

  const body = findAll(root.body, node => 'summaryBody' in node.dataset)[0];
  assert.equal(body.textContent, 'Couldn\'t load the Lesson Summary: Only teachers and graders can see the Lesson Summary.');
});
