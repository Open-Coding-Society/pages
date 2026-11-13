// Calendar smart card: the class calendar as an ocs__ card that any page can
// add with {% include ocs_calendar_card.html %}. Every [data-ocs-calendar]
// element on the page sets itself up:
//   - signed in:  the course's events from the existing Spring /api/calendar endpoints
//   - signed out: the school week (holidays included) and a sign-in note
//   - no Spring (spring: false in _config.yml): the school week, and no request to Spring
//   - data-sample: sample events for prototypes and demos, nothing leaves the browser
// Clicking an event opens its details inside the card. The week shows one row
// per day when the card is narrow (a sidebar), so it fits wherever it's added.
// Everything is an existing OCS element; the card has no CSS of its own.
//
// A page that makes its cards from its own data (the UI Builder) puts the
// include's empty card on the page with template=true and the school weeks
// with ocs_calendar_card_data.html, then calls createCalendarCardSection for
// each card and mountCalendarCard to start it. Those cards are marked manual,
// so the cards this script starts by itself (mountAll) are only the include's.

import { fetchOptions, javaURI, springEnabled as siteSpringEnabled } from '../../api/config.js';
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

// The school weeks the include put on the page (ocs_calendar_card_data.html).
function schoolWeeks() {
  const data = document.getElementById(SCHOOL_CALENDAR_ID);
  if (!data) {
    throw new Error('Calendar card: school calendar data missing; add it through _includes/ocs_calendar_card_data.html');
  }
  return parseSchoolCalendar(JSON.parse(data.textContent)).weeks;
}

// `run` is the card's mount: once it is stopped (unmounted) the card sets
// nothing up, and its cleanups take off the listeners added here.
async function mountCard(card, weeks, { springEnabled, run }) {
  const course = card.dataset.course || 'all';
  const calendarUrl = card.dataset.calendarUrl || '/student/calendar';
  const sample = card.dataset.sample === 'true';
  card.setAttribute('aria-busy', 'true');

  // Spring is asked who is signed in only on a site that has Spring.
  const signedIn = !sample && springEnabled && Boolean(await liveIdentity());
  if (run.stopped) return;   // unmounted while Spring answered

  let store;
  let signedOut = false;
  if (sample) {
    store = sampleStore({ course, weeks });
    setStatus(card, 'Sample week: these events are examples and stay in this browser.');
  } else if (signedIn) {
    store = createLiveCalendarStore({ course, javaURI, fetchOptions, sourceUrl: window.location.href });
  } else {
    store = createPreviewCalendarStore({ course, storageKey: `ocs-calendar-card-signed-out:${course}` });
    signedOut = true;
    // Without Spring there are no class events to sign in for.
    setStatus(card, springEnabled ? 'Sign in to see your class events. Showing the school week.' : 'Showing the school week.');
  }

  run.view = mountWeekView({
    host: card.querySelector('[data-hook="mount"]'),
    weeks,
    getStore: () => store,
    showEmpty: !signedOut,   // signed out, an empty week only means we can't see the events
    onSelectEvent: (event) => showDetail(card, event, store, calendarUrl),
  });
  card.removeAttribute('aria-busy');
  const closeOnEscape = (e) => {
    if (e.key === 'Escape') card.querySelector('[data-hook="detail"]').hidden = true;
  };
  // Pick up events added in another tab (or by the teacher) when the student comes back.
  const refreshOnReturn = () => { if (!document.hidden) run.view.refresh(); };
  card.addEventListener('keydown', closeOnEscape);
  document.addEventListener('visibilitychange', refreshOnReturn);
  run.cleanups.push(
    () => card.removeEventListener('keydown', closeOnEscape),
    () => document.removeEventListener('visibilitychange', refreshOnReturn),
  );
}

// Each card's mount, so mounting one twice is harmless.
const mounts = new WeakMap();

// Starts one card and returns { refresh(), unmount() }. springEnabled is
// config.js's unless given (spring in _config.yml); false, as on a Flask-only
// site, makes no request to Spring and the card shows the school week.
// refresh() reloads the week's events; unmount() takes off the card's
// listeners, stops its week view and empties it.
export function mountCalendarCard(card, { springEnabled = siteSpringEnabled } = {}) {
  if (mounts.has(card)) return mounts.get(card);
  const weeks = schoolWeeks();
  const before = card.getAttribute('data-mounted');
  const run = { stopped: false, view: null, cleanups: [] };
  card.dataset.mounted = 'true';
  const ready = mountCard(card, weeks, { springEnabled, run }).catch((err) => {
    if (run.stopped) return;
    console.error('Calendar card: could not load', err);
    card.removeAttribute('aria-busy');
    setStatus(card, 'The calendar could not load right now.');
  });

  const handle = {
    refresh: () => ready.then(() => (run.stopped ? undefined : run.view?.refresh())),
    unmount() {
      if (run.stopped) return;
      run.stopped = true;
      mounts.delete(card);
      run.cleanups.forEach((cleanup) => cleanup());
      run.view?.unmount();
      card.querySelector('[data-hook="mount"]').replaceChildren();
      const detail = card.querySelector('[data-hook="detail"]');
      detail.replaceChildren();
      detail.hidden = true;
      setStatus(card, '');
      card.removeAttribute('aria-busy');
      if (before === null) card.removeAttribute('data-mounted');
      else card.setAttribute('data-mounted', before);
    },
  };
  mounts.set(card, handle);
  return handle;
}

// The include's cards: every card in `root` that isn't mounted yet. Cards
// from createCalendarCardSection are marked manual and wait for their page's
// own mountCalendarCard.
export function mountAll(root = document) {
  const cards = [...root.querySelectorAll('[data-ocs-calendar]:not([data-mounted])')];
  if (cards.length && !document.getElementById(SCHOOL_CALENDAR_ID)) {
    console.error('Calendar card: school calendar data missing; add it through _includes/ocs_calendar_card.html');
    return [];
  }
  return cards.map((card) => mountCalendarCard(card));
}

// The include's title when it has none: the course's, or the class's for all.
const titleFor = (course) => (course === 'all' ? 'Class calendar' : `${course.toUpperCase()} calendar`);

// A card for a page that makes its own: a copy of the include's empty card
// (template=true) for this course ("" is all courses) and title (by default
// the include's), marked manual. The page adds it, then calls
// mountCalendarCard(card).
export function createCalendarCardSection({ course = '', title = '' } = {}, doc = document) {
  const empty = doc.querySelector('template[data-ocs-template="calendar-card"]')?.content.querySelector('[data-ocs-calendar]');
  if (!empty) {
    throw new Error('Calendar card: the page has no card template; add {% include ocs_calendar_card.html template=true %}.');
  }
  const card = doc.importNode(empty, true);
  const code = String(course ?? '').trim().toLowerCase() || 'all';
  const heading = String(title ?? '').trim() || titleFor(code);
  card.dataset.course = code;
  card.setAttribute('aria-label', heading);
  // The heading keeps the include's icon in front of its words.
  const strong = card.querySelector('strong');
  const icon = strong.querySelector('i');
  strong.replaceChildren(...(icon ? [icon, ` ${heading}`] : [heading]));
  card.dataset.mounted = 'manual';
  return card;
}

if (typeof document !== 'undefined') mountAll();
