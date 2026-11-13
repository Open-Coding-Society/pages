import { baseurl } from './config.js';
import { fetchPosts, fetchCurrentUser, isStatusMarker, normalizeAuthorUids } from './microblog.js';

// Microblog notifications for page authors: a red badge, like the DM bell's,
// on the navbar's Capstone tab (_includes/themes/minima/header.html) and on each
// capstone card on /capstone/ (assets/js/capstone-microblog-badges.js).
//
// A page's authors are the login uids in its `authors:` front matter, listed
// site-wide in assets/data/microblog-authors.json. For each page the signed-in
// user authors, the count is the posts and replies by other people since they
// last opened that page's microblog. "Last opened" is kept in this browser
// (localStorage, set by markMicroblogSeen), so another device counts on its own.
//
// Each count is broadcast as a 'microblog:unread' event ({ byPage, total }) and
// handed to onMicroblogUnread listeners; dispatch 'microblog:refresh-unread' to
// count again right away.

const POLL_MS = 60000;
const SEEN_PREFIX = 'microblog:seen:';

/* ── Counting (pure) ─────────────────────────────────────────────────── */

// "/capstone/aaa" and "/capstone/aaa/" are the same page, with or without the
// site's baseurl in front.
export function normalizePagePath(path, siteBaseurl = '') {
    let clean = String(path || '').split(/[?#]/)[0];
    if (siteBaseurl && clean.startsWith(siteBaseurl)) clean = clean.slice(siteBaseurl.length);
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean.endsWith('/') ? clean : `${clean}/`;
}

// Flask sends UTC times without a zone ("2026-10-27T15:04:05"); read them as UTC.
export function parseServerTime(timestamp) {
    if (!timestamp) return NaN;
    const text = String(timestamp);
    return Date.parse(/[zZ]$|[+-]\d\d:?\d\d$/.test(text) ? text : `${text}Z`);
}

// The pages a uid is listed as an author of: `path` exactly as the page's
// permalink (Flask finds a page's posts by that exact string), `key` normalized
// for matching links to it.
export function pagesAuthoredBy(authoredPages, uid) {
    if (!uid) return [];
    return (authoredPages || [])
        .filter(page => page && page.path && normalizeAuthorUids(page.authors).includes(uid))
        .map(page => ({ path: page.path, key: normalizePagePath(page.path) }));
}

// Posts and replies by anyone but `userId` that are newer than `seenAt` (ms).
// Resolve/reopen markers are status changes, not activity.
export function countNewActivity(posts, userId, seenAt) {
    let count = 0;
    for (const post of posts || []) {
        if (post.userId !== userId && parseServerTime(post.timestamp) > seenAt) count += 1;
        for (const reply of post.replies || []) {
            if (isStatusMarker(reply) || reply.userId === userId) continue;
            if (parseServerTime(reply.timestamp) > seenAt) count += 1;
        }
    }
    return count;
}

/* ── Seen times ──────────────────────────────────────────────────────── */

// localStorage can be missing or throw (a private window, blocked site data):
// then nothing is remembered and every visit counts from the start.
function readSeen(key) {
    try { return Number(globalThis.localStorage.getItem(SEEN_PREFIX + key)) || 0; } catch (_) { return 0; }
}

/**
 * Mark a page's microblog as seen now, and count again
 * @param {string} path - The page's permalink
 */
export function markMicroblogSeen(path) {
    try { globalThis.localStorage.setItem(SEEN_PREFIX + normalizePagePath(path), String(Date.now())); } catch (_) { /* memory only */ }
    window.dispatchEvent(new CustomEvent('microblog:refresh-unread'));
}

/* ── Loading and showing ─────────────────────────────────────────────── */

let authoredPagesPromise = null;
let userPromise = null;
let latest = null;
let requestSeq = 0;
let pollTimer = null;
let stopped = false;
const listeners = new Set();

function loadAuthoredPages() {
    authoredPagesPromise = authoredPagesPromise || fetch(`${baseurl}/assets/data/microblog-authors.json`)
        .then(response => (response.ok ? response.json() : []))
        .catch(() => []);
    return authoredPagesPromise;
}

/**
 * Call `listener({ byPage, total })` with every count, starting with the latest one
 * @param {Function} listener
 */
export function onMicroblogUnread(listener) {
    listeners.add(listener);
    if (latest) listener(latest);
}

// The red count inside each [data-microblog-unread-link] (the Capstone tab).
function renderNavBadges({ total }) {
    document.querySelectorAll('[data-microblog-unread-link]').forEach(link => {
        let badge = link.querySelector('.microblog-unread-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'microblog-unread-badge';
            badge.setAttribute('aria-hidden', 'true');
            link.appendChild(badge);
        }
        badge.textContent = total > 99 ? '99+' : String(total);
        badge.hidden = total === 0;
        const label = total ? `${link.dataset.microblogLabel || 'Capstone'}: ${total} new microblog post${total === 1 ? '' : 's'} on your pages` : '';
        if (label) link.setAttribute('aria-label', label);
        else link.removeAttribute('aria-label');
        link.title = label;
    });
    // On phones the tabs are behind the menu icon: a dot on it says there is news.
    document.querySelector('.site-nav')?.classList.toggle('has-microblog-unread', total > 0);
}

function publish(summary) {
    latest = summary;
    renderNavBadges(summary);
    listeners.forEach(listener => listener(summary));
    window.dispatchEvent(new CustomEvent('microblog:unread', { detail: summary }));
}

async function refresh() {
    if (stopped) return;
    const seq = ++requestSeq;
    userPromise = userPromise || fetchCurrentUser();
    const user = await userPromise;
    const pages = user ? pagesAuthoredBy(await loadAuthoredPages(), user.uid) : [];
    if (!pages.length) {
        // Signed out, or not an author of any page: nothing to count, ever.
        stopped = true;
        clearInterval(pollTimer);
        publish({ byPage: {}, total: 0 });
        return;
    }
    const byPage = {};
    await Promise.all(pages.map(async ({ path, key }) => {
        try {
            const data = await fetchPosts(path);
            byPage[key] = countNewActivity(data.microblogs, user.id, readSeen(key));
        } catch (error) {
            // Keep this page's last count; the next poll tries again.
            byPage[key] = latest?.byPage[key] || 0;
        }
    }));
    if (seq !== requestSeq) return; // superseded by a newer refresh
    publish({ byPage, total: Object.values(byPage).reduce((sum, count) => sum + count, 0) });
}

function schedulePolling() {
    clearInterval(pollTimer);
    pollTimer = !stopped && document.visibilityState === 'visible' ? setInterval(refresh, POLL_MS) : null;
}

if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') refresh();
        schedulePolling();
    });
    window.addEventListener('microblog:refresh-unread', refresh);
    refresh();
    schedulePolling();
}
