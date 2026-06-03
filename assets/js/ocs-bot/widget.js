// assets/js/ocs-bot/widget.js
// -----------------------------------------------------------------------------
// The OCS Assistant widget markup, as a string so index.js can inject it into
// <body> on ANY page. The chatbot is loaded from the universal <head> include
// (custom-head.html), which reaches every layout — including pages that don't
// route through the shared base layout (e.g. the gamified /home). IDs/classes
// are namespaced ocsb- and styled by /assets/css/ocs-bot.css.
// -----------------------------------------------------------------------------

export const WIDGET_HTML = `
<button id="ocsb-fab" type="button" aria-label="Open the OCS Assistant" aria-expanded="false" aria-controls="ocsb-panel">
  <span class="ocsb-fab-pulse" aria-hidden="true"></span>
  <span class="ocsb-fab-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </span>
  <span class="ocsb-fab-label">Ask OCS</span>
</button>

<div id="ocsb-backdrop" aria-hidden="true"></div>

<section id="ocsb-panel" role="dialog" aria-modal="false" aria-label="OCS Assistant" aria-hidden="true">
  <nav id="ocsb-rail" aria-label="Your conversations">
    <div class="ocsb-rail-head">
      <button id="ocsb-new" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New chat
      </button>
    </div>
    <div class="ocsb-rail-search">
      <input id="ocsb-rail-search-input" type="search" placeholder="Search chats" aria-label="Search your conversations" autocomplete="off" />
    </div>
    <ul id="ocsb-convos" aria-label="Saved conversations"></ul>
  </nav>

  <div class="ocsb-main">
    <header id="ocsb-head">
      <button id="ocsb-rail-toggle" class="ocsb-icon-btn" type="button" aria-label="Toggle conversation list" aria-pressed="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="ocsb-head-avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.4" fill="currentColor"/><circle cx="9" cy="14" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.3" fill="currentColor" stroke="none"/></svg>
      </span>
      <div class="ocsb-head-meta">
        <h2 id="ocsb-title">OCS Assistant</h2>
        <p class="ocsb-status"><span class="ocsb-status-dot" aria-hidden="true"></span><span id="ocsb-status-text">Ready to help</span></p>
      </div>
      <div class="ocsb-head-actions">
        <button id="ocsb-settings-btn" class="ocsb-icon-btn" type="button" aria-label="Settings" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <button id="ocsb-expand" class="ocsb-icon-btn" type="button" aria-label="Expand panel" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
        <button id="ocsb-close" class="ocsb-icon-btn" type="button" aria-label="Close assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </header>

    <div id="ocsb-error" class="ocsb-error" role="alert" hidden></div>

    <section id="ocsb-welcome">
      <div class="ocsb-welcome-hero">
        <span class="ocsb-welcome-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </span>
        <h3 id="ocsb-welcome-greeting">Hey! I'm the OCS Assistant 👋</h3>
        <p id="ocsb-welcome-sub">Ask me about courses, lessons, and projects, or tell me where to go and I'll take you there.</p>
      </div>
      <a id="ocsb-signin-cta" class="ocsb-signin-cta" href="#">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Sign in to save your chats
      </a>
      <p class="ocsb-suggest-label">Try asking</p>
      <div id="ocsb-suggestions"></div>
    </section>

    <section id="ocsb-messages" role="log" aria-live="polite" aria-relevant="additions text" hidden></section>

    <div id="ocsb-followups" role="list" hidden></div>

    <div id="ocsb-settings" hidden>
      <div class="ocsb-set-row">
        <p class="ocsb-set-label">Answer style</p>
        <div class="ocsb-segmented" id="ocsb-set-style" role="group" aria-label="Answer style">
          <button type="button" data-style="balanced" class="is-active">Balanced</button>
          <button type="button" data-style="concise">Concise</button>
          <button type="button" data-style="detailed">Detailed</button>
        </div>
      </div>
      <div class="ocsb-set-row">
        <p class="ocsb-set-label">Model</p>
        <div class="ocsb-segmented" id="ocsb-set-model" role="group" aria-label="Model speed">
          <button type="button" data-model="llama-3.3-70b-versatile" class="is-active">Smart</button>
          <button type="button" data-model="llama-3.1-8b-instant">Fast</button>
        </div>
      </div>
      <div class="ocsb-set-row">
        <p class="ocsb-set-label">Assistant</p>
        <div class="ocsb-toggle-row">
          <span class="ocsb-toggle-text">Open automatically<em>Greet me on my first visit</em></span>
          <button id="ocsb-set-autoopen" class="ocsb-toggle" type="button" role="switch" aria-checked="true" aria-label="Open automatically on first visit"><span class="ocsb-toggle-knob"></span></button>
        </div>
        <div class="ocsb-toggle-row">
          <span class="ocsb-toggle-text">Show the assistant<em>Turn the launcher off on this device</em></span>
          <button id="ocsb-set-enabled" class="ocsb-toggle" type="button" role="switch" aria-checked="true" aria-label="Show the assistant launcher"><span class="ocsb-toggle-knob"></span></button>
        </div>
        <p id="ocsb-disabled-note" class="ocsb-set-note" hidden>Hidden on this device. Press <b>Cmd / Ctrl + K</b> to bring it back anytime.</p>
      </div>
      <div class="ocsb-set-row">
        <p class="ocsb-set-label">Account</p>
        <div class="ocsb-set-account" id="ocsb-account">
          <span class="ocsb-dot2" style="background:var(--ocsb-fg-faint)"></span>
          <span id="ocsb-account-text">Checking sign-in…</span>
        </div>
      </div>
      <div class="ocsb-set-row">
        <button id="ocsb-clear" class="ocsb-danger-btn" type="button">Clear this conversation</button>
      </div>
    </div>

    <form id="ocsb-form" autocomplete="off">
      <div class="ocsb-composer-row">
        <textarea id="ocsb-input" rows="1" placeholder="Ask anything about Open Coding Society…" enterkeyhint="send" aria-label="Message"></textarea>
        <button id="ocsb-send" type="submit" disabled aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="ocsb-composer-foot">
        <span class="ocsb-composer-hint"><b>Enter</b> to send · <b>Shift+Enter</b> for a new line</span>
      </div>
    </form>
  </div>
</section>`;
