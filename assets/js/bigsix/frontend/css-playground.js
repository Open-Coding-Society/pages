// ============================================================
//  css-playground.js — OOP class: CSS playground
//  Path: assets/js/bigsix/frontend/css-playground.js
//
//  Owns everything related to the CSS styling step:
//    - Injecting user CSS into the page's dynamic style tag
//    - Scoping the CSS so it only affects the preview box
//    - Resetting to the default CSS
//
//  EXPORTS:
//    CssPlayground  — instantiate and call .init() on DOMContentLoaded
// ============================================================

export class CssPlayground {

  // ── Default CSS shown on first load ──────────────────────────
  #defaultCss = `.box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px 24px;
    border-radius: 12px;
    color: white;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    max-width: 280px;
    margin: 0 auto;
  }
  .box:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(102,126,234,0.4);
  }`;


  // ============================================================
  //  WORKER 1 — #scopeCss
  //  Single responsibility: prefix every .box selector with the
  //  preview container id so user CSS doesn't leak into the page.
  //  Pure function — no DOM access.
  // ============================================================

  /**
   * Scope CSS rules to the preview container so they don't affect
   * the rest of the page.
   *
   * @param {string} css - Raw CSS from the editor
   * @returns {string}   - Scoped CSS string
   */
  #scopeCss(css) {
    // Replace all .box selectors with the scoped version
    return css.replace(/\.box/g, '#cssPreviewBody .box');
  }


  // ============================================================
  //  WORKER 2 — #injectCss
  //  Single responsibility: write a CSS string into the dynamic
  //  <style> tag in the DOM. Only touches #dynamicStyle.
  // ============================================================

  /**
   * Inject a CSS string into the dynamic style element.
   *
   * @param {string} css - CSS to inject
   */
  #injectCss(css) {
    document.getElementById('dynamicStyle').textContent = css;
  }


  // ============================================================
  //  ORCHESTRATOR — init
  //  Wires the Apply and Reset buttons.
  //  Called once on DOMContentLoaded from frontend_lesson.md.
  // ============================================================

  /**
   * Initialise the CSS playground section.
   * Call once on DOMContentLoaded.
   */
  init() {
    const input = document.getElementById('cssInput');

    // Apply the default CSS immediately on load
    this.#injectCss(this.#scopeCss(input.value));

    // Wire Apply button — scope then inject
    document.getElementById('cssApplyBtn').addEventListener('click', () => {
      this.#injectCss(this.#scopeCss(input.value));
    });

    // Wire Reset button — restore default, then apply
    document.getElementById('cssResetBtn').addEventListener('click', () => {
      input.value = this.#defaultCss;
      this.#injectCss(this.#scopeCss(input.value));
    });
  }
}
