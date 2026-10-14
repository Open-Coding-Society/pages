---
toc: false
layout: post
title: Classroom Presence System, How It Works
description: How one RFID tap travels from the reader to the teacher's dashboard.
permalink: /capstone/presence-system/pipeline/
year: "2026-2027"
rp_active: pipeline
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">How It Works</div>
    <h1 class="rfid-presence-title">From tap to dashboard</h1>
    <p class="ocs__description">One tap on the reader shows up on the teacher's dashboard in about 2 seconds.</p>
  </div>

  {% include presence-system-nav.html %}

<div class="ocs__card">
    <div class="ocs__diagram">
    <pre class="mermaid">%%{init: { "flowchart": { "htmlLabels": false, "diagramPadding": 16 } } }%%
flowchart LR
    T(["Student taps laptop tag"]) --> C["CrowPi
RFID reader"]
    C -- "tap + time" --> F[("Flask API
+ database")]
    D["Live dashboard
OCS Pages"] -- "status every 2s" --> F
    M["Jarvis camera
Mac Mini"] -. "next: face check" .-> F
    classDef next stroke-dasharray: 6 4
    class M next
</pre>
    </div>
    <p class="ocs__description">Architecture: solid lines run today; the dashed camera path is next.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__diagram">
      <pre class="mermaid">sequenceDiagram
    participant S as Student
    participant C as CrowPi
    participant F as Flask
    participant DB as Database
    participant D as Dashboard
    S->>C: Taps laptop tag
    C->>F: POST tap (card ID, time)
    Note over F: presence-event handler
    F->>DB: Save as ENTER in this period
    F-->>C: accepted
    loop every 2 seconds
        D->>F: GET classroom status
        F->>DB: Read this period's taps
        F-->>D: PRESENT or TARDY
    end
</pre>
    </div>
    <p class="ocs__description">One tap, step by step: the reader posts the tap, Flask saves it, and the dashboard asks for status every 2 seconds.</p>
  </div>

  <div class="ocs__card">
    <div class="ocs__grid ocs__grid--standard cols-3">
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/crowpi.jpg" alt="The CrowPi tap station: a Raspberry Pi board in a case with a screen, RFID pad at the bottom left">
        <p class="ocs__description">Tap station: RFID pad at bottom left.</p>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/dashboard-before-tap.png" alt="Dashboard with a demo period running and every student marked Not Yet Arrived">
        <p class="ocs__description">Before: period running, nobody has tapped.</p>
      </div>
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/dashboard-after-tap.png" alt="Dashboard two seconds after a tap, with Vibha marked Present">
        <p class="ocs__description">After: one tap, shown as Present.</p>
      </div>
    </div>
  </div>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
