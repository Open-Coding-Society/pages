// ============================================
// srfscApi.js
// RESPONSIBILITY: All communication with the Flask /api/srfsc endpoints.
// It does NOT render UI or read the DOM.
// ============================================
import { pythonURI, fetchOptions } from '../../api/config.js';

const SRFSC_BASE = `${pythonURI}/api/srfsc`;

export class SrfscApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'SrfscApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${SRFSC_BASE}${path}`, {
      ...fetchOptions,
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (networkError) {
    throw new SrfscApiError('Cannot reach the SRFSC server. Check your connection.', 0);
  }

  const payload = await response.json().catch(() => null);
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
