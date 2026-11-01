// Pure helpers for the Presence dashboard's room picker and Room setup panel.

// The room in the URL if it exists, otherwise the first room, otherwise null.
export function chooseRoomId(rooms, requestedId) {
  if (rooms.some((room) => room.id === requestedId)) return requestedId;
  return rooms.length ? rooms[0].id : null;
}

// Only the last 4 digits are shown, so a card number on screen can't be copied.
export function cardEnding(tagUid) {
  return `•••• ${String(tagUid).slice(-4)}`;
}

// A card number as the reader logs it: digits only. Spaces are ignored; anything else is invalid.
export function normalizeCardNumber(text) {
  const digits = String(text || "").replace(/\s+/g, "");
  return /^\d{1,64}$/.test(digits) ? digits : null;
}

export function apiErrorText(result) {
  return (result.data && result.data.message) || `Request failed (${result.status})`;
}

// A room's members as [{uid, period_name}]. Older backends only send member_uids, meaning every period.
export function roomMembers(room) {
  if (Array.isArray(room.members)) return room.members.map(({ uid, period_name }) => ({ uid, period_name }));
  return (room.member_uids || []).map((uid) => ({ uid, period_name: null }));
}

// One row per room member: their name, period and the cards registered to them.
// users is GET /api/user (uid, name, id); a card belongs to the member whose id matches its user_id.
export function memberRows(members, users, tags) {
  const userByUid = Object.fromEntries(users.map((user) => [user.uid, user]));
  return members.map(({ uid, period_name }) => {
    const user = userByUid[uid];
    const cards = user ? tags.filter((tag) => tag.user_id === user.id).map((tag) => tag.tag_uid) : [];
    return { uid, name: user ? user.name : uid, period_name, cards };
  });
}

// True when a member is missing from the cached user list, so it needs loading again.
export function hasUnknownMember(memberUids, users) {
  const known = new Set(users.map((user) => user.uid));
  return memberUids.some((uid) => !known.has(uid));
}

// The period names of a room from GET /api/presence/enroll/rooms; [] for an unknown room.
export function periodsForRoom(rooms, roomId) {
  const room = rooms.find((r) => r.id === roomId);
  return room ? room.periods : [];
}

// The period_name values a Period select offers; null is "All periods".
// Staff may pick every period in any room. A student only may in a room without a schedule,
// since the backend rejects null in a room that has periods.
export function periodChoices(periods, { staff = false } = {}) {
  if (staff) return [null, ...periods];
  return periods.length ? periods : [null];
}

export function periodLabel(periodName) {
  return periodName || "All periods";
}

// The enrollment My Card shows and changes: the first of GET /api/presence/enroll/me, or null.
export function currentEnrollment(me) {
  return (me && me.enrollments && me.enrollments[0]) || null;
}

export function enrollmentLabel(me) {
  const enrollment = currentEnrollment(me);
  if (!enrollment) return me.name;
  return `${me.name} - ${enrollment.room}, ${periodLabel(enrollment.period_name)}`;
}
