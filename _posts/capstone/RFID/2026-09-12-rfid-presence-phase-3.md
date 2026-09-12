---
microblog: true
toc: false
layout: post
title: RFID Presence, Phase 3, UHF Doorway Transition
description: Moving from a tap pad to contactless UHF doorway detection at a single-door test rig, with laptop-mounted tags and the start of camera integration.
permalink: /capstone/rfid-presence/phases/phase-3/
year: "2026-2027"
rp_active: phases
---
<div class="rfid-presence-infograph">
<a href="/capstone/rfid-presence/phases/" class="ocs__phase-crumb">&#8592; All Phases</a>
<div class="rfid-presence-header">
  <div class="ocs__badge">Phase 3 of 4</div>
  <h1 class="rfid-presence-title">UHF Doorway Transition, Single Door, Contactless</h1>
  <p class="ocs__description">Swap the tap pad for the harder problem: reading tags at a distance, without a deliberate scan action. This is the door-table validation rig: one door, UHF range, tags mounted on laptops instead of held to a pad.</p>
  <div class="ocs__status">Draft</div>
</div>{% include rfid-presence-nav.html %}
<div class="ocs__card">
  <h3 class="ocs__section-title">The Door-Table Rig</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">
flowchart LR
                L["Laptop with
tamper-evident UHF tag"] --&gt; DR["Student walks
past the door"]
                DR --&gt; RD["UHF Pi HAT + antenna
2-4m read range"]
                RD --&gt; LOG["Read logged,
no tap required"]
                LOG -.contract being defined.-&gt; CAM["Camera system
integration"]
</pre>
  </div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">What's Being Built</h3>
  <ul class="ocs__entity-list">
    <li>
    <strong>Reader</strong>: UHF Pi HAT and antenna on a single door-table rig</li>
    <li>
    <strong>Tags</strong>: tamper-evident, on-metal or long-range UHF, mounted on laptops</li>
    <li>
    <strong>Range</strong>: validate 2 to 4 meter read and orientation behavior in the real trial room</li>
    <li>
    <strong>Tag lifecycle</strong>: active, tampered or lost, reissued or retired</li>
    <li>
    <strong>Camera contract</strong>: define the Camera Events interface with the face-scanning system</li>
  </ul>
  <div class="ocs__callout">See
  <a href="/capstone/rfid-presence/funding/">Funding</a> for the UHF hardware bill of materials.</div>
</div>
<div class="ocs__card">
  <h3 class="ocs__section-title">Acceptance Criteria</h3>
  <ul class="ocs__checklist">
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Deploy the UHF Pi HAT and antenna on a single door-table rig</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Switch to tamper-evident, on-metal or long-range UHF tags mounted on laptops</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Validate 2 to 4 meter read range and orientation behavior in the real trial room</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Investigate the bag-orientation problem, where a tag sits inside a closed backpack; see
      <a href="/capstone/rfid-presence/summary/">Project Summary</a></span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Introduce the tag lifecycle: active, tampered or lost, reissued or retired</span>
    </li>
    <li class="open">
      <span class="ocs__checklist-box"></span>
      <span>Begin camera-system integration by defining the Camera Events contract with the face-scanning system</span>
    </li>
  </ul>
</div>
<div class="ocs__pager">
  <a href="/capstone/rfid-presence/phases/phase-2/" class="ocs__pager-link">&#8592; Phase 2: Classroom Pilot</a>
  <a href="/capstone/rfid-presence/phases/phase-4/" class="ocs__pager-link next">Next: Phase 4, Full Room-Scale Presence &#8594;</a>
</div>
<div class="ocs__card">
<div class="ocs__team">
  <span class="ocs__team-label">Project Team</span>
  <span class="ocs__team-name">{{ data.Team | join: ", " }}</span>
</div>{% if data.Repo %}
<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}</div></div>
