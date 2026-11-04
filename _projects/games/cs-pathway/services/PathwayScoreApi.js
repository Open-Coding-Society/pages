// PathwayScoreApi.js
// Spring endpoints for CS Pathway level scores (blueprint-spring: mvc/cspathway).
// The signed-in student comes from the Spring JWT cookie, so no uid is sent.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const BASE_URL = `${javaURI}/api/cs-pathway/scores`;

/** @returns {Promise<Array<{levelKey: string, percentComplete: number, finished: boolean}>>} */
export async function fetchLevelScores() {
  const response = await fetch(BASE_URL, { ...fetchOptions, method: 'GET', cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Loading CS Pathway scores failed (HTTP ${response.status})`);
  }
  const body = await response.json();
  return Array.isArray(body?.levels) ? body.levels : [];
}

/** @returns {Promise<{levelKey: string, percentComplete: number, finished: boolean}>} */
export async function saveLevelProgress(levelKey, percentComplete) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(levelKey)}`, {
    ...fetchOptions,
    method: 'PUT',
    body: JSON.stringify({ percentComplete }),
  });
  if (!response.ok) {
    throw new Error(`Saving ${levelKey} progress failed (HTTP ${response.status})`);
  }
  return response.json();
}
