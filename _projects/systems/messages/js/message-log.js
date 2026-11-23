// The open conversation's messages, drawn with the chat-* class names the course chats
// use and styled for /dm in sass/_thread.scss: a divider for each day, then each message
// with its avatar, sender and time, a Reply button, and edit and delete buttons on your
// own messages (none in a read-only log). A reply shows a quote of the message it
// answers, from the [[reply:...]] marker at the start of its body (assets/js/chat/chat-reply.js).
import { CodeBlock } from './code-block.js';
import { CodeBlocks } from './code-model.js';
import { Conversation } from './conversation-model.js';
import { FileRows } from './file-rows.js';
import { FilesMarker } from './files-model.js';
import { dayKey, dayLabel, initialsFor, pfpSrc, tintFor } from './messages-model.js';

// What the log says, worded for /dm. A host passes its own wording for any of these in
// `texts`; {name} is filled in.
export const LOG_TEXTS = Object.freeze({
  you: 'You',
  edited: '(edited)',
  editMessage: 'Edit message',
  addToCalendar: 'Add to calendar',
  deleteMessage: 'Delete message',
  replyMessage: 'Reply',
  imageFrom: 'Image from {name}',
  openImage: 'View image from {name} larger',
  closeImage: 'Close image',
  deleted: 'This message was deleted.',
  today: 'Today',
  yesterday: 'Yesterday',
  folderFiles: '{files} · {size}',
  previewFile: 'Preview {name}',
  downloadFile: 'Download {name}',
  openFolder: 'Open {name} in Files',
  zipFolder: 'Download {name} as a .zip',
  imagePreview: '{name}, shared by {sender}',
  copyCode: 'Copy',
  copied: 'Copied',
  copyFailed: 'Select and copy it',
  runCode: 'Run',
  running: 'Running…',
  output: 'Output',
  runFailed: 'Could not run it: {reason}',
  noOutput: '(no output)',
  saveGist: 'Save as gist',
  savedGist: 'Saved to your gists:',
  pinMessage: 'Pin',
  unpinMessage: 'Unpin',
  pinned: 'Pinned',
  pinnedNote: '{name} pinned a message:',
  unpinnedNote: '{name} unpinned a message:',
  aMessage: 'a message',
});

// Fills a text's {slot}s, the way the UI Builder's registry text marks them. A slot with
// no value stays as written, so a missing value shows instead of vanishing.
export function fillText(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (slot, name) => (Object.hasOwn(values, name) ? String(values[name]) : slot));
}

// A host's wording laid over the defaults. Only keys the defaults have, and only strings,
// so a host can pass a bigger table (all of its registry text) without breaking a label.
export function withTexts(defaults, texts = {}) {
  if (texts === null || typeof texts !== 'object' || Array.isArray(texts)) {
    throw new TypeError('texts must be an object of strings');
  }
  const merged = {};
  Object.keys(defaults).forEach(key => {
    merged[key] = Object.hasOwn(texts, key) && typeof texts[key] === 'string' ? texts[key] : defaults[key];
  });
  return merged;
}

// What a message shows: its body, or what the host's formatBody(body, message) makes of
// it. Only the display changes (Edit still loads the body as sent), and the result still
// goes through the sanitizer, so formatBody can't add markup a message couldn't hold.
export function shownBody(message, formatBody) {
  if (!formatBody) return message.body;
  try {
    return formatBody(message.body, { ...message });
  } catch (error) {
    console.warn('Messages: formatBody failed, so the message shows as it was sent', error);
    return message.body;
  }
}

// A body without its reply marker, and the reply it carries. A host whose richText
// predates replies shows bodies as stored.
function splitReply(richText, body) {
  return typeof richText.extractReplyMarker === 'function'
    ? richText.extractReplyMarker(body)
    : { reply: null, html: body };
}

// onFile(action, item, control), when given, is what a shared file's buttons do ('preview',
// 'download', 'folder', 'zip'); thumbnail(item) resolves a URL for an image's inline preview.
// linkCards(html) returns a box of previews for the links in a message's text (the GitHub
// cards, GitHubCards.forBody), or null when there are none. runCode(language, code)
// resolves a code block's output (the /run routes the lesson runners use); saveGist(language,
// code) resolves the URL of a secret gist made from it. onPin(message, isPinned), when
// given, adds Pin/Unpin to each message; which messages are pinned comes from the
// [[pin:…]] messages the log holds (conversation-model.js), each drawn as a one-line note.
// onChange() is called after each append, edit and delete (the Shared panel redraws).
export function createMessageLog(element, {
  richText, me, onEdit, onDelete, onReply = null, onSchedule = null, readOnly = false, texts = {}, formatBody = null,
  onFile = null, thumbnail = null, linkCards = null, runCode = null, saveGist = null, onPin = null, onChange = () => {},
}) {
  if (formatBody !== null && typeof formatBody !== 'function') {
    throw new TypeError('createMessageLog: formatBody must be a function or null');
  }
  const text = withTexts(LOG_TEXTS, texts);
  const messages = new Map();
  const keyById = new Map(); // a message's id → its key, for its pin mark
  let pinnedIds = new Set();
  let lastDay = null;
  const fileRows = new FileRows({ onFile, thumbnail, text });

  const rowFor = key => element.querySelector(`[data-key="${CSS.escape(key)}"]`);
  const isNearBottom = () => element.scrollHeight - element.scrollTop - element.clientHeight < 40;

  function clear() {
    element.replaceChildren();
    messages.clear();
    keyById.clear();
    pinnedIds = new Set();
    lastDay = null;
  }

  // Clicking a sent image opens it over the conversation instead of in a new tab. The
  // backdrop is built once, on the first click, and lives in the `.dm` root rather than
  // in the log, which scrolls and would clip it; sass/_thread.scss styles it under `.dm`,
  // so it has to sit inside that root to be styled at all. position:fixed then covers the
  // viewport from there. Escape is listened for only while it is open, so a log in an
  // embed leaves no document listener behind once it closes (see destroy()).
  let viewer = null;
  let viewerImage = null;
  // Which message's image is on show, so markDeleted can tell whether it is this one.
  // The message's key, not its src: an image is usually a data URL, and a browser
  // reflects a relative href back as an absolute one, so neither compares reliably.
  let viewerKey = null;
  let viewerReturnFocus = null;

  function onViewerKeydown(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    closeViewer();
  }

  function buildViewer() {
    viewer = document.createElement('div');
    viewer.className = 'chat-image-viewer hidden';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'chat-image-viewer-close';
    close.setAttribute('aria-label', text.closeImage);
    close.title = text.closeImage;
    const glyph = document.createElement('i');
    glyph.className = 'fas fa-xmark';
    glyph.setAttribute('aria-hidden', 'true');
    close.appendChild(glyph);
    close.addEventListener('click', closeViewer);

    viewerImage = document.createElement('img');
    viewerImage.className = 'chat-image-viewer-image';
    // The image closes it too: the cursor over it is a zoom-out magnifier, so clicking
    // what you just clicked to open is the obvious way back.
    viewerImage.addEventListener('click', closeViewer);

    // Only the backdrop itself, so a click on the image or the button is not counted twice.
    viewer.addEventListener('click', event => {
      if (event.target === viewer) closeViewer();
    });

    viewer.append(close, viewerImage);
    (element.closest('.dm') || document.body).appendChild(viewer);
  }

  function openViewer(source, alt, opener, key) {
    if (!viewer) buildViewer();
    viewerKey = key ?? null;
    viewerImage.src = source;
    viewerImage.alt = alt;
    viewer.setAttribute('aria-label', alt);
    viewer.classList.remove('hidden');
    viewerReturnFocus = opener || null;
    document.addEventListener('keydown', onViewerKeydown);
    viewer.querySelector('.chat-image-viewer-close')?.focus?.();
  }

  function closeViewer() {
    if (!viewer || viewer.classList.contains('hidden')) return;
    viewer.classList.add('hidden');
    viewerKey = null;
    document.removeEventListener('keydown', onViewerKeydown);
    // Back to the thumbnail that opened it, so keyboard focus does not fall to <body>.
    viewerReturnFocus?.focus?.();
    viewerReturnFocus = null;
  }

  // Takes the viewer off the page with its listener. thread.js calls this from its own
  // destroy(), so an embed that is torn down while an image is open leaves nothing behind.
  function destroy() {
    closeViewer();
    viewer?.remove();
    viewer = null;
    viewerImage = null;
  }

  // Scrolls one message into view and marks it .is-found, which sass/_thread.scss
  // washes with the accent and fades. Only the newest find keeps the mark. Returns
  // whether the message is in the log.
  function reveal(key) {
    const row = rowFor(key);
    if (!row) return false;
    element.querySelectorAll('.is-found').forEach(found => found.classList.remove('is-found'));
    // Reading a layout property between taking the class off and putting it back makes
    // the browser restart the fade when the same message is found twice in a row.
    void row.offsetWidth;
    row.classList.add('is-found');
    row.scrollIntoView({ block: 'center' });
    return true;
  }

  function showEmpty(title, hint = '') {
    clear();
    const empty = document.createElement('div');
    empty.className = 'chat-empty';
    empty.dataset.empty = 'true';
    const icon = document.createElement('i');
    icon.className = 'fas fa-comments';
    icon.setAttribute('aria-hidden', 'true');
    const heading = document.createElement('p');
    heading.className = 'chat-empty-title';
    heading.textContent = title;
    empty.append(icon, heading);
    if (hint) {
      const detail = document.createElement('span');
      detail.className = 'chat-empty-hint';
      detail.textContent = hint;
      empty.appendChild(detail);
    }
    element.appendChild(empty);
  }

  // dayLabel says Today or Yesterday for the last two days, which a host may word its own way.
  function dayText(date) {
    const label = dayLabel(date);
    if (label === 'Today') return text.today;
    if (label === 'Yesterday') return text.yesterday;
    return label;
  }

  // An <abbr>, not a <span>: the preset themes recolor every span's text.
  function avatarFor(message, isSelf) {
    const name = isSelf ? me.name : message.senderName;
    const avatar = document.createElement('abbr');
    avatar.className = isSelf ? 'chat-avatar' : `chat-avatar ${tintFor(name)}`;
    avatar.setAttribute('aria-hidden', 'true');
    const initials = initialsFor(name);
    const src = pfpSrc(isSelf ? me.pfp : message.senderPfp);
    if (!src) {
      avatar.textContent = initials;
      return avatar;
    }
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      image.remove();
      avatar.textContent = initials;
    }, { once: true });
    avatar.appendChild(image);
    return avatar;
  }

  function editedTag() {
    const tag = document.createElement('span');
    tag.className = 'chat-msg-edited';
    tag.textContent = text.edited;
    return tag;
  }

  // What rich-text.js's renderDeletedMessage draws, in the log's own wording.
  function showDeleted(body) {
    body.replaceChildren(document.createTextNode(text.deleted));
    body.classList.add('is-deleted');
  }

  // The body's reply quote (if any) goes just before the body; formatBody sees the rest.
  // Clicking the quote scrolls to the original and marks it, as a search result does.
  // A code block goes after the body, then the files shared with the message. Returns what
  // it showed (after formatBody), without the quote's, the files' and the code's markers,
  // which is what the cards are made from: a link inside code makes no card.
  function renderBody(body, stored) {
    const { reply, html: withFiles } = splitReply(richText, stored.body);
    const { items, html: withCode } = FilesMarker.extract(withFiles);
    const { language, code, html } = CodeBlocks.extractMarker(withCode);
    const main = body.parentNode;
    main.querySelector('.chat-reply-quote')?.remove();
    main.querySelector('.chat-code')?.remove();
    if (reply && typeof richText.renderReplyQuote === 'function') {
      main.insertBefore(richText.renderReplyQuote(reply, { onJump: id => reveal(String(id)) }), body);
    }
    body.replaceChildren();
    const shown = shownBody({ ...stored, body: html }, formatBody);
    richText.renderRichMessage(body, shown);
    let after = body;
    if (code !== null) {
      after = new CodeBlock(language, code, { runCode, saveGist, text }).element;
      main.insertBefore(after, body.nextSibling);
    }
    fileRows.render(main, after, items, stored.isSelf ? text.you : stored.senderName);
    return shown;
  }

  // Previews of the links in the message's own text, last before the action bar, so a link
  // only inside a reply's quote makes none.
  function renderCards(main, html) {
    main.querySelector('.chat-cards')?.remove();
    const cards = linkCards ? linkCards(html) : null;
    if (!cards) return;
    cards.classList.add('chat-cards');
    const actions = main.querySelector('.chat-msg-actions');
    if (actions) main.insertBefore(cards, actions);
    else main.appendChild(cards);
  }

  function actionButton(icon, label, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-msg-action';
    button.setAttribute('aria-label', label);
    button.title = label;
    const glyph = document.createElement('i');
    glyph.className = `fas ${icon}`;
    glyph.setAttribute('aria-hidden', 'true');
    button.appendChild(glyph);
    button.addEventListener('click', () => handler(button));
    return button;
  }

  // Which messages are pinned is worked out again only when a pin message comes or goes, a
  // message is deleted or edited, and only rows whose state changed are touched, so a long
  // chat loads without going over every row for every message.
  function refreshPins() {
    const before = pinnedIds;
    pinnedIds = new Set(Conversation.currentPins([...messages.values()]).map(pin => String(pin.message.id)));
    new Set([...before, ...pinnedIds]).forEach(id => {
      if (before.has(id) !== pinnedIds.has(id)) showPinned(id);
    });
  }

  // A message's Pinned mark in its header, and its Pin button's label.
  function showPinned(id) {
    const key = keyById.get(id);
    const row = key === undefined ? null : rowFor(key);
    if (!row || messages.get(key)?.pinNote) return;
    const pinned = pinnedIds.has(id);
    row.classList.toggle('is-pinned', pinned);
    const mark = row.querySelector('.chat-msg-pinned');
    if (pinned && !mark) {
      const tag = document.createElement('b');
      tag.className = 'chat-msg-pinned';
      const glyph = document.createElement('i');
      glyph.className = 'fas fa-thumbtack';
      glyph.setAttribute('aria-hidden', 'true');
      tag.append(glyph, ` ${text.pinned}`);
      row.querySelector('.chat-msg-meta')?.appendChild(tag);
    } else if (!pinned && mark) {
      mark.remove();
    }
    const button = row.querySelector('[data-action="pin"]');
    if (button) {
      const label = pinned ? text.unpinMessage : text.pinMessage;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.setAttribute('aria-pressed', String(pinned));
    }
  }

  // A pin or unpin message is a one-line note: who did it, and the message's words as a
  // link to it (cut like a reply's quote).
  function appendPinNote(message, pin, isSelf) {
    messages.set(message.key, { ...message, isSelf, pinNote: pin });
    const row = document.createElement('div');
    row.className = 'chat-pin-note';
    row.dataset.key = message.key;
    const line = document.createElement('p');
    line.className = 'chat-system';
    const glyph = document.createElement('i');
    glyph.className = 'fas fa-thumbtack';
    glyph.setAttribute('aria-hidden', 'true');
    const name = isSelf ? text.you : message.senderName;
    line.append(glyph, ` ${fillText(pin.action === 'pin' ? text.pinnedNote : text.unpinnedNote, { name })} `);
    const targetKey = keyById.get(pin.id);
    const target = targetKey === undefined ? null : messages.get(targetKey);
    const words = target && !target.deleted ? Conversation.plainText(splitReply(richText, target.body).html) : '';
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.className = 'chat-system-link';
    jump.textContent = words ? (words.length > 90 ? `${words.slice(0, 89)}…` : words) : text.aMessage;
    jump.addEventListener('click', () => {
      const key = keyById.get(pin.id);
      if (key !== undefined) reveal(key);
    });
    line.appendChild(jump);
    row.appendChild(line);
    element.appendChild(row);
  }

  function append(message, isSelf) {
    if (messages.has(message.key)) return;
    element.querySelector('[data-empty]')?.remove();
    const stickToBottom = isNearBottom();
    messages.set(message.key, { ...message, isSelf });

    const sentAt = message.sentAt ? new Date(message.sentAt) : null;
    const when = sentAt && !Number.isNaN(sentAt.getTime()) ? sentAt : null;
    if (when && dayKey(when) !== lastDay) {
      lastDay = dayKey(when);
      const divider = document.createElement('div');
      divider.className = 'chat-day';
      divider.setAttribute('role', 'separator');
      divider.textContent = dayText(when);
      element.appendChild(divider);
    }

    // An edited message is never a pin (Conversation.currentPins), so it draws as text.
    const pin = message.deleted || message.edited ? null : Conversation.extractPinMarker(message.body);
    if (pin?.action) {
      appendPinNote(message, pin, isSelf);
      refreshPins();
      if (stickToBottom) element.scrollTop = element.scrollHeight;
      onChange();
      return;
    }
    if (message.id !== undefined && message.id !== null) keyById.set(String(message.id), message.key);

    const row = document.createElement('div');
    row.className = isSelf ? 'chat-msg is-self' : 'chat-msg';
    row.dataset.key = message.key;
    const main = document.createElement('div');
    main.className = 'chat-msg-main';
    const meta = document.createElement('div');
    meta.className = 'chat-msg-meta';
    const sender = document.createElement('span');
    sender.className = 'chat-msg-sender';
    sender.textContent = isSelf ? text.you : message.senderName;
    meta.appendChild(sender);
    if (when) {
      const time = document.createElement('time');
      time.className = 'chat-msg-time';
      time.dateTime = when.toISOString();
      time.textContent = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      meta.appendChild(time);
    }
    if (message.edited && !message.deleted) meta.appendChild(editedTag());

    const body = document.createElement('span');
    body.className = 'chat-msg-body';
    main.append(meta, body);
    if (message.deleted) {
      showDeleted(body);
    } else {
      const shown = renderBody(body, messages.get(message.key));
      if (message.image) {
        const imageSource = pfpSrc(message.image);
        const imageLink = document.createElement('a');
        imageLink.className = 'chat-msg-image-link';
        // Still a real link to the image: middle-click, Ctrl/Cmd-click and the context
        // menu's "Open in new tab" keep working, and the handler below leaves those alone.
        // A plain left click is taken over and shows the viewer instead.
        imageLink.href = imageSource;
        imageLink.target = '_blank';
        imageLink.rel = 'noopener noreferrer';
        imageLink.setAttribute('aria-label', fillText(text.openImage, { name: message.senderName }));
        imageLink.title = fillText(text.openImage, { name: message.senderName });
        imageLink.addEventListener('click', event => {
          if (event.defaultPrevented) return;
          if ((event.button ?? 0) !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openViewer(imageSource, fillText(text.imageFrom, { name: message.senderName }), imageLink, message.key);
        });
        const image = document.createElement('img');
        image.className = 'ocs__image-frame';
        image.src = imageSource;
        image.alt = fillText(text.imageFrom, { name: message.senderName });
        image.loading = 'lazy';
        // An image has no height until it loads, so the scroll to the newest message
        // below happens before it takes its room and would leave it cut off at the foot
        // of the log. If the log was at the bottom when the message arrived, go back
        // there once the image has its size.
        if (stickToBottom) {
          image.addEventListener('load', () => {
            element.scrollTop = element.scrollHeight;
          }, { once: true });
        }
        imageLink.appendChild(image);
        main.appendChild(imageLink);
      }
      renderCards(main, shown);
    }
    // A message saved before ids existed can't be replied to, edited or deleted. Anyone's
    // message can go on your calendar, so that button is not limited to your own.
    if (!readOnly && message.id && !message.deleted) {
      const buttons = [];
      if (onReply) buttons.push(actionButton('fa-reply', text.replyMessage, () => onReply(messages.get(message.key))));
      if (onPin) {
        const pinButton = actionButton('fa-thumbtack', text.pinMessage, () => onPin(messages.get(message.key), pinnedIds.has(String(message.id))));
        pinButton.dataset.action = 'pin';
        pinButton.setAttribute('aria-pressed', 'false');
        buttons.push(pinButton);
      }
      if (onSchedule) buttons.push(actionButton('fa-calendar-plus', text.addToCalendar, button => onSchedule(messages.get(message.key), button)));
      if (isSelf) {
        buttons.push(
          actionButton('fa-pen', text.editMessage, () => onEdit(messages.get(message.key))),
          actionButton('fa-trash', text.deleteMessage, button => onDelete(messages.get(message.key), button)),
        );
      }
      if (buttons.length) {
        const actions = document.createElement('div');
        actions.className = 'chat-msg-actions';
        actions.append(...buttons);
        main.appendChild(actions);
      }
    }

    row.append(avatarFor(message, isSelf), main);
    element.appendChild(row);
    if (message.id !== undefined && message.id !== null && pinnedIds.has(String(message.id))) showPinned(String(message.id));
    if (stickToBottom) element.scrollTop = element.scrollHeight;
    onChange();
  }

  function updateBody(key, body) {
    const stored = messages.get(key);
    // A pin note has no body to draw again; a pin isn't changed by editing.
    if (!stored || stored.deleted || stored.pinNote) return;
    stored.body = body;
    stored.edited = true;
    refreshPins();
    const row = rowFor(key);
    if (row) {
      const bodyElement = row.querySelector('.chat-msg-body');
      renderCards(bodyElement.parentNode, renderBody(bodyElement, stored));
      const meta = row.querySelector('.chat-msg-meta');
      if (!meta.querySelector('.chat-msg-edited')) meta.appendChild(editedTag());
    }
    onChange();
  }

  function markDeleted(key) {
    const stored = messages.get(key);
    // A deleted pin message takes its pin, and its note, with it.
    if (stored?.pinNote) {
      stored.deleted = true;
      rowFor(key)?.remove();
      refreshPins();
      onChange();
      return;
    }
    if (stored) {
      stored.deleted = true;
      stored.body = '';
    }
    refreshPins(); // a deleted message is no longer pinned
    const row = rowFor(key);
    if (!row) return;
    showDeleted(row.querySelector('.chat-msg-body'));
    row.querySelector('.chat-reply-quote')?.remove();
    row.querySelector('.chat-code')?.remove();
    row.querySelector('.chat-files')?.remove();
    row.querySelector('.chat-file-gallery')?.remove();
    row.querySelector('.chat-cards')?.remove();
    row.querySelector('.chat-msg-actions')?.remove();
    row.querySelector('.chat-msg-edited')?.remove();
    // If the viewer is showing the image of the message just deleted, close it rather
    // than leave it open over a conversation that no longer has that image.
    if (viewerKey === key) closeViewer();
    row.querySelector('.chat-msg-image-link')?.remove();
    onChange();
  }

  // A line between messages that isn't anyone's message. `link` turns part of the line
  // into a control: { label, onClick }, a button rather than an anchor.
  function note(message, link) {
    element.querySelector('[data-empty]')?.remove();
    const stickToBottom = isNearBottom();
    const line = document.createElement('p');
    line.className = 'chat-system';
    line.textContent = message;
    if (link) {
      const control = document.createElement('button');
      control.type = 'button';
      control.className = 'chat-system-link';
      control.textContent = link.label;
      control.addEventListener('click', () => link.onClick(control));
      line.append(' ', control);
    }
    element.appendChild(line);
    if (stickToBottom) element.scrollTop = element.scrollHeight;
  }

  return {
    clear, showEmpty, append, updateBody, markDeleted, note, reveal, destroy,
    has: key => messages.has(key),
    get: key => messages.get(key),
    // The messages as loaded, oldest first, pin notes included (the Shared panel reads them).
    list: () => [...messages.values()],
    isPinned: id => pinnedIds.has(String(id)),
    // For tests and a host that wants to close the viewer itself.
    isViewerOpen: () => Boolean(viewer) && !viewer.classList.contains('hidden'),
    closeViewer,
  };
}
