// The API client against a stub fetch: which route and body each call sends, and how
// Spring's errors reach the page. No network is used.
import assert from 'node:assert/strict';
import test from 'node:test';

import { LessonFeedbackApiError, createLessonFeedbackApi } from '../js/lesson-feedback-api.js';

const FETCH_OPTIONS = { mode: 'cors', credentials: 'include', headers: { 'Content-Type': 'application/json' } };

function stubFetch(status, body) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (body === undefined) throw new SyntaxError('not JSON');
        return body;
      },
    };
  };
  return { calls, fetchImpl };
}

const view = feedback => ({ assignmentId: 10, page: '/lesson/', closed: false, feedback });

test('loadMine reads the signed-in student\'s feedback with the shared cookie options', async () => {
  const { calls, fetchImpl } = stubFetch(200, view({ lesson: 4 }));
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  const mine = await api.loadMine(10);

  assert.equal(calls[0].url, 'https://spring.example/api/lesson-feedback/10/mine');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.credentials, 'include');
  assert.equal(calls[0].options.body, undefined);
  assert.deepEqual(mine.locked, ['lesson']);
});

test('saveStep puts only that step\'s fields to the step\'s route', async () => {
  const { calls, fetchImpl } = stubFetch(200, view({ lesson: 4, popcorn: 3, pros: 'Clear' }));
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  const saved = await api.saveStep(10, 'lesson', { lesson: 4, popcorn: 3, homework: 5, pros: 'Clear', grows: '' });

  assert.equal(calls[0].url, 'https://spring.example/api/lesson-feedback/10/lesson');
  assert.equal(calls[0].options.method, 'PUT');
  assert.deepEqual(JSON.parse(calls[0].options.body), { lesson: 4, engage: null, popcorn: 3, pros: 'Clear', grows: '' });
  assert.equal(saved.feedback.pros, 'Clear');
});

test('loadSummary returns the summarize() shape', async () => {
  const { calls, fetchImpl } = stubFetch(200, {
    responseCount: 1, averageLesson: 4, averageEngage: 3, averagePopcorn: 5, averageHomework: 2,
    counts: { lesson: [0, 0, 0, 1, 0], engage: [0, 0, 1, 0, 0], popcorn: [0, 0, 0, 0, 1], homework: [0, 1, 0, 0, 0] },
    pros: ['Clear'], grows: ['Slower'],
  });
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  const summary = await api.loadSummary(10);

  assert.equal(summary.responseCount, 1);
  assert.deepEqual(summary.averages, { lesson: 4, engage: 3, popcorn: 5, homework: 2 });
  assert.deepEqual(summary.counts.homework, [0, 1, 0, 0, 0]);
  assert.deepEqual(summary.pros, ['Clear']);
  assert.equal(calls[0].url, 'https://spring.example/api/lesson-feedback/10/summary');
});

test('a refusal rejects with Spring\'s message and status', async () => {
  const { fetchImpl } = stubFetch(409, { error: 'lesson was already saved and cannot be changed' });
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  await assert.rejects(api.saveStep(10, 'lesson', { lesson: 5 }), error => {
    assert.ok(error instanceof LessonFeedbackApiError);
    assert.equal(error.status, 409);
    assert.equal(error.message, 'lesson was already saved and cannot be changed');
    return true;
  });
});

test('a non-JSON error page still reports the status', async () => {
  const { fetchImpl } = stubFetch(502, undefined);
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  await assert.rejects(api.loadMine(10), { name: 'LessonFeedbackApiError', status: 502,
    message: 'Lesson feedback request failed (HTTP 502)' });
});

test('a missing assignment id or javaURI fails before any request', async () => {
  const { calls, fetchImpl } = stubFetch(200, view({}));
  const api = createLessonFeedbackApi({ javaURI: 'https://spring.example', fetchOptions: FETCH_OPTIONS, fetchImpl });

  await assert.rejects(api.loadMine(null), LessonFeedbackApiError);
  await assert.rejects(api.saveStep(10, 'review', {}), { name: 'FeedbackError' });
  assert.equal(calls.length, 0);
  assert.throws(() => createLessonFeedbackApi({ javaURI: '', fetchOptions: FETCH_OPTIONS, fetchImpl }));
});
