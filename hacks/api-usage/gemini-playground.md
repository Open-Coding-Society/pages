---
layout: post
title: Gemini AI Playground
description: Interactive tool to explore different AI prompts and response formats
author: John Mortensen
permalink: /hacks/gemini
breadcrumb: True
---

## AI Prompt Engineering Playground

Learn how different prompts generate different types of responses from AI. Practice prompt engineering with real examples.

<style>
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

textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
}

#output {
    padding: 15px;
    border-left: 4px solid #007bff;
    border-radius: 4px;
    margin-top: 15px;
    min-height: 100px;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.sample-prompts {
    display: none;
}
</style>

<details style="padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
  <summary style="cursor: pointer; font-weight: bold; color: #007bff; font-size: 18px;">Prompt Engineering Guide (Click to see tips)</summary>
  <div style="margin-top: 10px;">
    <h4>What is Prompt Engineering?</h4>
    <p>Prompt engineering is the practice of designing effective prompts to get better AI responses. The way you ask determines the quality of the answer.</p>

    <h4>Response Types:</h4>
    <ul>
      <li><strong>JSON Data:</strong> Structured responses for citations, data extraction, form filling</li>
      <li><strong>Analysis Text:</strong> Readable feedback for writing, research, explanations</li>
      <li><strong>Creative Writing:</strong> Stories, poems, creative content</li>
      <li><strong>Code Generation:</strong> Programming solutions and examples</li>
    </ul>
    
    <h4>Prompt Tips:</h4>
    <ul>
      <li>Be specific about the format you want (JSON, paragraph, list, etc.)</li>
      <li>Provide examples of desired output</li>
      <li>Use clear, direct language</li>
      <li>Break complex tasks into steps</li>
    </ul>
  </div>
</details>

<div class="controls">
    <div class="control-group">
        <label for="promptType">Prompt Category:</label>
        <select id="promptType">
            <option value="json-extraction">JSON Data Extraction</option>
            <option value="writing-analysis">Writing Analysis</option>
            <option value="creative">Creative Writing</option>
            <option value="code-help">Code Generation</option>
            <option value="research">Research Assistant</option>
        </select>
    </div>
    <div class="control-group">
        <button id="loadSample" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">📋 Load Sample</button>
        <button id="clearAll" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">🗑️ Clear</button>
    </div>
</div>

<div class="control-group">
    <label for="promptInput">Your Prompt (edit or create your own):</label>
    <textarea id="promptInput" placeholder="Enter your AI prompt here..."></textarea>
</div>

<div class="control-group">
    <label for="textInput">Input Text:</label>
    <textarea id="textInput" placeholder="Enter the text you want the AI to process..."></textarea>
</div>

<div class="controls">
    <button id="runPrompt" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">🚀 Run Prompt</button>
    <button id="saveExample" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">💾 Save Example</button>
</div>

<div id="status-message" style="margin: 10px 0; padding: 8px; border-radius: 4px; display: none;"></div>
<div id="output">AI response will appear here...</div>

<!-- Hidden sample prompts and data -->
<div class="sample-prompts" data-type="json-extraction">
    <div data-prompt="Extract key information from this text and format as JSON with keys: main_topic, key_points, sentiment, word_count"
         data-text="Artificial intelligence is revolutionizing education through personalized learning experiences. Students can now receive customized feedback and adaptive content that matches their learning pace. However, concerns about data privacy and the digital divide remain significant challenges that educators must address."></div>
    <div data-prompt="Create a JSON citation from this quote with keys: author, quote, source, year, context"
         data-text="Innovation distinguishes between a leader and a follower. This was said during a Stanford commencement speech in 2005."></div>
    <div data-prompt="Analyze this code snippet and return JSON with keys: language, purpose, complexity_level, suggestions"
         data-text="function calculateTotal(items) { let sum = 0; for(let i = 0; i < items.length; i++) { sum += items[i].price; } return sum; }"></div>
</div>

<div class="sample-prompts" data-type="writing-analysis">
    <div data-prompt="Analyze this writing for academic quality. Check for thesis clarity, evidence support, and organization. Provide specific feedback."
         data-text="Climate change is bad. Many scientists think it's happening. We should do something about it. There are lots of causes like cars and factories. People need to change their behavior."></div>
    <div data-prompt="Review this paragraph for APA style compliance and suggest improvements for citations and references."
         data-text="Recent studies show that meditation improves focus. Dr. Smith found that students who meditated performed better on tests. This research was published last year and supports the idea that mindfulness helps learning."></div>
    <div data-prompt="Evaluate this essay introduction for hook effectiveness, background information, and thesis statement strength."
         data-text="Technology has changed education. In the past, students learned from books. Now they use computers and tablets. This essay will discuss how technology affects learning in schools today."></div>
</div>

<div class="sample-prompts" data-type="creative">
    <div data-prompt="Write a short story (150-200 words) that incorporates these elements in a meaningful way:"
         data-text="Elements: a mysterious library, a student under pressure, an unexpected discovery"></div>
    <div data-prompt="Create a poem in the style of a haiku series that captures the essence of this concept:"
         data-text="Concept: the feeling of understanding a difficult concept for the first time"></div>
    <div data-prompt="Write a dialogue between two characters discussing this topic, showing different perspectives:"
         data-text="Topic: whether AI should be allowed in creative writing classes"></div>
</div>

<div class="sample-prompts" data-type="code-help">
    <div data-prompt="Create a Python function that solves this problem. Include comments and error handling:"
         data-text="Problem: Calculate the average grade from a list of student scores, ignoring any invalid entries"></div>
    <div data-prompt="Write JavaScript code to implement this feature with proper DOM manipulation:"
         data-text="Feature: A button that toggles between light and dark themes on a webpage"></div>
    <div data-prompt="Explain this code and suggest improvements for readability and efficiency:"
         data-text="def find_max(lst): m = lst[0]; [m := x if x > m else m for x in lst]; return m"></div>
</div>

<div class="sample-prompts" data-type="research">
    <div data-prompt="Research this topic and provide key facts, current trends, and reliable sources to explore further:"
         data-text="Topic: The impact of social media on teenage mental health"></div>
    <div data-prompt="Fact-check this claim and provide evidence for or against it with source suggestions:"
         data-text="Claim: Students learn better when they take handwritten notes compared to typing on laptops"></div>
    <div data-prompt="Compare and contrast these two approaches, providing pros, cons, and research evidence:"
         data-text="Approaches: Traditional lecture-based teaching vs. project-based learning in STEM education"></div>
</div>

<script type="module">
import { queryGemini } from '{{ site.baseurl }}/assets/js/api/gemini.js';

document.addEventListener("DOMContentLoaded", function() {

    // Load initial sample
    loadSampleForCategory();

    // Status message helper
    function showStatusMessage(message, type) {
        const statusDiv = document.getElementById("status-message");
        statusDiv.textContent = message;
        statusDiv.style.display = "block";

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
            case "info":
                statusDiv.style.backgroundColor = "#d1ecf1";
                statusDiv.style.color = "#0c5460";
                statusDiv.style.border = "1px solid #bee5eb";
                break;
        }

        setTimeout(() => {
            statusDiv.style.display = "none";
        }, 3000);
    }

    // Load sample when category changes
    document.getElementById("promptType").onchange = loadSampleForCategory;

    // Load sample button
    document.getElementById("loadSample").onclick = loadSampleForCategory;

    function loadSampleForCategory() {
        const category = document.getElementById("promptType").value;
        const samples = document.querySelectorAll('.sample-prompts[data-type="' + category + '"] div[data-prompt]');

        if (samples.length > 0) {
            const randomIndex = Math.floor(Math.random() * samples.length);
            const sample = samples[randomIndex];

            document.getElementById("promptInput").value = sample.getAttribute('data-prompt');
            document.getElementById("textInput").value = sample.getAttribute('data-text');

            showStatusMessage("📋 Loaded " + category + " example", "info");
        }
    }

    // Clear all fields
    document.getElementById("clearAll").onclick = function() {
        document.getElementById("promptInput").value = "";
        document.getElementById("textInput").value = "";
        document.getElementById("output").textContent = "AI response will appear here...";
        showStatusMessage("🗑️ Cleared all fields", "info");
    };

    // Run the prompt
    document.getElementById("runPrompt").onclick = function() {
        const prompt = document.getElementById("promptInput").value.trim();
        const text = document.getElementById("textInput").value.trim();
        const category = document.getElementById("promptType").value;
        const outputDiv = document.getElementById("output");

        if (!prompt || !text) {
            showStatusMessage("⚠️ Please enter both a prompt and input text", "error");
            return;
        }

        outputDiv.textContent = "🤔 AI is thinking...";

        // Determine if we need JSON parsing based on category
        const needsJSON = category === 'json-extraction';

        queryGemini({
            prompt: prompt,
            text: text,
            parseJSON: needsJSON
        })
        .then(result => {
            if (needsJSON) {
                // Display formatted JSON using a pre element (preserves whitespace and formatting)
                const jsonString = JSON.stringify(result, null, 2);
                const outputElement = document.createElement('pre');
                outputElement.style.background = '#f8f9fa';
                outputElement.style.padding = '10px';
                outputElement.style.borderRadius = '4px';
                outputElement.style.overflowX = 'auto';
                outputElement.style.fontFamily = 'monospace';
                outputElement.textContent = jsonString;

                outputDiv.innerHTML = '';
                outputDiv.appendChild(outputElement);
            } else {
                // Display as formatted markdown text (AI analysis responses are in markdown)
                const responseText = result.text || result.response || JSON.stringify(result, null, 2);

                // Convert markdown to HTML for proper formatting
                const htmlContent = marked.parse(responseText);
                outputDiv.innerHTML = htmlContent;
            }
            showStatusMessage("✅ Prompt executed successfully!", "success");
        })
        .catch(error => {
            outputDiv.textContent = "❌ Error occurred";
            showStatusMessage("Error: " + error.message, "error");
        });
    };

    // Save example
    document.getElementById("saveExample").onclick = function() {
        const prompt = document.getElementById("promptInput").value.trim();
        const text = document.getElementById("textInput").value.trim();
        const category = document.getElementById("promptType").value;

        if (!prompt || !text) {
            showStatusMessage("⚠️ Nothing to save - please enter prompt and text first", "error");
            return;
        }

        const savedExample = {
            category: category,
            prompt: prompt,
            text: text,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('gemini-playground-example', JSON.stringify(savedExample));
            showStatusMessage("💾 Example saved successfully!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save: " + error.message, "error");
        }
    };
});
</script>
