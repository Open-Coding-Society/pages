// ============================================
// srfscDom.js
// RESPONSIBILITY: Small DOM helpers shared by the SRFSC UI modules.
// Uses textContent everywhere so user-submitted text can never inject HTML.
// ============================================

export function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

export function formatDate(isoDate) {
  // Parse YYYY-MM-DD as a local date; `new Date(iso)` would treat it as UTC and shift a day.
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function showStatus(element, message, kind) {
  element.textContent = message;
  element.className = `srfsc-form__status srfsc-form__status--${kind}`;
}

/** Read a form into a plain object, dropping empty optional fields. */
export function readForm(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    const trimmed = String(value).trim();
    if (trimmed) data[key] = trimmed;
  });
  return data;
}

/**
 * Submit a form through `submitFn`, showing pending/success/error in its .srfsc-form__status.
 * `onSuccess` runs after a successful submit (e.g. to refresh dashboard counts).
 */
export function bindForm(form, { submitFn, successMessage, onSuccess = () => {} }) {
  const status = form.querySelector('.srfsc-form__status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    button.disabled = true;
    showStatus(status, 'Sending…', 'pending');
    try {
      const result = await submitFn(readForm(form));
      showStatus(status, successMessage(result), 'success');
      form.reset();
      onSuccess(result);
    } catch (error) {
      showStatus(status, error.message, 'error');
    } finally {
      button.disabled = false;
    }
  });
}
