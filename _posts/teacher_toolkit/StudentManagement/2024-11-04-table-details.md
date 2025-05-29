---
layout: post
title: Table Details
type: issues
permalink: /teacher-toolkit/tabledetails
comments: false
---
<style>
  h2 {
      color: white;
  }
  #student-cards-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
      justify-content: center;
  }
  .student-card {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      width: 280px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  .student-card h3 {
      margin: 10px 0;
      font-size: 20px;
      color: black;
  }
  .student-card p {
      margin: 5px 0;
      font-size: 16px;
      color: black;
  }
  .student-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 10px;
  }
  .delete-button, .add-task-button {
      margin-top: 10px;
      padding: 8px 12px;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
  }
  .delete-button {
      background-color: #ff4d4d;
  }
  .add-task-button {
      background-color: #28a745;
  }
  .create-button {
      margin: 20px auto;
      padding: 10px 30px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: block;
      font-size: 16px;
      font-weight: bold;
  }
  /* Progress bar container */
  #progress-bar-container {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 25px;
      margin: 20px 0;
      height: 25px;
  }

  /* Actual progress */
  #progress-bar {
      height: 100%;
      background-color: #28a745;
      border-radius: 25px;
      text-align: center;
      line-height: 25px;
      color: white;
      font-weight: bold;
      width: 0; /* Initial value */
      transition: width 0.5s ease-in-out;
  }
</style>

<h2 id="page-title">Students in Table</h2>
<div id="progress-bar-container">
    <div id="progress-bar">0%</div>
</div>
<div style="margin: 20px;">
    <input
        id="usernameInput"
        type="text"
        placeholder="Enter username"
        style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 5px; border: 1px solid #ddd;"
    />
    <textarea
        id="dailyActivityInput"
        rows="2"
        placeholder="Enter daily activity"
        style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 5px; border: 1px solid #ddd;"
    ></textarea>
    <button
        class="create-button"
        onclick="saveDailyActivityForUser()"
        style="padding: 10px 20px; font-size: 16px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;"
    >
        Save Activity
    </button>
</div>
<div id="student-cards-container"></div>
<button class="create-button" onclick="createStudent()">Create Student</button>
<div id="rating-section" style="margin-top: 20px; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
    <h2>Rate Student</h2>
    <input type="text" id="rating-username" placeholder="Enter username to rate" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
        <div>
            <label for="communication">Communication:</label><br>
            <select id="communication" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        <div>
            <label for="teamwork">Teamwork:</label><br>
            <select id="teamwork" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        <div>
            <label for="problemSolving">Problem Solving:</label><br>
            <select id="problemSolving" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        <div>
            <label for="creativity">Creativity:</label><br>
            <select id="creativity" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        <div>
            <label for="punctuality">Punctuality:</label><br>
            <select id="punctuality" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
    </div>
    <button class="create-button" onclick="rateStudent()" style="margin-top: 10px;">Submit Rating</button>
</div>

<script type="module">
  import {javaURI} from '{{site.baseurl}}/assets/js/api/config.js';
  document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    const period = urlParams.get('period');

    if (tableNumber) {
      console.log("Fetching students for table:", tableNumber);
      console.log("Fetching progress for period:", period);
      console.log(JSON.stringify({ 
          table: parseInt(tableNumber),
          period: parseInt(period)}));
      fetch(`${javaURI}/api/students/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          "table": parseInt(tableNumber),
          "period": parseInt(period)}),
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch progress");
        return response.json();
      })
      .then(progress => {
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = progress + "%";
        progressBar.textContent = progress + "%";
      })
      .catch(error => console.error("Error fetching progress:", error));

      fetch(`${javaURI}/api/students/find-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: "CSA",
          trimester: 2,
          period: parseInt(period),
          table: parseInt(tableNumber)
        })
      })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        const container = document.getElementById("student-cards-container");
        container.innerHTML = "";

        // Set the project name in the title using the first student in the list (assuming same project for the table)

        data.forEach(student => {
          const card = document.createElement("div");
          card.className = "student-card";

          fetch(`https://api.github.com/users/${student.username}`)
              .then(response => response.json())
              .then(githubData => {
                  const imageUrl = githubData.avatar_url || "default-image-url.jpg";
                  card.innerHTML = `
                      <img src="${imageUrl}" alt="${student.username}'s Profile Picture" class="student-image">
                      <h3>Username: ${student.username}</h3>
                      <p>Table Number: ${student.tableNumber}</p>
                      <p>Course: ${student.course}</p>
                      <p>Trimester: ${student.trimester}</p>
                      <p>Period: ${student.period}</p>
                      <p>
                          <strong>Tasks:</strong> 
                          ${student.tasks.length > 0 
                              ? student.tasks.map(task => `
                                  <a href="javascript:void(0);" onclick="completeTask('${student.username}', '${task}')">
                                      ${task}
                                  </a>`).join(', ') 
                              : 'No tasks assigned'}
                      </p>
                      <p><strong>Daily Activity:</strong> ${student.dailyActivity ? student.dailyActivity : 'No activity recorded'}</p>
                      <p><strong>Average Rating:</strong> ${student.averageRating !== undefined ? student.averageRating.toFixed(2) : 'Not Rated Yet'}</p>
                      <button class="add-task-button" onclick="addTask('${student.username}')">Add Task</button>
                      <button class="delete-button" onclick="deleteStudent('${student.username}')">Delete</button>
                  `;
              })
              .catch(error => {
                  console.error("GitHub profile fetch error:", error);
                  card.innerHTML = `
                      <img src="default-image-url.jpg" alt="Default Profile Picture" class="student-image">
                      <h3>Username: ${student.username}</h3>
                      <p>Table Number: ${student.tableNumber}</p>
                      <p>Course: ${student.course}</p>
                      <p>Trimester: ${student.trimester}</p>
                      <p>Period: ${student.period}</p>
                      <p>
                          <strong>Tasks:</strong> 
                          ${student.tasks.length > 0 
                              ? student.tasks.map(task => `
                                  <a href="javascript:void(0);" onclick="completeTask('${student.username}', '${task}')">
                                      ${task}
                                  </a>`).join(', ') 
                              : 'No tasks assigned'}
                      </p>
                      <button class="add-task-button" onclick="addTask('${student.username}')">Add Task</button>
                      <button class="delete-button" onclick="deleteStudent('${student.username}')">Delete</button>

                  `;
              });

          container.appendChild(card);
      });


      })
      .catch(error => console.error("There was a problem with the fetch operation:", error));
    } else {
      document.getElementById("student-cards-container").innerHTML = "<p>No table selected.</p>";
    }
  });
  
  window.saveDailyActivityForUser = function saveDailyActivityForUser() {
    // Get the username and daily activity inputs
    const usernameInput = document.getElementById("usernameInput");
    const dailyActivityInput = document.getElementById("dailyActivityInput");

    const username = usernameInput.value.trim();
    const dailyActivity = dailyActivityInput.value.trim();

    // Validate inputs
    if (!username) {
        alert("Please enter a username.");
        return;
    }
    if (!dailyActivity) {
        alert("Please enter a daily activity.");
        return;
    }

    // Prepare the request body
    const requestBody = {
        username: username,
        dailyActivity: dailyActivity,
    };

    // Send POST request to save the daily activity
    fetch(`${javaURI}/api/students/save-daily-activity`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to save daily activity.");
            alert("Daily activity saved successfully!");
            // Clear the input fields
            usernameInput.value = "";
            dailyActivityInput.value = "";
        })
        .catch((error) => {
            console.error("Error saving daily activity:", error);
            alert("An error occurred while saving the daily activity.");
        });
};

window.addTask = function addTask(username) {
    const newTask = prompt("Enter a new task:");
    if (newTask) {
      fetch(`${javaURI}/api/students/update-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          tasks: [newTask]
        })
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to add task");
        return response.json();
      })
      .then(student => {
        alert("Task added successfully!");
        location.reload();
      })
      .catch(error => console.error("There was a problem with the add task operation:", error));
    } else {
      alert("Task cannot be empty.");
    }
  };

  window.createStudent = function createStudent() {
      const urlParams = new URLSearchParams(window.location.search);
      const username = prompt("Enter student username:");
      const course = "CSA";
      const trimester = 2;
      const period = urlParams.get('period');
      const table = urlParams.get('table');
      const tasks = []; // Initial empty tasks
      if (username && table) {
        fetch(`${javaURI}/api/students/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            tableNumber: parseInt(table),
            course: course,
            trimester: trimester,
            period: parseInt(period),
            tasks: tasks
          })
        })
        .then(response => {
          if (!response.ok) throw new Error("Failed to create student");
          return response.json();
        })
        .then(student => {
          alert("Student created successfully!");
          location.reload();
        })
        .catch(error => console.error("There was a problem with the create operation:", error));
      } else {
        alert("Please fill in all fields to create a student.");
      }
  };
 window.rateStudent = function rateStudent() {
        const username = document.getElementById("rating-username").value;
        const communication = document.getElementById("communication").value;
        const teamwork = document.getElementById("teamwork").value;
        const problemSolving = document.getElementById("problemSolving").value;
        const creativity = document.getElementById("creativity").value;
        const punctuality = document.getElementById("punctuality").value;

        if (!username) {
            alert("Please enter the username to rate.");
            return;
        }

        const ratingData = {
            username: username,
            communication: parseInt(communication),
            teamwork: parseInt(teamwork),
            problemSolving: parseInt(problemSolving),
            creativity: parseInt(creativity),
            punctuality: parseInt(punctuality),
        };

        fetch(`${javaURI}/api/students/rate`, { // Assuming your endpoint is /api/students/rate
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ratingData),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {throw new Error(err)}); //Throw error with the error response
            }
            return response.text();
        })
        .then(message => {
            alert(message);
          
            document.getElementById("rating-username").value = "";
        })
        .catch(error => {
            console.error("Error rating student:", error);
            alert("Error rating student: " + error.message); // Display backend error message
        });
    };
  window.deleteStudent = function deleteStudent(username) {
    fetch(`${javaURI}/api/students/delete?username=${encodeURIComponent(username)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors"
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to delete student with username: " + username);
      return response.text();
    })
    .then(message => {
      console.log(message);
      alert(message);
      location.reload();
    })
    .catch(error => console.error("There was a problem with the delete operation:", error));
  }
  window.completeTask = function completeTask(username, task) {
      fetch(`${javaURI}/api/students/complete-task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              username: username,
              task: task
          })
      })
      .then(response => {
          if (!response.ok) throw new Error("Failed to complete task");
          return response.text();
      })
      .then(message => {
          alert(message);
          // Update task list dynamically or reload the page
          location.reload(); // Simplest option
      })
      .catch(error => console.error("Error completing task:", error));
  };
</script>
   
