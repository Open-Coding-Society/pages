// HelpRequestApi.js
// Spring endpoint for the red flag help button (blueprint-spring: mvc/cspathway).
// The student comes from the JWT cookie; teachers read requests on /mvc/cs-pathway/read.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const HELP_REQUESTS_URL = `${javaURI}/api/cs-pathway/help-requests`;

/** Thrown when the server refuses the request; `status` lets the UI pick a friendly message. */
export class HelpRequestError extends Error {
  constructor(message, status, retryAfterSeconds = null) {
    super(message);
    this.name = 'HelpRequestError';
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * @param {{levelKey: string, station: string|null, message: string}} request
 * @returns {Promise<{sent: true, createdAt: number}>}
 */
export async function sendHelpRequest({ levelKey, station, message }) {
  const response = await fetch(HELP_REQUESTS_URL, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify({ levelKey, station, message }),
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    // A proxy error page is not JSON; the status code below still explains the failure.
  }
  if (!response.ok) {
    throw new HelpRequestError(
      body?.error || `Sending the help request failed (HTTP ${response.status})`,
      response.status,
      body?.retryAfterSeconds ?? null,
    );
  }
  return { sent: true, createdAt: Number(body?.createdAt) };
}
