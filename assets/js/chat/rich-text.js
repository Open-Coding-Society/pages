/*
 * Shared rich-text layer for the course chat widgets
 * (announcement_chat.html, week_chat.html, lesson_chat.html).
 *
 * Two things are exported:
 *
 *   createRichComposer(opts) -> a WYSIWYG input (toolbar + contenteditable)
 *       that replaces the old single-line <input class="chat-input">. It
 *       produces a small, fixed subset of HTML: <b> <i> <u> <s>, <ul>/<ol>/<li>,
 *       <br>, and <span class="rt-font-*|rt-size-*"> for font family / size.
 *
 *   renderRichMessage(container, raw) -> parses a stored message, keeps only
 *       that same subset, turns bare URLs into links, and appends the result.
 *       Every message (history from S3, live from the socket, local preview)
 *       goes through here, so the sanitizer is the trust boundary — never
 *       assume the input is safe.
 *
 * Plain-text messages sent before this shipped still render correctly: the
 * sanitizer passes text through untouched and the widgets keep `white-space:
 * pre-wrap`, so their newlines survive.
 */

const MAX_LENGTH_DEFAULT = 2000;

const URL_RE = /https?:\/\/[^\s<>()]+/g;

// The only inline tags a message may contain. Anything else is unwrapped
// (its text is kept, the tag is dropped).
const INLINE_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE']);
const LIST_TAGS = new Set(['UL', 'OL', 'LI']);

// span classes the composer emits; nothing else is allowed to ride on a span.
const SPAN_CLASS_RE = /^rt-(?:font-(?:serif|mono)|size-(?:sm|lg|xl))$/;

const FONT_OPTIONS = [
  { label: 'Sans-serif', value: '' },
  { label: 'Serif', value: 'rt-font-serif' },
  { label: 'Monospace', value: 'rt-font-mono' },
];

const SIZE_OPTIONS = [
  { label: 'Small', value: 'rt-size-sm' },
  { label: 'Normal', value: '' },
  { label: 'Large', value: 'rt-size-lg' },
  { label: 'Huge', value: 'rt-size-xl' },
];

const EMOJI = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '😍', '🤩', '😘', '😋', '😜', '🤪', '🤨',
  '🧐', '🤓', '😎', '🥳', '😏', '😒', '😞', '😔', '😢', '😭',
  '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '🤔',
  '🤗', '🤭', '🤫', '😴', '😌', '😬', '🙄', '😲', '🥺', '😪',
  '👍', '👎', '👏', '🙌', '👌', '🤝', '🙏', '💪', '🫶', '✌️',
  '👀', '🔥', '✨', '🎉', '🎊', '✅', '❌', '❓', '❗', '💡',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💯', '⭐', '🌟',
  '🚀', '🐛', '☕', '🍕', '🎯', '📌', '📝', '💻', '⏰', '👋',
];

/* ------------------------------------------------------------------ *
 * Sanitiser / renderer
 * ------------------------------------------------------------------ */

function linkifyText(text, insideAnchor) {
  const frag = document.createDocumentFragment();
  const value = String(text);
  if (insideAnchor) {
    frag.appendChild(document.createTextNode(value));
    return frag;
  }
  const re = new RegExp(URL_RE.source, 'g');
  let lastIndex = 0;
  let match;
  while ((match = re.exec(value)) !== null) {
    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
    }
    const a = document.createElement('a');
    a.href = match[0];
    a.textContent = match[0];
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    frag.appendChild(a);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < value.length || !frag.childNodes.length) {
    frag.appendChild(document.createTextNode(value.slice(lastIndex)));
  }
  return frag;
}

// contenteditable in some browsers renders a decoration as an inline style
// instead of a tag; map those back so the sanitiser keeps the formatting.
function styleTag(node) {
  const style = node.getAttribute('style') || '';
  if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) return 'b';
  if (/font-style\s*:\s*italic/i.test(style)) return 'i';
  if (/text-decoration[^;]*underline/i.test(style)) return 'u';
  if (/text-decoration[^;]*line-through/i.test(style)) return 's';
  return null;
}

function safeHref(raw) {
  const href = String(raw || '').trim();
  return /^(https?:\/\/|mailto:)/i.test(href) ? href : null;
}

function cleanChildren(source, target, insideAnchor) {
  source.childNodes.forEach((child) => {
    target.appendChild(cleanNode(child, insideAnchor));
  });
}

function cleanNode(node, insideAnchor) {
  if (node.nodeType === Node.TEXT_NODE) {
    return linkifyText(node.nodeValue, insideAnchor);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return document.createDocumentFragment();
  }

  const tag = node.tagName;

  if (tag === 'BR') return document.createElement('br');

  // Block containers a browser's contenteditable leaves behind: keep the
  // text, and start a new line if anything came before.
  if (tag === 'DIV' || tag === 'P') {
    const frag = document.createDocumentFragment();
    if (node.previousSibling) frag.appendChild(document.createElement('br'));
    cleanChildren(node, frag, insideAnchor);
    return frag;
  }

  if (INLINE_TAGS.has(tag) || LIST_TAGS.has(tag)) {
    const el = document.createElement(tag.toLowerCase());
    cleanChildren(node, el, insideAnchor);
    return el;
  }

  if (tag === 'SPAN' || tag === 'FONT') {
    const kept = tag === 'SPAN'
      ? Array.from(node.classList).filter((c) => SPAN_CLASS_RE.test(c))
      : [];
    const decoration = styleTag(node);
    if (!kept.length && !decoration) {
      const frag = document.createDocumentFragment();
      cleanChildren(node, frag, insideAnchor);
      return frag;
    }
    const el = document.createElement(kept.length ? 'span' : decoration);
    if (kept.length) el.className = kept.join(' ');
    cleanChildren(node, el, insideAnchor);
    if (kept.length && decoration) {
      const outer = document.createElement(decoration);
      outer.appendChild(el);
      return outer;
    }
    return el;
  }

  if (tag === 'A') {
    const href = safeHref(node.getAttribute('href'));
    if (!href) {
      const frag = document.createDocumentFragment();
      cleanChildren(node, frag, true);
      return frag;
    }
    const el = document.createElement('a');
    el.href = href;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    cleanChildren(node, el, true);
    return el;
  }

  // Unknown element: drop the tag, keep its contents.
  const frag = document.createDocumentFragment();
  cleanChildren(node, frag, insideAnchor);
  return frag;
}

function sanitizeToFragment(raw) {
  const doc = new DOMParser().parseFromString(String(raw ?? ''), 'text/html');
  const frag = document.createDocumentFragment();
  cleanChildren(doc.body, frag, false);
  return frag;
}

export function sanitizeRichText(raw) {
  const holder = document.createElement('div');
  holder.appendChild(sanitizeToFragment(raw));
  return holder.innerHTML;
}

export function renderRichMessage(container, raw) {
  container.appendChild(sanitizeToFragment(raw));
}

/* ------------------------------------------------------------------ *
 * Composer
 * ------------------------------------------------------------------ */

function stripGroupSpans(root, prefix) {
  root.querySelectorAll('span[class]').forEach((span) => {
    const remaining = Array.from(span.classList).filter((c) => !c.startsWith(prefix));
    if (remaining.length === Array.from(span.classList).length) return;
    if (remaining.length) {
      span.className = remaining.join(' ');
    } else {
      span.replaceWith(...span.childNodes);
    }
  });
}

export function createRichComposer(opts = {}) {
  const {
    placeholder = 'Write a message…',
    maxLength = MAX_LENGTH_DEFAULT,
    onSubmit = () => {},
    onInput = () => {},
  } = opts;

  const root = document.createElement('div');
  root.className = 'rt-composer';

  const toolbar = document.createElement('div');
  toolbar.className = 'rt-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Formatting');

  const editor = document.createElement('div');
  editor.className = 'rt-editor';
  editor.contentEditable = 'true';
  editor.setAttribute('role', 'textbox');
  editor.setAttribute('aria-multiline', 'true');
  editor.setAttribute('aria-label', placeholder);
  editor.dataset.placeholder = placeholder;

  // The emoji panel is a fixed-position popover attached to <body> only while
  // open — the chat widgets clip their overflow, so it can't live inside root.
  const emojiPanel = document.createElement('div');
  emojiPanel.className = 'rt-emoji-panel';

  root.append(toolbar, editor);

  /* selection tracking — a <select> or the emoji panel steals focus and
     collapses the editor selection, so remember the last range that was
     actually inside the editor and restore it before applying a style. The
     document-level listener is wired on first focus, not at construction, so
     a page with many collapsed week-card chats doesn't pay for them upfront. */
  let savedRange = null;
  let selectionTracked = false;
  function trackSelection() {
    if (selectionTracked) return;
    selectionTracked = true;
    document.addEventListener('selectionchange', () => {
      const sel = document.getSelection();
      if (sel && sel.rangeCount && editor.contains(sel.anchorNode)) {
        savedRange = sel.getRangeAt(0).cloneRange();
      }
    });
  }
  editor.addEventListener('focusin', trackSelection);

  function restoreSelection() {
    editor.focus();
    if (!savedRange) return false;
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
    return true;
  }

  function exec(command) {
    editor.focus();
    // Emit tags (<b>, <i>…) rather than inline styles, so the sanitiser keeps them.
    try { document.execCommand('styleWithCSS', false, false); } catch (_) { /* ignore */ }
    document.execCommand(command, false, null);
    syncToolbarState();
    handleChange();
  }

  function applyGroupClass(prefix, className) {
    if (!restoreSelection()) return;
    const sel = document.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const contents = range.extractContents();
    const wrapper = document.createElement('span');
    wrapper.appendChild(contents);
    stripGroupSpans(wrapper, prefix);

    let inserted;
    if (className) {
      wrapper.className = className;
      inserted = wrapper;
    } else {
      inserted = document.createDocumentFragment();
      inserted.append(...wrapper.childNodes);
    }
    const firstChild = inserted.nodeType === Node.ELEMENT_NODE ? inserted : inserted.firstChild;
    const lastChild = inserted.nodeType === Node.ELEMENT_NODE ? inserted : inserted.lastChild;
    range.insertNode(inserted);

    if (firstChild) {
      const next = document.createRange();
      next.setStartBefore(firstChild);
      next.setEndAfter(lastChild || firstChild);
      sel.removeAllRanges();
      sel.addRange(next);
      savedRange = next.cloneRange();
    }
    editor.normalize();
    handleChange();
  }

  function insertText(text) {
    restoreSelection();
    if (!document.execCommand('insertText', false, text)) {
      const sel = document.getSelection();
      if (sel && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        editor.appendChild(document.createTextNode(text));
      }
    }
    savedRange = document.getSelection().rangeCount
      ? document.getSelection().getRangeAt(0).cloneRange()
      : null;
    handleChange();
  }

  /* toolbar buttons ------------------------------------------------- */

  function button(label, title, handler, extraClass) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rt-btn' + (extraClass ? ' ' + extraClass : '');
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = label;
    // mousedown-preventDefault keeps the editor selection alive through the click
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', (e) => {
      e.preventDefault();
      handler(b);
    });
    return b;
  }

  function separator() {
    const s = document.createElement('span');
    s.className = 'rt-sep';
    s.setAttribute('aria-hidden', 'true');
    return s;
  }

  const boldBtn = button('<b>B</b>', 'Bold (Ctrl+B)', () => exec('bold'));
  const italicBtn = button('<i>I</i>', 'Italic (Ctrl+I)', () => exec('italic'));
  const underlineBtn = button('<u>U</u>', 'Underline (Ctrl+U)', () => exec('underline'));
  const strikeBtn = button('<s>S</s>', 'Strikethrough', () => exec('strikeThrough'));
  const bulletBtn = button('&#8226; &#8801;', 'Bulleted list', () => exec('insertUnorderedList'));
  const numberBtn = button('1. &#8801;', 'Numbered list', () => exec('insertOrderedList'));

  const fontSelect = document.createElement('select');
  fontSelect.className = 'rt-select rt-font-select';
  fontSelect.title = 'Font';
  fontSelect.setAttribute('aria-label', 'Font family');
  FONT_OPTIONS.forEach((o) => fontSelect.add(new Option(o.label, o.value)));
  fontSelect.addEventListener('mousedown', () => restoreSelection());
  fontSelect.addEventListener('change', () => {
    applyGroupClass('rt-font-', fontSelect.value);
    fontSelect.selectedIndex = 0;
  });

  const sizeSelect = document.createElement('select');
  sizeSelect.className = 'rt-select rt-size-select';
  sizeSelect.title = 'Font size';
  sizeSelect.setAttribute('aria-label', 'Font size');
  SIZE_OPTIONS.forEach((o) => sizeSelect.add(new Option(o.label, o.value)));
  sizeSelect.value = '';
  sizeSelect.addEventListener('mousedown', () => restoreSelection());
  sizeSelect.addEventListener('change', () => {
    applyGroupClass('rt-size-', sizeSelect.value);
    sizeSelect.value = '';
  });

  const emojiBtn = button('🙂', 'Emoji', () => toggleEmojiPanel(), 'rt-emoji-toggle');
  const clearBtn = button('&#10007;', 'Clear formatting', () => {
    editor.focus();
    document.execCommand('removeFormat', false, null);
    // removeFormat leaves our font/size spans alone — strip those too.
    const sel = document.getSelection();
    if (sel && sel.rangeCount && !sel.getRangeAt(0).collapsed) {
      const range = sel.getRangeAt(0);
      const holder = document.createElement('div');
      holder.appendChild(range.extractContents());
      stripGroupSpans(holder, 'rt-font-');
      stripGroupSpans(holder, 'rt-size-');
      const frag = document.createDocumentFragment();
      frag.append(...holder.childNodes);
      range.insertNode(frag);
    }
    editor.normalize();
    syncToolbarState();
    handleChange();
  });

  toolbar.append(
    boldBtn, italicBtn, underlineBtn, strikeBtn, separator(),
    bulletBtn, numberBtn, separator(),
    fontSelect, sizeSelect, separator(),
    emojiBtn, clearBtn,
  );

  /* emoji panel — buttons and dismiss listeners are created the first time
     it's opened, so an unused chat widget builds none of it. --------- */

  let emojiOpen = false;
  let emojiBuilt = false;

  function buildEmojiPanel() {
    if (emojiBuilt) return;
    emojiBuilt = true;
    EMOJI.forEach((emoji) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rt-emoji';
      b.textContent = emoji;
      b.setAttribute('aria-label', `Insert ${emoji}`);
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', () => {
        insertText(emoji);
        closeEmojiPanel();
      });
      emojiPanel.appendChild(b);
    });
    document.addEventListener('click', (e) => {
      if (emojiOpen && !root.contains(e.target) && !emojiPanel.contains(e.target)) closeEmojiPanel();
    });
    window.addEventListener('scroll', () => closeEmojiPanel(), true);
  }

  function toggleEmojiPanel() {
    if (emojiOpen) { closeEmojiPanel(); return; }
    buildEmojiPanel();
    const sel = document.getSelection();
    if (sel.rangeCount && editor.contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
    document.body.appendChild(emojiPanel);
    const r = emojiBtn.getBoundingClientRect();
    const viewW = document.documentElement.clientWidth;
    const viewH = document.documentElement.clientHeight;
    const panelW = emojiPanel.offsetWidth || 300;
    const panelH = Math.min(240, emojiPanel.offsetHeight || 240);
    emojiPanel.style.left = `${Math.max(8, Math.min(r.left, viewW - panelW - 8))}px`;
    emojiPanel.style.top = r.top > panelH + 12
      ? `${r.top - panelH - 6}px`
      : `${Math.min(r.bottom + 6, viewH - panelH - 8)}px`;
    emojiOpen = true;
    emojiBtn.classList.add('is-active');
  }

  function closeEmojiPanel() {
    if (!emojiOpen) return;
    emojiPanel.remove();
    emojiOpen = false;
    emojiBtn.classList.remove('is-active');
  }

  /* editor behaviour -------------------------------------------- */

  // Character class holds a literal zero-width space and BOM — some browsers
  // seed an empty contenteditable with one, and it must not count as content.
  function plainText() {
    return editor.textContent.replace(/[​﻿]/g, '');
  }

  function isEmpty() {
    return plainText().trim() === '' && !editor.querySelector('li');
  }

  function textLength() {
    return plainText().length;
  }

  function updatePlaceholder() {
    const blank = isEmpty()
      && editor.innerHTML.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/gi, '').trim() === '';
    editor.classList.toggle('is-empty', blank);
  }

  function syncToolbarState() {
    [['bold', boldBtn], ['italic', italicBtn], ['underline', underlineBtn], ['strikeThrough', strikeBtn],
      ['insertUnorderedList', bulletBtn], ['insertOrderedList', numberBtn]].forEach(([cmd, btn]) => {
      let on = false;
      try { on = document.queryCommandState(cmd); } catch (_) { /* ignore */ }
      btn.classList.toggle('is-active', on);
    });
  }

  function handleChange() {
    updatePlaceholder();
    editor.classList.toggle('is-over-limit', textLength() > maxLength);
    onInput({ isEmpty: isEmpty(), length: textLength(), overLimit: textLength() > maxLength });
  }

  editor.addEventListener('input', handleChange);
  editor.addEventListener('keyup', syncToolbarState);
  editor.addEventListener('mouseup', syncToolbarState);

  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      onSubmit();
    }
  });

  // Strip formatting from pasted content — paste as plain text, then let the
  // sender re-format. Keeps junk markup out of messages.
  editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    insertText(text);
  });

  updatePlaceholder();

  /* public API ------------------------------------------------- */

  return {
    element: root,
    editor,
    focus() { editor.focus(); },
    clear() {
      editor.innerHTML = '';
      savedRange = null;
      handleChange();
    },
    setEnabled(enabled) {
      editor.contentEditable = enabled ? 'true' : 'false';
      editor.classList.toggle('is-disabled', !enabled);
      toolbar.querySelectorAll('button, select').forEach((el) => { el.disabled = !enabled; });
      if (!enabled) closeEmojiPanel();
    },
    isEmpty,
    isOverLimit() { return textLength() > maxLength; },
    length: textLength,
    getHTML() {
      return sanitizeRichText(editor.innerHTML).replace(/(?:<br>|\s)+$/g, '').trim();
    },
  };
}
