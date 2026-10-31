import { javaURI, fetchOptions, springEnabled } from './config.js';

// Navbar notification bell (_includes/themes/minima/header.html). The badge is the
// number of conversations waiting for the signed-in user: each different person who has
// sent them unread direct messages, plus each of their groups with unread chat messages.
// Each fresh summary is broadcast as a 'dm:unread' event: Spring's DM summary plus
// `groups`, the unread count per group id. Dispatch 'dm:refresh-unread' after changing
// DM read state so the badge updates right away, and 'dm:group-read' ({ groupId }) after
// marking a group read. A successful message deletion also refreshes the summary because
// the backend may update unread state.

const POLL_MS = 30000;
// Spring counts a group's unread messages by reading the group's whole chat file from S3,
// so groups are asked about less often than DMs: when a page loads, when the tab comes
// back to the front, and otherwise at most every two minutes.
const GROUP_POLL_MS = 120000;
const bell = document.getElementById('dmBell');
const badge = document.getElementById('dmBellBadge');

let requestSeq = 0;
let pollTimer = null;
// DMs live in Spring, so a Flask-only site (spring: false in _config.yml) never asks.
let stopped = !springEnabled;
let dmSummary = { count: 0, people: [], conversations: {} };
// Group id -> unread count from Spring's last answer. Like Spring, it leaves out groups
// with nothing unread, so its size is the number of groups waiting.
let groupUnread = {};
let groupsCheckedAt = 0;
let groupsSupported = true;
// Group id -> when this page marked it read, so an answer counted before then can't
// bring its badge back.
const groupsReadAt = new Map();

const howMany = (n, one, many) => (n === 1 ? `1 ${one}` : `${n} ${many}`);

function render() {
    if (!bell || !badge) return;
    const people = dmSummary.count || 0;
    const groups = Object.keys(groupUnread).length;
    const count = people + groups;
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;

    if (count === 0) {
        bell.title = 'Messages';
        bell.setAttribute('aria-label', 'Messages');
    } else {
        const title = [];
        const label = [];
        if (people) {
            const names = (dmSummary.people || []).map((person) => person.name || person.uid);
            title.push(`Unread messages from ${names.join(', ')}`);
            label.push(`unread messages from ${howMany(people, 'person', 'people')}`);
        }
        if (groups) {
            title.push(`New messages in ${howMany(groups, 'group', 'groups')}`);
            label.push(`new messages in ${howMany(groups, 'group', 'groups')}`);
        }
        bell.title = title.join('. ');
        bell.setAttribute('aria-label', `Messages: ${label.join(', ')}`);
    }
    bell.hidden = false;
}

function broadcast() {
    render();
    window.dispatchEvent(new CustomEvent('dm:unread', { detail: { ...dmSummary, groups: { ...groupUnread } } }));
}

// The groups' part of the badge is best effort: on any failure it keeps its last state.
async function fetchGroupUnread() {
    const askedAt = Date.now();
    try {
        const res = await fetch(`${javaURI}/api/groups/chat/unread`, fetchOptions);
        if (res.status === 404) groupsSupported = false; // a backend without group read state
        if (!res.ok) return null;
        const counts = {};
        for (const [id, unread] of Object.entries((await res.json()).unreadByGroup || {})) {
            const readHere = groupsReadAt.get(id);
            if (Number(unread) > 0 && !(readHere >= askedAt)) counts[id] = Number(unread);
        }
        return counts;
    } catch {
        return null;
    }
}

async function refresh(withGroups) {
    if (stopped || !bell || !badge) return;
    const seq = ++requestSeq;
    try {
        const res = await fetch(`${javaURI}/api/dm/unread`, fetchOptions);
        if (seq !== requestSeq) return; // superseded by a newer refresh
        if (!res.ok) {
            if (res.status === 401 || res.status === 403 || res.status === 404) {
                // Signed out or a backend without DMs: hide the bell and stop asking.
                stopped = true;
                clearInterval(pollTimer);
                bell.hidden = true;
            }
            // Other errors (e.g. 5xx) are transient: keep the last state and retry next poll.
            return;
        }
        const summary = await res.json();
        if (seq !== requestSeq) return;
        dmSummary = summary;
        // Groups are asked about only once the DM answer shows someone is signed in.
        if (groupsSupported && (withGroups === true || Date.now() - groupsCheckedAt >= GROUP_POLL_MS)) {
            groupsCheckedAt = Date.now();
            const counts = await fetchGroupUnread();
            if (seq !== requestSeq) return;
            if (counts) groupUnread = counts;
        }
        broadcast();
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
    if (document.visibilityState === 'visible') refresh(true);
    schedulePolling();
});
window.addEventListener('dm:refresh-unread', refresh);
window.addEventListener('dm:message-deleted', refresh);
// A group read on this page drops off the badge straight away, without recounting
// every group.
window.addEventListener('dm:group-read', ({ detail }) => {
    const id = String(detail?.groupId ?? '');
    if (!id) return;
    groupsReadAt.set(id, Date.now());
    if (!(id in groupUnread)) return;
    delete groupUnread[id];
    if (!stopped) broadcast();
});

refresh(true);
schedulePolling();
