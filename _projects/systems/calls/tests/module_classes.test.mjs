// The calls modules export classes, the way Java keeps Math.random on Math: helpers are static
// methods (CallModel.format), anything with state or UI is made with `new` (new CallRoom(...)).
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';

import { installFakeDom } from '../../messages/tests/fake-dom.mjs';

installFakeDom();

const JS = new URL('../js/', import.meta.url);
const isClass = (value) => typeof value === 'function' && /^class\b/.test(Function.prototype.toString.call(value));

test('every calls module exports only classes', async () => {
  const modules = readdirSync(JS).filter((name) => name.endsWith('.js')).sort();
  assert.ok(modules.length >= 10, `found only ${modules.length} modules`);
  for (const name of modules) {
    const exported = Object.entries(await import(new URL(name, JS)));
    assert.ok(exported.length > 0, `${name} exports nothing`);
    const loose = exported.filter(([, value]) => !isClass(value)).map(([key]) => key);
    assert.deepEqual(loose, [], `${name} exports ${loose.join(', ')} outside a class`);
  }
});
