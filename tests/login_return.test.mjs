import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../assets/js/api/login-return.js', import.meta.url), 'utf8');
const { safeReturnPath, loginReturnPath, addLoginReturn } = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);
const origin = 'https://pages.opencodingsociety.com';

test('login links preserve the current path, query, and section, including new tabs', () => {
    const link = { href: `${origin}/login` };
    addLoginReturn(link, `${origin}/lesson?course=csa#exercise`);
    assert.equal(loginReturnPath(link.href, ''), '/lesson?course=csa#exercise');
    assert.equal(loginReturnPath(link.href, `${origin}/other`), '/lesson?course=csa#exercise');
});

test('same-site referrer supports redirects; direct and external visits use the existing fallback', () => {
    assert.equal(loginReturnPath(`${origin}/login`, `${origin}/capstone/`), '/capstone/');
    assert.equal(loginReturnPath(`${origin}/login`, ''), null);
    assert.equal(loginReturnPath(`${origin}/login`, 'https://external.example/page'), null);
});

test('rejects external destinations and authentication loops', () => {
    for (const value of ['https://evil.example', '//evil.example', `${origin}//evil.example`, 'javascript:alert(1)', '/login', '/login/?x=1', '/logout', '/signup.html']) {
        assert.equal(safeReturnPath(value, origin), null, value);
    }
    assert.equal(loginReturnPath(`${origin}/login?returnTo=https://evil.example`, `${origin}/valid`), null);
});

test('supports a deployment base path and leaves unrelated links alone', () => {
    const link = { href: `${origin}/kit/login` };
    addLoginReturn(link, `${origin}/kit/lesson#part`, '/kit');
    assert.equal(loginReturnPath(link.href, '', '/kit'), '/kit/lesson#part');
    assert.equal(safeReturnPath('/outside', origin, '/kit'), null);
    assert.equal(safeReturnPath('/kit/login', origin, '/kit'), null);
    for (const href of [`${origin}/profile`, 'https://external.example/login']) {
        const other = { href };
        addLoginReturn(other, `${origin}/lesson`);
        assert.equal(other.href, href);
    }
});

test('login-page links do not replace a destination or create a self redirect', () => {
    const link = { href: `${origin}/login?returnTo=%2Flesson` };
    addLoginReturn(link, `${origin}/other`);
    assert.equal(loginReturnPath(link.href, ''), '/lesson');
    const direct = { href: `${origin}/login` };
    addLoginReturn(direct, `${origin}/login`);
    assert.equal(direct.href, `${origin}/login`);
});
