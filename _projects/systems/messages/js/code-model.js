// A code block in a message, as the [[code:<language>|<code>]] marker at the start of its
// body (after a reply's marker and before a files marker's place, which a code message
// doesn't have). The sanitizer keeps no <pre>, so the code travels as marker text and the
// log draws it with textContent: nothing in it is ever read as HTML. Only the characters the
// marker and HTML use are escaped (%XX), so code keeps its spaces and newlines readable.

export const CODE_LANGUAGES = Object.freeze([
  { id: 'python', label: 'Python', extension: 'py' },
  { id: 'java', label: 'Java', extension: 'java' },
  { id: 'javascript', label: 'JavaScript', extension: 'js' },
  { id: 'html', label: 'HTML', extension: 'html' },
  { id: 'css', label: 'CSS', extension: 'css' },
  { id: 'sql', label: 'SQL', extension: 'sql' },
  { id: 'json', label: 'JSON', extension: 'json' },
  { id: 'bash', label: 'Shell', extension: 'sh' },
  { id: 'text', label: 'Plain text', extension: 'txt' },
]);

// The runners' languages: Flask runs Python and JavaScript, Spring runs Java (the same
// /run routes the lesson code runners call).
const RUNNABLE = new Set(['python', 'java', 'javascript']);
export const isRunnable = language => RUNNABLE.has(language);

export const languageOf = id => CODE_LANGUAGES.find(language => language.id === id) || null;

// A code block over this is better shared as a file or a gist.
export const MAX_CODE_LENGTH = 20000;

const CODE_PATTERN = /^\s*\[\[code:([a-z]+)\|([^\]]*)\]\]\s*/;
const escape = text => String(text).replace(/[%[\]|<>&\u0000-\u0008\u000b-\u001f\u007f]/g,
  character => `%${character.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);

export function addCodeMarker(html, language, code) {
  if (!languageOf(language)) throw new TypeError(`Unknown code language ${JSON.stringify(language)}`);
  return `[[code:${language}|${escape(code)}]] ${html || ''}`.trim();
}

// A body (already without its reply marker) → { language, code, html }; nulls when there is
// no code block, or one whose language isn't known.
export function extractCodeMarker(raw) {
  const text = String(raw ?? '');
  const match = text.match(CODE_PATTERN);
  if (!match || !languageOf(match[1])) return { language: null, code: null, html: text };
  let code;
  try {
    code = decodeURIComponent(match[2]);
  } catch {
    return { language: null, code: null, html: text };
  }
  return { language: match[1], code, html: text.slice(match[0].length) };
}
