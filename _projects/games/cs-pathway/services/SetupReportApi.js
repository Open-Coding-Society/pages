// SetupReportApi.js
// Spring endpoints for Toolchain Trail setup reports (blueprint-spring: mvc/cspathway).
// A Terminal has no login cookie, so the signed-in page asks for a pairing code
// and the verify script uploads its results to a URL containing that code.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const BASE_URL = `${javaURI}/api/cs-pathway/setup-report`;

/** @returns {Promise<{uploadUrl: string, expiresAt: number}>} where the verify script should send its results */
export async function requestReportUploadUrl() {
  const response = await fetch(`${BASE_URL}/pairing-code`, { ...fetchOptions, method: 'POST' });
  if (!response.ok) {
    throw new Error(`Getting a setup report code failed (HTTP ${response.status})`);
  }
  const body = await response.json();
  if (typeof body?.code !== 'string' || !/^[A-Z0-9]+$/.test(body.code)) {
    throw new Error('Getting a setup report code failed (unexpected response)');
  }
  return { uploadUrl: `${BASE_URL}/${body.code}`, expiresAt: Number(body.expiresAt) };
}

/** @returns {Promise<{report: string, reportedAt: number}|null>} the student's latest uploaded report, if any */
export async function fetchLatestSetupReport() {
  const response = await fetch(BASE_URL, { ...fetchOptions, method: 'GET', cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Loading the setup report failed (HTTP ${response.status})`);
  }
  const body = await response.json();
  if (typeof body?.report !== 'string') return null;
  return { report: body.report, reportedAt: Number(body.reportedAt) };
}
