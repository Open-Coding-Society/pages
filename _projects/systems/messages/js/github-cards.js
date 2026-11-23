// Live cards for GitHub links in messages: an issue or pull request (title, state, author,
// and a pull request's size and checks), a commit, a repository, or a gist. A card is drawn
// from the link at once and filled in when it scrolls into view, so GitHub is asked only for
// cards someone can see. What it reads comes from a GitHubSource, which keeps the 10-minute
// copy and the network's hourly limit.

import { GitHubLinks } from './github-links.js';

const KIND_ICONS = { pull: 'fa-code-pull-request', issue: 'fa-circle-dot', commit: 'fa-code-commit', repo: 'fa-book-bookmark', gist: 'fa-file-code' };

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const plural = (template, count) => fill(template, { count: Number(count).toLocaleString(), plural: Number(count) === 1 ? '' : 's' });

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * The GitHub cards under messages. A card is the grammar's nav card, compact
 * (elements/capstone): the whole card is the link, its kicker says where it points and holds
 * the status pills, and the details are its text line.
 */
export class GitHubCards {
  /** Their wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
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

  #source;
  #now;
  #observe;
  #text;
  #relative;
  #watcher = null;
  #waiting = new Map();

  /**
   * @param {object} options
   * @param {GitHubSource} options.source what the cards read GitHub through; without Spring
   *   it can't read gists, so a gist's card shows only its link
   * @param {Function} options.now the time in milliseconds, for "2 days ago"
   * @param {Function|null} options.observe observe(element, onVisible) calls onVisible
   *   once the card is near the screen; IntersectionObserver otherwise
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ source, now = Date.now, observe = null, texts = {} }) {
    if (!source || typeof source.load !== 'function') throw new TypeError('GitHubCards needs a GitHubSource to read GitHub through');
    this.#source = source;
    this.#now = now;
    this.#observe = observe;
    this.#text = { ...GitHubCards.TEXTS, ...texts };
    this.#relative = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(undefined, { numeric: 'always' }) : null;
  }

  /**
   * A card for a link; it fills itself in once seen.
   * @param {object} link a GitHubLinks.parse result
   * @returns {HTMLElement} the card
   */
  render(link) {
    const parts = this.#shell(link);
    this.#whenVisible(parts.card, () => { this.#populate(parts, link); });
    return parts.card;
  }

  /**
   * The cards for the GitHub links in a message's text: at most three, in the order they're linked.
   * @param {string} html the message's text
   * @returns {HTMLElement|null} a box of cards, or null when it links nothing on GitHub
   */
  forBody(html) {
    const links = GitHubLinks.find(html);
    if (!links.length) return null;
    const box = el('div');
    links.forEach(link => box.appendChild(this.render(link)));
    return box;
  }

  /** Stops watching for cards scrolling into view. */
  destroy() {
    this.#watcher?.disconnect();
    this.#watcher = null;
    this.#waiting.clear();
  }

  #ago(iso) {
    const then = Date.parse(iso);
    if (Number.isNaN(then)) return '';
    const seconds = Math.round((then - this.#now()) / 1000);
    const steps = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, size] of steps) {
      if (Math.abs(seconds) >= size || unit === 'minute') {
        const amount = Math.round(seconds / size);
        return this.#relative ? this.#relative.format(amount, unit) : `${Math.abs(amount)} ${unit}s ago`;
      }
    }
    return '';
  }

  #pill(label, tone) {
    return el('b', `ocs__status-pill ocs__status-pill--${tone}`, label);
  }

  #checksPill(runs) {
    const text = this.#text;
    if (!runs?.total_count) return null;
    const list = runs.check_runs || [];
    if (list.some(run => run.status !== 'completed')) return this.#pill(text.checksRunning, 'warn');
    if (list.some(run => ['failure', 'timed_out', 'cancelled', 'action_required'].includes(run.conclusion))) return this.#pill(text.checksFailed, 'bad');
    // GitHub sends at most 100 checks at once, and "passed" has to mean all of them.
    if (list.length < runs.total_count) return null;
    return this.#pill(text.checksPassed, 'good');
  }

  // The parts of a card, filled in place as the data arrives.
  #shell(link) {
    const text = this.#text;
    const card = el('a', 'ocs__nav-card ocs__nav-card--compact');
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.dataset.kind = link.kind;
    const head = el('span', 'ocs__nav-card-kicker');
    const icon = el('i', `fas ${KIND_ICONS[link.kind]}`);
    icon.setAttribute('aria-hidden', 'true');
    const source = link.kind === 'gist'
      ? `${text.gist}${link.owner ? ` · ${link.owner}` : ''}`
      : `${link.owner}/${link.repo}${link.number ? ` #${link.number}` : ''}${link.sha ? ` @ ${link.sha.slice(0, 7)}` : ''}`;
    head.append(icon, ` ${source}`);
    const title = el('span', 'ocs__nav-card-title');
    title.textContent = link.kind === 'pull' ? fill(text.pull, link)
      : link.kind === 'issue' ? fill(text.issue, link)
        : link.kind === 'commit' ? link.sha.slice(0, 7)
          : link.kind === 'repo' ? link.repo : link.gistId;
    const meta = el('span', 'ocs__text', text.loading);
    card.append(head, title, meta);
    return { card, head, title, meta };
  }

  #describe(parts, link, data, checks) {
    const text = this.#text;
    const { head, title, meta, card } = parts;
    const details = [];
    if (link.kind === 'pull') {
      title.textContent = data.title;
      const state = data.merged ? [text.merged, 'good'] : data.state === 'closed' ? [text.closed, 'bad'] : data.draft ? [text.draft, 'neutral'] : [text.open, 'good'];
      head.append(' ', this.#pill(...state));
      const checksLabel = this.#checksPill(checks);
      if (checksLabel) head.append(' ', checksLabel);
      details.push(fill(text.opened, { who: data.user?.login || '?', when: this.#ago(data.created_at) }));
      if (data.changed_files !== undefined) {
        details.push(`${plural(text.files, data.changed_files)} +${Number(data.additions || 0).toLocaleString()} −${Number(data.deletions || 0).toLocaleString()}`);
      }
      if (data.comments) details.push(plural(text.comments, data.comments));
    } else if (link.kind === 'issue') {
      title.textContent = data.title;
      const state = data.state === 'open' ? [text.open, 'good'] : data.state_reason === 'not_planned' ? [text.notPlanned, 'neutral'] : [text.closed, 'neutral'];
      head.append(' ', this.#pill(...state));
      details.push(fill(text.opened, { who: data.user?.login || '?', when: this.#ago(data.created_at) }));
      if (data.comments) details.push(plural(text.comments, data.comments));
      (data.labels || []).slice(0, 3).forEach(label => details.push(label.name));
    } else if (link.kind === 'commit') {
      title.textContent = String(data.commit?.message || '').split('\n')[0] || link.sha.slice(0, 7);
      details.push(fill(text.committed, { who: data.author?.login || data.commit?.author?.name || '?', when: this.#ago(data.commit?.author?.date) }));
      if (data.stats) details.push(`+${Number(data.stats.additions || 0).toLocaleString()} −${Number(data.stats.deletions || 0).toLocaleString()}`);
    } else if (link.kind === 'repo') {
      title.textContent = data.full_name || `${link.owner}/${link.repo}`;
      if (data.description) card.insertBefore(el('span', 'ocs__text', data.description), meta);
      if (data.language) details.push(data.language);
      details.push(fill(text.stars, { count: Number(data.stargazers_count || 0).toLocaleString() }));
      details.push(plural(text.forks, data.forks_count || 0));
      details.push(plural(text.openIssues, data.open_issues_count || 0));
      if (data.pushed_at) details.push(fill(text.updated, { when: this.#ago(data.pushed_at) }));
    } else if (link.kind === 'gist') {
      title.textContent = data.description || link.gistId;
      details.push(Object.keys(data.files || {}).slice(0, 4).join(' · '));
    }
    meta.textContent = details.filter(Boolean).join(' · ');
  }

  async #populate(parts, link) {
    const text = this.#text;
    const { meta } = parts;
    if (link.kind === 'gist') {
      if (!this.#source.canReadGists) {
        meta.textContent = '';
        return;
      }
      try {
        this.#describe(parts, link, await this.#source.gist(link.gistId));
      } catch {
        meta.textContent = text.missing;
      }
      return;
    }
    const base = `/repos/${link.owner}/${link.repo}`;
    const path = link.kind === 'pull' ? `${base}/pulls/${link.number}`
      : link.kind === 'issue' ? `${base}/issues/${link.number}`
        : link.kind === 'commit' ? `${base}/commits/${link.sha}` : base;
    const answer = await this.#source.load(path);
    if (answer.status === 'limited') {
      const until = new Date(this.#source.limitedUntil());
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
      const runs = await this.#source.load(`${base}/commits/${answer.body.head.sha}/check-runs?per_page=100`);
      if (runs.status === 200) checks = runs.body;
    }
    this.#describe(parts, link, answer.body, checks);
  }

  // Loads a card when it first scrolls near the screen; at once where that can't be watched.
  #whenVisible(element, onVisible) {
    if (this.#observe) {
      this.#observe(element, onVisible);
      return;
    }
    if (typeof IntersectionObserver !== 'function') {
      onVisible();
      return;
    }
    if (!this.#watcher) {
      this.#watcher = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          this.#watcher.unobserve(entry.target);
          this.#waiting.get(entry.target)?.();
          this.#waiting.delete(entry.target);
        });
        // A card whose message left the page (another conversation opened, or an edit drew it
        // again) never scrolls into view, so it's let go here instead of kept until destroy().
        this.#waiting.forEach((onVisible, element) => {
          if (element.isConnected) return;
          this.#watcher.unobserve(element);
          this.#waiting.delete(element);
        });
      }, { rootMargin: '200px' });
    }
    this.#waiting.set(element, onVisible);
    this.#watcher.observe(element);
  }
}
