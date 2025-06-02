---
layout: aesthetihawk
title: Submission Page
active_tab: submissions
permalink: /student/submissions
---

<div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="bg-transparent rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-700 mb-6 border-b pb-2">Assignment Submissions</h1>
        <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Enable group submissions</span>
            <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" id="myToggle" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
            </label>
        </div>
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <label for="assignment-select" class="text-sm font-medium text-gray-700">Assignment</label>
                <select id="assignment-select" class="w-2/3 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option value="" disabled selected>Select an Assignment</option>
                </select>
            </div>
            <div id="Assignment-Content" class="p-4 bg-gray-100 rounded-md mb-4 border-l-4 border-gray-500 text-gray-800">
                Assignment-Content
            </div>
            <div id="timer-container" class="p-3 rounded-md border border-gray-400">
                <p id="time-left" class="font-bold text-gray-700">Select assignment to view time left here</p>
            </div>
            <div id="Group Submit" class="hidden space-y-4 mt-6 p-4 rounded-md border border-gray-400">
                <div class="flex justify-between items-center">
                    <label for="searchBar" class="text-sm font-medium text-gray-700">Search Group Members</label>
                    <input type="text" id="searchBar" placeholder="Search for a name..." onkeyup="filterNames()"
                        class="w-2/3 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                </div>
                <div class="flex items-center">
                    <label for="rowsPerPage" class="text-sm font-medium text-gray-700 mr-2">Rows per page:</label>
                    <select id="rowsPerPage" onchange="changeRowsPerPage()"
                        class="px-2 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="1000">1000</option>
                        <option value="2000">2000</option>
                    </select>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="py-2 px-4 text-left text-gray-700">Name</th>
                                <th class="py-2 px-4 text-left text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody id="namesTableBody" class="divide-y divide-gray-300"></tbody>
                    </table>
                </div>
                <div id="Review-Group" class="p-3 rounded-md font-medium text-gray-700 border border-gray-400">
                    Group Members:
                </div>
            </div>

            <div class="flex justify-between items-center mt-4">
                <label for="submissionContent" class="text-sm font-medium text-gray-700">Submission Content</label>
                <textarea id="submissionContent" rows="5" required
                    class="w-2/3 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></textarea>
            </div>

            <div class="flex justify-between items-center mt-4">
                <label for="comments" class="text-sm font-medium text-gray-700">Comments</label>
                <textarea id="comments" rows="5"
                    class="w-2/3 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"></textarea>
            </div>

            <div class="mt-6">
                <button id="submit-assignment"
                    class="w-full md:w-auto px-6 py-3 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition">
                    Submit Assignment
                </button>
            </div>

            <div id="outputBox" class="mt-4 p-3 rounded-md"></div>

            <div class="mt-8">
                <h1 class="text-2xl font-bold text-gray-700 mb-2">Previous Submissions for:</h1>
                <div id="Assignment-name" class="text-lg font-medium text-gray-700 mb-4">Assignment-Content</div>

                <div class="overflow-x-auto">
                    <table id="submissions-table" class="min-w-full bg-gray-100 rounded-lg overflow-hidden">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="py-2 px-4 text-left text-gray-700">Submission Content</th>
                                <th class="py-2 px-4 text-left text-gray-700">Grade</th>
                                <th class="py-2 px-4 text-left text-gray-700">Feedback</th>
                            </tr>
                        </thead>
                        <tbody id="submissions-tbody" class="divide-y divide-gray-300">
                            <!-- Submissions will be populated here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
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
            document.getElementById("Group Submit").style.display = "block";
        } else {
            console.log("Toggle is OFF");
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
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('content', submissionContent);
        formData.append('comment', comment);
        formData.append('isLate', deadlineDate - now < 0);

        console.log(Array.from(listofpeopleIds));
        const submissionData = {
            assignmentId: assigmentId,
            studentIds: Array.from(listofpeopleIds),
            content: submissionContent,
            comment: comment,
            isLate: deadlineDate - now < 0
        };
        console.log(JSON.stringify(submissionData));

        fetch(urllink_submit, {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(submissionData)
        })
            .then(response => {
                const outputBox = document.getElementById('outputBox');
                if (response.ok) {
                    outputBox.innerText = 'Successful Submission! ';
                    outputBox.className = 'mt-4 p-3 rounded-md bg-green-100 text-green-800 border border-green-200';
                    fetchSubmissions();
                    return response.json();
                } else {
                    outputBox.innerText = 'Failed Submission! ';
                    outputBox.className = 'mt-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-200';
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
            timeLeftElement.className = 'font-medium text-green-600';
        } else if (days <= 3 && days > 0) {
            message = `Time Left: ${days}d ${hours}h ${minutes}m (Hurry up!)`;
            color = 'orange';
            timeLeftElement.className = 'font-medium text-orange-600';
        } else if (days <= 0 && (hours > 0 || minutes > 0)) {
            message = `Time Left: ${hours}h ${minutes}m (Almost due!)`;
            color = 'red';
            timeLeftElement.className = 'font-medium text-red-600 animate-pulse';
            shouldShake = true;
        } else {
            message = 'Deadline Passed';
            color = 'red';
            timeLeftElement.className = 'font-medium text-red-600 animate-pulse';
            shouldShake = true;
        }

        timeLeftElement.textContent = message;
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
        const tableBody = document.getElementById('submissions-tbody');
        tableBody.innerHTML = '';

        submissions.forEach(submission => {
            const row = document.createElement('tr');
            row.className = "hover:bg-indigo-50";
            console.log(submission.assignment?.id + " " + assignIndex + "$$$$$");
            if (submission.assignment?.id == assignIndex) {
                console.log("SKIBBBB");
                const contentCell = document.createElement('td');
                contentCell.textContent = submission.content || 'N/A';
                contentCell.className = 'py-2 px-4 text-gray-700';
                row.appendChild(contentCell);

                const gradeCell = document.createElement('td');
                gradeCell.textContent = submission.grade || 'Ungraded';
                gradeCell.className = 'py-2 px-4 font-medium';
                if (submission.grade) {
                    gradeCell.classList.add('text-green-600');
                } else {
                    gradeCell.classList.add('text-gray-500');
                }
                row.appendChild(gradeCell);
                console.log(submission.grade);

                const feedbackCell = document.createElement('td');
                feedbackCell.textContent = submission.feedback || 'No feedback yet';
                feedbackCell.className = 'py-2 px-4 italic text-gray-600';
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

    window.updatePageInfo = function updatePageInfo() {
        const pageInfo = document.getElementById("pageInfo");
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            document.getElementById("prevPage").disabled = currentPage === 1;
            document.getElementById("nextPage").disabled = currentPage === totalPages;
        }
    };

    function populateTable(names) {
        const tableBody = document.getElementById("namesTableBody");
        tableBody.innerHTML = "";
        names.forEach(name => {
            const row = document.createElement("tr");
            row.className = "hover:bg-indigo-50";
            let info = [name.name, name.id];

            const nameCell = document.createElement("td");
            nameCell.className = "py-2 px-4 text-gray-700";
            nameCell.textContent = name.name;
            row.appendChild(nameCell);

            const actionCell = document.createElement("td");
            actionCell.className = "py-2 px-4";
            
            const addButton = document.createElement("button");
            addButton.className = "px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
            addButton.textContent = "Add";
            addButton.onclick = function() { addName(`${name.name},${name.id}`); };
            
            actionCell.appendChild(addButton);
            row.appendChild(actionCell);
            
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
