// /capstone card tools, for everyone (navigation/capstone.md):
//   - "Mentors (n)": who is currently mentoring the project (names from GET /api/capstones).
//   - "Chat": talk with the project's students. It is the chat of the student group an
//     admin linked to the project (CapstoneGroupLinkService), so students see the same
//     conversation in their normal group chat. Shown once the project has a mentor, to
//     its approved mentors (mentor view), the students in that group, and admins/teachers.
//     Spring's group-chat ACL enforces the same rule server-side.
import { javaURI, fetchOptions } from '../api/config.js';
import { fetchPerson, roleNames, viewFor } from '../api/role-view.js';
import { cardUrl, cardActionRow } from './cardActions.js';

const CHAT_SOCKET_PORT = 8589; // same hard-coded port as groups.js / lesson_chat.html
const SOCKET_TIMEOUT_MS = 8000;

export async function initCardTools(grid) {
    const projectsByUrl = await loadProjects();
    const viewer = await loadViewer();
    grid.querySelectorAll(':scope > div').forEach((card) => {
        const project = projectsByUrl[cardUrl(card)];
        if (!project || project.mentorNames.length === 0) return;
        const row = cardActionRow(card);
        if (!row) return;
        row.append(mentorsButton(row, project));
        if (canChat(project, viewer)) row.append(chatButton(project, viewer));
    });
}

// ---------- data ----------

async function loadProjects() {
    const byUrl = {};
    try {
        const res = await fetch(`${javaURI}/api/capstones`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        (await res.json()).forEach((project) => {
            let path = project.url;
            try { path = new URL(project.url, location.origin).pathname; } catch (e) { /* keep raw */ }
            byUrl[path] = { ...project, mentorNames: project.mentorNames || [] };
        });
    } catch (err) {
        console.error('Capstone: could not load project mentors', err);
    }
    return byUrl;
}

// Who is looking: which projects they mentor and which student groups they belong to.
async function loadViewer() {
    const person = await fetchPerson();
    if (!person) return null;
    const roles = roleNames(person);
    const viewer = {
        person,
        isStaff: roles.includes('ROLE_ADMIN') || roles.includes('ROLE_TEACHER'),
        mentoredProjectIds: new Set(),
        groupIds: new Set(),
    };
    try {
        const requests = [fetch(`${javaURI}/api/groups/person/${person.id}`, fetchOptions)];
        if (viewFor(roles) === 'mentor') requests.push(fetch(`${javaURI}/api/capstones/mine`, fetchOptions));
        const [groupsRes, mineRes] = await Promise.all(requests);
        if (groupsRes.ok) (await groupsRes.json()).forEach((g) => viewer.groupIds.add(g.id));
        if (mineRes?.ok) (await mineRes.json()).forEach((p) => viewer.mentoredProjectIds.add(p.id));
    } catch (err) {
        console.error('Capstone: could not load your groups/projects', err);
    }
    return viewer;
}

function canChat(project, viewer) {
    if (!viewer || !project.groupId) return false;
    return viewer.isStaff || viewer.mentoredProjectIds.has(project.id) || viewer.groupIds.has(project.groupId);
}

// ---------- Mentors popover ----------

function mentorsButton(row, project) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ocs__btn small pill';
    button.textContent = `Mentors (${project.mentorNames.length})`;
    button.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.className = 'capstone-mentors-panel';
    panel.hidden = true;
    panel.append(textNode('div', 'Currently mentoring', 'capstone-mentors-panel__title'));
    const list = document.createElement('ul');
    project.mentorNames.forEach((name) => list.append(textNode('li', name)));
    panel.append(list);
    row.append(panel);

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = panel.hidden;
        document.querySelectorAll('.capstone-mentors-panel').forEach((p) => { p.hidden = true; });
        panel.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target)) {
            panel.hidden = true;
            button.setAttribute('aria-expanded', 'false');
        }
    });
    return button;
}

// ---------- Chat dialog (one shared <dialog> for the page) ----------

const chat = { dialog: null, stomp: null, subscription: null, seenKeys: new Set(), project: null, viewer: null };

function chatButton(project, viewer) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ocs__btn small pill accent';
    button.textContent = '💬 Chat';
    button.addEventListener('click', () => openChat(project, viewer));
    return button;
}

function chatDialog() {
    if (chat.dialog) return chat.dialog;
    const dialog = document.createElement('dialog');
    dialog.className = 'capstone-chat';
    dialog.innerHTML = `
        <header class="capstone-chat__header">
            <div>
                <h3 class="capstone-chat__title"></h3>
                <div class="capstone-chat__hint">Messages go to this project's student group.</div>
            </div>
            <button type="button" class="ocs__btn small pill capstone-chat__close" aria-label="Close chat">✕</button>
        </header>
        <div class="capstone-chat__log" aria-live="polite"></div>
        <form class="capstone-chat__composer" autocomplete="off">
            <input class="capstone-chat__input" type="text" maxlength="2000" placeholder="Write a message…" aria-label="Message">
            <button type="submit" class="ocs__btn accent fill">Send</button>
        </form>`;
    document.body.append(dialog);
    dialog.querySelector('.capstone-chat__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', disconnect);
    dialog.querySelector('form').addEventListener('submit', onSend);
    chat.dialog = dialog;
    return dialog;
}

async function openChat(project, viewer) {
    const dialog = chatDialog();
    disconnect();
    chat.project = project;
    chat.viewer = viewer;
    chat.seenKeys.clear();
    dialog.querySelector('.capstone-chat__title').textContent = `Chat — ${project.title}`;
    const log = dialog.querySelector('.capstone-chat__log');
    log.innerHTML = '';
    dialog.showModal();
    await loadHistory(project.groupId);
    connect(project.groupId);
    dialog.querySelector('.capstone-chat__input').focus();
}

async function loadHistory(groupId) {
    try {
        const res = await fetch(`${javaURI}/api/groups/chat/${groupId}/messages`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        (await res.json()).forEach((msg) => appendMessage({ sender: msg.name, message: msg.message, date: msg.date }));
    } catch (err) {
        console.error('Capstone chat: could not load history', err);
    }
    const log = chat.dialog.querySelector('.capstone-chat__log');
    if (!log.children.length) log.append(textNode('p', 'No messages yet — say hello.', 'capstone-chat__empty'));
}

function socketEndpoint() {
    const uri = new URL(javaURI);
    if (uri.hostname === 'localhost' || uri.hostname === '127.0.0.1') {
        return `${uri.protocol}//${uri.hostname}:${CHAT_SOCKET_PORT}/ws-chat`;
    }
    return `${javaURI}/ws-chat`;
}

// Live updates over the same SockJS/STOMP socket as the weekly chat. If it never
// connects, sending still works over REST; only live updates are lost.
function connect(groupId) {
    if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
        console.warn('Capstone chat: SockJS/STOMP not loaded; no live updates');
        return;
    }
    const client = Stomp.over(new SockJS(socketEndpoint()));
    client.debug = null;
    chat.stomp = client;
    const giveUp = setTimeout(() => console.warn('Capstone chat: socket timed out; no live updates'), SOCKET_TIMEOUT_MS);
    client.connect({}, () => {
        clearTimeout(giveUp);
        if (chat.stomp !== client) return; // chat closed/switched while connecting
        chat.subscription = client.subscribe(`/topic/group/${groupId}`, (frame) => {
            try {
                const event = JSON.parse(frame.body);
                if (event.context === 'sendMessageServer') appendMessage(event);
            } catch (err) {
                console.warn('Capstone chat: bad frame', err);
            }
        });
    }, (err) => {
        clearTimeout(giveUp);
        console.warn('Capstone chat: socket failed; no live updates', err);
    });
}

function disconnect() {
    try {
        if (chat.subscription) chat.subscription.unsubscribe();
        if (chat.stomp && chat.stomp.connected) chat.stomp.disconnect();
    } catch (err) {
        console.warn('Capstone chat: socket close failed', err);
    }
    chat.subscription = null;
    chat.stomp = null;
}

async function onSend(event) {
    event.preventDefault();
    const input = chat.dialog.querySelector('.capstone-chat__input');
    const text = input.value.trim();
    if (!text || !chat.project) return;
    const sender = chat.viewer.person.name;
    input.disabled = true;
    try {
        const res = await fetch(`${javaURI}/api/groups/chat/${chat.project.groupId}/messages`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ name: sender, message: text, date: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        input.value = '';
        // With a live socket the broadcast echoes it back; otherwise show it now.
        if (!chat.subscription) appendMessage({ sender, message: text, date: new Date().toISOString() });
    } catch (err) {
        console.error('Capstone chat: send failed', err);
        chat.dialog.querySelector('.capstone-chat__hint').textContent = 'Could not send — please try again.';
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function appendMessage({ sender, message, date }) {
    const key = [sender, date, message].join('|');
    if (chat.seenKeys.has(key)) return;
    chat.seenKeys.add(key);
    const log = chat.dialog.querySelector('.capstone-chat__log');
    log.querySelector('.capstone-chat__empty')?.remove();
    const mine = sender === chat.viewer.person.name;
    const bubble = document.createElement('div');
    bubble.className = mine ? 'capstone-chat__bubble capstone-chat__bubble--mine' : 'capstone-chat__bubble';
    const meta = [mine ? 'You' : (sender || 'Unknown'), formatTime(date)].filter(Boolean).join(' · ');
    bubble.append(textNode('span', meta, 'capstone-chat__meta'), textNode('span', message, 'capstone-chat__text'));
    log.append(bubble);
    log.scrollTop = log.scrollHeight;
}

function textNode(tag, text, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text == null ? '' : String(text);
    return node;
}

function formatTime(iso) {
    const date = iso ? new Date(iso) : null;
    if (!date || Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
