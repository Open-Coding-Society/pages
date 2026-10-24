---
layout: opencs
title: Open Coding Society - Toolchain Trail
description: Play the Toolchain Trail level of the CS Pathway on its own page.
permalink: /cs-pathway/toolchain-trail
hide: true
toc: false
---

{% comment %}
Standalone, full-window page for the Toolchain Trail level. Identity Forge stays on
/cs-pathway; its in-game portals still splice later levels in at runtime, so
both entry points share the same level and profile data.
{% endcomment %}

<div id="cs-pathway-toolchain-trail" class="cs-pathway-fullpage"></div>

<script type="module">
import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
import GameLevelCsPath4Toolchain from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath4Toolchain.js';

// Fixed 16:9 stage, scaled to fit the window, so the whole map stays visible
// when the browser shares the screen with a terminal.
startFullPageLevel({
  containerId: 'cs-pathway-toolchain-trail',
  levelClass: GameLevelCsPath4Toolchain,
  path: '{{ site.baseurl }}',
  stage: { width: 1600, height: 900 },
});
</script>
