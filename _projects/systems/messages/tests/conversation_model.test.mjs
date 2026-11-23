import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Conversation } from '../js/conversation-model.js';

const message = (key, body, extra = {}) => ({ id: key, key, senderName: 'Grace', body, sentAt: '2026-11-18T10:00:00Z', ...extra });

test('a pin message is just its marker, and the id inside it is read back', () => {
  assert.equal(Conversation.pinMarker('m12'), '[[pin:m12]]');
  assert.equal(Conversation.unpinMarker('m12'), '[[unpin:m12]]');
  assert.deepEqual(Conversation.extractPinMarker('[[pin:m12]]'), { action: 'pin', id: 'm12', html: '' });
  assert.deepEqual(Conversation.extractPinMarker('  [[unpin:401]] '), { action: 'unpin', id: '401', html: '' });
  assert.deepEqual(Conversation.extractPinMarker('see [[pin:m12]]'), { action: null, id: null, html: 'see [[pin:m12]]' });
  assert.throws(() => Conversation.pinMarker('a]b'), TypeError);
});

test('currentPins replays pins and unpins, newest first, and drops deleted messages', () => {
  const messages = [
    message('a', 'first'), message('b', 'second'), message('c', 'third'),
    message('p1', '[[pin:a]]', { senderName: 'Ada', sentAt: '2026-11-18T11:00:00Z' }),
    message('p2', '[[pin:b]]', { senderName: 'Alan', sentAt: '2026-11-18T12:00:00Z' }),
    message('p3', '[[unpin:a]]'),
    message('p4', '[[pin:c]]', { sentAt: '2026-11-18T13:00:00Z' }),
    message('p5', '[[pin:b]]'),
  ];
  messages[2].deleted = true;
  const pins = Conversation.currentPins(messages);
  assert.deepEqual(pins.map(pin => pin.message.key), ['b']);
  assert.equal(pins[0].pinnedBy, 'Alan');
});

test('plainText reads a body the way a list shows it: no tags, markers or entities', () => {
  assert.equal(Conversation.plainText('[[reply:1|A|x]] [[files:f~a.txt~1]] <b>Fish</b> &amp; chips<br>tonight'), 'Fish & chips tonight');
});

test('linksIn lists each message’s links once, GitHub first, newest first', () => {
  const messages = [
    message('1', 'docs at https://example.com/guide and https://example.com/guide', { sentAt: '2026-11-18T09:00:00Z' }),
    message('2', 'PR: <a href="https://github.com/Open-Coding-Society/pages/pull/2031">https://github.com/Open-Coding-Society/pages/pull/2031</a>.', { sentAt: '2026-11-18T10:00:00Z' }),
    message('3', 'nothing here'),
  ];
  const links = Conversation.linksIn(messages);
  assert.deepEqual(links.map(link => link.url), ['https://github.com/Open-Coding-Society/pages/pull/2031', 'https://example.com/guide']);
  assert.equal(links[0].github, true);
  assert.equal(links[1].host, 'example.com');
  assert.equal(links[1].messageKey, '1');
});

test('mediaIn gathers sent images and shared image and video files, newest first', () => {
  const messages = [
    message('1', 'look', { image: 'data:image/png;base64,AAA', sentAt: '2026-11-18T09:00:00Z' }),
    message('2', '[[files:f~shots%2Fa.png~5;f~demo.mp4~9;f~notes.md~3]] files', { sentAt: '2026-11-18T10:00:00Z' }),
  ];
  const media = Conversation.mediaIn(messages);
  assert.deepEqual(media.map(item => item.kind), ['image', 'video', 'image']);
  assert.equal(media[0].file.path, 'shots/a.png');
  assert.equal(media[2].src, 'data:image/png;base64,AAA');
});

test('a pin counts only from a message never edited, at a message that is not itself a pin; ids are trimmed', () => {
  const messages = [
    message('a', 'first'),
    message('p1', '[[pin:a]]', { edited: true }),
    message('p2', '[[pin: a ]]'),
    message('p3', '[[pin:p2]]'),
  ];
  const pins = Conversation.currentPins(messages);
  assert.deepEqual(pins.map(pin => pin.message.key), ['a']);
  assert.equal(Conversation.extractPinMarker('[[pin: a ]]').id, 'a');
});

test('mediaIn gives a picture stored as bare base64 a data URL, as the log shows it', () => {
  const [picture] = Conversation.mediaIn([message('1', 'pic', { image: 'iVBORw0KGgo=' })]);
  assert.equal(picture.src, 'data:image/png;base64,iVBORw0KGgo=');
});

test('linksIn reads a named link’s address, and keeps a link’s own closing parenthesis', () => {
  const urls = body => Conversation.linksIn([message('1', body)]).map(link => link.url);
  assert.deepEqual(urls('the <a href="https://example.com/report?a=1&amp;b=2">Report</a>'), ['https://example.com/report?a=1&b=2']);
  assert.deepEqual(urls('see https://en.wikipedia.org/wiki/Computer_(programming).'), ['https://en.wikipedia.org/wiki/Computer_(programming)']);
  assert.deepEqual(urls('(docs at https://example.com/guide)'), ['https://example.com/guide']);
});
