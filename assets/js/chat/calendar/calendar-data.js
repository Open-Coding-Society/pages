// Data layer for the announcement ↔ calendar demo: calendar events and chat
// messages, each with a Live backend (existing Spring endpoints, no backend
// changes) and a Preview backend (sample data in localStorage).

import {
  addDays, encodeEventMarker, findSchoolWeek, neighborWeek, nextSchoolDay, todayIso,
} from './calendar-model.js';

/* ── Calendar events ─────────────────────────────────────────────────── */

// Data layer for the announcement ↔ calendar demos. One interface, two backends:
//
//   live    → the existing Spring endpoints under /api/calendar (no backend changes)
//   preview → sample events in localStorage, so the demo runs signed out
//
// Both return events normalized to { id, date, title, description, type, priority, periods, course }.

const PRIORITY_PREFIX = /^\[(P[0-3])\]\s*/;
const TITLE_EMOJI = '📅';

// Spring serializes LocalDate as "YYYY-MM-DD"; tolerate the [y, m, d] array form too.
function normalizeDate(value) {
  if (Array.isArray(value)) return value.map((part, i) => String(part).padStart(i ? 2 : 4, '0')).join('-');
  return String(value || '').slice(0, 10);
}

// Class periods go in the backend's existing classPeriod string ("P3,P4").
const toClassPeriod = (periods = []) => periods.map((p) => `P${p}`).join(',');
const fromClassPeriod = (value) => (String(value || '').match(/\d/g) || []);

// /student/calendar reads priority from a "[Px]" title prefix, so events are
// stored as "[P2] 📅 Title" and unwrapped here for display.
export function normalizeBackendEvent(raw) {
  const title = String(raw?.title || '');
  const priority = title.match(PRIORITY_PREFIX)?.[1] || raw?.priority || 'P2';
  return {
    id: String(raw?.id),
    date: normalizeDate(raw?.date),
    title: title.replace(PRIORITY_PREFIX, '').replace(TITLE_EMOJI, '').trim(),
    description: raw?.description || '',
    type: raw?.type || 'event',
    priority,
    periods: fromClassPeriod(raw?.classPeriod),
    course: String(raw?.period || '').toLowerCase(),
    isBreak: Boolean(raw?.break || raw?.isBreak),
  };
}

function createListeners() {
  const listeners = new Set();
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    notify() { listeners.forEach((listener) => listener()); },
  };
}

/* ── live ─────────────────────────────────────────────────────────── */

export function createLiveCalendarStore({ course, javaURI, fetchOptions, sourceUrl }) {
  const period = course.toUpperCase();
  const removed = new Set();
  const listeners = createListeners();

  async function request(path, init = {}) {
    const res = await fetch(`${javaURI}/api/calendar${path}`, { ...fetchOptions, ...init });
    const text = await res.text();
    const body = text ? (() => { try { return JSON.parse(text); } catch (_) { return text; } })() : null;
    if (!res.ok) {
      const reason = body?.message || body?.error || (typeof body === 'string' ? body : '');
      throw new Error(`Calendar ${init.method || 'GET'} ${path} failed (HTTP ${res.status}) ${reason}`.trim());
    }
    return body;
  }

  const forThisCourse = (events) => (events || [])
    .map(normalizeBackendEvent)
    .filter((event) => !event.isBreak && (!event.course || event.course === course));

  return {
    mode: 'live',
    async createEvent({ title, date, description = '', type = 'event', priority = 'P2', periods = [] }) {
      const saved = await request('/add_event', {
        method: 'POST',
        body: JSON.stringify({
          title: `[${priority}] ${TITLE_EMOJI} ${title}`,
          date,
          description: [description, sourceUrl ? `Posted in ${period} announcements: ${sourceUrl}` : '']
            .filter(Boolean).join('\n\n'),
          type,
          period,
          classPeriod: toClassPeriod(periods),
          // Blank = visible to everyone. Omitting it makes the backend default to
          // the teacher's uid, which hides the event from students.
          individual: '',
        }),
      });
      listeners.notify();
      return normalizeBackendEvent(saved);
    },
    async listRange(start, end) {
      return forThisCourse(await request(`/events/range?start=${start}&end=${end}`));
    },
    async listBreaks() {
      const breaks = await request('/breaks');
      return (Array.isArray(breaks) ? breaks : []).map((b) => ({ date: normalizeDate(b.date), name: b.name || 'Break' }));
    },
    async deleteEvent(id) {
      await request(`/delete/${encodeURIComponent(id)}`, { method: 'DELETE' });
      removed.add(String(id));
      listeners.notify();
    },
    status(id) { return removed.has(String(id)) ? 'removed' : 'unknown'; },
    subscribe: listeners.subscribe,
  };
}

/* ── preview ──────────────────────────────────────────────────────── */

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* private mode: memory only */ }
}

export function createPreviewCalendarStore({ course, storageKey, seedEvents = [] }) {
  let events = readJson(storageKey, null);
  if (!Array.isArray(events)) {
    events = seedEvents;
    writeJson(storageKey, events);
  }
  const listeners = createListeners();
  const save = () => { writeJson(storageKey, events); listeners.notify(); };
  const inRange = (start, end) => events.filter((e) => e.date >= start && e.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    mode: 'preview',
    async createEvent({ title, date, description = '', type = 'event', priority = 'P2', periods = [] }) {
      const event = {
        id: `p${Date.now().toString(36)}${events.length}`, date, title, description, type, priority, periods, course,
      };
      // Same upsert rule as the backend: same title + date replaces instead of duplicating.
      events = events.filter((e) => !(e.title === title && e.date === date)).concat(event);
      save();
      return event;
    },
    async listRange(start, end) { return inRange(start, end); },
    async listBreaks() { return []; },
    async deleteEvent(id) { events = events.filter((e) => e.id !== String(id)); save(); },
    status(id) { return events.some((e) => e.id === String(id)) ? 'active' : 'removed'; },
    subscribe: listeners.subscribe,
  };
}

/* ── Chat messages ───────────────────────────────────────────────────── */

// Where demo announcements are stored and delivered.
//
//   preview → localStorage, seeded with a sample week (no login, nothing leaves the browser)
//   live    → the same group chat the real announcements use (/api/groups + STOMP /ws-chat),
//             ported from _includes/announcement_chat.html, but on a separate
//             "<course>-announcements-demo" group so the real class feed is untouched.

const PREVIEW_LIMIT = 100;
const CHAT_SOCKET_PORT = 8589;
const SOCKJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js';
const STOMP_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';

/* ── preview ──────────────────────────────────────────────────────── */

function readMessages(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

function writeMessages(storageKey, messages) {
  try { window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-PREVIEW_LIMIT))); } catch (_) { /* memory only */ }
}

export function createPreviewTransport({ storageKey, seedMessages = [] }) {
  let messages = readMessages(storageKey);
  if (!messages) {
    messages = seedMessages;
    writeMessages(storageKey, messages);
  }
  let deliver = () => {};

  return {
    mode: 'preview',
    async start(onMessage) {
      deliver = onMessage;
      messages.forEach(onMessage);
    },
    send({ sender, message }) {
      const entry = { sender, message, date: new Date().toISOString() };
      messages.push(entry);
      writeMessages(storageKey, messages);
      deliver(entry);
      return true;
    },
    stop() {},
  };
}

/* ── live ─────────────────────────────────────────────────────────── */

function loadScriptOnce(src) {
  window.__ocsChatScripts = window.__ocsChatScripts || {};
  if (!window.__ocsChatScripts[src]) {
    window.__ocsChatScripts[src] = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = () => reject(new Error(`failed to load ${src}`));
      document.head.appendChild(el);
    });
  }
  return window.__ocsChatScripts[src];
}

function chatSocketEndpoint(javaURI) {
  const uri = new URL(javaURI);
  if (uri.hostname === 'localhost' || uri.hostname === '127.0.0.1') {
    return `${uri.protocol}//${uri.hostname}:${CHAT_SOCKET_PORT}/ws-chat`;
  }
  return `${javaURI}/ws-chat`;
}

export function createLiveTransport({ groupName, course, javaURI, fetchOptions }) {
  let groupId = null;
  let client = null;
  let connected = false;

  async function findGroup() {
    const res = await fetch(`${javaURI}/api/groups/search?name=${encodeURIComponent(groupName)}`, fetchOptions);
    if (!res.ok) throw new Error(`group lookup failed (HTTP ${res.status})`);
    const body = await res.json();
    const match = Array.isArray(body) ? body.find((g) => g?.name === groupName) : body;
    return Number(match?.id) || null;
  }

  // Groups create themselves on first use, like the real announcement chat.
  async function resolveGroup() {
    const existing = await findGroup();
    if (existing) return existing;
    const res = await fetch(`${javaURI}/api/groups`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ name: groupName, period: '', course, memberIds: [] }),
    });
    if (res.status === 201) return Number((await res.json())?.id);
    const retry = await findGroup(); // 409: created by someone else a moment ago
    if (!retry) throw new Error(`could not create chat group ${groupName}`);
    return retry;
  }

  function connect(onMessage) {
    return new Promise((resolve, reject) => {
      const socket = new window.SockJS(chatSocketEndpoint(javaURI));
      client = window.Stomp.over(socket);
      client.debug = null;
      client.connect({}, () => {
        connected = true;
        client.subscribe(`/topic/group/${groupId}`, (frame) => {
          try {
            const event = JSON.parse(frame.body);
            if (event?.context === 'sendMessageServer') {
              onMessage({ sender: event.sender, message: event.message, date: event.date });
            }
          } catch (err) { console.warn('Announcement calendar demo: bad chat frame', err); }
        });
        resolve();
      }, (err) => reject(new Error(`chat socket failed: ${err}`)));
    });
  }

  return {
    mode: 'live',
    async start(onMessage) {
      groupId = await resolveGroup();
      const res = await fetch(`${javaURI}/api/groups/chat/${groupId}/messages`, fetchOptions);
      if (res.ok) {
        (await res.json() || []).forEach((m) => onMessage({ sender: m.name, message: m.message, date: m.date }));
      }
      await loadScriptOnce(SOCKJS_SRC);
      await loadScriptOnce(STOMP_SRC);
      await connect(onMessage);
    },
    send({ sender, message }) {
      if (!connected) return false;
      const payload = { context: 'sendMessage', groupId, sender, message, image: null, date: new Date().toISOString() };
      client.send('/app/groups.chat', {}, JSON.stringify(payload));
      return true;
    },
    stop() {
      try { if (connected) client.disconnect(); } catch (_) { /* already closed */ }
      connected = false;
    },
  };
}

/* ── Signed-in user (Live mode) ──────────────────────────────────────── */

// Who is signed in, for Live mode. Uses Spring's /api/person/get, whose
// roles[] carries ROLE_TEACHER / ROLE_ADMIN (same check as _includes/nav/homejava.html).
// Note: this only gates the UI. The calendar and group-chat endpoints don't
// check roles on the server yet.

const TEACHER_ROLES = new Set(['ROLE_TEACHER', 'ROLE_ADMIN']);

// → { name, isTeacher } or null when signed out / backend unreachable
export async function fetchLiveIdentity({ javaURI, fetchOptions }) {
  try {
    const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    if (!res.ok) return null;
    const person = await res.json();
    const name = person?.name || person?.uid;
    if (!name) return null;
    return { name, isTeacher: (person.roles || []).some((role) => TEACHER_ROLES.has(role?.name)) };
  } catch (err) {
    console.warn('Announcement calendar demo: identity lookup failed', err);
    return null;
  }
}

/* ── Preview sample week ─────────────────────────────────────────────── */

// Sample data for Preview mode so the demo opens on a realistic class week
// instead of an empty feed. Dates are computed from the real school calendar
// relative to today, so the seed never goes stale.


export const DEMO_TEACHER = 'Demo Teacher';
export const DEMO_STUDENT = 'Demo Student';

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

export function buildPreviewSeed({ weeks, course, periods = [], today = todayIso() }) {
  const week = findSchoolWeek(weeks, today);
  if (!week) return { events: [], messages: [] };
  const following = neighborWeek(weeks, week, 1) || week;

  const events = [
    { id: 'seed-1', date: nextSchoolDay(weeks, week.monday), title: 'Live Reviews', type: 'daily plan', priority: 'P2',
      description: 'Review project progress with teacher' },
    { id: 'seed-2', date: nextSchoolDay(weeks, addDays(today, 1)), title: 'Code review office hours', type: 'event', priority: 'P3',
      description: 'Drop in during tutorial with your PR open' },
    { id: 'seed-3', date: week.friday, title: 'Unit 3 Quiz', type: 'grade', priority: 'P0',
      description: 'One page of handwritten notes allowed' },
    { id: 'seed-4', date: nextSchoolDay(weeks, following.monday), title: 'Sprint kickoff', type: 'check-in', priority: 'P1',
      description: 'Bring your team board' },
  ].map((event) => ({ ...event, course, periods: [...periods] }));
  // With more than one period (CSP meets 3 and 4), office hours is only for the
  // last one, so the Period filter has something to show.
  if (periods.length > 1) events[1].periods = [periods[periods.length - 1]];

  const [reviews, officeHours, quiz, kickoff] = events;
  const messages = [
    {
      sender: DEMO_TEACHER,
      date: hoursAgo(49),
      message: `<b>Week ${week.index} plan</b><br>Live reviews to start the week, office hours, and the Unit 3 quiz on Friday. `
        + `Everything below is already on the class calendar. ${[reviews, officeHours, quiz].map(encodeEventMarker).join(' ')}`,
    },
    { sender: DEMO_STUDENT, date: hoursAgo(26), message: 'Is the Unit 3 quiz open-note?' },
    {
      sender: DEMO_TEACHER,
      date: hoursAgo(3),
      message: `Yes, one page of handwritten notes. Also, the next sprint kicks off soon: ${encodeEventMarker(kickoff)}`,
    },
  ];
  return { events, messages };
}
