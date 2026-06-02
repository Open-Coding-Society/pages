// assets/js/ocs-bot/tools.js
// -----------------------------------------------------------------------------
// Parses the navigation protocol out of assistant text. The model emits
// `[[GO:/path|Label]]` tokens; we strip them from the visible message and turn
// them into validated, clickable navigation chips. Only safe, internal paths
// are accepted (must start with "/" — never javascript:, data:, or external).
// -----------------------------------------------------------------------------

import { NAV_INDEX } from './knowledge.js';

const KNOWN = new Set(NAV_INDEX.map((e) => e.path.replace(/\/$/, '')));
const TOKEN = /\[\[GO:\s*([^|\]]+?)\s*(?:\|\s*([^\]]+?))?\s*\]\]/g;

function isSafeInternal(path) {
  if (typeof path !== 'string') return false;
  const p = path.trim();
  // internal absolute path only
  if (!p.startsWith('/')) return false;
  if (p.startsWith('//')) return false; // protocol-relative
  if (/[\s<>"'`]/.test(p)) return false;
  if (/^\/+javascript:/i.test(p)) return false;
  return true;
}

// Returns { clean, actions: [{path, label}] }
export function parseActions(text) {
  const actions = [];
  const seen = new Set();
  const clean = String(text || '')
    .replace(TOKEN, (_m, rawPath, rawLabel) => {
      const path = (rawPath || '').trim();
      if (!isSafeInternal(path)) return '';
      const norm = path.replace(/\/$/, '');
      if (seen.has(norm)) return '';
      seen.add(norm);
      // Prefer the model's label; fall back to the directory name.
      const known = NAV_INDEX.find((e) => e.path.replace(/\/$/, '') === norm);
      const label = (rawLabel || '').trim() || (known ? known.name : 'Open page');
      actions.push({ path, label, known: KNOWN.has(norm) });
      return '';
    })
    // tidy up any double spaces / dangling spaces left where tokens were
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { clean, actions: actions.slice(0, 3) };
}

// Resolve a site-root-relative path to a full href, honoring Jekyll baseurl
// if the host page exposes one (window.OCS_BASEURL). baseurl is "" in prod.
export function hrefFor(path) {
  const base = (typeof window !== 'undefined' && window.OCS_BASEURL) || '';
  if (/^https?:\/\//i.test(path)) return path;
  return base.replace(/\/$/, '') + path;
}
