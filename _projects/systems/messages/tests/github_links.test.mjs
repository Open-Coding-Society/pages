import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GitHubLinks } from '../js/github-links.js';

test('parseGitHubUrl knows issues, pull requests, commits, repos and gists', () => {
  assert.deepEqual(GitHubLinks.parse('https://github.com/Open-Coding-Society/pages/pull/2031'), {
    kind: 'pull', owner: 'Open-Coding-Society', repo: 'pages', number: 2031, url: 'https://github.com/Open-Coding-Society/pages/pull/2031',
  });
  assert.equal(GitHubLinks.parse('https://github.com/a/b/issues/7#issuecomment-1').kind, 'issue');
  assert.deepEqual(GitHubLinks.parse('https://github.com/a/b/commit/0b82e375a1').sha, '0b82e375a1');
  assert.equal(GitHubLinks.parse('https://github.com/a/b/pull/3/files').kind, 'pull');
  assert.deepEqual(GitHubLinks.parse('https://github.com/Open-Coding-Society/pages'), {
    kind: 'repo', owner: 'Open-Coding-Society', repo: 'pages', url: 'https://github.com/Open-Coding-Society/pages',
  });
  assert.equal(GitHubLinks.parse('https://gist.github.com/adalovelace/aa11bb22cc33').gistId, 'aa11bb22cc33');
  ['https://github.com/settings', 'https://github.com/orgs/x/projects/1', 'https://example.com/a/b', 'https://github.com/a/b/issues/x', 'nope']
    .forEach(url => assert.equal(GitHubLinks.parse(url), null, url));
});

test('findGitHubLinks takes the first three distinct GitHub links in a body', () => {
  const body = 'see https://github.com/a/b/pull/1 and https://github.com/a/b/pull/1, https://github.com/a/b/issues/2. '
    + 'https://github.com/a/b https://github.com/c/d/commit/abc1234 https://example.com';
  assert.deepEqual(GitHubLinks.find(body).map(link => link.url), [
    'https://github.com/a/b/pull/1', 'https://github.com/a/b/issues/2', 'https://github.com/a/b',
  ]);
});

test('githubUrlFor turns what follows a command into a link, and remembers no guess', () => {
  assert.equal(GitHubLinks.urlFor('issue', 'Open-Coding-Society/pages#2031'), 'https://github.com/Open-Coding-Society/pages/issues/2031');
  assert.equal(GitHubLinks.urlFor('pr', 'a/b#12'), 'https://github.com/a/b/pull/12');
  assert.equal(GitHubLinks.urlFor('pr', '12', 'a/b'), 'https://github.com/a/b/pull/12');
  assert.equal(GitHubLinks.urlFor('commit', 'a/b@0b82e37'), 'https://github.com/a/b/commit/0b82e37');
  assert.equal(GitHubLinks.urlFor('repo', 'a/b'), 'https://github.com/a/b');
  assert.equal(GitHubLinks.urlFor('issue', 'https://github.com/a/b/issues/9'), 'https://github.com/a/b/issues/9');
  assert.equal(GitHubLinks.urlFor('issue', '12'), null, 'no repo to put it in');
  assert.equal(GitHubLinks.urlFor('issue', 'a b c'), null);
});

test('newIssueUrl fills GitHub’s new-issue form', () => {
  const url = new URL(GitHubLinks.newIssueUrl('a/b', { title: 'Scoreboard bug', body: 'Steps & more' }));
  assert.equal(url.origin + url.pathname, 'https://github.com/a/b/issues/new');
  assert.equal(url.searchParams.get('title'), 'Scoreboard bug');
  assert.equal(url.searchParams.get('body'), 'Steps & more');
  assert.equal(GitHubLinks.newIssueUrl('not a repo', { title: 'x' }), null);
});

test('a link right before an HTML entity still reads: a space typed after it is saved as &nbsp;', () => {
  const urls = body => GitHubLinks.find(body).map(link => link.url);
  assert.deepEqual(urls('look https://github.com/o/r/pull/3&nbsp;'), ['https://github.com/o/r/pull/3']);
  assert.deepEqual(urls('&lt;https://github.com/o/r/issues/4&gt;'), ['https://github.com/o/r/issues/4']);
  assert.deepEqual(urls('https://github.com/o/r/pull/5?w=1&amp;x=2'), ['https://github.com/o/r/pull/5']);
});
