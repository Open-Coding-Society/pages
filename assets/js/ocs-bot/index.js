// assets/js/ocs-bot/index.js
// -----------------------------------------------------------------------------
// OCS Assistant controller. Boots the widget, wires every interaction, runs the
// chat turn (system prompt -> Groq via Flask -> typewriter render -> nav chips),
// and persists conversations per signed-in user (with optional backend sync).
// -----------------------------------------------------------------------------

import * as api from './api.js';
import * as store from './store.js';
import { buildSystemPrompt } from './prompt.js';
import { renderMarkdown } from './render.js';
import { parseActions, hrefFor } from './tools.js';
import { starterSuggestions } from './suggestions.js';
import { NAV_INDEX } from './knowledge.js';
import { DEFAULT_MODEL } from './config.js';

const $ = (id) => document.getElementById(id);
const HISTORY_TURNS = 16; // messages of context sent to the model

const SVG = (body, w = 2) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const BOT_AVATAR = SVG('<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.4" fill="currentColor"/><circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/>');
const USER_AVATAR = SVG('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>');
const ARROW = SVG('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', 2.4);
const CHEVRON = SVG('<polyline points="9 18 15 12 9 6"/>', 2.2);

// Monoline SVG icon set for suggestion chips (keyed by ids in suggestions.js).
const ICONS = {
  compass: SVG('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>'),
  book: SVG('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
  java: SVG('<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>'),
  gamepad: SVG('<line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><rect x="2" y="6" width="20" height="12" rx="4"/>'),
  layers: SVG('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
  grid: SVG('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'),
  trophy: SVG('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22"/><path d="M14 14.7V17c0 .6.5 1 1 1.2 1.2.5 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
  search: SVG('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  calendar: SVG('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  rocket: SVG('<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-4 12.9 12.9 0 0 1 11-6c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1 5 0 5 0"/><path d="M12 15v5s3-.6 4-2c1-1.6 0-5 0-5"/>'),
  cap: SVG('<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2.7 9 2.7 12 0v-5"/>'),
  terminal: SVG('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
  user: USER_AVATAR,
  spark: SVG('<path d="M12 3l1.6 4.9L18.5 9.5l-4.9 1.6L12 16l-1.6-4.9L5.5 9.5l4.9-1.6z"/>'),
};

const bot = {
  el: {},
  user: null,
  generating: false,
  abort: null,
  booted: false,
};

// ─── Boot ─────────────────────────────────────────────────────────────────
function boot() {
  if (bot.booted) return;
  const el = bot.el;
  [
    'ocsb-fab', 'ocsb-backdrop', 'ocsb-panel', 'ocsb-rail', 'ocsb-new',
    'ocsb-rail-search-input', 'ocsb-convos', 'ocsb-rail-toggle', 'ocsb-status-text',
    'ocsb-settings-btn', 'ocsb-expand', 'ocsb-close', 'ocsb-error', 'ocsb-messages',
    'ocsb-welcome', 'ocsb-welcome-greeting', 'ocsb-suggestions', 'ocsb-followups',
    'ocsb-settings', 'ocsb-set-style', 'ocsb-set-model', 'ocsb-account',
    'ocsb-account-text', 'ocsb-clear', 'ocsb-form', 'ocsb-input', 'ocsb-send',
  ].forEach((id) => { el[id] = $(id); });
  if (!el['ocsb-fab'] || !el['ocsb-panel']) return; // markup missing — bail safely
  bot.booted = true;

  wireEvents();
  applyPrefs();
  renderSuggestions();
  ensureActiveConversation();
  renderRail();
  renderActiveConversation();

  // Detect the signed-in user (async, non-blocking).
  detectUser();
}

// ─── User / scope ────────────────────────────────────────────────────────
async function detectUser() {
  const user = await api.whoAmI();
  bot.user = user;
  // Re-scope storage to this user and re-render (migrating the current view).
  store.setScope(user ? user.id : 'guest');
  ensureActiveConversation();
  renderRail();
  renderActiveConversation();
  updateAccountUI();
  if (user) {
    bot.el['ocsb-welcome-greeting'].textContent = `Hey ${user.firstName}! I'm the OCS Assistant 👋`;
    syncFromRemote(); // pull server-side history if available
  }
}

function updateAccountUI() {
  const dot = bot.el['ocsb-account'].querySelector('.ocsb-dot2');
  if (bot.user) {
    bot.el['ocsb-account-text'].innerHTML = `Signed in as <b style="color:var(--ocsb-fg)">${escapeText(bot.user.name)}</b> · chats saved to your account`;
    if (dot) dot.style.background = 'var(--ocsb-ok)';
  } else {
    bot.el['ocsb-account-text'].innerHTML = `Browsing as guest. <a href="${hrefFor('/login')}" style="color:var(--ocsb-accent)">Log in</a> to save chats across devices.`;
    if (dot) dot.style.background = 'var(--ocsb-fg-faint)';
  }
}

// ─── Events ─────────────────────────────────────────────────────────────────
function wireEvents() {
  const el = bot.el;
  el['ocsb-fab'].addEventListener('click', open);
  el['ocsb-close'].addEventListener('click', close);
  el['ocsb-backdrop'].addEventListener('click', close);
  el['ocsb-expand'].addEventListener('click', toggleExpand);
  el['ocsb-rail-toggle'].addEventListener('click', toggleRail);
  el['ocsb-settings-btn'].addEventListener('click', toggleSettings);
  el['ocsb-new'].addEventListener('click', () => { newChat(); el['ocsb-input'].focus(); });
  el['ocsb-clear'].addEventListener('click', clearCurrent);

  el['ocsb-form'].addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  el['ocsb-input'].addEventListener('input', onInput);
  el['ocsb-input'].addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  });

  el['ocsb-rail-search-input'].addEventListener('input', () => renderRail(el['ocsb-rail-search-input'].value));

  // Settings segmented controls
  el['ocsb-set-style'].addEventListener('click', (e) => segmented(e, 'set-style', 'style', 'data-style'));
  el['ocsb-set-model'].addEventListener('click', (e) => segmented(e, 'set-model', 'model', 'data-model'));

  // Delegated clicks: suggestions, nav chips, copy buttons, convo items, followups
  document.addEventListener('click', delegatedClick);

  // Esc closes; Cmd/Ctrl-K opens
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('ocsb-open')) {
      if (!el['ocsb-settings'].hidden) { toggleSettings(); return; }
      close();
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      document.body.classList.contains('ocsb-open') ? el['ocsb-input'].focus() : open();
    }
  });
}

function segmented(e, group, pref, attr) {
  const btn = e.target.closest('button[' + attr + ']');
  if (!btn) return;
  const value = btn.getAttribute(attr);
  store.setPref(pref, value);
  bot.el['ocsb-' + group].querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
}

function delegatedClick(e) {
  // Suggestion chip
  const sugg = e.target.closest('.ocsb-suggestion');
  if (sugg && bot.el['ocsb-panel'].contains(sugg)) { bot.el['ocsb-input'].value = sugg.dataset.text || sugg.textContent.trim(); onInput(); submit(); return; }
  // Follow-up chip
  const fu = e.target.closest('.ocsb-followup');
  if (fu && bot.el['ocsb-panel'].contains(fu)) { bot.el['ocsb-input'].value = fu.dataset.text || fu.textContent.trim(); onInput(); submit(); return; }
  // Navigation chip
  const nav = e.target.closest('.ocsb-nav-chip');
  if (nav && bot.el['ocsb-panel'].contains(nav)) { const href = nav.getAttribute('data-href'); if (href) window.location.href = href; return; }
  // Copy code button
  const copy = e.target.closest('.ocsb-copy');
  if (copy) { const code = copy.parentElement.querySelector('code'); copyText(code ? code.textContent : '', copy); return; }
  // Conversation row (switch) / delete
  const del = e.target.closest('.ocsb-convo-del');
  if (del) { e.stopPropagation(); deleteConvo(del.closest('.ocsb-convo').dataset.id); return; }
  const row = e.target.closest('.ocsb-convo');
  if (row && bot.el['ocsb-rail'].contains(row)) { switchConvo(row.dataset.id); return; }
}

// ─── Open / close / layout ───────────────────────────────────────────────
function open() {
  document.body.classList.add('ocsb-open');
  if (window.innerWidth <= 560) document.body.classList.add('ocsb-modal');
  bot.el['ocsb-fab'].setAttribute('aria-expanded', 'true');
  bot.el['ocsb-panel'].setAttribute('aria-hidden', 'false');
  bot.el['ocsb-panel'].setAttribute('aria-modal', window.innerWidth <= 560 ? 'true' : 'false');
  setTimeout(() => bot.el['ocsb-input'].focus(), 240);
}
function close() {
  document.body.classList.remove('ocsb-open', 'ocsb-modal');
  bot.el['ocsb-fab'].setAttribute('aria-expanded', 'false');
  bot.el['ocsb-panel'].setAttribute('aria-hidden', 'true');
  bot.el['ocsb-settings'].hidden = true;
  bot.el['ocsb-settings-btn'].setAttribute('aria-pressed', 'false');
  bot.el['ocsb-fab'].focus();
}
function toggleExpand() {
  const on = document.body.classList.toggle('ocsb-expanded');
  document.body.classList.toggle('ocsb-modal', on || window.innerWidth <= 560);
  bot.el['ocsb-expand'].setAttribute('aria-pressed', String(on));
}
function toggleRail() {
  const on = document.body.classList.toggle('ocsb-rail-open');
  store.setPref('railOpen', on);
  bot.el['ocsb-rail-toggle'].setAttribute('aria-pressed', String(on));
}
function toggleSettings() {
  const open = bot.el['ocsb-settings'].hidden;
  bot.el['ocsb-settings'].hidden = !open;
  bot.el['ocsb-settings-btn'].setAttribute('aria-pressed', String(open));
  if (open) updateAccountUI();
}

function applyPrefs() {
  const prefs = store.getPrefs();
  if (prefs.railOpen && window.innerWidth > 560) {
    document.body.classList.add('ocsb-rail-open');
    bot.el['ocsb-rail-toggle'].setAttribute('aria-pressed', 'true');
  }
  const markActive = (groupId, attr, value) =>
    bot.el[groupId].querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.getAttribute(attr) === value));
  markActive('ocsb-set-style', 'data-style', prefs.style);
  markActive('ocsb-set-model', 'data-model', prefs.model);
}

// ─── Composer ───────────────────────────────────────────────────────────────
function onInput() {
  const ta = bot.el['ocsb-input'];
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  bot.el['ocsb-send'].disabled = bot.generating || !ta.value.trim();
}

function ensureActiveConversation() {
  let id = store.getActiveId();
  if (!id || !store.getConversation(id)) {
    const existing = store.listConversations();
    if (existing.length) { id = existing[0].id; store.setActiveId(id); }
    else { id = store.createConversation().id; }
  }
  return id;
}

function newChat() {
  // Reuse an empty "New chat" if one already exists at the top.
  const list = store.listConversations();
  const empty = list.find((c) => c.messages.length === 0);
  const id = empty ? empty.id : store.createConversation().id;
  store.setActiveId(id);
  renderRail();
  renderActiveConversation();
  hideError();
}

function switchConvo(id) {
  store.setActiveId(id);
  renderRail();
  renderActiveConversation();
  if (window.innerWidth <= 560) document.body.classList.remove('ocsb-rail-open');
}

function deleteConvo(id) {
  store.deleteConversation(id);
  ensureActiveConversation();
  renderRail();
  renderActiveConversation();
}

function clearCurrent() {
  const id = store.getActiveId();
  if (id) store.clearMessages(id);
  bot.el['ocsb-settings'].hidden = true;
  bot.el['ocsb-settings-btn'].setAttribute('aria-pressed', 'false');
  renderRail();
  renderActiveConversation();
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function renderSuggestions() {
  const wrap = bot.el['ocsb-suggestions'];
  wrap.innerHTML = '';
  starterSuggestions(bot.user).forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ocsb-suggestion';
    b.dataset.text = s.text;
    b.innerHTML = `<span class="ocsb-suggestion-ico" aria-hidden="true">${ICONS[s.icon] || ICONS.spark}</span><span class="ocsb-suggestion-txt">${escapeText(s.text)}</span><span class="ocsb-suggestion-go" aria-hidden="true">${CHEVRON}</span>`;
    wrap.appendChild(b);
  });
}

function renderRail(query) {
  const list = query ? store.searchConversations(query) : store.listConversations();
  const activeId = store.getActiveId();
  const ul = bot.el['ocsb-convos'];
  ul.innerHTML = '';
  if (!list.length) {
    ul.innerHTML = '<li class="ocsb-rail-empty">No conversations yet. Your chats will appear here.</li>';
    return;
  }
  list.forEach((c) => {
    const li = document.createElement('li');
    const title = c.title && c.title !== 'New chat' ? c.title : (c.messages[0]?.content?.slice(0, 40) || 'New chat');
    li.innerHTML = `
      <div class="ocsb-convo${c.id === activeId ? ' is-active' : ''}" data-id="${c.id}" role="button" tabindex="0" title="${escapeText(title)}">
        <span class="ocsb-convo-title">${escapeText(title)}</span>
        <button class="ocsb-convo-del" type="button" aria-label="Delete conversation" title="Delete">&times;</button>
      </div>`;
    ul.appendChild(li);
  });
}

function renderActiveConversation() {
  const id = store.getActiveId();
  const convo = id ? store.getConversation(id) : null;
  const msgsEl = bot.el['ocsb-messages'];
  // Remove rendered message nodes (keep the welcome node).
  msgsEl.querySelectorAll('.ocsb-msg').forEach((n) => n.remove());
  bot.el['ocsb-followups'].hidden = true;
  bot.el['ocsb-followups'].innerHTML = '';

  const hasMsgs = convo && convo.messages.length > 0;
  bot.el['ocsb-welcome'].hidden = hasMsgs;
  bot.el['ocsb-status-text'].textContent = 'Ready to help';

  if (hasMsgs) {
    convo.messages.forEach((m) => {
      if (m.role === 'user') addUserBubble(m.content);
      else addBotBubble(m.content);
    });
    scrollToBottom();
  }
}

function addUserBubble(text) {
  const node = document.createElement('div');
  node.className = 'ocsb-msg user';
  node.innerHTML = `<span class="ocsb-msg-avatar">${USER_AVATAR}</span><div class="ocsb-bubble"></div>`;
  node.querySelector('.ocsb-bubble').textContent = text;
  bot.el['ocsb-messages'].appendChild(node);
  return node;
}

function addBotBubble(text) {
  const node = document.createElement('div');
  node.className = 'ocsb-msg bot';
  node.innerHTML = `<span class="ocsb-msg-avatar" aria-hidden="true">${BOT_AVATAR}</span><div class="ocsb-bubble"></div>`;
  const bubble = node.querySelector('.ocsb-bubble');
  const { clean, actions } = parseActions(text);
  bubble.innerHTML = renderMarkdown(clean);
  appendActionChips(bubble, actions);
  bot.el['ocsb-messages'].appendChild(node);
  return node;
}

function appendActionChips(bubble, actions) {
  if (!actions || !actions.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'ocsb-actions';
  actions.forEach((a) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ocsb-nav-chip';
    chip.setAttribute('data-href', hrefFor(a.path));
    chip.innerHTML = `${escapeText(a.label)} ${ARROW}`;
    wrap.appendChild(chip);
  });
  bubble.appendChild(wrap);
}

// ─── The chat turn ───────────────────────────────────────────────────────────
async function submit() {
  if (bot.generating) return;
  const ta = bot.el['ocsb-input'];
  const text = ta.value.trim();
  if (!text) return;
  hideError();

  const convoId = ensureActiveConversation();

  // 1) user message
  ta.value = '';
  onInput();
  bot.el['ocsb-welcome'].hidden = true;
  addUserBubble(text);
  scrollToBottom();
  store.appendMessage(convoId, { role: 'user', content: text });
  renderRail();
  remoteSyncMessage(convoId, 'user', text);

  // 2) typing indicator
  bot.generating = true;
  bot.el['ocsb-send'].disabled = true;
  bot.el['ocsb-status-text'].textContent = 'Thinking…';
  const typingNode = addTyping();
  scrollToBottom();

  // 3) build context + call model
  const prefs = store.getPrefs();
  const convo = store.getConversation(convoId);
  const history = convo.messages.slice(-HISTORY_TURNS).map((m) => ({ role: m.role, content: m.content }));
  const messages = [{ role: 'system', content: buildSystemPrompt({ user: bot.user, prefs }) }, ...history];

  bot.abort = new AbortController();
  let answer = '';
  try {
    answer = await api.chat({ messages, model: prefs.model || DEFAULT_MODEL, signal: bot.abort.signal });
  } catch (err) {
    typingNode.remove();
    finishGenerating();
    showError(err && err.message ? err.message : 'Something went wrong reaching the assistant.');
    return;
  }

  // 4) render with typewriter, then persist
  typingNode.remove();
  const node = addBotBubbleStreaming();
  await typewriter(node.querySelector('.ocsb-bubble'), answer);

  store.appendMessage(convoId, { role: 'assistant', content: answer });
  remoteSyncMessage(convoId, 'assistant', answer);
  renderRail();
  renderFollowups(text);
  finishGenerating();
}

function finishGenerating() {
  bot.generating = false;
  bot.abort = null;
  bot.el['ocsb-status-text'].textContent = 'Ready to help';
  onInput();
}

function addTyping() {
  const node = document.createElement('div');
  node.className = 'ocsb-msg bot';
  node.innerHTML = `<span class="ocsb-msg-avatar" aria-hidden="true">${BOT_AVATAR}</span><div class="ocsb-bubble"><span class="ocsb-typing"><span></span><span></span><span></span></span></div>`;
  bot.el['ocsb-messages'].appendChild(node);
  return node;
}

function addBotBubbleStreaming() {
  const node = document.createElement('div');
  node.className = 'ocsb-msg bot';
  node.innerHTML = `<span class="ocsb-msg-avatar" aria-hidden="true">${BOT_AVATAR}</span><div class="ocsb-bubble"></div>`;
  bot.el['ocsb-messages'].appendChild(node);
  return node;
}

// Reveal text word-by-word, then swap in fully rendered markdown + nav chips.
function typewriter(bubble, fullText) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { clean, actions } = parseActions(fullText);
  if (reduce || clean.length > 1400) {
    bubble.innerHTML = renderMarkdown(clean);
    appendActionChips(bubble, actions);
    scrollToBottom();
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const words = clean.split(/(\s+)/);
    let i = 0;
    const tick = () => {
      const chunk = words.slice(i, i + 3).join('');
      bubble.textContent += chunk;
      i += 3;
      scrollToBottom();
      if (i < words.length) {
        setTimeout(tick, 16);
      } else {
        bubble.innerHTML = renderMarkdown(clean);
        appendActionChips(bubble, actions);
        scrollToBottom();
        resolve();
      }
    };
    tick();
  });
}

// Lightweight, no-cost related prompts based on the user's last message.
function renderFollowups(lastUserText) {
  const q = (lastUserText || '').toLowerCase();
  const scored = NAV_INDEX
    .map((e) => {
      let s = 0;
      e.keywords.forEach((k) => { if (q.includes(k)) s += 2; });
      if (q.includes(e.name.toLowerCase())) s += 3;
      return { e, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  const wrap = bot.el['ocsb-followups'];
  wrap.innerHTML = '';
  if (!scored.length) { wrap.hidden = true; return; }
  scored.forEach(({ e }) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ocsb-followup';
    chip.dataset.text = `Take me to ${e.name}`;
    chip.textContent = `→ ${e.name}`;
    wrap.appendChild(chip);
  });
  wrap.hidden = false;
}

// ─── Optional backend sync (best-effort, never blocks the UI) ─────────────────
async function remoteSyncMessage(localId, role, content) {
  if (!bot.user) return;
  try {
    const convo = store.getConversation(localId);
    if (!convo) return;
    let remoteId = convo.remoteId;
    if (!remoteId) {
      const created = await api.remoteCreate(convo.title || 'New chat');
      if (created && (created.id != null)) { remoteId = created.id; store.setRemoteId(localId, remoteId); }
      else return; // backend not available — localStorage already has it
    }
    await api.remoteAddMessage(remoteId, role, content);
  } catch (_e) { /* silent: local copy is the source of truth */ }
}

async function syncFromRemote() {
  // Pull the list of server conversations; if present, surface ones we don't
  // have locally yet. Local + remote merge stays simple: never destructive.
  try {
    const list = await api.remoteList();
    if (!Array.isArray(list) || !list.length) return;
    const localRemoteIds = new Set(store.listConversations().map((c) => c.remoteId).filter(Boolean).map(String));
    for (const r of list) {
      if (localRemoteIds.has(String(r.id))) continue;
      const full = await api.remoteGet(r.id);
      if (!full || !Array.isArray(full.messages)) continue;
      const convo = store.createConversation();
      store.renameConversation(convo.id, r.title || 'Saved chat');
      store.setRemoteId(convo.id, r.id);
      full.messages.forEach((m) => store.appendMessage(convo.id, { role: m.role, content: m.content }));
    }
    renderRail();
  } catch (_e) { /* silent */ }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function scrollToBottom() {
  const m = bot.el['ocsb-messages'];
  m.scrollTop = m.scrollHeight;
}
function showError(msg) {
  bot.el['ocsb-error'].textContent = msg;
  bot.el['ocsb-error'].hidden = false;
}
function hideError() { bot.el['ocsb-error'].hidden = true; }
function escapeText(s) {
  const d = document.createElement('div');
  d.textContent = String(s == null ? '' : s);
  return d.innerHTML;
}
function copyText(text, btn) {
  const done = () => { const old = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => (btn.textContent = old), 1400); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
  else { try { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); } catch (_e) {} }
}

// ─── Go ───────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
