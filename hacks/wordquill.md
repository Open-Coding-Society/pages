---
layout: post
title: Quill Editor & Gemini Analyzer
permalink: /word
---

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
</style>

<details style="padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
  <summary style="cursor: pointer; font-weight: bold; color: #007bff; font-size: 18px;">Writing Helper (Click to see guide)</summary>
  <div style="margin-top: 10px;">
    <p>This writing analysis tool helps you improve your academic writing by providing AI-powered feedback on different aspects of your text.</p>

    <h4>Analysis Modes:</h4>
    <ul>
      <li><strong>Plagiarism Check:</strong> Identifies missing citations and suggests proper APA references</li>
      <li><strong>Thesis Building:</strong> Evaluates thesis clarity, argument structure, and coherence</li>
      <li><strong>5-Paragraph Outline:</strong> Checks essay structure and paragraph organization</li>
      <li><strong>Research Paper:</strong> Assesses academic tone, evidence quality, and scholarly writing</li>
    </ul>
    
    <p><em>Note: Sample texts are provided for each mode to help you explore different types of feedback. You can replace them with your own writing.</em></p>
  </div>
</details>

<div class="controls">
    <div class="control-group">
        <select id="analysisMode">
            <option value="plagiarism">Plagiarism Check</option>
            <option value="thesis">Thesis Building</option>
            <option value="five-paragraph">5-Paragraph Outline</option>
            <option value="research">Research Paper</option>
        </select>
    </div>
</div>

<div id="quill-editor" style="height: 200px;"></div>
<button id="checkBtn">Analyze Text</button>
<div id="output"></div>

<!-- Hidden sample texts -->
<div class="sample-text" data-type="plagiarism">
Literature has shaped culture and society through memorable phrases that continue to resonate today. For example, `It was the best of times, it was the worst of times` captures the contrasts of life in a way that still feels relevant. Another famous phrase, `Romeo, Romeo, where art thou`, has been quoted in countless settings as a symbol of love and longing. Likewise, in film and popular culture, lines such as `Frankly Scarlett, I don't give a damn` are recognized across generations.
</div>

<div class="sample-text" data-type="plagiarism">
The concept of artificial intelligence has evolved dramatically since the 1950s. Early pioneers like Alan Turing proposed that machines could think, leading to what we now call the Turing Test. Modern AI systems can process natural language, recognize images, and even create art. As we move forward, questions about AI ethics and human-AI collaboration become increasingly important for society.
</div>

<div class="sample-text" data-type="plagiarism">
Climate change represents one of the most pressing challenges of our time. Scientists worldwide have documented rising global temperatures, melting ice caps, and changing weather patterns. The Paris Agreement brought nations together to address these issues, though implementation remains challenging. Individual actions, while important, must be combined with systemic changes to create meaningful impact.
</div>

<div class="sample-text" data-type="thesis">
Social media has fundamentally changed how people communicate and share information. While it has connected people across the globe and democratized access to information, it has also contributed to the spread of misinformation and created new forms of social anxiety. This paper will examine both the positive and negative impacts of social media on modern society, arguing that regulation and digital literacy education are essential for maximizing benefits while minimizing harm.
</div>

<div class="sample-text" data-type="five-paragraph">
Technology education should be mandatory in all elementary schools. First, students need digital literacy skills to succeed in the modern workforce. Second, early exposure to coding and computational thinking develops problem-solving abilities. Third, technology education helps bridge the digital divide by ensuring all students have equal access to these essential skills. Therefore, investing in technology education at the elementary level is crucial for preparing students for their future careers and creating a more equitable society.
</div>

<div class="sample-text" data-type="research">
Recent studies in cognitive psychology have revealed new insights into how memory formation works in the human brain. Researchers at several universities have used advanced neuroimaging techniques to observe real-time neural activity during learning tasks. Their findings suggest that sleep plays a more crucial role in memory consolidation than previously understood. This research has important implications for educational practices and therapeutic interventions for memory-related disorders.
</div>

<script type="module">
    // API Endpoint
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    const ENDPOINT = `${pythonURI}/api/gemini`;

    // Analysis prompts for different modes
    const ANALYSIS_PROMPTS = {
        plagiarism: "Please look at this text for correct academic citations, and recommend APA references for each area of concern: ",
        thesis: "Please analyze this text for thesis development. Check for clear thesis statement, supporting arguments, and overall coherence: ",
        "five-paragraph": "Please analyze this text for 5-paragraph essay structure. Check for introduction with thesis, three body paragraphs with supporting details, and conclusion: ",
        research: "Please analyze this text for research paper quality. Check for proper academic tone, evidence-based arguments, and scholarly writing style: "
    };

    document.addEventListener("DOMContentLoaded", function() {
        var quill = new Quill('#quill-editor', {
            theme: 'snow'
        });

        // Load a random sample on page load
        loadRandomSample();

        // Analyze Text button
        document.getElementById("checkBtn").onclick = function() {
            const text = quill.getText();
            const mode = document.getElementById("analysisMode").value;
            const outputDiv = document.getElementById("output");
            outputDiv.textContent = "⏳ Analyzing...";

            const prompt = ANALYSIS_PROMPTS[mode] || ANALYSIS_PROMPTS.plagiarism;

            fetch(ENDPOINT, {
                ...fetchOptions,
                method: "POST",
                body: JSON.stringify({
                    prompt: prompt,
                    text: text
                })
            })
            .then(resp => {
                if (!resp.ok) return resp.text().then(text => { throw new Error(text); });
                return resp.json();
            })
            .then(result => {
                if (result.error || result.message) {
                    // Handle error responses - use the message from API
                    let errorMsg = result.error || result.message || "Unknown error";

                    // Add error code if present
                    if (result.error_code) {
                        errorMsg += ` (Error ${result.error_code})`;
                    }

                    outputDiv.textContent = "⚠️ " + errorMsg;

                    // Special handling for authentication errors
                    if (result.message && result.message.includes("Authentication")) {
                        outputDiv.textContent += " (Login required)";
                    }
                } else if (result.success && result.text) {
                    // Handle successful response - the analysis is in result.text
                    const markdown = result.text;

                    // Convert the Markdown content into fully styled HTML
                    const htmlContent = marked.parse(markdown);

                    // Insert the formatted HTML into the output div
                    outputDiv.innerHTML = htmlContent;
                } else {
                    outputDiv.textContent = "✅ Analysis complete: No clear analysis provided by the backend.";
                }
            })
            .catch(e => {
                outputDiv.textContent = "⚠️ Fetch Error: " + e;
            });
        };

        function loadRandomSample() {
            const mode = document.getElementById("analysisMode").value;
            const samples = document.querySelectorAll(`.sample-text[data-type="${mode}"]`);

            if (samples.length === 0) {
                // Fallback to plagiarism samples if mode has no samples
                const fallbackSamples = document.querySelectorAll('.sample-text[data-type="plagiarism"]');
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
