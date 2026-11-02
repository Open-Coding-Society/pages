import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load a browser module with its imports swapped for stubs (config.js has Jekyll front matter)
async function loadWithStubs(path, stubs) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const body = source.replace(/^import .*$/gm, '');
    return import(`data:text/javascript;base64,${Buffer.from(stubs + body).toString('base64')}`);
}

// fetch records what a vote sends, so the marker format is checked end to end
const sent = [];
globalThis.fetch = async (url, options) => {
    sent.push({ url, ...options, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({}) };
};
const microblog = await loadWithStubs('../assets/js/api/microblog.js',
    "const pythonURI = ''; const fetchOptions = {}; const withMicroblogRateLimit = () => {};\n");

const vote = (userId, index) => ({ content: `[[microblog:vote]] ${index}`, userId, userName: `user${userId}` });
const surveyPost = replies => ({ userId: 1, content: 'Best day?', survey: { options: ['Mon', 'Wed', 'Fri'] }, replies });

test('survey choices are trimmed, and too few, too many, too long or repeated choices are refused', () => {
    assert.deepEqual(microblog.normalizeSurveyOptions([' Mon ', '', 'Fri']), ['Mon', 'Fri']);
    assert.throws(() => microblog.normalizeSurveyOptions(['Mon', '  ']), /at least 2/);
    assert.throws(() => microblog.normalizeSurveyOptions(['1', '2', '3', '4', '5', '6', '7']), /at most 6/);
    assert.throws(() => microblog.normalizeSurveyOptions(['Mon', 'x'.repeat(81)]), /under 80/);
    assert.throws(() => microblog.normalizeSurveyOptions(['Mon', 'mon']), /different/);
});

test('a post has a survey only when its data holds at least two text choices', () => {
    assert.deepEqual(microblog.postSurvey(surveyPost([])), ['Mon', 'Wed', 'Fri']);
    assert.equal(microblog.postSurvey({ content: 'plain post' }), null);
    assert.equal(microblog.postSurvey({ survey: { options: ['only one'] } }), null);
    assert.equal(microblog.postSurvey({ survey: { options: 'Mon,Fri' } }), null);
    assert.deepEqual(microblog.postSurvey({ survey: { options: ['Mon', 42, 'Fri'] } }), ['Mon', 'Fri']);
});

test('each voter counts once, their latest vote wins, and bad votes are ignored', () => {
    const results = microblog.getSurveyResults(surveyPost([
        vote(10, 0),
        vote(11, 2),
        vote(10, 1), // 10 changes their vote
        vote(12, 7), // no such choice
        { content: '[[microblog:vote]] two', userId: 13 },
        { content: '[[microblog:vote]] 0' }, // no server-stamped voter
        { content: 'I vote 0', userId: 14 } // a normal reply
    ]), 10);
    assert.deepEqual(results.options.map(option => option.votes), [0, 1, 1]);
    assert.equal(results.total, 2);
    assert.equal(results.myChoice, 1);
    assert.equal(microblog.getSurveyResults(surveyPost([vote(10, 0)]), 99).myChoice, null);
    assert.equal(microblog.getSurveyResults(surveyPost([vote(10, 0)]), null).myChoice, null);
    assert.equal(microblog.getSurveyResults({ content: 'no survey' }, 10), null);
});

test('votes are hidden markers, not replies', () => {
    assert.equal(microblog.isStatusMarker(vote(10, 0)), true);
});

test('a vote posts a marker reply without the new-content cooldown', async () => {
    sent.length = 0;
    await microblog.voteInSurvey(5, 2);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, '/api/microblog/reply');
    assert.equal(sent[0].method, 'POST');
    assert.deepEqual(sent[0].body, { postId: 5, content: '[[microblog:vote]] 2' });
    await assert.rejects(microblog.voteInSurvey(5, -1), /choice index/);
    await assert.rejects(microblog.voteInSurvey(5, 1.5), /choice index/);
});

test('search matches every typed word across a post, its writer, topic, survey choices and replies', () => {
    const post = {
        content: 'Deploy is failing', userName: 'Ada Lovelace', topicPath: '/capstone/pvo/',
        survey: { options: ['Retry', 'Rollback'] },
        replies: [{ content: 'Check the nginx logs', userName: 'Grace' }, vote(3, 0)]
    };
    assert.equal(microblog.matchesSearch(post, ''), true);
    assert.equal(microblog.matchesSearch(post, '  '), true);
    assert.equal(microblog.matchesSearch(post, 'DEPLOY'), true, 'ignores case');
    assert.equal(microblog.matchesSearch(post, 'ada failing'), true, 'words can match different fields');
    assert.equal(microblog.matchesSearch(post, 'pvo'), true);
    assert.equal(microblog.matchesSearch(post, 'rollback'), true);
    assert.equal(microblog.matchesSearch(post, 'nginx grace'), true);
    assert.equal(microblog.matchesSearch(post, 'deploy kubernetes'), false, 'every word must match');
    assert.equal(microblog.matchesSearch(post, 'microblog:vote'), false, 'markers are not searched');
});
