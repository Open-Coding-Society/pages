// Every visible word lives in the registry (data/event_registry.yml). Each Events page writes the
// words its scripts need as JSON (_includes/event-texts-json.html), so no script spells one.

/** The Events registry's words in the browser. */
export class EventTexts {
  /**
   * The words a page wrote for its scripts.
   * @param {Document} document
   * @returns {{lifecycle: object[], catalog: object, viewer: object, discussion: object, page: object|null}}
   * @throws {Error} when the page has no words
   */
  static read(document) {
    const script = document.querySelector('script[data-event-texts]');
    if (!script) throw new Error('Events: this page has no script[data-event-texts] (event-texts-json.html)');
    return JSON.parse(script.textContent);
  }

  /**
   * A registry text with its {name} places filled in; a place with no value stays as written.
   * @param {string} text - like "Page {page} of {pages}"
   * @param {object} values - like {page: 2, pages: 3}
   * @returns {string}
   */
  static fill(text, values) {
    return String(text ?? '').replace(/\{(\w+)\}/g, (place, name) => (Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : place));
  }

  /**
   * Shows a lifecycle stage on a status pill: the stage's word, and its tone as the pill's modifier.
   * @param {HTMLElement} pill - a b.ocs__status-pill
   * @param {object[]} lifecycle - the registry's lifecycle
   * @param {string} key - the stage
   * @returns {boolean} false when the registry has no such stage, and the pill is left alone
   */
  static showStage(pill, lifecycle, key) {
    const stage = lifecycle.find((entry) => entry.key === key);
    if (!pill || !stage) return false;
    pill.textContent = stage.label;
    pill.className = `ocs__status-pill ocs__status-pill--${stage.tone}`;
    return true;
  }
}
