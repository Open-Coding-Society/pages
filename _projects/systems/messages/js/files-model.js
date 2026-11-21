// Pure helpers for sharing files and folders in a group chat: no DOM, no fetch.
//
// A shared file is stored by Spring under the group's shared files at a path, and a file
// that came from a folder keeps its folders: "project/src/Main.java". The message that
// shares them carries a [[files:…]] marker at the start of its body (after a reply's
// marker), so the conversation's history shows what was shared, with no new field on a
// message. Like the reply marker, it is plain text the sanitizer leaves alone, and it is
// taken out before the body renders.

const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);
const extensionOf = name => {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
};

// Extension → kind. The kind picks the icon; `preview` says how the page can show the file
// without downloading it, or null when it can't.
const KINDS = [
  { kind: 'image', icon: 'fa-file-image', preview: 'image', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'] },
  { kind: 'video', icon: 'fa-file-video', preview: 'video', extensions: ['mp4', 'webm', 'mov', 'm4v', 'ogv'] },
  { kind: 'audio', icon: 'fa-file-audio', preview: 'audio', extensions: ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac'] },
  { kind: 'pdf', icon: 'fa-file-pdf', preview: 'pdf', extensions: ['pdf'] },
  {
    kind: 'code',
    icon: 'fa-file-code',
    preview: 'text',
    extensions: ['js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'h', 'cpp', 'hpp', 'cs', 'go', 'rs', 'rb', 'php',
      'kt', 'swift', 'scala', 'sh', 'zsh', 'bash', 'ps1', 'html', 'htm', 'css', 'scss', 'sass', 'json', 'yml', 'yaml', 'toml',
      'xml', 'sql', 'ipynb', 'r', 'lua', 'dart', 'vue', 'svelte', 'gradle', 'properties', 'liquid', 'http'],
  },
  { kind: 'text', icon: 'fa-file-csv', preview: 'text', extensions: ['csv', 'tsv'] },
  { kind: 'text', icon: 'fa-file-lines', preview: 'text', extensions: ['txt', 'md', 'markdown', 'log', 'ini', 'cfg', 'env', 'gitignore'] },
  { kind: 'archive', icon: 'fa-file-zipper', preview: null, extensions: ['zip', 'tar', 'gz', 'tgz', '7z', 'rar', 'jar'] },
  { kind: 'doc', icon: 'fa-file-word', preview: null, extensions: ['doc', 'docx', 'odt', 'rtf', 'pages'] },
  { kind: 'sheet', icon: 'fa-file-excel', preview: null, extensions: ['xls', 'xlsx', 'ods', 'numbers'] },
  { kind: 'slides', icon: 'fa-file-powerpoint', preview: null, extensions: ['ppt', 'pptx', 'odp', 'key'] },
];
const KIND_BY_EXTENSION = new Map(KINDS.flatMap(entry => entry.extensions.map(extension => [extension, entry])));

// The type a preview needs: Spring sends every file as application/octet-stream, and a
// browser won't show a PDF, an SVG or most video from a blob with no type.
const MIME_TYPES = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  bmp: 'image/bmp', avif: 'image/avif', mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
  ogv: 'video/ogg', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg', m4a: 'audio/mp4',
  aac: 'audio/aac', flac: 'audio/flac', pdf: 'application/pdf',
};

/**
 * What a group can share and how a share is planned: Spring's limits and path rules, a
 * file's kind and type, sizes and names, and the group's files as folders.
 */
export class SharedFiles {
  /**
   * The largest file a share takes, in bytes. Spring and its nginx take request bodies up
   * to 50 MB, and a file goes up as base64, which is a third bigger, so 35 MB fits with room.
   */
  static FILE_LIMIT_BYTES = 35 * 1024 * 1024;

  /** The most files one share uploads (a folder). */
  static MAX_SHARE_FILES = 500;

  /** The most loose files one share takes: each gets its own line in the message. */
  static MAX_LOOSE_FILES = 50;

  /** The longest path Spring stores (its SharedFilePaths). */
  static MAX_PATH_LENGTH = 512;

  /** The longest name inside a path Spring stores. */
  static MAX_NAME_LENGTH = 255;

  /**
   * Folders and files no one means to share: tool caches, installed packages, git's own
   * history and the clutter operating systems leave. Skipped wherever they appear, and counted.
   */
  static SKIPPED_NAMES = Object.freeze([
    '.git', 'node_modules', '__pycache__', '.venv', 'venv', '.ipynb_checkpoints', '.DS_Store', 'Thumbs.db',
  ]);

  /**
   * The path as given when Spring would store it. Refused, never rewritten, so the name in
   * the chat is the name that was stored.
   * @param {string} path a path like "project/src/Main.java"
   * @returns {string|null} the same path, or null
   */
  static cleanPath(path) {
    const text = typeof path === 'string' ? path : '';
    if (!text.trim() || text.length > SharedFiles.MAX_PATH_LENGTH) return null;
    if (text.startsWith('/') || text.includes('\\')) return null;
    if (/[\u0000-\u001f\u007f]/.test(text)) return null;
    const names = text.split('/');
    if (names.some(name => !name.trim() || name === '.' || name === '..' || name.length > SharedFiles.MAX_NAME_LENGTH)) return null;
    return text;
  }

  /**
   * A file's kind, from its extension. A dotfile like .gitignore counts its whole name as
   * the extension.
   * @param {string} name a file name or path
   * @returns {{kind: string, icon: string, preview: string|null}} the kind, its Font
   *   Awesome icon, and how the page can preview it ('image', 'video', 'audio', 'pdf',
   *   'text') or null when it can't
   */
  static fileKind(name) {
    const base = nameOf(name);
    const extension = extensionOf(base) || (base.startsWith('.') ? base.slice(1).toLowerCase() : '');
    const match = KIND_BY_EXTENSION.get(extension);
    return match
      ? { kind: match.kind, icon: match.icon, preview: match.preview }
      : { kind: 'file', icon: 'fa-file', preview: null };
  }

  /**
   * The media type a preview needs, from the name.
   * @param {string} name a file name or path
   * @returns {string} a type like "image/png", or "application/octet-stream"
   */
  static mimeFor(name) {
    return MIME_TYPES[extensionOf(nameOf(name))] || 'application/octet-stream';
  }

  /**
   * A size the way a file manager reads: one decimal under 10 of a unit, none above.
   * @param {number} bytes
   * @returns {string} like "1.5 KB" for 1536
   */
  static formatBytes(bytes) {
    let value = Math.max(0, Number(bytes) || 0);
    if (value < 1024) return `${Math.round(value)} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let unit = -1;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    const shown = value < 10 ? Math.round(value * 10) / 10 : Math.round(value);
    return `${shown} ${units[unit]}`;
  }

  /**
   * Whether a path goes through a folder or file in SKIPPED_NAMES.
   * @param {string} path
   * @returns {boolean}
   */
  static isSkipped(path) {
    return String(path).split('/').some(name => SharedFiles.SKIPPED_NAMES.includes(name));
  }

  /**
   * A name no one has taken: "report.pdf" becomes "report (2).pdf", then (3) and on, the
   * way a file manager does, so sharing a second report never replaces the first one's file.
   * @param {string} name
   * @param {Set<string>} taken the names in use
   * @returns {string}
   */
  static uniqueName(name, taken) {
    if (!taken.has(name)) return name;
    const dot = name.lastIndexOf('.');
    const [stem, extension] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ''];
    for (let copy = 2; ; copy += 1) {
      const candidate = `${stem} (${copy})${extension}`;
      if (!taken.has(candidate)) return candidate;
    }
  }

  /**
   * The first part of every shared path: the names a new share must not reuse at the top.
   * @param {Array<{path: string}>} index the group's files
   * @returns {Set<string>}
   */
  static topNames(index) {
    return new Set((index || []).map(file => String(file.path).split('/')[0]));
  }

  /**
   * What one drop or pick turns into.
   * @param {Array<{file: File, path: string}>} entries paths relative to where the share
   *   starts ("report.pdf", "project/src/Main.java")
   * @param {Set<string>} taken topNames of the group's files
   * @returns {{uploads: Array, items: Array, skipped: number, tooBig: string[], invalid: string[], problem: string|null}}
   *   uploads are the { file, path } to send, with top-level names made unique; items are
   *   the marker's entries, loose files and one per folder; skipped counts the clutter left
   *   out; problem is null, or 'empty', 'tooMany' or 'tooManyLoose' when nothing should upload
   */
  static planShare(entries, taken) {
    const plan = { uploads: [], items: [], skipped: 0, tooBig: [], invalid: [], problem: null };
    const kept = [];
    (entries || []).forEach(({ file, path }) => {
      if (SharedFiles.isSkipped(path)) {
        plan.skipped += 1;
      } else if (!SharedFiles.cleanPath(path)) {
        plan.invalid.push(path);
      } else if ((file?.size || 0) > SharedFiles.FILE_LIMIT_BYTES) {
        plan.tooBig.push(path);
      } else {
        kept.push({ file, path });
      }
    });
    const loose = kept.filter(({ path }) => !path.includes('/'));
    if (!kept.length) plan.problem = 'empty';
    else if (kept.length > SharedFiles.MAX_SHARE_FILES) plan.problem = 'tooMany';
    else if (loose.length > SharedFiles.MAX_LOOSE_FILES) plan.problem = 'tooManyLoose';
    if (plan.problem) return plan;

    // Each top-level name, renamed once, so every file in a folder moves with it.
    const used = new Set(taken);
    const renamed = new Map();
    const folders = new Map();
    kept.forEach(({ file, path }) => {
      const [top, ...rest] = path.split('/');
      if (!renamed.has(top)) {
        const name = SharedFiles.uniqueName(top, used);
        used.add(name);
        renamed.set(top, name);
      }
      const finalPath = [renamed.get(top), ...rest].join('/');
      plan.uploads.push({ file, path: finalPath });
      const size = file?.size || 0;
      if (!rest.length) {
        plan.items.push({ type: 'file', path: finalPath, size });
        return;
      }
      if (!folders.has(top)) {
        const folder = { type: 'folder', path: renamed.get(top), count: 0, size: 0 };
        folders.set(top, folder);
        plan.items.push(folder);
      }
      folders.get(top).count += 1;
      folders.get(top).size += size;
    });
    return plan;
  }

  /**
   * The marker's items for what actually went up: a planShare result's items, with a
   * folder's count and size cut to the files that were shared, and anything with none left out.
   * @param {object} share a planShare result
   * @param {Iterable<string>} donePaths the paths that went up
   * @returns {Array}
   */
  static sharedItems(share, donePaths) {
    const done = new Set(donePaths);
    const sizes = new Map(share.uploads.map(upload => [upload.path, upload.file?.size || 0]));
    return share.items.flatMap(item => {
      if (item.type === 'file') return done.has(item.path) ? [item] : [];
      const inside = [...done].filter(path => path.startsWith(`${item.path}/`));
      if (!inside.length) return [];
      return [{ ...item, count: inside.length, size: inside.reduce((total, path) => total + sizes.get(path), 0) }];
    });
  }

  /**
   * @param {number} count
   * @returns {string} "1 file", "3 files"
   */
  static countFiles(count) {
    return `${count} file${count === 1 ? '' : 's'}`;
  }

  /**
   * One line for what a share holds.
   * @param {Array} items the marker's items
   * @returns {string} "proj · 3 files · 3 MB" for one folder, "a.pdf · 2 KB" for one file,
   *   "4 files · 9 MB" otherwise
   */
  static shareSummary(items) {
    const files = items.reduce((total, item) => total + (item.type === 'folder' ? item.count : 1), 0);
    const size = SharedFiles.formatBytes(items.reduce((total, item) => total + item.size, 0));
    if (items.length === 1 && items[0].type === 'file') return `${nameOf(items[0].path)} · ${size}`;
    const filesText = SharedFiles.countFiles(files);
    if (items.length === 1) return `${nameOf(items[0].path)} · ${filesText} · ${size}`;
    return `${filesText} · ${size}`;
  }

  /**
   * The group's files as folders, sorted by name.
   * @param {Array<{path: string, size: number, uploadedBy: string, uploadedAt: string}>} index
   * @returns {{name: string, path: string, folders: Array, files: Array, count: number, size: number}}
   *   the root folder; every folder counts the files at any depth below it
   */
  static buildTree(index) {
    const root = { name: '', path: '', folders: [], files: [], count: 0, size: 0 };
    const byPath = new Map([['', root]]);
    const folderFor = path => {
      if (byPath.has(path)) return byPath.get(path);
      const parentPath = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
      const folder = { name: nameOf(path), path, folders: [], files: [], count: 0, size: 0 };
      folderFor(parentPath).folders.push(folder);
      byPath.set(path, folder);
      return folder;
    };
    (index || []).forEach(file => {
      const path = String(file.path);
      const parentPath = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
      folderFor(parentPath).files.push(file);
      // Every folder above the file counts it.
      for (let at = parentPath; ; at = at.includes('/') ? at.slice(0, at.lastIndexOf('/')) : '') {
        const folder = byPath.get(at);
        folder.count += 1;
        folder.size += Number(file.size) || 0;
        if (!at) break;
      }
    });
    const byName = (a, b) => String(a.name ?? nameOf(a.path)).localeCompare(String(b.name ?? nameOf(b.path)), undefined, { numeric: true, sensitivity: 'base' });
    const sort = folder => {
      folder.folders.sort(byName);
      folder.files.sort((a, b) => nameOf(a.path).localeCompare(nameOf(b.path), undefined, { numeric: true, sensitivity: 'base' }));
      folder.folders.forEach(sort);
    };
    sort(root);
    return root;
  }

  /**
   * Every file inside a folder, at any depth.
   * @param {Array<{path: string}>} index the group's files
   * @param {string} folderPath
   * @returns {Array}
   */
  static filesUnder(index, folderPath) {
    return (index || []).filter(file => String(file.path).startsWith(`${folderPath}/`));
  }
}

// ── The [[files:…]] marker ───────────────────────────────────────────────────────────
// Entries are separated by ";", their fields by "~": f~path~size for a file and
// d~path~count~size for a folder. A path escapes the characters the marker uses, the
// HTML ones and control characters as %XX, and nothing else, so a share's message stays
// short (spaces and accents are left as they are).
const FILES_PATTERN = /^\s*\[\[files:([^\]]*)\]\]\s*/;

const escapeField = text => String(text).replace(/[%[\]|;~<>&\u0000-\u001f\u007f]/g,
  character => `%${character.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);

function unescapeField(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return null;
  }
}

const count = text => (/^\d{1,15}$/.test(text) ? Number(text) : null);

/**
 * The [[files:…]] marker a sharing message starts with (after a reply's marker).
 */
export class FilesMarker {
  /**
   * @param {Array} items the share's items: { type: 'file', path, size } or
   *   { type: 'folder', path, count, size }
   * @returns {string} the marker, like "[[files:f~report.pdf~2048]]"
   */
  static encode(items) {
    const entries = (items || []).map(item => (item.type === 'folder'
      ? `d~${escapeField(item.path)}~${item.count}~${item.size}`
      : `f~${escapeField(item.path)}~${item.size}`));
    return `[[files:${entries.join(';')}]]`;
  }

  /**
   * The html to send: the marker, then what was typed. No items, no change.
   * @param {string} html what was typed
   * @param {Array} items
   * @returns {string}
   */
  static add(html, items) {
    if (!items?.length) return html;
    return `${FilesMarker.encode(items)} ${html || ''}`.trim();
  }

  /**
   * Splits a body (already without its reply marker) into its shared items and the rest.
   * Entries that aren't well formed, or name a path Spring would refuse, are left out.
   * @param {string} raw
   * @returns {{items: Array, html: string}}
   */
  static extract(raw) {
    const text = String(raw ?? '');
    const match = text.match(FILES_PATTERN);
    if (!match) return { items: [], html: text };
    const items = [];
    match[1].split(';').forEach(entry => {
      const [type, rawPath, ...numbers] = entry.split('~');
      const path = SharedFiles.cleanPath(unescapeField(rawPath ?? ''));
      if (!path) return;
      if (type === 'f' && numbers.length === 1 && count(numbers[0]) !== null) {
        items.push({ type: 'file', path, size: count(numbers[0]) });
      } else if (type === 'd' && numbers.length === 2 && count(numbers[0]) !== null && count(numbers[1]) !== null) {
        items.push({ type: 'folder', path, count: count(numbers[0]), size: count(numbers[1]) });
      }
    });
    return { items, html: text.slice(match[0].length) };
  }
}
