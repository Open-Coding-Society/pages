// Replies in the course chats and /dm (assets/js/chat/chat-reply.js): the reply marker
// round-trips through a message body, and the quote's excerpt is plain text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addReplyMarker, encodeReplyMarker, extractReplyMarker, replyExcerpt, stripChatMarkers,
} from '../assets/js/chat/chat-reply.js';
import { imageFromClipboard } from '../assets/js/chat/chat-image.js';

test('a reply marker round-trips, even when the sender or excerpt holds | and ]]', () => {
  const reply = { id: '42', sender: 'Ada | Lovelace', excerpt: 'see [[event]] ]] here' };
  const body = addReplyMarker('<b>Agreed</b>', reply);
  assert.match(body, /^\[\[reply:42\|/);
  assert.deepEqual(extractReplyMarker(body), { reply, html: '<b>Agreed</b>' });
});

test('a body without a marker comes back unchanged, and no reply adds none', () => {
  assert.deepEqual(extractReplyMarker('plain [[reply:in the middle]]'), { reply: null, html: 'plain [[reply:in the middle]]' });
  assert.equal(addReplyMarker('hi', null), 'hi');
});

test('a reply needs the message id', () => {
  assert.throws(() => encodeReplyMarker({ id: '', sender: 'a', excerpt: 'b' }), /message's id/);
  assert.throws(() => encodeReplyMarker({ id: '4|2', sender: 'a', excerpt: 'b' }), /message's id/);
});

test('the excerpt is one short plain-text line without markup or markers', () => {
  const html = '[[reply:1|a|b]] <b>Bold</b> &amp; <i>more</i><br>next line [[event:abc]]';
  assert.equal(replyExcerpt(html), 'Bold & more next line');
  const long = replyExcerpt('word '.repeat(40), 20);
  assert.equal(long.length, 20);
  assert.ok(long.endsWith('…'));
});

test('search excerpts lose their markers', () => {
  assert.equal(stripChatMarkers('[[reply:9|Bob|hey]] the review is Friday'), 'the review is Friday');
});

test('imageFromClipboard finds a pasted image among other clipboard items', () => {
  const png = { type: 'image/png', name: 'shot.png' };
  const clipboard = {
    items: [
      { kind: 'string', type: 'text/html' },
      { kind: 'file', type: 'image/png', getAsFile: () => png },
    ],
  };
  assert.equal(imageFromClipboard(clipboard), png);
  assert.equal(imageFromClipboard({ items: [{ kind: 'string', type: 'text/plain' }] }), null);
  assert.equal(imageFromClipboard({ files: [png] }), png);
  assert.equal(imageFromClipboard(null), null);
});
