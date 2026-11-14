import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const system = new URL('../', import.meta.url);
const root = new URL('../../../../', import.meta.url);

// Where the site loads each file from: the pages and the scripts other pages load keep their old
// paths, and the system's own modules are in assets/js/login/.
const PUBLISHED_PATHS = [
  'navigation/authentication/login.md',
  'navigation/authentication/logout.md',
  'navigation/authentication/guestlogin.md',
  'navigation/signup.md',
  'assets/js/api/logout.js',
  'assets/js/api/passwordRules.js',
  'assets/js/api/passwordFields.js',
  'assets/js/api/reverify.js',
  'assets/js/login/login-page.js',
  'assets/js/login/navbar-login.js',
  'assets/js/login/backend.js',
  'assets/js/login/session.js',
];

// Every page and include that imports a Login script, with the site.baseurl path.
const IMPORTERS = [
  '_includes/themes/minima/header.html',
  '_includes/microblog_foundation.html',
  'navigation/authentication/support.md',
  '_projects/systems/login/pages/login.md',
  '_projects/systems/login/pages/logout.md',
  '_projects/systems/login/pages/signup.md',
  '_projects/systems/login/pages/guestlogin.md',
];

function distribution() {
  return JSON.parse(readFileSync(new URL('distribution.json', system), 'utf8')).files;
}

test('login system publishes every file where the site loads it', () => {
  const destinations = distribution().map((entry) => entry.destination);
  for (const path of PUBLISHED_PATHS) assert.ok(destinations.includes(path), `${path} is not published`);
});

test('every login source in distribution.json exists in the system', () => {
  for (const { source } of distribution()) {
    assert.ok(existsSync(new URL(source, system)), `missing source ${source}`);
  }
});

test('every published login file is git-ignored so copies are never committed', () => {
  const ignored = new Set(readFileSync(new URL('.gitignore', root), 'utf8').split('\n').map((line) => line.trim()));
  for (const { destination } of distribution()) {
    const parentIgnored = [...ignored].some((line) => line.endsWith('/') && `/${destination}`.startsWith(line));
    assert.ok(ignored.has(`/${destination}`) || parentIgnored, `${destination} is not in .gitignore`);
  }
});

// A page's import fails to link if the name isn't exported where it points, so check both ways:
// each Login export comes from the path the system publishes it to, and a page asks a Login
// script only for names that script exports.
test('pages import each Login export from the path the system publishes it to', () => {
  const publishedAt = new Map();
  const exportsAt = new Map();
  for (const { source, destination } of distribution().filter((entry) => entry.source.endsWith('.js'))) {
    const code = readFileSync(new URL(source, system), 'utf8');
    const names = [...code.matchAll(/^export (?:async )?(?:function|class|const) (\w+)/gm)].map((match) => match[1]);
    for (const name of names) publishedAt.set(name, destination);
    exportsAt.set(destination, new Set(names));
  }
  for (const importer of IMPORTERS) {
    const page = readFileSync(new URL(importer, root), 'utf8');
    const imports = [...page.matchAll(/import \{([^}]*)\} from (['"])\{\{ ?site\.baseurl ?\}\}\/([^'"]+)\2/g)];
    assert.ok(imports.some(([, , , path]) => exportsAt.has(path)), `${importer} imports no Login script, so it doesn't belong in IMPORTERS`);
    for (const [, list, , path] of imports) {
      const names = list.split(',').map((part) => part.trim().split(/\s+as\s+/)[0]).filter(Boolean);
      for (const name of names) {
        if (exportsAt.has(path)) assert.ok(exportsAt.get(path).has(name), `${importer} imports ${name} from ${path}, which doesn't export it`);
        if (publishedAt.has(name)) assert.equal(path, publishedAt.get(name), `${importer} imports ${name} from ${path}`);
      }
    }
  }
});
