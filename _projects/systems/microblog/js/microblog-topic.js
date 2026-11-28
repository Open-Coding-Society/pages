// A page's Microblog discussion is filed under a topic named by the page's path, and Flask finds
// that topic by a key it makes from the path. This is the one copy of Flask's
// Topic._generate_page_key (model/microblog.py) in Pages, so every page that reads a topic gets
// the key Flask made when the first post created it. It also holds the rules for showing a post
// on a public page (first names only, Flask's times read as UTC), so pages that list a topic's
// posts (Events, the UI Builder's feedback block) show them the same way.

/** A page topic in the Flask Microblog. */
export class MicroblogTopic {
  /** How long a read waits for Flask before it gives up, in milliseconds. */
  static TIMEOUT_MS = 15000;

  /**
   * The key Flask makes from a topic path: no slashes at the ends, every other character that
   * isn't a letter, digit, "-" or "_" turned into "_", runs of "_" made one, and at most 100
   * characters with no "_" at either end.
   * @param {string} path - a topic path, like "/events/community-technology-workshop/"
   * @returns {string} the key, like "events_community-technology-workshop"
   */
  static pageKey(path) {
    return String(path).replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 100).replace(/^_+|_+$/g, '');
  }

  /**
   * The topic's newest posts, from Flask's public GET /api/microblog/page/<key>, which anyone can
   * read, signed out too. Flask answers 404 until the first post makes the topic, so a 404 is
   * "no posts yet" (missing), not a failure.
   * @param {{pythonURI: string, fetchOptions?: object, path: string, limit: number, fetch?: Function,
   *   timeoutMs?: number}} options
   *   path is the topic path (the page's permalink); fetch defaults to the browser's; the read gives
   *   up after timeoutMs (MicroblogTopic.TIMEOUT_MS)
   * @returns {Promise<{posts: object[], missing: boolean}>} posts newest first, as Flask sends them
   * @throws {Error} when Flask answers anything else, doesn't answer, or takes too long
   */
  static async latest({ pythonURI, fetchOptions = {}, path, limit, fetch, timeoutMs = MicroblogTopic.TIMEOUT_MS }) {
    // Called through a wrapper: the browser's fetch refuses to run as a method of another object.
    const send = typeof fetch === 'function' ? fetch : (...args) => globalThis.fetch(...args);
    const base = String(pythonURI || '').replace(/\/+$/, '');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await send(`${base}/api/microblog/page/${MicroblogTopic.pageKey(path)}?limit=${limit}`, {
        ...fetchOptions, method: 'GET', signal: controller.signal,
      });
      if (response.status === 404) return { posts: [], missing: true };
      if (!response.ok) throw new Error(`The Microblog answered ${response.status} for ${path}`);
      const body = await response.json();
      const posts = body && Array.isArray(body.microblogs) ? body.microblogs : [];
      return { posts: posts.filter((post) => post !== null && typeof post === 'object' && !Array.isArray(post)), missing: false };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * A post's time. Flask writes UTC without a zone; without the Z, Date would read it as local time.
   * @param {string} value - like "2027-03-01T17:00:00"
   * @returns {Date|null} null when it isn't a time
   */
  static timeOf(value) {
    if (typeof value !== 'string' || !value) return null;
    const date = new Date(/(?:[zZ]|[+-]\d\d:?\d\d)$/.test(value) ? value : `${value}Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  /**
   * A post's time in the visitor's own words, like "Mar 1, 9:00 AM".
   * @param {Date} date - from MicroblogTopic.timeOf
   * @returns {string}
   */
  static timeLabel(date) {
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  /**
   * A writer's first name: visitors on public pages see who wrote, not their full name.
   * @param {string} userName - the post's userName, as Flask sends it
   * @returns {string} the first word, or "" when there is none (the page says "someone" its own way)
   */
  static firstName(userName) {
    return typeof userName === 'string' ? userName.trim().split(/\s+/)[0] : '';
  }
}
