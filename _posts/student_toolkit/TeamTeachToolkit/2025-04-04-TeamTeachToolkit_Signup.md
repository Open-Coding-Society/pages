---
toc: false
layout: aesthetihawk
active_tab: teamteach
title: Team Teach Signup
permalink: /student/teamteachsignup
description: Sign up for team teach topics
---

<div class="min-h-screen bg-gray-900 text-white">
  <div class="max-w-5xl mx-auto py-10 px-4">

    <!-- Logged-in Student Info -->
    <p id="loggedInStudent" class="mb-6 text-center text-sm">Fetching student info...</p>

    <!-- Signup Form and Table -->
    <div class="border border-white rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">TEAM TEACH SIGNUP</h2>

      <!-- Input Form -->
      <div class="flex flex-col gap-4 mb-6">
        <input type="text" id="name" placeholder="Enter Team Teach Topic"
          class="w-full px-4 py-2 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white">
        <input type="date" id="dueDate"
          class="w-full px-4 py-2 bg-gray-700 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white">
        <button id="addTopicBtn"
          class="w-full border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">Add Topic</button>
      </div>

      <!-- Topics Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-white text-sm text-left">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="px-4 py-2 border border-white">Topic</th>
              <th class="px-4 py-2 border border-white">Date</th>
              <th class="px-4 py-2 border border-white">Signed Up</th>
              <th class="px-4 py-2 border border-white">Actions</th>
            </tr>
          </thead>
          <tbody id="topicsList" class="text-white"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  let loggedInStudent = null;
  let userId = -1;
  let StuName = "";

  function formatDateToMMDDYYYY(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  }

  async function getUserId() {
    const url_persons = `${javaURI}/api/person/get`;
    try {
      const response = await fetch(url_persons, fetchOptions);
      if (!response.ok) throw new Error(`Spring server response: ${response.status}`);
      const data = await response.json();
      userId = data.id;
      StuName = data.name;
      document.getElementById("loggedInStudent").innerText = `Logged in as: ${StuName}`;
      fetchTopics();
    } catch (error) {
      console.error("Java Database Error:", error);
      document.getElementById("loggedInStudent").innerText = "Error fetching student info.";
    }
  }

  async function fetchTopics() {
    try {
      let response = await fetch(`${javaURI}/api/assignments/debug`, fetchOptions);
      let topics = await response.json();
      let filteredTopics = topics.filter(topic => topic.type === "teamteach");

      let topicsList = document.getElementById("topicsList");
      topicsList.innerHTML = ""; // Clear previous topics

      // Wait for all fetchAssignTopics calls to complete
      await Promise.all(filteredTopics.map(topic => fetchAssignTopics(topic)));

    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }

  async function fetchAssignTopics(topic) {
    try {
      let response = await fetch(`${javaURI}/api/submissions/assignment/${topic.id}`, fetchOptions);
      let data = await response.json();
      let assignments = Array.isArray(data) ? data : [];

      let studentsSet = new Set();
      let studentsTextArray = [];

      assignments.forEach(assignment => {
        if (Array.isArray(assignment.students)) {
          assignment.students.forEach(s => {
            if (!studentsSet.has(s.id)) {
              studentsSet.add(s.id);
              studentsTextArray.push(`${s.name} (${s.id})`);
            }
          });
        } else if (assignment.students && typeof assignment.students === 'string') {
          assignment.students.split(',').forEach(name => {
            if (!studentsSet.has(name.trim())) {
              studentsSet.add(name.trim());
              studentsTextArray.push(name.trim());
            }
          });
        }
      });

      const studentsText = studentsTextArray.length > 0 ? studentsTextArray.join(', ') : "None";
      const alreadySignedUp = studentsSet.has(userId);

      let row = document.createElement("tr");
      row.innerHTML = `
        <td class="border border-white px-4 py-2">${topic.name}</td>
        <td class="border border-white px-4 py-2">${topic.dueDate}</td>
        <td class="border border-white px-4 py-2">${studentsText}</td>
        <td class="border border-white px-4 py-2">
          <button 
            class="border border-white px-3 py-1 rounded text-sm transition ${alreadySignedUp ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}" 
            data-topic-id="${topic.id}"
            ${alreadySignedUp ? 'disabled' : ''}>
            ${alreadySignedUp ? 'Signed Up' : 'Sign Up'}
          </button>
        </td>
      `;

      if (!alreadySignedUp) {
        row.querySelector("button").addEventListener("click", function () {
          signUpForTopic(topic.id);
        });
      }

      document.getElementById("topicsList").appendChild(row);

    } catch (error) {
      console.error("Error fetching topic assignments:", error);
    }
  }

  async function addTopic() {
    let name = document.getElementById("name").value;
    let rawDate = document.getElementById("dueDate").value;

    if (!name || !rawDate) {
      alert("Please fill in all fields.");
      return;
    }

    let dueDate = formatDateToMMDDYYYY(rawDate);

    const url = `${javaURI}/api/assignments/create?name=${encodeURIComponent(name)}&type=teamteach&description=test&points=1.0&dueDate=${encodeURIComponent(dueDate)}`;

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        document.getElementById("name").value = "";
        document.getElementById("dueDate").value = "";
        fetchTopics(); // Refresh list
      } else {
        console.error("Failed to add topic");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  }

  async function signUpForTopic(id) {
    if (userId === -1) {
      alert("Please login first");
      return;
    }

    const data = {
      assignmentId: id,
      studentIds: [userId],
      content: "test",
      comment: "",
      isLate: false
    };

    try {
      let response = await fetch(`${javaURI}/api/submissions/submit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchTopics();
      } else {
        console.error("Failed to sign up for topic");
        alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up for topic:", error);
      alert("Error signing up. Please try again.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    getUserId();
    document.getElementById("addTopicBtn").addEventListener("click", addTopic);
  });
</script>
