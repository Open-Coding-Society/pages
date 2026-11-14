import test from 'node:test';
import assert from 'node:assert/strict';
import { readerContext, readerLink, courseWeeks } from '../_projects/systems/courses/reader/js/model.js';

const membership = { csp: { week: 0 }, csse: { week: 1 } };

test('plain links keep their default course; shareable links select only real memberships', () => {
  assert.deepEqual(readerContext('', membership, 'csp'), { course: 'csp', issue: '' });
  assert.deepEqual(readerContext('?context=course&course=csse', membership, 'csp'), { course: 'csse', issue: '' });
  assert.deepEqual(readerContext('?context=topics', membership, 'csp'), { course: null, issue: '' });
  assert.deepEqual(readerContext('', {}, ''), { course: null, issue: '' });
  for (const search of ['?context=wrong', '?context=course&course=csa']) {
    const state = readerContext(search, membership, 'csp');
    assert.equal(state.course, 'csp');
    assert.notEqual(state.issue, '');
  }
});

test('all views link to the same original document, under a configured baseurl', () => {
  const path = '/javascript/intro';
  for (const course of ['csp', 'csse', null]) {
    const url = new URL(readerLink(path, '/preview', { course }, 'category=javascript&q=object+literal&match=and'), 'https://ocs.example');
    assert.equal(url.pathname, '/preview/javascript/intro');
    assert.equal(url.searchParams.get('context'), course ? 'course' : 'topics');
    assert.equal(url.searchParams.get('course'), course);
    assert.equal(url.searchParams.get('q'), 'object literal');
    assert.equal(url.searchParams.get('match'), 'and');
  }
});

test('course cadence uses each placement without duplicating document identity', () => {
  const documents = [
    { url: '/shared', title: 'Lesson 2', courses: membership },
    { url: '/later', title: 'Lesson 10', courses: { csp: { week: '0' } } },
    { url: '/elsewhere', title: 'Different course', courses: { csa: { week: 3 } } },
  ];
  assert.deepEqual(courseWeeks(documents, 'csse').map(group => [group.week, group.lessons.map(doc => doc.url)]),
    [[1, ['/shared']]]);
  assert.deepEqual(courseWeeks(documents, 'csp').map(group => [group.week, group.lessons.map(doc => doc.url)]),
    [[0, ['/shared', '/later']]]);
  assert.equal(documents[0].url, '/shared');
});
