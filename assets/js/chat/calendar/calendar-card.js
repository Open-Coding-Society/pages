// Calendar smart card: the class calendar as an ocs__ card that any page can
// add with {% include ocs_calendar_card.html %}. Every [data-ocs-calendar]
// element on the page sets itself up:
//   - signed in:  the course's events from the existing Spring /api/calendar endpoints
//   - signed out: the school week (holidays included) and a sign-in note
//   - data-sample: sample events for prototypes and demos, nothing leaves the browser
// Clicking an event opens its details inside the card. The week shows one row
// per day when the card is narrow (a sidebar), so it fits wherever it's added.
// Everything is an existing OCS element; the card has no CSS of its own.

import { fetchOptions, javaURI } from '../../api/config.js';
import { buildPreviewSeed, createLiveCalendarStore, createPreviewCalendarStore, fetchLiveIdentity } from './calendar-data.js';
import { mountWeekView, renderEventCards } from './calendar-feed.js';
import { coursePeriods, parseSchoolCalendar } from './calendar-model.js';

const SCHOOL_CALENDAR_ID = 'ocsSchoolCalendarData';

// Signed-in check runs once per page, however many cards there are.
let identityRequest = null;
const liveIdentity = () => {
  identityRequest = identityRequest || fetchLiveIdentity({ javaURI, fetchOptions });
  return identityRequest;
};

function sampleStore({ course, weeks }) {
  const storageKey = `ocs-calendar-card-sample:${course}`;
  // Re-seed on every load so the sample week always matches today.
  try { window.localStorage.removeItem(storageKey); } catch (_) { /* storage blocked: memory only */ }
  const periods = coursePeriods(course);
  return createPreviewCalendarStore({ course, storageKey, seedEvents: buildPreviewSeed({ weeks, course, periods }).events });
}

function setStatus(card, text) {
  const status = card.querySelector('[data-hook="status"]');
  status.textContent = text;
  status.hidden = !text;
}

// The selected event, shown inside the card as the same event card the
// announcements use, with a close button above it.
function showDetail(card, event, store, calendarUrl) {
  const detail = card.querySelector('[data-hook="detail"]');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'ocs__btn small pill';
  close.setAttribute('aria-label', 'Close event details');
  close.innerHTML = '&times;';
  close.addEventListener('click', () => { detail.hidden = true; });
  const bar = document.createElement('div');
  bar.appendChild(close);
  detail.replaceChildren(bar, renderEventCards([event], { store: () => store, isTeacher: () => false, calendarUrl }));
  detail.hidden = false;
}

async function mountCard(card, weeks) {
  card.dataset.mounted = 'true';
  const course = card.dataset.course || 'all';
  const period = card.dataset.period || 'all';
  const calendarUrl = card.dataset.calendarUrl || '/student/calendar';
  card.setAttribute('aria-busy', 'true');

  let store;
  let signedOut = false;
  if (card.dataset.sample === 'true') {
    store = sampleStore({ course, weeks });
    setStatus(card, 'Sample week: these events are examples and stay in this browser.');
  } else if (await liveIdentity()) {
    store = createLiveCalendarStore({ course, javaURI, fetchOptions, sourceUrl: window.location.href });
  } else {
    store = createPreviewCalendarStore({ course, storageKey: `ocs-calendar-card-signed-out:${course}` });
    signedOut = true;
    setStatus(card, 'Sign in to see your class events. Showing the school week.');
  }

  const view = mountWeekView({
    host: card.querySelector('[data-hook="mount"]'),
    weeks,
    getStore: () => store,
    getPeriod: () => period,
    showEmpty: !signedOut,   // signed out, an empty week only means we can't see the events
    onSelectEvent: (event) => showDetail(card, event, store, calendarUrl),
  });
  card.removeAttribute('aria-busy');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') card.querySelector('[data-hook="detail"]').hidden = true;
  });
  // Pick up events added in another tab (or by the teacher) when the student comes back.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) view.refresh(); });
}

function mountAll() {
  const data = document.getElementById(SCHOOL_CALENDAR_ID);
  if (!data) {
    console.error('Calendar card: school calendar data missing; add it through _includes/ocs_calendar_card.html');
    return;
  }
  const { weeks } = parseSchoolCalendar(JSON.parse(data.textContent));
  document.querySelectorAll('[data-ocs-calendar]:not([data-mounted])').forEach((card) => {
    mountCard(card, weeks).catch((err) => {
      console.error('Calendar card: could not load', err);
      card.removeAttribute('aria-busy');
      setStatus(card, 'The calendar could not load right now.');
    });
  });
}

mountAll();
