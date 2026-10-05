---
toc: false
layout: post
title: Classroom Presence System, Live Dashboard
description: Live attendance for the current class period, from RFID taps (and later the camera) recorded in OCS.
permalink: /capstone/presence-system/dashboard/
year: "2026-2027"
rp_active: dashboard
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Live Dashboard</div>
    <h2 class="ocs__section-title" id="pd-period">Loading period...</h2>
    <p class="ocs__description" id="pd-meta">Signed-in teachers and admins see each student's state for the current period. Add <code>?classroom=&lt;id&gt;</code> to the URL to pick a classroom.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card" id="pd-message" hidden></div>

  <div id="pd-live" hidden>
    <div class="pd-summary" id="pd-summary"></div>

    <div class="ocs__card">
      <div class="rfid-presence-table-wrap">
        <table class="rfid-presence-table">
          <thead>
            <tr><th>Student</th><th>Status</th><th>Since</th><th>Last signal</th></tr>
          </thead>
          <tbody id="pd-roster"></tbody>
        </table>
      </div>
      <p class="pd-updated" id="pd-updated"></p>
    </div>
  </div>
</div>


<script type="module">
  import { baseurl, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

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

  const classroomId = Number(new URLSearchParams(location.search).get("classroom")) || 1;
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
      el("pd-meta").textContent = `${data.classroom.name} · no bell period or manual period is active.`;
      el("pd-live").hidden = true;
      return;
    }

    const m = Math.floor(period.seconds_remaining / 60);
    const s = String(period.seconds_remaining % 60).padStart(2, "0");
    el("pd-period").textContent = period.name;
    el("pd-meta").textContent =
      `${data.classroom.name} · ${fmtTime(period.start_time)} – ${fmtTime(period.end_time)} · ` +
      `${period.source === "bell" ? "Live from bell schedule" : "Manually started"} · ${m}:${s} remaining`;

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
      const source = document.createElement("td");
      source.textContent = st.last_source ? st.last_source.toUpperCase() : "—";
      tr.append(name, status, since, source);
      return tr;
    });
    if (!rows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "No students enrolled or seen in this classroom yet.";
      tr.appendChild(td);
      rows.push(tr);
    }
    el("pd-roster").replaceChildren(...rows);
    el("pd-updated").textContent = `Updated ${new Date(data.generated_at).toLocaleTimeString()}`;
    el("pd-live").hidden = false;
  }

  async function poll() {
    if (!document.hidden) {
      try {
        const res = await fetch(`${pythonURI}/api/presence/classrooms/${classroomId}/status`, fetchOptions);
        if (res.status === 401) {
          showMessage("Sign in with your OCS account to see live attendance.", "Log in", `${baseurl}/login`);
        } else if (res.status === 403) {
          showMessage("Live attendance is only visible to teachers and admins.");
        } else if (res.status === 404) {
          showMessage(`Classroom ${classroomId} does not exist.`);
        } else if (!res.ok) {
          showMessage(`The attendance backend returned an error (${res.status}).`);
        } else {
          render(await res.json());
        }
      } catch (err) {
        showMessage(`Could not reach the attendance backend at ${pythonURI}.`);
      }
    }
    setTimeout(poll, POLL_MS);
  }

  poll();
</script>
