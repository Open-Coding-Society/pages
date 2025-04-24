---
toc: false
title: Submission Page
permalink: /student/submissions
search_exclude: true
layout: post
---

<title>Submission Form</title>

<!-- toggle switch -->
<div class="toggle-container">
    <label class="switch">
        <span class="toggle">
            <input type="checkbox" id="myToggle">
            <span class="slider"></span>
        </span>
        <span class="label-text">Enable group submissions</span>
    </label>
</div>

<!-- submission form -->

<div id="modal" class="modal">
    <!-- assignment select -->
    <div class="modal-content">
        <h2>Submit here</h2>
        <select id="assignment-select">
            <option value="" disabled selected>Select a Assignment</option>
        </select>
    </div>
    <div class="Assignment-Content" id="Assignment-Content">Assignment-Content</div>

    <!-- time left -->
    <div id="timer-container">
        <p id="time-left"></p>
    </div>
    <br><br>

    <!-- group submitting -->
    <div class="Group Submit" id="Group Submit">
        <div>
            <input type="text" id="searchBar" placeholder="Search for a name..." onkeyup="filterNames()">
        </div>
        <div>
            <label for="rowsPerPage">Rows per page: </label>
            <select id="rowsPerPage" onchange="changeRowsPerPage()">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="1000">1000</option>
                <option value="1000">2000</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="namesTableBody"></tbody>
        </table>
        <!-- <div id="pagination-container">
            <button id="prevPage" onclick="changePage(-1)">Previous</button>
            <span id="pageInfo">Page 1 of 10</span>
            <button id="nextPage" onclick="changePage(1)">Next</button>
        </div> -->
        <div class="Review-Group" id="Review-Group">Group Members: </div>
        <br><br><br>
    </div>

    <!-- submission contents (ex: link) -->
    <div>
        <label for="submissionContent" style="font-size: 18px;">Submission Content:</label>
        <input type="url" id="submissionContent" required />
    </div>
    <br><br>

    <!-- comments you might have -->
    <div>
        <label for="comments" style="font-size: 18px;">Comments:</label>
        <textarea id="comments" rows="4" style="width: 100%;"></textarea>
    </div>
    <br><br>

    <!-- submit it -->
    <button id="submit-assignment" class="large filledHighlight primary">Submit Assignment</button>
    <br><br>
    <div class="output-box" id="outputBox"></div>
    <br><br>

    <!-- previous submissions -->
    <h1>Previous Submissions for: </h1>
    <div class="Assignment-Name" id="Assignment-name">Assignment-Content</div>
    <br><br>
    <table id="submissions-table" style="width: 100%; margin-top: 20px;">
        <thead>
            <tr>
                <th>Submisssion Content</th>
                <th>Grade</th>
                <th>Feedback</th>
            </tr>
        </thead>
        <tbody>
            <!-- Submissions will be populated here -->
        </tbody>
    </table>

</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    let selectedTask = "";
    let tasks = "";
    let assignmentIds = [];
    let submissions = [];
    let assignIndex = 0;
    let assignments;
    let userId = -1;
    let StuName;
    let Student;
    let people = [], filteredPeople = [], listofpeople = new Set(), currentPage = 1, rowsPerPage = 5, totalPages = 1;
    let listofpeopleIds = new Set();

    document.getElementById("submit-assignment").addEventListener("click", Submit);
    document.getElementById("myToggle").addEventListener("change", function () {
        if (this.checked) {
            console.log("Toggle is ON");
            // Perform action when toggled ON
            document.getElementById("Group Submit").style.display = "block";
        } else {
            console.log("Toggle is OFF");
            // Perform action when toggled OFF
            document.getElementById("Group Submit").style.display = "none";
        }
    });
    function disableGroupSubmit() {
        document.getElementById("Group Submit").style.display = "none";
    }
    function Submit() {
        let urllink_submit = javaURI + "/api/submissions/submit/";
        const submissionContent = document.getElementById('submissionContent').value;
        const comment = document.getElementById('comments').value;
        getUserId();
        if (userId == -1) {
            alert("Please login first");
            return;
        }
        const studentId = userId;
        const assigmentId = assignments[assignIndex - 1].id;
        urllink_submit += assigmentId.toString();
        let isLate = false;
        const now = new Date();
        const deadlineDate = new Date(assignments[assignIndex - 1].dueDate);
        console.log(now);
        console.log(deadlineDate);
        console.log(deadlineDate - now);

        console.log(listofpeopleIds);
        // const dataRequest = {
        //     "studentId":studentId,
        //     "content": submissionContent,
        //     "comment": comment,
        //     "isLate": deadlineDate - now < 0
        // };
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('content', submissionContent);
        formData.append('comment', comment);
        formData.append('isLate', deadlineDate - now < 0);

        // const data;
        console.log(Array.from(listofpeopleIds));
        const submissionData = {
            assignmentId: assigmentId,
            studentIds: Array.from(listofpeopleIds),
            content: submissionContent,
            comment: comment,
            isLate: deadlineDate - now < 0
        };
        console.log(JSON.stringify(submissionData));

        // console.log(dataRequest);

        fetch(urllink_submit, {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(submissionData)
        })
            .then(response => {
                const outputBox = document.getElementById('outputBox');
                if (response.ok) {
                    outputBox.innerText = 'Successful Submission! ';
                    fetchSubmissions();
                    return response.json();
                } else {
                    outputBox.innerText = 'Failed Submission! ';
                    throw new Error('Failed to submit data: ' + response.statusText);
                }

            })
            .then(result => {
                console.log('Submission successful:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async function fetchAssignments() {
        try {
            const response = await fetch(javaURI + "/api/assignments/debug", fetchOptions);
            assignments = await response.json();
            populateAssignmentDropdown(assignments);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    function populateAssignmentDropdown(Assignments) {
        const assignmentSelect = document.getElementById('assignment-select');
        Assignments.forEach(assignment => {
            const option = document.createElement('option');
            option.value = assignment.name;
            option.textContent = assignment.name;
            assignmentSelect.appendChild(option);
            assignmentIds.push(assignment.id);
        });
    }

    document.getElementById("assignment-select").addEventListener("change", function () {
        selectedTask = this.value;
        assignIndex = this.selectedIndex;
        document.getElementById("Assignment-Content").innerText = assignments[assignIndex - 1].description;
        console.log(assignments[assignIndex - 1].dueDate);
        console.log(calculateTimeLeft(assignments[assignIndex - 1].dueDate));
        console.log(assignments[assignIndex - 1].timestamp);
        document.getElementById("Assignment-name").innerText = this.value;
        fetchSubmissions();
    });

    function calculateTimeLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            const totalTime = deadlineDate - new Date(deadline);
            const timeLeft = deadlineDate - now;
            const percentageLeft = (timeLeft / totalTime) * 100;
            updateTimeText(days, hours, minutes);

            return `${days}d ${hours}h ${minutes}m left`;
        } else {
            updateTimeText(-0.5, -0.5, -0.5);
            return "Deadline Passed";
        }
    }

    function updateTimeText(days, hours, minutes) {
        const timeLeftElement = document.getElementById('time-left');
        let message = '';
        let color = '';
        let shouldShake = false;
        if (days > 3) {
            message = `Time Left: ${days}d ${hours}h ${minutes}m`;
            color = 'green';
        } else if (days <= 3 && days > 0) {
            message = `Time Left: ${days}d ${hours}h ${minutes}m (Hurry up!)`;
            color = 'orange';
        } else if (days <= 0 && (hours > 0 || minutes > 0)) {
            message = `Time Left: ${hours}h ${minutes}m (Almost due!)`;
            color = 'red';
            shouldShake = true;
        } else {
            message = 'Deadline Passed';
            color = 'red';
            shouldShake = true;
        }

        timeLeftElement.textContent = message;
        timeLeftElement.style.color = color;

        if (shouldShake) {
            timeLeftElement.classList.add('shake');
        } else {
            timeLeftElement.classList.remove('shake');
        }
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
                console.log("here", data);
                StuName = data.name;
                let info = data.name + "," + String(data.id);
                console.log(info);
                addName(info);

            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }

    async function fetchSubmissions() {
        const urllink = javaURI + "/api/submissions/getSubmissions";
        const urllink2 = javaURI + "/assignment/" + assignIndex.toString();
        const theUserId = await getUserId();
        console.log("here");
        try {
            const response = await fetch(`${urllink}/${userId}`, fetchOptions);
            const Submissions = await response.json();
            console.log("bruh");
            console.log(JSON.stringify(Submissions) + "------");
            populateSubmissionsTable(JSON.stringify(Submissions));
        } catch (error) {
            console.log("this is so skibbidi");
            console.error('Error fetching submissions:', error);
        }
    }

    function populateSubmissionsTable(submissionsJson) {
        const submissions = JSON.parse(submissionsJson);
        const tableBody = document.getElementById('submissions-table').getElementsByTagName['tbody'](0);
        tableBody.innerHTML = '';

        submissions.forEach(submission => {
            const row = document.createElement('tr');
            console.log(submission.assignment?.id + " " + assignIndex + "$$$$$");
            if (submission.assignment?.id == assignIndex) {
                console.log("SKIBBBB");
                const contentCell = document.createElement('td');
                contentCell.textContent = submission.content || 'N/A';
                row.appendChild(contentCell);

                const gradeCell = document.createElement('td');
                gradeCell.textContent = submission.grade || 'Ungraded';
                row.appendChild(gradeCell);
                console.log(submission.grade);

                const feedbackCell = document.createElement('td');
                feedbackCell.textContent = submission.feedback || 'No feedback yet';
                row.appendChild(feedbackCell);

                tableBody.appendChild(row);
            }

        });
    }
    window.filterNames = function filterNames() {
        const searchTerm = document.getElementById("searchBar").value.toLowerCase();
        filteredPeople = people.filter(person => person.name.toLowerCase().includes(searchTerm));
        totalPages = Math.ceil(filteredPeople.length / rowsPerPage);
        currentPage = 1; // Reset to first page after filtering
        populateTable(filteredPeople.slice(0, rowsPerPage));
    };

    window.addName = function (info) {
        console.log(info.split(","));
        info = info.split(",");
        console.log("Added name:", info[0]);
        listofpeople.add(info[0]);
        listofpeopleIds.add(Number(info[1]));
        console.log(listofpeople);
        const reviewGroup = document.getElementById('Review-Group');
        reviewGroup.textContent = "Group Members: " + Array.from(listofpeople).join(", ");
        console.log(listofpeopleIds);
    };

    async function fetchAllStudents() {
        try {
            const response = await fetch(javaURI + "/api/people", fetchOptions);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            people = await response.json();
            filteredPeople = people;
            totalPages = Math.ceil(people.length / rowsPerPage);
            populateTable(people.slice(0, rowsPerPage));
        } catch (error) {
            console.error("Error fetching names:", error);
        }
    }

    window.changeRowsPerPage = function changeRowsPerPage() {
        rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
        currentPage = 1;
        totalPages = Math.ceil(filteredPeople.length / rowsPerPage);
        const startIdx = 0;
        const endIdx = rowsPerPage;
        populateTable(filteredPeople.slice(startIdx, endIdx));
    };

    // window.changePage = function changePage(direction) {
    //     if (direction === 'prev' && currentPage > 1) {
    //         currentPage--;
    //     } else if (direction === 'next' && currentPage < totalPages) {
    //         currentPage++;
    //     }
    //     const startIdx = (currentPage - 1) * rowsPerPage;
    //     const endIdx = startIdx + rowsPerPage;
    //     populateTable(filteredPeople.slice(startIdx, endIdx));
    // };

    window.updatePageInfo = function updatePageInfo() {
        const pageInfo = document.getElementById("pageInfo");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;
    };

    function populateTable(names) {
        const tableBody = document.getElementById("namesTableBody");
        tableBody.innerHTML = "";
        names.forEach(name => {
            const row = document.createElement("tr");
            let info = [name.name, name.id];

            row.innerHTML = `<td>${name.name}</td><td><button onclick="addName('${info}')">Add</button></td>`;
            tableBody.appendChild(row);
        });
        updatePageInfo();
    }

    fetchAllStudents();
    disableGroupSubmit();
    document.addEventListener("DOMContentLoaded", async () => {
        await getUserId();
        await fetchSubmissions();
        await fetchAssignments();
    });

</script>
