// The Delete group dialog. Members (group-dialogs.js) opens it for a site admin, on any
// group that isn't a class group. It says what deleting takes away, and Delete stays off
// until the group's name is typed.
import { createDialog } from './dialogs.js';
import { confirmsGroupName, deleteGroupWarning } from './messages-model.js';

export function initDeleteGroup({ elements, api, onDeleted }) {
  let group = null;
  // Typing during a delete mustn't turn the button back on and send a second one.
  let deleting = false;

  function updateConfirm() {
    elements.confirm.disabled = deleting || !confirmsGroupName(elements.name.value, group);
  }

  function reset() {
    elements.form.reset();
    elements.status.textContent = '';
    updateConfirm();
  }

  const dialog = createDialog(elements.dialog, { onClose: reset });

  elements.name.addEventListener('input', updateConfirm);

  elements.form.addEventListener('submit', async event => {
    event.preventDefault();
    const target = group;
    if (deleting || !confirmsGroupName(elements.name.value, target)) return;
    deleting = true;
    updateConfirm();
    elements.status.textContent = `Deleting ${target.name}…`;
    try {
      await api.deleteGroup(target.id);
      dialog.close();
      onDeleted(target);
    } catch (error) {
      console.warn('Messages: could not delete the group', error);
      elements.status.textContent = `Could not delete ${target.name}. Try again.`;
    } finally {
      deleting = false;
      updateConfirm();
    }
  });

  return {
    open(current, opener) {
      group = current;
      elements.title.textContent = `Delete ${group.name}?`;
      elements.warning.textContent = deleteGroupWarning(group);
      elements.nameToType.textContent = group.name;
      reset();
      dialog.open(opener);
    },
  };
}
