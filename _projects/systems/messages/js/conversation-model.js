// Pure helpers for what a conversation holds beyond its messages: pins, links and media.
// No DOM, no fetch: they read the messages already loaded (thread.js keeps every one).
//
// Pinning is a message of its own, like Slack's "pinned a message": its body is
// [[pin:<message id>]] or [[unpin:<message id>]], so every member sees the same pins with
// no new storage, and the log shows it as a one-line note.
import { extractFilesMarker, fileKind } from './files-model.js';

const PIN_PATTERN = /^\s*\[\[(pin|unpin):([^\]|]+)\]\]\s*$/;

function checkedId(id) {
  const text = String(id ?? '').trim();
  if (!text || /[\][|]/.test(text)) throw new TypeError(`A pin needs a message id, not ${JSON.stringify(id)}`);
  return text;
}

export const pinMarker = id => `[[pin:${checkedId(id)}]]`;
export const unpinMarker = id => `[[unpin:${checkedId(id)}]]`;

// A body → { action: 'pin' | 'unpin' | null, id, html }. Only a body that is nothing but
// the marker counts, so quoting one in a sentence doesn't pin anything.
export function extractPinMarker(raw) {
  const text = String(raw ?? '');
  const match = text.match(PIN_PATTERN);
  return match ? { action: match[1], id: match[2], html: '' } : { action: null, id: null, html: text };
}

// The messages pinned now, newest pin first: [{ message, pinnedBy, pinnedAt }]. Pins and
// unpins are replayed in order; pinning again keeps the first pin; a deleted message drops out.
export function currentPins(messages) {
  const byId = new Map(messages.map(message => [String(message.id), message]));
  const pins = new Map();
  messages.forEach(message => {
    if (message.deleted) return;
    const { action, id } = extractPinMarker(message.body);
    if (action === 'pin' && !pins.has(id)) pins.set(id, { pinnedBy: message.senderName, pinnedAt: message.sentAt });
    if (action === 'unpin') pins.delete(id);
  });
  return [...pins.entries()]
    .map(([id, pin]) => ({ ...pin, message: byId.get(id) }))
    .filter(pin => pin.message && !pin.message.deleted)
    .reverse();
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

// A body as one line of plain text: no markers, tags or entities.
export function plainText(body) {
  return String(body ?? '')
    .replace(/\[\[(?:reply|event|lesson|files|code|pin|unpin):[^\]]*\]\]/g, ' ')
    .replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, entity => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;
// Punctuation that ends a sentence, not the link.
const trimUrl = url => url.replace(/[.,;:!?)\]'"]+$/, '');

const newestFirst = (a, b) => String(b.sentAt || '').localeCompare(String(a.sentAt || ''));

// Every link in the conversation, once each: [{ url, host, github, messageKey, sender,
// sentAt }], GitHub links first, then newest first.
export function linksIn(messages) {
  const seen = new Set();
  const links = [];
  [...messages].sort(newestFirst).forEach(message => {
    if (message.deleted) return;
    (plainText(message.body).match(URL_PATTERN) || []).map(trimUrl).forEach(url => {
      if (seen.has(url)) return;
      let host;
      try {
        host = new URL(url).host;
      } catch {
        return;
      }
      seen.add(url);
      links.push({ url, host, github: host === 'github.com' || host === 'gist.github.com', messageKey: message.key, sender: message.senderName, sentAt: message.sentAt });
    });
  });
  return [...links.filter(link => link.github), ...links.filter(link => !link.github)];
}

// Pictures and videos in the conversation, newest first: an image sent in a message
// ({ kind: 'image', src }) or a shared image or video file ({ kind, file }).
export function mediaIn(messages) {
  const media = [];
  [...messages].sort(newestFirst).forEach(message => {
    if (message.deleted) return;
    const base = { messageKey: message.key, sender: message.senderName, sentAt: message.sentAt };
    extractFilesMarker(String(message.body ?? '').replace(/^\s*\[\[reply:[^\]]*\]\]\s*/, '')).items
      .filter(item => item.type === 'file' && ['image', 'video'].includes(fileKind(item.path).preview))
      .forEach(item => media.push({ ...base, kind: fileKind(item.path).preview, file: item }));
    if (message.image) media.push({ ...base, kind: 'image', src: message.image });
  });
  return media;
}
