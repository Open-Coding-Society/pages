// Microblog surveys and search (assets/js/api/microblog.js): a post's writer saves
// survey choices in its `data`, votes are marker replies, and the panel's search box
// matches a post's text, writer, topic, survey choices and replies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load a browser module with its imports swapped for stubs (config.js has Jekyll front matter)
async function loadWithStubs(path, stubs) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const body = source.replace(/^import .*$/gm, '');
    return import(`data:text/javascript;base64,${Buffer.from(stubs + body).toString('base64')}`);
}

const sent = [];
const microblog = await loadWithStubs('../assets/js/api/microblog.js',
    "const pythonURI = ''; const fetchOptions = {}; const withMicroblogRateLimit = () => {};\n" +
    "globalThis.fetch = async (url, options) => { globalThis.__sent.push({ url, body: JSON.parse(options.body) }); return { ok: true, json: async () => ({}) }; };\n");
globalThis.__sent = sent;

const vote = (index, userId) => ({ content: `[[microblog:vote]] ${index}`, userId, userName: `user${userId}` });
const survey = (replies = []) => ({ id: 7, userId: 1, content: 'Best day?', survey: { options: ['Mon', 'Fri'] }, replies });

test('normalizeSurveyOptions trims, drops blanks and rejects unusable choices', () => {
    assert.deepEqual(microblog.normalizeSurveyOptions([' Mon ', '', 'Fri', '  ']), ['Mon', 'Fri']);
    assert.throws(() => microblog.normalizeSurveyOptions(['Only one', '']), /at least 2/);
    assert.throws(() => microblog.normalizeSurveyOptions(['a', 'b', 'c', 'd', 'e', 'f', 'g']), /at most 6/);
    assert.throws(() => microblog.normalizeSurveyOptions(['Yes', 'yes']), /different/);
    assert.throws(() => microblog.normalizeSurveyOptions(['x'.repeat(81), 'ok']), /under 80/);
});

test('getSurveyResults counts each voter once, by their latest vote', () => {
    const results = microblog.getSurveyResults(survey([vote(0, 2), vote(1, 3), vote(1, 2)]), 2);
    assert.deepEqual(results.options, [{ label: 'Mon', votes: 0 }, { label: 'Fri', votes: 2 }]);
    assert.equal(results.total, 2);
    assert.equal(results.myChoice, 1);
    assert.equal(microblog.getSurveyResults(survey([vote(0, 2)]), 9).myChoice, null, 'no vote yet');
});

test('getSurveyResults ignores votes for choices the survey does not have, and posts without a survey', () => {
    const results = microblog.getSurveyResults(survey([vote(5, 2), { content: '[[microblog:vote]] x', userId: 3 }]), null);
    assert.equal(results.total, 0);
    assert.equal(microblog.getSurveyResults({ id: 1, replies: [] }, null), null);
    assert.equal(microblog.getSurveyResults({ id: 1, survey: { options: ['lonely'] } }, null), null);
});

test('a vote is a status marker, so it never shows as a reply or counts as one', () => {
    assert.equal(microblog.isStatusMarker(vote(0, 2)), true);
});

test('voteInSurvey posts a vote marker reply, and refuses a non-index choice', async () => {
    await microblog.voteInSurvey(7, 1);
    assert.deepEqual(sent.at(-1), { url: '/api/microblog/reply', body: { postId: 7, content: '[[microblog:vote]] 1' } });
    await assert.rejects(() => microblog.voteInSurvey(7, -1), /choice index/);
    await assert.rejects(() => microblog.voteInSurvey(7, 1.5), /choice index/);
});

test('matchesSearch needs every word somewhere in the post, its survey or its replies', () => {
    const post = {
        content: 'Sprint review notes', userName: 'Ada', topicPath: '/capstone/teamx',
        survey: { options: ['Tuesday', 'Thursday'] },
        replies: [{ content: 'Looks good', userName: 'Grace' }, vote(0, 3)],
    };
    assert.equal(microblog.matchesSearch(post, ''), true);
    assert.equal(microblog.matchesSearch(post, 'sprint ADA'), true);
    assert.equal(microblog.matchesSearch(post, 'thursday'), true, 'survey choice');
    assert.equal(microblog.matchesSearch(post, 'grace good'), true, 'reply writer and text');
    assert.equal(microblog.matchesSearch(post, 'teamx'), true, 'topic');
    assert.equal(microblog.matchesSearch(post, 'sprint friday'), false);
    assert.equal(microblog.matchesSearch(post, 'vote'), false, 'markers are not searched');
});
