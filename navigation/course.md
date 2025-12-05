---
layout: courses
title: Courses
description: Your enrolled courses
search_exclude: true
permalink: /navigation/courses/
---


## My Courses

<div id="userCourses" style="text-align:center;">
    <p>Loading your courses...</p>
</div>

<script type="module">
    import { pythonURI, baseurl } from '{{site.baseurl}}/assets/js/api/config.js';

    async function displayUserCourses() {
        const container = document.getElementById('userCourses');
        
        try {
            const response = await fetch(`${pythonURI}/api/user/class`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                container.innerHTML = '<p>Please log in to view your courses.</p>';
                return;
            }

            const data = await response.json();
            const classes = data.class || [];

            if (classes.length === 0) {
                container.innerHTML = `
                    <p>You are not enrolled in any courses yet.</p>
                    <p><a href="${baseurl}/profile">Go to your Profile</a> to set your course.</p>
                `;
                return;
            }

            const courseMap = {
                'CSSE': { name: 'CSSE', url: '{{site.baseurl}}/navigation/section/csse' },
                'CSP': { name: 'APCSP', url: '{{site.baseurl}}/navigation/section/csp' },
                'CSA': { name: 'APCSA', url: '{{site.baseurl}}/navigation/section/csa' }
            };

            let tableHTML = '<table style="width:100%; text-align:center;"><tr>';
            classes.forEach(cls => {
                if (courseMap[cls]) {
                    tableHTML += `<td><a href="${courseMap[cls].url}">${courseMap[cls].name}</a></td>`;
                }
            });
            tableHTML += '</tr></table>';
            container.innerHTML = tableHTML;

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<p>Error loading courses. Please try again later.</p>';
        }
    }

    displayUserCourses();
</script>