// Wires the Capstone page's mentor controls together. The role check here is presentation only:
// Spring decides what an account may do.
import { cardState, countStates, createActionQueue, matchesChoiceFilter, resetMessage, resettableCount } from './mentor-model.js';
import { focusCardAction, renderCardControls, renderMentorNames, setCardBusy } from './mentor-card.js';

function startResetDialog({ browser, api, config, currentChoices, enqueue, onReset, showError }) {
  const modal = browser.querySelector('[data-capstone-reset-modal]');
  const message = modal.querySelector('[data-capstone-reset-message]');
  const confirmButton = modal.querySelector('[data-capstone-reset-confirm]');
  const opener = browser.querySelector('[data-capstone-reset]');

  function close() {
    modal.classList.add('hidden');
    opener.focus();
  }

  opener.addEventListener('click', () => {
    const count = resettableCount(currentChoices());
    message.textContent = resetMessage(config, count);
    confirmButton.disabled = count === 0;
    modal.classList.remove('hidden');
    (count === 0 ? modal.querySelector('[data-capstone-reset-cancel]') : confirmButton).focus();
  });
  modal.querySelectorAll('[data-capstone-reset-cancel]').forEach((button) => button.addEventListener('click', close));
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
  confirmButton.addEventListener('click', async () => {
    confirmButton.disabled = true;
    showError('');
    try {
      await enqueue(async () => {
        await api.resetChoices();
        await onReset();
      });
    } catch (error) {
      showError(error.message);
    }
    close();
  });
}

function summaryPill(label, count) {
  const pill = document.createElement('b');
  pill.className = 'ocs__status-pill ocs__status-pill--neutral';
  pill.textContent = `${label}: ${count}`;
  return pill;
}

async function startMentorControls({ browser, api, config, cards }) {
  const panel = browser.querySelector('[data-capstone-choices]');
  const summary = panel.querySelector('[data-capstone-summary]');
  const errorBox = panel.querySelector('[data-capstone-error]');
  const filterButtons = [...panel.querySelectorAll('[data-capstone-filter]')];
  const projects = cards.map((card) => card.dataset.capstoneProject);
  const enqueue = createActionQueue();
  const savingCards = new Set();
  let choices = {};
  let filter = 'all';

  function showError(message) {
    errorBox.hidden = !message;
    errorBox.textContent = message || '';
  }

  function applyChoiceFilter() {
    browser.querySelectorAll('[data-capstone-card]').forEach((card) => {
      const project = card.dataset.capstoneProject;
      const state = project ? cardState(choices, project) : null;
      card.toggleAttribute('data-capstone-filtered-out', !matchesChoiceFilter(config, state, filter));
    });
    browser.dispatchEvent(new CustomEvent('capstone:filter'));
  }

  function render() {
    cards.forEach((card) => {
      renderCardControls(card, config, cardState(choices, card.dataset.capstoneProject));
      // Redrawing makes new buttons, so a card still waiting to save must stay disabled.
      setCardBusy(card, savingCards.has(card));
    });
    const counts = countStates(projects, choices);
    summary.replaceChildren(...Object.entries(config.summary)
      .map(([state, label]) => summaryPill(label, counts[state])));
    applyChoiceFilter();
  }

  const runAction = {
    interested: (project) => api.setChoice(project, 'interested'),
    skip: (project) => api.setChoice(project, 'skipped'),
    'remove-interest': (project) => api.setChoice(project, 'none'),
    'undo-skip': (project) => api.setChoice(project, 'none'),
    apply: (project) => api.requestProject(project),
    'apply-again': (project) => api.requestProject(project),
    cancel: (project) => api.cancelRequest(project),
  };

  browser.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-capstone-action]');
    if (!button) return;
    const card = button.closest('[data-capstone-card]');
    const action = runAction[button.dataset.capstoneAction];
    savingCards.add(card);
    setCardBusy(card, true);
    showError('');
    try {
      const saved = await enqueue(() => action(card.dataset.capstoneProject));
      choices = saved;
      savingCards.delete(card);
      render();
      if (document.activeElement === document.body) focusCardAction(card);
    } catch (error) {
      savingCards.delete(card);
      showError(`${card.querySelector('h3')?.textContent.trim() || ''}: ${error.message}`);
      setCardBusy(card, false);
    }
  });

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filter = button.dataset.capstoneFilter;
    filterButtons.forEach((other) => {
      const active = other === button;
      other.classList.toggle('fill', active);
      other.classList.toggle('alert-green', active);
      other.setAttribute('aria-pressed', String(active));
    });
    applyChoiceFilter();
  }));

  async function refresh() {
    choices = await api.choices();
    render();
  }

  startResetDialog({ browser, api, config, currentChoices: () => choices, enqueue, onReset: refresh, showError });
  await refresh();
  panel.hidden = false;
}

export async function startCapstoneMentoring({ browser, api, config, roleNames, viewFor }) {
  if (!browser) return;
  const cards = [...browser.querySelectorAll('[data-capstone-project]')];
  try {
    const mentors = await api.approvedMentors();
    cards.forEach((card) => renderMentorNames(card, mentors[card.dataset.capstoneProject], config.text.mentors_prefix));
    const person = await api.person();
    if (person && viewFor(roleNames(person)) === 'mentor') {
      await startMentorControls({ browser, api, config, cards });
    }
  } catch (error) {
    // Without Spring the page stays the normal public catalog rather than showing broken buttons.
    console.warn('Capstone mentor controls are unavailable:', error.message);
  }
}
