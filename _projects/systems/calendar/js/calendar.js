// ============================================
// calendar.js  — ORCHESTRATOR
// RESPONSIBILITY: Wire together the SRP worker modules.
// This file does ONE thing: coordinate calls between
//   CalendarData, EventBuilder, CalendarApi, and CalendarUI.
// It does NOT contain business-logic helpers — those live in the workers.
//
// Load order (set in calendar.html):
//   1. CalendarData.js   — school calendar data + date utilities
//   2. EventBuilder.js   — event object construction + iCal
//   3. CalendarApi.js     — backend communication + error types
//   4. CalendarUI.js      — DOM rendering + modals
//   5. calendar.js        — this orchestrator
// ============================================

// ─── Navigation helper (mockable in tests) ─────────────────────

/**
 * Navigate to a URL. Extracted so tests can override without touching window.location.
 * @param {string} url
 */
function calendarNavigate(url) {
  window.location.href = url;
}

// ─── Populate Sprint Date Preview ───────────────────────────────

/**
 * Render date range and holiday warnings into a sprint preview element.
 * Orchestrates CalendarData helpers for date info, then writes the DOM.
 * @param {string} sprintKey
 * @param {number} startWeek
 * @param {number} endWeek
 */
function populateSprintDatePreview(sprintKey, startWeek, endWeek) {
  const previewEl = document.querySelector(`.sprint-date-preview[data-sprint="${sprintKey}"]`);
  if (!previewEl) return;

  const dateRange = getSprintDateRange(startWeek, endWeek);

  let html = '';
  if (dateRange.start && dateRange.end) {
    html = `
      <div class="date-range-display">
        <span class="date-label">Start:</span> 
        <span class="date-value">${formatDateDisplay(dateRange.start)}</span>
      </div>
      <div class="date-range-display">
        <span class="date-label">End:</span> 
        <span class="date-value">${formatDateDisplay(dateRange.end)}</span>
      </div>
    `;

    // Show break weeks
    const breakWeeks = [];
    for (let w = startWeek; w <= endWeek; w++) {
      const week = SCHOOL_CALENDAR.weeks[w];
      if (week && week.skipWeek && week.holidays) {
        breakWeeks.push({ week: w, holidays: week.holidays });
      }
    }
    if (breakWeeks.length > 0) {
      html += '<div class="holiday-warnings">';
      breakWeeks.forEach(b => {
        html += `<div class="holiday-notice break"><i class="fas fa-umbrella-beach"></i> Week ${b.week}: ${b.holidays.join(', ')} (no school)</div>`;
      });
      html += '</div>';
    }

    // Show holiday warnings (non-skip weeks with holidays)
    const holidays = [];
    for (let w = startWeek; w <= endWeek; w++) {
      const week = SCHOOL_CALENDAR.weeks[w];
      if (week && week.holidays && !week.skipWeek) {
        holidays.push({ week: w, holidays: week.holidays });
      }
    }
    if (holidays.length > 0) {
      html += '<div class="holiday-warnings">';
      holidays.forEach(h => {
        html += `<div class="holiday-notice"><i class="fas fa-exclamation-triangle"></i> Week ${h.week}: ${h.holidays.join(', ')} - Materials on Tuesday</div>`;
      });
      html += '</div>';
    }
  } else {
    html = '<div class="date-error">Calendar dates not available for these weeks</div>';
  }

  previewEl.innerHTML = html;
}

// ─── Execute Selective Sync (Orchestrator) ──────────────────────

/**
 * Orchestrator: gather UI selections → build events → call API → report results.
 */
async function executeSelectiveSync() {
  if (!currentSyncModalData) return;

  const { sprintKey, course } = currentSyncModalData;
  const selectedItems = getSelectedItems('sync');
  const courseName = course.toUpperCase();

  const confirmBtn = document.getElementById('confirm-selective-sync');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';

  try {
    // Worker: build events from UI selections
    const events = buildSyncEvents(selectedItems, courseName);

    if (events.length === 0) {
      alert('No items selected to sync.');
      return;
    }

    console.log(`Syncing ${events.length} individual events to calendar`);

    // Worker: send to backend
    const { successCount, total, errorType } = await syncEventsToBackend(events);

    // Handle auth failure
    if (errorType === ERROR_TYPES.AUTH_EXPIRED) {
      alert(getErrorMessage(ERROR_TYPES.AUTH_EXPIRED));
      calendarNavigate(SITE_BASEURL + '/login');
      return;
    }

    // Worker: update UI
    closeSelectiveSyncModal();

    if (successCount === total) {
      showToastNotification(`✓ Synced ${successCount} events to calendar!`, 'success');
    } else if (successCount > 0) {
      showToastNotification(`⚠ Synced ${successCount}/${total} events`, 'warning');
    } else {
      showToastNotification('✗ Failed to sync events. Are you logged in?', 'error');
    }

    const statusEl = document.querySelector(`.sprint-date-status[data-sprint="${sprintKey}"]`);
    if (successCount === total) {
      showDateStatus(statusEl, `✓ Synced ${successCount} events to calendar!`, 'success');
    } else if (successCount > 0) {
      showDateStatus(statusEl, `⚠ Synced ${successCount}/${total} events`, 'warning');
    } else {
      showDateStatus(statusEl, '✗ Failed to sync events. Are you logged in?', 'error');
    }
  } catch (error) {
    console.error('Error syncing:', error);
    const errType = classifyError(error);
    if (errType === ERROR_TYPES.NETWORK_ERROR) {
      alert(getErrorMessage(ERROR_TYPES.NETWORK_ERROR));
    } else {
      alert('Error syncing to calendar. Please try again.');
    }
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = '<i class="fas fa-sync"></i> Sync Selected';
  }
}

// ─── Execute Selective Remove (Orchestrator) ────────────────────

/**
 * Orchestrator: gather UI selections → build title patterns → call API → report results.
 */
async function executeSelectiveRemove() {
  if (!currentRemoveModalData) return;

  const { sprintKey, course } = currentRemoveModalData;
  const selectedItems = getSelectedItems('remove');
  const courseName = course.toUpperCase();

  const confirmBtn = document.getElementById('confirm-selective-remove');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Removing...';

  try {
    // Worker: build title patterns to match
    const titlesToDelete = buildDeleteTitlePatterns(selectedItems, courseName);

    if (titlesToDelete.length === 0) {
      alert('No items selected to remove.');
      return;
    }

    console.log(`Removing events matching ${titlesToDelete.length} title patterns from calendar`);

    // Worker: call API
    const { deletedCount, errorType } = await removeEventsFromBackend(titlesToDelete);

    // Handle auth failure
    if (errorType === ERROR_TYPES.AUTH_EXPIRED) {
      alert(getErrorMessage(ERROR_TYPES.AUTH_EXPIRED));
      calendarNavigate(SITE_BASEURL + '/login');
      return;
    }

    // Worker: update UI
    closeSelectiveRemoveModal();

    if (deletedCount > 0) {
      showToastNotification(`✓ Removed ${deletedCount} events from calendar!`, 'success');
    } else {
      showToastNotification('⚠ No events found to remove', 'warning');
    }

    const statusEl = document.querySelector(`.sprint-date-status[data-sprint="${sprintKey}"]`);
    if (deletedCount > 0) {
      showDateStatus(statusEl, `✓ Removed ${deletedCount} events from calendar!`, 'success');
    } else {
      showDateStatus(statusEl, '⚠ No events found to remove', 'warning');
    }
  } catch (error) {
    console.error('Error removing:', error);
    const errType = classifyError(error);
    if (errType === ERROR_TYPES.NETWORK_ERROR) {
      alert(getErrorMessage(ERROR_TYPES.NETWORK_ERROR));
    } else {
      alert('Error removing from calendar. Please try again.');
    }
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Remove Selected';
  }
}

// ─── Main Entry Point ───────────────────────────────────────────

/**
 * Top-level orchestrator: initialize all sprint calendar controls.
 * Called from sprint.html via DOMContentLoaded.
 * MUST remain a global function.
 */
async function initializeSprintDates() {
  // 1. Populate all sprint date previews
  document.querySelectorAll('.advanced-sync-btn').forEach(btn => {
    const sprintKey = btn.dataset.sprint;
    const startWeek = parseInt(btn.dataset.startWeek);
    const endWeek = parseInt(btn.dataset.endWeek);
    populateSprintDatePreview(sprintKey, startWeek, endWeek);
  });

  // 2. Toggle dropdown visibility
  document.querySelectorAll('.sprint-btn.date-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sprintKey = btn.dataset.sprint;
      const dropdown = document.querySelector(`.sprint-date-dropdown[data-sprint="${sprintKey}"]`);

      document.querySelectorAll('.sprint-date-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.add('hidden');
      });

      dropdown.classList.toggle('hidden');
    });
  });

  // 3. Close dropdown buttons
  document.querySelectorAll('.date-dropdown-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.closest('.sprint-date-dropdown').classList.add('hidden');
    });
  });

  // 4. Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sprint-date-control')) {
      document.querySelectorAll('.sprint-date-dropdown').forEach(d => {
        d.classList.add('hidden');
      });
    }
  });

  // 5. Sync button handlers → open selective sync modal
  document.querySelectorAll('.advanced-sync-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const sprintKey = btn.dataset.sprint;
      const course = btn.dataset.course;
      const startWeek = parseInt(btn.dataset.startWeek);
      const endWeek = parseInt(btn.dataset.endWeek);
      openSelectiveSyncModal(sprintKey, course, startWeek, endWeek);
    });
  });

  // 6. Remove button handlers → open selective remove modal
  document.querySelectorAll('.advanced-remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const sprintKey = btn.dataset.sprint;
      const course = btn.dataset.course;
      const startWeek = parseInt(btn.dataset.startWeek);
      const endWeek = parseInt(btn.dataset.endWeek);
      openSelectiveRemoveModal(sprintKey, course, startWeek, endWeek);
    });
  });

  // 7. Initialize all modal handlers (UI)
  initializeSelectiveSyncModals();
}
