---
layout: post
breadcrumb: True
toc: True
title: Setting up utterances
description: Learn how to set up utterances for your blog. Utterances is a tool that allows you to have comments on your blog posts.
categories: ['DevOps', 'GitHub Pages']
permalink: /github/pages/utterances
comments: True
---

<div class="lesson-part" data-part="1" style="display:block; color: #ccc;">

<h2>What is Utterances?</h2>

Utterances is a comments widget powered by GitHub Issues. When visitors comment, Utterances creates GitHub issues in the designated repository to store and manage comments. Users must authenticate with GitHub to comment, which helps reduce spam and links comments to accounts.

<div class="frq-box" data-frq-id="1" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
    FRQ 1:
    Explain the primary function of Utterances and how it leverages GitHub's features to achieve its purpose.
    <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
    <button class="grade-button" style="margin-top: 10px;">Grade</button>
    <div class="feedback-box" style="margin-top:1rem; padding:0.8rem; border-radius:8px; background:#ecf0f1; border:1px solid #bdc3c7; color:#1a4d1a; display:none;"></div>
</div>
</div>


<div class="lesson-part" data-part="2" style="display:none; color: #ccc;">

<h2>How to Install Utterances</h2>

<p>Follow these steps to install Utterances on your repository:</p>
<ul>
  <li>Visit the Utterances GitHub App page and click "Install".</li>
  <li>Select the repository or grant access to all repositories as needed.</li>
  <li>Configure the app's permissions (issues access is required).</li>
</ul>

<h3>Usage Snippet (HTML include)</h3>

Place this script in an include (e.g., `_includes/utterances.html`) or directly in your post layout to enable comments:

<pre><code>&lt;script src="https://utteranc.es/client.js"
    repo="OWNER/REPO"
    issue-term="title"
    label="blogpost-comment"
    theme="github-light"
    crossorigin="anonymous"
async&gt;
&lt;/script&gt;</code></pre>

<div class="frq-box" data-frq-id="2" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal0; color: #222;">
    FRQ 2:
    A student reports that Utterances works locally but not on the live GitHub Pages site. What is the likely cause and fix?
    <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
    <button class="grade-button" style="margin-top: 10px;">Grade</button>
    <div class="feedback-box" style="margin-top:1rem; padding:0.8rem; border-radius:8px; background:#ecf0f1; border:1px solid #bdc3c7; color:#1a4d1a; display:none;"></div>
</div>
</div>

<div class="lesson-part" data-part="3" style="display:none; color: #ccc;">

<h2>Troubleshooting</h2>

<p>Common issues:</p>
<ul>
  <li>Utterances creates issues only if the configured repository has issue creation enabled.</li>
  <li>Make sure the <code>repo</code> attribute in the snippet points to the correct repository (owner/name).</li>
  <li>On GitHub Pages, ensure the page is deployed (not just local). If using Actions, confirm the deployment is successful.</li>
</ul>

<div class="frq-box" data-frq-id="3" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1.5rem 0; background:#f9f9f9; box-sizing:border-box; overflow:auto; word-wrap:break-word; white-space:normal; color: #222;">
    FRQ 3:
    List two checks you would perform if Utterances fails to create issues on the live site.
    <textarea rows="5" placeholder="Type your response here..." style="width:100%; border-radius:6px; border:1px solid #ccc; padding:0.5rem; margin-top:0.5rem; background:#fff; color:#222; box-sizing:border-box;"></textarea>
    <button class="grade-button" style="margin-top: 10px;">Grade</button>
    <div class="feedback-box" style="margin-top:1rem; padding:0.8rem; border-radius:8px; background:#ecf0f1; border:1px solid #bdc3c7; color:#1a4d1a; display:none;"></div>
</div>
</div>

<script>
    const FRQ_QUESTIONS = {
        '1': "Explain the primary function of Utterances and how it leverages GitHub's features to achieve its purpose.",
        '2': "A student reports that Utterances works locally but not on the live GitHub Pages site. What is the likely cause and fix?",
        '3': "List two checks you would perform if Utterances fails to create issues on the live site."
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
                    You are an expert tutor grading a student's answer to a free-response question about Jekyll and Liquid.
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
