// ============================================
// CalendarApi.js
// RESPONSIBILITY: All backend API communication for the calendar
// This module does ONE thing: send/receive data from the server.
// It does NOT: build events, render UI, or manage modals.
// ============================================

// ─── Error Types & Messages (SRP Blog Pattern) ─────────────────

const ERROR_TYPES = Object.freeze({
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN'
});

const ERROR_MESSAGES = Object.freeze({
  [ERROR_TYPES.AUTH_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_TYPES.NETWORK_ERROR]: 'Cannot reach the server. Check your connection.',
  [ERROR_TYPES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
});

/**
 * Classify a fetch error or HTTP response into an ERROR_TYPE.
 * @param {Error|Response} errorOrResponse
 * @returns {string} One of ERROR_TYPES values
 */
function classifyError(errorOrResponse) {
  if (errorOrResponse instanceof TypeError) {
    return ERROR_TYPES.NETWORK_ERROR;
  }
  if (errorOrResponse instanceof Response || typeof errorOrResponse?.status === 'number') {
    const status = errorOrResponse.status;
    if (status === 401 || status === 403) return ERROR_TYPES.AUTH_EXPIRED;
    if (errorOrResponse.redirected && errorOrResponse.url && errorOrResponse.url.includes('/login')) return ERROR_TYPES.AUTH_EXPIRED;
    if (status === 404) return ERROR_TYPES.NOT_FOUND;
    if (status >= 500) return ERROR_TYPES.SERVER_ERROR;
  }
  return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message for an error type.
 * @param {string} errorType - One of ERROR_TYPES values
 * @returns {string}
 */
function getErrorMessage(errorType) {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
}

// ─── Config Loader ──────────────────────────────────────────────

/**
 * Load API configuration (javaURI + fetchOptions) via dynamic import.
 * @returns {Promise<{javaURI: string, fetchOptions: object}>}
 */
async function loadApiConfig() {
  const configModule = await import(SITE_BASEURL + '/assets/js/api/config.js');
  return {
    javaURI: configModule.javaURI,
    fetchOptions: configModule.fetchOptions
  };
}

// ─── Sync Events to Backend ─────────────────────────────────────

/**
 * Send an array of calendar events to the backend.
 * @param {Array<object>} events - Built event objects
 * @returns {Promise<{successCount: number, total: number, errorType: string|null}>}
 */
async function syncEventsToBackend(events) {
  const { javaURI, fetchOptions } = await loadApiConfig();

  let authFailed = false;

  const results = await Promise.all(
    events.map(event =>
      fetch(`${javaURI}/api/calendar/add_event`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(event)
      }).then(res => {
        if (classifyError(res) === ERROR_TYPES.AUTH_EXPIRED) {
          authFailed = true;
          return false;
        }
        return res.ok;
      }).catch(err => {
        if (err instanceof TypeError) authFailed = true;
        return false;
      })
    )
  );

  if (authFailed) {
    return { successCount: 0, total: events.length, errorType: ERROR_TYPES.AUTH_EXPIRED };
  }

  const successCount = results.filter(Boolean).length;
  return { successCount, total: events.length, errorType: null };
}

// ─── Remove Events from Backend ─────────────────────────────────

/**
 * Remove calendar events whose titles match the given patterns.
 * Strategy: fetch all user events, filter by title, then delete by ID.
 * Falls back to a bulk delete endpoint if fetch-and-delete fails.
 * @param {Array<string>} titlesToDelete - Event title strings to match
 * @returns {Promise<{deletedCount: number, errorType: string|null}>}
 */
async function removeEventsFromBackend(titlesToDelete) {
  const { javaURI, fetchOptions } = await loadApiConfig();

  // Fetch all events to find matches
  let eventsResponse;
  try {
    eventsResponse = await fetch(`${javaURI}/api/calendar/events`, fetchOptions);
  } catch (err) {
    const errType = classifyError(err);
    return { deletedCount: 0, errorType: errType };
  }

  const errType = classifyError(eventsResponse);
  if (errType === ERROR_TYPES.AUTH_EXPIRED) {
    return { deletedCount: 0, errorType: ERROR_TYPES.AUTH_EXPIRED };
  }
  if (!eventsResponse.ok) {
    return { deletedCount: 0, errorType: errType };
  }

  const allEvents = await eventsResponse.json();
  const eventsToDelete = allEvents.filter(e => titlesToDelete.includes(e.title));

  if (eventsToDelete.length === 0) {
    return { deletedCount: 0, errorType: null };
  }

  const deleteResults = await Promise.all(
    eventsToDelete.map(event =>
      fetch(`${javaURI}/api/calendar/delete/${event.id}`, {
        ...fetchOptions,
        method: 'DELETE'
      }).then(res => res.ok ? 1 : 0).catch(() => 0)
    )
  );

  const deletedCount = deleteResults.reduce((a, b) => a + b, 0);
  return { deletedCount, errorType: null };
}

/**
 * Build all possible title patterns for deletion (tries all priority levels).
 * @param {Array<object>} selectedItems - Items with type, title
 * @param {string} courseName - Course name (e.g. "CSA")
 * @returns {Array<string>} Title patterns
 */
function buildDeleteTitlePatterns(selectedItems, courseName) {
  const titles = [];
  const priorities = ['P0', 'P1', 'P2', 'P3'];

  selectedItems.forEach(item => {
    const emoji = item.type === 'formative' ? '📚' : '📝';
    priorities.forEach(p => {
      titles.push(`[${p}] ${emoji} ${item.title} - ${courseName}`);
    });
    titles.push(`${emoji} ${item.title} - ${courseName}`);
  });

  return titles;
}

/**
 * Build sync event objects from flat selected items (from the sync modal).
 * Each item carries its own priority and customDate.
 * @param {Array<object>} selectedItems - From getSelectedItems('sync')
 * @param {string} courseName - e.g. "CSA"
 * @returns {Array<object>} Events ready for syncEventsToBackend
 */
function buildSyncEvents(selectedItems, courseName) {
  const events = [];

  selectedItems.forEach(item => {
    const { weekNum, type, title, url, priority, customDate } = item;

    let eventDate = customDate;
    let emoji, typeLabel;

    if (type === 'formative') {
      if (!eventDate) eventDate = getReadingDate(weekNum);
      emoji = '📚';
      typeLabel = 'Formative';
    } else {
      if (!eventDate) eventDate = getAssessmentDate(weekNum);
      emoji = '📝';
      typeLabel = 'Summative';
    }

    if (!eventDate) return;

    const fullUrl = url ? window.location.origin + SITE_BASEURL + url : '';

    events.push({
      title: `[${priority}] ${emoji} ${title} - ${courseName}`,
      description: `${typeLabel} - Week ${weekNum}\n${fullUrl}`,
      date: eventDate,
      period: courseName,
      priority: priority
    });
  });

  return events;
}

// ─── Check for Existing Events ──────────────────────────────────

/**
 * Check if any matching events already exist on the user's calendar.
 * Currently a placeholder — the backend handles duplicates by title+date.
 * @param {string} course
 * @param {number} startWeek
 * @param {number} endWeek
 * @returns {Promise<void>}
 */
async function checkForExistingEvents(course, startWeek, endWeek) {
  const warningsContainer = document.getElementById('sync-warnings-container');
  warningsContainer.innerHTML = '<div class="checking-events"><i class="fas fa-spinner fa-spin"></i> Checking for existing events...</div>';
  warningsContainer.classList.remove('hidden');

  try {
    const { javaURI } = await loadApiConfig();
    const courseName = course.toUpperCase();

    // Build list of event titles to check
    const eventTitlesToCheck = [];
    const priorities = ['P0', 'P1', 'P2', 'P3'];

    for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
      priorities.forEach(p => {
        eventTitlesToCheck.push(`[${p}] 📚 Week ${weekNum} Formative - ${courseName}`);
        eventTitlesToCheck.push(`[${p}] 📝 Week ${weekNum} Summative - ${courseName}`);
      });
      eventTitlesToCheck.push(`📚 Week ${weekNum} Formative - ${courseName}`);
      eventTitlesToCheck.push(`📝 Week ${weekNum} Summative - ${courseName}`);
    }

    // Backend handles duplicates by matching on title and date
    warningsContainer.innerHTML = '';
    warningsContainer.classList.add('hidden');
  } catch (error) {
    console.log('Could not check for existing events:', error);
    warningsContainer.innerHTML = '';
    warningsContainer.classList.add('hidden');
  }
}
