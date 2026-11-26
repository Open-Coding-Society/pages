// A page's Microblog discussion is filed under a topic named by the page's path, and Flask finds
// that topic by a key it makes from the path. This is the one copy of Flask's
// Topic._generate_page_key (model/microblog.py) in Pages, so every page that reads a topic gets
// the key Flask made when the first post created it.

/** A page topic in the Flask Microblog. */
export class MicroblogTopic {
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
   * @param {{pythonURI: string, fetchOptions?: object, path: string, limit: number, fetch?: Function}} options
   *   path is the topic path (the page's permalink); fetch defaults to the browser's
   * @returns {Promise<{posts: object[], missing: boolean}>} posts newest first, as Flask sends them
   * @throws {Error} when Flask answers anything else, or doesn't answer
   */
  static async latest({ pythonURI, fetchOptions = {}, path, limit, fetch }) {
    // Called through a wrapper: the browser's fetch refuses to run as a method of another object.
    const send = typeof fetch === 'function' ? fetch : (...args) => globalThis.fetch(...args);
    const base = String(pythonURI || '').replace(/\/+$/, '');
    const response = await send(`${base}/api/microblog/page/${MicroblogTopic.pageKey(path)}?limit=${limit}`, { ...fetchOptions, method: 'GET' });
    if (response.status === 404) return { posts: [], missing: true };
    if (!response.ok) throw new Error(`The Microblog answered ${response.status} for ${path}`);
    const body = await response.json();
    const posts = body && Array.isArray(body.microblogs) ? body.microblogs : [];
    return { posts: posts.filter((post) => post !== null && typeof post === 'object' && !Array.isArray(post)), missing: false };
  }
}
