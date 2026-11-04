// The page controller against a stub document and a stub API: what each mount shows,
// and when beforeSubmit() lets the homework go. No network or real DOM is used.
import assert from 'node:assert/strict';
import test from 'node:test';

function stubNode(tag) {
  return {
    tag,
    className: '',
    children: [],
    attributes: {},
    listeners: {},
    textContent: '',
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(type, handler) { this.listeners[type] = handler; },
    // Enough of the DOM for the form's focusFirstInvalid(): tag selectors and focus.
    matches(selector) { return selector === this.tag; },
    querySelector() { return findAll(this, node => node.tag === 'input' && !node.disabled && node !== this)[0] || null; },
    scrollIntoView() { this.scrolled = true; },
    focus() { focused = this; },
  };
}

let focused = null;

globalThis.document = {
  createElement: stubNode,
  createTextNode: text => ({ tag: '#text', textContent: text }),
};

const { MESSAGES, MOUNTS, startLessonFeedback } = await import('../js/lesson-feedback-page.js');
const { LessonFeedbackApiError } = await import('../js/lesson-feedback-api.js');
const { EMPTY_FEEDBACK, fromFeedbackView } = await import('../js/lesson-feedback-model.js');

function findAll(node, predicate, found = []) {
  if (predicate(node)) found.push(node);
  for (const child of node.children || []) findAll(child, predicate, found);
  return found;
}

const texts = mount => findAll(mount, node => node.tag === 'p' && node.className === 'ocs__text').map(node => node.textContent);
const radios = (mount, prefix, key) => findAll(mount, node => node.tag === 'input' && node.name === `${prefix}-${key}`);
const textarea = (mount, id) => findAll(mount, node => node.tag === 'textarea' && node.id === id)[0];
const choose = (mount, prefix, key, value) => { radios(mount, prefix, key)[value - 1].checked = true; };
const form = mount => findAll(mount, node => node.tag === 'form')[0];

// A Spring FeedbackView run through the same converter the real client uses.
const view = (feedback, extra = {}) =>
  fromFeedbackView({ assignmentId: 10, page: '/lesson/', closed: false, feedback, ...extra });

function stubApi({ mine = view(EMPTY_FEEDBACK) } = {}) {
  const saves = [];
  return {
    saves,
    loadMine: async () => (mine instanceof Error ? Promise.reject(mine) : mine),
    saveStep: async (assignmentId, step, input) => {
      saves.push({ assignmentId, step, input });
      return view({ ...EMPTY_FEEDBACK, ...input });
    },
    loadSummary: async () => assert.fail('a lesson page never loads the Lesson Summary'),
  };
}

function start(api, resolveAssignmentId = async () => 10) {
  const mounts = { lesson: stubNode('div'), submission: stubNode('div') };
  const root = { querySelector: selector => mounts[Object.keys(MOUNTS).find(name => MOUNTS[name] === selector)] };
  const feedback = startLessonFeedback({ resolveAssignmentId, root, api });
  return { mounts, feedback };
}

test('everyone, the teaching team included, gets the lesson form and the submission step', async () => {
  const { mounts, feedback } = start(stubApi({ mine: view({ ...EMPTY_FEEDBACK, lesson: 4 }) }));
  await feedback.ready;

  assert.deepEqual(Object.keys(MOUNTS), ['lesson', 'submission'], 'no summary on the lesson page');
  assert.ok(form(mounts.lesson), 'the lesson step is its own form with a Save button');
  assert.ok(radios(mounts.lesson, 'lesson-feedback-lesson', 'lesson').every(radio => radio.disabled), 'saved rating is locked');
  assert.equal(radios(mounts.submission, 'lesson-feedback-submission', 'homework').length, 5);
  assert.equal(form(mounts.submission), undefined, 'the submission step must not be a nested form');
});

test('saving the lesson step sends it to Spring and redraws with the ratings locked', async () => {
  const api = stubApi();
  const { mounts, feedback } = start(api);
  await feedback.ready;
  choose(mounts.lesson, 'lesson-feedback-lesson', 'popcorn', 3);

  form(mounts.lesson).listeners.submit({ preventDefault() {} });
  // The form calls onSubmit without returning its promise; let the save settle.
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.deepEqual(api.saves.map(({ assignmentId, step }) => [assignmentId, step]), [[10, 'lesson']]);
  assert.equal(api.saves[0].input.popcorn, 3);
  assert.ok(radios(mounts.lesson, 'lesson-feedback-lesson', 'popcorn').every(radio => radio.disabled));
  assert.ok(texts(mounts.lesson).includes(MESSAGES.saved));
});

test('beforeSubmit stops incomplete feedback without saving and takes the student to what is missing', async () => {
  const api = stubApi({ mine: view({ ...EMPTY_FEEDBACK, lesson: 4 }) });
  const { mounts, feedback } = start(api);
  focused = null;

  assert.deepEqual(await feedback.beforeSubmit(), { ok: false, message: MESSAGES.incomplete });
  assert.equal(api.saves.length, 0);
  assert.equal(focused, radios(mounts.submission, 'lesson-feedback-submission', 'engage')[0],
    'focus lands on the first missing rating, after the locked one');
});

test('beforeSubmit saves complete feedback, then lets the homework go', async () => {
  const api = stubApi({ mine: view({ ...EMPTY_FEEDBACK, lesson: 4, engage: 5, popcorn: 3, pros: 'Clear' }) });
  const { mounts, feedback } = start(api);
  await feedback.ready;
  choose(mounts.submission, 'lesson-feedback-submission', 'homework', 2);
  textarea(mounts.submission, 'lesson-feedback-submission-grows').value = 'Slow down';

  assert.deepEqual(await feedback.beforeSubmit(), { ok: true });
  assert.deepEqual(api.saves.map(save => save.step), ['submission']);
  assert.equal(api.saves[0].input.homework, 2);
  assert.equal(api.saves[0].input.grows, 'Slow down');
});

test('a refused save stops the homework with Spring\'s message', async () => {
  const api = stubApi({ mine: view({ lesson: 4, engage: 5, popcorn: 3, homework: 2, pros: 'a', grows: 'b' }) });
  api.saveStep = async () => { throw new LessonFeedbackApiError('Feedback closed when this assignment was finalized.', 409); };
  const { feedback } = start(api);

  const result = await feedback.beforeSubmit();

  assert.equal(result.ok, false);
  assert.match(result.message, /Couldn't save your lesson feedback: Feedback closed/);
});

test('after close the form is gone and the homework is left to Spring, which refuses it', async () => {
  const api = stubApi({ mine: view(EMPTY_FEEDBACK, { closed: true }) });
  const { mounts, feedback } = start(api);
  await feedback.ready;

  assert.deepEqual(texts(mounts.lesson), [MESSAGES.closed]);
  assert.deepEqual(mounts.submission.children, []);
  assert.deepEqual(await feedback.beforeSubmit(), { ok: true });
  assert.equal(api.saves.length, 0);
});

test('signed out: both mounts say to sign in, and the homework waits', async () => {
  const signedOut = new LessonFeedbackApiError('Authentication required', 401);
  const { mounts, feedback } = start(stubApi({ mine: signedOut }));
  await feedback.ready;

  assert.deepEqual(texts(mounts.lesson), [MESSAGES.signIn]);
  assert.deepEqual(texts(mounts.submission), [MESSAGES.signIn]);
  assert.deepEqual(await feedback.beforeSubmit(), { ok: false, message: MESSAGES.signIn });
});

test('a failed first load is retried at submit time', async () => {
  let attempts = 0;
  const resolveAssignmentId = async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('Could not resolve backend assignment ID. Please log in and refresh.');
    return 10;
  };
  const api = stubApi({ mine: view({ lesson: 4, engage: 5, popcorn: 3, homework: 2, pros: 'a', grows: 'b' }) });
  const { mounts, feedback } = start(api, resolveAssignmentId);
  await feedback.ready;
  assert.match(texts(mounts.lesson)[0], /Could not resolve backend assignment ID/);

  assert.deepEqual(await feedback.beforeSubmit(), { ok: true });
  assert.equal(attempts, 2);
});
