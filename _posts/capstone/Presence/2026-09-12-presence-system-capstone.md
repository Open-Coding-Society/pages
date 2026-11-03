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
    <h2 class="ocs__section-title">Executive Pitch</h2>
    <p class="ocs__description">Our pitch covering the problem, solution, implementation, the $700 pilot funding, and future directions.</p>
    <div class="rfid-presence-embed">
      <iframe src="https://docs.google.com/presentation/d/1hTkLhppCcGVm9slWL8fWRGJrmDMqWWVMC8GMk5D7l_Q/embed?start=false&amp;loop=false" title="Classroom Presence System executive pitch slides" loading="lazy" allowfullscreen></iframe>
    </div>
    <a class="ocs__btn pill" href="https://docs.google.com/presentation/d/1hTkLhppCcGVm9slWL8fWRGJrmDMqWWVMC8GMk5D7l_Q/edit" target="_blank" rel="noopener">Open the slides</a>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/presence-setup.svg" alt="The prototype tap station on a desk: a monitor showing the Live Dashboard with Vibha marked Present and a camera match, a webcam on top of the monitor, a Mac Mini that runs the camera check, a Raspberry Pi keyboard and mouse, a Raspberry Pi 4 with a PN532 NFC reader, and a row of labeled RFID cards.">
    <p class="ocs__description">Fig. 1: The prototype tap station. A card tap on the Raspberry Pi 4 and PN532 reader reaches OCS, the webcam and Mac Mini cross-check the face, and the Live Dashboard updates in about 2 seconds.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/presence-installed.svg" alt="The classroom corner with the system installed: a UHF RFID reader panel at chest height beside the door with a read zone across the doorway, and a camera on a short arm above the large dark poster on the back wall, aimed across the room at the door. The back wall has a desk counter with monitors, laptops and navy chairs.">
    <p class="ocs__description">Fig. 2: Planned installation of UHF RFID reader and wall-mounted camera at the classroom entrance. The reader detects tags automatically as students walk in, so nobody taps, and the camera on the back wall faces them as they enter.</p>
  </div>

<div class="ocs__card">
    <img class="ocs__image-frame" src="{{ site.baseurl }}/images/presence-system/pipeline-problem.svg" alt="One 66-minute class period. The student arrives 12 minutes late and is out for 17 minutes mid-class, but roll call still records Present.">
    <p class="ocs__description">Fig. 3: The problem. Roll call says Present, but this student missed 29 of 66 minutes.</p>
  </div>

<div class="ocs__card">
    <div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table">
      <thead><tr><th>If attendance takes 10 minutes...</th><th>Per school year (180 days)</th><th>That is about</th></tr></thead>
      <tbody>
        <tr><td>per school day, in total</td><td>10 min &times; 180 = 1,800 min = <strong>30 hours</strong></td><td>5 full school days (at about 6 instructional hours a day)</td></tr>
        <tr><td>per class period</td><td><strong>30 hours</strong> for that one class alone</td><td>about 18% of a 55-minute period, or roughly 33 class periods a year</td></tr>
      </tbody>
    </table></div>
    <p class="ocs__description">Why it matters: manual attendance can cost the equivalent of a full week of school per year. The 10 minutes is an assumption we will measure by timing attendance in real classes and from the teacher survey.</p>
  </div>

  <details>
    <summary>Talking points and details</summary>

    <div class="ocs__card">
      <h3 class="ocs__section-title">The Idea</h3>
      <p class="rfid-presence-about">{{ data.Description }}</p>
    </div>
    <div class="ocs__card"><h3 class="ocs__section-title">Overview</h3><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><tbody><tr><td>The Problem</td><td>Roll call is a snapshot. It misses lost minutes, tardiness, restroom breaks, counseling visits, and early departures all flatten into one present/absent mark, and it costs teacher time every period.</td></tr><tr><td>Background</td><td>Time leaks in minutes, not just in whether a student showed up at all. Prior classroom-attendance studies (see <a href="/capstone/presence-system/summary/">Research</a>) mostly check recognition at the door; few measure minutes-in-room against a real ground truth.</td></tr><tr><td>Research Question</td><td><strong>Can classroom presence be measured with very low teacher effort?</strong> Design-based research, pragmatic mixed methods. The technology, RFID tap, QR, or face, is a variable under test, not the product.</td></tr><tr><td>Current Phase</td><td>Cycle&nbsp;0 of the research design below is done: an RFID tap reliably reaches OCS. See <a href="/capstone/presence-system/phases/">Roadmap</a> for the build roadmap, the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> for the full hypotheses and cycle plan, and the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a> for live task tracking across all three inputs.</td></tr></tbody></table></div></div>
    <div class="ocs__card"><h3 class="ocs__section-title">Team &amp; Workstreams</h3><p class="rfid-presence-about">Three inputs are evaluated in parallel against the same presence engine, one owner each.</p><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Input</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>RFID tap</td><td>Vibha Mandayam</td><td>Working prototype, <a href="https://github.com/vibha1019/crowpi-attendance/issues/6" target="_blank" rel="noopener">tracked in #6</a></td></tr><tr><td>QR scan</td><td>Ruta Sirdeshmukh</td><td>Not started, <a href="https://github.com/vibha1019/crowpi-attendance/issues/7" target="_blank" rel="noopener">tracked in #7</a></td></tr><tr><td>Face scan</td><td>Kush Shah</td><td>Existing system, integration pending, <a href="https://github.com/vibha1019/crowpi-attendance/issues/8" target="_blank" rel="noopener">tracked in #8</a></td></tr></tbody></table></div></div>
  </details>

  {% include presence-system-pager.html %}

  {% include presence-system-team.html %}
</div>
