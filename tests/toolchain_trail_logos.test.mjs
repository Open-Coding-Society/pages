import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { STATION_LOGOS, TOOL_LOGOS, stationLogosFor } from '../_projects/games/cs-pathway/data/toolchainTrailLogos.js';

const level = readFileSync(new URL('../_projects/games/cs-pathway/levels/GameLevelCsPath4Toolchain.js', import.meta.url), 'utf8');
const STATION_IDS = [...level.matchAll(/^\s+id: '([a-z-]+)',\n\s+name: /gm)].map((match) => match[1]);
const logoDir = new URL('../_projects/games/cs-pathway/images/logos/', import.meta.url);

test('every logo mapping points at a real station', () => {
  assert.ok(STATION_IDS.length >= 7, `only found ${STATION_IDS.join(', ')}`);
  Object.keys(STATION_LOGOS).forEach((id) => assert.ok(STATION_IDS.includes(id), `unknown station ${id}`));
});

test('every station mapping uses known logos whose files exist', () => {
  Object.values(STATION_LOGOS).flatMap((entry) => Object.values(entry).flat()).forEach((id) => {
    assert.ok(TOOL_LOGOS[id], `unknown logo ${id}`);
    assert.ok(existsSync(new URL(TOOL_LOGOS[id].file, logoDir)), `missing ${TOOL_LOGOS[id].file}`);
  });
});

test('the main tools are identifiable on the map', () => {
  assert.deepEqual(stationLogosFor('editor-isle-tower', 'linux').map((l) => l.id), ['vscode']);
  assert.deepEqual(stationLogosFor('git-village-hall', null).map((l) => l.id), ['git']);
  assert.deepEqual(stationLogosFor('github-gateway-arch', 'windows').map((l) => l.id), ['github']);
});

test('OS-specific logos only show for that OS', () => {
  assert.deepEqual(stationLogosFor('compiler-canyon-forge', 'macos').map((l) => l.id), ['python', 'ruby', 'homebrew']);
  assert.deepEqual(stationLogosFor('compiler-canyon-forge', 'windows').map((l) => l.id), ['python', 'ruby']);
});

test('stations without a well-known logo get no badge', () => {
  ['terminal-town-gate', 'build-bridge', 'integration-summit'].forEach((id) => {
    assert.deepEqual(stationLogosFor(id, 'windows'), [], id);
  });
});
