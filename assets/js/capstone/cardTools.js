// /capstone card tools, for everyone (navigation/capstone.md):
//   - "Mentors (n)": who is currently mentoring the project (names from GET /api/capstones).
//   - "Chat": talk with the project's students. It is the chat of the student group an
//     admin linked to the project (CapstoneGroupLinkService), so students see the same
//     conversation in their normal group chat. Shown once the project has a mentor, to
//     its approved mentors (mentor view), the students in that group, and admins/teachers.
//     Spring's group-chat ACL enforces the same rule server-side.
import { javaURI, fetchOptions } from '../api/config.js';
import { fetchPerson, roleNames, viewFor } from '../api/role-view.js';
import { cardUrl, cardActionGroup } from './cardActions.js';
import { mountGroupChat } from '../chat/groupChatPanel.js';


export async function initCardTools(grid) {
    const projectsByUrl = await loadProjects();
    const viewer = await loadViewer();
    grid.querySelectorAll(':scope > div').forEach((card) => {
        const project = projectsByUrl[cardUrl(card)];
        if (!project || project.mentorNames.length === 0) return;
        // Project info goes in the right-hand group of the card's action row.
        const extra = cardActionGroup(card, 'extra');
        if (!extra) return;
        extra.append(mentorsButton(extra, project));
        if (canChat(project, viewer)) extra.append(chatButton(project, viewer));
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
    const button = iconButton('ocs__btn small accent', ICON_PEOPLE, `Mentors (${project.mentorNames.length})`);
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
// Holds the same course-style chat panel as the dashboard Messages tab.

const chat = { dialog: null, panel: null };

function chatButton(project, viewer) {
    const button = iconButton('ocs__btn small accent fill', ICON_CHAT, 'Chat');
    button.addEventListener('click', () => openChat(project, viewer));
    return button;
}

function chatDialog() {
    if (chat.dialog) return chat.dialog;
    const dialog = document.createElement('dialog');
    dialog.className = 'capstone-chat';
    dialog.setAttribute('aria-label', 'Capstone chat');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'ocs__btn small pill capstone-chat__close';
    close.setAttribute('aria-label', 'Close chat');
    close.textContent = '✕';
    close.addEventListener('click', () => dialog.close());
    const body = document.createElement('div');
    body.className = 'capstone-chat__body';
    dialog.append(close, body);
    dialog.addEventListener('close', () => { chat.panel?.destroy(); chat.panel = null; });
    document.body.append(dialog);
    chat.dialog = dialog;
    return dialog;
}

function openChat(project, viewer) {
    const dialog = chatDialog();
    chat.panel?.destroy();
    chat.panel = mountGroupChat(dialog.querySelector('.capstone-chat__body'), {
        groupId: project.groupId,
        title: project.title,
        subtitle: "This project's student group — its mentors and admins can read it too.",
        displayName: viewer.person.name,
    });
    dialog.showModal();
}

// ---------- icon buttons (OCS ocs__btn--icon grammar: icon slot + label) ----------

// 16x16 glyphs from Bootstrap Icons (MIT), filled with the button's text colour.
const ICON_CHAT = 'M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15';
const ICON_PEOPLE = 'M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5';

function iconButton(className, iconPath, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${className} ocs__btn--icon`;
    button.innerHTML = `<span class="ocs__btn-icon" aria-hidden="true"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="${iconPath}"/></svg></span>`;
    button.append(textNode('span', label));
    return button;
}

function textNode(tag, text, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text == null ? '' : String(text);
    return node;
}
