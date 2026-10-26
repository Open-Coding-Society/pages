// The two lists beside the conversation: your groups, then your direct messages. Each
// row is an ocs__nav-card link (/dm?group=<id> or /dm?dm=<id>), so a conversation opens
// from a bookmark or in a new tab; a plain click opens it in place.
import { conversationLabel, groupSubtitle } from './messages-model.js';

export const conversationHref = (kind, id) => `?${kind}=${encodeURIComponent(id)}`;

export function createSidebar({ groupList, dmList, onOpen }) {
  function row(kind, id, title, detail, note, active) {
    const link = document.createElement('a');
    link.className = 'ocs__nav-card';
    link.href = conversationHref(kind, id);
    link.dataset.kind = kind;
    link.dataset.id = id;
    if (active?.kind === kind && active.id === id) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'true');
    }
    const name = document.createElement('strong');
    name.className = 'ocs__nav-card-title';
    name.textContent = title;
    link.appendChild(name);
    if (detail) {
      const subtitle = document.createElement('small');
      subtitle.className = 'ocs__text';
      subtitle.textContent = detail;
      link.appendChild(subtitle);
    }
    if (note) {
      const unread = document.createElement('small');
      unread.className = 'ocs__nav-card-cta';
      unread.textContent = note;
      link.appendChild(unread);
    }
    link.addEventListener('click', event => {
      // Let a middle click or a modifier key open the link in a new tab.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onOpen(kind, id);
    });
    return link;
  }

  function emptyLine(text) {
    const line = document.createElement('p');
    line.className = 'ocs__text';
    line.textContent = text;
    return line;
  }

  function unreadNote(count) {
    if (!count) return '';
    return `${count > 99 ? '99+' : count} new`;
  }

  function render({ groups, conversations, active }) {
    groupList.replaceChildren(...(groups.length
      ? groups.map(group => row('group', group.id, group.name, groupSubtitle(group), '', active))
      : [emptyLine('No groups yet. Find one to join, or make one.')]));
    dmList.replaceChildren(...(conversations.length
      ? conversations.map(conversation => row('dm', conversation.id, conversationLabel(conversation), '',
        unreadNote(conversation.unreadCount), active))
      : [emptyLine('No direct messages yet.')]));
  }

  return { render };
}
