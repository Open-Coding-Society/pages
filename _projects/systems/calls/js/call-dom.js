// The few element shapes the call page builds, all from the ocs__ grammar: a page made with these
// needs no stylesheet of its own. Text always goes in as text, never as HTML.
import { CallModel } from './call-model.js';

/** Element builders, used like Java's Math: CallDom.button(...). */
export class CallDom {
  /** An element with a class list, optional text and attributes (data-call="x" names a hook). */
  static el(tag, className = '', { text = null, attrs = {} } = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== null) element.textContent = text;
    Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  }

  /**
   * A button with its label (and an optional Font Awesome icon) directly inside the ocs__btn: a
   * theme preset recolors span text, so the label is never wrapped in one.
   */
  static button(label, className = 'ocs__btn small', { hook = null, icon = null, attrs = {} } = {}) {
    const button = CallDom.el('button', icon ? `${className} ocs__btn--icon` : className, { attrs: { type: 'button', ...attrs } });
    if (hook) button.dataset.call = hook;
    if (icon) button.appendChild(CallDom.el('i', `fas ${icon}`, { attrs: { 'aria-hidden': 'true' } }));
    button.appendChild(document.createTextNode(label));
    return button;
  }

  /**
   * A toggle: the label stays, aria-pressed says whether it is on, and "on" looks filled.
   * icons are [on, off] Font Awesome names.
   */
  static setToggle(button, on, icons = null) {
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.classList.toggle('accent', on);
    button.classList.toggle('fill', on);
    const icon = button.firstChild;
    if (icons && icon?.tagName === 'I') icon.className = `fas ${on ? icons[0] : icons[1]}`;
  }

  /** A link styled as a button. */
  static link(label, href, className = 'ocs__btn accent fill', hook = null) {
    const link = CallDom.el('a', className, { text: label, attrs: { href } });
    if (hook) link.dataset.call = hook;
    return link;
  }

  /** A status pill: tone is good (accent), warn, bad or neutral; none is the plain ring. */
  static pill(text, tone = null) {
    return CallDom.el('b', tone ? `ocs__status-pill ocs__status-pill--${tone}` : 'ocs__status-pill', { text });
  }

  /** A notice in the theme's callout box. */
  static callout(text) {
    return CallDom.el('p', 'ocs__callout', { text, attrs: { role: 'status' } });
  }

  /** A person's initials, with their name in the title, as the grammar's avatar asks. */
  static avatar(name, title = name) {
    return CallDom.el('abbr', 'ocs__avatar', { text: CallModel.initials(name), attrs: { title } });
  }

  /**
   * A 16:9 player for a camera or a screen. playsinline keeps iPhone Safari from opening it full
   * screen; muted lets it start without a click (sound plays from separate audio elements).
   */
  static video(label) {
    const video = CallDom.el('video', 'ocs__embed ocs__embed--video', {
      attrs: { autoplay: '', playsinline: '', muted: '', 'aria-label': label },
    });
    video.muted = true;
    return video;
  }
}
