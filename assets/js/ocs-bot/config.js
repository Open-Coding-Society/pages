// assets/js/ocs-bot/config.js
// -----------------------------------------------------------------------------
// Resolves where the backend lives and which endpoints to use. Mirrors the
// site's own assets/js/api/config.js convention (localhost -> :8587, else the
// production Flask host) so the chatbot talks to the SAME backend as the rest
// of pages.opencodingsociety.com. The Groq API key never touches the client —
// the Flask `/api/groq/chat` endpoint holds it server-side.
//
// Anything here can be overridden by defining `window.OCS_BOT_CONFIG` before
// this module loads, e.g. for local testing against production:
//   window.OCS_BOT_CONFIG = { apiBase: 'https://flask.opencodingsociety.com' };
// -----------------------------------------------------------------------------

const overrides = (typeof window !== 'undefined' && window.OCS_BOT_CONFIG) || {};

function resolveApiBase() {
  if (overrides.apiBase) return overrides.apiBase.replace(/\/$/, '');
  const host = (typeof location !== 'undefined' && location.hostname) || '';
  if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:8587';
  return 'https://flask.opencodingsociety.com';
}

export const API_BASE = resolveApiBase();

// Groq chat-completions proxy (returns { success, response, model, usage }).
export const GROQ_ENDPOINT = `${API_BASE}/api/groq/chat`;

// "Who am I" — returns the logged-in user (needs the JWT cookie). 401 = guest.
export const WHOAMI_ENDPOINT = `${API_BASE}/api/id`;

// Optional server-side chat history (graceful: silently unused if not deployed).
export const CHAT_API_BASE = `${API_BASE}/api/chat`;

// Default + available models (kept in sync with the Flask groq_api).
export const DEFAULT_MODEL = overrides.model || 'llama-3.3-70b-versatile';
export const FAST_MODEL = 'llama-3.1-8b-instant';

// Network timeout for completions (ms).
export const FETCH_TIMEOUT = 45000;

// Allow disabling the optional backend sync entirely.
export const ENABLE_BACKEND_SYNC = overrides.backendSync !== false;

// Where navigation chips open: '_self' (default — same tab, correct for the
// real same-origin site) or '_blank' (new tab; handy for local previews that
// serve unbuilt source).
export const NAV_TARGET = overrides.navTarget === '_blank' ? '_blank' : '_self';
