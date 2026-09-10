// ============================================
// EventBuilder.js
// RESPONSIBILITY: Build calendar event objects from user selections
// This module does ONE thing: construct event data structures.
// It does NOT: make API calls, manage modals, or update the DOM.
// ============================================

// ─── Parse Week Items from DOM ──────────────────────────────────

/**
 * Parse week items (formative/summative) from a week card's data attributes.
 * @param {HTMLElement} weekCard - DOM element with data-week, data-lessons, data-assignments
 * @returns {Array<object>} Array of item objects
 */
function parseWeekItems(weekCard) {
  const weekNum = parseInt(weekCard.dataset.week);
  const lessons = weekCard.dataset.lessons || '';
  const assignments = weekCard.dataset.assignments || '';
  const items = [];

  // Parse lessons (formative)
  if (lessons) {
    const lessonList = lessons.split(';;;').filter(l => l.trim());
    const seenTitles = new Set();
    lessonList.forEach(l => {
      const [title, url] = l.split('|||');
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        items.push({
          id: `w${weekNum}-formative-${title.replace(/\s+/g, '-').toLowerCase()}`,
          title: title,
          url: url,
          type: 'formative',
          weekNum: weekNum,
          day: 'Monday'
        });
      }
    });
  }

  // Parse assignments (summative)
  if (assignments) {
    const assignmentList = assignments.split(';;;').filter(a => a.trim());
    const seenTitles = new Set();
    assignmentList.forEach(a => {
      const [title, url] = a.split('|||');
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        items.push({
          id: `w${weekNum}-summative-${title.replace(/\s+/g, '-').toLowerCase()}`,
          title: title,
          url: url,
          type: 'summative',
          weekNum: weekNum,
          day: 'Friday'
        });
      }
    });
  }

  return items;
}

// ─── Build Events from Selection ────────────────────────────────

/**
 * Build calendar event objects from grouped selected items.
 * Used by preview and iCal export.
 * @param {object} selectedItems - { weekNum: { formative: [...], summative: [...] } }
 * @param {string} priority - Priority level (P0-P3)
 * @param {string} courseName - Course name (e.g. "CSA")
 * @returns {Array<object>} Array of event objects
 */
function buildEventsFromSelection(selectedItems, priority, courseName) {
  const events = [];

  Object.keys(selectedItems).forEach(weekNum => {
    const weekData = selectedItems[weekNum];
    const readingDate = getReadingDate(parseInt(weekNum));
    const assessmentDate = getAssessmentDate(parseInt(weekNum));

    // Build formative event
    if (weekData.formative && weekData.formative.length > 0 && readingDate) {
      const lessonItems = weekData.formative.map(item => {
        const fullUrl = item.url ? window.location.origin + SITE_BASEURL + item.url : '';
        return `• ${item.title}${fullUrl ? '\n  ' + fullUrl : ''}`;
      }).join('\n\n');

      events.push({
        title: `[${priority}] 📚 Week ${weekNum} Formative - ${courseName}`,
        description: `Reading Materials:\n\n${lessonItems}`,
        date: readingDate,
        period: courseName,
        priority: priority,
        weekNum: parseInt(weekNum),
        type: 'formative'
      });
    }

    // Build summative event
    if (weekData.summative && weekData.summative.length > 0 && assessmentDate) {
      const assignmentItems = weekData.summative.map(item => {
        const fullUrl = item.url ? window.location.origin + SITE_BASEURL + item.url : '';
        return `• ${item.title}${fullUrl ? '\n  ' + fullUrl : ''}`;
      }).join('\n\n');

      events.push({
        title: `[${priority}] 📝 Week ${weekNum} Summative - ${courseName}`,
        description: `Assessments Due:\n\n${assignmentItems}`,
        date: assessmentDate,
        period: courseName,
        priority: priority,
        weekNum: parseInt(weekNum),
        type: 'summative'
      });
    }
  });

  return events;
}

// ─── Get Selected Items from Modal Checkboxes ───────────────────

/**
 * Get flat list of selected items from sync or remove modal.
 * @param {string} modalType - 'sync' or 'remove'
 * @returns {Array<object>} Selected items with weekNum, type, title, url, priority, customDate
 */
function getSelectedItems(modalType) {
  const listId = modalType === 'sync' ? 'sync-week-list' : 'remove-week-list';
  const listEl = document.getElementById(listId);
  const selectedItems = [];

  listEl.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
    const weekNum = parseInt(checkbox.dataset.week);
    const type = checkbox.dataset.type;
    const title = checkbox.dataset.title;
    const url = checkbox.dataset.url;
    const itemId = checkbox.dataset.id;
    const defaultDate = checkbox.dataset.defaultDate;

    const prioritySelect = listEl.querySelector(`.item-priority-select[data-id="${itemId}"]`);
    const priority = prioritySelect?.value || 'P2';

    const dateInput = listEl.querySelector(`.item-date-input[data-id="${itemId}"]`);
    const customDate = dateInput?.value || defaultDate;

    selectedItems.push({ weekNum, type, title, url, priority, customDate });
  });

  return selectedItems;
}

/**
 * Get grouped selected items from sync modal (for preview/iCal).
 * @returns {object} { weekNum: { formative: [...], summative: [...] } }
 */
function getSelectedItemsFromModal() {
  const selectedItems = {};
  const listEl = document.getElementById('sync-week-list');

  listEl.querySelectorAll('.sync-week-group').forEach(weekGroup => {
    const weekNum = weekGroup.dataset.week;
    const checkboxes = weekGroup.querySelectorAll('.item-checkbox:checked');

    if (checkboxes.length > 0) {
      selectedItems[weekNum] = { formative: [], summative: [] };
      checkboxes.forEach(cb => {
        const itemData = {
          title: cb.dataset.title,
          url: cb.dataset.url || '',
          id: cb.dataset.id
        };
        if (cb.dataset.type === 'formative') {
          selectedItems[weekNum].formative.push(itemData);
        } else {
          selectedItems[weekNum].summative.push(itemData);
        }
      });
    }
  });

  return selectedItems;
}

// ─── iCal Export (pure functions) ───────────────────────────────

/**
 * Generate ICS file content from an array of events.
 * @param {Array<object>} events
 * @returns {string} ICS file content
 */
function generateICSFile(events) {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//School Calendar//Sprint Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Sprint Events'
  ];

  events.forEach(event => {
    const uid = `${event.date}-${event.title.replace(/\s+/g, '-')}@school.edu`;
    const dtstamp = formatICSDateTime(new Date());
    const dtstart = formatICSDate(event.date);

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${dtstamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${dtstart}`);
    icsLines.push(`SUMMARY:${escapeICS(event.title)}`);
    icsLines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    if (event.period) {
      icsLines.push(`CATEGORIES:${escapeICS(event.period)}`);
    }
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

/**
 * Format date string to ICS DATE format (YYYYMMDD).
 * @param {string} dateStr
 * @returns {string}
 */
function formatICSDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Format Date object to ICS DATETIME format (YYYYMMDDTHHMMSSZ).
 * @param {Date} date
 * @returns {string}
 */
function formatICSDateTime(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

/**
 * Escape text for ICS format.
 * @param {string} text
 * @returns {string}
 */
function escapeICS(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Download ICS content as a file.
 * @param {string} icsContent
 * @param {string} filename
 */
function downloadICSFile(icsContent, filename) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
