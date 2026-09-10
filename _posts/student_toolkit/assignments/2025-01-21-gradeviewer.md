---
layout: aesthetihawk
active_tab: grades
title: Viewing Grades
permalink: /student/view-grades
comments: false
---

<div class="min-h-screen bg-neutral-900 py-10">
  <div class="max-w-5xl mx-auto px-4">
    <!-- Grades Card -->
    <div class="bg-neutral-800 border border-neutral-700 rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-white text-center mb-6">Your Grades</h2>
      <div class="overflow-x-auto">
        <table id="gradesTable" class="min-w-full divide-y divide-neutral-700 text-white text-sm">
          <thead class="text-white">
            <tr>
              <th class="px-4 py-2 text-left font-bold text-base">Assignment</th>
              <th class="px-4 py-2 text-left font-bold text-base">Grade</th>
              <th class="px-4 py-2 text-left font-bold text-base">Feedback</th>
              <th class="px-4 py-2 text-left font-bold text-base">Status</th>
            </tr>
          </thead>
          <tbody id="gradesTableBody" class="divide-y divide-neutral-700">
            <!-- Grade rows will be dynamically added here -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .status-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .status-graded  { background: rgb(30,64,175);  color: rgb(219,234,254); }
  .status-late    { background: rgb(153,27,27);  color: rgb(254,226,226); }
  .status-pending { background: rgb(120,53,15);  color: rgb(254,243,199); }
</style>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const tableBody = document.getElementById('gradesTableBody');

    function statusBadge(submission) {
        if (submission.grade != null) return '<span class="status-badge status-graded">Graded</span>';
        if (submission.isLate)        return '<span class="status-badge status-late">Late</span>';
        return '<span class="status-badge status-pending">Pending Review</span>';
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    async function loadGrades() {
        try {
            // Step 1: get username from user-info endpoint
            const userInfoResp = await fetch(`${javaURI}/api/assignment-submission-view/user-info`, fetchOptions);
            if (!userInfoResp.ok) throw new Error(`Could not get user info: ${userInfoResp.status}`);
            const { username } = await userInfoResp.json();

            if (!username) throw new Error('Not logged in');

            // Step 2: resolve userId from username
            const personResp = await fetch(`${javaURI}/api/person/uid/${encodeURIComponent(username)}`, fetchOptions);
            if (!personResp.ok) throw new Error(`Could not resolve user: ${personResp.status}`);
            const person = await personResp.json();
            const userId = person.id;

            // Step 3: fetch all submissions (backend filters to current user when not admin)
            const listResp = await fetch(`${javaURI}/api/assignment-submission-view/list`, fetchOptions);
            if (!listResp.ok) throw new Error(`Could not get submissions: ${listResp.status}`);
            const submissions = await listResp.json();

            // Step 4: keep only this user's submissions
            const mine = (Array.isArray(submissions) ? submissions : [])
                .filter(s => s.submitterId === userId);

            if (mine.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-400">No submissions yet.</td></tr>';
                return;
            }

            // Step 5: render rows
            tableBody.innerHTML = '';
            mine.forEach(submission => {
                const gradeDisplay = submission.grade != null
                    ? `<span style="font-weight:600;color:rgb(134,239,172);">${submission.grade}/100</span>`
                    : '<em style="color:#6b7280">—</em>';
                const feedbackDisplay = submission.feedback
                    ? escapeHtml(submission.feedback)
                    : '<em style="color:#6b7280">No feedback yet</em>';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border border-neutral-600 px-4 py-2"><strong>${escapeHtml(submission.assignmentName || 'Unknown')}</strong></td>
                    <td class="border border-neutral-600 px-4 py-2">${gradeDisplay}</td>
                    <td class="border border-neutral-600 px-4 py-2">${feedbackDisplay}</td>
                    <td class="border border-neutral-600 px-4 py-2">${statusBadge(submission)}</td>
                `;
                tableBody.appendChild(row);
            });

            // Step 6: average row over graded submissions only
            const graded = mine.filter(s => s.grade != null);
            if (graded.length > 0) {
                const avg = (graded.reduce((sum, s) => sum + s.grade, 0) / graded.length).toFixed(2);
                const avgRow = document.createElement('tr');
                avgRow.innerHTML = `
                    <td class="border border-neutral-600 px-4 py-2 font-bold">Average (${graded.length} graded)</td>
                    <td class="border border-neutral-600 px-4 py-2 font-bold" style="color:rgb(134,239,172);">${avg}/100</td>
                    <td class="border border-neutral-600 px-4 py-2" colspan="2"></td>
                `;
                tableBody.appendChild(avgRow);
            }

        } catch (error) {
            console.error('Error loading grades:', error);
            tableBody.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-red-400">Failed to load grades. Please log in and try again.</td></tr>';
        }
    }

    window.onload = loadGrades;
</script>
