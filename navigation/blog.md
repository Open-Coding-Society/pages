---
layout: blogs 
title: Blogs
description: This page contains reference materials, learning resources, and course content for Computer Science Education programs including CSSE, AP Computer Science Principles, AP Computer Science A, and Computer Science Honors.
search_exclude: true
permalink: /navigation/blogs/
---

## Course Objectives

- Review your course regularly to align with Sprint Objectives
- Each section organizes content into focused sprints with specific timelines

<!-- markdownlint-disable MD033 MD046 MD009 -->
<div id="courseLinks" class="ocs__grid" style="margin-bottom: 1.25rem;">
  <div class="ocs__grid-cell">
    <div class="ocs__links ocs__links--wide">
      <a href="{{site.baseurl}}/navigation/courses/csse" class="ocs__btn pill">CSSE</a>
      <a href="{{site.baseurl}}/navigation/courses/csp" class="ocs__btn pill">CSP</a>
      <a href="{{site.baseurl}}/navigation/courses/csa" class="ocs__btn pill">CSA</a>
      <a href="{{site.baseurl}}/navigation/courses/csh" class="ocs__btn pill">CSH</a>
    </div>
  </div>
</div>

<script type="module">
    import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    async function displayUserCourses() {
        const container = document.getElementById('courseLinks');

        function renderCourses(courseList) {
            const courseMap = {
                'CSSE': { name: 'CSSE', url: '{{site.baseurl}}/navigation/courses/csse' },
                'CSP':  { name: 'CSP',  url: '{{site.baseurl}}/navigation/courses/csp' },
                'APCSP':{ name: 'CSP',  url: '{{site.baseurl}}/navigation/courses/csp' },
                'CSA':  { name: 'CSA',  url: '{{site.baseurl}}/navigation/courses/csa' },
                'APCSA':{ name: 'CSA',  url: '{{site.baseurl}}/navigation/courses/csa' },
                'CSH':  { name: 'CSH',  url: '{{site.baseurl}}/navigation/courses/csh' }
            };

            const order = ['CSSE', 'CSP', 'CSA', 'CSH'];
            const displayCourses = courseList.length > 0
                ? order.filter(c => courseList.includes(c))
                : order;

            let html = '<div class="ocs__grid-cell"><div class="ocs__links ocs__links--wide">';
            displayCourses.forEach(cls => {
                if (courseMap[cls]) {
                    html += `<a href="${courseMap[cls].url}" class="ocs__btn pill">${courseMap[cls].name}</a>`;
                }
            });
            html += '</div></div>';
            container.innerHTML = html;
        }

        try {
            const response = await fetch(`${pythonURI}/api/user/class`, fetchOptions);
            if (!response.ok) return;

            const data = await response.json();
            const classes = data.class || [];
            if (classes.length > 0) {
                renderCourses(classes);
            }
        } catch (error) {
            console.error('Error fetching user courses:', error);
        }
    }

    displayUserCourses();
</script>
<!-- markdownlint-enable MD033 MD046 MD009 -->

## Course Materials
