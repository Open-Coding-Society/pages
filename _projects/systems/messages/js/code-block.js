// A code block in a message ([[code:…]], code-model.js): its language and buttons over the
// code, drawn as text in a <pre>, never as markup. Copy copies it; Run (Python, Java and
// JavaScript) shows the runner's output under it; Save as gist keeps a copy in your gists.
import { CodeBlocks } from './code-model.js';

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

// A labelled button: icon and words straight in the button (themes recolour span text).
function codeButton(icon, label, onClick) {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'ocs__btn small ocs__btn--icon';
  const glyph = document.createElement('i');
  glyph.className = `fas ${icon}`;
  glyph.setAttribute('aria-hidden', 'true');
  control.append(glyph, label);
  control.addEventListener('click', () => onClick(control));
  return control;
}

// Shows a word on a button for a moment (Copied), then puts its label back.
function flash(control, word, label) {
  control.lastChild.textContent = word;
  setTimeout(() => { control.lastChild.textContent = label; }, 1500);
}

/**
 * One message's code block, with its Copy, Run and Save as gist buttons.
 */
export class CodeBlock {
  #language;
  #code;
  #runCode;
  #saveGist;
  #text;
  #element;
  #output;
  #note;

  /**
   * Draws the block; put `element` in the message.
   * @param {string} language a CodeBlocks.LANGUAGES id
   * @param {string} code
   * @param {object} options
   * @param {Function|null} options.runCode runCode(language, code) resolves the runner's
   *   output; without it, or for a language the runners don't run, there's no Run button
   * @param {Function|null} options.saveGist saveGist(language, code) resolves the gist's
   *   URL; without it there's no Save as gist button
   * @param {object} options.text the log's wording (copyCode, copied, copyFailed, runCode,
   *   running, output, runFailed, noOutput, saveGist, savedGist)
   */
  constructor(language, code, { runCode = null, saveGist = null, text }) {
    this.#language = language;
    this.#code = code;
    this.#runCode = runCode;
    this.#saveGist = saveGist;
    this.#text = text;
    const figure = document.createElement('figure');
    figure.className = 'chat-code';
    const head = document.createElement('figcaption');
    head.className = 'chat-code-head';
    const label = document.createElement('b');
    label.textContent = CodeBlocks.languageOf(language)?.label || language;
    const actions = document.createElement('div');
    actions.className = 'chat-code-actions';
    const pre = document.createElement('pre');
    pre.className = 'chat-code-body';
    const source = document.createElement('code');
    source.textContent = code;
    pre.appendChild(source);
    this.#output = document.createElement('pre');
    this.#output.className = 'chat-code-output';
    this.#output.hidden = true;
    this.#note = document.createElement('p');
    this.#note.className = 'chat-code-note';
    this.#note.hidden = true;

    actions.appendChild(codeButton('fa-copy', text.copyCode, control => this.#copy(control)));
    if (runCode && CodeBlocks.isRunnable(language)) actions.appendChild(codeButton('fa-play', text.runCode, control => this.#run(control)));
    if (saveGist) actions.appendChild(codeButton('fa-file-code', text.saveGist, control => this.#save(control)));
    head.append(label, actions);
    figure.append(head, pre, this.#output, this.#note);
    this.#element = figure;
  }

  /** The block's element, a <figure>. */
  get element() {
    return this.#element;
  }

  async #copy(control) {
    const text = this.#text;
    try {
      await navigator.clipboard.writeText(this.#code);
      flash(control, text.copied, text.copyCode);
    } catch {
      flash(control, text.copyFailed, text.copyCode);
    }
  }

  async #run(control) {
    const text = this.#text;
    const output = this.#output;
    control.disabled = true;
    output.hidden = false;
    output.dataset.label = text.output;
    output.textContent = text.running;
    try {
      const result = await this.#runCode(this.#language, this.#code);
      output.textContent = result === '' ? text.noOutput : result;
    } catch (error) {
      output.textContent = fill(text.runFailed, { reason: error?.message || 'unknown error' });
    } finally {
      control.disabled = false;
    }
  }

  async #save(control) {
    control.disabled = true;
    try {
      const url = await this.#saveGist(this.#language, this.#code);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = url.replace(/^https:\/\//, '');
        this.#note.replaceChildren(`${this.#text.savedGist} `, link);
        this.#note.hidden = false;
      }
    } finally {
      control.disabled = false;
    }
  }
}
