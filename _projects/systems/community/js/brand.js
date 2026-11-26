// An organization's look, given to the OCS theme engine (assets/js/user-preferences.js) the way
// a member's own theme is. The engine sets --pref-bg-color, --pref-text-color and
// --pref-accent-color and works out the panel, border and muted colors from them, so every
// ocs__ element takes the brand with no stylesheet of its own. preview() shows it on this page
// without saving anything.

const HEX = /^#[0-9a-f]{6}$/i;

/**
 * The brand as a theme, used like Java's Math: Brand.apply(window.SitePreferences, Brand.theme(setup)).
 */
export class Brand {
  /**
   * The setup's brand as the engine's preferences object.
   * @param {{brand: {bg: string, text: string, accent: string, font: string, size: number}}} setup
   * @returns {{bg: string, text: string, accent: string, font: string, size: number}}
   * @throws {TypeError} when a color isn't #rrggbb or the size isn't a number
   */
  static theme(setup) {
    const brand = setup?.brand || {};
    for (const key of ['bg', 'text', 'accent']) {
      if (!HEX.test(String(brand[key] ?? ''))) throw new TypeError(`Brand: ${key} must be a #rrggbb color, not ${JSON.stringify(brand[key])}`);
    }
    const size = Number(brand.size);
    if (!Number.isFinite(size) || size < 10 || size > 24) throw new TypeError('Brand: size must be a font size in pixels');
    return { bg: brand.bg, text: brand.text, accent: brand.accent, font: String(brand.font || ''), size };
  }

  /**
   * Shows a theme on this page through the engine, without saving it.
   * @param {{preview: function(object): void}|undefined} sitePreferences window.SitePreferences
   * @param {object} theme
   * @returns {boolean} false when the page has no theme engine
   */
  static apply(sitePreferences, theme) {
    if (typeof sitePreferences?.preview !== 'function') return false;
    sitePreferences.preview(theme);
    return true;
  }

  /**
   * One of the engine's own presets by name, or null.
   * @param {{PRESETS?: object}|undefined} sitePreferences
   * @param {string} name such as 'Sepia'
   * @returns {object|null}
   */
  static preset(sitePreferences, name) {
    const preset = sitePreferences?.PRESETS?.[name];
    return preset ? { ...preset } : null;
  }
}
