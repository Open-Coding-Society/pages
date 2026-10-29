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
// Fewer responses than this would let the teaching team guess who wrote a comment.
export const MIN_RESPONSES_FOR_SUMMARY = 5;

// Draft wording for the PM to approve; `step` is where the rating is first asked.
export const RATINGS = [
  { key: 'lesson', label: 'Lesson Quality', question: 'How clear and well organized was the lesson?', step: 'lesson' },
  { key: 'engage', label: 'Presentation/Engagement', question: 'How well did the team present and keep the class engaged?', step: 'lesson' },
  { key: 'popcorn', label: 'Popcorn Hacks', question: 'How much did the popcorn hacks help you during the lesson?', step: 'lesson' },
  { key: 'homework', label: 'Homework Hacks', question: 'How well did the homework hacks build on the lesson?', step: 'submission' },
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

const average = (records, key) =>
  Math.round((records.reduce((total, record) => total + record[key], 0) / records.length) * 100) / 100;

// The Lesson Summary: averages and anonymous comments from complete feedback only.
// Pros and grows are shuffled separately so a comment cannot be matched to its
// writer's ratings, their other comment or the order students submitted in.
export function summarize(records, random = Math.random) {
  const complete = (records || []).filter(isComplete);
  const count = complete.length;
  if (count < MIN_RESPONSES_FOR_SUMMARY) {
    return { responseCount: count, released: false, averages: null, pros: [], grows: [] };
  }
  const averages = Object.fromEntries(RATINGS.map(rating => [rating.key, average(complete, rating.key)]));
  return {
    responseCount: count,
    released: true,
    averages,
    pros: shuffled(complete.map(record => record.pros), random),
    grows: shuffled(complete.map(record => record.grows), random),
  };
}

// --- Storage as microblog posts -------------------------------------------------
//
// Feedback is kept as a microblog post on the lesson's page (topicPath), with the
// ratings and text in the post's optional `data` field. `content` is required by
// Flask, so it holds a fixed label rather than anything the student wrote; the panel
// must hide these posts from the page feed before any are saved.

export const MICROBLOG_KIND = 'lesson-feedback';
export const MICROBLOG_CONTENT = 'Lesson feedback';
const DATA_VERSION = 1;

export function toMicroblogPost(feedback, topicPath) {
  if (isBlank(topicPath)) {
    throw new FeedbackError('invalid', ['topicPath'], 'A lesson page is required to save feedback');
  }
  const current = { ...EMPTY_FEEDBACK, ...(feedback || {}) };
  return {
    content: MICROBLOG_CONTENT,
    topicPath,
    data: {
      kind: MICROBLOG_KIND,
      version: DATA_VERSION,
      ratings: Object.fromEntries(RATINGS.map(rating => [rating.key, current[rating.key]])),
      pros: current.pros,
      grows: current.grows,
    },
  };
}

const asRating = value => (Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING ? value : null);
const asText = value => (typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, MAX_TEXT_LENGTH) : null);

// Reads feedback back from a microblog post; anything else (an ordinary post, or
// data this version does not understand) returns null.
export function fromMicroblogPost(post) {
  let data = post?.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (!data || data.kind !== MICROBLOG_KIND || data.version !== DATA_VERSION) return null;
  const ratings = data.ratings || {};
  return {
    ...Object.fromEntries(RATINGS.map(rating => [rating.key, asRating(ratings[rating.key])])),
    pros: asText(data.pros),
    grows: asText(data.grows),
  };
}
