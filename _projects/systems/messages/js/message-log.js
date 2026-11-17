// The open conversation's messages, drawn with the chat-* class names the course chats
// use and styled for /dm in sass/_thread.scss: a divider for each day, then each message
// with its avatar, sender and time, a Reply button, and edit and delete buttons on your
// own messages (none in a read-only log). A reply shows a quote of the message it
// answers, from the [[reply:...]] marker at the start of its body (assets/js/chat/chat-reply.js).
import { dayKey, dayLabel, initialsFor, pfpSrc, tintFor } from './messages-model.js';

// What the log says, worded for /dm. A host passes its own wording for any of these in
// `texts`; {name} is filled in.
export const LOG_TEXTS = Object.freeze({
  you: 'You',
  edited: '(edited)',
  editMessage: 'Edit message',
  deleteMessage: 'Delete message',
  replyMessage: 'Reply',
  imageFrom: 'Image from {name}',
  openImage: 'View image from {name} larger',
  closeImage: 'Close image',
  deleted: 'This message was deleted.',
  today: 'Today',
  yesterday: 'Yesterday',
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

export function createMessageLog(element, {
  richText, me, onEdit, onDelete, onReply = null, readOnly = false, texts = {}, formatBody = null,
}) {
  if (formatBody !== null && typeof formatBody !== 'function') {
    throw new TypeError('createMessageLog: formatBody must be a function or null');
  }
  const text = withTexts(LOG_TEXTS, texts);
  const messages = new Map();
  let lastDay = null;

  const rowFor = key => element.querySelector(`[data-key="${CSS.escape(key)}"]`);
  const isNearBottom = () => element.scrollHeight - element.scrollTop - element.clientHeight < 40;

  function clear() {
    element.replaceChildren();
    messages.clear();
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
  function renderBody(body, stored) {
    const { reply, html } = splitReply(richText, stored.body);
    const main = body.parentNode;
    main.querySelector('.chat-reply-quote')?.remove();
    if (reply && typeof richText.renderReplyQuote === 'function') {
      main.insertBefore(richText.renderReplyQuote(reply, { onJump: id => reveal(String(id)) }), body);
    }
    body.replaceChildren();
    richText.renderRichMessage(body, shownBody({ ...stored, body: html }, formatBody));
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
      renderBody(body, messages.get(message.key));
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
    }
    // A message saved before ids existed can't be replied to, edited or deleted.
    if (!readOnly && message.id && !message.deleted && (onReply || isSelf)) {
      const actions = document.createElement('div');
      actions.className = 'chat-msg-actions';
      if (onReply) actions.append(actionButton('fa-reply', text.replyMessage, () => onReply(messages.get(message.key))));
      if (isSelf) {
        actions.append(
          actionButton('fa-pen', text.editMessage, () => onEdit(messages.get(message.key))),
          actionButton('fa-trash', text.deleteMessage, button => onDelete(messages.get(message.key), button)),
        );
      }
      main.appendChild(actions);
    }

    row.append(avatarFor(message, isSelf), main);
    element.appendChild(row);
    if (stickToBottom) element.scrollTop = element.scrollHeight;
  }

  function updateBody(key, body) {
    const stored = messages.get(key);
    if (!stored || stored.deleted) return;
    stored.body = body;
    stored.edited = true;
    const row = rowFor(key);
    if (!row) return;
    renderBody(row.querySelector('.chat-msg-body'), stored);
    const meta = row.querySelector('.chat-msg-meta');
    if (!meta.querySelector('.chat-msg-edited')) meta.appendChild(editedTag());
  }

  function markDeleted(key) {
    const stored = messages.get(key);
    if (stored) {
      stored.deleted = true;
      stored.body = '';
    }
    const row = rowFor(key);
    if (!row) return;
    showDeleted(row.querySelector('.chat-msg-body'));
    row.querySelector('.chat-reply-quote')?.remove();
    row.querySelector('.chat-msg-actions')?.remove();
    row.querySelector('.chat-msg-edited')?.remove();
    // If the viewer is showing the image of the message just deleted, close it rather
    // than leave it open over a conversation that no longer has that image.
    if (viewerKey === key) closeViewer();
    row.querySelector('.chat-msg-image-link')?.remove();
  }

  // A line between messages that isn't anyone's message, like a shared file.
  // `link` turns part of the line into a control: { label, onClick }. A button, not an
  // anchor, because the file's bytes are fetched on click rather than sitting at a URL.
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
    // For tests and a host that wants to close the viewer itself.
    isViewerOpen: () => Boolean(viewer) && !viewer.classList.contains('hidden'),
    closeViewer,
  };
}
