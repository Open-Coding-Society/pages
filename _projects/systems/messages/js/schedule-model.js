// What "Add to calendar" needs from a message, as pure functions: its text without the
// markup, a guess at the date and time it mentions, and the request Spring's calendar
// takes. No DOM and no requests, so every rule can be tested on its own.

// Spring stores a calendar event's title and description in varchar(255) columns.
const FIELD_LIMIT = 255;
export const MAX_TITLE_LENGTH = 120;

const MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4,
  jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

// A message body is stored as sanitized HTML. This is only for suggesting text the person
// will read and edit, and what comes out is never put back into the page as markup.
export function plainText(html) {
  return String(html ?? '')
    .replace(/<\s*(br|\/p|\/div|\/li)\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, entity => ENTITIES[entity])
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const pad = number => String(number).padStart(2, '0');

// A calendar date as YYYY-MM-DD from the local fields, not toISOString, which is UTC and
// would name tomorrow for anyone behind it in the evening.
export function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// A date built from parts only if those parts are a real day (no February 30th).
function realDate(year, month, day) {
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

// With no year given, a day that has already passed this year means next year's.
function withoutYear(month, day, today) {
  const thisYear = realDate(today.getFullYear(), month, day);
  if (!thisYear) return null;
  return thisYear < today ? realDate(today.getFullYear() + 1, month, day) : thisYear;
}

const fullYear = value => (value < 100 ? 2000 + value : value);

// The first date a message mentions, as YYYY-MM-DD, or null. Looks for 2026-11-20, 11/20,
// Nov 20, today, tomorrow and a weekday ("Friday" is the next one; "next Friday" the one a
// week after that). `now` is the clock, so a test can fix it.
export function guessEventDate(text, now = new Date()) {
  const lower = String(text ?? '').toLowerCase();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const iso = lower.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) {
    const date = realDate(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    if (date) return dateKey(date);
  }

  const named = lower.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b(?:,?\s+(\d{4}))?/,
  );
  if (named) {
    const month = MONTHS[named[1]];
    const date = named[3]
      ? realDate(Number(named[3]), month, Number(named[2]))
      : withoutYear(month, Number(named[2]), today);
    if (date) return dateKey(date);
  }

  const slashed = lower.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?\b/);
  if (slashed) {
    const month = Number(slashed[1]) - 1;
    const day = Number(slashed[2]);
    const date = slashed[3]
      ? realDate(fullYear(Number(slashed[3])), month, day)
      : withoutYear(month, day, today);
    if (date) return dateKey(date);
  }

  if (/\btoday\b/.test(lower)) return dateKey(today);
  if (/\btomorrow\b/.test(lower)) return dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

  const weekday = lower.match(/\b(next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if (weekday) {
    const ahead = (WEEKDAYS.indexOf(weekday[2]) - today.getDay() + 7) % 7 || 7;
    const days = weekday[1] ? ahead + 7 : ahead;
    return dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days));
  }
  return null;
}

// The first time of day a message mentions, as HH:MM (24-hour) for an <input type=time>,
// or null: "3pm", "3:30 pm", "15:00", "noon".
export function guessEventTime(text) {
  const lower = String(text ?? '').toLowerCase();
  const meridiem = lower.match(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*([ap])\.?m\b\.?/);
  if (meridiem) {
    const hour = Number(meridiem[1]) % 12 + (meridiem[3] === 'p' ? 12 : 0);
    return `${pad(hour)}:${meridiem[2] || '00'}`;
  }
  const twentyFour = lower.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (twentyFour) return `${pad(Number(twentyFour[1]))}:${twentyFour[2]}`;
  if (/\bnoon\b/.test(lower)) return '12:00';
  return null;
}

// "15:30" -> "3:30 PM". Written out rather than left to the browser's locale, so the
// words saved in the calendar don't change with whoever's computer made them.
export function clockLabel(time) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(time ?? ''));
  if (!match) return '';
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour < 12 ? 'AM' : 'PM'}`;
}

// "2026-11-20" -> "Fri, Nov 20", for telling the person where it went.
export function dateLabel(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key ?? ''));
  if (!match) return '';
  const date = realDate(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
}

const clip = (value, limit) => (value.length <= limit ? value : `${value.slice(0, limit - 1).trimEnd()}…`);

// The calendar page shows an event's description as HTML, so a "<" in it can start a tag.
// What this feature writes is plain text for people to read, so each "<" is written as the
// entity the page's own editor stores for one. Nothing else needs it: only a "<" starts a
// tag, and an entity never does. Every "<" grows by this many characters.
const LT_ENTITY = '&lt;';
const LT_GROWTH = LT_ENTITY.length - 1;
const noMarkup = value => value.replace(/</g, LT_ENTITY);

// A starting title: the message's first sentence, or all of it when that is short.
// `text` is a stored message body, HTML or plain, and is turned into text here, once: pass
// the body itself, never text that has already been through plainText(), because a second
// pass decodes what the first one left behind ("&amp;lt;" becomes "&lt;", then "<").
export function suggestTitle(text, limit = 80) {
  const flat = plainText(text).replace(/\s+/g, ' ').trim();
  if (!flat) return '';
  const sentence = flat.match(/^(.{12,}?[.!?])(?:\s|$)/);
  return clip(sentence ? sentence[1] : flat, limit);
}

// The body of Spring's POST /api/calendar/add_event for one message. `individual` is
// left out on purpose: left out, Spring files the event under whoever is signed in; set
// to '' it would show the event to everyone, which a private message must never do.
// `text` is the stored message body, converted here once (see suggestTitle). The note
// that comes out of it never holds a raw "<", whatever the message said.
export function buildCalendarEvent({ title, date, time = '', text = '', chatUrl = '' }) {
  const cleanTitle = String(title ?? '').replace(/\s+/g, ' ').trim();
  if (!cleanTitle) throw new Error('An event needs a title.');
  if (!realDateFromKey(date)) throw new Error('An event needs a date.');
  const clock = clockLabel(time);

  const head = clock ? `Time: ${clock}` : '';
  const tail = chatUrl ? `From a chat: ${chatUrl}` : '';
  const overhead = [head, tail].filter(Boolean).join('\n\n').length + (head && tail ? 0 : 0);
  const room = Math.max(0, FIELD_LIMIT - overhead - 4); // 4 for the blank lines between parts
  const flat = plainText(text).replace(/\s+/g, ' ');
  // Escaping makes the note longer, so the cut leaves room for every "<" there might be.
  const noteRoom = room - LT_GROWTH * (flat.match(/</g) || []).length;
  const note = noteRoom < 1 ? '' : noMarkup(clip(flat, noteRoom));

  return {
    title: clip(clock ? `${cleanTitle} · ${clock}` : cleanTitle, FIELD_LIMIT),
    date,
    description: [head, note, tail].filter(Boolean).join('\n\n'),
    type: 'event',
    period: 'Personal',
  };
}

function realDateFromKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key ?? ''));
  return match ? realDate(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}
