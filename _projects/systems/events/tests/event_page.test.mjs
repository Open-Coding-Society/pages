// EventPage runs one event page (layout: event). The static page never claims a live
// state: the browser moves the stage pill from Published to Active to Completed by the clock,
// never touches the Sample pill, shows "Ask a question" only when the Microblog panel is on the
// page, and starts the latest-questions list only when the event turned the Microblog on.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fakeEvent, installFakeDom, settle } from '../../messages/tests/fake-dom.mjs';
import { EventPage } from '../js/event-page.js';
import { browserTexts, markedRegistry, needsRuby, pageWords, readRegistry, wordsSpelledBy } from './helpers.mjs';

const LA = 'America/Los_Angeles';

function el(document, tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  node.append(...children);
  return node;
}

// The parts of _includes/event-body.html that the script reads, for Mort's example.
function page({ microblog = true, toggle = true, zone = LA, sample = false } = {}) {
  const { document } = installFakeDom();
  document.getElementById = (id) => document.documentElement.querySelector(`[id="${id}"]`);
  const pills = el(document, 'div', {}, el(document, 'b', { class: 'ocs__status-pill ocs__status-pill--good', 'data-event-pill': '' }, 'Published'));
  if (sample) pills.append(' ', el(document, 'b', { class: 'ocs__status-pill ocs__status-pill--neutral' }, 'Sample'));
  const root = el(document, 'article', {
    class: 'ocs__container', 'data-event-page': '', 'data-event-day': '2027-03-15', 'data-event-start': '10:00',
    'data-event-end': '13:00', 'data-event-zone': zone, 'data-event-stage': 'published',
  }, pills);
  let discuss = null;
  if (microblog) {
    discuss = el(document, 'div', { 'data-event-discuss': '', hidden: '' }, el(document, 'button', { class: 'ocs__btn accent fill', type: 'button' }, 'Ask a question'));
    root.append(el(document, 'section', { class: 'ocs__card', id: 'event-discussion' },
      el(document, 'div', { class: 'ocs__card-header' }, el(document, 'h2', { class: 'ocs__section-title' }, 'Questions and Discussion'), discuss),
      el(document, 'div', { 'data-event-discussion-list': '', 'data-event-topic': '/events/community-technology-workshop/' })));
  }
  document.body.append(root);
  let opened = 0;
  if (toggle) {
    const button = el(document, 'button', { id: 'microblog-toggle-btn', class: 'ocs__btn accent fill pill microblog-fab' }, 'Microblog');
    button.addEventListener('click', () => { opened += 1; });
    document.body.append(button);
  }
  return { document, root, discuss, opened: () => opened };
}

function start(view, now, { registry = readRegistry(), ...extra } = {}) {
  const reads = [];
  const warnings = [];
  const topic = { latest: async (options) => { reads.push(options); return { posts: [], missing: true }; } };
  new EventPage(view.root, {
    texts: browserTexts(registry, pageWords(registry)), topic, pythonURI: 'http://localhost:8587', fetchOptions: {},
    now: () => now, console: { warn: (...args) => warnings.push(args) }, ...extra,
  }).start();
  return { reads, warnings, registry };
}

const pill = (root) => root.querySelector('[data-event-pill]');

test('the stage pill goes Published, then Active, then Completed by the clock', needsRuby, () => {
  const stages = Object.fromEntries(readRegistry().lifecycle.map((stage) => [stage.key, stage]));
  const cases = [
    ['2027-03-15T16:59:00Z', 'published'],
    ['2027-03-15T17:30:00Z', 'active'],
    ['2027-03-15T20:00:00Z', 'completed'],
  ];
  for (const [now, key] of cases) {
    const view = page();
    start(view, new Date(now));
    assert.equal(pill(view.root).textContent, stages[key].label, now);
    assert.equal(pill(view.root).className, `ocs__status-pill ocs__status-pill--${stages[key].tone}`, now);
    assert.equal(pill(view.root).getAttribute('title'), stages[key].description, `${now}: the stage's description as its title`);
  }
});

test('the Sample pill never changes', needsRuby, () => {
  const view = page({ sample: true });
  start(view, new Date('2027-03-15T20:00:00Z'));
  const sample = view.root.querySelectorAll('b').find((node) => !node.hasAttribute('data-event-pill'));
  assert.equal(sample.textContent, 'Sample');
  assert.equal(sample.className, 'ocs__status-pill ocs__status-pill--neutral');
  assert.equal(sample.getAttribute('title'), null);
});

test('an unknown time zone keeps the built pill and warns once', needsRuby, () => {
  const view = page({ zone: 'Mars/Olympus' });
  const { warnings } = start(view, new Date('2027-03-15T20:00:00Z'));
  assert.equal(pill(view.root).textContent, 'Published');
  assert.equal(warnings.length, 1);
});

test('Ask a question shows only with the Microblog panel, and opens it', needsRuby, () => {
  const without = page({ toggle: false });
  start(without, new Date('2027-03-01T00:00:00Z'));
  assert.equal(without.discuss.hidden, true, 'no panel on the page, so no button');

  const view = page();
  start(view, new Date('2027-03-01T00:00:00Z'));
  assert.equal(view.discuss.hidden, false);
  view.discuss.querySelector('button').dispatchEvent(fakeEvent('click'));
  assert.equal(view.opened(), 1, 'the button clicks the Microblog toggle');
});

test('the latest questions load from the page\'s topic, and not at all when the Microblog is off', needsRuby, async () => {
  const on = page();
  const { reads } = start(on, new Date('2027-03-01T00:00:00Z'));
  await settle();
  assert.equal(reads.length, 1);
  assert.equal(reads[0].path, '/events/community-technology-workshop/');
  assert.equal(reads[0].limit, readRegistry().discussion.shown);

  const off = page({ microblog: false });
  const quiet = start(off, new Date('2027-03-01T00:00:00Z'));
  await settle();
  assert.deepEqual(quiet.reads, [], 'nothing reads the topic');
});

test('the pill\'s words come from the registry (a copy with every word marked)', needsRuby, () => {
  const marked = markedRegistry();
  const stages = Object.fromEntries(marked.lifecycle.map((stage) => [stage.key, stage]));
  for (const [now, key] of [['2027-03-15T16:59:00Z', 'published'], ['2027-03-15T17:30:00Z', 'active'], ['2027-03-15T20:00:00Z', 'completed']]) {
    const view = page({ microblog: false });
    start(view, new Date(now), { registry: marked });
    assert.deepEqual([pill(view.root).textContent, pill(view.root).getAttribute('title')], [stages[key].label, stages[key].description], now);
    assert.deepEqual(wordsSpelledBy(`${pill(view.root).textContent}\n${pill(view.root).getAttribute('title')}`), [], now);
  }
});
