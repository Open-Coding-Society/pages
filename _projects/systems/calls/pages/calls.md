---
layout: opencs
title: Call
description: A video call for a group, a direct message or a class.
permalink: /calls/
search_exclude: true
full_width: true
---
{%- comment -%}
/calls/?group=12, ?dm=34 or ?course=csa: that group's, conversation's or class's video call.
Messages' Call link opens it (CallLink in js/call-link.js). Everything on the page is the ocs__
grammar, built by js/call-page.js; this system has no stylesheet. Its words are data/calls.yml,
handed to the page as JSON.

Calls need Spring (its calls.enabled=true and a LiveKit server), so the page only loads its
scripts when this site runs Spring and _config.yml's calls.enabled is true. Otherwise it says
calls are off and sends nothing. See README.md in this system.
{%- endcomment -%}
{%- assign calls_strings = site.data.projects.calls.calls -%}
<div class="ocs__container ocs__container--fill" id="callPage">
{%- if site.spring != false and site.calls.enabled == true %}
  <p class="ocs__callout" role="status">{{ calls_strings.text.loading }}</p>
</div>

<script type="module">
  import { baseurl, javaURI, javaWebSocketURI, pythonURI, fetchOptions, springEnabled } from '{{ site.baseurl }}/assets/js/api/config.js';
  import * as richText from '{{ site.baseurl }}/assets/js/chat/rich-text.js';
  import * as embed from '{{ site.baseurl }}/assets/js/projects/messages/conversation-embed.js';
  import { CallPage } from '{{ site.baseurl }}/assets/js/projects/calls/call-page.js';

  CallPage.start({
    root: document.getElementById('callPage'),
    strings: {{ calls_strings | jsonify }},
    config: { baseurl, javaURI, javaWebSocketURI, pythonURI, fetchOptions, springEnabled },
    richText,
    embed,
  });
</script>
{%- else %}
  <p class="ocs__callout">{{ calls_strings.text.turned_off }}</p>
</div>
{%- endif %}
