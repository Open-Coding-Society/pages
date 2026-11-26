// Every Events module exports classes, the way Java keeps Math.random on Math: helpers are static
// methods on one class (EventTime.instant), and anything with state or a page to run is a class
// made with `new` (new EventCatalog(root, {...})). The one exception is viewer.js's startViewer,
// because Mort's shared _includes/page-viewer.html calls adapter.startViewer(bar, toolbar).
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import test from 'node:test';

const JS = new URL('../js/', import.meta.url);
const FUNCTION_EXPORTS = { 'viewer.js': ['startViewer'] };
const isClass = (value) => typeof value === 'function' && /^class\b/.test(Function.prototype.toString.call(value));

test('every Events module exports only classes, except viewer.js\'s startViewer', async () => {
  const modules = readdirSync(JS).filter((name) => name.endsWith('.js')).sort();
  assert.ok(modules.length > 0, 'found no modules');
  for (const name of modules) {
    const exported = Object.entries(await import(new URL(name, JS)));
    assert.ok(exported.length > 0, `${name} exports nothing`);
    const loose = exported.filter(([, value]) => !isClass(value)).map(([key]) => key);
    assert.deepEqual(loose, FUNCTION_EXPORTS[name] || [], `${name} exports ${loose.join(', ')} outside a class`);
  }
});
