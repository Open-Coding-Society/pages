// The Teacher Dashboard's Lesson Summary (/submissions, Teacher Dashboard tab): a
// dialog that loads one team-taught lesson's live summary from Spring and draws it
// with lesson-feedback-summary.js. Spring lets only teachers and the assignment's
// graders read it; the dashboard shows the button to teachers only.
//
// The layout passes javaURI and fetchOptions from config.js, as the lesson pages do.
import { createLessonFeedbackApi } from './lesson-feedback-api.js';
import { createLessonSummary } from './lesson-feedback-summary.js';

const DIALOG_ID = 'lesson-summary-modal';

// user-preferences.js sets --theme to 'base' on light backgrounds; the default site
// theme is dark.
export function isLightTheme(root = document.documentElement) {
  return getComputedStyle(root).getPropertyValue('--theme').trim() === 'base';
}

function dialog(root) {
  let modal = root.getElementById(DIALOG_ID);
  if (modal) return modal;
  modal = root.createElement('div');
  modal.id = DIALOG_ID;
  modal.className = 'hidden ocs__modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', `${DIALOG_ID}-title`);
  const card = root.createElement('div');
  card.className = 'ocs__card ocs__modal-card lesson-summary-modal';
  const header = root.createElement('div');
  header.className = 'ocs__modal-header';
  const title = root.createElement('h3');
  title.className = 'ocs__modal-title';
  title.id = `${DIALOG_ID}-title`;
  const close = root.createElement('button');
  close.type = 'button';
  close.className = 'ocs__btn ocs__btn--icon small';
  close.dataset.closeSummary = '';
  close.setAttribute('aria-label', 'Close Lesson Summary');
  close.textContent = '×';
  header.append(title, close);
  const body = root.createElement('div');
  body.dataset.summaryBody = '';
  card.append(header, body);
  modal.append(card);

  const hide = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  };
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('[data-close-summary]')) hide();
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) hide();
  });
  root.body.append(modal);
  return modal;
}

/** Opens the dialog for `assignment` ({ id, name }) and fills it with its live summary. */
export async function openLessonSummary({
  javaURI, fetchOptions, assignment, root = document, api = createLessonFeedbackApi({ javaURI, fetchOptions }),
}) {
  const modal = dialog(root);
  modal.querySelector('.ocs__modal-title').textContent = `Lesson Summary · ${assignment.name || 'Lesson'}`;
  const body = modal.querySelector('[data-summary-body]');
  body.textContent = 'Loading…';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('[data-close-summary]').focus();
  try {
    const summary = await api.loadSummary(assignment.id);
    // The dialog's own header already names the summary.
    body.replaceChildren(createLessonSummary(summary, { light: isLightTheme(root.documentElement), titled: false }));
  } catch (error) {
    body.textContent = `Couldn't load the Lesson Summary: ${error.message}`;
  }
}
