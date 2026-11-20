// The microblog panel's quick access: log in if you already have an account, or make a guest or a
// mentor account without leaving the page.
//
// A guest is made through Flask's sign-up like anyone else's, so it follows the Guest Window and the
// rest of the guest rules. A mentor is made in Flask and in Spring, the way the login page makes one,
// and waits for a Teacher or Admin to verify it before it can post.
import { pythonURI, javaURI, fetchOptions, springEnabled } from './config.js';
import { SPRING_PASSWORD_RULES, meetsSpringPasswordRules } from './passwordRules.js';

// The account types this panel can create. The login page asks Flask for these (GET /api/signup-options);
// this panel keeps its own two so it works with a Flask that does not send them.
export const QUICK_TYPES = [
    {
        id: 'guest', label: 'Guest', uidPlaceholder: 'Username', needsName: false, needsEmail: false, spring: false,
        requiresOpenWindow: true,
        note: 'A guest can view pages, post on the microblog, comment and react to posts. It lasts only a few hours.',
    },
    {
        id: 'mentor', label: 'Mentor', uidPlaceholder: 'GitHub ID', needsName: true, needsEmail: true, spring: true,
        requiresOpenWindow: false,
        note: 'A mentor account needs a Teacher or Admin to verify it before it can post.',
    },
];

const UNREACHABLE = 'Could not reach the server. Check your connection and try again.';
const WAITING = 'Your account is waiting for a Teacher or Admin to verify it. You can post once they have.';

async function readBody(response) {
    try {
        const body = JSON.parse(await response.text());
        return body && typeof body === 'object' ? body : null;
    } catch (_) {
        return null;  // not JSON (an error page from a proxy): show none of it
    }
}

function post(url, payload) {
    return fetch(url, { ...fetchOptions, method: 'POST', body: JSON.stringify(payload) });
}

// Log in to Flask, and to Spring as well for an account that has one, so the rest of the site works.
export async function quickLogin({ uid, password }) {
    if (!uid || !password) return { ok: false, message: 'Enter your username and password.' };
    let response;
    try {
        response = await post(`${pythonURI}/api/authenticate`, { uid, password });
    } catch (_) {
        return { ok: false, message: UNREACHABLE };
    }
    const body = await readBody(response);
    if (!response.ok) {
        return { ok: false, message: (body && typeof body.message === 'string' && body.message) || `Login failed (${response.status})` };
    }
    const user = (body && body.user) || {};
    if (springEnabled && !user.limited) {
        try {
            await post(`${javaURI}/authenticate`, { uid, password });  // best effort: Flask is the login that counts here
        } catch (_) { /* Spring is not needed to post */ }
    }
    const pending = user.active === false;
    return { ok: true, pending, user, message: pending ? WAITING : 'You are logged in.' };
}

// Make an account of this type, then log in to it.
export async function quickSignup({ type, uid, password, name, email }) {
    const cleanEmail = (email || '').trim();
    if (!uid || uid.length < 2) return { ok: false, message: `Enter a ${type.uidPlaceholder.toLowerCase() === 'github id' ? 'GitHub ID' : 'username'} of at least 2 characters.` };
    if (type.needsName && (!name || name.trim().length < 2)) return { ok: false, message: 'Enter your name.' };
    if (type.needsEmail && !cleanEmail) return { ok: false, message: 'Enter your email.' };
    if (!meetsSpringPasswordRules(password || '')) return { ok: false, message: SPRING_PASSWORD_RULES };

    const details = { name: type.needsName ? name.trim() : uid, uid };
    if (type.spring) Object.assign(details, { sid: '', school: '' });
    if (cleanEmail) details.email = cleanEmail;
    Object.assign(details, { password, accountType: type.id });

    let response;
    try {
        response = await post(`${pythonURI}/api/user`, details);
    } catch (_) {
        return { ok: false, message: UNREACHABLE };
    }
    if (!response.ok) {
        const body = await readBody(response);
        return { ok: false, message: (body && typeof body.message === 'string' && body.message) || `Sign-up failed (${response.status})` };
    }
    if (springEnabled && type.spring) {
        try {
            await post(`${javaURI}/api/person/create`, details);  // best effort, as on the login page
        } catch (_) { /* Flask accepted the account; Spring can be fixed later */ }
    }
    const login = await quickLogin({ uid, password });
    if (!login.ok) return { ok: false, message: `The account was made, but logging in failed: ${login.message}` };
    return {
        ok: true, pending: login.pending, user: login.user,
        message: login.pending ? `${type.label} account created. A Teacher or Admin needs to verify it before you can post.` : `${type.label} account created. You are logged in.`,
    };
}

// Whether a Teacher or Admin has the Guest Window open, and when it closes. If Flask cannot be asked, it counts as
// closed, and `reachable` says it could not be asked, so the panel can tell "closed" from "could not check".
export async function guestWindowOpen() {
    try {
        const response = await fetch(`${pythonURI}/api/guest/window`, fetchOptions);
        const body = response.ok ? await readBody(response) : null;
        if (!body || typeof body.open !== 'boolean') return { open: false, reachable: false };
        if (body.open !== true) return { open: false, reachable: true };
        // Flask gives UTC with no zone mark: say so, so the time shown is the visitor's own
        return { open: true, reachable: true, closes: new Date(body.closes_at + 'Z').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
    } catch (_) {
        return { open: false, reachable: false };
    }
}

// Wire the panel in _includes/microblog_foundation.html.
export async function initQuickAccess() {
    const $ = (id) => document.getElementById(id);
    const panel = $('quick-access');
    const select = $('quick-type');
    const guestOption = select.querySelector('option[value="guest"]');
    let windowCloses = null;

    function setStatus(message, kind) {
        const status = $('quick-status');
        status.textContent = message;  // text, never markup
        status.className = 'guest-status' + (kind ? ` is-${kind}` : '');
    }

    function showTab(which) {
        const login = which === 'login';
        $('quick-login-form').hidden = !login;
        $('quick-signup-form').hidden = login;
        $('quick-tab-login').setAttribute('aria-selected', login);
        $('quick-tab-signup').setAttribute('aria-selected', !login);
        setStatus('', null);
    }

    function applyType() {
        const type = QUICK_TYPES.find((t) => t.id === select.value) || QUICK_TYPES[1];
        $('quick-name-group').hidden = !type.needsName;
        $('quick-email-group').hidden = false;  // required for a mentor, a help to keep one account for a guest
        $('quick-name').required = type.needsName;
        $('quick-email').required = type.needsEmail;
        $('quick-uid').placeholder = type.uidPlaceholder;
        $('quick-email').placeholder = type.needsEmail ? 'Email' : 'Email (optional, helps you keep one account)';
        $('quick-type-note').textContent = type.note + (type.requiresOpenWindow && windowCloses ? ` Sign-up is open until ${windowCloses}.` : '');
    }

    // A guest can be made only while a Teacher or Admin has the Guest Window open. The option is always listed, so it
    // can be found, but it can be chosen only then, and its label says why when it cannot.
    guestOption.hidden = false;
    guestOption.disabled = true;
    guestOption.textContent = 'Guest (checking...)';
    select.value = 'mentor';
    $('quick-window-note').hidden = true;
    applyType();
    showTab('login');

    $('quick-access-toggle').addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    $('quick-tab-login').addEventListener('click', () => showTab('login'));
    $('quick-tab-signup').addEventListener('click', () => showTab('signup'));
    select.addEventListener('change', applyType);

    async function run(button, working, action, afterSuccess) {
        button.disabled = true;
        setStatus(working, null);
        try {
            const result = await action();
            setStatus(result.message, result.ok ? 'success' : 'error');
            if (result.ok) {
                afterSuccess();
                window.dispatchEvent(new CustomEvent('quick-access:login', { detail: { user: result.user } }));  // the microblog reloads
            }
        } finally {
            button.disabled = false;
        }
    }

    $('quick-login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        return run($('quick-login-submit'), 'Logging in...',
            () => quickLogin({ uid: $('quick-login-uid').value.trim(), password: $('quick-login-password').value }),
            () => { $('quick-login-password').value = ''; });
    });
    $('quick-signup-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const type = QUICK_TYPES.find((t) => t.id === select.value) || QUICK_TYPES[1];
        return run($('quick-signup-submit'), 'Creating the account...',
            () => quickSignup({
                type, uid: $('quick-uid').value.trim(), password: $('quick-password').value,
                name: $('quick-name').value, email: $('quick-email').value,
            }),
            () => { $('quick-password').value = ''; });
    });

    const guestWindow = await guestWindowOpen();
    if (guestWindow.open) {
        windowCloses = guestWindow.closes;
        guestOption.disabled = false;
        guestOption.textContent = 'Guest';
        select.value = 'guest';
    } else if (guestWindow.reachable) {
        guestOption.textContent = 'Guest (closed right now)';
        $('quick-window-note').textContent = 'Guest sign-up is closed right now. A teacher can open the Guest Window.';
        $('quick-window-note').hidden = false;
    } else {
        guestOption.textContent = 'Guest (unavailable)';
        $('quick-window-note').textContent = 'Could not check whether guest sign-up is open. Check your connection and reload.';
        $('quick-window-note').hidden = false;
    }
    applyType();
}
