// /dm's page script finds its elements by id in dm.md. A missing id makes byId return
// null, and whatever needed that element quietly does nothing, so these check the page
// and the script against each other.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const page = read('../navigation/dm.md');
const script = read('../js/messages-page.js');
// assert.match would print the whole file when it fails; this names what is missing.
const has = (text, pattern, what) => assert.ok(pattern.test(text), what);

test('every id messages-page.js looks up is in dm.md', () => {
  const ids = [...new Set([...script.matchAll(/byId\('([^']+)'\)/g)].map(match => match[1]))];
  assert.ok(ids.length > 20, 'the script looks its elements up with byId');
  assert.deepEqual(ids.filter(id => !page.includes(`id="${id}"`)), []);
});

test('the page gives the thread a command menu and a code box, and wires /help and the shortcuts', () => {
  has(script, /commandHost: byId\('messagesCommandHost'\)/, 'the thread gets the command menu host');
  has(script, /codeHost: byId\('messagesCodeHost'\)/, 'the thread gets the code box host');
  has(script, /runCode: \(language, code\) => api\.runCode\(language, code\)/, 'code blocks run through the api');
  has(script, /new HelpDialog\(\{/, '/help has a dialog');
  has(script, /new Shortcuts\(\{/, 'the keyboard shortcuts are on');
  has(script, /showCommands: \(\) => thread\.showCommands\(\)/, 'a shortcut opens the command menu');
});

test('dm.md hands the page its base URL, for the Profile link the gist command gives', () => {
  has(page, /import \{ baseurl, [^}]*\} from '\{\{ site\.baseurl \}\}\/assets\/js\/api\/config\.js';/, 'dm.md imports baseurl');
  has(page, /startMessagesPage\(\{ config: \{ baseurl, /, 'dm.md passes baseurl in the config');
  has(script, /profileUrl: `\$\{config\.baseurl \|\| ''\}\/profile`/, 'the page builds the Profile link from it');
});
