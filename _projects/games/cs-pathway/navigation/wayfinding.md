---
layout: opencs
title: Open Coding Society - Wayfinding World
description: Play the Wayfinding World level of the CS Pathway on its own page.
permalink: /cs-pathway/wayfinding
hide: true
toc: false
---

{% comment %}
Standalone, full-window page for the Wayfinding World level. Identity Forge stays on
/cs-pathway; its in-game portals still splice later levels in at runtime, so
both entry points share the same level and profile data.
{% endcomment %}

<div id="cs-pathway-wayfinding" class="cs-pathway-fullpage"></div>

<script type="module">
import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
import GameLevelCsPath1Way from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath1Way.js';

startFullPageLevel({ containerId: 'cs-pathway-wayfinding', levelClass: GameLevelCsPath1Way, path: '{{ site.baseurl }}' });
</script>
