// The words a Community page shows, looked up by dotted key ("groups.muted") in the table
// the page renders from data/texts.yml and the organization's setup file. The code holds no
// visible words of its own, so another organization rewords the system in YAML.

/**
 * Words by key, with {slot}s filled in.
 */
export class Texts {
  /**
   * @param {object} table nested words, as data/texts.yml has them
   */
  constructor(table) {
    if (table === null || typeof table !== 'object' || Array.isArray(table)) {
      throw new TypeError('Texts: the table must be an object of words');
    }
    this.table = table;
  }

  /**
   * The words at a dotted key, or undefined when there are none.
   * @param {string} key such as "groups.muted"
   * @returns {string|undefined}
   */
  lookup(key) {
    const found = String(key).split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), this.table);
    return typeof found === 'string' ? found : undefined;
  }

  /**
   * Whether the table has words at this key.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.lookup(key) !== undefined;
  }

  /**
   * The words at a key with each {slot} filled from values. A slot with no value stays as
   * written, so a missing value shows instead of vanishing.
   * @param {string} key
   * @param {object} values
   * @returns {string}
   * @throws {Error} when the table has no words at the key, so a typo fails loudly
   */
  say(key, values = {}) {
    const words = this.lookup(key);
    if (words === undefined) throw new Error(`Community: no text "${key}"`);
    return Texts.fill(words, values);
  }

  /**
   * The words for a refused request: errors.<reason> when the table has them (a server's
   * RuleError carries the reason), or the fallback key's.
   * @param {{reason?: string}} error
   * @param {string} fallbackKey
   * @param {object} values
   * @returns {string}
   */
  refusal(error, fallbackKey, values = {}) {
    const key = `errors.${error?.reason}`;
    return this.has(key) ? this.say(key, values) : this.say(fallbackKey, values);
  }

  /**
   * Fills a template's {slot}s.
   * @param {string} template
   * @param {object} values
   * @returns {string}
   */
  static fill(template, values = {}) {
    return String(template).replace(/\{(\w+)\}/g, (slot, name) => (Object.hasOwn(values, name) ? String(values[name]) : slot));
  }
}
