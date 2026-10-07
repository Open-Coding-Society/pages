---
layout: opencs
title: SRFSC Community Updates
description: News, impact stories, and partner updates from the Scripps Ranch Fire Safe Council.
permalink: /capstone/srfsc/app/community/
hide: true
---

<!-- markdownlint-disable MD033 -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="community" %}
  {% include projects/srfsc/srfsc-banner.html photo="community" eyebrow="Community trust" title="Community updates" lead="Neighbors, volunteers, and local agencies are working together to reduce wildfire risk and keep Scripps Ranch informed and prepared." %}

  <div class="srfsc-columns srfsc-columns--wide-left">
    <section class="srfsc-panel">
      <div class="srfsc-chips" role="group" aria-label="Filter updates">
        <button type="button" class="srfsc-chips__chip" data-category="All" aria-pressed="true">All</button>
        <button type="button" class="srfsc-chips__chip" data-category="News" aria-pressed="false">News</button>
        <button type="button" class="srfsc-chips__chip" data-category="Impact Story" aria-pressed="false">Impact stories</button>
        <button type="button" class="srfsc-chips__chip" data-category="Partner" aria-pressed="false">Partners</button>
      </div>
      <div class="srfsc-feed" id="srfsc-updates"><p class="srfsc-empty">Loading updates…</p></div>
    </section>

    <aside class="srfsc-panel">
      <h2 class="srfsc-panel__title">Our partners</h2>
      <ul class="srfsc-partners">
        <li>CAL FIRE</li>
        <li>San Diego Fire-Rescue</li>
        <li>California Conservation Corps</li>
      </ul>
      <h3 class="srfsc-panel__subtitle">By the numbers</h3>
      <div class="srfsc-kpi-row">
        <div class="srfsc-kpi"><span class="srfsc-kpi__value">650+</span><span class="srfsc-kpi__label">firebreaks</span></div>
        <div class="srfsc-kpi"><span class="srfsc-kpi__value">340</span><span class="srfsc-kpi__label">hazard trees removed</span></div>
      </div>
      <p class="srfsc-panel__note">Want updates by email? <a href="{{ site.baseurl }}/capstone/srfsc/app/get-involved/">Sign up as a volunteer</a> and choose Events &amp; Outreach.</p>
    </aside>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { initUpdatesPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/updatesPanel.js';

  initUpdatesPanel();
</script>
