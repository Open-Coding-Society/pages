---
layout: post
title: "Submodule 3"
description: "Submodule 3 of AI Usage Mini-Quest about Prompt Engineering"
permalink: /west-coast/ai/submodule_3/
parent: "AI Usage"
team: "TheSprinters"
microblog: True
submodule: 3
categories: [CSP, Submodule, AIUsage]
tags: [ai, submodule, PromptEnginering]
author: "TheSprinters"
date: 2025-10-21
---
<!-- Lock/Unlock Logic -->
<style>
body {
  background-image: url('{{ site.baseurl }}/images/pwerfple.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>

# <span style="color:#00D9FF">Key 3: Prompt Engineering Mastery</span>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
  <h2 style="color: white; margin: 0;">🎨 Prompt Engineering: The Art of Talking to AI</h2>
  <p style="color: #E0E0E0; margin: 10px 0 0 0;">Master the skill of crafting perfect AI prompts and unlock limitless possibilities!</p>
</div>

<p style="font-size: 1.1em; line-height: 1.8; color: #555; background-color: white; padding: 15px; border-radius: 10px; display: inline-block;">Prompt engineering is the skill of writing clear, effective instructions to get the best results from AI models. Think of it like learning how to ask the right questions to get the answers you need!</p>

---

## <span style="color:#667eea; background-color: white; padding: 5px 10px; border-radius: 5px;">✨ What Makes a Good Prompt?</span>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 15px; border-radius: 10px; color: white;">
  <strong style="font-size: 1.2em;">🎯 Clarity</strong><br/>
  <span style="color: #FFE6E6;">Be specific about what you want</span>
</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 15px; border-radius: 10px; color: white;">
  <strong style="font-size: 1.2em;">📚 Context</strong><br/>
  <span style="color: #E6F7FF;">Give the AI background information</span>
</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 15px; border-radius: 10px; color: white;">
  <strong style="font-size: 1.2em;">📋 Format</strong><br/>
  <span style="color: #E6FFF9;">Specify response structure</span>
</div>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 15px; border-radius: 10px; color: white;">
  <strong style="font-size: 1.2em;">🔒 Constraints</strong><br/>
  <span style="color: #FFF9E6;">Set boundaries or requirements</span>
</div>

<div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 15px; border-radius: 10px; color: white;">
  <strong style="font-size: 1.2em;">💡 Examples</strong><br/>
  <span style="color: #E6E6FF;">Show what you're looking for</span>
</div>

</div>

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; margin: 0;">🎮 Interactive Activity: Prompt Engineering Challenge</h2>
  <p style="color: #E0E0E0; margin: 10px 0 0 0;">Let's practice with real examples! Try these challenges with your favorite AI assistant.</p>
</div>

---

### <span style="color:#f5576c; background-color: white; padding: 5px 10px; border-radius: 5px;">🌍 Challenge 1: The Travel Planner</span>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="background: #FFE6E6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #f5576c; font-size: 1.2em;">❌ Bad Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #f5576c; margin: 10px 0; border-radius: 5px;">
        Tell me about Paris
      </blockquote>
    </td>
    <td style="width: 4%;"></td>
    <td style="background: #E6FFE6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #43e97b; font-size: 1.2em;">✅ Good Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #43e97b; margin: 10px 0; border-radius: 5px;">
        Create a 3-day itinerary for Paris in summer for a family with two teenagers. Include:<br/>
        • 2 famous landmarks per day<br/>
        • 1 unique local experience<br/>
        • Budget-friendly lunch options<br/>
        • Evening activities suitable for teens<br/>
        • Format as a daily schedule with times
      </blockquote>
    </td>
  </tr>
</table>

<div style="background: #F0F0FF; padding: 15px; border-radius: 10px; border-left: 5px solid #667eea;">
  <strong style="color: #667eea;">🤔 Your Turn:</strong> Try both prompts with an AI and compare the results. What differences do you notice?
</div>

<div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  <label style="display: block; font-weight: bold; color: #667eea; margin-bottom: 10px;">📝 Share your findings:</label>
  <textarea id="travel-notes" placeholder="What differences did you notice between the bad and good prompts?" style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#ddd'"></textarea>
  <button onclick="saveChallenge('travel', document.getElementById('travel-notes').value)" style="margin-top: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Save My Notes ✅</button>
  <span id="travel-saved" style="margin-left: 10px; color: #43e97b; font-weight: bold; display: none;">Saved! ✨</span>
</div>

---

### <span style="color:#764ba2; background-color: white; padding: 5px 10px; border-radius: 5px;">✍️ Challenge 2: The Creative Writer</span>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="background: #FFE6E6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #f5576c; font-size: 1.2em;">❌ Bad Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #f5576c; margin: 10px 0; border-radius: 5px;">
        Write a story
      </blockquote>
    </td>
    <td style="width: 4%;"></td>
    <td style="background: #E6FFE6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #43e97b; font-size: 1.2em;">✅ Good Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #43e97b; margin: 10px 0; border-radius: 5px;">
        Write a 200-word mystery story set in a futuristic school where:<br/>
        • The protagonist is a student detective<br/>
        • Something valuable has gone missing<br/>
        • Include a surprising twist at the end<br/>
        • Use descriptive language and dialogue<br/>
        • Target audience: middle school readers
      </blockquote>
    </td>
  </tr>
</table>

<div style="background: #F0F0FF; padding: 15px; border-radius: 10px; border-left: 5px solid #667eea;">
  <strong style="color: #667eea;">🤔 Your Turn:</strong> Which prompt gives you a more useful and interesting story?
</div>

<div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  <label style="display: block; font-weight: bold; color: #667eea; margin-bottom: 10px;">📝 Share your findings:</label>
  <textarea id="story-notes" placeholder="What made the good prompt's story better?" style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#ddd'"></textarea>
  <button onclick="saveChallenge('story', document.getElementById('story-notes').value)" style="margin-top: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Save My Notes ✅</button>
  <span id="story-saved" style="margin-left: 10px; color: #43e97b; font-weight: bold; display: none;">Saved! ✨</span>
</div>

---

### <span style="color:#00f2fe; background-color: black; padding: 5px 10px; border-radius: 5px;">💻 Challenge 3: The Code Helper</span>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="background: #FFE6E6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #f5576c; font-size: 1.2em;">❌ Bad Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #f5576c; margin: 10px 0; border-radius: 5px;">
        Help me with Python
      </blockquote>
    </td>
    <td style="width: 4%;"></td>
    <td style="background: #E6FFE6; padding: 20px; border-radius: 10px; width: 48%;">
      <strong style="color: #43e97b; font-size: 1.2em;">✅ Good Prompt</strong>
      <blockquote style="background: white; padding: 15px; border-left: 4px solid #43e97b; margin: 10px 0; border-radius: 5px;">
        I'm a beginner learning Python. Help me write a function that:<br/>
        • Takes a list of numbers as input<br/>
        • Returns only the even numbers<br/>
        • Include comments explaining each step<br/>
        • Provide an example of how to use the function<br/>
        • Explain why this approach works
      </blockquote>
    </td>
  </tr>
</table>

<div style="background: #F0F0FF; padding: 15px; border-radius: 10px; border-left: 5px solid #667eea;">
  <strong style="color: #667eea;">🤔 Your Turn:</strong> Try asking for coding help both ways. Which gets you closer to what you actually need?
</div>

<div style="background: white; padding: 20px; border-radius: 10px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  <label style="display: block; font-weight: bold; color: #667eea; margin-bottom: 10px;">📝 Share your findings:</label>
  <textarea id="code-notes" placeholder="How did specificity help with the coding task?" style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#ddd'"></textarea>
  <button onclick="saveChallenge('code', document.getElementById('code-notes').value)" style="margin-top: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Save My Notes ✅</button>
  <span id="code-saved" style="margin-left: 10px; color: #43e97b; font-weight: bold; display: none;">Saved! ✨</span>
</div>

---

### <span style="color:#fa709a; background-color: white; padding: 5px 10px; border-radius: 5px;">🎨 Challenge 4: Interactive Prompt Analyzer</span>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; color: white; margin-bottom: 20px;">
  <h3 style="margin: 0 0 10px 0;">✍️ Type Your Prompt Below</h3>
  <p style="font-size: 1.05em; margin: 0;">Our AI-powered analyzer will give you instant feedback on your prompt quality!</p>
</div>

<div style="background: #FFFFFF; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px 0;">

  <label for="promptInput" style="display: block; font-size: 1.1em; font-weight: bold; color: #667eea; background-color: white; padding: 8px; border-radius: 5px; margin-bottom: 10px;">
    💭 Enter your prompt:
  </label>

  <textarea
    id="promptInput"
    placeholder="Type your prompt here... (e.g., 'Help me with homework' or 'Write a story')"
    style="width: 100%; min-height: 120px; padding: 15px; font-size: 1em; border: 2px solid #ddd; border-radius: 10px; font-family: inherit; resize: vertical; transition: border-color 0.3s;"
    oninput="analyzePrompt()"
    onfocus="this.style.borderColor='#667eea'"
    onblur="this.style.borderColor='#ddd'"
  ></textarea>

  <div style="margin-top: 10px; text-align: right; color: #999; font-size: 0.9em;">
    <span id="charCount">0</span> characters
  </div>

  <div id="analysisResults" style="margin-top: 25px; display: none;">

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white; margin-bottom: 20px;">
      <h4 style="margin: 0 0 15px 0; font-size: 1.3em;">📊 Prompt Quality Score</h4>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
        <div id="scoreBar" style="height: 30px; background: linear-gradient(90deg, #f5576c 0%, #fee140 50%, #43e97b 100%); border-radius: 15px; position: relative; overflow: hidden;">
          <div id="scoreIndicator" style="position: absolute; top: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); transition: right 0.5s ease;"></div>
        </div>
        <div id="scoreText" style="margin-top: 10px; font-size: 1.5em; font-weight: bold; text-align: center;">-</div>
      </div>
    </div>

    <div style="display: grid; gap: 15px;">

      <div id="clarityBox" class="criteria-box" style="background: #FFE6E6; padding: 20px; border-radius: 10px; border-left: 5px solid #f5576c;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #f5576c; font-size: 1.1em;">🎯 Clarity</strong>
          <span id="clarityScore" style="font-size: 1.2em;">-</span>
        </div>
        <p id="clarityFeedback" style="margin: 10px 0 0 0; color: #555; background-color: white; padding: 5px; border-radius: 3px;"></p>
      </div>

      <div id="contextBox" class="criteria-box" style="background: #E6F7FF; padding: 20px; border-radius: 10px; border-left: 5px solid #4facfe;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #4facfe; font-size: 1.1em;">📚 Context</strong>
          <span id="contextScore" style="font-size: 1.2em;">-</span>
        </div>
        <p id="contextFeedback" style="margin: 10px 0 0 0; color: #555; background-color: white; padding: 5px; border-radius: 3px;"></p>
      </div>

      <div id="formatBox" class="criteria-box" style="background: #E6FFF9; padding: 20px; border-radius: 10px; border-left: 5px solid #43e97b;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #43e97b; font-size: 1.1em;">📋 Format Specification</strong>
          <span id="formatScore" style="font-size: 1.2em;">-</span>
        </div>
        <p id="formatFeedback" style="margin: 10px 0 0 0; color: #555; background-color: white; padding: 5px; border-radius: 3px;"></p>
      </div>

      <div id="specificityBox" class="criteria-box" style="background: #FFF9E6; padding: 20px; border-radius: 10px; border-left: 5px solid #fee140;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #fa709a; font-size: 1.1em;">🔍 Specificity</strong>
          <span id="specificityScore" style="font-size: 1.2em;">-</span>
        </div>
        <p id="specificityFeedback" style="margin: 10px 0 0 0; color: #555; background-color: white; padding: 5px; border-radius: 3px;"></p>
      </div>

    </div>

    <div id="suggestions" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 12px; color: white; margin-top: 20px;">
      <h4 style="margin: 0 0 15px 0; font-size: 1.2em;">💡 Suggestions for Improvement</h4>
      <ul id="suggestionsList" style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
      </ul>
    </div>

    <div id="improvedPrompt" style="background: #F0F0FF; padding: 25px; border-radius: 12px; margin-top: 20px; display: none;">
      <h4 style="color: #667eea; margin: 0 0 15px 0; font-size: 1.2em;">✨ Example Improved Version</h4>
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p id="improvedPromptText" style="margin: 0; color: #333; line-height: 1.6; font-style: italic;"></p>
      </div>
    </div>

  </div>

</div>

<script>
// Challenge note saving
function saveChallenge(challenge, notes) {
  if (!notes.trim()) {
    alert('Please write something before saving!');
    return;
  }
  localStorage.setItem('ai-module-c3-challenge-' + challenge, notes);
  const savedIndicator = document.getElementById(challenge + '-saved');
  savedIndicator.style.display = 'inline';
  setTimeout(() => {
    savedIndicator.style.display = 'none';
  }, 3000);
}

// Load saved challenges on page load
document.addEventListener('DOMContentLoaded', function() {
  const challenges = ['travel', 'story', 'code', 'bonus'];
  challenges.forEach(challenge => {
    const saved = localStorage.getItem('ai-module-c3-challenge-' + challenge);
    if (saved) {
      const element = document.getElementById(challenge + '-notes') || document.getElementById(challenge + '-prompt');
      if (element) element.value = saved;
    }
  });

  // Load saved reflections
  document.querySelectorAll('.reflection-input').forEach(input => {
    const num = input.getAttribute('data-reflection');
    const saved = localStorage.getItem('ai-module-c3-reflection-' + num);
    if (saved) input.value = saved;
  });
});

// Save reflections
function saveReflections() {
  let count = 0;
  document.querySelectorAll('.reflection-input').forEach(input => {
    const num = input.getAttribute('data-reflection');
    if (input.value.trim()) {
      localStorage.setItem('ai-module-c3-reflection-' + num, input.value);
      count++;
    }
  });

  const savedIndicator = document.getElementById('reflection-saved');
  if (count > 0) {
    savedIndicator.textContent = `${count} reflection${count !== 1 ? 's' : ''} saved! ✨`;
    savedIndicator.style.display = 'block';
    setTimeout(() => {
      savedIndicator.style.display = 'none';
    }, 4000);
  } else {
    alert('Please write at least one reflection before saving!');
  }
}

// Analyze bonus prompt
function analyzeBonusPrompt() {
  const prompt = document.getElementById('bonus-prompt').value;
  const feedback = document.getElementById('bonus-feedback');

  if (!prompt.trim()) {
    alert('Please write a prompt first!');
    return;
  }

  // Simple analysis
  const wordCount = prompt.trim().split(/\s+/).length;
  const hasContext = /for|because|about|regarding|need|want|help|audience|purpose/.test(prompt.toLowerCase());
  const hasFormat = /format|table|list|points|paragraph|structure|include/.test(prompt.toLowerCase());
  const hasNumbers = /\d/.test(prompt);

  let score = 0;
  let comments = [];

  if (wordCount > 15) {
    score += 3;
    comments.push('✅ Great length with good detail!');
  } else if (wordCount > 8) {
    score += 2;
    comments.push('👍 Decent length, could add more details.');
  } else {
    score += 1;
    comments.push('⚠️ Try adding more specific details.');
  }

  if (hasContext) {
    score += 3;
    comments.push('✅ Good context provided!');
  } else {
    comments.push('💡 Try adding context (audience, purpose, etc.)');
  }

  if (hasFormat) {
    score += 2;
    comments.push('✅ Output format specified!');
  } else {
    comments.push('💡 Consider specifying the desired format.');
  }

  if (hasNumbers) {
    score += 2;
    comments.push('✅ Specific constraints included!');
  }

  const maxScore = 10;
  const percentage = Math.round((score / maxScore) * 100);

  let grade, color;
  if (percentage >= 80) {
    grade = 'Excellent!';
    color = '#43e97b';
  } else if (percentage >= 60) {
    grade = 'Good job!';
    color = '#4facfe';
  } else if (percentage >= 40) {
    grade = 'Getting better!';
    color = '#fee140';
  } else {
    grade = 'Keep trying!';
    color = '#f5576c';
  }

  feedback.innerHTML = `
    <div style="background: linear-gradient(135deg, ${color} 0%, ${color}CC 100%); padding: 20px; border-radius: 10px; color: white;">
      <h4 style="margin: 0 0 10px 0;">Your Score: ${score}/${maxScore} - ${grade}</h4>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
        ${comments.map(c => '<p style="margin: 5px 0;">' + c + '</p>').join('')}
      </div>
      <p style="margin: 15px 0 0 0; font-style: italic;">Original: "make something cool" - Your version is ${wordCount > 3 ? 'much' : 'somewhat'} better!</p>
    </div>
  `;
  feedback.style.display = 'block';
}

function analyzePrompt() {
  const input = document.getElementById('promptInput').value;
  const charCount = document.getElementById('charCount');
  const results = document.getElementById('analysisResults');

  charCount.textContent = input.length;

  if (input.length === 0) {
    results.style.display = 'none';
    return;
  }

  results.style.display = 'block';

  // Analysis criteria
  let scores = {
    clarity: 0,
    context: 0,
    format: 0,
    specificity: 0
  };

  let suggestions = [];

  // Clarity check
  const wordCount = input.trim().split(/\s+/).length;
  if (wordCount < 3) {
    scores.clarity = 2;
    document.getElementById('clarityFeedback').textContent = 'Too vague. Add more details about what you want.';
    suggestions.push('Be more specific about your goal or desired outcome');
  } else if (wordCount < 10) {
    scores.clarity = 5;
    document.getElementById('clarityFeedback').textContent = 'Basic clarity. Could use more details.';
    suggestions.push('Add more information about what specifically you need');
  } else {
    scores.clarity = 9;
    document.getElementById('clarityFeedback').textContent = 'Good length and detail!';
  }

  // Context check
  const contextWords = ['for', 'because', 'about', 'regarding', 'need', 'want', 'help', 'audience', 'purpose', 'background'];
  const hasContext = contextWords.some(word => input.toLowerCase().includes(word));
  const hasBullets = input.includes('•') || input.includes('-') || input.includes('*');

  if (!hasContext && wordCount > 5) {
    scores.context = 4;
    document.getElementById('contextFeedback').textContent = 'Missing context. Who is this for? What\'s the purpose?';
    suggestions.push('Add context: Who is your audience? What\'s the purpose?');
  } else if (hasContext) {
    scores.context = 9;
    document.getElementById('contextFeedback').textContent = 'Good context provided!';
  } else {
    scores.context = 2;
    document.getElementById('contextFeedback').textContent = 'No context detected.';
    suggestions.push('Provide background information or explain the situation');
  }

  // Format check
  const formatWords = ['format', 'table', 'list', 'points', 'paragraph', 'structure', 'include', 'columns', 'sections'];
  const hasFormat = formatWords.some(word => input.toLowerCase().includes(word)) || hasBullets;

  if (hasFormat || hasBullets) {
    scores.format = 9;
    document.getElementById('formatFeedback').textContent = 'Great! You specified the output format.';
  } else {
    scores.format = 3;
    document.getElementById('formatFeedback').textContent = 'No format specified. How should the AI respond?';
    suggestions.push('Specify the desired format (list, table, paragraph, etc.)');
  }

  // Specificity check
  const specificWords = ['specific', 'exactly', 'must', 'should', 'requirement', 'constraint', 'limit', 'between', 'maximum', 'minimum'];
  const hasNumbers = /\d/.test(input);
  const hasConstraints = specificWords.some(word => input.toLowerCase().includes(word)) || hasNumbers;

  if (hasConstraints && wordCount > 15) {
    scores.specificity = 10;
    document.getElementById('specificityFeedback').textContent = 'Excellent specificity with clear constraints!';
  } else if (hasConstraints || wordCount > 15) {
    scores.specificity = 7;
    document.getElementById('specificityFeedback').textContent = 'Good level of detail.';
  } else {
    scores.specificity = 3;
    document.getElementById('specificityFeedback').textContent = 'Too general. Add specific requirements or constraints.';
    suggestions.push('Add specific constraints (word count, style, requirements)');
  }

  // Update score displays
  document.getElementById('clarityScore').textContent = getScoreEmoji(scores.clarity) + ' ' + scores.clarity + '/10';
  document.getElementById('contextScore').textContent = getScoreEmoji(scores.context) + ' ' + scores.context + '/10';
  document.getElementById('formatScore').textContent = getScoreEmoji(scores.format) + ' ' + scores.format + '/10';
  document.getElementById('specificityScore').textContent = getScoreEmoji(scores.specificity) + ' ' + scores.specificity + '/10';

  // Calculate overall score
  const overallScore = Math.round((scores.clarity + scores.context + scores.format + scores.specificity) / 4);
  const scorePercent = overallScore * 10;

  document.getElementById('scoreIndicator').style.right = scorePercent + '%';
  document.getElementById('scoreText').textContent = overallScore + '/10 - ' + getScoreLabel(overallScore);

  // Show suggestions
  const suggestionsList = document.getElementById('suggestionsList');
  if (suggestions.length > 0) {
    suggestionsList.innerHTML = suggestions.map(s => '<li>' + s + '</li>').join('');
    document.getElementById('suggestions').style.display = 'block';
  } else {
    suggestionsList.innerHTML = '<li>Excellent work! Your prompt is well-structured.</li>';
  }

  // Generate improved version for low scores
  if (overallScore < 7) {
    generateImprovedPrompt(input, scores);
  } else {
    document.getElementById('improvedPrompt').style.display = 'none';
  }
}

function getScoreEmoji(score) {
  if (score >= 8) return '🌟';
  if (score >= 6) return '👍';
  if (score >= 4) return '⚠️';
  return '❌';
}

function getScoreLabel(score) {
  if (score >= 9) return 'Excellent!';
  if (score >= 7) return 'Good Job!';
  if (score >= 5) return 'Getting There';
  if (score >= 3) return 'Needs Work';
  return 'Too Vague';
}

function generateImprovedPrompt(original, scores) {
  const improved = document.getElementById('improvedPrompt');
  const improvedText = document.getElementById('improvedPromptText');

  let enhancement = original;
  let additions = [];

  if (scores.context < 6) {
    additions.push('[Add context: specify your audience, purpose, or background]');
  }
  if (scores.format < 6) {
    additions.push('[Specify format: e.g., "Format as a bulleted list" or "Provide in table format"]');
  }
  if (scores.specificity < 6) {
    additions.push('[Add constraints: e.g., "in 200 words" or "include 3 examples"]');
  }

  if (additions.length > 0) {
    enhancement = original + '\n\n' + additions.join('\n');
  }

  improvedText.textContent = enhancement;
  improved.style.display = 'block';
}
</script>

<div style="background: #FFF9E6; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px dashed #fee140;">
  <strong style="color: #fa709a; font-size: 1.2em;">🎯 Try These Examples:</strong>
  <div style="margin-top: 15px; display: grid; gap: 10px;">
    <button onclick="document.getElementById('promptInput').value='Tell me about space'; analyzePrompt();" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      Example 1: Vague prompt ❌
    </button>
    <button onclick="document.getElementById('promptInput').value='You are a science teacher. Explain black holes to a 12-year-old student using simple analogies and examples from everyday life. Keep it under 150 words and make it engaging.'; analyzePrompt();" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
      Example 2: Great prompt ✅
    </button>
  </div>
</div>

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; margin: 0;">💡 Prompt Engineering Tips & Tricks</h2>
  <p style="color: #E0E0E0; margin: 10px 0 0 0;">Level up your prompt game with these pro techniques!</p>
</div>

<div style="background: #FFF9E6; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #fee140;">
  <h3 style="color: #fa709a; margin: 0 0 15px 0;">🎮 Interactive Tips Quiz</h3>
  <p style="color: #333; margin-bottom: 15px;">Test your knowledge! Click on each tip below to reveal a challenge:</p>
  <div style="display: grid; gap: 10px;">
    <div class="quiz-tip" onclick="toggleQuiz(1)" style="background: white; padding: 15px; border-radius: 8px; border-left: 5px solid #667eea; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
      <strong style="color: #667eea;">🎭 Tip 1: Role Assignment</strong> <span style="float: right;">▼</span>
      <div id="quiz-1" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 2px dashed #667eea;">
        <p style="color: #555; margin: 10px 0;">Try it: Write a prompt that assigns the AI the role of a "friendly chef teaching cooking to beginners"</p>
        <textarea id="quiz-1-input" placeholder="Write your prompt here..." style="width: 100%; min-height: 60px; padding: 10px; border: 2px solid #667eea; border-radius: 5px; margin-top: 5px;"></textarea>
        <button onclick="checkQuiz(1); event.stopPropagation();" style="margin-top: 8px; background: #667eea; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Check My Answer ✓</button>
        <div id="quiz-1-feedback" style="margin-top: 10px;"></div>
      </div>
    </div>

    <div class="quiz-tip" onclick="toggleQuiz(2)" style="background: white; padding: 15px; border-radius: 8px; border-left: 5px solid #4facfe; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
      <strong style="color: #4facfe;">🎯 Tip 2: Few-Shot Learning</strong> <span style="float: right;">▼</span>
      <div id="quiz-2" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 2px dashed #4facfe;">
        <p style="color: #555; margin: 10px 0;">Try it: Provide examples to teach AI to convert sentences to hashtags</p>
        <textarea id="quiz-2-input" placeholder="Example: 'I love pizza' → #FoodLover #PizzaTime" style="width: 100%; min-height: 60px; padding: 10px; border: 2px solid #4facfe; border-radius: 5px; margin-top: 5px;"></textarea>
        <button onclick="checkQuiz(2); event.stopPropagation();" style="margin-top: 8px; background: #4facfe; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Check My Answer ✓</button>
        <div id="quiz-2-feedback" style="margin-top: 10px;"></div>
      </div>
    </div>

    <div class="quiz-tip" onclick="toggleQuiz(3)" style="background: white; padding: 15px; border-radius: 8px; border-left: 5px solid #43e97b; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
      <strong style="color: #43e97b;">📋 Tip 3: Breaking Into Steps</strong> <span style="float: right;">▼</span>
      <div id="quiz-3" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 2px dashed #43e97b;">
        <p style="color: #555; margin: 10px 0;">Try it: Break down "plan my birthday party" into clear steps</p>
        <textarea id="quiz-3-input" placeholder="Step 1: ..." style="width: 100%; min-height: 80px; padding: 10px; border: 2px solid #43e97b; border-radius: 5px; margin-top: 5px;"></textarea>
        <button onclick="checkQuiz(3); event.stopPropagation();" style="margin-top: 8px; background: #43e97b; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Check My Answer ✓</button>
        <div id="quiz-3-feedback" style="margin-top: 10px;"></div>
      </div>
    </div>
  </div>
</div>

<script>
function toggleQuiz(num) {
  const quiz = document.getElementById('quiz-' + num);
  const isVisible = quiz.style.display !== 'none';

  // Close all quizzes
  for (let i = 1; i <= 3; i++) {
    document.getElementById('quiz-' + i).style.display = 'none';
  }

  // Toggle current quiz
  if (!isVisible) {
    quiz.style.display = 'block';
  }
}

function checkQuiz(num) {
  const input = document.getElementById('quiz-' + num + '-input').value.trim();
  const feedback = document.getElementById('quiz-' + num + '-feedback');

  if (!input) {
    feedback.innerHTML = '<p style="color: #f5576c; padding: 10px; background: #FFE6E6; border-radius: 5px;">Please write something first!</p>';
    return;
  }

  const wordCount = input.split(/\s+/).length;
  let message = '';

  if (num === 1) {
    const hasRole = /you are|act as|as a|pretend/i.test(input);
    if (hasRole && wordCount > 5) {
      message = '<p style="color: #43e97b; padding: 10px; background: #E6FFE6; border-radius: 5px;">🌟 Excellent! You clearly assigned a role to the AI!</p>';
    } else {
      message = '<p style="color: #fee140; padding: 10px; background: #FFF9E6; border-radius: 5px;">💡 Good start! Try using phrases like "You are a..." or "Act as a..." to make the role crystal clear.</p>';
    }
  } else if (num === 2) {
    const hasArrow = /→|->|:|=>/i.test(input);
    const hasExample = wordCount > 8;
    if (hasArrow && hasExample) {
      message = '<p style="color: #43e97b; padding: 10px; background: #E6FFE6; border-radius: 5px;">🌟 Perfect! You provided clear examples with the pattern!</p>';
    } else {
      message = '<p style="color: #fee140; padding: 10px; background: #FFF9E6; border-radius: 5px;">💡 Try showing multiple examples with arrows (→) to demonstrate the pattern!</p>';
    }
  } else if (num === 3) {
    const hasSteps = /step|1\.|2\.|•|-/i.test(input);
    if (hasSteps && wordCount > 15) {
      message = '<p style="color: #43e97b; padding: 10px; background: #E6FFE6; border-radius: 5px;">🌟 Great job! You broke it down into clear, actionable steps!</p>';
    } else {
      message = '<p style="color: #fee140; padding: 10px; background: #FFF9E6; border-radius: 5px;">💡 Try breaking it into numbered steps or bullet points for clarity!</p>';
    }
  }

  feedback.innerHTML = message;

  // Save the answer
  localStorage.setItem('ai-module-c3-quiz-' + num, input);
}

// Load saved quiz answers
document.addEventListener('DOMContentLoaded', function() {
  for (let i = 1; i <= 3; i++) {
    const saved = localStorage.getItem('ai-module-c3-quiz-' + i);
    if (saved) {
      const element = document.getElementById('quiz-' + i + '-input');
      if (element) element.value = saved;
    }
  }
});
</script>

<div style="display: grid; gap: 20px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; color: white;">
  <h3 style="margin: 0 0 15px 0;">🎭 Tip 1: Use Role Assignment</h3>
  <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 10px 0;">
    <strong>❌ Instead of:</strong><br/>
    <em style="color: #FFE6E6;">"Explain quantum physics"</em>
  </div>
  <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px; margin: 10px 0;">
    <strong>✅ Try:</strong><br/>
    <em style="color: #E6FFE6;">"You are a science teacher explaining quantum physics to a 10-year-old using simple analogies"</em>
  </div>
</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 15px; color: white;">
  <h3 style="margin: 0 0 15px 0;">🎯 Tip 2: Provide Examples (Few-Shot Learning)</h3>
  <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px;">
    <strong>Example prompt:</strong><br/>
    <div style="margin: 10px 0; color: #E6F7FF;">
      Convert these to emoji summaries:<br/>
      • "Happy Birthday" → 🎂🎉🎁<br/>
      • "Good morning" → ☀️☕😊<br/>
      • "Going to the beach" → (AI completes this)
    </div>
  </div>
</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 15px; color: white;">
  <h3 style="margin: 0 0 15px 0;">📋 Tip 3: Break Complex Tasks into Steps</h3>
  <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px;">
    <strong>Example prompt:</strong><br/>
    <div style="margin: 10px 0; color: #E6FFF9;">
      Help me prepare for a presentation:<br/>
      • Step 1: Suggest 5 engaging opening hooks<br/>
      • Step 2: Create a clear 3-point outline<br/>
      • Step 3: Recommend visual aids for each point<br/>
      • Step 4: Write a memorable closing statement
    </div>
  </div>
</div>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; color: white;">
  <h3 style="margin: 0 0 15px 0;">📊 Tip 4: Specify Output Format</h3>
  <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px;">
    <strong>Example prompt:</strong><br/>
    <div style="margin: 10px 0; color: #FFF9E6;">
      List 5 healthy breakfast ideas in a table with columns: Recipe Name, Prep Time, Main Ingredients, and Calories
    </div>
  </div>
</div>

</div>

---

<div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 25px; border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; margin: 0;">🤔 Reflection Questions</h2>
  <p style="color: #E0E0E0; margin: 10px 0 0 0;">After completing the challenges, think about:</p>
</div>

<div style="background: #F5F5FF; padding: 25px; border-radius: 15px; border-left: 8px solid #667eea; margin: 20px 0;">
  <ol style="color: #555; line-height: 2; font-size: 1.05em;" id="reflection-list">
    <li><strong style="color: #667eea;">How did adding details change the AI's responses?</strong><br/>
      <textarea class="reflection-input" data-reflection="1" placeholder="Type your reflection here..." style="width: 95%; min-height: 60px; padding: 10px; margin-top: 8px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; resize: vertical;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#ddd'"></textarea>
    </li>
    <li><strong style="color: #764ba2;">What happened when you specified a format?</strong><br/>
      <textarea class="reflection-input" data-reflection="2" placeholder="Type your reflection here..." style="width: 95%; min-height: 60px; padding: 10px; margin-top: 8px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; resize: vertical;" onfocus="this.style.borderColor='#764ba2'" onblur="this.style.borderColor='#ddd'"></textarea>
    </li>
    <li><strong style="color: #f5576c;">Did providing context make the answers more relevant?</strong><br/>
      <textarea class="reflection-input" data-reflection="3" placeholder="Type your reflection here..." style="width: 95%; min-height: 60px; padding: 10px; margin-top: 8px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; resize: vertical;" onfocus="this.style.borderColor='#f5576c'" onblur="this.style.borderColor='#ddd'"></textarea>
    </li>
    <li><strong style="color: #00f2fe;">Which techniques worked best for different types of tasks?</strong><br/>
      <textarea class="reflection-input" data-reflection="4" placeholder="Type your reflection here..." style="width: 95%; min-height: 60px; padding: 10px; margin-top: 8px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; resize: vertical;" onfocus="this.style.borderColor='#00f2fe'" onblur="this.style.borderColor='#ddd'"></textarea>
    </li>
    <li><strong style="color: #43e97b;">How can you apply prompt engineering to help with your schoolwork or projects?</strong><br/>
      <textarea class="reflection-input" data-reflection="5" placeholder="Type your reflection here..." style="width: 95%; min-height: 60px; padding: 10px; margin-top: 8px; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; resize: vertical;" onfocus="this.style.borderColor='#43e97b'" onblur="this.style.borderColor='#ddd'"></textarea>
    </li>
  </ol>
  <div style="text-align: center; margin-top: 20px;">
    <button onclick="saveReflections()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Save All Reflections 📝</button>
    <div id="reflection-saved" style="margin-top: 10px; color: #43e97b; font-weight: bold; font-size: 1.1em; display: none;">All reflections saved! ✨</div>
  </div>
</div>

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; margin: 0;">🌟 Real-World Applications</h2>
  <p style="color: #E0E0E0; margin: 10px 0 0 0;">See how professionals use prompt engineering every day!</p>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="font-size: 2.5em; margin-bottom: 10px;">🎓</div>
  <strong style="font-size: 1.2em;">Students</strong>
  <p style="color: #FFE6E6; margin: 10px 0 0 0;">Getting better homework help and study materials</p>
</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="font-size: 2.5em; margin-bottom: 10px;">💻</div>
  <strong style="font-size: 1.2em;">Developers</strong>
  <p style="color: #E6F7FF; margin: 10px 0 0 0;">Writing code more efficiently</p>
</div>

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="font-size: 2.5em; margin-bottom: 10px;">✍️</div>
  <strong style="font-size: 1.2em;">Writers</strong>
  <p style="color: #E6FFF9; margin: 10px 0 0 0;">Brainstorming ideas and editing content</p>
</div>

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="font-size: 2.5em; margin-bottom: 10px;">🔬</div>
  <strong style="font-size: 1.2em;">Researchers</strong>
  <p style="color: #FFF9E6; margin: 10px 0 0 0;">Analyzing data and summarizing information</p>
</div>

<div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 20px; border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="font-size: 2.5em; margin-bottom: 10px;">💼</div>
  <strong style="font-size: 1.2em;">Businesses</strong>
  <p style="color: #E6E6FF; margin: 10px 0 0 0;">Creating marketing content and customer support</p>
</div>

</div>

---

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; margin: 0;">🎯 Bonus Challenge: Prompt Improvement Lab</h2>
  <p style="color: white; margin: 10px 0 0 0;">Put your skills to the test!</p>
</div>

<div style="background: #FFF9E6; padding: 30px; border-radius: 15px; margin: 20px 0; border: 3px solid #fee140;">
  <p style="font-size: 1.1em; color: #333; margin: 0 0 20px 0; background-color: white; padding: 10px; border-radius: 5px; display: inline-block;">Take this poorly written prompt and improve it:</p>

  <div style="background: #FFE6E6; padding: 20px; border-radius: 10px; border-left: 5px solid #f5576c; margin: 15px 0;">
    <strong style="color: #f5576c; font-size: 1.1em;">❌ Before:</strong>
    <blockquote style="background: white; padding: 15px; margin: 10px 0; border-radius: 5px; font-style: italic;">
      make something cool
    </blockquote>
  </div>

  <div style="background: #E6FFE6; padding: 20px; border-radius: 10px; border-left: 5px solid #43e97b; margin: 15px 0;">
    <strong style="color: #43e97b; font-size: 1.1em;">✅ Your Improved Version:</strong>
    <textarea id="bonus-prompt" placeholder="Write your improved version of 'make something cool' here - be creative!" style="width: 100%; min-height: 100px; padding: 15px; margin: 10px 0; border-radius: 8px; border: 2px solid #43e97b; font-family: inherit; resize: vertical;" onfocus="this.style.borderColor='#38f9d7'" onblur="this.style.borderColor='#43e97b'"></textarea>
    <button onclick="analyzeBonusPrompt()" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s; margin-right: 10px;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Analyze My Prompt 🔍</button>
    <button onclick="saveChallenge('bonus', document.getElementById('bonus-prompt').value)" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Save My Prompt ✅</button>
    <span id="bonus-saved" style="margin-left: 10px; color: #43e97b; font-weight: bold; display: none;">Saved! ✨</span>
    <div id="bonus-feedback" style="margin-top: 15px; display: none;"></div>
  </div>

  <div style="background: #E6F7FF; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
    <strong style="color: #4facfe; font-size: 1.1em;">🏆 Share Your Results!</strong>
    <p style="color: #333; margin: 10px 0 0 0; background-color: white; padding: 8px; border-radius: 5px;">Share your improved prompts with classmates and see who can get the most creative, useful, or interesting AI responses!</p>
  </div>
</div>

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; margin: 30px 0; color: white;">
  <h2 style="margin: 0 0 20px 0; text-align: center;">🎓 Key Takeaways</h2>

  <div style="display: grid; gap: 15px;">
    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; border-left: 5px solid white;">
      ✨ <strong>Specific prompts get better results than vague ones</strong>
    </div>

    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; border-left: 5px solid white;">
      🎯 <strong>Context helps AI understand what you really need</strong>
    </div>

    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; border-left: 5px solid white;">
      💡 <strong>Examples guide AI to produce the format you want</strong>
    </div>

    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; border-left: 5px solid white;">
      🔄 <strong>Iteration is key - refine your prompts based on results</strong>
    </div>

    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; border-left: 5px solid white;">
      🚀 <strong>Prompt engineering is a valuable skill for working with AI tools</strong>
    </div>
  </div>
</div>

<div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 15px; margin: 30px 0;">
  <h2 style="color: white; font-size: 2em; margin: 0;">🌟 Keep Practicing! 🌟</h2>
  <p style="color: white; font-size: 1.2em; margin: 15px 0 0 0;">You're on your way to becoming a prompt engineering expert!</p>
</div>

<p style="text-align: center; color: #ADD8E6; background-color: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px; font-size: 0.9em; margin: 30px 0; display: inline-block;">
  <em>This submodule was developed by The Sprinters</em>
</p>

<style>
.completion-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 1000;
  animation: slideInBanner 0.5s ease-out;
}

@keyframes slideInBanner {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>

<script>
// Scroll-to-bottom completion tracking
document.addEventListener("DOMContentLoaded", function() {
    const storageKey = 'ai-module-c3-completed';
    
    // Check if already completed
    if (localStorage.getItem(storageKey) === 'true') {
        return;
    }
    
    let hasScrolledToBottom = false;
    
    function checkScrollPosition() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if user scrolled to within 100px of bottom
        if (scrollTop + windowHeight >= documentHeight - 100) {
            if (!hasScrolledToBottom) {
                hasScrolledToBottom = true;
                
                // Mark module as completed
                localStorage.setItem(storageKey, 'true');
                
                // Show completion banner
                const banner = document.createElement('div');
                banner.className = 'completion-banner';
                banner.innerHTML = `
                    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">🎉 Module 3 Completed!</h3>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Module 4 unlocked!</p>
                `;
                document.body.appendChild(banner);
                
                // Remove banner after 4 seconds
                setTimeout(() => {
                    banner.style.animation = 'slideInBanner 0.5s ease-out reverse';
                    setTimeout(() => banner.remove(), 500);
                }, 4000);
                
                // Remove scroll listener
                window.removeEventListener('scroll', checkScrollPosition);
            }
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', checkScrollPosition);
    
    // Check immediately in case page is short
    checkScrollPosition();
});
</script>