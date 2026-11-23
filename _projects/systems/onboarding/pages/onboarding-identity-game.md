---
layout: opencs
title: Identity Forge
permalink: /onboarding/identity-game/
hide: true
toc: false
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD033 -->

<div id="onboarding-identity-game" class="cs-pathway-fullpage"></div>
<div class="onboarding-identity-gate-status" data-identity-gate-status hidden>
  <p data-identity-gate-message role="status" aria-live="polite"></p>
  <button class="ocs__btn" type="button" data-identity-gate-retry hidden>Retry saving unlock</button>
</div>
<script type="module">
  import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
  import { Backend } from '@assets/js/login/backend.js';
  import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
  import { OnboardingStore } from '@assets/js/projects/onboarding/onboarding-store.js';
  import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
  import GameLevelCsPath0Forge from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath0Forge.js';
  import { startIdentityGate } from '@assets/js/projects/onboarding/identity-gate.js';
  const game = startFullPageLevel({ containerId: 'onboarding-identity-game', levelClass: GameLevelCsPath0Forge, path: {{ site.baseurl | jsonify }} });
  if (new URLSearchParams(location.search).get('onboarding_gate') === '1' && window.parent !== window) {
    const profile = new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) });
    startIdentityGate(game, {
      store: new OnboardingStore({ profile }),
      status: document.querySelector('[data-identity-gate-status]'),
    });
  }
</script>

<!-- markdownlint-restore -->
