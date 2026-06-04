// assets/js/ocs-search/protocol.js
// -----------------------------------------------------------------------------
// Parses the two interactive tokens the AI emits on the search page:
//   [[ASK: Question? | Option A | Option B | Option C]]  -> a clickable survey
//   [[STEP: Title :: Why :: /path :: Button label]]       -> one learning-path step
// Both are stripped from the visible text and returned as structured data so the
// hub can render clickable survey chips and a course-style path. Paths are
// validated against the real site index (knowledge.js) so a step can never link
// to an invented URL.
// -----------------------------------------------------------------------------

import { NAV_INDEX } from '../ocs-bot/knowledge.js';

const KNOWN = new Set(NAV_INDEX.map((e) => e.path.replace(/\/$/, '')));
const ASK_RE = /\[\[ASK:\s*([\s\S]*?)\]\]/g;
const STEP_RE = /\[\[STEP:\s*([\s\S]*?)\]\]/g;

function safeInternal(p) {
  if (typeof p !== 'string') return false;
  const t = p.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return false;
  if (/[\s<>"'`]/.test(t)) return false;
  return true;
}

// Returns { text, asks: [{q, options[]}], steps: [{title, why, path, label, known}] }
export function parse(raw) {
  const asks = [];
  const steps = [];
  let text = String(raw || '');

  text = text.replace(ASK_RE, (_m, body) => {
    const parts = String(body).split('|').map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) asks.push({ q: parts[0], options: parts.slice(1, 6) });
    return '';
  });

  text = text.replace(STEP_RE, (_m, body) => {
    const parts = String(body).split('::').map((s) => s.trim());
    const title = parts[0];
    const why = parts[1] || '';
    const path = parts[2] || '';
    const label = parts[3] || 'Open page';
    if (title && safeInternal(path)) {
      steps.push({ title, why, path, label, known: KNOWN.has(path.replace(/\/$/, '')) });
    }
    return '';
  });

  text = text
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { text, asks, steps };
}
