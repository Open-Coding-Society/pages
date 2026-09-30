---
microblog: true
toc: false
layout: post
title: Classroom Presence System, Iterations
description: A running log of how this project's scope and framing changed, and why, in the design-based research spirit of reflect and redesign.
permalink: /capstone/presence-system/iterations/
year: "2026-2027"
rp_active: iterations
---

{% assign data = site.data.presence_system_infograph %}
<!-- markdownlint-disable MD033 MD010 MD012 -->
<div class="rfid-presence-infograph">
  <div class="rfid-presence-header">
    <div class="ocs__badge">Design-Based Research Log</div>
    <h1 class="rfid-presence-title">Iterations</h1>
    <p class="ocs__description">Design-based research runs in cycles of build, test, reflect, and redesign (see the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>). This page is that reflect-and-redesign step made visible, instead of scattered as "used to be X" notes across the other pages.</p>
  </div>

  {% include presence-system-nav.html %}

  <div class="ocs__card">
    <h3 class="ocs__section-title">Timeline</h3>
    <div class="rfid-presence-table-wrap">
      <table class="ocs__table rfid-presence-table">
        <thead><tr><th>When</th><th>Change</th><th>Why</th></tr></thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Built a single-input, contact-tap RFID prototype: CrowPi reader, Flask backend, dashboard.</td>
            <td>Prove the core read-log-display loop end to end, cheaply, before investing in harder hardware. See <a href="https://github.com/vibha1019/crowpi-attendance/issues/3" target="_blank" rel="noopener">Issue&nbsp;#3</a>.</td>
          </tr>
          <tr>
            <td>2026-09-18</td>
            <td>Reframed the project around a research question instead of a technology. Added hypotheses H1&ndash;H4, a design-based research cycle plan, and a ground-truth evaluation methodology.</td>
            <td>Review feedback pointed out the project had drifted into "an RFID project" rather than a presence system, and was missing key objectives visible in the teacher communication and survey. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/5" target="_blank" rel="noopener">Research Proposal</a>.</td>
          </tr>
          <tr>
            <td>2026-09-21</td>
            <td>Split into three parallel input tracks, RFID, QR, and face scan, each with an owner: Vibha (RFID), Ruta (QR), Kush (Camera). Added a shared index issue and moved cross-cutting requirements (attendance reporting, roster import, door monitor) out of any single track.</td>
            <td>RFID alone can't answer RQ4 (which input works best) or test H4 (does combining inputs beat any single one). The three tracks needed to exist and be comparable before Cycle&nbsp;3 could run. See the <a href="https://github.com/vibha1019/crowpi-attendance/issues/9" target="_blank" rel="noopener">Presence System Index</a>.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ocs__card">
    <div class="ocs__team">
      <span class="ocs__team-label">Project Team</span>
      <span class="ocs__team-name">{{ data.Team | join: ", " }}</span>
    </div>
    {% if data.Repo %}
    <a href="{{ data.Repo }}" target="_blank" rel="noopener" class="ocs__btn accent fill">View Repo</a>
    {% endif %}
  </div>
</div>
<!-- markdownlint-enable MD033 MD010 MD012 -->
