---
microblog: true
toc: false
layout: post
title: RFID Presence, Phase 1, Contact-Tap Prototype
description: The current working prototype, a contact-tap RFID reader, Flask backend, and dashboard, proving the core read-log-display loop.
permalink: /capstone/rfid-presence/phases/phase-1/
year: "2026-2027"
rp_active: phases
---


{% assign data = site.data.rfid_presence_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <a href="/capstone/rfid-presence/phases/" class="ocs__phase-crumb">&larr; All Phases</a>

  <div class="rfid-presence-header">
    <div class="ocs__badge">Phase 1 of 4</div>
    <h1 class="rfid-presence-title">Contact-Tap Prototype</h1>
    <p class="ocs__description">Prove the core read, log, and dashboard loop end to end, cheaply, before investing in UHF hardware or camera integration.</p>
    <div class="ocs__status">Current, Working</div>
  </div>

  {% include rfid-presence-nav.html %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">How It Works Today</h3>
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart LR
    S["Student taps
their card"] --> R["CrowPi scan pad
13.56MHz MIFARE"]
    R --> F["Flask backend
logs UID + timestamp"]
    F --> DB[(SQLite)]
    DB --> D["Dashboard
shows scan events"]</pre>
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">What's Running</h3>
    <ul class="ocs__entity-list">
      <li><strong>Reader</strong>: CrowPi board, one scan pad</li>
      <li><strong>Tags</strong>: 13.56MHz MIFARE Classic, 10 demo tags</li>
      <li><strong>Backend</strong>: Flask dev server</li>
      <li><strong>Database</strong>: SQLite</li>
      <li><strong>Frontend</strong>: rough scan-event dashboard</li>
    </ul>
    <div class="ocs__callout">
      Contact-based (tap), single reader, no camera correlation yet. This validates the concept, not the target hardware described on the <a href="/capstone/rfid-presence/technical/">Technical Detail</a> page. See <a href="/capstone/rfid-presence/funding/">Funding</a> for the demo tag SKU.
    </div>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Acceptance Criteria</h3>
    <ul class="ocs__checklist">
      <li class="done"><span class="ocs__checklist-box"></span><span>CrowPi board with one scan pad, 13.56MHz MIFARE Classic tags, 10 demo tags</span></li>
      <li class="done"><span class="ocs__checklist-box"></span><span>Basic Flask backend logging reads to SQLite</span></li>
      <li class="done"><span class="ocs__checklist-box"></span><span>Rough dashboard showing scan events</span></li>
    </ul>
  </div>

  <div class="ocs__pager">
    <span></span>
    <a href="/capstone/rfid-presence/phases/phase-2/" class="ocs__pager-link next">Next: Phase 2, Classroom Pilot &rarr;</a>
  </div>

  <div class="ocs__card">
    <div class="ocs__team">
      <span class="ocs__team-label">Project Team</span>
      <span class="ocs__team-name">{{ data.Team | join: ", " }}</span>
    </div>
    {% if data.Repo %}
    <a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>
    {% endif %}
  </div>
</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
