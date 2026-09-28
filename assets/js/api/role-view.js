import { javaURI, fetchOptions } from './config.js';

const SIDEBAR_KEY = 'ocsMentorSidebar';
const VIEW_KEY = 'ocsViewAs';

// Clears the cached sidebar choice and any "view as student" preference on logout
// (and at login), so the next session starts in the account's own view and a
// signed-out visitor doesn't briefly flash the previous session's mentor sidebar.
export function clearRoleViewCache() {
    try {
        localStorage.removeItem(SIDEBAR_KEY);
        localStorage.removeItem(VIEW_KEY);
    } catch (e) { /* localStorage unavailable */ }
}

export function roleNames(person) {
    return Array.isArray(person?.roles) ? person.roles.map(r => r.name) : [];
}

export function isMentorAccount(roles) {
    return roles.includes('ROLE_MENTOR');
}

// A mentor account can switch to the student view and back (the switch lives in the
// mentor banner and the navbar dropdown). This is presentation only: Spring still
// decides what the account may do, and the choice resets at login/logout.
export function viewFor(roles) {
    if (!isMentorAccount(roles)) return 'student';
    let preference = null;
    try { preference = localStorage.getItem(VIEW_KEY); } catch (e) { /* localStorage unavailable */ }
    return preference === 'student' ? 'student' : 'mentor';
}

// Flips a mentor account between the mentor and student views, then reloads so
// every part of the page (sidebar, capstone actions, dashboard tabs) re-renders.
export function switchView(roles) {
    const next = viewFor(roles) === 'mentor' ? 'student' : 'mentor';
    try {
        if (next === 'student') localStorage.setItem(VIEW_KEY, 'student');
        else localStorage.removeItem(VIEW_KEY);
    } catch (e) {
        console.error('Could not save the mentor/student view choice', e);
        return;
    }
    window.location.reload();
}

export async function fetchPerson() {
    try {
        const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        return res.ok ? await res.json() : null;
    } catch (e) {
        return null;
    }
}
