---
layout: opencs
title: Onboarding Challenge
description: Play a game to unlock a hands-on onboarding challenge.
permalink: /onboarding/view/
full_width: true
hide: true
microblog: true
microblog_topic_param: challenge
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
  <!-- Persistence bar: the Game profile (account data) and unlock status share one row -->
  <div class="onboarding__persistence">
    <details class="onboarding__game-details" data-game-details hidden>
      <summary>Game profile</summary>
      <div data-game-profile></div>
    </details>
    <p role="status" aria-live="polite" data-challenge-status>Loading your progress...</p>
    <button class="ocs__btn small" type="button" data-unlock-retry hidden>Retry saving unlock</button>
  </div>
  <header class="onboarding__header">
    <h2 data-challenge-title>Onboarding challenge</h2>
    <p data-challenge-description></p>
  </header>
  <div data-runner-shell hidden>
    {% capture onboarding_controls %}<button class="ocs__btn utility reset" type="button" title="Reset &amp; Replay" aria-label="Reset &amp; Replay" data-game-reset hidden></button><span class="onboarding__gate" data-gate hidden><span data-gate-count></span><span data-gate-instructions hidden>Steer with WASD, arrow keys, or the touch controls. Collect five apples; hitting a wall or your tail resets the score.</span><span role="alert" data-gate-error></span></span>{% endcapture %}
    {% capture onboarding_scores %}<div data-game-scores hidden></div>{% endcapture %}
    {% include runners/game.html runner_id="onboarding" hide_edit="true" hide_level_select="true" hide_engine_select="true" extra_controls=onboarding_controls status_content=onboarding_scores %}
    <!-- Toasts and hints overlay the game area (onboarding-view.js moves this into .game-output) -->
    <div class="onboarding__overlay" data-game-overlay>
      <p role="status" aria-live="polite" data-game-message hidden></p>
      <p data-game-hint hidden></p>
    </div>
  </div>
  <noscript><p>JavaScript is required to play this challenge. <a href="{{ '/onboarding/' | relative_url }}">Back to onboarding</a></p></noscript>
</main>
<script type="module" src="{{ '/assets/js/projects/onboarding/onboarding-view.js' | relative_url }}"></script>

<!-- markdownlint-restore -->
