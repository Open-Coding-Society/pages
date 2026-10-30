import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../_projects/games/cs-pathway/levels/GameLevelCsPath4Toolchain.js', import.meta.url), 'utf8');

const stationBlock = (id, nextId) => {
  const start = source.indexOf(`id: '${id}'`);
  const end = nextId ? source.indexOf(`id: '${nextId}'`, start) : source.length;
  assert.ok(start >= 0 && end > start, `could not find ${id}`);
  return source.slice(start, end);
};

test('macOS stations 1-4 teach the exact commands required by the practice checks', () => {
  const terminal = stationBlock('terminal-town-gate', 'compiler-canyon-forge');
  assert.match(terminal, /mkdir -p toolchain-trail/);
  assert.match(terminal, /ls -ld toolchain-trail/);

  const runtime = stationBlock('compiler-canyon-forge', 'editor-isle-tower');
  assert.match(runtime, /python3 --version/);
  assert.match(runtime, /python3 -m pip --version/);
  assert.match(runtime, /bash scripts\/activate_macos\.sh/);

  const editor = stationBlock('editor-isle-tower', 'git-village-hall');
  assert.match(editor, /code --version/);
  assert.match(editor, /code \./);

  const git = stationBlock('git-village-hall', 'github-gateway-arch');
  assert.match(git, /git --version/);
  assert.match(git, /git config --global --get user\.name/);
  assert.match(git, /git config --global --get user\.email/);
  assert.match(git, /\[redacted\]/);
});
