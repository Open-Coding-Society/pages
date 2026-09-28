// Dashboard "Messages" tab: a mentor's private thread with the admins plus the group chats
// of the student groups they mentor; an admin sees one private thread per mentor.
//
// Two kinds of thread:
//   - "admin"/"mentor": private mentor<->admin messages stored in Spring's DB
//     (/api/mentor-messages, see MentorAdminMessageApiController). Polled every 5s.
//   - "group": the existing group chat students already use (/api/groups/chat/{id}),
//     live over the same SockJS/STOMP socket as the weekly/lesson chat.
import { javaURI, fetchOptions } from '../../api/config.js';

const POLL_MS = 5000;
const CHAT_SOCKET_PORT = 8589; // same hard-coded port as groups.js / lesson_chat.html
const SOCKET_TIMEOUT_MS = 8000;

const state = {
    me: null,          // Spring person: { id, uid, name, roles }
    active: null,      // the open thread descriptor
    pollTimer: null,
    stomp: null,
    subscription: null,
    seenKeys: new Set(),
};

const el = (id) => document.getElementById(id);

export async function initMentorMessages(person, roles) {
    const isAdmin = roles.includes('ROLE_ADMIN');
    const isMentor = roles.includes('ROLE_MENTOR');
    if (!isAdmin && !isMentor) return;

    state.me = person;
    el('tab-messages-li').hidden = false;
    el('mentorThreadForm').addEventListener('submit', onSubmit);
    window.addEventListener('beforeunload', closeActiveThread);

    const threads = isAdmin ? await loadAdminThreads() : await loadMentorThreads();
    renderThreadList(threads);
}

// ---------- thread lists ----------

async function loadMentorThreads() {
    const threads = [{
        kind: 'admin',
        title: 'Admin',
        subtitle: 'Private — only admins can read this',
    }];
    try {
        const res = await fetch(`${javaURI}/api/groups/mentor/${state.me.id}`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const groups = await res.json();
        (groups || []).forEach((group) => threads.push({
            kind: 'group',
            groupId: group.id,
            title: group.name,
            subtitle: 'Group chat — your students see this',
        }));
    } catch (err) {
        console.error('Messages: could not load mentored groups', err);
    }
    return threads;
}

async function loadAdminThreads() {
    try {
        const res = await fetch(`${javaURI}/api/mentor-messages/threads`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        return (rows || []).map((row) => ({
            kind: 'mentor',
            mentorUid: row.mentorUid,
            // Username too, so two mentors with the same display name can be told apart.
            title: row.mentorName && row.mentorName !== row.mentorUid ? `${row.mentorName} (${row.mentorUid})` : row.mentorUid,
            subtitle: row.lastMessage ? truncate(row.lastMessage, 60) : 'No messages yet',
        }));
    } catch (err) {
        console.error('Messages: could not load mentor threads', err);
        return [];
    }
}

function renderThreadList(threads) {
    const list = el('mentorThreadList');
    list.innerHTML = '';
    if (threads.length === 0) {
        list.append(textNode('p', 'No conversations yet.', 'mentor-messages__empty'));
        return;
    }
    threads.forEach((thread) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mentor-messages__thread';
        button.append(textNode('span', thread.title, 'mentor-messages__thread-title'),
                      textNode('span', thread.subtitle, 'mentor-messages__thread-subtitle'));
        button.addEventListener('click', () => {
            list.querySelectorAll('.mentor-messages__thread').forEach((b) => b.removeAttribute('aria-current'));
            button.setAttribute('aria-current', 'true');
            openThread(thread);
        });
        list.append(button);
    });
}

// ---------- opening / closing a thread ----------

async function openThread(thread) {
    closeActiveThread();
    state.active = thread;
    state.seenKeys.clear();
    el('mentorThreadTitle').textContent = thread.title;
    el('mentorThreadHint').textContent = thread.subtitle;
    el('mentorThreadLog').innerHTML = '';
    setComposerEnabled(false);

    if (thread.kind === 'group') {
        await loadGroupHistory(thread.groupId);
        await connectGroupSocket(thread.groupId);
        setComposerEnabled(true);
    } else {
        await refreshPrivateThread();
        state.pollTimer = setInterval(refreshPrivateThread, POLL_MS);
        setComposerEnabled(true);
    }
}

function closeActiveThread() {
    if (state.pollTimer) clearInterval(state.pollTimer);
    state.pollTimer = null;
    try {
        if (state.subscription) state.subscription.unsubscribe();
        if (state.stomp && state.stomp.connected) state.stomp.disconnect();
    } catch (err) {
        console.warn('Messages: socket close failed', err);
    }
    state.subscription = null;
    state.stomp = null;
    state.active = null;
}

function setComposerEnabled(enabled) {
    el('mentorThreadInput').disabled = !enabled;
    el('mentorThreadSend').disabled = !enabled;
}

// ---------- private mentor <-> admin threads (DB, polled) ----------

function privateThreadUrl(thread) {
    return thread.kind === 'admin'
        ? `${javaURI}/api/mentor-messages/mine`
        : `${javaURI}/api/mentor-messages/threads/${encodeURIComponent(thread.mentorUid)}`;
}

async function refreshPrivateThread() {
    const thread = state.active;
    if (!thread || thread.kind === 'group') return;
    try {
        const res = await fetch(privateThreadUrl(thread), fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        renderPrivateMessages(await res.json());
    } catch (err) {
        console.error('Messages: could not load thread', err);
    }
}

function renderPrivateMessages(messages) {
    const log = el('mentorThreadLog');
    const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
    log.innerHTML = '';
    if (!messages || messages.length === 0) {
        log.append(textNode('p', 'No messages yet — say hello.', 'mentor-messages__empty'));
        return;
    }
    messages.forEach((msg) => appendBubble({
        sender: msg.senderName || msg.senderUid,
        text: msg.message,
        date: msg.createdAt,
        mine: msg.senderUid === state.me.uid,
    }));
    if (nearBottom) log.scrollTop = log.scrollHeight;
}

async function sendPrivateMessage(text) {
    const res = await fetch(privateThreadUrl(state.active), {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ message: text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderPrivateMessages(await res.json());
    el('mentorThreadLog').scrollTop = el('mentorThreadLog').scrollHeight;
}

// ---------- group threads (existing group chat, live over STOMP) ----------

async function loadGroupHistory(groupId) {
    try {
        const res = await fetch(`${javaURI}/api/groups/chat/${groupId}/messages`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const messages = await res.json();
        (messages || []).forEach((msg) => appendGroupMessage({ sender: msg.name, message: msg.message, date: msg.date }));
    } catch (err) {
        console.error('Messages: could not load group history', err);
    }
    if (!el('mentorThreadLog').children.length) {
        el('mentorThreadLog').append(textNode('p', 'No messages yet — say hello to your group.', 'mentor-messages__empty'));
    }
}

function chatSocketEndpoint() {
    const uri = new URL(javaURI);
    if (uri.hostname === 'localhost' || uri.hostname === '127.0.0.1') {
        return `${uri.protocol}//${uri.hostname}:${CHAT_SOCKET_PORT}/ws-chat`;
    }
    return `${javaURI}/ws-chat`;
}

function connectGroupSocket(groupId) {
    return new Promise((resolve) => {
        if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
            console.warn('Messages: SockJS/STOMP not loaded; group thread will not update live');
            return resolve(false);
        }
        const client = Stomp.over(new SockJS(chatSocketEndpoint()));
        client.debug = null;
        state.stomp = client;
        // Don't leave the composer disabled if the socket never answers; sending still
        // works over REST, only live updates are lost.
        const giveUp = setTimeout(() => {
            console.warn('Messages: chat socket timed out; group thread will not update live');
            resolve(false);
        }, SOCKET_TIMEOUT_MS);
        client.connect({}, () => {
            clearTimeout(giveUp);
            // The user may have switched threads while the socket was connecting.
            if (state.stomp !== client) return resolve(false);
            state.subscription = client.subscribe(`/topic/group/${groupId}`, (frame) => {
                try {
                    const event = JSON.parse(frame.body);
                    if (event.context === 'sendMessageServer') appendGroupMessage(event);
                } catch (err) {
                    console.warn('Messages: bad chat frame', err);
                }
            });
            resolve(true);
        }, (err) => {
            clearTimeout(giveUp);
            console.warn('Messages: chat socket failed; group thread will not update live', err);
            resolve(false);
        });
    });
}

function appendGroupMessage({ sender, message, date }) {
    const key = [sender, date, message].join('|');
    if (state.seenKeys.has(key)) return;
    state.seenKeys.add(key);
    el('mentorThreadLog').querySelector('.mentor-messages__empty')?.remove();
    appendBubble({ sender, text: message, date, mine: sender === state.me.name });
    el('mentorThreadLog').scrollTop = el('mentorThreadLog').scrollHeight;
}

async function sendGroupMessage(text) {
    const res = await fetch(`${javaURI}/api/groups/chat/${state.active.groupId}/messages`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ name: state.me.name, message: text, date: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // With a live socket the server's broadcast echoes the message back; without one,
    // show it now so the sender isn't left wondering whether it went through.
    if (!state.subscription) appendGroupMessage({ sender: state.me.name, message: text, date: new Date().toISOString() });
}

// ---------- composer + rendering helpers ----------

async function onSubmit(event) {
    event.preventDefault();
    const input = el('mentorThreadInput');
    const text = input.value.trim();
    if (!text || !state.active) return;
    setComposerEnabled(false);
    try {
        if (state.active.kind === 'group') await sendGroupMessage(text);
        else await sendPrivateMessage(text);
        input.value = '';
    } catch (err) {
        console.error('Messages: send failed', err);
        el('mentorThreadHint').textContent = 'Could not send — please try again.';
    } finally {
        setComposerEnabled(true);
        input.focus();
    }
}

function appendBubble({ sender, text, date, mine }) {
    const bubble = document.createElement('div');
    bubble.className = mine ? 'mentor-messages__bubble mentor-messages__bubble--mine' : 'mentor-messages__bubble';
    const meta = [mine ? 'You' : (sender || 'Unknown'), formatTime(date)].filter(Boolean).join(' · ');
    bubble.append(textNode('span', meta, 'mentor-messages__meta'), textNode('span', text, 'mentor-messages__text'));
    el('mentorThreadLog').append(bubble);
}

function textNode(tag, text, className) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text == null ? '' : String(text);
    return node;
}

function formatTime(iso) {
    const date = iso ? new Date(iso) : null;
    if (!date || Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function truncate(text, max) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
