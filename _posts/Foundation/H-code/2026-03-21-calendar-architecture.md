---
toc: true
layout: post
title: Calendar System Architecture (SRP)
description: Documentation for the calendar sync system's Single Responsibility Principle (SRP) module architecture — module dependency graph, function inventory, data flows, error handling, and how to extend the system.
type: coding
comments: true
permalink: /calendar/architecture
author: Arnav Nadar
---

## Overview

The calendar system manages school sprint schedules — syncing formative/summative events to a backend calendar, exporting to iCal, and providing an interactive modal UI for selecting, previewing, and managing events.

The system follows **Single Responsibility Principle (SRP)**: the original monolithic `calendar.js` (~1500 lines) was decomposed into **5 focused modules**, each with a clearly-defined responsibility.

> **Run the test suite:** Open the [Calendar Test Runner](/{{site.baseurl}}/calendar/tests) to verify all modules in the browser.

## Module Dependency Graph

```
    ┌─────────────────────────────────────────────────────┐
    │                    calendar.js                       │
    │               (ORCHESTRATOR)                         │
    │   Wires modules together, handles user flows         │
    └──────┬──────────┬──────────┬──────────┬─────────────┘
           │          │          │          │
           ▼          ▼          ▼          ▼
    CalendarData  EventBuilder  CalendarApi  CalendarUI
    (dates/data)  (events/ics)  (API/http)   (DOM/modals)
```

All modules share the **global scope** (loaded via `<script>` tags, not ES modules). The orchestrator calls worker functions; workers call each other only for pure data lookups.

## Load Order

Defined in `_includes/calendar.html`:

| # | File | Purpose |
|---|------|---------|
| 1 | `SITE_BASEURL` (inline) | Sets the Jekyll baseurl global |
| 2 | `CalendarData.js` | Parses school calendar JSON, provides date utilities |
| 3 | `EventBuilder.js` | Builds event objects, generates iCal files |
| 4 | `CalendarApi.js` | Sends/receives data to/from backend |
| 5 | `CalendarUI.js` | Renders modals, manages checkboxes, DOM events |
| 6 | `calendar.js` | Orchestrator — coordinates all of the above |

Order matters: each module may call functions from modules loaded before it.

## Module Details

### 1. CalendarData.js (~160 lines)

**Responsibility:** Parse and provide school calendar data + date utilities.

| Function | Description |
|----------|-------------|
| `SCHOOL_CALENDAR` | Global — parsed from `<script id="school-calendar-json">` DOM element |
| `SPRINT_DATES_STORAGE_KEY` | Constant — localStorage key for sprint date caching |
| `getNextValidSchoolWeek(startWeekNum)` | Find next non-skip week from a starting week |
| `isSchoolWeek(weekNum)` | Check if a week is not a skip week |
| `getCalendarWeek(weekNum)` | Get raw week data object |
| `isSkipWeek(weekNum)` | Check if a week is a break/skip week |
| `getReadingDate(weekNum)` | Get Monday date (or Tuesday if holiday-adjusted) |
| `getAssessmentDate(weekNum)` | Get Friday date for assessments |
| `getCheckpointDate(weekNum)` | Get Tuesday of the next valid school week |
| `getSprintDateRange(startWeek, endWeek)` | Get `{start, end}` date range for a sprint |
| `formatDateDisplay(dateStr)` | Format as "Jan 5, 2026" |
| `formatDateShort(dateStr)` | Format as "Jan 5" |

**Dependencies:** None (reads from DOM on load for `SCHOOL_CALENDAR`).

### 2. EventBuilder.js (~230 lines)

**Responsibility:** Build calendar event objects from user selections + iCal export.

| Function | Description |
|----------|-------------|
| `parseWeekItems(weekCard)` | Parse formative/summative items from a week card's data attributes |
| `buildEventsFromSelection(selectedItems, priority, courseName)` | Build event objects from grouped selections |
| `getSelectedItems(modalType)` | Get flat list of checked items from sync/remove modal |
| `getSelectedItemsFromModal()` | Get grouped items from sync modal (for preview/iCal) |
| `generateICSFile(events)` | Generate full ICS file content |
| `formatICSDate(dateStr)` | Format to `YYYYMMDD` |
| `formatICSDateTime(date)` | Format to `YYYYMMDDTHHMMSSZ` |
| `escapeICS(str)` | Escape special characters for ICS format |
| `downloadICSFile(content, filename)` | Trigger browser download of an ICS file |

**Dependencies:** `CalendarData` (calls `getReadingDate`, `getAssessmentDate`), `SITE_BASEURL` global.

### 3. CalendarApi.js (~250 lines)

**Responsibility:** All backend API communication + error classification.

| Function | Description |
|----------|-------------|
| `ERROR_TYPES` | Frozen enum: `AUTH_EXPIRED`, `NETWORK_ERROR`, `SERVER_ERROR`, `NOT_FOUND`, `UNKNOWN` |
| `ERROR_MESSAGES` | Frozen map of user-friendly messages keyed by `ERROR_TYPES` |
| `classifyError(errorOrResponse)` | Classify a fetch error or HTTP response into an ERROR_TYPE |
| `getErrorMessage(errorType)` | Get display message for an error type |
| `loadApiConfig()` | Dynamic import of `config.js` → returns `{javaURI, fetchOptions}` |
| `syncEventsToBackend(events)` | POST each event to `/api/calendar/add_event` |
| `removeEventsFromBackend(titlesToDelete)` | Fetch all events, filter by title, DELETE matches |
| `buildDeleteTitlePatterns(selectedItems, courseName)` | Build all possible title strings for deletion |
| `buildSyncEvents(selectedItems, courseName)` | Build event objects from flat selected items |
| `checkForExistingEvents(course, startWeek, endWeek)` | Check for duplicate events on the backend |

**Backend endpoints:**
- `POST /api/calendar/add_event` — add a calendar event
- `GET /api/calendar/events` — list all user events
- `DELETE /api/calendar/delete/{id}` — delete event by ID

### 4. CalendarUI.js (~730 lines)

**Responsibility:** All DOM rendering, modal management, and user interaction.

| Function | Description |
|----------|-------------|
| `currentSyncModalData` / `currentRemoveModalData` | Module state for open modals |
| `showDateStatus(el, message, type)` | Show status message in sprint status element |
| `showToastNotification(message, type)` | Show floating toast notification |
| `buildWeekSelectionHTML(...)` | Build HTML for week selection list in modals |
| `openSelectiveSyncModal(...)` / `closeSelectiveSyncModal()` | Open/close sync modal |
| `openSelectiveRemoveModal(...)` / `closeSelectiveRemoveModal()` | Open/close remove modal |
| `initializeSyncModalCheckboxes(modalType)` | Set up checkbox event handlers |
| `updateCategoryCheckboxState(...)` / `updateWeekCheckboxState(...)` | Tri-state checkbox management |
| `updateSelectedCount(modalType)` | Update the "X items selected" counter |
| `showCalendarPreview()` / `populateCalendarPreview(...)` | Preview modal with current vs proposed |
| `closePreviewModal()` | Close preview modal |
| `initializeSelectiveSyncModals()` | Bind all static event listeners for modals |
| `savePriorityToStorage(selectEl)` | Save priority selection to localStorage |

**Dependencies:** All three worker modules (`CalendarData`, `EventBuilder`, `CalendarApi`).

### 5. calendar.js (~292 lines) — ORCHESTRATOR

**Responsibility:** Wire together worker modules. Coordinates user flows.

| Function | Description |
|----------|-------------|
| `populateSprintDatePreview(sprintKey, startWeek, endWeek)` | Render date range + holiday warnings |
| `executeSelectiveSync()` | Full sync flow: gather selections → build events → API → report |
| `executeSelectiveRemove()` | Full remove flow: gather selections → build patterns → API → report |
| `initializeSprintDates()` | **Main entry point** — bind all sprint control handlers |

⚠️ `initializeSprintDates()` **MUST remain a global function** — it is called from `_layouts/sprint.html`.

## Data Flows

### Sync Flow

```
User clicks "Sync" button
  → initializeSprintDates handler
    → openSelectiveSyncModal()                    [CalendarUI]
  → User checks/unchecks items, sets priorities
  → User clicks "Sync Selected"
    → executeSelectiveSync()                      [calendar.js]
      → getSelectedItems('sync')                  [EventBuilder]
      → buildSyncEvents(items, course)            [CalendarApi]
      → syncEventsToBackend(events)               [CalendarApi]
      → showToastNotification() / showDateStatus() [CalendarUI]
```

### Remove Flow

```
User clicks "Remove" button
  → openSelectiveRemoveModal()                    [CalendarUI]
  → User selects items
    → executeSelectiveRemove()                    [calendar.js]
      → getSelectedItems('remove')                [EventBuilder]
      → buildDeleteTitlePatterns(items, course)   [CalendarApi]
      → removeEventsFromBackend(titles)           [CalendarApi]
      → showToastNotification() / showDateStatus() [CalendarUI]
```

### iCal Export Flow

```
User clicks "Export" in sync modal
  → getSelectedItemsFromModal()                   [EventBuilder]
  → buildEventsFromSelection(items, priority, course) [EventBuilder]
  → generateICSFile(events)                       [EventBuilder]
  → downloadICSFile(content, filename)            [EventBuilder]
```

## Error Handling

The system uses a **typed error classification pattern**:

```javascript
const ERROR_TYPES = Object.freeze({
  AUTH_EXPIRED:   'AUTH_EXPIRED',    // 401/403 or redirect to /login
  NETWORK_ERROR:  'NETWORK_ERROR',  // TypeError from fetch (offline/DNS)
  SERVER_ERROR:   'SERVER_ERROR',   // 5xx responses
  NOT_FOUND:      'NOT_FOUND',      // 404
  UNKNOWN:        'UNKNOWN'         // everything else
});
```

- `classifyError()` inspects `TypeError` (network) or Response status codes
- `getErrorMessage()` maps types to user-friendly strings
- Auth failures redirect to login page; network errors show connection messaging
- `TypeError` from `fetch()` is **never** treated as an auth error (fixes the "session expired" false positive)

## Key Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Frozen enums** | `ERROR_TYPES`, `ERROR_MESSAGES` | Prevents accidental mutation of constants |
| **Orchestrator vs Workers** | `calendar.js` vs the other 4 files | Zero business logic in the coordinator |
| **Priority persistence** | `savePriorityToStorage()` | Item priorities saved to `localStorage` and restored on modal open |
| **Holiday awareness** | `getReadingDate()` | Shifts to Tuesday when `holidayAdjustment === 'tuesday'` |
| **Deduplication** | `parseWeekItems()` | Uses `Set` to avoid duplicate lesson/assignment entries |
| **Graceful degradation** | `populateCalendarPreview()` | Preview modal works even when API is unavailable |

## File Locations

```
assets/js/pages/calendar/
├── CalendarData.js        # School calendar data + date utilities
├── EventBuilder.js        # Event construction + iCal export
├── CalendarApi.js         # Backend API + error types
├── CalendarUI.js          # DOM rendering + modals
├── calendar.js            # Orchestrator
└── CalendarTests.js       # Comprehensive test suite

_includes/calendar.html     # Modal HTML + school calendar JSON + script tags
_layouts/sprint.html        # Sprint layout (includes calendar.html, calls initializeSprintDates)
_data/school_calendar.yml   # Source data for school calendar weeks
assets/js/api/config.js     # API configuration (javaURI, fetchOptions)
```

## How to Extend

1. **New date utility?** Add to `CalendarData.js` — keep it pure (no DOM, no API).
2. **New event type?** Add to `EventBuilder.js` — extend `buildEventsFromSelection()`.
3. **New API endpoint?** Add to `CalendarApi.js` — follow the `syncEventsToBackend` pattern.
4. **New modal/UI element?** Add to `CalendarUI.js` — bind events in `initializeSelectiveSyncModals()`.
5. **New user flow?** Add to `calendar.js` — orchestrate existing worker functions.
