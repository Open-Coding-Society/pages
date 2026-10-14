// Entry point for _includes/announcement_calendar_demo.html.
// Owns the pieces both versions share (composer, feed, store, transport,
// week view) and the demo toggles (version, class, period, role, data
// source); swaps the version-specific composer UI in and out.

import { fetchOptions, javaURI } from '../../api/config.js';
import { createRichComposer } from '../rich-text.js';
import { mountAttachForm, mountQuickSyntax } from './calendar-composer.js';
import {
  buildPreviewSeed, createLiveCalendarStore, createLiveTransport, createPreviewCalendarStore,
  createPreviewTransport, DEMO_STUDENT, DEMO_TEACHER, fetchLiveIdentity,
} from './calendar-data.js';
import {
  createChatFeed, markCardsForPeriod, mountWeekView, renderEventCards,
} from './calendar-feed.js';
import { COURSES, coursePeriods, parseSchoolCalendar } from './calendar-model.js';

const VERSIONS = {
  1: {
    mount: mountAttachForm,
    summary: 'Write the announcement as usual, click Add to calendar and fill in the event. Send posts the message and creates the event together.',
  },
  2: {
    mount: mountQuickSyntax,
    summary: 'Type the weekly plan the way it used to go in Slack. Every [Day]: Title line is detected as you type; on Send each one becomes a calendar event card and the syntax lines are left out of the message.',
  },
};

const root = document.getElementById('announcementCalendarDemo');
const calendarUrl = `${root.dataset.baseurl || ''}/student/calendar`;
const sourceUrl = `${window.location.origin}${window.location.pathname}`;
const { schoolYear, weeks } = parseSchoolCalendar(
  JSON.parse(document.getElementById('announcementCalendarSchool').textContent),
);
const params = new URLSearchParams(window.location.search);

const $ = (selector) => root.querySelector(selector);
const slots = {
  composerTools: $('[data-slot="composer-tools"]'),
  composerPanel: $('[data-slot="composer-panel"]'),
};
const messagesEl = $('.chat-messages');
const weekViewSlot = $('[data-slot="week-view"]');
const weekViewToggle = $('.week-view-toggle');
const periodFilterEl = $('[data-period-filter]');
const formEl = $('.chat-form');
const sendBtn = $('.chat-send');

const knownCourse = (value) => COURSES.some((c) => c.value === value);
const state = {
  version: VERSIONS[Number(params.get('v'))] ? Number(params.get('v')) : 1,
  course: [params.get('class'), root.dataset.course].find(knownCourse) || 'csa',
  period: 'all',
  role: 'teacher',
  mode: 'preview',
  liveIdentity: null,
  store: null,
  transport: null,
  variant: null,
  weekViewOn: true,
  weekView: null,
  sending: false,
};

const storagePrefix = () => `ocs-announcement-calendar-demo:${state.course}`;
const isTeacher = () => (state.mode === 'live' ? state.liveIdentity.isTeacher : state.role === 'teacher');
const selfName = () => (state.mode === 'live' ? state.liveIdentity.name : (state.role === 'teacher' ? DEMO_TEACHER : DEMO_STUDENT));

const composer = createRichComposer({
  placeholder: 'Message the class…',
  maxLength: 2000,
  onSubmit: submit,
  onInput: () => state.variant?.onComposerInput?.(),
});
formEl.classList.add('chat-form--rich');
formEl.insertBefore(composer.element, sendBtn);

const feed = createChatFeed({
  messagesEl,
  getSelfName: selfName,
  renderEvents: (events) => renderEventCards(events, { store: () => state.store, isTeacher, calendarUrl }),
});
feed.onMessage(({ events }) => { if (events.length) markCardsForPeriod(messagesEl, state.period); });

function send(html) {
  return state.transport.send({ sender: selfName(), message: html });
}

async function submit() {
  if (state.sending || composer.isEmpty() || composer.isOverLimit()) return;
  state.sending = true;
  sendBtn.disabled = true;
  try {
    const html = composer.getHTML();
    const result = state.variant?.beforeSend ? await state.variant.beforeSend({ html }) : { html };
    if (result && send(result.html)) {
      composer.clear();
      state.variant?.afterSend?.();
    }
  } finally {
    state.sending = false;
    sendBtn.disabled = false;
  }
}

function setStatus(text, tone) {
  $('.chat-status').textContent = text;
  const pill = $('.chat-status-pill');
  pill.classList.remove('is-live', 'is-preview', 'is-error');
  pill.classList.add(tone);
}

function showNote(text) {
  $('.chat-preview-note span').textContent = text;
  $('.chat-preview-note').hidden = !text;
}

function mountVersion() {
  state.variant?.unmount();
  Object.values(slots).forEach((slot) => { slot.innerHTML = ''; });
  state.variant = VERSIONS[state.version].mount({
    course: state.course,
    coursePeriods: coursePeriods(state.course),
    weeks,
    schoolYear,
    slots,
    composer,
    feed,
    send,
    isTeacher,
    getStore: () => state.store,
  });
}

// The week view reads from the current store, so it is remounted whenever
// the data source or class changes, independently of the composer version.
function mountWeekViewIfOn() {
  state.weekView?.unmount();
  state.weekView = null;
  weekViewSlot.hidden = !state.weekViewOn;
  weekViewToggle.setAttribute('aria-pressed', String(state.weekViewOn));
  if (state.weekViewOn) {
    state.weekView = mountWeekView({
      slot: weekViewSlot, weeks, getStore: () => state.store, getPeriod: () => state.period, feed,
    });
  }
}

async function startMode(mode) {
  state.transport?.stop();
  feed.reset();
  state.mode = mode;
  const { course } = state;
  if (mode === 'preview') {
    const seed = buildPreviewSeed({ weeks, course, periods: coursePeriods(course) });
    state.store = createPreviewCalendarStore({ course, storageKey: `${storagePrefix()}:events`, seedEvents: seed.events });
    state.transport = createPreviewTransport({ storageKey: `${storagePrefix()}:messages`, seedMessages: seed.messages });
    setStatus('preview', 'is-preview');
    showNote('Preview mode: sample data kept in this browser. Nothing is sent to the class or the real calendar.');
  } else {
    state.store = createLiveCalendarStore({ course, javaURI, fetchOptions, sourceUrl });
    state.transport = createLiveTransport({ groupName: `${course}-announcements-demo`, course, javaURI, fetchOptions });
    setStatus('connecting…', 'is-preview');
    showNote(`Live mode as ${state.liveIdentity.name}${state.liveIdentity.isTeacher ? ' (teacher)' : ''}: messages go to the "${course}-announcements-demo" chat and events go on the real ${course.toUpperCase()} calendar.`);
  }
  syncControls();
  mountVersion();
  mountWeekViewIfOn();
  try {
    await state.transport.start(feed.append);
    if (mode === 'live') setStatus('live', 'is-live');
  } catch (err) {
    console.error('Announcement calendar demo: live mode failed', err);
    setStatus('offline', 'is-error');
    feed.appendSystem(`Live mode is unavailable (${err.message}).`);
  }
}

// Period filter: "All" plus the periods this class meets in (CSP → 3, 4).
function renderPeriodFilter() {
  const options = ['all', ...coursePeriods(state.course)];
  periodFilterEl.innerHTML = '<span class="announcement-calendar-segment-label">Period</span>'
    + options.map((p) => `<button type="button" role="radio" data-view-period="${p}">${p === 'all' ? 'All' : p}</button>`).join('');
  periodFilterEl.querySelectorAll('[data-view-period]').forEach((button) => button.addEventListener('click', () => {
    state.period = button.dataset.viewPeriod;
    syncControls();
    markCardsForPeriod(messagesEl, state.period);
    state.weekView?.refresh();
  }));
}

function syncControls() {
  const checked = (selector, key, value) => root.querySelectorAll(selector).forEach((el) => {
    el.setAttribute(el.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-checked', String(el.dataset[key] === String(value)));
  });
  checked('[data-version]', 'version', state.version);
  checked('[data-course]', 'course', state.course);
  checked('[data-view-period]', 'viewPeriod', state.period);
  checked('[data-role]', 'role', state.role);
  checked('[data-mode]', 'mode', state.mode);
  root.querySelectorAll('[data-role]').forEach((button) => { button.disabled = state.mode === 'live'; });
  $('.announcement-calendar-summary').textContent = VERSIONS[state.version].summary;
  $('.chat-title').textContent = `${state.course.toUpperCase()} Announcements`;
}

function setUrlParam(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, String(value));
  window.history.replaceState(null, '', url);
}

root.querySelectorAll('[data-version]').forEach((tab) => tab.addEventListener('click', () => {
  state.version = Number(tab.dataset.version);
  setUrlParam('v', state.version);
  syncControls();
  mountVersion();
}));

root.querySelectorAll('[data-course]').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.course === state.course) return;
  state.course = button.dataset.course;
  state.period = 'all';
  setUrlParam('class', state.course);
  renderPeriodFilter();
  startMode(state.mode);
}));

// Switching role re-renders the feed so "You" and the teacher-only controls follow.
root.querySelectorAll('[data-role]').forEach((button) => button.addEventListener('click', () => {
  state.role = button.dataset.role;
  startMode('preview');
}));

root.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', async () => {
  if (button.dataset.mode === state.mode) return;
  if (button.dataset.mode === 'preview') { startMode('preview'); return; }
  state.liveIdentity = await fetchLiveIdentity({ javaURI, fetchOptions });
  if (!state.liveIdentity) {
    showNote('Live mode needs you to be signed in to the Spring backend (Login on the site nav). Staying in Preview.');
    return;
  }
  startMode('live');
}));

weekViewToggle.addEventListener('click', () => {
  state.weekViewOn = !state.weekViewOn;
  mountWeekViewIfOn();
});

$('.announcement-calendar-reset').addEventListener('click', () => {
  try {
    window.localStorage.removeItem(`${storagePrefix()}:events`);
    window.localStorage.removeItem(`${storagePrefix()}:messages`);
  } catch (_) { /* storage blocked: the reseed below is still in memory */ }
  startMode('preview');
});

formEl.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
window.addEventListener('beforeunload', () => state.transport?.stop());

renderPeriodFilter();
startMode('preview');
