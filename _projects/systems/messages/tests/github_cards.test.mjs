// GitHub cards: what each kind shows, the cache, the rate limit, and gists through Spring.
import assert from 'node:assert/strict';
import test from 'node:test';

import { installFakeDom, settle } from './fake-dom.mjs';

installFakeDom();
const { createGitHubCards } = await import('../js/github-cards.js');
const { parseGitHubUrl } = await import('../js/github-links.js');

function memoryStorage() {
  const store = new Map();
  return { store, getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)), removeItem: key => store.delete(key) };
}

const NOW = Date.parse('2026-11-18T21:00:00Z');

function makeCards(answers, { storage = memoryStorage(), gist = null } = {}) {
  const asked = [];
  const cards = createGitHubCards({
    fetchJson: async path => {
      asked.push(path);
      const answer = answers[path];
      if (typeof answer === 'function') return answer();
      return answer || { status: 404, body: { message: 'Not Found' }, headers: {} };
    },
    readGist: gist ? async id => gist(id) : null,
    storage,
    now: () => NOW,
    observe: (element, onVisible) => onVisible(),
  });
  return { cards, asked, storage };
}

const ok = body => ({ status: 200, body, headers: {} });
const textOf = node => node.textContent.replace(/\s+/g, ' ').trim();

test('a pull request card shows its title, state, author, size and checks', async () => {
  const { cards, asked } = makeCards({
    '/repos/Open-Coding-Society/pages/pulls/2031': ok({
      title: 'Messages page: full-page redesign', state: 'open', draft: false, merged: false,
      user: { login: 'syowns' }, comments: 4, changed_files: 9, additions: 1200, deletions: 300, head: { sha: 'abc1234' },
      created_at: '2026-11-16T21:00:00Z',
    }),
    '/repos/Open-Coding-Society/pages/commits/abc1234/check-runs?per_page=100': ok({
      total_count: 3, check_runs: [{ status: 'completed', conclusion: 'success' }, { status: 'completed', conclusion: 'success' }, { status: 'completed', conclusion: 'skipped' }],
    }),
  });
  const card = cards.render(parseGitHubUrl('https://github.com/Open-Coding-Society/pages/pull/2031'));
  assert.match(textOf(card), /Open-Coding-Society\/pages #2031/);
  await settle();
  await settle();
  const text = textOf(card);
  assert.match(text, /Messages page: full-page redesign/);
  assert.match(text, /Open/);
  assert.match(text, /syowns opened 2 days ago/);
  assert.match(text, /9 files \+1,200 −300/);
  assert.match(text, /Checks passed/);
  assert.equal(card.querySelector('.ocs__link-card-title').href, 'https://github.com/Open-Coding-Society/pages/pull/2031');
  assert.equal(asked.length, 2);
});

test('merged, draft and closed pull requests and issues get their own pills', async () => {
  const { cards } = makeCards({
    '/repos/a/b/pulls/1': ok({ title: 'Merged one', state: 'closed', merged: true, user: { login: 'x' }, head: { sha: 'aaaaaaa' } }),
    '/repos/a/b/pulls/2': ok({ title: 'Draft one', state: 'open', draft: true, user: { login: 'x' }, head: { sha: 'bbbbbbb' } }),
    '/repos/a/b/issues/3': ok({ title: 'Bug', state: 'closed', state_reason: 'completed', user: { login: 'y' }, comments: 1 }),
    '/repos/a/b/issues/4': ok({ title: 'Idea', state: 'open', user: { login: 'y' }, comments: 0, labels: [{ name: 'enhancement' }] }),
  });
  const render = url => cards.render(parseGitHubUrl(url));
  const merged = render('https://github.com/a/b/pull/1');
  const draft = render('https://github.com/a/b/pull/2');
  const closed = render('https://github.com/a/b/issues/3');
  const open = render('https://github.com/a/b/issues/4');
  await settle();
  await settle();
  const pill = card => card.querySelector('.ocs__status-pill');
  assert.equal(pill(merged).textContent, 'Merged');
  assert.equal(pill(draft).textContent, 'Draft');
  assert.ok(pill(draft).classList.contains('ocs__status-pill--neutral'));
  assert.equal(pill(closed).textContent, 'Closed');
  assert.equal(pill(open).textContent, 'Open');
  assert.match(textOf(open), /enhancement/);
});

test('commits and repositories show what matters about them', async () => {
  const { cards } = makeCards({
    '/repos/a/b/commits/0b82e37': ok({ sha: '0b82e375a', commit: { message: 'Fix the scoreboard\n\nlonger body', author: { name: 'Ada', date: '2026-11-18T19:00:00Z' } }, author: { login: 'ada' }, stats: { additions: 5, deletions: 2 } }),
    '/repos/a/b': ok({ full_name: 'a/b', description: 'Our team site', stargazers_count: 12, forks_count: 3, language: 'JavaScript', open_issues_count: 4, pushed_at: '2026-11-18T20:00:00Z' }),
  });
  const commit = cards.render(parseGitHubUrl('https://github.com/a/b/commit/0b82e37'));
  const repo = cards.render(parseGitHubUrl('https://github.com/a/b'));
  await settle();
  assert.match(textOf(commit), /Fix the scoreboard/);
  assert.doesNotMatch(textOf(commit), /longer body/);
  assert.match(textOf(commit), /ada committed 2 hours ago · \+5 −2/);
  assert.match(textOf(repo), /Our team site/);
  assert.match(textOf(repo), /JavaScript · ★ 12 · 3 forks · 4 open issues/);
});

test('a card is fetched once and kept for ten minutes, here and in storage', async () => {
  const storage = memoryStorage();
  const answers = { '/repos/a/b': ok({ full_name: 'a/b', description: 'x' }) };
  const first = makeCards(answers, { storage });
  first.cards.render(parseGitHubUrl('https://github.com/a/b'));
  first.cards.render(parseGitHubUrl('https://github.com/a/b'));
  await settle();
  assert.equal(first.asked.length, 1);
  const second = makeCards(answers, { storage });
  second.cards.render(parseGitHubUrl('https://github.com/a/b'));
  await settle();
  assert.equal(second.asked.length, 0, 'read from storage');
});

test('after GitHub’s hourly limit, cards stop asking until it resets and say so', async () => {
  const limited = { status: 403, body: { message: 'API rate limit exceeded' }, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String((NOW + 30 * 60000) / 1000) } };
  const { cards, asked } = makeCards({ '/repos/a/b/issues/1': limited });
  const one = cards.render(parseGitHubUrl('https://github.com/a/b/issues/1'));
  await settle();
  assert.match(textOf(one), /GitHub’s hourly limit/);
  const two = cards.render(parseGitHubUrl('https://github.com/a/b/issues/2'));
  await settle();
  assert.equal(asked.length, 1);
  assert.match(textOf(two), /GitHub’s hourly limit/);
});

test('a 403 whose message says rate limit counts as the limit, even without its headers', async () => {
  const { cards } = makeCards({ '/repos/a/b/issues/5': { status: 403, body: { message: 'API rate limit exceeded for 1.2.3.4.' }, headers: {} } });
  const card = cards.render(parseGitHubUrl('https://github.com/a/b/issues/5'));
  await settle();
  assert.match(textOf(card), /GitHub’s hourly limit/);
});

test('a private or missing item says so; a gist is read through Spring', async () => {
  const { cards, asked } = makeCards({}, {
    gist: id => ({ description: 'Scoreboard helper', files: { 'score.py': { content: 'a\nb\nc' }, 'README.md': { content: '#' } } }),
  });
  const missing = cards.render(parseGitHubUrl('https://github.com/a/private/issues/9'));
  const gist = cards.render(parseGitHubUrl('https://gist.github.com/ada/aa11bb22cc33'));
  await settle();
  assert.match(textOf(missing), /private, or not on GitHub/);
  assert.match(textOf(gist), /Scoreboard helper/);
  assert.match(textOf(gist), /score\.py · README\.md/);
  assert.ok(!asked.some(path => path.includes('gists')), 'no GitHub request for a gist');
});

// ── Cards and More in the log ────────────────────────────────────────────────────────
const { createMessageLog } = await import('../js/message-log.js');
const { fakeEvent } = await import('./fake-dom.mjs');

test('the log puts link previews under a message, and its More menu copies or starts an issue', () => {
  const host = document.createElement('div');
  const more = [];
  const asked = [];
  const log = createMessageLog(host, {
    richText: { renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw))); } },
    me: { name: 'Ada' }, onEdit() {}, onDelete() {}, onReply() {},
    linkCards: html => {
      asked.push(html);
      const box = document.createElement('div');
      box.appendChild(document.createElement('article'));
      return box;
    },
    onMore: (action, message) => more.push([action, message.id]),
  });
  log.append({ id: 'm1', key: 'm1', senderKey: 'g', senderName: 'Grace', body: 'PR https://github.com/a/b/pull/1', sentAt: null }, false);
  const row = host.querySelector('[data-key="m1"]');
  assert.equal(row.querySelectorAll('.chat-cards').length, 1);
  assert.deepEqual(asked, ['PR https://github.com/a/b/pull/1']);
  const moreButton = row.querySelectorAll('button').find(button => button.getAttribute('aria-label') === 'More actions');
  moreButton.dispatchEvent(fakeEvent('click'));
  const items = row.querySelectorAll('.ocs__menu-item');
  assert.deepEqual(items.map(item => item.textContent), ['Copy text', 'New GitHub issue']);
  assert.equal(moreButton.getAttribute('aria-expanded'), 'true');
  items[1].dispatchEvent(fakeEvent('click'));
  assert.deepEqual(more, [['issue', 'm1']]);
  assert.equal(row.querySelectorAll('.ocs__menu-item').length, 0, 'picking closes it');
  log.markDeleted('m1');
  assert.equal(row.querySelectorAll('.chat-cards').length, 0);
});
