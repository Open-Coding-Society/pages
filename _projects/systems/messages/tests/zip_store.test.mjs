import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZipStore } from '../js/zip-store.js';

const bytes = text => new TextEncoder().encode(text);

// Reads a stored (uncompressed) ZIP back the way an unzip tool does: the end record, then
// the central directory, then each entry's local header and data.
function readZip(archive) {
  const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
  const end = archive.byteLength - 22;
  assert.equal(view.getUint32(end, true), 0x06054b50, 'end of central directory');
  const total = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const entries = [];
  for (let i = 0; i < total; i += 1) {
    assert.equal(view.getUint32(at, true), 0x02014b50, 'central directory header');
    const flags = view.getUint16(at + 8, true);
    const method = view.getUint16(at + 10, true);
    const crc = view.getUint32(at + 16, true);
    const size = view.getUint32(at + 24, true);
    const nameLength = view.getUint16(at + 28, true);
    const offset = view.getUint32(at + 42, true);
    const name = new TextDecoder().decode(archive.subarray(at + 46, at + 46 + nameLength));
    assert.equal(view.getUint32(offset, true), 0x04034b50, 'local header');
    const localNameLength = view.getUint16(offset + 26, true);
    const data = archive.subarray(offset + 30 + localNameLength, offset + 30 + localNameLength + size);
    entries.push({ name, flags, method, crc, data: new TextDecoder().decode(data) });
    at += 46 + nameLength;
  }
  return entries;
}

test('crc32 matches the standard check value', () => {
  assert.equal(ZipStore.crc32(bytes('The quick brown fox jumps over the lazy dog')), 0x414fa339);
  assert.equal(ZipStore.crc32(new Uint8Array(0)), 0);
});

test('zipStore writes a stored archive that reads back file for file, with UTF-8 names', () => {
  const archive = ZipStore.build([
    { path: 'project/README.md', bytes: bytes('# Hello') },
    { path: 'project/src/Résumé.java', bytes: bytes('class R {}') },
  ], { date: new Date(2026, 10, 18, 21, 5, 30) });
  const entries = readZip(archive);
  assert.deepEqual(entries.map(entry => entry.name), ['project/README.md', 'project/src/Résumé.java']);
  assert.deepEqual(entries.map(entry => entry.data), ['# Hello', 'class R {}']);
  entries.forEach(entry => {
    assert.equal(entry.method, 0);
    assert.equal(entry.flags & 0x0800, 0x0800);
  });
  assert.equal(entries[0].crc, ZipStore.crc32(bytes('# Hello')));
});

test('zipStore refuses what a plain ZIP cannot hold instead of writing a broken one', () => {
  assert.throws(() => ZipStore.build(Array.from({ length: 65536 }, (_, i) => ({ path: `f${i}`, bytes: new Uint8Array(0) }))), RangeError);
});
