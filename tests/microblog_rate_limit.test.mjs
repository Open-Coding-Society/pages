import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../assets/js/api/microblog-rate-limit.js', import.meta.url), 'utf8');
let moduleId = 0;
async function load() {
    return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${moduleId++}`);
}

test('microblog writes enforce cooldown, persistence, pending requests, and server backoff', async () => {
    const originalNow = Date.now;
    let now = 100000;
    Date.now = () => now;
    const values = new Map();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value)
    } });
    let calls = 0;
    const write = async () => { calls++; return { ok: true, json: async () => ({ id: 1 }) }; };
    try {
        let limiter = await load();
        assert.deepEqual(await limiter.withMicroblogRateLimit(write), { id: 1 });
        await assert.rejects(limiter.withMicroblogRateLimit(write), /wait 30 seconds/);
        assert.equal(calls, 1);
        limiter = await load(); // Reload/page navigation retains the deadline.
        await assert.rejects(limiter.withMicroblogRateLimit(write), /wait 30 seconds/);
        now += 30000;
        let finish;
        const pending = limiter.withMicroblogRateLimit(() => new Promise(resolve => { finish = resolve; }));
        now += 30000;
        await assert.rejects(limiter.withMicroblogRateLimit(write), /still in progress/);
        finish({ ok: true, json: async () => ({ id: 2 }) });
        await pending;
        await assert.rejects(limiter.withMicroblogRateLimit(async () => { throw Error('offline'); }), /offline/);
        await assert.rejects(limiter.withMicroblogRateLimit(write), /wait 30 seconds/);
        now += 30000;
        await assert.rejects(limiter.withMicroblogRateLimit(async () => ({
            status: 429, headers: { get: () => '120' }
        })), /wait 120 seconds/);
        now += 119000;
        await assert.rejects(limiter.withMicroblogRateLimit(write), /wait 1 seconds/);
        now += 1000;
        await limiter.withMicroblogRateLimit(write);
        assert.equal(calls, 2);
        now += 30000;
        await assert.rejects(limiter.withMicroblogRateLimit(async () => ({
            status: 429, headers: { get: () => new Date(now + 60000).toUTCString() }
        })), /wait 60 seconds/);
    } finally {
        Date.now = originalNow;
        delete globalThis.localStorage;
    }
});

test('all API writes share the limiter while reads remain available', async () => {
    const limiterUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}#api`;
    const apiSource = (await readFile(new URL('../assets/js/api/microblog.js', import.meta.url), 'utf8'))
        .replace("import { pythonURI, fetchOptions } from './config.js';", "const pythonURI = 'https://test.invalid'; const fetchOptions = { method: 'GET' };")
        .replace("'./microblog-rate-limit.js'", JSON.stringify(limiterUrl));
    const api = await import(`data:text/javascript;base64,${Buffer.from(apiSource).toString('base64')}`);
    const originalFetch = globalThis.fetch;
    const originalNow = Date.now;
    const requests = [];
    let now = 100000;
    Date.now = () => now;
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: () => null, setItem() {}
    } });
    globalThis.fetch = async (url, options) => {
        requests.push([url, options.method]);
        return { ok: true, json: async () => ({ id: 1 }) };
    };
    try {
        await api.createPost({ content: 'post' });
        await assert.rejects(api.updatePost({ id: 1, content: 'edit' }), /Please wait/);
        await assert.rejects(api.createReply({ postId: 1, content: 'reply' }), /Please wait/);
        await api.fetchReplies(1);
        now += 30000;
        await api.updatePost({ id: 1, content: 'edit' });
        now += 30000;
        await api.createReply({ postId: 1, content: 'reply' });
        assert.deepEqual(requests.map(([, method]) => method), ['POST', 'GET', 'PUT', 'POST']);
        assert.equal(requests[3][0], 'https://test.invalid/api/microblog/reply');
    } finally {
        globalThis.fetch = originalFetch;
        Date.now = originalNow;
        delete globalThis.localStorage;
    }
});

test('Web Locks rejects a concurrent tab without queuing another write', async () => {
    const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    let locked = false;
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
        locks: { async request(name, options, callback) {
            assert.equal(options.ifAvailable, true);
            if (locked) return callback(null);
            locked = true;
            try { return await callback({ name }); }
            finally { locked = false; }
        } }
    } });
    const values = new Map();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value)
    } });
    try {
        const firstTab = await load();
        const secondTab = await load();
        let finish;
        const firstSave = firstTab.withMicroblogRateLimit(() => new Promise(resolve => { finish = resolve; }));
        await assert.rejects(secondTab.withMicroblogRateLimit(() => assert.fail('Must not send')), /another tab/);
        finish({ ok: true, json: async () => ({ id: 1 }) });
        await firstSave;
        await assert.rejects(secondTab.withMicroblogRateLimit(() => assert.fail('Must not send')), /Please wait/);
    } finally {
        Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
        delete globalThis.localStorage;
    }
});
