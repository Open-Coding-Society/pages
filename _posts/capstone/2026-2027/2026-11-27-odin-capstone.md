---
microblog: true
toc: false
layout: post
title: ODIN Diagnostics
description: A website for ODIN Diagnostics, makers of an eye-tracking concussion assessment headset. Built on the OCS Pages template, with every page's content served by a Flask backend.
permalink: /capstone/odin/
capstone_project:
  course: CSP
  school_year: "2026-2027"
  title: "ODIN Diagnostics"
  description: "Website for ODIN Diagnostics, makers of an eye-tracking headset for concussion assessments. The Jekyll frontend handles layout with OCS SASS, and a Flask backend serves every page's text and images."
  team: "Aryan M, Chetan T, Ryden B, Aarav N, Ishaan S"
  links:
    frontend: https://github.com/Open-Coding-Society/ODIN_Frontend
    backend: https://github.com/Open-Coding-Society/ODIN_Backend
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.odin_infograph %}
{% comment %}
  Capstone page body for /capstone/odin/ (ODIN website team).
  Built only from shared ocs__ grammar (_sass/open-coding/elements): no page-specific classes or styles.
  All text lives in _data/odin_infograph.yml.
{% endcomment %}
<div class="ocs__container">

<div class="ocs__card">
<div class="ocs__badge">Capstone</div>
<p class="ocs__lead">{{ data.Tagline | escape }}</p>
<p>{{ data.Description | escape }}</p>
<div class="ocs__links">
{% for link in data.Links %}<a class="ocs__btn medium{% if forloop.first %} alert-green fill{% endif %}" href="{{ link.url }}" target="_blank" rel="noopener noreferrer">{{ link.label | escape }}</a>
{% endfor %}</div>
<div class="ocs__stats">
<div class="ocs__stat"><span class="ocs__stat-value">{{ data.Team | size }}</span><span class="ocs__stat-label">team members</span></div>
<div class="ocs__stat"><span class="ocs__stat-value">{{ data.Pages | size }}</span><span class="ocs__stat-label">site pages</span></div>
<div class="ocs__stat"><span class="ocs__stat-value">{{ data.Api | size }}</span><span class="ocs__stat-label">API endpoints</span></div>
</div>
<div class="ocs__split">
<div class="ocs__visual"><div class="ocs__team"><span class="ocs__team-label">Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div></div>
<div class="ocs__visual"><div class="ocs__team"><span class="ocs__team-label">Built with</span><span class="ocs__team-name">{% for tech in data.Stack %}<span class="ocs__status-pill">{{ tech }}</span> {% endfor %}</span></div></div>
</div>
</div>

{% if data.Board %}
{% include ocs_kanban_board.html url=data.Board.url title=data.Board.title %}
{% endif %}

<div class="ocs__card">
<h2 class="ocs__section-title">The site</h2>
<p class="ocs__lead">Each page is a shell in the frontend, filled with content from the backend.</p>
<div class="ocs__grid ocs__grid--standard">
{% for page in data.Pages %}<div class="ocs__grid-cell"><strong>{{ page.name }}</strong><br>{{ page.goal }}</div>
{% endfor %}</div>
<div class="ocs__callout"><strong>Notice:</strong> {{ data.Notice | escape }}</div>
</div>

<div class="ocs__card">
<h2 class="ocs__section-title">Frontend and backend</h2>
<div class="ocs__split">
{% for side in data.Split %}<div class="ocs__visual"><div class="ocs__team"><span class="ocs__team-label">{{ side.title }}</span>
<ul>{% for point in side.points %}<li>{{ point }}</li>{% endfor %}</ul></div></div>
{% endfor %}</div>
</div>

<div class="ocs__card">
<h2 class="ocs__section-title">Build plan</h2>
<p class="ocs__lead">Backend first, then the pages, then editing from the site.</p>
<ul class="ocs__checklist">
{% for item in data.BuildPlan %}<li{% if item.status == "done" %} class="done"{% elsif item.status == "active" %} class="open"{% endif %}><span class="ocs__checklist-box"></span><span><strong>Step {{ item.step }}: {{ item.name }}.</strong> {{ item.detail }} {% if item.status == "done" %}<span class="ocs__status-pill ocs__status-pill--good">Done</span>{% elsif item.status == "active" %}<span class="ocs__status-pill ocs__status-pill--warn">In progress</span>{% else %}<span class="ocs__status-pill ocs__status-pill--neutral">Next</span>{% endif %}</span></li>
{% endfor %}</ul>
</div>

<div class="ocs__card">
<h2 class="ocs__section-title">How the content loads</h2>
<div class="ocs__callout"><strong>Backend to page:</strong> each page asks Flask for its sections by name and draws them. The site details and images come from the same API, and none of it needs a login.</div>
<div class="ocs__grid ocs__grid--standard">
{% for endpoint in data.Api %}<div class="ocs__grid-cell"><strong><code>{{ endpoint.route }}</code></strong><br>{{ endpoint.use }}</div>
{% endfor %}</div>
</div>

</div>
<!-- markdownlint-restore -->
