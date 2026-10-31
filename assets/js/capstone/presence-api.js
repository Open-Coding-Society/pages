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

// Self-enrollment in a room's period (/api/presence/enroll). request: from createPresenceApi.
// me, join and leave all answer with {uid, name, enrollments: [{room_id, room, period_name}]}.
export function createEnrollApi(request) {
  return {
    rooms: () => request("/api/presence/enroll/rooms"),
    me: () => request("/api/presence/enroll/me"),
    // periodName null means every period, which only a room without a schedule accepts.
    join: (roomId, periodName) => request("/api/presence/enroll/me", { method: "PUT", body: { room_id: roomId, period_name: periodName } }),
    leave: (roomId) => request(`/api/presence/enroll/me/${roomId}`, { method: "DELETE" }),
  };
}
