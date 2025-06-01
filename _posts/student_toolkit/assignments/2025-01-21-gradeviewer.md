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
    let userId = -1;
    let grades = [];

    function populateTable(grades) {
        const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = "";

        grades.forEach(stugrade => {
            let row = tableBody.insertRow();

            let cell1 = row.insertCell(0);
            cell1.className = "border border-white px-4 py-2";
            cell1.textContent = stugrade[1];

            let cell2 = row.insertCell(1);
            cell2.className = "border border-white px-4 py-2";
            cell2.textContent = stugrade[0];
        });

        displayAverage(grades);
    }

    function displayAverage(grades) {
        let total = 0;
        let count = grades.length;

        grades.forEach(stugrade => {
            total += parseFloat(stugrade[0]); 
        });

        let average = (total / count).toFixed(2); 

        const tableBody = document.getElementById("gradesTable").getElementsByTagName("tbody")[0];
        let averageRow = tableBody.insertRow();
        averageRow.classList.add("border", "border-white");

        let cell1 = averageRow.insertCell(0);
        cell1.className = "border border-white px-4 py-2 font-bold";
        cell1.textContent = "Average";

        let cell2 = averageRow.insertCell(1);
        cell2.className = "border border-white px-4 py-2 font-bold";
        cell2.textContent = average;
    }

    async function getUserId() {
        const url_persons = `${javaURI}/api/person/get`;
        await fetch(url_persons, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Spring server response: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                userId = data.id;
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }

    async function fetchAssignmentbyId(assignmentId) {
        try {
            const response = await fetch(javaURI + "/api/assignments/" + String(assignmentId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch assignments: ${response.statusText}`);
            }

            const assignment = await response.text();
            return assignment;  

        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }

    async function getGrades() {
        const urlGrade = javaURI + '/api/synergy/grades';

        try {
            const response = await fetch(urlGrade, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to get data: ' + response.statusText);
            }

            const data = await response.json();
            await getUserId();  

            for (const grade of data) {
                if (grade.studentId == userId) {
                    let stugrade = [];
                    stugrade.push(grade.grade);
                    
                    const assignmentDetails = await fetchAssignmentbyId(grade.assignmentId);
                    stugrade.push(assignmentDetails);
                    
                    grades.push(stugrade);
                }
            }

            populateTable(grades);

        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    }

    window.onload = async function() {
        await getUserId();
        await getGrades(); 
    };
</script>
