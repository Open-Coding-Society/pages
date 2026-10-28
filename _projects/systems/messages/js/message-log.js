// The open conversation's messages, drawn with the chat classes the course chats share
// (the .announcement-chat rules in _projects/systems/courses/sass/main.scss): a divider
// for each day, then each message with its avatar, sender and time, and edit and delete
// buttons on your own messages.
import { dayKey, dayLabel, initialsFor, pfpSrc, tintFor } from './messages-model.js';

export function createMessageLog(element, { richText, me, onEdit, onDelete }) {
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
    tag.textContent = '(edited)';
    return tag;
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
      divider.textContent = dayLabel(when);
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
    sender.textContent = isSelf ? 'You' : message.senderName;
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
      richText.renderDeletedMessage(body);
    } else {
      richText.renderRichMessage(body, message.body);
      if (message.image) {
        const image = document.createElement('img');
        image.className = 'ocs__image-frame';
        image.src = pfpSrc(message.image);
        image.alt = `Image from ${message.senderName}`;
        image.loading = 'lazy';
        main.appendChild(image);
      }
    }
    // A message saved before ids existed can't be edited or deleted.
    if (isSelf && message.id && !message.deleted) {
      const actions = document.createElement('div');
      actions.className = 'chat-msg-actions';
      actions.append(
        actionButton('fa-pen', 'Edit message', () => onEdit(messages.get(message.key))),
        actionButton('fa-trash', 'Delete message', button => onDelete(messages.get(message.key), button)),
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
    richText.renderRichMessage(bodyElement, body);
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
    richText.renderDeletedMessage(row.querySelector('.chat-msg-body'));
    row.querySelector('.chat-msg-actions')?.remove();
    row.querySelector('.chat-msg-edited')?.remove();
    row.querySelector('img.ocs__image-frame')?.remove();
  }

  // A line between messages that isn't anyone's message, like a shared file.
  // `link` turns part of the line into a control: { label, onClick }. A button, not an
  // anchor, because the file's bytes are fetched on click rather than sitting at a URL.
  function note(text, link) {
    element.querySelector('[data-empty]')?.remove();
    const stickToBottom = isNearBottom();
    const line = document.createElement('p');
    line.className = 'chat-system';
    line.textContent = text;
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
