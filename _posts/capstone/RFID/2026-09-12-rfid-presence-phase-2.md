---
microblog: true
toc: false
layout: post
title: RFID Presence, Phase 2, Classroom Pilot
description: Hardening the tap-based system for a real class pilot, with a deck of RFID-stickered playing cards, one per student, plus a production backend and admin dashboard.
permalink: /capstone/rfid-presence/phases/phase-2/
year: "2026-2027"
rp_active: phases
---

{% assign data = site.data.rfid_presence_infograph %}
<div class="rfid-presence-infograph">
	<a href="/capstone/rfid-presence/phases/" class="ocs__phase-crumb">&larr; All Phases</a>
	<div class="rfid-presence-header">
		<div class="ocs__badge">Phase 2 of 4</div>
		<h1 class="rfid-presence-title">Classroom Pilot, Hardened Tap System</h1>
		<p class="ocs__description">Take the same tap-based approach from a demo to something a real class could use for a full period, still without UHF or camera correlation.</p>
		<div class="ocs__status">Draft</div>
	</div>
	{% include rfid-presence-nav.html %}
	<div class="ocs__card">
		<h3 class="ocs__section-title">The Card Format</h3>
		<p class="rfid-presence-question">Instead of a separate RFID tag on a keychain or lanyard, each student is issued one card from a standard deck of playing cards, with an RFID sticker adhered to its face. It is cheap, easy to hand out and collect at the door like dealing a hand, hard to lose track of because it is just "your card," and needs no new object type to manufacture or replace.</p>
		<div class="ocs__diagram">
			<pre class="mermaid">flowchart LR
		D["Standard deck
of playing cards"] --> ST["RFID sticker
applied to each card"]
		ST --> C["Card assigned
to one student"]
		C --> R["Tap at the
CrowPi reader"]
		R --> BE["Production backend
	roster admin UI"]</pre>
		</div>
	</div>
	<div class="ocs__card">
		<h3 class="ocs__section-title">What's Being Built</h3>
		<ul class="ocs__entity-list">
			<li><strong>Cards</strong>: standard playing-card deck, one RFID sticker per card</li>
			<li><strong>Registration</strong>: 20+ student cards, each mapped to a student</li>
			<li><strong>Frontend</strong>: production roster and admin views, replacing the rough dashboard</li>
			<li><strong>Backend</strong>: production-grade deployment, off the Flask dev server</li>
			<li><strong>Database</strong>: migrated off SQLite, with a backup strategy</li>
			<li><strong>Access control</strong>: authentication for admin functions and card registration</li>
		</ul>
		<div class="ocs__callout">See <a href="/capstone/rfid-presence/funding/">Funding</a> for the RFID sticker SKU.</div>
	</div>
	<div class="ocs__card">
		<h3 class="ocs__section-title">Acceptance Criteria</h3>
		<ul class="ocs__checklist">
			<li class="open"><span class="ocs__checklist-box"></span><span>Register at least 20 student cards: apply one RFID sticker to each playing card and assign it to a student</span></li>
			<li class="open"><span class="ocs__checklist-box"></span><span>Replace the rough dashboard with a production frontend (roster and admin views)</span></li>
			<li class="open"><span class="ocs__checklist-box"></span><span>Move off the Flask dev server to a production-grade deployment</span></li>
			<li class="open"><span class="ocs__checklist-box"></span><span>Migrate SQLite to a proper database with a backup strategy</span></li>
			<li class="open"><span class="ocs__checklist-box"></span><span>Add authentication and authorization for admin functions and a teacher-facing card registration UI</span></li>
			<li class="open"><span class="ocs__checklist-box"></span><span>Run full-period tests, not just a two-minute demo, and validate attendance states with educator feedback</span></li>
		</ul>
	</div>
	<div class="ocs__pager">
		<a href="/capstone/rfid-presence/phases/phase-1/" class="ocs__pager-link">&larr; Phase 1: Contact-Tap Prototype</a>
		<a href="/capstone/rfid-presence/phases/phase-3/" class="ocs__pager-link next">Next: Phase 3, UHF Doorway Transition &rarr;</a>
	</div>
	<div class="ocs__card">
		<div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
		{% if data.Repo %}<a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>{% endif %}
	</div>
</div>
