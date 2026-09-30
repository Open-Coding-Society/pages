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

{% assign data = site.data.presence_system_infograph %}
<div class="rfid-presence-infograph">
	<div class="rfid-presence-header"><div class="ocs__badge">Design-Based Research Capstone</div><h1 class="rfid-presence-title">{{ data.Title }}</h1><p class="ocs__description">{{ data.Description }}</p></div>
	{% include presence-system-nav.html %}
	<div class="ocs__card"><h3 class="ocs__section-title">Overview</h3><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><tbody><tr><td>The Problem</td><td>Roll call is a snapshot. It misses lost minutes, tardiness, restroom breaks, counseling visits, and early departures all flatten into one present/absent mark, and it costs teacher time every period.</td></tr><tr><td>Background</td><td>Time leaks in minutes, not just in whether a student showed up at all. Prior classroom-attendance studies (see <a href="/capstone/presence-system/summary/">Project Summary</a>) mostly check recognition at the door; few measure minutes-in-room against a real ground truth.</td></tr><tr><td>Research Question</td><td><strong>Can classroom presence be measured with zero teacher effort?</strong> Design-based research, pragmatic mixed methods. The technology, RFID tap, QR, or face, is a variable under test, not the product.</td></tr><tr><td>Current Phase</td><td>Cycle&nbsp;0 of the research design below is done: an RFID tap reliably reaches OCS. See <a href="/capstone/presence-system/phases/">Phases</a> for the build roadmap, the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a> for the full hypotheses and cycle plan, and the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a> for live task tracking across all three inputs.</td></tr></tbody></table></div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">Team &amp; Workstreams</h3><p class="rfid-presence-about">Three inputs are evaluated in parallel against the same presence engine, one owner each.</p><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Input</th><th>Owner</th><th>Status</th></tr></thead><tbody><tr><td>RFID tap</td><td>Vibha Mandayam</td><td>Working prototype, <a href="https://github.com/vibha1019/crowpi-attendance/issues/6" target="_blank" rel="noopener">tracked in #6</a></td></tr><tr><td>QR scan</td><td>Ruta Sirdeshmukh</td><td>Not started, <a href="https://github.com/vibha1019/crowpi-attendance/issues/7" target="_blank" rel="noopener">tracked in #7</a></td></tr><tr><td>Face scan</td><td>Kush Shah</td><td>Existing system, integration pending, <a href="https://github.com/vibha1019/crowpi-attendance/issues/8" target="_blank" rel="noopener">tracked in #8</a></td></tr></tbody></table></div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">Research Question &amp; Hypotheses</h3><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><thead><tr><th>Hypothesis</th><th>Claim</th><th>Sanity check</th></tr></thead><tbody><tr><td>H1</td><td>Presence accuracy at least as good as roll call</td><td>Low-risk claim, roll call's own bar is low.</td></tr><tr><td>H2</td><td>Minutes within 2 min of ground truth per period</td><td>Genuinely tight for a tap mechanism: accuracy depends on when a student remembers to tap, not continuous sensing. This may get rejected for contact-tap specifically, which would still be a real, useful finding.</td></tr><tr><td>H3</td><td>Zero teacher attendance actions</td><td>Needs a precise operational definition, does one-time tag registration count, or only ongoing per-period actions? As built today, periods are still admin-managed, so this would fail under a strict reading.</td></tr><tr><td>H4</td><td>A combination of inputs beats any single input</td><td>Supported by the sensor-fusion literature already cited, but a poorly correlated combination can introduce more failure points than either signal alone. Testing this, not assuming it.</td></tr></tbody></table></div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">Design-Based Research Cycles</h3><p class="rfid-presence-about">Each cycle: question, build, test, analyze, reflect, repeat if it fails.</p><div class="ocs__diagram"><pre class="mermaid">flowchart LR
		C0["Cycle 0, done
RFID reader to OCS
Tested: can a tap reach OCS?
Issue #3"] --> C1["Cycle 1, tests H2
Input-agnostic API, roster, minutes
Measure roll call baseline
minutes correct?"]
		C1 --> C2["Cycle 2, tests H3
Who's missing view and report
Short class trial, RFID only
teacher does nothing?"]
		C2 --> C3["Cycle 3, tests H4
Add QR or face to same API
Side by side with RFID
which input wins?"]
		C3 --> C4["Cycle 4, tests H1 + main
Classroom pilot
2 to 4 weeks, one class
H1 to H4 decided"]</pre></div><div class="ocs__callout">Cycle 1 requires an input-agnostic API. What's built today (<a href="/capstone/presence-system/technical/">Technical Detail</a>) is explicitly RFID-shaped, an <code>/api/rfid/scan</code> endpoint and an <code>RfidTag</code> model in OCS. That needs generalizing to a generic presence-event API before QR or face can plug into the same pipeline in Cycle 3. Flagged now so it's planned rather than discovered mid-cycle.</div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">The Intervention Being Tested</h3><div class="ocs__diagram"><pre class="mermaid">flowchart LR
		RFID["RFID tap"] --> API[One Event API
student, room, time, direction]
		QR["QR scan"] --> API
		FACE["Face scan"] --> API
		API --> ENGINE[Presence Engine
+ bell schedule + roster]
		ENGINE --> MISSING["Who's missing now"]
		ENGINE --> MINUTES["Minutes report"]</pre></div><p class="rfid-presence-about">RFID tap, QR scan, and face scan are the independent variable. Who's missing now and the minutes report are the dependent variables, measured against ground truth below.</p></div>
	<div class="ocs__card"><h3 class="ocs__section-title">Evaluating Against Ground Truth</h3><div class="rfid-presence-table-wrap"><table class="ocs__table rfid-presence-table"><tbody><tr><td>Ground Truth</td><td>A student observer hand-logs every entry and exit; a second observer checks them, a standard dual-rater design.</td></tr><tr><td>Measures</td><td>Agreement rate, minutes error, teacher actions per period, missed and false events per input, teacher and student survey.</td></tr><tr><td>Findings</td><td>Each hypothesis is accepted or rejected, with limitations and design lessons carried back into OCS, not just a pass/fail on RFID.</td></tr></tbody></table></div><div class="ocs__callout">The hand-logging ground truth is new data collection beyond what the existing privacy and governance decisions (<a href="/capstone/presence-system/summary/">Project Summary</a>) currently cover, opt-in face scanning and team's-own-data-only testing. It needs its own consent treatment before the Cycle&nbsp;4 classroom pilot runs, not an assumption that it's already covered.</div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">RFID + Camera Target Architecture</h3><p class="rfid-presence-about">This is the correlation design for the RFID and camera tracks specifically, the most-developed of the three inputs. QR follows the same event API once it's generalized in Cycle 1.</p><div class="ocs__diagram"><pre class="mermaid">flowchart TD
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
		CORR --> PRES[Attendance / Presence State]</pre></div><div class="ocs__callout">This is the target architecture the team is building toward across four phases; the current prototype implements the leftmost slice of it. Full detail, including the presence-state machine and data model, is on the <a href="/capstone/presence-system/technical/">Technical Detail</a> page. Design rationale and a literature review of comparable systems, confirming this approach against prior work, is on the <a href="/capstone/presence-system/summary/">Project Summary</a> page.</div></div>
	<div class="ocs__card"><h3 class="ocs__section-title">Explore the Project</h3><div class="ocs__hub-grid"><a href="/capstone/presence-system/summary/" class="ocs__hub-card"><span class="ocs__hub-card-title">Project Summary</span><p>Design rationale, privacy and governance decisions, and how this compares to existing systems. A quick read for mentors.</p></a><a href="/capstone/presence-system/technical/" class="ocs__hub-card"><span class="ocs__hub-card-title">Technical Detail &amp; Flow</span><p>System architecture, diagrams, the presence-state machine, data model, and attendance-window logic.</p></a><a href="/capstone/presence-system/phases/" class="ocs__hub-card"><span class="ocs__hub-card-title">Development Phases</span><p>The hardware rollout roadmap: Phase 1 contact-tap prototype, done, with later contactless stages paused until the research cycles justify them.</p></a><a href="/capstone/presence-system/funding/" class="ocs__hub-card"><span class="ocs__hub-card-title">Funding &amp; Budget</span><p>Bill of materials, cost estimates, and what's being asked for at each phase.</p></a></div></div>
	<div class="ocs__card"><div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div><div class="ocs__status">Phase 1, Working Prototype</div>{% if data.Repo %}<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}</div>
</div>
