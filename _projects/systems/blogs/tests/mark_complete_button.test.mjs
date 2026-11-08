// The "Mark Lesson Complete" buttons save completion in the browser only: Flask and Spring
// have no /api/lessons/complete route, so a click must not send anything.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const lessonScript = readFileSync(new URL('../js/lesson-completion.js', import.meta.url), 'utf8');
const bigSixScript = readFileSync(new URL('../js/lesson-completion-bigsix.js', import.meta.url), 'utf8');

// Just enough DOM for these two classic scripts: class and data-* selectors, events, children.
class FakeElement {
  constructor(tagName, { className = '', dataset = {} } = {}) {
    this.tagName = tagName.toUpperCase();
    this.className = className;
    this.dataset = { ...dataset };
    this.style = {};
    this.children = [];
    this.parent = null;
    this.listeners = {};
    this.innerHTML = '';
    this.disabled = false;
    this.classList = {
      add: (name) => { if (!this.classList.contains(name)) this.className = `${this.className} ${name}`.trim(); },
      contains: (name) => this.className.split(/\s+/).includes(name),
    };
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent = null;
  }

  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }

  // Like a browser: a disabled button gets no click, but it still gets mouseenter and mouseleave.
  dispatch(type) {
    if (type === 'click' && this.disabled) return;
    for (const listener of this.listeners[type] || []) listener({ preventDefault() {}, target: this });
  }

  click() {
    this.dispatch('click');
  }

  matches(selectors) {
    return selectors.split(',').some((selector) => {
      const part = selector.trim();
      if (part.startsWith('.')) return this.classList.contains(part.slice(1));
      const attribute = part.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);
      if (!attribute) return false;
      const key = attribute[1].replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
      return attribute[2] === undefined ? key in this.dataset : this.dataset[key] === attribute[2];
    });
  }

  querySelectorAll(selectors) {
    const found = [];
    const walk = (element) => {
      for (const child of element.children) {
        if (child.matches(selectors)) found.push(child);
        walk(child);
      }
    };
    walk(this);
    return found;
  }

  querySelector(selectors) {
    return this.querySelectorAll(selectors)[0] || null;
  }
}

function openPage(pathname, script, storage = new Map()) {
  const body = new FakeElement('body');
  const pageContent = body.appendChild(new FakeElement('main', { className: 'page-content' }));
  const documentListeners = {};
  const requests = [];
  const page = {
    document: {
      body,
      title: 'Lesson',
      readyState: 'loading',
      createElement: (tagName) => new FakeElement(tagName),
      querySelector: (selectors) => body.querySelector(selectors),
      querySelectorAll: (selectors) => body.querySelectorAll(selectors),
      addEventListener: (type, listener) => (documentListeners[type] ||= []).push(listener),
    },
    location: { pathname, href: `https://pages.opencodingsociety.com${pathname}` },
    localStorage: {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, String(value)),
    },
    // Any request is recorded and fails, the way it does on a site with no such route.
    fetch: (url, options = {}) => {
      requests.push(`${options.method || 'GET'} ${url}`);
      return Promise.reject(new TypeError('Failed to fetch'));
    },
    setTimeout: () => 0,
    console: { log() {}, warn() {}, error() {} },
  };
  page.window = page;
  const context = vm.createContext(page);
  vm.runInContext(script, context);
  for (const listener of documentListeners.DOMContentLoaded || []) listener();
  return { body, pageContent, requests, storage };
}

// Lets a rejected request and its catch block run before the test looks at the results.
const settle = () => new Promise((resolve) => setImmediate(resolve));

test('an FRQ page saves its completion in the browser and sends no request', async () => {
  const page = openPage('/csa/frqs/2016/3', lessonScript);
  const button = page.pageContent.querySelector('.mark-complete-btn');
  assert.ok(button, 'the FRQ page gets a Mark Lesson Complete button');

  button.click();
  await settle();

  assert.deepEqual(page.requests, []);
  assert.deepEqual(JSON.parse(page.storage.get('completedLessons')), ['frq-2016-3']);

  const reopened = openPage('/csa/frqs/2016/3', lessonScript, page.storage);
  const savedButton = reopened.pageContent.querySelector('.mark-complete-btn');
  assert.equal(savedButton.disabled, true);
  assert.match(savedButton.innerHTML, /Lesson Completed/);
});

test('the FRQ button says Lesson Completed as soon as it is clicked, without a reload', () => {
  const page = openPage('/csa/frqs/2016/3', lessonScript);
  const button = page.pageContent.querySelector('.mark-complete-btn');

  button.click();

  assert.equal(button.disabled, true, 'a completed lesson cannot be marked again');
  assert.match(button.innerHTML, /Lesson Completed/);
  assert.doesNotMatch(button.innerHTML, /Mark Lesson Complete/);
});

test('a completed button keeps its color when the mouse moves over it and away', () => {
  const page = openPage('/csa/frqs/2016/3', lessonScript);
  const button = page.pageContent.querySelector('.mark-complete-btn');
  button.dispatch('mouseenter');
  button.click();
  const completedColor = button.style.backgroundColor;

  button.dispatch('mouseleave');
  assert.equal(button.style.backgroundColor, completedColor);
  assert.equal(button.style.transform, 'scale(1)', 'the button shrinks back from its hover size');
  button.dispatch('mouseenter');
  assert.equal(button.style.backgroundColor, completedColor);

  const reopened = openPage('/csa/frqs/2016/3', lessonScript, page.storage);
  const savedButton = reopened.pageContent.querySelector('.mark-complete-btn');
  savedButton.dispatch('mouseenter');
  assert.equal(savedButton.style.backgroundColor, completedColor);
  savedButton.dispatch('mouseleave');
  assert.equal(savedButton.style.backgroundColor, completedColor);
});

test('a Big Six lesson marks its module done for the hub and sends no request', async () => {
  const page = openPage('/bigsix/frontend_lesson', bigSixScript);
  const button = page.body.querySelector('.mark-complete-btn');
  assert.ok(button, 'the Big Six lesson gets the floating Mark Lesson Complete button');

  button.click();
  await settle();

  assert.deepEqual(page.requests, []);
  assert.deepEqual(JSON.parse(page.storage.get('completedLessons')), ['frontend_lesson']);
  for (let lesson = 1; lesson <= 10; lesson++) {
    assert.equal(page.storage.get(`bigsix:frontend_lesson:lesson:${lesson}`), 'done');
  }
  assert.equal(button.disabled, true);
  assert.match(button.innerHTML, /Lesson Completed/);
});
