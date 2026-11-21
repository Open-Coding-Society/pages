// ============================================
// CalendarSafeHtml.js
// RESPONSIBILITY: Make event text safe to put into the calendar page.
// Any signed-in account can save an event, so its title, description and
// names are someone else's text and must never run as code on this page.
// It does NOT: make API calls, render modals, or touch the DOM.
// ============================================

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };

export class CalendarSafeHtml {
  /**
   * Escape text so it shows as text inside HTML, including inside a quoted attribute.
   * @param {*} text - a title, name or label; null and undefined become ''
   * @returns {string}
   */
  static escape(text) {
    return String(text ?? '').replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
  }

  /**
   * Clean event HTML (a description) with DOMPurify, keeping its formatting and links.
   * When DOMPurify didn't load, the HTML is escaped instead, so it shows as text and never runs.
   * @param {string} html - description HTML as saved or as slackToHtml made it
   * @param {{sanitize: Function}|null} purifier - DOMPurify; the page's own copy by default
   * @returns {string}
   */
  static clean(html, purifier = globalThis.DOMPurify) {
    if (!html) return '';
    // target is kept so description links still open in a new tab.
    if (purifier) return purifier.sanitize(html, { ADD_ATTR: ['target'] });
    return CalendarSafeHtml.escape(html);
  }

  /**
   * The description HTML to save from the editor that clean() filled. Without DOMPurify, clean()
   * put the description in as text, so the editor's text is the description itself; reading its
   * innerHTML would save the escaped form and turn its formatting into visible tags.
   * @param {{innerHTML: string, textContent: string}} editor - the description editor
   * @param {{sanitize: Function}|null} purifier - DOMPurify; the page's own copy by default
   * @returns {string}
   */
  static editorHtml(editor, purifier = globalThis.DOMPurify) {
    return purifier ? editor.innerHTML : editor.textContent;
  }
}
