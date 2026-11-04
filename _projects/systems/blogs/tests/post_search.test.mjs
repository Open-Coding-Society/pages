import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesQuery, matchRanges, rangesByNode, readQuery, writeQuery, statusText, createPostSearch } from '../js/post-search.js';

const characters = 'Characters - Players and NPCs Learn object literals, constructors, inheritance, and animation';

test('every word of the query must appear, in any order or case', () => {
  assert.equal(matchesQuery(characters, 'npc'), true);
  assert.equal(matchesQuery(characters, 'PLAYERS inheritance'), true);
  assert.equal(matchesQuery(characters, 'inheritance players'), true);
  assert.equal(matchesQuery(characters, 'players parallax'), false);
});

test('a blank query matches every card', () => {
  assert.equal(matchesQuery('Backgrounds', ''), true);
  assert.equal(matchesQuery('Backgrounds', '   '), true);
  assert.equal(matchesQuery('', ''), true);
});

test('accents are ignored on both sides', () => {
  assert.equal(matchesQuery('Pokémon sprites', 'pokemon'), true);
  assert.equal(matchesQuery('Pokemon sprites', 'POKÉMON'), true);
});

test('matchRanges finds each word of the query wherever it appears, as [start, end) spans', () => {
  assert.deepEqual(matchRanges('Students will practice LxD', 'de'), [[3, 5]]);
  assert.deepEqual(matchRanges('Production-Fidelity', 'DE'), [[13, 15]]);
  assert.deepEqual(matchRanges('Teaching using LxD', 'lxd teach'), [[0, 5], [15, 18]]);
  assert.deepEqual(matchRanges('de and de', 'de'), [[0, 2], [7, 9]]);
});

test('matchRanges merges overlapping and touching spans', () => {
  assert.deepEqual(matchRanges('aaaa', 'aa'), [[0, 4]]);
  assert.deepEqual(matchRanges('banana', 'ana'), [[1, 6]]);
  assert.deepEqual(matchRanges('ArrayList', 'array list'), [[0, 9]]);
});

test('matchRanges finds nothing for a blank query or a missing word', () => {
  assert.deepEqual(matchRanges('Backgrounds', ''), []);
  assert.deepEqual(matchRanges('Backgrounds', '   '), []);
  assert.deepEqual(matchRanges('Backgrounds', 'parallax'), []);
});

test('matchRanges ignores accents and maps spans back to the original letters', () => {
  assert.deepEqual(matchRanges('Pokémon sprites', 'pokemon'), [[0, 7]]);
  assert.deepEqual(matchRanges('Pokemon sprites', 'POKÉMON'), [[0, 7]]);
  // An accent typed as its own combining mark stays inside the highlight.
  assert.deepEqual(matchRanges('Poke\u0301mon', 'pokemon'), [[0, 8]]);
  assert.deepEqual(matchRanges('Poke\u0301mon', 'poke'), [[0, 5]]);
  assert.deepEqual(matchRanges('café', 'caf'), [[0, 3]]);
  assert.deepEqual(matchRanges('İstanbul', 'ist'), [[0, 3]]);
});

test('rangesByNode splits spans over a field\'s text nodes, so markup can split a word', () => {
  // "Java<strong>Script</strong>": one match over two text nodes becomes one mark in each.
  assert.deepEqual(rangesByNode([4, 6], [[0, 10]]), [[[0, 4]], [[0, 6]]]);
  assert.deepEqual(rangesByNode([5, 5], [[1, 3], [7, 9]]), [[[1, 3]], [[2, 4]]]);
  assert.deepEqual(rangesByNode([3, 0, 3], [[2, 4]]), [[[2, 3]], [], [[0, 1]]]);
  assert.deepEqual(rangesByNode([3], []), [[]]);
});

test('the query round trips through ?q= and keeps the page\'s other parameters', () => {
  assert.equal(readQuery('?q=npc%20players'), 'npc players');
  assert.equal(readQuery(''), '');
  assert.equal(writeQuery('', 'npc players'), '?q=npc+players');
  assert.equal(readQuery(writeQuery('?post=%2Fa%2F', 'a&b=c')), 'a&b=c');
  assert.equal(writeQuery('?post=%2Fa%2F&q=old', ''), '?post=%2Fa%2F');
  assert.equal(writeQuery('?q=old', '   '), '');
});

test('the status line counts the cards that are showing', () => {
  assert.equal(statusText(3, 3, ''), '3 documents');
  assert.equal(statusText(1, 1, '  '), '1 document');
  assert.equal(statusText(1, 3, 'npc'), '1 of 3 documents');
  assert.equal(statusText(0, 3, ' xyz '), 'No documents match "xyz".');
});

// Plain objects standing in for the field, button, status line, cards and window.
function element(fields = {}) {
  return {
    hidden: false,
    disabled: true,
    value: '',
    textContent: '',
    dataset: {},
    focused: false,
    listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler; },
    focus() { this.focused = true; },
    querySelectorAll() { return []; }, // no highlight fields here; the browser checks cover <mark>
    ...fields,
  };
}

function fixture(search = '') {
  const input = element();
  const clear = element();
  const status = element();
  const cards = [
    ['Backgrounds', 'An introduction to backgrounds and parallax scrolling in the adventure game.'],
    ['Characters - Players and NPCs', 'Learn object literals, constructors, inheritance, and animation.'],
    ['JavaScript Variables and HTML DOM Challenge', 'Perform variables and HTML DOM Challenge using this notebook.'],
  ].map(([title, description]) => element({ dataset: { postSearchText: `${title} ${description}` } }));
  const addresses = [];
  const environment = {
    location: { pathname: '/gamebuilder/docs/', search, hash: '' },
    history: { replaceState: (state, title, url) => addresses.push(url) },
  };
  const type = (value) => {
    input.value = value;
    input.listeners.input();
  };
  return { input, clear, status, cards, environment, addresses, type, click: () => clear.listeners.click() };
}

const shown = (cards) => cards.filter((card) => !card.hidden).length;

test('the bar starts enabled with every card showing', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  assert.equal(page.input.disabled, false);
  assert.equal(page.clear.disabled, true);
  assert.equal(shown(page.cards), 3);
  assert.equal(page.status.textContent, '3 documents');
  assert.deepEqual(page.addresses, []);
});

test('typing hides the cards that do not match and keeps the query in the address', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  page.type('npc');
  assert.deepEqual(page.cards.map((card) => card.hidden), [true, false, true]);
  assert.equal(page.clear.disabled, false);
  assert.equal(page.status.textContent, '1 of 3 documents');
  assert.equal(page.addresses.at(-1), '/gamebuilder/docs/?q=npc');

  page.type('dragons');
  assert.equal(shown(page.cards), 0);
  assert.equal(page.status.textContent, 'No documents match "dragons".');
});

test('Clear Search shows every card again, drops ?q= and returns focus to the field', () => {
  const page = fixture();
  createPostSearch(page, page.environment);
  page.type('variables');
  page.click();
  assert.equal(page.input.value, '');
  assert.equal(shown(page.cards), 3);
  assert.equal(page.clear.disabled, true);
  assert.equal(page.status.textContent, '3 documents');
  assert.equal(page.addresses.at(-1), '/gamebuilder/docs/');
  assert.equal(page.input.focused, true);
});

test('an address with ?q= opens with that search applied', () => {
  const page = fixture('?q=parallax');
  createPostSearch(page, page.environment);
  assert.equal(page.input.value, 'parallax');
  assert.deepEqual(page.cards.map((card) => card.hidden), [false, true, true]);
  assert.equal(page.clear.disabled, false);
  assert.equal(page.status.textContent, '1 of 3 documents');
});
