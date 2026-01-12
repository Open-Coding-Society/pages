---
toc: false
layout: aesthetihawk
active_tab: teamteach
title: Team Teach Signup
permalink: /student/TeamTeachToolkit/signup
description: Sign up for team teach topics
---

<div class="min-h-screen bg-neutral-900 text-gray-100">
  <div class="max-w-5xl mx-auto py-10 px-4">

    <div id="tooltip" 
         style="position: fixed; background: #23272f; color: #f3f4f6; padding: 8px 12px; border-radius: 4px; pointer-events: none; opacity: 0; transition: opacity 0.2s; max-width: 300px; z-index: 1000; font-size: 0.875rem; border: 1px solid #27272a;">
    </div>

    <p id="loggedInStudent" class="mb-6 text-center text-sm text-gray-300">Fetching student info...</p>

    <div class="border border-neutral-700 rounded-lg p-6 bg-neutral-800 shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-100">TEAM TEACH SIGNUP</h2>

      <div class="flex flex-col gap-4 mb-6">
        <input type="text" id="name" placeholder="Enter Team Teach Topic"
          class="w-full px-4 py-2 text-gray-100 rounded-lg border border-gray-600 bg-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <input type="text" id="description" placeholder="Enter Topic Description"
          class="w-full px-4 py-2 text-gray-100 rounded-lg border border-gray-600 bg-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <input type="date" id="dueDate"
          class="w-full px-4 py-2 text-gray-100 rounded-lg border border-gray-600 bg-neutral-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <button id="addTopicBtn"
          class="w-full border border-indigo-500 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none transition">Add Topic</button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border border-neutral-700 text-sm text-left bg-neutral-800 rounded-lg">
          <thead class="text-gray-100 bg-neutral-700">
            <tr>
              <th class="px-4 py-2 border border-neutral-700">Topic</th>
              <th class="px-4 py-2 border border-neutral-700">Date</th>
              <th class="px-4 py-2 border border-neutral-700">Signed Up</th>
              <th class="px-4 py-2 border border-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody id="topicsList" class="text-gray-100 bg-neutral-800"></tbody>
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
    topicsList.innerHTML = "";
    await Promise.all(filteredTopics.map(topic => fetchAssignTopics(topic)));
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
}

async function fetchAssignTopics(topic) {
  try {
    let response = await fetch(`${javaURI}/api/assignments/assignedGraders/${topic.id}`, fetchOptions);
    let data = await response.json();
    let graders = Array.isArray(data) ? data : [];

    let studentsSet = new Set();
    let studentsTextArray = [];

    graders.forEach(grader => {
      if (!studentsSet.has(grader.id)) {
        studentsSet.add(grader.id);
        studentsTextArray.push(`${grader.name} (${grader.id})`);
      }
    });

    const studentsText = studentsTextArray.length > 0 ? studentsTextArray.join(', ') : "None";
    const alreadySignedUp = studentsSet.has(userId);

    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="border border-white px-4 py-2 tooltip-target" data-description="${topic.description.replace(/"/g, '&quot;')}">${topic.name}</td>
      <td class="border border-white px-4 py-2">${topic.dueDate}</td>
      <td class="border border-white px-4 py-2">${studentsText}</td>
      <td class="border border-white px-4 py-2">
        <button
          class="px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${alreadySignedUp ? 'bg-indigo-300 text-white opacity-50 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}"
          ${alreadySignedUp ? 'disabled' : ''}
          data-topic-id="${topic.id}">
          ${alreadySignedUp ? 'Signed Up' : 'Sign Up'}
        </button>
      </td>`;

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
  let description = document.getElementById("description").value;
  let rawDate = document.getElementById("dueDate").value;

  if (!name || !description || !rawDate) {
    alert("Please fill in all fields.");
    return;
  }

  // let dueDate = formatDateToMMDDYYYY(rawDate);
  let dueDate = rawDate;
  const url = `${javaURI}/api/assignments/create?name=${encodeURIComponent(name)}&type=teamteach&description=${encodeURIComponent(description)}&points=1.0&dueDate=${encodeURIComponent(dueDate)}`;

  try {
    let response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" } });
    if (response.ok) {
      document.getElementById("name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("dueDate").value = "";
      fetchTopics();
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

  if (!confirm("Are you sure you want to sign up for this topic?")) return;

  try {
    let response = await fetch(`${javaURI}/api/assignments/teamteach/signup/${id}`, {
      ...fetchOptions,
      method: "POST",
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

const tooltip = document.getElementById("tooltip");

document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("tooltip-target")) {
    const desc = e.target.getAttribute("data-description");
    if (desc) {
      tooltip.textContent = desc;
      tooltip.style.opacity = "1";
    }
  }
});

document.addEventListener("mousemove", (e) => {
  if (tooltip.style.opacity === "1") {
    let x = e.clientX + 15;
    let y = e.clientY + 15;

    if (x + tooltip.offsetWidth > window.innerWidth) {
      x = e.clientX - tooltip.offsetWidth - 15;
    }
    if (y + tooltip.offsetHeight > window.innerHeight) {
      y = e.clientY - tooltip.offsetHeight - 15;
    }

    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
  }
});

document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("tooltip-target")) {
    tooltip.style.opacity = "0";
  }
});
</script>