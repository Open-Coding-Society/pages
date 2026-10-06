---
layout: opencs
title: Report a Fire Hazard to SRFSC
description: Tell the Scripps Ranch Fire Safe Council about dead vegetation, hazard trees, or blocked firebreaks.
permalink: /capstone/srfsc/app/report/
hide: true
---

<!-- markdownlint-disable MD033 -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="report" %}
  {% include projects/srfsc/srfsc-banner.html photo="report" eyebrow="Fuel reduction" title="Report a fire hazard" lead="Neighbors spot hazards first. Tell us where, and the council will review it and schedule clearing when needed." %}

  <p class="srfsc-alert">Active fire or emergency? <strong>Call 911.</strong> This form is for non-emergency hazards only.</p>

  <div class="srfsc-columns srfsc-columns--wide-left">
    <section class="srfsc-panel">
      <h2 class="srfsc-panel__title">Hazard report</h2>
      <form class="srfsc-form" id="srfsc-report-form" novalidate>
        <label class="srfsc-field">Hazard type
          <select name="hazard_type" required>
            <option>Dead Vegetation</option>
            <option>Hazard Tree</option>
            <option>Blocked Firebreak</option>
            <option>Other</option>
          </select>
        </label>
        <label class="srfsc-field">Location<input name="location" required maxlength="255" placeholder="e.g. canyon behind Aviary Dr"></label>
        <label class="srfsc-field">What did you see?<textarea name="description" rows="5" required maxlength="2000"></textarea></label>
        <label class="srfsc-field">Your email (optional, for follow-up)<input name="reporter_email" type="email" autocomplete="email"></label>
        <button class="ocs__btn alert-red fill" type="submit">Send report</button>
        <p class="srfsc-form__status" aria-live="polite"></p>
      </form>
    </section>

    <aside class="srfsc-panel">
      <h2 class="srfsc-panel__title">What happens next</h2>
      <ol class="srfsc-steps">
        <li><strong>New.</strong> Your report reaches the council.</li>
        <li><strong>Reviewed.</strong> A volunteer checks the location.</li>
        <li><strong>Scheduled.</strong> Clearing is added to a work day or referred to the right agency.</li>
        <li><strong>Resolved.</strong> The hazard is cleared.</li>
      </ol>
      <div class="srfsc-kpi-row">
        <div class="srfsc-kpi srfsc-kpi--live"><span class="srfsc-kpi__value" data-live-stat="open_reports">–</span><span class="srfsc-kpi__label">being handled</span></div>
        <div class="srfsc-kpi srfsc-kpi--live"><span class="srfsc-kpi__value" data-live-stat="resolved_reports">–</span><span class="srfsc-kpi__label">resolved</span></div>
      </div>
      <h3 class="srfsc-panel__subtitle">Worth reporting</h3>
      <ul class="srfsc-bullets">
        <li>Dead or dying trees leaning toward homes or trails</li>
        <li>Piles of dry brush or palm fronds on canyon slopes</li>
        <li>Overgrown or blocked firebreaks behind homes</li>
      </ul>
    </aside>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { bindForm } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscDom.js';
  import { submitHazardReport } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscApi.js';
  import { loadKpiPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/kpiPanel.js';

  loadKpiPanel();
  bindForm(document.getElementById('srfsc-report-form'), {
    submitFn: submitHazardReport,
    successMessage: (result) => `Report #${result.id} received. The council will review it. Thank you!`,
    onSuccess: loadKpiPanel,
  });
</script>
