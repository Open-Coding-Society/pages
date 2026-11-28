// Draws one project card's mentor names, status pill and action buttons.
import { describeState } from './mentor-model.js';

function actionButton(action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = action.primary ? 'ocs__btn accent fill small' : 'ocs__btn small';
  button.dataset.capstoneAction = action.id;
  button.textContent = action.label;
  return button;
}

export function renderMentorNames(card, names, prefix) {
  const line = card.querySelector('[data-capstone-names]');
  const hasNames = Boolean(names?.length);
  line.hidden = !hasNames;
  line.textContent = hasNames ? `${prefix} ${names.join(', ')}` : '';
}

export function renderCardControls(card, config, state) {
  const { pill, tone, actions } = describeState(config, state);
  const skipped = state === 'skipped';
  const statusPill = card.querySelector('[data-capstone-state]');
  statusPill.hidden = !pill;
  statusPill.textContent = pill || '';
  statusPill.className = tone ? `ocs__status-pill ocs__status-pill--${tone}` : 'ocs__status-pill';
  card.querySelector('[data-capstone-actions]').replaceChildren(...actions.map(actionButton));
  // An approved card has nothing to show here; its public mentor name stays above.
  card.querySelector('[data-capstone-controls]').hidden = !pill && actions.length === 0;
  // Undo skip lives outside this body, so keyboard users reach it and nothing else.
  card.querySelector('[data-capstone-card-body]').inert = skipped;
  card.classList.toggle('capstone-browser__card--skipped', skipped);
  card.toggleAttribute('data-capstone-skipped', skipped);
}

export function setCardBusy(card, busy) {
  card.querySelectorAll('[data-capstone-action]').forEach((button) => { button.disabled = busy; });
}

export function focusCardAction(card) {
  card.querySelector('[data-capstone-action]')?.focus();
}
