// The conversation pane. It loads the open group chat or direct message, follows its
// topic on the socket, and sends, edits and deletes through REST. For a direct message
// it also keeps read state current: opening it, or a message arriving while the tab is
// visible, marks it read and tells the navbar bell (assets/js/api/dm-notifications.js).
import { classifyDmEvent, classifyGroupEvent, dmMessage, groupMessage } from './messages-model.js';
import { createMessageLog } from './message-log.js';
import { readImageFile, saveFile } from './dialogs.js';

export function createThread({ elements, api, socket, richText, me, onDmRead, onGroupRead = () => {}, onFileShared }) {
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
      emptyHint: 'Say hi.',
    },
    group: {
      load: id => api.groupMessages(id).then(list => (list || []).map(groupMessage)),
      send: (id, html, image) => api.sendGroupMessage(id, html, image),
      supportsImages: true,
      edit: (id, messageId, html) => api.editGroupMessage(id, messageId, html),
      remove: (id, messageId) => api.deleteGroupMessage(id, messageId),
      topic: id => `/topic/group/${id}`,
      selfKey: me.name,
      emptyHint: 'Say hi to your group.',
    },
  };

  let current = null; // { kind, id, loaded, catchUp } for the open conversation
  let openCount = 0; // a newer open makes an older one that is still loading stop
  let editing = null; // the message being edited
  let pending = null; // 'send' or 'edit' while that request is in flight
  let early = []; // frames that arrived before the open conversation's history
  let unseenWhileHidden = false;
  let pendingImage = null; // a data URL attached to the next message, or null

  const log = createMessageLog(elements.messages, { richText, me, onEdit: beginEdit, onDelete: deleteMessage });
  const composer = richText.createRichComposer({ placeholder: 'Type a message…', maxLength: 2000, onSubmit: submit });
  elements.form.classList.add('chat-form--rich');
  elements.form.insertBefore(composer.element, elements.cancelEdit);

  const isOpen = (kind, id) => current?.kind === kind && current.id === id;
  const isMine = (kind, message) => message.senderKey === kinds[kind].selfKey;

  function showFormMessage(text) {
    elements.formStatus.textContent = text;
    elements.formStatus.hidden = !text;
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
    const loaded = Boolean(current?.loaded);
    composer.setEnabled(loaded && pending !== 'edit');
    elements.send.disabled = !loaded || pending !== null;
    elements.cancelEdit.hidden = !editing;
    elements.cancelEdit.disabled = pending === 'edit';
    setSendLabel(editing ? 'fa-save' : 'fa-paper-plane', editing ? 'Save' : 'Send');
    // Attaching is offered only where the conversation can store an image, and not
    // while editing, which rewrites the text of a message that is already sent.
    if (elements.imageAttach) {
      const canAttach = loaded && !editing && Boolean(kinds[current?.kind]?.supportsImages);
      elements.imageAttach.classList.toggle('hidden', !canAttach);
    }
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
    try {
      pendingImage = await readImageFile(file);
    } catch (error) {
      console.warn('Messages: could not read that image', error);
      clearImage();
      showFormMessage('Could not read that image. Try a different file.');
      return;
    }
    if (elements.imageThumb) elements.imageThumb.src = pendingImage;
    if (elements.imagePreview) elements.imagePreview.classList.remove('hidden');
    showFormMessage('');
    refreshComposer();
  }

  function resetEdit() {
    editing = null;
    composer.clear();
    clearImage();
    showFormMessage('');
    refreshComposer();
  }

  function beginEdit(message) {
    if (pending || !message || message.deleted) return;
    editing = message;
    composer.setHTML(message.body);
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

  async function submit() {
    // An image on its own is a message, so an empty composer is only a reason to stop
    // when nothing is attached. Editing stays text-only.
    const sendingImage = !editing && pendingImage;
    if (pending || !current?.loaded || composer.isOverLimit()) return;
    if (composer.isEmpty() && !sendingImage) return;
    const { kind, id } = current;
    const target = editing;
    const html = composer.getHTML();
    const hadFocus = composer.element.contains(document.activeElement);
    pending = target ? 'edit' : 'send';
    showFormMessage('');
    refreshComposer();
    try {
      if (target) await kinds[kind].edit(id, target.id, html);
      else await kinds[kind].send(id, html, sendingImage || null);
    } catch (error) {
      pending = null;
      console.warn('Messages: could not save the message', error);
      if (target && log.get(target.key)?.deleted) {
        resetEdit();
        showFormMessage('That message was deleted, so your edit was not saved.');
      } else {
        refreshComposer();
        showFormMessage(target ? 'Could not save your edit. Try again.' : 'Could not send the message. Try again.');
      }
      return;
    }
    pending = null;
    if (target) {
      log.updateBody(target.key, html);
      resetEdit();
      if (hadFocus) composer.focus();
      return;
    }
    // The attachment went with that message; the next one starts clean.
    if (sendingImage) clearImage();
    // Keep anything typed while the message was sending.
    if (composer.getHTML() === html) composer.clear();
    refreshComposer();
    // Your message comes back on the socket. Offline nothing comes back, so fetch it.
    if (!socket.isConnected()) loadNew(kind, id);
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
      showFormMessage('Could not delete the message. Try again.');
    }
  }

  // The socket's file frame carries the bytes, but a conversation opened later only has
  // the line in the log, so the file is fetched by name when it is clicked. The list
  // endpoint is the only way to read one back -- there is no per-file URL.
  async function downloadShared(groupId, filename, control) {
    control.disabled = true;
    try {
      const files = await api.groupFiles(groupId);
      const match = (files || []).find(file => file.filename === filename);
      if (!match) {
        showFormMessage(`${filename} is no longer shared with this group.`);
        return;
      }
      saveFile(match);
    } catch (error) {
      console.warn('Messages: could not download the shared file', error);
      showFormMessage(`Could not download ${filename}. Try again.`);
    } finally {
      control.disabled = false;
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
      case 'file':
        log.note(
          change.sender ? `${change.sender} shared a file:` : 'A file was shared:',
          { label: change.filename, onClick: control => downloadShared(id, change.filename, control) },
        );
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
      showFormMessage('Wait for your message to finish saving first.');
      return false;
    }
    const ticket = ++openCount;
    current = { kind, id, loaded: false, catchUp: false };
    early = [];
    unseenWhileHidden = false;
    setHeading(title, subtitle);
    resetEdit();
    follow();
    log.showEmpty('Loading messages…');
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
      log.showEmpty('Could not load these messages', 'Check your connection, then pick the conversation again.');
      return;
    }
    if (ticket !== openCount) return;
    current.loaded = true;
    log.clear();
    if (!messages.length) log.showEmpty('No messages yet', kinds[kind].emptyHint);
    messages.forEach(message => log.append(message, isMine(kind, message)));
    // The log skips any early frame whose message the history already drew.
    const waiting = early;
    early = [];
    waiting.forEach(event => handleEvent(kind, id, event));
    refreshComposer();
    if (current.catchUp) loadNew(kind, id);
    if (kind === 'dm') markRead(id);
  }

  function close() {
    openCount += 1;
    current = null;
    early = [];
    socket.unfollow();
    setHeading('Pick a conversation', '');
    log.showEmpty('Pick a conversation', 'Or start a new chat, or find a group to join.');
    resetEdit();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !unseenWhileHidden) return;
    unseenWhileHidden = false;
    if (current?.kind === 'dm') markRead(current.id);
    else if (current?.kind === 'group') onGroupRead(current.id);
  });

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    submit();
  });
  elements.cancelEdit.addEventListener('click', resetEdit);
  elements.imageInput?.addEventListener('change', event => pickImage(event.target.files?.[0]));
  elements.imageRemove?.addEventListener('click', () => {
    clearImage();
    refreshComposer();
  });
  composer.element.addEventListener('keydown', event => {
    if (event.key === 'Escape' && editing && pending !== 'edit') {
      event.preventDefault();
      resetEdit();
    }
  });

  close();

  return { open, close, resume, setHeading, current: () => (current ? { kind: current.kind, id: current.id } : null) };
}
