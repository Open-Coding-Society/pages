// The editor's small pure helpers: URLs, ids, sizing, field tips, API copies, dialogs and lists.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editorPath, isFramed, parseEditorUrl, randomIds, viewerPath } from '../js/editor-app.js';
import { fitScale } from '../js/editor-shell.js';
import { githubRawUrl, isDriveShareLink, parseWholeNumber, relativeIssues } from '../js/editor-fields.js';
import { listPathsOf, slotsForView, snapshotOf } from '../js/editor-inspector.js';
import { confirmsTitle, formatWhen, untilOf } from '../js/editor-dialogs.js';
import { filterClassPages, refOf } from '../js/editor-start.js';
import { nodeLabel } from '../js/editor-edit.js';
import { createPage } from '../js/page-model.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

test('editor addresses: ?page= for Spring, ?local= for this browser, ?new= for a template', () => {
  assert.deepEqual(parseEditorUrl('?page=42'), { mode: 'edit', ref: { kind: 'spring', id: '42' } });
  assert.deepEqual(parseEditorUrl('?local=k3x9ab1234cd'), { mode: 'edit', ref: { kind: 'local', id: 'k3x9ab1234cd' } });
  assert.deepEqual(parseEditorUrl('?new=flask_api_starter'), { mode: 'new', template: 'flask_api_starter' });
  assert.deepEqual(parseEditorUrl(''), { mode: 'start' });
  for (const bad of ['?page=1e3', '?page=-1', '?page=0', '?page=12345678901234567', '?local=a/b', '?local=ABCDEFGH', '?local=abc', '?new=../x', '?new=Blank']) {
    assert.equal(parseEditorUrl(bad).mode, 'start', bad);
  }
  assert.equal(editorPath('/base/', { kind: 'spring', id: '42' }), '/base/ui-builder/?page=42');
  assert.equal(editorPath('', { kind: 'local', id: 'a b' }), '/ui-builder/?local=a%20b', 'encoded, even though stores never make such ids');
  assert.equal(editorPath('', null), '/ui-builder/');
  assert.equal(viewerPath('', { slug: 'flood-watch' }), '/ui-builder/view/?page=flood-watch');
  assert.equal(viewerPath('/b', { draft: '7' }), '/b/ui-builder/view/?draft=7');
  assert.equal(viewerPath('', { local: 'x' }), '/ui-builder/view/?local=x');
});

test('random ids match the page id rule and differ', () => {
  const ids = randomIds();
  const seen = new Set();
  for (let n = 0; n < 200; n += 1) {
    const id = ids(n % 2 ? 's' : 'b');
    assert.match(id, /^[sb]-[a-z0-9]{8}$/);
    seen.add(id);
  }
  assert.equal(seen.size, 200);
});

test('the editor knows when it is framed, a cross-origin top included', () => {
  const self = {};
  self.top = self;
  self.self = self;
  assert.equal(isFramed(self), false);
  assert.equal(isFramed({ top: {}, self: {} }), true);
  assert.equal(isFramed({ get top() { throw new Error('SecurityError'); } }), true);
});

test('the canvas fits the device width into the pane and shows the zoom', () => {
  assert.deepEqual(fitScale(640, 1280), { width: 1280, scale: 0.5 });
  assert.deepEqual(fitScale(900, 375), { width: 375, scale: 1 }, 'never scaled up');
  assert.deepEqual(fitScale(812.6, 0), { width: 812, scale: 1 }, 'full width is the pane itself');
  assert.deepEqual(fitScale(0, 768), { width: 768, scale: 1 / 768 }, 'a collapsed pane never divides by zero');
});

test('image tips: GitHub file pages become raw links; Drive share links are recognised', () => {
  assert.equal(githubRawUrl('https://github.com/Open-Coding-Society/pages/blob/main/images/logo.png'), 'https://raw.githubusercontent.com/Open-Coding-Society/pages/main/images/logo.png');
  assert.equal(githubRawUrl('https://github.com/o/r/tree/main/images'), null);
  assert.equal(githubRawUrl('http://github.com/o/r/blob/main/a.png'), null);
  assert.equal(githubRawUrl('not a url'), null);
  assert.equal(isDriveShareLink('https://drive.google.com/file/d/abc/view?usp=sharing'), true);
  assert.equal(isDriveShareLink('https://example.com/a.png'), false);
});

test('issues are handed to each widget with paths relative to its field', () => {
  const issues = [{ field: 'links', key: 'required' }, { field: 'links.1.url', key: 'bad_url' }, { field: 'linksx', key: 'x' }, { field: null, key: 'y' }];
  assert.deepEqual(relativeIssues(issues, 'links').map((issue) => issue.field), ['', '1.url']);
  assert.equal(parseWholeNumber(' 12 '), 12);
  assert.equal(parseWholeNumber('1.5'), null);
  assert.equal(parseWholeNumber(''), null);
});

test('API helpers: every list in a reply, the slots of each view, and a copy that fits', () => {
  assert.deepEqual(listPathsOf([1, 2]), [{ path: '', count: 2 }]);
  assert.deepEqual(listPathsOf({ data: { items: [1], tags: [] }, total: 3, __proto__: { evil: [] } }), [{ path: 'data.items', count: 1 }, { path: 'data.tags', count: 0 }]);
  assert.deepEqual(listPathsOf('nope'), []);
  assert.deepEqual(slotsForView('stats'), ['value', 'label']);
  assert.deepEqual(slotsForView('table'), ['title', 'text', 'value', 'label']);
  assert.deepEqual(slotsForView('unknown'), ['title', 'text', 'image', 'link']);
  const items = Array.from({ length: 10 }, (_, n) => ({ title: `item ${n}`.padEnd(100, '.') }));
  const fits = snapshotOf(items, { maxItems: 50, maxChars: 100000, now: 7 });
  assert.equal(fits.snapshot.items.length, 10);
  assert.equal(fits.trimmed, false);
  assert.deepEqual([fits.snapshot.fetched_at, fits.snapshot.from_loopback], [7, false]);
  const tight = snapshotOf(items, { maxItems: 50, maxChars: 500, now: 7, fromLoopback: true });
  assert.ok(JSON.stringify(tight.snapshot).length <= 500);
  assert.equal(tight.trimmed, true);
  assert.equal(tight.snapshot.from_loopback, true);
  assert.equal(snapshotOf(items, { maxItems: 3, maxChars: 100000, now: 1 }).trimmed, false, 'the item cap is not a trim');
});

test('dialog helpers: times, type-the-title and "public until"', () => {
  const now = new Date(2026, 9, 28, 15, 0).getTime();
  assert.equal(formatWhen(0), '');
  assert.match(formatWhen(new Date(2026, 9, 28, 14, 41).getTime(), { now, locale: 'en-US' }), /^2:41\s?PM$/);
  assert.match(formatWhen(new Date(2026, 8, 3, 9, 5).getTime(), { now, locale: 'en-US' }), /^Sep 3, 9:05\s?AM$/);
  assert.match(formatWhen(new Date(2025, 8, 3, 9, 5).getTime(), { now, locale: 'en-US' }), /2025/);
  assert.equal(confirmsTitle('  Flood   Watch ', 'Flood Watch'), true);
  assert.equal(confirmsTitle('flood watch', 'Flood Watch'), false, 'case matters');
  assert.equal(confirmsTitle('', ''), false, 'an empty title never confirms');
  assert.equal(untilOf(''), null);
  assert.ok(Number.isNaN(untilOf('2026-10-27', now)), 'a past day is refused');
  assert.ok(Number.isNaN(untilOf('next week', now)));
  assert.equal(untilOf('2026-11-14', now), new Date(2026, 10, 14, 23, 59, 59, 999).getTime());
});

test('class pages filter by status, unpublished changes and public requests', () => {
  const pages = [
    { id: 1, status: 'PUBLISHED', hasUnpublishedChanges: true, publicRequested: false },
    { id: 2, status: 'PUBLISHED', hasUnpublishedChanges: false, publicRequested: true },
    { id: 3, status: 'DRAFT' },
  ];
  assert.deepEqual(filterClassPages(pages).map((page) => page.id), [1, 2, 3]);
  assert.deepEqual(filterClassPages(pages, { status: 'PUBLISHED' }).map((page) => page.id), [1, 2]);
  assert.deepEqual(filterClassPages(pages, { changes: true }).map((page) => page.id), [1]);
  assert.deepEqual(filterClassPages(pages, { requested: true }).map((page) => page.id), [2]);
  assert.deepEqual(refOf({ ref: { kind: 'local', id: 'x' } }, true), { kind: 'local', id: 'x' });
  assert.deepEqual(refOf({ id: 4 }, true), { kind: 'spring', id: 4 });
  assert.equal(refOf({}, true), null);
});

test('node labels come from the registry', needsRuby, () => {
  const registry = loadRegistry();
  const page = createPage(registry, { template: 'about_me', ids: counterIds() });
  assert.equal(nodeLabel(registry, page, page.sections[0].id), 'One column');
  assert.equal(nodeLabel(registry, page, page.sections[0].cells[0].blocks[0].id), 'Page header');
  assert.equal(nodeLabel(registry, page, 'b-missing'), '');
});
