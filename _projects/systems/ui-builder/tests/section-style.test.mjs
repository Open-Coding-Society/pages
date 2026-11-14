// Section styles: a frame's style setting drawn as the grammar's ocs__band.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePage } from '../js/page-model.js';
import { renderPage } from '../js/render.js';
import { contentRenderers } from '../js/blocks-content.js';
import { toHTML } from '../js/vnode.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

const ctxOf = (registry) => ({ registry, mode: 'export', baseurl: '', pageOrigin: 'https://pages.example.com', renderers: contentRenderers });

test('section styles draw the grammar\'s band; plain and unknown styles add nothing', needsRuby, () => {
  const registry = loadRegistry();
  const page = normalizePage({ page: { title: 'T' }, sections: [
    { type: 'stack', settings: { style: 'card' }, cells: [{ blocks: [{ type: 'divider' }] }] },
    { type: 'columns', settings: { layout: 'halves', style: 'outline' }, cells: [{ blocks: [] }, { blocks: [] }] },
    { type: 'stack', settings: { style: 'plain' }, cells: [{ blocks: [] }] },
    { type: 'stack', settings: { style: 'neon' }, cells: [{ blocks: [] }] },
  ] }, registry, { ids: counterIds() });
  assert.equal(page.sections[3].settings.style, 'plain', 'an unknown style becomes the default');
  const html = toHTML(renderPage(page, ctxOf(registry)));
  assert.match(html, /<section class="ocs__stack ocs__band ocs__band--card"/);
  assert.match(html, /<section class="ocs__split ocs__band ocs__band--outline"/);
  assert.equal((html.match(/ocs__band/g) || []).length, 4, 'two bands, each with its look');
  const raw = { ...page, sections: [{ ...page.sections[0], settings: { style: '__proto__' } }] };
  assert.doesNotMatch(toHTML(renderPage(raw, ctxOf(registry))), /ocs__band/);
});

test('every band class a section style draws is explained in the code view', needsRuby, () => {
  const registry = loadRegistry();
  for (const option of registry.frames.stack.fields.find((f) => f.id === 'style').options) {
    if (option.value === 'plain') continue;
    assert.equal(typeof registry.text.code_classes[`ocs__band--${option.value}`], 'string', option.value);
  }
  assert.equal(typeof registry.text.code_classes.ocs__band, 'string');
});
