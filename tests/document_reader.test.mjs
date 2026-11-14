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

async function startFakeReader(t, { dataset = {}, restore = () => {}, extraDocuments = [], sprintTitle = 'Start' } = {}) {
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
    append(...children) {
      children.forEach(child => { if (typeof child !== 'string') child.parentRow = this; });
      this.children.push(...children);
    }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    removeAttribute(name) { delete this.attributes[name]; if (name === 'href') delete this.href; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    querySelectorAll(selector) {
      const data = selector.match(/^\[data-([a-z-]+)\]$/);
      const className = selector.match(/^\.([a-z_-]+)$/)?.[1];
      const current = selector === '[aria-current="page"]';
      if (!data && !className && !current) return [];
      const key = data?.[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const matches = child => (data && Object.hasOwn(child.dataset, key)) ||
        (className && child.classList.contains(className)) || (current && child.attributes['aria-current'] === 'page');
      const results = [];
      const walk = element => {
        element.children.filter(child => typeof child !== 'string').forEach(child => {
          if (matches(child)) results.push(child);
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
    'toolbar-previous', 'toolbar-next',
  ].map(name => [name, new Element()]));
  const root = new Element();
  root.dataset = {
    membership: JSON.stringify({ csp: { week: 1 } }), baseurl: '/preview',
    documentUrl: '/assignment/', defaultCourse: 'csp', indexUrl: '/index.json', ...dataset,
  };
  root.querySelector = selector => hooks[selector.match(/^\[data-reader-([a-z-]+)\]$/)?.[1]];
  const glyph = new Element('i');
  glyph.dataset.readerCompleteIcon = '';
  hooks.complete.append(glyph);
  root.querySelectorAll = () => [];
  const documents = [
    { title: 'Assignment with a full descriptive title', url: '/assignment/', assignment: true, categories: [], courses: { csp: { week: 1 } } },
    { title: 'Reference', url: '/reference/', assignment: false, categories: [], courses: { csp: { week: 1 } } },
    { title: 'Next week', url: '/next-week/', assignment: false, categories: [], courses: { csp: { week: 2 } } },
    { title: 'Outside the schedule', url: '/outside/', assignment: false, categories: [], courses: { csp: { week: 8 } } },
    ...extraDocuments,
  ];
  const saved = new Map([['csp-lesson-completion', JSON.stringify({ '/reference/': true })]]);
  const listeners = {};
  const replacements = {
    document: { createElement: tag => new Element(tag) },
    location: new URL(`https://example.test${root.dataset.documentUrl}?context=course&course=csp`),
    history: { pushState() {}, replaceState() {} },
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) },
    fetch: async () => ({ ok: true, json: async () => ({
      documents, courses: { csp: { title: 'CSP', sprints: [{ id: 'Sprint1', title: sprintTitle, start: 1, end: 2, weeks: { 1: 'Foundations', 2: 'Building' } }] } },
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
    selectedDocuments: shown => shown, rememberCourse: () => {},
    // The real helper restores saved sections and opens the current path; the reader must not close any.
    createNavigationState: (_root, _course, _panel, sections) => ({
      restore() { sections.forEach(section => section.setOpen(true)); restore(hooks); }, destroy() {}, restorePosition() {},
    }),
  });
  return { hooks, documents, saved, listeners };

}

test('reader navigation displays lesson types and updates week completion without changing identity', async t => {
  const { hooks, documents, saved, listeners } = await startFakeReader(t);

  assert.equal(hooks.heading.textContent, 'CSP');
  const groups = hooks.tree.querySelectorAll('[data-week-group]');
  assert.equal(groups.length, 3);
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '1/2');
  assert.equal(groups[0].querySelector('[data-week-count]').attributes['aria-label'], '1 of 2 lessons completed');
  const progress = hooks.count.querySelector('[data-reader-progress]');
  assert.equal(hooks.count.textContent, 'Course Progress1/4');
  assert.equal(progress.attributes['aria-label'], '1 of 4 course lessons completed');
  const [weekSummary] = groups[0].children;
  assert.deepEqual(weekSummary.children.slice(0, 2).map(child => [child.tag, child.textContent]), [['span', 'W1'], ['a', 'Foundations']],
    'like the S pill, the W pill (with its arrow) toggles the week; only the title is a link');
  assert.ok(weekSummary.children[0].classList.contains('ocs__btn'), 'the pill is an OCS small pill button');
  assert.ok(weekSummary.children[0].children[0].classList.contains('fa-chevron-right'), 'the arrow is inside the pill');
  const weekTitle = groups[0].querySelector('[data-week-title]');
  assert.equal(weekTitle.href, '/preview/csp/week-1/', 'the week title opens the overview');
  assert.ok(!groups[0].children.some(child => child.textContent === 'Week 1 overview'),
    'the overview is the week title, not a separate button');
  assert.equal(groups[2].querySelector('[data-week-count]').textContent, '0/1');
  const links = hooks.tree.querySelectorAll('[data-lesson-id]');
  assert.ok(links[0].children[0].classList.contains('fa-file-alt'));
  assert.ok(links[1].children[0].classList.contains('fa-file-code'));
  assert.equal(links[0].textContent, documents[0].title);
  assert.equal(links[0].href, '/preview/assignment/?context=course&course=csp');
  assert.equal(links[0].querySelector('[data-lesson-completed]').hidden, true);
  assert.equal(links[1].querySelector('[data-lesson-completed]').hidden, false);
  assert.equal(links[1].attributes['aria-label'], 'Reference (completed)');
  const sprint = hooks.tree.children[0];
  const [sprintSummary] = sprint.children;
  assert.equal(sprintSummary.tag, 'summary');
  assert.deepEqual(sprintSummary.children.map(child => [child.tag, child.textContent]), [['span', 'S1'], ['a', 'Start']],
    'the S pill toggles with the marker; only the title is a link');
  assert.equal(sprint.querySelector('[data-sprint-title]').href, '/preview/csp/sprint-1/');
  assert.ok(!sprint.children.some(child => child.textContent === 'Sprint overview'), 'no separate Sprint overview button');
  assert.equal(hooks['toolbar-previous'].hidden, false);
  assert.equal(hooks['toolbar-previous'].href, '/preview/csp/week-1/', '< steps back to the week overview');
  assert.equal(hooks['toolbar-previous'].attributes['aria-label'], 'Previous document: Foundations');
  assert.equal(hooks['toolbar-next'].hidden, false);
  assert.equal(hooks['toolbar-next'].href, hooks.next.href);
  assert.equal(hooks['toolbar-next'].href, '/preview/reference/?context=course&course=csp');
  assert.equal(hooks['toolbar-next'].attributes['aria-label'], 'Next document: Reference');
  assert.equal(hooks.next.textContent, 'Reference ');
  assert.ok(hooks.next.children[1].classList.contains('fa-chevron-right'));
  assert.equal(hooks.next.attributes['aria-label'], 'Next document: Reference');
  const treeButton = hooks.tree.querySelector('[data-reader-complete]');
  assert.ok(links[0].parentRow.classList.contains('document-reader__active'));
  assert.equal(links[0].parentRow.children[0], treeButton);
  assert.equal(treeButton.attributes['aria-label'], `Reviewed: ${documents[0].title}`);
  assert.equal(hooks.tree.querySelectorAll('[data-reader-complete]').length, 1);
  assert.deepEqual(groups.slice(0, 2).map(group => group.open), [true, true],
    'a saved-open week without the current document stays open');
  assert.equal(hooks.tree.children[0].open, true);
  const reviewButtons = [hooks.complete, treeButton];
  for (const button of reviewButtons) {
    assert.equal(button.hidden, false);
    assert.equal(button.attributes['aria-pressed'], 'false');
    assert.equal(button.children[0].className, 'fa-regular fa-circle');
  }

  treeButton.listeners.click();
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '2/2');
  assert.equal(progress.textContent, '2/4');
  for (const button of reviewButtons) {
    assert.equal(button.attributes['aria-pressed'], 'true');
    assert.equal(button.children[0].className, 'fas fa-check');
  }
  assert.equal(links[0].querySelector('[data-lesson-completed]').hidden, true,
    'the current row shows completion on its circle, not a second check');
  assert.equal(JSON.parse(saved.get('csp-lesson-completion'))['/assignment/'], true);
  hooks.complete.listeners.click();
  assert.equal(groups[0].querySelector('[data-week-count]').textContent, '1/2');
  assert.equal(treeButton.attributes['aria-pressed'], 'false');
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
  assert.equal(hooks.count.textContent, '4 documents');
  assert.equal(hooks.complete.hidden, true);
  assert.equal(hooks.tree.querySelectorAll('[data-reader-complete]').length, 0);
  assert.equal(hooks.tree.querySelectorAll('[data-week-group]').length, 0);
  assert.ok(hooks.tree.querySelectorAll('[data-lesson-id]').every(link =>
    link.querySelector('[data-lesson-completed]').hidden));
});

test('a week overview marks its week, hides review circles and leads into its first lesson', async t => {
  const { hooks } = await startFakeReader(t, { dataset: {
    documentUrl: '/csp/week-2/', membership: JSON.stringify({ csp: { week: 2 } }),
    overview: 'week', overviewSprint: '1', overviewWeek: '2',
  } });
  const groups = hooks.tree.querySelectorAll('[data-week-group]');
  const current = hooks.tree.querySelectorAll('[aria-current="page"]');
  assert.equal(current.length, 1);
  assert.equal(current[0], groups[1].querySelector('[data-week-title]'));
  assert.ok(Object.hasOwn(current[0].dataset, 'readerOverview'), 'course-navigation-state selects the overview');
  assert.equal(hooks.complete.hidden, true, 'an overview is not a document to review');
  assert.equal(hooks.tree.querySelectorAll('[data-reader-complete]').length, 0);
  assert.equal(hooks['toolbar-previous'].href, '/preview/reference/?context=course&course=csp');
  assert.equal(hooks['toolbar-next'].href, '/preview/next-week/?context=course&course=csp');
  assert.equal(hooks.pager.hidden, false);
});

test('a sprint overview marks its sprint title and leads into the sprint', async t => {
  const { hooks } = await startFakeReader(t, { dataset: {
    documentUrl: '/csp/sprint-1/', membership: JSON.stringify({ csp: {} }), overview: 'sprint', overviewSprint: '1',
  } });
  const current = hooks.tree.querySelectorAll('[aria-current="page"]');
  assert.equal(current.length, 1);
  assert.equal(current[0], hooks.tree.querySelector('[data-sprint-title]'));
  assert.ok(current[0].classList.contains('document-reader__overview-current'));
  assert.equal(hooks['toolbar-previous'].hidden, true, 'the first sprint overview starts the course');
  assert.equal(hooks['toolbar-next'].href, '/preview/csp/week-1/', '> steps into the week overview, then its lessons');
});

test('course home continues the document the student last read', async t => {
  const { hooks } = await startFakeReader(t, {
    dataset: { documentUrl: '/navigation/courses/csp/', membership: JSON.stringify({ csp: {} }), overview: 'home' },
    restore: ({ tree }) => {
      const row = tree.querySelectorAll('[data-lesson-id]').find(link => link.dataset.lessonId === '/next-week/');
      row.classList.add('navigation-resume');
    },
  });
  assert.equal(hooks.tree.querySelectorAll('[aria-current="page"]').length, 0);
  assert.equal(hooks.complete.hidden, true);
  assert.equal(hooks['toolbar-previous'].hidden, true);
  assert.equal(hooks['toolbar-next'].href, '/preview/next-week/?context=course&course=csp');
  assert.equal(hooks['toolbar-next'].attributes['aria-label'], 'Continue reading: Next week');
  assert.equal(hooks.next.textContent, 'Next week ');
});

test('course home without reading history has no previous or next', async t => {
  const { hooks } = await startFakeReader(t, {
    dataset: { documentUrl: '/navigation/courses/csp/', membership: JSON.stringify({ csp: {} }), overview: 'home' },
  });
  assert.equal(hooks['toolbar-next'].hidden, true);
  assert.equal(hooks.pager.hidden, true);
});

test('a course-placed page kept out of Topics is still a lesson in its course week', async t => {
  const mcq = { title: 'CSA MCQ Lessons', url: '/csa/mcq', assignment: false, categories: [], topics: false, courses: { csp: { week: 1 } } };
  const { hooks } = await startFakeReader(t, { extraDocuments: [mcq] });
  const week = hooks.tree.querySelectorAll('[data-week-group]')[0];
  assert.ok(week.querySelectorAll('[data-lesson-id]').some(link => link.dataset.lessonId === '/csa/mcq'));
  assert.equal(week.querySelector('[data-week-count]').textContent, '1/3');
  assert.equal(hooks.count.querySelector('[data-reader-progress]').textContent, '1/5');
  hooks.context.value = 'topics';
  hooks.context.listeners.change();
  assert.equal(hooks.count.textContent, '4 documents');
  assert.ok(!hooks.tree.querySelectorAll('[data-lesson-id]').some(link => link.dataset.lessonId === '/csa/mcq'));
});

test('a sprint without a title is named by its number', async t => {
  const { hooks } = await startFakeReader(t, { sprintTitle: '  ' });
  assert.equal(hooks.tree.querySelector('[data-sprint-title]').textContent, 'Sprint 1');
});
