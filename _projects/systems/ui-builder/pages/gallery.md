---
layout: opencs
title: Page gallery
description: Pages made with the OCS UI Builder.
permalink: /ui-builder/gallery/
full_width: true
search_exclude: true
hide: true
regenerate: true
---
{%- comment -%}
The UI Builder gallery: published pages as cards, with a course filter and a search
(?course=<code>&q=<words>). js/gallery.js draws it from Spring's public gallery; signed-out
visitors see only pages approved for everyone, and a Flask-only site shows a notice and asks
Spring nothing. The pages are student-made, so search engines are asked not to index them.
{%- endcomment -%}
<meta name="robots" content="noindex">
{% include projects/ui-builder/ui_builder_data.html %}
<div id="ui-builder-gallery" data-ui-gallery>
  <div class="ocs__container">
    <p class="ocs__text" role="status">{{ site.data.ui_builder.text.gallery.loading | escape }}</p>
    <noscript><div class="ocs__callout">{{ site.data.ui_builder.text.gallery.noscript | escape }}</div></noscript>
  </div>
</div>
<script type="module">
  import * as config from '{{ site.baseurl }}/assets/js/api/config.js';
  import { readRegistry } from '{{ site.baseurl }}/assets/js/projects/ui-builder/registry.js';
  import { LocalPageStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/page-store.js';
  import { SpringPageStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/spring-page-store.js';
  import { startGallery } from '{{ site.baseurl }}/assets/js/projects/ui-builder/gallery.js';

  const registry = readRegistry(document);
  // Picked once from spring in _config.yml: a Flask-only site never sends a request to Spring.
  const store = config.springEnabled
    ? new SpringPageStore({ javaURI: config.javaURI, fetchOptions: config.fetchOptions, registry })
    : new LocalPageStore({ registry });
  startGallery(document.getElementById('ui-builder-gallery'), { registry, config, store });
</script>
