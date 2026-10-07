---
layout: opencs
title: Prepare Your Home for Wildfire
description: Defensible-space zones, home hardening tips, and a readiness check from the Scripps Ranch Fire Safe Council.
permalink: /capstone/srfsc/app/prepare/
hide: true
---

<!-- markdownlint-disable MD033 -->
<style>
  .srfsc-app.srfsc-prepare {
    width: min(100%, 1200px);
    padding-inline: clamp(0.75rem, 2.5vw, 1.25rem);
    box-sizing: border-box;
  }

  .srfsc-prepare,
  .srfsc-prepare * {
    min-width: 0;
    box-sizing: border-box;
  }

  .srfsc-prepare .srfsc-banner__lead,
  .srfsc-prepare .srfsc-zone-card p,
  .srfsc-prepare .srfsc-bullets li,
  .srfsc-prepare .srfsc-panel__note {
    overflow-wrap: anywhere;
  }

  .srfsc-prepare .srfsc-panel__header {
    flex-wrap: wrap;
  }

  .srfsc-prepare .srfsc-checklist {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  }

  @media (max-width: 720px) {
    .srfsc-prepare .srfsc-zones {
      gap: 0.75rem;
    }

    .srfsc-prepare .srfsc-zone-card,
    .srfsc-prepare .srfsc-panel {
      padding: 1rem;
    }

    .srfsc-prepare .srfsc-zone-card__range {
      font-size: 1.35rem;
    }

    .srfsc-prepare .srfsc-zone-card__title,
    .srfsc-prepare .srfsc-panel__title {
      font-size: 1rem;
      line-height: 1.25;
    }
  }

  @media (max-width: 520px) {
    .srfsc-app.srfsc-prepare {
      padding-inline: 0.5rem;
    }

    .srfsc-prepare .srfsc-banner {
      padding: 1rem;
      min-height: 180px;
    }

    .srfsc-prepare .srfsc-panel__header {
      align-items: flex-start;
    }

    .srfsc-prepare .srfsc-panel__meta {
      flex-basis: 100%;
    }

    .srfsc-prepare .srfsc-zone {
      padding: 0.7rem 0.8rem;
    }

    .srfsc-prepare .srfsc-zone__item {
      font-size: 0.84rem;
    }
  }
</style>

<div class="srfsc-app srfsc-prepare">
  {% include projects/srfsc/srfsc-nav.html active="prepare" %}
  {% include projects/srfsc/srfsc-banner.html photo="prepare" eyebrow="Home hardening & education" title="Prepare your home" lead="The Forest Service calls this photo 'fuel treatments at work.' Clearing fuel around homes gives fire less to burn, and defensible space does the same for yours." %}

  <section class="srfsc-zones" aria-label="Defensible space zones">
    <article class="srfsc-zone-card srfsc-zone-card--0">
      <span class="srfsc-zone-card__range">0–5 ft</span>
      <h2 class="srfsc-zone-card__title">Ember-resistant zone</h2>
      <p>Embers start most home fires. Keep this zone free of anything that burns: mulch, dead plants, firewood, and patio cushions.</p>
    </article>
    <article class="srfsc-zone-card srfsc-zone-card--1">
      <span class="srfsc-zone-card__range">5–30 ft</span>
      <h2 class="srfsc-zone-card__title">Lean, clean &amp; green</h2>
      <p>Remove dead vegetation, space shrubs apart, and trim branches 10 ft from your roof and chimney.</p>
    </article>
    <article class="srfsc-zone-card srfsc-zone-card--2">
      <span class="srfsc-zone-card__range">30–100 ft</span>
      <h2 class="srfsc-zone-card__title">Reduce fuel</h2>
      <p>Mow grass to 4", remove ladder fuels under trees, and keep the canyon edge behind your home maintained.</p>
    </article>
  </section>

  <div class="srfsc-columns srfsc-columns--wide-left">
    <section class="srfsc-panel" id="checklist">
      <header class="srfsc-panel__header">
        <h2 class="srfsc-panel__title">Readiness check</h2>
        <span class="srfsc-panel__meta">Nothing here is saved or sent</span>
      </header>
      <div class="srfsc-meter" role="status">
        <div class="srfsc-meter__track"><div class="srfsc-meter__fill" id="srfsc-meter-fill"></div></div>
        <p class="srfsc-meter__label" id="srfsc-meter-label"></p>
      </div>
      <div class="srfsc-checklist" id="srfsc-checklist"></div>
    </section>

    <aside class="srfsc-panel">
      <h2 class="srfsc-panel__title">Harden your home</h2>
      <ul class="srfsc-bullets">
        <li>Class A fire-rated roof; seal gaps where embers can lodge</li>
        <li>1/8" metal mesh on attic, eave, and crawlspace vents</li>
        <li>Dual-pane tempered glass windows</li>
        <li>Non-combustible fencing for the first 5 ft from the house</li>
        <li>Enclose eaves and the underside of decks</li>
      </ul>
      <h3 class="srfsc-panel__subtitle">Be ready to go</h3>
      <ul class="srfsc-bullets">
        <li>Pack a go-bag: water, medications, documents, chargers</li>
        <li>Know two ways out of your neighborhood</li>
        <li>Sign up for AlertSanDiego emergency notifications</li>
      </ul>
      <p class="srfsc-panel__note">Need help clearing? <a href="{{ site.baseurl }}/capstone/srfsc/app/events/">Join a Clearing Day</a> or <a href="{{ site.baseurl }}/capstone/srfsc/app/report/">report a hazard</a>.</p>
    </aside>
  </div>

  {% include projects/srfsc/srfsc-footer.html %}
</div>

<script type="module">
  import { initChecklistPanel } from '{{site.baseurl}}/assets/js/projects/srfsc/checklistPanel.js';

  initChecklistPanel();
</script>
