// Pure rules for lesson feedback: no DOM, no fetch.
//
// Students rate a lesson a student team taught, in two steps. At the lesson they may
// rate lesson quality, engagement and popcorn hacks and write pros and grows. At
// submission they fill any rating left empty, add the homework hacks rating and may
// edit pros and grows. A saved rating cannot change, and a submission needs all four
// ratings plus pros and grows.
//
// These rules match LessonFeedbackRules in Spring (mvc/lessonfeedback). The browser
// uses them to show locks and missing fields; only the server's copy is trusted.

export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const MAX_TEXT_LENGTH = 1000;

// Wording approved by the PM; `step` is where the rating is first asked.
export const RATINGS = [
  { key: 'lesson', label: 'Lesson Quality', question: 'How clear, accurate and well organized was the lesson?', step: 'lesson' },
  { key: 'engage', label: 'Presentation/Engagement', question: 'How well did the team explain the material and keep the class involved?', step: 'lesson' },
  { key: 'popcorn', label: 'Popcorn Hacks', question: 'How much did the popcorn hacks help you understand the lesson as it went?', step: 'lesson' },
  { key: 'homework', label: 'Homework Hacks', question: 'How well did the homework hacks let you practice what the lesson taught?', step: 'submission' },
];

export const SCALE_HINT = '1 Poor · 2 Fair · 3 Good · 4 Very good · 5 Excellent';

export const STEPS = ['lesson', 'submission'];

export const EMPTY_FEEDBACK = Object.freeze({
  lesson: null, engage: null, popcorn: null, homework: null, pros: null, grows: null,
});

const TEXT_FIELDS = ['pros', 'grows'];

export class FeedbackError extends Error {
  // `kind` is 'invalid' (bad value), 'locked' (changing a saved rating) or 'missing'
  // (submission step incomplete); `fields` lists every field the error is about.
  constructor(kind, fields, message) {
    super(message);
    this.name = 'FeedbackError';
    this.kind = kind;
    this.fields = fields;
  }
}

const isBlank = text => text === null || text === undefined || String(text).trim() === '';

function requireStep(step) {
  if (!STEPS.includes(step)) {
    throw new FeedbackError('invalid', ['step'], `Unknown feedback step: ${step}`);
  }
}

// The ratings a step shows: the lesson step asks three, the submission step all four.
export function ratingsForStep(step) {
  requireStep(step);
  return step === 'lesson' ? RATINGS.filter(rating => rating.step === 'lesson') : RATINGS;
}

// Ratings already saved, which the student can no longer change.
export function lockedFields(saved) {
  const current = saved || EMPTY_FEEDBACK;
  return RATINGS.filter(rating => current[rating.key] !== null && current[rating.key] !== undefined)
    .map(rating => rating.key);
}

// What still has to be filled before the submission step can be sent.
export function missingFields(feedback) {
  const current = feedback || EMPTY_FEEDBACK;
  const missing = RATINGS.filter(rating => current[rating.key] === null || current[rating.key] === undefined)
    .map(rating => rating.key);
  return missing.concat(TEXT_FIELDS.filter(field => isBlank(current[field])));
}

export const isComplete = feedback => Boolean(feedback) && missingFields(feedback).length === 0;

function mergeRating(key, saved, requested) {
  if (requested === null || requested === undefined) return saved ?? null;
  if (!Number.isInteger(requested) || requested < MIN_RATING || requested > MAX_RATING) {
    throw new FeedbackError('invalid', [key], `${key} must be a whole number from ${MIN_RATING} to ${MAX_RATING}`);
  }
  // Resending the saved value is allowed so a form can post every field it shows.
  if (saved !== null && saved !== undefined && saved !== requested) {
    throw new FeedbackError('locked', [key], `${key} was already saved and cannot be changed`);
  }
  return requested;
}

function mergeText(field, saved, requested) {
  if (requested === null || requested === undefined) return saved ?? null;
  const trimmed = String(requested).trim();
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new FeedbackError('invalid', [field], `${field} must be at most ${MAX_TEXT_LENGTH} characters`);
  }
  return trimmed === '' ? null : trimmed;
}

// Applies one step's input to the saved feedback. The lesson step may be partial and
// ignores homework; the submission step must leave the feedback complete.
export function mergeStep(step, saved, input) {
  const keys = ratingsForStep(step).map(rating => rating.key);
  const current = { ...EMPTY_FEEDBACK, ...(saved || {}) };
  const request = input || {};
  const merged = { ...current };
  for (const key of keys) merged[key] = mergeRating(key, current[key], request[key]);
  for (const field of TEXT_FIELDS) merged[field] = mergeText(field, current[field], request[field]);
  if (step === 'submission') {
    const missing = missingFields(merged);
    if (missing.length) {
      throw new FeedbackError('missing', missing, `Complete your lesson feedback before submitting. Missing: ${missing.join(', ')}`);
    }
  }
  return merged;
}

// What the form draws for each rating in a step: its saved value, whether it is
// locked, and whether the step requires it.
export function formFields(step, saved) {
  const current = { ...EMPTY_FEEDBACK, ...(saved || {}) };
  const locked = new Set(lockedFields(current));
  return {
    ratings: ratingsForStep(step).map(rating => ({
      ...rating,
      value: current[rating.key],
      locked: locked.has(rating.key),
      required: step === 'submission',
    })),
    pros: current.pros || '',
    grows: current.grows || '',
    textRequired: step === 'submission',
  };
}

// Fisher-Yates with an injected random() so tests can fix the order.
function shuffled(items, random) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const average = (records, key) => (records.length
  ? Math.round((records.reduce((total, record) => total + record[key], 0) / records.length) * 100) / 100
  : null);

// How many students gave each value from MIN_RATING to MAX_RATING (index 0 is a 1).
function countsOf(records, key) {
  const counts = new Array(MAX_RATING - MIN_RATING + 1).fill(0);
  for (const record of records) counts[record[key] - MIN_RATING] += 1;
  return counts;
}

// The live Lesson Summary teachers see: averages, rating counts and the comments
// without names, from complete feedback only. Pros and grows are shuffled separately
// so a comment cannot be matched to its writer's ratings, their other comment or the
// order students submitted in. Averages are null before the first response.
export function summarize(records, random = Math.random) {
  const complete = (records || []).filter(isComplete);
  return {
    responseCount: complete.length,
    averages: Object.fromEntries(RATINGS.map(rating => [rating.key, average(complete, rating.key)])),
    counts: Object.fromEntries(RATINGS.map(rating => [rating.key, countsOf(complete, rating.key)])),
    pros: shuffled(complete.map(record => record.pros), random),
    grows: shuffled(complete.map(record => record.grows), random),
  };
}

// --- Spring API shapes ----------------------------------------------------------
//
// Spring stores the feedback (mvc/lessonfeedback, /api/lesson-feedback/{assignmentId}).
// These build its request bodies and turn its responses into the shapes above, so
// lesson-feedback-api.js stays a thin fetch layer. Responses are checked rather than
// trusted, so a bad value never reaches a form or a summary.

export const API_PATH = '/api/lesson-feedback';

const asRating = value => (Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING ? value : null);
const asText = value => (typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, MAX_TEXT_LENGTH) : null);
const asTime = value => (Number.isFinite(value) ? value : null);

// The body for PUT .../{step}: only that step's ratings plus pros and grows, so the
// lesson step never sends homework. Null leaves a saved value as it is.
export function toStepRequest(step, input) {
  const request = input || {};
  const body = Object.fromEntries(ratingsForStep(step).map(rating => [rating.key, request[rating.key] ?? null]));
  for (const field of TEXT_FIELDS) body[field] = request[field] ?? null;
  return body;
}

// Spring's FeedbackView, from GET .../mine and both PUTs. `locked` and `complete` are
// recomputed from the ratings so they always match what the form shows.
export function fromFeedbackView(view) {
  if (!view || typeof view !== 'object') {
    throw new FeedbackError('invalid', ['response'], 'The server did not send lesson feedback');
  }
  const source = view.feedback || {};
  const feedback = {
    ...Object.fromEntries(RATINGS.map(rating => [rating.key, asRating(source[rating.key])])),
    pros: asText(source.pros),
    grows: asText(source.grows),
  };
  return {
    assignmentId: Number.isInteger(view.assignmentId) ? view.assignmentId : null,
    page: typeof view.page === 'string' ? view.page : null,
    closed: view.closed === true,
    feedback,
    locked: lockedFields(feedback),
    complete: isComplete(feedback),
    createdAt: asTime(view.createdAt),
    updatedAt: asTime(view.updatedAt),
  };
}

const SUMMARY_AVERAGES = { lesson: 'averageLesson', engage: 'averageEngage', popcorn: 'averagePopcorn', homework: 'averageHomework' };

const SCALE_SIZE = MAX_RATING - MIN_RATING + 1;
const asCount = value => (Number.isInteger(value) && value >= 0 ? value : 0);

// Spring's Summary, from GET .../summary, in the shape summarize() returns. A summary
// with responses must carry every average; a bad count reads as 0.
export function fromSummaryResponse(summary) {
  const source = summary || {};
  const responseCount = asCount(source.responseCount);
  const averages = Object.fromEntries(RATINGS.map(rating => {
    const value = source[SUMMARY_AVERAGES[rating.key]];
    return [rating.key, Number.isFinite(value) ? value : null];
  }));
  const missing = RATINGS.filter(rating => averages[rating.key] === null).map(rating => rating.key);
  if (responseCount > 0 && missing.length) {
    throw new FeedbackError('invalid', missing, `The summary has no average for: ${missing.join(', ')}`);
  }
  const counts = Object.fromEntries(RATINGS.map(rating => {
    const list = Array.isArray(source.counts?.[rating.key]) ? source.counts[rating.key] : [];
    return [rating.key, Array.from({ length: SCALE_SIZE }, (_, index) => asCount(list[index]))];
  }));
  const comments = list => (Array.isArray(list) ? list.filter(text => typeof text === 'string') : []);
  return { responseCount, averages, counts, pros: comments(source.pros), grows: comments(source.grows) };
}
