// Small builders for the Community views' elements, all with OCS grammar classes. Words come
// in as text, never as HTML, so nothing a member typed can turn into markup here; message
// bodies go through rich-text.js's sanitizer instead.

/**
 * Element builders, used like Java's Math: Dom.el('div', 'ocs__card', child).
 */
export class Dom {
  /**
   * An element with a class and children. A string child becomes text; null and false are skipped.
   * @param {string} tag
   * @param {string} className
   * @param {...(Node|string|null|false)} children
   * @returns {HTMLElement}
   */
  static el(tag, className = '', ...children) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Dom.append(element, ...children);
    return element;
  }

  /**
   * Appends children, turning strings into text.
   * @param {HTMLElement} parent
   * @param {...(Node|string|null|false)} children
   * @returns {HTMLElement} the parent
   */
  static append(parent, ...children) {
    children.flat().forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      parent.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return parent;
  }

  /**
   * Sets attributes; null or false leaves one off.
   * @param {HTMLElement} element
   * @param {object} attributes
   * @returns {HTMLElement}
   */
  static attrs(element, attributes) {
    Object.entries(attributes).forEach(([name, value]) => {
      if (value === null || value === undefined || value === false) element.removeAttribute(name);
      else element.setAttribute(name, value === true ? '' : String(value));
    });
    return element;
  }

  /**
   * A Font Awesome icon, hidden from screen readers.
   * @param {string} name such as 'fa-flag'
   * @returns {HTMLElement}
   */
  static icon(name) {
    return Dom.attrs(Dom.el('i', `fas ${name}`), { 'aria-hidden': 'true' });
  }

  /**
   * An ocs__btn with its icon and words straight inside it, as the post layout's Submit button
   * has them: a preset theme recolors span text, which would hide words on a filled button.
   * With an icon, an ocs__btn also gets ocs__btn--icon.
   * @param {string} label
   * @param {{className?: string, icon?: string, onClick?: function, type?: string}} options
   * @returns {HTMLButtonElement}
   */
  static button(label, { className = 'ocs__btn', icon = '', onClick = null, type = 'button' } = {}) {
    // ocs__btn--icon spaces the icon from the words, as on the post layout's Submit buttons.
    const iconClass = icon && /\bocs__btn\b/.test(className) && !/\bocs__btn--icon\b/.test(className) ? ' ocs__btn--icon' : '';
    const button = Dom.el('button', `${className}${iconClass}`);
    button.type = type;
    if (icon) button.append(Dom.icon(icon), ` ${label}`);
    else button.textContent = label;
    if (onClick) button.addEventListener('click', onClick);
    return button;
  }

  /**
   * An ocs__field: a label and its control.
   * @param {string} label
   * @param {HTMLElement} control needs an id
   * @param {string} help optional words under it
   * @returns {HTMLElement}
   */
  static field(label, control, help = '') {
    const tag = Dom.el('label', 'ocs__label', label);
    tag.htmlFor = control.id;
    return Dom.el('div', 'ocs__field', tag, control, help ? Dom.el('small', '', help) : null);
  }

  /**
   * An ocs__status-pill. Tones: good, neutral, warn, bad.
   * @param {string} words
   * @param {string} tone
   * @returns {HTMLElement}
   */
  static pill(words, tone = 'neutral') {
    return Dom.el('span', `ocs__status-pill ocs__status-pill--${tone}`, words);
  }

  /**
   * An avatar with a name's initials, as an abbr so preset themes leave its color alone.
   * @param {string} name
   * @returns {HTMLElement}
   */
  static avatar(name) {
    const initials = String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('');
    return Dom.attrs(Dom.el('abbr', 'ocs__avatar', initials || '?'), { title: name });
  }

  /**
   * Text as safe HTML, for words that go into a body the sanitizer reads.
   * @param {string} text
   * @returns {string}
   */
  static escape(text) {
    return String(text ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[character]));
  }

  /**
   * The part of the /dm thread pane that Messages' createThread uses, with /dm's classes, as
   * conversation-embed.js builds it. The pane's own heading stays hidden: the view shows the
   * title. readOnly leaves out the composer form.
   * @param {{readOnly: boolean, cancel: string, send: string}} options
   * @returns {{section: HTMLElement, elements: object}}
   */
  static threadPane({ readOnly, cancel, send }) {
    const title = Dom.el('h3', 'dm__thread-title');
    const subtitle = Dom.el('small', 'dm__thread-subtitle');
    const head = Dom.el('header', 'dm__thread-head', Dom.el('div', 'dm__thread-heading', title, subtitle));
    head.hidden = true;
    const messages = Dom.attrs(Dom.el('div', 'dm__log'), { role: 'log', 'aria-live': 'polite', tabindex: '0' });
    const formStatus = Dom.attrs(Dom.el('p', 'dm__form-status'), { role: 'alert' });
    formStatus.hidden = true;
    const section = Dom.el('section', 'dm__thread', head, messages);
    const elements = { title, subtitle, messages, formStatus };
    if (!readOnly) {
      const cancelEdit = Dom.button(cancel, { className: 'dm__action dm-cancel-edit' });
      cancelEdit.hidden = true;
      const sendButton = Dom.button(send, { className: 'dm__send', type: 'submit' });
      sendButton.disabled = true;
      const form = Dom.attrs(Dom.el('form', 'dm__composer', cancelEdit, sendButton), { autocomplete: 'off' });
      section.appendChild(form);
      Object.assign(elements, { form, cancelEdit, send: sendButton });
    }
    section.appendChild(formStatus);
    return { section, elements };
  }

  /**
   * A short time, like "Thu, Nov 19, 10:00 AM".
   * @param {string} iso
   * @returns {string}
   */
  static when(iso) {
    return new Date(iso).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}
