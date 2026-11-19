// A code block in a message ([[code:…]], code-model.js): its language and buttons over the
// code, drawn as text in a <pre>, never as markup. Copy copies it; Run (Python, Java and
// JavaScript) shows the runner's output under it; Save as gist keeps a copy in your gists.
// runCode(language, code) and saveGist(language, code) come from the page; without one, its
// button isn't offered.
import { isRunnable, languageOf } from './code-model.js';

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

// text: the log's wording (copyCode, copied, copyFailed, runCode, running, output, runFailed,
// noOutput, saveGist, savedGist).
export function renderCodeBlock(language, code, { runCode = null, saveGist = null, text }) {
  const figure = document.createElement('figure');
  figure.className = 'chat-code';
  const head = document.createElement('figcaption');
  head.className = 'chat-code-head';
  const label = document.createElement('b');
  label.textContent = languageOf(language)?.label || language;
  const actions = document.createElement('div');
  actions.className = 'chat-code-actions';
  const pre = document.createElement('pre');
  pre.className = 'chat-code-body';
  const source = document.createElement('code');
  source.textContent = code;
  pre.appendChild(source);
  const output = document.createElement('pre');
  output.className = 'chat-code-output';
  output.hidden = true;
  const note = document.createElement('p');
  note.className = 'chat-code-note';
  note.hidden = true;

  actions.appendChild(codeButton('fa-copy', text.copyCode, async control => {
    try {
      await navigator.clipboard.writeText(code);
      flash(control, text.copied, text.copyCode);
    } catch {
      flash(control, text.copyFailed, text.copyCode);
    }
  }));
  if (runCode && isRunnable(language)) {
    actions.appendChild(codeButton('fa-play', text.runCode, async control => {
      control.disabled = true;
      output.hidden = false;
      output.dataset.label = text.output;
      output.textContent = text.running;
      try {
        const result = await runCode(language, code);
        output.textContent = result === '' ? text.noOutput : result;
      } catch (error) {
        output.textContent = fill(text.runFailed, { reason: error?.message || 'unknown error' });
      } finally {
        control.disabled = false;
      }
    }));
  }
  if (saveGist) {
    actions.appendChild(codeButton('fa-file-code', text.saveGist, async control => {
      control.disabled = true;
      try {
        const url = await saveGist(language, code);
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = url.replace(/^https:\/\//, '');
          note.replaceChildren(`${text.savedGist} `, link);
          note.hidden = false;
        }
      } finally {
        control.disabled = false;
      }
    }));
  }
  head.append(label, actions);
  figure.append(head, pre, output, note);
  return figure;
}
