/**
 * Spring calendar API client for CS Pathway personal timelines.
 */

import { javaURI, fetchOptions } from '@assets/js/api/config.js';

function stripClientFields(event) {
  const { priority, ...rest } = event;
  return rest;
}

/**
 * @param {Array<object>} events
 * @returns {Promise<{ ok: boolean, created: number, updated: number, failed: number, errors: string[], status: number }>}
 */
export async function publishPathwayEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return { ok: true, created: 0, updated: 0, failed: 0, errors: [], status: 200 };
  }

  const payload = {
    events: events.map((event) => {
      const cleaned = stripClientFields(event);
      return {
        title: cleaned.title,
        description: cleaned.description || '',
        date: cleaned.date,
        type: cleaned.type || 'event',
        period: cleaned.period || '',
        classPeriod: cleaned.classPeriod || '',
        groupName: cleaned.groupName || '',
      };
    }),
  };

  try {
    const response = await fetch(`${javaURI}/api/calendar/add_events`, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...(fetchOptions.headers || {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        created: 0,
        updated: 0,
        failed: events.length,
        errors: ['Authentication required to publish your CS Pathway calendar.'],
        status: response.status,
      };
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return {
        ok: false,
        created: 0,
        updated: 0,
        failed: events.length,
        errors: [text || `Calendar sync failed (${response.status}).`],
        status: response.status,
      };
    }

    const body = await response.json();
    return {
      ok: Boolean(body.success) || (body.failed === 0),
      created: body.created || 0,
      updated: body.updated || 0,
      failed: body.failed || 0,
      errors: body.errors || [],
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      created: 0,
      updated: 0,
      failed: events.length,
      errors: [error.message || 'Network error while publishing calendar events.'],
      status: 0,
    };
  }
}
