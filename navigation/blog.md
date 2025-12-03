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

<table style="width:100%; text-align:center;" id="classTable">
    <tr>
        <td id="csse-cell" style="display:none;"><a href="{{site.baseurl}}/navigation/section/csse">CSSE</a></td>
        <td id="csp-cell" style="display:none;"><a href="{{site.baseurl}}/navigation/section/csp">APCSP</a></td>
        <td id="csa-cell" style="display:none;"><a href="{{site.baseurl}}/navigation/section/csa">APCSA</a></td>
    </tr>
</table>

<p id="noClassMessage" style="text-align:center; color:#666;">Loading class information...</p>

## Course Materials

<!-H- Auto Generated Blogs -->

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch user data from the API
        const response = await fetch(pythonURI + '/api/id', {
            ...fetchOptions,
            credentials: 'include'
        });

        if (!response.ok) {
            // User is not authenticated - show all classes
            showAllClasses();
            return;
        }

        const userData = await response.json();
        const userClasses = userData.class || [];

        // Map class abbreviations to cell IDs
        const classMapping = {
            'CSSE': 'csse-cell',
            'CSP': 'csp-cell',
            'CSA': 'csa-cell'
        };

        // Show/hide cells based on user's classes
        let hasClasses = false;
        for (const [classAbbr, cellId] of Object.entries(classMapping)) {
            const cell = document.getElementById(cellId);
            if (userClasses.includes(classAbbr)) {
                cell.style.display = '';
                hasClasses = true;
            } else {
                cell.style.display = 'none';
            }
        }

        // Hide or show the "no class" message
        const noClassMessage = document.getElementById('noClassMessage');
        if (hasClasses) {
            noClassMessage.style.display = 'none';
        } else {
            noClassMessage.textContent = 'No classes assigned. Please contact your instructor.';
            noClassMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        // On error, show all classes as fallback
        showAllClasses();
    }
});

function showAllClasses() {
    const classMapping = {
        'CSSE': 'csse-cell',
        'CSP': 'csp-cell',
        'CSA': 'csa-cell'
    };

    for (const cellId of Object.values(classMapping)) {
        document.getElementById(cellId).style.display = '';
    }

    const noClassMessage = document.getElementById('noClassMessage');
    noClassMessage.style.display = 'none';
}
</script>
