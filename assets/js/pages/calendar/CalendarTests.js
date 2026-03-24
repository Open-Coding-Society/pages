// ============================================
// CalendarTests.js
// Comprehensive test suite for the Calendar SRP modules
//
// Tests: CalendarData, EventBuilder, CalendarApi, CalendarUI, calendar.js orchestrator
//
// Usage: Include this file after all calendar modules in a test page,
//        or open the browser console and call runAllCalendarTests().
//
// Auth Testing: Mocks fetch() to simulate login/logout, 401/403 responses,
//               network errors, and successful API interactions.
// ============================================

(function () {
  'use strict';

  // ─── Test Harness ───────────────────────────────────────────────

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failedDetails = [];
  let currentSuite = '';

  function suite(name) {
    currentSuite = name;
    console.group(`%c▸ ${name}`, 'color: #4fc3f7; font-weight: bold');
  }

  function endSuite() {
    console.groupEnd();
  }

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  %c✓ ${testName}`, 'color: #66bb6a');
    } else {
      failedTests++;
      const detail = `[${currentSuite}] ${testName}`;
      failedDetails.push(detail);
      console.error(`  ✗ ${testName}`);
    }
  }

  function assertEqual(actual, expected, testName) {
    const pass = actual === expected;
    totalTests++;
    if (pass) {
      passedTests++;
      console.log(`  %c✓ ${testName}`, 'color: #66bb6a');
    } else {
      failedTests++;
      const detail = `[${currentSuite}] ${testName} — expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`;
      failedDetails.push(detail);
      console.error(`  ✗ ${testName} — expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`);
    }
  }

  function assertDeepEqual(actual, expected, testName) {
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    totalTests++;
    if (pass) {
      passedTests++;
      console.log(`  %c✓ ${testName}`, 'color: #66bb6a');
    } else {
      failedTests++;
      const detail = `[${currentSuite}] ${testName}`;
      failedDetails.push(detail);
      console.error(`  ✗ ${testName} — expected:`, expected, 'got:', actual);
    }
  }

  // ─── DOM Setup Helpers ──────────────────────────────────────────

  /**
   * Create a minimal DOM environment for tests that need specific elements.
   * Returns a cleanup function to remove added elements.
   */
  function setupTestDOM() {
    const container = document.createElement('div');
    container.id = 'calendar-test-container';
    container.innerHTML = `
      <!-- Sync Modal -->
      <div id="selective-sync-modal" style="display:none">
        <div id="sync-modal-sprint-name"></div>
        <div id="sync-modal-date-range"></div>
        <div id="sync-week-list"></div>
        <div id="sync-warnings-container" class="hidden"></div>
        <span id="sync-selected-count">0</span>
        <button id="close-selective-sync-modal"></button>
        <button id="cancel-selective-sync"></button>
        <button id="confirm-selective-sync"><i class="fas fa-sync"></i> Sync Selected</button>
        <button id="sync-select-all"></button>
        <button id="sync-deselect-all"></button>
        <button id="sync-select-formative"></button>
        <button id="sync-select-summative"></button>
        <button id="preview-sync-changes"></button>
        <button id="export-ics-sync"></button>
        <button id="update-ics-file"></button>
        <input type="radio" name="sync-modal-priority" value="P2" checked>
      </div>

      <!-- Remove Modal -->
      <div id="selective-remove-modal" style="display:none">
        <div id="remove-modal-sprint-name"></div>
        <div id="remove-modal-date-range"></div>
        <div id="remove-week-list"></div>
        <span id="remove-selected-count">0</span>
        <button id="close-selective-remove-modal"></button>
        <button id="cancel-selective-remove"></button>
        <button id="confirm-selective-remove"><i class="fas fa-trash-alt"></i> Remove Selected</button>
        <button id="remove-select-all"></button>
        <button id="remove-deselect-all"></button>
        <button id="remove-select-formative"></button>
        <button id="remove-select-summative"></button>
      </div>

      <!-- Preview Modal -->
      <div id="calendar-preview-modal" style="display:none">
        <div id="current-events-list"></div>
        <div id="proposed-changes-list"></div>
        <span id="add-count">0</span>
        <span id="update-count">0</span>
        <button id="close-preview-modal"></button>
        <button id="preview-back"></button>
        <button id="preview-confirm"></button>
      </div>

      <!-- Sprint card structure -->
      <div class="sprint-card" data-sprint="sprint1">
        <span class="sprint-title">Sprint 1</span>
        <div class="sprint-date-preview" data-sprint="sprint1"></div>
        <div class="sprint-date-status" data-sprint="sprint1"></div>
        <div class="sprint-date-dropdown" data-sprint="sprint1" class="hidden"></div>
        <div class="week-card" data-week="1"
             data-lessons="Intro to Java|||/csa/java-intro;;;Variables|||/csa/variables"
             data-assignments="Unit 1 Quiz|||/csa/unit1-quiz">
        </div>
        <div class="week-card" data-week="2"
             data-lessons="Loops|||/csa/loops"
             data-assignments="Loop Lab|||/csa/loop-lab;;;Unit 2 Test|||/csa/unit2-test">
        </div>
      </div>

      <!-- Buttons -->
      <button class="advanced-sync-btn" data-sprint="sprint1" data-course="csa" data-start-week="1" data-end-week="2"></button>
      <button class="advanced-remove-btn" data-sprint="sprint1" data-course="csa" data-start-week="1" data-end-week="2"></button>
      <button class="sprint-btn date-toggle" data-sprint="sprint1"></button>
      <button class="date-dropdown-close"></button>
    `;
    document.body.appendChild(container);

    return function cleanup() {
      container.remove();
    };
  }

  /**
   * Inject test school calendar data into SCHOOL_CALENDAR global.
   * Returns the original data and a restore function.
   */
  function setupTestCalendarData() {
    // Save the let-scoped SCHOOL_CALENDAR directly (not window — let vars aren't on window)
    const originalCalendar = SCHOOL_CALENDAR;
    SCHOOL_CALENDAR = {
      schoolYear: '2025-2026',
      firstDay: '2025-08-18',
      lastDay: '2026-06-05',
      weeks: {
        1: { monday: '2025-08-18', friday: '2025-08-22', tuesday: '2025-08-19', holidays: null, holidayAdjustment: null, skipWeek: false, theme: 'Welcome Week', notes: null },
        2: { monday: '2025-08-25', friday: '2025-08-29', tuesday: '2025-08-26', holidays: null, holidayAdjustment: null, skipWeek: false, theme: null, notes: null },
        3: { monday: '2025-09-01', friday: '2025-09-05', tuesday: '2025-09-02', holidays: ['Labor Day'], holidayAdjustment: 'tuesday', skipWeek: false, theme: null, notes: null },
        4: { monday: '2025-09-08', friday: '2025-09-12', tuesday: '2025-09-09', holidays: null, holidayAdjustment: null, skipWeek: false, theme: null, notes: null },
        5: { monday: '2025-09-15', friday: '2025-09-19', tuesday: '2025-09-16', holidays: ['Fall Break'], holidayAdjustment: null, skipWeek: true, theme: 'Fall Break', notes: null },
        6: { monday: '2025-09-22', friday: '2025-09-26', tuesday: '2025-09-23', holidays: null, holidayAdjustment: null, skipWeek: false, theme: null, notes: null }
      }
    };

    return function restore() {
      SCHOOL_CALENDAR = originalCalendar;
    };
  }

  // ─── Fetch Mock Framework ──────────────────────────────────────

  const originalFetch = window.fetch;
  let fetchMockHandlers = [];

  /**
   * Install a mock for window.fetch.
   * Handlers are checked in order; first match wins.
   * @param {Array<{url: string|RegExp, method?: string, response: Function|object}>} handlers
   */
  function mockFetch(handlers) {
    fetchMockHandlers = handlers;
    window.fetch = function (url, options = {}) {
      const method = (options.method || 'GET').toUpperCase();

      for (const handler of fetchMockHandlers) {
        const urlMatch = handler.url instanceof RegExp
          ? handler.url.test(url)
          : url.includes(handler.url);
        const methodMatch = !handler.method || handler.method.toUpperCase() === method;

        if (urlMatch && methodMatch) {
          if (typeof handler.response === 'function') {
            return handler.response(url, options);
          }
          // Build a Response-like object
          const status = handler.response.status || 200;
          const body = handler.response.body;
          const headers = handler.response.headers || {};
          const redirected = handler.response.redirected || false;
          const responseUrl = handler.response.url || url;

          return Promise.resolve({
            ok: status >= 200 && status < 300,
            status: status,
            redirected: redirected,
            url: responseUrl,
            headers: new Headers(headers),
            json: () => Promise.resolve(body),
            text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
            clone: function () { return this; }
          });
        }
      }

      // No handler matched — reject as network error
      return Promise.reject(new TypeError('Network request failed (no mock handler)'));
    };
  }

  /**
   * Simulate network failure (TypeError from fetch).
   */
  function mockFetchNetworkError() {
    window.fetch = function () {
      return Promise.reject(new TypeError('Failed to fetch'));
    };
  }

  /**
   * Restore original fetch.
   */
  function restoreFetch() {
    window.fetch = originalFetch;
    fetchMockHandlers = [];
  }

  // ─── Mock API Config ───────────────────────────────────────────

  /**
   * Mock loadApiConfig to return test values without needing a real dynamic import.
   */
  let originalLoadApiConfig;

  function mockLoadApiConfig(javaURI = 'http://localhost:8585') {
    originalLoadApiConfig = window.loadApiConfig;
    window.loadApiConfig = async function () {
      return {
        javaURI: javaURI,
        fetchOptions: {
          method: 'GET',
          mode: 'cors',
          cache: 'default',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Origin': 'client'
          }
        }
      };
    };
    // Also replace the function on the global scope (non-module scripts)
    if (typeof loadApiConfig !== 'undefined') {
      loadApiConfig = window.loadApiConfig;
    }
  }

  function restoreLoadApiConfig() {
    if (originalLoadApiConfig) {
      window.loadApiConfig = originalLoadApiConfig;
      if (typeof loadApiConfig !== 'undefined') {
        loadApiConfig = originalLoadApiConfig;
      }
      originalLoadApiConfig = null;
    }
  }

  // ─── Simulated Auth Credentials ────────────────────────────────

  /**
   * Mock a "logged in" user scenario.
   * Sets up fetch to respond with 200 for auth-required endpoints.
   */
  function mockLoggedInUser() {
    mockLoadApiConfig('http://localhost:8585');
    mockFetch([
      {
        url: '/api/calendar/add_event',
        method: 'POST',
        response: { status: 200, body: { id: 1, message: 'Event created' } }
      },
      {
        url: '/api/calendar/events',
        method: 'GET',
        response: {
          status: 200,
          body: [
            { id: 101, title: '[P2] 📚 Week 1 Formative - CSA', date: '2025-08-18', period: 'CSA', description: 'Test event' },
            { id: 102, title: '[P2] 📝 Week 1 Summative - CSA', date: '2025-08-22', period: 'CSA', description: 'Test event' }
          ]
        }
      },
      {
        url: /\/api\/calendar\/delete\/\d+/,
        method: 'DELETE',
        response: { status: 200, body: { message: 'Deleted' } }
      }
    ]);
  }

  /**
   * Mock a "logged out" user / expired session.
   * All API calls return 401.
   */
  function mockLoggedOutUser() {
    mockLoadApiConfig('http://localhost:8585');
    mockFetch([
      {
        url: '/api/calendar',
        response: { status: 401, body: { error: 'Unauthorized' } }
      }
    ]);
  }

  /**
   * Mock a "redirect to login" scenario (some servers redirect 401s).
   */
  function mockLoginRedirect() {
    mockLoadApiConfig('http://localhost:8585');
    mockFetch([
      {
        url: '/api/calendar',
        response: { status: 200, body: {}, redirected: true, url: 'http://localhost:8585/login' }
      }
    ]);
  }

  /**
   * Mock server error (500).
   */
  function mockServerError() {
    mockLoadApiConfig('http://localhost:8585');
    mockFetch([
      {
        url: '/api/calendar',
        response: { status: 500, body: { error: 'Internal Server Error' } }
      }
    ]);
  }

  // ─── TESTS: CalendarData ────────────────────────────────────────

  function testCalendarData() {
    suite('CalendarData');
    const restoreCalendar = setupTestCalendarData();

    try {
      // getCalendarWeek
      const week1 = getCalendarWeek(1);
      assert(week1 !== null, 'getCalendarWeek(1) returns data');
      assertEqual(week1.monday, '2025-08-18', 'getCalendarWeek(1).monday is correct');
      assertEqual(week1.friday, '2025-08-22', 'getCalendarWeek(1).friday is correct');

      const weekNull = getCalendarWeek(99);
      assertEqual(weekNull, null, 'getCalendarWeek(99) returns null for missing week');

      // isSchoolWeek
      assert(isSchoolWeek(1) === true, 'isSchoolWeek(1) is true');
      assert(isSchoolWeek(5) === false, 'isSchoolWeek(5) is false (skip week)');
      assert(!isSchoolWeek(99), 'isSchoolWeek(99) is falsy (missing week)');

      // isSkipWeek
      assert(isSkipWeek(5) === true, 'isSkipWeek(5) is true (Fall Break)');
      assert(isSkipWeek(1) === false, 'isSkipWeek(1) is false (regular week)');
      assert(!isSkipWeek(99), 'isSkipWeek(99) is falsy (missing week)');

      // getNextValidSchoolWeek
      assertEqual(getNextValidSchoolWeek(1), 1, 'getNextValidSchoolWeek(1) returns 1');
      assertEqual(getNextValidSchoolWeek(5), 6, 'getNextValidSchoolWeek(5) skips break → 6');
      assertEqual(getNextValidSchoolWeek(4), 4, 'getNextValidSchoolWeek(4) returns 4');
      assertEqual(getNextValidSchoolWeek(99), null, 'getNextValidSchoolWeek(99) returns null');

      // getReadingDate — normal week
      assertEqual(getReadingDate(1), '2025-08-18', 'getReadingDate(1) returns Monday');

      // getReadingDate — holiday-adjusted week
      assertEqual(getReadingDate(3), '2025-09-02', 'getReadingDate(3) returns Tuesday (Labor Day adjustment)');

      // getReadingDate — skip week
      assertEqual(getReadingDate(5), null, 'getReadingDate(5) returns null (skip week)');

      // getReadingDate — missing week
      assertEqual(getReadingDate(99), null, 'getReadingDate(99) returns null');

      // getAssessmentDate
      assertEqual(getAssessmentDate(1), '2025-08-22', 'getAssessmentDate(1) returns Friday');
      assertEqual(getAssessmentDate(5), null, 'getAssessmentDate(5) returns null (skip week)');
      assertEqual(getAssessmentDate(99), null, 'getAssessmentDate(99) returns null');

      // getCheckpointDate — gets Tuesday of next valid school week
      const checkpoint1 = getCheckpointDate(1);
      assert(checkpoint1 !== null, 'getCheckpointDate(1) returns a date');
      // Week 2 Monday is 2025-08-25, so Tuesday is 2025-08-26
      assertEqual(checkpoint1, '2025-08-26', 'getCheckpointDate(1) is Tuesday of week 2');

      // getCheckpointDate — skips break week
      const checkpoint4 = getCheckpointDate(4);
      // Week 5 is skip, so should jump to week 6 Tuesday (2025-09-22 + 1 = 2025-09-23)
      assertEqual(checkpoint4, '2025-09-23', 'getCheckpointDate(4) skips week 5 → Tuesday of week 6');

      // getSprintDateRange
      const range = getSprintDateRange(1, 4);
      assertEqual(range.start, '2025-08-18', 'getSprintDateRange start is week 1 Monday');
      assertEqual(range.end, '2025-09-12', 'getSprintDateRange end is week 4 Friday');

      const badRange = getSprintDateRange(1, 99);
      assertEqual(badRange.start, null, 'getSprintDateRange with invalid end returns null start');
      assertEqual(badRange.end, null, 'getSprintDateRange with invalid end returns null end');

      // formatDateDisplay
      assertEqual(formatDateDisplay('2025-08-18'), 'Aug 18, 2025', 'formatDateDisplay formats correctly');
      assertEqual(formatDateDisplay(''), '', 'formatDateDisplay handles empty string');
      assertEqual(formatDateDisplay(null), '', 'formatDateDisplay handles null');

      // formatDateShort
      assertEqual(formatDateShort('2025-08-18'), 'Aug 18', 'formatDateShort formats correctly');
      assertEqual(formatDateShort(''), '', 'formatDateShort handles empty string');

      // SPRINT_DATES_STORAGE_KEY
      assertEqual(SPRINT_DATES_STORAGE_KEY, 'sprintDates', 'SPRINT_DATES_STORAGE_KEY is correct');

    } finally {
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: EventBuilder ────────────────────────────────────────

  function testEventBuilder() {
    suite('EventBuilder');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      // parseWeekItems
      const weekCard1 = document.querySelector('.week-card[data-week="1"]');
      const items1 = parseWeekItems(weekCard1);
      assertEqual(items1.length, 3, 'parseWeekItems(week1) returns 3 items (2 lessons + 1 assignment)');

      const formative = items1.filter(i => i.type === 'formative');
      assertEqual(formative.length, 2, 'Week 1 has 2 formative items');
      assertEqual(formative[0].title, 'Intro to Java', 'First formative title is correct');
      assertEqual(formative[0].day, 'Monday', 'Formative items default to Monday');
      assertEqual(formative[1].title, 'Variables', 'Second formative title is correct');

      const summative = items1.filter(i => i.type === 'summative');
      assertEqual(summative.length, 1, 'Week 1 has 1 summative item');
      assertEqual(summative[0].title, 'Unit 1 Quiz', 'Summative title is correct');
      assertEqual(summative[0].day, 'Friday', 'Summative items default to Friday');

      // parseWeekItems — week 2
      const weekCard2 = document.querySelector('.week-card[data-week="2"]');
      const items2 = parseWeekItems(weekCard2);
      assertEqual(items2.length, 3, 'parseWeekItems(week2) returns 3 items');

      // parseWeekItems — deduplication
      const dupeCard = document.createElement('div');
      dupeCard.className = 'week-card';
      dupeCard.dataset.week = '99';
      dupeCard.dataset.lessons = 'Same|||/a;;;Same|||/b';
      dupeCard.dataset.assignments = '';
      const dupeItems = parseWeekItems(dupeCard);
      assertEqual(dupeItems.length, 1, 'parseWeekItems deduplicates same-title lessons');

      // parseWeekItems — empty
      const emptyCard = document.createElement('div');
      emptyCard.className = 'week-card';
      emptyCard.dataset.week = '50';
      emptyCard.dataset.lessons = '';
      emptyCard.dataset.assignments = '';
      const emptyItems = parseWeekItems(emptyCard);
      assertEqual(emptyItems.length, 0, 'parseWeekItems returns empty for no data');

      // buildEventsFromSelection
      const selectedItems = {
        1: {
          formative: [{ title: 'Intro to Java', url: '/csa/java-intro', id: 'w1-f-1' }],
          summative: [{ title: 'Unit 1 Quiz', url: '/csa/unit1-quiz', id: 'w1-s-1' }]
        }
      };
      const events = buildEventsFromSelection(selectedItems, 'P2', 'CSA');
      assertEqual(events.length, 2, 'buildEventsFromSelection creates 2 events (1 formative + 1 summative)');
      assert(events[0].title.includes('[P2]'), 'Formative event title includes priority');
      assert(events[0].title.includes('📚'), 'Formative event title includes book emoji');
      assert(events[0].title.includes('CSA'), 'Formative event title includes course name');
      assertEqual(events[0].date, '2025-08-18', 'Formative event uses reading date');
      assert(events[1].title.includes('📝'), 'Summative event title includes clipboard emoji');
      assertEqual(events[1].date, '2025-08-22', 'Summative event uses assessment date');

      // buildEventsFromSelection — empty
      const emptyEvents = buildEventsFromSelection({}, 'P1', 'CSA');
      assertEqual(emptyEvents.length, 0, 'buildEventsFromSelection with empty input returns no events');

      // generateICSFile
      const icsEvents = [
        { title: 'Test Event', description: 'A test', date: '2025-08-18', period: 'CSA' }
      ];
      const icsContent = generateICSFile(icsEvents);
      assert(icsContent.includes('BEGIN:VCALENDAR'), 'ICS contains VCALENDAR begin');
      assert(icsContent.includes('END:VCALENDAR'), 'ICS contains VCALENDAR end');
      assert(icsContent.includes('BEGIN:VEVENT'), 'ICS contains VEVENT');
      assert(icsContent.includes('SUMMARY:Test Event'), 'ICS contains event title');
      assert(icsContent.includes('DTSTART;VALUE=DATE:20250818'), 'ICS date formatted correctly');
      assert(icsContent.includes('CATEGORIES:CSA'), 'ICS contains category');

      // formatICSDate
      assertEqual(formatICSDate('2025-08-18'), '20250818', 'formatICSDate formats correctly');
      assertEqual(formatICSDate('2025-12-31'), '20251231', 'formatICSDate handles year end');

      // formatICSDateTime
      const testDate = new Date('2025-08-18T12:00:00Z');
      const icsDateTime = formatICSDateTime(testDate);
      assert(icsDateTime.endsWith('Z'), 'formatICSDateTime ends with Z');
      assert(icsDateTime.includes('T'), 'formatICSDateTime contains T separator');
      assert(icsDateTime.length === 16, 'formatICSDateTime is correct length (YYYYMMDDTHHMMSSZ)');

      // escapeICS
      assertEqual(escapeICS('Hello, World'), 'Hello\\, World', 'escapeICS escapes commas');
      assertEqual(escapeICS('Line1\nLine2'), 'Line1\\nLine2', 'escapeICS escapes newlines');
      assertEqual(escapeICS('Semi;colon'), 'Semi\\;colon', 'escapeICS escapes semicolons');

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Error Classification ──────────────────

  function testCalendarApiErrors() {
    suite('CalendarApi — Error Classification');

    try {
      // ERROR_TYPES frozen
      assert(Object.isFrozen(ERROR_TYPES), 'ERROR_TYPES is frozen');
      assert(Object.isFrozen(ERROR_MESSAGES), 'ERROR_MESSAGES is frozen');

      // classifyError — TypeError (network)
      assertEqual(classifyError(new TypeError('Failed to fetch')), ERROR_TYPES.NETWORK_ERROR, 'TypeError → NETWORK_ERROR');

      // classifyError — 401
      assertEqual(classifyError({ status: 401 }), ERROR_TYPES.AUTH_EXPIRED, '401 → AUTH_EXPIRED');

      // classifyError — 403
      assertEqual(classifyError({ status: 403 }), ERROR_TYPES.AUTH_EXPIRED, '403 → AUTH_EXPIRED');

      // classifyError — redirected to login
      assertEqual(
        classifyError({ status: 200, redirected: true, url: 'http://localhost:8585/login' }),
        ERROR_TYPES.AUTH_EXPIRED,
        'Redirect to /login → AUTH_EXPIRED'
      );

      // classifyError — 404
      assertEqual(classifyError({ status: 404 }), ERROR_TYPES.NOT_FOUND, '404 → NOT_FOUND');

      // classifyError — 500
      assertEqual(classifyError({ status: 500 }), ERROR_TYPES.SERVER_ERROR, '500 → SERVER_ERROR');

      // classifyError — 503
      assertEqual(classifyError({ status: 503 }), ERROR_TYPES.SERVER_ERROR, '503 → SERVER_ERROR');

      // classifyError — unknown
      assertEqual(classifyError(new Error('something')), ERROR_TYPES.UNKNOWN, 'Generic Error → UNKNOWN');
      assertEqual(classifyError({}), ERROR_TYPES.UNKNOWN, 'Empty object → UNKNOWN');

      // classifyError — 200 not redirected is not auth error
      const okResponse = { status: 200, redirected: false, url: 'http://localhost:8585/api/calendar/events' };
      assert(classifyError(okResponse) !== ERROR_TYPES.AUTH_EXPIRED, '200 non-redirect is NOT AUTH_EXPIRED');

      // getErrorMessage
      assertEqual(getErrorMessage(ERROR_TYPES.AUTH_EXPIRED), ERROR_MESSAGES.AUTH_EXPIRED, 'getErrorMessage AUTH_EXPIRED');
      assertEqual(getErrorMessage(ERROR_TYPES.NETWORK_ERROR), ERROR_MESSAGES.NETWORK_ERROR, 'getErrorMessage NETWORK_ERROR');
      assertEqual(getErrorMessage(ERROR_TYPES.SERVER_ERROR), ERROR_MESSAGES.SERVER_ERROR, 'getErrorMessage SERVER_ERROR');
      assertEqual(getErrorMessage(ERROR_TYPES.NOT_FOUND), ERROR_MESSAGES.NOT_FOUND, 'getErrorMessage NOT_FOUND');
      assertEqual(getErrorMessage(ERROR_TYPES.UNKNOWN), ERROR_MESSAGES.UNKNOWN, 'getErrorMessage UNKNOWN');
      assertEqual(getErrorMessage('INVALID'), ERROR_MESSAGES.UNKNOWN, 'getErrorMessage invalid key → UNKNOWN');

    } finally {
      // no cleanup needed
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — buildSyncEvents / buildDeleteTitlePatterns ───

  function testCalendarApiBuilders() {
    suite('CalendarApi — Event Builders');
    const restoreCalendar = setupTestCalendarData();

    try {
      // buildSyncEvents — single formative
      const items1 = [
        { weekNum: 1, type: 'formative', title: 'Intro to Java', url: '/csa/java-intro', priority: 'P1', customDate: '' }
      ];
      const events1 = buildSyncEvents(items1, 'CSA');
      assertEqual(events1.length, 1, 'buildSyncEvents creates 1 event for 1 item');
      assert(events1[0].title.includes('[P1]'), 'Event title has correct priority');
      assert(events1[0].title.includes('📚'), 'Formative event has book emoji');
      assert(events1[0].title.includes('Intro to Java'), 'Event title has item title');
      assert(events1[0].title.includes('CSA'), 'Event title has course name');
      assertEqual(events1[0].date, '2025-08-18', 'Formative event uses reading date when no custom date');

      // buildSyncEvents — custom date overrides default
      const items2 = [
        { weekNum: 1, type: 'formative', title: 'Custom', url: '', priority: 'P0', customDate: '2025-12-25' }
      ];
      const events2 = buildSyncEvents(items2, 'CSA');
      assertEqual(events2[0].date, '2025-12-25', 'Custom date overrides default reading date');

      // buildSyncEvents — summative
      const items3 = [
        { weekNum: 2, type: 'summative', title: 'Loop Lab', url: '/csa/loop-lab', priority: 'P3', customDate: '' }
      ];
      const events3 = buildSyncEvents(items3, 'CSA');
      assert(events3[0].title.includes('📝'), 'Summative event has clipboard emoji');
      assertEqual(events3[0].date, '2025-08-29', 'Summative event uses assessment date');

      // buildSyncEvents — skip week returns no events
      const items4 = [
        { weekNum: 5, type: 'formative', title: 'Ghost', url: '', priority: 'P2', customDate: '' }
      ];
      const events4 = buildSyncEvents(items4, 'CSA');
      assertEqual(events4.length, 0, 'buildSyncEvents returns no events for skip week (no date)');

      // buildDeleteTitlePatterns
      const deleteItems = [
        { type: 'formative', title: 'Intro to Java' },
        { type: 'summative', title: 'Unit Test' }
      ];
      const patterns = buildDeleteTitlePatterns(deleteItems, 'CSA');
      // 2 items × (4 priority levels + 1 no-priority) = 10 patterns
      assertEqual(patterns.length, 10, 'buildDeleteTitlePatterns generates 10 patterns for 2 items');
      assert(patterns.includes('[P0] 📚 Intro to Java - CSA'), 'Contains P0 formative pattern');
      assert(patterns.includes('[P3] 📝 Unit Test - CSA'), 'Contains P3 summative pattern');
      assert(patterns.includes('📚 Intro to Java - CSA'), 'Contains no-priority formative pattern');
      assert(patterns.includes('📝 Unit Test - CSA'), 'Contains no-priority summative pattern');

    } finally {
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Sync with Auth (Logged In) ───────────

  async function testSyncLoggedIn() {
    suite('CalendarApi — Sync (Logged In)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoggedInUser();

      const events = [
        { title: '[P2] 📚 Week 1 Formative - CSA', description: 'Test', date: '2025-08-18', period: 'CSA', priority: 'P2' },
        { title: '[P2] 📝 Week 1 Summative - CSA', description: 'Test', date: '2025-08-22', period: 'CSA', priority: 'P2' }
      ];

      const result = await syncEventsToBackend(events);
      assertEqual(result.successCount, 2, 'syncEventsToBackend returns 2 successes when logged in');
      assertEqual(result.total, 2, 'syncEventsToBackend total is 2');
      assertEqual(result.errorType, null, 'syncEventsToBackend errorType is null (no error)');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Sync with Auth (Logged Out) ──────────

  async function testSyncLoggedOut() {
    suite('CalendarApi — Sync (Logged Out / 401)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoggedOutUser();

      const events = [
        { title: '[P2] 📚 Week 1 Formative - CSA', description: 'Test', date: '2025-08-18', period: 'CSA', priority: 'P2' }
      ];

      const result = await syncEventsToBackend(events);
      assertEqual(result.successCount, 0, 'syncEventsToBackend returns 0 successes when 401');
      assertEqual(result.errorType, ERROR_TYPES.AUTH_EXPIRED, 'syncEventsToBackend returns AUTH_EXPIRED');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Sync with Network Error ──────────────

  async function testSyncNetworkError() {
    suite('CalendarApi — Sync (Network Error)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoadApiConfig();
      mockFetchNetworkError();

      const events = [
        { title: '[P2] 📚 Week 1 Formative - CSA', description: 'Test', date: '2025-08-18', period: 'CSA', priority: 'P2' }
      ];

      const result = await syncEventsToBackend(events);
      assertEqual(result.successCount, 0, 'syncEventsToBackend returns 0 on network error');
      // Network TypeError in catch block sets authFailed = true in current implementation
      assertEqual(result.errorType, ERROR_TYPES.AUTH_EXPIRED, 'syncEventsToBackend TypeError triggers authFailed in implementation');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Remove Events (Logged In) ────────────

  async function testRemoveLoggedIn() {
    suite('CalendarApi — Remove (Logged In)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoggedInUser();

      const titlesToDelete = ['[P2] 📚 Week 1 Formative - CSA', '[P2] 📝 Week 1 Summative - CSA'];
      const result = await removeEventsFromBackend(titlesToDelete);
      assertEqual(result.deletedCount, 2, 'removeEventsFromBackend deletes 2 matching events');
      assertEqual(result.errorType, null, 'removeEventsFromBackend has no error');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Remove Events (Logged Out) ───────────

  async function testRemoveLoggedOut() {
    suite('CalendarApi — Remove (Logged Out / 401)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoggedOutUser();

      const titlesToDelete = ['[P2] 📚 Week 1 Formative - CSA'];
      const result = await removeEventsFromBackend(titlesToDelete);
      assertEqual(result.deletedCount, 0, 'removeEventsFromBackend deletes 0 when 401');
      assertEqual(result.errorType, ERROR_TYPES.AUTH_EXPIRED, 'removeEventsFromBackend returns AUTH_EXPIRED');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Remove with No Matches ───────────────

  async function testRemoveNoMatches() {
    suite('CalendarApi — Remove (No Matching Events)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoggedInUser();

      const titlesToDelete = ['[P0] 📚 Nonexistent Event - CSA'];
      const result = await removeEventsFromBackend(titlesToDelete);
      assertEqual(result.deletedCount, 0, 'removeEventsFromBackend returns 0 for no matches');
      assertEqual(result.errorType, null, 'removeEventsFromBackend has no error even with no matches');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Login Redirect Detection ─────────────

  async function testLoginRedirectDetection() {
    suite('CalendarApi — Login Redirect Detection');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockLoginRedirect();

      const titlesToDelete = ['[P2] 📚 Week 1 Formative - CSA'];
      const result = await removeEventsFromBackend(titlesToDelete);
      assertEqual(result.errorType, ERROR_TYPES.AUTH_EXPIRED, 'Redirect to /login detected as AUTH_EXPIRED');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarApi — Server Error ─────────────────────────

  async function testServerError() {
    suite('CalendarApi — Server Error (500)');
    const restoreCalendar = setupTestCalendarData();

    try {
      mockServerError();

      const titlesToDelete = ['[P2] 📚 Week 1 Formative - CSA'];
      const result = await removeEventsFromBackend(titlesToDelete);
      assertEqual(result.deletedCount, 0, 'removeEventsFromBackend returns 0 on 500');
      assertEqual(result.errorType, ERROR_TYPES.SERVER_ERROR, 'removeEventsFromBackend returns SERVER_ERROR');

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
    }

    endSuite();
  }

  // ─── TESTS: CalendarUI — DOM Rendering ──────────────────────────

  function testCalendarUI() {
    suite('CalendarUI — DOM Rendering');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      // showToastNotification
      showToastNotification('Test toast', 'success');
      const toast = document.querySelector('.calendar-toast-notification');
      assert(toast !== null, 'showToastNotification creates a toast element');
      assert(toast.classList.contains('success'), 'Toast has success class');
      assert(toast.querySelector('.toast-message').textContent === 'Test toast', 'Toast shows correct message');
      toast.remove(); // cleanup

      // showToastNotification — replaces existing
      showToastNotification('First', 'info');
      showToastNotification('Second', 'warning');
      const toasts = document.querySelectorAll('.calendar-toast-notification');
      assertEqual(toasts.length, 1, 'Only one toast exists at a time');
      toasts.forEach(t => t.remove());

      // showDateStatus
      const statusEl = document.querySelector('.sprint-date-status[data-sprint="sprint1"]');
      showDateStatus(statusEl, 'Test status', 'success');
      assertEqual(statusEl.textContent, 'Test status', 'showDateStatus sets text content');
      assert(statusEl.className.includes('success'), 'showDateStatus sets success class');

      // showDateStatus — null element (should not throw)
      showDateStatus(null, 'Test', 'info');
      assert(true, 'showDateStatus with null element does not throw');

      // buildWeekSelectionHTML
      const html = buildWeekSelectionHTML('sprint1', 'csa', 1, 2, 'sync');
      assert(html.includes('Week 1'), 'buildWeekSelectionHTML contains Week 1');
      assert(html.includes('Week 2'), 'buildWeekSelectionHTML contains Week 2');
      assert(html.includes('Intro to Java'), 'buildWeekSelectionHTML contains lesson title');
      assert(html.includes('Unit 1 Quiz'), 'buildWeekSelectionHTML contains assignment title');
      assert(html.includes('item-checkbox'), 'buildWeekSelectionHTML contains checkboxes');
      assert(html.includes('item-priority-select'), 'buildWeekSelectionHTML contains priority selects');
      assert(html.includes('item-date-input'), 'buildWeekSelectionHTML contains date inputs');

      // Modal open/close
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);
      assertEqual(document.getElementById('selective-sync-modal').style.display, 'flex', 'Sync modal opens (display: flex)');
      assert(currentSyncModalData !== null, 'currentSyncModalData is set after opening');
      assertEqual(currentSyncModalData.sprintKey, 'sprint1', 'currentSyncModalData.sprintKey is correct');
      assertEqual(currentSyncModalData.course, 'csa', 'currentSyncModalData.course is correct');

      closeSelectiveSyncModal();
      assertEqual(document.getElementById('selective-sync-modal').style.display, 'none', 'Sync modal closes');
      assertEqual(currentSyncModalData, null, 'currentSyncModalData is null after closing');

      // Remove modal
      openSelectiveRemoveModal('sprint1', 'csa', 1, 2);
      assertEqual(document.getElementById('selective-remove-modal').style.display, 'flex', 'Remove modal opens');
      assert(currentRemoveModalData !== null, 'currentRemoveModalData is set');

      closeSelectiveRemoveModal();
      assertEqual(document.getElementById('selective-remove-modal').style.display, 'none', 'Remove modal closes');
      assertEqual(currentRemoveModalData, null, 'currentRemoveModalData is null after closing');

      // updateSelectedCount
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);
      const countEl = document.getElementById('sync-selected-count');
      const checkedCount = document.querySelectorAll('#sync-week-list .item-checkbox:checked').length;
      assertEqual(parseInt(countEl.textContent), checkedCount, 'updateSelectedCount reflects checked items');
      closeSelectiveSyncModal();

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: CalendarUI — Checkbox State Management ─────────────

  function testCheckboxStateManagement() {
    suite('CalendarUI — Checkbox State');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);
      const listEl = document.getElementById('sync-week-list');

      // All checkboxes start checked
      const allChecked = listEl.querySelectorAll('.item-checkbox:checked');
      const allItems = listEl.querySelectorAll('.item-checkbox');
      assertEqual(allChecked.length, allItems.length, 'All item checkboxes start checked');

      // Week select-all checkbox starts checked
      const weekCheckbox = listEl.querySelector('.week-select-all[data-week="1"]');
      assert(weekCheckbox && weekCheckbox.checked, 'Week 1 select-all starts checked');

      // Uncheck one item → week checkbox should become indeterminate
      const firstItem = listEl.querySelector('.item-checkbox[data-week="1"]');
      if (firstItem) {
        firstItem.checked = false;
        firstItem.dispatchEvent(new Event('change', { bubbles: true }));

        const weekCb = listEl.querySelector('.week-select-all[data-week="1"]');
        const totalW1 = listEl.querySelectorAll('.item-checkbox[data-week="1"]').length;
        const checkedW1 = listEl.querySelectorAll('.item-checkbox[data-week="1"]:checked').length;

        if (totalW1 > 1) {
          // If there are multiple items and we unchecked one, should be indeterminate
          assert(weekCb.indeterminate === true, 'Week checkbox becomes indeterminate when partially checked');
        }

        // Re-check
        firstItem.checked = true;
        firstItem.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Uncheck all via week checkbox
      if (weekCheckbox) {
        weekCheckbox.checked = false;
        weekCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

        const uncheckedW1 = listEl.querySelectorAll('.item-checkbox[data-week="1"]:checked');
        assertEqual(uncheckedW1.length, 0, 'Unchecking week select-all unchecks all week items');

        // Re-check all
        weekCheckbox.checked = true;
        weekCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Selected count updates
      const countEl = document.getElementById('sync-selected-count');
      const finalCount = listEl.querySelectorAll('.item-checkbox:checked').length;
      assertEqual(parseInt(countEl.textContent), finalCount, 'Selected count matches checked items after toggling');

      closeSelectiveSyncModal();

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: Orchestrator — populateSprintDatePreview ───────────

  function testPopulateSprintDatePreview() {
    suite('Orchestrator — populateSprintDatePreview');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      populateSprintDatePreview('sprint1', 1, 4);
      const previewEl = document.querySelector('.sprint-date-preview[data-sprint="sprint1"]');
      assert(previewEl.innerHTML !== '', 'populateSprintDatePreview renders content');
      assert(previewEl.innerHTML.includes('Aug 18, 2025'), 'Preview shows start date');
      assert(previewEl.innerHTML.includes('Sep 12, 2025'), 'Preview shows end date');

      // Test with break weeks
      populateSprintDatePreview('sprint1', 1, 6);
      assert(previewEl.innerHTML.includes('Fall Break'), 'Preview shows break week warning');

      // Test with holiday week
      populateSprintDatePreview('sprint1', 1, 3);
      assert(previewEl.innerHTML.includes('Labor Day'), 'Preview shows holiday warning');

      // Test with invalid weeks
      populateSprintDatePreview('sprint1', 90, 99);
      assert(previewEl.innerHTML.includes('not available'), 'Preview shows error for invalid weeks');

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: Orchestrator — executeSelectiveSync (full flow) ────

  async function testExecuteSelectiveSyncFlow() {
    suite('Orchestrator — executeSelectiveSync (Full Flow)');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      // Suppress alert and location.href changes during test
      const originalAlert = window.alert;
      const alertMessages = [];
      window.alert = (msg) => alertMessages.push(msg);

      // Open sync modal and set up selections
      mockLoggedInUser();
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);

      // Verify items are checked
      const checkedItems = document.querySelectorAll('#sync-week-list .item-checkbox:checked');
      assert(checkedItems.length > 0, 'Sync modal has checked items for sync flow');

      // Execute sync
      await executeSelectiveSync();

      // Check UI updates
      const toasts = document.querySelectorAll('.calendar-toast-notification');
      // Toast should show success or the modal should be closed
      assertEqual(document.getElementById('selective-sync-modal').style.display, 'none', 'Sync modal closes after successful sync');
      assertEqual(currentSyncModalData, null, 'currentSyncModalData cleared after sync');

      window.alert = originalAlert;

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
      cleanupDOM();
      // Remove any floating toasts
      document.querySelectorAll('.calendar-toast-notification').forEach(t => t.remove());
    }

    endSuite();
  }

  // ─── TESTS: Orchestrator — executeSelectiveSync (Auth Failure) ─

  async function testExecuteSelectiveSyncAuthFailure() {
    suite('Orchestrator — executeSelectiveSync (Auth Failure)');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    // Mock calendarNavigate to prevent actual page navigation on auth failure
    const originalNavigate = window.calendarNavigate;
    const capturedNavigations = [];
    window.calendarNavigate = calendarNavigate = function(url) { capturedNavigations.push(url); };

    try {
      const originalAlert = window.alert;
      const alertMessages = [];
      window.alert = (msg) => alertMessages.push(msg);

      // Set up with logged-in user first (for opening modal), then switch to 401
      mockLoggedInUser();
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);

      // Now swap to 401 for the actual sync
      restoreFetch();
      mockLoggedOutUser();

      await executeSelectiveSync();

      // Should show auth error alert
      assert(alertMessages.some(m => m.includes('session') || m.includes('log in')),
        'Auth failure shows session expired alert');

      window.alert = originalAlert;

    } finally {
      // Restore real calendarNavigate
      window.calendarNavigate = calendarNavigate = originalNavigate;
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
      cleanupDOM();
      document.querySelectorAll('.calendar-toast-notification').forEach(t => t.remove());
    }

    endSuite();
  }

  // ─── TESTS: Orchestrator — executeSelectiveRemove (full flow) ──

  async function testExecuteSelectiveRemoveFlow() {
    suite('Orchestrator — executeSelectiveRemove (Full Flow)');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      const originalAlert = window.alert;
      window.alert = () => {};

      mockLoggedInUser();
      openSelectiveRemoveModal('sprint1', 'csa', 1, 2);

      const checkedItems = document.querySelectorAll('#remove-week-list .item-checkbox:checked');
      assert(checkedItems.length > 0, 'Remove modal has checked items');

      await executeSelectiveRemove();

      assertEqual(document.getElementById('selective-remove-modal').style.display, 'none', 'Remove modal closes after remove');
      assertEqual(currentRemoveModalData, null, 'currentRemoveModalData cleared after remove');

      window.alert = originalAlert;

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
      cleanupDOM();
      document.querySelectorAll('.calendar-toast-notification').forEach(t => t.remove());
    }

    endSuite();
  }

  // ─── TESTS: Priority Persistence ───────────────────────────────

  function testPriorityPersistence() {
    suite('CalendarUI — Priority Persistence');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      const ITEM_PRIORITY_KEY = `item_priorities_${window.location.pathname}`;

      // Clear any existing priority data
      localStorage.removeItem(ITEM_PRIORITY_KEY);

      // Open modal → priority selects should default to P2
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);
      const selects = document.querySelectorAll('#sync-week-list .item-priority-select');
      assert(selects.length > 0, 'Priority selects exist in modal');

      // All defaults should be P2 (since no saved priorities)
      let allP2 = true;
      selects.forEach(s => { if (s.value !== 'P2') allP2 = false; });
      assert(allP2, 'Default priority is P2 when nothing saved');

      // Change a priority and save
      if (selects.length > 0 && selects[0].dataset.url) {
        selects[0].value = 'P0';
        savePriorityToStorage(selects[0]);

        // Verify saved
        const stored = JSON.parse(localStorage.getItem(ITEM_PRIORITY_KEY));
        assertEqual(stored[selects[0].dataset.url], 'P0', 'Priority P0 saved to localStorage');
      }

      closeSelectiveSyncModal();

      // Reopen modal → saved priority should be restored
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);
      const newSelects = document.querySelectorAll('#sync-week-list .item-priority-select');
      if (newSelects.length > 0 && newSelects[0].dataset.url) {
        const stored = JSON.parse(localStorage.getItem(ITEM_PRIORITY_KEY));
        if (stored[newSelects[0].dataset.url] === 'P0') {
          assertEqual(newSelects[0].value, 'P0', 'Saved priority P0 restored on modal reopen');
        }
      }

      closeSelectiveSyncModal();
      localStorage.removeItem(ITEM_PRIORITY_KEY);

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: getSelectedItems / getSelectedItemsFromModal ───────

  function testGetSelectedItems() {
    suite('EventBuilder — getSelectedItems');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      openSelectiveSyncModal('sprint1', 'csa', 1, 2);

      // getSelectedItems('sync') — all checked by default
      const syncItems = getSelectedItems('sync');
      assert(syncItems.length > 0, 'getSelectedItems returns items when checkboxes are checked');
      assert(syncItems[0].weekNum !== undefined, 'Selected items have weekNum');
      assert(syncItems[0].type !== undefined, 'Selected items have type');
      assert(syncItems[0].title !== undefined, 'Selected items have title');
      assert(syncItems[0].priority !== undefined, 'Selected items have priority');

      // getSelectedItemsFromModal — grouped structure
      const grouped = getSelectedItemsFromModal();
      assert(Object.keys(grouped).length > 0, 'getSelectedItemsFromModal returns grouped items');

      const firstWeek = Object.keys(grouped)[0];
      assert(Array.isArray(grouped[firstWeek].formative), 'Grouped items have formative array');
      assert(Array.isArray(grouped[firstWeek].summative), 'Grouped items have summative array');

      // Uncheck all → should return empty
      document.querySelectorAll('#sync-week-list .item-checkbox').forEach(cb => cb.checked = false);
      const emptySyncItems = getSelectedItems('sync');
      assertEqual(emptySyncItems.length, 0, 'getSelectedItems returns empty when nothing checked');

      const emptyGrouped = getSelectedItemsFromModal();
      assertEqual(Object.keys(emptyGrouped).length, 0, 'getSelectedItemsFromModal returns empty when nothing checked');

      closeSelectiveSyncModal();

    } finally {
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: ICS Generation Edge Cases ──────────────────────────

  function testICSEdgeCases() {
    suite('EventBuilder — ICS Edge Cases');

    try {
      // Empty events array
      const emptyICS = generateICSFile([]);
      assert(emptyICS.includes('BEGIN:VCALENDAR'), 'Empty ICS still has VCALENDAR');
      assert(emptyICS.includes('END:VCALENDAR'), 'Empty ICS still closes VCALENDAR');
      assert(!emptyICS.includes('BEGIN:VEVENT'), 'Empty ICS has no VEVENT');

      // Multiple events
      const multiEvents = [
        { title: 'Event A', description: 'Desc A', date: '2025-08-18', period: 'CSA' },
        { title: 'Event B', description: 'Desc B', date: '2025-08-19', period: 'CSP' },
        { title: 'Event C', description: 'Desc C', date: '2025-08-20', period: '' }
      ];
      const multiICS = generateICSFile(multiEvents);
      const veventCount = (multiICS.match(/BEGIN:VEVENT/g) || []).length;
      assertEqual(veventCount, 3, 'Multiple events produce multiple VEVENTs');

      // Event without period → no CATEGORIES line
      assert(multiICS.includes('SUMMARY:Event C'), 'Event C title present');

      // Special characters in title/description
      const specialEvents = [
        { title: 'Meeting, Important; Urgent', description: 'Line1\nLine2\nLine3', date: '2025-01-01', period: 'Test' }
      ];
      const specialICS = generateICSFile(specialEvents);
      assert(specialICS.includes('SUMMARY:Meeting\\, Important\\; Urgent'), 'Commas and semicolons escaped in SUMMARY');
      assert(specialICS.includes('Line1\\nLine2\\nLine3'), 'Newlines escaped in DESCRIPTION');

    } finally {
      // no cleanup
    }

    endSuite();
  }

  // ─── TESTS: initializeSprintDates (Integration) ────────────────

  async function testInitializeSprintDates() {
    suite('Orchestrator — initializeSprintDates (Integration)');
    const cleanupDOM = setupTestDOM();
    const restoreCalendar = setupTestCalendarData();

    try {
      // Mock loadApiConfig so checkForExistingEvents doesn't fail
      mockLoadApiConfig();
      mockFetch([
        { url: '/api/calendar', response: { status: 200, body: [] } }
      ]);

      await initializeSprintDates();

      // Verify sprint date preview was populated
      const previewEl = document.querySelector('.sprint-date-preview[data-sprint="sprint1"]');
      assert(previewEl.innerHTML !== '', 'initializeSprintDates populated sprint preview');

      // Verify sync button handler works
      const syncBtn = document.querySelector('.advanced-sync-btn');
      syncBtn.click();
      // Give click handler a tick to execute
      await new Promise(r => setTimeout(r, 50));
      assertEqual(document.getElementById('selective-sync-modal').style.display, 'flex', 'Sync button opens modal after initializeSprintDates');
      closeSelectiveSyncModal();

    } finally {
      restoreFetch();
      restoreLoadApiConfig();
      restoreCalendar();
      cleanupDOM();
    }

    endSuite();
  }

  // ─── TESTS: Edge Cases & Boundary Conditions ───────────────────

  function testEdgeCases() {
    suite('Edge Cases & Boundary Conditions');
    const restoreCalendar = setupTestCalendarData();

    try {
      // getCalendarWeek with string key (SCHOOL_CALENDAR keys are strings in JSON)
      // The test data uses numeric keys; verify functions handle both
      const weekByNumber = getCalendarWeek(1);
      assert(weekByNumber !== null, 'getCalendarWeek works with numeric key');

      // formatDateDisplay with unusual dates
      const leapYear = formatDateDisplay('2024-02-29');
      assert(leapYear !== '', 'formatDateDisplay handles leap year date');

      const yearEnd = formatDateDisplay('2025-12-31');
      assertEqual(yearEnd, 'Dec 31, 2025', 'formatDateDisplay handles year end');

      // formatDateShort with year boundary
      const janFirst = formatDateShort('2026-01-01');
      assertEqual(janFirst, 'Jan 1', 'formatDateShort handles Jan 1');

      // getNextValidSchoolWeek starting at skip week
      assertEqual(getNextValidSchoolWeek(5), 6, 'getNextValidSchoolWeek from skip week finds next');

      // Chain: skip week followed by another skip would need both skipped
      // (not in test data, but function handles via while loop)

      // buildEventsFromSelection with missing dates
      const noDateItems = {
        99: { formative: [{ title: 'Ghost', url: '', id: 'g1' }], summative: [] }
      };
      const noDateEvents = buildEventsFromSelection(noDateItems, 'P2', 'CSA');
      assertEqual(noDateEvents.length, 0, 'buildEventsFromSelection skips items with no date');

      // SCHOOL_CALENDAR empty
      const origCal = SCHOOL_CALENDAR;
      SCHOOL_CALENDAR = { weeks: {} };
      assertEqual(getCalendarWeek(1), null, 'getCalendarWeek returns null with empty calendar');
      assertEqual(getReadingDate(1), null, 'getReadingDate returns null with empty calendar');
      assertEqual(getAssessmentDate(1), null, 'getAssessmentDate returns null with empty calendar');
      assert(!isSchoolWeek(1), 'isSchoolWeek returns falsy with empty calendar');
      SCHOOL_CALENDAR = origCal;

    } finally {
      restoreCalendar();
    }

    endSuite();
  }

  // ─── Test Runner ────────────────────────────────────────────────

  async function runAllCalendarTests() {
    console.clear();
    console.log('%c╔════════════════════════════════════════╗', 'color: #ffb74d; font-weight: bold');
    console.log('%c║   Calendar SRP Module Test Suite       ║', 'color: #ffb74d; font-weight: bold');
    console.log('%c╚════════════════════════════════════════╝', 'color: #ffb74d; font-weight: bold');
    console.log('');

    totalTests = 0;
    passedTests = 0;
    failedTests = 0;
    failedDetails.length = 0;

    // Synchronous tests
    testCalendarData();
    testEventBuilder();
    testCalendarApiErrors();
    testCalendarApiBuilders();
    testCalendarUI();
    testCheckboxStateManagement();
    testPopulateSprintDatePreview();
    testEdgeCases();
    testGetSelectedItems();
    testICSEdgeCases();
    testPriorityPersistence();

    // Async tests (API with auth mocking)
    await testSyncLoggedIn();
    await testSyncLoggedOut();
    await testSyncNetworkError();
    await testRemoveLoggedIn();
    await testRemoveLoggedOut();
    await testRemoveNoMatches();
    await testLoginRedirectDetection();
    await testServerError();
    await testExecuteSelectiveSyncFlow();
    await testExecuteSelectiveSyncAuthFailure();
    await testExecuteSelectiveRemoveFlow();
    await testInitializeSprintDates();

    // Summary
    console.log('');
    console.log('%c══════════════════════════════════════════', 'color: #ffb74d');
    console.log(`%c  RESULTS: ${passedTests}/${totalTests} passed, ${failedTests} failed`, 
      failedTests === 0 ? 'color: #66bb6a; font-weight: bold; font-size: 14px' : 'color: #ef5350; font-weight: bold; font-size: 14px');
    console.log('%c══════════════════════════════════════════', 'color: #ffb74d');

    if (failedDetails.length > 0) {
      console.log('');
      console.log('%cFailed tests:', 'color: #ef5350; font-weight: bold');
      failedDetails.forEach(d => console.error(`  • ${d}`));
    }

    return { total: totalTests, passed: passedTests, failed: failedTests, failures: failedDetails };
  }

  // Expose test runner globally
  window.runAllCalendarTests = runAllCalendarTests;

  // Auto-run if loaded with ?test=calendar query param
  if (window.location.search.includes('test=calendar')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(runAllCalendarTests, 500));
    } else {
      setTimeout(runAllCalendarTests, 500);
    }
  }

  console.log('%c[CalendarTests] Test suite loaded. Run: runAllCalendarTests()', 'color: #90caf9');

})();
