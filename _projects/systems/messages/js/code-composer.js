// The code box that /code and /gist open above the composer: a language, a plain textarea
// for the code (Tab indents, Ctrl or Cmd+Enter sends), and for a gist its file name. Send
// then posts the code as a code block, or saves it as a secret gist and posts the link
// (thread.js does the sending). The composer's own text goes with it as a caption.
import { CodeBlocks } from './code-model.js';

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

/**
 * The code box above the composer.
 */
export class CodeComposer {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    code: 'Code block',
    gist: 'Secret gist',
    language: 'Language',
    filename: 'File name',
    placeholder: 'Paste or type code',
    close: 'Close the code box',
    hint: 'Send posts it; what you type in the message box goes with it. Tab indents.',
    gistHint: 'Send saves it to your GitHub gists (secret) and posts the link.',
    tooLong: 'That’s {length} characters. Share code this long as a file or a gist.',
  });

  #text;
  #onSubmit;
  #onClose;
  #mode = null; // 'code' | 'gist' while open
  #maxLength = CodeBlocks.MAX_LENGTH;
  #box;
  #title;
  #language;
  #filename;
  #area;
  #hint;

  /**
   * Builds the box, closed, in `host`.
   * @param {object} options
   * @param {HTMLElement} options.host where the box goes, above the composer
   * @param {Function} options.onSubmit Ctrl or Cmd+Enter in the code asks to send
   * @param {Function} options.onClose after the box closes
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ host, onSubmit = () => {}, onClose = () => {}, texts = {} }) {
    const text = { ...CodeComposer.TEXTS, ...texts };
    this.#text = text;
    this.#onSubmit = onSubmit;
    this.#onClose = onClose;

    const box = document.createElement('div');
    box.className = 'dm__code-box';
    box.hidden = true;
    const head = document.createElement('div');
    head.className = 'dm__code-head';
    const title = document.createElement('b');
    title.className = 'dm__code-title';
    const language = document.createElement('select');
    language.className = 'ocs__input dm__code-language';
    language.setAttribute('aria-label', text.language);
    CodeBlocks.LANGUAGES.forEach(entry => language.add(new Option(entry.label, entry.id)));
    language.value = CodeBlocks.LANGUAGES[0].id;
    const filename = document.createElement('input');
    filename.className = 'ocs__input dm__code-filename';
    filename.type = 'text';
    filename.setAttribute('aria-label', text.filename);
    filename.placeholder = text.filename;
    filename.maxLength = 120;
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'ocs__btn small';
    closeButton.setAttribute('aria-label', text.close);
    closeButton.title = text.close;
    closeButton.textContent = '×';
    head.append(title, language, filename, closeButton);
    const area = document.createElement('textarea');
    area.className = 'ocs__input dm__code-input';
    area.rows = 8;
    area.spellcheck = false;
    area.placeholder = text.placeholder;
    area.setAttribute('aria-label', text.placeholder);
    const hint = document.createElement('em');
    hint.className = 'dm__tray-note';
    box.append(head, area, hint);
    host.appendChild(box);
    this.#box = box;
    this.#title = title;
    this.#language = language;
    this.#filename = filename;
    this.#area = area;
    this.#hint = hint;

    language.addEventListener('change', () => {
      // A file name still at its default follows the language.
      if (/^snippet\.\w+$/.test(filename.value)) filename.value = `snippet.${this.#extension()}`;
    });
    area.addEventListener('input', () => this.#refreshHint());
    area.addEventListener('keydown', event => {
      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        const { selectionStart: start, selectionEnd: end, value } = area;
        area.value = `${value.slice(0, start)}  ${value.slice(end)}`;
        area.selectionStart = start + 2;
        area.selectionEnd = start + 2;
        this.#refreshHint();
      } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.#onSubmit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });
    closeButton.addEventListener('click', () => this.close());
  }

  /**
   * Opens the box for a code block or a gist. A language is found by its name ("java",
   * "Java") or, for a gist, by its file name's extension.
   * @param {'code'|'gist'} next
   * @param {{language?: string, filename?: string, maxLength?: number}} options
   */
  open(next, { language: wanted = '', filename: named = '', maxLength: limit = CodeBlocks.MAX_LENGTH } = {}) {
    const text = this.#text;
    this.#mode = next;
    this.#maxLength = limit;
    const word = wanted.toLowerCase();
    const fromName = named.includes('.') ? named.slice(named.lastIndexOf('.') + 1).toLowerCase() : '';
    const match = CodeBlocks.LANGUAGES.find(entry => entry.id === word || entry.label.toLowerCase() === word)
      || CodeBlocks.LANGUAGES.find(entry => fromName && entry.extension === fromName);
    if (match) this.#language.value = match.id;
    this.#title.textContent = this.#mode === 'gist' ? text.gist : text.code;
    this.#filename.hidden = this.#mode !== 'gist';
    if (this.#mode === 'gist') this.#filename.value = named || this.#filename.value || `snippet.${this.#extension()}`;
    this.#box.hidden = false;
    this.#refreshHint();
    this.#area.focus();
  }

  /** Closes the box and empties it. */
  close() {
    if (this.#mode === null) return;
    this.#mode = null;
    this.#box.hidden = true;
    this.#area.value = '';
    this.#filename.value = '';
    this.#onClose();
  }

  /** @returns {boolean} whether the box is open */
  isOpen() {
    return this.#mode !== null;
  }

  /**
   * What Send takes.
   * @returns {{mode: string, language: string, code: string, filename: string}|null} null
   *   when nothing can go: closed, empty, or over the length limit
   */
  value() {
    const code = this.#area.value.replace(/\s+$/, '');
    if (this.#mode === null || !code.trim() || code.length > this.#maxLength) return null;
    const name = this.#filename.value.trim() || `snippet.${this.#extension()}`;
    return { mode: this.#mode, language: CodeBlocks.languageOf(this.#language.value) ? this.#language.value : 'text', code, filename: name };
  }

  /** @returns {boolean} whether the open box holds any code */
  hasCode() {
    return this.#mode !== null && this.#area.value.trim() !== '';
  }

  /** Takes the box off the page. */
  destroy() {
    this.#box.remove();
  }

  #extension() {
    return CodeBlocks.languageOf(this.#language.value)?.extension || 'txt';
  }

  #refreshHint() {
    const text = this.#text;
    const length = this.#area.value.length;
    this.#hint.textContent = length > this.#maxLength
      ? fill(text.tooLong, { length: length.toLocaleString() })
      : (this.#mode === 'gist' ? text.gistHint : text.hint);
  }
}
