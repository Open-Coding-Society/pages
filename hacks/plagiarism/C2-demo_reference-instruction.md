---
layout: post
microblog: True
title: APA Reference Instruction
description: A tool to assist students in building an APA reference. 
author: John Mortensen
permalink: /plagiarism/2
breadcrumb: True
---

## Sample Consequence

Fictitious example by Salem, our workshop character found the perfect quote for their research paper: "Innovation distinguishes between a leader and a follower."It was exactly what they needed! They copy-pasted it into their paper and moved on. Later, their professor marked it as plagiarism - it was a Steve Jobs quote that needed proper citation. Alex's grade dropped from an A to a C.

Research this quote and use it to build an APA reference.

---

<style>
  /* File-specific styles only - iridescent styles moved to _sass/open-coding/elements/buttons/iridescent.scss */
  .apa-tool-label {
    display: block;
    margin-top: 8px;
    font-weight: bold;
    color: #333;
  }
  .apa-tool-input {
    width: 90%;
    padding: 8px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
  .apa-tool-output {
    margin-top: 16px;
    border-left: 4px solid #007bff;
    padding: 15px;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
    border-radius: 4px;
  }
  .citation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>

<details style="padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff ">
  <summary style="cursor: pointer; font-weight: bold; color: #007bff; font-size: 18px;">Citation Tool Helper (Click to see guide)</summary>

  <div style="margin-top: 15px;">
    <h4>Purpose</h4>
    <p>Automate and scaffold the citation correction workflow for students using AI-powered quote research and manual citation building.</p>

    <h4>How to Use</h4>
    <ol>
      <li><strong>AI Method:</strong> Paste a quote or text snippet in the research box and click "Generate APA Citation from Quote" - AI will find the source and fill all fields automatically</li>
      <li><strong>Manual Method:</strong> Enter citation information directly in the fields below</li>
      <li>Review and adjust the auto-filled information as needed</li>
      <li>Use "Save" and "Load" buttons to preserve your work across sessions</li>
      <li>Copy the generated reference for use in your work</li>
    </ol>
    
    <h4>Features</h4>
    <ul>
      <li><strong>AI-powered research:</strong> Automatically finds primary sources from partial quotes or text snippets</li>
      <li><strong>Formal quote display:</strong> Shows the exact/corrected version from the original source</li>
      <li><strong>Real-time formatting:</strong> Automatically formats your citation in proper APA style</li>
      <li><strong>Save/Restore:</strong> Preserves your work and avoids repeated API calls</li>
      <li><strong>Clickable URLs:</strong> Generated References include working links to sources</li>
      <li><strong>Educational comparison:</strong> Compare your input quote with the formal version</li>
    </ul>
    
    <h4>Instructions</h4>
    <p>Have a quote but don't know the source? Paste it in the AI research box - even partial or imperfect quotes work! The AI will research the primary source, provide the formal quote, and fill in all citation details automatically. You can then save your work and reload it later without needing to call the AI again.</p>
  </div>
</details>

<div class="citation-container">
  <h3>APA Citation Generator</h3>
  
  <!-- Optional Quote Input for AI Generation -->
  <div style="padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #dee2e6;">
    <h4 style="margin-top: 0; color: #495057;">AI-Powered Citation Helper</h4>

    <label class="apa-tool-label">Quote or Text to Research:</label>
    <textarea class="apa-tool-input" id="user-provided-quote" placeholder="Paste your quote here (e.g., 'Innovation distinguishes between a leader and a follower')" style="min-height: 80px; resize: vertical;"></textarea>
    
    <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
      <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" onclick="generativeQuoteToFillValuesForAPA()">
        🔍 Generate APA Citation from Quote
      </button>
      <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" onclick="saveCurrentCitation()" style="background-color: #28a745;">
        � Save Current Citation
      </button>
      <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" onclick="loadSavedCitation()" style="background-color: #17a2b8;">
        📂 Load Saved Citation
      </button>
    </div>
    
    <div id="ai-status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>
    
    <!-- Formal Quote Display -->
    <div id="formal-quote-display" style="margin-top: 15px; padding: 12px; border-left: 4px solid #007bff; border-radius: 4px; display: none;">
      <strong>📖 Formal Quote (from source):</strong><br>
      <em id="formal-quote-text" style="font-style: italic; color: #495057;"></em>
    </div>
    
    <!-- In-Text Citation Display -->
    <div id="intext-citation-display" style="margin-top: 15px; padding: 12px; border-left: 4px solid #28a745; border-radius: 4px; display: none;">
      <strong>📝 In-Text Citation:</strong><br>
      <code id="intext-citation-text" style="padding: 4px 8px; border-radius: 3px; font-family: monospace;"></code>
    </div>
  </div>  <!-- Manual Citation Fields -->
  <h4 style="margin-bottom: 15px; color: #495057;">Manual Citation Builder</h4>
  
  <label class="apa-tool-label">Author(s):</label>
  <input class="apa-tool-input" id="apa-author" type="text" placeholder="e.g., Doe, J." />
  
  <label class="apa-tool-label">Date (Year, Month Day):</label>
  <input class="apa-tool-input" id="apa-date" type="text" placeholder="e.g., 2025, May 10" />
  
  <label class="apa-tool-label">Title (in italics):</label>
  <input class="apa-tool-input" id="apa-title" type="text" placeholder="e.g., Harvard revokes tenure of Francesca Gino after misconduct findings" />
  
  <label class="apa-tool-label">Source/Website:</label>
  <input class="apa-tool-input" id="apa-source" type="text" placeholder="e.g., The New York Times" />
  
  <label class="apa-tool-label">URL:</label>
  <input class="apa-tool-input" id="apa-url" type="text" placeholder="e.g., https://www.nytimes.com/article-link" />
  
  <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" onclick="generateAPA()">Generate APA Reference & Citation</button>
  
  <div class="apa-tool-output" id="apa-output">
    <strong>Generated Reference:</strong><br>
    <span id="citation-text"></span>
  </div>
</div>

<script type="module">
import { queryGemini } from '{{ site.baseurl }}/assets/js/api/gemini.js';

// Status message helper function for AI quote research
function showAIStatus(message, type) {
    const statusDiv = document.getElementById("ai-status");
    statusDiv.textContent = message;
    statusDiv.style.display = "block";

    switch(type) {
        case "loading":
            statusDiv.style.backgroundColor = "#cce5ff";
            statusDiv.style.color = "#004085";
            statusDiv.style.border = "1px solid #99d3ff";
            break;
        case "success":
            statusDiv.style.backgroundColor = "#d1ecf1";
            statusDiv.style.color = "#0c5460";
            statusDiv.style.border = "1px solid #bee5eb";
            break;
        case "error":
            statusDiv.style.backgroundColor = "#f8d7da";
            statusDiv.style.color = "#721c24";
            statusDiv.style.border = "1px solid #f5c6cb";
            break;
    }

    // Auto-hide success/error messages after 5 seconds
    if (type !== "loading") {
        setTimeout(() => {
            statusDiv.style.display = "none";
        }, 5000);
    }
}

window.generativeQuoteToFillValuesForAPA = function() {
    const text = document.getElementById('user-provided-quote').value.trim();

    if (!text) {
        showAIStatus("⚠️ Please enter a quote or text to research", "error");
        return;
    }

    const CITATION_PROMPT = `Please locate a primary source for the provided text and format response as JSON structure with these exact keys: author, date, title, source, url, formal_quote, intext_citation. Include the formal_quote field with the exact/corrected version of the quote from the original source. Include the intext_citation field with a proper APA in-text citation format (e.g., "(Smith, 2023)" or "Smith (2023)"). The quote is: `;

    showAIStatus("🔍 Researching quote and finding primary source...", "loading");

    // Functional programming style with promise chaining
    queryGemini({
        prompt: CITATION_PROMPT,
        text: text,
        parseJSON: true  // Request JSON parsing for citation data
    })
    .then(citationData => {
        // citationData is already parsed JSON from the API
        // Display formal quote if provided
        if (citationData.formal_quote) {
            const formalQuoteElement = document.getElementById('formal-quote-text');
            const formalDisplayElement = document.getElementById('formal-quote-display');
            if (formalQuoteElement && formalDisplayElement) {
                formalQuoteElement.textContent = citationData.formal_quote;
                formalDisplayElement.style.display = 'block';
            }
        }

        // Display in-text citation if provided
        if (citationData.intext_citation) {
            const inTextElement = document.getElementById('intext-citation-text');
            const inTextDisplayElement = document.getElementById('intext-citation-display');
            if (inTextElement && inTextDisplayElement) {
                inTextElement.textContent = citationData.intext_citation;
                inTextDisplayElement.style.display = 'block';
            }
        }

        // Fill the APA citation fields with the AI-generated data
        if (citationData.author) {
            document.getElementById('apa-author').value = citationData.author;
        }
        if (citationData.date) {
            document.getElementById('apa-date').value = citationData.date;
        }
        if (citationData.title) {
            document.getElementById('apa-title').value = citationData.title;
        }
        if (citationData.source) {
            document.getElementById('apa-source').value = citationData.source;
        }
        if (citationData.url) {
            document.getElementById('apa-url').value = citationData.url;
        }

        // Auto-generate the APA citation with the filled fields
        generateAPA();

        showAIStatus("✅ Citation fields filled! Review and adjust as needed.", "success");

        return citationData;
    })
    .catch(error => {
        showAIStatus("⚠️ " + error.message, "error");

        // Fallback: Fill with example data for the Steve Jobs quote if that's what was entered
        if (text.toLowerCase().includes("innovation distinguishes") || text.toLowerCase().includes("steve jobs")) {
            document.getElementById('apa-author').value = "Jobs, S.";
            document.getElementById('apa-date').value = "2005, June 12";
            document.getElementById('apa-title').value = "Stanford University Commencement Address";
            document.getElementById('apa-source').value = "Stanford News";
            document.getElementById('apa-url').value = "https://news.stanford.edu/news/2005/june15/jobs-061505.html";

            // Show formal quote and citation for fallback
            const formalQuoteElement = document.getElementById('formal-quote-text');
            const formalDisplayElement = document.getElementById('formal-quote-display');
            const inTextElement = document.getElementById('intext-citation-text');
            const inTextDisplayElement = document.getElementById('intext-citation-display');

            if (formalQuoteElement && formalDisplayElement) {
                formalQuoteElement.textContent = "Innovation distinguishes between a leader and a follower.";
                formalDisplayElement.style.display = 'block';
            }
            if (inTextElement && inTextDisplayElement) {
                inTextElement.textContent = "(Jobs, 2005)";
                inTextDisplayElement.style.display = 'block';
            }

            generateAPA();
            showAIStatus("📚 Using known source for Steve Jobs quote (AI unavailable)", "success");
        }
    });
};

function generateAPA() {
  const author = document.getElementById('apa-author').value.trim();
  const date = document.getElementById('apa-date').value.trim();
  const title = document.getElementById('apa-title').value.trim();
  const source = document.getElementById('apa-source').value.trim();
  const url = document.getElementById('apa-url').value.trim();
  
  let citation = '';
  
  if (author && date && title && source && url) {
    citation = `${author} (${date}). <i>${title}</i>. ${source}. <a href='${url}' target='_blank'>${url}</a>`;
  } else {
    // Default example citation
    citation = `Doe, J. (2025, May 10). <i>Harvard revokes tenure of Francesca Gino after misconduct findings</i>. The New York Times. <a href='https://www.nytimes.com/article-link' target='_blank'>https://www.nytimes.com/article-link</a>`;
  }
  
  document.getElementById('citation-text').innerHTML = citation;
  
  // Also generate in-text citation
  generateInTextCitation();
}

function generateInTextCitation() {
  const author = document.getElementById('apa-author').value.trim();
  const date = document.getElementById('apa-date').value.trim();
  
  let inTextCitation = '';
  
  if (author && date) {
    // Extract just the year from the date
    const yearMatch = date.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : date;

    // Extract last name from author (assuming format "LastName, F.")
    const lastNameMatch = author.match(/^([^,]+)/);
    const lastName = lastNameMatch ? lastNameMatch[1].trim() : author;

    inTextCitation = `(${lastName}, ${year})`;
  } else {
    // Default example
    inTextCitation = `(Doe, 2025)`;
  }
  
  const inTextElement = document.getElementById('intext-citation-text');
  const inTextDisplayElement = document.getElementById('intext-citation-display');
  
  if (inTextElement && inTextDisplayElement) {
    inTextElement.textContent = inTextCitation;
    inTextDisplayElement.style.display = 'block';
  }
}

// Expose function to global scope for onclick access
window.generateAPA = generateAPA;
window.generateInTextCitation = generateInTextCitation;

// Save current citation data to localStorage
window.saveCurrentCitation = function() {
    const citationData = {
        userQuote: document.getElementById('user-provided-quote').value.trim(),
        formalQuote: document.getElementById('formal-quote-text')?.textContent || '',
        inTextCitation: document.getElementById('intext-citation-text')?.textContent || '',
        author: document.getElementById('apa-author').value.trim(),
        date: document.getElementById('apa-date').value.trim(),
        title: document.getElementById('apa-title').value.trim(),
        source: document.getElementById('apa-source').value.trim(),
        url: document.getElementById('apa-url').value.trim(),
        citation: document.getElementById('citation-text').innerHTML,
        timestamp: new Date().toISOString()
    };

    // Only save if there's meaningful data
    if (citationData.author || citationData.title || citationData.userQuote) {
        try {
            localStorage.setItem('plagiarism-c2-saved-citation', JSON.stringify(citationData));
            showAIStatus("✅ Citation saved successfully!", "success");
        } catch (error) {
            showAIStatus("❌ Failed to save citation: " + error.message, "error");
        }
    } else {
        showAIStatus("⚠️ No citation data to save", "error");
    }
};

// Load saved citation data from localStorage
window.loadSavedCitation = function() {
    try {
        const saved = localStorage.getItem('plagiarism-c2-saved-citation');
        if (saved) {
            const citationData = JSON.parse(saved);

            // Fill all the fields
            document.getElementById('user-provided-quote').value = citationData.userQuote || '';
            document.getElementById('apa-author').value = citationData.author || '';
            document.getElementById('apa-date').value = citationData.date || '';
            document.getElementById('apa-title').value = citationData.title || '';
            document.getElementById('apa-source').value = citationData.source || '';
            document.getElementById('apa-url').value = citationData.url || '';

            // Show formal quote if available
            if (citationData.formalQuote) {
                const formalQuoteElement = document.getElementById('formal-quote-text');
                const formalDisplayElement = document.getElementById('formal-quote-display');
                if (formalQuoteElement && formalDisplayElement) {
                    formalQuoteElement.textContent = citationData.formalQuote;
                    formalDisplayElement.style.display = 'block';
                }
            }

            // Show in-text citation if available
            if (citationData.inTextCitation) {
                const inTextElement = document.getElementById('intext-citation-text');
                const inTextDisplayElement = document.getElementById('intext-citation-display');
                if (inTextElement && inTextDisplayElement) {
                    inTextElement.textContent = citationData.inTextCitation;
                    inTextDisplayElement.style.display = 'block';
                }
            }

            // Regenerate the citation (this will also regenerate in-text citation)
            generateAPA();

            const saveDate = new Date(citationData.timestamp).toLocaleString();
            showAIStatus(`✅ Citation loaded! (Saved: ${saveDate})`, "success");
        } else {
            showAIStatus("⚠️ No saved citation found", "error");
        }
    } catch (error) {
        showAIStatus("❌ Failed to load citation: " + error.message, "error");
    }
};

// Show default example on page load, or load saved citation if available
document.addEventListener('DOMContentLoaded', function() {
    // Try to load saved citation first
    const saved = localStorage.getItem('plagiarism-c2-saved-citation');
    if (saved) {
        loadSavedCitation();
    } else {
        generateAPA();
    }
});
</script>

## Provide 2 examples to show understanding of APA reference and citation

Fix Salem's delima to boost grade to an 'A".

Create a flawed article then correct article with citation and reference.

---

<style>
  .exercise-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .exercise-card {
    border: 1px solid #6c757d;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .scenario-box {
    border-left: 4px solid #6c757d;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
  }
  
  .uncited-box {
    border-left: 4px solid #dc3545;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
  }
  
  .cited-box {
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
  }
  
  .exercise-textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #6c757d;
    border-radius: 4px;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
    resize: vertical;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
  }
  
  .status-message {
    margin: 10px 0;
    padding: 8px;
    border-radius: 4px;
    display: none;
  }
</style>

<div class="exercise-container">
  
  <!-- Exercise 1: Salem's Citation Problem -->
  <div class="exercise-card">
    <h3>Exercise 1: Fix Salem's Citation Problem</h3>

    <p><strong>Your Task:</strong> Research this Steve Jobs quote and create both a proper in-text citation AND a reference list entry.</p>
    
    <label for="salem-uncited"><strong>❌ Uncited Quote:</strong></label>
    <div class="uncited-box">
      <strong>Instructions:</strong> Salem found this perfect quote but used it without citation (this shows what NOT to do)
    </div>
    <textarea id="salem-uncited" class="exercise-textarea" placeholder="Write how Salem incorrectly used the quote: 'Innovation distinguishes between a leader and a follower.' without citation..."></textarea>
    
    <label for="salem-citation"><strong>✅ In-text Citation (how it should appear in the paper):</strong></label>
    <div class="cited-box">
      <strong>Instructions:</strong> Write the proper in-text citation for the Steve Jobs quote
    </div>
    <textarea id="salem-citation" class="exercise-textarea" placeholder="Write the in-text citation here. Example: According to Jobs (2005), 'Innovation distinguishes...'"></textarea>
    
    <label for="salem-reference"><strong>Reference List Entry (for bibliography):</strong></label>
    <div class="cited-box">
      <strong>Instructions:</strong> Write the full APA reference for the bibliography
    </div>
    <textarea id="salem-reference" class="exercise-textarea" placeholder="Write the full APA reference here. Include author, date, source, URL, etc."></textarea>
    
    <div class="button-group">
      <button id="save-salem" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">💾 Save Salem's Solution</button>
      <button id="load-salem" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">📂 Load Saved Work</button>
    </div>
  </div>
  
  <!-- Exercise 2: Uncited vs Cited Comparison -->
  <div class="exercise-card">
    <h3>Exercise 2: Create Uncited vs Cited Example</h3>

    <p><strong>Your Task:</strong> Create a flawed paragraph (with plagiarism), then show the corrected version with proper citations.</p>
    
    <label for="uncited-text"><strong>❌ Uncited Version (flawed article excerpt):</strong></label>
    <div class="uncited-box">
      <strong>Instructions:</strong> Write a paragraph that uses information/quotes without proper citation (this shows what NOT to do)
    </div>
    <textarea id="uncited-text" class="exercise-textarea" placeholder="Write a paragraph that improperly uses sources without citations. This demonstrates plagiarism to avoid..."></textarea>
    
    <label for="cited-text"><strong>✅ Properly Cited Version (corrected article):</strong></label>
    <div class="cited-box">
      <strong>Instructions:</strong> Rewrite the same paragraph with proper in-text citations and attribution
    </div>
    <textarea id="cited-text" class="exercise-textarea" placeholder="Rewrite the paragraph above with proper APA in-text citations and attributions..."></textarea>
    
    <label for="reference-list"><strong>Reference List for Cited Sources:</strong></label>
    <textarea id="reference-list" class="exercise-textarea" placeholder="List all the references used in your cited version in proper APA format..."></textarea>
    
    <div class="button-group">
      <button id="save-comparison" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">💾 Save Comparison Example</button>
      <button id="load-comparison" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">📂 Load Saved Work</button>
    </div>
  </div>
  
  <!-- Save All for Assessment -->
  <div class="button-group">
    <button id="test-mode-button" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">🧪 Test Mode - Fill All Exercises</button>
    <button id="save-all-exercises" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">📤 Save All for Assessment</button>
    <button id="clear-all-exercises" class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition">🗑️ Clear All Work</button>
  </div>
  
  <div id="exercise-status" class="status-message"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {

    // Status message helper function
    function showStatusMessage(message, type) {
        const statusDiv = document.getElementById("exercise-status");
        statusDiv.textContent = message;
        statusDiv.style.display = "block";

        // Style based on message type using blue/gray theme
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
            case "warning":
                statusDiv.style.backgroundColor = "#e2e3e5";
                statusDiv.style.color = "#383d41";
                statusDiv.style.border = "1px solid #adb5bd";
                break;
            case "info":
                statusDiv.style.backgroundColor = "#d1ecf1";
                statusDiv.style.color = "#0c5460";
                statusDiv.style.border = "1px solid #bee5eb";
                break;
        }

        // Auto-hide after 4 seconds
        setTimeout(() => {
            statusDiv.style.display = "none";
        }, 4000);
    }

    // Test Mode - Fill all exercises with sample data
    document.getElementById("test-mode-button").onclick = function() {
        if (confirm("This will fill all exercises with sample data for testing. Continue?")) {
            // Exercise 1: Salem's Citation Problem
            document.getElementById("salem-uncited").value = `Innovation distinguishes between a leader and a follower. This quote perfectly captures the essence of entrepreneurship and leadership in business.`;
            document.getElementById("salem-citation").value = `According to Jobs (2005), "Innovation distinguishes between a leader and a follower."`;
            document.getElementById("salem-reference").value = `Jobs, S. (2005, June 12). Stanford University Commencement Address. Stanford News. https://news.stanford.edu/news/2005/june15/jobs-061505.html`;

            // Exercise 2: Uncited vs Cited Comparison
            document.getElementById("uncited-text").value = `Artificial intelligence is transforming education by providing personalized learning experiences. Studies show that AI can improve student outcomes by 40%. Machine learning algorithms can adapt to individual learning styles and provide instant feedback. This technology is revolutionizing how we think about teaching and learning.`;

            document.getElementById("cited-text").value = `Artificial intelligence is transforming education by providing personalized learning experiences (Chen, 2023). Studies show that AI can improve student outcomes by 40% (Johnson & Smith, 2024). According to Rodriguez (2023), machine learning algorithms can adapt to individual learning styles and provide instant feedback. This technology is revolutionizing how we think about teaching and learning (AI Education Consortium, 2024).`;

            document.getElementById("reference-list").value = `AI Education Consortium. (2024). The future of AI in education. Journal of Educational Technology, 15(3), 45-62. https://doi.org/10.1234/jet.2024.15.3.45

Chen, L. (2023). Personalized learning through artificial intelligence. Educational Psychology Review, 28(4), 123-145. https://doi.org/10.1234/epr.2023.28.4.123

Johnson, M., & Smith, R. (2024). Measuring AI impact on student performance. Computers & Education, 89, 67-78. https://doi.org/10.1234/ce.2024.89.67

Rodriguez, A. (2023). Adaptive learning systems in modern classrooms. Teaching and Technology Quarterly, 12(2), 89-104. https://doi.org/10.1234/ttq.2023.12.2.89`;

            showStatusMessage("🧪 Test mode activated! All exercises filled with sample data.", "info");
        }
    };

    // Save Salem's Exercise
    document.getElementById("save-salem").onclick = function() {
        const uncited = document.getElementById("salem-uncited").value.trim();
        const citation = document.getElementById("salem-citation").value.trim();
        const reference = document.getElementById("salem-reference").value.trim();

        if (uncited.length === 0 || citation.length === 0 || reference.length === 0) {
            showStatusMessage("⚠️ Please complete all three sections before saving", "warning");
            return;
        }

        try {
            localStorage.setItem('plagiarism-c2-1', JSON.stringify({
                uncited: uncited,
                citation: citation,
                reference: reference,
                timestamp: new Date().toISOString(),
                exercise: 'Salem Citation Problem'
            }));
            showStatusMessage("✅ Salem's solution saved successfully!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save: " + error.message, "error");
        }
    };

    // Load Salem's Exercise
    document.getElementById("load-salem").onclick = function() {
        try {
            const saved = localStorage.getItem('plagiarism-c2-1');
            if (saved) {
                const data = JSON.parse(saved);
                document.getElementById("salem-uncited").value = data.uncited || '';
                document.getElementById("salem-citation").value = data.citation || '';
                document.getElementById("salem-reference").value = data.reference || '';
                const saveDate = new Date(data.timestamp).toLocaleString();
                showStatusMessage(`✅ Salem's solution loaded! (Saved: ${saveDate})`, "success");
            } else {
                showStatusMessage("⚠️ No saved Salem exercise found", "warning");
            }
        } catch (error) {
            showStatusMessage("❌ Failed to load: " + error.message, "error");
        }
    };

    // Save Comparison Exercise
    document.getElementById("save-comparison").onclick = function() {
        const uncited = document.getElementById("uncited-text").value.trim();
        const cited = document.getElementById("cited-text").value.trim();
        const references = document.getElementById("reference-list").value.trim();

        if (uncited.length === 0 || cited.length === 0 || references.length === 0) {
            showStatusMessage("⚠️ Please complete all three sections before saving", "warning");
            return;
        }

        try {
            localStorage.setItem('plagiarism-c2-2', JSON.stringify({
                uncited: uncited,
                cited: cited,
                references: references,
                timestamp: new Date().toISOString(),
                exercise: 'Uncited vs Cited Comparison'
            }));
            showStatusMessage("✅ Comparison example saved successfully!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save: " + error.message, "error");
        }
    };

    // Load Comparison Exercise
    document.getElementById("load-comparison").onclick = function() {
        try {
            const saved = localStorage.getItem('plagiarism-c2-2');
            if (saved) {
                const data = JSON.parse(saved);
                document.getElementById("uncited-text").value = data.uncited;
                document.getElementById("cited-text").value = data.cited;
                document.getElementById("reference-list").value = data.references;
                const saveDate = new Date(data.timestamp).toLocaleString();
                showStatusMessage(`✅ Comparison example loaded! (Saved: ${saveDate})`, "success");
            } else {
                showStatusMessage("⚠️ No saved comparison exercise found", "warning");
            }
        } catch (error) {
            showStatusMessage("❌ Failed to load: " + error.message, "error");
        }
    };

    // Save All for Assessment
    document.getElementById("save-all-exercises").onclick = function() {
        const salemUncited = document.getElementById("salem-uncited").value.trim();
        const salemCitation = document.getElementById("salem-citation").value.trim();
        const salemReference = document.getElementById("salem-reference").value.trim();
        const uncited = document.getElementById("uncited-text").value.trim();
        const cited = document.getElementById("cited-text").value.trim();
        const references = document.getElementById("reference-list").value.trim();

        if (salemUncited.length === 0 || salemCitation.length === 0 || salemReference.length === 0 ||
            uncited.length === 0 || cited.length === 0 || references.length === 0) {
            showStatusMessage("⚠️ Please complete all exercises before saving for assessment", "warning");
            return;
        }

        try {
            // Save consolidated assessment data
            const assessmentData = {
                lesson: 'C2-demo_reference-session',
                studentWork: {
                    salemExercise: {
                        uncited: salemUncited,
                        citation: salemCitation,
                        reference: salemReference
                    },
                    comparisonExercise: {
                        uncited: uncited,
                        cited: cited,
                        references: references
                    }
                },
                timestamp: new Date().toISOString(),
                completed: true
            };

            localStorage.setItem('plagiarism-c2-assessment', JSON.stringify(assessmentData));

            // Also save individual exercises for C5 compatibility
            localStorage.setItem('plagiarism-c2-1', JSON.stringify({
                uncited: salemUncited,
                citation: salemCitation,
                reference: salemReference,
                timestamp: new Date().toISOString(),
                exercise: 'Salem Citation Exercise'
            }));

            localStorage.setItem('plagiarism-c2-2', JSON.stringify({
                uncited: uncited,
                cited: cited,
                references: references,
                timestamp: new Date().toISOString(),
                exercise: 'Comparison Exercise'
            }));

            showStatusMessage("🎓 All exercises saved for instructor assessment!", "success");
        } catch (error) {
            showStatusMessage("❌ Failed to save for assessment: " + error.message, "error");
        }
    };

    // Clear All Work
    document.getElementById("clear-all-exercises").onclick = function() {
        if (confirm("Are you sure you want to clear all your work? This cannot be undone.")) {
            // Clear all text areas
            document.getElementById("salem-citation").value = "";
            document.getElementById("salem-reference").value = "";
            document.getElementById("uncited-text").value = "";
            document.getElementById("cited-text").value = "";
            document.getElementById("reference-list").value = "";

            // Clear individual saves
            localStorage.removeItem('plagiarism-c2-1');
            localStorage.removeItem('plagiarism-c2-2');
            localStorage.removeItem('plagiarism-c2-assessment');

            showStatusMessage("🗑️ All work cleared", "info");
        }
    };

    // Auto-load saved work on page load
    document.getElementById("load-salem").click();
    document.getElementById("load-comparison").click();
});
</script>
