---
toc: false
layout: post
title: Seed Tracker Teacher
type: ccc
permalink: /student/seedtracker
---
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Weekly Project Page</title>
</head>
<body>
    <div class="container">
        <h1>Weekly Project Submission</h1>
        <div class="form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" placeholder="Enter your Student ID" required>
        </div>
        <div class="form-group">
            <label for="studentName">Student Name</label>
            <input type="text" id="studentName" placeholder="Enter your name" required>
        </div>
        <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" placeholder="Enter subject" required>
        </div>
        <div class="form-group">
            <label for="activityLog">Weekly Activity Log</label>
            <textarea id="activityLog" rows="4" placeholder="Describe what you did this week..." required class="smallInput"></textarea>
        </div>

        <div class="form-group">
            <button style="margin-right: 10px; margin-bottom: 10px;" class="large primary" onclick="openModal('seedStarterModal')">Seed Starter</button>
            <button style="margin-right: 10px; margin-bottom: 10px;" class="large primary" onclick="openModal('classroomConductModal')">Classroom Conduct</button>
            <button style="margin-right: 10px; margin-bottom: 10px;" class="large primary" onclick="openModal('ecEventModal')">EC Event</button>
            <button style="margin-right: 10px; margin-bottom: 10px;" class="large primary" onclick="openModal('ecAssignmentModal')">EC Assignment</button>
            <button style="margin-right: 10px; margin-bottom: 10px;" class="large primary" onclick="openModal('attendanceModal')">Attendance</button>
        </div>
        
        <div class="form-group">
            <label>Total Seed: <span id="totalSeed">0</span> / 3</label>
        </div>
        
        <div class="form-group">
            <button class="large filledHighlight primary" onclick="submitEntry()">Submit Entry</button>
        </div>
        <div class="message" id="message"></div>
    </div>

    <!-- Modals -->
    <div id="seedStarterModal" class="modal-overlay" onclick="closeModal('seedStarterModal')">
        <div class="modal tintedGlass" onclick="event.stopPropagation();">
            <span class="close" onclick="closeModal('seedStarterModal')">&times;</span>
            <div class="modal-header">Seed Starter</div>
            <div class="modal-content">
                <div class="score-controls">
                    <button class="score-button" onclick="adjustScore('seedStarter', -0.1)">-</button>
                    <div class="score-display"><span id="seedStarterValue">0</span> / 3</div>
                    <button class="score-button" onclick="adjustScore('seedStarter', 0.1)">+</button>
                </div>
                <div class="increment-controls">
                    <button class="small primary" onclick="adjustScore('seedStarter', 0.01)">+0.01</button>
                    <button class="small primary" onclick="adjustScore('seedStarter', 0.05)">+0.05</button>
                    <button class="small primary" onclick="adjustScore('seedStarter', 0.25)">+0.25</button>
                    <button class="small primary" onclick="adjustScore('seedStarter', 0.5)">+0.5</button>
                    <button class="small primary" onclick="adjustScore('seedStarter', 1.0)">+1.0</button>
                </div>
            </div>
        </div>
    </div>

    <div id="classroomConductModal" class="modal-overlay" onclick="closeModal('classroomConductModal')">
        <div class="modal tintedGlass" onclick="event.stopPropagation();">
            <span class="close" onclick="closeModal('classroomConductModal')">&times;</span>
            <div class="modal-header">Classroom Conduct</div>
            <div class="modal-content">
                <div class="score-controls">
                    <button class="score-button" onclick="adjustScore('classroomConduct', -0.1)">-</button>
                    <div class="score-display"><span id="classroomConductValue">0</span></div>
                    <button class="score-button" onclick="adjustScore('classroomConduct', 0.1)">+</button>
                </div>
                <div class="increment-controls">
                    <button class="small primary" onclick="adjustScore('classroomConduct', 0.01)">+0.01</button>
                    <button class="small primary" onclick="adjustScore('classroomConduct', 0.05)">+0.05</button>
                    <button class="small primary" onclick="adjustScore('classroomConduct', 0.25)">+0.25</button>
                    <button class="small primary" onclick="adjustScore('classroomConduct', 0.5)">+0.5</button>
                    <button class="small primary" onclick="adjustScore('classroomConduct', 1.0)">+1.0</button>
                </div>
            </div>
        </div>
    </div>

    <div id="ecEventModal" class="modal-overlay" onclick="closeModal('ecEventModal')">
        <div class="modal tintedGlass" onclick="event.stopPropagation();">
            <span class="close" onclick="closeModal('ecEventModal')">&times;</span>
            <div class="modal-header">EC Event</div>
            <div class="modal-content">
                <div class="score-controls">
                    <button class="score-button" onclick="adjustScore('ecEvent', -0.1)">-</button>
                    <div class="score-display"><span id="ecEventValue">0</span></div>
                    <button class="score-button" onclick="adjustScore('ecEvent', 0.1)">+</button>
                </div>
                <div class="increment-controls">
                    <button style="margin-right: 10px;" class="small primary" onclick="adjustScore('ecEvent', 0.01)">+0.01</button>
                    <button style="margin-right: 10px;" class="small primary" onclick="adjustScore('ecEvent', 0.05)">+0.05</button>
                    <button style="margin-right: 10px;" class="small primary" onclick="adjustScore('ecEvent', 0.25)">+0.25</button>
                    <button style="margin-right: 10px;" class="small primary" onclick="adjustScore('ecEvent', 0.5)">+0.5</button>
                    <button style="margin-right: 10px;" class="small primary" onclick="adjustScore('ecEvent', 1.0)">+1.0</button>
                </div>
            </div>
        </div>
    </div>

    <div id="ecAssignmentModal" class="modal-overlay" onclick="closeModal('ecAssignmentModal')">
        <div class="modal tintedGlass" onclick="event.stopPropagation();">
            <span class="close" onclick="closeModal('ecAssignmentModal')">&times;</span>
            <div class="modal-header">EC Assignment</div>
            <div class="modal-content">
                <div class="score-controls">
                    <button class="score-button" onclick="adjustScore('ecAssignment', -0.1)">-</button>
                    <div class="score-display"><span id="ecAssignmentValue">0</span></div>
                    <button class="score-button" onclick="adjustScore('ecAssignment', 0.1)">+</button>
                </div>
                <div class="increment-controls">
                    <button class="small primary" onclick="adjustScore('ecAssignment', 0.01)">+0.01</button>
                    <button class="small primary" onclick="adjustScore('ecAssignment', 0.05)">+0.05</button>
                    <button class="small primary" onclick="adjustScore('ecAssignment', 0.25)">+0.25</button>
                    <button class="small primary" onclick="adjustScore('ecAssignment', 0.5)">+0.5</button>
                    <button class="small primary" onclick="adjustScore('ecAssignment', 1.0)">+1.0</button>
                </div>
            </div>
        </div>
    </div>

    <div id="attendanceModal" class="modal-overlay" onclick="closeModal('attendanceModal')">
        <div class="modal tintedGlass" onclick="event.stopPropagation();">
            <span class="close" onclick="closeModal('attendanceModal')">&times;</span>
            <div class="modal-header">Attendance</div>
            <div class="modal-content">
                <div class="score-controls">
                    <button class="score-button" onclick="adjustScore('attendance', -0.1)">-</button>
                    <div class="score-display"><span id="attendanceValue">0</span></div>
                    <button class="score-button" onclick="adjustScore('attendance', 0.1)">+</button>
                </div>
                <div class="increment-controls">
                    <button class="small primary" onclick="adjustScore('attendance', 0.01)">+0.01</button>
                    <button class="small primary" onclick="adjustScore('attendance', 0.05)">+0.05</button>
                    <button class="small primary" onclick="adjustScore('attendance', 0.25)">+0.25</button>
                    <button class="small primary" onclick="adjustScore('attendance', 0.5)">+0.5</button>
                    <button class="small primary" onclick="adjustScore('attendance', 1.0)">+1.0</button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { javaURI } from '{{site.baseurl}}/assets/js/api/config.js';

        // Store scores in an object
        const scores = {
            seedStarter: 0,
            classroomConduct: 0,
            ecEvent: 0,
            ecAssignment: 0,
            attendance: 0
        };

        function adjustScore(id, change) {
            // Get current score
            let currentScore = scores[id];
            let newScore = currentScore + change;
            
            // Enforce limits
            newScore = Math.max(0, Math.min(3, newScore)); // Cannot go below 0 or above 3
            
            // Update score
            scores[id] = newScore;
            
            // Update display
            document.getElementById(`${id}Value`).innerText = newScore.toFixed(2);
            
            // Update total
            updateTotalSeed();
        }

        async function submitEntry() {
            const studentId = document.getElementById('studentId');
            const studentName = document.getElementById('studentName');
            const subject = document.getElementById('subject');
            const activityLog = document.getElementById('activityLog');
            const messageElement = document.getElementById('message');

            if (!studentId || !studentName || !subject || !activityLog) {
                messageElement.textContent = "Please fill in all fields before submitting.";
                return;
            }

            const totalSeed = parseFloat(document.getElementById('totalSeed').innerText);

            const entryData = {
                studentId: parseInt(studentId.value),
                name: studentName.value,
                subject: subject.value,
                grade: totalSeed,
                comment: activityLog.value.trim()
            };

            try {
                const response = await fetch(`${javaURI}/api/seeds/`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(entryData)
                });

                if (response.ok) {
                    const result = await response.json();
                    messageElement.textContent = `Entry submitted successfully! Your Entry ID is: ${result.id}`;
                    resetScores();
                } else {
                    const errorText = await response.text();
                    messageElement.textContent = `Error submitting entry: ${errorText}`;
                    console.error("Submission error:", errorText);
                }
            } catch (error) {
                messageElement.textContent = "Error submitting entry. Please try again.";
                console.error("Fetch error:", error);
            }
        }

        function openModal(id) { 
            document.getElementById(id).style.display = "flex"; 
        }

        function closeModal(id) { 
            document.getElementById(id).style.display = "none"; 
        }

        function resetScores() {
            // Reset all scores to 0
            Object.keys(scores).forEach(key => {
                scores[key] = 0;
                document.getElementById(`${key}Value`).innerText = "0";
            });
            updateTotalSeed();
        }

        function updateTotalSeed() {
            // Calculate total from scores object
            const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
            // Update total display
            document.getElementById("totalSeed").innerText = Math.min(3, total).toFixed(2);
        }

        // Attach functions to window
        window.submitEntry = submitEntry;
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.adjustScore = adjustScore;
        window.updateTotalSeed = updateTotalSeed;
    </script>
</body>
</html>
