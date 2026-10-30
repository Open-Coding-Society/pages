---
layout: opencs
title: UI Builder
description: Build a page for your project from blocks, with live data from your own API.
permalink: /ui-builder/
full_width: true
search_exclude: true
hide: true
regenerate: true
---
{%- comment -%}
The UI Builder editor (DESIGN §10). js/editor-app.js builds everything inside #uiBuilder: the
start screen (My pages, Class pages, Templates) or, for ?page= / ?local= / ?new=, the editing
shell with the outline, the canvas iframe (/ui-builder/canvas/) and the inspector. Styles are
the project's sass under .ui-builder; every visible string is in _data/ui_builder_editor.yml.

The bootstrap below is the one place that knows whether this site runs Spring (`spring` in
_config.yml, read by config.js): it picks the Spring store or this browser's store once, and
the editor only reads store.capabilities after that. Other systems' modules (config, rich text,
Messages' group rules, the kanban board's address check) are imported here and passed in.
{%- endcomment -%}
<meta name="robots" content="noindex">
{% include projects/ui-builder/ui_builder_data.html editor=true %}
<div class="ui-builder" id="uiBuilder" data-start-failed="{{ site.data.ui_builder_editor.start_failed | escape }}">
  <noscript><div class="ocs__callout">{{ site.data.ui_builder_editor.needs_js | escape }}</div></noscript>
  <div class="ocs__loading"><div class="ocs__spinner"></div></div>
</div>
<script type="module">
  import * as config from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import * as messagesModel from '{{ site.baseurl }}/assets/js/projects/messages/messages-model.js';
  import { parseBoardUrl } from '{{ site.baseurl }}/assets/js/kanban-board.js';
  import { readRegistry } from '{{ site.baseurl }}/assets/js/projects/ui-builder/registry.js';
  import { DraftStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/draft-store.js';
  import { LocalPageStore } from '{{ site.baseurl }}/assets/js/projects/ui-builder/page-store.js';
  import { startEditor } from '{{ site.baseurl }}/assets/js/projects/ui-builder/editor-app.js';

  const root = document.getElementById('uiBuilder');
  // localStorage can throw when site data is blocked; the stores then use their own default.
  function browserStorage() {
    try {
      return window.localStorage || undefined;
    } catch (_) {
      return undefined;
    }
  }
  try {
    const registry = readRegistry(document);
    const storage = browserStorage();
    const local = storage ? { storage, registry } : { registry };
    let store;
    if (config.springEnabled) {
      const { SpringPageStore } = await import('{{ site.baseurl }}/assets/js/projects/ui-builder/spring-page-store.js');
      store = new SpringPageStore({ javaURI: config.javaURI, fetchOptions: config.fetchOptions, ...local });
    } else {
      store = new LocalPageStore(local);
    }
    const draftStore = new DraftStore(storage ? { storage } : {});
    startEditor(root, { registry, store, draftStore, config, richText, messagesModel, parseBoardUrl });
  } catch (error) {
    console.error('UI Builder: the editor could not start', error);
    const box = document.createElement('div');
    box.className = 'ocs__callout';
    box.setAttribute('role', 'alert');
    box.textContent = (root.dataset.startFailed || '{message}').replace('{message}', error && error.message ? error.message : String(error));
    root.replaceChildren(box);
  }
</script>
