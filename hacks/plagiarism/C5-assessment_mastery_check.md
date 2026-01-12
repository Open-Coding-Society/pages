---
layout: post 
title: Plagiarism Avoidance Assessment
description: A tool to assist instructor in evaluating student competency in APA reference and citations. 
author: John Mortensen
permalink: /plagiarism/5
breadcrumb: True
---

## Assessment of Student Mastery

Instructor is able to see student progress on...

1. APA reference session samples (C2).
2. Landmark case studies APA reference revisions (C3).
3. Sample Paragraph, Avoiding Plagism, and Thesis completion (C4).

Instructor has view of each with context description as above.  There is a single comment at the bottom, with a Pass/Retry evaluation.

---

<style>
  .assessment-container {
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
  
  .assessment-textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #6c757d;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    resize: vertical;
  }
  
  .status-select {
    padding: 8px 12px;
    border: 1px solid #6c757d;
    border-radius: 4px;
    font-size: 16px;
    margin-left: 10px;
    color: #495057;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }
  
  .mockup-notice {
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    color: #856404;
  }
</style>

<div class="assessment-container">
  
  <div class="mockup-notice">
    INSTRUCTOR ASSESSMENT MOCKUP - This simulates how an instructor would view student work stored in browser localStorage
  </div>
  
  <h2>Student Work Review</h2>
  
  <!-- C2 Work Display -->
  <div class="student-work-card">
    <div class="lesson-header">
      C2: APA Reference Session Samples
    </div>

    <div id="c2-content">
      <div class="missing-work">
        ⚠️ No C2 student work found in localStorage. Student needs to complete exercises in C2 session.
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
        ⚠️ No C3 student work found in localStorage. Student needs to complete reference correction practice.
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
  
  <!-- Instructor Assessment -->
  <div class="student-work-card">
    <div class="lesson-header">
      Instructor Assessment
    </div>

    <label for="instructor-comment"><strong>Instructor Comments:</strong></label>
    <textarea id="instructor-comment" class="assessment-textarea" placeholder="Provide feedback on student's understanding of APA citations, reference formatting, and plagiarism avoidance..."></textarea>
    
    <!-- Quick Comment Options -->
    <div style="margin: 10px 0; padding: 10px; border: 1px solid #6c757d; border-radius: 4px;">
      <strong>Quick Comment Templates:</strong>
      <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
        <button id="comment-excellent" class="iridescent text-white py-1 px-3 rounded text-sm transition">✅ Excellent Work</button>
        <button id="comment-good" class="iridescent text-white py-1 px-3 rounded text-sm transition">👍 Good Progress</button>
        <button id="comment-needs-work" class="iridescent text-white py-1 px-3 rounded text-sm transition">📝 Needs Revision</button>
        <button id="comment-incomplete" class="iridescent text-white py-1 px-3 rounded text-sm transition">⚠️ Incomplete Sections</button>
      </div>
    </div>
    
    <div style="margin-top: 15px;">
      <label for="assessment-status"><strong>Assessment Status:</strong></label>
      <select id="assessment-status" class="status-select">
        <option value="">-- Select Status --</option>
        <option value="pass">Pass - Demonstrates Mastery</option>
        <option value="retry">Retry - Needs Additional Work</option>
      </select>
    </div>
    
    <div class="button-group">
      <button id="save-assessment" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">Save Assessment</button>
      <button id="load-assessment" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">Load Previous Assessment</button>
      <button id="refresh-student-work" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">Refresh Student Work</button>
    </div>
  </div>
  
  <div id="assessment-status-message" style="margin: 10px 0; padding: 8px; border-radius: 4px; display: none;"></div>
</div>

<script>
console.log("C5 script tag loaded!");

document.addEventListener("DOMContentLoaded", function() {
    console.log("C5 Assessment page script loaded!");

    // Status message helper function
    function showStatusMessage(message, type) {
        const statusDiv = document.getElementById("assessment-status-message");
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

    // Load and display student work
    function loadStudentWork() {
        console.log("loadStudentWork() function called!");

        // Helper function to safely get value or show 'Not available'
        function safeValue(obj, path, defaultValue = 'Not available') {
            return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue;
        }

        // Load C2 Work - Parse from assessment data
        const c2Container = document.getElementById('c2-content');
        const c2AssessmentData = localStorage.getItem('plagiarism-c2-assessment');

        console.log("C2 localStorage check:", c2AssessmentData ? "Data found" : "No data found");

        let c2HasData = false;
        let c2Content = '';

        if (c2AssessmentData) {
            try {
                const c2Work = JSON.parse(c2AssessmentData);
                const completedDate = new Date(c2Work.timestamp).toLocaleString();
                c2HasData = true;
                c2Content = '<div class="work-section">';

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

                c2Content += '</div>';
            } catch (error) {
                c2Content = '<div class="missing-work">❌ Error loading C2 assessment data: ' + error.message + '</div>';
            }
        }

        if (c2HasData) {
            c2Container.innerHTML = c2Content;
        }

        // Load C3 Work - Parse from assessment data  
        const c3Container = document.getElementById('c3-content');
        const c3AssessmentData = localStorage.getItem('plagiarism-c3-assessment');

        let c3HasData = false;
        let c3Content = '';

        if (c3AssessmentData) {
            try {
                const c3Work = JSON.parse(c3AssessmentData);
                const completedDate = new Date(c3Work.timestamp).toLocaleString();
                c3HasData = true;
                c3Content = '<div class="work-section">';

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

                c3Content += '</div>';
            } catch (error) {
                c3Content = '<div class="missing-work">❌ Error loading C3 assessment data: ' + error.message + '</div>';
            }
        }

        if (c3HasData) {
            c3Container.innerHTML = c3Content;
        }

        // Load C4 Work - Parse from assessment data
        const c4Container = document.getElementById('c4-content');
        const c4AssessmentData = localStorage.getItem('plagiarism-c4-assessment');

        if (c4AssessmentData) {
            try {
                const c4Work = JSON.parse(c4AssessmentData);
                const completedDate = new Date(c4Work.timestamp).toLocaleString();
                const content = `
                    <strong>Writing Analysis Mode:</strong> ${safeValue(c4Work, 'studentWork.analysisMode')}<br>
                    <strong>Word Count:</strong> ${safeValue(c4Work, 'studentWork.wordCount')}<br><br>
                    <strong>Student Writing Sample:</strong><br>
                    <div style="padding: 8px; border-radius: 4px; margin: 5px 0; white-space: pre-wrap;">${safeValue(c4Work, 'studentWork.writingContent')}</div>
                `;

                c4Container.innerHTML = `
                    <div class="work-section">
                        <strong>📅 Completed:</strong> ${completedDate}<br><br>
                        <strong>C4 Writing Workshop:</strong><br>
                        <div style="padding: 8px; border-radius: 4px; margin: 5px 0;">
                            ${content}
                        </div>
                    </div>
                `;
            } catch (error) {
                c4Container.innerHTML = '<div class="missing-work">❌ Error loading C4 data: ' + error.message + '</div>';
            }
        }
    }

    // Save instructor assessment
    document.getElementById("save-assessment").onclick = function() {
        const comment = document.getElementById("instructor-comment").value.trim();
        const status = document.getElementById("assessment-status").value;

        if (comment.length === 0 || status === "") {
            showStatusMessage("⚠️ Please provide both comment and status before saving", "error");
            return;
        }

        try {
            const assessmentData = {
                instructorComment: comment,
                assessmentStatus: status,
                timestamp: new Date().toISOString(),
                studentDataReviewed: {
                    c2Available: !!localStorage.getItem('plagiarism-c2-assessment'),
                    c3Available: !!localStorage.getItem('plagiarism-c3-assessment'),
                    c4Available: !!localStorage.getItem('plagiarism-c4-assessment')
                }
            };

            localStorage.setItem('plagiarism-instructor-assessment', JSON.stringify(assessmentData));
            showStatusMessage("Assessment saved successfully!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save assessment: " + error.message, "error");
        }
    };

    // Load instructor assessment function (extracted from button click)
    function loadInstructorAssessment() {
        try {
            const saved = localStorage.getItem('plagiarism-instructor-assessment');
            if (saved) {
                const data = JSON.parse(saved);
                document.getElementById("instructor-comment").value = data.instructorComment;
                document.getElementById("assessment-status").value = data.assessmentStatus;
                const saveDate = new Date(data.timestamp).toLocaleString();
                showStatusMessage(`Assessment loaded! (Saved: ${saveDate})`, "success");
            } else {
                // Don't show warning on initial load if no saved assessment
                console.log("No saved instructor assessment found");
            }
        } catch (error) {
            console.error("Error loading instructor assessment:", error);
        }
    }

    // Load instructor assessment button (now calls the function)
    document.getElementById("load-assessment").onclick = function() {
        loadInstructorAssessment();
        // Show user feedback for manual clicks
        if (!localStorage.getItem('plagiarism-instructor-assessment')) {
            showStatusMessage("⚠️ No saved assessment found", "info");
        }
    };

    // Refresh student work
    document.getElementById("refresh-student-work").onclick = function() {
        loadStudentWork();
        showStatusMessage("Student work refreshed from localStorage", "info");
    };

    // Quick comment templates functionality
    function addQuickComment(template) {
        const commentArea = document.getElementById('instructor-comment'); // Fixed: removed 's'
        if (commentArea) {
            const currentText = commentArea.value;
            const separator = currentText.trim() ? '\n\n' : '';
            commentArea.value = currentText + separator + template;

            // Trigger the input event to ensure any validation or auto-save works
            commentArea.dispatchEvent(new Event('input', { bubbles: true }));

            // Show feedback
            showStatusMessage("Comment template added", "success");
        } else {
            console.error("Could not find instructor-comment textarea");
        }
    }

    // Add event listeners for comment template buttons
    document.getElementById('comment-excellent').onclick = function() {
        addQuickComment("Excellent Work! You've demonstrated a comprehensive understanding of academic integrity principles. Your citations are properly formatted, your writing shows clear original thinking, and you've successfully avoided plagiarism pitfalls. Keep up the outstanding work!");
    };

    document.getElementById('comment-good').onclick = function() {
        addQuickComment("Good Progress! You're showing solid understanding of the material. Your work demonstrates effort and learning. Continue to focus on proper citation techniques and original expression of ideas.");
    };

    document.getElementById('comment-needs-work').onclick = function() {
        addQuickComment("Needs Revision: Review the reported sections that are incomplete or need improvement. Please pay special attention to citation formatting and ensure all sources are properly attributed. Resubmit after making necessary corrections.");
    };

    document.getElementById('comment-incomplete').onclick = function() {
        addQuickComment("Incomplete Sections: Several required components are missing or inadequately completed. Please review the assignment requirements and complete all sections before resubmission. Focus on thoroughness and attention to detail.");
    };

    // Initial load - call functions directly like C6 does
    console.log("C5 Assessment page - performing initial load");

    // Try immediate load
    try {
        loadStudentWork();
        loadInstructorAssessment();
        console.log("Initial setup complete - immediate");
    } catch (error) {
        console.error("Error in immediate initial load:", error);
    }

    // Also try with a small delay as backup
    setTimeout(function() {
        console.log("C5 Assessment page - backup delayed load");
        try {
            loadStudentWork();
            loadInstructorAssessment();
            console.log("Backup load complete");
        } catch (error) {
            console.error("Error in backup load:", error);
        }
    }, 500);
});
</script>
