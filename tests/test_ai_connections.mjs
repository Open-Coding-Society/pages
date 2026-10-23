import assert from 'node:assert/strict';
import test from 'node:test';
import { initAiConnections as initialize } from '../_projects/systems/profile/js/ai-connections.js';

const initAiConnections = (root, options = {}) => initialize(root, { apiBase: 'http://spring.test', ...options });

function element() {
  return { textContent: '', value: '', disabled: false, hidden: false, dataset: {}, listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; } };
}
function fixture() {
  const availability = element();
  const providers = ['gemini', 'groq'].map(provider => {
    const fields = Object.fromEntries(['form', 'key', 'save', 'disconnect', 'state', 'message']
      .map(name => [`[data-ai-${name}]`, element()]));
    return { dataset: { aiProvider: provider }, fields, querySelector(selector) { return fields[selector]; } };
  });
  return { providers, availability,
    querySelector: () => availability, querySelectorAll: () => providers };
}
const disconnected = { available: true, providers: {
  gemini: { connected: false, modelConfigured: true }, groq: { connected: false, modelConfigured: true } } };
const response = (data, status = 200) => ({ status, ok: status < 400, json: async () => data });
const submit = row => row.fields['[data-ai-form]'].listeners.submit({ preventDefault() {} });

test('loads secret-free status and enables independent provider controls', async () => {
  const root = fixture(); const requests = [];
  await initAiConnections(root, { request: async (...args) => { requests.push(args); return response(disconnected); } });
  assert.equal(root.providers[0].fields['[data-ai-save]'].textContent, 'Save key');
  assert.equal(root.providers[1].fields['[data-ai-key]'].disabled, false);
  assert.equal(requests[0][0], 'http://spring.test/api/ai-connections');
  assert.equal(requests[0][1].credentials, 'include');
  assert.equal(requests[0][1].cache, 'no-store');
});

test('saving Gemini uses only its endpoint and clears input after success', async () => {
  const root = fixture(); const requests = [];
  const connected = { ...disconnected, providers: { ...disconnected.providers,
    gemini: { connected: true, modelConfigured: true, updatedAt: 'test-time' } } };
  await initAiConnections(root, { request: async (...args) => {
    requests.push(args); return response(requests.length === 1 ? disconnected : connected);
  } });
  const row = root.providers[0]; row.fields['[data-ai-key]'].value = 'fake-key';
  await submit(row);
  assert.match(requests[1][0], /\/api\/ai-connections\/gemini$/);
  assert.deepEqual(JSON.parse(requests[1][1].body), { key: 'fake-key' });
  assert.equal(requests[1][1].headers['X-Origin'], 'client');
  assert.equal(row.fields['[data-ai-key]'].value, '');
  assert.equal(row.fields['[data-ai-save]'].textContent, 'Replace key');
  assert.equal(row.fields['[data-ai-state]'].dataset.connected, 'true');
  assert.equal(row.fields['[data-ai-state]'].className, 'ocs__status-pill ocs__status-pill--good');
  assert.equal(root.providers[1].fields['[data-ai-disconnect]'].hidden, true);
  assert.equal(root.providers[0].fields['[data-ai-disconnect]'].className, 'ocs__btn');
  assert.equal(root.providers[1].fields['[data-ai-disconnect]'].className, 'ocs__btn hidden');
});

test('failed replacement retains connected status and clears the secret', async () => {
  const root = fixture(); let calls = 0;
  await initAiConnections(root, { request: async () => ++calls === 1
    ? response({ ...disconnected, providers: { ...disconnected.providers, gemini: { connected: true, modelConfigured: true } } })
    : response({ error: 'Unable to verify key' }, 422) });
  const row = root.providers[0]; row.fields['[data-ai-key]'].value = 'fake-invalid-key';
  await submit(row);
  assert.equal(row.fields['[data-ai-key]'].value, '');
  assert.equal(row.fields['[data-ai-state]'].dataset.connected, 'true');
  assert.equal(row.fields['[data-ai-message]'].textContent, 'Unable to verify key');
});

test('disconnecting one provider does not disconnect the other', async () => {
  const root = fixture(); let calls = 0;
  await initAiConnections(root, { request: async () => ++calls === 1
    ? response({ available: true, providers: { gemini: { connected: true, modelConfigured: true }, groq: { connected: true, modelConfigured: true } } })
    : response(null, 204) });
  await root.providers[0].fields['[data-ai-disconnect]'].listeners.click();
  assert.equal(root.providers[0].fields['[data-ai-state]'].dataset.connected, 'false');
  assert.equal(root.providers[0].fields['[data-ai-state]'].className, 'ocs__status-pill ocs__status-pill--neutral');
  assert.equal(root.providers[0].fields['[data-ai-disconnect]'].className, 'ocs__btn hidden');
  assert.equal(root.providers[1].fields['[data-ai-state]'].dataset.connected, 'true');
});

test('missing encryption or Groq model disables the affected controls', async () => {
  const root = fixture();
  await initAiConnections(root, { request: async () => response({ ...disconnected, available: false }) });
  assert.equal(root.providers[0].fields['[data-ai-save]'].disabled, true);
  assert.match(root.availability.textContent, /unaffected/);
  const second = fixture();
  await initAiConnections(second, { request: async () => response({ ...disconnected, providers: {
    ...disconnected.providers, groq: { connected: false, modelConfigured: false } } }) });
  assert.equal(second.providers[0].fields['[data-ai-save]'].disabled, false);
  assert.equal(second.providers[1].fields['[data-ai-save]'].disabled, true);
  assert.equal(second.providers[1].fields['[data-ai-state]'].className, 'ocs__text');
});

test('unauthenticated status shows sign-in guidance without enabling key input', async () => {
  const root = fixture();
  await initAiConnections(root, { request: async () => response({}, 401) });
  assert.match(root.availability.textContent, /Sign in to Spring/);
  assert.equal(root.providers[0].fields['[data-ai-key]'].disabled, true);
});

test('network save failure also clears the input and restores controls', async () => {
  const root = fixture(); let calls = 0;
  await initAiConnections(root, { request: async () => {
    if (++calls === 1) return response(disconnected);
    throw new Error('Network unavailable');
  } });
  const row = root.providers[1]; row.fields['[data-ai-key]'].value = 'fake-key';
  await submit(row);
  assert.equal(row.fields['[data-ai-key]'].value, '');
  assert.equal(row.fields['[data-ai-save]'].disabled, false);
});

test('disconnect remains possible when encryption configuration is unavailable', async () => {
  const root = fixture();
  await initAiConnections(root, { request: async () => response({ available: false, providers: {
    gemini: { connected: true, modelConfigured: true }, groq: { connected: false, modelConfigured: true } } }) });
  assert.equal(root.providers[0].fields['[data-ai-save]'].disabled, true);
  assert.equal(root.providers[0].fields['[data-ai-disconnect]'].disabled, false);
});

test('an unexpected server response leaves controls disabled with useful guidance', async () => {
  const root = fixture();
  await initAiConnections(root, { request: async () => response({}) });
  assert.match(root.availability.textContent, /unexpected AI connection response/);
  assert.equal(root.providers[0].fields['[data-ai-key]'].disabled, true);
});
