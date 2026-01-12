---
layout: aesthetihawk
active_tab: graderview
title: Grader View
type: issues
permalink: /student/assign-grades
comments: false
---

<div class="p-6 text-gray-100">
  <table class="w-full mt-6 border-collapse rounded-lg overflow-hidden bg-gray-900">
    <thead>
      <tr class="bg-gray-800">
        <th class="p-3 text-left font-semibold">Name</th>
        <th class="p-3 text-left font-semibold">Type</th>
        <th class="p-3 text-left font-semibold">Description</th>
        <th class="p-3 text-left font-semibold">Points</th>
        <th class="p-3 text-left font-semibold">Due Date</th>
        <th class="p-3 text-left font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody id="assignmentList" class="bg-gray-700 divide-y divide-gray-800">
      <!-- Populated dynamically -->
    </tbody>
  </table>
  <div id="assignmentSpinner" class="flex justify-center mt-4 hidden">
    <div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
</div>

<!-- Submissions Modal -->
<div id="submissionsModal" class="fixed inset-0 z-50 bg-black bg-opacity-70 hidden flex items-center justify-center">
  <div class="relative bg-gray-800 p-6 rounded-lg w-11/12 max-w-5xl max-h-[80vh] overflow-y-auto">
    <button class="absolute top-3 right-4 text-white text-2xl hover:text-red-400" onclick="closeSubmissionsModal()">
      &times;
    </button>

    <h2 id="assignmentNameHeader" class="text-xl font-bold text-gray-100 mb-4">Submissions</h2>

    <table id="submissionsTable" class="w-full border-collapse bg-gray-900 text-gray-100">
      <thead>
        <tr class="bg-gray-800">
          <th class="p-3 text-left font-semibold">Student Name</th>
          <th class="p-3 text-left font-semibold">Submission Content</th>
          <th class="p-3 text-left font-semibold">Comments</th>
          <th class="p-3 text-left font-semibold">Current Grade</th>
          <th class="p-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody id="submissionsList" class="bg-gray-700 divide-y divide-gray-800">
        <!-- Filled dynamically -->
      </tbody>
    </table>

    <!-- Spinner -->
    <div id="submissionsSpinner" class="flex justify-center mt-4 hidden">
      <div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  document.addEventListener('DOMContentLoaded', fetchAssignments);

  function fetchAssignments() {
    document.getElementById('assignmentSpinner').classList.remove('hidden');
    fetch(`${javaURI}/api/assignments/assigned`, fetchOptions)
      .then(response => response.json())
      .then(assignments => {
        const assignmentList = document.getElementById('assignmentList');
        assignmentList.innerHTML = '';
        if (assignments.length === 0) {
          assignmentList.innerHTML = '<tr><td colspan="6" class="p-3">No assignments found</td></tr>';
        } else {
          assignments.forEach(assignment => {
            const row = document.createElement('tr');
            row.classList.add("hover:bg-gray-600");
            row.innerHTML = `
              <td class="p-3">${assignment.name}</td>
              <td class="p-3">${assignment.type}</td>
              <td class="p-3">${assignment.description}</td>
              <td class="p-3">${assignment.points}</td>
              <td class="p-3">${assignment.dueDate}</td>
              <td class="p-3">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onclick="viewSubmissions(${assignment.id}, '${assignment.name}')">View Submissions</button>
              </td>
            `;
            assignmentList.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
        alert('Failed to fetch assignments');
      })
      .finally(() => {
        document.getElementById('assignmentSpinner').classList.add('hidden');
      });
  }

  window.viewSubmissions = function(assignmentId, assignmentName) {
    document.getElementById('submissionsSpinner').classList.remove('hidden');
    document.getElementById('submissionsList').innerHTML = '';
    fetch(`${javaURI}/api/assignments/${assignmentId}/submissions`, fetchOptions)
      .then(response => response.json())
      .then(submissions => {
        document.getElementById('assignmentNameHeader').textContent = `Submissions for: ${assignmentName}`;
        const submissionsList = document.getElementById('submissionsList');
        if (submissions.length === 0) {
          submissionsList.innerHTML = '<tr><td colspan="5" class="p-3">No submissions found</td></tr>';
        } else {
          submissions.forEach(submission => {
            var name = submission.submitter.name;
            const row = document.createElement('tr');
            row.innerHTML = `
              <td class="p-3">${name}</td>
              <td class="p-3">${submission.content || 'No content'}</td>
              <td class="p-3">${submission.comment || 'No comments'}</td>
              <td class="p-3">${submission.grade || 'Not graded'}</td>
              <td class="p-3">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onclick="gradeAssignment(${submission.assignment.id}, ${submission.submitter.id}, ${submission.isGroup})">Grade</button>
              </td>
            `;
            submissionsList.appendChild(row);
          });
        }
        document.getElementById('submissionsModal').classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error fetching submissions:', error);
        alert('Failed to fetch submissions: ' + error.message);
      })
      .finally(() => {
        document.getElementById('submissionsSpinner').classList.add('hidden');
      });
  }

  window.closeSubmissionsModal = function() {
    document.getElementById('submissionsModal').classList.add('hidden');
  }

  window.gradeAssignment = function(assignmentId, submitterId, isGroup) {
    let gradeSuggestion;
    do {
      gradeSuggestion = prompt("What grade do you want to give?");
      if (gradeSuggestion === null) return;
    } while (isNaN(gradeSuggestion = parseFloat(gradeSuggestion)));

    const explanation = prompt("Why do you want to give this grade?");
    if (explanation === null) return;

    fetch(`${javaURI}/api/synergy/grades/requests`, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        submitterId: submitterId,
        isGroup: isGroup,
        assignmentId: assignmentId,
        gradeSuggestion: gradeSuggestion,
        explanation: explanation
      })
    })
      .then(res => res.text())
      .then(() => alert("Created grade request for student! Pending approval..."))
      .catch(err => {
        console.error(err);
        alert("Failed to grade submission");
      });
  }
</script>