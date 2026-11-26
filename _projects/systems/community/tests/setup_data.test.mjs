// The demo setup reads as made up, and every word the code asks for exists.
// Run: node --test _projects/systems/community/tests/setup_data.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { loadSetup, loadTexts, SYSTEM } from './fixtures.mjs';
import { Texts } from '../js/texts.js';

const setup = loadSetup();
const texts = new Texts(loadTexts());

// Every string anywhere in a value, for the content checks.
function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const content = strings({
  people: setup.people, series: setup.series, channels: setup.channels, messages: setup.messages,
  files: setup.files, polls: setup.polls, reports: setup.reports, dms: setup.dms, pending: setup.pending_updates,
});

test('every person is a demo person', () => {
  for (const person of setup.people) {
    assert.match(person.name, /^Demo (LP \d+|Staff \d+|Moderator)$/, person.name);
  }
});

test('every series and company is a demo one', () => {
  for (const series of setup.series) {
    assert.match(series.title, /^Demo Series \d+$/);
    assert.match(series.company, /^Demo Company [A-Z]$/);
  }
});

test('no money amounts anywhere in the demo content', () => {
  for (const text of content) {
    assert.doesNotMatch(text, /\$|USD|\b\d[\d,.]*\s*(k|m|million|thousand)\b/i, text);
  }
});

test('the organization is a made-up one, and says so', () => {
  assert.match(setup.org.name, /^Demo /);
  assert.match(setup.org.short, /^Demo /);
  assert.match(setup.org.tagline, /made-up/i);
});

test('roles use Spring role names', () => {
  for (const person of setup.people) {
    for (const role of person.roles) assert.match(role, /^ROLE_(LP|MODERATOR|STAFF)$/);
  }
});

test('the content refers only to people, channels and messages that exist', () => {
  const people = new Set(setup.people.map(person => person.id));
  const channels = new Set(setup.channels.map(channel => channel.id));
  const series = new Set(setup.series.map(entry => entry.id));
  const keys = new Set(setup.messages.filter(message => message.key).map(message => message.key));
  setup.personas.forEach(id => assert.ok(people.has(id), `persona ${id}`));
  setup.people.forEach(person => (person.series || []).forEach(id => assert.ok(series.has(id), `${person.name} in ${id}`)));
  setup.channels.forEach(channel => assert.ok(channel.series === null || series.has(channel.series), channel.title));
  [...setup.messages, ...setup.files, ...setup.polls, ...setup.pending_updates].forEach((item) => {
    assert.ok(channels.has(item.channel), `channel ${item.channel}`);
    assert.ok(people.has(item.by), `person ${item.by}`);
  });
  setup.reports.forEach(report => assert.ok(keys.has(report.message), `report on ${report.message}`));
  setup.dms.forEach(dm => dm.between.forEach(id => assert.ok(people.has(id), `dm with ${id}`)));
});

// Keys built at run time (a reason, a role, a tab) are checked by their own tests.
const DYNAMIC = /^(report\.reasons|roles|tabs|errors|log|records)\./;

// Any quoted 'section.key' in the code whose section is one of texts.yml's: keys are passed
// to say() and refusal() directly, from ternaries and from tables of actions.
function keysUsedInCode() {
  const used = new Set();
  const sections = new Set(Object.keys(texts.table));
  const folder = new URL('js/', SYSTEM);
  for (const name of readdirSync(folder)) {
    const source = readFileSync(new URL(name, folder), 'utf8');
    for (const [, key, section] of source.matchAll(/'(([a-z]+)\.[a-z0-9_.-]+)'/g)) {
      if (sections.has(section)) used.add(key);
    }
  }
  const page = readFileSync(new URL('pages/demo.md', SYSTEM), 'utf8');
  for (const [, key] of page.matchAll(/\{\{\s*text\.([a-z_.]+)/g)) used.add(key);
  return used;
}

function leafKeys(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => (
    value && typeof value === 'object' ? leafKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  ));
}

test('every word the code and the page ask for exists', () => {
  for (const key of keysUsedInCode()) assert.ok(texts.has(key), `missing text "${key}"`);
});

test('every word in texts.yml is used', () => {
  const used = keysUsedInCode();
  const unused = leafKeys(texts.table).filter(key => !DYNAMIC.test(key) && !used.has(key));
  assert.deepEqual(unused, []);
});
