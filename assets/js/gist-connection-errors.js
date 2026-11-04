const CONNECTION_ERRORS = new Set(['GIST_CONNECTION_REQUIRED', 'GIST_TOKEN_INVALID', 'GIST_PERMISSION_REQUIRED']);
export function gistExportError(status, data, settingsUrl) {
  const messages = new Map([
    ['GIST_CONNECTION_REQUIRED', 'Connect your GitHub Gist token in Profile Settings before exporting.'],
    ['GIST_TOKEN_INVALID', 'Your GitHub token expired or was revoked. Replace it in Profile Settings.'],
    ['GIST_PERMISSION_REQUIRED', 'Your GitHub token needs Gists write permission. Update it in Profile Settings.'],
    ['GIST_STORAGE_UNAVAILABLE', 'GitHub connections are unavailable. Contact support.'],
    ['GITHUB_RATE_LIMITED', 'GitHub request limit reached. Try again later.'],
    ['GITHUB_UNAVAILABLE', 'GitHub could not be reached. Try again later.'],
  ]);
  const error = new Error(messages.get(data?.code)
    || (status === 401 ? 'Sign in to Spring before exporting.' : `Export failed (${status}). Try again.`));
  error.code = data?.code;
  if (CONNECTION_ERRORS.has(error.code)) error.settingsUrl = settingsUrl;
  return error;
}
export function appendGistSettingsLink(container, error) {
  if (!container) return;
  container.querySelector('[data-gist-settings-link]')?.remove();
  if (!error?.settingsUrl) return;
  const link = document.createElement('a');
  link.href = error.settingsUrl;
  link.textContent = 'Open Profile Settings';
  link.className = 'gist-settings-link';
  link.dataset.gistSettingsLink = '';
  container.appendChild(link);
}
