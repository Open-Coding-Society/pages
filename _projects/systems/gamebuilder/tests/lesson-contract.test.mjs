/**
 * @module lesson-contract-tests
 * @description Checks lesson-owned assets and runnable character data without
 * starting a browser game or executing notebook kernel commands.
 * @data Reads the source notebooks and sprites under the GameBuilder project.
 * @usage Run with `node --test _projects/systems/gamebuilder/tests/lesson-contract.test.mjs`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const project = new URL('../', import.meta.url);
const readNotebook = (name) => JSON.parse(readFileSync(
  new URL(`notebooks/2026-02-17-${name}.ipynb`, project), 'utf8'
));
const characters = readNotebook('characters');
const runnerSources = characters.cells
  .filter((cell) => cell.cell_type === 'code' && cell.source.join('').includes('// GAME_RUNNER:'))
  .map((cell) => cell.source.join('').replace(/^%%js\s*/, ''));

test('lesson images resolve to owned source assets, not another game distribution', () => {
  for (const name of ['characters', 'backgrounds']) {
    const text = readNotebook(name).cells.map((cell) => cell.source.join('')).join('\n');
    const references = [...text.matchAll(/\/images\/[a-zA-Z0-9_./-]+\.(?:png|jpg)/g)];
    assert.ok(references.length > 0, `${name} needs lesson images`);
    for (const [path] of references) {
      assert.ok(path.startsWith('/images/projects/gamebuilder/'), `${name}: ${path}`);
      const relative = path.slice('/images/projects/gamebuilder/'.length);
      assert.ok(existsSync(new URL(`images/${relative}`, project)), `Missing asset ${path}`);
    }
  }
});

test('characters provides syntactically valid Player and multi-NPC runner examples', () => {
  assert.equal(runnerSources.length, 2);
  for (const source of runnerSources) {
    const result = spawnSync(process.execPath, ['--check', '--input-type=module'], {
      input: source,
      encoding: 'utf8'
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.match(source, /export const gameLevelClasses/);
    assert.match(source, /export \{ GameControl \}/);
  }
});

test('character levels pair distinct data with Player and NPC classes using valid sprite grids', () => {
  class Player {}
  class Npc {}
  class GameEnvBackground {}
  class GameControl {}
  for (const [index, source] of runnerSources.entries()) {
    const definitions = source
      .replace(/^import .+;\s*$/gm, '')
      .replace('export const gameLevelClasses', 'globalThis.gameLevelClasses')
      .replace(/^export \{ GameControl \};\s*$/gm, '');
    const context = { Player, Npc, GameEnvBackground, GameControl };
    vm.runInNewContext(definitions, context);
    const level = new context.gameLevelClasses[0]({ path: '' });
    const players = level.classes.filter((entry) => entry.class === Player);
    const npcs = level.classes.filter((entry) => entry.class === Npc);
    assert.equal(players.length, 1);
    assert.equal(npcs.length, index === 0 ? 0 : 2);
    const characterEntries = [...players, ...npcs];
    assert.equal(new Set(characterEntries.map(({ data }) => data.id)).size, characterEntries.length);
    for (const { data } of characterEntries) {
      assert.ok(data.INIT_POSITION.x >= 0 && data.INIT_POSITION.x <= 1);
      assert.ok(data.INIT_POSITION.y >= 0 && data.INIT_POSITION.y <= 1);
      const relative = data.src.split('/gamebuilder/')[1];
      const sprite = readFileSync(new URL(`images/${relative}`, project));
      const manifest = JSON.parse(readFileSync(new URL('images/sprites/index.json', project), 'utf8'));
      const asset = manifest.find((entry) => `sprites/${entry.src}` === relative);
      assert.ok(asset, `Missing sprite manifest entry for ${relative}`);
      assert.equal(data.orientation.rows, asset.rows);
      assert.equal(data.orientation.columns, asset.cols);
      if (asset.src === 'chillguy.png') {
        assert.equal(sprite.readUInt32BE(16) / data.orientation.columns, 128);
        assert.equal(sprite.readUInt32BE(20) / data.orientation.rows, 128);
      }
      for (const direction of ['down', 'right', 'left', 'up']) {
        if (!data[direction]) continue;
        assert.ok(data[direction].row < data.orientation.rows);
        assert.ok(data[direction].start + data[direction].columns <= data.orientation.columns);
      }
    }
    for (const { data } of npcs) {
      assert.ok(data.greeting.length > 0);
      let greeted = false;
      data.interact.call({ showReactionDialogue() { greeted = true; } });
      assert.equal(greeted, true);
    }
    if (npcs.length > 0) {
      assert.notEqual(npcs[0].data, npcs[1].data);
      assert.notEqual(npcs[0].data.greeting, npcs[1].data.greeting);
    }
  }
});
