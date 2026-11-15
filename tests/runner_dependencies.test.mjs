import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDependencyBlocks, updateDependencies } from '../assets/js/pages/runners/core/DependencyBlocks.js';

const provider = (name, body) => `/**\n * Description\n * @provides ${name}\n */\n${body}\n/** @end ${name} */`;
const dependency = (name, body) => `/** @dependency ${name} */\n${body}\n/** @end ${name} */`;

test('a documentation header exports only its body, not its tags or test program', () => {
  const source = `${provider('Expertise', 'class Expertise { String label = "}"; }')}\nclass Main {}`;
  const [block] = parseDependencyBlocks(source, 'java');
  assert.equal(block.name, 'Expertise');
  assert.equal(block.kind, 'provides');
  assert.equal(block.language, 'java');
  assert.equal(source.slice(block.bodyStart, block.bodyEnd), 'class Expertise { String label = "}"; }\n');
});

test('Python, pseudocode, HTML and SCSS comment wrappers share the same tags', () => {
  for (const [language, source, body] of [
    ['python', '# @provides Helpers\ndef helper():\n    return 1\n# @end Helpers', 'def helper():\n    return 1\n'],
    ['pseudocode', '// @provides Helpers\nPROCEDURE helper() { RETURN(1) }\n// @end Helpers', 'PROCEDURE helper() { RETURN(1) }\n'],
    ['html', '<!-- @provides Helpers -->\n<section>Hello</section>\n<!-- @end Helpers -->', '<section>Hello</section>\n'],
    ['scss', '/* @provides Helpers */\n$color: red;\n/* @end Helpers */', '$color: red;\n'],
  ]) {
    const [block] = parseDependencyBlocks(source, language);
    assert.equal(source.slice(block.bodyStart, block.bodyEnd), body);
    assert.equal(block.language, language);
  }
});

test('explicit block languages let UI runners share SCSS without sharing arbitrary JavaScript', () => {
  const source = '/* @provides Colors scss */\n$accent: red;\n/* @end Colors */';
  const target = '<!-- @dependency Colors scss -->\n$accent: blue;\n<!-- @end Colors -->';
  const result = updateDependencies(target, 'html', [{ source, language: 'javascript', id: 'ui' }], ['Colors']);
  assert.match(result.code, /\$accent: red;/);
});

test('refreshing two dependencies preserves destination markers, TODOs and executable main', () => {
  const target = `${dependency('Expertise', 'class Expertise {}')}\n${dependency('Mentor', 'class Mentor {}')}\n// TODO: dashboard\nclass Main {}`;
  const sources = [
    { id: 'popcorn', language: 'java', source: provider('Expertise', 'class Expertise { int rank = 2; }') },
    { id: 'mentor', language: 'java', source: `${dependency('Expertise', 'class Expertise { int rank = 99; }')}\n${provider('Mentor', 'class Mentor { int slots = 1; }')}` },
  ];
  const result = updateDependencies(target, 'java', sources, ['Expertise', 'Mentor']);
  assert.match(result.code, /int rank = 2;/);
  assert.doesNotMatch(result.code, /rank = 99/);
  assert.match(result.code, /int slots = 1;/);
  assert.match(result.code, /@dependency Expertise/);
  assert.match(result.code, /\/\/ TODO: dashboard\nclass Main \{\}/);
  assert.equal(parseDependencyBlocks(result.code, 'java').length, 2);
  assert.equal(updateDependencies(result.code, 'java', sources, ['Expertise', 'Mentor']).code, result.code);
});

test('missing, duplicate and incompatible providers reject the entire update', () => {
  const target = `${dependency('Expertise', 'old expertise')}\n${dependency('Mentor', 'old mentor')}`;
  const saved = { id: 'popcorn', source: provider('Expertise', 'new expertise'), language: 'java' };
  assert.throws(() => updateDependencies(target, 'java', [saved], ['Expertise', 'Mentor']), /Mentor.*saved provider/);
  assert.throws(() => updateDependencies(target, 'java', [saved, { ...saved, id: 'duplicate' }], ['Expertise']), /Expertise.*multiple providers/);
  assert.throws(() => updateDependencies(target, 'python', [saved], ['Expertise']), /Expertise.*java.*python/);
});

test('malformed or ambiguous boundaries fail instead of replacing the wrong code', () => {
  for (const source of [
    '/** @provides Expertise */\nclass Expertise {}',
    '/** @provides Expertise */\nclass Expertise {}\n/** @end Mentor */',
    '/** @provides Expertise */\n/** @dependency Mentor */\n/** @end Mentor */\n/** @end Expertise */',
    `${provider('Expertise', 'one')}\n${provider('Expertise', 'two')}`,
  ]) {
    assert.throws(() => parseDependencyBlocks(source, 'java'), /Dependency tags/);
  }
  assert.deepEqual(parseDependencyBlocks('String example = "@provides NotATag";', 'java'), []);
});
