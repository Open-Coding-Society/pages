// /capstone card tools, for everyone (navigation/capstone.md):
//   - "Mentors (n)": who is currently mentoring the project (names from GET /api/capstones).
//     Only on projects that have a mentor.
//   - "Chat": on every project. It is the chat of the project's student group
//     (CapstoneGroupLinkService; created on first open via POST /api/capstones/{id}/chat),
//     so the team sees the same conversation in their normal group chat. Anyone signed in
//     can read it; the team, its approved mentors (mentor view) and admins/teachers can
//     post. Spring's group-chat ACL enforces the same rule server-side.
//   - "Message Mentor": shown next to "Chat" to a signed-in student who isn't in that
//     group yet, on projects that have a mentor, so they don't need an admin to add them
//     first. Clicking it self-joins them (POST /api/groups/{id}/members/{personId},
//     already open to any authenticated role) and opens the chat with posting enabled.
//     Never shown to mentors or staff: they post through canPost below, and a mentor
//     self-joining as if they were a student would defeat the "students only" rule.
import { javaURI, fetchOptions } from '../api/config.js';
import { fetchPerson, roleNames, viewFor } from '../api/role-view.js';
import { cardUrl, cardActionGroup } from './cardActions.js';
import { mountGroupChat } from '../chat/groupChatPanel.js';
import { iconButton, setIconLabel } from './cardIcons.js';


export async function initCardTools(grid) {
    // The Links menu button is created by the page's non-module script; give it the same
    // icon + label format as the other card buttons.
    grid.querySelectorAll('.capstone-links-button').forEach((button) => setIconLabel(button, 'link', 'Links'));
    const projectsByUrl = await loadProjects();
    const viewer = await loadViewer();
    grid.querySelectorAll(':scope > div').forEach((card) => {
        const project = projectsByUrl[cardUrl(card)];
        if (!project) return;
        // Project info goes on its own line under the card text.
        const extra = cardActionGroup(card, 'extra');
        if (!extra) return;
        if (project.mentorNames.length > 0) extra.append(mentorsButton(extra, project));
        extra.append(chatButton(project, viewer));
        if (canSelfJoin(project, viewer)) extra.append(joinChatButton(extra, project, viewer));
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
        roles,
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

// Whether the viewer may post in the project's chat (everyone signed in may read it).
function canPost(project, groupId, viewer) {
    return viewer.isStaff || viewer.mentoredProjectIds.has(project.id) || viewer.groupIds.has(groupId);
}

// The project's chat group id, creating the group on the project's first chat open.
async function chatGroupId(project) {
    if (project.groupId) return project.groupId;
    const res = await fetch(`${javaURI}/api/capstones/${project.id}/chat`, { ...fetchOptions, method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    project.groupId = (await res.json()).groupId;
    return project.groupId;
}

// A real student (ROLE_STUDENT/ROLE_USER, never ROLE_MENTOR) who isn't a member of this
// mentored project's group yet. Staff and the project's own mentors are excluded here even
// though canPost already covers them -- a mentor on a *different* project is still
// ROLE_MENTOR and must not get a "join as student" button on this one.
function canSelfJoin(project, viewer) {
    if (!viewer || !project.groupId || project.mentorNames.length === 0) return false;
    if (viewer.isStaff || viewer.roles.includes('ROLE_MENTOR')) return false;
    if (viewer.groupIds.has(project.groupId)) return false;
    return viewer.roles.includes('ROLE_STUDENT') || viewer.roles.includes('ROLE_USER');
}

// ---------- Mentors popover ----------

function mentorsButton(row, project) {
    const button = iconButton('ocs__btn small accent', 'people', `Mentors (${project.mentorNames.length})`);
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
// Holds a course-style chat panel (groupChatPanel.js).

const chat = { dialog: null, panel: null };

function chatButton(project, viewer) {
    const button = iconButton('ocs__btn small accent fill', 'chat', 'Chat');
    button.addEventListener('click', () => openChat(project, viewer));
    return button;
}

// Self-serve join for a student who isn't in the project's group yet. Joins them via the
// same endpoint the admin page uses, then opens the chat with posting enabled; the card's
// "Chat" button covers it from then on, so this button goes away.
function joinChatButton(row, project, viewer) {
    const button = iconButton('ocs__btn small accent', 'send', 'Message Mentor');
    button.addEventListener('click', async () => {
        button.disabled = true;
        try {
            const response = await fetch(`${javaURI}/api/groups/${project.groupId}/members/${viewer.person.id}`, {
                ...fetchOptions,
                method: 'POST',
            });
            // 409 = already a member (e.g. a second click, or an admin added them in the
            // meantime) -- that's the state we wanted, not a failure.
            if (!response.ok && response.status !== 409) {
                throw new Error(await errorText(response, 'Could not join this project chat'));
            }
            viewer.groupIds.add(project.groupId);
            openChat(project, viewer);
            button.remove();
        } catch (error) {
            window.alert(error.message);
            button.disabled = false;
        }
    });
    return button;
}

async function errorText(response, fallback) {
    try {
        const body = await response.text();
        return body && body.length < 300 ? body : `${fallback} (${response.status})`;
    } catch (e) {
        return `${fallback} (${response.status})`;
    }
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

async function openChat(project, viewer) {
    const dialog = chatDialog();
    const body = dialog.querySelector('.capstone-chat__body');
    const subtitle = "The project team's chat with its mentors.";
    chat.panel?.destroy();
    chat.panel = null;
    if (!viewer) {
        chat.panel = mountGroupChat(body, {
            title: project.title,
            subtitle,
            signedOut: true,
            notice: 'Sign in to read the messages in this project chat.',
        });
        dialog.showModal();
        return;
    }
    let groupId;
    try {
        groupId = await chatGroupId(project);
    } catch (err) {
        console.error(`Capstone: could not open the chat for project ${project.id}`, err);
        body.replaceChildren(textNode('div', 'This chat could not be opened. Please try again.', 'capstone-chat__error'));
        dialog.showModal();
        return;
    }
    const readOnly = !canPost(project, groupId, viewer);
    chat.panel = mountGroupChat(body, {
        groupId,
        title: project.title,
        subtitle,
        displayName: viewer.person.name,
        readOnly,
        notice: readOnly ? "You're viewing this project's chat. Only its team and mentors can post here." : '',
    });
    dialog.showModal();
}

function textNode(tag, text, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text == null ? '' : String(text);
    return node;
}
