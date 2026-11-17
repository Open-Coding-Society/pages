// Search inside the open direct message: a box in the chat's header, like Discord. Typing
// asks Spring's /api/dm/search for that conversation, and the matches list under the
// header. Picking one hands it to onPick, which scrolls the chat to that message.
//
// The page tells this module which chat is open through the returned setConversation(id,
// label); with no direct message open (nothing, or a group) the box is hidden.
import { dayLabel, highlightParts, MAX_SEARCH_RESULTS, MIN_SEARCH_LENGTH } from './messages-model.js';

// cleanExcerpt takes markup-free chat markers (a reply's [[reply:...]]) out of an excerpt.
export function initMessageSearch({ elements, api, me, onPick, debounceMs = 250, cleanExcerpt = text => text }) {
  const { form, input, panel, status, results } = elements;
  let timer = null;
  let ticket = 0; // a newer query makes an older search that is still loading stop
  let chat = null; // { id, label } of the open direct message, or null

  const showPanel = on => { panel.hidden = !on; };

  function clear() {
    clearTimeout(timer);
    ticket += 1;
    results.replaceChildren();
    status.textContent = '';
    showPanel(false);
  }

  function who(hit) {
    return hit.senderUid === me.uid ? 'You' : (hit.senderName || hit.senderUid || 'Unknown');
  }

  // The excerpt is plain text from Spring; the matches are wrapped in <mark> here.
  function excerptLine(hit, query) {
    const line = document.createElement('small');
    line.className = 'dm__hit-text';
    highlightParts(cleanExcerpt(hit.excerpt ?? ''), query).forEach(part => {
      if (!part.match) {
        line.append(part.text);
        return;
      }
      const mark = document.createElement('mark');
      mark.textContent = part.text;
      line.appendChild(mark);
    });
    return line;
  }

  function row(hit, query) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ocs__nav-card dm__hit';
    const name = document.createElement('strong');
    name.className = 'ocs__nav-card-title';
    name.textContent = who(hit);
    const sentAt = hit.sentAt ? new Date(hit.sentAt) : null;
    const when = document.createElement('small');
    when.className = 'ocs__text';
    when.textContent = sentAt && !Number.isNaN(sentAt.getTime()) ? dayLabel(sentAt) : '';
    button.append(name, when, excerptLine(hit, query));
    button.addEventListener('click', () => {
      showPanel(false); // out of the way of the message it jumps to; focusing the box brings it back
      onPick(hit);
    });
    return button;
  }

  function countLine(count, query) {
    if (!count) return `No messages in this chat match “${query}”.`;
    if (count >= MAX_SEARCH_RESULTS) return `Showing the ${MAX_SEARCH_RESULTS} newest matches.`;
    return count === 1 ? '1 message' : `${count} messages`;
  }

  async function search(query, conversation) {
    const mine = ticket;
    try {
      const hits = await api.searchDms(query, conversation.id) || [];
      if (mine !== ticket) return;
      results.replaceChildren(...hits.map(hit => row(hit, query)));
      status.textContent = countLine(hits.length, query);
    } catch (error) {
      if (mine !== ticket) return;
      console.warn('Messages: search failed', error);
      results.replaceChildren();
      status.textContent = 'Search is not working right now. Try again.';
    }
  }

  // Runs on every change to the box. `wait` is the pause before asking Spring: the
  // typing delay, or none when Enter was pressed.
  function update(wait) {
    if (!chat) return;
    clearTimeout(timer);
    ticket += 1;
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) {
      status.textContent = '';
      showPanel(false);
      return;
    }
    showPanel(true);
    if (query.length < MIN_SEARCH_LENGTH) {
      status.textContent = `Type at least ${MIN_SEARCH_LENGTH} characters.`;
      return;
    }
    status.textContent = 'Searching…';
    const conversation = chat;
    timer = setTimeout(() => search(query, conversation), wait);
  }

  // Called when the open conversation changes (id null for a group or nothing). A
  // different chat starts with an empty box: what was typed was about the last one.
  function setConversation(id, label) {
    const changed = (chat?.id ?? null) !== (id ?? null);
    chat = id == null ? null : { id, label };
    form.hidden = !chat;
    if (changed) {
      input.value = '';
      clear();
    }
    if (chat) {
      input.placeholder = 'Search this chat';
      input.setAttribute('aria-label', `Search messages with ${label}`);
    }
  }

  input.addEventListener('input', () => update(debounceMs));
  input.addEventListener('focus', () => {
    if (results.children.length || status.textContent) showPanel(true);
  });
  input.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    input.value = '';
    clear();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    update(0);
  });
  input.disabled = false;
  return { setConversation };
}
