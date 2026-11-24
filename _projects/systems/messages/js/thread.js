// The conversation pane. It loads the open group chat or direct message, follows its
// topic on the socket, and sends, edits and deletes through REST. For a direct message
// it also keeps read state current: opening it, or a message arriving while the tab is
// visible, marks it read and tells the navbar bell (assets/js/api/dm-notifications.js).
// /dm makes one pane for the page. conversation-embed.js makes one per embedded chat,
// which is why a pane can be read-only, use its host's wording and be destroyed.
// Replies carry a [[reply:...]] marker at the start of their body (chat-reply.js,
// reached through `richText`); an image pasted into the composer is attached like one
// picked with the Image control or dropped on the composer.
import { classifyDmEvent, classifyGroupEvent, dmMessage, groupMessage } from './messages-model.js';
import { ChatCommands } from './chat-commands.js';
import { CodeBlocks } from './code-model.js';
import { CodeComposer } from './code-composer.js';
import { CommandMenu } from './command-menu.js';
import { Conversation } from './conversation-model.js';
import { ComposerFiles } from './composer-files.js';
import { readImageFile } from './dialogs.js';
import { FileActions } from './file-actions.js';
import { FileViewer } from './file-viewer.js';
import { FilesMarker } from './files-model.js';
import { createMessageLog, withTexts } from './message-log.js';

// What the pane says, worded for /dm. A host passes its own wording for any of these in
// `texts`.
export const THREAD_TEXTS = Object.freeze({
  idleTitle: 'Pick a conversation',
  idleHint: 'Or start a new chat, or find a group to join.',
  loading: 'Loading messages…',
  loadFailedTitle: 'Could not load these messages',
  loadFailedHint: 'Check your connection, then pick the conversation again.',
  placeholder: 'Type a message…',
  send: 'Send',
  save: 'Save',
  sendFailed: 'Could not send the message. Try again.',
  editFailed: 'Could not save your edit. Try again.',
  editOfDeleted: 'That message was deleted, so your edit was not saved.',
  deleteFailed: 'Could not delete the message. Try again.',
  waitForSave: 'Wait for your message to finish saving first.',
  pinFailed: 'Could not change the pin. Try again.',
  imageUnreadable: 'Could not read that image. Try a different file.',
  imageOnly: 'Drop an image or screenshot here.',
  imageWhileEditing: 'Images can’t be added while you edit a message.',
  imageMessage: '🖼 Image',
  filesMessage: '📎 Files',
  sharedButNotSent: 'Your files are shared, but the message didn’t send. Press Send to try again.',
  codeMessage: '💻 Code',
  badGitHubRef: 'Write it like owner/repo#12, owner/repo@abc1234 or owner/repo, or paste a GitHub link.',
  newIssueNeedsRepo: 'Say which repository first: /newissue owner/repo What went wrong',
  newIssueBody: 'From the OCS chat “{chat}”: {link}',
  tooLongForDm: 'That’s too long for a direct message. Save it as a gist instead (/gist).',
  gistConnect: 'Connect GitHub on your Profile to save gists:',
  gistConnectLink: 'GitHub Gist connection',
  gistFailed: 'Could not save the gist. Try again.',
});

// What an open conversation with no messages says, unless the host passes `emptyState`.
export const EMPTY_STATES = Object.freeze({
  dm: Object.freeze({ title: 'No messages yet', hint: 'Say hi.' }),
  group: Object.freeze({ title: 'No messages yet', hint: 'Say hi to your group.' }),
});

// groupFiles(id) is that group's GroupFiles (group-files.js): with it, shared files under a
// message open and download, and a composer with an Attach button can share files and
// folders. onOpenFolder(groupId, path) opens a shared folder in the Shared panel's Files tab.
export function createThread({
  elements, api, socket, richText, me,
  onDmRead = () => {}, onGroupRead = () => {}, onFileShared = () => {},
  readOnly = false, onSchedule = null, emptyState = null, texts = {}, formatBody = null,
  groupFiles = null, onOpenFolder = null, viewer: sharedViewer = null, linkCards = null,
  runCode = null, onCommand = () => {}, profileUrl = '/profile', onChanged = () => {},
}) {
  if (emptyState !== null && (typeof emptyState !== 'object' || typeof emptyState.title !== 'string')) {
    throw new TypeError('createThread: emptyState must be null or { title, hint }');
  }
  const text = withTexts(THREAD_TEXTS, texts);

  // A group message's only sender field is a display name, so that is what marks yours.
  const kinds = {
    dm: {
      load: id => api.dmMessages(id).then(list => (list || []).map(dmMessage)),
      send: (id, html, image) => api.sendDm(id, html, image),
      supportsImages: true,
      edit: (id, messageId, html) => api.editDm(id, messageId, html),
      remove: (id, messageId) => api.deleteDm(id, messageId),
      topic: id => `/topic/dm/${id}`,
      selfKey: me.uid,
    },
    group: {
      load: id => api.groupMessages(id).then(list => (list || []).map(groupMessage)),
      send: (id, html, image) => api.sendGroupMessage(id, html, image),
      supportsImages: true,
      edit: (id, messageId, html) => api.editGroupMessage(id, messageId, html),
      remove: (id, messageId) => api.deleteGroupMessage(id, messageId),
      topic: id => `/topic/group/${id}`,
      selfKey: me.name,
    },
  };

  let current = null; // { kind, id, loaded, catchUp } for the open conversation
  let openCount = 0; // a newer open makes an older one that is still loading stop
  let editing = null; // the message being edited
  let pending = null; // 'send' or 'edit' while that request is in flight
  let early = []; // frames that arrived before the open conversation's history
  let unseenWhileHidden = false;
  let pendingImage = null; // a data URL attached to the next message, or null
  let replyingTo = null; // { id, sender, excerpt } the next message replies to
  let editingReply = null; // the reply marker of the message being edited, kept on save
  let editingFiles = []; // the files the message being edited lists, kept on save
  let editingCode = null; // { language, code } of the message being edited, kept on save
  let unsentFiles = null; // files already shared whose message didn't send yet
  let dragDepth = 0;
  let destroyed = false;

  // Replies need chat-reply.js's helpers; a host with an older rich-text.js has none.
  const canReply = typeof richText.addReplyMarker === 'function';

  // Shared files open from the group they were shared in; the viewer lives in the page's .dm root.
  const openGroupFiles = () => (groupFiles && current?.kind === 'group' ? groupFiles(current.id) : null);
  const viewer = sharedViewer || (groupFiles ? new FileViewer({ root: elements.messages.closest?.('.dm') || document.body }) : null);
  const fileActions = groupFiles ? new FileActions({
    filesFor: openGroupFiles,
    viewer,
    notify: message => showFormMessage(message),
    onOpenFolder: onOpenFolder ? path => onOpenFolder(current?.id, path) : null,
  }) : null;

  // A read-only pane shows the conversation but can't change it: no composer, and no
  // reply, edit or delete.
  const log = createMessageLog(elements.messages, {
    richText, me, onEdit: beginEdit, onDelete: deleteMessage, onReply: canReply ? beginReply : null,
    onSchedule, readOnly, texts, formatBody, linkCards, runCode,
    onPin: readOnly ? null : (message, pinned) => togglePin(message, pinned),
    onChange: () => noteChange(),
    // Any code block in the chat can be saved to your own gists (commands is made below).
    saveGist: readOnly || !api.createGist ? null
      : (language, code) => commands.saveGist(language, code, `snippet.${CodeBlocks.languageOf(language)?.extension || 'txt'}`),
    onFile: fileActions ? (action, item, control) => fileActions.handle(action, item, control) : null,
    thumbnail: fileActions ? item => fileActions.thumbnail(item) : null,
  });
  // Pasted images go where the Image control's would, so only where that control exists.
  const composer = readOnly
    ? null
    : richText.createRichComposer({
      placeholder: text.placeholder, maxLength: 2000, onSubmit: () => submit(),
      onPasteImage: elements.imageInput ? pasteImage : null,
    });
  if (composer) {
    elements.form.classList.add('chat-form--rich');
    elements.form.insertBefore(composer.element, elements.cancelEdit);
  }
  // The Attach menu and file sharing, where the page has an Attach button for them.
  const composerFiles = composer && groupFiles && elements.attachButton ? new ComposerFiles({
    elements: {
      attachButton: elements.attachButton, menuHost: elements.attachMenuHost || elements.form,
      imageInput: elements.imageInput, filesInput: elements.filesInput, folderInput: elements.folderInput,
      tray: elements.tray, dropZone: elements.dropZone || elements.form, dropHint: elements.dropHint,
    },
    groupFiles,
    onImage: file => pasteImage(file),
    showMessage: message => showFormMessage(message),
  }) : null;
  // The code box (/code, /gist) and the slash-command menu sit above the composer too.
  const codeBox = composer && elements.codeHost ? new CodeComposer({
    host: elements.codeHost,
    onSubmit: () => submit(),
    onClose: () => composer.focus(),
  }) : null;
  const commandMenu = composer && elements.commandHost ? new CommandMenu({
    composer,
    host: elements.commandHost,
    kindOf: () => (current?.loaded && !editing ? current.kind : null),
    onRun: (command, args) => commands.run(command, args),
  }) : null;
  // What the slash commands do (chat-commands.js).
  const commands = composer ? new ChatCommands({
    elements, composer, codeBox, api, me, text, profileUrl, onCommand,
    conversation: () => (current ? { kind: current.kind, id: current.id } : null),
    send: html => sendHtml(html),
    say: message => showFormMessage(message),
  }) : null;
  // "Replying to …" sits just above the composer.
  const replyBar = composer && canReply ? richText.createReplyBar({ onCancel: clearReply }) : null;
  if (replyBar) {
    if (elements.form.parentNode) elements.form.parentNode.insertBefore(replyBar.element, elements.form);
    else elements.form.insertBefore(replyBar.element, elements.form.firstChild);
  }

  const isOpen = (kind, id) => current?.kind === kind && current.id === id;
  const isMine = (kind, message) => message.senderKey === kinds[kind].selfKey;

  function showFormMessage(message) {
    elements.formStatus.textContent = message;
    elements.formStatus.hidden = !message;
  }

  // Icon and label go straight in the button: the preset themes recolor span text.
  function setSendLabel(icon, label) {
    const glyph = document.createElement('i');
    glyph.className = `fas ${icon}`;
    glyph.setAttribute('aria-hidden', 'true');
    elements.send.replaceChildren(glyph, ` ${label}`);
  }

  // Only saving an edit locks the composer. A send leaves it open, so the cursor stays
  // in it and you can start the next message.
  function refreshComposer() {
    if (!composer) return;
    const loaded = Boolean(current?.loaded);
    composer.setEnabled(loaded && pending !== 'edit');
    elements.send.disabled = !loaded || pending !== null;
    elements.cancelEdit.hidden = !editing;
    elements.cancelEdit.disabled = pending === 'edit';
    setSendLabel(editing ? 'fa-save' : 'fa-paper-plane', editing ? text.save : text.send);
    // Attaching isn't offered while editing, which rewrites the text of a sent message.
    composerFiles?.setContext({ kind: current?.kind ?? null, id: current?.id ?? null, loaded, editing: Boolean(editing) });
  }

  // ── Attaching an image ───────────────────────────────────────────────────────
  // Optional elements: a site running without the attach controls in its markup still
  // works, it just cannot attach.
  function clearImage() {
    pendingImage = null;
    if (elements.imageInput) elements.imageInput.value = '';
    if (elements.imagePreview) elements.imagePreview.classList.add('hidden');
    if (elements.imageThumb) elements.imageThumb.removeAttribute('src');
  }

  async function pickImage(file) {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      clearImage();
      showFormMessage(text.imageOnly);
      return;
    }
    try {
      pendingImage = await readImageFile(file);
    } catch (error) {
      console.warn('Messages: could not read that image', error);
      clearImage();
      showFormMessage(text.imageUnreadable);
      return;
    }
    if (elements.imageThumb) elements.imageThumb.src = pendingImage;
    if (elements.imagePreview) elements.imagePreview.classList.remove('hidden');
    showFormMessage('');
    refreshComposer();
  }

  // A pasted image waits like a picked one, wherever the conversation can store images.
  function pasteImage(file) {
    if (!current?.loaded || !kinds[current.kind]?.supportsImages) return;
    if (editing) {
      showFormMessage(text.imageWhileEditing);
      return;
    }
    pickImage(file);
  }

  function clearReply() {
    replyingTo = null;
    replyBar?.hide();
  }

  // An image-only message has no text to quote, so its quote says so.
  function beginReply(message) {
    if (!composer || pending === 'edit' || !current?.loaded || !message?.id || message.deleted) return;
    if (editing) resetEdit();
    const { html } = richText.extractReplyMarker(message.body);
    replyingTo = {
      id: message.id,
      sender: message.isSelf ? me.name : message.senderName,
      excerpt: richText.replyExcerpt(html)
        || (message.image ? text.imageMessage : '')
        || (FilesMarker.extract(html).items.length ? text.filesMessage : '')
        || (CodeBlocks.extractMarker(FilesMarker.extract(html).html).code !== null ? text.codeMessage : ''),
    };
    replyBar.show(replyingTo);
    showFormMessage('');
    composer.focus();
  }

  function resetEdit() {
    editing = null;
    editingReply = null;
    editingFiles = [];
    editingCode = null;
    clearReply();
    composer?.clear();
    clearImage();
    showFormMessage('');
    refreshComposer();
  }

  function beginEdit(message) {
    if (!composer || pending || !message || message.deleted) return;
    clearReply();
    editing = message;
    // The quote isn't editable text: it is set aside and put back on save.
    const { reply, html } = canReply ? richText.extractReplyMarker(message.body) : { reply: null, html: message.body };
    editingReply = reply;
    // So is the list of files it shared: an edit changes the words, not what was shared.
    const { items, html: afterFiles } = FilesMarker.extract(html);
    editingFiles = items;
    // And so is its code block, which the editor can't show as text.
    const { language, code, html: words } = CodeBlocks.extractMarker(afterFiles);
    editingCode = code === null ? null : { language, code };
    composer.setHTML(words);
    showFormMessage('');
    refreshComposer();
    composer.focus();
  }

  async function markRead(id) {
    onDmRead(id);
    try {
      await api.markDmRead(id);
      window.dispatchEvent(new Event('dm:refresh-unread'));
    } catch (error) {
      console.warn('Messages: could not mark the conversation read', error);
    }
  }

  // Adds anything saved that isn't on screen yet, without clearing what is. Best effort:
  // a failure only means the page waits for the socket or the next open.
  async function loadNew(kind, id) {
    try {
      const messages = await kinds[kind].load(id);
      if (!isOpen(kind, id)) return;
      messages.forEach(message => log.append(message, isMine(kind, message)));
    } catch (error) {
      console.warn('Messages: could not fetch new messages', error);
    }
  }

  // Shares what waits in the tray before the message goes. Resolves the items for its
  // [[files:…]] marker, [] when nothing waits, or null when the message should stay unsent.
  async function shareFirst() {
    if (unsentFiles) return unsentFiles;
    if (!composerFiles?.hasFiles()) return [];
    const shared = await composerFiles.share();
    return shared ? shared.items : null;
  }

  // asCommand false sends what a command made (/me's words) without reading it as one.
  async function submit({ asCommand = true } = {}) {
    // A finished slash command runs instead of sending ("/issue a/b#3" from the Send button).
    const typed = asCommand && !editing ? commandMenu?.typedCommand() : null;
    if (typed && !pending && current?.loaded) {
      composer.clear();
      commands.run(typed.command, typed.args);
      return;
    }
    // An image, files or a code block on their own are a message, so an empty composer is
    // only a reason to stop when nothing is attached. Editing stays text-only.
    const sendingImage = !editing && pendingImage;
    const sendingFiles = !editing && (Boolean(unsentFiles) || Boolean(composerFiles?.hasFiles()));
    const code = !editing ? codeBox?.value() : null;
    // Code the box can't send (over its limit, which its hint says) holds the words back too,
    // so they never go without it.
    if (!editing && !code && codeBox?.hasCode()) return;
    if (pending || !current?.loaded || composer.isOverLimit()) return;
    // An edit may take out all of a code message's words: its code is still a message.
    if (composer.isEmpty() && !sendingImage && !sendingFiles && !code && !(editing && editingCode)) return;
    if (sendingFiles && composerFiles?.problem()) return; // the tray says why
    const { kind, id } = current;
    const target = editing;
    const html = composer.getHTML();
    const reply = target ? editingReply : replyingTo;
    const hadFocus = composer.element.contains(document.activeElement);
    pending = target ? 'edit' : 'send';
    showFormMessage('');
    refreshComposer();
    // Only a share waits before the send: a plain message goes out at once.
    // An edit keeps the files its message lists; only a share waits before a send.
    let files = [];
    if (target) files = editingFiles;
    else if (sendingFiles) files = await shareFirst();
    if (destroyed) return;
    if (files === null) {
      pending = null;
      refreshComposer();
      return;
    }
    // A code block goes in the message as its marker; a gist is saved first, and its link goes.
    let withCode = target && editingCode ? CodeBlocks.addMarker(html, editingCode.language, editingCode.code) : html;
    if (code?.mode === 'code') {
      withCode = CodeBlocks.addMarker(html, code.language, code.code);
    } else if (code?.mode === 'gist') {
      const url = await commands.saveGist(code.language, code.code, code.filename);
      if (destroyed) return;
      if (!url) {
        pending = null;
        refreshComposer();
        return;
      }
      withCode = html ? `${html} ${url}` : url;
    }
    const withFiles = FilesMarker.add(withCode, files);
    const outgoing = reply ? richText.addReplyMarker(withFiles, reply) : withFiles;
    // Spring keeps a direct message to 2,000 characters, so a longer one never goes.
    if (kind === 'dm' && outgoing.length > ChatCommands.DM_MAX_LENGTH) {
      pending = null;
      refreshComposer();
      showFormMessage(text.tooLongForDm);
      return;
    }
    let saved = null;
    try {
      if (target) await kinds[kind].edit(id, target.id, outgoing);
      else saved = await kinds[kind].send(id, outgoing, sendingImage || null);
    } catch (error) {
      pending = null;
      console.warn('Messages: could not save the message', error);
      if (target && log.get(target.key)?.deleted) {
        resetEdit();
        showFormMessage(text.editOfDeleted);
      } else if (!target && files.length) {
        // The files are up; the next Send tries the message again without uploading them twice.
        unsentFiles = files;
        refreshComposer();
        showFormMessage(text.sharedButNotSent);
      } else {
        refreshComposer();
        showFormMessage(target ? text.editFailed : text.sendFailed);
      }
      return;
    }
    unsentFiles = null;
    // Code changed while the message was saving stays in the box for the next one.
    if (code && codeBox.value()?.code === code.code) codeBox.close();
    // A pane destroyed while the message was saving has nothing left to update or fetch.
    if (destroyed) return;
    pending = null;
    if (target) {
      log.updateBody(target.key, outgoing);
      resetEdit();
      if (hadFocus) composer.focus();
      return;
    }
    // The attachment and the reply went with that message; the next one starts clean.
    if (sendingImage) clearImage();
    if (reply && reply === replyingTo) clearReply();
    // Keep anything typed while the message was sending.
    if (composer.getHTML() === html) composer.clear();
    refreshComposer();
    // Your message comes back on the socket, but a socket that subscribed a moment ago can miss
    // it, so what the send answered goes on screen too (the log skips messages it has). Offline
    // nothing comes back, so fetch it.
    showSaved(kind, id, saved);
    if (!socket.isConnected()) loadNew(kind, id);
  }

  // Sends a message a command made (a GitHub link, /me, /shrug) as if it had been typed.
  function sendHtml(html) {
    composer.setHTML(html);
    submit({ asCommand: false });
  }

  // A group send answers with the chat's messages, a DM send with the saved message's event.
  // onChanged(kind, id) after the open conversation's messages change, once per burst: a
  // history of a hundred messages loading is one change, so the Shared panel draws once.
  let changeQueued = false;
  function noteChange() {
    if (changeQueued) return;
    changeQueued = true;
    queueMicrotask(() => {
      changeQueued = false;
      if (current && !destroyed) onChanged(current.kind, current.id);
    });
  }

  // Pins or unpins a message by sending a pin message ([[pin:<id>]], conversation-model.js),
  // so everyone in the conversation sees the same pins.
  async function togglePin(message, pinned) {
    if (!current?.loaded || !message?.id) return false;
    if (pending) {
      showFormMessage(text.waitForSave);
      return false;
    }
    const { kind, id } = current;
    showFormMessage('');
    try {
      const body = pinned ? Conversation.unpinMarker(message.id) : Conversation.pinMarker(message.id);
      const saved = await kinds[kind].send(id, body, null);
      if (destroyed || !isOpen(kind, id)) return true;
      showSaved(kind, id, saved);
      if (!socket.isConnected()) loadNew(kind, id);
      return true;
    } catch (error) {
      console.warn('Messages: could not change the pin', error);
      if (!destroyed && isOpen(kind, id)) showFormMessage(text.pinFailed);
      return false;
    }
  }

  function showSaved(kind, id, saved) {
    if (kind === 'group' && Array.isArray(saved)) {
      saved.map(groupMessage).forEach(message => log.append(message, isMine(kind, message)));
    } else if (kind === 'dm' && saved && typeof saved === 'object') {
      const change = classifyDmEvent(saved, id, key => log.has(key));
      if (change.type === 'message') log.append(change.message, true);
    }
  }

  async function deleteMessage(message, button) {
    if (pending || !current || !message || message.deleted) return;
    const { kind, id } = current;
    button.disabled = true;
    showFormMessage('');
    try {
      await kinds[kind].remove(id, message.id);
      log.markDeleted(message.key);
      if (editing?.key === message.key) resetEdit();
      if (kind === 'dm') {
        window.dispatchEvent(new CustomEvent('dm:message-deleted', { detail: { conversationId: id, messageId: message.id } }));
      }
    } catch (error) {
      console.warn('Messages: could not delete the message', error);
      button.disabled = false;
      showFormMessage(text.deleteFailed);
    }
  }

  function handleEvent(kind, id, event) {
    if (!isOpen(kind, id)) return;
    if (!current.loaded) {
      early.push(event);
      return;
    }
    const change = kind === 'group' ? classifyGroupEvent(event) : classifyDmEvent(event, id, key => log.has(key));
    switch (change.type) {
      case 'message':
        log.append(change.message, isMine(kind, change.message));
        if (isMine(kind, change.message)) break;
        // Arriving in the conversation you are looking at means you have read it. A
        // group advances its read marker the same way a DM does, or a message received
        // while the group was open would still be counted as unread on the next load.
        if (document.visibilityState !== 'visible') {
          unseenWhileHidden = true;
          break;
        }
        if (kind === 'dm') markRead(id);
        else onGroupRead(id);
        break;
      case 'edit':
        log.updateBody(change.id, change.body);
        break;
      case 'delete':
        log.markDeleted(change.id);
        if (editing?.key === change.id && pending !== 'edit') resetEdit();
        // Someone else deleting a message can change your unread count.
        if (kind === 'dm' && change.senderUid !== me.uid) window.dispatchEvent(new Event('dm:refresh-unread'));
        break;
      // A file went up. The message that shares it lists it, so the log adds nothing; the
      // group's file list is just out of date.
      case 'file':
        groupFiles?.(id)?.refresh();
        onFileShared(id);
        break;
      case 'error':
        showFormMessage(change.text);
        break;
      default:
        break;
    }
  }

  // Opening a conversation follows its topic before asking for its history, so nothing
  // posted in between is missed; frames that beat the history wait in `early`.
  function follow() {
    if (!current) return;
    const { kind, id } = current;
    socket.follow(kinds[kind].topic(id), event => handleEvent(kind, id, event));
  }

  // Called once the socket connects. A conversation opened before then asked for its
  // history without following its topic, so it fetches whatever was posted since.
  function resume() {
    if (!current) return;
    follow();
    if (current.loaded) loadNew(current.kind, current.id);
    else current.catchUp = true;
  }

  function setHeading(title, subtitle) {
    elements.title.textContent = title;
    elements.subtitle.textContent = subtitle;
  }

  // Returns whether the conversation opens; its messages then load in the background.
  function open(kind, id, { title, subtitle }) {
    if (isOpen(kind, id) && current.loaded) return true;
    if (pending) {
      showFormMessage(text.waitForSave);
      return false;
    }
    const ticket = ++openCount;
    current = { kind, id, loaded: false, catchUp: false };
    unsentFiles = null;
    // Like the text, a code block being written belongs to the conversation it was begun in.
    codeBox?.close();
    fileActions?.clear();
    // The page hears about shares only in the open conversation, so a group's list kept from
    // an earlier visit may miss files shared meanwhile; the next read fetches it again.
    if (kind === 'group') groupFiles?.(id)?.refresh();
    early = [];
    unseenWhileHidden = false;
    setHeading(title, subtitle);
    resetEdit();
    follow();
    log.showEmpty(text.loading);
    load(kind, id, ticket);
    return true;
  }

  async function load(kind, id, ticket) {
    let messages;
    try {
      messages = await kinds[kind].load(id);
    } catch (error) {
      if (ticket !== openCount) return;
      console.warn('Messages: could not load the conversation', error);
      log.showEmpty(text.loadFailedTitle, text.loadFailedHint);
      return;
    }
    if (ticket !== openCount) return;
    current.loaded = true;
    log.clear();
    if (!messages.length) {
      const empty = emptyState || EMPTY_STATES[kind];
      log.showEmpty(empty.title, empty.hint);
    }
    messages.forEach(message => log.append(message, isMine(kind, message)));
    // The log skips any early frame whose message the history already drew.
    const waiting = early;
    early = [];
    waiting.forEach(event => handleEvent(kind, id, event));
    refreshComposer();
    if (current.catchUp) loadNew(kind, id);
    if (kind === 'dm') markRead(id);
    if (current.reveal) log.reveal(current.reveal);
  }

  // Scrolls the open conversation to one message and marks it: what a search result
  // asks for. Asked while the history is still loading, it happens once that arrives.
  function showMessage(key) {
    if (!current) return;
    if (current.loaded) log.reveal(key);
    else current.reveal = key;
  }

  function close() {
    openCount += 1;
    current = null;
    early = [];
    socket.unfollow();
    setHeading(text.idleTitle, '');
    log.showEmpty(text.idleTitle, text.idleHint);
    resetEdit();
  }

  function onVisibilityChange() {
    if (document.visibilityState !== 'visible' || !unseenWhileHidden) return;
    unseenWhileHidden = false;
    if (current?.kind === 'dm') markRead(current.id);
    else if (current?.kind === 'group') onGroupRead(current.id);
  }

  // For a pane removed while the page stays open (an embed). Nothing still loading draws
  // into it, it follows no topic, and the listeners it put on the document go with it;
  // the ones on its own elements go when the host drops those elements.
  function destroy() {
    destroyed = true;
    openCount += 1;
    current = null;
    early = [];
    socket.unfollow();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    composer?.destroy();
    composerFiles?.destroy();
    commandMenu?.destroy();
    codeBox?.destroy();
    fileActions?.clear();
    // A viewer the page handed in is the page's to keep.
    if (!sharedViewer) viewer?.destroy();
    // Takes the image viewer and its Escape listener off the page too.
    log.destroy();
  }

  document.addEventListener('visibilitychange', onVisibilityChange);

  if (composer) {
    elements.form.addEventListener('submit', event => {
      event.preventDefault();
      submit();
    });
    elements.cancelEdit.addEventListener('click', resetEdit);
    elements.imageInput?.addEventListener('change', event => {
      pasteImage(event.target.files?.[0]);
      event.target.value = '';
    });
  }
  // Without file sharing (an embed), an image dropped on the composer is attached the old way.
  if (composer && !composerFiles) {
    const setDragging = active => {
      elements.form.classList.toggle('is-dragging', active);
      if (elements.dropHint) elements.dropHint.setAttribute('aria-hidden', String(!active));
    };
    elements.form.addEventListener('dragenter', event => {
      event.preventDefault();
      dragDepth += 1;
      setDragging(true);
    });
    elements.form.addEventListener('dragover', event => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    elements.form.addEventListener('dragleave', () => {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) setDragging(false);
    });
    elements.form.addEventListener('drop', event => {
      event.preventDefault();
      dragDepth = 0;
      setDragging(false);
      pickImage(event.dataTransfer?.files?.[0]);
    });
  }
  if (composer) {
    elements.imageRemove?.addEventListener('click', () => {
      clearImage();
      refreshComposer();
    });
    composer.element.addEventListener('keydown', event => {
      if (event.key === 'Escape' && editing && pending !== 'edit') {
        event.preventDefault();
        resetEdit();
      } else if (event.key === 'Escape' && replyingTo) {
        event.preventDefault();
        clearReply();
      }
    });
  }

  close();

  return {
    open, close, resume, setHeading, showMessage, destroy, togglePin,
    current: () => (current ? { kind: current.kind, id: current.id } : null),
    // The open conversation's messages as loaded, oldest first: the Shared panel reads its
    // media, links and pins from them.
    messages: () => (current?.loaded ? log.list() : []),
    isPinned: messageId => log.isPinned(messageId),
    // Ctrl or Cmd+/ (shortcuts.js) opens the commands as if / had been typed. With a draft
    // in the box the menu would replace it, so /help lists the commands instead.
    showCommands: () => commandMenu?.open() || onCommand('help'),
  };
}
