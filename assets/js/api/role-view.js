import { javaURI, fetchOptions } from './config.js';

const ROLE_KEY = 'ocsLoginRole';
const SIDEBAR_KEY = 'ocsMentorSidebar';

export function getChosenRole() {
    try { return localStorage.getItem(ROLE_KEY); } catch (e) { return null; }
}

export function setChosenRole(role) {
    try { localStorage.setItem(ROLE_KEY, role); } catch (e) { /* localStorage unavailable */ }
}

export function clearChosenRole() {
    try {
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(SIDEBAR_KEY);
    } catch (e) { /* localStorage unavailable */ }
}

export function roleNames(person) {
    return Array.isArray(person?.roles) ? person.roles.map(r => r.name) : [];
}

// Mentor view requires the real ROLE_MENTOR (Spring is the source of truth) AND the
// login choice not being "student". A mentor who logged in as a student gets the
// student view; a session from before the choice existed defaults to the mentor view.
export function viewFor(roles) {
    return roles.includes('ROLE_MENTOR') && getChosenRole() !== 'student' ? 'mentor' : 'student';
}

export async function fetchPerson() {
    try {
        const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
        return res.ok ? await res.json() : null;
    } catch (e) {
        return null;
    }
}
