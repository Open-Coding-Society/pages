import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_FEEDBACK, FeedbackError, MAX_TEXT_LENGTH, MICROBLOG_CONTENT, MICROBLOG_KIND, MIN_RESPONSES_FOR_SUMMARY,
  formFields, fromMicroblogPost, isComplete, lockedFields, mergeStep, missingFields, ratingsForStep, summarize,
  toMicroblogPost,
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

test('the summary stays hidden below the minimum and ignores unfinished feedback', () => {
  const records = Array.from({ length: MIN_RESPONSES_FOR_SUMMARY - 1 }, (_, i) => complete(5, `pros ${i}`, `grows ${i}`));
  records.push({ ...complete(5), homework: null });

  const summary = summarize(records, seededRandom(1));

  assert.deepEqual(summary, { responseCount: MIN_RESPONSES_FOR_SUMMARY - 1, released: false, averages: null, pros: [], grows: [] });
});

test('a released summary averages the ratings and shuffles comments separately', () => {
  const records = Array.from({ length: 8 }, (_, i) =>
    ({ lesson: i % 2 === 0 ? 4 : 5, engage: 3, popcorn: 2, homework: 1, pros: `pros ${i}`, grows: `grows ${i}` }));

  const summary = summarize(records, seededRandom(42));

  assert.equal(summary.released, true);
  assert.equal(summary.responseCount, 8);
  assert.deepEqual(summary.averages, { lesson: 4.5, engage: 3, popcorn: 2, homework: 1 });
  const submitted = records.map(record => record.pros);
  assert.deepEqual([...summary.pros].sort(), [...submitted].sort());
  assert.notDeepEqual(summary.pros, submitted, 'pros must not keep submission order');
  const order = comments => comments.map(text => text.split(' ')[1]);
  assert.notDeepEqual(order(summary.pros), order(summary.grows), 'pros and grows must not be paired by position');
  assert.equal(JSON.stringify(summary).includes('uid'), false);
});

test('feedback is stored in a microblog post without the student text in content', () => {
  const feedback = { ...EMPTY_FEEDBACK, lesson: 4, pros: 'Great demo', grows: 'Slow down' };

  const post = toMicroblogPost(feedback, '/csp/lessons/loops/');

  assert.equal(post.content, MICROBLOG_CONTENT);
  assert.equal(post.topicPath, '/csp/lessons/loops/');
  assert.deepEqual(post.data, {
    kind: MICROBLOG_KIND,
    version: 1,
    ratings: { lesson: 4, engage: null, popcorn: null, homework: null },
    pros: 'Great demo',
    grows: 'Slow down',
  });
  assert.equal(errorOf(() => toMicroblogPost(feedback, ' ')).kind, 'invalid');
});

test('feedback reads back from a microblog post, including data sent as a JSON string', () => {
  const feedback = complete(3, 'Clear', 'Shorter hacks');
  const post = toMicroblogPost(feedback, '/lesson/');

  assert.deepEqual(fromMicroblogPost(post), feedback);
  assert.deepEqual(fromMicroblogPost({ ...post, data: JSON.stringify(post.data) }), feedback);
});

test('ordinary posts and unexpected data are not treated as feedback', () => {
  assert.equal(fromMicroblogPost({ content: 'Nice lesson!' }), null);
  assert.equal(fromMicroblogPost({ data: '{not json' }), null);
  assert.equal(fromMicroblogPost({ data: { kind: MICROBLOG_KIND, version: 2 } }), null);

  const tampered = fromMicroblogPost({
    data: { kind: MICROBLOG_KIND, version: 1, ratings: { lesson: 9, engage: '5', popcorn: 2 }, pros: 42, grows: '  ok ' },
  });
  assert.deepEqual(tampered, { lesson: null, engage: null, popcorn: 2, homework: null, pros: null, grows: 'ok' });
});
