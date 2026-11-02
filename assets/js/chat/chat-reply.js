// Replying to a chat message: the class announcement chats
// (_projects/systems/courses/_includes/announcement_chat.html) and /dm
// (_projects/systems/messages/). rich-text.js re-exports this module, so /dm's
// modules reach it through the `richText` the page hands them.
//
// The chat sanitizer strips every attribute, so which message a reply answers
// can't ride along as HTML. Like [[event:...]] and [[lesson:<url>]], it travels
// as a plain-text marker at the start of the body, and is taken out again
// before the body renders:
//
//   [[reply:<message id>|<sender>|<excerpt>]] <the reply's own html>
//
// sender and excerpt are URL-encoded, so neither can close the marker early.
// The excerpt is a copy taken when the reply was sent: the quote still reads
// right after the original is edited, deleted or scrolled out of history.

export const REPLY_EXCERPT_LENGTH = 90;

const REPLY_PATTERN = /^\s*\[\[reply:([^|\]]*)\|([^|\]]*)\|([^\]]*)\]\]\s*/;
// Other chat markers, which never belong in a quoted excerpt
const ANY_MARKER_PATTERN = /\[\[(?:reply|event|lesson):[^\]]*\]\]/g;
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

function safeDecode(value) {
  try { return decodeURIComponent(value || ''); } catch (_) { return value || ''; }
}

// The message as one short line of plain text, for the quote above a reply.
// Works on the sanitized HTML string, so it runs without a DOM.
export function replyExcerpt(html, maxLength = REPLY_EXCERPT_LENGTH) {
  const text = String(html || '')
    .replace(ANY_MARKER_PATTERN, ' ')
    .replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, entity => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

// { id, sender, excerpt } → the marker. The id is required: it is how the quote
// finds the original on screen.
export function encodeReplyMarker({ id, sender, excerpt }) {
  const messageId = String(id ?? '').trim();
  if (!messageId || /[|\]]/.test(messageId)) {
    throw new TypeError(`encodeReplyMarker: a reply needs the message's id, not ${JSON.stringify(id)}`);
  }
  return `[[reply:${messageId}|${encodeURIComponent(sender || '')}|${encodeURIComponent(excerpt || '')}]]`;
}

// The html to send: the reply's marker, then what was typed. No reply, no change.
export function addReplyMarker(html, reply) {
  if (!reply) return html;
  return `${encodeReplyMarker(reply)} ${html || ''}`.trim();
}

// A stored body → { reply: { id, sender, excerpt } | null, html: the body without its marker }
export function extractReplyMarker(raw) {
  const text = String(raw ?? '');
  const match = text.match(REPLY_PATTERN);
  if (!match) return { reply: null, html: text };
  return {
    reply: { id: match[1], sender: safeDecode(match[2]), excerpt: safeDecode(match[3]) },
    html: text.slice(match[0].length),
  };
}

// The quote shown above a reply's body. A button, so clicking it jumps to the
// original (onJump gets the replied-to message's id). <b> and <small> rather than
// spans: the preset themes recolor every span's text.
export function renderReplyQuote(reply, { onJump = null } = {}) {
  const quote = document.createElement('button');
  quote.type = 'button';
  quote.className = 'chat-reply-quote';
  quote.title = 'Show the original message';
  const sender = document.createElement('b');
  sender.className = 'chat-reply-quote-sender';
  sender.textContent = reply.sender || 'Someone';
  const excerpt = document.createElement('small');
  excerpt.className = 'chat-reply-quote-text';
  excerpt.textContent = reply.excerpt || '…';
  quote.append(sender, excerpt);
  if (onJump) quote.addEventListener('click', () => onJump(reply.id));
  return quote;
}

// The "Replying to …" strip above the composer, with its own Cancel. Starts hidden.
export function createReplyBar({ onCancel }) {
  const bar = document.createElement('div');
  bar.className = 'chat-reply-bar';
  bar.hidden = true;
  const icon = document.createElement('i');
  icon.className = 'fas fa-reply';
  icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('div');
  text.className = 'chat-reply-bar-text';
  const heading = document.createElement('b');
  const excerpt = document.createElement('small');
  text.append(heading, excerpt);
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'chat-reply-bar-cancel';
  cancel.setAttribute('aria-label', 'Cancel reply');
  cancel.title = 'Cancel reply';
  cancel.textContent = '×';
  cancel.addEventListener('click', () => onCancel());
  bar.append(icon, text, cancel);

  return {
    element: bar,
    show(reply) {
      heading.textContent = `Replying to ${reply.sender || 'a message'}`;
      excerpt.textContent = reply.excerpt;
      bar.hidden = false;
    },
    hide() {
      bar.hidden = true;
    },
  };
}

// Scrolls a message into view and flashes it, after its reply's quote is clicked.
export function highlightMessage(row) {
  if (!row) return;
  row.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  row.classList.add('is-reply-target');
  setTimeout(() => row.classList.remove('is-reply-target'), 1600);
}
