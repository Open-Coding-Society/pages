---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Technical
description: The models, logic, and API behind the system. Reference material.
permalink: /capstone/presence-system/technical/
year: "2026-2027"
rp_active: technical
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Technical</div>
    <h1 class="rfid-presence-title">System architecture &amp; data flow</h1>
    <p class="ocs__description">The models, logic, and API behind the system. Reference material.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart TD
    BS[Bell Schedule] --> CP[Class / Period]
    CP --> REG["Registration:
Student + Face + Computer + RFID Tag"]
    REG --> RFID["RFID System
Front door / Back door / Room"]
    REG --> CAM["Camera System
Spatial presence, face-scanning system"]
    RFID --> CORR[Correlation / Intelligence Engine]
    CAM --> CORR
    CP -. expected enrollment .-> CORR
    BS -. attendance window .-> CORR
    CORR --> PRES[Attendance / Presence State]</pre>
    </div>
    <p class="ocs__description">Target architecture: RFID and camera events meet in one correlation engine, gated by the bell schedule.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">sequenceDiagram
    participant Bell as Bell Schedule
    participant Win as Attendance Window
    participant Door as Door Sensors (RFID)
    participant Cam as Camera System
    participant Eng as Correlation Engine

    Bell->>Win: Period starts -> window opens
    loop While window is open
        Door->>Eng: tag read (device event)
        Cam->>Eng: face/spatial event (student event)
        Eng->>Eng: correlate device + student signals
    end
    Bell->>Win: Period ends -> window closes
    Note over Eng: Any tag/camera event outside the window is logged but NOT counted as attendance</pre>
    </div>
    <p class="ocs__description">Attendance window: taps only count while the period's window is open.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">%%{init: { "htmlLabels": false, "flowchart": { "htmlLabels": false } } }%%
stateDiagram-v2
    [*] --> ABSENT
    ABSENT --> PRESENT: device + student seen in window
    ABSENT --> TARDY: first seen after grace period
    PRESENT --> DEVICE_PRESENT_STUDENT_AWAY: student signal drops
    DEVICE_PRESENT_STUDENT_AWAY --> PRESENT: student signal returns
    PRESENT --> LEFT_EARLY: both signals stop before window close
    PRESENT --> DEVICE_ABSENT_STUDENT_PRESENT: device signal drops, student still seen
    TARDY --> PRESENT: settles once both signals confirmed
    [*] --> DEVICE_ONLY_NO_CONSENT: device seen, camera opted out
    [*] --> TAMPER_DETECTED: tag reports tamper
    [*] --> IGNORED_OUT_OF_WINDOW: read outside attendance window</pre>
    </div>
    <p class="ocs__description">Presence states: what each student can be in, each period.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
    A[New student enrolled] --> B["Registration:
capture Face ID,
assign Computer,
issue RFID Tag"]
    B --> C[Tag: ACTIVE]
    C -->|Tag lost or damaged| D[Tag: RETIRED]
    C -->|Tamper signal received| E[Tag: TAMPERED]
    D --> F[Reissue new tag]
    E --> F
    F --> C
    C -->|Student unenrolled/graduated| G["Tag: RETIRED
Computer unlinked"]</pre>
    </div>
    <p class="ocs__description">Registration and tag lifecycle: how a tag is issued, flagged, and replaced.</p>
  </div>

  <details>
    <summary>Technical details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">About the technical design</h3>
      <p class="rfid-presence-about">How the RFID and camera signals get correlated into an attendance record, the most-developed of the three input tracks, for readers who want the mechanism and not just the pitch. QR follows the same event API once it's generalized.</p>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">System Architecture</h3>
      <p class="rfid-presence-about">For the RFID and camera pairing: two independent event sources feed a correlation engine that is also aware of the bell schedule and per-period enrollment. QR would feed the same engine as a third source once integrated.</p>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">RFID + Camera Target Architecture</h3>
      <p class="rfid-presence-about">This is the correlation design for the RFID and camera tracks specifically, the most-developed of the three inputs. QR follows the same event API once it's generalized in Cycle 1.</p><div class="ocs__callout">This is the target architecture the team is building toward across four phases; the current prototype implements the leftmost slice of it. Full detail, including the presence-state machine and data model, is on the <a href="/capstone/presence-system/technical/">Technical</a> page. Design rationale and a literature review of comparable systems, confirming this approach against prior work, is on the <a href="/capstone/presence-system/summary/">Research</a> page.</div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Attendance Window Logic</h3>
      <p class="rfid-presence-about">The bell schedule doesn't just define start and end times for tardy math. It defines a <strong>window</strong> during which reads count as attendance at all.</p>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Presence State Model</h3>
      <p class="rfid-presence-about">For the RFID and camera pairing: two independent signals, device via RFID and student via camera, get correlated into one of these states per student per period.</p>
    
    <div class="rfid-presence-table-wrap">
      <table class="ocs__table rfid-presence-table">
        <thead><tr><th>State</th><th>Device (RFID)</th><th>Student (Camera)</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-good">PRESENT</span></td><td>seen</td><td>seen</td><td>Normal attendance</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-warn">TARDY</span></td><td>first seen after window open plus grace period</td><td>seen</td><td>Arrived late</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-neutral">DEVICE_ONLY_NO_CONSENT</span></td><td>seen</td><td>opted out</td><td>Student declined face scanning by policy. Presence is based on the device signal alone and is not flagged as anomalous or incomplete.</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-warn">DEVICE_PRESENT_STUDENT_AWAY</span></td><td>seen</td><td>not currently seen</td><td>Bathroom or temporary-exit scenario. Not counted as absent or left early.</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-bad">LEFT_EARLY</span></td><td>seen, then both signals stop before window close</td><td>stopped before window close</td><td>Exited before period ended</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-warn">DEVICE_ABSENT_STUDENT_PRESENT</span></td><td>not seen</td><td>seen</td><td>Student present without their registered device. Flagged for manual review (forgot laptop, borrowed one, or tag failure).</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-bad">ABSENT</span></td><td>not seen</td><td>not seen</td><td>No signal at all during the window</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-bad">TAMPER_DETECTED</span></td><td>tag reports tamper/invalid</td><td>n/a</td><td>Tag physically compromised. Excluded from attendance and flagged for tag reissue.</td></tr>
          <tr><td><span class="rfid-presence-pill rfid-presence-pill-neutral">IGNORED_OUT_OF_WINDOW</span></td><td>seen</td><td>n/a</td><td>Read occurred outside the attendance window. Logged, not counted.</td></tr>
        </tbody>
      </table>
    </div>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Registration &amp; Tag Lifecycle</h3>
      <h3 class="ocs__section-title">Data the system needs to persist</h3>
    <p class="rfid-presence-about">No code yet for the full model. This is the entity list, not a schema.</p>
    <ul class="ocs__entity-list">
      <li><strong>Students</strong>: id, name, enrolled periods</li>
      <li><strong>Periods</strong>: id, name, start time, end time, expected enrollment</li>
      <li><strong>Computers</strong>: id, assigned student</li>
      <li><strong>RFID Tags</strong>: UID, linked computer, status (active/tampered/retired), issue date</li>
      <li><strong>Registrations</strong>: student, face ID, computer, and tag, the four-way binding</li>
      <li><strong>Doors</strong>: id, room, side (front/back)</li>
      <li><strong>RFID Events</strong>: tag UID, door, timestamp</li>
      <li><strong>Camera Events</strong>: student (via face match), timestamp, spatial zone; stub interface into the face-scanning system</li>
      <li><strong>Attendance Windows</strong>: derived per period from the bell schedule</li>
      <li><strong>Presence Records</strong>: computed state per student per period, the output of the correlation engine</li>
    </ul>
    </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">API Endpoints (built today)</h3>
        <div class="ocs__table-wrap">
          <table class="ocs__table">
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>What it does</th></tr></thead>
            <tbody>
              <tr><td><code>POST</code></td><td><code>/api/presence/event</code></td><td>Device key</td><td>Record a tap (source rfid) or a camera result (source camera)</td></tr>
              <tr><td><code>POST</code></td><td><code>/api/rfid/scan</code></td><td>Device key</td><td>Route the CrowPi uses today; forwards to /api/presence/event</td></tr>
              <tr><td><code>GET</code></td><td><code>/api/presence/classrooms/{id}/taps/pending</code></td><td>Device key</td><td>Camera asks for taps from the last 15 seconds</td></tr>
              <tr><td><code>GET</code></td><td><code>/api/presence/classrooms/{id}/status</code></td><td>Teacher / Admin</td><td>Each student's state now (the dashboard polls this every 2 s)</td></tr>
              <tr><td><code>POST</code></td><td><code>/api/presence/periods/start</code></td><td>Teacher / Admin</td><td>Start a demo period (overrides the bell schedule)</td></tr>
              <tr><td><code>POST</code></td><td><code>/api/rfid/register</code></td><td>Teacher / Admin</td><td>Link a tag to a student</td></tr>
              <tr><td><code>GET</code></td><td><code>/api/rfid/classrooms/{id}/events</code></td><td>Logged in, same school</td><td>Latest 200 taps for a classroom</td></tr>
              <tr><td><code>POST</code></td><td><code>/api/authenticate</code></td><td>Password</td><td>OCS login; sets the session cookie</td></tr>
            </tbody>
          </table>
        </div>
        <p class="rfid-presence-about">Device key = the <code>X-API-Key</code> header the CrowPi (and later the camera) sends. Teacher / Admin = a normal OCS login. Example tap, the request the CrowPi sends and what Flask returns:</p>
        <pre>POST /api/presence/event
    X-API-Key: (device key)

    {
      "event_id": "3f2b8c1e-6a1d-4f7e-9b0a-2d5c7e9f1a44",
      "source": "rfid",
      "classroom_id": 1,
      "occurred_at": "2026-10-12T15:44:07.123Z",
      "tag_uid": "1234567890",
      "device_id": "crowpi-room1"
    }

    200 OK (trimmed)
    {
      "status": "accepted",
      "duplicate": false,
      "event": {
        "uid": "vibham",
        "user_name": "Vibha Mandayam",
        "type": "enter",
        "period": "Demo Period",
        "occurred_at": "2026-10-12T15:44:07.123Z",
        "received_at": "2026-10-12T15:44:07.410Z"
      }
    }</pre>
        <p class="rfid-presence-about">Errors: 401 bad or missing device key, 404 unregistered tag (<code>"status": "unregistered"</code>), 400 missing fields or a timestamp without a timezone. A resent <code>event_id</code> returns the original record with <code>"duplicate": true</code>.</p>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Postman stands in for the CrowPi</h3>
        <div class="ocs__table-wrap">
          <table class="ocs__table">
            <thead><tr><th>#</th><th>Method</th><th>Request</th><th>Dashboard shows</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><code>POST</code></td><td>Log in</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Teacher session</span></td></tr>
              <tr><td>2</td><td><code>POST</code></td><td>Start demo period</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Everyone: not yet arrived</span></td></tr>
              <tr><td>3</td><td><code>POST</code></td><td>Tap</td><td><span class="ocs__status-pill ocs__status-pill--good">Present</span></td></tr>
              <tr><td>4</td><td><code>POST</code></td><td>Tap again</td><td><span class="ocs__status-pill ocs__status-pill--warn">Stepped Out</span></td></tr>
              <tr><td>5</td><td><code>POST</code></td><td>Same tap, resent</td><td><span class="ocs__status-pill ocs__status-pill--good">Not counted twice</span></td></tr>
              <tr><td>6</td><td><code>POST</code></td><td>Fake device key</td><td><span class="ocs__status-pill ocs__status-pill--bad">401 rejected</span></td></tr>
              <tr><td>7</td><td><code>GET</code></td><td>Status</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Same data as dashboard</span></td></tr>
            </tbody>
          </table>
        </div>
        <p class="ocs__description">Same request, same server, and the dashboard updates live.</p>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Current Software Stack (RFID Track)</h3>
        <ul class="ocs__entity-list">
          <li><strong>Reader board</strong>: CrowPi, single scan pad, 13.56MHz MIFARE Classic tags. Contact-tap, not the UHF doorway design above.</li>
          <li><strong>Backend</strong>: Flask, integrated into OCS. Real authentication on admin routes and moving off the dev server are still open, tracked in <a href="https://github.com/vibha1019/crowpi-attendance/issues/6" target="_blank" rel="noopener">Issue #6</a>.</li>
          <li><strong>Database</strong>: OCS's own database via the shared attendance API; the standalone prototype's separate SQLite database is being phased out.</li>
          <li><strong>Frontend</strong>: a live dashboard, running locally on the team's own network.</li>
        </ul>
        <div class="ocs__callout">
          The full RFID and camera architecture above is the <strong>target design</strong> for that pairing. The current running system implements only the leftmost slice of it: RFID read, log, dashboard, with no camera correlation yet, and that gap is intentionally not being closed until the research cycles justify it. See <a href="/capstone/presence-system/phases/">Roadmap</a> for what's paused and why.
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Open Technical Questions</h3>
        <ul class="ocs__checklist">
          <li class="open"><span class="ocs__checklist-box"></span><span>Bag-orientation reliability: a tagged laptop inside a closed backpack has no guaranteed tag-to-reader orientation, and UHF read reliability drops off-axis. Not yet solved. See <a href="/capstone/presence-system/summary/">Research</a> for candidate antenna designs that address this directly.</span></li>
          <li class="open"><span class="ocs__checklist-box"></span><span>Camera system interface: what the face-scanning system exposes (API, event stream, or file) still needs to be defined, including how it reports a student who has opted out.</span></li>
          <li class="open"><span class="ocs__checklist-box"></span><span>Tag mounting standard: a single mounting spot on the laptop (for example, the underside near a plastic vent) so tag type (on-metal versus standard) can be standardized across devices.</span></li>
        </ul>
      </div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
