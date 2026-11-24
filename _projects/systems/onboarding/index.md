---
layout: opencs
title: Onboarding Adventure
description: Explore the CS Pathway through games and hands-on challenges.
permalink: /onboarding/
full_width: true
hide: true
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD033 -->

<section class="onboarding" data-onboarding data-baseurl="{{ site.baseurl | escape }}">
  <header>
    <h1 class="onboarding__title">Onboarding Adventure</h1>
    <p><a href="{{ '/cs-pathway' | relative_url }}">Open the original CS Pathway</a></p>
  </header>
  <p role="status" data-onboarding-status>Loading your journey...</p>
  <div class="ocs__grid ocs__grid--card cols-3" data-onboarding-cards></div>
  <noscript><p>JavaScript is required to play the onboarding prototype.</p></noscript>
</section>
<script type="module" src="{{ '/assets/js/projects/onboarding/onboarding-home.js' | relative_url }}"></script>

<!-- markdownlint-restore -->
