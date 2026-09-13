---
layout: courses
title: Courses
description: Your enrolled courses
search_exclude: true
permalink: /navigation/courses/
---

<!-- markdownlint-disable MD033 MD046 -->

<div class="ocs__container" style="max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem;">
  <div class="ocs__grid course-pill-nav" style="margin-bottom: 1.25rem;">
    <div class="ocs__grid-cell">
      <div class="ocs__links ocs__links--wide" id="coursePillLinks">
        <a id="pill-csse" href="{{site.baseurl}}/navigation/courses/csse" class="ocs__btn pill">CSSE</a>
        <a id="pill-csp" href="{{site.baseurl}}/navigation/courses/csp" class="ocs__btn pill">CSP</a>
        <a id="pill-csa" href="{{site.baseurl}}/navigation/courses/csa" class="ocs__btn pill">CSA</a>
        <a id="pill-csh" href="{{site.baseurl}}/navigation/courses/csh" class="ocs__btn pill">CSH</a>
      </div>
    </div>
  </div>

  <div id="userCourses" style="margin-top: 1rem;">
    <p>Loading your courses...</p>
  </div>
</div>

<script type="module">
    import { pythonURI, baseurl, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const COURSE_ORDER = ['CSSE', 'CSP', 'CSA', 'CSH'];
    const courseMap = {
        'CSSE': { name: 'CSSE', url: '{{site.baseurl}}/navigation/courses/csse' },
        'CSP':  { name: 'CSP',  url: '{{site.baseurl}}/navigation/courses/csp' },
        'APCSP':{ name: 'CSP',  url: '{{site.baseurl}}/navigation/courses/csp' },
        'CSA':  { name: 'CSA',  url: '{{site.baseurl}}/navigation/courses/csa' },
        'APCSA':{ name: 'CSA',  url: '{{site.baseurl}}/navigation/courses/csa' },
        'CSH':  { name: 'CSH',  url: '{{site.baseurl}}/navigation/courses/csh' }
    };

    function normalizeCourse(name) {
        if (!name) return '';
        const upper = String(name).toUpperCase().trim();
        if (upper === 'APCSP' || upper === 'CSP') return 'CSP';
        if (upper === 'APCSA' || upper === 'CSA') return 'CSA';
        if (upper === 'CSSE') return 'CSSE';
        if (upper === 'CSH') return 'CSH';
        return upper;
    }

    async function routeOrDisplayCourses() {
        const container = document.getElementById('userCourses');

        try {
            const response = await fetch(`${pythonURI}/api/user/class`, fetchOptions);

            if (!response.ok) {
                container.innerHTML = `
                    <div class="ocs__card">
                        <h3 class="ocs__section-title">Select a Course</h3>
                        <p>Please <a href="${baseurl}/login" style="color: var(--pref-accent-color); text-decoration: underline;">log in</a> to be routed directly to your enrolled course, or choose a course from the menu above.</p>
                    </div>
                `;
                return;
            }

            const data = await response.json();
            const rawClasses = Array.isArray(data.class) ? data.class : (data.class ? [data.class] : []);
            const enrolled = rawClasses.map(normalizeCourse).filter(c => COURSE_ORDER.includes(c));

            if (enrolled.length === 0) {
                container.innerHTML = `
                    <div class="ocs__card">
                        <h3 class="ocs__section-title">No Enrolled Courses</h3>
                        <p>You are not enrolled in any courses yet.</p>
                        <p><a href="${baseurl}/profile" style="color: var(--pref-accent-color); text-decoration: underline;">Go to your Profile</a> to set your course, or choose a course from the menu above.</p>
                    </div>
                `;
                return;
            }

            // If enrolled in a single course -> go directly to that course
            if (enrolled.length === 1) {
                const singleCourse = enrolled[0];
                const dest = courseMap[singleCourse]?.url;
                if (dest) {
                    window.location.replace(dest);
                    return;
                }
            }

            // If enrolled in multiple courses -> go to lowest course in order CSSE, CSP, CSA, CSH
            const lowest = COURSE_ORDER.find(c => enrolled.includes(c));
            if (lowest && courseMap[lowest]?.url) {
                window.location.replace(courseMap[lowest].url);
                return;
            }

            // Fallback display if redirection doesn't occur
            container.innerHTML = `
                <div class="ocs__card">
                    <h3 class="ocs__section-title">Your Enrolled Courses</h3>
                    <p>Select a course from the menu above.</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading courses:', error);
            container.innerHTML = `
                <div class="ocs__card">
                    <h3 class="ocs__section-title">Select a Course</h3>
                    <p>Select a course from the menu above, or try logging in again.</p>
                </div>
            `;
        }
    }

    routeOrDisplayCourses();
</script>

<!-- markdownlint-enable MD033 MD046 -->