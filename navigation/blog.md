---
layout: blogs 
title: Blogs
description: This page contains reference materials, learning resources, and course content for Computer Science Education programs including CSSE, AP Computer Science Principles, and AP Computer Science A.
search_exclude: true
permalink: /navigation/blogs/
---

## Course Objectives

- Review your course regularly to align with Sprint Objectives
- Each section organizes content into focused sprints with specific timelines

<div id="courseLinks" style="text-align:center;">
    <table style="width:100%; text-align:center;">
        <tr>
            <td><a href="{{site.baseurl}}/navigation/section/csse">CSSE</a></td>
            <td><a href="{{site.baseurl}}/navigation/section/csp">APCSP</a></td>
            <td><a href="{{site.baseurl}}/navigation/section/csa">APCSA</a></td>
        </tr>
    </table>
</div>

<script type="module">
    import { pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';

    async function displayUserCourses() {
        const container = document.getElementById('courseLinks');
        
        // Function to show all courses (default)
        function showAllCourses() {
            container.innerHTML = `
                <table style="width:100%; text-align:center;">
                    <tr>
                        <td><a href="{{site.baseurl}}/navigation/section/csse">CSSE</a></td>
                        <td><a href="{{site.baseurl}}/navigation/section/csp">APCSP</a></td>
                        <td><a href="{{site.baseurl}}/navigation/section/csa">APCSA</a></td>
                    </tr>
                </table>
            `;
        }

        try {
            const response = await fetch(`${pythonURI}/api/user/class`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            // If not logged in or error, show all courses
            if (!response.ok) {
                showAllCourses();
                return;
            }

            const data = await response.json();
            const classes = data.class || [];

            // If no classes enrolled, show all courses
            if (classes.length === 0) {
                showAllCourses();
                return;
            }

            // User is logged in and has classes - show only their courses
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
            // On error, show all courses
            showAllCourses();
        }
    }

    displayUserCourses();
</script>

## Course Materials