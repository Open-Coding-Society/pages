// Live cards for GitHub links in messages: an issue or pull request (title, state, author,
// and a pull request's size and checks), a commit, a repository, or a gist. A card is drawn
// from the link at once and filled in when it scrolls into view.
//
// GitHub's API without a token allows 60 requests an hour for a whole network, and a school
// is one network. So each item is fetched once, kept 10 minutes (here and in localStorage),
// asked for only when its card is on screen, and after a 403 or 429 for the limit nothing
// more is asked until GitHub's reset time. Gists are read through Spring
// (GET /api/grades/read-gist/{id}), which doesn't count against the network's limit.

export const CARD_TEXTS = Object.freeze({
  loading: 'Loading from GitHub…',
  limited: 'GitHub’s hourly limit for this network is used up. Details come back after {time}.',
  missing: 'This is private, or not on GitHub.',
  failed: 'Could not reach GitHub.',
  pull: 'Pull request #{number}',
  issue: 'Issue #{number}',
  open: 'Open',
  closed: 'Closed',
  merged: 'Merged',
  draft: 'Draft',
  notPlanned: 'Not planned',
  checksPassed: 'Checks passed',
  checksFailed: 'Checks failed',
  checksRunning: 'Checks running',
  opened: '{who} opened {when}',
  committed: '{who} committed {when}',
  comments: '{count} comment{plural}',
  files: '{count} file{plural}',
  stars: '★ {count}',
  forks: '{count} fork{plural}',
  openIssues: '{count} open issue{plural}',
  updated: 'updated {when}',
  gist: 'Gist',
});

export const CACHE_MINUTES = 10;
const PREFIX = 'ocs-github:';
const LIMIT_KEY = `${PREFIX}limited-until`;

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const plural = (template, count) => fill(template, { count: Number(count).toLocaleString(), plural: Number(count) === 1 ? '' : 's' });

// GitHub's API from the browser: no credentials (its CORS allows any origin, not cookies).
export async function fetchFromGitHub(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json' } });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  const header = name => response.headers.get(name);
  return {
    status: response.status,
    body,
    headers: { 'x-ratelimit-remaining': header('x-ratelimit-remaining'), 'x-ratelimit-reset': header('x-ratelimit-reset'), 'retry-after': header('retry-after') },
  };
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const KIND_ICONS = { pull: 'fa-code-pull-request', issue: 'fa-circle-dot', commit: 'fa-code-commit', repo: 'fa-book-bookmark', gist: 'fa-file-code' };

export function createGitHubCards({
  fetchJson = fetchFromGitHub, readGist = null, storage = null, now = Date.now, observe = null, texts = {},
}) {
  const text = { ...CARD_TEXTS, ...texts };
  const memory = new Map(); // path → Promise of { status, body }
  const relative = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(undefined, { numeric: 'always' }) : null;

  function ago(iso) {
    const then = Date.parse(iso);
    if (Number.isNaN(then)) return '';
    const seconds = Math.round((then - now()) / 1000);
    const steps = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, size] of steps) {
      if (Math.abs(seconds) >= size || unit === 'minute') {
        const amount = Math.round(seconds / size);
        return relative ? relative.format(amount, unit) : `${Math.abs(amount)} ${unit}s ago`;
      }
    }
    return '';
  }

  const read = key => {
    try {
      return storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  };
  const write = (key, value) => {
    try {
      storage?.setItem(key, value);
    } catch {
      // Without storage the cache is this page's only.
    }
  };

  const limitedUntil = () => Number(read(LIMIT_KEY) || 0);

  // { status, body } for an API path, from memory, storage or GitHub, in that order.
  function load(path) {
    if (memory.has(path)) return memory.get(path);
    const stored = read(PREFIX + path);
    if (stored) {
      try {
        const { at, status, body } = JSON.parse(stored);
        if (now() - at < CACHE_MINUTES * 60000) {
          const hit = Promise.resolve({ status, body });
          memory.set(path, hit);
          return hit;
        }
      } catch {
        // A damaged entry is fetched again.
      }
    }
    if (limitedUntil() > now()) return Promise.resolve({ status: 'limited' });
    const asked = Promise.resolve(fetchJson(path)).then(answer => {
      // GitHub says so in its rate-limit headers (which its CORS exposes) and in the body.
      const limited = answer.status === 429 || (answer.status === 403 && (answer.headers?.['x-ratelimit-remaining'] === '0'
        || answer.headers?.['retry-after'] || /rate limit/i.test(answer.body?.message || '')));
      if (limited) {
        const reset = Number(answer.headers?.['x-ratelimit-reset']) * 1000 || now() + 15 * 60000;
        write(LIMIT_KEY, String(reset));
        memory.delete(path);
        return { status: 'limited' };
      }
      if (answer.status === 200 || answer.status === 404) {
        write(PREFIX + path, JSON.stringify({ at: now(), status: answer.status, body: answer.body }));
      }
      return { status: answer.status, body: answer.body };
    }, () => {
      memory.delete(path);
      return { status: 'failed' };
    });
    memory.set(path, asked);
    return asked;
  }

  function pill(label, tone) {
    return el('b', `ocs__status-pill ocs__status-pill--${tone}`, label);
  }

  function checksPill(runs) {
    if (!runs?.total_count) return null;
    const list = runs.check_runs || [];
    if (list.some(run => run.status !== 'completed')) return pill(text.checksRunning, 'warn');
    if (list.some(run => ['failure', 'timed_out', 'cancelled', 'action_required'].includes(run.conclusion))) return pill(text.checksFailed, 'bad');
    return pill(text.checksPassed, 'good');
  }

  // The parts of a card: filled in place as the data arrives.
  function shell(link) {
    const card = el('article', 'ocs__link-card');
    card.dataset.kind = link.kind;
    const head = el('div', 'ocs__link-card-head');
    const icon = el('i', `fas ${KIND_ICONS[link.kind]} ocs__link-card-icon`);
    icon.setAttribute('aria-hidden', 'true');
    const source = link.kind === 'gist'
      ? `${text.gist}${link.owner ? ` · ${link.owner}` : ''}`
      : `${link.owner}/${link.repo}${link.number ? ` #${link.number}` : ''}${link.sha ? ` @ ${link.sha.slice(0, 7)}` : ''}`;
    head.append(icon, el('em', 'ocs__link-card-source', source));
    const title = el('a', 'ocs__link-card-title');
    title.href = link.url;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.textContent = link.kind === 'pull' ? fill(text.pull, link)
      : link.kind === 'issue' ? fill(text.issue, link)
        : link.kind === 'commit' ? link.sha.slice(0, 7)
          : link.kind === 'repo' ? link.repo : link.gistId;
    const meta = el('em', 'ocs__link-card-meta', text.loading);
    card.append(head, title, meta);
    return { card, head, title, meta };
  }

  function describe(parts, link, data, checks) {
    const { head, title, meta, card } = parts;
    const details = [];
    if (link.kind === 'pull') {
      title.textContent = data.title;
      const state = data.merged ? [text.merged, 'good'] : data.state === 'closed' ? [text.closed, 'bad'] : data.draft ? [text.draft, 'neutral'] : [text.open, 'good'];
      head.appendChild(pill(...state));
      const checksLabel = checksPill(checks);
      if (checksLabel) head.appendChild(checksLabel);
      details.push(fill(text.opened, { who: data.user?.login || '?', when: ago(data.created_at) }));
      if (data.changed_files !== undefined) {
        details.push(`${plural(text.files, data.changed_files)} +${Number(data.additions || 0).toLocaleString()} −${Number(data.deletions || 0).toLocaleString()}`);
      }
      if (data.comments) details.push(plural(text.comments, data.comments));
    } else if (link.kind === 'issue') {
      title.textContent = data.title;
      const state = data.state === 'open' ? [text.open, 'good'] : data.state_reason === 'not_planned' ? [text.notPlanned, 'neutral'] : [text.closed, 'neutral'];
      head.appendChild(pill(...state));
      details.push(fill(text.opened, { who: data.user?.login || '?', when: ago(data.created_at) }));
      if (data.comments) details.push(plural(text.comments, data.comments));
      (data.labels || []).slice(0, 3).forEach(label => details.push(label.name));
    } else if (link.kind === 'commit') {
      title.textContent = String(data.commit?.message || '').split('\n')[0] || link.sha.slice(0, 7);
      details.push(fill(text.committed, { who: data.author?.login || data.commit?.author?.name || '?', when: ago(data.commit?.author?.date) }));
      if (data.stats) details.push(`+${Number(data.stats.additions || 0).toLocaleString()} −${Number(data.stats.deletions || 0).toLocaleString()}`);
    } else if (link.kind === 'repo') {
      title.textContent = data.full_name || `${link.owner}/${link.repo}`;
      if (data.description) card.insertBefore(el('p', 'ocs__link-card-body', data.description), meta);
      if (data.language) details.push(data.language);
      details.push(fill(text.stars, { count: Number(data.stargazers_count || 0).toLocaleString() }));
      details.push(plural(text.forks, data.forks_count || 0));
      details.push(plural(text.openIssues, data.open_issues_count || 0));
      if (data.pushed_at) details.push(fill(text.updated, { when: ago(data.pushed_at) }));
    } else if (link.kind === 'gist') {
      title.textContent = data.description || link.gistId;
      details.push(Object.keys(data.files || {}).slice(0, 4).join(' · '));
    }
    meta.textContent = details.filter(Boolean).join(' · ');
  }

  async function populate(parts, link) {
    const { meta } = parts;
    if (link.kind === 'gist') {
      if (!readGist) {
        meta.textContent = '';
        return;
      }
      try {
        describe(parts, link, await readGist(link.gistId));
      } catch {
        meta.textContent = text.missing;
      }
      return;
    }
    const base = `/repos/${link.owner}/${link.repo}`;
    const path = link.kind === 'pull' ? `${base}/pulls/${link.number}`
      : link.kind === 'issue' ? `${base}/issues/${link.number}`
        : link.kind === 'commit' ? `${base}/commits/${link.sha}` : base;
    const answer = await load(path);
    if (answer.status === 'limited') {
      const until = new Date(limitedUntil());
      meta.textContent = fill(text.limited, { time: until.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) });
      return;
    }
    if (answer.status === 404 || answer.status === 403) {
      meta.textContent = text.missing;
      return;
    }
    if (answer.status !== 200 || !answer.body) {
      meta.textContent = text.failed;
      return;
    }
    // An open pull request's checks are one more request, so only for those still open.
    let checks = null;
    if (link.kind === 'pull' && answer.body.state === 'open' && answer.body.head?.sha) {
      const runs = await load(`${base}/commits/${answer.body.head.sha}/check-runs?per_page=100`);
      if (runs.status === 200) checks = runs.body;
    }
    describe(parts, link, answer.body, checks);
  }

  // Loads a card when it first scrolls near the screen; at once where that can't be watched.
  let watcher = null;
  const waiting = new Map();
  function whenVisible(element, onVisible) {
    if (observe) {
      observe(element, onVisible);
      return;
    }
    if (typeof IntersectionObserver !== 'function') {
      onVisible();
      return;
    }
    if (!watcher) {
      watcher = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        watcher.unobserve(entry.target);
        waiting.get(entry.target)?.();
        waiting.delete(entry.target);
      }), { rootMargin: '200px' });
    }
    waiting.set(element, onVisible);
    watcher.observe(element);
  }

  return {
    // A card for a parsed link (github-links.js); it fills itself in once seen.
    render(link) {
      const parts = shell(link);
      whenVisible(parts.card, () => { populate(parts, link); });
      return parts.card;
    },
    destroy() {
      watcher?.disconnect();
      watcher = null;
      waiting.clear();
    },
  };
}
