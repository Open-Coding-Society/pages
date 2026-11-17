import assert from 'node:assert/strict';
import test from 'node:test';
import { mountRunnerDependencies } from '../assets/js/pages/runners/core/RunnerDependencies.js';

class Element {
  constructor(tag, ownerDocument) {
    this.tag = tag;
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.dataset = {};
    this.listeners = new Map();
    this.isConnected = true;
  }
  append(...children) { this.children.push(...children); }
  after(child) { this.afterElement = child; }
  remove() { this.isConnected = false; }
  replaceChildren() { this.children = []; this.selected = ''; }
  setAttribute(name, value) { this[name] = value; }
  addEventListener(name, action) { this.listeners.set(name, action); }
  removeEventListener(name) { this.listeners.delete(name); }
  get options() { return this.children; }
  get value() { return this.selected || this.children[0]?.value || ''; }
  set value(value) { this.selected = value; }
}

function page() {
  return {
    confirmations: [],
    accept: true,
    createElement(tag) { return new Element(tag, this); },
    defaultView: { confirm: null },
  };
}

function runner(document, id, source, saved = null, mode = 'java') {
  const panel = new Element('div', document);
  const container = new Element('div', document);
  container.id = id;
  container.querySelector = (selector) => selector === '.editor-container .control-panel' ? panel : null;
  const listeners = new Set();
  const instance = {
    container, containerId: id, defaultCode: source, code: source, stored: saved,
    getValue() { return this.code; },
    setValue(code) { this.code = code; for (const listener of listeners) listener(code); },
    getStoredValue(fallback) { return this.stored ?? fallback; },
    onCodeChange(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
  const controller = mountRunnerDependencies(instance, mode);
  return {
    instance, controller,
    get select() { return panel.children[0].children[0]; },
    get button() { return panel.children[0].children[1]; },
    get status() { return panel.afterElement; },
    update() { this.button.listeners.get('click')(); },
  };
}

const provide = (body) => `/** @provides Expertise */\n${body}\n/** @end Expertise */`;
const consume = (body) => `/** @dependency Expertise */\n${body}\n/** @end Expertise */\n// TODO: Mentor`;

test('the dropdown transfers saved rather than unsaved provider code and leaves destination work intact', () => {
  const document = page();
  const source = runner(document, 'popcorn', provide('draft'), provide('saved'));
  const target = runner(document, 'mentor', consume('starter'));
  assert.equal(target.select.value, 'Expertise');
  target.update();
  assert.equal(target.instance.code, consume('saved'));
  assert.equal(source.instance.code, provide('draft'));
  assert.equal(target.instance.container.dataset.dependencyDirty, 'true');
  assert.match(target.status.textContent, /Save this runner/);
  target.controller.saved(target.instance.code);
  assert.equal(target.instance.container.dataset.dependencyDirty, undefined);
});

test('missing saved sources report an error without falling back to starter code', (t) => {
  t.mock.method(console, 'error', () => {});
  const document = page();
  runner(document, 'popcorn', provide('unsaved'));
  const target = runner(document, 'mentor', consume('starter'));
  target.update();
  assert.equal(target.instance.code, consume('starter'));
  assert.match(target.status.textContent, /no saved provider/);
});

test('Update all fills empty dependencies from two blocks in one saved runner', () => {
  const document = page();
  document.defaultView.confirm = () => { throw new Error('Empty imports need no overwrite confirmation'); };
  const source = '/** @provides Foundation */\nclass Catalog {}\n/** @end Foundation */\n'
    + provide('class Expertise {}');
  runner(document, 'popcorn', source, source);
  const empty = '/** @dependency Foundation */\n/** @end Foundation */\n'
    + consume('') + '\nclass Mentor {}';
  const target = runner(document, 'mentor', empty);
  target.select.value = '*';
  target.update();
  assert.match(target.instance.code, /class Catalog/);
  assert.match(target.instance.code, /class Expertise/);
  assert.ok(target.instance.code.endsWith('class Mentor {}'));
  assert.match(target.status.textContent, /Updated Foundation, Expertise/);
  const updated = target.instance.code;
  target.update();
  assert.equal(target.instance.code, updated);
  assert.match(target.status.textContent, /already match/);
});

test('local dependency edits require confirmation but unrelated TODO edits do not', () => {
  const document = page();
  document.defaultView.confirm = (message) => { document.confirmations.push(message); return document.accept; };
  const source = runner(document, 'popcorn', provide('saved'), provide('saved'));
  const target = runner(document, 'mentor', consume('starter'));
  target.instance.setValue(consume('starter').replace('TODO: Mentor', 'My Mentor implementation'));
  target.update();
  assert.equal(document.confirmations.length, 0);
  target.instance.setValue(target.instance.code.replace('saved', 'locally edited'));
  document.accept = false;
  target.update();
  assert.match(document.confirmations[0], /Expertise/);
  assert.match(target.instance.code, /locally edited/);
  document.accept = true;
  source.instance.stored = provide('new saved source');
  target.update();
  assert.match(target.instance.code, /new saved source/);
  assert.match(target.instance.code, /My Mentor implementation/);
});

test('Update all and incompatible source errors are atomic', (t) => {
  t.mock.method(console, 'error', () => {});
  const document = page();
  runner(document, 'popcorn', provide('saved'), provide('saved'));
  const source = `${consume('starter')}\n// @dependency Another\nold\n// @end Another`;
  const target = runner(document, 'mentor', source);
  target.select.value = '*';
  target.update();
  assert.equal(target.instance.code, source);
  assert.match(target.status.textContent, /Another.*no saved provider/);
  const python = runner(document, 'python', '# @dependency Expertise\npass\n# @end Expertise', null, 'python');
  python.update();
  assert.match(python.status.textContent, /java code into python/);
});

test('untagged code has no visible controls; malformed tags surface and recover on edit', (t) => {
  t.mock.method(console, 'error', () => {});
  const document = page();
  const target = runner(document, 'plain', 'print(1)', null, 'python');
  assert.equal(target.select.children.length, 0);
  target.instance.setValue('# @dependency Expertise\npass');
  assert.equal(target.button.disabled, true);
  assert.match(target.status.textContent, /missing @end/);
  target.instance.setValue('# @dependency Expertise\npass\n# @end Expertise');
  assert.equal(target.button.disabled, false);
  assert.equal(target.status.hidden, true);
});

test('disconnected providers do not supply code after a reader page replacement', (t) => {
  t.mock.method(console, 'error', () => {});
  const document = page();
  const old = runner(document, 'old', provide('old'), provide('old'));
  old.instance.container.isConnected = false;
  const target = runner(document, 'new', consume('starter'));
  target.update();
  assert.match(target.status.textContent, /no saved provider/);
});
