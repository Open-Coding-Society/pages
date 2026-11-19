// The code box that /code and /gist open above the composer: a language, a plain textarea
// for the code (Tab indents, Ctrl or Cmd+Enter sends), and for a gist its file name. Send
// then posts the code as a code block, or saves it as a secret gist and posts the link
// (thread.js does the sending). The composer's own text goes with it as a caption.
import { CODE_LANGUAGES, MAX_CODE_LENGTH, languageOf } from './code-model.js';

export const CODE_TEXTS = Object.freeze({
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

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

export function createCodeComposer({ host, onSubmit = () => {}, onClose = () => {}, texts = {} }) {
  const text = { ...CODE_TEXTS, ...texts };
  let mode = null; // 'code' | 'gist' while open
  let maxLength = MAX_CODE_LENGTH;

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
  CODE_LANGUAGES.forEach(entry => language.add(new Option(entry.label, entry.id)));
  language.value = CODE_LANGUAGES[0].id;
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

  const extension = () => languageOf(language.value)?.extension || 'txt';

  function refreshHint() {
    const length = area.value.length;
    hint.textContent = length > maxLength
      ? fill(text.tooLong, { length: length.toLocaleString() })
      : (mode === 'gist' ? text.gistHint : text.hint);
  }

  // A language by its name ("java", "Java") or, for a gist's file name, its extension.
  function open(next, { language: wanted = '', filename: named = '', maxLength: limit = MAX_CODE_LENGTH } = {}) {
    mode = next;
    maxLength = limit;
    const word = wanted.toLowerCase();
    const fromName = named.includes('.') ? named.slice(named.lastIndexOf('.') + 1).toLowerCase() : '';
    const match = CODE_LANGUAGES.find(entry => entry.id === word || entry.label.toLowerCase() === word)
      || CODE_LANGUAGES.find(entry => fromName && entry.extension === fromName);
    if (match) language.value = match.id;
    title.textContent = mode === 'gist' ? text.gist : text.code;
    filename.hidden = mode !== 'gist';
    if (mode === 'gist') filename.value = named || filename.value || `snippet.${extension()}`;
    box.hidden = false;
    refreshHint();
    area.focus();
  }

  function close() {
    if (mode === null) return;
    mode = null;
    box.hidden = true;
    area.value = '';
    filename.value = '';
    onClose();
  }

  language.addEventListener('change', () => {
    // A file name still at its default follows the language.
    if (/^snippet\.\w+$/.test(filename.value)) filename.value = `snippet.${extension()}`;
  });
  area.addEventListener('input', refreshHint);
  area.addEventListener('keydown', event => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const { selectionStart: start, selectionEnd: end, value } = area;
      area.value = `${value.slice(0, start)}  ${value.slice(end)}`;
      area.selectionStart = start + 2;
      area.selectionEnd = start + 2;
      refreshHint();
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  });
  closeButton.addEventListener('click', close);

  return {
    open,
    close,
    isOpen: () => mode !== null,
    // What Send takes: { mode, language, code, filename }, or null when nothing can go.
    value() {
      const code = area.value.replace(/\s+$/, '');
      if (mode === null || !code.trim() || code.length > maxLength) return null;
      const name = filename.value.trim() || `snippet.${extension()}`;
      return { mode, language: languageOf(language.value) ? language.value : 'text', code, filename: name };
    },
    hasCode: () => mode !== null && area.value.trim() !== '',
    destroy() {
      box.remove();
    },
  };
}
