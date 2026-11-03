---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Roadmap
description: What works now, what's next, and what waits until the research data supports it.
permalink: /capstone/presence-system/phases/
year: "2026-2027"
rp_active: phases
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Roadmap</div>
    <h1 class="rfid-presence-title">From contact tap to contactless presence</h1>
    <p class="ocs__description">What works now, what's next, and what waits until the data supports it.</p>
  </div>

  {% include presence-system-nav.html %}

<div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Issue</th><th>Mentor feedback</th><th>Status</th><th>Where it is</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Pacemakers and implants: check reader frequencies, cite research, opt-out</td><td><span class="ocs__status-pill ocs__status-pill--warn">Documented</span></td><td>Research page, <a href="/capstone/presence-system/summary/">Medical Device Considerations</a>. To do: datasheet and FCC ID</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>"Zero" teacher effort is inaccurate</td><td><span class="ocs__status-pill ocs__status-pill--good">Done</span></td><td>Research question and H3 now say very low effort: the teacher reviews exceptions</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Phase 5: district cost research</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>Phase 5 card below. Research only, not a build</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a></td><td>Yearly time lost to attendance</td><td><span class="ocs__status-pill ocs__status-pill--good">Done</span></td><td><a href="/capstone/presence-system/">Overview</a>: about 30 hours a year. To do: measure the 10 minutes</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>CSSE sprints: Phase 3, then Phase 4 by MVP</td><td><span class="ocs__status-pill ocs__status-pill--warn">Draft</span></td><td>Sprint plan below. Confirm what Phase 3 and 4 mean</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Deeper OCS integration</td><td><span class="ocs__status-pill ocs__status-pill--good">Merged</span></td><td>Presence API merged into OCS (PRs #96, #97); deploy pending. <a href="/capstone/presence-system/technical/">Technical</a> page updated</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>One story per page, cartoon and real (N@TM)</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>For N@TM; not started</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Keep the pipeline-page documentation style</td><td><span class="ocs__status-pill ocs__status-pill--good">Kept</span></td><td><a href="/capstone/presence-system/pipeline/">How It Works</a> is the template</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Circular enclosure, open only at the tap area</td><td><span class="ocs__status-pill ocs__status-pill--warn">Designing</span></td><td><a href="/capstone/presence-system/tap-reader/">Tap Reader Build</a>: requirements and test plan</td></tr>
          <tr><td><a href="https://github.com/vibha1019/crowpi-attendance/issues/15" target="_blank" rel="noopener">#15</a></td><td>Measure and scale the 3D-printed parts</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Planned</span></td><td>Tap Reader Build: measure, test print, then final print</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Mentor feedback tracker: what we heard in the first two reviews, and where each item stands.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-roadmap.svg" alt="Where it&#x27;s going. Now: tap the laptop tag on the Raspberry Pi reader, working. Next: tap plus a camera face check. Later: walk through the front or back door and a UHF reader reads the laptop tag automatically.">
    <p class="ocs__description">Where it's going: today a tap, next a face check, later no tap at all.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-plan.svg" alt="Plan: done through October 11, today&#x27;s review, camera around October 19, second tap reader, Cycle 1 minutes accuracy, then a classroom pilot.">
    <p class="ocs__description">Plan: next up is the camera with the Jarvis team.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Part</th><th>Status</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>Tap reader</td><td><span class="ocs__status-pill ocs__status-pill--good">Working</span></td><td>Raspberry Pi 4 with a Waveshare PN532 NFC HAT, S50 cards</td></tr>
          <tr><td>Presence API in OCS</td><td><span class="ocs__status-pill ocs__status-pill--good">Merged</span></td><td>PRs #96 and #97: rooms, schedules in the database, backup/restore</td></tr>
          <tr><td>Deploy to the OCS server</td><td><span class="ocs__status-pill ocs__status-pill--warn">Pending</span></td><td>With the OCS deploy team</td></tr>
          <tr><td>Live dashboard</td><td><span class="ocs__status-pill ocs__status-pill--warn">Local</span></td><td>Works on our local OCS; goes live with the Pages PR after deploy</td></tr>
          <tr><td>Self-registration</td><td><span class="ocs__status-pill ocs__status-pill--warn">Built</span></td><td>Students register their own card; PR after deploy</td></tr>
          <tr><td>Camera check</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Next</span></td><td>Jarvis team; date to be set</td></tr>
          <tr><td>Enclosure</td><td><span class="ocs__status-pill ocs__status-pill--neutral">Designing</span></td><td>Circular, open only at the tap area</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">Status today: what works, what's next, and what's ordered.</p>
  </div>

  <div class="ocs__card">
    <div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Stage</th><th>What it was</th></tr></thead><tbody><tr><td>Classroom pilot</td><td>Hardening the tap system for a real class period: a deck of RFID-stickered playing cards (one per student), a production backend and admin dashboard, real auth, off SQLite.</td></tr><tr><td>UHF doorway transition</td><td>Swap the tap pad for contactless UHF reads at a single door-table rig, tags mounted on laptops instead of tapped, and the start of a Camera Events contract with the face-scanning system.</td></tr><tr><td>Full room-scale presence</td><td>Front and back door UHF detection, full RFID and camera correlation, the complete presence-state machine (present, tardy, stepped out, left early, opted out, tamper) running live in the trial room.</td></tr></tbody></table></div>
    <p class="ocs__description">Later stages. These were paused until the research data supported them; after the 10/12 review the direction is to move into Phase&nbsp;3 and reach Phase&nbsp;4 by MVP (sprint plan below).</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Sprint</th><th>Goal</th><th>Phase</th><th>Demo at the end</th><th>Owner</th></tr></thead>
        <tbody>
          <tr><td>1 (done, Oct 5&ndash;20)</td><td>OCS integration: presence API merged into OCS, generic rooms, schedules in the database, backup/restore, Pi&nbsp;4 PN532 reader, S50 cards</td><td>2 (classroom pilot) started</td><td>Tap a card, OCS dashboard shows Present in about 2 seconds</td><td>Vibha</td></tr>
          <tr><td>2 (next)</td><td>Deployed pilot: OCS deploy, dashboard and self-registration on Pages, production room and cards, enclosure v1 test print, camera connection with Jarvis</td><td>2 (classroom pilot) done</td><td>A real class period tracked on deployed OCS; students register their own cards</td><td>assign</td></tr>
          <tr><td>3</td><td>Doorway reader and research Cycle&nbsp;1: reader at the door for enter and exit, minutes compared with a hand log (H2), camera face check on taps</td><td>3</td><td>Minutes report for one class next to the hand log</td><td>assign</td></tr>
          <tr><td>4 (MVP)</td><td>Room-scale presence: RFID and camera correlated, presence states live, teacher reviews exceptions only (H3 measured)</td><td>4</td><td>One class period run end to end, teacher effort timed</td><td>assign</td></tr>
        </tbody>
      </table>
    </div>
    <p class="ocs__description">CSSE sprint plan (draft): each sprint has a goal, a phase, and a demo. Dates and owners to set; confirm with the mentor what Phase&nbsp;3 and Phase&nbsp;4 mean (the hardware stages above, or a renumbered plan).</p>
  </div>

  <div class="ocs__card">
    <h3 class="ocs__section-title">Phase 5: district deployment feasibility (research, not a build)</h3>
    <p class="rfid-presence-about">From the first peer review (<a href="https://github.com/vibha1019/crowpi-attendance/issues/10" target="_blank" rel="noopener">#10</a>): what would it cost PUSD to run this for every classroom once Phase&nbsp;4 works?</p>
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box"></span><span>Hosting: cloud, district servers, or a hybrid (processing on each Pi, central storage).</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Hardware per classroom at scale: readers, cameras, Pis, cards per student, and bulk pricing.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Running costs: replacement cards, failed hardware, IT staff time, monitoring and updates.</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Privacy and compliance: FERPA and California student data law (encryption, audits, retention limits).</span></li>
      <li class="open"><span class="ocs__checklist-box"></span><span>Compare the yearly cost with the instructional time recovered (about 30 hours per class per year, see the Overview).</span></li>
    </ul>
    <p class="rfid-presence-about">Back-of-envelope, with placeholder numbers: about 20 events per student per day &times; 35,000 students &times; 180 days &asymp; 126 million events a year; at about 200 bytes each that is roughly 25&nbsp;GB, which is small. The real costs are likely hardware, camera processing, and staff time, not storage. Replace the placeholders with PUSD enrollment and measurements from our own logs.</p>
  </div>

  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">How the build is staged</h3>
      <p class="rfid-presence-about">The hardest part of this project, antennas that reliably detect presence without a tap, is deliberately last. The build is staged so each phase produces something usable and testable on its own.</p>
    </div>
    <div class="ocs__card"><p class="rfid-presence-about"><strong>Phase 1 reflects the current working prototype.</strong> This is a hardware rollout roadmap, a different axis from the research cycles in the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>. See <a href="/capstone/presence-system/summary/">Research</a> for how the project's framing itself changed.</p></div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Plan, with dates</h3>
      <ul class="ocs__checklist">
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Sep</strong> First RFID tap reaches OCS</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 5</strong> Shared presence API, bell schedule, live dashboard</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 6</strong> Camera endpoints ready on our side</span></li>
        <li class="done"><span class="ocs__checklist-box"></span><span><strong>Oct 11</strong> Live demo working</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>Oct 16</strong> Camera connection test (Jarvis)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>~Oct 19</strong> Camera face check on every tap</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Second tap reader (ordered)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Cycle 1: minutes within 2 min of a hand log (H2)</span></li>
        <li class="open"><span class="ocs__checklist-box"></span><span><strong>TBD</strong> Classroom pilot</span></li>
      </ul>
    </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Later, If Data Supports It</h3>
      <p class="rfid-presence-about">The <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> explicitly pauses this hardware work until the research cycles show which input is actually worth deepening: "None of it answers a research question until data shows RFID is the right input." Kept here as a condensed record of the plan, not an active workstream.</p>
    </div>
    <div class="ocs__card"><h3 class="ocs__section-title">Hardware phases</h3><div class="ocs__diagram"><pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
    	P1["Phase 1
    Contact-Tap Prototype
    current"] -.next: see the sprint plan.-> LATER["Later, if data
    supports it:
    UHF, room-scale"]</pre></div></div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Phase 1: goal</h3>
      <p class="rfid-presence-about">Prove the core read, log, and dashboard loop end to end, cheaply, before investing in UHF hardware or camera integration.</p>
    </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: how it works today</h3>
        <div class="ocs__diagram">
          <pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
        S["Student taps
    their card"] --> R["RFID scan pad
    13.56MHz MIFARE"]
        R --> F["Flask backend
    logs UID + timestamp"]
        F --> DB[(SQLite)]
        DB --> D["Dashboard
    shows scan events"]</pre>
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: what's running</h3>
        <ul class="ocs__entity-list">
          <li><strong>Reader</strong>: RFID reader board, one scan pad</li>
          <li><strong>Tags</strong>: 13.56MHz MIFARE Classic, 10 demo tags</li>
          <li><strong>Backend</strong>: Flask dev server</li>
          <li><strong>Database</strong>: SQLite</li>
          <li><strong>Frontend</strong>: rough scan-event dashboard</li>
        </ul>
        <div class="ocs__callout">
          Contact-based (tap), single reader, no camera correlation yet. This validates the concept, not the target hardware described on the <a href="/capstone/presence-system/technical/">Technical</a> page. See <a href="/capstone/presence-system/phases/">Roadmap</a> for the demo tag SKU.
        </div>
      </div>
    <div class="ocs__card">
        <h3 class="ocs__section-title">Phase 1: acceptance criteria</h3>
        <ul class="ocs__checklist">
          <li class="done"><span class="ocs__checklist-box"></span><span>RFID reader board with one scan pad, 13.56MHz MIFARE Classic tags, 10 demo tags</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Basic Flask backend logging reads to SQLite</span></li>
          <li class="done"><span class="ocs__checklist-box"></span><span>Rough dashboard showing scan events</span></li>
        </ul>
      </div>
    <div class="ocs__card">
      <h3 class="ocs__section-title">Funding</h3>
      <p class="rfid-presence-about">Funding, the pilot equipment in the room, and the funding proposal spreadsheet now have their own tab: <a href="/capstone/presence-system/funding/">Funding</a>.</p>
    </div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
