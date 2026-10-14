---
microblog: true
toc: false
layout: post
title: Classroom Presence System Capstone
description: A low-cost, tap-free system that detects student entrance, presence, and exit.
permalink: /capstone/presence-system/
sticky_rank: 1
year: "2026-2027"
rp_active: hub
---

<!-- markdownlint-disable MD033 MD010 MD012 -->
{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Overview</div>
    <h1 class="rfid-presence-title">{{ data.Title }}</h1>
    <p class="ocs__description">A low-cost, tap-free system that detects student entrance, presence, and exit.</p>
  </div>

  {% include presence-system-nav.html %}

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-hero.svg" alt="A student taps the RFID tag on their laptop on the CrowPi reader by the classroom door. Flask logs the tap and the dashboard shows the student as present. A wall camera, drawn dashed, is the next step.">
    <p class="ocs__description">How it works today: tap the laptop tag, and the teacher's dashboard updates in about 2 seconds.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-problem.svg" alt="One 66-minute class period. The student arrives 12 minutes late and is out for 17 minutes mid-class, but roll call still records Present.">
    <p class="ocs__description">The problem: roll call says Present, but this student missed 29 of 66 minutes.</p>
  </div>

  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">The Idea</h3>
      <p class="rfid-presence-about">{{ data.Description }}</p>
    </div>
    <div class="ocs__card"><h3 class="ocs__section-title">Overview</h3><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><tbody><tr><td>The Problem</td><td>Roll call is a snapshot. It misses lost minutes, tardiness, restroom breaks, counseling visits, and early departures all flatten into one present/absent mark, and it costs teacher time every period.</td></tr><tr><td>Background</td><td>Time leaks in minutes, not just in whether a student showed up at all. Prior classroom-attendance studies (see <a href="/capstone/presence-system/summary/">Research</a>) mostly check recognition at the door; few measure minutes-in-room against a real ground truth.</td></tr><tr><td>Research Question</td><td><strong>Can classroom presence be measured with zero teacher effort?</strong> Design-based research, pragmatic mixed methods. The technology, RFID tap, QR, or face, is a variable under test, not the product.</td></tr><tr><td>Current Phase</td><td>Cycle&nbsp;0 of the research design below is done: an RFID tap reliably reaches OCS. See <a href="/capstone/presence-system/phases/">Roadmap</a> for the build roadmap, the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> for the full hypotheses and cycle plan, and the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a> for live task tracking across all three inputs.</td></tr></tbody></table></div></div>
    <div class="ocs__card"><h3 class="ocs__section-title">Team &amp; Workstreams</h3><p class="rfid-presence-about">Three inputs are evaluated in parallel against the same presence engine, one owner each.</p><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Input</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>RFID tap</td><td>Vibha Mandayam</td><td>Working prototype, <a href="https://github.com/vibha1019/crowpi-attendance/issues/6" target="_blank" rel="noopener">tracked in #6</a></td></tr><tr><td>QR scan</td><td>Ruta Sirdeshmukh</td><td>Not started, <a href="https://github.com/vibha1019/crowpi-attendance/issues/7" target="_blank" rel="noopener">tracked in #7</a></td></tr><tr><td>Face scan</td><td>Kush Shah</td><td>Existing system, integration pending, <a href="https://github.com/vibha1019/crowpi-attendance/issues/8" target="_blank" rel="noopener">tracked in #8</a></td></tr></tbody></table></div></div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
