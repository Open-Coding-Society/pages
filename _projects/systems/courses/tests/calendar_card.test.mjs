import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

// calendar-card.js imports the site's config.js, a Jekyll page Node can't
// load, and the week view, which draws a table Node has no DOM for. Both are
// stand-ins here, so what the card does itself runs: making cards, asking
// Spring who is signed in, mounting and unmounting.
const moduleUrl = (source) => `data:text/javascript,${encodeURIComponent(source)}`;
const CONFIG = moduleUrl(`
  export const javaURI = 'https://spring.test';
  export const fetchOptions = { method: 'GET', credentials: 'include' };
  export let springEnabled = true;
  export function setSpringEnabled(on) { springEnabled = on; }
`);
const FEED = moduleUrl(`
  export const views = [];
  export function mountWeekView(options) {
    const view = { options, refreshes: 0, unmounted: false };
    view.refresh = async () => { view.refreshes += 1; };
    view.unmount = () => { view.unmounted = true; };
    views.push(view);
    return view;
  }
  export function renderEventCards(events) {
    const list = document.createElement('div');
    list.textContent = events.map((event) => event.title).join(', ');
    return list;
  }
`);
registerHooks({
  resolve(specifier, context, nextResolve) {
    const from = context.parentURL ? new URL(context.parentURL).pathname : '';
    if (from.endsWith('/announcement-calendar/calendar-card.js')) {
      if (specifier === '../../api/config.js') return { url: CONFIG, shortCircuit: true };
      if (specifier === './calendar-feed.js') return { url: FEED, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const config = await import(CONFIG);
const feed = await import(FEED);

// Each test loads its own copy of the script, as each page does: the
// signed-in check is asked once per page and kept.
const CARD = new URL('../js/announcement-calendar/calendar-card.js', import.meta.url).href;
const loadCard = (page) => import(`${CARD}?${page}`);

// Two school weeks, as ocs_calendar_card_data.html writes them.
const SCHOOL = { schoolYear: '2026-2027', weeks: { 9: { monday: '2026-10-12', friday: '2026-10-16' }, 10: { monday: '2026-10-19', friday: '2026-10-23' } } };

/* ── A page, just enough of one ──────────────────────────────────────── */

// Elements with attributes, children and listeners, found by the simple
// selectors the script uses (a tag, .class, [name], [name="value"] and
// :not(...)). Any other selector throws, so a script change that needs more
// shows up here.
const dataAttribute = (key) => `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;

function matcher(selector) {
  const tests = [];
  for (let rest = selector.trim(), match; rest; rest = rest.slice(match[0].length)) {
    if ((match = /^[a-z][a-z0-9]*/i.exec(rest))) {
      const tag = match[0].toUpperCase();
      tests.push((node) => node.tagName === tag);
    } else if ((match = /^\.([\w-]+)/.exec(rest))) {
      const name = match[1];
      tests.push((node) => node.className.split(/\s+/).includes(name));
    } else if ((match = /^\[([\w-]+)(?:="([^"]*)")?\]/.exec(rest))) {
      const [, name, value] = match;
      tests.push((node) => node.hasAttribute(name) && (value === undefined || node.getAttribute(name) === value));
    } else if ((match = /^:not\(([^()]+)\)/.exec(rest))) {
      const inner = matcher(match[1]);
      tests.push((node) => !inner(node));
    } else {
      throw new Error(`The test page has no selector like ${selector}`);
    }
  }
  return (node) => tests.every((check) => check(node));
}

class FakeNode {
  constructor(doc) {
    this.ownerDocument = doc;
    this.parentNode = null;
    this.childNodes = [];
  }

  get textContent() { return this.childNodes.map((node) => node.textContent).join(''); }

  set textContent(text) { this.replaceChildren(...(text === '' || text == null ? [] : [String(text)])); }

  get children() { return this.childNodes.filter((node) => node instanceof FakeElement); }

  get childElementCount() { return this.children.length; }

  adopt(node) {
    const child = typeof node === 'string' ? new FakeText(this.ownerDocument, node) : node;
    child.remove();
    child.parentNode = this;
    return child;
  }

  append(...nodes) { this.childNodes.push(...nodes.map((node) => this.adopt(node))); }

  appendChild(node) { this.append(node); return node; }

  replaceChildren(...nodes) {
    [...this.childNodes].forEach((node) => node.remove());
    this.append(...nodes);
  }

  remove() {
    if (!this.parentNode) return;
    const siblings = this.parentNode.childNodes;
    siblings.splice(siblings.indexOf(this), 1);
    this.parentNode = null;
  }

  *descendants() {
    for (const child of this.children) {
      yield child;
      yield* child.descendants();
    }
  }

  querySelectorAll(selector) { return [...this.descendants()].filter(matcher(selector)); }

  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
}

class FakeText extends FakeNode {
  constructor(doc, text) {
    super(doc);
    this.data = text;
  }

  get textContent() { return this.data; }

  set textContent(text) { this.data = String(text); }

  cloneNode() { return new FakeText(this.ownerDocument, this.data); }
}

class FakeElement extends FakeNode {
  constructor(doc, tag) {
    super(doc);
    this.tagName = tag.toUpperCase();
    this.attributes = new Map();
    this.listeners = [];
    // dataset.calendarUrl is the data-calendar-url attribute, as in a browser.
    this.dataset = new Proxy({}, {
      get: (_, key) => (typeof key === 'string' ? this.getAttribute(dataAttribute(key)) ?? undefined : undefined),
      set: (_, key, value) => { this.setAttribute(dataAttribute(key), value); return true; },
      deleteProperty: (_, key) => { this.removeAttribute(dataAttribute(key)); return true; },
      has: (_, key) => this.hasAttribute(dataAttribute(key)),
    });
  }

  getAttribute(name) { return this.attributes.get(name) ?? null; }

  setAttribute(name, value) { this.attributes.set(name, String(value)); }

  hasAttribute(name) { return this.attributes.has(name); }

  removeAttribute(name) { this.attributes.delete(name); }

  get hidden() { return this.hasAttribute('hidden'); }

  set hidden(on) {
    if (on) this.setAttribute('hidden', '');
    else this.removeAttribute('hidden');
  }

  get className() { return this.getAttribute('class') ?? ''; }

  set className(value) { this.setAttribute('class', value); }

  get type() { return this.getAttribute('type') ?? ''; }

  set type(value) { this.setAttribute('type', value); }

  // The script only writes an entity here (the close button's ×), never markup.
  set innerHTML(html) {
    if (/[<>]/.test(html)) throw new Error('The test page parses no markup');
    this.textContent = html.replace(/&times;/g, '×');
  }

  addEventListener(type, listener) { this.listeners.push({ type, listener }); }

  removeEventListener(type, listener) {
    this.listeners = this.listeners.filter((entry) => entry.type !== type || entry.listener !== listener);
  }

  // What a key press, a click or a page event does: its listeners run.
  dispatch(type, event = {}) {
    this.listeners.filter((entry) => entry.type === type)
      .forEach((entry) => entry.listener({ type, target: this, preventDefault() {}, ...event }));
  }

  cloneNode(deep = false) {
    const copy = this.ownerDocument.createElement(this.tagName.toLowerCase());
    this.attributes.forEach((value, name) => copy.setAttribute(name, value));
    if (deep) copy.append(...this.childNodes.map((node) => node.cloneNode(true)));
    return copy;
  }
}

class FakeDocument extends FakeElement {
  constructor() {
    super(null, '#document');
    this.ownerDocument = this;
    this.body = this.createElement('body');
    this.append(this.body);
  }

  createElement(tag) {
    const node = new FakeElement(this, tag);
    if (tag === 'template') node.content = new FakeElement(this, '#document-fragment');
    return node;
  }

  importNode(node, deep) { return node.cloneNode(deep); }

  getElementById(id) { return this.querySelector(`[id="${id}"]`); }
}

function h(doc, tag, attributes = {}, ...children) {
  const node = doc.createElement(tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  node.append(...children);
  return node;
}

// The card as the include writes it; with no course or title it is the
// template=true copy (test_calendar_card.rb checks the include).
function includedCard(doc, { course = '', title = '' } = {}) {
  return h(doc, 'section', { class: 'ocs__card ocs__keypoints', 'data-ocs-calendar': '', 'data-course': course, 'data-sample': 'false', 'data-calendar-url': '/preview/student/calendar', 'aria-label': title },
    h(doc, 'div', { class: 'ocs__links' },
      h(doc, 'strong', {}, h(doc, 'i', { class: 'fas fa-calendar-alt', 'aria-hidden': 'true' }), ` ${title}`),
      h(doc, 'a', { class: 'ocs__btn small pill', href: '/preview/student/calendar' }, 'Open calendar')),
    h(doc, 'div', { class: 'ocs__text', 'data-hook': 'status', role: 'status', hidden: '' }),
    h(doc, 'div', { 'data-hook': 'mount' }),
    h(doc, 'div', { 'data-hook': 'detail', hidden: '' }));
}

// Answers like Spring's /api/person/get: a signed-in student, or 401.
function spring({ signedIn }) {
  const asked = [];
  const fetchImpl = async (url, init) => {
    asked.push({ url, init });
    return signedIn ? Response.json({ name: 'Ada Lovelace', uid: 'ada', roles: [] }) : new Response('', { status: 401 });
  };
  return { asked, fetchImpl };
}

// A page with the card's template and (unless school is false) the school
// weeks, plus the browser globals a card uses, each new for the test and put
// back after it. Load the script before adding cards: it starts the page's
// unmounted cards as it loads.
function cardPage(t, { fetchImpl = spring({ signedIn: false }).fetchImpl, school = true } = {}) {
  const doc = new FakeDocument();
  if (school) doc.body.append(h(doc, 'script', { id: 'ocsSchoolCalendarData', type: 'application/json' }, JSON.stringify(SCHOOL)));
  const template = h(doc, 'template', { 'data-ocs-template': 'calendar-card' });
  template.content.append(includedCard(doc));
  doc.body.append(template);

  const globals = { document: doc, fetch: fetchImpl, window: { location: { href: 'https://pages.test/csa/' } } };
  const before = Object.keys(globals).map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
  Object.assign(globalThis, globals);
  t.after(() => before.forEach(([name, descriptor]) => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }));
  return { doc };
}

const statusOf = (card) => card.querySelector('[data-hook="status"]');

/* ── Making cards ────────────────────────────────────────────────────── */

test('createCalendarCardSection copies the include\'s empty card for a course, titled as the include would, marked manual', async (t) => {
  const { doc } = cardPage(t);
  const { createCalendarCardSection } = await loadCard('create');
  const csa = createCalendarCardSection({ course: ' CSA ' }, doc);
  assert.equal(csa.dataset.course, 'csa');
  assert.equal(csa.getAttribute('aria-label'), 'CSA calendar');
  assert.equal(csa.querySelector('strong').textContent, ' CSA calendar');
  assert.ok(csa.querySelector('strong').querySelector('i.fa-calendar-alt'), 'the icon stays in front of the title');
  assert.equal(csa.dataset.mounted, 'manual');

  const all = createCalendarCardSection({}, doc);
  assert.equal(all.dataset.course, 'all');
  assert.equal(all.getAttribute('aria-label'), 'Class calendar');

  // A title is words on the page, whatever it looks like.
  const odd = '<img src=x onerror=alert(1)> Q&A';
  const titled = createCalendarCardSection({ course: 'csp', title: odd }, doc);
  assert.equal(titled.getAttribute('aria-label'), odd);
  assert.equal(titled.querySelector('strong').textContent, ` ${odd}`);
  assert.equal(titled.querySelector('strong').childElementCount, 1);

  // The template stays empty for the next card.
  const empty = doc.querySelector('template').content.querySelector('[data-ocs-calendar]');
  assert.equal(empty.dataset.course, '');
  assert.equal(empty.hasAttribute('data-mounted'), false);
});

test('createCalendarCardSection needs the include\'s template on the page', async (t) => {
  cardPage(t);
  const { createCalendarCardSection } = await loadCard('no-template');
  assert.throws(() => createCalendarCardSection({ course: 'csa' }, new FakeDocument()), /template=true/);
});

/* ── Mounting ────────────────────────────────────────────────────────── */

test('on a site without Spring a card shows the school week and asks Spring nothing', async (t) => {
  const { asked, fetchImpl } = spring({ signedIn: true });
  const { doc } = cardPage(t, { fetchImpl });
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('flask-only');
  const card = createCalendarCardSection({ course: 'csa' }, doc);
  doc.body.append(card);
  await mountCalendarCard(card, { springEnabled: false }).refresh();
  assert.equal(asked.length, 0);
  const view = feed.views.at(-1);
  assert.equal(view.options.host, card.querySelector('[data-hook="mount"]'));
  assert.equal(view.options.getStore().mode, 'preview');
  assert.equal(view.options.showEmpty, false);
  assert.equal(statusOf(card).textContent, 'Showing the school week.');
  assert.equal(card.hasAttribute('aria-busy'), false);
  assert.equal(view.refreshes, 1);
});

test('without the option a card follows the site\'s spring setting', async (t) => {
  config.setSpringEnabled(false);
  t.after(() => config.setSpringEnabled(true));
  const { asked, fetchImpl } = spring({ signedIn: true });
  const { doc } = cardPage(t, { fetchImpl });
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('site-setting');
  const card = createCalendarCardSection({ course: 'csa' }, doc);
  doc.body.append(card);
  await mountCalendarCard(card).refresh();
  assert.equal(asked.length, 0);
  assert.equal(feed.views.at(-1).options.getStore().mode, 'preview');
});

test('signed in to Spring, cards show their class\'s events, and the page asks who is signed in once', async (t) => {
  const { asked, fetchImpl } = spring({ signedIn: true });
  const { doc } = cardPage(t, { fetchImpl });
  const script = await loadCard('signed-in');
  const cards = ['csa', 'csp'].map((course) => script.createCalendarCardSection({ course }, doc));
  doc.body.append(...cards);
  const before = feed.views.length;
  await Promise.all(cards.map((card) => script.mountCalendarCard(card, { springEnabled: true }).refresh()));
  assert.deepEqual(asked.map(({ url }) => url), ['https://spring.test/api/person/get']);
  assert.equal(asked[0].init.credentials, 'include');
  const views = feed.views.slice(before);
  assert.deepEqual(views.map((view) => view.options.getStore().mode), ['live', 'live']);
  assert.ok(views.every((view) => view.options.showEmpty));
  assert.ok(cards.every((card) => statusOf(card).hidden));
});

test('signed out of Spring, a card shows the school week and says to sign in', async (t) => {
  const { asked, fetchImpl } = spring({ signedIn: false });
  const { doc } = cardPage(t, { fetchImpl });
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('signed-out');
  const card = createCalendarCardSection({ course: 'csp' }, doc);
  doc.body.append(card);
  await mountCalendarCard(card, { springEnabled: true }).refresh();
  assert.equal(asked.length, 1);
  assert.equal(feed.views.at(-1).options.getStore().mode, 'preview');
  assert.equal(statusOf(card).textContent, 'Sign in to see your class events. Showing the school week.');
});

test('a sample card shows example events and asks Spring nothing', async (t) => {
  const { asked, fetchImpl } = spring({ signedIn: true });
  const { doc } = cardPage(t, { fetchImpl });
  const { mountCalendarCard } = await loadCard('sample');
  const card = includedCard(doc, { course: 'csa', title: 'CSA calendar' });
  card.dataset.sample = 'true';
  doc.body.append(card);
  await mountCalendarCard(card, { springEnabled: true }).refresh();
  assert.equal(asked.length, 0);
  assert.equal(feed.views.at(-1).options.getStore().mode, 'preview');
  assert.equal(statusOf(card).textContent, 'Sample week: these events are examples and stay in this browser.');
});

test('mounting a card twice changes nothing', async (t) => {
  const { doc } = cardPage(t);
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('twice');
  const card = createCalendarCardSection({ course: 'csa' }, doc);
  doc.body.append(card);
  const before = feed.views.length;
  const first = mountCalendarCard(card, { springEnabled: false });
  assert.equal(mountCalendarCard(card, { springEnabled: false }), first);
  await first.refresh();
  assert.equal(feed.views.length, before + 1);
  assert.equal(card.dataset.mounted, 'true');
});

test('unmounting takes off the card\'s listeners, stops its week and empties it', async (t) => {
  const { doc } = cardPage(t);
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('unmount');
  const card = createCalendarCardSection({ course: 'csa' }, doc);
  doc.body.append(card);
  const handle = mountCalendarCard(card, { springEnabled: false });
  await handle.refresh();
  const view = feed.views.at(-1);

  // Mounted: coming back to the tab reloads the week, and Escape closes an event.
  doc.dispatch('visibilitychange');
  assert.equal(view.refreshes, 2);
  view.options.onSelectEvent({ id: '7', title: 'Unit 3 Quiz', date: '2026-10-16' });
  const detail = card.querySelector('[data-hook="detail"]');
  assert.equal(detail.hidden, false);
  assert.match(detail.textContent, /Unit 3 Quiz/);
  card.dispatch('keydown', { key: 'Escape' });
  assert.equal(detail.hidden, true);
  view.options.onSelectEvent({ id: '7', title: 'Unit 3 Quiz', date: '2026-10-16' });

  handle.unmount();
  handle.unmount();   // a second time is harmless
  assert.equal(view.unmounted, true);
  assert.deepEqual(card.listeners, []);
  assert.deepEqual(doc.listeners, []);
  doc.dispatch('visibilitychange');
  await handle.refresh();
  assert.equal(view.refreshes, 2);
  assert.equal(detail.childElementCount, 0);
  assert.equal(detail.hidden, true);
  assert.equal(statusOf(card).hidden, true);
  assert.equal(card.dataset.mounted, 'manual');

  // Mounted again, it starts over.
  const again = mountCalendarCard(card, { springEnabled: false });
  assert.notEqual(again, handle);
  await again.refresh();
  assert.equal(feed.views.at(-1).unmounted, false);
});

test('unmounting while Spring is answering leaves the card unset', async (t) => {
  let answer;
  const fetchImpl = () => new Promise((resolve) => { answer = resolve; });
  const { doc } = cardPage(t, { fetchImpl });
  const { createCalendarCardSection, mountCalendarCard } = await loadCard('slow-spring');
  const card = createCalendarCardSection({ course: 'csa' }, doc);
  doc.body.append(card);
  const before = feed.views.length;
  const handle = mountCalendarCard(card, { springEnabled: true });
  assert.equal(card.getAttribute('aria-busy'), 'true');
  handle.unmount();
  answer(Response.json({ name: 'Ada Lovelace' }));
  await handle.refresh();
  assert.equal(feed.views.length, before);
  assert.equal(card.hasAttribute('aria-busy'), false);
  assert.equal(statusOf(card).textContent, '');
  assert.deepEqual(doc.listeners, []);
  assert.equal(card.dataset.mounted, 'manual');
});

test('mountAll starts the include\'s cards and leaves the ones a page made to that page', async (t) => {
  config.setSpringEnabled(false);
  t.after(() => config.setSpringEnabled(true));
  const { doc } = cardPage(t);
  const script = await loadCard('mount-all');
  const included = includedCard(doc, { course: 'csa', title: 'CSA calendar' });
  const made = script.createCalendarCardSection({ course: 'csp' }, doc);
  doc.body.append(included, made);
  assert.equal(script.mountAll(doc).length, 1);
  assert.equal(included.dataset.mounted, 'true');
  assert.equal(made.dataset.mounted, 'manual');
  assert.deepEqual(script.mountAll(doc), []);
});

test('without the school weeks, mountAll says so once and a card can\'t be mounted', async (t) => {
  const { doc } = cardPage(t, { school: false });
  const script = await loadCard('no-weeks');
  const included = includedCard(doc, { course: 'csa', title: 'CSA calendar' });
  doc.body.append(included);
  const errors = t.mock.method(console, 'error', () => {});
  assert.deepEqual(script.mountAll(doc), []);
  assert.equal(errors.mock.callCount(), 1);
  assert.equal(included.hasAttribute('data-mounted'), false);
  assert.throws(() => script.mountCalendarCard(included), /ocs_calendar_card_data\.html/);
});

test('on its own the script starts only the include\'s cards', async (t) => {
  config.setSpringEnabled(false);
  t.after(() => config.setSpringEnabled(true));
  const { doc } = cardPage(t);
  const included = includedCard(doc, { course: 'csa', title: 'CSA calendar' });
  const made = includedCard(doc, { course: 'csp', title: 'CSP calendar' });
  made.dataset.mounted = 'manual';
  doc.body.append(included, made);
  const before = feed.views.length;
  await loadCard('page-start');
  assert.equal(included.dataset.mounted, 'true');
  assert.equal(made.dataset.mounted, 'manual');
  assert.equal(feed.views.length, before + 1);
  assert.equal(feed.views.at(-1).options.host, included.querySelector('[data-hook="mount"]'));
});
