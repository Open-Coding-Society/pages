import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const system = new URL('../', import.meta.url);
const root = new URL('../../../../', import.meta.url);

// Other pages, layouts and tests load these files by their old paths, so the system must publish them there.
const PUBLISHED_PATHS = [
  'navigation/authentication/login.md',
  'navigation/authentication/logout.md',
  'navigation/authentication/guestlogin.md',
  'navigation/signup.md',
  'assets/js/api/login.js',
  'assets/js/api/logout.js',
  'assets/js/api/passwordRules.js',
  'assets/js/api/passwordFields.js',
  'assets/js/api/reverify.js',
  'assets/js/login/login-page.js',
  'assets/js/login/backend.js',
];

function distribution() {
  return JSON.parse(readFileSync(new URL('distribution.json', system), 'utf8')).files;
}

test('login system publishes every login file the site loads by its old path', () => {
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
