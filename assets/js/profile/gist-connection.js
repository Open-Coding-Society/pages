import { javaURI } from '../api/config.js';

export function initGistConnection(section, request = fetch) {
  if (!section) return;
  const elements = Object.fromEntries(['form', 'token', 'state', 'message', 'save', 'disconnect']
    .map(name => [name, section.querySelector(`#gist-connection-${name}`)]));
  let available = false;
  let connected = false;
  function busy(value) {
    elements.save.disabled = value || !available;
    elements.disconnect.disabled = value || !connected;
    elements.token.disabled = value || !available;
  }
  function render(status) {
    available = status.available;
    connected = status.connected;
    elements.state.dataset.connected = String(Boolean(available && connected));
    elements.state.textContent = !available ? 'GitHub connections are unavailable. Contact support.'
      : connected ? `Connected as ${status.githubUsername}` : 'Not connected';
    elements.save.textContent = connected ? 'Replace token' : 'Save token';
    elements.disconnect.hidden = !connected;
    busy(false);
  }
  async function api(method, body) {
    const response = await request(`${javaURI}/api/gist-connection`, {
      method, credentials: 'include', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sign in to Spring to configure your GitHub connection.');
      throw new Error(data?.error || 'Unable to update your GitHub connection. Try again.');
    }
    return data;
  }
  elements.form.addEventListener('submit', async event => {
    event.preventDefault();
    busy(true);
    elements.message.textContent = '';
    try {
      render(await api('PUT', { token: elements.token.value.trim() }));
      elements.message.textContent = 'GitHub connection saved.';
    } catch (error) { elements.message.textContent = error.message; }
    finally { elements.token.value = ''; busy(false); }
  });
  elements.disconnect.addEventListener('click', async () => {
    busy(true);
    elements.message.textContent = '';
    try {
      await api('DELETE');
      render({ available: true, connected: false });
      elements.message.textContent = 'Disconnected from OCS. Revoke the token in GitHub if it is no longer needed.';
    } catch (error) { elements.message.textContent = error.message; }
    finally { elements.token.value = ''; busy(false); }
  });
  busy(true);
  return api('GET').then(render).catch(error => { elements.state.textContent = error.message; busy(false); });
}
