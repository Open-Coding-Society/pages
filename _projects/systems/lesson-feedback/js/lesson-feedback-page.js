// Lesson feedback on a team-taught lesson (front matter `team_teach: true` on an
// assignment page): the lesson step in the microblog panel's Ratings tab and the
// submission step inside Submit Assignment. Everyone who submits the homework rates
// the lesson, the teaching team and teachers included. Teachers read the Lesson
// Summary on the Teacher Dashboard (lesson-feedback-teacher.js), not here.
//
// The page passes javaURI and fetchOptions from config.js and its own
// resolveAssignmentId, so the feedback goes to the same Spring assignment as the
// submission. Its submit handlers await beforeSubmit() and stop when it is not ok,
// which is how the homework waits for complete feedback.
import { createLessonFeedbackApi } from './lesson-feedback-api.js';
import { createLessonFeedbackForm } from './lesson-feedback-form.js';

// Filled by the includes in navigation/; a missing mount is skipped.
export const MOUNTS = {
  lesson: '[data-lesson-feedback="lesson"]',
  submission: '[data-lesson-feedback="submission"]',
};

export const MESSAGES = {
  signIn: 'Sign in to rate this lesson.',
  closed: 'Feedback closed when this assignment was finalized.',
  saving: 'Saving…',
  saved: 'Saved your feedback.',
  incomplete: 'Finish your lesson feedback above before you submit.',
};

const UNAUTHORIZED = 401;

/**
 * Loads the student's feedback and draws every mount. Returns `ready` (settles once
 * everything is drawn) and `beforeSubmit()`, which resolves to { ok: true } when
 * the homework may be sent, or { ok: false, message } with the text to show.
 * `api` and `root` are for tests.
 */
export function startLessonFeedback({
  javaURI, fetchOptions, resolveAssignmentId, root = document, api = createLessonFeedbackApi({ javaURI, fetchOptions }),
}) {
  const mounts = Object.fromEntries(Object.entries(MOUNTS).map(([name, selector]) => [name, root.querySelector(selector)]));
  let assignmentId = null;
  let view = null;
  let loadError = null;
  let lessonForm = null;
  let submissionForm = null;

  function text(message) {
    const paragraph = document.createElement('p');
    paragraph.className = 'ocs__text';
    paragraph.textContent = message;
    return paragraph;
  }

  function show(mount, ...nodes) {
    if (mount) mount.replaceChildren(...nodes);
  }

  function render() {
    lessonForm = null;
    submissionForm = null;
    if (loadError) {
      show(mounts.lesson, text(loadError));
      show(mounts.submission, text(loadError));
      return;
    }
    if (view.closed) {
      show(mounts.lesson, text(MESSAGES.closed));
      show(mounts.submission);
      return;
    }
    // Each form needs its own prefix: shared radio names would make one form's
    // choice clear the other's.
    lessonForm = createLessonFeedbackForm({
      step: 'lesson', saved: view.feedback, idPrefix: 'lesson-feedback-lesson',
      submitLabel: 'Save feedback', onSubmit: saveLessonStep,
    });
    show(mounts.lesson, lessonForm.element);
    submissionForm = createLessonFeedbackForm({ step: 'submission', saved: view.feedback, idPrefix: 'lesson-feedback-submission' });
    show(mounts.submission, submissionForm.element);
  }

  async function saveLessonStep(input) {
    const form = lessonForm;
    form.showStatus(MESSAGES.saving);
    try {
      view = await api.saveStep(assignmentId, 'lesson', input);
    } catch (error) {
      form.showStatus(`Couldn't save your feedback: ${error.message}`);
      return;
    }
    render();
    lessonForm?.showStatus(MESSAGES.saved);
  }

  async function load() {
    try {
      assignmentId = await resolveAssignmentId();
      view = await api.loadMine(assignmentId);
      loadError = null;
    } catch (error) {
      loadError = error.status === UNAUTHORIZED ? MESSAGES.signIn : `Couldn't load your lesson feedback: ${error.message}`;
    }
    render();
  }

  const ready = load();

  async function beforeSubmit() {
    await ready;
    // The first load may have failed before the student signed in, or on a blip.
    if (loadError) await load();
    if (loadError) return { ok: false, message: loadError };
    // Spring refuses saves after close, and refuses the homework on its own.
    if (view.closed) return { ok: true };
    const checked = submissionForm.validate();
    if (!checked.ok) {
      submissionForm.focusFirstInvalid();
      return { ok: false, message: MESSAGES.incomplete };
    }
    try {
      view = await api.saveStep(assignmentId, 'submission', checked.input);
    } catch (error) {
      const message = `Couldn't save your lesson feedback: ${error.message}`;
      submissionForm.showStatus(message);
      return { ok: false, message };
    }
    render();
    return { ok: true };
  }

  return { ready, beforeSubmit };
}
