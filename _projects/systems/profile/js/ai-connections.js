// The layout/include supplies shared configuration, so this module works before
// and after the Profile project's files are published to assets/js/profile/.
export function initAiConnections(root, { request = fetch, apiBase } = {}) {
  if (!root) return Promise.resolve();
  const availability = root.querySelector('[data-ai-availability]');
  const rows = [...root.querySelectorAll('[data-ai-provider]')].map(element => ({
    provider: element.dataset.aiProvider,
    form: element.querySelector('[data-ai-form]'),
    key: element.querySelector('[data-ai-key]'),
    save: element.querySelector('[data-ai-save]'),
    disconnect: element.querySelector('[data-ai-disconnect]'),
    state: element.querySelector('[data-ai-state]'),
    message: element.querySelector('[data-ai-message]'),
  }));
  let current = { available: false, providers: {} };
  let pending = false;

  function updateControls() {
    for (const row of rows) {
      const provider = current.providers[row.provider] || {};
      row.key.disabled = row.save.disabled = pending || !current.available || !provider.modelConfigured;
      row.disconnect.disabled = pending || !provider.connected;
    }
  }
  function render(status) {
    current = status;
    availability.textContent = status.available
      ? 'Personal key storage is available.'
      : 'Personal key storage is unavailable. Contact support; system grading and submission saving are unaffected.';
    for (const row of rows) {
      const provider = status.providers[row.provider] || {};
      row.state.textContent = provider.connected ? `${row.provider === 'gemini' ? 'Gemini' : 'Groq'} key saved`
        : 'No personal key saved';
      if (!provider.modelConfigured) row.state.textContent += ' — grading model not configured; contact support';
      row.state.dataset.connected = String(Boolean(provider.connected));
      // Long model-configuration guidance must wrap rather than overflow a pill.
      row.state.className = provider.modelConfigured
        ? `ocs__status-pill ocs__status-pill--${provider.connected ? 'good' : 'neutral'}` : 'ocs__text';
      row.save.textContent = provider.connected ? 'Replace key' : 'Save key';
      row.disconnect.hidden = !provider.connected;
      // Shared buttons set display explicitly; use the grammar's hidden utility too.
      row.disconnect.className = provider.connected ? 'ocs__btn' : 'ocs__btn hidden';
    }
    updateControls();
  }
  async function api(method, provider, body) {
    const response = await request(`${apiBase}/api/ai-connections${provider ? `/${provider}` : ''}`, {
      method, credentials: 'include', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sign in to Spring to manage AI connections.');
      // Only server-owned sanitized error messages are displayed; never echo the entered key.
      throw new Error(data?.error || 'Unable to update your AI connection. Try again.');
    }
    if (response.status !== 204 && (typeof data?.available !== 'boolean' || !data.providers)) {
      throw new Error('Spring returned an unexpected AI connection response. Try again or contact support.');
    }
    return data;
  }
  for (const row of rows) {
    row.form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending) { row.key.value = ''; return; }
      pending = true; updateControls(); row.message.textContent = '';
      try {
        render(await api('PUT', row.provider, { key: row.key.value.trim() }));
        row.message.textContent = 'Key saved. Grading quota is checked when a request runs.';
      } catch (error) { row.message.textContent = error.message; }
      finally { row.key.value = ''; pending = false; updateControls(); }
    });
    row.disconnect.addEventListener('click', async () => {
      if (pending) return;
      pending = true; updateControls(); row.message.textContent = '';
      try {
        await api('DELETE', row.provider);
        render({ ...current, providers: { ...current.providers,
          [row.provider]: { ...current.providers[row.provider], connected: false, updatedAt: null } } });
        row.message.textContent = 'Disconnected from OCS. Revoke the key separately with the provider.';
      } catch (error) { row.message.textContent = error.message; }
      finally { row.key.value = ''; pending = false; updateControls(); }
    });
  }
  pending = true; updateControls();
  return api('GET').then(render).catch(error => { availability.textContent = error.message; })
    .finally(() => { pending = false; updateControls(); });
}
