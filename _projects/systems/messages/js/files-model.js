// Pure helpers for sharing files and folders in a group chat: no DOM, no fetch.
//
// A shared file is stored by Spring under the group's shared files at a path, and a file
// that came from a folder keeps its folders: "project/src/Main.java". The message that
// shares them carries a [[files:…]] marker at the start of its body (after a reply's
// marker), so the conversation's history shows what was shared, with no new field on a
// message. Like the reply marker, it is plain text the sanitizer leaves alone, and it is
// taken out before the body renders.

// Spring and its nginx take request bodies up to 50 MB, and a file goes up as base64,
// which is a third bigger, so 35 MB is the largest file that fits with room to spare.
export const FILE_LIMIT_BYTES = 35 * 1024 * 1024;
// One share uploads at most this many files (a folder), and at most this many loose files,
// which each get their own line in the message.
export const MAX_SHARE_FILES = 500;
export const MAX_LOOSE_FILES = 50;
// Mirrors Spring's SharedFilePaths: the longest path, and the longest name in it.
export const MAX_PATH_LENGTH = 512;
export const MAX_NAME_LENGTH = 255;
// Folders and files no one means to share: tool caches, installed packages, git's own
// history and the clutter operating systems leave. Skipped wherever they appear, and counted.
export const SKIPPED_NAMES = Object.freeze([
  '.git', 'node_modules', '__pycache__', '.venv', 'venv', '.ipynb_checkpoints', '.DS_Store', 'Thumbs.db',
]);

// The path as given when Spring would store it, otherwise null. Refused, never rewritten,
// so the name in the chat is the name that was stored.
export function cleanPath(path) {
  const text = typeof path === 'string' ? path : '';
  if (!text.trim() || text.length > MAX_PATH_LENGTH) return null;
  if (text.startsWith('/') || text.includes('\\')) return null;
  if (/[\u0000-\u001f\u007f]/.test(text)) return null;
  const names = text.split('/');
  if (names.some(name => !name.trim() || name === '.' || name === '..' || name.length > MAX_NAME_LENGTH)) return null;
  return text;
}

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

// { kind, icon, preview } for a file name or path. A dotfile like .gitignore counts its
// whole name as the extension.
export function fileKind(name) {
  const base = nameOf(name);
  const extension = extensionOf(base) || (base.startsWith('.') ? base.slice(1).toLowerCase() : '');
  const match = KIND_BY_EXTENSION.get(extension);
  return match
    ? { kind: match.kind, icon: match.icon, preview: match.preview }
    : { kind: 'file', icon: 'fa-file', preview: null };
}

// 1536 → "1.5 KB": one decimal under 10 of a unit, none above, the way a file manager reads.
export function formatBytes(bytes) {
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

export const isSkipped = path => String(path).split('/').some(name => SKIPPED_NAMES.includes(name));

// "report.pdf" → "report (2).pdf" when the name is taken, then (3) and on: what a file
// manager does, so sharing a second report never replaces the first one's file.
export function uniqueName(name, taken) {
  if (!taken.has(name)) return name;
  const dot = name.lastIndexOf('.');
  const [stem, extension] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ''];
  for (let copy = 2; ; copy += 1) {
    const candidate = `${stem} (${copy})${extension}`;
    if (!taken.has(candidate)) return candidate;
  }
}

// The first part of every shared path: the names a new share must not reuse at the top.
export const topNames = index => new Set((index || []).map(file => String(file.path).split('/')[0]));

// What one drop or pick turns into. `entries` are [{ file, path }] with the path relative to
// where the share starts ("report.pdf", "project/src/Main.java"); `taken` is topNames of the
// group's files. Returns:
//   uploads  [{ file, path }] to send, with top-level names made unique
//   items    the marker's entries: loose files, and one entry per folder
//   skipped  how many clutter files were left out; tooBig and invalid list paths
//   problem  null, or 'empty' | 'tooMany' | 'tooManyLoose' when nothing should upload
export function planShare(entries, taken) {
  const plan = { uploads: [], items: [], skipped: 0, tooBig: [], invalid: [], problem: null };
  const kept = [];
  (entries || []).forEach(({ file, path }) => {
    if (isSkipped(path)) {
      plan.skipped += 1;
    } else if (!cleanPath(path)) {
      plan.invalid.push(path);
    } else if ((file?.size || 0) > FILE_LIMIT_BYTES) {
      plan.tooBig.push(path);
    } else {
      kept.push({ file, path });
    }
  });
  const loose = kept.filter(({ path }) => !path.includes('/'));
  if (!kept.length) plan.problem = 'empty';
  else if (kept.length > MAX_SHARE_FILES) plan.problem = 'tooMany';
  else if (loose.length > MAX_LOOSE_FILES) plan.problem = 'tooManyLoose';
  if (plan.problem) return plan;

  // Each top-level name, renamed once, so every file in a folder moves with it.
  const used = new Set(taken);
  const renamed = new Map();
  const folders = new Map();
  kept.forEach(({ file, path }) => {
    const [top, ...rest] = path.split('/');
    if (!renamed.has(top)) {
      const name = uniqueName(top, used);
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

export function encodeFilesMarker(items) {
  const entries = (items || []).map(item => (item.type === 'folder'
    ? `d~${escapeField(item.path)}~${item.count}~${item.size}`
    : `f~${escapeField(item.path)}~${item.size}`));
  return `[[files:${entries.join(';')}]]`;
}

// The html to send: the marker, then what was typed. No items, no change.
export function addFilesMarker(html, items) {
  if (!items?.length) return html;
  return `${encodeFilesMarker(items)} ${html || ''}`.trim();
}

// A body (already without its reply marker) → { items, html }. Entries that aren't
// well formed, or name a path Spring would refuse, are left out.
export function extractFilesMarker(raw) {
  const text = String(raw ?? '');
  const match = text.match(FILES_PATTERN);
  if (!match) return { items: [], html: text };
  const items = [];
  match[1].split(';').forEach(entry => {
    const [type, rawPath, ...numbers] = entry.split('~');
    const path = cleanPath(unescapeField(rawPath ?? ''));
    if (!path) return;
    if (type === 'f' && numbers.length === 1 && count(numbers[0]) !== null) {
      items.push({ type: 'file', path, size: count(numbers[0]) });
    } else if (type === 'd' && numbers.length === 2 && count(numbers[0]) !== null && count(numbers[1]) !== null) {
      items.push({ type: 'folder', path, count: count(numbers[0]), size: count(numbers[1]) });
    }
  });
  return { items, html: text.slice(match[0].length) };
}

// "proj · 3 files · 3 MB" for one folder, "a.pdf · 2 KB" for one file, "4 files · 9 MB" otherwise.
export function shareSummary(items) {
  const files = items.reduce((total, item) => total + (item.type === 'folder' ? item.count : 1), 0);
  const size = formatBytes(items.reduce((total, item) => total + item.size, 0));
  if (items.length === 1 && items[0].type === 'file') return `${nameOf(items[0].path)} · ${size}`;
  const filesText = `${files} file${files === 1 ? '' : 's'}`;
  if (items.length === 1) return `${nameOf(items[0].path)} · ${filesText} · ${size}`;
  return `${filesText} · ${size}`;
}

// ── The group's files as folders ──────────────────────────────────────────────────────
// index: [{ path, size, uploadedBy, uploadedAt }] → the root folder,
// { name, path, folders: [folder], files: [entry], count, size }, sorted by name.
export function buildTree(index) {
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

// Every file inside a folder, at any depth.
export const filesUnder = (index, folderPath) => (index || []).filter(file => String(file.path).startsWith(`${folderPath}/`));
