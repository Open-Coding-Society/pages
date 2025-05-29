---
layout: toolkit
active_tab: graderview
title: Grader View
type: issues
permalink: /student/assign-grades
comments: false
---
<style>
    #user-details-container {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color:rgb(42, 41, 41);
    }
    
    .user-card {
        padding: 10px;
        background-color:rgb(42, 41, 41);
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    
    .user-card h3 {
        margin: 0 0 10px;
    }
    
    .user-card p {
        margin: 5px 0;
    }
    
    .container {
        margin: 20px;
    }
    
    .toggle-container {
        display: flex;
        margin-bottom: 20px;
    }
    
    .toggle-btn {
        padding: 10px 20px;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color:rgb(42, 41, 41);
        margin-right: 10px;
        border-radius: 5px;
    }
    
    .toggle-active {
        background-color: #007bff;
        color: #fff;
    }
    
    #submissionsTable {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    
    #submissionsTable th, #submissionsTable td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    
    #submissionsTable th {
        background-color:rgb(49, 41, 41);
    }

    .btn {
        padding: 5px 10px;
        cursor: pointer;
        border: 1px solid #007bff;
        background-color: #007bff;
        color: white;
        border-radius: 3px;
    }
    
    .btn:hover {
        background-color: #0056b3;
    }

    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color:rgb(42, 41, 41);
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }

    .close-btn {
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }

    .close-btn:hover {
        color: red;
    }
</style>

<table id="assignmentTable">
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Points</th>
        <th>Due Date</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody id="assignmentList">
    <!-- Populated dynamically -->
    </tbody>
</table>

<!-- Submissions Modal -->
<div id="submissionsModal" class="modal" style="z-index: 100;">
<div class="modal-content">
    <span class="close-btn">&times;</span>
    <h2 id="assignmentNameHeader">Submissions</h2>
    <table id="submissionsTable">
        <thead>
            <tr>
            <th>Student Name</th>
            <th>Submission Content</th>
            <th>Submission Date</th>
            <th>Current Grade</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody id="submissionsList">
            <!-- Populated dynamically -->
        </tbody>
    </table>
</div>
</div>

<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Fetch and display assignments on page load
    document.addEventListener('DOMContentLoaded', fetchAssignments);
    document.querySelector(".modal-content .close-btn").addEventListener('click', closeSubmissionsModal);

    // Fetch assignments
    function fetchAssignments() {
        fetch(`${javaURI}/api/assignments/assigned`, fetchOptions)
        .then(response => response.json())
        .then(assignments => {
            const assignmentList = document.getElementById('assignmentList');
            assignmentList.innerHTML = ''; // Clear previous content

            if (assignments.length === 0) {
            assignmentList.innerHTML = '<tr><td colspan="6">No assignments found</td></tr>';
            } else {
            assignments.forEach(assignment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${assignment.name}</td>
                <td>${assignment.type}</td>
                <td>${assignment.description}</td>
                <td>${assignment.points}</td>
                <td>${assignment.dueDate}</td>
                <td>
                    <button class="btn" onclick="viewSubmissions(${assignment.id}, '${assignment.name}')">View Submissions</button>
                </td>
                `;
                assignmentList.appendChild(row);
            });
            }
        })
        .catch(error => {
            console.error('Error fetching assignments:', error);
            alert('Failed to fetch assignments');
        });
    }
    
    // View submissions for an assignment, use window object to make it globally accessible
    window.viewSubmissions = function(assignmentId, assignmentName) {
        fetch(`${javaURI}/api/assignments/${assignmentId}/submissions`, fetchOptions)
        .then(async response => {
            // const test = await response.text();
            // console.log(test);
            return response.json();
        })
        .then(submissions => {
            document.getElementById('assignmentNameHeader').textContent = `Submissions for: ${assignmentName}`;
            
            const submissionsList = document.getElementById('submissionsList');
            submissionsList.innerHTML = ''; 

            if (submissions.length === 0) {
                submissionsList.innerHTML = '<tr><td colspan="5">No submissions found</td></tr>';
            } else {
                submissions.forEach(submission => {
                    console.log('Processing submission:', submission);
                    const row = document.createElement('tr');
                    if (submission.students.length === 0) {
                        submission.students = [{ name: 'Unknown Student'}]
                    }
                    let studentNames = "";
                    submission.students.forEach(student => {
                        studentNames += student.name + ", ";
                    });
                    // for (student in submission.students) {
                    //     studentNames += student.name + ", ";
                    // }
                    studentNames = studentNames.slice(0, -2);
                    row.innerHTML = `
                        <td>${studentNames}</td>
                        <td>${submission.content || 'No content'}</td>
                        <td>${submission.comment || 'No comments'}</td>
                        <td>${submission.grade || 'Not graded'}</td>
                        <td>
                            <button class="btn btn-grade" onclick="gradeAssignment(${submission.assignment.id}, ${JSON.stringify(submission.students.map(s => s.id))})">Grade</button>
                        </td>
                    `;
                    submissionsList.appendChild(row);
                });
            }

            document.getElementById('submissionsModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching submissions:', error);
            alert('Failed to fetch submissions: ' + error.message);
        });
    }

    // Close submissions modal
    function closeSubmissionsModal() {
        const modal = document.getElementById('submissionsModal');
        modal.style.display = 'none';
    }

    // Placeholder for grading a submission
    window.gradeAssignment = function(assignmentId, studentIds) {
        var gradeSuggestion = null;
        do {
            gradeSuggestion = prompt("What grade do you want to give?");
            if (gradeSuggestion === null) {
                return;
            }
        } while (isNaN(gradeSuggestion) || isNaN(parseFloat(gradeSuggestion)));
        gradeSuggestion = parseFloat(gradeSuggestion);

        var explanation = prompt("Why do you want to give this grade?");
        if (explanation === null) {
            return;
        }
        console.log(studentIds);
        console.log(assignmentId);
        console.log(gradeSuggestion);
        console.log(explanation);

        // const studentIds = JSON.parse(studentIds);
        console.log(studentIds);

        fetch(`${javaURI}/api/synergy/grades/requests/bulk`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({
                'studentIds': studentIds,
                'assignmentId': assignmentId,
                'gradeSuggestion': gradeSuggestion,
                'explanation': explanation
            })
        })
            .then(response => response.text())
            .then(function(retval) {
                alert("Created grade request for student! Pending approval...");
            })
            .catch(function(err) {
                console.log(err);
                alert("Failed to grade submission")
            })
        // Implement grading functionality as needed
    }
</script>

