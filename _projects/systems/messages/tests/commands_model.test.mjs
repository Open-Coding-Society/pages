import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMMANDS, matchCommands, parseCommand } from '../js/slash-commands.js';
import { CODE_LANGUAGES, addCodeMarker, extractCodeMarker, isRunnable } from '../js/code-model.js';

const names = groups => groups.flatMap(group => group.commands.map(command => command.name));

test('every command has a group, an icon and a hint, and no name repeats', () => {
  const seen = new Set();
  COMMANDS.forEach(command => {
    assert.ok(command.group && command.icon && command.hint, command.name);
    assert.ok(!seen.has(command.name), command.name);
    seen.add(command.name);
  });
});

test('"/" alone lists every command for the conversation, grouped in order', () => {
  const group = matchCommands('/', { kind: 'group' });
  assert.deepEqual(group.map(g => g.id), ['share', 'github', 'chat', 'message']);
  assert.ok(names(group).includes('folder'));
  assert.ok(!names(group).includes('search'), 'search is a direct message’s');
  const dm = matchCommands('/', { kind: 'dm' });
  assert.ok(!names(dm).includes('folder'), 'files are a group’s');
  assert.ok(names(dm).includes('search'));
});

test('typing narrows by name first, then by hint and keywords', () => {
  assert.deepEqual(names(matchCommands('/pi', { kind: 'group' })), ['pinned']);
  assert.deepEqual(names(matchCommands('/upload', { kind: 'group' })), ['file', 'folder']);
  assert.deepEqual(names(matchCommands('/zzz', { kind: 'group' })), []);
  assert.equal(matchCommands('hello', { kind: 'group' }), null);
  assert.equal(matchCommands('/code print', { kind: 'group' }), null, 'a space ends the menu');
});

test('parseCommand reads the command and what follows it', () => {
  assert.deepEqual(parseCommand('/issue Open-Coding-Society/pages#2031', { kind: 'group' }), { command: COMMANDS.find(c => c.name === 'issue'), args: 'Open-Coding-Society/pages#2031' });
  assert.equal(parseCommand('/ISSUE x', { kind: 'group' }).command.name, 'issue');
  assert.equal(parseCommand('/folder', { kind: 'dm' }), null, 'not offered in a direct message');
  assert.equal(parseCommand('/nope', { kind: 'group' }), null);
  assert.equal(parseCommand('path /usr/bin', { kind: 'group' }), null);
});

test('a code block survives every character, newlines included, and nothing else matches', () => {
  const code = 'for i in range(3):\n\tprint(f"[{i}] | 100% <b>&")\n';
  const body = addCodeMarker('<b>try this</b>', 'python', code);
  assert.match(body, /^\[\[code:python\|[^\]]*\]\] <b>try this<\/b>$/s);
  assert.deepEqual(extractCodeMarker(body), { language: 'python', code, html: '<b>try this</b>' });
  assert.deepEqual(extractCodeMarker('plain'), { language: null, code: null, html: 'plain' });
  assert.equal(extractCodeMarker('[[code:not a language|x]] hi').code, null);
});

test('only Python, Java and JavaScript run; every listed language has a label', () => {
  assert.deepEqual(['python', 'java', 'javascript', 'html', 'text'].map(isRunnable), [true, true, true, false, false]);
  CODE_LANGUAGES.forEach(language => assert.ok(language.label && language.extension, language.id));
});
