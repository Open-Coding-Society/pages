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

  #fetchJson;
  #readGist;
  #storage;
  #now;
  #memory = new Map(); // path → Promise of { status, body }

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
    return Number(this.#read(LIMIT_KEY) || 0);
  }

  /**
   * An API path's answer, from this page, from storage or from GitHub, in that order.
   * @param {string} path like "/repos/owner/repo"
   * @returns {Promise<{status: number|string, body?: object}>} status is GitHub's, or
   *   'limited' while the hourly limit is used up, or 'failed' when GitHub couldn't be reached
   */
  load(path) {
    const memory = this.#memory;
    if (memory.has(path)) return memory.get(path);
    const stored = this.#read(PREFIX + path);
    if (stored) {
      try {
        const { at, status, body } = JSON.parse(stored);
        if (this.#now() - at < GitHubSource.CACHE_MINUTES * 60000) {
          const hit = Promise.resolve({ status, body });
          memory.set(path, hit);
          return hit;
        }
      } catch {
        // A damaged entry is asked for again.
      }
    }
    if (this.limitedUntil() > this.#now()) return Promise.resolve({ status: 'limited' });
    const asked = Promise.resolve(this.#fetchJson(path)).then(answer => {
      // GitHub says so in its rate-limit headers, which its CORS exposes, and in the body.
      const limited = answer.status === 429 || (answer.status === 403 && (answer.headers?.['x-ratelimit-remaining'] === '0'
        || answer.headers?.['retry-after'] || /rate limit/i.test(answer.body?.message || '')));
      if (limited) {
        const reset = Number(answer.headers?.['x-ratelimit-reset']) * 1000 || this.#now() + 15 * 60000;
        this.#write(LIMIT_KEY, String(reset));
        memory.delete(path);
        return { status: 'limited' };
      }
      if (answer.status === 200 || answer.status === 404) {
        this.#write(PREFIX + path, JSON.stringify({ at: this.#now(), status: answer.status, body: answer.body }));
      }
      return { status: answer.status, body: answer.body };
    }, () => {
      memory.delete(path);
      return { status: 'failed' };
    });
    memory.set(path, asked);
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
