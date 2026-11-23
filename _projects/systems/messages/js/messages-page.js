// Starts the Messages page (/dm, navigation/dm.md): your groups and direct messages in
// one sidebar, the open conversation beside them, and the group dialogs. The page hands
// in config.js and rich-text.js, which it imports with {{ site.baseurl }}, so the modules
// here only import each other, with ./ paths.
import { createChatSocket } from './chat-socket.js';
import { ConversationPanel } from './conversation-panel.js';
import { initDeleteGroup } from './delete-group.js';
import { FileActions } from './file-actions.js';
import { FileViewer } from './file-viewer.js';
import { GitHubCards } from './github-cards.js';
import { GitHubSource } from './github-source.js';
import { initGroupFormation } from './group-formation.js';
import { initFindGroup, initMembers } from './group-dialogs.js';
import { GroupFiles } from './group-files.js';
import { HelpDialog } from './help-dialog.js';
import { initMessageSearch } from './message-search.js';
import { createMessagesApi } from './messages-api.js';
import {
  canFormGroups, conversationLabel, groupSubtitle, isClassGroup, isCourseChannel, sortGroups,
} from './messages-model.js';
import { initNewChat } from './new-chat.js';
import { initNotifyButton } from './notify-button.js';
import { initScheduleDialog } from './schedule-dialog.js';
import { Shortcuts } from './shortcuts.js';
import { conversationHref, createSidebar } from './sidebar.js';
import { createThread } from './thread.js';

const byId = id => document.getElementById(id);

function createStatus() {
  const pill = byId('messagesStatusPill');
  const text = byId('messagesStatus');
  return (label, tone = '') => {
    text.textContent = label;
    pill.classList.remove('is-live', 'is-preview', 'is-error');
    if (tone) pill.classList.add(tone);
  };
}

async function signedInPerson(api, setStatus) {
  try {
    const person = await api.currentPerson();
    if (person?.uid) return person;
  } catch (error) {
    // No HTTP status means Spring didn't answer at all.
    if (!error.status) {
      console.warn('Messages: Spring is unreachable', error);
      setStatus('offline', 'is-error');
      byId('messagesNotice').textContent = 'Messages can’t reach the server right now. Try again in a moment.';
      return null;
    }
  }
  setStatus('signed out');
  byId('messagesSignedOut').hidden = false;
  return null;
}

export async function startMessagesPage({ config, richText, push }) {
  const api = createMessagesApi(config);
  const setStatus = createStatus();
  const notice = byId('messagesNotice');
  setStatus('loading…');

  const me = await signedInPerson(api, setStatus);
  if (!me) return;
  const state = { groups: [], conversations: [], active: null, query: '' };
  let messageSearch = null; // set once the search box is wired up, below
  // The search box in the chat header searches the open direct message, so it is told which.
  const syncSearchScope = () => {
    const open = state.active?.kind === 'dm' ? findItem('dm', state.active.id) : null;
    messageSearch?.setConversation(open ? open.id : null, open ? conversationLabel(open) : '');
  };
  const findItem = (kind, id) => (kind === 'group' ? state.groups : state.conversations).find(item => item.id === id);

  const sidebar = createSidebar({
    groupList: byId('messagesGroupList'),
    dmList: byId('messagesDmList'),
    onOpen: (kind, id) => openConversation(kind, id),
  });
  const render = () => sidebar.render(state);
  // "Find a conversation" narrows both lists as you type; Enter opens the first one left,
  // and Escape clears it.
  const conversationSearch = byId('messagesConversationSearch');
  if (conversationSearch) {
    conversationSearch.addEventListener('input', () => {
      state.query = conversationSearch.value.trim();
      render();
    });
    conversationSearch.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector('#messagesGroupList a, #messagesDmList a')?.click();
        return;
      }
      if (event.key !== 'Escape' || !conversationSearch.value) return;
      event.preventDefault();
      conversationSearch.value = '';
      state.query = '';
      render();
    });
  }

  const socket = createChatSocket(config.javaWebSocketURI, { onClose: () => setStatus('disconnected', 'is-error') });
  // One GroupFiles per group, so a group's file list is fetched once and shared by the
  // thread, the files under its messages and the Shared panel's Files tab.
  const filesByGroup = new Map();
  const groupFiles = id => {
    if (!filesByGroup.has(id)) filesByGroup.set(id, new GroupFiles({ api, groupId: id }));
    return filesByGroup.get(id);
  };
  const viewer = new FileViewer({ root: document.querySelector('.dm') || document.body });
  // A GitHub link in a message, DM or group, shows as a card: GitHub's API from the browser,
  // gists through Spring, kept 10 minutes in localStorage where the browser allows it.
  const githubCards = new GitHubCards({ source: new GitHubSource({ readGist: id => api.readGist(id), storage: GitHubSource.browserStorage() }) });
  let panel = null; // the Shared panel, made once the thread exists (it reads the thread)
  // The Shared panel's Files tab, as a group's file share reaches it (the thread's onFileShared).
  const files = { refreshIfShowing: groupId => panel.refreshIfShowing('group', groupId) };
  const help = new HelpDialog({
    elements: { dialog: byId('helpDialog'), body: byId('helpBody') },
    isMac: /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || ''),
  });
  let scheduleDialog = null; // wired up below, once the thread exists
  const thread = createThread({
    api,
    onSchedule: (message, opener) => scheduleDialog?.open(message, opener),
    socket,
    richText,
    me,
    groupFiles,
    viewer,
    linkCards: html => githubCards.forBody(html),
    // The Shared panel's Media, Links and Pinned follow the chat while it's open.
    onChanged: (kind, id) => panel?.refreshMessages(kind, id),
    runCode: (language, code) => api.runCode(language, code),
    // /dm sits at the site's root, so Profile is beside it, base path and all (a fork's /repo).
    profileUrl: new URL('profile', window.location.href).pathname,
    // The slash commands that open something on the page rather than in the composer.
    onCommand: name => {
      if (['files', 'media', 'links', 'pinned'].includes(name)) openPanel({ tab: name });
      else if (name === 'members') byId('messagesMembers').click();
      else if (name === 'search') byId('messagesSearch').focus();
      else if (name === 'help') help.open(byId('messagesForm'));
    },
    // Where the slash commands are, said where people type.
    texts: { placeholder: 'Write a message, or type / for commands' },
    // A folder's Open button in the chat opens it in the Shared panel's Files tab.
    onOpenFolder: (groupId, path) => {
      const group = findItem('group', groupId);
      if (group) panel.open({ kind: 'group', id: group.id, name: group.name }, byId('messagesSharedButton'), { tab: 'files', folderPath: path });
    },
    elements: {
      title: byId('messagesThreadTitle'), subtitle: byId('messagesThreadSubtitle'), messages: byId('messagesLog'),
      form: byId('messagesForm'), send: byId('messagesSend'), cancelEdit: byId('messagesCancelEdit'),
      formStatus: byId('messagesFormStatus'),
      imageInput: byId('messagesImage'), imagePreview: byId('messagesImagePreview'), imageThumb: byId('messagesImageThumb'),
      imageRemove: byId('messagesImageRemove'),
      attachButton: byId('messagesAttachButton'), attachMenuHost: byId('messagesAttach'),
      filesInput: byId('messagesFilesInput'), folderInput: byId('messagesFolder'), tray: byId('messagesAttachTray'),
      dropZone: document.querySelector('.dm__thread'), dropHint: byId('messagesDropHint'),
      commandHost: byId('messagesCommandHost'), codeHost: byId('messagesCodeHost'),
    },
    onDmRead: id => {
      const conversation = findItem('dm', id);
      if (!conversation?.unreadCount) return;
      conversation.unreadCount = 0;
      render();
    },
    onGroupRead: id => markGroupRead(findItem('group', id)),
    onFileShared: id => files.refreshIfShowing(id),
  });

  const groupActions = byId('messagesGroupActions');
  const openGroup = () => (state.active?.kind === 'group' ? findItem('group', state.active.id) : null);

  // The shared .hidden class, not the hidden attribute: ocs__btn and ocs__links set
  // their own display, which beats [hidden]. The box holds Shared too, which shows for any
  // open conversation; Members and Leave are a group's, and a class group has no Leave.
  function showGroupActions(group) {
    groupActions.classList.toggle('hidden', !state.active);
    byId('messagesMembers').classList.toggle('hidden', !group);
    byId('messagesLeaveGroup').classList.toggle('hidden', !group || isClassGroup(group));
  }

  panel = new ConversationPanel({
    elements: {
      dialog: byId('conversationPanel'), title: byId('conversationPanelTitle'), tabList: byId('conversationPanelTabs'),
      status: byId('conversationPanelStatus'),
      panels: {
        files: byId('conversationPanelFiles'), media: byId('conversationPanelMedia'),
        links: byId('conversationPanelLinks'), pinned: byId('conversationPanelPinned'),
      },
    },
    thread,
    groupFilesFor: groupFiles,
    viewer,
    makeFileActions: ({ filesFor, notify }) => new FileActions({ filesFor, viewer, notify }),
    // Sharing starts from the composer, so the chat says what was shared.
    onShare: () => byId('messagesAttachButton').click(),
  });
  // The Shared panel for the open conversation, on whichever tab is asked for.
  function openPanel(options = {}, opener = byId('messagesSharedButton')) {
    if (!state.active) return;
    const item = findItem(state.active.kind, state.active.id);
    if (!item) return;
    const name = state.active.kind === 'group' ? item.name : conversationLabel(item);
    panel.open({ kind: state.active.kind, id: state.active.id, name }, opener, options);
  }

  // Clears the badge straight away, then tells Spring, then the navbar bell. The count is
  // a notification, so a failed write is not worth interrupting the person for -- the
  // next load corrects it.
  async function markGroupRead(group) {
    if (!group) return;
    if (group.unreadCount) {
      group.unreadCount = 0;
      render();
    }
    try {
      await api.markGroupRead(group.id);
      window.dispatchEvent(new CustomEvent('dm:group-read', { detail: { groupId: group.id } }));
    } catch (error) {
      console.warn('Messages: could not mark the group read', error);
    }
  }

  function openConversation(kind, id) {
    const item = findItem(kind, id);
    if (!item) return false;
    const heading = kind === 'group'
      ? { title: item.name, subtitle: groupSubtitle(item) }
      : { title: conversationLabel(item), subtitle: 'Direct message' };
    if (!thread.open(kind, id, heading)) return false;
    state.active = { kind, id };
    notice.textContent = '';
    // Opening a group clears its badge. Done here rather than in thread.js so it
    // happens once per open, matching how a DM is marked read.
    if (kind === 'group') markGroupRead(item);
    render();
    syncSearchScope();
    showGroupActions(kind === 'group' ? item : null);
    history.replaceState(null, '', conversationHref(kind, id));
    // Nothing to scroll to on a phone: the page shows one pane at a time there (dm.md's
    // inline script swaps the list for the conversation), and the pane fills the window.
    return true;
  }

  // Ctrl/Cmd+K, Alt+↑/↓ and Ctrl/Cmd+/ (js/shortcuts.js). Alt+↑/↓ follow the sidebar's
  // order after any search, read from its links so the keys and the lists never disagree.
  function startShortcuts() {
    const page = document.querySelector('.dm');
    const sidebarOrder = () => [...document.querySelectorAll('#messagesGroupList a, #messagesDmList a')].map(link => {
      const params = new URL(link.href, window.location.href).searchParams;
      return params.has('group') ? { kind: 'group', id: Number(params.get('group')) } : { kind: 'dm', id: Number(params.get('dm')) };
    }).filter(item => Number.isInteger(item.id));
    new Shortcuts({
      order: sidebarOrder,
      active: () => state.active,
      open: (kind, id) => {
        const opened = openConversation(kind, id);
        // On a phone the list and the conversation share the screen; show the conversation.
        if (opened) page?.setAttribute('data-dm-view', 'thread');
        return opened;
      },
      findConversation: () => {
        page?.removeAttribute('data-dm-view');
        conversationSearch?.focus();
      },
      showCommands: () => thread.showCommands(),
      // From the conversation search, and from an empty message box.
      canSwitchFrom: target => target === conversationSearch
        || (Boolean(target.closest?.('.rt-editor')) && !target.closest('.rt-editor').textContent.trim()),
    });
  }

  function closeConversation() {
    thread.close();
    state.active = null;
    syncSearchScope();
    showGroupActions(null);
    history.replaceState(null, '', window.location.pathname);
  }

  // Unread counts live apart from the groups themselves (Spring counts them by reading
  // each group's message file), so they are fetched separately and folded in. Best
  // effort: a failure leaves the lists usable, just without counts.
  async function loadGroupUnread() {
    let unreadByGroup = {};
    try {
      unreadByGroup = (await api.groupUnread())?.unreadByGroup || {};
    } catch (error) {
      console.warn('Messages: could not load group notifications', error);
      return;
    }
    state.groups.forEach(group => {
      group.unreadCount = Number(unreadByGroup[group.id] || 0);
    });
    render();
  }

  async function loadGroups() {
    try {
      state.groups = sortGroups((await api.myGroups(me.id) || []).filter(group => !isCourseChannel(group)));
    } catch (error) {
      console.warn('Messages: could not load your groups', error);
      notice.textContent = 'Could not load your groups. Reload the page to try again.';
    }
    render();
    loadGroupUnread();
  }

  // The page only follows the open conversation's socket topic, so a message posted in
  // another group never reaches it. The navbar bell re-counts groups when the tab comes
  // back to the front and every couple of minutes, and its 'dm:unread' summary (below)
  // carries the counts here, so the page doesn't ask Spring a second time.

  async function loadConversations() {
    try {
      state.conversations = await api.conversations() || [];
    } catch (error) {
      console.warn('Messages: could not load your direct messages', error);
      notice.textContent = 'Could not load your direct messages. Reload the page to try again.';
    }
    render();
  }

  function groupChanged(updated) {
    const index = state.groups.findIndex(group => group.id === updated.id);
    if (index >= 0) state.groups[index] = updated;
    render();
    if (state.active?.kind === 'group' && state.active.id === updated.id) thread.setHeading(updated.name, groupSubtitle(updated));
  }

  function groupGone(id) {
    state.groups = state.groups.filter(group => group.id !== id);
    if (state.active?.kind === 'group' && state.active.id === id) closeConversation();
    render();
  }

  // ?group=<id> or ?dm=<id> opens that conversation, if it is one of yours.
  function openFromUrl() {
    const params = new URLSearchParams(window.location.search);
    for (const kind of ['group', 'dm']) {
      const id = Number(params.get(kind));
      if (params.has(kind) && Number.isInteger(id) && openConversation(kind, id)) return;
    }
  }

  const deleteGroup = initDeleteGroup({
    api,
    onDeleted: group => {
      groupGone(group.id);
      notice.textContent = `Deleted ${group.name}.`;
    },
    elements: {
      dialog: byId('deleteGroupDialog'), form: byId('deleteGroupForm'), title: byId('deleteGroupTitle'),
      warning: byId('deleteGroupWarning'), nameToType: byId('deleteGroupNameToType'), name: byId('deleteGroupName'),
      status: byId('deleteGroupStatus'), confirm: byId('deleteGroupConfirm'),
    },
  });
  const members = initMembers({
    api,
    me,
    onChanged: groupChanged,
    // Cancel returns focus to the header's Members button, where this started.
    onDelete: group => deleteGroup.open(group, byId('messagesMembers')),
    elements: {
      dialog: byId('membersDialog'), title: byId('membersTitle'), list: byId('membersList'),
      search: byId('membersSearch'), results: byId('membersResults'), status: byId('membersStatus'),
      deleteSection: byId('membersDeleteSection'), deleteWarning: byId('membersDeleteWarning'), deleteOpen: byId('membersDelete'),
    },
  });
  byId('messagesMembers').addEventListener('click', event => {
    const group = openGroup();
    if (group) members.open(group, event.currentTarget);
  });
  byId('messagesSharedButton').addEventListener('click', event => openPanel({}, event.currentTarget));
  byId('messagesLeaveGroup').addEventListener('click', async () => {
    const group = openGroup();
    if (!group || !window.confirm(`Leave ${group.name}? You can join it again from Find a group.`)) return;
    try {
      await api.removeMember(group.id, me.id);
      groupGone(group.id);
      notice.textContent = `You left ${group.name}.`;
    } catch (error) {
      console.warn('Messages: could not leave the group', error);
      notice.textContent = `Could not leave ${group.name}. Try again.`;
    }
  });
  initFindGroup({
    api,
    me,
    onJoined: async group => {
      await loadGroups();
      openConversation('group', group.id);
    },
    elements: {
      open: byId('messagesFindGroup'), dialog: byId('findGroupDialog'),
      searchForm: byId('groupSearchForm'), search: byId('groupSearch'), searchStatus: byId('groupSearchStatus'),
      table: byId('groupSearchTable'), results: byId('groupSearchResults'),
      createForm: byId('createGroupForm'), name: byId('createGroupName'), period: byId('createGroupPeriod'),
      course: byId('createGroupCourse'), create: byId('createGroupSubmit'), createStatus: byId('createGroupStatus'),
    },
  });
  initNewChat({
    api,
    me,
    onStarted: async conversation => {
      await loadConversations();
      openConversation('dm', conversation.id);
    },
    elements: {
      open: byId('messagesNewChat'), dialog: byId('newChatDialog'), form: byId('newChatForm'),
      search: byId('newChatSearch'), results: byId('newChatResults'), selected: byId('newChatSelected'),
      status: byId('newChatStatus'), start: byId('newChatStart'),
    },
  });
  scheduleDialog = initScheduleDialog({
    api,
    // A reply's body starts with a [[reply:...]] marker, which has no place in an event.
    stripMarkers: typeof richText.stripChatMarkers === 'function' ? richText.stripChatMarkers : undefined,
    // A link back to this chat, kept in the event's notes.
    chatUrl: () => (state.active ? `${location.origin}${location.pathname}${conversationHref(state.active.kind, state.active.id)}` : ''),
    onScheduled: text => { notice.textContent = text; },
    elements: {
      dialog: byId('scheduleDialog'), form: byId('scheduleForm'), title: byId('scheduleTitle'),
      date: byId('scheduleDate'), time: byId('scheduleTime'), status: byId('scheduleStatus'), save: byId('scheduleSave'),
    },
  });
  messageSearch = initMessageSearch({
    api,
    me,
    // The box only searches the open chat, so a match is always in the thread on screen.
    onPick: hit => thread.showMessage(String(hit.id)),
    cleanExcerpt: typeof richText.stripChatMarkers === 'function' ? richText.stripChatMarkers : undefined,
    elements: {
      form: byId('messagesSearchForm'), input: byId('messagesSearch'), panel: byId('messagesSearchPanel'),
      status: byId('messagesSearchStatus'), results: byId('messagesSearchResults'),
    },
  });
  syncSearchScope(); // a conversation opened from the address before the box existed
  if (canFormGroups(me)) {
    initGroupFormation({
      api,
      onSaved: loadGroups,
      elements: {
        open: byId('messagesFormGroups'), dialog: byId('formGroupsDialog'), form: byId('formGroupsForm'),
        course: byId('formCourse'), period: byId('formPeriod'), size: byId('formSize'), prefix: byId('formPrefix'),
        past: byId('formPast'), pastSize: byId('formPastSize'), pastStudentRating: byId('formPastStudentRating'),
        pastTeacherRating: byId('formPastTeacherRating'), pastPersonas: byId('formPastPersonas'), pastNote: byId('formPastNote'),
        suggest: byId('formSuggest'), status: byId('formStatus'), staging: byId('formStaging'), method: byId('formMethod'),
        groups: byId('formGroups'), regroup: byId('formRegroup'), save: byId('formSave'),
      },
    });
    byId('messagesFormGroups').classList.remove('hidden');
  }
  byId('messagesFindGroup').disabled = false;
  byId('messagesNewChat').disabled = false;
  initNotifyButton({ push, button: byId('messagesNotify'), notice });
  if (conversationSearch) conversationSearch.disabled = false;
  startShortcuts();

  // The navbar bell's summary keeps the unread counts current, and shows conversations
  // someone else started since the list loaded.
  window.addEventListener('dm:unread', ({ detail }) => {
    // A group the bell counts but the list doesn't have is one the page leaves alone.
    // The open group is marked read as messages arrive, so it never shows a count.
    const groupCounts = detail.groups || {};
    state.groups.forEach(group => {
      const isOpen = state.active?.kind === 'group' && state.active.id === group.id;
      group.unreadCount = isOpen ? 0 : Number(groupCounts[group.id] || 0);
    });
    const counts = detail.conversations || {};
    const known = new Set(state.conversations.map(conversation => String(conversation.id)));
    if (Object.keys(counts).some(id => !known.has(id))) {
      loadConversations();
      return;
    }
    // The open conversation is marked read as messages arrive, so it never shows a count.
    state.conversations.forEach(conversation => {
      const isOpen = state.active?.kind === 'dm' && state.active.id === conversation.id;
      conversation.unreadCount = isOpen ? 0 : counts[conversation.id] || 0;
    });
    render();
  });
  window.addEventListener('beforeunload', () => socket.disconnect());

  await Promise.all([loadGroups(), loadConversations()]);
  openFromUrl();
  const connected = await socket.connect();
  setStatus(connected ? 'connected' : 'offline', connected ? 'is-live' : 'is-error');
  thread.resume();
}
