// A course-style chat panel (same markup/classes as _includes/announcement_chat.html, so it
// picks up the same look from forms/course-chat.scss) bound to one Spring group by id.
//
// Used by the capstone card's Chat dialog, mounted on the project's linked student group.
//
//   history  GET  /api/groups/chat/{groupId}/messages
//   live     SockJS/STOMP subscribe /topic/group/{groupId}   (same socket as the weekly chat)
//   send     POST /api/groups/chat/{groupId}/messages
//
// Sending goes over REST rather than the STOMP /app/groups.chat route the weekly chat uses:
// the REST endpoint checks that the sender is a member or mentor of the group, the socket
// route does not, and a mentor must only be able to talk to their own capstone group.
import { javaURI, fetchOptions } from '../api/config.js';
import { createRichComposer, renderRichMessage } from './rich-text.js';

const CHAT_SOCKET_PORT = 8589; // same hard-coded port as the other chat widgets
const SOCKET_TIMEOUT_MS = 8000;
const SOCKJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js';
const STOMP_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';
// The panel's icons are Font Awesome, like the course chats; not every layout loads it.
const FONT_AWESOME_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';

/**
 * Mounts a chat for `groupId` into `container` (its contents are replaced).
 * `readOnly` shows the conversation without a composer (anyone signed in can read a
 * capstone's chat, only its team posts); `notice` is shown above the messages.
 * `signedOut` shows just the notice, since the chat needs a Spring session.
 * Returns { destroy() } to close the live connection when the chat is hidden.
 */
export function mountGroupChat(container, { groupId, title, subtitle, displayName, readOnly = false, signedOut = false, notice = '' }) {
    ensureFontAwesome();
    const ui = buildDom(title, subtitle);
    container.replaceChildren(ui.root);
    if (notice) {
        ui.noteText.textContent = notice;
        ui.note.hidden = false;
    }
    if (readOnly || signedOut) {
        // Removed rather than hidden: the chat styles give the form a display value.
        ui.form.remove();
        ui.emptyHint.textContent = signedOut ? '' : 'Nothing has been posted here yet.';
    }
    if (signedOut) {
        ui.status.textContent = 'signed out';
        ui.emptyTitle.textContent = 'Sign in to read this chat';
        return { destroy() {} };
    }

    const state = {
        stomp: null,
        subscription: null,
        destroyed: false,
        seenKeys: new Set(),
        lastDayKey: null,
        lastSender: null,
        lastTime: 0,
    };

    const composer = createRichComposer({
        placeholder: 'Message your capstone group…',
        maxLength: 2000,
        onSubmit: submit,
    });
    ui.form.classList.add('chat-form--rich');
    ui.form.insertBefore(composer.element, ui.sendBtn);
    ui.form.addEventListener('submit', (event) => { event.preventDefault(); submit(); });

    function setStatus(text, tone) {
        ui.status.textContent = text;
        ui.statusPill.classList.remove('is-live', 'is-preview', 'is-error');
        if (tone) ui.statusPill.classList.add(tone);
    }

    function setComposerEnabled(enabled) {
        composer.setEnabled(enabled);
        ui.sendBtn.disabled = !enabled;
    }

    async function submit() {
        if (composer.isEmpty() || composer.isOverLimit()) return;
        const message = composer.getHTML();
        const date = new Date().toISOString();
        setComposerEnabled(false);
        try {
            const res = await fetch(`${javaURI}/api/groups/chat/${groupId}/messages`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ name: displayName, message, date }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            composer.clear();
            // With a live socket the server's broadcast echoes the message back.
            if (!state.subscription) addMessage({ sender: displayName, message, date });
        } catch (err) {
            console.error('Mentor chat: send failed', err);
            appendSystem('Your message could not be sent. Please try again.');
        } finally {
            if (!state.destroyed) setComposerEnabled(true);
        }
    }

    function addMessage({ sender, message, date }) {
        const key = [sender || '', date || '', message || ''].join('|');
        if (state.seenKeys.has(key)) return;
        state.seenKeys.add(key);
        appendMessage(ui.messages, state, { sender, message, date }, displayName);
    }

    function appendSystem(text) {
        ui.empty?.remove();
        const el = document.createElement('p');
        el.className = 'chat-system';
        el.textContent = text;
        ui.messages.appendChild(el);
        state.lastSender = null;
        ui.messages.scrollTop = ui.messages.scrollHeight;
    }

    async function loadHistory() {
        try {
            const res = await fetch(`${javaURI}/api/groups/chat/${groupId}/messages`, fetchOptions);
            if (res.status === 403) {
                appendSystem("You don't have access to this group's chat.");
                return false;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            (await res.json()).forEach((msg) => addMessage({ sender: msg.name, message: msg.message, date: msg.date }));
            return true;
        } catch (err) {
            console.warn('Mentor chat: history load failed', err);
            appendSystem('Earlier messages could not be loaded.');
            return true;
        }
    }

    async function connect() {
        try {
            await loadScriptOnce(SOCKJS_SRC);
            await loadScriptOnce(STOMP_SRC);
        } catch (err) {
            console.warn('Mentor chat: chat libraries failed to load', err);
            return false;
        }
        return new Promise((resolve) => {
            setStatus('connecting…');
            const client = Stomp.over(new SockJS(socketEndpoint()));
            client.debug = null;
            state.stomp = client;
            const giveUp = setTimeout(() => resolve(false), SOCKET_TIMEOUT_MS);
            client.connect({}, () => {
                clearTimeout(giveUp);
                if (state.destroyed) { safeDisconnect(client); return resolve(false); }
                state.subscription = client.subscribe(`/topic/group/${groupId}`, (frame) => {
                    try {
                        const event = JSON.parse(frame.body);
                        if (event.context === 'sendMessageServer') {
                            addMessage({ sender: event.sender, message: event.message, date: event.date });
                        }
                    } catch (err) {
                        console.warn('Mentor chat: bad frame', err);
                    }
                });
                resolve(true);
            }, (err) => {
                clearTimeout(giveUp);
                console.warn('Mentor chat: socket connection failed', err);
                resolve(false);
            });
        });
    }

    (async function init() {
        setStatus('loading…');
        setComposerEnabled(false);
        const allowed = await loadHistory();
        if (!allowed || state.destroyed) { setStatus('no access', 'is-error'); return; }
        const live = await connect();
        if (state.destroyed) return;
        if (live) setStatus('connected', 'is-live');
        else setStatus('not live', 'is-preview');
        if (!readOnly) setComposerEnabled(true);
    })();

    return {
        destroy() {
            state.destroyed = true;
            try { state.subscription?.unsubscribe(); } catch (err) { /* already closed */ }
            if (state.stomp) safeDisconnect(state.stomp);
            state.subscription = null;
            state.stomp = null;
        },
    };
}

// ---------- DOM (mirrors _includes/announcement_chat.html) ----------

function buildDom(title, subtitle) {
    const root = document.createElement('section');
    root.className = 'announcement-chat mentor-capstone-chat';
    root.innerHTML = `
      <div class="chat-header">
        <div class="chat-heading">
          <span class="chat-badge" aria-hidden="true"><i class="fas fa-comments"></i></span>
          <div class="chat-heading-text">
            <h2 class="chat-title"></h2>
            <p class="chat-subtitle"></p>
          </div>
        </div>
        <span class="chat-status-pill">
          <span class="chat-status-dot" aria-hidden="true"></span>
          <span class="chat-status">loading…</span>
        </span>
      </div>
      <div class="chat-body">
        <p class="chat-preview-note" hidden>
          <i class="fas fa-eye" aria-hidden="true"></i><span></span>
        </p>
        <div class="chat-messages" role="log" aria-live="polite">
          <div class="chat-empty">
            <i class="fas fa-comments" aria-hidden="true"></i>
            <p class="chat-empty-title">No messages yet</p>
            <span class="chat-empty-hint">Say hello to your capstone group.</span>
          </div>
        </div>
        <form class="chat-form" autocomplete="off">
          <button class="chat-send" type="submit" disabled>
            <i class="fas fa-paper-plane" aria-hidden="true"></i><span>Send</span>
          </button>
        </form>
      </div>`;
    root.querySelector('.chat-title').textContent = title;
    root.querySelector('.chat-subtitle').textContent = subtitle;
    return {
        root,
        statusPill: root.querySelector('.chat-status-pill'),
        status: root.querySelector('.chat-status'),
        note: root.querySelector('.chat-preview-note'),
        noteText: root.querySelector('.chat-preview-note span'),
        messages: root.querySelector('.chat-messages'),
        get empty() { return root.querySelector('.chat-empty'); },
        emptyTitle: root.querySelector('.chat-empty-title'),
        emptyHint: root.querySelector('.chat-empty-hint'),
        form: root.querySelector('.chat-form'),
        sendBtn: root.querySelector('.chat-send'),
    };
}

// Day separators, per-sender avatars and grouping of consecutive messages, exactly as in
// the announcement chat.
function appendMessage(messagesEl, state, { sender, message, date }, selfName) {
    messagesEl.querySelector('.chat-empty')?.remove();
    const isSelf = sender === selfName;
    const who = isSelf ? 'You' : (sender || 'Unknown');
    const when = parseDate(date);
    const wasAtBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 40;

    let continued;
    if (when) {
        const key = String(startOfDay(when));
        if (key !== state.lastDayKey) {
            const separator = document.createElement('div');
            separator.className = 'chat-day';
            separator.setAttribute('role', 'separator');
            separator.textContent = dayLabel(when);
            messagesEl.appendChild(separator);
            state.lastDayKey = key;
            state.lastSender = null;
        }
        continued = who === state.lastSender && (when.getTime() - state.lastTime) < 5 * 60 * 1000;
        state.lastTime = when.getTime();
    } else {
        continued = who === state.lastSender;
    }

    const row = document.createElement('div');
    row.className = ['chat-msg', isSelf ? 'is-self' : '', continued ? 'is-continued' : ''].filter(Boolean).join(' ');

    const avatar = document.createElement('span');
    avatar.className = ['chat-avatar', isSelf ? '' : tintFor(who)].filter(Boolean).join(' ');
    avatar.textContent = initialsFor(isSelf ? selfName : who);
    avatar.setAttribute('aria-hidden', 'true');

    const main = document.createElement('div');
    main.className = 'chat-msg-main';
    const meta = document.createElement('div');
    meta.className = 'chat-msg-meta';
    const senderEl = document.createElement('span');
    senderEl.className = 'chat-msg-sender';
    senderEl.textContent = who;
    meta.appendChild(senderEl);
    if (when) {
        const timeEl = document.createElement('span');
        timeEl.className = 'chat-msg-time';
        timeEl.textContent = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
        meta.appendChild(timeEl);
    }
    const body = document.createElement('span');
    body.className = 'chat-msg-body';
    renderRichMessage(body, message);

    main.append(meta, body);
    row.append(avatar, main);
    messagesEl.appendChild(row);
    state.lastSender = who;
    if (wasAtBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ---------- helpers ----------

function parseDate(iso) {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function dayLabel(date) {
    const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function initialsFor(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Stable per-sender tint so the same person keeps the same avatar colour.
function tintFor(name) {
    const text = String(name || '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    return `tint-${(hash % 5) + 1}`;
}

function socketEndpoint() {
    const uri = new URL(javaURI);
    if (uri.hostname === 'localhost' || uri.hostname === '127.0.0.1') {
        return `${uri.protocol}//${uri.hostname}:${CHAT_SOCKET_PORT}/ws-chat`;
    }
    return `${javaURI}/ws-chat`;
}

// Shared with the course chats: load the chat libraries once per page.
function loadScriptOnce(src) {
    window.__ocsChatScripts = window.__ocsChatScripts || {};
    if (!window.__ocsChatScripts[src]) {
        window.__ocsChatScripts[src] = new Promise((resolve, reject) => {
            if (src === SOCKJS_SRC && typeof SockJS !== 'undefined') return resolve();
            if (src === STOMP_SRC && typeof Stomp !== 'undefined') return resolve();
            const el = document.createElement('script');
            el.src = src;
            el.onload = resolve;
            el.onerror = () => reject(new Error(`failed to load ${src}`));
            document.head.appendChild(el);
        });
    }
    return window.__ocsChatScripts[src];
}

function ensureFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_AWESOME_CSS;
    document.head.appendChild(link);
}

function safeDisconnect(client) {
    try { if (client.connected) client.disconnect(); } catch (err) { /* already closed */ }
}
