// ToolchainApi.js
// Spring endpoints for Toolchain Trail one-time device pairing (blueprint-spring: mvc/toolchain).
// The signed-in page gets a single-use pairing code once per trail; the student's
// local agent (scripts/toolchain_agent.py) exchanges it for a scoped token and
// stays open. At each station the page asks the backend to check that station,
// the agent sends its results, and this page polls the session for the verdict.
import { javaURI, fetchOptions } from '@assets/js/api/config.js';

const BASE_URL = `${javaURI}/api/toolchain`;
const PAIRED_SESSION_KEY = 'ocs-toolchain-agent-session';

// The paired session id is remembered so later stations reuse the running agent.
// It is not a secret: the backend only lets its owner (by login cookie) use it.
export function loadPairedSessionId() {
  try {
    return localStorage.getItem(PAIRED_SESSION_KEY);
  } catch (_) {
    return null; // storage blocked: the student pairs at each station instead
  }
}

export function savePairedSessionId(sessionId) {
  try {
    localStorage.setItem(PAIRED_SESSION_KEY, sessionId);
  } catch (_) {
    // storage blocked; see loadPairedSessionId
  }
}

export function forgetPairedSessionId() {
  try {
    localStorage.removeItem(PAIRED_SESSION_KEY);
  } catch (_) {
    // storage blocked; nothing was saved
  }
}

async function readError(response, fallback) {
  try {
    const body = await response.json();
    if (typeof body?.error === 'string') return body.error;
  } catch (_) {
    // not JSON; use the fallback
  }
  return `${fallback} (HTTP ${response.status})`;
}

/**
 * @param {string} stationId
 * @returns {Promise<{sessionId: string, stationId: string, pairingCode: string, expiresAt: string}>}
 */
export async function startToolchainSession(stationId) {
  const response = await fetch(`${BASE_URL}/sessions`, {
    ...fetchOptions,
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify({ stationId }),
  });
  if (!response.ok) {
    const error = new Error(await readError(response, 'Starting the station failed'));
    error.status = response.status; // 401 means the student isn't signed in
    throw error;
  }
  const body = await response.json();
  if (typeof body?.sessionId !== 'string' || typeof body?.pairingCode !== 'string') {
    throw new Error('Starting the station failed (unexpected response)');
  }
  return body;
}

/**
 * @param {string} sessionId
 * @returns {Promise<{sessionId: string, stationId: string,
 *   status: 'WAITING_FOR_AGENT'|'CHECKING'|'VERIFIED'|'FAILED'|'EXPIRED'|'AGENT_EXPIRED',
 *   checks: {id: string, label: string, passed: boolean, detail: string}[]}>}
 */
export async function getToolchainSession(sessionId) {
  const response = await fetch(`${BASE_URL}/sessions/${encodeURIComponent(sessionId)}`, {
    ...fetchOptions,
    method: 'GET',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Checking the station failed'));
  }
  return response.json();
}

/**
 * Points the student's already-paired agent at a station. Fails (409) when no
 * agent is connected or (404) when the session is not this student's.
 * @returns {Promise<object>} the session view, status 'CHECKING' (or 'VERIFIED' if it already was)
 */
export async function requestStationCheck(sessionId, stationId) {
  const response = await fetch(`${BASE_URL}/sessions/${encodeURIComponent(sessionId)}/check`, {
    ...fetchOptions,
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify({ stationId }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, 'Asking the agent to check failed'));
  }
  return response.json();
}

/** True when the game talks to a backend running on this computer (local development). */
export function usesLocalBackend() {
  return javaURI.startsWith('http://localhost');
}

/** The command a student runs for their OS, from inside their pages repository. */
export function agentCommands(os) {
  const local = usesLocalBackend() ? ` --server ${javaURI}` : '';
  if (os === 'windows') {
    return [
      { label: 'Ubuntu (WSL) terminal', command: `python3 scripts/toolchain_agent.py${local}` },
      { label: 'or PowerShell', command: `py scripts\\toolchain_agent.py${local}` },
    ];
  }
  return [{ label: 'Terminal', command: `python3 scripts/toolchain_agent.py${local}` }];
}
