// Starts the Messages page (/dm, navigation/dm.md): your groups and direct messages in
// one sidebar, the open conversation beside them, and the group dialogs. The page hands
// in config.js and rich-text.js, which it imports with {{ site.baseurl }}, so the modules
// here only import each other, with ./ paths.
import { createChatSocket } from './chat-socket.js';
import { initDeleteGroup } from './delete-group.js';
import { initGroupFormation } from './group-formation.js';
import { initFiles, initFindGroup, initMembers } from './group-dialogs.js';
import { createMessagesApi } from './messages-api.js';
import {
  canFormGroups, conversationLabel, groupSubtitle, isClassGroup, isCourseChannel, sortGroups,
} from './messages-model.js';
import { initNewChat } from './new-chat.js';
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

export async function startMessagesPage({ config, richText }) {
  const api = createMessagesApi(config);
  const setStatus = createStatus();
  const notice = byId('messagesNotice');
  setStatus('loading…');

  const me = await signedInPerson(api, setStatus);
  if (!me) return;
  const state = { groups: [], conversations: [], active: null };
  const findItem = (kind, id) => (kind === 'group' ? state.groups : state.conversations).find(item => item.id === id);

  const sidebar = createSidebar({
    groupList: byId('messagesGroupList'),
    dmList: byId('messagesDmList'),
    onOpen: (kind, id) => openConversation(kind, id),
  });
  const render = () => sidebar.render(state);

  const socket = createChatSocket(config.javaWebSocketURI, { onClose: () => setStatus('disconnected', 'is-error') });
  const files = initFiles({
    api,
    elements: {
      dialog: byId('filesDialog'), title: byId('filesTitle'), list: byId('filesList'), table: byId('filesTable'),
      form: byId('filesForm'), input: byId('filesInput'), upload: byId('filesUpload'), status: byId('filesStatus'),
    },
  });
  const thread = createThread({
    api,
    socket,
    richText,
    me,
    elements: {
      title: byId('messagesThreadTitle'), subtitle: byId('messagesThreadSubtitle'), messages: byId('messagesLog'),
      form: byId('messagesForm'), send: byId('messagesSend'), cancelEdit: byId('messagesCancelEdit'),
      formStatus: byId('messagesFormStatus'),
      imageAttach: byId('messagesImageAttach'), imageInput: byId('messagesImage'),
      imagePreview: byId('messagesImagePreview'), imageThumb: byId('messagesImageThumb'),
      imageRemove: byId('messagesImageRemove'),
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
  // their own display, which beats [hidden].
  function showGroupActions(group) {
    groupActions.classList.toggle('hidden', !group);
    if (!group) return;
    byId('messagesLeaveGroup').classList.toggle('hidden', isClassGroup(group));
  }

  // Clears the badge straight away, then tells Spring. The count is a notification, so
  // a failed write is not worth interrupting the person for -- the next load corrects it.
  async function markGroupRead(group) {
    if (!group) return;
    if (group.unreadCount) {
      group.unreadCount = 0;
      render();
    }
    try {
      await api.markGroupRead(group.id);
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
    showGroupActions(kind === 'group' ? item : null);
    history.replaceState(null, '', conversationHref(kind, id));
    // At 768px and below (ocs__split's one-column width) the chat sits under the lists.
    if (window.matchMedia('(max-width: 768px)').matches) {
      byId('messagesThreadTitle').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    return true;
  }

  function closeConversation() {
    thread.close();
    state.active = null;
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
  // another group never reaches it. Re-counting when the tab comes back to the front
  // keeps the badges honest without a polling loop running all day.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadGroupUnread();
  });

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
  byId('messagesFiles').addEventListener('click', event => {
    const group = openGroup();
    if (group) files.open(group, event.currentTarget);
  });
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

  // The navbar bell's summary keeps the unread counts current, and shows conversations
  // someone else started since the list loaded.
  window.addEventListener('dm:unread', ({ detail }) => {
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
