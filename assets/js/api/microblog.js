import { pythonURI, fetchOptions } from './config.js';
import { withMicroblogRateLimit } from './microblog-rate-limit.js';

/**
 * Microblog API Module
 * Provides reusable functions for interacting with the microblog API
 */

/**
 * Fetch all microblog posts
 * @returns {Promise<Array>} - Resolves to an array of posts or an error
 */
/**
 * Fetch microblog posts, optionally filtered by page
 * @param {string} [page] - Optional page filter
 * @returns {Promise<Array>} - Resolves to an array of posts or an error
 */
export async function fetchPosts(pagePath) {
    let apiUrl = pythonURI + '/api/microblog';
    if (pagePath) {
        // Encode pagePath as a query parameter
        const param = encodeURIComponent(pagePath);
        apiUrl += `?pagePath=${param}`;
    }
    try {
        const response = await fetch(apiUrl, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Microblog posts retrieved:', data);
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a new microblog post
 * @param {Object} postData - { content, topicId, ... }
 * @returns {Promise<Object>} - Created post or error
 */
export async function createPost(postData) {
    const apiUrl = pythonURI + '/api/microblog';
    const options = {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(postData)
    };
    return withMicroblogRateLimit(() => fetch(apiUrl, options));
}

/**
 * Update an existing microblog post
 * @param {number|string} id - Post ID
 * @param {Object} postData - Fields to update
 * @returns {Promise<Object>} - Updated post or error
 */
export async function updatePost(postData) {
    const apiUrl = pythonURI + `/api/microblog`;
    const options = {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(postData)
    };
    return withMicroblogRateLimit(() => fetch(apiUrl, options));
}

/**
 * Create a reply to a microblog post
 * @param {Object} replyData - { postId, content, topicPath }
 * @returns {Promise<Object>} - Created reply or error
 */
export async function createReply(replyData) {
    const apiUrl = pythonURI + '/api/microblog/reply';
    const options = {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(replyData)
    };
    return withMicroblogRateLimit(() => fetch(apiUrl, options));
}

/**
 * Fetch replies for a specific post
 * @param {number|string} postId - Post ID to fetch replies for
 * @returns {Promise<Array>} - Array of replies or error
 */
export async function fetchReplies(postId) {
    const apiUrl = pythonURI + `/api/microblog/reply?postId=${postId}`;
    try {
        const response = await fetch(apiUrl, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

/*
 * Settings-style writes (delete, resolve/reopen markers) skip the
 * 30-second cooldown in microblog-rate-limit.js: it exists to slow down new
 * content, and resolving a post shouldn't lock someone out of replying.
 */
async function sendWithoutCooldown(path, method, body) {
    const response = await fetch(pythonURI + path, {
        ...fetchOptions,
        method,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

/**
 * Delete a microblog post (the server only allows its writer or an Admin)
 * @param {number|string} id - Post ID
 * @returns {Promise<Object>} - Server confirmation or error
 */
export async function deletePost(id) {
    return sendWithoutCooldown('/api/microblog', 'DELETE', { id });
}

/**
 * Normalize a page's `authors:` front matter, which may be a list or a comma string
 * @param {string|string[]|null} authors - Value of page.authors
 * @returns {string[]} - Unique, trimmed login uids
 */
export function normalizeAuthorUids(authors) {
    const list = Array.isArray(authors) ? authors : String(authors || '').split(',');
    return [...new Set(list.map(uid => String(uid).trim()).filter(Boolean))];
}

/*
 * Channels. A post saves its channel in its free-form `data`, which the server
 * merges into the post it returns (and keeps on edits). Posts from before
 * channels existed have none and belong to Chat.
 */
export const MICROBLOG_CHANNELS = ['chat', 'suggestions'];

/**
 * @param {Object} post - A post from the API
 * @returns {'chat'|'suggestions'} - The channel the post belongs to
 */
export function postChannel(post) {
    return post && post.channel === 'suggestions' ? 'suggestions' : 'chat';
}

/**
 * Whether a post shows under the panel's view filter
 * @param {Object} post - Post with `resolution` from getResolution
 * @param {'all'|'active'|'mine'|'history'} filter - The dropdown's value
 * @param {Object|null} user - The signed-in user, or null
 * @returns {boolean}
 */
export function matchesViewFilter(post, filter, user) {
    switch (filter) {
        case 'all': return true;
        case 'mine': return Boolean(user) && post.userId === user.id;
        case 'history': return post.resolution.resolved;
        case 'active': return !post.resolution.resolved;
        default: throw new Error(`Unknown microblog filter: ${filter}`);
    }
}

/**
 * Fetch the signed-in Flask user ({ id, uid, name, ... })
 * @returns {Promise<Object|null>} - The user, or null when signed out
 */
export async function fetchCurrentUser() {
    try {
        const response = await fetch(pythonURI + '/api/id', fetchOptions);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.warn('Microblog: could not load the signed-in user', error);
        return null;
    }
}

/*
 * Resolved / reopened status.
 *
 * The Flask API only lets a post's writer (or an Admin) edit a post, but any
 * signed-in user can reply. So a status change is saved as a marker reply:
 * the server stamps who sent it, and the panel hides markers from the reply
 * list. The latest marker from the post's writer or a page author wins.
 */
const RESOLVED_MARKER = '[[microblog:resolved]]';
const REOPENED_MARKER = '[[microblog:reopened]]';
// A single reply's status: `<marker> <replyId> <uid>`
const REPLY_RESOLVED_MARKER = '[[microblog:reply-resolved]]';
const REPLY_REOPENED_MARKER = '[[microblog:reply-reopened]]';
const STATUS_MARKERS = [RESOLVED_MARKER, REOPENED_MARKER, REPLY_RESOLVED_MARKER, REPLY_REOPENED_MARKER];

/**
 * Mark a post resolved or reopen it
 * @param {number|string} postId - Post to update
 * @param {boolean} resolved - true to resolve, false to reopen
 * @param {string} resolverUid - uid of the person changing the status
 */
export async function setPostResolved(postId, resolved, resolverUid) {
    const marker = resolved ? RESOLVED_MARKER : REOPENED_MARKER;
    return sendWithoutCooldown('/api/microblog/reply', 'POST', { postId, content: `${marker} ${resolverUid}` });
}

/**
 * Mark one reply resolved or reopen it, without changing its post
 * @param {number|string} postId - Post the reply belongs to
 * @param {number|string} replyId - The reply's id from the API
 * @param {boolean} resolved - true to resolve, false to reopen
 * @param {string} resolverUid - uid of the person changing the status
 */
export async function setReplyResolved(postId, replyId, resolved, resolverUid) {
    const marker = resolved ? REPLY_RESOLVED_MARKER : REPLY_REOPENED_MARKER;
    return sendWithoutCooldown('/api/microblog/reply', 'POST', { postId, content: `${marker} ${replyId} ${resolverUid}` });
}

/**
 * @param {Object} reply - A reply from the API
 * @returns {boolean} - true when the reply is a status marker, not a real reply
 */
export function isStatusMarker(reply) {
    const content = (reply && reply.content) || '';
    return STATUS_MARKERS.some(marker => content.startsWith(marker));
}

// Splits a marker reply into its marker word and the values after it
function readMarker(reply) {
    const [marker, ...values] = reply.content.trim().split(/\s+/);
    return { marker, values };
}

/**
 * Work out whether a post is resolved from its marker replies.
 *
 * A marker counts when its sender is the post's writer (checked against the
 * server-stamped userId) or claims a uid listed as a page author. The uid
 * claim can't be checked server-side, so a crafted request could still hide a
 * post from the Active view; it stays visible under History either way.
 *
 * @param {Object} post - Post with its `replies` array
 * @param {string[]} pageAuthorUids - uids allowed to resolve this post
 * @returns {{ resolved: boolean, by: string|null, at: string|null }}
 */
export function getResolution(post, pageAuthorUids) {
    let resolution = { resolved: false, by: null, at: null };
    for (const reply of (post.replies || [])) {
        if (!isStatusMarker(reply)) continue;
        const { marker, values: [claimedUid] } = readMarker(reply);
        if (marker !== RESOLVED_MARKER && marker !== REOPENED_MARKER) continue;
        const bySubmitter = reply.userId === post.userId;
        const byPageAuthor = claimedUid && pageAuthorUids.includes(claimedUid);
        if (!bySubmitter && !byPageAuthor) continue;
        resolution = {
            resolved: marker === RESOLVED_MARKER,
            by: reply.userName || claimedUid || null,
            at: reply.timestamp || null
        };
    }
    return resolution;
}

/**
 * Work out whether one reply is resolved.
 *
 * Resolving the post resolves all of its replies (`withPost`). Otherwise the
 * latest reply marker for this reply wins, when sent by the reply's writer,
 * the post's writer (both checked by server-stamped userId) or a claimed page
 * author uid. Reopening the post brings back each reply's own status.
 *
 * @param {Object} post - Post with its `replies` array (markers included)
 * @param {number|string} replyId - The reply to check
 * @param {string[]} pageAuthorUids - uids allowed to resolve this post's replies
 * @returns {{ resolved: boolean, withPost: boolean, by: string|null, at: string|null }}
 */
export function getReplyResolution(post, replyId, pageAuthorUids) {
    const postResolution = getResolution(post, pageAuthorUids);
    if (postResolution.resolved) return { ...postResolution, withPost: true };

    let resolution = { resolved: false, withPost: false, by: null, at: null };
    const replies = post.replies || [];
    const target = replies.find(reply => String(reply.id) === String(replyId));
    if (!target) return resolution;
    for (const reply of replies) {
        if (!isStatusMarker(reply)) continue;
        const { marker, values: [markerReplyId, claimedUid] } = readMarker(reply);
        if (marker !== REPLY_RESOLVED_MARKER && marker !== REPLY_REOPENED_MARKER) continue;
        if (markerReplyId !== String(replyId)) continue;
        const byWriter = reply.userId === target.userId || reply.userId === post.userId;
        const byPageAuthor = claimedUid && pageAuthorUids.includes(claimedUid);
        if (!byWriter && !byPageAuthor) continue;
        resolution = {
            resolved: marker === REPLY_RESOLVED_MARKER,
            withPost: false,
            by: reply.userName || claimedUid || null,
            at: reply.timestamp || null
        };
    }
    return resolution;
}
