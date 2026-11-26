// slackToHtml on the calendar page turns an event description's Slack-style text (*bold*,
// `code`, <url|text> links) into HTML. The page's script is inline in index.md, so this reads
// slackToHtml and its escapeHtml out of the page and runs them exactly as they are there.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('../index.md', import.meta.url), 'utf8');

// The source of a function: `opening` matches its first line up to the body's `{`.
function source(opening) {
  const match = page.match(opening);
  assert.ok(match, `index.md has no ${opening}`);
  let depth = 0;
  for (let i = match.index + match[0].length - 1; i < page.length; i += 1) {
    if (page[i] === '{') depth += 1;
    if (page[i] === '}') depth -= 1;
    if (depth === 0) return page.slice(match.index, i + 1);
  }
  throw new Error(`index.md: ${opening} never closes`);
}

const slackToHtml = new Function(
  `${source(/function escapeHtml\(s\) \{/)}\n${source(/function slackToHtml\(text\) \{/)}\nreturn slackToHtml;`,
)();
const link = (url, text = url) => `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;

test('Slack links become links, with or without their own text', () => {
  assert.equal(slackToHtml('Read <https://a.b/c|the rubric> first'), `Read ${link('https://a.b/c', 'the rubric')} first`);
  assert.equal(slackToHtml('<https://a.b/c>'), link('https://a.b/c'));
  assert.equal(slackToHtml('<mailto:t@a.b|Email me>'), link('mailto:t@a.b', 'Email me'));
});

test('bold, italics, strike-through, code and line breaks still work', () => {
  assert.equal(slackToHtml('*Bring* _notes_ ~pens~'), '<strong>Bring</strong> <em>notes</em> <del>pens</del>');
  assert.equal(slackToHtml('Run `npm test`\n```a < b```'), 'Run <code>npm test</code><br><pre><code>a &lt; b</code></pre>');
});

test('text that only looks a little like a link stays as text', () => {
  assert.equal(slackToHtml('<https://a.b/c'), '<https://a.b/c');
  assert.equal(slackToHtml('a <b> c'), 'a <b> c');
});

test('a link that never closes ends at the next "<"', () => {
  assert.equal(slackToHtml('<http:a <https://b.c|x>'), `<http:a ${link('https://b.c', 'x')}`);
});

test('a description with many links that never close is read fast', () => {
  // Any signed-in account can write a description, and the page turns it into HTML when you
  // open the event. Main's link pattern scanned to the end from every "<http:": this took
  // over a second.
  const text = '<http:a'.repeat(15000) + 'x';
  const started = performance.now();
  assert.equal(slackToHtml(text), text);
  assert.ok(performance.now() - started < 200, `took ${Math.round(performance.now() - started)} ms`);
});
