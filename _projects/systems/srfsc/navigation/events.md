---
layout: opencs
title: SRFSC Events
description: Upcoming Scripps Ranch Fire Safe Council clearing days, block meetings, and fire safety expos, with one-click RSVP.
permalink: /capstone/srfsc/app/events/
hide: true
---

<!-- markdownlint-disable MD033 -->
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="events" %}
  {% include projects/srfsc/srfsc-banner.html photo="events" eyebrow="Join your neighbors" title="Upcoming events" lead="Clearing days, block meetings, and fire safety expos. Every work party clears fuel that would otherwise carry fire into our canyons." %}

  <div class="srfsc-columns srfsc-columns--wide-left">
    <section class="srfsc-panel">
      <header class="srfsc-panel__header">
        <h2 class="srfsc-panel__title">Calendar</h2>
        <span class="srfsc-panel__meta" data-live-stat="upcoming_events"></span>
      </header>
      <div class="srfsc-events" id="srfsc-events"><p class="srfsc-empty">Loading events…</p></div>
    </section>

    <aside class="srfsc-panel">
      <h2 class="srfsc-panel__title">What to expect</h2>
      <dl class="srfsc-facts">
        <dt>Clearing Day</dt>
        <dd>A monthly work party along canyon edges. Gloves and tools provided. Wear long sleeves and closed-toe shoes.</dd>
        <dt>Block Meeting</dt>
        <dd>A neighbor hosts; the council brings defensible-space and evacuation tips for your street.</dd>
        <dt>Fire Safety Expo</dt>
        <dd>Meet San Diego Fire-Rescue and CAL FIRE, see home-hardening demos, and pick up checklists.</dd>
      </dl>
      <p class="srfsc-panel__note">Can't make it? <a href="{{ site.baseurl }}/capstone/srfsc/app/get-involved/">Sign up to volunteer</a> and we'll reach out about future events.</p>
    </aside>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { loadEventsPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/eventsPanel.js';
  import { loadKpiPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/kpiPanel.js';

  loadKpiPanel();
  loadEventsPanel(loadKpiPanel);
</script>
