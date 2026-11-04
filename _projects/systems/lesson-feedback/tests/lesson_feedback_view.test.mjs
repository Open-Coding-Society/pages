// The form and summary build DOM, so they get a stub document rather than a real
// one: these tests are about which fields are locked, required and read back, not
// about the elements themselves. The stub throws on innerHTML, so passing tests
// also show that student text is only ever set with textContent.
import assert from 'node:assert/strict';
import test from 'node:test';

function stubNode(tag) {
  return {
    tag,
    className: '',
    children: [],
    attributes: {},
    listeners: {},
    style: {},
    dataset: {},
    textContent: '',
    append(...nodes) { this.children.push(...nodes); },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    set innerHTML(_) { throw new Error('innerHTML must not be used'); },
  };
}

globalThis.document = {
  createElement: stubNode,
  createTextNode: text => ({ tag: '#text', textContent: text }),
};

const { createLessonFeedbackForm } = await import('../js/lesson-feedback-form.js');
const { createLessonSummary, divergingSegments } = await import('../js/lesson-feedback-summary.js');
const { EMPTY_FEEDBACK, summarize } = await import('../js/lesson-feedback-model.js');

function findAll(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.children || []) findAll(child, predicate, found);
  return found;
}

const radios = (form, key) => findAll(form.element, node => node.tag === 'input' && node.name === `lesson-feedback-${key}`);
const textarea = (form, field) => findAll(form.element, node => node.tag === 'textarea' && node.id === `lesson-feedback-${field}`)[0];
const legends = form => findAll(form.element, node => node.tag === 'legend').map(node => node.textContent);
const status = form => findAll(form.element, node => node.attributes?.role === 'status')[0];
const choose = (form, key, value) => { radios(form, key)[value - 1].checked = true; };

test('the submission step locks saved ratings and requires the others', () => {
  const saved = { ...EMPTY_FEEDBACK, lesson: 4, pros: 'Good pacing' };
  const form = createLessonFeedbackForm({ step: 'submission', saved });

  assert.deepEqual(legends(form), ['Lesson Quality', 'Presentation/Engagement', 'Popcorn Hacks', 'Homework Hacks']);
  const lesson = radios(form, 'lesson');
  assert.ok(lesson.every(radio => radio.disabled && !radio.required));
  assert.equal(lesson.find(radio => radio.checked).value, '4');
  for (const key of ['engage', 'popcorn', 'homework']) {
    assert.ok(radios(form, key).every(radio => !radio.disabled && radio.required && !radio.checked), key);
  }
  assert.equal(textarea(form, 'pros').value, 'Good pacing');
  assert.ok(textarea(form, 'grows').required);
  assert.equal(form.element.tag, 'div', 'an embedded step must not be its own <form>');
});

test('the lesson step shows three ratings, all optional', () => {
  const form = createLessonFeedbackForm({ step: 'lesson' });

  assert.deepEqual(legends(form), ['Lesson Quality', 'Presentation/Engagement', 'Popcorn Hacks']);
  assert.ok(radios(form, 'lesson').every(radio => !radio.required));
  assert.equal(textarea(form, 'pros').required, false);
});

test('readInput leaves out locked ratings and returns the chosen numbers', () => {
  const form = createLessonFeedbackForm({ step: 'submission', saved: { ...EMPTY_FEEDBACK, lesson: 4 } });
  choose(form, 'engage', 5);
  textarea(form, 'pros').value = 'Clear';

  assert.deepEqual(form.readInput(), { pros: 'Clear', grows: '', engage: 5, popcorn: null, homework: null });
});

test('validate names what is missing by label and marks those fields', () => {
  const form = createLessonFeedbackForm({ step: 'submission', saved: { ...EMPTY_FEEDBACK, lesson: 4, engage: 3 } });
  choose(form, 'popcorn', 2);
  textarea(form, 'pros').value = 'Clear';

  const result = form.validate();

  assert.equal(result.ok, false);
  assert.equal(status(form).textContent, 'Finish these before you submit: Homework Hacks, Grows.');
  const invalid = findAll(form.element, node => node.attributes?.['aria-invalid'] === 'true');
  assert.deepEqual(invalid.map(node => node.tag), ['fieldset', 'textarea']);
});

test('validate passes complete feedback and clears earlier errors', () => {
  const form = createLessonFeedbackForm({ step: 'submission', saved: { ...EMPTY_FEEDBACK, lesson: 4, engage: 3, popcorn: 2 } });
  form.validate();
  choose(form, 'homework', 5);
  textarea(form, 'pros').value = 'Clear';
  textarea(form, 'grows').value = 'Fewer slides';

  const result = form.validate();

  assert.equal(result.ok, true);
  assert.deepEqual(result.feedback, { lesson: 4, engage: 3, popcorn: 2, homework: 5, pros: 'Clear', grows: 'Fewer slides' });
  assert.equal(status(form).textContent, '');
  assert.equal(findAll(form.element, node => node.attributes?.['aria-invalid']).length, 0);
});

test('a standalone lesson form sends its input through onSubmit', () => {
  const sent = [];
  const form = createLessonFeedbackForm({ step: 'lesson', submitLabel: 'Save feedback', onSubmit: (input, merged) => sent.push({ input, merged }) });
  choose(form, 'lesson', 3);
  let prevented = false;

  form.element.listeners.submit({ preventDefault() { prevented = true; } });

  assert.equal(form.element.tag, 'form');
  assert.ok(prevented);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].merged.lesson, 3);
  const button = findAll(form.element, node => node.tag === 'button')[0];
  assert.equal(button.type, 'submit');
  assert.equal(button.textContent, 'Save feedback');
});

test('focusFirstInvalid goes to the first field validate() marked', () => {
  const form = createLessonFeedbackForm({ step: 'submission', saved: { ...EMPTY_FEEDBACK, lesson: 4, engage: 3, popcorn: 2 } });
  choose(form, 'homework', 5);
  textarea(form, 'pros').value = 'Clear';
  const grows = textarea(form, 'grows');
  let focused = null;
  grows.matches = selector => selector === 'textarea';
  grows.focus = () => { focused = grows; };

  form.validate();
  form.focusFirstInvalid();

  assert.equal(focused, grows);
});

test('before any finished feedback the summary says so and draws no chart', () => {
  const card = createLessonSummary(summarize([]));
  const text = findAll(card, node => node.className === 'ocs__callout')[0].textContent;

  assert.match(text, /No student has finished/);
  assert.equal(findAll(card, node => node.tag === 'figure').length, 0);
});

test('diverging segments put 1-2 left of the centre, split 3 across it, and 4-5 right', () => {
  // 4 students: one 2, two 3s, one 5. Half the track (50) stands for all 4.
  assert.deepEqual(divergingSegments([0, 1, 2, 0, 1], 4), [
    { value: 2, count: 1, left: 25, width: 12.5 },
    { value: 3, count: 2, left: 37.5, width: 25 },
    { value: 5, count: 1, left: 62.5, width: 12.5 },
  ]);
  assert.deepEqual(divergingSegments([0, 0, 0, 0, 0], 0), []);
});

test('the summary charts every rating, with a table view and comments as plain text', () => {
  const records = Array.from({ length: 5 }, (_, i) =>
    ({ lesson: 4, engage: 5, popcorn: 3, homework: i === 0 ? 1 : 4, pros: `<script>alert(${i})</script>`, grows: `grow ${i}` }));
  const card = createLessonSummary(summarize(records, () => 0), { light: true });

  assert.match(card.className, /lesson-summary--light/);
  const rows = findAll(card, node => node.className === 'lesson-summary__row');
  assert.equal(rows.length, 4);
  const homework = findAll(rows[3], node => /lesson-summary__segment/.test(node.className));
  assert.deepEqual(homework.map(node => node.className.split('--v')[1]), ['1', '4']);
  assert.equal(homework[0].dataset.tip, 'Homework Hacks · 1 Poor: 1 student (20%)');
  assert.equal(homework[1].style.width, '40%');

  const cells = findAll(card, node => node.tag === 'td').map(node => node.textContent);
  assert.deepEqual(cells.slice(0, 7), ['Lesson Quality', '0', '0', '0', '5', '0', '4.00']);
  assert.deepEqual(cells.slice(21), ['Homework Hacks', '1', '0', '0', '4', '0', '3.40']);
  const comments = findAll(card, node => node.tag === 'li' && !node.children.length).map(node => node.textContent);
  assert.equal(comments.length, 10);
  assert.ok(comments.includes('<script>alert(0)</script>'));
});
