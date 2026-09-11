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

// Zero-width space + BOM: some browsers seed an empty contenteditable with one
// and paste can carry them in. They must never count as content or reach a
// stored message, so strip them on the way through the sanitiser and in the
// composer's own length / empty checks.
const INVISIBLE_RE = /[​﻿]/g;

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
  const value = String(text).replace(INVISIBLE_RE, '');
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

// True unless the element is empty or holds nothing but empty text nodes —
// used to discard the leftover carrier spans the composer parks the caret in.
function hasContent(el) {
  if (el.querySelector('br, li')) return true;
  return el.textContent.replace(INVISIBLE_RE, '').length > 0;
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

  if (INLINE_TAGS.has(tag)) {
    const el = document.createElement(tag.toLowerCase());
    cleanChildren(node, el, insideAnchor);
    return hasContent(el) ? el : document.createDocumentFragment();
  }

  if (LIST_TAGS.has(tag)) {
    const el = document.createElement(tag.toLowerCase());
    cleanChildren(node, el, insideAnchor);
    // contenteditable pads an empty/just-typed <li> with a trailing <br>
    if (tag === 'LI' && el.lastChild && el.lastChild.nodeName === 'BR') el.removeChild(el.lastChild);
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
    if (!hasContent(el)) return document.createDocumentFragment();
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
  while (frag.lastChild && frag.lastChild.nodeName === 'BR') frag.removeChild(frag.lastChild);
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
    try {
      const sel = document.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange);
      return true;
    } catch (_) {
      return false;
    }
  }

  /* Sticky font family / size. Picking "Monospace" or "Large" sets the mode
     here; the beforeinput handler then wraps whatever the user types next
     until they pick "Sans-serif" / "Normal" again (or hit Clear formatting).
     A selection that isn't collapsed is still styled in place, one shot. */
  const typingFormat = { 'rt-font-': '', 'rt-size-': '' };
  let suppressSticky = false;

  function stickyClasses() {
    return [typingFormat['rt-font-'], typingFormat['rt-size-']].filter(Boolean);
  }

  const RT_SPAN_SEL = 'span[class*="rt-font-"], span[class*="rt-size-"]';

  // The rt-styled span the caret is directly inside, if its class set is
  // exactly `classes` (so more typing can just flow into it).
  function styledSpanAtCaret(classes) {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return null;
    let node = sel.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    const span = node && node.closest ? node.closest('span[class]') : null;
    if (!span || !editor.contains(span)) return null;
    const wanted = classes.slice().sort().join(' ');
    const have = Array.from(span.classList).sort().join(' ');
    return wanted === have ? span : null;
  }

  function caretInRtSpan() {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return false;
    let node = sel.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    return !!(node && node.closest && editor.contains(node) && node.closest(RT_SPAN_SEL));
  }

  // Step the caret just past the nearest font/size span (splitting it so text
  // after the caret stays put) so a new run lands beside it, not nested inside
  // and inheriting it. Anything else the caret is in — <b>, <li> — is left
  // alone; only the font/size wrapper is escaped.
  function escapeRtSpan(sel) {
    let range = sel.getRangeAt(0);
    let el = range.startContainer;
    if (el.nodeType === Node.TEXT_NODE) el = el.parentElement;
    const rtSpan = el && el.closest ? el.closest(RT_SPAN_SEL) : null;
    if (!rtSpan || !editor.contains(rtSpan)) return range;

    const tail = document.createRange();
    tail.setStart(range.startContainer, range.startOffset);
    tail.setEnd(rtSpan, rtSpan.childNodes.length);
    const tailFrag = tail.extractContents();

    const next = document.createRange();
    if (tailFrag.textContent.replace(INVISIBLE_RE, '') !== '' || tailFrag.querySelector('br')) {
      const clone = rtSpan.cloneNode(false);
      clone.appendChild(tailFrag);
      rtSpan.parentNode.insertBefore(clone, rtSpan.nextSibling);
      next.setStartBefore(clone);
    } else {
      next.setStartAfter(rtSpan);
    }
    next.collapse(true);
    sel.removeAllRanges();
    sel.addRange(next);
    return next;
  }

  function insertStyledText(text) {
    const classes = stickyClasses();
    if (!restoreSelection()) return false;
    const sel = document.getSelection();
    if (!sel.rangeCount) return false;
    let range = sel.getRangeAt(0);
    range.deleteContents();
    range = escapeRtSpan(sel);

    // Merge into an identical span sitting right before the caret, if any.
    const want = classes.slice().sort().join(' ');
    const prev = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer.childNodes[range.startOffset - 1]
      : null;
    const mergeInto = classes.length && prev && prev.nodeType === Node.ELEMENT_NODE
      && prev.tagName === 'SPAN' && Array.from(prev.classList).sort().join(' ') === want
      ? prev : null;

    let textNode;
    if (mergeInto) {
      textNode = document.createTextNode(text);
      mergeInto.appendChild(textNode);
    } else if (classes.length) {
      const span = document.createElement('span');
      span.className = classes.join(' ');
      textNode = document.createTextNode(text);
      span.appendChild(textNode);
      range.insertNode(span);
    } else {
      textNode = document.createTextNode(text);
      range.insertNode(textNode);
    }
    const after = document.createRange();
    after.setStart(textNode, text.length);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
    savedRange = after.cloneRange();
    return true;
  }

  // Empty font/size spans left behind when a run is stepped out of — drop the
  // ones the caret isn't in so they don't accumulate while composing.
  function pruneEmptyRtSpans() {
    const sel = document.getSelection();
    const caretNode = sel && sel.rangeCount ? sel.getRangeAt(0).startContainer : null;
    editor.querySelectorAll(RT_SPAN_SEL).forEach((span) => {
      if (caretNode && span.contains(caretNode)) return;
      if (!span.querySelector('br') && span.textContent.replace(INVISIBLE_RE, '') === '') span.remove();
    });
  }

  function applyGroupToRange(prefix, className) {
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

  function setGroupFormat(prefix, className) {
    typingFormat[prefix] = className;
    restoreSelection();
    const sel = document.getSelection();
    if (sel.rangeCount && !sel.getRangeAt(0).collapsed) {
      applyGroupToRange(prefix, className);
    }
    editor.focus();
    handleChange();
  }

  function exec(command) {
    editor.focus();
    // Emit tags (<b>, <i>…) rather than inline styles, so the sanitiser keeps them.
    try { document.execCommand('styleWithCSS', false, false); } catch (_) { /* ignore */ }
    document.execCommand(command, false, null);
    syncToolbarState();
    handleChange();
  }

  // Insert a literal string (emoji, pasted text) at the caret. Bypasses the
  // sticky font/size wrapping — these are "drop this in", not "type".
  function insertText(text) {
    suppressSticky = true;
    try {
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
    } finally {
      suppressSticky = false;
    }
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

  function resetTypingFormat() {
    typingFormat['rt-font-'] = '';
    typingFormat['rt-size-'] = '';
    fontSelect.value = '';
    sizeSelect.value = '';
  }

  const fontSelect = document.createElement('select');
  fontSelect.className = 'rt-select rt-font-select';
  fontSelect.title = 'Font — applies to selected text, or to what you type next';
  fontSelect.setAttribute('aria-label', 'Font family');
  FONT_OPTIONS.forEach((o) => fontSelect.add(new Option(o.label, o.value)));
  fontSelect.addEventListener('mousedown', () => restoreSelection());
  fontSelect.addEventListener('change', () => setGroupFormat('rt-font-', fontSelect.value));

  const sizeSelect = document.createElement('select');
  sizeSelect.className = 'rt-select rt-size-select';
  sizeSelect.title = 'Size — applies to selected text, or to what you type next';
  sizeSelect.setAttribute('aria-label', 'Font size');
  SIZE_OPTIONS.forEach((o) => sizeSelect.add(new Option(o.label, o.value)));
  sizeSelect.value = '';
  sizeSelect.addEventListener('mousedown', () => restoreSelection());
  sizeSelect.addEventListener('change', () => setGroupFormat('rt-size-', sizeSelect.value));

  const emojiBtn = button('🙂', 'Emoji', () => toggleEmojiPanel(), 'rt-emoji-toggle');

  // An eraser — "remove every style from the selection and go back to plain text".
  const ERASER_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>'
    + '<path d="M22 21H7"/><path d="m5 11 9 9"/></svg>';
  const clearBtn = button(ERASER_ICON, 'Clear formatting — back to plain text', () => {
    resetTypingFormat();
    if (!restoreSelection()) editor.focus();
    const sel = document.getSelection();
    if (sel && sel.rangeCount && !sel.getRangeAt(0).collapsed) {
      const range = sel.getRangeAt(0);
      const holder = document.createElement('div');
      holder.appendChild(range.extractContents());
      // Drop every character-formatting wrapper, keep the text, <br>, and any
      // list structure inside the selection.
      holder.querySelectorAll('b, strong, i, em, u, s, strike, font, span').forEach((el) => {
        el.replaceWith(...el.childNodes);
      });
      const frag = document.createDocumentFragment();
      frag.append(...holder.childNodes);
      range.insertNode(frag);
      editor.normalize();
      const end = document.createRange();
      end.selectNodeContents(editor);
      end.collapse(false);
      sel.removeAllRanges();
      sel.addRange(end);
      savedRange = end.cloneRange();
    }
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
    // Capture-phase, so it also sees scrolls on the page behind the panel —
    // but scrolling *inside* the tray (its own element is the scroll target)
    // is how the user reaches the emoji further down, so that must not close it.
    window.addEventListener('scroll', (e) => {
      if (e.target !== emojiPanel) closeEmojiPanel();
    }, true);
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
    const panelH = Math.min(300, emojiPanel.offsetHeight || 300);
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

  function plainText() {
    return editor.textContent.replace(INVISIBLE_RE, '');
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
    pruneEmptyRtSpans();
    updatePlaceholder();
    editor.classList.toggle('is-over-limit', textLength() > maxLength);
    onInput({ isEmpty: isEmpty(), length: textLength(), overLimit: textLength() > maxLength });
  }

  editor.addEventListener('input', handleChange);
  editor.addEventListener('keyup', syncToolbarState);
  editor.addEventListener('mouseup', syncToolbarState);

  function inListItem() {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return false;
    let node = sel.getRangeAt(0).startContainer;
    while (node && node !== editor) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') return true;
      node = node.parentNode;
    }
    return false;
  }

  editor.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing) return;
    if (e.shiftKey) {
      // Shift+Enter is a soft newline; inside a list that means the next item.
      if (inListItem()) {
        e.preventDefault();
        document.execCommand('insertParagraph', false, null);
        syncToolbarState();
        handleChange();
      }
      return; // outside a list, let the browser drop in its <br>
    }
    e.preventDefault();
    onSubmit();
  });

  // Sticky font / size. If the caret is already in a span that carries exactly
  // the armed mode, let the browser type into it. Otherwise take over: wrap the
  // text in the armed mode, or — when nothing is armed but the caret is stuck
  // in a stale font/size span — step the new text out to plain.
  editor.addEventListener('beforeinput', (e) => {
    if (suppressSticky || e.isComposing) return;
    if (e.inputType !== 'insertText' || typeof e.data !== 'string' || !e.data) return;
    const classes = stickyClasses();
    if (styledSpanAtCaret(classes)) return;
    if (!classes.length && !caretInRtSpan()) return;
    e.preventDefault();
    if (insertStyledText(e.data)) handleChange();
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
      resetTypingFormat();
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
