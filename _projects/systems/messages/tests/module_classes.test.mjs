// Messages' modules export classes, the way Java keeps Math.random with its kin on Math:
// related helpers are static methods on one class (SharedFiles.formatBytes(size)), and
// anything with state or UI is a class made with `new` (new ComposerFiles({ ... })). One
// class per module, or a couple when that reads better, keeps the names a page can import
// few and grouped.
//
// The modules that were here before the Messages revamp keep their function exports for
// now: other systems import them by name (the UI Builder's chat block imports
// conversation-embed.js's mountGroupChat), schedule-*.js belong to Add to calendar, and
// notify-button.js belongs to the push notifications from #2035.
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import test from 'node:test';

import { installFakeDom } from './fake-dom.mjs';

installFakeDom();

const OLDER_MODULES = new Set([
  'chat-socket.js', 'conversation-embed.js', 'delete-group.js', 'dialogs.js', 'formation-model.js', 'group-dialogs.js',
  'group-formation.js', 'message-log.js', 'message-search.js', 'messages-api.js', 'messages-model.js', 'messages-page.js',
  'new-chat.js', 'notify-button.js', 'schedule-dialog.js', 'schedule-model.js', 'sidebar.js', 'thread.js',
]);

const JS = new URL('../js/', import.meta.url);
const isClass = value => typeof value === 'function' && /^class\b/.test(Function.prototype.toString.call(value));

test('every newer Messages module exports only classes', async () => {
  const modules = readdirSync(JS).filter(name => name.endsWith('.js') && !OLDER_MODULES.has(name)).sort();
  assert.ok(modules.length > 0, 'found no newer modules');
  for (const name of modules) {
    const exported = Object.entries(await import(new URL(name, JS)));
    assert.ok(exported.length > 0, `${name} exports nothing`);
    const loose = exported.filter(([, value]) => !isClass(value)).map(([key]) => key);
    assert.deepEqual(loose, [], `${name} exports ${loose.join(', ')} outside a class`);
  }
});
