// Pure helpers for what a conversation holds beyond its messages: pins, links and media.
// No DOM, no fetch: they read the messages already loaded (thread.js keeps every one).
//
// Pinning is a message of its own, like Slack's "pinned a message": its body is
// [[pin:<message id>]] or [[unpin:<message id>]], so every member sees the same pins with
// no new storage, and the log shows it as a one-line note.
import { FilesMarker, SharedFiles } from './files-model.js';
import { pfpSrc } from './messages-model.js';

const PIN_PATTERN = /^\s*\[\[(pin|unpin):([^\]|]+)\]\]\s*$/;

function checkedId(id) {
  const text = String(id ?? '').trim();
  if (!text || /[\][|]/.test(text)) throw new TypeError(`A pin needs a message id, not ${JSON.stringify(id)}`);
  return text;
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const decode = text => text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, entity => ENTITIES[entity]);
// The chat's markers: never words, and a code block's text is escaped but its quotes aren't.
const MARKERS = /\[\[(?:reply|event|lesson|files|code|pin|unpin):[^\]]*\]\]/g;
const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;
const HREF_PATTERN = /href\s*=\s*"(https?:\/\/[^"]+)"/gi;
const count = (text, character) => text.split(character).length - 1;
// Punctuation that ends a sentence, not the link. A closing parenthesis is the link's own
// when the link opened one, as in Computer_(programming).
function trimUrl(url) {
  let trimmed = url.replace(/[.,;:!?\]'"]+$/, '');
  while (trimmed.endsWith(')') && count(trimmed, '(') < count(trimmed, ')')) {
    trimmed = trimmed.slice(0, -1).replace(/[.,;:!?\]'"]+$/, '');
  }
  return trimmed;
}
const newestFirst = (a, b) => String(b.sentAt || '').localeCompare(String(a.sentAt || ''));

/**
 * What a conversation's loaded messages hold: its pins, its links and media, and a
 * message's words as plain text.
 */
export class Conversation {
  /**
   * @param {string|number} id the message to pin
   * @returns {string} the body of a message that pins it
   */
  static pinMarker(id) {
    return `[[pin:${checkedId(id)}]]`;
  }

  /**
   * @param {string|number} id the message to unpin
   * @returns {string} the body of a message that unpins it
   */
  static unpinMarker(id) {
    return `[[unpin:${checkedId(id)}]]`;
  }

  /**
   * Reads a pin or unpin from a body. Only a body that is nothing but the marker counts, so
   * quoting one in a sentence doesn't pin anything.
   * @param {string} raw
   * @returns {{action: 'pin'|'unpin'|null, id: string|null, html: string}}
   */
  static extractPinMarker(raw) {
    const text = String(raw ?? '');
    const match = text.match(PIN_PATTERN);
    return match ? { action: match[1], id: match[2].trim(), html: '' } : { action: null, id: null, html: text };
  }

  /**
   * The messages pinned now, newest pin first. Pins and unpins are replayed in order;
   * pinning again keeps the first pin; a deleted message drops out. A pin message can't be
   * edited, so an edited message whose body reads like one is only text, as the log shows
   * it; and a pin of a pin message counts for nothing.
   * @param {Array} messages the conversation's messages, oldest first
   * @returns {Array<{message: object, pinnedBy: string, pinnedAt: string}>}
   */
  static currentPins(messages) {
    const byId = new Map(messages.map(message => [String(message.id), message]));
    const pins = new Map();
    messages.forEach(message => {
      if (message.deleted || message.edited) return;
      const { action, id } = Conversation.extractPinMarker(message.body);
      if (action === 'pin' && !pins.has(id)) pins.set(id, { pinnedBy: message.senderName, pinnedAt: message.sentAt });
      if (action === 'unpin') pins.delete(id);
    });
    return [...pins.entries()]
      .map(([id, pin]) => ({ ...pin, message: byId.get(id) }))
      .filter(pin => pin.message && !pin.message.deleted && !Conversation.extractPinMarker(pin.message.body).action)
      .reverse();
  }

  /**
   * A body as one line of plain text: no markers, tags or entities.
   * @param {string} body
   * @returns {string}
   */
  static plainText(body) {
    return decode(String(body ?? '')
      .replace(MARKERS, ' ')
      .replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, ' ')
      .replace(/<[^>]*>/g, ''))
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Every link in the conversation, once each, GitHub links first, then newest first.
   * @param {Array} messages
   * @returns {Array<{url: string, host: string, github: boolean, messageKey: string, sender: string, sentAt: string}>}
   */
  static linksIn(messages) {
    const seen = new Set();
    const links = [];
    [...messages].sort(newestFirst).forEach(message => {
      if (message.deleted) return;
      // A named link's address is only in its href, which plainText drops with the tag.
      const named = [...String(message.body ?? '').replace(MARKERS, ' ').matchAll(HREF_PATTERN)].map(match => decode(match[1]));
      const shown = (Conversation.plainText(message.body).match(URL_PATTERN) || []).map(trimUrl);
      [...named, ...shown].forEach(url => {
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

  /**
   * Pictures and videos in the conversation, newest first: an image sent in a message
   * ({ kind: 'image', src }) or a shared image or video file ({ kind, file }).
   * @param {Array} messages
   * @returns {Array}
   */
  static mediaIn(messages) {
    const media = [];
    [...messages].sort(newestFirst).forEach(message => {
      if (message.deleted) return;
      const base = { messageKey: message.key, sender: message.senderName, sentAt: message.sentAt };
      FilesMarker.extract(String(message.body ?? '').replace(/^\s*\[\[reply:[^\]]*\]\]\s*/, '')).items
        .filter(item => item.type === 'file' && ['image', 'video'].includes(SharedFiles.fileKind(item.path).preview))
        .forEach(item => media.push({ ...base, kind: SharedFiles.fileKind(item.path).preview, file: item }));
      // As the log shows it: a picture stored as bare base64 gets its data: prefix.
      if (message.image) media.push({ ...base, kind: 'image', src: pfpSrc(message.image) });
    });
    return media;
  }
}
