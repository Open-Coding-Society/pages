import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    MAX_CONTENT, ReviewError, buildPost, issueLink, loadReviews, ownRole, pickRoles, reviewFromPost, summarize,
} from '../assets/js/review-card.js';

// Shaped like the Flask backend's responses: MicroBlog.read() (api/microblog_api.py,
// model/microblog.py), which copies each key of a post's data to the top level,
// Topic.read(), and /api/id. Timestamps come from datetime.utcnow().isoformat(),
// so they have microseconds and no time zone.
const API = 'https://flask.opencodingsociety.com';
const TOPIC_PATH = '/capstone/communication-system/';
const PAGE_URL = 'https://pages.opencodingsociety.com/capstone/communication-system/';

function post(id, content, review, timestamp, userName = 'Akhil Kulkarni') {
    return {
        ...(review ? { review } : {}),
        id, userId: 40 + id, userName, userUid: `uid${id}`, content,
        topicId: 3, topicKey: 'capstone_communication-system', topicPath: TOPIC_PATH,
        timestamp, updatedAt: timestamp, characterCount: content.length,
    };
}

const MENTOR = post(12, 'Replies and threads already feel like Slack. Show one message going from a week thread to the announcements.',
    { role: 'mentor', scores: { project: 5, demo: 4, made: 4 }, next: 'Unread counts on the task row', by: 'Dana R.', recorded: true },
    '2026-10-15T22:05:00.123456', 'Samarth Vaka');
const VISITOR = post(14, "I couldn't tell which messages came from the teacher.",
    { role: 'community', scores: { project: 4, demo: 3 }, by: 'Mia', recorded: true },
    '2026-10-20T01:30:00.000001');
const TEACHER = post(15, 'Ready for N@tM.', { role: 'teacher', scores: { project: 5 } }, '2026-10-21T16:00:00.5', 'Leah Lee');
const PLAIN = post(13, 'Is the chat demo at lunch today?', null, '2026-10-16T18:00:00.0');

const TOPIC = {
    id: 3, pageKey: 'capstone_communication-system', pagePath: TOPIC_PATH, pageTitle: ' Capstone Communication-System ',
    pageDescription: null, displayName: null, color: null, icon: null, allowAnonymous: true, moderated: false,
    maxPostsPerUser: 10, isActive: true, settings: {}, postCount: 4, createdAt: '2026-10-15T22:05:00', updatedAt: '2026-10-15T22:05:00',
};
const MENTOR_ACCOUNT = { id: 7, uid: 'druiz', name: 'Dana Ruiz', email: 'dana@example.com', role: 'Mentor', is_admin: false, is_teacher: false };

/* ── Roles ───────────────────────────────────────────────────────────── */

test('a page asks for the roles it names, in its order, and for every role when it names none it knows', () => {
    const keys = (text) => pickRoles(text).map((role) => role.key);
    assert.deepEqual(keys('community, mentor ,teacher'), ['community', 'mentor', 'teacher']);
    assert.deepEqual(keys('Mentor, Community'), ['mentor', 'community']);
    assert.deepEqual(keys('mentor,judge,mentor'), ['mentor']);
    assert.deepEqual(keys(''), ['mentor', 'community', 'partner', 'teacher']);
    assert.deepEqual(keys(undefined), ['mentor', 'community', 'partner', 'teacher']);
    assert.deepEqual(keys('judges'), ['mentor', 'community', 'partner', 'teacher']);
});

test("a mentor or teacher account reviews in its own role; anyone else is entering someone else's review", () => {
    assert.equal(ownRole('Mentor'), 'mentor');
    assert.equal(ownRole('Teacher'), 'teacher');
    assert.equal(ownRole('Admin'), 'teacher');
    assert.equal(ownRole('User'), '');
    assert.equal(ownRole(undefined), '');
});

/* ── Reading posts ───────────────────────────────────────────────────── */

test('a post with a review becomes a review, with the poster shown by first name only', () => {
    assert.deepEqual(reviewFromPost(MENTOR), {
        id: 12,
        role: 'mentor',
        text: 'Replies and threads already feel like Slack. Show one message going from a week thread to the announcements.',
        next: 'Unread counts on the task row',
        scores: { project: 5, demo: 4, made: 4 },
        by: 'Dana',
        recorded: true,
        poster: 'Samarth',
        time: Date.UTC(2026, 9, 15, 22, 5, 0, 123),
    });
});

test('a Flask timestamp has no time zone, and is read as UTC', () => {
    assert.equal(reviewFromPost(VISITOR).time, Date.UTC(2026, 9, 20, 1, 30, 0, 0));
    assert.equal(reviewFromPost({ ...VISITOR, timestamp: '2026-10-20T01:30:00+00:00' }).time, Date.UTC(2026, 9, 20, 1, 30));
    assert.equal(reviewFromPost({ ...VISITOR, timestamp: null }).time, null);
    assert.equal(reviewFromPost({ ...VISITOR, timestamp: 'yesterday' }).time, null);
});

test('plain microblog posts and reviews with an unknown role are not reviews', () => {
    assert.equal(reviewFromPost(PLAIN), null);
    assert.equal(reviewFromPost({ ...MENTOR, review: { ...MENTOR.review, role: 'judge' } }), null);
    assert.equal(reviewFromPost({ ...MENTOR, review: 'mentor' }), null);
    assert.equal(reviewFromPost({ ...MENTOR, content: '' }), null);
});

test('a typed-in name keeps only the first name, because anyone can read the reviews', () => {
    assert.equal(reviewFromPost({ ...MENTOR, review: { ...MENTOR.review, by: 'Maria Garcia Lopez' } }).by, 'Maria');
    const post = buildPost({ text: 'Fun demo.', next: '', role: 'community', own: '', scores: {}, by: ' Maria Garcia Lopez ', recorded: true, topicPath: TOPIC_PATH });
    assert.equal(post.data.review.by, 'Maria');
});

test('only whole scores from 1 to 5 on the three questions are kept', () => {
    const review = reviewFromPost({ ...MENTOR, review: { role: 'mentor', scores: { project: 7, demo: 0, made: 3.5, extra: 4 } } });
    assert.deepEqual(review.scores, {});
    assert.deepEqual(reviewFromPost({ ...MENTOR, review: { role: 'mentor', scores: { demo: '4', made: 2 } } }).scores, { made: 2 });
    assert.deepEqual(reviewFromPost({ ...MENTOR, review: { role: 'mentor' } }).scores, {});
});

test("a review someone typed in for themselves has no 'by' or 'recorded'", () => {
    const review = reviewFromPost(TEACHER);
    assert.equal(review.by, '');
    assert.equal(review.recorded, false);
    assert.equal(review.next, '');
    assert.equal(review.poster, 'Leah');
});

/* ── Summary ─────────────────────────────────────────────────────────── */

test("the summary counts each of the page's roles and averages each question over the reviews that answered it", () => {
    const reviews = [TEACHER, VISITOR, MENTOR].map(reviewFromPost);
    const summary = summarize(reviews, pickRoles('mentor,community'));
    assert.equal(summary.count, 3);
    assert.equal(summary.latest, Date.UTC(2026, 9, 21, 16, 0, 0, 500));
    assert.deepEqual(summary.roles.map(({ key, count, latest }) => ({ key, count, latest })), [
        { key: 'mentor', count: 1, latest: Date.UTC(2026, 9, 15, 22, 5, 0, 123) },
        { key: 'community', count: 1, latest: Date.UTC(2026, 9, 20, 1, 30) },
    ]);
    assert.equal(summary.averages.project, 14 / 3);
    assert.equal(summary.averages.demo, 7 / 2);
    assert.equal(summary.averages.made, 4);
});

test('with no reviews, nothing is averaged and every role has none', () => {
    const summary = summarize([], pickRoles('mentor,community'));
    assert.equal(summary.count, 0);
    assert.equal(summary.latest, null);
    assert.deepEqual(summary.averages, { project: null, demo: null, made: null });
    assert.deepEqual(summary.roles.map((role) => role.count), [0, 0]);
});

/* ── Writing a review ────────────────────────────────────────────────── */

test('a review is posted as a microblog post on the page, with its role, scores and ask in data.review', () => {
    assert.deepEqual(buildPost({
        text: '  The emoji picker is fun.  ', next: ' Mark teacher messages ', role: 'community',
        scores: { project: 4, demo: 3, made: undefined }, by: ' Mia ', recorded: true, topicPath: TOPIC_PATH,
    }), {
        content: 'The emoji picker is fun.',
        topicPath: TOPIC_PATH,
        data: { review: { role: 'community', scores: { project: 4, demo: 3 }, next: 'Mark teacher messages', by: 'Mia', recorded: true } },
    });
});

test("a review someone posts for themselves leaves out 'by', and an empty ask is left out", () => {
    assert.deepEqual(buildPost({ text: 'Ready.', next: '', role: 'mentor', own: 'mentor', scores: {}, by: 'Ignored', recorded: false, topicPath: TOPIC_PATH }), {
        content: 'Ready.',
        topicPath: TOPIC_PATH,
        data: { review: { role: 'mentor', scores: {} } },
    });
});

test("a review in a role that isn't the poster's own is always marked as typed in for someone else", () => {
    const review = (fields) => buildPost({ text: 'Ready for N@tM.', next: '', scores: {}, by: '', recorded: false, topicPath: TOPIC_PATH, ...fields }).data.review;
    assert.deepEqual(review({ role: 'teacher', own: '' }), { role: 'teacher', scores: {}, recorded: true });
    assert.deepEqual(review({ role: 'community', own: 'mentor' }), { role: 'community', scores: {}, recorded: true });
    assert.deepEqual(review({ role: 'mentor', own: 'mentor' }), { role: 'mentor', scores: {} });
    assert.deepEqual(review({ role: 'teacher', own: 'teacher' }), { role: 'teacher', scores: {} });
});

test('an empty review, one over the microblog limit, or one with no known role is refused before sending', () => {
    const kind = (fields) => {
        try { buildPost({ next: '', scores: {}, recorded: false, topicPath: TOPIC_PATH, ...fields }); } catch (err) {
            assert.ok(err instanceof ReviewError);
            return err.kind;
        }
        return 'sent';
    };
    assert.equal(kind({ text: '   ', role: 'mentor' }), 'empty');
    assert.equal(kind({ text: 'x'.repeat(MAX_CONTENT + 1), role: 'mentor' }), 'long');
    assert.equal(kind({ text: 'x'.repeat(MAX_CONTENT), role: 'mentor' }), 'sent');
    assert.equal(kind({ text: 'Good demo', role: 'judge' }), 'role');
});

/* ── Turning a review into an issue ──────────────────────────────────── */

test("an issue link opens GitHub's new-issue form filled in and added to the team's board, without anyone's name", () => {
    const link = new URL(issueLink({
        repo: 'UGRC-CSA/Pages', board: 'https://github.com/orgs/UGRC-CSA/projects/1/views/2', pageUrl: PAGE_URL, review: reviewFromPost(MENTOR),
    }));
    assert.equal(link.origin + link.pathname, 'https://github.com/UGRC-CSA/Pages/issues/new');
    assert.equal(link.searchParams.get('title'), 'Unread counts on the task row');
    assert.equal(link.searchParams.get('projects'), 'UGRC-CSA/1');
    assert.equal(link.searchParams.get('body'), [
        'From a mentor review on https://pages.opencodingsociety.com/capstone/communication-system/#reviews',
        '',
        '> Replies and threads already feel like Slack. Show one message going from a week thread to the announcements.',
        '',
        'Asked for next: Unread counts on the task row',
        "Scores, 1 to 5: the project 5, the working demo 4, how it's made 4",
    ].join('\n'));
});

test('every line of a review is quoted in the issue', () => {
    const review = { ...reviewFromPost(VISITOR), text: 'Line one.\nLine two.', next: '' };
    const body = new URL(issueLink({ repo: 'UGRC-CSA/Pages', pageUrl: PAGE_URL, review })).searchParams.get('body');
    assert.match(body, /\n> Line one\.\n> Line two\.\n/);
});

test('without an ask, the title is the first sentence of the review, cut to fit', () => {
    const title = (text) => new URL(issueLink({ repo: 'UGRC-CSA/Pages', pageUrl: PAGE_URL, review: { ...reviewFromPost(VISITOR), text, next: '' } })).searchParams.get('title');
    assert.equal(title("I couldn't tell which messages came from the teacher. The rest was clear."), "I couldn't tell which messages came from the teacher.");
    assert.equal(title(`${'a'.repeat(90)} end.`), `${'a'.repeat(69)}…`);
});

test('a board only adds the issue when it belongs to an organization, and a bad repo gives no link', () => {
    const projects = (board) => new URL(issueLink({ repo: 'UGRC-CSA/Pages', board, pageUrl: PAGE_URL, review: reviewFromPost(VISITOR) })).searchParams.get('projects');
    assert.equal(projects(''), null);
    assert.equal(projects('https://github.com/users/svaka2000/projects/3'), null);
    assert.equal(projects('https://example.com/orgs/UGRC-CSA/projects/1'), null);
    for (const repo of ['', 'UGRC-CSA', 'UGRC-CSA/Pages/issues', 'https://github.com/UGRC-CSA/Pages', 'a b/c']) {
        assert.equal(issueLink({ repo, pageUrl: PAGE_URL, review: reviewFromPost(VISITOR) }), '');
    }
});

/* ── Loading ─────────────────────────────────────────────────────────── */

// A fake fetch that answers each URL it was given and records what was asked.
function fakeFetch(routes) {
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push({ url, credentials: options?.credentials });
        if (!(url in routes)) throw new Error(`unexpected request ${url}`);
        const route = routes[url];
        if (route instanceof Error) throw route;
        const [status, body] = route;
        return { ok: status >= 200 && status < 300, status, json: async () => body };
    };
    return { fetchImpl, calls };
}

const ID = `${API}/api/id`;
const OWN_LIST = `${API}/api/microblog?pagePath=%2Fcapstone%2Fcommunication-system%2F`;
const TOPIC_URL = `${API}/api/microblog/topics?pagePath=%2Fcapstone%2Fcommunication-system%2F`;
const PAGE_LIST = `${API}/api/microblog/page/capstone_communication-system?limit=200`;
const UNAUTHORIZED = [401, { message: 'Authentication Token is missing!', data: null, error: 'Unauthorized' }];
const options = { credentials: 'include' };

test("signed in, the page's posts come from the microblog list, and only reviews are kept", async () => {
    const { fetchImpl, calls } = fakeFetch({
        [ID]: [200, MENTOR_ACCOUNT],
        [OWN_LIST]: [200, { microblogs: [TEACHER, PLAIN, VISITOR, MENTOR], count: 4 }],
    });
    const result = await loadReviews({ api: API, topicPath: TOPIC_PATH, fetchImpl, fetchOptions: options });
    assert.deepEqual(result.viewer, { state: 'signed-in', name: 'Dana', role: 'Mentor' });
    assert.deepEqual(result.reviews.map((review) => review.id), [15, 14, 12]);
    assert.deepEqual(calls, [{ url: ID, credentials: 'include' }, { url: OWN_LIST, credentials: 'include' }]);
});

test("signed out, the page's topic is looked up and its posts come from the public page list", async () => {
    const { fetchImpl, calls } = fakeFetch({
        [ID]: UNAUTHORIZED,
        [TOPIC_URL]: [200, TOPIC],
        [PAGE_LIST]: [200, { topic: TOPIC, microblogs: [VISITOR, PLAIN, MENTOR], count: 3, canPost: false, userPostCount: 0 }],
    });
    const result = await loadReviews({ api: API, topicPath: TOPIC_PATH, fetchImpl, fetchOptions: options });
    assert.deepEqual(result.viewer, { state: 'signed-out', name: '', role: '' });
    assert.deepEqual(result.reviews.map((review) => review.id), [14, 12]);
    assert.deepEqual(calls.map((call) => call.url), [ID, TOPIC_URL, PAGE_LIST]);
});

test('an account waiting for a teacher to verify it reads the public list and is marked pending', async () => {
    const { fetchImpl } = fakeFetch({
        [ID]: [403, { message: 'Account pending verification.', data: null, error: 'Forbidden' }],
        [TOPIC_URL]: [200, TOPIC],
        [PAGE_LIST]: [200, { topic: TOPIC, microblogs: [MENTOR], count: 1, canPost: false, userPostCount: 0 }],
    });
    const result = await loadReviews({ api: API, topicPath: TOPIC_PATH, fetchImpl, fetchOptions: options });
    assert.equal(result.viewer.state, 'pending');
    assert.deepEqual(result.reviews.map((review) => review.id), [12]);
});

test('a page nobody has posted on has no topic yet, so there are no reviews and no second request', async () => {
    const { fetchImpl, calls } = fakeFetch({
        [ID]: UNAUTHORIZED,
        [TOPIC_URL]: [404, { message: 'Topic not found for this page' }],
    });
    const result = await loadReviews({ api: API, topicPath: TOPIC_PATH, fetchImpl, fetchOptions: options });
    assert.deepEqual(result.reviews, []);
    assert.equal(calls.length, 2);
});

test("when the backend doesn't answer, or answers with an error, loading fails with a kind the card can explain", async () => {
    const failure = async (routes) => {
        const { fetchImpl } = fakeFetch(routes);
        try { await loadReviews({ api: API, topicPath: TOPIC_PATH, fetchImpl, fetchOptions: options }); } catch (err) {
            assert.ok(err instanceof ReviewError);
            return err.kind;
        }
        return 'loaded';
    };
    assert.equal(await failure({ [ID]: new TypeError('Failed to fetch') }), 'network');
    assert.equal(await failure({ [ID]: [500, { message: 'Something went wrong decoding the token!', data: null, error: 'boom' }] }), 'network');
    assert.equal(await failure({ [ID]: [200, MENTOR_ACCOUNT], [OWN_LIST]: [500, { message: 'Error retrieving micro blog posts' }] }), 'network');
    assert.equal(await failure({ [ID]: UNAUTHORIZED, [TOPIC_URL]: [200, TOPIC], [PAGE_LIST]: [401, { message: 'Authentication required to view this discussion' }] }), 'auth');
});
