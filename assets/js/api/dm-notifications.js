import { javaURI, fetchOptions } from './config.js';

// Navbar notification bell (_includes/themes/minima/header.html). The badge is the
// number of different people who have sent the signed-in user unread direct messages.
// Each fresh summary is broadcast as a 'dm:unread' event; dispatch 'dm:refresh-unread'
// after changing read state so the badge updates right away (dm_chat.html does).

const POLL_MS = 30000;
const bell = document.getElementById('dmBell');
const badge = document.getElementById('dmBellBadge');

let requestSeq = 0;
let pollTimer = null;
let stopped = false;

function render(summary) {
    if (!bell || !badge) return;
    const count = summary.count || 0;
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;

    if (count === 0) {
        bell.title = 'Direct messages';
        bell.setAttribute('aria-label', 'Direct messages');
    } else {
        const names = (summary.people || []).map((person) => person.name || person.uid);
        bell.title = `Unread messages from ${names.join(', ')}`;
        bell.setAttribute('aria-label',
            `Direct messages: unread messages from ${count === 1 ? '1 person' : `${count} people`}`);
    }
    bell.hidden = false;
}

async function refresh() {
    if (stopped || !bell || !badge) return;
    const seq = ++requestSeq;
    try {
        const res = await fetch(`${javaURI}/api/dm/unread`, fetchOptions);
        if (seq !== requestSeq) return; // superseded by a newer refresh
        if (!res.ok) {
            // Signed out (401) or a backend without DMs: hide the bell and stop asking.
            stopped = true;
            clearInterval(pollTimer);
            bell.hidden = true;
            return;
        }
        const summary = await res.json();
        if (seq !== requestSeq) return;
        render(summary);
        window.dispatchEvent(new CustomEvent('dm:unread', { detail: summary }));
    } catch {
        // Backend unreachable: keep the last known state and try again next poll.
    }
}

function schedulePolling() {
    clearInterval(pollTimer);
    pollTimer = !stopped && bell && badge && document.visibilityState === 'visible'
        ? setInterval(refresh, POLL_MS) : null;
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh();
    schedulePolling();
});
window.addEventListener('dm:refresh-unread', refresh);

refresh();
schedulePolling();
