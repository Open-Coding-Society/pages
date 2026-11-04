// Calendar events in the real class announcements (_includes/announcement_chat.html).
// The chat keeps owning messages and sending; this module adds:
//   - the calendar strip, always visible above the messages
//   - the /event slash command in the composer (any signed-in account)
//   - event cards under announcements that carry [[event:...]] markers
// Events go through the existing Spring /api/calendar endpoints (calendar-data.js).

import { attachSlashCommand } from './calendar-command.js';
import { createLiveCalendarStore, createPreviewCalendarStore } from './calendar-data.js';
import { mountWeekView, renderEventCards, revealAnnouncementForEvent } from './calendar-feed.js';
import {
  appendEventMarkers, coursePeriods, escapeHtml, extractEventMarkers, formatShortDate, parseSchoolCalendar,
} from './calendar-model.js';

// root: the .announcement-chat section; it holds [data-hook="calendar"] and [data-hook="command"].
export function attachAnnouncementCalendar({
  root, messagesEl, composer, course, schoolCalendar, calendarUrl, javaURI, fetchOptions, onSubmit,
}) {
  const { schoolYear, weeks } = parseSchoolCalendar(schoolCalendar);
  const sourceUrl = `${window.location.origin}${window.location.pathname}`;
  const messageListeners = new Set();
  let store = null;
  let strip = null;

  const slash = attachSlashCommand({
    composer,
    container: root.querySelector('[data-hook="command"]'),
    schoolYear,
    periods: coursePeriods(course),
    onSubmit,
  });

  // Called by the chat once it knows whether it is live or in local preview.
  // Live: events hit the real calendar. Every signed-in account can add events
  // with /event and remove them from the cards (no role check).
  // Preview (signed out / backend down): events stay in this browser, like the messages.
  async function start(mode) {
    strip?.unmount();
    store = mode === 'live'
      ? createLiveCalendarStore({ course, javaURI, fetchOptions, sourceUrl })
      : createPreviewCalendarStore({ course, storageKey: `ocs-chat-preview-calendar:${course}` });
    slash.setEnabled(true);
    strip = mountWeekView({
      slot: root.querySelector('[data-hook="calendar"]'),
      weeks,
      getStore: () => store,
      getPeriod: () => 'all',
      feed: {
        revealEvent: (eventId) => revealAnnouncementForEvent(messagesEl, eventId),
        onMessage(listener) { messageListeners.add(listener); return () => messageListeners.delete(listener); },
      },
    });
  }

  // Message → { html without markers, events }.
  function splitMessage(raw) {
    return extractEventMarkers(raw);
  }

  // Adds the event cards under a rendered announcement.
  function attachEvents(row, main, events) {
    if (!events.length) return;
    row.dataset.eventIds = events.map((e) => e.id).join(' ');
    // isTeacher gates the Remove button; every signed-in account gets it.
    main.appendChild(renderEventCards(events, { store: () => store, isTeacher: () => true, calendarUrl }));
    messageListeners.forEach((listener) => listener({ events }));
  }

  // Before sending: if /event is open, create the event and attach its marker.
  // Returns the html to send, or null when there is nothing to send yet
  // (empty message, or a slot that needs fixing; the error is shown in the slots).
  async function prepareMessage(html) {
    const command = slash.pending();
    if (!command) return html || null;
    if (command.error) { slash.showError(command.error); return null; }
    try {
      const event = await store.createEvent(command);
      const text = html || `📅 <b>${escapeHtml(event.title)}</b> · ${formatShortDate(event.date)}`;
      return appendEventMarkers(text, [event]);
    } catch (err) {
      console.error('Announcement calendar: could not create the event', err);
      slash.showError(`Couldn't add it to the calendar: ${err.message}`);
      return null;
    }
  }

  return {
    start, splitMessage, attachEvents, prepareMessage, reset: () => slash.reset(),
  };
}
