---
toc: false
layout: post
title: Classroom Presence System, My Card
description: Join your room's class period and register your own RFID card so your taps count.
permalink: /capstone/presence-system/my-card/
year: "2026-2027"
rp_active: mycard
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">My Card</div>
    <h1 class="rfid-presence-title">Register your card</h1>
    <p class="ocs__description">Pick your room and class period, then link your RFID card to your OCS account so your taps at the reader count.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card" id="mc-message" hidden></div>

  <div class="ocs__card" id="mc-class" hidden>
    <h3 class="ocs__section-title">Your class</h3>
    <p class="ocs__description" id="mc-class-text"></p>
    <button type="button" class="ocs__btn pill" id="mc-change">Change</button>
    <form id="mc-enroll" class="pd-setup-form" hidden>
      <div class="ocs__field">
        <label class="ocs__label" for="mc-room">Room</label>
        <select class="ocs__input" id="mc-room"></select>
      </div>
      <div class="ocs__field">
        <label class="ocs__label" for="mc-period">Period</label>
        <select class="ocs__input" id="mc-period"></select>
      </div>
      <button type="submit" class="ocs__btn pill accent fill">Join</button>
    </form>
    <output class="pd-feedback" id="mc-enroll-status" aria-live="polite"></output>
  </div>

  <div class="ocs__card" id="mc-card" hidden>
    <h3 class="ocs__section-title">Your card</h3>
    <p class="ocs__description" id="mc-card-text"></p>
    <p class="ocs__callout">Lost it or got a new one? Ask a teacher to replace it.</p>
  </div>

  <div class="ocs__card" id="mc-register" hidden>
    <h3 class="ocs__section-title">Register a new card</h3>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box"></span><span>Stand at the reader with your new card.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Click <strong>Register my card</strong>. You then have 60 seconds.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Hold your card flat on the reader for about a second.</span></li>
    </ul>
    <p class="ocs__callout" id="mc-result" hidden></p>
    <button type="button" class="ocs__btn pill accent fill" id="mc-start">Register my card</button>
  </div>

  <div class="ocs__card" id="mc-waiting" hidden>
    <h3 class="ocs__section-title">Tap your new card on the reader now</h3>
    <p class="ocs__description" id="mc-countdown"></p>
    <button type="button" class="ocs__btn pill" id="mc-cancel">Cancel</button>
  </div>
</div>

<script type="module">
  import { baseurl, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
  import { createEnrollApi, createPresenceApi } from '{{site.baseurl}}/assets/js/capstone/presence-api.js';
  import {
    apiErrorText, currentEnrollment, enrollmentLabel, periodChoices, periodLabel, periodsForRoom,
  } from '{{site.baseurl}}/assets/js/capstone/presence-room-model.js';

  // ?room=<id> overrides the enrolled room for card registration, for testing another reader.
  const requestedRoomId = Number(new URLSearchParams(location.search).get("room")) || null;
  const POLL_MS = 1500;
  const SECTIONS = ["mc-message", "mc-class", "mc-card", "mc-register", "mc-waiting"];
  const el = (id) => document.getElementById(id);
  const call = (path, options = {}) => fetch(`${pythonURI}${path}`, { ...fetchOptions, cache: "no-store", ...options });
  const enroll = createEnrollApi(createPresenceApi(pythonURI, fetchOptions));
  let me = null;  // GET /api/presence/enroll/me
  let enrollRooms = [];  // GET /api/presence/enroll/rooms, loaded when the Room select is shown
  let roomId = null;  // the room whose reader registers the card
  let claimId = null;
  let pollTimer = null;

  function only(...visible) {
    SECTIONS.forEach((id) => { el(id).hidden = !visible.includes(id); });
  }

  function message(text, linkText, href) {
    const box = el("mc-message");
    box.replaceChildren(document.createTextNode(text + " "));
    if (linkText) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = linkText;
      box.appendChild(a);
    }
    only("mc-message");
  }

  function result(text) {
    el("mc-result").textContent = text;
    el("mc-result").hidden = !text;
  }

  function fillPeriods(selected) {
    const choices = periodChoices(periodsForRoom(enrollRooms, Number(el("mc-room").value)));
    el("mc-period").replaceChildren(...choices.map((period) => new Option(periodLabel(period), period ?? "")));
    if (choices.includes(selected)) el("mc-period").value = selected ?? "";
  }

  // The Room and Period selects, pre-selected to the current enrollment when changing it.
  async function showEnrollForm() {
    const status = el("mc-enroll-status");
    el("mc-class-text").textContent = `Signed in as ${me.name}`;
    el("mc-change").hidden = true;
    const res = await enroll.rooms();
    if (!res.ok) {
      status.textContent = apiErrorText(res);
      return;
    }
    enrollRooms = res.data;
    if (!enrollRooms.length) {
      status.textContent = "There are no rooms to join yet. Ask a teacher to create one.";
      return;
    }
    const current = currentEnrollment(me);
    el("mc-room").replaceChildren(...enrollRooms.map((room) => new Option(room.name, room.id)));
    if (current) el("mc-room").value = current.room_id;
    fillPeriods(current ? current.period_name : null);
    el("mc-enroll").hidden = false;
  }

  async function loadCard() {
    const res = await call("/api/rfid/cards/me");
    if (!res.ok) return message(`The attendance backend returned an error (${res.status}).`);
    const data = await res.json();
    if (data.cards.length) {
      const card = data.cards[0];
      const since = card.registered_at ? ` since ${new Date(card.registered_at).toLocaleDateString()}` : "";
      el("mc-card-text").textContent = `Your card ending ${card.card_ending} is registered${since}. Your taps count.`;
      only("mc-class", "mc-card");
    } else {
      only("mc-class", "mc-register");
    }
  }

  // Card registration needs a room's reader, so it stays hidden until the student has joined a room.
  async function showClass() {
    const enrollment = currentEnrollment(me);
    if (!enrollment) {
      only("mc-class");
      return showEnrollForm();
    }
    el("mc-class-text").textContent = enrollmentLabel(me);
    el("mc-change").hidden = false;
    el("mc-enroll").hidden = true;
    roomId = requestedRoomId || enrollment.room_id;
    await loadCard();
  }

  async function load() {
    try {
      const res = await enroll.me();
      if (res.status === 401) return message("Log in with your OCS account to register your card.", "Log in", `${baseurl}/login`);
      if (!res.ok) return message(`The attendance backend returned an error (${res.status}).`);
      me = res.data;
      await showClass();
    } catch (err) {
      message(`Could not reach the attendance backend at ${pythonURI}.`);
    }
  }

  function stopPolling() {
    clearTimeout(pollTimer);
    pollTimer = null;
  }

  async function poll() {
    let claim;
    try {
      claim = await (await call(`/api/rfid/claims/${claimId}`)).json();
    } catch (err) {
      pollTimer = setTimeout(poll, POLL_MS);
      return;
    }
    if (claim.status === "open") {
      el("mc-countdown").textContent = `Waiting for your card at the ${claim.room} reader: ${claim.seconds_left} seconds left.`;
      pollTimer = setTimeout(poll, POLL_MS);
      return;
    }
    stopPolling();
    const outcome = {
      registered: "",
      conflict: "Someone else was registering at the same reader at the same moment, so the card wasn't linked to anyone. Try again.",
      expired: "No new card was tapped within 60 seconds. Try again.",
      cancelled: "",
    };
    result(outcome[claim.status] ?? `Registration ended (${claim.status}).`);
    await load();
  }

  el("mc-room").addEventListener("change", () => fillPeriods(null));

  el("mc-change").addEventListener("click", () => {
    el("mc-enroll-status").textContent = "";
    showEnrollForm();
  });

  el("mc-enroll").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = el("mc-enroll-status");
    const previous = currentEnrollment(me);
    const nextRoomId = Number(el("mc-room").value);
    try {
      // An empty value is the "All periods" option, sent as null.
      const res = await enroll.join(nextRoomId, el("mc-period").value || null);
      if (!res.ok) {
        status.textContent = apiErrorText(res);
        return;
      }
      me = res.data;
      // Changing rooms leaves the old one, so the student is on one room's roster, not both.
      if (previous && previous.room_id !== nextRoomId) {
        const left = await enroll.leave(previous.room_id);
        if (left.ok) me = left.data;
      }
      status.textContent = "";
      await showClass();
    } catch (err) {
      status.textContent = "Could not reach the attendance backend.";
    }
  });

  el("mc-start").addEventListener("click", async () => {
    result("");
    try {
      const res = await call("/api/rfid/claims", { method: "POST", body: JSON.stringify({ room_id: roomId }) });
      const body = await res.json();
      if (res.status === 409 && body.status === "has_card") return load();
      if (res.status === 404) return result(`Room ${roomId} does not exist. Check the link you were given.`);
      if (!res.ok) return result(body.message || `Could not start (${res.status}).`);
      claimId = body.id;
      el("mc-countdown").textContent = `Waiting for your card at the ${body.room} reader: ${body.seconds_left} seconds left.`;
      only("mc-waiting");
      pollTimer = setTimeout(poll, POLL_MS);
    } catch (err) {
      result("Could not reach the attendance backend.");
    }
  });

  el("mc-cancel").addEventListener("click", async () => {
    stopPolling();
    try {
      await call(`/api/rfid/claims/${claimId}`, { method: "DELETE" });
    } catch (err) {
      // the window expires on its own anyway
    }
    result("");
    await load();
  });

  load();
</script>
