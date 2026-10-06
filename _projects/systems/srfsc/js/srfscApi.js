// ============================================
// srfscApi.js
// RESPONSIBILITY: All communication with the Flask /api/srfsc endpoints.
// It does NOT render UI or read the DOM.
// ============================================
import { fetchOptions } from '../../api/config.js';
import { SRFSC_API_ORIGIN } from './srfscConfig.js';
import { OFFLINE_FORM_MESSAGE } from './srfscFallback.js';

const SRFSC_BASE = `${SRFSC_API_ORIGIN}/api/srfsc`;
const ADMIN_KEY_STORAGE = 'srfsc-admin-key';

// Admin key lives in sessionStorage only (cleared when the tab closes); storage can throw in private modes.
export function getAdminKey() {
  try { return sessionStorage.getItem(ADMIN_KEY_STORAGE) || ''; } catch { return ''; }
}

export function setAdminKey(key) {
  try {
    if (key) sessionStorage.setItem(ADMIN_KEY_STORAGE, key); else sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  } catch { /* storage unavailable: the key just won't persist across reloads */ }
}

export class SrfscApiError extends Error {
  /**
   * @param {boolean} offline true when the SRFSC backend itself is unavailable (network/CORS failure,
   *   or a bare 404 because /api/srfsc is not deployed there) rather than rejecting this request
   */
  constructor(message, status, offline = false) {
    super(message);
    this.name = 'SrfscApiError';
    this.status = status;
    this.offline = offline;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  if (!SRFSC_API_ORIGIN) {
    // No backend deployed for this site yet: fail fast into offline mode without a network call.
    throw new SrfscApiError(OFFLINE_FORM_MESSAGE, 0, true);
  }
  const adminKey = getAdminKey();
  const headers = adminKey ? { ...fetchOptions.headers, Authorization: `Bearer ${adminKey}` } : fetchOptions.headers;
  let response;
  try {
    response = await fetch(`${SRFSC_BASE}${path}`, {
      ...fetchOptions,
      headers,
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (networkError) {
    throw new SrfscApiError(OFFLINE_FORM_MESSAGE, 0, true);
  }

  const payload = await response.json().catch(() => null);
  // SRFSC 404s always carry a JSON message; a bare 404 means the API isn't on this server.
  if (response.status === 404 && !payload?.message) {
    throw new SrfscApiError(OFFLINE_FORM_MESSAGE, 404, true);
  }
  if (!response.ok) {
    const message = payload?.message || `Request failed (HTTP ${response.status}).`;
    throw new SrfscApiError(message, response.status);
  }
  return payload;
}

// Public
export const fetchUpcomingEvents = () => request('/events');
export const fetchStats = () => request('/stats');
export const fetchConditions = () => request('/conditions');
export const fetchUpdates = (limit = 10) => request(`/updates?limit=${limit}`);
export const rsvpToEvent = (eventId, attendee) =>
  request(`/events/${eventId}/rsvp`, { method: 'POST', body: attendee });
export const submitVolunteer = (volunteer) => request('/volunteers', { method: 'POST', body: volunteer });
export const submitHazardReport = (report) => request('/reports', { method: 'POST', body: report });

// Admin (401/403 for everyone else)
export const fetchVolunteers = () => request('/volunteers');
export const fetchHazardReports = () => request('/reports');
export const updateReportStatus = (reportId, status) =>
  request(`/reports/${reportId}`, { method: 'PUT', body: { status } });
export const createUpdate = (update) => request('/updates', { method: 'POST', body: update });
export const createEvent = (event) => request('/events', { method: 'POST', body: event });
