import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findGitHubLinks, githubUrlFor, newIssueUrl, parseGitHubUrl } from '../js/github-links.js';

test('parseGitHubUrl knows issues, pull requests, commits, repos and gists', () => {
  assert.deepEqual(parseGitHubUrl('https://github.com/Open-Coding-Society/pages/pull/2031'), {
    kind: 'pull', owner: 'Open-Coding-Society', repo: 'pages', number: 2031, url: 'https://github.com/Open-Coding-Society/pages/pull/2031',
  });
  assert.equal(parseGitHubUrl('https://github.com/a/b/issues/7#issuecomment-1').kind, 'issue');
  assert.deepEqual(parseGitHubUrl('https://github.com/a/b/commit/0b82e375a1').sha, '0b82e375a1');
  assert.equal(parseGitHubUrl('https://github.com/a/b/pull/3/files').kind, 'pull');
  assert.deepEqual(parseGitHubUrl('https://github.com/Open-Coding-Society/pages'), {
    kind: 'repo', owner: 'Open-Coding-Society', repo: 'pages', url: 'https://github.com/Open-Coding-Society/pages',
  });
  assert.equal(parseGitHubUrl('https://gist.github.com/adalovelace/aa11bb22cc33').gistId, 'aa11bb22cc33');
  ['https://github.com/settings', 'https://github.com/orgs/x/projects/1', 'https://example.com/a/b', 'https://github.com/a/b/issues/x', 'nope']
    .forEach(url => assert.equal(parseGitHubUrl(url), null, url));
});

test('findGitHubLinks takes the first three distinct GitHub links in a body', () => {
  const body = 'see https://github.com/a/b/pull/1 and https://github.com/a/b/pull/1, https://github.com/a/b/issues/2. '
    + 'https://github.com/a/b https://github.com/c/d/commit/abc1234 https://example.com';
  assert.deepEqual(findGitHubLinks(body).map(link => link.url), [
    'https://github.com/a/b/pull/1', 'https://github.com/a/b/issues/2', 'https://github.com/a/b',
  ]);
});

test('githubUrlFor turns what follows a command into a link, and remembers no guess', () => {
  assert.equal(githubUrlFor('issue', 'Open-Coding-Society/pages#2031'), 'https://github.com/Open-Coding-Society/pages/issues/2031');
  assert.equal(githubUrlFor('pr', 'a/b#12'), 'https://github.com/a/b/pull/12');
  assert.equal(githubUrlFor('pr', '12', 'a/b'), 'https://github.com/a/b/pull/12');
  assert.equal(githubUrlFor('commit', 'a/b@0b82e37'), 'https://github.com/a/b/commit/0b82e37');
  assert.equal(githubUrlFor('repo', 'a/b'), 'https://github.com/a/b');
  assert.equal(githubUrlFor('issue', 'https://github.com/a/b/issues/9'), 'https://github.com/a/b/issues/9');
  assert.equal(githubUrlFor('issue', '12'), null, 'no repo to put it in');
  assert.equal(githubUrlFor('issue', 'a b c'), null);
});

test('newIssueUrl fills GitHub’s new-issue form', () => {
  const url = new URL(newIssueUrl('a/b', { title: 'Scoreboard bug', body: 'Steps & more' }));
  assert.equal(url.origin + url.pathname, 'https://github.com/a/b/issues/new');
  assert.equal(url.searchParams.get('title'), 'Scoreboard bug');
  assert.equal(url.searchParams.get('body'), 'Steps & more');
  assert.equal(newIssueUrl('not a repo', { title: 'x' }), null);
});
