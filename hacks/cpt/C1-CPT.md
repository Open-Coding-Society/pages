---
layout: post
microblog: True
breadcrumb: True
title: CPT Project Idea Workshop
description: A tool to help students brainstorm and refine their CPT project ideas and purpose.
author: David M, Sloane S
permalink: /cpt/1
---

## CPT Project Idea Builder

Use this tool to help you brainstorm and improve your CPT project idea.

Your CPT project should:
- Be simple and easy to explain
- Solve a small, clear problem
- Have a clear purpose and user

### CPT Idea Helper

<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<style>
/* Target the output container */
#output {
    /* Ensure long content and formatting is handled correctly */
    padding: 10px;
    /* Allows text to wrap naturally inside the div */
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.controls {
    margin: 10px 0;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

label {
    font-weight: bold;
    font-size: 14px;
}

select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    color: white;
    background-color: #333;
}

button {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.sample-text {
    display: none;
}

/* File-specific styles only - iridescent styles moved to _sass/open-coding/elements/buttons/iridescent.scss */
</style>

<details style="padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
  <summary style="cursor: pointer; font-weight: bold; color: #007bff; font-size: 18px;">Writing Helper (Click to see guide)</summary>
  <div style="margin-top: 10px;">
    <p>This drafting analysis tool helps you improve your CPT Idea by providing AI-powered feedback.</p>

    <h4>Idea Support Modes:</h4>
  <ul>
     <li><strong>Project Purpose Check:</strong> Helps explain the main goal and purpose of your CPT project</li>
     <li><strong>User & Feature Builder:</strong> Helps identify who will use your project and what features it should include</li>
     <li><strong>Idea Expansion:</strong> Suggests additional features and ways to improve your project idea</li>
     <li><strong>CPT Project Review:</strong> Gives feedback on whether your project idea is simple, clear, and realistic for APCSP CPT</li>
  </ul>
    
    <p><em>Note: Sample texts are provided for each mode to help you explore different types of feedback. You can replace them with your own ideas.</em></p>
  </div>
</details>

<div class="controls">
    <div class="control-group">
        <select id="analysisMode">
            <option value="purposecheck">Project Purpose Check</option>
            <option value="userfeature">User & Feature Builder</option>
            <option value="ideacheck">Idea Expansion</option>
            <option value="overview">CPT Project Review</option>
        </select>
    </div>
    <div class="control-group">
        <button id="saveBtn" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">💾 Save Draft</button>
        <button id="loadBtn" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">📂 Load Draft</button>
    </div>
</div>

<div id="quill-editor" style="height: 200px;"></div>

<div class="controls">
    <button id="test-mode-c4" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">
        🧪 Show Example CPT Idea
    </button>

    <button id="checkBtn" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">
        🔍 Review My CPT Idea
    </button>

    <button id="submitBtn" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #28a745;" disabled>
        📤 Submit CPT Draft
    </button>
</div>

<div id="status-message" style="margin: 10px 0; padding: 8px; border-radius: 4px; display: none;"></div>

<div id="output"></div>

<!-- Hidden sample texts -->
<div class="sample-text" data-type="purposecheck">
My CPT project is a Social Club Finder. The purpose of my program is to help people(in a certain location) easily search for social clubs, meeting times, and locations. Users can search for clubs by category or interest and view important information about each club in one place.
</div>

<div class="sample-text" data-type="purposecheck">
My CPT project is a Fast Food Comparison Tool. The purpose of my program is to help users compare fast food meals based on price, calories, and ratings. Users can search for restaurants, compare menu items, and find meals that match their preferences.
</div>

<div class="sample-text" data-type="userfeature">
My CPT project is a Homework Tracker. The purpose of my program is to help students stay organized with assignments and due dates. Users can create homework tasks, sort assignments by class, set reminders, and mark completed work when finished.
</div>

<div class="sample-text" data-type="ideacheck">
My CPT project is a Quiz Practice App that helps students study for tests using multiple-choice questions. Users can select a subject, answer quiz questions, view their score, and retry questions they missed to improve their understanding.
</div>

<div class="sample-text" data-type="overview">
My CPT project is a Study Planner designed to help students organize homework, tests, and study schedules. The purpose of my program is to help students manage their time more effectively and stay organized throughout the school week. Users can create study tasks, set deadlines, organize assignments by subject, and track completed work. The program also includes reminders and a daily schedule view to help students plan ahead and reduce stress.
</div>

<script type="module">
    // Import the new modular API
    import { queryGemini } from '{{ site.baseurl }}/assets/js/api/gemini.js';

    // Analysis prompts for different modes
 const ANALYSIS_PROMPTS = {
    purposecheck: "Please evaluate this CPT project idea. Check if the purpose is clear, simple, and easy to understand. Suggest improvements to make the project goal more specific and focused.",
    
    userfeature: "Please evaluate this CPT project idea. Identify the users and suggested features. Suggest additional simple features that would improve the project while keeping it realistic for AP CSP.",
    
    ideacheck: "Please evaluate this CPT project idea and suggest ways to expand or improve it. Focus on making the idea more complete, realistic, and appropriate for a CPT project.",
    
    overview: "Please evaluate this CPT project idea overall. Check if it is simple, realistic, clearly explained, and appropriate for AP CSP CPT requirements. Provide suggestions for improvement if needed."
};

    document.addEventListener("DOMContentLoaded", function() {
        var quill = new Quill('#quill-editor', {
            theme: 'snow'
        });

        // Load a random sample on page load
        loadRandomSample();

        // Test Mode - Fill editor with sample text
        document.getElementById("test-mode-c4").onclick = function() {
            if (confirm("This will fill the editor with sample text for testing. Continue?")) {
                const sampleText = `
My CPT project is a School Club Finder.

The purpose of my program is to help students easily find clubs, meeting times, and locations.

Users can search for clubs by category or interest.

The program will include features such as searching, filtering clubs, and viewing club details.

This project helps students quickly discover opportunities to join school activities.
`;
                quill.setText(sampleText);
                document.getElementById("submitBtn").disabled = false;
                showStatusMessage("🧪 Test mode: Editor filled with a sample CPT project idea!", "info");
            }
        };

        // Save Draft button
        document.getElementById("saveBtn").onclick = function() {
            const text = quill.getContents(); // Get full Delta format with formatting
            const plainText = quill.getText(); // Get plain text
            const mode = document.getElementById("analysisMode").value;

            const draft = {
                content: text,
                plainText: plainText,
                mode: mode,
                timestamp: new Date().toISOString(),
                id: 'cpt-idea-draft-v1' // Updated for CPT project system
            };

            try {
                localStorage.setItem('cpt-idea-draft', JSON.stringify(draft));
                showStatusMessage("✅ CPT idea draft saved successfully!", "success");

                // Enable submit button if there's content
                if (plainText.trim().length > 0) {
                    document.getElementById("submitBtn").disabled = false;
                }
            } catch (error) {
                showStatusMessage("❌ Failed to save CPT draft: " + error.message, "error");
            }
        };

        // Load Draft button
        document.getElementById("loadBtn").onclick = function() {
            try {
                const savedDraft = localStorage.getItem('cpt-idea-draft');

                if (savedDraft) {
                    const draft = JSON.parse(savedDraft);

                    // Set the content with formatting
                    quill.setContents(draft.content);

                    // Set the analysis mode
                    document.getElementById("analysisMode").value = draft.mode;

                    // Show success message with timestamp
                    const saveDate = new Date(draft.timestamp).toLocaleString();
                    showStatusMessage(`✅ CPT idea loaded successfully! (Saved: ${saveDate})`, "success");

                    // Enable submit button if there's content
                    if (draft.plainText && draft.plainText.trim().length > 0) {
                        document.getElementById("submitBtn").disabled = false;
                    }
                } else {
                    showStatusMessage("⚠️ No CPT draft found", "warning");
                }
            } catch (error) {
                showStatusMessage("❌ Failed to load CPT draft: " + error.message, "error");
            }
        };

        // Submit button - Move from draft to assessment storage
        document.getElementById("submitBtn").onclick = function() {
            const text = quill.getText().trim();
            const content = quill.getContents();
            const mode = document.getElementById("analysisMode").value;

            if (text.length === 0) {
                showStatusMessage("⚠️ Cannot submit empty CPT idea", "warning");
                return;
            }

            try {
                // Create assessment data from current editor content
                const assessmentData = {
                    lesson: 'C1-cpt-idea-builder',
                    studentWork: {
                        writingContent: text,
                        deltaContent: content, // Full Quill.js Delta format
                        analysisMode: mode,
                        wordCount: text.split(/\s+/).filter(word => word.length > 0).length
                    },
                    timestamp: new Date().toISOString(),
                    completed: true
                };

                // Move from draft storage to instructor assessment storage
                localStorage.setItem('cpt-idea-assessment', JSON.stringify(assessmentData));

                // Remove the draft since it's now submitted
                localStorage.removeItem('cpt-idea-draft');

                showStatusMessage("🎓 CPT idea submitted successfully! Draft cleared.", "success");

                // Disable submit button after successful submission
                document.getElementById("submitBtn").disabled = true;
            } catch (error) {
                showStatusMessage("❌ Failed to submit CPT idea: " + error.message, "error");
            }
        };

        // Auto-save on content change (optional)
        let autoSaveTimeout;
        quill.on('text-change', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // Auto-enable submit button when there's content
                const text = quill.getText().trim();
                document.getElementById("submitBtn").disabled = text.length === 0;
            }, 500);
        });

        // Status message helper function
        function showStatusMessage(message, type) {
            const statusDiv = document.getElementById("status-message");
            statusDiv.textContent = message;
            statusDiv.style.display = "block";

            // Style based on message type
            switch(type) {
                case "success":
                    statusDiv.style.backgroundColor = "#d4edda";
                    statusDiv.style.color = "#155724";
                    statusDiv.style.border = "1px solid #c3e6cb";
                    break;
                case "error":
                    statusDiv.style.backgroundColor = "#f8d7da";
                    statusDiv.style.color = "#721c24";
                    statusDiv.style.border = "1px solid #f5c6cb";
                    break;
                case "warning":
                    statusDiv.style.backgroundColor = "#fff3cd";
                    statusDiv.style.color = "#856404";
                    statusDiv.style.border = "1px solid #ffeaa7";
                    break;
                case "info":
                    statusDiv.style.backgroundColor = "#d1ecf1";
                    statusDiv.style.color = "#0c5460";
                    statusDiv.style.border = "1px solid #bee5eb";
                    break;
            }

            // Auto-hide after 3 seconds
            setTimeout(() => {
                statusDiv.style.display = "none";
            }, 3000);
        }

        // Load a random sample on page load
        loadRandomSample();

        // Analyze Text button
        document.getElementById("checkBtn").onclick = function() {
            const text = quill.getText();
            const mode = document.getElementById("analysisMode").value;
            const outputDiv = document.getElementById("output");

            // Clear previous output and show analyzing message
            outputDiv.textContent = "⏳ Reviewing CPT idea...";

            const prompt = ANALYSIS_PROMPTS[mode] || ANALYSIS_PROMPTS.plagiarism;

            // Use the new modular API with functional programming style
            queryGemini({
                prompt: prompt,
                text: text
                // parseJSON: false (default) - C4 expects raw text/markdown for analysis
            })
            .then(result => {
                // result is already parsed and validated by the API
                // The API ensures result.success and result.text exist
                const markdown = result.text;

                // Convert the Markdown content into fully styled HTML
                const htmlContent = marked.parse(markdown);

                // Insert the formatted HTML into the output div
                outputDiv.innerHTML = htmlContent;

                // Show success status
                showStatusMessage("✅ CPT idea review complete!", "success");
            })
            .catch(error => {
                // Clear the analyzing message and show error status
                outputDiv.textContent = "";
                showStatusMessage("⚠️ " + error.message, "error");
            });
        };

        function loadRandomSample() {
            const mode = document.getElementById("analysisMode").value;
            const samples = document.querySelectorAll(`.sample-text[data-type="${mode}"]`);

            if (samples.length === 0) {
                // Fallback to plagiarism samples if mode has no samples
                const fallbackSamples = document.querySelectorAll('.sample-text[data-type="purposecheck"]');
                if (fallbackSamples.length > 0) {
                    const randomIndex = Math.floor(Math.random() * fallbackSamples.length);
                    quill.setText(fallbackSamples[randomIndex].textContent.trim());
                }
                return;
            }

            const randomIndex = Math.floor(Math.random() * samples.length);
            quill.setText(samples[randomIndex].textContent.trim());
        }

        // Update sample when analysis mode changes
        document.getElementById("analysisMode").onchange = function() {
            loadRandomSample();
        };
    });
</script>
