import test from 'node:test';
import assert from 'node:assert/strict';
import { readerContext, readerLink, courseWeeks } from '../_projects/systems/courses/reader/js/model.js';
import { startDocumentReader } from '../_projects/systems/courses/reader/js/browser.js';

const membership = { csp: { week: 0 }, csse: { week: 1 } };

test('plain links keep their default course; shareable links select only real memberships', () => {
  assert.deepEqual(readerContext('', membership, 'csp'), { course: 'csp', issue: '' });
  assert.deepEqual(readerContext('?context=course&course=csse', membership, 'csp'), { course: 'csse', issue: '' });
  assert.deepEqual(readerContext('?context=topics', membership, 'csp'), { course: null, issue: '' });
  assert.deepEqual(readerContext('', {}, ''), { course: null, issue: '' });
  for (const search of ['?context=wrong', '?context=course&course=csa']) {
    const state = readerContext(search, membership, 'csp');
    assert.equal(state.course, 'csp');
    assert.notEqual(state.issue, '');
  }
});

test('all views link to the same original document, under a configured baseurl', () => {
  const path = '/javascript/intro';
  for (const course of ['csp', 'csse', null]) {
    const url = new URL(readerLink(path, '/preview', { course }, 'category=javascript&q=object+literal&match=and'), 'https://ocs.example');
    assert.equal(url.pathname, '/preview/javascript/intro');
    assert.equal(url.searchParams.get('context'), course ? 'course' : 'topics');
    assert.equal(url.searchParams.get('course'), course);
    assert.equal(url.searchParams.get('q'), 'object literal');
    assert.equal(url.searchParams.get('match'), 'and');
  }
});

test('course cadence uses each placement without duplicating document identity', () => {
  const documents = [
    { url: '/shared', title: 'Lesson 2', courses: membership },
    { url: '/later', title: 'Lesson 10', courses: { csp: { week: '0' } } },
    { url: '/elsewhere', title: 'Different course', courses: { csa: { week: 3 } } },
  ];
  assert.deepEqual(courseWeeks(documents, 'csse').map(group => [group.week, group.lessons.map(doc => doc.url)]),
    [[1, ['/shared']]]);
  assert.deepEqual(courseWeeks(documents, 'csp').map(group => [group.week, group.lessons.map(doc => doc.url)]),
    [[0, ['/shared', '/later']]]);
  assert.equal(documents[0].url, '/shared');
});

test('reader navigation displays lesson types and updates week completion without changing identity', async t => {
  class Element {
    constructor(tag = 'div') {
      this.tag = tag;
      this.dataset = {};
      this.attributes = {};
      this.children = [];
      this.listeners = {};
      this.className = '';
      this.classList = {
        add: name => { this.className += ` ${name}`; },
        toggle: (name, enabled) => {
          const classes = new Set(this.className.split(/\s+/).filter(Boolean));
          if (enabled) classes.add(name); else classes.delete(name);
          this.className = [...classes].join(' ');
        },
        contains: name => this.className.split(/\s+/).includes(name),
      };
    }
    set textContent(value) { this.children = [String(value)]; }
    get textContent() { return this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    querySelectorAll(selector) {
      const data = selector.match(/^\[data-([a-z-]+)\]$/);
      if (!data) return [];
      const key = data[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const results = [];
      const walk = element => {
        element.children.filter(child => typeof child !== 'string').forEach(child => {
          if (Object.hasOwn(child.dataset, key)) results.push(child);
          walk(child);
        });
      };
      walk(this);
      return results;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  }

  const hooks = Object.fromEntries([
    'navigation', 'tree', 'context', 'query', 'category', 'status', 'complete',
    'pager', 'heading', 'topic-controls', 'home', 'full-topics', 'count', 'previous', 'next',
  ].map(name => [name, new Element()]));
  const root = new Element();
  root.dataset = {
    membership: JSON.stringify({ csp: { week: 1 } }), baseurl: '/preview',
    documentUrl: '/assignment/', defaultCourse: 'csp', indexUrl: '/index.json',
  };
  root.querySelector = selector => hooks[selector.match(/^\[data-reader-([a-z-]+)\]$/)?.[1]];
  root.querySelectorAll = () => [];
  const documents = [
    { title: 'Assignment with a full descriptive title', url: '/assignment/', assignment: true, categories: [], courses: { csp: { week: 1 } } },
    { title: 'Reference', url: '/reference/', assignment: false, categories: [], courses: { csp: { week: 1 } } },
    { title: 'Outside the schedule', url: '/outside/', assignment: false, categories: [], courses: { csp: { week: 8 } } },
  ];
  const saved = new Map([['csp-lesson-completion', JSON.stringify({ '/reference/': true })]]);
  const listeners = {};
  const replacements = {
    document: { createElement: tag => new Element(tag) },
    location: new URL('https://example.test/assignment/?context=course&course=csp'),
    history: { pushState() {}, replaceState() {} },
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) },
    fetch: async () => ({ ok: true, json: async () => ({
      documents, courses: { csp: { title: 'CSP', sprints: [{ id: 'Sprint1', title: 'Start', start: 1, end: 1, weeks: { 1: 'Foundations' } }] } },
    }) }),
    window: { addEventListener: (name, callback) => { listeners[name] = callback; }, dispatchEvent: event => listeners[event.type]?.(event) },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  };
  for (const [name, value] of Object.entries(replacements)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
    t.after(() => descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]);
  }
  await startDocumentReader(root, {
    readState: () => ({ query: '', categories: [] }), writeState: () => '',
    selectedDocuments: () => documents, rememberCourse: () => {},
    createNavigationState: () => ({ restore() {}, destroy() {}, restorePosition() {} }),
  });

  assert.equal(hooks.heading.textContent, 'CSP');
  const groups = hooks.tree.querySelectorAll('[data-week-group]');
  assert.equal(groups.length, 2);
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '1/2');
  assert.equal(groups[0].querySelector('[data-week-count]').attributes['aria-label'], '1 of 2 lessons completed');
  assert.equal(groups[1].querySelector('[data-week-count]').textContent, '0/1');
  const links = hooks.tree.querySelectorAll('[data-lesson-id]');
  assert.ok(links[0].children[0].classList.contains('fa-file-alt'));
  assert.ok(links[1].children[0].classList.contains('fa-file-code'));
  assert.equal(links[0].textContent, documents[0].title);
  assert.equal(links[0].href, '/preview/assignment/?context=course&course=csp');
  assert.equal(links[0].querySelector('[data-lesson-completed]').hidden, true);
  assert.equal(links[1].querySelector('[data-lesson-completed]').hidden, false);
  assert.equal(links[1].attributes['aria-label'], 'Reference (completed)');
  assert.ok(hooks.tree.children[0].children[1].children[0].classList.contains('fa-flag'));

  hooks.complete.listeners.click();
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '2/2');
  assert.equal(links[0].querySelector('[data-lesson-completed]').hidden, false);
  assert.equal(JSON.parse(saved.get('csp-lesson-completion'))['/assignment/'], true);
  hooks.complete.listeners.click();
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '1/2');
  assert.equal(links[0].querySelector('[data-lesson-completed]').hidden, true);

  const originalError = console.error;
  console.error = () => {};
  try {
    saved.set('csp-lesson-completion', '{invalid');
    listeners.storage({ key: 'csp-lesson-completion' });
    assert.equal(groups[0].querySelector('[data-week-count]').textContent, '?/2');
    assert.equal(hooks.complete.disabled, true);
    assert.match(hooks.status.textContent, /Saved completion is unavailable/);
  } finally {
    console.error = originalError;
  }

  hooks.context.value = 'topics';
  hooks.context.listeners.change();
  assert.equal(hooks.heading.textContent, 'Topics');
  assert.equal(hooks.complete.hidden, true);
  assert.equal(hooks.tree.querySelectorAll('[data-week-group]').length, 0);
  assert.ok(hooks.tree.querySelectorAll('[data-lesson-id]').every(link =>
    link.querySelector('[data-lesson-completed]').hidden));
});
