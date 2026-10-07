---
layout: opencs
title: Get Involved with SRFSC
description: Volunteer with the Scripps Ranch Fire Safe Council, host a neighborhood safety meeting, join the board, or donate.
permalink: /capstone/srfsc/app/get-involved/
hide: true
---

<!-- markdownlint-disable MD033 -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="involved" %}
  {% include projects/srfsc/srfsc-banner.html photo="involved" eyebrow="Neighbor-driven fire safety since 2004" title="Get involved" lead="Every firebreak in Scripps Ranch was cleared by neighbors. Choose a way to help that fits your time, skills, and energy." %}

  <section class="srfsc-roles" aria-label="Ways to help">
    <article class="srfsc-role">
      <h2 class="srfsc-role__title">Clearing Day crew</h2>
      <p>Join a monthly work party to clear dead brush, trim vegetation, and keep canyon firebreaks open. No experience needed.</p>
    </article>
    <article class="srfsc-role">
      <h2 class="srfsc-role__title">Block meeting host</h2>
      <p>Invite your street and help neighbors learn about defensible space, evacuation readiness, and wildfire preparedness.</p>
    </article>
    <article class="srfsc-role">
      <h2 class="srfsc-role__title">Board leadership</h2>
      <p>Help guide programs, coordinate with local fire agencies, and shape the future priorities of the council.</p>
    </article>
    <article class="srfsc-role">
      <h2 class="srfsc-role__title">Events &amp; outreach</h2>
      <p>Staff community booths, share safety checklists, and help with newsletters, social media, and public education.</p>
    </article>
  </section>

  <section class="srfsc-panel" aria-labelledby="quick-start-title">
    <h2 id="quick-start-title" class="srfsc-panel__title">Not sure where to start?</h2>
    <p>Start with a quick volunteer sign-up and we’ll match you with the best next step—whether that’s a workday, a block meeting, or a community outreach event.</p>
  </section>

  <div class="srfsc-columns">
    <section class="srfsc-panel" id="volunteer">
      <h2 class="srfsc-panel__title">Volunteer sign-up</h2>
      <form class="srfsc-form" id="srfsc-volunteer-form" novalidate>
        <label class="srfsc-field">Name<input name="name" required maxlength="128" autocomplete="name"></label>
        <label class="srfsc-field">Email<input name="email" type="email" required autocomplete="email"></label>
        <label class="srfsc-field">Phone (optional)<input name="phone" type="tel" maxlength="32" autocomplete="tel"></label>
        <label class="srfsc-field">I'd like to help with
          <select name="interest" required>
            <option>Clearing Day</option>
            <option>Block Meeting Host</option>
            <option>Board Leadership</option>
            <option>Events &amp; Outreach</option>
          </select>
        </label>
        <label class="srfsc-field">Street (optional)<input name="street" maxlength="255" autocomplete="address-line1"></label>
        <label class="srfsc-field">Anything else? (optional)<textarea name="message" rows="3" maxlength="2000"></textarea></label>
        <button class="ocs__btn alert-green fill" type="submit">Sign me up</button>
        <p class="srfsc-form__status" aria-live="polite"></p>
      </form>
    </section>

    <section class="srfsc-panel srfsc-donate" id="donate">
      <h2 class="srfsc-panel__title">Donate</h2>
      <p>SRFSC is an all-volunteer 501(c)(3). Donations help cover hazard tree removal, chipping, and wildfire-preparedness education for the neighborhood.</p>
      <a class="ocs__btn alert-green fill" href="https://venmo.com/srfsc" target="_blank" rel="noopener noreferrer">Venmo @srfsc</a>
      <p class="srfsc-panel__note">Or mail a check to 9903 Businesspark Ave #102, San Diego, CA 92131.</p>
      <div class="srfsc-kpi srfsc-kpi--live">
        <span class="srfsc-kpi__value" data-live-stat="volunteers">–</span>
        <span class="srfsc-kpi__label">neighbors have signed up through this site</span>
      </div>
    </section>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { bindForm } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscDom.js';
  import { submitVolunteer } from '{{site.baseurl}}/assets/js/projects/srfsc/srfscApi.js';
  import { loadKpiPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/kpiPanel.js';

  loadKpiPanel();
  bindForm(document.getElementById('srfsc-volunteer-form'), {
    submitFn: submitVolunteer,
    successMessage: (result) => result.message,
    onSuccess: loadKpiPanel,
  });
</script>
