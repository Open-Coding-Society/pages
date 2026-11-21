import assert from 'node:assert/strict';
import test from 'node:test';
import { installFakeDom, fakeEvent } from '../../messages/tests/fake-dom.mjs';
import { readViewerContext, viewerUrl, writeFilters } from '../js/viewer-model.js';
import { startViewer } from '../js/viewer.js';
import * as toolbar from '../../../../assets/js/pages/viewer/toolbar.js';

test('viewer URLs preserve project queries and fragments without affecting external links', () => {
  const current = new URL('https://example.test/base/capstone/presence/');
  const context = { project: '/base/capstone/presence', course: 'CSP', year: '', query: 'team one' };
  const target = viewerUrl('phases/?mode=full#details', context, current);
  assert.equal(target.searchParams.get('mode'), 'full');
  assert.equal(target.hash, '#details');
  assert.deepEqual(readViewerContext(target), context);
  assert.equal(viewerUrl('/base/capstone/presence-other/', context, current), null);
  assert.equal(viewerUrl('https://other.test/base/capstone/presence/', context, current), null);
  assert.equal(readViewerContext(new URL('https://example.test/?capstone_view=1&capstone_project=%2F%2Fevil.test')), null);
  const grid = writeFilters(new URL('https://example.test/base/capstone/?existing=yes'), context);
  assert.equal(grid.searchParams.get('year'), '');
  assert.equal(grid.searchParams.get('q'), 'team one');
  assert.equal(grid.searchParams.get('existing'), 'yes');
});

function setup(url, storage) {
  const { document, window } = installFakeDom();
  window.location = new URL(url);
  window.sessionStorage = storage;
  window.scrollY = 480;
  window.scrollTo = (x, y) => { window.restoredScroll = [x, y]; };
  window.requestAnimationFrame = (callback) => callback();
  window.history = {
    state: null,
    replaceState(_state, _title, url) { window.location = new URL(url, window.location); },
  };
  document.querySelector = (selector) => document.documentElement.querySelector(selector);
  document.getElementById = (id) => document.documentElement.querySelector(`[id="${id}"]`);
  document.createTreeWalker = () => ({ nextNode: () => false });
  globalThis.NodeFilter = { SHOW_TEXT: 4 };
  const Element = document.createElement('a').constructor;
  Object.defineProperty(Element.prototype, 'href', {
    configurable: true,
    get() { return new URL(this.getAttribute('href'), window.location).href; },
    set(value) { this.setAttribute('href', value); },
  });
  return { document, window };
}

function element(document, tag, attributes = {}, text = '') {
  const node = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  node.textContent = text;
  return node;
}

function grid(document) {
  const root = element(document, 'section', { 'data-capstone-browser': '' });
  const all = element(document, 'button', { 'data-course': 'all' });
  const csp = element(document, 'button', { 'data-course': 'CSP' });
  const csse = element(document, 'button', { 'data-course': 'CSSE' });
  const year = element(document, 'select', { 'data-capstone-year': '' });
  year.value = '2026-2027';
  const search = element(document, 'input', { 'data-capstone-search': '' });
  const status = element(document, 'p', { 'data-capstone-status': '' });
  root.append(all, csp, csse, year, search, status);
  const cards = [
    ['CSP', '2026-2027', '/capstone/presence/', 'Presence robot'],
    ['CSP', '2026-2027', '/capstone/second/', 'Second robot'],
    ['CSSE', '', '/games/one/', 'Game robot'],
    ['CSP', '2025-2026', '/capstone/old/', 'Old project'],
    ['CSSE', '', '/games/two/', 'Another game'],
  ].map(([course, schoolYear, path, title]) => {
    const card = element(document, 'article', {
      'data-capstone-card': '', 'data-course': course, 'data-year': schoolYear, 'data-page-url': path,
    });
    const heading = element(document, 'h3');
    const link = element(document, 'a', { href: path }, title);
    heading.append(link);
    card.append(heading);
    root.append(card);
    return { card, link };
  });
  document.body.append(root);
  return { root, year, search, csp, csse, cards };
}

function viewer(document, withMicroblog = true) {
  const bar = element(document, 'nav', { 'data-page-viewer': '', 'data-home-url': '/capstone/', hidden: '' });
  const back = element(document, 'a', { 'data-viewer-home': '', href: '/capstone/' });
  const previous = element(document, 'a', { 'data-viewer-previous': '', 'aria-disabled': 'true' });
  const next = element(document, 'a', { 'data-viewer-next': '', 'aria-disabled': 'true' });
  const status = element(document, 'p', { 'data-viewer-status': '' });
  const slot = element(document, 'div', { 'data-viewer-actions': '' });
  bar.append(back, previous, next, status, slot);
  const content = element(document, 'main', { class: 'page-content' });
  const child = element(document, 'a', { href: '/capstone/presence/phases/?view=full#section' }, 'Phase');
  const external = element(document, 'a', { href: 'https://other.test/' }, 'External');
  const localAnchor = element(document, 'a', { href: '#section' }, 'Here');
  content.append(child, external, localAnchor);
  document.body.append(bar, content);
  let microblog;
  if (withMicroblog) {
    microblog = element(document, 'button', { id: 'microblog-toggle-btn', class: 'ocs__btn microblog-fab fill pill' });
    document.body.append(microblog);
  }
  return { bar, back, previous, next, status, slot, content, child, external, localAnchor, microblog };
}

test('grid and viewer retain filtered order, project hierarchy, and session scroll', async () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  let env = setup('https://example.test/capstone/?course=CSP&year=2026-2027&q=robot', storage);
  const directory = grid(env.document);
  await import('../js/browser.js?viewer-test');
  assert.deepEqual(directory.cards.map(({ card }) => card.hidden), [false, false, true, true, true]);
  directory.root.dispatchEvent(fakeEvent('click', { target: directory.cards[0].link }));
  const projectUrl = directory.cards[0].link.href;
  assert.equal(new URL(projectUrl).searchParams.get('capstone_q'), 'robot');

  env = setup(projectUrl, storage);
  const page = viewer(env.document);
  startViewer(page.bar, toolbar);
  assert.equal(page.bar.hidden, false);
  assert.equal(page.previous.getAttribute('aria-disabled'), 'true');
  assert.equal(new URL(page.next.href).pathname, '/capstone/second/');
  assert.equal(new URL(page.next.href).searchParams.get('capstone_q'), 'robot');
  assert.equal(new URL(page.back.href).searchParams.get('q'), 'robot');
  assert.equal(new URL(page.child.href).searchParams.get('view'), 'full');
  assert.equal(new URL(page.child.href).hash, '#section');
  assert.equal(new URL(page.child.href).searchParams.get('capstone_project'), '/capstone/presence');
  assert.equal(page.external.getAttribute('href'), 'https://other.test/');
  assert.equal(page.localAnchor.getAttribute('href'), '#section');
  assert.equal(page.microblog.parentNode, page.slot);
  assert.equal(page.microblog.hasAttribute('data-viewer-action'), true);

  env = setup(page.child.href, storage);
  const phase = viewer(env.document, false);
  startViewer(phase.bar, toolbar);
  assert.equal(new URL(phase.next.href).pathname, '/capstone/second/');
  assert.equal(new URL(phase.back.href).searchParams.get('q'), 'robot');

  env = setup(page.next.href, storage);
  const second = viewer(env.document, false);
  startViewer(second.bar, toolbar);
  assert.equal(new URL(second.previous.href).pathname, '/capstone/presence/');
  assert.equal(second.next.getAttribute('aria-disabled'), 'true');

  env = setup(page.back.href, storage);
  const returned = grid(env.document);
  await import('../js/browser.js?return-test');
  env.window.dispatchEvent(fakeEvent('pageshow'));
  assert.deepEqual(env.window.restoredScroll, [0, 480]);
  assert.equal(returned.search.value, 'robot');
  assert.equal(env.window.location.searchParams.has('capstone_return'), false);

  env = setup(projectUrl, { getItem: () => null });
  const shared = viewer(env.document, false);
  startViewer(shared.bar, toolbar);
  assert.match(shared.status.textContent, /unavailable/);
  assert.equal(new URL(shared.back.href).searchParams.get('q'), 'robot');
  assert.equal(shared.slot.children.length, 0);
});

test('CSSE includes game cards in filtered previous and next navigation', async () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  let env = setup('https://example.test/capstone/?course=CSSE', storage);
  const directory = grid(env.document);
  await import('../js/browser.js?games-test');
  assert.equal(directory.year.value, '');
  assert.deepEqual(directory.cards.map(({ card }) => card.hidden), [true, true, false, true, false]);
  directory.root.dispatchEvent(fakeEvent('click', { target: directory.cards[2].link }));
  const gameUrl = directory.cards[2].link.href;
  env = setup(gameUrl, storage);
  const page = viewer(env.document, false);
  startViewer(page.bar, toolbar);
  assert.equal(page.status.textContent, '');
  assert.equal(page.previous.getAttribute('aria-disabled'), 'true');
  assert.equal(new URL(page.next.href).pathname, '/games/two/');
  assert.equal(new URL(page.back.href).searchParams.get('year'), '');
});

test('invalid project context leaves unrelated links and actions untouched', () => {
  const env = setup('https://example.test/other/?capstone_view=1&capstone_project=%2Fcapstone%2Fpresence', {
    getItem: () => null,
  });
  const page = viewer(env.document);
  startViewer(page.bar, toolbar);
  assert.match(page.status.textContent, /unavailable/);
  assert.equal(page.child.getAttribute('href'), '/capstone/presence/phases/?view=full#section');
  assert.notEqual(page.microblog.parentNode, page.slot);
});

test('a fixed reader stays below the viewer as its height changes', (t) => {
  const { window } = setup('https://example.test/', {});
  window.getComputedStyle = () => ({ top: '80px' });
  let resize;
  const oldObserver = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    constructor(callback) { resize = callback; }
    observe() {}
    disconnect() { resize = null; }
  };
  t.after(() => {
    if (oldObserver) globalThis.ResizeObserver = oldObserver;
    else delete globalThis.ResizeObserver;
  });
  let bottom = 115;
  const properties = new Map();
  const target = { style: {
    setProperty: (key, value) => properties.set(key, value),
    removeProperty: (key) => properties.delete(key),
  } };
  const cleanup = toolbar.fitViewerAbove({ getBoundingClientRect: () => ({ bottom }) }, target);
  assert.equal(properties.get('--page-viewer-top'), '115px');
  bottom = 50;
  resize();
  assert.equal(properties.get('--page-viewer-top'), '80px');
  bottom = 145;
  window.dispatchEvent(fakeEvent('resize'));
  assert.equal(properties.get('--page-viewer-top'), '145px');
  cleanup();
  assert.equal(properties.has('--page-viewer-top'), false);
  assert.equal(resize, null);
});
