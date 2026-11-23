// Pure helpers for what a conversation holds beyond its messages: pins, links and media.
// No DOM, no fetch: they read the messages already loaded (thread.js keeps every one).
//
// Pinning is a message of its own, like Slack's "pinned a message": its body is
// [[pin:<message id>]] or [[unpin:<message id>]], so every member sees the same pins with
// no new storage, and the log shows it as a one-line note.
import { FilesMarker, SharedFiles } from './files-model.js';

const PIN_PATTERN = /^\s*\[\[(pin|unpin):([^\]|]+)\]\]\s*$/;

function checkedId(id) {
  const text = String(id ?? '').trim();
  if (!text || /[\][|]/.test(text)) throw new TypeError(`A pin needs a message id, not ${JSON.stringify(id)}`);
  return text;
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;
// Punctuation that ends a sentence, not the link.
const trimUrl = url => url.replace(/[.,;:!?)\]'"]+$/, '');
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
    return match ? { action: match[1], id: match[2], html: '' } : { action: null, id: null, html: text };
  }

  /**
   * The messages pinned now, newest pin first. Pins and unpins are replayed in order;
   * pinning again keeps the first pin; a deleted message drops out.
   * @param {Array} messages the conversation's messages, oldest first
   * @returns {Array<{message: object, pinnedBy: string, pinnedAt: string}>}
   */
  static currentPins(messages) {
    const byId = new Map(messages.map(message => [String(message.id), message]));
    const pins = new Map();
    messages.forEach(message => {
      if (message.deleted) return;
      const { action, id } = Conversation.extractPinMarker(message.body);
      if (action === 'pin' && !pins.has(id)) pins.set(id, { pinnedBy: message.senderName, pinnedAt: message.sentAt });
      if (action === 'unpin') pins.delete(id);
    });
    return [...pins.entries()]
      .map(([id, pin]) => ({ ...pin, message: byId.get(id) }))
      .filter(pin => pin.message && !pin.message.deleted)
      .reverse();
  }

  /**
   * A body as one line of plain text: no markers, tags or entities.
   * @param {string} body
   * @returns {string}
   */
  static plainText(body) {
    return String(body ?? '')
      .replace(/\[\[(?:reply|event|lesson|files|code|pin|unpin):[^\]]*\]\]/g, ' ')
      .replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, entity => ENTITIES[entity])
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
      (Conversation.plainText(message.body).match(URL_PATTERN) || []).map(trimUrl).forEach(url => {
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
      if (message.image) media.push({ ...base, kind: 'image', src: message.image });
    });
    return media;
  }
}
