---
layout: opencs
title: Scripps Ranch Fire Safe Council
description: SRFSC community dashboard — live fire weather, neighborhood impact, and a hub for events, volunteering, hazard reports, home preparation, and community updates.
permalink: /capstone/srfsc/app/
author: Krish Kelageri, Jasan Boprai, Shourya Patel
---

<!-- markdownlint-disable MD033 -->
<!-- Shared partials live in navigation/*.html and are copied to _includes/projects/srfsc/ by the project Makefile. -->
{%- assign srfsc_root = site.baseurl | append: "/capstone/srfsc/app/" -%}
<div class="srfsc-app">
  {% include projects/srfsc/srfsc-nav.html active="home" %}

  <!-- Urgency + mission + every action in one glance (ideation: Clear Mission Messaging, Volunteer Path) -->
  <section class="srfsc-hero" id="mission">
    <div class="srfsc-hero__message">
      <p class="srfsc-hero__eyebrow">Scripps Ranch · San Diego · All-volunteer since 2004</p>
      <h1 class="srfsc-hero__title">A prepared neighborhood is the best defense against wildfire.</h1>
      <p class="srfsc-hero__lead">
        We clear hazardous vegetation, maintain firebreaks along canyon edges, and help neighbors prepare before the next fire arrives.
        That gives residents more time to act, supports first responders, and strengthens the whole community.
      </p>
      <div class="srfsc-actions" id="actions">
        <a class="ocs__btn alert-green fill" href="{{ srfsc_root }}get-involved/">Volunteer</a>
        <a class="ocs__btn alert-yellow fill" href="{{ srfsc_root }}events/" id="srfsc-next-event-cta">Join the next event</a>
        <a class="ocs__btn alert-red fill" href="{{ srfsc_root }}report/">Report a hazard</a>
        <a class="ocs__btn" href="{{ srfsc_root }}get-involved/#donate">Donate</a>
      </div>
    </div>

    <!-- Live fire-weather card: makes "understand the risk" concrete -->
    <aside class="srfsc-weather" id="srfsc-weather" data-level="Unknown" aria-live="polite">
      <p class="srfsc-weather__label">Today's fire weather</p>
      <p class="srfsc-weather__level" id="srfsc-weather-level">Loading…</p>
      <dl class="srfsc-weather__readings">
        <div><dt>Humidity</dt><dd id="srfsc-weather-humidity">–</dd></div>
        <div><dt>Wind</dt><dd id="srfsc-weather-wind">–</dd></div>
        <div><dt>Temp</dt><dd id="srfsc-weather-temp">–</dd></div>
      </dl>
      <p class="srfsc-weather__message" id="srfsc-weather-message"></p>
      <ul class="srfsc-weather__alerts" id="srfsc-weather-alerts"></ul>
      <p class="srfsc-weather__source" id="srfsc-weather-source">Unofficial indicator. Follow CAL FIRE and SDFR guidance.</p>
    </aside>
  </section>

  <!-- Trust at a glance: historic impact (static, from srfiresafe.org) next to live activity -->
  <section class="srfsc-kpis" aria-label="Community impact">
    <div class="srfsc-kpi"><span class="srfsc-kpi__value">12,000</span><span class="srfsc-kpi__label">Homes protected</span></div>
    <div class="srfsc-kpi"><span class="srfsc-kpi__value">650+</span><span class="srfsc-kpi__label">Residential firebreaks</span></div>
    <div class="srfsc-kpi"><span class="srfsc-kpi__value">340</span><span class="srfsc-kpi__label">Hazard trees removed</span></div>
    <div class="srfsc-kpi srfsc-kpi--live"><span class="srfsc-kpi__value" data-live-stat="volunteers">–</span><span class="srfsc-kpi__label">New volunteers</span></div>
    <div class="srfsc-kpi srfsc-kpi--live"><span class="srfsc-kpi__value" data-live-stat="event_rsvps">–</span><span class="srfsc-kpi__label">Event RSVPs</span></div>
    <div class="srfsc-kpi srfsc-kpi--live"><span class="srfsc-kpi__value" data-live-stat="open_reports">–</span><span class="srfsc-kpi__label">Hazards being handled</span></div>
  </section>

  <!-- Hub: every section of the site, each with its live status (ideation: Program Clarity, Shared Visibility) -->
  <section class="srfsc-hub" aria-label="Explore SRFSC">
    <a class="srfsc-hub__card srfsc-hub__card--events" href="{{ srfsc_root }}events/">
      <span class="srfsc-hub__title">Events</span>
      <span class="srfsc-hub__text">Clearing days, block meetings, and fire safety expos. RSVP in one click.</span>
      <span class="srfsc-hub__status" id="srfsc-hub-next-event">Loading the next event…</span>
    </a>
    <a class="srfsc-hub__card srfsc-hub__card--involved" href="{{ srfsc_root }}get-involved/">
      <span class="srfsc-hub__title">Get Involved</span>
      <span class="srfsc-hub__text">Volunteer on a work party, host a block meeting, join the board, or donate.</span>
      <span class="srfsc-hub__status" data-offline-text="Volunteer sign-up →"><span data-live-stat="volunteers">–</span> neighbors signed up</span>
    </a>
    <a class="srfsc-hub__card srfsc-hub__card--report" href="{{ srfsc_root }}report/">
      <span class="srfsc-hub__title">Report a Hazard</span>
      <span class="srfsc-hub__text">Dead brush, a leaning tree, or a blocked firebreak? Tell the council where.</span>
      <span class="srfsc-hub__status" data-offline-text="Tell us where →"><span data-live-stat="open_reports">–</span> open · <span data-live-stat="resolved_reports">–</span> resolved</span>
    </a>
    <a class="srfsc-hub__card srfsc-hub__card--prepare" href="{{ srfsc_root }}prepare/">
      <span class="srfsc-hub__title">Prepare Your Home</span>
      <span class="srfsc-hub__text">Defensible-space zones, home hardening, and a quick readiness check.</span>
      <span class="srfsc-hub__status">Take the readiness check →</span>
    </a>
    <a class="srfsc-hub__card srfsc-hub__card--community" href="{{ srfsc_root }}community/">
      <span class="srfsc-hub__title">Community</span>
      <span class="srfsc-hub__text">News, impact stories, and updates from our agency partners.</span>
      <span class="srfsc-hub__status" id="srfsc-hub-latest-update">Loading the latest update…</span>
    </a>
    <a class="srfsc-hub__card srfsc-hub__card--about" href="{{ srfsc_root }}about/">
      <span class="srfsc-hub__title">About SRFSC</span>
      <span class="srfsc-hub__text">Learn why neighbors founded the council after the 2003 Cedar Fire.</span>
      <span class="srfsc-hub__status">Our story and programs →</span>
    </a>
  </section>

  <div class="srfsc-columns">
    <section class="srfsc-panel">
      <header class="srfsc-panel__header">
        <h2 class="srfsc-panel__title">Coming up</h2>
        <a class="srfsc-panel__more" href="{{ srfsc_root }}events/">All events →</a>
      </header>
      <ul class="srfsc-mini-list" id="srfsc-home-events"><li class="srfsc-empty">Loading events…</li></ul>
    </section>
    <section class="srfsc-panel">
      <header class="srfsc-panel__header">
        <h2 class="srfsc-panel__title">Latest from the community</h2>
        <a class="srfsc-panel__more" href="{{ srfsc_root }}community/">All updates →</a>
      </header>
      <ul class="srfsc-mini-list" id="srfsc-home-updates"><li class="srfsc-empty">Loading updates…</li></ul>
    </section>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { initHomePage } from '{{site.baseurl}}/assets/js/projects/srfsc/homePage.js';

  initHomePage('{{ srfsc_root }}');
</script>
