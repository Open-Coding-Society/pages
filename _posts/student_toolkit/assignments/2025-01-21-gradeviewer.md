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
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-700">
            <!-- Grade rows will be dynamically added here -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    function populateTable(rows) {
        const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";

        rows.forEach(([grade, assignmentName]) => {
            let row = tableBody.insertRow();
            let cell1 = row.insertCell(0);
            cell1.className = "border border-white px-4 py-2";
            cell1.textContent = assignmentName;
            let cell2 = row.insertCell(1);
            cell2.className = "border border-white px-4 py-2";
            cell2.textContent = grade;
        });

        if (rows.length > 0) {
            const total = rows.reduce((sum, [g]) => sum + parseFloat(g), 0);
            const average = (total / rows.length).toFixed(2);
            let avgRow = tableBody.insertRow();
            avgRow.classList.add("border", "border-white");
            let c1 = avgRow.insertCell(0);
            c1.className = "border border-white px-4 py-2 font-bold";
            c1.textContent = "Average";
            let c2 = avgRow.insertCell(1);
            c2.className = "border border-white px-4 py-2 font-bold";
            c2.textContent = average;
        }
    }

    async function loadGrades() {
        try {
            // Get current user's ID
            const personResp = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (!personResp.ok) throw new Error(`Could not get user: ${personResp.status}`);
            const person = await personResp.json();
            const userId = person.id;

            // Fetch grade map for this user: { assignmentId: grade }
            const gradeResp = await fetch(`${javaURI}/api/synergy/grades/map/${userId}`, fetchOptions);
            if (!gradeResp.ok) throw new Error(`Could not get grades: ${gradeResp.status}`);
            const gradeMap = await gradeResp.json(); // { "42": 0.95, "7": 0.88, ... }

            const assignmentIds = Object.keys(gradeMap);
            if (assignmentIds.length === 0) {
                const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
                tableBody.innerHTML = '<tr><td colspan="2" class="px-4 py-4 text-center text-gray-400">No grades yet.</td></tr>';
                return;
            }

            // Resolve assignment names in parallel
            const rows = await Promise.all(assignmentIds.map(async (aId) => {
                try {
                    const aResp = await fetch(`${javaURI}/api/assignments/${aId}`, fetchOptions);
                    const name = aResp.ok ? await aResp.text() : `Assignment ${aId}`;
                    return [gradeMap[aId], name.replace(/^"|"$/g, '')];
                } catch {
                    return [gradeMap[aId], `Assignment ${aId}`];
                }
            }));

            populateTable(rows);
        } catch (error) {
            console.error('Error loading grades:', error);
            const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = '<tr><td colspan="2" class="px-4 py-4 text-center text-red-400">Failed to load grades. Please log in and try again.</td></tr>';
        }
    }

    window.onload = loadGrades;
</script>
