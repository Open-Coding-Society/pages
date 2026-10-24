// The group dialogs: find a group to join or make a new one, see and change a group's
// members, and share files with a group. Leaving a group is a button in the conversation
// header (messages-page.js). Deleting one starts at the bottom of Members, for site
// admins only, and is confirmed in delete-group.js.
import { button, cell, createDialog } from './dialogs.js';
import {
  canDeleteGroup, deleteGroupWarning, downloadName, groupSubtitle, isClassGroup, isCourseChannel, isGroupMember, sortGroups,
} from './messages-model.js';

const byName = (a, b) => String(a.name).localeCompare(String(b.name));

function debounce(handler, delay) {
  let timer = null;
  const run = value => {
    clearTimeout(timer);
    timer = setTimeout(() => handler(value), delay);
  };
  run.cancel = () => clearTimeout(timer);
  return run;
}

export function initFindGroup({ elements, api, me, onJoined }) {
  let searchCount = 0;

  function resultRow(group, dialog) {
    const row = document.createElement('tr');
    const action = document.createElement('td');
    if (isGroupMember(group, me.id)) {
      action.appendChild(button('Open', 'ocs__btn small', () => {
        dialog.close();
        onJoined(group);
      }));
    } else if (isClassGroup(group)) {
      // Profile classes add these, and a class group has no Leave button here.
      action.textContent = 'Add the class on your Profile';
    } else {
      action.appendChild(button('Join', 'ocs__btn small accent fill', async control => {
        control.disabled = true;
        try {
          const joined = await api.addMember(group.id, me.id);
          dialog.close();
          onJoined(joined || group);
        } catch (error) {
          console.warn('Messages: could not join the group', error);
          control.disabled = false;
          elements.searchStatus.textContent = `Could not join ${group.name}. Try again.`;
        }
      }));
    }
    row.append(cell(group.name), cell(groupSubtitle(group)), action);
    return row;
  }

  async function search(query, dialog) {
    const ticket = ++searchCount;
    elements.searchStatus.textContent = 'Searching…';
    try {
      const groups = sortGroups((await api.searchGroups(query) || []).filter(group => !isCourseChannel(group)));
      if (ticket !== searchCount) return;
      elements.results.replaceChildren(...groups.map(group => resultRow(group, dialog)));
      elements.table.classList.toggle('hidden', groups.length === 0);
      elements.searchStatus.textContent = groups.length ? '' : 'No groups have that in their name.';
    } catch (error) {
      if (ticket !== searchCount) return;
      console.warn('Messages: group search failed', error);
      elements.table.classList.add('hidden');
      elements.searchStatus.textContent = 'Search is not working right now. Try again.';
    }
  }

  const searchSoon = debounce(query => search(query, dialog), 250);

  function reset() {
    searchSoon.cancel();
    searchCount += 1;
    elements.searchForm.reset();
    elements.createForm.reset();
    elements.results.replaceChildren();
    elements.table.classList.add('hidden');
    elements.searchStatus.textContent = '';
    elements.createStatus.textContent = '';
    elements.create.disabled = false;
  }

  const dialog = createDialog(elements.dialog, { onClose: reset });

  elements.search.addEventListener('input', () => {
    const query = elements.search.value.trim();
    if (query) {
      searchSoon(query);
      return;
    }
    searchSoon.cancel();
    searchCount += 1;
    elements.results.replaceChildren();
    elements.table.classList.add('hidden');
    elements.searchStatus.textContent = '';
  });
  elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = elements.search.value.trim();
    if (query) search(query, dialog);
  });

  // Spring adds you in the same request, so the new group is in your list right away.
  elements.createForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = elements.name.value.trim();
    if (!name) {
      elements.createStatus.textContent = 'Give the group a name.';
      return;
    }
    elements.create.disabled = true;
    elements.createStatus.textContent = '';
    try {
      const group = await api.createGroup({
        name, period: elements.period.value, course: elements.course.value, memberIds: [me.id],
      });
      dialog.close();
      onJoined(group);
    } catch (error) {
      console.warn('Messages: could not make the group', error);
      elements.create.disabled = false;
      elements.createStatus.textContent = error.status === 409
        ? `There is already a group named ${name}. Pick another name, or search for it above to join it.`
        : 'Could not make the group. Try again.';
    }
  });

  elements.open.addEventListener('click', () => {
    reset();
    dialog.open(elements.open);
  });
}

export function initMembers({ elements, api, me, onChanged, onDelete }) {
  let group = null;
  let lastResults = [];
  let searchCount = 0;

  function changed(updated) {
    group = updated;
    render();
    renderResults(lastResults);
    onChanged(updated);
  }

  function memberRow(member) {
    const row = document.createElement('tr');
    const action = document.createElement('td');
    if (member.id !== me.id) {
      action.appendChild(button('Remove', 'ocs__btn small alert-red', async control => {
        if (!window.confirm(`Remove ${member.name} from ${group.name}?`)) return;
        control.disabled = true;
        try {
          changed(await api.removeMember(group.id, member.id));
        } catch (error) {
          console.warn('Messages: could not remove the member', error);
          control.disabled = false;
          elements.status.textContent = `Could not remove ${member.name}. Try again.`;
        }
      }));
    }
    row.append(cell(member.id === me.id ? `${member.name} (you)` : member.name), cell(`@${member.uid}`), action);
    return row;
  }

  function render() {
    elements.title.textContent = `Members of ${group.name}`;
    elements.list.replaceChildren(...[...(group.members || [])].sort(byName).map(memberRow));
    const deletable = canDeleteGroup(me, group);
    elements.deleteSection.classList.toggle('hidden', !deletable);
    if (deletable) elements.deleteWarning.textContent = deleteGroupWarning(group);
  }

  function renderResults(people) {
    lastResults = people;
    const addable = people.filter(person => !isGroupMember(group, person.id));
    elements.results.replaceChildren(...addable.map(person => button(`Add ${person.name} (@${person.uid})`, 'ocs__btn small pill', async control => {
      control.disabled = true;
      try {
        changed(await api.addMember(group.id, person.id));
      } catch (error) {
        console.warn('Messages: could not add the member', error);
        control.disabled = false;
        elements.status.textContent = `Could not add ${person.name}. Try again.`;
      }
    })));
    if (people.length && !addable.length) elements.status.textContent = 'Everyone who matches is already in the group.';
  }

  async function search(query) {
    const ticket = ++searchCount;
    elements.status.textContent = '';
    try {
      const people = await api.searchPeople(query);
      if (ticket !== searchCount) return;
      renderResults(people || []);
      if (!(people || []).length) elements.status.textContent = 'No one matches that search.';
    } catch (error) {
      if (ticket !== searchCount) return;
      console.warn('Messages: people search failed', error);
      elements.status.textContent = 'Search is not working right now. Try again.';
    }
  }

  const searchSoon = debounce(search, 250);

  function reset() {
    searchSoon.cancel();
    searchCount += 1;
    lastResults = [];
    elements.search.value = '';
    elements.results.replaceChildren();
    elements.status.textContent = '';
  }

  const dialog = createDialog(elements.dialog, { onClose: reset });

  elements.search.addEventListener('input', () => {
    const query = elements.search.value.trim();
    if (query) {
      searchSoon(query);
      return;
    }
    searchSoon.cancel();
    searchCount += 1;
    renderResults([]);
    elements.status.textContent = '';
  });

  // One dialog at a time: Members closes before the confirm dialog opens.
  elements.deleteOpen.addEventListener('click', () => {
    dialog.close();
    onDelete(group);
  });

  return {
    open(current, opener) {
      group = current;
      reset();
      render();
      dialog.open(opener);
    },
  };
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function saveFile(file) {
  const bytes = Uint8Array.from(atob(file.base64Data || ''), character => character.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes]));
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName(file.filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function initFiles({ elements, api }) {
  let group = null;
  let loadCount = 0;

  function fileRow(file) {
    const row = document.createElement('tr');
    const action = document.createElement('td');
    action.appendChild(button('Download', 'ocs__btn small', () => {
      try {
        saveFile(file);
      } catch (error) {
        console.warn('Messages: could not read the shared file', error);
        elements.status.textContent = `Could not download ${file.filename}.`;
      }
    }));
    row.append(cell(file.filename), action);
    return row;
  }

  async function load() {
    const ticket = ++loadCount;
    elements.status.textContent = 'Loading files…';
    try {
      const files = await api.groupFiles(group.id) || [];
      if (ticket !== loadCount) return;
      elements.list.replaceChildren(...files.map(fileRow));
      elements.table.classList.toggle('hidden', files.length === 0);
      elements.status.textContent = files.length ? '' : 'No files shared yet.';
    } catch (error) {
      if (ticket !== loadCount) return;
      console.warn('Messages: could not load the shared files', error);
      elements.table.classList.add('hidden');
      elements.status.textContent = 'Could not load the files. Try again.';
    }
  }

  const dialog = createDialog(elements.dialog, {
    onClose: () => {
      loadCount += 1;
      elements.form.reset();
    },
  });

  elements.form.addEventListener('submit', async event => {
    event.preventDefault();
    const file = elements.input.files?.[0];
    if (!file) {
      elements.status.textContent = 'Choose a file first.';
      return;
    }
    elements.upload.disabled = true;
    elements.status.textContent = `Sharing ${file.name}…`;
    try {
      await api.uploadGroupFile(group.id, file.name, await readAsBase64(file));
      elements.form.reset();
      await load();
      elements.status.textContent = `Shared ${file.name}.`;
    } catch (error) {
      console.warn('Messages: could not share the file', error);
      elements.status.textContent = `Could not share ${file.name}. Try again.`;
    } finally {
      elements.upload.disabled = false;
    }
  });

  return {
    open(current, opener) {
      group = current;
      elements.title.textContent = `Files in ${group.name}`;
      elements.list.replaceChildren();
      elements.table.classList.add('hidden');
      dialog.open(opener);
      load();
    },
    // Someone shared a file while the dialog shows this group's files.
    refreshIfShowing(groupId) {
      if (dialog.isOpen() && group?.id === groupId) load();
    },
  };
}
