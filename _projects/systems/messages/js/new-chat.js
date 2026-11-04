// "New chat": search for people, pick one or more, and open the conversation with them.
// Spring returns the existing conversation when there already is one.
import { button, createDialog } from './dialogs.js';

export function initNewChat({ elements, api, me, onStarted }) {
  const selected = new Map(); // person id -> person
  let searchTimer = null;
  let searchCount = 0;

  function renderSelected() {
    const names = [...selected.values()].map(person => person.name || person.uid);
    elements.selected.textContent = names.length ? `To: ${names.join(', ')}` : 'Pick at least one person.';
    elements.start.disabled = names.length === 0;
  }

  function renderResults(people) {
    const others = people.filter(person => person.uid !== me.uid);
    elements.results.replaceChildren(...others.map(person => {
      const isSelected = selected.has(person.id);
      const choice = button(`${person.name} (@${person.uid})`, isSelected ? 'ocs__btn small pill accent fill' : 'ocs__btn small pill', () => {
        if (selected.has(person.id)) selected.delete(person.id);
        else selected.set(person.id, person);
        renderResults(people);
        renderSelected();
      });
      choice.setAttribute('aria-pressed', String(isSelected));
      return choice;
    }));
    elements.status.textContent = others.length ? '' : 'No one matches that search.';
  }

  async function search(query) {
    const ticket = ++searchCount;
    try {
      const people = await api.searchPeople(query);
      if (ticket === searchCount) renderResults(people || []);
    } catch (error) {
      if (ticket !== searchCount) return;
      console.warn('Messages: people search failed', error);
      elements.status.textContent = 'Search is not working right now. Try again.';
    }
  }

  function reset() {
    clearTimeout(searchTimer);
    searchCount += 1;
    selected.clear();
    elements.search.value = '';
    elements.results.replaceChildren();
    elements.status.textContent = '';
    renderSelected();
  }

  const dialog = createDialog(elements.dialog, { onClose: reset });

  elements.search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const query = elements.search.value.trim();
    if (!query) {
      searchCount += 1;
      elements.results.replaceChildren();
      elements.status.textContent = '';
      return;
    }
    searchTimer = setTimeout(() => search(query), 250);
  });

  elements.form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!selected.size) return;
    elements.start.disabled = true;
    try {
      const conversation = await api.startConversation([...selected.keys()]);
      dialog.close();
      onStarted(conversation);
    } catch (error) {
      console.warn('Messages: could not start the conversation', error);
      elements.status.textContent = 'Could not start the chat. Try again.';
      elements.start.disabled = false;
    }
  });

  elements.open.addEventListener('click', () => {
    reset();
    dialog.open(elements.open);
  });
  reset();
}
