// Calls to the Presence System backend (Flask /api/presence and /api/rfid).
// Every response there is JSON, errors included, so callers get { ok, status, data } back.

export function createPresenceApi(pythonURI, fetchOptions) {
  return async function request(path, { method = "GET", body } = {}) {
    const options = { ...fetchOptions, method };
    if (body !== undefined) options.body = JSON.stringify(body);
    const res = await fetch(`${pythonURI}${path}`, options);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  };
}
