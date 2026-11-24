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

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD033 -->

<main class="onboarding" data-onboarding-view data-baseurl="{{ site.baseurl | escape }}">
  <p data-standalone-back hidden><a href="{{ '/onboarding/' | relative_url }}">Back to onboarding</a></p>
  <h2 data-challenge-title>Onboarding challenge</h2>
  <p data-challenge-description></p>
  <p role="status" aria-live="polite" data-challenge-status>Loading your progress...</p>
  <button class="ocs__btn" type="button" data-unlock-retry hidden>Retry saving unlock</button>
  <div data-gate hidden>
    <p data-gate-count></p>
    <p data-gate-instructions hidden>Steer with WASD, arrow keys, or the touch controls. Collect five apples; hitting a wall or your tail resets the score.</p>
    <p role="alert" data-gate-error></p>
  </div>
  <details class="onboarding__game-details" data-game-details hidden>
    <summary>Game profile</summary>
    <div data-game-profile></div>
  </details>
  <p role="status" aria-live="polite" data-game-message hidden></p>
  <p data-game-hint hidden></p>
  <div data-runner-shell hidden>
    {% capture onboarding_reset %}<button class="ocs__btn utility reset" type="button" title="Reset &amp; Replay" aria-label="Reset &amp; Replay" data-game-reset hidden></button>{% endcapture %}
    {% capture onboarding_scores %}<div data-game-scores hidden></div>{% endcapture %}
    {% include runners/game.html runner_id="onboarding" hide_edit="true" hide_level_select="true" hide_engine_select="true" extra_controls=onboarding_reset status_content=onboarding_scores %}
  </div>
  <noscript><p>JavaScript is required to play this challenge. <a href="{{ '/onboarding/' | relative_url }}">Back to onboarding</a></p></noscript>
</main>
<script type="module" src="{{ '/assets/js/projects/onboarding/onboarding-view.js' | relative_url }}"></script>

<!-- markdownlint-restore -->
