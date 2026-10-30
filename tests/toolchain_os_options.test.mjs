import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../_projects/games/cs-pathway/levels/GameLevelCsPath4Toolchain.js', import.meta.url), 'utf8');

test('the trail offers Windows, macOS and Linux, and not Kasm', () => {
  const options = source.slice(source.indexOf('const OS_OPTIONS'), source.indexOf(']);', source.indexOf('const OS_OPTIONS')));
  assert.deepEqual([...options.matchAll(/id: '([a-z]+)'/g)].map((match) => match[1]), ['windows', 'macos', 'linux']);
  assert.doesNotMatch(source, /\bkasm:/);
});

test('a saved OS the trail no longer offers asks the student to pick again', () => {
  assert.match(source, /const isOfferedOS = OS_OPTIONS\.some\(\(option\) => option\.id === storedOS\);\s*this\.selectedOS = isOfferedOS \? storedOS : null;/);
});
