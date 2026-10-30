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

// One row per room member: their name and the cards registered to them.
// users is GET /api/user (uid, name, id); a card belongs to the member whose id matches its user_id.
export function memberRows(memberUids, users, tags) {
  const userByUid = Object.fromEntries(users.map((user) => [user.uid, user]));
  return memberUids.map((uid) => {
    const user = userByUid[uid];
    const cards = user ? tags.filter((tag) => tag.user_id === user.id).map((tag) => tag.tag_uid) : [];
    return { uid, name: user ? user.name : uid, cards };
  });
}

// True when a member is missing from the cached user list, so it needs loading again.
export function hasUnknownMember(memberUids, users) {
  const known = new Set(users.map((user) => user.uid));
  return memberUids.some((uid) => !known.has(uid));
}
