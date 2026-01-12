---
layout: post
breadcrumb: True
toc: True
title: Jekyll Themes - Deep Dive
description: Builds upon the first lesson of Jekyll Themes to ensure understanding, and has questions to test your knowledge,. Jekyll Themes willbe crucial, so it is important to understand it. 
categories: ['GitHub Pages']
permalink: /github/pages/jekylltwo
comments: True
authors: Ahaan Vaidyanathan, Nikhil Narayan, Arnav Mittal, Xavier Thompson, Spencer Lyons, Shaurya Singh
---

<body>
    <div class="lesson-part" data-part="1" style="display:block;">
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
        <div class="frq-box" data-frq-id="1" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
            <b>FRQ 1:</b> Explain why Jekyll uses layouts and includes. How do these features make web development easier?<br><br>
            <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
            <p></p>
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

#Example snippet from _config.yml
remote_theme: jekyll/minima

</code></pre>
        <div class="frq-box" data-frq-id="2" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
            <b>FRQ 2:</b> Describe the role of <code>_config.yml</code> in Jekyll. Why is it important for themes?<br><br>
            <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
            <p></p>
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
        <div class="frq-box" data-frq-id="3" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
            <b>FRQ 3:</b> Compare the strengths of Minima and TeXt. Which would you choose and why?<br><br>
            <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
            <p></p>
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
        <div class="frq-box" data-frq-id="4" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
            <b>FRQ 4:</b> A student’s theme won’t switch even after editing <code>_config.yml</code>. What steps would you take to troubleshoot?<br><br>
            <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
            <p></p>
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
        <div class="frq-box" data-frq-id="5" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
            <b>FRQ 5:</b> Summarize in your own words why themes are valuable for developers using Jekyll.<br><br>
            <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
            <p></p>
            <button class="grade-button" style="margin-top: 10px;">Grade</button>
            <div class="feedback-box"></div>
        </div>
    </div>
        <script type="module">
                import { javaURI, fetchOptions } from '../../assets/js/api/config.js';
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
                        feedbackBox.innerHTML = `
                            <div class="flex items-center space-x-2">
                                <div class="loading-spinner"></div>
                                <span>Grading...</span>
                            </div>`;
                        try {
                            const response = await fetch(`${javaURI}/api/grade`, {
                                method: 'POST',
                                mode: 'cors',
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    question: questionText,
                                    answer: studentResponse
                                })
                            });
                            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                            const result = await response.json();
                            console.log("Full result from backend:", result);
                            let feedbackText;
                            try {
                                feedbackText = result.candidates?.[0]?.content?.parts?.[0]?.text
                                    || result.feedback
                                    || "Could not generate feedback. Please try again.";
                            } catch (e) {
                                console.error("Error parsing feedback:", e);
                                feedbackText = "Could not generate feedback. Please try again.";
                            }
                            const formattedFeedback = feedbackText
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\n/g, "<br>");
                            feedbackBox.innerHTML = formattedFeedback
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
                        if (saved) textarea.value = saved;
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
                        </div>`;
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