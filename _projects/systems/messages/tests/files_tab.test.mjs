// FilesTab: a list that arrives after the tab moved on never replaces the newer one.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();
const { FilesTab } = await import('../js/files-panel.js');

test('a group\'s list that arrives late is dropped, so another group\'s tab keeps its own files', async () => {
  const pending = new Map(); // group id → resolve() for its list
  const groupFilesFor = id => ({ refresh() {}, index: () => new Promise(resolve => pending.set(id, resolve)) });
  const host = document.createElement('div');
  const tab = new FilesTab({ host, notify: () => {}, groupFilesFor, actions: { handle() {} } });

  tab.show({ id: 1, name: 'Team A' });
  tab.hide();
  tab.show({ id: 2, name: 'Team B' });
  pending.get(2)([{ path: 'b-notes.md', size: 1 }]);
  await settle();
  pending.get(1)([{ path: 'a-notes.md', size: 1 }]);
  await settle();

  // Filtering redraws from the tab's list, which has to still be Team B's.
  const filter = host.querySelector('.dm__files-filter');
  filter.value = 'notes';
  filter.dispatchEvent(fakeEvent('input'));
  assert.deepEqual([...host.querySelectorAll('.ocs__file-name')].map(node => node.textContent), ['b-notes.md']);
});
