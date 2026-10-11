// What students and teachers see: the announcement log, the event card under
// an announcement, and the calendar strip above the feed. Used by the real
// announcement chat and the demo page. The card and the strip are built from
// existing OCS elements (ocs__card, ocs__callout, ocs__table, ocs__links,
// ocs__btn, ocs__status-pill) and plain HTML, so they need no CSS of their own.

import { renderRichMessage } from '../rich-text.js';
import {
  eventMatchesPeriod, extractEventMarkers, findSchoolWeek, formatPeriods,
  formatShortDate, fromIsoDate, neighborWeek, PRIORITY_LABELS, schoolWeekDays, todayIso, TYPE_LABELS,
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

const HIGHLIGHT_MS = 1600;

// Scroll the log to the announcement that created a calendar event. That
// event's "View on OCS calendar" button gets the OCS accent fill for a moment
// and takes focus, so both the eye and the keyboard land on it.
// Rows carry data-event-ids (see createChatFeed and announcement_chat.html).
export function revealAnnouncementForEvent(messagesEl, eventId) {
  const row = [...messagesEl.querySelectorAll('[data-event-ids]')]
    .find((el) => el.dataset.eventIds.split(' ').includes(String(eventId)));
  if (!row) return false;
  messagesEl.scrollTop += row.getBoundingClientRect().top - messagesEl.getBoundingClientRect().top - 16;
  const link = row.querySelector(`[data-event-card="${CSS.escape(String(eventId))}"] a.ocs__btn`);
  if (link) {
    link.classList.add('accent', 'fill');
    link.focus({ preventScroll: true });
    window.setTimeout(() => link.classList.remove('accent', 'fill'), HIGHLIGHT_MS);
  }
  return true;
}

/* ── Event card ──────────────────────────────────────────────────────── */

// The card shown under an announcement that created calendar events: an
// ocs__callout, with ocs__keypoints spacing its rows. Everyone can open the
// event on the OCS calendar; teachers can also take it back off the class
// calendar. The card sits in a plain [data-event-card] wrapper so the period
// filter can hide it: ocs__keypoints sets display, which beats `hidden`.


function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const statusPill = (tone, text) => el('span', `ocs__status-pill ocs__status-pill--${tone}`, text);

// Event titles are shown as plain text. A title saved from rich text can carry
// HTML (a pasted <span style="…">…</span>), so only its words are shown. Only a
// title that looks like markup (a closing tag or an entity) is read as HTML: a
// typed title such as "ArrayList<Integer> practice" stays exactly as typed.
const LOOKS_LIKE_MARKUP = /<\/[a-z][\w-]*\s*>|&(#\d+|#x[\da-f]+|[a-z]+\d*);/i;
function plainTitle(title) {
  const raw = String(title ?? '');
  const text = LOOKS_LIKE_MARKUP.test(raw)
    ? new DOMParser().parseFromString(raw, 'text/html').body.textContent
    : raw;
  return text.replace(/\s+/g, ' ').trim();
}

// The teacher's details, one line per line they typed (<br>, not CSS).
function detailsBlock(text) {
  const block = el('div');
  String(text).split('\n').forEach((line, i) => {
    if (i) block.appendChild(document.createElement('br'));
    block.appendChild(document.createTextNode(line));
  });
  return block;
}

function viewOnCalendarLink(calendarUrl) {
  const link = el('a', 'ocs__btn ocs__btn--icon small pill');
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
    if (!window.confirm(`Remove "${plainTitle(event.title)}" from the class calendar?`)) return;
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

function renderCard(event, { store, isTeacher, calendarUrl }) {
  const wrapper = el('div');
  wrapper.dataset.eventCard = event.id;
  wrapper.dataset.periods = (event.periods || []).join(' ');
  const card = el('div', 'ocs__callout ocs__keypoints');

  const date = statusPill('good', formatShortDate(event.date));
  const title = el('strong', '', plainTitle(event.title));
  const heading = el('div', 'ocs__links');
  heading.append(date, title);

  const tags = el('div', 'ocs__links');
  const status = el('span', '', 'On class calendar');
  tags.append(
    statusPill('neutral', PRIORITY_LABELS[event.priority] || event.priority),
    statusPill('neutral', TYPE_LABELS[event.type] || event.type),
  );
  if (event.periods?.length) tags.appendChild(el('span', 'ocs__status-pill', formatPeriods(event.periods)));
  tags.appendChild(status);
  card.append(heading, tags);
  if (event.description) card.appendChild(detailsBlock(event.description));

  // A removed event stays in the announcement, struck through.
  const markRemoved = () => {
    date.className = 'ocs__status-pill ocs__status-pill--neutral';
    title.replaceChildren(el('s', '', plainTitle(event.title)));
    status.textContent = 'Removed from calendar';
  };

  const actions = el('div', 'ocs__links');
  actions.appendChild(viewOnCalendarLink(calendarUrl));
  if (isTeacher()) actions.appendChild(removeButton(event, store, markRemoved, status));
  card.appendChild(actions);

  wrapper.appendChild(card);
  if (store()?.status(event.id) === 'removed') markRemoved();
  return wrapper;
}

// context: { store: () => calendarStore, isTeacher: () => bool, calendarUrl }
export function renderEventCards(events, context) {
  const list = el('div');
  [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((event) => list.appendChild(renderCard(event, context)));
  return list;
}

// Hide cards for other class periods when the viewer picks a period ("all" = show every card).
export function markCardsForPeriod(container, period) {
  container.querySelectorAll('[data-event-card]').forEach((card) => {
    const periods = card.dataset.periods ? card.dataset.periods.split(' ') : [];
    card.hidden = !eventMatchesPeriod({ periods }, period);
  });
}

/* ── Calendar strip ──────────────────────────────────────────────────── */

// A compact, read-only look at one school week as an ocs__table. Used above
// the announcements and inside the calendar card (calendar-card.js). Options:
//   slot / host     append a new ocs__card to `slot`, or fill an existing element `host`
//   feed            announcements only: revealEvent(id) for clicks, onMessage(listener) to refresh
//   onSelectEvent   called with (event, link) on click instead of feed.revealEvent
//   showEmpty       say so when a week has no events
// The table has one column per school day. When the strip is narrower than
// NARROW_WIDTH (a sidebar, a phone) it shows one row per day instead, decided
// from its own width, so it fits wherever it is placed without any CSS.
// Events for other class periods are left out when getPeriod() returns a period.


const MAX_EVENTS_PER_DAY = 3;
// Below this strip width a day's column would hold only a few letters of a
// name, so the strip shows a row per day instead.
const NARROW_WIDTH = 640;   // px

function weekRangeLabel(week) {
  const format = (iso) => fromIsoDate(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `Week ${week.index} · ${format(week.monday)} – ${format(week.friday)}`;
}

// Fits text into `width` pixels in the element's own font, cutting it with
// "…" when it is too long. This keeps each event on one line: OCS has no
// ellipsis class for a pill, and the strip adds no CSS of its own.
let textRuler = null;
function fitText(text, element, width) {
  textRuler = textRuler || document.createElement('canvas').getContext('2d');
  const style = getComputedStyle(element);
  textRuler.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const fits = (candidate) => textRuler.measureText(candidate).width <= width;
  if (fits(text)) return text;
  // Cut by whole characters, so an emoji is never split in half.
  const chars = Array.from(text);
  const cutAt = (count) => `${chars.slice(0, count).join('').trimEnd()}…`;
  let low = 0;
  let high = chars.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (fits(cutAt(mid))) low = mid;
    else high = mid - 1;
  }
  return cutAt(low);
}

// The width a pill's text can use: its cell's content box minus the pill's
// own padding and border.
function pillTextRoom(pill) {
  const cell = getComputedStyle(pill.closest('td'));
  const own = getComputedStyle(pill);
  const px = (value) => parseFloat(value) || 0;
  return pill.closest('td').clientWidth
    - px(cell.paddingLeft) - px(cell.paddingRight)
    - px(own.paddingLeft) - px(own.paddingRight)
    - px(own.borderLeftWidth) - px(own.borderRightWidth);
}

export function mountWeekView({
  slot, host, weeks, getStore, getPeriod = () => 'all', feed, onSelectEvent, showEmpty = false,
}) {
  const today = todayIso();
  const thisWeek = findSchoolWeek(weeks, today);
  let week = thisWeek;

  // Inside a host (the calendar card) the strip adds no card of its own.
  // The Today button sits in a plain wrapper: ocs__btn sets display, which
  // would beat the hidden attribute.
  const root = host || document.createElement('div');
  if (!host) root.className = 'ocs__card';
  const body = document.createElement('div');
  body.className = 'ocs__keypoints';
  body.innerHTML = `
    <div class="ocs__links">
      <button type="button" class="ocs__btn small pill" data-step="-1" aria-label="Previous week"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
      <button type="button" class="ocs__btn small pill" data-step="1" aria-label="Next week"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
      <span data-hook="week-today" hidden><button type="button" class="ocs__btn small pill">Today</button></span>
      <strong data-hook="week-title"></strong>
      <span class="ocs__text" data-hook="week-note"></span>
    </div>
    <div class="ocs__table-wrap"><table class="ocs__table"></table></div>
    <div class="ocs__text" data-hook="week-empty" hidden>Nothing on the calendar this week.</div>`;
  root.appendChild(body);
  if (!host) slot.appendChild(root);
  const table = body.querySelector('table');
  let narrow = false;
  let days = [];
  let openDays = new Set();   // days whose "+N more" is open

  // One pill per event, on one line: the name cut to fit with "…", and the
  // whole name with its periods in the tooltip. Daily plans are neutral so
  // what is due, graded, or a check-in stands out in the accent color.
  function eventPill(event) {
    const name = plainTitle(event.title);
    const label = [name, formatPeriods(event.periods)].filter(Boolean).join(' · ');
    const tone = event.type === 'daily plan' ? 'neutral' : 'good';
    const pill = el('a', `ocs__status-pill ocs__status-pill--${tone}`);
    pill.href = '#';
    pill.dataset.fullText = name;
    pill.title = label;
    pill.setAttribute('aria-label', label);
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      if (onSelectEvent) onSelectEvent(event, pill);
      else if (feed && !feed.revealEvent(event.id)) pill.title = `${label}: no announcement for this one`;
    });
    return pill;
  }

  // ocs__keypoints spaces a day's rows, and each ocs__keypoint holds one pill
  // at the start of the cell.
  function stackRow(child) {
    const row = el('div', 'ocs__keypoint');
    row.appendChild(child);
    return row;
  }

  // Today's date sits in an accent pill, the way calendar apps circle it.
  // A no-break space keeps the weekday and date together in a narrow column.
  function dayHeading(day, scope) {
    const heading = document.createElement('th');
    heading.scope = scope;
    const date = fromIsoDate(day.date).getDate();
    heading.append(`${day.label}\u00a0`);
    if (day.date === today) {
      heading.setAttribute('aria-current', 'date');
      const pill = statusPill('good', String(date));
      pill.title = 'Today';
      heading.appendChild(pill);
    } else {
      heading.appendChild(el('b', '', String(date)));
    }
    return heading;
  }

  function dayCell({ day, dayEvents, closedReason }) {
    const cell = document.createElement('td');
    const stack = el('div', 'ocs__keypoints');
    if (closedReason) stack.appendChild(stackRow(statusPill('neutral', closedReason)));
    const open = openDays.has(day.date);
    (open ? dayEvents : dayEvents.slice(0, MAX_EVENTS_PER_DAY))
      .forEach((event) => stack.appendChild(stackRow(eventPill(event))));
    if (dayEvents.length > MAX_EVENTS_PER_DAY) {
      const more = el('a', 'ocs__status-pill ocs__status-pill--neutral',
        open ? 'Show less' : `+${dayEvents.length - MAX_EVENTS_PER_DAY} more`);
      more.href = '#';
      more.dataset.dayToggle = day.date;
      more.setAttribute('aria-expanded', String(open));
      more.addEventListener('click', (e) => {
        e.preventDefault();
        if (open) openDays.delete(day.date);
        else openDays.add(day.date);
        render();
        // render() rebuilds the table, so put focus back on this day's toggle.
        table.querySelector(`[data-day-toggle="${day.date}"]`)?.focus();
      });
      stack.appendChild(stackRow(more));
    }
    if (stack.children.length) cell.appendChild(stack);
    return cell;
  }

  // The column widths and valign="top" are plain HTML table attributes: OCS
  // has no class for equal columns or top-aligned cells, and the strip adds
  // no CSS. Wide: a header row of days over one row of pills, each day an
  // equal share of the width. Narrow: a row per day, the day as narrow as its
  // label and the pills taking the rest.
  function columns(widths) {
    const group = document.createElement('colgroup');
    widths.forEach(([span, width]) => {
      const column = document.createElement('col');
      column.span = span;
      if (width) column.setAttribute('width', width);
      group.appendChild(column);
    });
    return group;
  }

  function render() {
    table.replaceChildren();
    if (narrow) {
      table.appendChild(columns([[1, '1%'], [1, '']]));
      const rows = table.createTBody();
      days.forEach((d) => {
        const row = rows.insertRow();
        row.setAttribute('valign', 'top');
        row.append(dayHeading(d.day, 'row'), dayCell(d));
      });
    } else {
      table.appendChild(columns([[days.length || 5, `${100 / (days.length || 5)}%`]]));
      const headings = table.createTHead().insertRow();
      const cells = table.createTBody().insertRow();
      cells.setAttribute('valign', 'top');
      days.forEach((d) => { headings.appendChild(dayHeading(d.day, 'col')); cells.appendChild(dayCell(d)); });
    }
    fitPills();
  }

  // Pills start empty so a long name can't widen its column, then each one
  // gets as much of its name as fits.
  function fitPills() {
    const pills = [...table.querySelectorAll('[data-full-text]')];
    pills.forEach((pill) => { pill.textContent = ''; });
    const rooms = pills.map(pillTextRoom);
    pills.forEach((pill, i) => { pill.textContent = fitText(pill.dataset.fullText, pill, rooms[i]); });
  }

  async function refresh() {
    if (!week) return;
    body.querySelector('[data-hook="week-title"]').textContent = weekRangeLabel(week);
    body.querySelector('[data-hook="week-note"]').textContent = [week.theme, week.notes].filter(Boolean).join(' · ');
    body.querySelector('[data-hook="week-today"]').hidden = week === thisWeek;
    const store = getStore();
    const [allEvents, breaks] = await Promise.all([
      store.listRange(week.monday, week.friday),
      store.listBreaks().catch(() => []),
    ]);
    const events = allEvents.filter((event) => eventMatchesPeriod(event, getPeriod()));
    const breakByDate = new Map(breaks.map((b) => [b.date, b.name]));
    days = schoolWeekDays(week).map((day) => ({
      day,
      closedReason: day.closedReason || breakByDate.get(day.date) || '',
      dayEvents: events.filter((e) => e.date === day.date),
    }));
    render();
    body.querySelector('[data-hook="week-empty"]').hidden = !showEmpty || events.length > 0;
  }

  const load = () => refresh().catch((err) => console.error('Calendar: strip load failed', err));
  body.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      week = neighborWeek(weeks, week, Number(button.dataset.step)) || week;
      openDays = new Set();
      load();
    });
  });
  body.querySelector('[data-hook="week-today"] button').addEventListener('click', () => {
    week = thisWeek;
    openDays = new Set();
    load();
  });

  // Switch between the wide and narrow table when the strip's own width
  // crosses NARROW_WIDTH, and refit the pills whenever the width changes.
  const isNarrow = () => body.clientWidth > 0 && body.clientWidth < NARROW_WIDTH;
  narrow = isNarrow();
  let lastWidth = body.clientWidth;
  const resize = 'ResizeObserver' in window ? new ResizeObserver(() => {
    if (body.clientWidth === lastWidth) return;
    lastWidth = body.clientWidth;
    if (isNarrow() !== narrow) { narrow = !narrow; render(); } else fitPills();
  }) : null;
  resize?.observe(body);
  // The pills are measured in the page's web font; measure again once it has loaded.
  document.fonts?.ready.then(fitPills);

  const unsubscribe = getStore().subscribe(load);
  const unlisten = feed ? feed.onMessage(({ events }) => { if (events.length) load(); }) : () => {};
  load();

  return {
    refresh: load,
    unmount() {
      unsubscribe();
      unlisten();
      resize?.disconnect();
      if (host) body.remove(); else root.remove();
    },
  };
}
