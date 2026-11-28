// Paging for the /events/ grids, with the grammar's ocs__pager (Earlier and Later), a few cards
// at a time. The page lives in the address (?page= for upcoming events, ?past= for past
// ones), so a link can open it and the browser's Back steps through it.

/** Page numbers for a list of cards shown a few at a time. */
export class EventPager {
  /**
   * How many pages count items fill; nothing still makes one page.
   * @param {number} count
   * @param {number} size - items on a page
   * @returns {number}
   */
  static pages(count, size) {
    return Math.max(1, Math.ceil(count / size));
  }

  /**
   * One page of items. A page past the end becomes the last page, and anything that isn't a
   * whole number of at least 1 becomes page 1.
   * @param {Array} items
   * @param {number} page
   * @param {number} size - items on a page
   * @returns {{page: number, pages: number, items: Array}} the page actually shown and its items
   */
  static slice(items, page, size) {
    const pages = EventPager.pages(items.length, size);
    const shown = Math.min(Number.isInteger(page) && page >= 1 ? page : 1, pages);
    return { page: shown, pages, items: items.slice((shown - 1) * size, shown * size) };
  }

  /**
   * The page an address asks for.
   * @param {string} search - like "?category=workshop&page=2"
   * @param {string} key - "page" or "past"
   * @returns {number} the page, or 1 when the value isn't a whole number of at least 1
   */
  static read(search, key) {
    const value = new URLSearchParams(search).get(key) ?? '';
    return /^\d+$/.test(value) && Number(value) >= 1 ? Number(value) : 1;
  }

  /**
   * An address's query with one page set. Page 1 drops the parameter; every other parameter is kept.
   * @param {string} search
   * @param {string} key - "page" or "past"
   * @param {number} page
   * @returns {string} like "?category=workshop&page=2", or "" when nothing is left
   */
  static write(search, key, page) {
    const params = new URLSearchParams(search);
    if (page > 1) params.set(key, String(page));
    else params.delete(key);
    const query = params.toString();
    return query ? `?${query}` : '';
  }
}
