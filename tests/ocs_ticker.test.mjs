// The ocs__ticker grammar element: a bar of short announcements that can scroll sideways.
// These tests read the Sass and the README the way tests/capstone_title_hover.test.mjs does.
// The rules they check come from WCAG 2.2.2 (Pause, Stop, Hide), WCAG 2.4.11 (a focused link
// stays in sight) and the grammar README (no literal colors).
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const elements = await read('_sass/open-coding/elements/_main.scss');
const readme = await read('_sass/open-coding/README.md');
const tickerFiles = ['_main', '_tokens', 'common'];
const ticker = (
  await Promise.all(tickerFiles.map((name) => read(`_sass/open-coding/elements/ticker/${name}.scss`)))
).join('\n');
// Comments explain the rules; only the rules themselves are checked.
const rules = ticker.replace(/\/\/[^\n]*/g, '');
const section = readme.slice(readme.indexOf('### Ticker'), readme.indexOf('## Theme file reference'));
const example = (section.match(/```html\n([\s\S]*?)```/) || [])[1] || '';

// The Sass inside the first `<selector or @media query> { ... }` block whose opening matches.
function block(source, opening) {
  const start = source.search(opening);
  assert.notEqual(start, -1, `no block matching ${opening}`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unclosed block matching ${opening}`);
}

const stillQuery = /@media \(prefers-reduced-motion: reduce\), \(max-width: \$ticker-phone\), \(pointer: coarse\)/;

test('the grammar imports the ticker after the band tokens it paints its surface with', () => {
  const bands = elements.indexOf('@import "bands/main.scss";');
  const tickerImport = elements.indexOf('@import "ticker/main.scss";');
  assert.notEqual(tickerImport, -1, 'elements/_main.scss imports ticker/main.scss');
  assert.ok(bands < tickerImport, 'bands come first, because the ticker uses band-background()');
  assert.match(rules, /\$ticker-look:\s*map-get\(\$band-looks,\s*tint\)/, 'the surface is the tint look');
  assert.match(rules, /background:\s*band-background\(\$ticker-look\)/);
});

test('the ticker writes no literal colors, so every theme preset recolors it', () => {
  assert.doesNotMatch(rules, /#[0-9a-f]{3,8}\b/i, 'no hex colors');
  assert.doesNotMatch(rules, /\b(rgba?|hsla?)\(/i, 'no rgb() or hsl() colors');
  assert.doesNotMatch(rules, /:\s*(white|black)\b/i, 'no named colors');
});

test('page layouts cannot restyle its label and list, because its selectors outrank theirs', () => {
  // A post's `.post-content h2` (and minima's ul and p rules) would otherwise win.
  assert.match(rules, /\.ocs__ticker \.ocs__ticker-label\s*\{[^}]*margin:\s*0/);
  assert.match(rules, /\.ocs__ticker \.ocs__ticker-items\s*\{[^}]*margin:\s*0/);
  assert.match(example, /<p class="ocs__ticker-label" id="[^"]+">/, 'the label is a paragraph, not a heading');
});

test('only a moving ticker animates, and only its transform', () => {
  const keyframes = rules.match(/@keyframes ocs-ticker-scroll\s*\{[\s\S]*?\}\s*\}/);
  assert.ok(keyframes, 'the scroll keyframes exist');
  assert.match(keyframes[0], /transform:\s*translateX\(-50%\)/, 'it slides one list width');
  assert.doesNotMatch(keyframes[0], /\b(left|margin|width|opacity):/, 'nothing but transform moves');
  assert.match(rules, /\.ocs__ticker--moving\s*\{[\s\S]*?animation:\s*ocs-ticker-scroll[^;]*linear infinite/);
  assert.match(rules, /var\(--ocs-ticker-duration,/, 'a script can set the speed through a variable');
});

test('a short list still loops without a gap: each copy is at least as wide as the bar', () => {
  const moving = block(rules, /\.ocs__ticker--moving\s*\{/);
  assert.match(moving, /\.ocs__ticker-viewport\s*\{[^}]*container-type:\s*inline-size/);
  assert.match(moving, /\.ocs__ticker-items\s*\{[^}]*min-width:\s*100cqw/);
});

test('a moving list never makes the bar, or a grid column holding it, wider than the page', () => {
  // container-type: inline-size keeps the sliding list's width out of the bar's own sizing.
  const moving = block(rules, /\.ocs__ticker--moving\s*\{/);
  assert.match(moving, /\.ocs__ticker-viewport\s*\{[^}]*overflow:\s*hidden/);
  assert.match(rules, /@mixin ticker-list-still\s*\{[^}]*container-type:\s*normal/, 'a still list sizes normally');
});

test('touch screens, narrow windows and reduced motion keep even a moving ticker still', () => {
  assert.match(rules, /\$ticker-phone:\s*\$breakpoint-mobile/);
  const still = block(rules, stillQuery);
  assert.match(still, /\.ocs__ticker--moving \.ocs__ticker-viewport\s*\{\s*@include ticker-list-still/);
  assert.match(still, /\.ocs__ticker--moving \.ocs__ticker-switch\s*\{\s*display:\s*none/, 'nothing is left to pause');
  const mixin = block(rules, /@mixin ticker-list-still\s*\{/);
  assert.match(mixin, /animation:\s*none/);
  assert.match(mixin, /flex-wrap:\s*wrap/, 'the announcements wrap instead of sliding');
  assert.match(mixin, /\[aria-hidden="true"\]\s*\{\s*display:\s*none/, 'the loop copy goes away');
});

test('the Pause switch holds a moving ticker still, in a rule of its own', () => {
  assert.match(
    rules,
    /\.ocs__ticker--moving:has\(\.ocs__ticker-switch :checked\)\s+\.ocs__ticker-track\s*\{\s*animation-play-state:\s*paused/
  );
  // One unsupported selector drops a whole selector list, so :has() never shares a rule.
  for (const match of rules.matchAll(/^[^{}\n]*:has\([^{}]*\{/gm)) {
    assert.doesNotMatch(match[0], /,/, `"${match[0].trim()}" shares its rule with another selector`);
  }
});

test('a mouse hover pauses it, but only for real pointers', () => {
  const hover = block(rules, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(hover, /\.ocs__ticker--moving:hover\s+\.ocs__ticker-track\s*\{\s*animation-play-state:\s*paused/);
});

test('keyboard focus on an announcement shows the list still and wrapped, so the link stays in sight', () => {
  assert.match(rules, /\.ocs__ticker--moving \.ocs__ticker-viewport:focus-within\s*\{\s*@include ticker-list-still/);
  // Focus anywhere in the bar would include the Pause switch, which keeps focus after a click
  // and would hold the bar still after it is switched off.
  assert.doesNotMatch(rules, /\.ocs__ticker--moving:focus-within/);
});

test('the copy that closes the loop shows only while the ticker moves', () => {
  assert.match(rules, /\.ocs__ticker \.ocs__ticker-items\s*\{[\s\S]*?&\[aria-hidden="true"\]\s*\{\s*display:\s*none/);
  assert.match(block(rules, /\.ocs__ticker--moving\s*\{/), /\[aria-hidden="true"\]\s*\{\s*display:\s*flex/);
  assert.match(rules, /\.ocs__ticker:not\(\.ocs__ticker--moving\)\s+\.ocs__ticker-switch\s*\{\s*display:\s*none/);
});

test('the README example hides the loop copy from screen readers and the Tab key', () => {
  assert.match(example, /<label class="ocs__toggle ocs__ticker-switch">/, 'the switch is an ocs__toggle');
  const copy = example.match(/<ul class="ocs__ticker-items" aria-hidden="true">([\s\S]*?)<\/ul>/);
  assert.ok(copy, 'the second list is aria-hidden');
  const links = copy[1].match(/<a [^>]*>/g) || [];
  assert.ok(links.length > 0, 'the copy has links');
  for (const link of links) assert.match(link, /tabindex="-1"/, `${link} stays out of the tab order`);
});

test('the README documents every ticker class and the rules for using it', () => {
  for (const name of [
    'ocs__ticker',
    'ocs__ticker-label',
    'ocs__ticker-switch',
    'ocs__ticker-viewport',
    'ocs__ticker-track',
    'ocs__ticker-items',
    'ocs__ticker--moving',
    '--ocs-ticker-duration',
  ]) {
    assert.ok(section.includes(`\`${name}\``), `the README explains ${name}`);
  }
  assert.match(section, /role="alert"/, 'it says not to make the bar an alert');
});
