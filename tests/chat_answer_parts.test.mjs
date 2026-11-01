import { test } from 'node:test';
import assert from 'node:assert/strict';

import { splitAnswerIntoParts } from '../_projects/games/cs-pathway/model/chatAnswerParts.js';

test('each fenced command becomes its own block, without the language name', () => {
  const answer = 'Check Git first:\n```bash\ngit --version\n```\nThen set your name:\n```\ngit config --global user.name "Ada"\n```\nTell me what it prints.';
  assert.deepEqual(splitAnswerIntoParts(answer), [
    { type: 'text', text: 'Check Git first:' },
    { type: 'block', text: 'git --version' },
    { type: 'text', text: 'Then set your name:' },
    { type: 'block', text: 'git config --global user.name "Ada"' },
    { type: 'text', text: 'Tell me what it prints.' },
  ]);
});

test('backticked text inside a sentence becomes inline code', () => {
  assert.deepEqual(splitAnswerIntoParts('Open `~/.zshrc` and add `export PATH=$HOME/bin:$PATH` at the end.'), [
    { type: 'text', text: 'Open ' },
    { type: 'inline', text: '~/.zshrc' },
    { type: 'text', text: ' and add ' },
    { type: 'inline', text: 'export PATH=$HOME/bin:$PATH' },
    { type: 'text', text: ' at the end.' },
  ]);
});

test('a one-word command is kept, not mistaken for a language name', () => {
  assert.deepEqual(splitAnswerIntoParts('Run:\n```\npwd\n```'), [
    { type: 'text', text: 'Run:' },
    { type: 'block', text: 'pwd' },
  ]);
  assert.deepEqual(splitAnswerIntoParts('```pwd```'), [{ type: 'block', text: 'pwd' }]);
});

test('an answer cut off inside a fence still shows the command', () => {
  assert.deepEqual(splitAnswerIntoParts('Install it:\n```\nbrew install python'), [
    { type: 'text', text: 'Install it:' },
    { type: 'block', text: 'brew install python' },
  ]);
});

test('plain answers and stray backticks stay text', () => {
  assert.deepEqual(splitAnswerIntoParts('You are all set!'), [{ type: 'text', text: 'You are all set!' }]);
  assert.deepEqual(splitAnswerIntoParts('A lone ` backtick'), [{ type: 'text', text: 'A lone ` backtick' }]);
  assert.deepEqual(splitAnswerIntoParts(''), []);
});
