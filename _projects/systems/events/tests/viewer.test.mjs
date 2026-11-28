// The Events viewer: Mort's shared page viewer bar (_includes/page-viewer.html) on an event page
// opened from a card on /events/. Back returns to the category and page that were showing, and
// previous and next follow the order the catalog saved, across its pages. It accepts only event
// pages on this site, and moves the Microblog button into the bar the way Capstone does.
import assert from 'node:assert/strict';
import test from 'node:test';
import { installFakeDom } from '../../messages/tests/fake-dom.mjs';
import * as toolbar from '../../../../assets/js/pages/viewer/toolbar.js';
import { EventViewer } from '../js/event-viewer.js';
import { startViewer } from '../js/viewer.js';
import { browserTexts, mark, markedRegistry, needsRuby, pageWords, readRegistry, wordsSpelledBy } from './helpers.mjs';

const ORIGIN = 'https://example.test';

function setup(url, snapshot, registry = readRegistry()) {
  const { document, window } = installFakeDom();
  window.location = new URL(url, ORIGIN);
  const values = new Map(snapshot ? [['events-viewer', JSON.stringify(snapshot)]] : []);
  window.sessionStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  document.querySelector = (selector) => document.documentElement.querySelector(selector);
  document.getElementById = (id) => document.documentElement.querySelector(`[id="${id}"]`);
  // toolbar.js sets link.href, which the fake DOM keeps as an attribute.
  const Element = document.createElement('a').constructor;
  Object.defineProperty(Element.prototype, 'href', {
    configurable: true,
    get() { return new URL(this.getAttribute('href'), window.location).href; },
    set(value) { this.setAttribute('href', value); },
  });
  const make = (tag, attributes = {}, text = '') => {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    node.textContent = text;
    return node;
  };
  // The bar as page-viewer.html writes it for this system's page_viewer.
  const bar = make('nav', { 'data-page-viewer': '', 'data-viewer-param': 'events_view', 'data-home-url': '/events/', hidden: '' });
  const back = make('a', { 'data-viewer-home': '', href: '/events/' }, '← Events');
  const previous = make('a', { 'data-viewer-previous': '', 'aria-disabled': 'true' });
  const next = make('a', { 'data-viewer-next': '', 'aria-disabled': 'true' });
  const status = make('p', { 'data-viewer-status': '' });
  const slot = make('div', { 'data-viewer-actions': '' });
  bar.append(back, previous, next, status, slot);
  const microblog = make('button', { id: 'microblog-toggle-btn', class: 'ocs__btn accent fill pill microblog-fab microblog-fab-top' }, 'Microblog');
  const texts = make('script', { type: 'application/json', 'data-event-texts': '' }, JSON.stringify(browserTexts(registry, pageWords(registry))));
  document.body.append(bar, microblog, texts);
  return { document, window, bar, back, previous, next, status, slot, microblog, registry, values };
}

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key]);
const snapshotOf = (category, page, slugs, size = 2) => ({
  category, page,
  events: slugs.map((slug, index) => ({ path: `/events/${slug}/`, url: `${ORIGIN}/events/${slug}/`, title: slug.toUpperCase(), page: Math.floor(index / size) + 1 })),
});

test('a viewer context needs events_view=1 on an event page of this site', () => {
  const context = EventViewer.context(new URL(`${ORIGIN}/events/one/?events_view=1&events_category=workshop&events_page=2`));
  assert.deepEqual(context, { home: '/events/', path: '/events/one/', category: 'workshop', page: 2 });
  assert.equal(EventViewer.context(new URL(`${ORIGIN}/events/one/`)), null);
  assert.equal(EventViewer.context(new URL(`${ORIGIN}/capstone/one/?events_view=1`)), null);
  assert.equal(EventViewer.context(new URL(`${ORIGIN}/events/?events_view=1`)), null, 'the catalog itself is not an event');
  assert.deepEqual(EventViewer.context(new URL(`${ORIGIN}/base/events/one/?events_view=1`)).home, '/base/events/', 'a site with a baseurl');
});

test('eventUrl keeps the context on this site\'s event pages and refuses anything else', () => {
  const current = new URL(`${ORIGIN}/events/one/?events_view=1`);
  const context = { home: '/events/', path: '/events/one/', category: 'workshop', page: 2 };
  const url = EventViewer.eventUrl('/events/two/', context, current);
  assert.equal(url.pathname, '/events/two/');
  assert.equal(url.searchParams.get('events_view'), '1');
  assert.equal(url.searchParams.get('events_category'), 'workshop');
  assert.equal(url.searchParams.get('events_page'), '2');
  for (const href of ['//evil.test/events/two/', 'https://other.test/events/two/', '/capstone/two/', '/events/', 'javascript:alert(1)']) {
    assert.equal(EventViewer.eventUrl(href, context, current), null, href);
  }
});

test('previous and next follow the catalog\'s order across its pages, and Back keeps the category and page', needsRuby, () => {
  const view = setup('/events/b/?events_view=1&events_category=workshop&events_page=1', snapshotOf('workshop', 1, ['a', 'b', 'c']));
  startViewer(view.bar, toolbar);
  assert.equal(view.bar.hidden, false);
  assert.equal(view.status.textContent, '');
  const previous = new URL(view.previous.getAttribute('href'));
  assert.equal(previous.pathname, '/events/a/');
  assert.equal(previous.searchParams.get('events_page'), '1');
  const next = new URL(view.next.getAttribute('href'));
  assert.equal(next.pathname, '/events/c/');
  assert.equal(next.searchParams.get('events_page'), '2', 'c is on the next page, so Back from it returns there');
  assert.equal(next.searchParams.get('events_category'), 'workshop');
  assert.equal(view.next.getAttribute('aria-label'), fill(view.registry.texts.viewer.next, { title: 'C' }));
  assert.equal(view.previous.getAttribute('aria-label'), fill(view.registry.texts.viewer.previous, { title: 'A' }));
  assert.equal(view.next.getAttribute('aria-disabled'), null);

  const back = new URL(view.back.getAttribute('href'), ORIGIN);
  assert.equal(back.pathname, '/events/');
  assert.equal(back.search, '?category=workshop');

  const later = setup('/events/c/?events_view=1&events_category=workshop&events_page=2', snapshotOf('workshop', 2, ['a', 'b', 'c']));
  startViewer(later.bar, toolbar);
  assert.equal(new URL(later.back.getAttribute('href'), ORIGIN).search, '?category=workshop&page=2');
  assert.equal(later.next.getAttribute('aria-disabled'), 'true', 'the last event has no next');
});

test('without the catalog\'s snapshot, the bar says previous and next are unavailable', needsRuby, () => {
  const view = setup('/events/b/?events_view=1');
  startViewer(view.bar, toolbar);
  assert.equal(view.status.textContent, view.registry.texts.viewer.unavailable);
  assert.equal(view.previous.getAttribute('aria-disabled'), 'true');
  assert.equal(view.next.getAttribute('aria-disabled'), 'true');
  assert.equal(new URL(view.back.getAttribute('href'), ORIGIN).pathname, '/events/');

  const other = setup('/events/b/?events_view=1&events_category=meeting', snapshotOf('workshop', 1, ['a', 'b']));
  startViewer(other.bar, toolbar);
  assert.equal(other.status.textContent, other.registry.texts.viewer.unavailable, 'a snapshot of another category');
});

test('the Microblog button moves into the bar without its floating classes', needsRuby, () => {
  const view = setup('/events/b/?events_view=1', snapshotOf('', 1, ['a', 'b']));
  startViewer(view.bar, toolbar);
  assert.equal(view.microblog.parentNode, view.slot);
  for (const name of ['microblog-fab', 'microblog-fab-top', 'fill', 'pill']) assert.equal(view.microblog.classList.contains(name), false, name);
  assert.equal(view.microblog.classList.contains('small'), true);
});

test('the bar\'s own words come from the registry (a copy with every word marked)', needsRuby, () => {
  const marked = markedRegistry();
  const view = setup('/events/b/?events_view=1&events_category=workshop&events_page=1', snapshotOf('workshop', 1, ['a', 'b', 'c']), marked);
  startViewer(view.bar, toolbar);
  assert.equal(view.previous.getAttribute('aria-label'), mark('Previous event: A'));
  assert.equal(view.next.getAttribute('aria-label'), mark('Next event: C'));
  const lost = setup('/events/b/?events_view=1', null, marked);
  startViewer(lost.bar, toolbar);
  assert.equal(lost.status.textContent, mark('Previous and next events are unavailable. Return to Events to restore them.'));
  const said = [view.previous, view.next].map((link) => link.getAttribute('aria-label'));
  assert.deepEqual(wordsSpelledBy([...said, lost.status.textContent].join('\n')), []);
});
