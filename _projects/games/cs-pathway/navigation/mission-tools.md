---
layout: opencs
title: Open Coding Society - Mission Tools
description: Play the Mission Tools level of the CS Pathway on its own page.
permalink: /cs-pathway/mission-tools
hide: true
toc: false
---

{% comment %}
Standalone, full-window page for the Mission Tools level. Identity Forge stays on
/cs-pathway; its in-game portals still splice later levels in at runtime, so
both entry points share the same level and profile data.
{% endcomment %}

<div id="cs-pathway-mission-tools" class="cs-pathway-fullpage"></div>

<script type="module">
import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
import GameLevelCsPath2Mission from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath2Mission.js';

startFullPageLevel({ containerId: 'cs-pathway-mission-tools', levelClass: GameLevelCsPath2Mission, path: '{{ site.baseurl }}' });
</script>
