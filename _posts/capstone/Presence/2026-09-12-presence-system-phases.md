---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Development Phases
description: The four-phase roadmap from a contact-tap RFID prototype to fully contactless, room-scale presence detection.
permalink: /capstone/presence-system/phases/
year: "2026-2027"
rp_active: phases
---

{% assign data = site.data.presence_system_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph"><div class="rfid-presence-header"><div class="ocs__badge">Development Phases</div><h1 class="rfid-presence-title">From Contact-Tap Prototype to Contactless Presence</h1><p class="ocs__description">The hardest part of this project, antennas that reliably detect presence without a tap, is deliberately last. The build is staged so each phase produces something usable and testable on its own.</p></div>{% include presence-system-nav.html %}<div class="ocs__card"><p class="rfid-presence-about"><strong>Phase 1 reflects the current working prototype.</strong> This is a hardware rollout roadmap, a different axis from the research cycles in the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>. See <a href="/capstone/presence-system/iterations/">Iterations</a> for how the project's framing itself changed.</p></div><div class="ocs__card"><h3 class="ocs__section-title">Roadmap</h3><div class="ocs__diagram"><pre class="mermaid">flowchart LR
	P1["Phase 1
Contact-Tap Prototype
current"] -.paused, see below.-> LATER["Later, if data
supports it:
UHF, room-scale"]</pre></div></div><div class="ocs__card"><h3 class="ocs__section-title">Explore Each Phase</h3><div class="ocs__hub-grid"><a href="/capstone/presence-system/phases/phase-1/" class="ocs__hub-card"><span class="rfid-presence-pill rfid-presence-pill-good">Current, Working</span><span class="ocs__hub-card-title">Phase 1: Contact-Tap Prototype</span><p>A CrowPi board, one scan pad, and a Flask + SQLite backend proving the core read-log-display loop.</p></a></div></div><div class="ocs__card"><h3 class="ocs__section-title">Later, If Data Supports It</h3><p class="rfid-presence-about">The <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> explicitly pauses this hardware work until the research cycles show which input is actually worth deepening: "None of it answers a research question until data shows RFID is the right input." Kept here as a condensed record of the plan, not an active workstream.</p><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Stage</th><th>What it was</th></tr></thead><tbody><tr><td>Classroom pilot</td><td>Hardening the tap system for a real class period: a deck of RFID-stickered playing cards (one per student), a production backend and admin dashboard, real auth, off SQLite.</td></tr><tr><td>UHF doorway transition</td><td>Swap the tap pad for contactless UHF reads at a single door-table rig, tags mounted on laptops instead of tapped, and the start of a Camera Events contract with the face-scanning system.</td></tr><tr><td>Full room-scale presence</td><td>Front and back door UHF detection, full RFID and camera correlation, the complete presence-state machine (present, tardy, stepped out, left early, opted out, tamper) running live in the trial room.</td></tr></tbody></table></div></div><div class="ocs__card"><div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div><div class="ocs__status">Phase 1, Working Prototype</div>{% if data.Repo %}<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}</div></div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
