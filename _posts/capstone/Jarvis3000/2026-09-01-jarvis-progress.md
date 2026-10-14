---
microblog: true
toc: false
layout: post
title: Jarvis3000 — Development Progress
description: Development milestones, implementation progress, testing results, and next steps for Jarvis3000.
permalink: /capstone/jarvis/progress/
year: "2026-2027"
rp_active: progress
---

{% assign data = site.data.jarvis_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<div class="ocs__container">

  {% include jarvis-nav.html %}

  <div class="jv-header">
    <div class="ocs__badge">Jarvis3000 · Progress</div>
    <h1 class="jv-title">Development Progress</h1>
    <p class="ocs__description">What's built, what's tested, what's next.</p>
  </div>

  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">3</span><span class="ocs__stat-label">Implemented</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">2</span><span class="ocs__stat-label">In Testing</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">1</span><span class="ocs__stat-label">Next Phase</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">Oct 25</span><span class="ocs__stat-label">Release Target</span></div>
  </div>

  <h2 class="ocs__section-title">Project Status</h2>
  <section class="ocs__card">
    <div class="jv-decision-grid">
      <div class="jv-decision-card">
        <span class="jv-decision-title">Camera Capture</span>
        <span class="ocs__status-pill ocs__status-pill--good">DONE</span>
        <p class="jv-decision-why">BRIO on Ubuntu, timestamped images</p>
      </div>
      <div class="jv-decision-card">
        <span class="jv-decision-title">SAM3 Detection</span>
        <span class="ocs__status-pill ocs__status-pill--good">DONE</span>
        <p class="jv-decision-why">People, chairs, laptops, monitors, phones</p>
      </div>
      <div class="jv-decision-card">
        <span class="jv-decision-title">Auto Processing</span>
        <span class="ocs__status-pill ocs__status-pill--good">DONE</span>
        <p class="jv-decision-why">File watcher launches the pipeline</p>
      </div>
      <div class="jv-decision-card">
        <span class="jv-decision-title">Object Inventory</span>
        <span class="ocs__status-pill ocs__status-pill--warn">TESTING</span>
        <p class="jv-decision-why">IDs, baseline, new / missing / returned</p>
      </div>
      <div class="jv-decision-card">
        <span class="jv-decision-title">Reliability</span>
        <span class="ocs__status-pill ocs__status-pill--warn">IMPROVING</span>
        <p class="jv-decision-why">Confidence filter + dedup</p>
      </div>
      <div class="jv-decision-card">
        <span class="jv-decision-title">System Integration</span>
        <span class="ocs__status-pill ocs__status-pill--neutral">NEXT</span>
        <p class="jv-decision-why">Assistant, UI, alerts, presence</p>
      </div>
    </div>
  </section>

  <h2 class="ocs__section-title">Working Pipeline</h2>
  <section class="ocs__card">
    <div class="jv-flow">
      <div class="jv-flow-node"><span class="jv-flow-node-label">Camera</span><span class="jv-flow-node-sub">timestamped jpg</span></div>
      <span class="jv-flow-arrow">→</span>
      <div class="jv-flow-node"><span class="jv-flow-node-label">Watcher</span><span class="jv-flow-node-sub">inotify</span></div>
      <span class="jv-flow-arrow">→</span>
      <div class="jv-flow-node active"><span class="jv-flow-node-label">SAM3</span><span class="jv-flow-node-sub">boxes · masks</span></div>
      <span class="jv-flow-arrow">→</span>
      <div class="jv-flow-node"><span class="jv-flow-node-label">Monitor</span><span class="jv-flow-node-sub">vs. baseline</span></div>
      <span class="jv-flow-arrow">→</span>
      <div class="jv-flow-node"><span class="jv-flow-node-label">State + Log</span><span class="jv-flow-node-sub">JSON events</span></div>
    </div>
    <div class="ocs__callout">
      <span>If SAM3 fails, monitoring is skipped.</span>
    </div>
  </section>

  <h2 class="ocs__section-title">Object State Tracking</h2>
  <section class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart LR
    D["Detection"] --> M{"Matches a<br/>tracked object?"}
    M -->|yes| P["PRESENT"]
    M -->|no| N["NEW<br/>assign ID"]
    N --> P
    P -->|not seen| C["Missing 1/2"]
    C -->|seen again| P
    C -->|not seen| X["MISSING"]
    X -->|seen again| R["RETURNED"]
    R --> P</pre>
    </div>
    <div class="ocs__callout">
      <span>People are counted only, never assigned IDs.</span>
    </div>
  </section>

  <h2 class="ocs__section-title">Milestones</h2>
  <section class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart TD
    A["Setup<br/>Ubuntu + BRIO capture"] --> B["Sept<br/>SAM3 integrated + manifests"]
    B --> C["Sept 24<br/>Multi-object test"]
    C --> D["Late Sept<br/>Persistent inventory"]
    D --> E["Sept 28<br/>Duplicate suppression"]
    E --> F["Oct 5<br/>Baseline + added-chair tests"]
    F --> G["Oct<br/>Auto monitoring + camera debug"]
    G --> H["Oct 25<br/>Release checkpoint"]</pre>
    </div>
  </section>

  <h2 class="ocs__section-title">Test Results</h2>
  <section class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Test</th><th>Input</th><th>Result</th><th></th></tr></thead>
        <tbody>
          <tr><td>Multi-object</td><td>Classroom image</td><td>Bottles, chairs, laptops, tables, screens</td><td><span class="ocs__status-pill ocs__status-pill--good">PASS</span></td></tr>
          <tr><td>Deduplication</td><td>3 overlapping boxes</td><td>6 people = visual count</td><td><span class="ocs__status-pill ocs__status-pill--good">PASS</span></td></tr>
          <tr><td>Scene change</td><td>Camera reframed</td><td>False new / missing</td><td><span class="ocs__status-pill ocs__status-pill--warn">RESET</span></td></tr>
          <tr><td>Added chair</td><td>+1 chair</td><td>2 new IDs</td><td><span class="ocs__status-pill ocs__status-pill--bad">FAIL</span></td></tr>
        </tbody>
      </table>
    </div>
    <pre class="jv-log">Removed 4 duplicate detection(s).
People detected: 5
chair_1 … chair_4   PRESENT
monitor_1, monitor_2 PRESENT
laptop_3            not detected (1/2)
NEW OBJECT DETECTED: chair_5
NEW OBJECT DETECTED: chair_6   ← should be one chair</pre>
    <div class="jv-figure-grid">
      <figure class="jv-figure">
        <img src="/images/capstone/jarvis-progress/sam3-dashboard.png" alt="Jarvis dashboard showing SAM3 person overlays on the latest frame and a grid of recent captures">
        <figcaption>SAM3 overlay on latest frame + recent captures</figcaption>
      </figure>
      <figure class="jv-figure">
        <img src="/images/capstone/jarvis-progress/captain-log.png" alt="Captain Log screen recording video and audio of a student saying Hey Jarvis end log">
        <figcaption>Captain Log: voice-started video + audio, ended with "Hey Jarvis … end log"</figcaption>
      </figure>
    </div>
  </section>

  <h2 class="ocs__section-title">Depth Detection</h2>
  <section class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart LR
    S["SAM3 overlay<br/>object masks"] --> D["Depth model"]
    D --> O["Distance from<br/>camera per object"]
    D -.-> P["Low accuracy<br/>no reference point"]
    P -.-> A["Try other<br/>depth models"]
    P -.-> B["Two cameras<br/>stereo depth"]</pre>
    </div>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Piece</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>SAM3 overlay → distance</td><td><span class="ocs__status-pill ocs__status-pill--good">WORKING</span></td></tr>
          <tr><td>Distance accuracy</td><td><span class="ocs__status-pill ocs__status-pill--bad">INACCURATE</span></td></tr>
          <tr><td>Alternative depth models</td><td><span class="ocs__status-pill ocs__status-pill--warn">TESTING</span></td></tr>
          <tr><td>Two-camera stereo depth</td><td><span class="ocs__status-pill ocs__status-pill--neutral">EXPLORING</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <h2 class="ocs__section-title">Hand Gesture Recognition</h2>
  <section class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">flowchart LR
    C["Camera"] --> H["Hand tracking"]
    H --> F["Fist"]
    H --> O["Open hand"]
    H --> M["Hand height<br/>high vs low"]
    F --> V["Volume control<br/>working"]
    O --> V
    M --> V
    V -.-> N["More controls<br/>planned"]</pre>
    </div>
    <div class="jv-decision-grid">
      <div class="jv-decision-card"><span class="jv-decision-title">Fist / Open</span><span class="ocs__status-pill ocs__status-pill--good">DETECTED</span></div>
      <div class="jv-decision-card"><span class="jv-decision-title">High vs. Low</span><span class="ocs__status-pill ocs__status-pill--good">DETECTED</span></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Volume</span><span class="ocs__status-pill ocs__status-pill--good">CONTROLLED</span></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Other Controls</span><span class="ocs__status-pill ocs__status-pill--neutral">NEXT</span></div>
    </div>
  </section>

  <h2 class="ocs__section-title">Challenges</h2>
  <section class="ocs__card">
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Problem</th><th>Fix</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Duplicate boxes</td><td>IoU + containment filter</td><td><span class="ocs__status-pill ocs__status-pill--good">IMPROVED</span></td></tr>
          <tr><td>Unstable matching</td><td>Saved regions of interest</td><td><span class="ocs__status-pill ocs__status-pill--warn">INVESTIGATING</span></td></tr>
          <tr><td>False new objects</td><td>Multi-frame confirmation</td><td><span class="ocs__status-pill ocs__status-pill--bad">NEEDS WORK</span></td></tr>
          <tr><td>Missed detections</td><td>2-frame missing threshold</td><td><span class="ocs__status-pill ocs__status-pill--warn">VALIDATING</span></td></tr>
          <tr><td>Slow inference</td><td>Keep model loaded</td><td><span class="ocs__status-pill ocs__status-pill--neutral">PLANNED</span></td></tr>
          <tr><td>Camera timeouts</td><td>Video4Linux diagnostics</td><td><span class="ocs__status-pill ocs__status-pill--warn">INTERMITTENT</span></td></tr>
          <tr><td>Room layout changes</td><td>Manual baseline reset</td><td><span class="ocs__status-pill ocs__status-pill--good">SUPPORTED</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <h2 class="ocs__section-title">Tech Stack</h2>
  <section class="ocs__card">
    <div class="jv-decision-grid">
      <div class="jv-decision-card"><span class="jv-decision-title">Python</span><p class="jv-decision-why">Inference, tracking, logging</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Meta SAM3</span><p class="jv-decision-why">Prompted segmentation</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Ubuntu + Bash</span><p class="jv-decision-why">Scripts + file watching</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">JSON</span><p class="jv-decision-why">Manifests, state, events</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Video4Linux</span><p class="jv-decision-why">Camera diagnostics</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Git + GitHub</span><p class="jv-decision-why">Version control + docs</p></div>
    </div>
  </section>

  <h2 class="ocs__section-title">Next Priorities</h2>
  <section class="ocs__card">
    <ul class="ocs__checklist">
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Improve object matching (distance, overlap, movement thresholds)</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Confirm new objects across multiple frames before alerting</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Keep SAM3 loaded between images</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Controlled test: add → remove → return one object</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Surface monitoring events through Jarvis alerts</span></li>
      <li class="open"><span class="ocs__checklist-box" aria-hidden="true"></span><span>Add screenshots, test cases, and timing results</span></li>
    </ul>
  </section>

  <h2 class="ocs__section-title">Next Release Checkpoint</h2>
  <section class="ocs__card">
    <div class="jv-flow">
      <div class="jv-flow-node"><span class="jv-flow-node-label">Frontend</span></div>
      <div class="jv-flow-node"><span class="jv-flow-node-label">Scene Detection</span></div>
      <div class="jv-flow-node"><span class="jv-flow-node-label">Backend</span></div>
      <div class="jv-flow-node"><span class="jv-flow-node-label">RFID Presence</span></div>
      <span class="jv-flow-arrow">→</span>
      <div class="jv-flow-node active"><span class="jv-flow-node-label">Oct 25, 2026</span><span class="jv-flow-node-sub">target, not done</span></div>
    </div>
    <nav class="ocs__links" aria-label="Release plan">
      <a href="/capstone/jarvis/future-plans/" class="ocs__btn accent fill">View Future Plans</a>
    </nav>
  </section>

  <h2 class="ocs__section-title">Lessons Learned</h2>
  <section class="ocs__card">
    <div class="jv-decision-grid">
      <div class="jv-decision-card"><span class="jv-decision-title">Detection ≠ tracking</span><p class="jv-decision-why">Same chair across frames is the hard part</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Fixed camera matters</span><p class="jv-decision-why">Reframing breaks the baseline</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Split hardware vs. software</span><p class="jv-decision-why">Same symptom, different fix</p></div>
      <div class="jv-decision-card"><span class="jv-decision-title">Testable over feature-rich</span><p class="jv-decision-why">Reliable before alerting</p></div>
    </div>
  </section>

  <h2 class="ocs__section-title">Summary</h2>
  <section class="ocs__card">
    <ul>
      <li>Capture → SAM3 → monitoring pipeline runs automatically end to end.</li>
      <li>Detection works; consistent tracking of the same object across frames is the main gap.</li>
      <li>Dedup fixed overlapping boxes, but the added-chair test still registers false new objects.</li>
      <li>Depth estimation runs on SAM3 overlays but needs a reference point; testing other models and two-camera stereo.</li>
      <li>Hand gestures (fist, open, high/low) already control volume; more controls next.</li>
      <li>Next: stronger matching, multi-frame confirmation, and faster inference.</li>
      <li>Oct 25 checkpoint targets frontend, backend, and RFID presence integration.</li>
    </ul>
  </section>

  {% include jarvis-footer.html %}

</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
