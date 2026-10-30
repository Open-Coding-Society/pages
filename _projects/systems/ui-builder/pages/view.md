---
layout: opencs
title: UI Builder page
description: A page made with the OCS UI Builder.
permalink: /ui-builder/view/
full_width: true
search_exclude: true
hide: true
regenerate: true
---
{%- comment -%}
The UI Builder viewer: ?page=<slug> (published), ?draft=<id> (editors and teachers) or
?local=<id> (saved in this browser). js/viewer.js renders the page from its JSON and mounts its
live blocks; the other systems' modules those blocks use are loaded only when a page has one, so
their addresses are passed in below rather than imported. widgets=true adds the kanban and
calendar data and empty cards the live blocks copy. Pages are student-made, so search engines
are asked not to index them.
{%- endcomment -%}
<meta name="robots" content="noindex">
{% include projects/ui-builder/ui_builder_data.html widgets=true %}
<div id="ui-builder-viewer" data-ui-viewer>
  <div class="ocs__container">
    <p class="ocs__text" role="status">{{ site.data.ui_builder.text.view.loading | escape }}</p>
    <noscript><div class="ocs__callout">{{ site.data.ui_builder.text.view.noscript | escape }}</div></noscript>
  </div>
</div>
<script type="module">
  import * as config from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import * as messagesModel from '{{ site.baseurl }}/assets/js/projects/messages/messages-model.js';
  import { readRegistry } from '{{ site.baseurl }}/assets/js/projects/ui-builder/registry.js';
  import { LocalPageStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/page-store.js';
  import { SpringPageStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/spring-page-store.js';
  import { startViewer } from '{{ site.baseurl }}/assets/js/projects/ui-builder/viewer.js';

  const registry = readRegistry(document);
  // Picked once from spring in _config.yml: a Flask-only site never sends a request to Spring.
  const store = config.springEnabled
    ? new SpringPageStore({ javaURI: config.javaURI, fetchOptions: config.fetchOptions, registry })
    : new LocalPageStore({ registry });
  startViewer(document.getElementById('ui-builder-viewer'), {
    registry, config, richText, messagesModel, store,
    modules: {
      conversationEmbed: '{{ site.baseurl }}/assets/js/projects/messages/conversation-embed.js',
      kanban: '{{ site.baseurl }}/assets/js/kanban-board.js',
      calendarCard: '{{ site.baseurl }}/assets/js/chat/calendar/calendar-card.js',
      calendarModel: '{{ site.baseurl }}/assets/js/chat/calendar/calendar-model.js',
      microblog: '{{ site.baseurl }}/assets/js/api/microblog.js',
    },
  });
</script>
