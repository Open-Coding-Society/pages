// ============================================
// CalendarData.js
// RESPONSIBILITY: Parse and provide school calendar data + date utilities
// This module does ONE thing: manage access to school calendar dates.
// It does NOT: make API calls, update the DOM, or handle user interaction.
// ============================================

// ─── School Calendar Data ───────────────────────────────────────
let SCHOOL_CALENDAR = {};
try {
  const calendarEl = document.getElementById('school-calendar-json');
  if (calendarEl && calendarEl.textContent) {
    SCHOOL_CALENDAR = JSON.parse(calendarEl.textContent);
  }
} catch (e) {
  console.warn('Unable to parse SCHOOL_CALENDAR, falling back to empty object', e);
  SCHOOL_CALENDAR = { weeks: {} };
}

const SPRINT_DATES_STORAGE_KEY = 'sprintDates';

// ─── Week Lookup Functions ──────────────────────────────────────

/**
 * Find the next valid school week (skipping break weeks).
 * @param {number} startWeekNum - Week number to start searching from
 * @returns {number|null} Next valid week number, or null
 */
function getNextValidSchoolWeek(startWeekNum) {
  let weekNum = startWeekNum;
  const maxWeeks = 50;
  while (weekNum < maxWeeks) {
    const week = SCHOOL_CALENDAR.weeks[weekNum];
    if (!week) return null;
    if (!week.skipWeek) return weekNum;
    weekNum++;
  }
  return null;
}

/**
 * Check if a week is a school day (not a skip week).
 * @param {number} weekNum
 * @returns {boolean}
 */
function isSchoolWeek(weekNum) {
  const week = SCHOOL_CALENDAR.weeks[weekNum];
  return week && !week.skipWeek;
}

/**
 * Get calendar week data. Sprint weeks ARE calendar weeks.
 * @param {number} weekNum
 * @returns {object|null}
 */
function getCalendarWeek(weekNum) {
  return SCHOOL_CALENDAR.weeks[weekNum] || null;
}

/**
 * Check if a calendar week is a break/skip week.
 * @param {number} weekNum
 * @returns {boolean}
 */
function isSkipWeek(weekNum) {
  const week = SCHOOL_CALENDAR.weeks[weekNum];
  return week && week.skipWeek === true;
}

/**
 * Get the reading date for a week (Monday, or Tuesday if holiday).
 * @param {number} weekNum
 * @returns {string|null} Date string or null
 */
function getReadingDate(weekNum) {
  const week = SCHOOL_CALENDAR.weeks[weekNum];
  if (!week) return null;
  if (week.skipWeek) return null;
  if (week.holidayAdjustment === 'tuesday' && week.tuesday) {
    return week.tuesday;
  }
  return week.monday;
}

/**
 * Get the Friday date for assessments.
 * @param {number} weekNum
 * @returns {string|null}
 */
function getAssessmentDate(weekNum) {
  const week = SCHOOL_CALENDAR.weeks[weekNum];
  if (!week) return null;
  if (week.skipWeek) return null;
  return week.friday;
}

/**
 * Get the Tuesday of the NEXT valid school week for checkpoints.
 * @param {number} weekNum
 * @returns {string|null}
 */
function getCheckpointDate(weekNum) {
  let nextWeekNum = weekNum + 1;
  const maxWeeks = 50;
  while (nextWeekNum < maxWeeks) {
    const week = SCHOOL_CALENDAR.weeks[nextWeekNum];
    if (!week) return null;
    if (!week.skipWeek) {
      const monday = new Date(week.monday);
      monday.setDate(monday.getDate() + 1);
      return monday.toISOString().split('T')[0];
    }
    nextWeekNum++;
  }
  return null;
}

/**
 * Get the date range for a sprint based on week numbers.
 * @param {number} startWeek
 * @param {number} endWeek
 * @returns {{start: string|null, end: string|null}}
 */
function getSprintDateRange(startWeek, endWeek) {
  const startWeekData = SCHOOL_CALENDAR.weeks[startWeek];
  const endWeekData = SCHOOL_CALENDAR.weeks[endWeek];
  if (!startWeekData || !endWeekData) {
    return { start: null, end: null };
  }
  return {
    start: startWeekData.monday,
    end: endWeekData.friday
  };
}

// ─── Date Formatting (pure functions) ───────────────────────────

/**
 * Format a date string for display (e.g. "Jan 5, 2026").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date string short (e.g. "Jan 5").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
