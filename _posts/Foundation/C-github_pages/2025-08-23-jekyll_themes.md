---
layout: post
breadcrumb: True
toc: True
title: Jekyll Themes
description: Builds upon the first lesson of Jekyll Themes to ensure understanding, and has questions to test your knowledge,. Jekyll Themes willbe crucial, so it is important to understand it. 
categories: ['GitHub Pages']
permalink: /github/pages/jekylltwo
comments: True
authors: Ahaan Vaidyanathan, Nikhil Narayan, Arnav Mittal, Xavier Thompson, Spencer Lyons, Shaurya Singh
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jekyll Themes Lesson</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0 auto;
            max-width: 800px;
            padding: 2rem;
            color: #333;
        }
        h2, h3 {
            color: #2c3e50;
        }
        hr {
            border: 0;
            border-top: 1px solid #ddd;
            margin: 2rem 0;
        }
        .frq-box {
            border: 1px solid #ccc;
            padding: 1rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            background: #f9f9f9;
        }
        .frq-box h3, .frq-box b {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 0.5rem;
        }
        textarea {
            font-family: inherit;
            font-size: 1rem;
            padding: 0.5rem;
            width: 100%;
            border-radius: 6px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            margin-top: 0.5rem;
        }
        .grade-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 1rem;
            transition: background-color 0.3s ease;
        }
        .grade-button:hover {
            background-color: #2980b9;
        } 
        .grade-button:disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
        }
        pre {
            background-color: #2d2d2d;
            color: #ccc;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', monospace;
            background-color: #e9ecef;
            color: #333;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }
        pre code {
            background-color: transparent;
            color: #ccc;
        }        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .feedback-box {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            background-color: #ecf0f1;
            border: 1px solid #bdc3c7;
            display: none;
        }
        .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .space-x-2 > * + * { margin-left: 0.5rem; }
        .hidden { display: none; }
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .modal-button {
            background-color: #3498db;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="lesson-part" data-part="1" style="display:block;">
        <h2>Lesson 3: Jekyll Themes</h2>
        <h3>Introduction</h3>
        <p>
        Jekyll themes provide a powerful way to quickly style and structure your GitHub Pages website without extensive CSS coding. 
        This lesson will further delve into how Jekyll themes work, how to switch between them, and how to troubleshoot common issues, 
        enabling you to effectively manage your site’s visual presentation. 
        </p>
        <hr>
        <h3>Understanding Jekyll Themes</h3>
        <p>
        A Jekyll theme is a collection of layouts, includes, stylesheets, and scripts that define the look and feel of your website. 
        When you apply a theme, Jekyll uses these files to render your content consistently across all pages. 
        This modular approach allows for rapid development and easy customization.
        </p>
        <ul>
            <li><b>Layouts:</b> HTML files (e.g., <code>default.html</code>, <code>page.html</code>, <code>post.html</code>) that provide the overall structure. Your content is injected into these layouts.</li>
            <li><b>Includes:</b> Reusable HTML snippets (e.g., headers, footers, navigation menus).</li>
            <li><b>Assets:</b> CSS, JavaScript, and images that control visual design and interactivity.</li>
            <li><b>Configuration:</b> Theme-specific settings often defined in <code>_config.yml</code> or in the theme’s own configuration files.</li>
        </ul>
        <div class="frq-box" data-frq-id="1">
            <b>FRQ 1:</b> Explain why Jekyll uses layouts and includes. How do these features make web development easier?<br><br>
            <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
    <div class="lesson-part" data-part="2" style="display:none;">
        <hr>
        <h3>Theme Switching Guide</h3>
        <p>
        Switching between Jekyll themes involves modifying your <code>_config.yml</code> file and ensuring that the necessary theme files are correctly referenced. 
        The process can be simplified using scripts or by directly editing the configuration.
        </p>
        <pre><code class="language-yaml">

# Example snippet from _config.yml

</code></pre>
        <div class="frq-box" data-frq-id="2">
            <b>FRQ 2:</b> Describe the role of <code>_config.yml</code> in Jekyll. Why is it important for themes?<br><br>
            <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
    <div class="lesson-part" data-part="3" style="display:none;">
        <hr>
        <h3>Theme Features (Minima vs. TeXt)</h3>
        <p>Different themes offer distinct features and design philosophies. Here’s a comparison of two popular Jekyll themes:</p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
            <tr>
                <th>Feature</th>
                <th>Minima Theme</th>
                <th>TeXt Theme</th>
            </tr>
            <tr>
                <td><b>Design</b></td>
                <td>Clean, minimal</td>
                <td>Modern iOS 11-inspired</td>
            </tr>
            <tr>
                <td><b>Dark Mode</b></td>
                <td>Supported</td>
                <td>Supported (6 skins)</td>
            </tr>
            <tr>
                <td><b>Responsiveness</b></td>
                <td>Mobile responsive</td>
                <td>Mobile responsive</td>
            </tr>
            <tr>
                <td><b>Math/Diagrams</b></td>
                <td>Limited</td>
                <td>MathJax & Mermaid supported</td>
            </tr>
        </table>
        <div class="frq-box" data-frq-id="3">
            <b>FRQ 3:</b> Compare the strengths of Minima and TeXt. Which would you choose and why?<br><br>
            <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
    <div class="lesson-part" data-part="4" style="display:none;">
        <hr>
        <h3>Troubleshooting Theme Issues</h3>
        <ol>
            <li><b>Missing SASS Variables:</b> Ensure your theme installation is complete.</li>
            <li><b>Build Errors:</b> Run <code>make clean && make</code> or <code>bundle exec jekyll build</code>.</li>
            <li><b>Theme Not Switching:</b> Double-check the <code>remote_theme</code> value in <code>_config.yml</code>.</li>
            <li><b>Backup:</b> Always back up <code>_config.yml</code> before big changes.</li>
        </ol>
        <div class="frq-box" data-frq-id="4">
            <b>FRQ 4:</b> A student’s theme won’t switch even after editing <code>_config.yml</code>. What steps would you take to troubleshoot?<br><br>
            <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
    <div class="lesson-part" data-part="5" style="display:none;">
        <hr>
        <h3>Conclusion</h3>
        <p>
        Jekyll themes are a powerful asset for creating visually appealing and functional GitHub Pages sites.
        By understanding their structure, switching methods, and troubleshooting techniques, you can leverage themes to enhance your web projects and focus more on content creation rather than design details.
        </p>
        <div class="frq-box" data-frq-id="5">
            <b>FRQ 5:</b> Summarize in your own words why themes are valuable for developers using Jekyll.<br><br>
            <textarea rows="5" style="width:100%;" placeholder="Type your response here..."></textarea>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
    <script>
        const FRQ_QUESTIONS = {
            '1': "Explain why Jekyll uses layouts and includes. How do these features make web development easier?",
            '2': "Describe the role of `_config.yml` in Jekyll. Why is it important for themes?",
            '3': "Compare the strengths of Minima and TeXt. Which would you choose and why?",
            '4': "A student’s theme won’t switch even after editing `_config.yml`. What steps would you take to troubleshoot?",
            '5': "Summarize in your own words why themes are valuable for developers using Jekyll."
        };
        const gradeButtons = document.querySelectorAll('.grade-button');
        gradeButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const frqBox = button.closest('.frq-box');
                const frqId = frqBox.dataset.frqId;
                const questionText = FRQ_QUESTIONS[frqId];
                const studentResponseTextArea = frqBox.querySelector('textarea');
                const feedbackBox = frqBox.querySelector('.feedback-box');
                const studentResponse = studentResponseTextArea.value.trim();
                if (!studentResponse) {
                    showModal("Please enter your response before submitting.");
                    return;
                }
                // Show loading state
                button.disabled = true;
                feedbackBox.style.display = 'block';
                feedbackBox.innerHTML = '<div class="flex items-center space-x-2"><div class="loading-spinner"></div><span>Grading...</span></div>';
                try {
                    const systemPrompt = `
                        You are an expert tutor grading a student's answer to a free-response question about Jekyll themes.
                        Your task is to:
                        1. Determine a grade for the student's response based on the following 1-5 scale:
                           - 5: The answer addresses all parts of the question and is detailed and comprehensive.
                           - 4: The answer is correct and addresses most parts of the question.
                           - 3: The answer is correct but may be incomplete or lack detail.
                           - 2: The answer has significant inaccuracies or is incomplete.
                           - 1: The answer is incorrect or does not address the question.
                           Write the grade like this: "Grade: (1-5)/5"
                        2. Provide detailed, constructive feedback explaining the grade.
                        3. Offer very short suggestions on what the user could improve on, enough to give them a hint but not enough for them to figure out what to answer.
                        The question is: "${questionText}"
                        The student's response is: "${studentResponse}"
                        Format your final output with a clear heading for the grade and the feedback. Also, in the final output don't include hashtags to make your text bigger, it messes with the system on my end.
                    `;
                    const apiKey = "AIzaSyB3Ky_RSgPsdXBt5I32ZVWRZ09Ont5_xmQ";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                    const payload = {
                        contents: [{
                            parts: [
                                { text: systemPrompt }
                            ]
                        }]
                    };
                    const response = await fetchWithBackoff(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    const feedbackText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate feedback. Please try again.";
                    const formattedFeedback = feedbackText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>');
                    feedbackBox.innerHTML = formattedFeedback;
                    // Unlock next part if grade is 4 or 5
                    const gradeMatch = feedbackText.match(/Grade:\s*(\d)\/5/);
                    if (gradeMatch && parseInt(gradeMatch[1], 10) >= 4) {
                        const currentPart = parseInt(frqBox.closest('.lesson-part').dataset.part, 10);
                        const nextPart = document.querySelector(`.lesson-part[data-part="${currentPart + 1}"]`);
                        if (nextPart) {
                            nextPart.style.display = 'block';
                            nextPart.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                } catch (error) {
                    console.error("Error generating feedback:", error);
                    feedbackBox.innerHTML = `<span style="color:red;">An error occurred while grading. Please try again.</span>`;
                } finally {
                    button.disabled = false;
                }
            });
        });
        // Auto-save FRQ responses into localStorage
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(".frq-box textarea").forEach((textarea, index) => {
                const key = "jekyll_frq_answer_" + index;
                const saved = localStorage.getItem(key);
                if (saved) {
                    textarea.value = saved;
                }
                textarea.addEventListener("input", () => {
                    localStorage.setItem(key, textarea.value);
                });
            });
        });
        // Simple modal for alerts
        function showModal(message) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <p>${message}</p>
                    <button class="modal-button" onclick="this.closest('.modal').remove()">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        // Exponential backoff for API retries
        async function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (response.status === 429 && i < retries - 1) {
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                        continue;
                    }
                    return response;
                } catch (error) {
                    if (i < retries - 1) {
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                        continue;
                    }
                    throw error;
                }
            }
        }
    </script>
</body>
</html>