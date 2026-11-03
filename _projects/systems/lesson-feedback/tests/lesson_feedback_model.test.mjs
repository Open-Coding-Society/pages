import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_FEEDBACK, FeedbackError, MAX_TEXT_LENGTH,
  formFields, fromFeedbackView, fromSummaryResponse, isComplete, lockedFields, mergeStep, missingFields,
  ratingsForStep, summarize, toStepRequest,
} from '../js/lesson-feedback-model.js';

// A fixed-seed generator so shuffles come out the same on every run.
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

const complete = (rating, pros = 'pros', grows = 'grows') =>
  ({ lesson: rating, engage: rating, popcorn: rating, homework: rating, pros, grows });

function errorOf(action) {
  try {
    action();
  } catch (error) {
    assert.ok(error instanceof FeedbackError, `expected a FeedbackError, got ${error}`);
    return error;
  }
  assert.fail('expected the call to throw');
}

test('the lesson step asks three ratings and the submission step all four', () => {
  assert.deepEqual(ratingsForStep('lesson').map(rating => rating.key), ['lesson', 'engage', 'popcorn']);
  assert.deepEqual(ratingsForStep('submission').map(rating => rating.key), ['lesson', 'engage', 'popcorn', 'homework']);
  assert.equal(errorOf(() => ratingsForStep('review')).kind, 'invalid');
});

test('the lesson step saves partial ratings, trims text and ignores homework', () => {
  const saved = mergeStep('lesson', null, { lesson: 4, popcorn: 3, homework: 5, pros: '  Clear examples ', grows: ' ' });

  assert.deepEqual(saved, { ...EMPTY_FEEDBACK, lesson: 4, popcorn: 3, pros: 'Clear examples' });
  assert.deepEqual(lockedFields(saved), ['lesson', 'popcorn']);
});

test('a saved rating cannot change, but resending it is allowed', () => {
  const saved = { ...EMPTY_FEEDBACK, lesson: 4, engage: 2, pros: 'pros', grows: 'grows' };

  const locked = errorOf(() => mergeStep('lesson', saved, { lesson: 5 }));
  assert.equal(locked.kind, 'locked');
  assert.deepEqual(locked.fields, ['lesson']);
  assert.equal(errorOf(() => mergeStep('submission', saved, { engage: 3, popcorn: 4, homework: 4 })).kind, 'locked');
  assert.deepEqual(mergeStep('lesson', saved, { lesson: 4, engage: 2 }), saved);
});

test('the submission step fills empty ratings, adds homework and edits text', () => {
  const saved = { ...EMPTY_FEEDBACK, lesson: 4, popcorn: 3, pros: 'Old pros', grows: 'Old grows' };

  const merged = mergeStep('submission', saved, { engage: 5, homework: 2, pros: 'New pros' });

  assert.deepEqual(merged, { lesson: 4, engage: 5, popcorn: 3, homework: 2, pros: 'New pros', grows: 'Old grows' });
  assert.ok(isComplete(merged));
});

test('skipping the lesson step means everything must be filled at submission', () => {
  const missing = errorOf(() => mergeStep('submission', null, { homework: 3, pros: 'pros' }));

  assert.equal(missing.kind, 'missing');
  assert.deepEqual(missing.fields, ['lesson', 'engage', 'popcorn', 'grows']);
  assert.deepEqual(mergeStep('submission', null, complete(3)), complete(3));
});

test('clearing pros or grows at submission leaves the feedback incomplete', () => {
  const missing = errorOf(() => mergeStep('submission', complete(4), { grows: '   ' }));

  assert.equal(missing.kind, 'missing');
  assert.deepEqual(missing.fields, ['grows']);
});

test('ratings must be whole numbers from 1 to 5 and text has a length limit', () => {
  for (const bad of [0, 6, 3.5, '3', -1]) {
    assert.equal(errorOf(() => mergeStep('lesson', null, { engage: bad })).kind, 'invalid', `rating ${bad}`);
  }
  const tooLong = 'a'.repeat(MAX_TEXT_LENGTH + 1);
  assert.deepEqual(errorOf(() => mergeStep('lesson', null, { pros: tooLong })).fields, ['pros']);
  assert.equal(mergeStep('lesson', null, { pros: 'a'.repeat(MAX_TEXT_LENGTH) }).pros.length, MAX_TEXT_LENGTH);
});

test('missingFields lists ratings first, then the text boxes', () => {
  assert.deepEqual(missingFields(null), ['lesson', 'engage', 'popcorn', 'homework', 'pros', 'grows']);
  assert.deepEqual(missingFields(complete(2)), []);
});

test('form fields show saved ratings as locked and require the rest at submission', () => {
  const saved = { ...EMPTY_FEEDBACK, lesson: 4, pros: 'Good pacing' };

  const lessonStep = formFields('lesson', saved);
  assert.deepEqual(lessonStep.ratings.map(({ key, locked, required }) => [key, locked, required]),
    [['lesson', true, false], ['engage', false, false], ['popcorn', false, false]]);
  assert.equal(lessonStep.textRequired, false);

  const submissionStep = formFields('submission', saved);
  assert.deepEqual(submissionStep.ratings.map(({ key, value, locked }) => [key, value, locked]),
    [['lesson', 4, true], ['engage', null, false], ['popcorn', null, false], ['homework', null, false]]);
  assert.ok(submissionStep.ratings.every(rating => rating.required));
  assert.equal(submissionStep.pros, 'Good pacing');
  assert.equal(submissionStep.grows, '');
});

const NO_COUNTS = [0, 0, 0, 0, 0];

test('before any finished feedback the summary has zero counts and no averages', () => {
  const summary = summarize([{ ...complete(5), homework: null }], seededRandom(1));

  assert.deepEqual(summary, {
    responseCount: 0,
    averages: { lesson: null, engage: null, popcorn: null, homework: null },
    counts: { lesson: NO_COUNTS, engage: NO_COUNTS, popcorn: NO_COUNTS, homework: NO_COUNTS },
    pros: [], grows: [],
  });
});

test('the summary is live from the first finished response and counts each rating from 1 to 5', () => {
  const summary = summarize([
    { lesson: 1, engage: 2, popcorn: 3, homework: 5, pros: 'a', grows: 'b' },
    { lesson: 1, engage: 2, popcorn: 4, homework: 5, pros: 'c', grows: 'd' },
    { lesson: 5, engage: 2, popcorn: 3, homework: 5, pros: 'e', grows: 'f' },
  ], seededRandom(1));

  assert.equal(summary.responseCount, 3);
  assert.deepEqual(summary.counts, {
    lesson: [2, 0, 0, 0, 1], engage: [0, 3, 0, 0, 0], popcorn: [0, 0, 2, 1, 0], homework: [0, 0, 0, 0, 3],
  });
  assert.equal(summarize([complete(4, 'Clear', 'Slower')]).averages.lesson, 4);
});

test('the summary averages the ratings and shuffles comments separately', () => {
  const records = Array.from({ length: 8 }, (_, i) =>
    ({ lesson: i % 2 === 0 ? 4 : 5, engage: 3, popcorn: 2, homework: 1, pros: `pros ${i}`, grows: `grows ${i}` }));

  const summary = summarize(records, seededRandom(42));

  assert.equal(summary.responseCount, 8);
  assert.deepEqual(summary.averages, { lesson: 4.5, engage: 3, popcorn: 2, homework: 1 });
  const submitted = records.map(record => record.pros);
  assert.deepEqual([...summary.pros].sort(), [...submitted].sort());
  assert.notDeepEqual(summary.pros, submitted, 'pros must not keep submission order');
  const order = comments => comments.map(text => text.split(' ')[1]);
  assert.notDeepEqual(order(summary.pros), order(summary.grows), 'pros and grows must not be paired by position');
  assert.equal(JSON.stringify(summary).includes('uid'), false);
});

test('a step request sends only that step\'s ratings, so the lesson step never sends homework', () => {
  const input = { lesson: 4, engage: null, popcorn: 3, homework: 5, pros: 'Clear', grows: '' };

  assert.deepEqual(toStepRequest('lesson', input), { lesson: 4, engage: null, popcorn: 3, pros: 'Clear', grows: '' });
  assert.deepEqual(toStepRequest('submission', { homework: 2 }),
    { lesson: null, engage: null, popcorn: null, homework: 2, pros: null, grows: null });
  assert.equal(errorOf(() => toStepRequest('review', input)).kind, 'invalid');
});

test('a feedback view from Spring is checked, and its locks come from the saved ratings', () => {
  const view = fromFeedbackView({
    assignmentId: 10, page: '/csp/lessons/loops/', closed: false,
    feedback: { lesson: 4, engage: null, popcorn: 3, homework: null, pros: 'Clear', grows: null },
    locked: ['homework'], complete: true, createdAt: 1000, updatedAt: 2000,
  });

  assert.deepEqual(view, {
    assignmentId: 10, page: '/csp/lessons/loops/', closed: false,
    feedback: { ...EMPTY_FEEDBACK, lesson: 4, popcorn: 3, pros: 'Clear' },
    locked: ['lesson', 'popcorn'], complete: false, createdAt: 1000, updatedAt: 2000,
  });
  assert.equal(errorOf(() => fromFeedbackView(null)).kind, 'invalid');
});

test('out-of-range or mistyped values from the server are dropped, not shown', () => {
  const view = fromFeedbackView({
    closed: 'yes',
    feedback: { lesson: 9, engage: '5', popcorn: 2, homework: 3.5, pros: 42, grows: '  ok ' },
    createdAt: 'soon',
  });

  assert.deepEqual(view.feedback, { lesson: null, engage: null, popcorn: 2, homework: null, pros: null, grows: 'ok' });
  assert.equal(view.closed, false);
  assert.equal(view.createdAt, null);
});

test('a Spring summary becomes the summarize() shape, with bad counts read as 0', () => {
  assert.deepEqual(fromSummaryResponse({ responseCount: 0, pros: [], grows: [] }), {
    responseCount: 0,
    averages: { lesson: null, engage: null, popcorn: null, homework: null },
    counts: { lesson: NO_COUNTS, engage: NO_COUNTS, popcorn: NO_COUNTS, homework: NO_COUNTS },
    pros: [], grows: [],
  });

  const summary = fromSummaryResponse({
    responseCount: 6, averageLesson: 4.5, averageEngage: 3, averagePopcorn: 2, averageHomework: 1,
    counts: { lesson: [0, 0, 0, 3, 3], engage: [0, 0, 6, 0, 0], popcorn: [0, 6], homework: [6, -1, 'x', 0, 0, 9] },
    pros: ['Clear', 7], grows: ['Slower'],
  });
  assert.deepEqual(summary, {
    responseCount: 6, averages: { lesson: 4.5, engage: 3, popcorn: 2, homework: 1 },
    counts: { lesson: [0, 0, 0, 3, 3], engage: [0, 0, 6, 0, 0], popcorn: [0, 6, 0, 0, 0], homework: [6, 0, 0, 0, 0] },
    pros: ['Clear'], grows: ['Slower'],
  });

  const broken = errorOf(() => fromSummaryResponse({ responseCount: 6, averageLesson: 4 }));
  assert.deepEqual(broken.fields, ['engage', 'popcorn', 'homework']);
});
