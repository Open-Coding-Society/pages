// assets/js/ocs-bot/store.js
// -----------------------------------------------------------------------------
// Local persistence. Conversations are namespaced PER USER so that signing in
// gives you your own saved history (and a shared device never mixes accounts):
//     key = `ocs_bot_v1:<userId>`     (userId = 'guest' when signed out)
// Preferences are global. A server-sync layer (api.remote*) can attach a
// `remoteId` to a conversation; this store stays the source of truth for the
// UI and degrades gracefully when the backend isn't available.
// -----------------------------------------------------------------------------

const PREFIX = 'ocs_bot_v1:';
const PREFS_KEY = 'ocs_bot_prefs_v1';
const SCHEMA_VERSION = 1;
const MAX_CONVERSATIONS = 40;
const MAX_MESSAGES = 200;

let scopeKey = PREFIX + 'guest';

export function uid() {
  try {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  } catch (_e) { /* fall through */ }
  return 'id-' + Math.random().toString(36).slice(2) + '-' + new Date().getTime().toString(36);
}

function emptyState() {
  return { version: SCHEMA_VERSION, activeId: null, conversations: [] };
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : fallback;
  } catch (_e) {
    return fallback;
  }
}

function load() {
  let state;
  try { state = safeParse(localStorage.getItem(scopeKey), emptyState()); }
  catch (_e) { state = emptyState(); }
  if (!Array.isArray(state.conversations)) state.conversations = [];
  return state;
}

function save(state) {
  try {
    localStorage.setItem(scopeKey, JSON.stringify(state));
  } catch (_e) {
    // Quota hit — drop the oldest conversations and retry once.
    state.conversations = state.conversations
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
    try { localStorage.setItem(scopeKey, JSON.stringify(state)); } catch (_e2) { /* give up silently */ }
  }
}

// ─── Scope (which user owns this storage) ────────────────────────────────────
export function setScope(userId) {
  scopeKey = PREFIX + (userId || 'guest');
}

// ─── Conversations ───────────────────────────────────────────────────────────
export function listConversations() {
  return load().conversations.slice().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getActiveId() {
  return load().activeId;
}

export function setActiveId(id) {
  const s = load();
  s.activeId = id;
  save(s);
}

export function getConversation(id) {
  return load().conversations.find((c) => c.id === id) || null;
}

export function createConversation() {
  const s = load();
  const now = new Date().getTime();
  const convo = { id: uid(), title: 'New chat', createdAt: now, updatedAt: now, remoteId: null, messages: [] };
  s.conversations.unshift(convo);
  // Trim to cap (keep most recent).
  if (s.conversations.length > MAX_CONVERSATIONS) {
    s.conversations = s.conversations.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CONVERSATIONS);
  }
  s.activeId = convo.id;
  save(s);
  return convo;
}

export function appendMessage(conversationId, message) {
  const s = load();
  const convo = s.conversations.find((c) => c.id === conversationId);
  if (!convo) return null;
  const msg = {
    id: message.id || uid(),
    role: message.role,
    content: message.content,
    ts: message.ts || new Date().getTime(),
  };
  convo.messages.push(msg);
  if (convo.messages.length > MAX_MESSAGES) convo.messages = convo.messages.slice(-MAX_MESSAGES);
  // Auto-title from the first user message.
  if ((convo.title === 'New chat' || !convo.title) && message.role === 'user') {
    convo.title = message.content.trim().replace(/\s+/g, ' ').slice(0, 48) || 'New chat';
  }
  convo.updatedAt = msg.ts;
  save(s);
  return msg;
}

export function updateLastAssistant(conversationId, content) {
  const s = load();
  const convo = s.conversations.find((c) => c.id === conversationId);
  if (!convo) return;
  for (let i = convo.messages.length - 1; i >= 0; i--) {
    if (convo.messages[i].role === 'assistant') { convo.messages[i].content = content; break; }
  }
  convo.updatedAt = new Date().getTime();
  save(s);
}

export function setRemoteId(conversationId, remoteId) {
  const s = load();
  const convo = s.conversations.find((c) => c.id === conversationId);
  if (convo) { convo.remoteId = remoteId; save(s); }
}

export function renameConversation(id, title) {
  const s = load();
  const convo = s.conversations.find((c) => c.id === id);
  if (convo) { convo.title = (title || 'Untitled').slice(0, 60); convo.updatedAt = new Date().getTime(); save(s); }
}

export function deleteConversation(id) {
  const s = load();
  s.conversations = s.conversations.filter((c) => c.id !== id);
  if (s.activeId === id) s.activeId = s.conversations.length ? s.conversations[0].id : null;
  save(s);
}

export function clearMessages(id) {
  const s = load();
  const convo = s.conversations.find((c) => c.id === id);
  if (convo) { convo.messages = []; convo.title = 'New chat'; convo.updatedAt = new Date().getTime(); save(s); }
}

export function searchConversations(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return listConversations();
  return listConversations().filter((c) =>
    (c.title || '').toLowerCase().includes(q) ||
    c.messages.some((m) => (m.content || '').toLowerCase().includes(q))
  );
}

// ─── Preferences (global, cross-user) ────────────────────────────────────────
const DEFAULT_PREFS = { style: 'balanced', model: 'llama-3.3-70b-versatile', railOpen: false };

export function getPrefs() {
  let raw;
  try { raw = localStorage.getItem(PREFS_KEY); } catch (_e) { raw = null; }
  return Object.assign({}, DEFAULT_PREFS, safeParse(raw, {}));
}

export function setPref(key, value) {
  const prefs = getPrefs();
  prefs[key] = value;
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (_e) { /* ignore */ }
  return prefs;
}
