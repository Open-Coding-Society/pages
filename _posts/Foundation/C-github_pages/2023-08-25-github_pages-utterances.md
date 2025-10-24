---
layout: post
breadcrumb: True
toc: True
title: Setting up Utterances
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
<script type="module">
  import { javaURI, fetchOptions } from '../../assets/js/api/config.js';
  const FRQ_QUESTIONS = {
    '1': "Explain the primary function of Utterances and how it leverages GitHub's features to achieve its purpose.",
    '2': "A student reports that Utterances works locally but not on the live GitHub Pages site. What is the likely cause and fix?",
    '3': "List two checks you would perform if Utterances fails to create issues on the live site."
  };
  const gradeButtons = document.querySelectorAll('.grade-button');
  gradeButtons.forEach(button => {
    button.addEventListener('click', () => {
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
      // Fetch with basic promise syntax
      fetch(`${javaURI}/api/grade`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          answer: studentResponse
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log("Full result from backend:", result);
        let feedbackText = "";
        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
          feedbackText = result.candidates[0].content.parts[0].text;
        } else if (result.feedback) {
          feedbackText = result.feedback;
        } else {
          feedbackText = "Could not generate feedback. Please try again.";
        }
        const formattedFeedback = feedbackText
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br>");
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
      })
      .catch(error => {
        console.error("Error generating feedback:", error);
        feedbackBox.innerHTML = `<span style="color:red;">An error occurred while grading. Please try again.</span>`;
      })
      .finally(() => {
        button.disabled = false;
      });
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
  // Optional: Simpler backoff helper using then()
  function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
    return fetch(url, options)
      .then(response => {
        if (response.status === 429 && retries > 1) {
          return new Promise(resolve => setTimeout(resolve, delay))
            .then(() => fetchWithBackoff(url, options, retries - 1, delay * 2));
        }
        return response;
      })
      .catch(error => {
        if (retries > 1) {
          return new Promise(resolve => setTimeout(resolve, delay))
            .then(() => fetchWithBackoff(url, options, retries - 1, delay * 2));
        }
        throw error;
      });
  }
</script>