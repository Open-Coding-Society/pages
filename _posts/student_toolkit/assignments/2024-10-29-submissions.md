---
layout: aesthetihawk
title: Submission Page
active_tab: submissions
permalink: /student/submissions
---

<div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="bg-neutral-800 rounded-lg shadow-md p-6 mb-6 border border-neutral-700">
        <h1 class="text-3xl font-bold text-gray-100 mb-6 border-b border-neutral-700 pb-2">Assignment Submissions</h1>
        <div class="mb-4 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-300">Enable group submissions</span>
        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" id="myToggle" class="sr-only" onchange="toggleSwitch(this)">
            <div id="customToggleTrack" class="relative w-11 h-6 bg-neutral-600 rounded-full transition-colors duration-300">
                <div id="customToggleCircle" class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full border border-gray-500 transition-all duration-300"></div>
            </div>
        </label>
        </div>
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <label for="assignment-select" class="text-sm font-medium text-gray-300">Assignment</label>
                <select id="assignment-select" class="w-2/3 px-3 py-2 rounded-lg border border-gray-600 bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="" disabled selected>Select an Assignment</option>
                </select>
            </div>
            <div id="Assignment-Content" class="p-4 bg-neutral-700 rounded-md mb-4 border-l-4 border-indigo-500 text-gray-100">
                Select an Assignment to see the description here
            </div>
            <div id="timer-container" class="p-3 rounded-md border border-gray-600 bg-neutral-800">
                <p id="time-left" class="font-bold text-gray-100">Select assignment to view time left here</p>
            </div>
            <div id="group-submit" class="hidden space-y-4 mt-6 p-4 rounded-md border border-gray-400">
                <div class="flex justify-between items-center">
                    <label for="group-select" class="text-sm font-medium text-white-700">Select Group</label>
                    <select id="group-select" class="w-2/3 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option value="" disabled selected>Select a Group</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-between items-center mt-4">
                <label for="submissionContent" class="text-sm font-medium text-gray-300">Submission Content</label>
                <textarea id="submissionContent" rows="5" required
                    class="w-2/3 px-3 py-2 rounded-lg border border-gray-600 bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>

            <div class="flex justify-between items-center mt-4">
                <label for="comments" class="text-sm font-medium text-gray-300">Comments</label>
                <textarea id="comments" rows="5"
                    class="w-2/3 px-3 py-2 rounded-lg border border-gray-600 bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>

            <div class="mt-6">
                <button id="submit-assignment"
                    class="w-full md:w-auto px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    Submit Assignment
                </button>
            </div>

            <div id="outputBox" class="mt-4 p-3 rounded-md"></div>

            <div class="mt-8">
                <h1 class="text-2xl font-bold text-white-100 mb-2">Previous Submissions for:</h1>
                <div id="Assignment-name" class="text-lg font-medium text-white-300 mb-4">Assignment-Content</div>

                <div class="overflow-x-auto">
                    <table id="submissions-table" class="min-w-full bg-neutral-700 rounded-lg overflow-hidden">
                        <thead class="bg-neutral-800">
                            <tr>
                                <th class="py-2 px-4 text-left text-white-100">Submission Content</th>
                                <th class="py-2 px-4 text-left text-white-100">Grade</th>
                                <th class="py-2 px-4 text-left text-white-100">Feedback</th>
                            </tr>
                        </thead>
                        <tbody id="submissions-tbody" class="divide-y divide-neutral-600">
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
    let groupId = null;

    document.getElementById("submit-assignment").addEventListener("click", Submit);

    async function fetchGroups() {
        const groupSelect = document.getElementById("group-select");
        try {
            const response = await fetch(javaURI+'/api/groups', fetchOptions);
            if (!response.ok) throw new Error("Failed to fetch groups");
            const groups = await response.json();
            groupSelect.innerHTML = `<option value="" disabled selected>Select a Group</option>`;
            groups.forEach(group => {
                const option = document.createElement("option");
                option.value = group.id;
                option.textContent = group.name || `Group ${group.id}`;
                groupSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching groups:", error);
        }

        groupSelect.addEventListener("change", () => {
            groupId = groupSelect.value;
        });
    }

    // Call when toggle is enabled
    document.getElementById("myToggle").addEventListener("change", function () {
        if (this.checked) {
            document.getElementById("group-submit").style.display = "block";
            fetchGroups();
        } else {
            document.getElementById("group-submit").style.display = "none";
            groupId = null;
        }
    });

    
    function disableGroupSubmit() {
        document.getElementById("group-submit").style.display = "none";
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

        const submissionData = {
            content: submissionContent,
            comment: comment,
            isLate: deadlineDate - now < 0
        };

        if (groupId) {
            submissionData.isGroup = true;
            submissionData.submitterId = parseInt(groupId);
        } else {
            submissionData.isGroup = false;
            submissionData.submitterId = userId;
        }
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

            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }

    async function fetchSubmissions() {
        const urllink = javaURI + "/api/submissions/getSubmissions";
        try {
            const response = await fetch(`${urllink}/${userId}`, fetchOptions);
            const Submissions = await response.json();
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
            console.log(submission.assignment?.id + " " + assignIndex + "$$$$$");
            if (submission.assignment?.id == assignIndex) {
                console.log("SKIBBBB");
                const contentCell = document.createElement('td');
                contentCell.textContent = submission.content || 'N/A';
                contentCell.className = 'py-2 px-4 text-white-700';
                row.appendChild(contentCell);

                const gradeCell = document.createElement('td');
                gradeCell.textContent = submission.grade || 'Ungraded';
                gradeCell.className = 'py-2 px-4 font-medium';
                if (submission.grade) {
                    gradeCell.classList.add('text-blue-600');
                } else {
                    gradeCell.classList.add('text-white-500');
                }
                row.appendChild(gradeCell);
                console.log(submission.grade);

                const feedbackCell = document.createElement('td');
                feedbackCell.textContent = submission.feedback || 'No feedback yet';
                feedbackCell.className = 'py-2 px-4 italic text-white-600';
                row.appendChild(feedbackCell);

                tableBody.appendChild(row);
            }
        });
    }

    disableGroupSubmit();
    document.addEventListener("DOMContentLoaded", async () => {
        await getUserId();
        await fetchSubmissions();
        await fetchAssignments();
    });
</script>
<script type="text/javascript">
    function toggleSwitch(checkbox) {
        const track = document.getElementById('customToggleTrack');
        const circle = document.getElementById('customToggleCircle');
        if (checkbox.checked) {
            track.classList.remove('bg-neutral-600');
            track.classList.add('bg-indigo-600');
            circle.style.left = '24px';
        } else {
            track.classList.remove('bg-indigo-600');
            track.classList.add('bg-neutral-600');
            circle.style.left = '2px';
        }
    }
</script>