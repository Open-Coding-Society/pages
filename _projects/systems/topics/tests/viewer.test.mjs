import assert from 'node:assert/strict';
import test from 'node:test';
import { installFakeDom } from '../../messages/tests/fake-dom.mjs';
import { orderedDocuments, readSnapshot, neighbors, viewerDocumentUrl } from '../js/viewer-model.js';
import { startViewer } from '../js/viewer.js';
import * as toolbar from '../../../../assets/js/pages/viewer/toolbar.js';

const documents = [
  { url: '/lesson/', title: 'Lesson' },
  { url: '/practice/', title: 'Practice' },
  { url: '/text/', title: 'Text match' },
];
const search = '?category=java&category=algorithms&match=and&q=loops&view=cards';

test('snapshot follows displayed links, including practice and text results, without duplicates', () => {
  const link = (url, hidden = false) => ({
    dataset: { topicsDocument: url },
    closest: () => hidden ? {} : null,
  });
  assert.deepEqual(orderedDocuments([
    link('/text/', true), link('/lesson/'), link('/practice/'),
    link('/lesson/'), link('/text/'), link('/unknown/'),
  ], documents), documents);
});

test('viewer preserves filter state and exact result order under a baseurl', () => {
  const snapshot = { state: search.slice(1), documents, scrollY: 400 };
  const storage = () => ({ getItem: () => JSON.stringify(snapshot) });
  assert.deepEqual(readSnapshot(`${search}&context=topics&topics_view=1`, storage), snapshot);
  assert.equal(readSnapshot('?q=different', storage), null);
  assert.deepEqual(neighbors(snapshot, '/base/practice/', '/base', 'https://example.test'),
    [documents[0], documents[2]]);
  assert.deepEqual(neighbors(snapshot, '/base/lesson', '/base', 'https://example.test'),
    [undefined, documents[1]]);
  assert.deepEqual(neighbors(snapshot, '/base/text/', '/base', 'https://example.test'),
    [documents[1], undefined]);
  assert.deepEqual(neighbors(snapshot, '/base/unknown/', '/base', 'https://example.test'), []);
  const url = viewerDocumentUrl(documents[2], '/base', search, 'https://example.test');
  assert.equal(url.pathname, '/base/text/');
  assert.equal(url.searchParams.get('topics_view'), '1');
  assert.equal(url.searchParams.get('match'), 'and');
  assert.equal(url.searchParams.get('q'), 'loops');
  assert.deepEqual(url.searchParams.getAll('category'), ['java', 'algorithms']);
});

test('unavailable session storage leaves navigation unavailable', () => {
  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args);
  try {
    assert.equal(readSnapshot(search, () => { throw new Error('Storage disabled'); }), null);
    assert.match(warnings[0][0], /Could not read Topics navigation state/);
  } finally {
    console.warn = originalWarn;
  }
});

test('viewer uses saved neighbors, returns to filters, and moves the existing Microblog control', () => {
  const { document, window } = installFakeDom();
  window.location = new URL(`https://example.test/base/practice/${search}&topics_view=1`);
  window.sessionStorage = { getItem: () => JSON.stringify({ state: search.slice(1), documents }) };
  document.querySelector = (selector) => document.documentElement.querySelector(selector);
  document.getElementById = (id) => document.documentElement.querySelector(`[id="${id}"]`);
  const make = (tag, attributes) => {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const bar = make('nav', { 'data-home-url': '/base/topics/', hidden: '' });
  const home = make('a', { 'data-viewer-home': '' });
  const previous = make('a', { 'data-viewer-previous': '', 'aria-disabled': 'true' });
  const next = make('a', { 'data-viewer-next': '', 'aria-disabled': 'true' });
  const status = make('p', { 'data-viewer-status': '' });
  const slot = make('div', { 'data-viewer-actions': '' });
  const microblog = make('button', { id: 'microblog-toggle-btn', class: 'microblog-fab' });
  bar.append(home, previous, next, status, slot);
  document.body.append(bar, microblog);
  startViewer(bar, toolbar);
  assert.equal(new URL(previous.href).pathname, '/base/lesson/');
  assert.equal(new URL(next.href).pathname, '/base/text/');
  assert.equal(new URL(home.href).searchParams.get('topics_return'), '1');
  assert.equal(new URL(home.href).searchParams.get('q'), 'loops');
  assert.equal(microblog.parentNode, slot);
  assert.equal(status.textContent, '');

  window.sessionStorage = { getItem: () => null };
  startViewer(bar, toolbar);
  assert.match(status.textContent, /unavailable/);
});
