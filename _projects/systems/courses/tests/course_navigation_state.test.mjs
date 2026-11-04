import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationState } from '../js/player/course-navigation-state.js';

function fixture(saved, currentSection = 'week-2') {
  const storage = new Map(saved ? [['ocs-course-navigation:csa:desktop', JSON.stringify(saved)]] : []);
  const listeners = new Map();
  const selected = { dataset: {} };
  const root = {
    clientHeight: 400,
    scrollTop: 0,
    querySelector: () => currentSection ? selected : null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, bottom: 400 }),
    addEventListener: (name, handler) => listeners.set(name, handler),
  };
  selected.getBoundingClientRect = () => ({ top: 250 - root.scrollTop, bottom: 280 - root.scrollTop });
  const sections = ['sprint-1', 'sprint-2', 'week-2'].map(id => ({
    id,
    element: { contains: () => currentSection && (id === currentSection || id === 'sprint-2') },
    open: false,
    isOpen() { return this.open; },
    setOpen(value) { this.open = value; },
  }));
  const environment = {
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    addEventListener: (name, handler) => listeners.set(name, handler),
  };
  return { root, sections, environment, storage, listeners };
}

test('restores other expanded sections and opens the selected sprint and week', () => {
  const setup = fixture({ sections: { 'sprint-1': true, 'sprint-2': false, 'week-2': false }, scrollTop: 100 });
  const navigation = createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment);
  navigation.restore();
  assert.deepEqual(setup.sections.map(section => section.open), [true, true, true]);
  assert.equal(setup.root.scrollTop, 100);
  setup.listeners.get('pagehide')();
  const saved = JSON.parse(setup.storage.get('ocs-course-navigation:csa:desktop'));
  assert.equal(saved.sections['week-2'], true);
  assert.equal(saved.scrollTop, 100);
});

test('Blogs keeps the last document visible without changing the page or completion', () => {
  const setup = fixture({
    sections: { 'sprint-1': true, 'sprint-2': false, 'week-2': false },
    scrollTop: 100, lastDocument: 'https://example.test/csa/document/',
  }, null);
  const classes = new Set();
  const documentRow = {
    dataset: { lessonId: '/csa/document/' },
    href: 'https://example.test/csa/document/',
    textContent: 'Arrays',
    classList: { add: value => classes.add(value) },
    getBoundingClientRect: () => ({ top: 250 - setup.root.scrollTop, bottom: 280 - setup.root.scrollTop }),
  };
  setup.root.querySelectorAll = () => [documentRow];
  setup.sections[1].element.contains = row => row === documentRow;
  setup.sections[2].element.contains = row => row === documentRow;
  createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment).restore();
  assert.deepEqual(setup.sections.map(section => section.open), [true, true, true]);
  assert.equal(classes.has('navigation-resume'), true);
  assert.equal(documentRow.title, 'Continue reading: Arrays');
  assert.equal(setup.root.scrollTop, 100);
  assert.equal(JSON.parse(setup.storage.get('ocs-course-navigation:csa:desktop')).lastDocument, documentRow.href);
});

test('opening a document updates the resume target, even before leaving its page', () => {
  const setup = fixture();
  const current = setup.root.querySelector();
  current.dataset.lessonId = '/csa/new-document/';
  current.href = 'https://example.test/csa/new-document/';
  createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment).restore();
  assert.equal(JSON.parse(setup.storage.get('ocs-course-navigation:csa:desktop')).lastDocument, current.href);
});

test('reveals a selected row outside the restored viewport without resetting to the top', () => {
  const setup = fixture({ sections: {}, scrollTop: 500 });
  createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment).restore();
  assert.equal(setup.root.scrollTop, 250);
});

test('hidden panels retain scroll until reopened; panels and courses have independent state', () => {
  const setup = fixture({ sections: { 'sprint-1': true }, scrollTop: 100 }, null);
  setup.root.clientHeight = 0;
  const navigation = createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment);
  navigation.restore();
  navigation.save();
  assert.equal(JSON.parse(setup.storage.get('ocs-course-navigation:csa:desktop')).scrollTop, 100);
  setup.root.clientHeight = 400;
  navigation.restorePosition();
  assert.equal(setup.root.scrollTop, 100);
  createNavigationState(setup.root, 'csp', 'desktop', [], setup.environment).save();
  createNavigationState(setup.root, 'csa', 'mobile', [], setup.environment).save();
  assert.equal(setup.storage.size, 3);
});

test('navigation toggles and scrolling persist the latest state', () => {
  const setup = fixture(null, null);
  createNavigationState(setup.root, 'csa', 'desktop', setup.sections, setup.environment).restore();
  setup.sections[0].open = true;
  setup.listeners.get('navigation-toggle')();
  setup.root.scrollTop = 150;
  setup.listeners.get('scroll')();
  const saved = JSON.parse(setup.storage.get('ocs-course-navigation:csa:desktop'));
  assert.equal(saved.sections['sprint-1'], true);
  assert.equal(saved.scrollTop, 150);
});
