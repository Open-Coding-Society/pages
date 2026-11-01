// Room setup panel on the Presence dashboard: create a room, manage its members, register cards.
// Only teachers and admins see it; the backend rejects these calls from anyone else anyway.
import {
  apiErrorText, cardEnding, hasUnknownMember, memberRows, normalizeCardNumber, periodChoices, periodLabel, roomMembers,
} from "./presence-room-model.js";

const el = (id) => document.getElementById(id);

function button(text, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "ocs__btn pill";
  b.textContent = text;
  b.addEventListener("click", onClick);
  return b;
}

function listItem(...children) {
  const li = document.createElement("li");
  li.append(...children);
  return li;
}

function uidLabel(row) {
  const code = document.createElement("code");
  code.textContent = row.uid;
  return [document.createTextNode(`${row.name} `), code];
}

// request: from createPresenceApi. onRoomCreated(id): show the new room. onMembersChanged(): refresh the roster.
export function createRoomSetup({ request, onRoomCreated, onMembersChanged }) {
  let room = null;
  let users = [];  // GET /api/user, loaded once and again only when a member is missing from it

  async function loadUsers(memberUids) {
    if (users.length && !hasUnknownMember(memberUids, users)) return;
    const res = await request("/api/user");
    if (res.ok && Array.isArray(res.data)) users = res.data;
  }

  async function loadSchedules() {
    const select = el("pd-new-schedule");
    const res = await request("/api/presence/schedules");
    const none = new Option("No bell schedule (demo periods only)", "");
    const schedules = res.ok ? res.data : [];
    select.replaceChildren(...schedules.map((s) => new Option(s.name, s.id)), none);
  }

  // "All periods" first: a member added by staff shows in every period unless one is picked.
  function renderPeriods(periods) {
    const choices = periodChoices(periods, { staff: true });
    el("pd-member-period").replaceChildren(...choices.map((period) => new Option(periodLabel(period), period ?? "")));
  }

  function renderMembers(rows) {
    el("pd-members").replaceChildren(...(rows.length ? rows.map((row) => listItem(
      ...uidLabel(row),
      document.createTextNode(` - ${periodLabel(row.period_name)}`),
      button("Remove", () => changeMember(row.uid, "DELETE")),
    )) : [listItem(document.createTextNode("No members yet."))]));
  }

  function renderCards(rows) {
    el("pd-cards").replaceChildren(...rows.map((row) => listItem(
      ...uidLabel(row),
      document.createTextNode(row.cards.length ? `: ${row.cards.map(cardEnding).join(", ")} ` : ": no card yet"),
      ...row.cards.map((tag) => button(`Remove ${cardEnding(tag)}`, () => removeCard(row, tag))),
    )));
    el("pd-card-member").replaceChildren(...rows.map((row) => new Option(`${row.name} (${row.uid})`, row.uid)));
    el("pd-add-card").hidden = !rows.length;
  }

  async function refresh() {
    el("pd-setup-room").hidden = !room;
    if (!room) return;
    el("pd-members-title").textContent = `Members of ${room.name}`;
    const [roomRes, tagsRes] = await Promise.all([
      request(`/api/presence/rooms/${room.id}`),
      request("/api/rfid/tags"),
    ]);
    if (!roomRes.ok) {
      el("pd-member-status").textContent = apiErrorText(roomRes);
      return;
    }
    const members = roomMembers(roomRes.data);
    await loadUsers(members.map((member) => member.uid));
    const rows = memberRows(members, users, tagsRes.ok ? tagsRes.data : []);
    renderPeriods(roomRes.data.periods || []);
    renderMembers(rows);
    renderCards(rows);
  }

  // body: {period_name} when adding; null period_name means every period.
  async function changeMember(uid, method, body) {
    const status = el("pd-member-status");
    const res = await request(`/api/presence/rooms/${room.id}/members/${encodeURIComponent(uid)}`, { method, body });
    status.textContent = res.ok ? `${method === "POST" ? "Added" : "Removed"} ${uid}.` : apiErrorText(res);
    if (res.ok) {
      await refresh();
      onMembersChanged();
    }
    return res.ok;
  }

  async function removeCard(row, tag) {
    if (!confirm(`Remove card ${cardEnding(tag)} from ${row.name}? Their taps stop counting until it is registered again.`)) return;
    const res = await request(`/api/rfid/tags/${encodeURIComponent(tag)}`, { method: "DELETE" });
    el("pd-card-status").textContent = res.ok ? `Removed ${cardEnding(tag)} from ${row.name}.` : apiErrorText(res);
    if (res.ok) await refresh();
  }

  el("pd-new-room").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = el("pd-new-status");
    const scheduleId = el("pd-new-schedule").value;
    const body = { name: el("pd-new-name").value.trim(), ...(scheduleId ? { schedule_id: Number(scheduleId) } : {}) };
    const res = await request("/api/presence/rooms", { method: "POST", body });
    if (res.ok) {
      status.textContent = `Created ${res.data.name}.`;
      el("pd-new-name").value = "";
      await onRoomCreated(res.data.id);
    } else if (res.status === 409 && res.data && res.data.id) {
      status.textContent = `${body.name} already exists, so it is selected below.`;
      await onRoomCreated(res.data.id);
    } else {
      status.textContent = apiErrorText(res);
    }
  });

  el("pd-add-member").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = el("pd-member-uid");
    const periodName = el("pd-member-period").value || null;
    if (await changeMember(input.value.trim(), "POST", { period_name: periodName })) input.value = "";
  });

  el("pd-add-card").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = el("pd-card-status");
    const tag = normalizeCardNumber(el("pd-card-number").value);
    if (!tag) {
      status.textContent = "A card number is digits only, as the reader's log shows it.";
      return;
    }
    const uid = el("pd-card-member").value;
    const res = await request("/api/rfid/tags", { method: "POST", body: { tag_uid: tag, uid } });
    // 201 is a new card; 200 means the card was already registered and now belongs to this person.
    const done = res.status === 201 ? "Registered" : "Card was already registered; moved";
    status.textContent = res.ok ? `${done} ${cardEnding(tag)} to ${uid}.` : apiErrorText(res);
    if (res.ok) {
      el("pd-card-number").value = "";
      await refresh();
    }
  });

  return {
    loadSchedules,
    async setRoom(nextRoom) {
      room = nextRoom;
      await refresh();
    },
  };
}
