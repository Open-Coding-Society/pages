---
layout: opencs
title: Jarvis
description: Open the Jarvis dashboard from CS Pathway.
permalink: /jarvis/
hide: true
toc: false
---

{% include projects/cs-pathway/cs-pathway-menu.html %}
{% assign jarvis_url = site.jarvis_embed_url | strip %}
{% assign jarvis_link = jarvis_url | default: 'https://jarvis.eu1.netbird.services/' %}

<div class="ocs__container">
  <p>
    <a class="ocs__btn pill accent fill" href="{{ jarvis_link | escape }}" target="_blank" rel="noopener noreferrer">Open Jarvis in a new tab</a>
  </p>
  {% if jarvis_url != empty %}
  <iframe
    class="cs-pathway-jarvis-frame"
    src="{{ jarvis_url | escape }}"
    title="Jarvis dashboard"
    referrerpolicy="no-referrer"
    allowfullscreen>
  </iframe>
  {% endif %}
</div>
