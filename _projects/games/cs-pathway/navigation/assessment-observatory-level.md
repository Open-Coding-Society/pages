---
layout: opencs
title: Open Coding Society - Assessment Observatory
description: Play the Assessment Observatory level of the CS Pathway on its own page.
permalink: /cs-pathway/assessment-observatory
hide: true
toc: false
---

{% comment %}
Standalone, full-window page for the Assessment Observatory level. Identity Forge stays on
/cs-pathway; its in-game portals still splice later levels in at runtime, so
both entry points share the same level and profile data.
{% endcomment %}

<div id="cs-pathway-assessment-observatory" class="cs-pathway-fullpage"></div>

<script type="module">
import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
import GameLevelCsPath3Analytics from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath3Analytics.js';

startFullPageLevel({ containerId: 'cs-pathway-assessment-observatory', levelClass: GameLevelCsPath3Analytics, path: '{{ site.baseurl }}' });
</script>
