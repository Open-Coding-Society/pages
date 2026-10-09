import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { gistExportError, appendGistSettingsLink } from '../assets/js/gist-connection-errors.js';

test('connection failures link to settings without exposing upstream content', () => {
  for (const code of ['GIST_CONNECTION_REQUIRED', 'GIST_TOKEN_INVALID', 'GIST_PERMISSION_REQUIRED']) {
    const error = gistExportError(403, { code, error: 'secret upstream text' }, '/profile');
    assert.equal(error.settingsUrl, '/profile');
    assert.ok(!error.message.includes('secret upstream text'));
  }
  assert.equal(gistExportError(401, {}, '/profile').settingsUrl, undefined);
});
test('settings links use safe DOM construction', () => {
  const previous = globalThis.document;
  globalThis.document = { createElement: () => ({ dataset: {} }) };
  try {
    let link;
    appendGistSettingsLink({ querySelector: () => null, appendChild: value => { link = value; } }, { settingsUrl: '/profile' });
    assert.equal(link.textContent, 'Open Profile Settings');
    assert.equal(link.href, '/profile');
  } finally { globalThis.document = previous; }
});
const source = await readFile(new URL('../assets/js/profile/gist-connection.js', import.meta.url), 'utf8');
const { initGistConnection } = await import('data:text/javascript,' + encodeURIComponent(
  source.replace("import { javaURI } from '../api/config.js';", "const javaURI = 'http://localhost:8585';")));
function fixture() {
  const elements = Object.fromEntries(['form', 'token', 'state', 'message', 'save', 'disconnect'].map(name => [name,
    { value: '', dataset: {}, listeners: {}, addEventListener(event, listener) { this.listeners[event] = listener; } }]));
  return { elements, section: { querySelector: selector => elements[selector.replace('#gist-connection-', '')] } };
}
test('save and disconnect target only the session and clear the field', async () => {
  const { elements, section } = fixture();
  const calls = [];
  const request = async (url, options) => {
    calls.push(options);
    return { ok: true, status: options.method === 'DELETE' ? 204 : 200,
      json: async () => ({ available: true, connected: options.method === 'PUT', githubUsername: 'github-owner' }) };
  };
  await initGistConnection(section, request);
  assert.equal(elements.state.dataset.connected, 'false');
  elements.token.value = 'fixture-token';
  await elements.form.listeners.submit({ preventDefault() {} });
  assert.equal(elements.token.value, '');
  assert.equal(elements.state.textContent, 'Connected as github-owner');
  assert.equal(elements.state.dataset.connected, 'true');
  assert.deepEqual(JSON.parse(calls[1].body), { token: 'fixture-token' });
  assert.equal(calls[1].credentials, 'include');
  assert.equal(calls[1].headers['X-Origin'], 'client');
  await elements.disconnect.listeners.click();
  assert.equal(elements.state.textContent, 'Not connected');
  assert.equal(elements.state.dataset.connected, 'false');
});
test('failed replacement preserves displayed account and clears input', async () => {
  const { elements, section } = fixture();
  const request = async (url, options) => ({ ok: options.method === 'GET', status: options.method === 'GET' ? 200 : 403,
    json: async () => options.method === 'GET' ? { available: true, connected: true, githubUsername: 'original' }
      : { error: 'Invalid token' } });
  await initGistConnection(section, request);
  elements.token.value = 'bad-token';
  await elements.form.listeners.submit({ preventDefault() {} });
  assert.equal(elements.token.value, '');
  assert.equal(elements.state.textContent, 'Connected as original');
  assert.equal(elements.state.dataset.connected, 'true');
});
test('unavailable connections do not display connected styling', async () => {
  const { elements, section } = fixture();
  await initGistConnection(section, async () => ({ ok: true, status: 200,
    json: async () => ({ available: false, connected: false }) }));
  assert.equal(elements.state.dataset.connected, 'false');
  assert.equal(elements.save.disabled, true);
});
