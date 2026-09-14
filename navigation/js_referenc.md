---
layout: opencs
title: Language Reference
description: Search and browse language lessons, references, and interactive examples.
search_exclude: true
permalink: /navigation/js-reference/
---

<!-- markdownlint-disable MD033 MD046 -->

<script type="text/javascript" src="{{ '/assets/js/search.js' | relative_url }}"></script>
<script type="text/javascript" src="{{ '/assets/js/vendor/lunr.min.js' | relative_url }}"></script>

<div class="ocs__container" id="language-reference">
    <div class="ocs__badge">Lessons · Reference and Interactive Work</div>
    <h1>Language Reference</h1>
    <p class="ocs__description">Browse by language, then use the search below to find a specific lesson or concept.</p>

    <nav class="ocs__links ocs__links--wide" aria-label="Language reference navigation">
        <a class="ocs__btn pill accent fill" href="#javascript" aria-current="page">JavaScript</a>
        <a class="ocs__btn pill" href="#python">Python</a>
        <a class="ocs__btn pill" href="#java">Java</a>
    </nav>

    <div class="search" aria-label="Search language lessons">
        <div class="search-input-wrap">
            <input type="text" class="js-search-input search-input input-block form-control" tabindex="0" placeholder="Search language lessons" aria-label="Search language lessons" autocomplete="off">
        </div>
        <div class="js-search-results search-results-wrap"></div>
    </div>

    <section id="javascript" aria-labelledby="javascript-title">
        <h2 class="ocs__section-title" id="javascript-title">JavaScript</h2>
        <p class="ocs__description">Reference material and interactive examples from the JavaScript lesson collection.</p>

        {% assign javascript_lessons = site.categories.JavaScript | where_exp: "lesson", "lesson.hide != true" | sort: "title" %}
        {% if javascript_lessons.size > 0 %}
        <div class="ocs__grid ocs__grid--card cols-3">
            {% for lesson in javascript_lessons %}
            <article class="ocs__grid-cell">
                <span class="ocs__status-pill ocs__status-pill--neutral">{{ lesson.lesson_part | default: "reference" }}</span>
                <h3>{{ lesson.title }}</h3>
                {% if lesson.description %}<p>{{ lesson.description }}</p>{% endif %}
                {% if lesson.lesson_topic %}<p><strong>Topic:</strong> {{ lesson.lesson_topic }}</p>{% endif %}
                <a class="ocs__btn accent fill" href="{{ lesson.url | relative_url }}">Open lesson</a>
            </article>
            {% endfor %}
        </div>
        {% else %}
        <div class="ocs__callout">JavaScript lesson cards will appear here as categorized source notebooks are published.</div>
        {% endif %}
    </section>

    <section id="python" aria-labelledby="python-title">
        <h2 class="ocs__section-title" id="python-title">Python</h2>
        <div class="ocs__card">
            <span class="ocs__status-pill ocs__status-pill--warn">Coming soon</span>
            <p>Python reference and interactive Code Runner lessons will be added here.</p>
        </div>
    </section>

    <section id="java" aria-labelledby="java-title">
        <h2 class="ocs__section-title" id="java-title">Java</h2>
        <div class="ocs__card">
            <span class="ocs__status-pill ocs__status-pill--warn">Coming soon</span>
            <p>Java reference and interactive Code Runner lessons will be added here.</p>
        </div>
    </section>
</div>

<!-- markdownlint-enable MD033 MD046 -->
