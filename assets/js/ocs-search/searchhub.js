// assets/js/ocs-search/searchhub.js
// -----------------------------------------------------------------------------
// The OCS Learning Guide — an AI "information hub" embedded in the search page.
// A bright "Ask AI" entry next to the normal search opens a panel that, instead
// of dumping raw results, runs a short clickable survey and builds an ordered
// learning path (a course through real site pages). Reuses the chatbot's Groq
// client, page index, and markdown renderer; adds the survey + path UX.
// -----------------------------------------------------------------------------

import { chat } from '../ocs-bot/api.js';
import { renderMarkdown } from '../ocs-bot/render.js';
import { parseActions, hrefFor } from '../ocs-bot/tools.js';
import { DEFAULT_MODEL } from '../ocs-bot/config.js';
import { buildSearchPrompt } from './searchprompt.js';
import { parse } from './protocol.js';

const SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

const STARTERS = [
  'I want to learn JavaScript',
  'Help me start with Python',
  'Learn Java for AP CSA',
  "I'm brand new, where do I start?",
  'Which language should I pick for my capstone?',
];

const hub = { history: [], busy: false, el: {}, mounted: false };
const HISTORY = 12;

function ce(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function escapeText(s) {
  const d = document.createElement('div');
  d.textContent = String(s == null ? '' : s);
  return d.innerHTML;
}
function scroll() { hub.el.thread.scrollTop = hub.el.thread.scrollHeight; }

function mount() {
  if (hub.mounted) return;
  const searchWrap = document.querySelector('.search');
  const input = document.querySelector('.js-search-input');
  if (!searchWrap || !input) return;
  hub.mounted = true;

  // Bright "Ask AI" entry inside the search bar.
  const inputWrap = document.querySelector('.search-input-wrap') || input.parentElement;
  inputWrap.classList.add('ocss-has-ai');
  const askBtn = ce('button', 'ocss-ask-btn', `${SPARK}<span>Ask AI</span>`);
  askBtn.type = 'button';
  askBtn.setAttribute('aria-label', 'Ask AI to build a learning path');
  inputWrap.appendChild(askBtn);

  // The hub panel.
  const panel = ce('section', 'ocss', `
    <div class="ocss-card">
      <header class="ocss-head">
        <span class="ocss-badge">${SPARK}</span>
        <div class="ocss-head-meta">
          <h3>OCS Learning Guide</h3>
          <p>Tell me what you want to learn and I'll map you a path through the site.</p>
        </div>
        <button class="ocss-close" type="button" aria-label="Close">&times;</button>
      </header>
      <div class="ocss-thread" role="log" aria-live="polite"></div>
      <div class="ocss-quick"></div>
      <form class="ocss-form" autocomplete="off">
        <input class="ocss-input" type="text" placeholder="Ask anything, e.g. how do I learn JavaScript?" aria-label="Ask the OCS Learning Guide">
        <button class="ocss-send" type="submit" aria-label="Send">${ARROW}</button>
      </form>
    </div>`);
  panel.hidden = true;
  searchWrap.appendChild(panel);

  hub.el = {
    panel, askBtn,
    thread: panel.querySelector('.ocss-thread'),
    quick: panel.querySelector('.ocss-quick'),
    form: panel.querySelector('.ocss-form'),
    input: panel.querySelector('.ocss-input'),
    close: panel.querySelector('.ocss-close'),
  };

  askBtn.addEventListener('click', () => openHub(input.value.trim()));
  hub.el.close.addEventListener('click', closeHub);
  hub.el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = hub.el.input.value.trim();
    if (v) { hub.el.input.value = ''; send(v); }
  });
  // Let a question in the main search box launch the AI with Shift+Enter.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); openHub(input.value.trim()); }
  });
}

function openHub(seed) {
  hub.el.panel.hidden = false;
  requestAnimationFrame(() => hub.el.panel.classList.add('is-open'));
  if (!hub.history.length && !seed) renderStarters();
  if (seed) send(seed);
  else setTimeout(() => hub.el.input.focus(), 120);
  hub.el.panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function closeHub() {
  hub.el.panel.classList.remove('is-open');
  setTimeout(() => { hub.el.panel.hidden = true; }, 220);
}

function renderStarters() {
  hub.el.quick.innerHTML = '';
  hub.el.quick.appendChild(ce('p', 'ocss-quick-label', 'New here? Pick one to start:'));
  const wrap = ce('div', 'ocss-chips');
  STARTERS.forEach((t) => {
    const c = ce('button', 'ocss-chip', escapeText(t));
    c.type = 'button';
    c.addEventListener('click', () => send(t));
    wrap.appendChild(c);
  });
  hub.el.quick.appendChild(wrap);
}

function addUser(text) {
  const row = ce('div', 'ocss-msg user', '<div class="ocss-bubble"></div>');
  row.querySelector('.ocss-bubble').textContent = text;
  hub.el.thread.appendChild(row);
  scroll();
}
function addTyping() {
  const row = ce('div', 'ocss-msg bot',
    `<span class="ocss-av">${SPARK}</span><div class="ocss-bubble"><span class="ocss-typing"><i></i><i></i><i></i></span></div>`);
  hub.el.thread.appendChild(row);
  scroll();
  return row;
}

async function send(text) {
  if (hub.busy) return;
  hub.busy = true;
  hub.el.quick.innerHTML = '';
  addUser(text);
  hub.history.push({ role: 'user', content: text });
  const typing = addTyping();
  try {
    const messages = [{ role: 'system', content: buildSearchPrompt() }, ...hub.history.slice(-HISTORY)];
    const answer = await chat({ messages, model: DEFAULT_MODEL, temperature: 0.5 });
    hub.history.push({ role: 'assistant', content: answer });
    typing.remove();
    renderBot(answer);
  } catch (err) {
    typing.remove();
    const row = ce('div', 'ocss-msg bot', `<span class="ocss-av">${SPARK}</span><div class="ocss-bubble ocss-err"></div>`);
    row.querySelector('.ocss-bubble').textContent =
      (err && err.message) ? err.message : 'The guide is unavailable right now. Please try again.';
    hub.el.thread.appendChild(row);
    scroll();
  }
  hub.busy = false;
}

function renderBot(answer) {
  const { text, asks, steps } = parse(answer);
  const { clean, actions } = parseActions(text); // pull any [[GO:]] discovery links
  const row = ce('div', 'ocss-msg bot', `<span class="ocss-av">${SPARK}</span><div class="ocss-bubble"></div>`);
  const bubble = row.querySelector('.ocss-bubble');
  if (clean) bubble.innerHTML = renderMarkdown(clean);
  if (steps.length) bubble.appendChild(renderPath(steps));
  if (actions.length) bubble.appendChild(renderLinks(actions));
  if (!clean && !steps.length && !actions.length) bubble.textContent = 'Tell me a bit more and I can point you in the right direction.';
  hub.el.thread.appendChild(row);
  if (asks.length) renderAsk(asks[0]);
  scroll();
}

function renderPath(steps) {
  const path = ce('div', 'ocss-path');
  steps.forEach((s, i) => {
    const node = ce('div', 'ocss-step');
    node.innerHTML =
      `<div class="ocss-step-rail"><span class="ocss-step-num">${i + 1}</span></div>` +
      `<div class="ocss-step-card">` +
        `<div class="ocss-step-title">${escapeText(s.title)}</div>` +
        (s.why ? `<div class="ocss-step-why">${escapeText(s.why)}</div>` : '') +
        `<a class="ocss-step-open" href="${hrefFor(s.path)}">${escapeText(s.label)} ${ARROW}</a>` +
      `</div>`;
    path.appendChild(node);
  });
  return path;
}

function renderLinks(actions) {
  const wrap = ce('div', 'ocss-links');
  actions.forEach((a) => {
    const chip = ce('a', 'ocss-link-chip', `${escapeText(a.label)} ${ARROW}`);
    chip.setAttribute('href', hrefFor(a.path));
    wrap.appendChild(chip);
  });
  return wrap;
}

function renderAsk(ask) {
  hub.el.quick.innerHTML = '';
  hub.el.quick.appendChild(ce('p', 'ocss-quick-label', escapeText(ask.q)));
  const wrap = ce('div', 'ocss-chips');
  ask.options.forEach((opt) => {
    const c = ce('button', 'ocss-chip', escapeText(opt));
    c.type = 'button';
    c.addEventListener('click', () => send(opt));
    wrap.appendChild(c);
  });
  hub.el.quick.appendChild(wrap);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
