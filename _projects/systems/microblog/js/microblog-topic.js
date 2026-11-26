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
}
