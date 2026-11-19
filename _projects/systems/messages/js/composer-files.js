// The composer's Attach menu and file sharing. In a group chat you can attach an image, any
// files, or a whole folder, from the menu or by dropping them anywhere on the conversation;
// they wait in the tray, and Send uploads them (a few at a time, with progress) before the
// message goes, so the message lists what was shared. In a direct message only an image can
// be attached: Spring stores shared files for groups only. thread.js owns the image itself;
// this hands a single image to it with onImage(file).
import { createAttachments, entriesFromDrop, entriesFromInput } from './attachments.js';
import { planShare, sharedItems, topNames } from './files-model.js';
import { createPopupMenu } from './popup-menu.js';

export const COMPOSER_FILE_TEXTS = Object.freeze({
  attach: 'Attach',
  image: 'Image or screenshot',
  imageHint: 'Shows in the chat',
  files: 'Files',
  filesHint: 'Up to 35 MB each',
  folder: 'Folder',
  folderHint: 'Keeps its folders',
  dropFiles: 'Drop files or folders to share them',
  dropImage: 'Drop an image to send it',
  filesOnlyInGroups: 'Files and folders can be shared in a group chat. Here you can send an image.',
  notWhileEditing: 'Files can’t be added while you edit a message.',
  shareFailed: 'Could not share the files. Check your connection and try again.',
  shareCancelled: 'Stopped sharing. Your files are still in the tray.',
  partlyShared: '{count} could not be shared: {names}.',
  nothingShared: 'None of the files could be shared. Try again.',
});

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const isImage = file => Boolean(file?.type?.startsWith('image/'));
// Spring refuses (409) to write over a file shared under the same name a moment ago. A file
// on its own then goes up again under the next free name; one in a folder is left off, since
// renaming it alone would split its folder.
const refusedLoose = (path, error) => error?.status === 409 && !path.includes('/');

export function createComposerFiles({
  elements, groupFiles, onImage, showMessage, texts = {}, moreItems = () => [],
}) {
  const text = { ...COMPOSER_FILE_TEXTS, ...texts };
  let context = { kind: null, id: null, loaded: false, editing: false };
  // Goes up when the conversation changes or the composer goes, so a dropped folder that is
  // still being read lands only in the tray of the conversation it was dropped on.
  let generation = 0;
  let dragDepth = 0;

  const attachments = createAttachments({ tray: elements.tray, onChange: () => {} });
  const inGroup = () => context.kind === 'group';
  const canAttach = () => context.loaded && !context.editing && !attachments.isUploading();

  const pick = input => input?.click();
  const menu = createPopupMenu({
    button: elements.attachButton,
    container: elements.menuHost,
    label: text.attach,
    items: () => [
      { icon: 'fa-image', label: text.image, hint: text.imageHint, onPick: () => pick(elements.imageInput) },
      ...(inGroup() ? [
        { icon: 'fa-file-arrow-up', label: text.files, hint: text.filesHint, onPick: () => pick(elements.filesInput) },
        { icon: 'fa-folder-plus', label: text.folder, hint: text.folderHint, onPick: () => pick(elements.folderInput) },
      ] : []),
      ...moreItems(context),
    ],
  });

  function addFromInput(input) {
    const found = entriesFromInput(input.files);
    input.value = '';
    if (found.length) attachments.add({ entries: found });
  }
  elements.filesInput?.addEventListener('change', () => addFromInput(elements.filesInput));
  elements.folderInput?.addEventListener('change', () => addFromInput(elements.folderInput));

  // ── Dropping on the conversation ───────────────────────────────────────────────
  function setDragging(active) {
    elements.dropZone.classList.toggle('is-dragging', active);
    if (elements.dropHint) {
      elements.dropHint.textContent = inGroup() ? text.dropFiles : text.dropImage;
      elements.dropHint.setAttribute('aria-hidden', String(!active));
    }
  }
  // Only drags that carry files: dragging text or a link inside the page isn't a share.
  const carriesFiles = event => [...(event.dataTransfer?.types || [])].includes('Files');

  function onDragEnter(event) {
    if (!carriesFiles(event) || !context.loaded) return;
    event.preventDefault();
    dragDepth += 1;
    setDragging(true);
  }
  function onDragOver(event) {
    if (!carriesFiles(event) || !context.loaded) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }
  function onDragLeave(event) {
    if (!carriesFiles(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) setDragging(false);
  }
  async function onDrop(event) {
    if (!carriesFiles(event) || !context.loaded) return;
    event.preventDefault();
    dragDepth = 0;
    setDragging(false);
    if (context.editing) {
      showMessage(text.notWhileEditing);
      return;
    }
    const files = [...(event.dataTransfer?.files || [])];
    const items = [...(event.dataTransfer?.items || [])];
    const hasFolder = items.some(item => item.webkitGetAsEntry?.()?.isDirectory);
    // One image on its own is sent as a picture in the chat, as before; anything else is a share.
    if (files.length === 1 && !hasFolder && isImage(files[0]) && attachments.isEmpty()) {
      onImage(files[0]);
      return;
    }
    if (!inGroup()) {
      showMessage(text.filesOnlyInGroups);
      return;
    }
    const dropped = generation;
    const found = await entriesFromDrop(event.dataTransfer);
    if (dropped === generation) attachments.add(found);
  }
  const zone = elements.dropZone;
  zone.addEventListener('dragenter', onDragEnter);
  zone.addEventListener('dragover', onDragOver);
  zone.addEventListener('dragleave', onDragLeave);
  zone.addEventListener('drop', onDrop);

  // The conversation changed, or loaded, or an edit started or ended.
  function setContext(next) {
    const moved = next.kind !== context.kind || next.id !== context.id;
    if (moved) generation += 1;
    context = { ...context, ...next };
    if (moved && !attachments.isUploading()) attachments.clear();
    elements.attachButton.disabled = !canAttach();
    // Only a group keeps a tray: a DM can't share files.
    if (!inGroup()) attachments.clear();
    if (!canAttach()) menu.close({ refocus: false });
  }

  // The loose files Spring refused in `first` go up once more, named against the group's list
  // as it is now; their rows in the tray report this try. Resolves { items, failed,
  // cancelled } for the whole share.
  async function shareRefusedAgain(files, plan, first, progress, signal) {
    const refused = first.failed.filter(failure => refusedLoose(failure.path, failure.error));
    const failed = first.failed.filter(failure => !refused.includes(failure));
    const items = sharedItems(plan, first.done);
    if (!refused.length) return { items, failed, cancelled: false };
    let taken;
    try {
      files.refresh();
      taken = topNames(await files.index());
    } catch (error) {
      refused.forEach(failure => progress.onFile(failure.path, 'failed'));
      return { items, failed: first.failed, cancelled: false };
    }
    const entries = refused.map(failure => plan.uploads.find(upload => upload.path === failure.path));
    const again = planShare(entries, taken);
    const firstPathOf = new Map(again.uploads.map(upload => [upload.path, entries.find(entry => entry.file === upload.file).path]));
    const second = await files.upload(again.uploads, {
      onFile: (path, state) => progress.onFile(firstPathOf.get(path), state),
      signal,
    });
    return {
      items: [...items, ...sharedItems(again, second.done)],
      failed: [...failed, ...second.failed],
      cancelled: second.cancelled,
    };
  }

  // Uploads the tray to the open group. Resolves { items } for the message's marker, or null
  // when the message shouldn't go (cancelled, or nothing could be shared; the reason is shown).
  async function share() {
    const files = groupFiles(context.id);
    let taken;
    try {
      // The names in use right now: a list cached while another chat was open misses what
      // teammates shared meanwhile, and an upload under one of their names would replace it.
      files.refresh();
      taken = topNames(await files.index());
    } catch (error) {
      console.warn('Messages: could not list the group’s files before sharing', error);
      showMessage(text.shareFailed);
      return null;
    }
    const plan = planShare(attachments.entries(), taken);
    if (plan.problem) return null; // the tray already says why
    const controller = new AbortController();
    const progress = attachments.beginUpload(plan, { onCancel: () => controller.abort() });
    // A refused file's row waits for its second try before it says how the file went.
    const first = await files.upload(plan.uploads, {
      onProgress: progress.onProgress,
      onFile: (path, state, error) => { if (state !== 'failed' || !refusedLoose(path, error)) progress.onFile(path, state); },
      signal: controller.signal,
    });
    const result = first.cancelled ? first : await shareRefusedAgain(files, plan, first, progress, controller.signal);
    if (result.cancelled) {
      attachments.endUpload({ keep: true });
      showMessage(text.shareCancelled);
      return null;
    }
    attachments.endUpload();
    const { items } = result;
    if (!items.length) {
      showMessage(text.nothingShared);
      return null;
    }
    if (result.failed.length) {
      const names = result.failed.map(failure => failure.path);
      showMessage(fill(text.partlyShared, { count: names.length, names: names.slice(0, 3).join(', ') + (names.length > 3 ? '…' : '') }));
    }
    return { items };
  }

  return {
    setContext,
    share,
    hasFiles: () => !attachments.isEmpty(),
    isUploading: () => attachments.isUploading(),
    problem: () => attachments.problem(),
    destroy() {
      generation += 1;
      menu.destroy();
      zone.removeEventListener('dragenter', onDragEnter);
      zone.removeEventListener('dragover', onDragOver);
      zone.removeEventListener('dragleave', onDragLeave);
      zone.removeEventListener('drop', onDrop);
    },
  };
}
