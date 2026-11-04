// The open conversation's messages, drawn with the chat-* class names the course chats
// use and styled for /dm in sass/_thread.scss: a divider for each day, then each message
// with its avatar, sender and time, and edit and delete buttons on your own messages
// (none in a read-only log).
import { dayKey, dayLabel, initialsFor, pfpSrc, tintFor } from './messages-model.js';

// What the log says, worded for /dm. A host passes its own wording for any of these in
// `texts`; {name} is filled in.
export const LOG_TEXTS = Object.freeze({
  you: 'You',
  edited: '(edited)',
  editMessage: 'Edit message',
  deleteMessage: 'Delete message',
  imageFrom: 'Image from {name}',
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

export function createMessageLog(element, { richText, me, onEdit, onDelete, readOnly = false, texts = {}, formatBody = null }) {
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
      richText.renderRichMessage(body, shownBody(messages.get(message.key), formatBody));
      if (message.image) {
        const image = document.createElement('img');
        image.className = 'ocs__image-frame';
        image.src = pfpSrc(message.image);
        image.alt = fillText(text.imageFrom, { name: message.senderName });
        image.loading = 'lazy';
        main.appendChild(image);
      }
    }
    // A message saved before ids existed can't be edited or deleted.
    if (!readOnly && isSelf && message.id && !message.deleted) {
      const actions = document.createElement('div');
      actions.className = 'chat-msg-actions';
      actions.append(
        actionButton('fa-pen', text.editMessage, () => onEdit(messages.get(message.key))),
        actionButton('fa-trash', text.deleteMessage, button => onDelete(messages.get(message.key), button)),
      );
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
    const bodyElement = row.querySelector('.chat-msg-body');
    bodyElement.replaceChildren();
    richText.renderRichMessage(bodyElement, shownBody(stored, formatBody));
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
    row.querySelector('.chat-msg-actions')?.remove();
    row.querySelector('.chat-msg-edited')?.remove();
    row.querySelector('img.ocs__image-frame')?.remove();
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
    clear, showEmpty, append, updateBody, markDeleted, note,
    has: key => messages.has(key),
    get: key => messages.get(key),
  };
}
