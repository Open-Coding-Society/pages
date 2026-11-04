// Spring calls for lesson feedback: the only module in this project that does I/O.
//
// The page passes javaURI and fetchOptions from assets/js/api/config.js (the cookie
// and CORS settings every Spring call uses), so this module keeps ./ imports only.
// The student is the signed-in account; Spring never takes it from the request.
// Every response goes through the model's converters before the page sees it.
import { API_PATH, fromFeedbackView, fromSummaryResponse, toStepRequest } from './lesson-feedback-model.js';

/** Thrown when Spring refuses a request; `status` lets the page pick what to show. */
export class LessonFeedbackApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'LessonFeedbackApiError';
    this.status = status;
  }
}

function requireAssignmentId(assignmentId) {
  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    throw new LessonFeedbackApiError(`Lesson feedback needs an assignment id, got ${assignmentId}`, 0);
  }
}

/**
 * Builds the client. `fetchImpl` is for tests; pages use the browser's fetch.
 * loadMine and saveStep resolve to fromFeedbackView()'s shape, loadSummary to
 * summarize()'s shape; failures reject with a LessonFeedbackApiError.
 */
export function createLessonFeedbackApi({ javaURI, fetchOptions, fetchImpl = globalThis.fetch }) {
  if (!javaURI) throw new Error('createLessonFeedbackApi needs javaURI from config.js');

  async function request(method, path, body) {
    const response = await fetchImpl(`${javaURI}${API_PATH}/${path}`, {
      ...fetchOptions,
      method,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      // A proxy error page is not JSON; the status code below still explains the failure.
    }
    if (!response.ok) {
      throw new LessonFeedbackApiError(payload?.error || `Lesson feedback request failed (HTTP ${response.status})`,
        response.status);
    }
    return payload;
  }

  return {
    async loadMine(assignmentId) {
      requireAssignmentId(assignmentId);
      return fromFeedbackView(await request('GET', `${assignmentId}/mine`));
    },
    // `step` is 'lesson' or 'submission', which are also the route names.
    async saveStep(assignmentId, step, input) {
      requireAssignmentId(assignmentId);
      const body = toStepRequest(step, input);
      return fromFeedbackView(await request('PUT', `${assignmentId}/${step}`, body));
    },
    async loadSummary(assignmentId) {
      requireAssignmentId(assignmentId);
      return fromSummaryResponse(await request('GET', `${assignmentId}/summary`));
    },
  };
}
