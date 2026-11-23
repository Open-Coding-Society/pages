// GitHub's public API, read from the browser for the GitHub cards (and anything else that
// shows GitHub items, such as a call's pull request walkthrough).
//
// Without a token GitHub allows 60 requests an hour for a whole network, and a school is one
// network. So each item is asked for once and kept 10 minutes (on this page and in
// localStorage), and after a 403 or 429 for the limit nothing more is asked until GitHub's
// reset time. Gists are read through Spring (GET /api/grades/read-gist/{id}), which doesn't
// count against the network's limit.

const PREFIX = 'ocs-github:';
const LIMIT_KEY = `${PREFIX}limited-until`;

// GitHub says it hit a limit in its rate-limit headers, which its CORS exposes, and in the body.
const isLimit = answer => answer.status === 429 || (answer.status === 403 && (answer.headers?.['x-ratelimit-remaining'] === '0'
  || answer.headers?.['retry-after'] || /rate limit/i.test(answer.body?.message || '')));

/**
 * GitHub's API with a 10-minute copy and the hourly limit kept.
 */
export class GitHubSource {
  /** How long an item is kept before it's asked for again. */
  static CACHE_MINUTES = 10;

  /**
   * Asks GitHub's API with no credentials: its CORS allows any origin, but not cookies.
   * @param {string} path like "/repos/owner/repo/pulls/12"
   * @returns {Promise<{status: number, body: object|null, headers: object}>} with the rate-limit headers
   */
  static async fetch(path) {
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

  /**
   * The browser's localStorage, or null where it can't be used (a private window, or storage turned off).
   * @returns {Storage|null}
   */
  static browserStorage() {
    try {
      return window.localStorage ?? null;
    } catch {
      return null;
    }
  }

  #fetchJson;
  #readGist;
  #storage;
  #now;
  #memory = new Map(); // path → { at, answer: Promise of { status, body } }
  #limitedUntil = 0; // also kept here, for a browser that can't store it

  /**
   * @param {object} options
   * @param {Function} options.fetchJson fetchJson(path) asks GitHub (GitHubSource.fetch)
   * @param {Function|null} options.readGist readGist(id) reads a gist through Spring; null on
   *   a site without Spring
   * @param {Storage|null} options.storage where the 10-minute copy is kept (localStorage)
   * @param {Function} options.now the time in milliseconds
   */
  constructor({ fetchJson = GitHubSource.fetch, readGist = null, storage = null, now = Date.now } = {}) {
    this.#fetchJson = fetchJson;
    this.#readGist = readGist;
    this.#storage = storage;
    this.#now = now;
  }

  /** Whether gists can be read, which takes Spring. */
  get canReadGists() {
    return Boolean(this.#readGist);
  }

  /**
   * The time GitHub's hourly limit resets, or 0 when it isn't used up.
   * @returns {number} milliseconds
   */
  limitedUntil() {
    return Math.max(this.#limitedUntil, Number(this.#read(LIMIT_KEY) || 0));
  }

  /**
   * An API path's answer, from this page, from storage or from GitHub, in that order.
   * @param {string} path like "/repos/owner/repo"
   * @returns {Promise<{status: number|string, body?: object}>} status is GitHub's, or
   *   'limited' while the hourly limit is used up, or 'failed' when GitHub couldn't be reached
   */
  load(path) {
    const now = this.#now();
    const kept = this.#memory.get(path);
    if (kept && now - kept.at < GitHubSource.CACHE_MINUTES * 60000) return kept.answer;
    this.#memory.delete(path);
    const stored = this.#read(PREFIX + path);
    if (stored) {
      try {
        const { at, status, body } = JSON.parse(stored);
        if (now - at < GitHubSource.CACHE_MINUTES * 60000) {
          const hit = Promise.resolve({ status, body });
          this.#memory.set(path, { at, answer: hit });
          return hit;
        }
      } catch {
        // A damaged entry is asked for again.
      }
    }
    if (this.limitedUntil() > now) return Promise.resolve({ status: 'limited' });
    const asked = Promise.resolve(this.#fetchJson(path)).then(answer => {
      if (isLimit(answer)) {
        this.#limit(answer.headers);
        this.#forget(path, asked);
        return { status: 'limited' };
      }
      if (answer.status === 200 || answer.status === 404) {
        this.#keep(path, { at: this.#now(), status: answer.status, body: answer.body });
      } else {
        // GitHub couldn't answer (a 5xx, say), so the next card asks again.
        this.#forget(path, asked);
      }
      return { status: answer.status, body: answer.body };
    }, () => {
      this.#forget(path, asked);
      return { status: 'failed' };
    });
    this.#memory.set(path, { at: now, answer: asked });
    return asked;
  }

  /**
   * A gist, read through Spring.
   * @param {string} id the gist's id
   * @returns {Promise<object>} GitHub's gist; rejects when it can't be read, or on a site without Spring
   */
  async gist(id) {
    if (!this.#readGist) throw new Error('Gists are read through Spring, and this site has none');
    return this.#readGist(id);
  }

  // A secondary limit says how long to wait in Retry-After; the hourly one says when it resets.
  #limit(headers) {
    const now = this.#now();
    const retryAfter = Number(headers?.['retry-after']);
    const reset = Number(headers?.['x-ratelimit-reset']) * 1000;
    const until = retryAfter > 0 ? now + retryAfter * 1000 : reset > now ? reset : now + 15 * 60000;
    this.#limitedUntil = until;
    this.#write(LIMIT_KEY, String(until));
  }

  // Drops a path's answer from this page, unless a newer request has replaced it.
  #forget(path, answer) {
    if (this.#memory.get(path)?.answer === answer) this.#memory.delete(path);
  }

  // Keeps a copy in storage. Copies older than ten minutes are never read again, so they're
  // removed first: localStorage is shared with the rest of the site (runner code, preferences).
  #keep(path, entry) {
    this.#prune(entry.at);
    this.#write(PREFIX + path, JSON.stringify(entry));
  }

  #prune(now) {
    const storage = this.#storage;
    if (!storage) return;
    try {
      const old = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key?.startsWith(PREFIX) && this.#isOld(key, now)) old.push(key);
      }
      old.forEach(key => storage.removeItem(key));
    } catch {
      // Storage that can't be listed keeps its copies; each is replaced when it's asked for again.
    }
  }

  #isOld(key, now) {
    const value = this.#read(key);
    if (key === LIMIT_KEY) return Number(value || 0) <= now;
    try {
      return now - JSON.parse(value).at >= GitHubSource.CACHE_MINUTES * 60000;
    } catch {
      return true;
    }
  }

  #read(key) {
    try {
      return this.#storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  #write(key, value) {
    try {
      this.#storage?.setItem(key, value);
    } catch {
      // Without storage the copy is this page's only.
    }
  }
}
