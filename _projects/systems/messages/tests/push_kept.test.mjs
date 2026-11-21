// Dhyan's push notifications (#2035) start from /dm's page script: dm.md imports
// push-notifications.js and hands it to startMessagesPage, which wires the Notify my phone
// button. Later Messages changes rewrite both files, so this pins what has to stay.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('dm.md imports push-notifications.js and passes push to startMessagesPage', () => {
  const page = read('../navigation/dm.md');
  assert.match(page, /import \* as push from '\{\{ site\.baseurl \}\}\/assets\/js\/api\/push-notifications\.js';/);
  assert.match(page, /startMessagesPage\(\{[^;]*\bpush\b[^;]*\}\);/);
  assert.match(page, /id="messagesNotify"/);
});

test('messages-page.js still calls initNotifyButton with the push it is given', () => {
  const source = read('../js/messages-page.js');
  assert.match(source, /import \{ initNotifyButton \} from '\.\/notify-button\.js';/);
  assert.match(source, /export async function startMessagesPage\(\{[^}]*\bpush\b[^}]*\}\)/);
  assert.match(source, /initNotifyButton\(\{ push, /);
});
