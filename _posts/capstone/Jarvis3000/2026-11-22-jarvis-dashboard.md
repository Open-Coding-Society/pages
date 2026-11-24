---
layout: opencs
title: Jarvis
description: Open the Jarvis3000 dashboard.
permalink: /jarvis/
hide: true
toc: false
---

{% assign jarvis_url = site.jarvis_embed_url | strip %}
{% assign jarvis_link = jarvis_url | default: 'https://jarvis.eu1.netbird.services/' %}

{% if jarvis_url != empty %}
<link rel="stylesheet" href="{{ '/assets/css/jarvis.css' | relative_url }}">
{% endif %}

<div class="ocs__container">
  <p>
    <a class="ocs__btn pill accent fill" href="{{ jarvis_link | escape }}" target="_blank" rel="noopener noreferrer">Open Jarvis in a new tab</a>
  </p>
  {% if jarvis_url != empty %}
  <iframe
    class="jarvis-dashboard-frame"
    src="{{ jarvis_url | escape }}"
    title="Jarvis dashboard"
    referrerpolicy="no-referrer"
    allowfullscreen>
  </iframe>
  {% endif %}
</div>
