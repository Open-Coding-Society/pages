---
microblog: true
toc: false
layout: post
title: RFID Presence, Phase 4, Full Room-Scale Presence
description: The target state, with front and back door UHF detection, full RFID and camera correlation, and the complete presence-state machine running live.
permalink: /capstone/rfid-presence/phases/phase-4/
year: "2026-2027"
rp_active: phases
---

{% assign data = site.data.rfid_presence_infograph %}
<div class="rfid-presence-infograph">
  <a href="/capstone/rfid-presence/phases/" class="ocs__phase-crumb">&larr; All Phases</a>
  <div class="rfid-presence-header"><div class="ocs__badge">Phase 4 of 4</div><h1 class="rfid-presence-title">Full Room-Scale Contactless Presence</h1><p class="ocs__description">The target state: front- and back-door UHF detection that distinguishes entry side, full RFID and camera correlation, and the complete presence-state machine running live in the trial classroom.</p><div class="ocs__status">Draft, Most Advanced</div></div>
  {% include rfid-presence-nav.html %}
  <div class="ocs__card"><h3 class="ocs__section-title">Target Architecture</h3><div class="ocs__diagram"><pre class="mermaid">flowchart TD
	FD["Front door
UHF reader"] --> CORR
	BD["Back door
UHF reader"] --> CORR
	CAM["Camera system
identity"] --> CORR
	BS["Bell schedule
attendance window"] -.-> CORR
	CP["Per-period
expected enrollment"] -.-> CORR
	CORR["Correlation Engine"] --> PRES["Full presence-state model
present, tardy, stepped out,
left early, opted out, tamper"]</pre></div></div>
  <div class="ocs__card"><h3 class="ocs__section-title">What's Being Built</h3><ul class="ocs__entity-list"><li><strong>Doors</strong>: front and back UHF readers, positioned to distinguish entry side</li><li><strong>Coverage</strong>: higher-gain or multiple antennas, sized for the full 60&times;40 ft trial room</li><li><strong>Packaging</strong>: a real enclosure plan for whole-room hardware</li><li><strong>Correlation engine</strong>: live, running the full presence-state model</li><li><strong>Enforcement</strong>: per-period expected enrollment and bell-schedule-bound attendance windows in production</li></ul><div class="ocs__callout">All acceptance and test cases from the <a href="/capstone/rfid-presence/technical/">Technical Detail</a> page get validated live in this phase.</div></div>
  <div class="ocs__card"><h3 class="ocs__section-title">Acceptance Criteria</h3><ul class="rfid-presence-checklist"><li class="open"><span class="rfid-presence-box"></span><span>Front and back door UHF readers, positioned to distinguish entry side, sized for the full 60 by 40 foot trial room</span></li><li class="open"><span class="rfid-presence-box"></span><span>Higher-gain or multiple antennas and a real packaging and enclosure plan for whole-room coverage</span></li><li class="open"><span class="rfid-presence-box"></span><span>A live correlation engine running the full presence-state model: present, tardy, stepped out, left early, opted out, tamper, and so on</span></li><li class="open"><span class="rfid-presence-box"></span><span>Per-period expected enrollment and bell-schedule-bound attendance windows enforced in production</span></li><li class="open"><span class="rfid-presence-box"></span><span>All acceptance and test cases from the <a href="/capstone/rfid-presence/technical/">Technical Detail</a> page validated in the live room</span></li></ul></div>
  <div class="ocs__pager"><a href="/capstone/rfid-presence/phases/phase-3/" class="ocs__pager-link">&larr; Phase 3: UHF Doorway Transition</a><span></span></div>
  <div class="ocs__card"><div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>{% if data.Repo %}<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}</div>
</div>
