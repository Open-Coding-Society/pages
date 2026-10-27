import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const gridStyles = await readFile(
  new URL('../_sass/open-coding/elements/grids/_main.scss', import.meta.url),
  'utf8'
);

test('capstone card title links underline on hover and keyboard focus', () => {
  assert.match(gridStyles, /h3\s*>\s*a:hover/);
  assert.match(gridStyles, /h3\s*>\s*a:focus-visible/);
  assert.match(gridStyles, /text-decoration:\s*underline/);
});
