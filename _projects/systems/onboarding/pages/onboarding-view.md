---
layout: opencs
title: Onboarding Challenge
description: Play a game to unlock a hands-on onboarding challenge.
permalink: /onboarding/view/
full_width: true
hide: true
page_viewer:
  label: Onboarding
  item: challenge
  home: /onboarding/
  activation_param: onboarding_view
  script: /assets/js/projects/onboarding/onboarding-navigation.js
---

<main class="onboarding" data-onboarding-view data-baseurl="{{ site.baseurl | escape }}">
  <p><a href="{{ '/onboarding/' | relative_url }}">Back to onboarding</a></p>
  <h1 data-challenge-title>Onboarding challenge</h1>
  <p data-challenge-description></p>
  <p role="status" aria-live="polite" data-challenge-status>Loading your progress...</p>
  <section class="ocs__card" data-gate hidden>
    <h2>Unlock this challenge</h2>
    <p>Collect five cookies in the game to unlock the challenge.</p>
    <iframe class="onboarding__gate" title="Cookie unlock game" data-gate-frame></iframe>
  </section>
  <section class="ocs__card" data-challenge hidden>
    <h2>Your challenge</h2>
    <p data-challenge-note></p>
    <a class="ocs__btn accent" data-challenge-open target="_blank" rel="noopener noreferrer">Open challenge in a new tab</a>
    <iframe class="onboarding__challenge" title="Onboarding challenge" data-challenge-frame hidden></iframe>
  </section>
  <noscript><p>JavaScript is required to play this challenge.</p></noscript>
</main>
<script type="module" src="{{ '/assets/js/projects/onboarding/onboarding-view.js' | relative_url }}"></script>
