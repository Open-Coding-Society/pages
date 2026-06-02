// assets/js/ocs-bot/api.js
// -----------------------------------------------------------------------------
// Networking layer. Three concerns, all fail-safe:
//   1. chat()      — POST to the Flask Groq proxy, returns assistant text.
//   2. whoAmI()    — detect the logged-in OCS user (for per-user chat saving).
//   3. remote*()   — OPTIONAL server-side conversation sync. Every call is
//                    best-effort: if the /api/chat endpoints aren't deployed,
//                    or the user is a guest, these return null/false and the
//                    caller falls back to localStorage. They never throw.
// -----------------------------------------------------------------------------

import {
  GROQ_ENDPOINT, WHOAMI_ENDPOINT, CHAT_API_BASE,
  DEFAULT_MODEL, FETCH_TIMEOUT, ENABLE_BACKEND_SYNC,
} from './config.js';

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

// ─── Chat completion (Groq via Flask) ────────────────────────────────────────
// `messages` is an OpenAI-style array: [{role:'system'|'user'|'assistant', content}]
export async function chat({ messages, model = DEFAULT_MODEL, temperature = 0.6, signal }) {
  const res = await withTimeout(
    fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // No credentials needed — the proxy is public and holds the key server-side.
      body: JSON.stringify({ messages, model, temperature, max_tokens: 1200 }),
      signal,
    }),
    FETCH_TIMEOUT
  );

  let data = {};
  try { data = await res.json(); } catch (_e) { /* ignore */ }

  if (!res.ok || data.success === false) {
    const detail = `${data.error || ''} ${data.details || ''}`.toLowerCase();
    if (res.status === 429 || detail.includes('rate limit')) {
      throw new Error("I'm getting a lot of questions right now — give me a few seconds and try again.");
    }
    if (res.status === 500 && detail.includes('groq_api_key')) {
      throw new Error('The assistant isn’t configured on the server yet (missing API key). Please let an OCS admin know.');
    }
    const msg = data.error || data.message || `The assistant is unavailable right now (HTTP ${res.status}). Please try again.`;
    throw new Error(msg);
  }
  // Enhanced endpoint -> {response}; original endpoint -> OpenAI shape.
  const text =
    (typeof data.response === 'string' && data.response) ||
    data?.choices?.[0]?.message?.content ||
    '';
  if (!text) throw new Error('The assistant returned an empty reply. Try rephrasing.');
  return text.trim();
}

// ─── Who am I (login detection) ──────────────────────────────────────────────
// Returns a normalized user object, or null if not signed in / backend down.
export async function whoAmI() {
  try {
    const res = await withTimeout(
      fetch(WHOAMI_ENDPOINT, {
        method: 'GET',
        credentials: 'include', // send the JWT cookie
        headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
      }),
      12000
    );
    if (!res.ok) return null; // 401 = guest
    const u = await res.json();
    if (!u || (u.id == null && !u.uid && !u.email)) return null;
    return {
      id: u.id != null ? String(u.id) : (u.uid || u.email),
      uid: u.uid || null,
      name: u.name || u.uid || 'there',
      firstName: (u.name || '').trim().split(/\s+/)[0] || (u.uid || ''),
      email: u.email || null,
      role: u.role || null,
      isAdmin: !!u.is_admin,
      isTeacher: !!u.is_teacher,
    };
  } catch (_e) {
    return null;
  }
}

// ─── Optional server-side conversation sync ──────────────────────────────────
// All of these resolve to a safe value on any failure (never throw).

async function safeJson(promise) {
  try {
    const res = await withTimeout(promise, 12000);
    if (!res.ok) return { ok: false, status: res.status };
    const data = await res.json().catch(() => null);
    return { ok: true, data };
  } catch (_e) {
    return { ok: false, status: 0 };
  }
}

const credHeaders = { 'Content-Type': 'application/json', 'X-Origin': 'client' };
const credInit = (method, body) => ({
  method,
  credentials: 'include',
  headers: credHeaders,
  body: body ? JSON.stringify(body) : undefined,
});

export async function remoteList() {
  if (!ENABLE_BACKEND_SYNC) return null;
  const r = await safeJson(fetch(CHAT_API_BASE, credInit('GET')));
  return r.ok && Array.isArray(r.data) ? r.data : null;
}

export async function remoteGet(id) {
  if (!ENABLE_BACKEND_SYNC) return null;
  const r = await safeJson(fetch(`${CHAT_API_BASE}/${id}`, credInit('GET')));
  return r.ok ? r.data : null;
}

export async function remoteCreate(title) {
  if (!ENABLE_BACKEND_SYNC) return null;
  const r = await safeJson(fetch(CHAT_API_BASE, credInit('POST', { title })));
  return r.ok ? r.data : null;
}

export async function remoteAddMessage(id, role, content) {
  if (!ENABLE_BACKEND_SYNC) return null;
  const r = await safeJson(fetch(`${CHAT_API_BASE}/${id}/messages`, credInit('POST', { role, content })));
  return r.ok ? r.data : null;
}

export async function remoteRename(id, title) {
  if (!ENABLE_BACKEND_SYNC) return false;
  const r = await safeJson(fetch(`${CHAT_API_BASE}/${id}`, credInit('PUT', { title })));
  return r.ok;
}

export async function remoteDelete(id) {
  if (!ENABLE_BACKEND_SYNC) return false;
  const r = await safeJson(fetch(`${CHAT_API_BASE}/${id}`, credInit('DELETE')));
  return r.ok;
}
