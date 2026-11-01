// Pure helpers for the phone review page (navigation/review.md) and the microblog
// panel's QR button. No DOM, no fetch: tests/microblog_review.test.mjs runs them in Node.

export const REVIEW_PATH = '/review';
export const POST_LIMIT = 280;

// A topic is the page's permalink, e.g. /capstone/presence-system/. The review page
// takes it from the URL, so it is checked before it is used as a link or sent to Flask:
// only a path on this site, nothing that could leave it (a scheme, a host, a protocol-
// relative URL) or wander (`..`). Returns the clean path, or null.
export function normalizeTopicPath(raw) {
    if (typeof raw !== 'string') return null;
    let path = raw.trim();
    const cut = path.search(/[?#]/);
    if (cut !== -1) path = path.slice(0, cut);
    if (!path.startsWith('/') || path.startsWith('//')) return null;
    if (/\s|\\/.test(path)) return null;
    if (path.split('/').some(part => part === '..' || part === '.')) return null;
    return path;
}

// The topic from the review page's query string (?topic=...), or null.
export function topicFromSearch(search) {
    const params = new URLSearchParams(search || '');
    return normalizeTopicPath(params.get('topic'));
}

// The address a QR code encodes: the review page for one project. `baseurl` is the
// site's base URL ("" on pages.opencodingsociety.com, "/pages" on a fork).
export function buildReviewUrl({ origin, baseurl = '', topicPath }) {
    const topic = normalizeTopicPath(topicPath);
    if (!origin || !topic) return null;
    return `${origin}${baseurl}${REVIEW_PATH}?topic=${encodeURIComponent(topic)}`;
}

// The page's title for the heading. `titles` maps permalink -> title, built by Jekyll from
// the posts that have a microblog. A path with no title falls back to its last segment:
// /capstone/presence-system/ -> "Presence System".
export function titleForTopic(topicPath, titles = {}) {
    if (titles[topicPath]) return titles[topicPath];
    const last = topicPath.split('/').filter(Boolean).pop() || '';
    return last
        .split(/[-_]+/)
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}

export function remainingChars(content, limit = POST_LIMIT) {
    return limit - (content || '').length;
}

// A visitor on the review page gives only a name. The account behind their post is a guest
// account Flask needs (a few hours, limited to the microblog), made from the name plus a
// random tail so two "Sam"s never collide. The password is a separate secret that nobody sees
// or keeps: it must not be derivable from the username, which every post shows.
// `random` returns a lowercase letter-and-digit string of the asked length (tests pass a fixed one).
export function guestCredentials(name, random = secureRandomString) {
    const stem = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12) || 'guest';
    return {
        uid: `${stem}-${random(6)}`,
        // 8+ characters with an uppercase letter, a lowercase letter, a number, and one of `~!@#$%^&*()
        password: `Qr!${random(20)}aZ9`,
    };
}

// Letters and digits from the browser's cryptographic generator; refuses to run without one
function secureRandomString(length) {
    const generator = globalThis.crypto;
    if (!generator || typeof generator.getRandomValues !== 'function') {
        throw new Error('This browser cannot make a secure guest account.');
    }
    const bytes = new Uint8Array(length);
    generator.getRandomValues(bytes);
    // 256 % 36 leaves a slight bias toward the first 4 symbols; fine for a tail, and the
    // password's strength comes from its 20 symbols, not from a perfectly flat spread
    return Array.from(bytes, b => (b % 36).toString(36)).join('');
}
