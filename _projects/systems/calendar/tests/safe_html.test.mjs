// Event text on /student/calendar comes from any signed-in account, so it must never run as
// code. CalendarSafeHtml escapes plain text and cleans HTML with DOMPurify, and when DOMPurify
// didn't load it escapes instead of passing the HTML through.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CalendarSafeHtml } from '../js/CalendarSafeHtml.js';

const ATTACK = '<img src=x onerror=alert(1)>';

// A stand-in for DOMPurify that records what it was asked to clean.
function recordingPurifier(answer) {
  const calls = [];
  return {
    calls,
    sanitize(html, options) {
      calls.push({ html, options });
      return answer;
    },
  };
}

test('escape turns the five HTML characters into entities', () => {
  assert.equal(
    CalendarSafeHtml.escape(`<a title="x" class='y'>Q&A</a>`),
    '&lt;a title=&quot;x&quot; class=&#039;y&#039;&gt;Q&amp;A&lt;/a&gt;'
  );
});

test('escape gives an empty string for a missing value', () => {
  assert.equal(CalendarSafeHtml.escape(null), '');
  assert.equal(CalendarSafeHtml.escape(undefined), '');
  assert.equal(CalendarSafeHtml.escape(3), '3');
});

test('clean hands the HTML to DOMPurify and returns what it gives back', () => {
  const purifier = recordingPurifier('<b>Quiz</b>');
  assert.equal(CalendarSafeHtml.clean(`<b>Quiz</b>${ATTACK}`, purifier), '<b>Quiz</b>');
  assert.equal(purifier.calls.length, 1);
  assert.equal(purifier.calls[0].html, `<b>Quiz</b>${ATTACK}`);
});

test('clean asks DOMPurify to keep link targets, so description links still open in a new tab', () => {
  const purifier = recordingPurifier('');
  CalendarSafeHtml.clean('<a href="https://example.com" target="_blank" rel="noopener">x</a>', purifier);
  assert.deepEqual(purifier.calls[0].options, { ADD_ATTR: ['target'] });
});

test('clean escapes the HTML when DOMPurify did not load, instead of passing it through', () => {
  assert.equal(CalendarSafeHtml.clean(ATTACK, null), '&lt;img src=x onerror=alert(1)&gt;');
});

test('clean gives an empty string for an event with no description', () => {
  const purifier = recordingPurifier('should not be used');
  assert.equal(CalendarSafeHtml.clean('', purifier), '');
  assert.equal(CalendarSafeHtml.clean(null, purifier), '');
  assert.equal(purifier.calls.length, 0);
});

// An element as the browser keeps it: textContent is innerHTML with its tags gone and its
// entities read, which is all the editor needs here.
const editor = (innerHTML) => ({
  innerHTML,
  textContent: innerHTML.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&'),
});

test('saving reads the cleaned description HTML back from the editor', () => {
  const purifier = recordingPurifier('<b>Quiz</b>');
  assert.equal(CalendarSafeHtml.editorHtml(editor(CalendarSafeHtml.clean('<b>Quiz</b>', purifier)), purifier), '<b>Quiz</b>');
});

test('without DOMPurify, saving gives back the description exactly as it was, not its escaped form', () => {
  // Edit showed the description as text, so the editor's text is the description's HTML.
  const shown = editor(CalendarSafeHtml.clean('<b>Quiz</b> &amp; notes', null));
  assert.equal(CalendarSafeHtml.editorHtml(shown, null), '<b>Quiz</b> &amp; notes');
});

/* ── The calendar page ─────────────────────────────────────────────────── */

// The page's script is inline in index.md, so Node can't run it. These checks read it as text
// and hold one rule: event values never reach the page's HTML without CalendarSafeHtml. The
// browser check in the PR shows the same thing on the real page.
const page = await readFile(new URL('../index.md', import.meta.url), 'utf8');

// The source of the first `{ ... }` block that starts where `opening` matches.
function block(source, opening) {
  const start = source.search(opening);
  assert.notEqual(start, -1, `index.md has no ${opening}`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`index.md: ${opening} never closes`);
}

test('the page imports the helper it calls', () => {
  assert.match(
    page,
    /import \{ CalendarSafeHtml \} from '\{\{site\.baseurl\}\}\/assets\/js\/projects\/calendar\/CalendarSafeHtml\.js';/
  );
});

test('an event description reaches the event window only through CalendarSafeHtml.clean', () => {
  const assignments = [...page.matchAll(/getElementById\(["']editDescription["']\)\.innerHTML\s*=\s*([^;]+);/g)]
    .map((match) => match[1].trim());
  const cleaned = assignments.filter((value) => value.startsWith('CalendarSafeHtml.clean('));
  assert.ok(cleaned.length >= 2, 'opening an event and Edit both clean the description');
  for (const value of assignments) {
    assert.ok(value === '""' || value === "''" || value.startsWith('CalendarSafeHtml.clean('), `raw description HTML: ${value}`);
  }
});

test('saving reads the description through CalendarSafeHtml.editorHtml', () => {
  const reads = [...page.matchAll(/getElementById\(["']editDescription["']\)\.innerHTML(?!\s*=[^=])/g)];
  assert.deepEqual(reads.map((match) => match[0]), [], 'no save reads the editor\'s innerHTML directly');
  assert.ok((page.match(/CalendarSafeHtml\.editorHtml\(document\.getElementById\(["']editDescription["']\)\)/g) || []).length >= 2,
    'the event form and Make Break both read it through the helper');
});

test('the month grid escapes every event value it puts into its markup', () => {
  const grid = block(page, /eventContent: function\(arg\) \{/);
  // A string that ends and is followed by + and then anything but an escape call or another string.
  // The spaces sit inside the lookahead so the match can't back off them and slip past it.
  const raw = [...grid.matchAll(/'\s*\+(?!\s*CalendarSafeHtml\.escape\(|\s*')\s*([^\n;]{0,40})/g)].map((match) => match[1]);
  assert.deepEqual(raw, [], 'appointment and issue labels go through CalendarSafeHtml.escape');
});

test('the Issues list and board escape the group names an issue is assigned to', () => {
  // Spring sends back any group value it doesn't recognize as the label, so labels are user text.
  const labels = [...page.matchAll(/class="issue-assigned-groups">[^$<]*\$\{([^}]*)\}/g)].map((match) => match[1].trim());
  assert.ok(labels.length >= 4, 'the list and the board each show assigned groups');
  for (const value of labels) {
    assert.match(value, /^(CalendarSafeHtml\.escape|escapeIssueText)\(|\.map\(\s*\w+\s*=>\s*escapeIssueText\(\w+\)\)/, `raw group label: ${value}`);
  }
});

test('the CS Pathway list escapes event titles and cleans descriptions', () => {
  const list = block(page, /function renderCsPathwayPanel\(\) \{/);
  const values = [...list.matchAll(/\$\{([^}]*)\}/g)].map((match) => match[1].trim());
  assert.ok(values.length > 0, 'the list has a template');
  for (const value of values) {
    assert.match(value, /^CalendarSafeHtml\.(escape|clean)\(/, `raw value in the CS Pathway list: ${value}`);
  }
});
