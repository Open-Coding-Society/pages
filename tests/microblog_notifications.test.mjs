import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load a browser module with its imports swapped for stubs (config.js has Jekyll front matter)
async function loadWithStubs(path, stubs) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const body = source.replace(/^import .*$/gm, '');
    return import(`data:text/javascript;base64,${Buffer.from(stubs + body).toString('base64')}`);
}

// The notifications module uses microblog.js's marker and author helpers for real.
globalThis.__microblog = await loadWithStubs('../assets/js/api/microblog.js',
    "const pythonURI = ''; const fetchOptions = {}; const withMicroblogRateLimit = () => {};\n");
const notifications = await loadWithStubs('../assets/js/api/microblog-notifications.js',
    "const baseurl = ''; const { fetchPosts, fetchCurrentUser, isStatusMarker, normalizeAuthorUids } = globalThis.__microblog;\n");
const { normalizePagePath, parseServerTime, pagesAuthoredBy, countNewActivity } = notifications;

const at = (iso) => Date.parse(`${iso}Z`);
const reply = (userId, timestamp, content = 'a reply') => ({ userId, timestamp, content });

test('a page path matches with or without its trailing slash, query, or the site baseurl', () => {
    assert.equal(normalizePagePath('/capstone/aaa'), '/capstone/aaa/');
    assert.equal(normalizePagePath('/capstone/aaa/?x=1#top'), '/capstone/aaa/');
    assert.equal(normalizePagePath('capstone/aaa/'), '/capstone/aaa/');
    assert.equal(normalizePagePath('/pages/capstone/aaa', '/pages'), '/capstone/aaa/');
});

test('Flask times without a zone are read as UTC; times with one keep it', () => {
    assert.equal(parseServerTime('2026-10-27T15:00:00'), at('2026-10-27T15:00:00'));
    assert.equal(parseServerTime('2026-10-27T15:00:00Z'), at('2026-10-27T15:00:00'));
    assert.equal(parseServerTime('2026-10-27T08:00:00-07:00'), at('2026-10-27T15:00:00'));
    assert.ok(Number.isNaN(parseServerTime(null)));
});

test('a person authors the pages whose authors list has their uid, kept as written for Flask', () => {
    const pages = [
        { path: '/capstone/aaa/', authors: ['Ssundar941', 'perrysay'] },
        { path: '/capstone/bbb', authors: 'perrysay, Ssundar941' },
        { path: '/capstone/ccc/', authors: ['someone'] },
        { path: '', authors: ['Ssundar941'] },
    ];
    assert.deepEqual(pagesAuthoredBy(pages, 'Ssundar941'), [
        { path: '/capstone/aaa/', key: '/capstone/aaa/' },
        { path: '/capstone/bbb', key: '/capstone/bbb/' },
    ]);
    assert.deepEqual(pagesAuthoredBy(pages, null), []);
    assert.deepEqual(pagesAuthoredBy(null, 'Ssundar941'), []);
});

test('new activity is other people\'s posts and replies since the page was last seen', () => {
    const me = 10;
    const seen = at('2026-10-27T12:00:00');
    const posts = [
        { userId: 20, timestamp: '2026-10-27T13:00:00', replies: [
            reply(30, '2026-10-27T13:30:00'),                                       // new reply: counts
            reply(me, '2026-10-27T14:00:00'),                                       // my own reply
            reply(20, '2026-10-27T14:30:00', '[[microblog:resolved]] student2'),    // a status change
        ] },                                                                        // new post: counts
        { userId: 20, timestamp: '2026-10-27T11:00:00', replies: [reply(30, '2026-10-27T11:30:00')] }, // all seen
        { userId: me, timestamp: '2026-10-27T15:00:00', replies: [] },               // my own post
    ];
    assert.equal(countNewActivity(posts, me, seen), 2);
    assert.equal(countNewActivity(posts, me, 0), 4, 'never seen: everything by others counts');
    assert.equal(countNewActivity([], me, 0), 0);
    assert.equal(countNewActivity(undefined, me, 0), 0);
});
