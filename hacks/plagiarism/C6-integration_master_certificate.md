---
layout: post
title: Plagiarism Avoidance Certificate
description: Review key takeaways these modules and receive your APA reference and citations (anti-plagiarism) mastery certificate. 
author: John Mortensen
permalink: /plagiarism/6
breadcrumb: True
---

## Certificate of Student Mastery

Review your completed work and instructor assessment. If you received a passing grade, you'll be able to confirm receipt of your APA Reference and Citation Mastery Certificate.

1. **Review of completed work** - View your submissions from sessions C2, C3, and C4
2. **Instructor assessment** - Read instructor comments and view your assessment status
3. **Certificate confirmation** - Confirm receipt of your certificate (only available if you passed)

**Note:** All assessment information is read-only. If you need to retry, follow the instructor's guidance and use the provided links to return to specific sessions for revisions.

---

<style>
  .certificate-container {
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .student-work-card {
    border: 1px solid #6c757d;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .lesson-header {
    background-color: #007bff;
    color: white;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  
  .work-section {
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
  }
  
  .missing-work {
    border-left: 4px solid #dc3545;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
    color: #721c24;
  }
  
  .readonly-textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #bbc2caff;
    cursor: not-allowed;
  }
  
  .readonly-status {
    padding: 8px 12px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-size: 16px;
    margin-left: 10px;
    color: #495057;
    cursor: not-allowed;
  }
  
  .certificate-notice {
    border: 1px solid #28a745;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    color: #155724;
  }
  
  .retry-notice {
    border: 1px solid #dc3545;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    color: #721c24;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }
  
  .confirmation-section {
    border: 2px solid #28a745;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .confirmation-checkbox {
    margin-right: 10px;
    transform: scale(1.2);
  }
  
  .confirmation-label {
    font-size: 16px;
    font-weight: bold;
    color: #155724;
    cursor: pointer;
  }
</style>

<div class="certificate-container">
  
  <!-- Dynamic Status Notice -->
  <div id="status-notice" style="display: none;"></div>
  
  <h2>Your Assessment Results</h2>
  
  <!-- C2 Work Display -->
  <div class="student-work-card">
    <div class="lesson-header">
      C2: APA Reference Session Samples
    </div>

    <div id="c2-content">
      <div class="missing-work">
        ⚠️ No C2 student work found in localStorage. Please complete exercises in C2 session.
      </div>
    </div>
  </div>
  
  <!-- C3 Work Display -->
  <div class="student-work-card">
    <div class="lesson-header">
      C3: Landmark Case Studies APA Reference Revisions
    </div>

    <div id="c3-content">
      <div class="missing-work">
        ⚠️ No C3 student work found in localStorage. Please complete reference correction practice.
      </div>
    </div>
  </div>
  
  <!-- C4 Work Display (Placeholder for future) -->
  <div class="student-work-card">
    <div class="lesson-header">
      C4: Sample Paragraph, Avoiding Plagiarism, and Thesis Completion
    </div>

    <div id="c4-content">
      <div class="missing-work">
        ⚠️ C4 exercises not yet implemented. This section will display thesis and paragraph work when available.
      </div>
    </div>
  </div>
  
  <!-- Instructor Assessment (Read-Only) -->
  <div class="student-work-card">
    <div class="lesson-header">
      Instructor Assessment Results
    </div>

    <label for="instructor-comment"><strong>Instructor Comments:</strong></label>
    <textarea id="instructor-comment" class="readonly-textarea" readonly placeholder="Waiting for instructor assessment..."></textarea>
    
    <div style="margin-top: 15px;">
      <label for="assessment-status"><strong>Assessment Status:</strong></label>
      <span id="assessment-status" class="readonly-status">-- Pending Assessment --</span>
    </div>
    
    <!-- Certificate Confirmation Section (shown only if passed) -->
    <div id="certificate-confirmation" class="confirmation-section" style="display: none;">
      <h3 style="margin-top: 0; color: #155724;">🎓 Congratulations! You have demonstrated mastery of APA citations and plagiarism avoidance.</h3>
      <div style="margin: 15px 0;">
        <input type="checkbox" id="confirm-receipt" class="confirmation-checkbox">
        <label for="confirm-receipt" class="confirmation-label">
          I confirm that I have received and understand my APA Reference and Citation Mastery Certificate.
        </label>
      </div>
      <button id="submit-confirmation" class="iridescent text-white py-2 px-4 rounded-lg font-semibold transition" disabled>
        Submit Certificate Confirmation
      </button>
    </div>
    
    <!-- Retry Instructions Section (shown only if retry needed) -->
    <div id="retry-instructions" class="retry-notice" style="display: none;">
      <h3 style="margin-top: 0;">Additional Work Required</h3>
      <p>Please review the instructor comments above and complete the recommended revisions before resubmission.</p>
      <div class="button-group">
        <a href="/plagiarism/2" class="iridescent text-white py-2 px-4 rounded-lg font-semibold transition text-center">Return to C2 Session</a>
        <a href="/plagiarism/3" class="iridescent text-white py-2 px-4 rounded-lg font-semibold transition text-center">Return to C3 Session</a>
        <a href="/plagiarism/4" class="iridescent text-white py-2 px-4 rounded-lg font-semibold transition text-center">Return to C4 Session</a>
      </div>
    </div>
  </div>
  
  <div id="status-message" style="margin: 10px 0; padding: 8px; border-radius: 4px; display: none;"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {

    // Status message helper function
    function showStatusMessage(message, type) {
        const statusDiv = document.getElementById("status-message");
        statusDiv.textContent = message;
        statusDiv.style.display = "block";

        switch(type) {
            case "success":
                statusDiv.style.backgroundColor = "#d1ecf1";
                statusDiv.style.color = "#0c5460";
                statusDiv.style.border = "1px solid #bee5eb";
                break;
            case "error":
                statusDiv.style.backgroundColor = "#e9ecef";
                statusDiv.style.color = "#495057";
                statusDiv.style.border = "1px solid #6c757d";
                break;
            case "info":
                statusDiv.style.backgroundColor = "#d1ecf1";
                statusDiv.style.color = "#0c5460";
                statusDiv.style.border = "1px solid #bee5eb";
                break;
        }

        setTimeout(() => {
            statusDiv.style.display = "none";
        }, 4000);
    }

    // Load and display student work (same as C5 but read-only)
    function loadStudentWork() {
        // Helper function to safely get value or show 'Not available'
        function safeValue(obj, path, defaultValue = 'Not available') {
            return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue;
        }

        // Load C2 Work - Check both new individual keys and old assessment format
        const c2Container = document.getElementById('c2-content');
        const c2_1_data = localStorage.getItem('plagiarism-c2-1');
        const c2_2_data = localStorage.getItem('plagiarism-c2-2');
        const c2AssessmentData = localStorage.getItem('plagiarism-c2-assessment');

        let c2HasData = false;
        let c2Content = '';

        if (c2_1_data || c2_2_data || c2AssessmentData) {
            c2HasData = true;
            c2Content = '<div class="work-section">';

            // Try to get data from individual exercises first
            if (c2_1_data) {
                try {
                    const salemData = JSON.parse(c2_1_data);
                    const saveDate = new Date(salemData.timestamp).toLocaleString();
                    c2Content += `
                        <strong>📅 Salem Exercise Completed:</strong> ${saveDate}<br><br>
                        <strong>Salem's Citation Exercise:</strong><br>
                        <em>Original Uncited Text:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(salemData, 'uncited')}
                        </div>
                        <em>In-text Citation:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(salemData, 'citation')}
                        </div>
                        <em>Reference List Entry:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(salemData, 'reference')}
                        </div><br>
                    `;
                } catch (error) {
                    c2Content += '<div style="color: red;">❌ Error loading Salem exercise data</div><br>';
                }
            }

            if (c2_2_data) {
                try {
                    const comparisonData = JSON.parse(c2_2_data);
                    const saveDate = new Date(comparisonData.timestamp).toLocaleString();
                    c2Content += `
                        <strong>📅 Comparison Exercise Completed:</strong> ${saveDate}<br><br>
                        <strong>Comparison Exercise:</strong><br>
                        <em>Uncited Version (showing plagiarism):</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(comparisonData, 'uncited')}
                        </div>
                        <em>Properly Cited Version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(comparisonData, 'cited')}
                        </div>
                        <em>Reference List:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(comparisonData, 'references')}
                        </div>
                    `;
                } catch (error) {
                    c2Content += '<div style="color: red;">❌ Error loading comparison exercise data</div>';
                }
            }

            // Fallback to old assessment format if individual exercises not found
            if (!c2_1_data && !c2_2_data && c2AssessmentData) {
                try {
                    const c2Work = JSON.parse(c2AssessmentData);
                    const completedDate = new Date(c2Work.timestamp).toLocaleString();
                    c2Content += `
                        <strong>📅 Assessment Completed:</strong> ${completedDate}<br><br>
                        <strong>Salem's Citation Exercise:</strong><br>
                        <em>Original Uncited Text:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.salemExercise.uncited')}
                        </div>
                        <em>In-text Citation:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.salemExercise.citation')}
                        </div>
                        <em>Reference List Entry:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.salemExercise.reference')}
                        </div>
                        <strong>Comparison Exercise:</strong><br>
                        <em>Uncited Version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.comparisonExercise.uncited')}
                        </div>
                        <em>Properly Cited Version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.comparisonExercise.cited')}
                        </div>
                        <em>Reference List:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c2Work, 'studentWork.comparisonExercise.references')}
                        </div>
                    `;
                } catch (error) {
                    c2Content += '<div style="color: red;">❌ Error loading C2 assessment data</div>';
                }
            }

            c2Content += '</div>';
        }

        if (c2HasData) {
            c2Container.innerHTML = c2Content;
        }

        // Load C3 Work - Check both new individual keys and old assessment format
        const c3Container = document.getElementById('c3-content');
        const c3_1_data = localStorage.getItem('plagiarism-c3-1');
        const c3_2_data = localStorage.getItem('plagiarism-c3-2');
        const c3AssessmentData = localStorage.getItem('plagiarism-c3-assessment');

        let c3HasData = false;
        let c3Content = '';

        if (c3_1_data || c3_2_data || c3AssessmentData) {
            c3HasData = true;
            c3Content = '<div class="work-section">';

            // Try to get data from individual exercises first
            if (c3_1_data) {
                try {
                    const taylorData = JSON.parse(c3_1_data);
                    const saveDate = new Date(taylorData.timestamp).toLocaleString();
                    c3Content += `
                        <strong>📅 Taylor Swift Exercise Completed:</strong> ${saveDate}<br><br>
                        <strong>Taylor Swift Reference Correction:</strong><br>
                        <em>Original weak reference:</em> ${safeValue(taylorData, 'originalReference', 'MSN. (2025). Taylor Swift\'s legal odyssey...')}<br>
                        <em>Student's improved version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(taylorData, 'correctedReference')}
                        </div><br>
                    `;
                } catch (error) {
                    c3Content += '<div style="color: red;">❌ Error loading Taylor Swift exercise data</div><br>';
                }
            }

            if (c3_2_data) {
                try {
                    const peteData = JSON.parse(c3_2_data);
                    const saveDate = new Date(peteData.timestamp).toLocaleString();
                    c3Content += `
                        <strong>📅 Pete Hegseth Exercise Completed:</strong> ${saveDate}<br><br>
                        <strong>Pete Hegseth Reference Correction:</strong><br>
                        <em>Original weak reference:</em> ${safeValue(peteData, 'originalReference', 'News source on 2025 academic misconduct cases.')}<br>
                        <em>Student's improved version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(peteData, 'correctedReference')}
                        </div>
                    `;
                } catch (error) {
                    c3Content += '<div style="color: red;">❌ Error loading Pete Hegseth exercise data</div>';
                }
            }

            // Fallback to old assessment format if individual exercises not found
            if (!c3_1_data && !c3_2_data && c3AssessmentData) {
                try {
                    const c3Work = JSON.parse(c3AssessmentData);
                    const completedDate = new Date(c3Work.timestamp).toLocaleString();
                    c3Content += `
                        <strong>📅 Assessment Completed:</strong> ${completedDate}<br><br>
                        <strong>Taylor Swift Reference Correction:</strong><br>
                        <em>Original weak reference:</em> MSN. (2025). Taylor Swift's legal odyssey...<br>
                        <em>Student's improved version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c3Work, 'studentWork.taylorSwiftReference')}
                        </div>
                        <strong>Pete Hegseth Reference Correction:</strong><br>
                        <em>Original weak reference:</em> News source on 2025 academic misconduct cases.<br>
                        <em>Student's improved version:</em><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${safeValue(c3Work, 'studentWork.peteHegsethReference')}
                        </div>
                    `;
                } catch (error) {
                    c3Content += '<div style="color: red;">❌ Error loading C3 assessment data</div>';
                }
            }

            c3Content += '</div>';
        }

        if (c3HasData) {
            c3Container.innerHTML = c3Content;
        }

        // Load C4 Work - Parse from assessment data (submitted work)
        const c4Container = document.getElementById('c4-content');
        const c4AssessmentData = localStorage.getItem('plagiarism-c4-assessment');

        if (c4AssessmentData) {
            try {
                const c4Work = JSON.parse(c4AssessmentData);
                const completedDate = new Date(c4Work.timestamp).toLocaleString();
                const isCompleted = c4Work.completed !== false;
                const statusIcon = isCompleted ? '✅' : '📝';
                const statusText = isCompleted ? 'Submitted for Grading' : 'Draft Only';

                c4Container.innerHTML = `
                    <div class="work-section">
                        <strong>📅 ${isCompleted ? 'Completed' : 'Last Saved'}:</strong> ${completedDate}<br><br>
                        <strong>Status:</strong> ${statusIcon} ${statusText}<br>
                        <strong>Writing Analysis Mode:</strong> ${safeValue(c4Work, 'studentWork.analysisMode')}<br>
                        <strong>Word Count:</strong> ${safeValue(c4Work, 'studentWork.wordCount')}<br><br>
                        <strong>Student Writing Sample:</strong><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0; white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${safeValue(c4Work, 'studentWork.writingContent')}</div>
                    </div>
                `;
            } catch (error) {
                c4Container.innerHTML = '<div class="missing-work">❌ Error loading C4 data: ' + error.message + '</div>';
            }
        }
    }

    // Load instructor assessment and update UI accordingly
    function loadInstructorAssessment() {
        try {
            const saved = localStorage.getItem('plagiarism-instructor-assessment');
            if (saved) {
                const data = JSON.parse(saved);
                document.getElementById("instructor-comment").value = data.instructorComment;
                document.getElementById("assessment-status").textContent =
                    data.assessmentStatus === 'pass' ? 'Pass - Demonstrates Mastery' :
                    data.assessmentStatus === 'retry' ? 'Retry - Needs Additional Work' :
                    '-- Pending Assessment --';

                const saveDate = new Date(data.timestamp).toLocaleString();
                const statusNotice = document.getElementById("status-notice");

                if (data.assessmentStatus === 'pass') {
                    statusNotice.className = "certificate-notice";
                    statusNotice.textContent = `🎓 Assessment Completed: ${saveDate} - Congratulations on achieving mastery!`;
                    statusNotice.style.display = "block";

                    // Show certificate confirmation section
                    document.getElementById("certificate-confirmation").style.display = "block";
                    document.getElementById("retry-instructions").style.display = "none";

                } else if (data.assessmentStatus === 'retry') {
                    statusNotice.className = "retry-notice";
                    statusNotice.textContent = `Assessment Completed: ${saveDate} - Additional work required`;
                    statusNotice.style.display = "block";

                    // Show retry instructions section
                    document.getElementById("retry-instructions").style.display = "block";
                    document.getElementById("certificate-confirmation").style.display = "none";
                }
            } else {
                document.getElementById("instructor-comment").placeholder = "Waiting for instructor assessment...";
                document.getElementById("assessment-status").textContent = "-- Pending Assessment --";
            }
        } catch (error) {
            showStatusMessage("❌ Failed to load assessment: " + error.message, "error");
        }
    }

    // Handle certificate confirmation checkbox
    document.getElementById("confirm-receipt").onchange = function() {
        const submitButton = document.getElementById("submit-confirmation");
        submitButton.disabled = !this.checked;

        if (this.checked) {
            submitButton.style.opacity = "1";
            submitButton.style.cursor = "pointer";
        } else {
            submitButton.style.opacity = "0.6";
            submitButton.style.cursor = "not-allowed";
        }
    };

    // Handle certificate confirmation submission
    document.getElementById("submit-confirmation").onclick = function() {
        if (!document.getElementById("confirm-receipt").checked) {
            showStatusMessage("⚠️ Please check the confirmation box before submitting", "error");
            return;
        }

        try {
            const confirmationData = {
                confirmed: true,
                confirmationDate: new Date().toISOString(),
                studentConfirmation: "I confirm that I have received and understand my APA Reference and Citation Mastery Certificate."
            };

            localStorage.setItem('plagiarism-certificate-confirmation', JSON.stringify(confirmationData));

            // Update the UI to show confirmation success
            const confirmationSection = document.getElementById("certificate-confirmation");
            confirmationSection.innerHTML = `
                <h3 style="margin-top: 0; color: #155724;">✅ Certificate Confirmation Received</h3>
                <p style="color: #155724;">
                    Thank you for confirming receipt of your APA Reference and Citation Mastery Certificate.
                    Your confirmation was recorded on ${new Date().toLocaleString()}.
                </p>
                <p style="color: #155724; font-weight: bold;">
                    You have successfully completed the Plagiarism Avoidance Workshop!
                </p>
            `;

            showStatusMessage("Certificate confirmation submitted successfully!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save confirmation: " + error.message, "error");
        }
    };

    // Initial load
    loadStudentWork();
    loadInstructorAssessment();

    // Check if certificate was already confirmed
    const existingConfirmation = localStorage.getItem('plagiarism-certificate-confirmation');
    if (existingConfirmation) {
        try {
            const confirmationData = JSON.parse(existingConfirmation);
            if (confirmationData.confirmed) {
                const confirmationSection = document.getElementById("certificate-confirmation");
                if (confirmationSection.style.display !== "none") {
                    const confirmDate = new Date(confirmationData.confirmationDate).toLocaleString();
                    confirmationSection.innerHTML = `
                        <h3 style="margin-top: 0; color: #155724;">✅ Certificate Confirmation Received</h3>
                        <p style="color: #155724;">
                            Thank you for confirming receipt of your APA Reference and Citation Mastery Certificate.
                            Your confirmation was recorded on ${confirmDate}.
                        </p>
                        <p style="color: #155724; font-weight: bold;">
                            You have successfully completed the Plagiarism Avoidance Workshop!
                        </p>
                    `;
                }
            }
        } catch (error) {
            console.log("Error loading existing confirmation:", error);
        }
    }
});
</script>
