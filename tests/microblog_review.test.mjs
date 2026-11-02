import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    normalizeTopicPath, topicFromSearch, buildReviewUrl, titleForTopic, remainingChars, REVIEW_PATH,
} from '../assets/js/api/microblog-review.js';

test('normalizeTopicPath keeps a site path and drops its query and hash', () => {
    assert.equal(normalizeTopicPath('/capstone/presence-system/'), '/capstone/presence-system/');
    assert.equal(normalizeTopicPath(' /capstone/presence-system/?x=1#top '), '/capstone/presence-system/');
    assert.equal(normalizeTopicPath('/csa/unit_04/4_9'), '/csa/unit_04/4_9');
    assert.equal(normalizeTopicPath('/2025/02/20/rpn_calculator-tracking_IPYNB_2_.html'), '/2025/02/20/rpn_calculator-tracking_IPYNB_2_.html');
});

test('normalizeTopicPath refuses anything that is not a path on this site', () => {
    for (const bad of [
        null, undefined, 42, '', 'capstone/', 'https://evil.example/',
        '//evil.example/', '/a/../b', '/a/./b', '/a b', '/a\\b', 'javascript:alert(1)',
        '/a<img src=x onerror=alert(1)>', "/a'b", '/a"b', '/a%3Cb', '/a&b', '/a;b',
    ]) {
        assert.equal(normalizeTopicPath(bad), null, `should refuse ${String(bad)}`);
    }
});

test('topicFromSearch reads and checks ?topic=', () => {
    assert.equal(topicFromSearch('?topic=%2Fcapstone%2Fpresence-system%2F'), '/capstone/presence-system/');
    assert.equal(topicFromSearch('?topic=https%3A%2F%2Fevil.example'), null);
    assert.equal(topicFromSearch(''), null);
    assert.equal(topicFromSearch('?other=1'), null);
});

test('buildReviewUrl encodes the topic and honours the base URL', () => {
    assert.equal(
        buildReviewUrl({ origin: 'https://pages.opencodingsociety.com', topicPath: '/capstone/presence-system/' }),
        `https://pages.opencodingsociety.com${REVIEW_PATH}?topic=%2Fcapstone%2Fpresence-system%2F`,
    );
    assert.equal(
        buildReviewUrl({ origin: 'https://x.github.io', baseurl: '/pages', topicPath: '/capstone/a/' }),
        'https://x.github.io/pages/review?topic=%2Fcapstone%2Fa%2F',
    );
    assert.equal(buildReviewUrl({ origin: 'https://x', topicPath: 'https://evil' }), null);
    assert.equal(buildReviewUrl({ origin: '', topicPath: '/a/' }), null);
});

test('titleForTopic prefers the known title and falls back to the last path segment', () => {
    const titles = { '/capstone/presence-system/': 'Classroom Presence System Capstone' };
    assert.equal(titleForTopic('/capstone/presence-system/', titles), 'Classroom Presence System Capstone');
    assert.equal(titleForTopic('/capstone/presence-system/'), 'Presence System');
    assert.equal(titleForTopic('/capstone/pnec_dashboard/'), 'Pnec Dashboard');
    assert.equal(titleForTopic('/'), '');
});

test('remainingChars counts down from the 280 limit', () => {
    assert.equal(remainingChars(''), 280);
    assert.equal(remainingChars('a'.repeat(281)), -1);
    assert.equal(remainingChars(undefined), 280);
});

test('guestCredentials makes a hidden guest login from a name', async () => {
    const { guestCredentials } = await import('../assets/js/api/microblog-review.js');
    const { meetsSpringPasswordRules } = await import('../assets/js/api/passwordRules.js');
    const fixed = length => 'k3j9q2wvbn7f0ha1xcz5'.slice(0, length);
    assert.deepEqual(guestCredentials('Darth Vader', fixed), { uid: 'darthvader-k3j9q2', password: 'Qr!k3j9q2wvbn7f0ha1xcz5aZ9' });
    assert.equal(guestCredentials('!!!', fixed).uid, 'guest-k3j9q2');
    assert.equal(guestCredentials('A very long name indeed here', fixed).uid, 'averylongnam-k3j9q2');
    assert.ok(meetsSpringPasswordRules(guestCredentials('x', fixed).password));
});

test('guestCredentials draws the password separately from the visible username', async () => {
    const { guestCredentials } = await import('../assets/js/api/microblog-review.js');
    const { meetsSpringPasswordRules } = await import('../assets/js/api/passwordRules.js');
    const one = guestCredentials('Sam');
    assert.match(one.uid, /^sam-[a-z0-9]{6}$/);
    assert.match(one.password, /^Qr![a-z0-9]{20}aZ9$/);
    assert.ok(meetsSpringPasswordRules(one.password));
    assert.ok(!one.password.includes(one.uid.slice(4)), 'the username tail must not appear in the password');
    assert.notEqual(guestCredentials('Sam').uid, one.uid);
    assert.notEqual(guestCredentials('Sam').password, one.password);
});

test('guestCredentials refuses to run without a cryptographic generator', async () => {
    const { guestCredentials } = await import('../assets/js/api/microblog-review.js');
    const saved = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
    try {
        assert.throws(() => guestCredentials('Sam'), /secure guest account/);
    } finally {
        Object.defineProperty(globalThis, 'crypto', saved);
    }
});
