// EventCatalog runs /events/ (img3). Jekyll lists every listed event in date order; in the
// visitor's browser the class updates each card's pill by the clock, moves the events that have
// ended under Past Events (newest first), filters by ?category=, and shows six cards at a time
// with Earlier and Later links that move only when pressed. Cards are moved, never hidden, because
// an ocs__grid-cell's display beats [hidden].
import assert from 'node:assert/strict';
import test from 'node:test';
import { fakeEvent, installFakeDom } from '../../messages/tests/fake-dom.mjs';
import { EventCatalog } from '../js/event-catalog.js';
import { EventPager } from '../js/event-pager.js';
import { browserTexts, needsRuby, readRegistry } from './helpers.mjs';

const LA = 'America/Los_Angeles';
const ORIGIN = 'https://example.test';
const NOW = new Date('2027-03-15T21:00:00Z'); // 2 PM on March 15 in Los Angeles

function el(document, tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  node.append(...children);
  return node;
}

// One card the way _includes/event-card.html writes it.
function card(document, { slug, title = slug, day, start = '', end = '', stage = 'published', categories = [], zone = LA }) {
  return el(document, 'article', {
    class: 'ocs__grid-cell', 'data-event-card': '', 'data-event-url': `/events/${slug}/`, 'data-event-day': day,
    'data-event-start': start, 'data-event-end': end, 'data-event-zone': zone, 'data-event-stage': stage,
    'data-event-categories': JSON.stringify(categories),
  },
  el(document, 'time', { class: 'ocs__badge', datetime: day }, day),
  el(document, 'h3', {}, el(document, 'a', { href: `/events/${slug}/`, 'data-event-link': '' }, title)),
  el(document, 'div', {}, el(document, 'b', { class: 'ocs__status-pill ocs__status-pill--good', 'data-event-pill': '' }, 'Published')));
}

function pager(document, name, texts) {
  return el(document, 'div', { 'data-event-pager': name, hidden: '' },
    el(document, 'nav', { class: 'ocs__pager', 'aria-label': texts.pages_label },
      el(document, 'a', { class: 'ocs__pager-link', 'data-event-earlier': '' }, texts.earlier),
      el(document, 'a', { class: 'ocs__pager-link next', 'data-event-later': '' }, texts.later)));
}

// The catalog the way _includes/events-catalog.html writes it.
function catalog(document, texts, cards, categories = []) {
  const buttons = [['', texts.all], ...categories].map(([key, label]) => el(document, 'button', {
    class: `ocs__btn small accent${key ? '' : ' fill'}`, type: 'button', 'data-event-category': key, 'aria-pressed': String(!key),
  }, label));
  const root = el(document, 'section', { class: 'ocs__stack ocs__band ocs__band--tint', 'data-event-catalog': '', 'data-page-size': '6' },
    el(document, 'div', { class: 'ocs__links', role: 'group' }, ...buttons),
    el(document, 'p', { class: 'ocs__text', role: 'status', 'data-event-status': '' }),
    el(document, 'div', { class: 'ocs__grid ocs__grid--card cols-3', 'data-event-grid': 'upcoming' }, ...cards),
    pager(document, 'upcoming', texts),
    el(document, 'div', { 'data-event-empty': '', hidden: '' }, el(document, 'p', { class: 'ocs__callout' }, texts.empty)),
    el(document, 'div', { 'data-event-past': '', hidden: '' },
      el(document, 'h2', { class: 'ocs__section-title' }, texts.past_title),
      el(document, 'div', { class: 'ocs__grid ocs__grid--card cols-3', 'data-event-grid': 'past' }),
      pager(document, 'past', texts)));
  document.body.append(root);
  return root;
}

// A page at url with a fake clock, history and session storage; pushState moves the location.
function setup(url, { cards: cardSpecs, categories = [], now = NOW, storage, pageSize = 6 } = {}) {
  const { document, window } = installFakeDom();
  const registry = readRegistry();
  const texts = browserTexts(registry);
  const root = catalog(document, texts.catalog, cardSpecs.map((spec) => card(document, spec)), categories);
  const location = new URL(url, ORIGIN);
  const pushes = [];
  const history = { pushState(_state, _title, next) { pushes.push(String(next)); location.href = new URL(next, location.href).href; } };
  const values = new Map();
  const session = storage || { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const warnings = [];
  const clock = { now };
  const instance = new EventCatalog(root, {
    texts, pageSize, now: () => clock.now, location, history, storage: session, window,
    console: { warn: (...args) => warnings.push(args) },
  }).start();
  return { document, window, root, location, pushes, values, warnings, clock, instance, texts };
}

const titlesIn = (root, grid) => root.querySelector(`[data-event-grid="${grid}"]`).querySelectorAll('[data-event-link]').map((link) => link.textContent);
const status = (root) => root.querySelector('[data-event-status]').textContent;
const link = (root, grid, which) => root.querySelector(`[data-event-pager="${grid}"]`).querySelector(`[data-event-${which}]`);
const button = (root, key) => root.querySelectorAll('[data-event-category]').find((node) => node.getAttribute('data-event-category') === key);
const days = (count, from = 1) => Array.from({ length: count }, (_, index) => `2027-04-${String(from + index).padStart(2, '0')}`);
const many = (count, extra = {}) => days(count).map((day, index) => ({ slug: `e${index + 1}`, title: `Event ${index + 1}`, day, start: '10:00', ...extra }));

test('EventPager counts pages, keeps a page in range and writes it into the address', () => {
  assert.equal(EventPager.pages(14, 6), 3);
  assert.equal(EventPager.pages(0, 6), 1, 'nothing still makes one page');
  const items = Array.from({ length: 14 }, (_, index) => index + 1);
  assert.deepEqual(EventPager.slice(items, 2, 6), { page: 2, pages: 3, items: [7, 8, 9, 10, 11, 12] });
  assert.deepEqual(EventPager.slice(items, 9, 6).items, [13, 14], 'a page past the end is the last page');
  assert.equal(EventPager.slice(items, 9, 6).page, 3);
  for (const odd of [0, -2, 2.5, NaN, '2']) assert.equal(EventPager.slice(items, odd, 6).page, 1, String(odd));
  assert.equal(EventPager.read('?page=2&category=workshop', 'page'), 2);
  for (const search of ['', '?page=x', '?page=0', '?page=2.5', '?page=-1']) assert.equal(EventPager.read(search, 'page'), 1, search);
  assert.equal(EventPager.write('?category=workshop', 'page', 2), '?category=workshop&page=2');
  assert.equal(EventPager.write('?category=workshop&page=2', 'page', 1), '?category=workshop', 'page 1 drops the parameter');
  assert.equal(EventPager.write('?page=3', 'page', 1), '');
});

test('past events move under Past Events, newest first, and upcoming ones keep their order', needsRuby, () => {
  const { root } = setup('/events/', {
    cards: [
      { slug: 'last-spring', day: '2026-04-02', start: '18:00' },
      { slug: 'this-morning', day: '2027-03-15', start: '09:00', end: '11:00' },
      { slug: 'this-afternoon', day: '2027-03-15', start: '13:00', end: '16:00' },
      { slug: 'last-fall', day: '2026-10-20' },
      { slug: 'next-week', day: '2027-03-22', start: '10:00' },
    ],
  });
  assert.deepEqual(titlesIn(root, 'upcoming'), ['this-afternoon', 'next-week']);
  assert.deepEqual(titlesIn(root, 'past'), ['this-morning', 'last-fall', 'last-spring']);
  assert.equal(root.querySelector('[data-event-past]').hidden, false);
  assert.equal(root.querySelector('[data-event-empty]').hidden, true);
});

test('each card\'s pill follows the clock with the registry\'s words and tones', needsRuby, () => {
  const { root } = setup('/events/', {
    cards: [
      { slug: 'now', day: '2027-03-15', start: '13:00', end: '16:00' },
      { slug: 'over', day: '2027-03-15', start: '09:00', end: '11:00' },
      { slug: 'soon', day: '2027-03-22', start: '10:00' },
    ],
  });
  const registry = readRegistry();
  const words = Object.fromEntries(registry.lifecycle.map((stage) => [stage.key, stage]));
  const pills = Object.fromEntries(root.querySelectorAll('[data-event-card]').map((node) => [node.getAttribute('data-event-url'), node.querySelector('[data-event-pill]')]));
  assert.equal(pills['/events/now/'].textContent, words.active.label);
  assert.equal(pills['/events/now/'].className, `ocs__status-pill ocs__status-pill--${words.active.tone}`);
  assert.equal(pills['/events/over/'].textContent, words.completed.label);
  assert.equal(pills['/events/over/'].className, `ocs__status-pill ocs__status-pill--${words.completed.tone}`);
  assert.equal(pills['/events/soon/'].textContent, words.published.label);
});

test('a card in an unknown time zone keeps its built pill, stays upcoming and warns once', needsRuby, () => {
  const { root, warnings } = setup('/events/', {
    cards: [
      { slug: 'odd-one', day: '2026-01-01', zone: 'Mars/Olympus' },
      { slug: 'odd-two', day: '2026-01-02', zone: 'Mars/Olympus' },
    ],
  });
  assert.deepEqual(titlesIn(root, 'upcoming'), ['odd-one', 'odd-two']);
  assert.equal(root.querySelector('[data-event-pill]').textContent, 'Published');
  assert.equal(warnings.length, 1);
});

test('?category= presses its button, filters both grids, and the status words come from the registry', needsRuby, () => {
  const categories = [['community', 'Community'], ['workshop', 'Workshop']];
  const { root, texts } = setup('/events/?category=Workshop', {
    categories,
    cards: [
      { slug: 'ai-workshop', day: '2027-03-20', categories: ['workshop', 'technology'] },
      { slug: 'food-drive', day: '2027-03-21', categories: ['community'] },
      { slug: 'old-workshop', day: '2026-01-10', categories: ['workshop'] },
      { slug: 'old-drive', day: '2026-01-11', categories: ['community'] },
    ],
  });
  assert.deepEqual(titlesIn(root, 'upcoming'), ['ai-workshop']);
  assert.deepEqual(titlesIn(root, 'past'), ['old-workshop']);
  assert.equal(button(root, 'workshop').getAttribute('aria-pressed'), 'true');
  assert.equal(button(root, 'workshop').classList.contains('fill'), true);
  assert.equal(button(root, '').getAttribute('aria-pressed'), 'false');
  assert.equal(button(root, '').classList.contains('fill'), false);
  assert.equal(status(root), texts.catalog.showing_one_in.replace('{category}', 'Workshop'));

  button(root, 'community').dispatchEvent(fakeEvent('click'));
  assert.deepEqual(titlesIn(root, 'upcoming'), ['food-drive']);
  button(root, '').dispatchEvent(fakeEvent('click'));
  assert.deepEqual(titlesIn(root, 'upcoming'), ['ai-workshop', 'food-drive']);
  assert.equal(status(root), texts.catalog.showing.replace('{count}', '2'));
});

test('with nothing upcoming the empty state shows, and a category with nothing says so', needsRuby, () => {
  const { root, texts } = setup('/events/?category=community', {
    categories: [['community', 'Community']],
    cards: [{ slug: 'last-fall', day: '2026-10-20', categories: ['community'] }],
  });
  assert.equal(root.querySelector('[data-event-empty]').hidden, false);
  assert.equal(status(root), texts.catalog.none_in.replace('{category}', 'Community'));
});

test('card links carry the viewer parameters; a click saves the filtered order for the viewer', needsRuby, () => {
  const { root, values } = setup('/events/?category=workshop', {
    categories: [['workshop', 'Workshop']],
    cards: [
      { slug: 'one', title: 'One', day: '2027-03-20', categories: ['workshop'] },
      { slug: 'skip', title: 'Skip', day: '2027-03-21', categories: ['community'] },
      { slug: 'two', title: 'Two', day: '2027-03-22', categories: ['workshop'] },
      { slug: 'gone', title: 'Gone', day: '2026-03-22', categories: ['workshop'] },
    ],
  });
  const [one] = root.querySelector('[data-event-grid="upcoming"]').querySelectorAll('[data-event-link]');
  const target = new URL(one.getAttribute('href'), ORIGIN);
  assert.equal(target.pathname, '/events/one/');
  assert.equal(target.searchParams.get('events_view'), '1');
  assert.equal(target.searchParams.get('events_category'), 'workshop');
  assert.equal(target.searchParams.get('events_page'), '1');
  const past = root.querySelector('[data-event-grid="past"]').querySelector('[data-event-link]');
  assert.equal(past.getAttribute('href'), '/events/gone/', 'past events open without the viewer');

  for (const type of ['click', 'auxclick', 'contextmenu']) {
    values.clear();
    one.dispatchEvent(fakeEvent(type));
    assert.deepEqual(JSON.parse(values.get('events-viewer')), {
      category: 'workshop', page: 1,
      events: [
        { path: '/events/one/', url: `${ORIGIN}/events/one/`, title: 'One', page: 1 },
        { path: '/events/two/', url: `${ORIGIN}/events/two/`, title: 'Two', page: 1 },
      ],
    }, type);
  }
});

test('a storage error only warns', needsRuby, () => {
  const broken = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
  const { root, warnings } = setup('/events/', { storage: broken, cards: [{ slug: 'one', day: '2027-03-20' }] });
  root.querySelector('[data-event-link]').dispatchEvent(fakeEvent('click'));
  assert.equal(warnings.length, 1);
});

test('fourteen upcoming events show six at a time, and Earlier and Later step through them', needsRuby, () => {
  const { root, location, pushes, texts } = setup('/events/', { cards: many(14) });
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5', 'Event 6']);
  assert.equal(root.querySelector('[data-event-pager="upcoming"]').hidden, false);
  assert.equal(link(root, 'upcoming', 'earlier').getAttribute('href'), null, 'nowhere earlier to go');
  assert.equal(link(root, 'upcoming', 'earlier').getAttribute('aria-disabled'), 'true');
  assert.equal(link(root, 'upcoming', 'later').getAttribute('href'), '/events/?page=2');
  assert.equal(link(root, 'upcoming', 'later').getAttribute('aria-disabled'), null);
  assert.ok(status(root).endsWith(texts.catalog.page_of.replace('{page}', '1').replace('{pages}', '3')));

  const press = fakeEvent('click');
  link(root, 'upcoming', 'later').dispatchEvent(press);
  assert.equal(press.defaultPrevented, true, 'handled in place');
  assert.deepEqual(pushes, ['/events/?page=2']);
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Event 7', 'Event 8', 'Event 9', 'Event 10', 'Event 11', 'Event 12']);
  assert.equal(status(root), `${texts.catalog.showing.replace('{count}', '14')} ${texts.catalog.page_of.replace('{page}', '2').replace('{pages}', '3')}`);
  assert.equal(link(root, 'upcoming', 'earlier').getAttribute('href'), '/events/');

  link(root, 'upcoming', 'later').dispatchEvent(fakeEvent('click'));
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Event 13', 'Event 14']);
  assert.equal(link(root, 'upcoming', 'later').getAttribute('href'), null);
  assert.equal(link(root, 'upcoming', 'later').getAttribute('aria-disabled'), 'true');
  assert.equal(location.search, '?page=3');
});

test('the browser\'s Back redraws the page it returns to', needsRuby, () => {
  const { root, window, location } = setup('/events/?page=2', { cards: many(14) });
  assert.deepEqual(titlesIn(root, 'upcoming').at(0), 'Event 7');
  location.href = `${ORIGIN}/events/`;
  window.dispatchEvent(fakeEvent('popstate'));
  assert.deepEqual(titlesIn(root, 'upcoming').at(0), 'Event 1');
  assert.equal(link(root, 'upcoming', 'earlier').getAttribute('aria-disabled'), 'true');
});

test('paging keeps ?category=, and choosing a category goes back to page 1', needsRuby, () => {
  const workshops = many(8, { categories: ['workshop'] });
  const meetings = days(3, 20).map((day, index) => ({ slug: `m${index + 1}`, title: `Meeting ${index + 1}`, day, categories: ['meeting'] }));
  const { root, pushes } = setup('/events/?category=workshop', { cards: [...workshops, ...meetings], categories: [['meeting', 'Meeting'], ['workshop', 'Workshop']] });
  link(root, 'upcoming', 'later').dispatchEvent(fakeEvent('click'));
  assert.deepEqual(pushes, ['/events/?category=workshop&page=2']);
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Event 7', 'Event 8']);
  button(root, 'meeting').dispatchEvent(fakeEvent('click'));
  assert.equal(pushes.at(-1), '/events/?category=meeting');
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Meeting 1', 'Meeting 2', 'Meeting 3']);
  assert.equal(root.querySelector('[data-event-pager="upcoming"]').hidden, true, 'one page needs no pager');
});

test('?page=9 shows the last page and ?page=x the first', needsRuby, () => {
  assert.deepEqual(titlesIn(setup('/events/?page=9', { cards: many(14) }).root, 'upcoming'), ['Event 13', 'Event 14']);
  assert.deepEqual(titlesIn(setup('/events/?page=x', { cards: many(14) }).root, 'upcoming').at(0), 'Event 1');
});

test('nothing moves on its own: a later clock with no press changes nothing', needsRuby, () => {
  const { root, clock, pushes } = setup('/events/', { cards: many(14) });
  const before = root.innerHTML;
  clock.now = new Date('2027-04-30T00:00:00Z');
  assert.equal(root.innerHTML, before);
  assert.deepEqual(pushes, []);
});

test('the snapshot keeps the whole filtered order and the page that was showing', needsRuby, () => {
  const { root, values } = setup('/events/?page=2', { cards: many(14) });
  root.querySelector('[data-event-grid="upcoming"]').querySelector('[data-event-link]').dispatchEvent(fakeEvent('click'));
  const snapshot = JSON.parse(values.get('events-viewer'));
  assert.equal(snapshot.page, 2);
  assert.equal(snapshot.events.length, 14, 'previous and next can cross pages');
  assert.deepEqual(snapshot.events.map((event) => event.page), [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3]);
  const opened = new URL(root.querySelector('[data-event-grid="upcoming"]').querySelector('[data-event-link]').getAttribute('href'), ORIGIN);
  assert.equal(opened.searchParams.get('events_page'), '2');
});

test('the Past grid pages with ?past= on its own', needsRuby, () => {
  const ended = days(9, 1).map((day, index) => ({ slug: `p${index + 1}`, title: `Past ${index + 1}`, day: day.replace('2027-04', '2026-04') }));
  const { root, pushes } = setup('/events/', { cards: [...ended, ...many(2)] });
  assert.deepEqual(titlesIn(root, 'past'), ['Past 9', 'Past 8', 'Past 7', 'Past 6', 'Past 5', 'Past 4']);
  assert.equal(root.querySelector('[data-event-pager="upcoming"]').hidden, true);
  assert.equal(link(root, 'past', 'later').getAttribute('href'), '/events/?past=2');
  link(root, 'past', 'later').dispatchEvent(fakeEvent('click'));
  assert.deepEqual(pushes, ['/events/?past=2']);
  assert.deepEqual(titlesIn(root, 'past'), ['Past 3', 'Past 2', 'Past 1']);
  assert.deepEqual(titlesIn(root, 'upcoming'), ['Event 1', 'Event 2'], 'the upcoming grid stays where it was');
});
