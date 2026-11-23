// Calls' one hook in /dm (the calls system's CallEntry, _projects/systems/calls/js/call-entry.js):
// dm.md loads it only when the site runs Spring and _config.yml's calls.enabled is true, and
// messages-page.js tells it which conversation is open and hands it call frames. The behavior
// is tested in the calls system; this pins the wiring, which later Messages changes rewrite.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('dm.md loads CallEntry only when calls are on, and passes it as calls', () => {
  const page = read('../navigation/dm.md');
  assert.match(page, /\{%- if site\.spring != false and site\.calls\.enabled == true -%\}\{%- assign calls_text = site\.data\.projects\.calls\.calls\.text -%\}\{%- endif -%\}/);
  assert.match(page, /\{%- if calls_text %\}\s*import \{ CallEntry \} from '\{\{ site\.baseurl \}\}\/assets\/js\/projects\/calls\/call-entry\.js';\s*\{%- endif %\}/);
  assert.match(page, /\{% if calls_text %\}, calls: new CallEntry\(\{ javaURI, fetchOptions, baseurl: \{\{ site\.baseurl \| jsonify \}\}, text: \{\{ calls_text \| jsonify \}\} \}\)\{% endif %\}/);
  assert.match(page, /<a class="dm__action hidden" id="messagesCall"><\/a>/);
  assert.match(page, /<p class="dm__notice" id="messagesCallNotice" role="status"><\/p>/);
});

test('messages-page.js attaches calls, opens it with each conversation and passes call frames', () => {
  const source = read('../js/messages-page.js');
  assert.match(source, /export async function startMessagesPage\(\{[^}]*\bcalls = null\b[^}]*\}\)/);
  assert.match(source, /calls\?\.attach\(\{ link: byId\('messagesCall'\), notice: byId\('messagesCallNotice'\) \}\);/);
  assert.match(source, /calls\?\.open\(kind, id\);/);
  assert.match(source, /onCall: \(kind, id, change\) => calls\?\.frame\(kind, id, change\)/);
});
