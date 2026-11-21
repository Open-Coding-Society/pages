// The files a message shares, under its body: an ocs__file row for each file or folder with
// its buttons (Preview and Download; a folder's Open and .zip), and for a few shared images
// a strip of small previews above the rows. message-log.js draws a message; this draws its
// files.
import { SharedFiles } from './files-model.js';

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const nameOf = path => path.slice(path.lastIndexOf('/') + 1);

function iconButton(icon, label, onClick) {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'ocs__btn small';
  control.setAttribute('aria-label', label);
  control.title = label;
  const glyph = document.createElement('i');
  glyph.className = `fas ${icon}`;
  glyph.setAttribute('aria-hidden', 'true');
  control.appendChild(glyph);
  control.addEventListener('click', () => onClick(control));
  return control;
}

/**
 * The file rows under the log's messages.
 */
export class FileRows {
  /** Up to this many images in one share show small previews; a bigger share lists them like any other file. */
  static INLINE_IMAGE_PREVIEWS = 4;

  #onFile;
  #thumbnail;
  #text;

  /**
   * @param {object} options
   * @param {Function|null} options.onFile onFile(action, item, control) does what a button
   *   asks; without it the rows have no buttons
   * @param {Function|null} options.thumbnail thumbnail(item) resolves a URL for an image's
   *   preview, fetched with the page's sign-in; without it there are no previews
   * @param {object} options.text the log's wording (folderFiles, previewFile, downloadFile,
   *   openFolder, zipFolder, imagePreview)
   */
  constructor({ onFile = null, thumbnail = null, text }) {
    this.#onFile = onFile;
    this.#thumbnail = thumbnail;
    this.#text = text;
  }

  /**
   * Puts a message's files after `after` (its body) in `main`, in place
   * of any it had.
   * @param {HTMLElement} main the message's column
   * @param {HTMLElement} after
   * @param {Array} items the message's shared items (FilesMarker.extract)
   * @param {string} sender who shared them, for the previews' alt text
   */
  render(main, after, items, sender) {
    main.querySelector('.chat-file-gallery')?.remove();
    main.querySelector('.chat-files')?.remove();
    if (!items.length) return;
    const list = document.createElement('ul');
    list.className = 'ocs__file-list chat-files';
    items.forEach(item => list.appendChild(this.#row(item)));
    main.insertBefore(list, after.nextSibling);
    const images = items.filter(item => item.type === 'file' && SharedFiles.fileKind(item.path).preview === 'image');
    if (this.#thumbnail && images.length && images.length <= FileRows.INLINE_IMAGE_PREVIEWS) {
      main.insertBefore(this.#gallery(images, sender), list);
    }
  }

  #row(item) {
    const text = this.#text;
    const isFolder = item.type === 'folder';
    const name = nameOf(item.path);
    const kind = SharedFiles.fileKind(item.path);
    const line = document.createElement('li');
    line.className = 'ocs__file';
    const icon = document.createElement('i');
    icon.className = `fas ${isFolder ? 'fa-folder' : kind.icon} ocs__file-icon`;
    icon.setAttribute('aria-hidden', 'true');
    const textBox = document.createElement('div');
    textBox.className = 'ocs__file-text';
    const title = document.createElement('b');
    title.className = 'ocs__file-name';
    title.textContent = name;
    title.title = item.path;
    const meta = document.createElement('em');
    meta.className = 'ocs__file-meta';
    meta.textContent = isFolder
      ? fill(text.folderFiles, { files: SharedFiles.countFiles(item.count), size: SharedFiles.formatBytes(item.size) })
      : SharedFiles.formatBytes(item.size);
    textBox.append(title, meta);
    line.append(icon, textBox);
    if (this.#onFile) {
      const actions = document.createElement('div');
      actions.className = 'ocs__file-actions';
      const button = (glyph, label, action) => iconButton(glyph, label, control => this.#onFile(action, item, control));
      if (isFolder) {
        actions.append(
          button('fa-folder-open', fill(text.openFolder, { name }), 'folder'),
          button('fa-file-zipper', fill(text.zipFolder, { name }), 'zip'),
        );
      } else {
        if (kind.preview) actions.appendChild(button('fa-eye', fill(text.previewFile, { name }), 'preview'));
        actions.appendChild(button('fa-download', fill(text.downloadFile, { name }), 'download'));
      }
      line.appendChild(actions);
    }
    return line;
  }

  // Each preview opens the file viewer, like its row's Preview button.
  #gallery(images, sender) {
    const strip = document.createElement('div');
    strip.className = 'chat-file-gallery';
    images.forEach(item => {
      const name = nameOf(item.path);
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'chat-file-thumb-button';
      open.setAttribute('aria-label', fill(this.#text.previewFile, { name }));
      const image = document.createElement('img');
      image.className = 'ocs__file-preview chat-file-thumb';
      image.alt = fill(this.#text.imagePreview, { name, sender });
      image.loading = 'lazy';
      this.#thumbnail(item).then(url => { image.src = url; }, () => open.remove());
      open.appendChild(image);
      if (this.#onFile) open.addEventListener('click', () => this.#onFile('preview', item, open));
      strip.appendChild(open);
    });
    return strip;
  }
}
