import test from 'node:test';
import assert from 'node:assert/strict';
import { confirmRoleAttestation } from '../assets/js/api/role-attestation.js';

const options = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };

test('sends the statement Flask signed to Spring as the attestation', async () => {
    const calls = [];
    const fetchFn = async (url, init) => { calls.push({ url, init }); return { ok: true, status: 200 }; };
    const result = await confirmRoleAttestation('http://spring', options, 'signed.statement', fetchFn);
    assert.deepEqual(result, { sent: true, ok: true, status: 200 });
    assert.equal(calls[0].url, 'http://spring/api/person/mentor/confirm');
    assert.equal(calls[0].init.method, 'POST');
    assert.deepEqual(JSON.parse(calls[0].init.body), { attestation: 'signed.statement' });
    assert.equal(calls[0].init.credentials, 'include');
});

test('sends nothing when Flask signed nothing', async () => {
    let called = false;
    const fetchFn = async () => { called = true; return { ok: true, status: 200 }; };
    for (const missing of [undefined, null, '', 42]) {
        const result = await confirmRoleAttestation('http://spring', options, missing, fetchFn);
        assert.equal(result.sent, false);
    }
    assert.equal(called, false);
});

test('a refusal from Spring is reported and does not throw', async () => {
    const warn = console.warn; console.warn = () => {};
    try {
        const result = await confirmRoleAttestation('http://spring', options, 'x', async () => ({ ok: false, status: 403 }));
        assert.deepEqual(result, { sent: true, ok: false, status: 403 });
    } finally { console.warn = warn; }
});

test('a network failure is reported and does not throw', async () => {
    const warn = console.warn; console.warn = () => {};
    try {
        const result = await confirmRoleAttestation('http://spring', options, 'x', async () => { throw new Error('down'); });
        assert.deepEqual(result, { sent: true, ok: false, status: 0 });
    } finally { console.warn = warn; }
});
