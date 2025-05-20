---
toc: false
layout: aesthetihawk
title: Sign Up Page
permalink: /student/TeamTeachToolkit/signup
description: Sign up for team teach topics
---

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Teach Toolkit Signup</title>
    <style>
        body {
            background-color: black;
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
        }
        .nav-buttons {
            margin-top: 20px;
        }
        .nav-buttons button, .tt-btn, .tt-action-btn {
            background-color: black;
            color: white;
            border: 1px solid white;
            padding: 10px 20px;
            margin: 0 10px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .tt-btn:hover, .tt-action-btn:hover {
            background-color: #333;
        }
        .tt-container {
            width: 70%;
            margin: auto;
            padding: 20px;
            border: 2px solid white;
            margin-top: 40px;
        }
        .tt-container input {
            margin: 10px;
            padding: 10px;
            width: 80%;
        }
        .tt-container table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .tt-container th, .tt-container td {
            border: 1px solid white;
            padding: 10px;
            text-align: center;
        }
    </style>
</head>

<body>


    <div class="nav-buttons">
        <button>Home</button>
        <button>Grader</button>
        <button>Generator</button>
        <button>Review</button>
    </div>

    <p id="loggedInStudent">Fetching student info...</p>

    <div class="tt-container">
        <h2>TEAM TEACH SIGNUP</h2>
        <input type="text" id="topicName" placeholder="Enter Team Teach Topic">
        <input type="date" id="topicDate">
        <button class="tt-btn" id="addTopicBtn">Add Topic</button>
        <table>
            <tr>
                <th>Topic</th>
                <th>Date</th>
                <th>Signed Up</th>
                <th>Actions</th>
            </tr>
            <tbody id="topicsList"></tbody>
        </table>
    </div>

    <script type="module">
        import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

        let loggedInStudent = null;  // Track logged-in student

        async function fetchLoggedInStudent() {
            try {
                const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
                const data = await response.json();

                console.log("Logged-in student data:", data);

                if (data && data.name) {
                    loggedInStudent = data.name;
                    document.getElementById("loggedInStudent").innerText = `Logged in as: ${loggedInStudent}`;
                    fetchTopics();  // Only fetch topics after the student name is found
                } else {
                    document.getElementById("loggedInStudent").innerText = "Sign in to view page.";
                }
            } catch (error) {
                console.error("Error fetching logged-in student:", error);
                document.getElementById("loggedInStudent").innerText = "Error fetching student info.";
            }
        }

        async function fetchTopics() {
            try {
                let response = await fetch(`${javaURI}/api/topics/all`, fetchOptions);
                let topics = await response.json();

                let topicsList = document.getElementById("topicsList");
                topicsList.innerHTML = ""; // Clear previous entries

                topics.forEach(topic => {
                    // Format the list of students
                    let studentsText = "None";
                    if (Array.isArray(topic.students)) {
                        studentsText = topic.students.join(', ');
                    } else if (topic.students && typeof topic.students === 'string') {
                        studentsText = topic.students.split(',').join(', '); // Ensure proper format
                    }

                    // Create a new row for the topic
                    let row = document.createElement("tr");

                    // Create cells for topic name, date, and actions
                    let topicNameCell = document.createElement("td");
                    topicNameCell.innerText = topic.topicName;

                    let dateCell = document.createElement("td");
                    dateCell.innerText = topic.date;

                    let studentsCell = document.createElement("td");
                    studentsCell.innerText = studentsText;

                    let actionsCell = document.createElement("td");
                    let signUpBtn = document.createElement("button");
                    signUpBtn.classList.add("signUpBtn");
                    signUpBtn.setAttribute("data-topic-id", topic.id);
                    signUpBtn.innerText = "Sign Up";
                    signUpBtn.addEventListener("click", function () {
                        signUpForTopic(topic.id);
                    });
                    actionsCell.appendChild(signUpBtn);

                    // Append the cells to the row
                    row.appendChild(topicNameCell);
                    row.appendChild(dateCell);
                    row.appendChild(studentsCell);
                    row.appendChild(actionsCell);

                    // Append the row to the table body
                    topicsList.appendChild(row);
                });

            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        }

        async function addTopic() {
            let topicName = document.getElementById("topicName").value;
            let topicDate = document.getElementById("topicDate").value;

            if (!topicName || !topicDate) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                let response = await fetch(`${javaURI}/api/topics/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        topicName: topicName,
                        date: topicDate
                    })
                });

                if (response.ok) {
                    document.getElementById("topicName").value = "";
                    document.getElementById("topicDate").value = "";
                    fetchTopics();  // Refresh the topics list
                } else {
                    console.error("Failed to add topic");
                }
            } catch (error) {
                console.error("Error adding topic:", error);
            }
        }

        async function signUpForTopic(topicId) {
            if (!loggedInStudent) {
                alert("Sign in to view page");
                return;
            }

            try {
                let response = await fetch(`${javaURI}/api/topics/${topicId}/signup?studentName=${encodeURIComponent(loggedInStudent)}`, {
                    method: "PUT",
                    headers: fetchOptions
                });

                if (response.ok) {
                    fetchTopics(); // Refresh the topic list after signing up
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
            fetchLoggedInStudent();  // Fetch the logged-in student on load

            // Event listener for adding a topic
            document.getElementById("addTopicBtn").addEventListener("click", addTopic);
        });
    </script>
</body>
