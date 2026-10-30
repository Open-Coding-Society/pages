---
toc: false
layout: post
title: Classroom Presence System, Live Dashboard
description: Live attendance for the current class period from RFID taps recorded in OCS. Camera verification is next.
permalink: /capstone/presence-system/dashboard/
year: "2026-2027"
rp_active: dashboard
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Live Dashboard</div>
    <h2 class="ocs__section-title" id="pd-period">Loading period...</h2>
    <p class="ocs__description" id="pd-meta">Signed-in teachers and admins see each student's state for the current period.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card" id="pd-message" hidden></div>

  <div class="ocs__card pd-controls" id="pd-controls" hidden>
    <div class="ocs__field pd-room-field">
      <label class="ocs__label" for="pd-room">Room</label>
      <select class="ocs__input" id="pd-room"></select>
    </div>
    <p class="pd-controls-text">Taps only count during a class period. Outside the room's schedule or during passing time, start a demo period first.</p>
    <button type="button" class="ocs__btn pill accent fill" id="pd-start">Start 30-minute demo period</button>
    <span class="pd-start-feedback" id="pd-start-status"></span>
  </div>

  <div id="pd-live" hidden>
    <div class="pd-summary" id="pd-summary"></div>

    <div class="ocs__card">
      <div class="rfid-presence-table-wrap">
        <table class="rfid-presence-table">
          <thead>
            <tr><th>Student</th><th>Status</th><th>Since</th><th>Camera check</th></tr>
          </thead>
          <tbody id="pd-roster"></tbody>
        </table>
      </div>
      <p class="pd-updated" id="pd-updated"></p>
    </div>
  </div>

  <details class="ocs__card pd-setup" id="pd-setup" hidden>
    <summary>Room setup</summary>
    <div class="ocs__stack">
      <section aria-labelledby="pd-new-title">
        <h3 id="pd-new-title">New room</h3>
        <form id="pd-new-room" class="pd-setup-form">
          <div class="ocs__field">
            <label class="ocs__label" for="pd-new-name">Name</label>
            <input class="ocs__input" id="pd-new-name" required maxlength="120" autocomplete="off">
          </div>
          <div class="ocs__field">
            <label class="ocs__label" for="pd-new-schedule">Bell schedule</label>
            <select class="ocs__input" id="pd-new-schedule"></select>
          </div>
          <button type="submit" class="ocs__btn pill accent fill">Create room</button>
        </form>
        <output class="pd-feedback" id="pd-new-status" aria-live="polite"></output>
      </section>

      <div class="ocs__stack" id="pd-setup-room" hidden>
        <section aria-labelledby="pd-members-title">
          <h3 id="pd-members-title">Members</h3>
          <ul class="pd-setup-list" id="pd-members"></ul>
          <form id="pd-add-member" class="pd-setup-form">
            <div class="ocs__field">
              <label class="ocs__label" for="pd-member-uid">GitHub ID</label>
              <input class="ocs__input" id="pd-member-uid" required autocomplete="off">
            </div>
            <button type="submit" class="ocs__btn pill">Add member</button>
          </form>
          <output class="pd-feedback" id="pd-member-status" aria-live="polite"></output>
        </section>

        <section aria-labelledby="pd-cards-title">
          <h3 id="pd-cards-title">Cards</h3>
          <p class="pd-hint">An unregistered card's number shows in the reader's log when it is tapped.</p>
          <ul class="pd-setup-list" id="pd-cards"></ul>
          <form id="pd-add-card" class="pd-setup-form">
            <div class="ocs__field">
              <label class="ocs__label" for="pd-card-member">Member</label>
              <select class="ocs__input" id="pd-card-member"></select>
            </div>
            <div class="ocs__field">
              <label class="ocs__label" for="pd-card-number">Card number</label>
              <input class="ocs__input" id="pd-card-number" required inputmode="numeric" autocomplete="off">
            </div>
            <button type="submit" class="ocs__btn pill">Register card</button>
          </form>
          <output class="pd-feedback" id="pd-card-status" aria-live="polite"></output>
        </section>
      </div>
    </div>
  </details>
</div>


<script type="module">
  import { baseurl, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
  import { createPresenceApi } from '{{site.baseurl}}/assets/js/capstone/presence-api.js';
  import { chooseRoomId } from '{{site.baseurl}}/assets/js/capstone/presence-room-model.js';
  import { createRoomSetup } from '{{site.baseurl}}/assets/js/capstone/presence-room-setup.js';

  const POLL_MS = 2000;
  const STATE_LABELS = {
    PRESENT: "Present",
    TARDY: "Tardy",
    TEMP_OUT: "Stepped Out",
    LEFT_EARLY: "Left Early",
    ABSENT: "Absent",
    NOT_YET_ARRIVED: "Not Yet Arrived",
  };
  const STATE_PILL = {
    PRESENT: "good",
    TARDY: "warn",
    TEMP_OUT: "warn",
    LEFT_EARLY: "bad",
    ABSENT: "bad",
    NOT_YET_ARRIVED: "neutral",
  };
  const SUMMARY_STATES = ["PRESENT", "TARDY", "TEMP_OUT", "ABSENT", "LEFT_EARLY", "NOT_YET_ARRIVED"];
  // Camera verification of each student's most recent tap.
  const VERIFICATION_LABELS = {
    VERIFIED: "Verified",
    MISMATCH: "Mismatch",
    NO_FACE: "No face",
    TAP_ONLY: "Tap only",
    UNVERIFIED: "Unverified",
    PENDING: "Checking...",
    RFID_ONLY: "RFID only",
  };
  const VERIFICATION_PILL = {
    VERIFIED: "good",
    MISMATCH: "bad",
    NO_FACE: "warn",
    TAP_ONLY: "neutral",
    UNVERIFIED: "neutral",
    PENDING: "neutral",
    RFID_ONLY: "neutral",
  };

  const request = createPresenceApi(pythonURI, fetchOptions);
  let rooms = [];
  let roomId = null;
  const DEMO_PERIOD = { name: "Demo Period", duration_seconds: 30 * 60, grace_seconds: 2 * 60 };
  const el = (id) => document.getElementById(id);
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  function showMessage(text, linkText, href) {
    const box = el("pd-message");
    box.replaceChildren(document.createTextNode(text + " "));
    if (linkText) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = linkText;
      box.appendChild(a);
    }
    box.hidden = false;
    el("pd-live").hidden = true;
  }

  function render(data) {
    el("pd-message").hidden = true;
    const period = data.period;
    if (!period) {
      el("pd-period").textContent = "No class in session";
      el("pd-meta").textContent = `${data.room.name} · no scheduled or manual period is active.`;
      el("pd-live").hidden = true;
      return;
    }

    const m = Math.floor(period.seconds_remaining / 60);
    const s = String(period.seconds_remaining % 60).padStart(2, "0");
    el("pd-period").textContent = period.name;
    el("pd-meta").textContent =
      `${data.room.name} · ${fmtTime(period.start_time)} – ${fmtTime(period.end_time)} · ` +
      `${period.source === "scheduled" ? "Live from the room's schedule" : "Manually started"} · ${m}:${s} remaining`;

    const counts = Object.fromEntries(SUMMARY_STATES.map((st) => [st, 0]));
    data.students.forEach((st) => { if (st.state in counts) counts[st.state]++; });
    el("pd-summary").replaceChildren(...SUMMARY_STATES.map((state) => {
      const box = document.createElement("div");
      box.className = "pd-stat";
      const count = document.createElement("div");
      count.className = "pd-stat-count";
      count.textContent = counts[state];
      const label = document.createElement("div");
      label.className = "pd-stat-label";
      label.textContent = STATE_LABELS[state];
      box.append(count, label);
      return box;
    }));

    const rows = data.students.map((st) => {
      const tr = document.createElement("tr");
      const name = document.createElement("td");
      name.className = "pd-name";
      name.textContent = st.name;
      const status = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = `rfid-presence-pill rfid-presence-pill-${STATE_PILL[st.state] || "neutral"}`;
      pill.textContent = STATE_LABELS[st.state] || st.state;
      status.appendChild(pill);
      const since = document.createElement("td");
      since.textContent = st.since ? fmtTime(st.since) : "—";
      const camera = document.createElement("td");
      if (st.verification) {
        const check = document.createElement("span");
        check.className = `rfid-presence-pill rfid-presence-pill-${VERIFICATION_PILL[st.verification] || "neutral"}`;
        check.textContent = VERIFICATION_LABELS[st.verification] || st.verification;
        camera.appendChild(check);
      } else {
        camera.textContent = "—";
      }
      tr.append(name, status, since, camera);
      return tr;
    });
    if (!rows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "No members or taps in this room yet.";
      tr.appendChild(td);
      rows.push(tr);
    }
    el("pd-roster").replaceChildren(...rows);
    el("pd-updated").textContent = `Updated ${new Date(data.generated_at).toLocaleTimeString()}`;
    el("pd-live").hidden = false;
  }

  async function refresh() {
    if (roomId === null) return;
    try {
      const res = await fetch(`${pythonURI}/api/presence/rooms/${roomId}/status`, fetchOptions);
      if (res.status === 401) {
        showMessage("Sign in with your OCS account to see live attendance.", "Log in", `${baseurl}/login`);
      } else if (res.status === 403) {
        showMessage("Live attendance is only visible to teachers and admins.");
      } else if (res.status === 404) {
        showMessage(`Room ${roomId} does not exist.`);
      } else if (!res.ok) {
        showMessage(`The attendance backend returned an error (${res.status}).`);
      } else {
        render(await res.json());
      }
    } catch (err) {
      showMessage(`Could not reach the attendance backend at ${pythonURI}.`);
    }
  }

  const setup = createRoomSetup({ request, onRoomCreated: loadRooms, onMembersChanged: refresh });

  async function selectRoom(id) {
    roomId = id;
    el("pd-room").value = id;
    const url = new URL(location.href);
    url.searchParams.set("room", id);
    history.replaceState(null, "", url);
    el("pd-start-status").textContent = "";
    await Promise.all([refresh(), setup.setRoom(rooms.find((room) => room.id === id))]);
  }

  // Lists the rooms. The endpoint is teacher/admin only, so a 200 also means this viewer can set rooms up.
  async function loadRooms(preferredId) {
    let res;
    try {
      res = await request("/api/presence/rooms");
    } catch (err) {
      showMessage(`Could not reach the attendance backend at ${pythonURI}.`);
      return false;
    }
    if (res.status === 401) {
      showMessage("Sign in with your OCS account to see live attendance.", "Log in", `${baseurl}/login`);
      return false;
    }
    if (res.status === 403) {
      showMessage("Live attendance is only visible to teachers and admins.");
      return false;
    }
    if (!res.ok) {
      showMessage(`The attendance backend returned an error (${res.status}).`);
      return false;
    }
    rooms = res.data;
    el("pd-room").replaceChildren(...rooms.map((room) => new Option(room.name, room.id)));
    el("pd-setup").hidden = false;
    roomId = chooseRoomId(rooms, preferredId);
    el("pd-controls").hidden = roomId === null;
    if (roomId === null) {
      el("pd-period").textContent = "No rooms yet";
      el("pd-meta").textContent = "Create the first room in Room setup below.";
      el("pd-setup").open = true;
      await setup.setRoom(null);
    } else {
      await selectRoom(roomId);
    }
    return true;
  }

  el("pd-room").addEventListener("change", () => selectRoom(Number(el("pd-room").value)));

  async function poll() {
    if (!document.hidden) await refresh();
    setTimeout(poll, POLL_MS);
  }

  el("pd-start").addEventListener("click", async () => {
    const status = el("pd-start-status");
    status.textContent = "Starting...";
    try {
      const res = await fetch(`${pythonURI}/api/presence/rooms/${roomId}/periods`, {
        ...fetchOptions,
        method: "POST",
        body: JSON.stringify(DEMO_PERIOD),
      });
      status.textContent = res.ok ? `Demo period started at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : `Could not start (${res.status})`;
    } catch (err) {
      status.textContent = "Could not reach the backend";
    }
    await refresh();
  });

  if (await loadRooms(Number(new URLSearchParams(location.search).get("room")) || null)) {
    setup.loadSchedules();
    poll();
  }
</script>
