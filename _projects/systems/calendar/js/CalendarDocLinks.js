// ============================================
// CalendarDocLinks.js
// RESPONSIBILITY: Link a site doc to a calendar event.
// This module does ONE thing: read and write the doc link stored with an event.
// It does NOT: make API calls, render modals, or touch the DOM.
//
// The Spring CalendarEvent has no doc column, so the link is kept as the last
// line of the description ("Linked doc: <url>"). Sprint sync already puts lesson
// URLs in descriptions, so a same-site URL there counts as the linked doc too.
// ============================================

export const DOC_LINK_PREFIX = 'Linked doc:';

const DOC_LINK_LINE = /(?:\s|<br\s*\/?>)*Linked doc:\s*(\S+)\s*$/i;
const BARE_URL = /https?:\/\/[^\s<>"']+/gi;

/**
 * Turn a pasted link or a site path into an absolute http(s) URL.
 * @param {string} value - e.g. "/csa/calendar-card" or "https://..."
 * @param {string} origin - window.location.origin, used to resolve site paths
 * @returns {string} absolute URL, or '' when the value is not a web link
 */
export function normalizeDocUrl(value, origin) {
  const text = String(value || '').trim();
  // A site path or a full link; anything else (a half-typed title) is not a link.
  if (!/^(\/|https?:\/\/)/i.test(text)) return '';
  try {
    const url = new URL(text, origin);
    // Only web links: a "javascript:" or "data:" href must never reach the modal.
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch (error) {
    return '';
  }
}

/**
 * Separate the linked doc from the rest of an event description.
 * @param {string} description - description as stored by the backend
 * @param {string} origin - window.location.origin, to recognise sprint-synced lesson URLs
 * @returns {{body: string, docUrl: string}}
 */
export function splitLinkedDoc(description, origin) {
  const text = String(description || '');
  const match = text.match(DOC_LINK_LINE);
  if (match) {
    return { body: text.slice(0, match.index).trimEnd(), docUrl: normalizeDocUrl(match[1], origin) };
  }
  // Sprint-synced events carry the lesson URL inside the text; leave the text as is.
  const siteUrl = (text.match(BARE_URL) || []).find(url => normalizeDocUrl(url, origin).startsWith(`${origin}/`));
  return { body: text, docUrl: siteUrl ? normalizeDocUrl(siteUrl, origin) : '' };
}

/**
 * Put a linked doc back into an event description.
 * @param {string} body - description text without the doc line
 * @param {string} docUrl - absolute doc URL, or '' for none
 * @returns {string}
 */
export function joinLinkedDoc(body, docUrl) {
  const text = String(body || '').trimEnd();
  if (!docUrl || text.includes(docUrl)) return text;
  return text ? `${text}\n${DOC_LINK_PREFIX} ${docUrl}` : `${DOC_LINK_PREFIX} ${docUrl}`;
}

/**
 * Read the "start an event from this doc" request a doc page puts in the URL.
 * @param {string} search - window.location.search, e.g. "?doc=/csa/x&title=X"
 * @param {string} origin - window.location.origin
 * @returns {{docUrl: string, title: string} | null}
 */
export function readDocLaunchParams(search, origin) {
  const params = new URLSearchParams(search || '');
  const docUrl = normalizeDocUrl(params.get('doc'), origin);
  // Only this site's docs, so a shared link can't pre-fill an outside URL.
  if (!docUrl.startsWith(`${origin}/`)) return null;
  return { docUrl, title: String(params.get('title') || '').trim() };
}
