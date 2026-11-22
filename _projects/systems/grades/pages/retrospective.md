---
layout: opencsplus
title: Retrospective
permalink: /retrospective
active_tab: retrospective
sidebar: grades_sidebar
sidebar_project: grades
opencsplus: true
comments: false
---

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD033 -->

{::nomarkdown}
<!-- Fonts loaded globally via head-custom.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.css" />
<style>
    /* Page chrome only; the panels style themselves (sr-* and fr-*). */
    .retro-intro { margin: 0; max-width: 62rem; font-size: .92rem; opacity: .75; }
</style>
<div class="w-full">
    <div class="space-y-4 sm:space-y-6">
        <p class="retro-intro">Three views of the same loop: reflect on the sprint you just finished, see how your ranks move across the year, then check your forecasts against what happened.</p>
        <!-- Sprint Reflection -->
        <div id="retro-panel-sprint" data-section="sprint" class="retro-panel px-6 py-4 text-neutral-200" hidden></div>

        <!-- Growth Over Time -->
        <div id="retro-panel-growth" data-section="growth" class="retro-panel px-6 py-4 text-neutral-200" hidden></div>

        <!-- Forecast Retrospective -->
        <div id="retro-panel-forecast" data-section="forecast" class="retro-panel px-6 py-4 text-neutral-200" hidden></div>
    </div>
</div>

<!-- The calendar's weeks, so a teacher's visit can add the calendar's sprints; sprints can also be added by hand -->
<script type="application/json" id="retro-school-calendar">{{ site.data.school_calendar.weeks | jsonify }}</script>
<script src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"></script>
<script type="module">
    import { initSprintReflection, initGrowthOverTime } from '{{ site.baseurl }}/assets/js/projects/grades/analytics/sprint-retrospective.js';
    import { initForecastRetrospective, refreshForecastRetrospective } from '{{ site.baseurl }}/assets/js/projects/grades/analytics/forecast-retrospective.js';
    import { followSectionHash } from '{{ site.baseurl }}/assets/js/pages/viewer/section-navigation.js';

    // Each panel loads the first time it opens; the forecast panel refreshes on every visit
    // because Smart Predict on the analytics dashboard may have logged a forecast since.
    const started = new Set();
    const loaders = {
        sprint: () => initSprintReflection(document.getElementById('retro-panel-sprint')),
        growth: () => initGrowthOverTime(document.getElementById('retro-panel-growth')),
        forecast: () => initForecastRetrospective(document.getElementById('retro-panel-forecast')),
    };

    async function show(panel) {
        document.querySelectorAll('.retro-panel').forEach((el) => { el.hidden = el.id !== `retro-panel-${panel}`; });
        if (!started.has(panel)) {
            started.add(panel);
            await loaders[panel]();
        } else if (panel === 'forecast') {
            await refreshForecastRetrospective();
        }
    }

    // The sidebar's Retrospective links (#sprint, #growth, #forecast) pick the panel.
    followSectionHash(Object.keys(loaders), show);
</script>
{:/}

<!-- markdownlint-restore -->
