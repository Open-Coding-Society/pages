// The lesson feedback form for one step, built from the model's formFields().
//
// Lesson step: three ratings plus pros and grows, all optional, with its own Save
// button (the microblog panel's Ratings tab). Submission step: all four ratings,
// with saved ones locked and the rest required, embedded in the assignment form,
// so it has no button or <form> of its own (forms cannot nest).
//
// The ratings reuse the paused self-assessment's .rating-* classes in
// _sass/open-coding/lesson-player.scss; everything else is OCS grammar. All text is
// set with textContent. The caller saves: this module never fetches.
import {
  FeedbackError, MAX_RATING, MAX_TEXT_LENGTH, MIN_RATING, RATINGS, SCALE_HINT, formFields, mergeStep,
} from './lesson-feedback-model.js';

const LABELS = Object.fromEntries(RATINGS.map(rating => [rating.key, rating.label]));
const TEXT_LABELS = { pros: 'Pros', grows: 'Grows' };
const labelOf = field => LABELS[field] || TEXT_LABELS[field] || field;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function ratingGroup(rating, idPrefix) {
  const group = element('fieldset', 'rating-group');
  group.append(element('legend', 'rating-label', rating.label));
  group.append(element('p', 'rating-question', rating.question));

  const scale = element('div', 'rating-scale');
  scale.setAttribute('role', 'radiogroup');
  scale.setAttribute('aria-label', `${rating.label} rating`);
  const inputs = [];
  for (let value = MIN_RATING; value <= MAX_RATING; value += 1) {
    // The number goes straight in the label, not a <span>: theme presets recolor
    // spans and would hide it on the selected (accent-filled) option.
    const option = element('label', 'rating-option');
    const input = element('input');
    input.type = 'radio';
    input.name = `${idPrefix}-${rating.key}`;
    input.value = String(value);
    input.checked = rating.value === value;
    input.disabled = rating.locked;
    input.required = rating.required && !rating.locked;
    option.append(input, document.createTextNode(String(value)));
    scale.append(option);
    inputs.push(input);
  }
  group.append(scale);
  group.append(element('div', 'rating-scale-hint', SCALE_HINT));
  if (rating.locked) {
    group.append(element('small', null, 'Saved at the lesson. Saved ratings can\'t be changed.'));
  }
  return { group, inputs };
}

function textField(field, value, required, idPrefix) {
  const id = `${idPrefix}-${field}`;
  const wrapper = element('div', 'ocs__field');
  const label = element('label', 'ocs__label', required ? `${TEXT_LABELS[field]} (required)` : TEXT_LABELS[field]);
  label.htmlFor = id;
  const textarea = element('textarea', 'ocs__input');
  textarea.id = id;
  textarea.maxLength = MAX_TEXT_LENGTH;
  textarea.required = required;
  textarea.value = value;
  const help = element('small', null, field === 'pros'
    ? 'What worked well in this lesson? Name a strength or two.'
    : 'One thing the team could do better next time.');
  help.id = `${id}-help`;
  textarea.setAttribute('aria-describedby', help.id);
  wrapper.append(label, textarea, help);
  return { wrapper, textarea };
}

/**
 * Builds the form for `step` ('lesson' or 'submission') from the saved feedback.
 * Pass `submitLabel` and `onSubmit` for a standalone form; leave them out to embed
 * the fields in another form and call validate() before that form submits.
 * onSubmit(input, merged) receives what to send and the feedback it would produce.
 */
export function createLessonFeedbackForm({ step, saved = null, idPrefix = 'lesson-feedback', submitLabel = null, onSubmit = null }) {
  const fields = formFields(step, saved);
  const standalone = Boolean(submitLabel && onSubmit);
  const root = element(standalone ? 'form' : 'div', 'ocs__stack');
  if (standalone) root.noValidate = true;

  root.append(element('p', 'ocs__text', step === 'lesson'
    ? 'Rate the lesson the team just taught. You can finish anything you skip when you submit the homework.'
    : 'Finish your feedback on this lesson. Ratings saved at the lesson are locked; fill the rest before you submit.'));

  const ratingInputs = {};
  const groups = {};
  for (const rating of fields.ratings) {
    const { group, inputs } = ratingGroup(rating, idPrefix);
    root.append(group);
    groups[rating.key] = group;
    if (!rating.locked) ratingInputs[rating.key] = inputs;
  }
  const pros = textField('pros', fields.pros, fields.textRequired, idPrefix);
  const grows = textField('grows', fields.grows, fields.textRequired, idPrefix);
  root.append(pros.wrapper, grows.wrapper);
  groups.pros = pros.textarea;
  groups.grows = grows.textarea;

  const status = element('p', 'ocs__text');
  status.setAttribute('role', 'status');
  if (standalone) {
    const actions = element('div', 'ocs__links');
    const button = element('button', 'ocs__btn accent fill', submitLabel);
    button.type = 'submit';
    actions.append(button, status);
    root.append(actions);
  } else {
    root.append(status);
  }

  // Locked ratings are left out: the server keeps what it saved.
  function readInput() {
    const input = { pros: pros.textarea.value, grows: grows.textarea.value };
    for (const [key, inputs] of Object.entries(ratingInputs)) {
      const checked = inputs.find(radio => radio.checked);
      input[key] = checked ? Number(checked.value) : null;
    }
    return input;
  }

  function markInvalid(invalidFields) {
    for (const [field, node] of Object.entries(groups)) {
      if (invalidFields.includes(field)) node.setAttribute('aria-invalid', 'true');
      else node.removeAttribute('aria-invalid');
    }
  }

  // The model's messages use field keys; the student sees the labels.
  function messageFor(error) {
    const names = error.fields.map(labelOf);
    if (error.kind === 'missing') return `Finish these before you submit: ${names.join(', ')}.`;
    if (error.kind === 'locked') return `${names[0]} was saved at the lesson and can't be changed.`;
    if (TEXT_LABELS[error.fields[0]]) return `${names[0]} must be at most ${MAX_TEXT_LENGTH} characters.`;
    return `${names[0]}: choose a number from ${MIN_RATING} to ${MAX_RATING}.`;
  }

  function showStatus(text) {
    status.textContent = text;
  }

  // Checks the input against the same rules the server applies; returns
  // { ok: true, input, feedback } or { ok: false, input, error }.
  function validate() {
    const input = readInput();
    try {
      const feedback = mergeStep(step, saved, input);
      markInvalid([]);
      showStatus('');
      return { ok: true, input, feedback };
    } catch (error) {
      if (!(error instanceof FeedbackError)) throw error;
      markInvalid(error.fields);
      showStatus(messageFor(error));
      return { ok: false, input, error };
    }
  }

  if (standalone) {
    root.addEventListener('submit', event => {
      event.preventDefault();
      const result = validate();
      if (result.ok) onSubmit(result.input, result.feedback);
    });
  }

  return { element: root, readInput, validate, showStatus };
}
