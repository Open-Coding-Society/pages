import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load a browser module with its imports swapped for stubs (config.js has Jekyll front matter)
async function loadWithStubs(path, stubs) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const body = source.replace(/^import .*$/gm, '');
    return import(`data:text/javascript;base64,${Buffer.from(stubs + body).toString('base64')}`);
}

const microblog = await loadWithStubs('../assets/js/api/microblog.js',
    "const pythonURI = ''; const fetchOptions = {}; const withMicroblogRateLimit = () => {};\n");

const reply = (content, userId) => ({ content, userId, userName: `user${userId}`, timestamp: '2026-10-01T00:00:00' });

test('resolve markers count only from the post writer or a page author, latest wins', () => {
    const authors = ['author1'];
    const resolved = replies => microblog.getResolution({ userId: 20, replies }, authors).resolved;

    assert.equal(resolved([]), false);
    assert.equal(resolved([reply('normal reply', 30)]), false);
    assert.equal(resolved([reply('[[microblog:resolved]] author1', 10)]), true, 'page author');
    assert.equal(resolved([reply('[[microblog:resolved]] student2', 20)]), true, 'post writer, by server-stamped userId');
    assert.equal(resolved([reply('[[microblog:resolved]] nobody', 40)]), false, 'neither writer nor author');
    assert.equal(resolved([
        reply('[[microblog:resolved]] author1', 10),
        reply('[[microblog:reopened]] student2', 20)
    ]), false, 'a later reopen wins');
    assert.equal(resolved([
        reply('[[microblog:reopened]] student2', 20),
        reply('[[microblog:resolved]] nobody', 40)
    ]), false, 'an ignored marker does not override');
});

test('status markers are told apart from real replies', () => {
    assert.equal(microblog.isStatusMarker(reply('[[microblog:resolved]] a', 1)), true);
    assert.equal(microblog.isStatusMarker(reply('[[microblog:reopened]] a', 1)), true);
    assert.equal(microblog.isStatusMarker(reply('I resolved it with [[microblog:resolved]]', 1)), false);
    assert.equal(microblog.isStatusMarker(null), false);
});

test('authors front matter normalizes from a list or a comma string', () => {
    assert.deepEqual(microblog.normalizeAuthorUids(['author1', ' author2 ', 'author1', '']), ['author1', 'author2']);
    assert.deepEqual(microblog.normalizeAuthorUids('author1, author2'), ['author1', 'author2']);
    assert.deepEqual(microblog.normalizeAuthorUids(null), []);
});

test('posts without a saved channel belong to Chat', () => {
    assert.equal(microblog.postChannel({ channel: 'suggestions' }), 'suggestions');
    assert.equal(microblog.postChannel({ channel: 'chat' }), 'chat');
    assert.equal(microblog.postChannel({}), 'chat', 'posts from before channels existed');
    assert.equal(microblog.postChannel({ channel: 'something-else' }), 'chat');
});

test('the view filter shows all, unresolved, own, or resolved posts', () => {
    const user = { id: 7 };
    const open = { userId: 7, resolution: { resolved: false } };
    const closed = { userId: 8, resolution: { resolved: true } };
    const shown = filter => [open, closed].filter(post => microblog.matchesViewFilter(post, filter, user));

    assert.deepEqual(shown('all'), [open, closed]);
    assert.deepEqual(shown('active'), [open]);
    assert.deepEqual(shown('history'), [closed]);
    assert.deepEqual(shown('mine'), [open]);
    assert.equal(microblog.matchesViewFilter(open, 'mine', null), false, 'signed out has no posts of its own');
    assert.throws(() => microblog.matchesViewFilter(open, 'bogus', user), /Unknown microblog filter/);
});

test('a reply resolves on its own, and resolving the post resolves every reply', () => {
    const authors = ['author1'];
    // Post by user 20; reply 1 by user 30, reply 2 by user 40
    const post = (...markers) => ({ userId: 20, replies: [
        { id: 1, ...reply('Have you tried clearing the cache?', 30) },
        { id: 2, ...reply('Works for me on Firefox.', 40) },
        ...markers.map((marker, index) => ({ id: 3 + index, ...marker }))
    ] });
    const status = (p, replyId) => microblog.getReplyResolution(p, replyId, authors);

    assert.equal(status(post(), 1).resolved, false);
    const onlyReply1 = post(reply('[[microblog:reply-resolved]] 1 student3', 30));
    assert.equal(status(onlyReply1, 1).resolved, true, "the reply's writer");
    assert.equal(status(onlyReply1, 2).resolved, false, 'other replies stay open');
    assert.equal(microblog.getResolution(onlyReply1, authors).resolved, false, 'the post stays open');
    assert.equal(status(post(reply('[[microblog:reply-resolved]] 2 student2', 20)), 2).resolved, true, "the post's writer");
    assert.equal(status(post(reply('[[microblog:reply-resolved]] 2 author1', 10)), 2).resolved, true, 'a page author');
    assert.equal(status(post(reply('[[microblog:reply-resolved]] 2 nobody', 30)), 2).resolved, false, "another reply's writer");
    assert.equal(status(post(
        reply('[[microblog:reply-resolved]] 1 student3', 30),
        reply('[[microblog:reply-reopened]] 1 author1', 10)
    ), 1).resolved, false, 'a later reopen wins');

    const postResolved = post(reply('[[microblog:resolved]] author1', 10));
    assert.deepEqual([status(postResolved, 1), status(postResolved, 2)].map(s => [s.resolved, s.withPost]), [[true, true], [true, true]]);
    const postReopened = post(
        reply('[[microblog:reply-resolved]] 1 student3', 30),
        reply('[[microblog:resolved]] author1', 10),
        reply('[[microblog:reopened]] author1', 10)
    );
    assert.equal(status(postReopened, 1).resolved, true, 'reopening the post keeps the reply resolved on its own');
    assert.equal(status(postReopened, 2).resolved, false);
    assert.equal(microblog.isStatusMarker(reply('[[microblog:reply-reopened]] 1 a', 1)), true, 'reply markers stay hidden');
});
