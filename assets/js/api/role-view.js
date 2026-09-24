import { javaURI, fetchOptions } from './config.js';

const SIDEBAR_KEY = 'ocsMentorSidebar';

// Clears the cached sidebar choice on logout, so a signed-out visitor doesn't
// briefly flash the previous session's mentor sidebar before the next role
// check (in _layouts/aesthetihawk.html) resolves.
export function clearMentorSidebarCache() {
    try { localStorage.removeItem(SIDEBAR_KEY); } catch (e) { /* localStorage unavailable */ }
}

export function roleNames(person) {
    return Array.isArray(person?.roles) ? person.roles.map(r => r.name) : [];
}

// The mentor/student view is derived purely from the account's real ROLE_MENTOR
// status (Spring is the source of truth) -- there is no separate user choice.
export function viewFor(roles) {
    return roles.includes('ROLE_MENTOR') ? 'mentor' : 'student';
}

export async function fetchPerson() {
    try {
        const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        return res.ok ? await res.json() : null;
    } catch (e) {
        return null;
    }
}
