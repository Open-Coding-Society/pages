---
layout: opencs
title: Cookie Unlock Game
permalink: /onboarding/gate/
hide: true
toc: false
---

<div class="onboarding-gate" data-baseurl="{{ site.baseurl | escape }}">
  <p data-gate-count role="status" aria-live="polite">Cookies: 0 / 5</p>
  <div class="onboarding-gate__stage" id="onboarding-gate-stage"></div>
  <button class="ocs__btn" type="button" data-gate-click>Collect a cookie</button>
  <p data-gate-error role="alert"></p>
</div>
<script type="module" src="{{ '/assets/js/projects/onboarding/onboarding-gate.js' | relative_url }}"></script>
