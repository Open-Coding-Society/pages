import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SlashCommands } from '../js/slash-commands.js';
import { CodeBlocks } from '../js/code-model.js';

const names = groups => groups.flatMap(group => group.commands.map(command => command.name));

test('every command has a group, an icon and a hint, and no name repeats', () => {
  const seen = new Set();
  SlashCommands.ALL.forEach(command => {
    assert.ok(command.group && command.icon && command.hint, command.name);
    assert.ok(!seen.has(command.name), command.name);
    seen.add(command.name);
  });
});

test('"/" alone lists every command for the conversation, grouped in order', () => {
  const group = SlashCommands.match('/', { kind: 'group' });
  assert.deepEqual(group.map(g => g.id), ['share', 'github', 'chat', 'message']);
  assert.ok(names(group).includes('folder'));
  assert.ok(!names(group).includes('search'), 'search is a direct message’s');
  const dm = SlashCommands.match('/', { kind: 'dm' });
  assert.ok(!names(dm).includes('folder'), 'files are a group’s');
  assert.ok(names(dm).includes('search'));
});

test('typing narrows by name first, then by hint and keywords', () => {
  assert.deepEqual(names(SlashCommands.match('/gi', { kind: 'group' })), ['gist']);
  assert.deepEqual(names(SlashCommands.match('/upload', { kind: 'group' })), ['file', 'folder']);
  assert.deepEqual(names(SlashCommands.match('/zzz', { kind: 'group' })), []);
  assert.equal(SlashCommands.match('hello', { kind: 'group' }), null);
  assert.equal(SlashCommands.match('/code print', { kind: 'group' }), null, 'a space ends the menu');
});

test('parseCommand reads the command and what follows it', () => {
  assert.deepEqual(SlashCommands.parse('/issue Open-Coding-Society/pages#2031', { kind: 'group' }), { command: SlashCommands.ALL.find(c => c.name === 'issue'), args: 'Open-Coding-Society/pages#2031' });
  assert.equal(SlashCommands.parse('/ISSUE x', { kind: 'group' }).command.name, 'issue');
  assert.equal(SlashCommands.parse('/folder', { kind: 'dm' }), null, 'not offered in a direct message');
  assert.equal(SlashCommands.parse('/nope', { kind: 'group' }), null);
  assert.equal(SlashCommands.parse('path /usr/bin', { kind: 'group' }), null);
});

test('a code block survives every character, newlines included, and nothing else matches', () => {
  const code = 'for i in range(3):\n\tprint(f"[{i}] | 100% <b>&")\n';
  const body = CodeBlocks.addMarker('<b>try this</b>', 'python', code);
  assert.match(body, /^\[\[code:python\|[^\]]*\]\] <b>try this<\/b>$/s);
  assert.deepEqual(CodeBlocks.extractMarker(body), { language: 'python', code, html: '<b>try this</b>' });
  assert.deepEqual(CodeBlocks.extractMarker('plain'), { language: null, code: null, html: 'plain' });
  assert.equal(CodeBlocks.extractMarker('[[code:not a language|x]] hi').code, null);
});

test('only Python, Java and JavaScript run; every listed language has a label', () => {
  assert.deepEqual(['python', 'java', 'javascript', 'html', 'text'].map(CodeBlocks.isRunnable), [true, true, true, false, false]);
  CodeBlocks.LANGUAGES.forEach(language => assert.ok(language.label && language.extension, language.id));
});

test('the Shared panel’s tabs are commands in any conversation: /media, /links and /pinned', () => {
  for (const kind of ['group', 'dm']) {
    const chat = SlashCommands.match('/', { kind }).find(group => group.id === 'chat').commands.map(command => command.name);
    assert.ok(['media', 'links', 'pinned'].every(name => chat.includes(name)), kind);
  }
  assert.deepEqual(names(SlashCommands.match('/pinn', { kind: 'dm' })), ['pinned']);
});
