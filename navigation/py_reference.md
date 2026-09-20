---
layout: opencs
title: Python Reference
description: Search and browse Python lessons, references, and interactive examples.
search_exclude: true
permalink: /navigation/py-reference/
---

<!-- markdownlint-disable MD033 MD046 -->

<script type="text/javascript" src="{{ '/assets/js/search.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/vendor/lunr.min.js' | relative_url }}"></script>

<div class="ocs__container" id="language-reference">
    <div class="ocs__badge">Lessons · Python</div>
    <h1>Python Reference</h1>

    <div class="language-reference__toolbar">
        <div class="language-reference__search search" aria-label="Search Python lessons">
            <div class="search-input-wrap">
                <input type="text" class="js-search-input search-input input-block form-control" placeholder="Search Python lessons" aria-label="Search Python lessons" autocomplete="off">
            </div>
            <div class="js-search-results search-results-wrap"></div>
        </div>
        <nav class="ocs__links ocs__links--wide" aria-label="Language reference navigation">
            <a class="ocs__btn pill" href="{{ '/navigation/js-reference/' | relative_url }}">JavaScript</a>
            <a class="ocs__btn pill accent fill" href="{{ '/navigation/py-reference/' | relative_url }}" aria-current="page">Python</a>
            <a class="ocs__btn pill" href="{{ '/navigation/java-reference/' | relative_url }}">Java</a>
        </nav>
    </div>

        {% if site.categories.Python %}
            {% assign lessons = site.categories.Python | where_exp: "lesson", "lesson.hide != true" | sort: "title" %}
        {% else %}
            {% assign lessons = "" | split: "" %}
        {% endif %}
    <div class="ocs__grid ocs__grid--card cols-3">
        {% for lesson in lessons %}
        <article class="ocs__grid-cell">
            <span class="ocs__status-pill ocs__status-pill--neutral">{{ lesson.lesson_part | default: "reference" }}</span>
            <h2>{{ lesson.title }}</h2>
            {% if lesson.description %}<p>{{ lesson.description }}</p>{% endif %}
            {% if lesson.lesson_topic %}<p><strong>Topic:</strong> {{ lesson.lesson_topic }}</p>{% endif %}
            <a class="ocs__btn accent fill" href="{{ lesson.url | relative_url }}">Open lesson</a>
        </article>
        {% endfor %}
    </div>
</div>

<!-- markdownlint-enable MD033 MD046 -->