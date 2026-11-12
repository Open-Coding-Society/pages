import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { test } from 'node:test';

const system = new URL('../', import.meta.url);
const published = new Map(JSON.parse(readFileSync(new URL('distribution.json', system), 'utf8')).files
  .map(({ source, destination }) => [source, destination]));
const modules = readdirSync(new URL('js/', system)).filter((name) => name.endsWith('.js')).map((name) => `js/${name}`);

// The scripts are published into two folders (assets/js/api and assets/js/login), so an import
// only works if it names a file this system publishes next to the importer.
test('login modules import only ./ paths published beside them', () => {
  for (const source of modules) {
    const code = readFileSync(new URL(source, system), 'utf8');
    // Named (`from '…'`), bare (`import '…'`) and dynamic (`import('…')`) imports.
    const specifiers = [...code.matchAll(/\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
    for (const specifier of specifiers) {
      assert.ok(specifier.startsWith('./'), `${source} imports ${specifier}`);
      const target = posix.join(posix.dirname(published.get(source)), specifier);
      assert.ok([...published.values()].includes(target), `${source} imports ${specifier}, which is not published at ${target}`);
    }
  }
});

test('importing the navbar script does nothing until it is started', async () => {
  const navbar = await import('../js/navbar-login.js');
  assert.equal(typeof navbar.startNavbarLogin, 'function');
});

// /logout redirects to /login as soon as handleLogout resolves, so it must wait for the sign-out.
test('logout signs out through the session and waits for it', async () => {
  const { handleLogout } = await import('../js/logout.js');
  const steps = [];
  await handleLogout({ signOut: async () => { await new Promise((resolve) => setTimeout(resolve)); steps.push('signed out'); } });
  assert.deepEqual(steps, ['signed out']);
});

test('the navbar never checks springEnabled; it asks the session', () => {
  const navbar = readFileSync(new URL('js/navbar-login.js', system), 'utf8');
  assert.doesNotMatch(navbar, /springEnabled/);
  assert.match(navbar, /session\.usesSpring/);
});
