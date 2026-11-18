---
microblog: true
toc: false
layout: post
title: OCS VR
description: OCS VR turns AP CSP Unit 4 (Computer Systems and Networks) into hands-on VR training for the Meta Quest. Students build a computer and then a network, and each mission's score is saved to a Flask backend.
permalink: /capstone/ocsvr/
capstone_project:
  course: CSP
  school_year: "2026-2027"
  title: "OCS VR"
  description: "Immersive AP CSP Unit 4 training built in Godot with OpenXR for the Meta Quest. Students assemble a computer and build a network step by step; the game checks and scores each mission and saves progress to the team's Flask backend."
  team: "Aryan M, Aaditya P, Kashyap T, Chetan T"
  links:
    frontend: https://github.com/OCSVR/frontend_pages
    backend: https://github.com/OCSVR/backend
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
{% assign data = site.data.ocsvr_infograph %}
{% comment %}
  Capstone page body for /capstone/ocsvr/ (OCS VR team).
  Built only from shared ocs__ grammar (_sass/open-coding/elements): no page-specific classes or styles.
  All text lives in _data/ocsvr_infograph.yml.
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
<div class="ocs__stat"><span class="ocs__stat-value">{{ data.Modules | size }}</span><span class="ocs__stat-label">training modules</span></div>
<div class="ocs__stat"><span class="ocs__stat-value">{{ data.Topics | size }}</span><span class="ocs__stat-label">AP CSP Unit 4 topics</span></div>
</div>
<div class="ocs__split">
<div class="ocs__visual"><div class="ocs__team"><span class="ocs__team-label">Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div></div>
<div class="ocs__visual"><div class="ocs__team"><span class="ocs__team-label">Built with</span><span class="ocs__team-name">{% for tech in data.Stack %}<span class="ocs__status-pill">{{ tech }}</span> {% endfor %}</span></div></div>
</div>
</div>

{% if data.Board %}
{% include ocs_kanban_board.html url=data.Board.url title=data.Board.title %}
{% endif %}

{% for module in data.Modules %}
<div class="ocs__card">
<h2 class="ocs__section-title">{{ module.title }}</h2>
<p class="ocs__lead">{{ module.lead }}</p>
<div class="ocs__grid ocs__grid--standard">
{% for mission in module.missions %}<div class="ocs__grid-cell"><strong>{{ mission.name }}</strong><br>{{ mission.goal }}</div>
{% endfor %}</div>
</div>
{% endfor %}

<div class="ocs__card">
<h2 class="ocs__section-title">AP CSP Unit 4</h2>
<div class="ocs__keypoints">
{% for topic in data.Topics %}<div class="ocs__keypoint"><span class="ocs__check">&#10003;</span><span>{{ topic }}</span></div>
{% endfor %}</div>
</div>

<div class="ocs__card">
<h2 class="ocs__section-title">Build plan</h2>
<p class="ocs__lead">Laptop first, then the headset, in Mr. Mortensen's order.</p>
<ul class="ocs__checklist">
{% for item in data.BuildPlan %}<li{% if item.status == "done" %} class="done"{% elsif item.status == "active" %} class="open"{% endif %}><span class="ocs__checklist-box"></span><span><strong>Step {{ item.step }}: {{ item.name }}.</strong> {{ item.detail }} {% if item.status == "done" %}<span class="ocs__status-pill ocs__status-pill--good">Done</span>{% else %}<span class="ocs__status-pill ocs__status-pill--neutral">Next</span>{% endif %}</span></li>
{% endfor %}</ul>
</div>

<div class="ocs__card">
<h2 class="ocs__section-title">How scores are saved</h2>
<div class="ocs__callout"><strong>Headset to Flask:</strong> when a mission ends, the game sends its score, attempts and time as JSON. The backend stores it per signed-in student.</div>
<div class="ocs__grid ocs__grid--standard">
{% for endpoint in data.Api %}<div class="ocs__grid-cell"><strong><code>{{ endpoint.route }}</code></strong><br>{{ endpoint.use }}</div>
{% endfor %}</div>
</div>

</div>
<!-- markdownlint-restore -->
