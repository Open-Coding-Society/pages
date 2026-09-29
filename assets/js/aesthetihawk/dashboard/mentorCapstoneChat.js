// Dashboard "Messages" tab for mentors: one chat per capstone project the mentor has been
// approved for (GET /api/capstones/mine), with that project's student group. Shown only in
// the mentor view and only once at least one project application has been approved; Spring
// enforces the same rule on the group chat itself.
import { javaURI, fetchOptions } from '../../api/config.js';
import { fetchPerson, roleNames, viewFor } from '../../api/role-view.js';
import { mountGroupChat } from '../../chat/groupChatPanel.js';

let activeChat = null;

export async function initMentorCapstoneChat() {
    const person = await fetchPerson();
    if (!person || viewFor(roleNames(person)) !== 'mentor') return;

    let projects = [];
    try {
        const res = await fetch(`${javaURI}/api/capstones/mine`, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        projects = await res.json();
    } catch (err) {
        console.error('Messages: could not load your approved projects', err);
        return;
    }
    if (!projects.length) return; // not cleared to mentor anything yet: no Messages tab

    document.getElementById('tab-messages-li').hidden = false;
    renderProjectPicker(projects, person);
    if (location.hash === '#messages') document.getElementById('tab-messages').click();
}

function renderProjectPicker(projects, person) {
    const picker = document.getElementById('mentorChatProjects');
    picker.replaceChildren();
    projects.forEach((project, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ocs__btn small pill';
        button.textContent = project.title;
        button.addEventListener('click', () => {
            picker.querySelectorAll('button').forEach((b) => {
                const selected = b === button;
                b.classList.toggle('accent', selected);
                b.classList.toggle('fill', selected);
                b.setAttribute('aria-pressed', String(selected));
            });
            openProjectChat(project, person);
        });
        picker.append(button);
        if (index === 0) button.click();
    });
}

function openProjectChat(project, person) {
    const container = document.getElementById('mentorChatPanel');
    activeChat?.destroy();
    activeChat = null;
    if (!project.groupId) {
        const note = document.createElement('div');
        note.className = 'login-notice login-notice--pending';
        note.innerHTML = '<h3>Student group not connected yet</h3>';
        const text = document.createElement('p');
        text.textContent = `An admin still needs to link ${project.title} to its student group on the Capstone Projects admin page. The chat opens here once they do.`;
        note.append(text);
        container.replaceChildren(note);
        return;
    }
    activeChat = mountGroupChat(container, {
        groupId: project.groupId,
        title: project.title,
        subtitle: 'Your capstone group — only you, its students and admins can read this.',
        displayName: person.name,
    });
}

window.addEventListener('beforeunload', () => activeChat?.destroy());
