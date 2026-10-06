// What students and teachers see: the announcement log, the event card under
// an announcement (ocs__event), and the calendar strip above the feed
// (ocs__calendar). Used by the real announcement chat and the demo page.

import { renderRichMessage } from '../rich-text.js';
import {
  escapeHtml, eventMatchesPeriod, extractEventMarkers, findSchoolWeek, formatPeriods,
  fromIsoDate, neighborWeek, PRIORITY_LABELS, schoolWeekDays, todayIso, TYPE_LABELS,
} from './calendar-model.js';

/* ── Announcement log ────────────────────────────────────────────────── */

// Renders the announcement log. Markup and grouping (day separators,
// consecutive-sender collapsing, avatars) mirror _includes/announcement_chat.html
// so the existing .announcement-chat styles apply unchanged. The one addition:
// event markers are stripped from the text and handed to `renderEvents`.


const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function dayLabel(date) {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function initialsFor(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function tintFor(name) {
  let hash = 0;
  for (const ch of String(name || '')) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `tint-${(hash % 5) + 1}`;
}

export function createChatFeed({ messagesEl, getSelfName, renderEvents }) {
  const emptyHtml = messagesEl.innerHTML;
  let seen = new Set();
  let cursor = { day: null, sender: null, time: 0 };
  const messageListeners = new Set();

  function clearEmpty() {
    messagesEl.querySelector('.chat-empty')?.remove();
  }

  function append({ sender, message, date }) {
    const key = [sender, date, message].join('|');
    if (seen.has(key)) return;
    seen.add(key);
    clearEmpty();

    const { html, events } = extractEventMarkers(message);
    const when = date ? new Date(date) : null;
    const isSelf = sender === getSelfName();
    const who = isSelf ? 'You' : (sender || 'Unknown');
    const wasAtBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 40;

    if (when && String(startOfDay(when)) !== cursor.day) {
      const separator = document.createElement('div');
      separator.className = 'chat-day';
      separator.setAttribute('role', 'separator');
      separator.textContent = dayLabel(when);
      messagesEl.appendChild(separator);
      cursor = { day: String(startOfDay(when)), sender: null, time: 0 };
    }
    const continued = who === cursor.sender && when && (when.getTime() - cursor.time) < 5 * 60 * 1000;

    const row = document.createElement('div');
    row.className = ['chat-msg', isSelf && 'is-self', continued && 'is-continued'].filter(Boolean).join(' ');
    if (events.length) row.dataset.eventIds = events.map((e) => e.id).join(' ');

    const avatar = document.createElement('span');
    avatar.className = ['chat-avatar', !isSelf && tintFor(who)].filter(Boolean).join(' ');
    avatar.textContent = initialsFor(isSelf ? getSelfName() : who);
    avatar.setAttribute('aria-hidden', 'true');

    const main = document.createElement('div');
    main.className = 'chat-msg-main';
    const meta = document.createElement('div');
    meta.className = 'chat-msg-meta';
    const senderEl = document.createElement('span');
    senderEl.className = 'chat-msg-sender';
    senderEl.textContent = who;
    meta.appendChild(senderEl);
    if (when) {
      const timeEl = document.createElement('span');
      timeEl.className = 'chat-msg-time';
      timeEl.textContent = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      meta.appendChild(timeEl);
    }

    const body = document.createElement('span');
    body.className = 'chat-msg-body';
    renderRichMessage(body, html);
    main.append(meta, body);
    if (events.length) main.appendChild(renderEvents(events));

    row.append(avatar, main);
    messagesEl.appendChild(row);
    cursor.sender = who;
    cursor.time = when ? when.getTime() : 0;
    if (wasAtBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    messageListeners.forEach((listener) => listener({ sender, events }));
  }

  function appendSystem(text) {
    clearEmpty();
    const el = document.createElement('p');
    el.className = 'chat-system';
    el.textContent = text;
    messagesEl.appendChild(el);
    cursor.sender = null;
  }

  function reset() {
    messagesEl.innerHTML = emptyHtml;
    seen = new Set();
    cursor = { day: null, sender: null, time: 0 };
  }

  return {
    append,
    appendSystem,
    reset,
    revealEvent: (eventId) => revealAnnouncementForEvent(messagesEl, eventId),
    onMessage(listener) { messageListeners.add(listener); return () => messageListeners.delete(listener); },
  };
}

// Scroll the log to (and flash) the announcement that created a calendar event.
// Rows carry data-event-ids (see createChatFeed and announcement_chat.html).
export function revealAnnouncementForEvent(messagesEl, eventId) {
  const row = [...messagesEl.querySelectorAll('[data-event-ids]')]
    .find((el) => el.dataset.eventIds.split(' ').includes(String(eventId)));
  if (!row) return false;
  messagesEl.scrollTop += row.getBoundingClientRect().top - messagesEl.getBoundingClientRect().top - 16;
  row.classList.remove('is-flash');
  void row.offsetWidth; // restart the animation
  row.classList.add('is-flash');
  return true;
}

/* ── Event card ──────────────────────────────────────────────────────── */

// The card shown under an announcement that created calendar events
// (ocs__card ocs__event). Everyone can open the event on the OCS calendar;
// teachers can also take it back off the class calendar.


function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function dateBlock(iso) {
  const date = fromIsoDate(iso);
  const block = el('div', 'ocs__event-date');
  block.append(
    el('span', 'ocs__event-month', date.toLocaleDateString(undefined, { month: 'short' })),
    el('span', 'ocs__event-day', String(date.getDate())),
    el('span', 'ocs__event-weekday', date.toLocaleDateString(undefined, { weekday: 'short' })),
  );
  return block;
}

function viewOnCalendarLink(calendarUrl) {
  const link = el('a', 'ocs__btn small pill');
  link.href = calendarUrl;
  link.innerHTML = '<i class="fas fa-calendar-alt" aria-hidden="true"></i>';
  link.appendChild(el('span', '', 'View on OCS calendar'));
  return link;
}

function removeButton(event, store, onRemoved, status) {
  const button = el('button', 'ocs__btn small pill alert-red');
  button.type = 'button';
  button.title = 'Remove from calendar';
  button.setAttribute('aria-label', 'Remove from calendar');
  button.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>';
  button.addEventListener('click', async () => {
    if (!window.confirm(`Remove "${event.title}" from the class calendar?`)) return;
    try {
      await store().deleteEvent(event.id);
      onRemoved();
    } catch (err) {
      console.error('Announcement calendar: delete failed', err);
      status.textContent = 'Could not remove — see console';
    }
  });
  return button;
}

function renderCard(event, { store, isTeacher, calendarUrl }, compact) {
  const card = el('div', `ocs__card ocs__event${compact ? ' is-compact' : ''}`);
  card.dataset.periods = (event.periods || []).join(' ');

  const info = el('div', 'ocs__event-body');
  info.appendChild(el('div', 'ocs__event-title', event.title));
  const tags = el('div', 'ocs__event-tags');
  const status = el('span', 'ocs__event-status', 'On class calendar');
  tags.append(
    el('span', 'ocs__status-pill ocs__status-pill--neutral', PRIORITY_LABELS[event.priority] || event.priority),
    el('span', 'ocs__status-pill ocs__status-pill--neutral', TYPE_LABELS[event.type] || event.type),
  );
  if (event.periods?.length) tags.appendChild(el('span', 'ocs__status-pill', formatPeriods(event.periods)));
  tags.appendChild(status);
  info.appendChild(tags);
  if (event.description) info.appendChild(el('p', 'ocs__event-details', event.description));

  const markRemoved = () => {
    card.classList.add('is-removed');
    status.textContent = 'Removed from calendar';
  };

  const actions = el('div', 'ocs__links ocs__event-actions');
  actions.appendChild(viewOnCalendarLink(calendarUrl));
  if (isTeacher()) actions.appendChild(removeButton(event, store, markRemoved, status));
  info.appendChild(actions);

  card.append(dateBlock(event.date), info);
  if (store()?.status(event.id) === 'removed') markRemoved();
  return card;
}

// context: { store: () => calendarStore, isTeacher: () => bool, calendarUrl }
export function renderEventCards(events, context) {
  const wrapper = el('div', 'ocs__event-list');
  const compact = events.length > 1;
  [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((event) => wrapper.appendChild(renderCard(event, context, compact)));
  return wrapper;
}

// Dim cards for other class periods when the viewer picks a period ("all" = none dimmed).
export function markCardsForPeriod(container, period) {
  container.querySelectorAll('.ocs__event').forEach((card) => {
    const periods = card.dataset.periods ? card.dataset.periods.split(' ') : [];
    card.classList.toggle('is-other-period', !eventMatchesPeriod({ periods }, period));
  });
}

/* ── Calendar strip ──────────────────────────────────────────────────── */

// A compact, read-only look at the current school week (ocs__card
// ocs__calendar), pinned above the announcements. Clicking an event jumps to
// the announcement that created it. Events for other class periods are
// hidden when the viewer picks a period. `feed` needs revealEvent(id) and
// onMessage(listener).


const MAX_CHIPS_PER_DAY = 3;

function weekRangeLabel(week) {
  const format = (iso) => fromIsoDate(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `Week ${week.index} · ${format(week.monday)} – ${format(week.friday)}`;
}

export function mountWeekView({ slot, weeks, getStore, getPeriod, feed }) {
  const today = todayIso();
  let week = findSchoolWeek(weeks, today);

  const root = document.createElement('div');
  root.className = 'ocs__card ocs__calendar';
  root.innerHTML = `
    <div class="ocs__calendar-header">
      <button type="button" class="ocs__btn small pill" data-step="-1" aria-label="Previous week"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
      <div class="ocs__calendar-heading"><span class="ocs__calendar-title"></span><span class="ocs__calendar-note"></span></div>
      <button type="button" class="ocs__btn small pill" data-step="1" aria-label="Next week"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
    </div>
    <div class="ocs__calendar-days" role="list"></div>`;
  slot.appendChild(root);
  const daysEl = root.querySelector('.ocs__calendar-days');

  function eventChip(event) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ocs__calendar-item';
    chip.title = [event.title, formatPeriods(event.periods)].filter(Boolean).join(' · ');
    chip.textContent = event.title;
    chip.addEventListener('click', () => {
      if (!feed.revealEvent(event.id)) chip.title = `${event.title}: no announcement for this one`;
    });
    return chip;
  }

  async function refresh() {
    if (!week) return;
    root.querySelector('.ocs__calendar-title').textContent = weekRangeLabel(week);
    root.querySelector('.ocs__calendar-note').textContent = [week.theme, week.notes].filter(Boolean).join(' · ');
    const store = getStore();
    const [allEvents, breaks] = await Promise.all([
      store.listRange(week.monday, week.friday),
      store.listBreaks().catch(() => []),
    ]);
    const events = allEvents.filter((event) => eventMatchesPeriod(event, getPeriod()));
    const breakByDate = new Map(breaks.map((b) => [b.date, b.name]));

    daysEl.innerHTML = '';
    schoolWeekDays(week).forEach((day) => {
      const closedReason = day.closedReason || breakByDate.get(day.date) || '';
      const dayEvents = events.filter((e) => e.date === day.date);
      const cell = document.createElement('div');
      cell.setAttribute('role', 'listitem');
      cell.className = ['ocs__calendar-day', day.date === today && 'is-today', (day.closed || closedReason) && 'is-closed']
        .filter(Boolean).join(' ');
      cell.innerHTML = `<span class="ocs__calendar-day-label">${day.label} <b>${fromIsoDate(day.date).getDate()}</b></span>`
        + (closedReason ? `<span class="ocs__calendar-closed">${escapeHtml(closedReason)}</span>` : '');
      dayEvents.slice(0, MAX_CHIPS_PER_DAY).forEach((event) => cell.appendChild(eventChip(event)));
      if (dayEvents.length > MAX_CHIPS_PER_DAY) {
        cell.insertAdjacentHTML('beforeend', `<span class="ocs__calendar-more">+${dayEvents.length - MAX_CHIPS_PER_DAY} more</span>`);
      }
      daysEl.appendChild(cell);
    });
  }

  root.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      week = neighborWeek(weeks, week, Number(button.dataset.step)) || week;
      refresh();
    });
  });

  const load = () => refresh().catch((err) => console.error('Announcement calendar: calendar strip load failed', err));
  const unsubscribe = getStore().subscribe(load);
  const unlisten = feed.onMessage(({ events }) => { if (events.length) load(); });
  load();

  return {
    refresh: load,
    unmount() {
      unsubscribe();
      unlisten();
      root.remove();
    },
  };
}
