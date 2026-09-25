// Pure logic for the announcement ↔ calendar demo (no DOM, no network):
// event options shared by both versions, school-week dates, the V2 quick
// syntax parser, and the text markers that link a message to its events.

/* ── Event options ───────────────────────────────────────────────────── */

// The event fields a teacher can set, shared by both composer versions so the
// V1 form and the V2 quick syntax stay equivalent: same types, same
// priorities, same class periods. `tags` are the #words quick syntax accepts
// (the first one is shown in the help).

export const EVENT_TYPES = [
  { value: 'event', label: 'Event', tags: ['event'] },
  { value: 'daily plan', label: 'Daily plan', tags: ['plan', 'daily-plan'] },
  { value: 'assignment', label: 'Due', tags: ['due', 'assignment'] },
  { value: 'check-in', label: 'Check-in', tags: ['check-in', 'checkin'] },
  { value: 'grade', label: 'Graded', tags: ['graded', 'grade'] },
];

// Values stay P0–P3 because that's what the OCS calendar and sprint cards
// store ("[P2] Title"); the UI shows words so they don't read as class periods.
export const PRIORITIES = [
  { value: 'P0', label: 'Urgent', tags: ['urgent'] },
  { value: 'P1', label: 'High', tags: ['high'] },
  { value: 'P2', label: 'Normal', tags: ['normal'] },
  { value: 'P3', label: 'Low', tags: ['low'] },
];
export const DEFAULT_PRIORITY = 'P2';

// Class periods 1–5. Which periods each course meets in; an event defaults
// to its course's periods and can be narrowed or widened.
export const CLASS_PERIODS = ['1', '2', '3', '4', '5'];
export const COURSES = [
  { value: 'csa', label: 'CSA', periods: ['2'] },
  { value: 'csh', label: 'CSH', periods: ['2'] },
  { value: 'csp', label: 'CSP', periods: ['3', '4'] },
  { value: 'csse', label: 'CSSE', periods: ['1'] },
];

export const TYPE_LABELS = Object.fromEntries(EVENT_TYPES.map((type) => [type.value, type.label]));
export const PRIORITY_LABELS = Object.fromEntries(PRIORITIES.map((p) => [p.value, p.label]));

export function coursePeriods(course) {
  return COURSES.find((c) => c.value === course)?.periods || [];
}

// ['3', '4'] → "Periods 3 & 4"; ['2'] → "Period 2"; [] → ""
export function formatPeriods(periods = []) {
  const sorted = [...periods].sort();
  if (!sorted.length) return '';
  if (sorted.length === 1) return `Period ${sorted[0]}`;
  return `Periods ${sorted.slice(0, -1).join(', ')} & ${sorted[sorted.length - 1]}`;
}

// An event with no periods applies to the whole class.
export function eventMatchesPeriod(event, period) {
  return period === 'all' || !event.periods?.length || event.periods.includes(period);
}

/* ── School weeks ────────────────────────────────────────────────────── */

// School-week date helpers for the announcement ↔ calendar demos.
// Pure functions over the JSON that _includes/announcement_calendar_demo.html
// embeds from _data/school_calendar.yml (same shape as _includes/calendar.html).

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKDAY_OFFSETS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

// Local-time ISO date (YYYY-MM-DD). toISOString() would shift to UTC and can
// land on the wrong day in the evening, which matters for all-day events.
export function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIsoDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso, days) {
  const date = fromIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function todayIso() {
  return toIsoDate(new Date());
}

// Monday of the calendar week containing `iso`.
export function mondayOf(iso) {
  const date = fromIsoDate(iso);
  const shift = (date.getDay() + 6) % 7; // Sun=6, Mon=0
  date.setDate(date.getDate() - shift);
  return toIsoDate(date);
}

export function dayOffset(label) {
  return WEEKDAY_OFFSETS[label];
}

// "Thu, Oct 1"
export function formatShortDate(iso) {
  return fromIsoDate(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function parseSchoolCalendar(raw) {
  const weeks = Object.entries(raw?.weeks || {})
    .map(([index, week]) => ({ index: Number(index), ...week }))
    .filter((week) => week.monday)
    .sort((a, b) => a.monday.localeCompare(b.monday));
  return { schoolYear: raw?.schoolYear || '', weeks };
}

// The school week whose Mon–Sun span contains `iso`; if `iso` falls in a gap
// (break), the next school week after it; past the end of the year, the last.
export function findSchoolWeek(weeks, iso) {
  if (!weeks.length) return null;
  const monday = mondayOf(iso);
  return weeks.find((week) => week.monday === monday)
    || weeks.find((week) => week.monday > iso)
    || weeks[weeks.length - 1];
}

export function neighborWeek(weeks, week, step) {
  const position = weeks.indexOf(week);
  return weeks[position + step] || null;
}

// Days before school starts in the week (e.g. week 0 starts Thursday) and
// Monday holidays are marked closed. `holiday_adjustment` in the YAML names the
// first school day of that week.
function firstSchoolDayOffset(week) {
  const adjustment = String(week.holidayAdjustment || '').slice(0, 3);
  const label = adjustment.charAt(0).toUpperCase() + adjustment.slice(1);
  return WEEKDAY_OFFSETS[label] ?? 0;
}

export function schoolWeekDays(week) {
  const firstOpen = firstSchoolDayOffset(week);
  const holidayName = (week.holidays || [])[0] || (firstOpen > 0 ? 'No school' : '');
  return WEEKDAY_LABELS.map((label, offset) => ({
    label,
    date: addDays(week.monday, offset),
    closed: Boolean(week.skipWeek) || offset < firstOpen,
    closedReason: week.skipWeek ? 'Break' : (offset < firstOpen ? holidayName : ''),
  }));
}

// First open school day on or after `iso` (skips weekends, closed days and breaks).
export function nextSchoolDay(weeks, iso) {
  for (let step = 0; step < 21; step += 1) {
    const candidate = addDays(iso, step);
    const week = weeks.find((w) => w.monday === mondayOf(candidate));
    if (!week) continue;
    const day = schoolWeekDays(week).find((d) => d.date === candidate);
    if (day && !day.closed) return candidate;
  }
  return iso;
}

// Quick picks for the V1 date field: tomorrow, this Friday, next week's
// first school day — all snapped to real school days.
export function quickDateChoices(weeks, iso = todayIso()) {
  const current = findSchoolWeek(weeks, iso);
  const choices = [{ label: 'Next school day', date: nextSchoolDay(weeks, addDays(iso, 1)) }];
  if (current && current.friday >= iso) choices.push({ label: 'This Fri', date: current.friday });
  const following = current && neighborWeek(weeks, current, current.monday > iso ? 0 : 1);
  if (following) {
    choices.push({ label: 'Next week', date: nextSchoolDay(weeks, following.monday) });
    choices.push({ label: 'Next Fri', date: following.friday });
  }
  return choices;
}

/* ── Quick syntax ────────────────────────────────────────────────────── */

// V2 "quick syntax": the Slack weekly-plan format teachers already use,
// parsed in the browser. The day-line regex and the asterisk markers are
// ported from Open-Coding-Society/spring CalendarEventService.extractEventsFromText
// so an announcement produces the same events a Slack post used to. On top of
// that it can set everything the V1 form can (any date, type, priority, periods):
//
//   Here's the plan for next week:     (plain text stays in the message)
//   Week of 9/28                       (or "Week 7"; optional, defaults to this school week)
//   [Mon]: Live Reviews
//   • Review project progress with teacher
//   [Wed - Thu]: ** Unit 3 Quiz        (* = high check-in, ** = urgent graded)
//   [10/9]: Unit 4 FRQ #due #low #P4   (a date, and #tags for type / priority / period)
//
// Event lines, their • details and the "Week of" line are the syntax; they
// become calendar events and are left out of the posted message.


const DAY = '(Mon|Tue|Wed|Thu|Fri|Sat|Sun)';
const DAY_LINE = new RegExp(`^\\s*\\[${DAY}(?:\\s*-\\s*${DAY})?\\]:\\s*(\\*\\*|\\*)?\\s*(.+)$`, 'i');
const DATE_LINE = /^\s*\[(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\]:\s*(\*\*|\*)?\s*(.+)$/;
const BULLET_LINE = /^\s*(\*\*|\*)?\s*[•·]\s*(.+)$|^\s*-\s+(.+)$/;
const WEEK_OF = /week of\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i;
const WEEK_NUMBER = /^\s*week\s+(\d{1,2})\b/im;
// A line that is only a week header ("Week of 9/28", "Week 7:") is syntax;
// a sentence that mentions a week ("plan for the week of 9/28") is not.
const WEEK_HEADER_LINE = /^\s*week\s+(?:of\s+\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2})\s*:?\s*$/i;
const TAG = /(^|\s)#([\w-]+)/g;
const PERIOD_TAG = /^p(\d)$/;

// Asterisks are a shortcut for priority (and, as in Slack, for the type).
const MARKERS = {
  '**': { priority: 'P0', type: 'grade' },
  '*': { priority: 'P1', type: 'check-in' },
};
const PLAIN = { priority: DEFAULT_PRIORITY, type: 'daily plan' };

const TYPE_BY_TAG = new Map(EVENT_TYPES.flatMap((type) => type.tags.map((tag) => [tag, type.value])));
const PRIORITY_BY_TAG = new Map(PRIORITIES.flatMap((p) => p.tags.map((tag) => [tag, p.value])));

const monthDay = (iso) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;

// "Insert example" shows every option at once: plain text that stays in the
// message, each way to say when (day, range, date), a description, all five
// types, all four priorities, and a period tag. Dates come from the school
// calendar (next school week, and the Friday after) so it never points at the past.
export function buildQuickSyntaxExample(weeks = [], { today = todayIso(), periods = [] } = {}) {
  const current = findSchoolWeek(weeks, today);
  const next = current && (current.monday > today ? current : neighborWeek(weeks, current, 1) || current);
  const after = next && (neighborWeek(weeks, next, 1) || next);
  const periodTag = periods.length ? ` #P${periods[periods.length - 1]}` : '';
  return [
    "Here's the plan for next week:",
    `Week of ${next ? monthDay(next.monday) : monthDay(addDays(mondayOf(today), 7))}`,
    '[Mon]: Live Reviews',
    '• Review project progress with teacher',
    '[Tue]: Guest speaker from AWS #event #high',
    '[Wed - Thu]: ** Unit 3 Quiz',
    '[Fri]: * Sprint check-in',
    `[${after ? monthDay(after.friday) : monthDay(addDays(mondayOf(today), 18))}]: Unit 4 FRQ #due #low${periodTag}`,
  ].join('\n');
}

function capitalize(label) {
  return label.charAt(0).toUpperCase() + label.slice(1, 3).toLowerCase();
}

// "9/28" has no year: pick the one that keeps it inside the school year
// ("2026-2027" → Aug–Dec is 2026, Jan–Jul is 2027).
function inferYear(month, schoolYear, today) {
  const [firstYear, secondYear] = String(schoolYear || '').split('-').map(Number);
  if (firstYear && secondYear) return month >= 7 ? firstYear : secondYear;
  return Number(today.slice(0, 4));
}

function isoFromMonthDay(month, day, year, { schoolYear, today }) {
  let fullYear = year ? Number(year) : inferYear(Number(month), schoolYear, today);
  if (fullYear < 100) fullYear += 2000;
  return toIsoDate(new Date(fullYear, Number(month) - 1, Number(day)));
}

export function resolveWeekStart(text, { weeks = [], schoolYear = '', today = todayIso() } = {}) {
  const weekOf = text.match(WEEK_OF);
  if (weekOf) {
    const iso = isoFromMonthDay(weekOf[1], weekOf[2], weekOf[3], { schoolYear, today });
    return { monday: mondayOf(iso), source: `Week of ${Number(weekOf[1])}/${Number(weekOf[2])}` };
  }
  const weekNumber = text.match(WEEK_NUMBER);
  const numbered = weekNumber && weeks.find((w) => w.index === Number(weekNumber[1]));
  if (numbered) return { monday: numbered.monday, source: `Week ${numbered.index}` };

  const current = findSchoolWeek(weeks, today);
  return { monday: current ? current.monday : mondayOf(today), source: 'this school week' };
}

function datesBetween(monday, startLabel, endLabel) {
  const start = dayOffset(startLabel);
  const end = dayOffset(endLabel);
  if (end < start) return [addDays(monday, start)];
  const dates = [];
  for (let offset = start; offset <= end; offset += 1) dates.push(addDays(monday, offset));
  return dates;
}

// "Unit 4 FRQ #due #low #P4" → { title: 'Unit 4 FRQ', type: 'assignment', priority: 'P3', periods: ['4'] }.
// Unknown tags ("Quiz #2") stay in the title. Tags win over asterisks.
function readTitleAndTags(rawTitle, marker, defaultPeriods) {
  const fields = { ...(MARKERS[marker] || PLAIN) };
  const periods = [];
  const title = rawTitle.replace(TAG, (match, lead, word) => {
    const tag = word.toLowerCase();
    const period = tag.match(PERIOD_TAG)?.[1];
    if (period && CLASS_PERIODS.includes(period)) { if (!periods.includes(period)) periods.push(period); return lead; }
    if (PRIORITY_BY_TAG.has(tag)) { fields.priority = PRIORITY_BY_TAG.get(tag); return lead; }
    if (TYPE_BY_TAG.has(tag)) { fields.type = TYPE_BY_TAG.get(tag); return lead; }
    return match;
  }).replace(/\*+\s*$/, '').replace(/\s{2,}/g, ' ').trim();
  return { title, ...fields, periods: periods.length ? periods.sort() : [...defaultPeriods] };
}

function parseEventLine(line, week, context) {
  const day = line.match(DAY_LINE);
  if (day) {
    const startLabel = capitalize(day[1]);
    const endLabel = day[2] ? capitalize(day[2]) : startLabel;
    return {
      ...readTitleAndTags(day[4], day[3], context.defaultPeriods),
      fromWeekday: true,
      dayLabel: startLabel === endLabel ? startLabel : `${startLabel}–${endLabel}`,
      dates: datesBetween(week.monday, startLabel, endLabel),
    };
  }
  const dated = line.match(DATE_LINE);
  if (dated) {
    return {
      ...readTitleAndTags(dated[5], dated[4], context.defaultPeriods),
      fromWeekday: false,
      dayLabel: `${Number(dated[1])}/${Number(dated[2])}`,
      dates: [isoFromMonthDay(dated[1], dated[2], dated[3], context)],
    };
  }
  return null;
}

// Returns one entry per event line (a range line carries several dates and
// becomes one calendar event per day, like the Slack importer did), plus
// `syntaxLines`: for each input line, whether it is syntax to leave out of
// the posted message.
export function parseQuickSyntax(text, options = {}) {
  const context = {
    schoolYear: options.schoolYear || '',
    today: options.today || todayIso(),
    defaultPeriods: options.defaultPeriods || [],
  };
  const week = resolveWeekStart(text, { ...options, ...context });
  const entries = [];
  const syntaxLines = [];
  let inEvent = false; // • lines only count as details right after an event line

  String(text || '').split(/\r?\n/).forEach((line) => {
    const entry = parseEventLine(line, week, context);
    if (entry) {
      if (entry.title) entries.push({ key: `line-${entries.length}`, description: '', ...entry });
      syntaxLines.push(true);
      inEvent = true;
      return;
    }
    const bullet = line.match(BULLET_LINE);
    const last = entries[entries.length - 1];
    if (bullet && last && inEvent) {
      const detail = (bullet[2] || bullet[3] || '').trim();
      last.description = last.description ? `${last.description}\n${detail}` : detail;
      if (MARKERS[bullet[1]]) Object.assign(last, MARKERS[bullet[1]]);
      syntaxLines.push(true);
      return;
    }
    const isHeader = WEEK_HEADER_LINE.test(line);
    syntaxLines.push(isHeader);
    if (!isHeader && line.trim()) inEvent = false;
  });

  return { weekStart: week.monday, weekSource: week.source, entries, syntaxLines };
}

/* ── Event markers ───────────────────────────────────────────────────── */

// Links a chat message to the calendar events it created.
//
// The chat sanitizer (assets/js/chat/rich-text.js) strips every attribute and
// unknown tag, so structured data can't ride along as HTML. Instead the event
// is appended as a plain-text marker, the same trick _includes/lesson_chat.html
// uses with [[lesson:<url>]], and stripped again before the message renders:
//
//   [[event:<id>|<YYYY-MM-DD>|<P0-P3>|<type>|<title>|<periods, e.g. 3,4>|<description>]]
//
// type, title and description are URL-encoded. The last two fields are
// optional so older markers still parse.

const MARKER_PATTERN = /\[\[event:([^|\]]+)\|(\d{4}-\d{2}-\d{2})\|(P[0-3])\|([^|\]]*)\|([^|\]]*)(?:\|([\d,]*))?(?:\|([^\]]*))?\]\]/g;

function safeDecode(value) {
  try { return decodeURIComponent(value || ''); } catch (_) { return value || ''; }
}

export function encodeEventMarker(event) {
  const fields = [
    event.id,
    event.date,
    event.priority || 'P2',
    encodeURIComponent(event.type || 'event'),
    encodeURIComponent(event.title),
    (event.periods || []).join(','),
    encodeURIComponent(event.description || ''),
  ];
  return `[[event:${fields.join('|')}]]`;
}

export function appendEventMarkers(html, events) {
  if (!events.length) return html;
  return `${html} ${events.map(encodeEventMarker).join(' ')}`;
}

// → { html: message without markers, events: [{ id, date, priority, type, title, periods, description }] }
export function extractEventMarkers(raw) {
  const events = [];
  const html = String(raw || '').replace(MARKER_PATTERN, (_, id, date, priority, type, title, periods, description) => {
    events.push({
      id,
      date,
      priority,
      type: safeDecode(type),
      title: safeDecode(title),
      periods: periods ? periods.split(',').filter(Boolean) : [],
      description: safeDecode(description),
    });
    return '';
  }).replace(/(?:\s|<br>)+$/g, '').trim();
  return { html, events };
}

/* ── HTML escaping ───────────────────────────────────────────────────── */

// Escape user-typed text before it goes into an innerHTML template.
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
