// A ZIP writer for "Download folder": the files go in as they are (stored, no compression),
// which every unzip tool opens and needs no library. Shared files are mostly already
// compressed (images, video, PDFs, zips) or small (code), so compressing would save little.
// A plain ZIP holds at most 65 535 files and 4 GB; past that this throws a RangeError
// rather than write an archive nothing can open.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

// MS-DOS time and date, which ZIP stores: two-second steps, years from 1980.
function dosDateTime(date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    day: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

const UTF8_NAMES = 0x0800;
const VERSION = 20;
const MAX_ENTRIES = 0xffff;
const MAX_BYTES = 0xffffffff;

/**
 * ZIP archives with their files stored as they are.
 */
export class ZipStore {
  /**
   * @param {Uint8Array} bytes
   * @returns {number} the CRC-32 a ZIP entry records
   */
  static crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  /**
   * Builds an archive. Throws a RangeError past 65 535 files or 4 GB.
   * @param {Array<{path: string, bytes: Uint8Array}>} files
   * @param {{date?: Date}} options the time every entry records
   * @returns {Uint8Array} the archive's bytes
   */
  static build(files, { date = new Date() } = {}) {
    if (files.length > MAX_ENTRIES) throw new RangeError(`A ZIP holds at most ${MAX_ENTRIES} files.`);
    const encoder = new TextEncoder();
    const { time, day } = dosDateTime(date);
    const entries = files.map(file => ({ name: encoder.encode(file.path), bytes: file.bytes, crc: ZipStore.crc32(file.bytes) }));
    const localSize = entries.reduce((total, entry) => total + 30 + entry.name.length + entry.bytes.length, 0);
    const centralSize = entries.reduce((total, entry) => total + 46 + entry.name.length, 0);
    if (localSize + centralSize + 22 > MAX_BYTES) throw new RangeError('A ZIP holds at most 4 GB.');

    const archive = new Uint8Array(localSize + centralSize + 22);
    const view = new DataView(archive.buffer);
    let at = 0;
    const offsets = [];
    entries.forEach(entry => {
      offsets.push(at);
      view.setUint32(at, 0x04034b50, true);
      view.setUint16(at + 4, VERSION, true);
      view.setUint16(at + 6, UTF8_NAMES, true);
      view.setUint16(at + 8, 0, true); // stored
      view.setUint16(at + 10, time, true);
      view.setUint16(at + 12, day, true);
      view.setUint32(at + 14, entry.crc, true);
      view.setUint32(at + 18, entry.bytes.length, true);
      view.setUint32(at + 22, entry.bytes.length, true);
      view.setUint16(at + 26, entry.name.length, true);
      view.setUint16(at + 28, 0, true);
      archive.set(entry.name, at + 30);
      archive.set(entry.bytes, at + 30 + entry.name.length);
      at += 30 + entry.name.length + entry.bytes.length;
    });
    const centralStart = at;
    entries.forEach((entry, index) => {
      view.setUint32(at, 0x02014b50, true);
      view.setUint16(at + 4, VERSION, true);
      view.setUint16(at + 6, VERSION, true);
      view.setUint16(at + 8, UTF8_NAMES, true);
      view.setUint16(at + 10, 0, true);
      view.setUint16(at + 12, time, true);
      view.setUint16(at + 14, day, true);
      view.setUint32(at + 16, entry.crc, true);
      view.setUint32(at + 20, entry.bytes.length, true);
      view.setUint32(at + 24, entry.bytes.length, true);
      view.setUint16(at + 28, entry.name.length, true);
      // Extra field, comment, disk number, internal and external attributes stay zero.
      view.setUint32(at + 42, offsets[index], true);
      archive.set(entry.name, at + 46);
      at += 46 + entry.name.length;
    });
    view.setUint32(at, 0x06054b50, true);
    view.setUint16(at + 8, entries.length, true);
    view.setUint16(at + 10, entries.length, true);
    view.setUint32(at + 12, at - centralStart, true);
    view.setUint32(at + 16, centralStart, true);
    return archive;
  }
}
