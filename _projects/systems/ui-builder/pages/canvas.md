---
layout: ui-builder-canvas
title: UI Builder preview
permalink: /ui-builder/canvas/
search_exclude: true
hide: true
regenerate: true
full_width: true
---
{%- comment -%}
The UI Builder canvas: the editor (/ui-builder/) loads this page in an iframe with a nonce and
draws the page being edited into #uiBuilderCanvas through window.OCSUiCanvas
(js/canvas.js, DESIGN §7.4). Opened on its own, or under a parent from another origin, it only
shows a note. The editor strings are included because the canvas chrome (add buttons, labels)
reads them from the registry too.
{%- endcomment -%}
{% include projects/ui-builder/ui_builder_data.html editor=true %}
<div class="ui-builder-canvas" id="uiBuilderCanvas"></div>
<script type="module">
  import { baseurl } from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import { startCanvas } from '{{ site.baseurl }}/assets/js/projects/ui-builder/canvas.js';

  startCanvas({ root: document.getElementById('uiBuilderCanvas'), richText, baseurl });
</script>
