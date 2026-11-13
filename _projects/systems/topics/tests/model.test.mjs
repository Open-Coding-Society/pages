import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { filterGroups, selectedDocuments, readState, writeState, groupedMatches, highlightedParts, resultDetails, wrappableParts, topicGroups, categoryCounts, unitOf, unitGroups, isPractice } from '../js/model.js';

const require = createRequire(import.meta.url);
const lunr = require('../../../../assets/js/vendor/lunr.min.js');
const documents = [
  { url: '/java/', title: 'Arrays', content: 'Binary algorithm', categories: ['java', 'algorithms'] },
  { url: '/python/', title: 'Arrays', content: 'Binary algorithm', categories: ['python', 'algorithms'] },
  { url: '/objects/', title: 'Objects', content: 'Inheritance', categories: ['java'] },
];

const topics = ['java', 'python'];
const any = { primary: topics };
const every = { primary: topics, match: 'and' };

test('boxes in one filter widen the results and the two filters narrow each other', () => {
  assert.equal(selectedDocuments(documents, ['algorithms'], null, any).length, 2);
  assert.deepEqual(selectedDocuments(documents, ['java', 'python'], null, any).map((doc) => doc.url),
    ['/java/', '/python/', '/objects/']);
  assert.deepEqual(selectedDocuments(documents, ['java', 'algorithms'], null, any).map((doc) => doc.url), ['/java/']);
  assert.deepEqual(selectedDocuments(documents, ['java', 'python', 'algorithms'], null, any).map((doc) => doc.url),
    ['/java/', '/python/']);
  assert.equal(selectedDocuments(documents, [], null, any).length, 3);
});

test('two Categories Filter boxes are alternatives too', () => {
  const docs = [
    { url: '/a/', categories: ['java', 'arrays'] },
    { url: '/b/', categories: ['java', 'loops'] },
    { url: '/c/', categories: ['java', 'classes'] },
  ];
  assert.deepEqual(selectedDocuments(docs, ['arrays', 'loops'], null, any).map((doc) => doc.url), ['/a/', '/b/']);
});

test('AND requires every checked topic; categories stay alternatives that narrow', () => {
  const docs = [
    { url: '/both/', categories: ['java', 'python', 'arrays'] },
    { url: '/java/', categories: ['java', 'arrays'] },
    { url: '/python/', categories: ['python', 'loops'] },
  ];
  const urls = (categories, rule) => selectedDocuments(docs, categories, null, rule).map((doc) => doc.url);
  assert.deepEqual(urls(['java', 'python'], any), ['/both/', '/java/', '/python/']);
  assert.deepEqual(urls(['java', 'python'], every), ['/both/']);
  assert.deepEqual(urls(['java'], every), urls(['java'], any));
  assert.deepEqual(urls(['java', 'python', 'arrays', 'loops'], every), ['/both/']);
  assert.deepEqual(urls(['arrays', 'loops'], every), ['/both/', '/java/', '/python/']);
  assert.deepEqual(urls([], every), ['/both/', '/java/', '/python/']);
  assert.deepEqual(filterGroups(['loops', 'java', 'python'], every), [['java'], ['python'], ['loops']]);
  assert.deepEqual(filterGroups(['loops', 'java', 'python'], any), [['java', 'python'], ['loops']]);
});

test('full-text matches cannot escape the selected categories', () => {
  const index = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('content');
    documents.forEach((doc) => this.add(doc));
  });
  const ids = index.search('binary').map((result) => result.ref);
  assert.equal(ids.length, 2);
  assert.deepEqual(selectedDocuments(documents, ['java'], ids, any).map((doc) => doc.url), ['/java/']);
  assert.equal(selectedDocuments(documents, ['java'], index.search('missing').map((result) => result.ref)).length, 0);
});

test('category and query context round trips without interpreting Lunr syntax', () => {
  const state = readState('?category=Java&category=Algorithms&category=Java&q=a%3Ab%20%22x%22&view=cards');
  assert.deepEqual(state.categories, ['java', 'algorithms']);
  assert.deepEqual(readState(`?${writeState(state)}`), state);
  assert.equal(readState('?view=invalid').view, 'list');
});

test('AND is shareable in the URL and OR, the default, is left out', () => {
  const and = readState('?category=java&category=python&match=and');
  assert.equal(and.match, 'and');
  assert.equal(writeState(and), 'category=java&category=python&match=and');
  assert.deepEqual(readState(`?${writeState(and)}`), and);
  assert.equal(readState('?category=java').match, 'or');
  assert.equal(readState('?match=AND').match, 'and');
  assert.equal(readState('?match=all').match, 'or');
  assert.equal(writeState(readState('?category=java&match=or')), 'category=java');
});

test('title cards precede body matches and both respect all category filters', () => {
  const docs = [
    { url: '/title/', title: 'Random Algorithm', content: 'A random algorithm is correct.', categories: ['java', 'algorithms'] },
    { url: '/body/', title: 'Verification', content: 'A random algorithm is correct.', categories: ['java', 'algorithms'] },
    { url: '/other/', title: 'Random Algorithm', content: 'A random algorithm is correct.', categories: ['python', 'algorithms'] },
  ];
  const index = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('content');
    this.metadataWhitelist = ['position'];
    docs.forEach((doc) => this.add(doc));
  });
  const groups = groupedMatches(docs, ['java', 'algorithms'], index.search('algorithm'), any);
  assert.deepEqual(groups.title.map((match) => match.document.url), ['/title/']);
  assert.deepEqual(groups.body.map((match) => match.document.url), ['/body/']);
  assert.deepEqual(highlightedParts(groups.title[0].document.title, groups.title[0].positions)
    .filter((part) => part.highlighted).map((part) => part.text), ['Algorithm']);
  assert.equal(groups.body[0].field, 'content');
  assert.equal(highlightedParts(groups.body[0].document.content, groups.body[0].positions)
    .find((part) => part.highlighted).text, 'algorithm');
  const either = groupedMatches(docs, ['java', 'python'], index.search('algorithm'), any);
  assert.deepEqual([...either.title, ...either.body].map((match) => match.document.url).sort(), ['/body/', '/other/', '/title/']);
  const both = groupedMatches(docs, ['java', 'python'], index.search('algorithm'), every);
  assert.deepEqual([...both.title, ...both.body], []);
});

test('excerpts center on matches and merge overlapping ranges without losing text', () => {
  const text = `${'prefix '.repeat(30)}algorithm${' suffix'.repeat(30)}`;
  const parts = highlightedParts(text, [[210, 9], [210, 9], [215, 4]], true);
  assert.equal(parts[0].text, '…');
  assert.equal(parts.at(-1).text, '…');
  assert.equal(parts.filter((part) => part.highlighted).map((part) => part.text).join(''), 'algorithm');
  assert.ok(parts.map((part) => part.text).join('').length < text.length);
  assert.equal(highlightedParts('<img src=x onerror=alert(1)>', [[0, 4]]).map((part) => part.text).join(''),
    '<img src=x onerror=alert(1)>');
});

test('text results name the source file and list primary subjects first', () => {
  const details = resultDetails({
    url: '/csa/io/', path: '_posts/csa/2025-10-01-text-files.md', labels: ['Files', 'Java'], categories: ['files', 'java'],
  }, ['java', 'sass']);
  assert.equal(details.file, '2025-10-01-text-files.md');
  assert.equal(details.path, '_posts/csa/2025-10-01-text-files.md');
  assert.deepEqual(details.subjects, ['Java', 'Files']);
  assert.equal(resultDetails({ url: '/x/', categories: ['java'] }).file, '/x/');
  assert.equal(resultDetails({ url: '/n/', path: '_posts/2025-09-21-files_IPYNB_2_.md', categories: [] }).file,
    '2025-09-21-files.ipynb');
  assert.equal(resultDetails({
    url: '/q/', path: '_posts/2026-10-13-Quests_Outline_DOCX_.md', source: 'Outline.docx', categories: [],
  }).file, 'Outline.docx');
});

test('long words get break points so a phone-width card never outgrows the screen', () => {
  assert.deepEqual(wrappableParts('Check for another token, then consume it.'), ['Check for another token, then consume it.']);
  for (const text of [
    'see https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-and-exam-description.pdf for details',
    '2025-10-09-developing_procedures_remakers_lesson.ipynb',
    'form 1FAIpQLSepOCmW6KeE7jw4f80JzWq2nVbL9xT3uHcRyDkMgPoA',
  ]) {
    const parts = wrappableParts(text);
    assert.equal(parts.join(''), text);
    assert.ok(parts.length > 1);
    assert.ok(parts.every((part) => part.split(/\s+/).every((word) => word.length <= 20)));
  }
});

test('browsing groups each document once under its first topic, checked topics first', () => {
  const shared = [...documents, { url: '/misc/', title: 'Misc', content: '', categories: ['algorithms'] }];
  const summary = (groups) => groups.map((group) => [group.key, group.documents.map((doc) => doc.url)]);
  assert.deepEqual(summary(topicGroups(shared, [], topics)),
    [['java', ['/java/', '/objects/']], ['python', ['/python/']], ['other', ['/misc/']]]);
  assert.deepEqual(summary(topicGroups(shared, ['python', 'algorithms'], topics)),
    [['python', ['/python/']], ['other', ['/java/', '/objects/', '/misc/']]]);
  assert.deepEqual(categoryCounts(documents), new Map([['java', 2], ['algorithms', 2], ['python', 1]]));
});

test('lessons group by the unit in their title, with unnumbered lessons last', () => {
  assert.equal(unitOf('1.10 Calling Class Methods'), 1);
  assert.equal(unitOf('Unit 2 Quiz'), 2);
  assert.equal(unitOf('2016 FRQ 3 - 2D Array Operations'), null);
  assert.equal(unitOf('MCQ1 - Unit 1 Quiz'), 1);
  assert.ok(isPractice('Unit 2 FRQ Practice') && isPractice('MCQ1 - Unit 1 Quiz'));
  assert.ok(!isPractice('2.08 for Loops'));
  const lessons = ['Arrays', '3.10 Lists', 'Unit 3 Quiz', '1.10 Math', '1.02 Variables'].map((title) => ({ title }));
  assert.deepEqual(unitGroups(lessons).map((group) => [group.unit, group.documents.map((doc) => doc.title)]),
    [[1, ['1.02 Variables', '1.10 Math']], [3, ['3.10 Lists', 'Unit 3 Quiz']], [null, ['Arrays']]]);
  const [, unit3] = unitGroups(lessons);
  assert.deepEqual([unit3.lessons.map((doc) => doc.title), unit3.practice.map((doc) => doc.title)],
    [['3.10 Lists'], ['Unit 3 Quiz']]);
});
