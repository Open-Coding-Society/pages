import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const gridStyles = await readFile(
  new URL('../_sass/open-coding/elements/grids/_main.scss', import.meta.url),
  'utf8'
);
const capstonePage = await readFile(
  new URL('../_projects/systems/capstone/_includes/capstone-browser.html', import.meta.url),
  'utf8'
);

test('capstone card title links underline when the card is hovered or focused', () => {
  assert.match(gridStyles, /\.ocs__grid-cell:hover\s+h3\s*>\s*a/);
  assert.match(gridStyles, /\.ocs__grid-cell:focus-within\s+h3\s*>\s*a/);
  assert.match(gridStyles, /h3\s*>\s*a:hover/);
  assert.match(gridStyles, /h3\s*>\s*a:focus-visible/);
  assert.match(gridStyles, /text-decoration:\s*underline/);
});

test('Toolchain Trail title is inside a repository-relative link', () => {
  assert.match(
    capstonePage,
    /<h3><a href="\{\{ project\.url \| relative_url \}\}">\{\{ project\.title \| escape \}\}<\/a><\/h3>/
  );
});
