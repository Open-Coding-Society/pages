/**
 * @module game-templates-tests
 * @description Contracts for the game type list, each type's pictures, and
 * template starter settings.
 * @data Reads the real `game-templates.json` and checks its image paths
 * against the repository's source files.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createListItem, createTemplateImages, createTemplateOptions, validateGameTemplates } from '../js/game-templates.mjs';

const repoRoot = new URL('../../../../', import.meta.url);
const templateData = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const byId = new Map(templateData.map((template) => [template.id, template]));
const imagesFor = (id) => createTemplateImages(byId.get(id));
const groupNames = (id, group) => [...imagesFor(id).get(group).values()].map((image) => image.name);

/** Source file behind a published site path (registered projects publish to /images/projects/<name>/). */
function sourceFileFor(sitePath) {
  const projectImage = sitePath.match(/^\/images\/projects\/([^/]+)\/(.+)$/);
  if (!projectImage) return new URL(`.${sitePath}`, repoRoot);
  const [, project, file] = projectImage;
  for (const category of readdirSync(new URL('_projects/', repoRoot))) {
    const candidate = new URL(`_projects/${category}/${project}/images/${file}`, repoRoot);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

test('the game type list offers RPG, Racing, Platform and Clicker in that order', () => {
  const templates = validateGameTemplates(templateData);
  assert.deepEqual(templates.map((template) => template.name), ['RPG', 'Racing', 'Platform', 'Clicker']);
  assert.equal(templates[0].panel, 'rpg');
});

test('every template picture exists in the repository', () => {
  for (const template of templateData.filter((entry) => entry.assets)) {
    for (const [group, items] of Object.entries(template.assets)) {
      for (const item of items) {
        const source = sourceFileFor(item.src);
        assert.ok(source && existsSync(source), `${template.id}.${group}: ${item.src} is missing`);
      }
    }
  }
});

test('each game type offers only pictures from its own base game', () => {
  assert.deepEqual(groupNames('racing', 'cars'), ['Red Car', 'Blue Car']);
  assert.ok(groupNames('racing', 'tracks').every((name) => /Track|City/.test(name)));
  for (const group of ['tracks', 'cars', 'obstacles']) {
    for (const image of imagesFor('racing').get(group).values()) assert.match(image.src, /^\/images\/projects\/racing-game\//);
  }
  for (const image of imagesFor('platform').get('backgrounds').values()) {
    assert.match(image.src, /^\/images\/platformer\/backgrounds\//);
  }
  assert.deepEqual(groupNames('clicker', 'targets'), ['Cookie', 'Grandma']);
});

test('starter settings use the data defaults and each field\'s first picture', () => {
  const clicker = createTemplateOptions(byId.get('clicker'), imagesFor('clicker'));
  assert.equal(clicker.targetSpriteKey, 'cookie');
  assert.equal(clicker.backgroundColor, '#fef3c7');
  assert.equal(clicker.goalScore, 100);
  assert.deepEqual(clicker.powerUps, []);

  const racing = createTemplateOptions(byId.get('racing'), imagesFor('racing'));
  assert.equal(racing.carSpriteKey, 'red_car');
  assert.equal(racing.backgroundKey, 'tutorial_mud_track');
  assert.equal(racing.laps, 3);

  const platform = createTemplateOptions(byId.get('platform'), imagesFor('platform'));
  assert.equal(platform.playerSpriteKey, 'astronaut');
});

test('only Racing adds the spline barrier panel, and its barriers start empty', () => {
  assert.deepEqual(templateData.filter((template) => template.barriers).map((template) => template.id), ['racing']);
  assert.deepEqual(createTemplateOptions(byId.get('racing'), imagesFor('racing')).barriers, []);
  assert.equal('barriers' in createTemplateOptions(byId.get('platform'), imagesFor('platform')), false);
});

test('new list items get unique ids even after removals, and pictures from their own group', () => {
  const list = byId.get('platform').sections.find((section) => section.list?.id === 'enemies').list;
  const first = createListItem(list, [], imagesFor('platform'));
  assert.equal(first.id, 'enemies-1');
  assert.equal(first.spriteKey, 'alien');
  assert.equal(createListItem(list, [{ id: 'enemies-2' }], imagesFor('platform')).id, 'enemies-3');
});

test('malformed template data is rejected before any panel is drawn', () => {
  const rpg = { id: 'rpg', name: 'RPG', description: '', codeReady: true, panel: 'rpg' };
  const assets = { pics: [{ name: 'A', src: '/images/a.png' }] };
  const withField = (field, templateAssets = assets) => [rpg, {
    id: 'x', name: 'X', description: '', codeReady: false, assets: templateAssets,
    sections: [{ legend: 'A', fields: [field] }]
  }];
  for (const data of [
    [],
    [{ ...rpg, panel: undefined, sections: [] }],
    [rpg, rpg],
    withField({ id: 'n', label: 'N', type: 'number', min: 1, max: 5, step: 1, default: 9 }),
    withField({ id: 'c', label: 'C', type: 'choice', default: 'z', choices: [{ value: 'a', label: 'A' }] }),
    withField({ id: 'f', label: 'F', type: 'sprite' }),
    withField({ id: 'i', label: 'I', type: 'image', assetGroup: 'missing' }),
    withField({ id: 'i', label: 'I', type: 'image', assetGroup: 'pics' }, { pics: [{ name: 'A', src: '../secret.png' }] }),
    withField({ id: 'i', label: 'I', type: 'image', assetGroup: 'pics' }, { pics: [{ name: 'A', src: '//evil.example/a.png' }] }),
    withField({ id: 'i', label: 'I', type: 'image', assetGroup: 'pics' }, { pics: [] }),
    [rpg, { id: 'x', name: 'X', description: '', codeReady: false, assets, sections: [{ legend: 'A' }] }],
    [rpg, { id: 'x', name: 'X', description: '', codeReady: false, barriers: 'yes', assets, sections: [{ legend: 'A', fields: [] }] }]
  ]) {
    assert.throws(() => validateGameTemplates(data), /Invalid game templates/);
  }
});
