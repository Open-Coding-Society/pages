// The grammar's shared pieces: the surface, accent-tint and kicker mixins in mixins/_panel.scss,
// and the elements built from them. These rules keep every stylesheet compiling (Ruby Sass
// itself runs only in the Jekyll build) and keep repeated comments out of the site's CSS.
// Run: node --test tests/grammar_surfaces.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const MIXINS = ['surface', 'accent-tint', 'kicker'];

test('_panel.scss defines the shared mixins and writes no CSS comments', () => {
  const panel = read('_sass/open-coding/mixins/_panel.scss');
  MIXINS.forEach((name) => assert.match(panel, new RegExp(`@mixin ${name}\\(`), `@mixin ${name}`));
  // It is imported in many files, and a /* */ comment would be written into the CSS once per import.
  assert.doesNotMatch(panel, /\/\*/);
  assert.match(read('_sass/open-coding/mixins/_variables.scss'), /^\$radius-pill: 999px;/m);
});

test('the site stylesheet imports the mixins right after the variables, before anything uses them', () => {
  const lines = read('_sass/open-coding/_main.scss').split('\n');
  const at = (start) => lines.findIndex((line) => line.startsWith(start));
  assert.equal(at('@import "mixins/panel"'), at('@import "mixins/variables"') + 1);
  assert.ok(at('@import "mixins/panel"') < at('@import "projects/all"'));
});

test('_grid.scss imports panel itself, since a project stylesheet compiles it without the site stylesheet', () => {
  assert.match(read('_sass/open-coding/mixins/_grid.scss'), /^@import "panel";$/m);
});

test('the new elements are imported and built from the shared pieces', () => {
  const elements = read('_sass/open-coding/elements/_main.scss');
  const uses = {
    files: ['@include surface', '@include accent-tint', '@extend .ocs__truncate'],
    menus: ['@include surface', '@include accent-tint', '@include kicker', '@extend .ocs__truncate'],
    progress: ['$radius-pill'],
  };
  for (const [name, pieces] of Object.entries(uses)) {
    assert.match(elements, new RegExp(`@import "${name}/main.scss";`), `${name} is imported`);
    const source = read(`_sass/open-coding/elements/${name}/_main.scss`);
    pieces.forEach((piece) => assert.ok(source.includes(piece), `${name} uses ${piece}`));
  }
  const cards = read('_sass/open-coding/elements/capstone/_main.scss');
  ['.ocs__card {\n  @include surface', '.ocs__nav-card {\n  @include surface', '.ocs__nav-card--compact {'].forEach((rule) => assert.ok(cards.includes(rule), rule));
});

test('the READMEs say what each element reuses and document the mixins', () => {
  const readme = read('_sass/open-coding/README.md');
  const shared = readme.slice(readme.indexOf('### Shared pieces'), readme.indexOf('### Buttons and links'));
  ['ocs__card', 'ocs__nav-card', 'ocs__nav-card--compact', 'ocs__file', 'ocs__menu', 'ocs__progress'].forEach((name) => {
    assert.ok(shared.includes(`\`${name}\``), `Shared pieces lists ${name}`);
  });
  const mixins = read('_sass/open-coding/mixins/README.md');
  MIXINS.forEach((name) => assert.ok(mixins.includes(`### \`@mixin ${name}(`), `mixins README documents ${name}`));
});
