---
layout: post
title: "Autopilot Crash"
microblog: True
description: "Task 3 of the End Quest: Fix the crash of the autopilot element of the rocketship to get home safe."
permalink: /digital-famine/end/submodule_3/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 3
categories: [CSP, Submodule, End]
tags: [end, submodule, codemaxxers]
author: "Evan"
microblog: true
date: 2025-10-21
---
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #0a0e1a;
    color: #e0e6ed;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  .main-container {
    position: relative;
    width: 100%;
    height: 100vh;
    background: url('{{ '/images/digital-famine/end-3.png' | relative_url }}') center/cover no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(10, 14, 26, 0.85);
  }

  .computer-terminal {
    position: absolute;
    right: 50%;
    bottom: 20%;
    transform: translateX(50%);
    width: 140px;
    height: 140px;
    cursor: pointer;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 30px rgba(125, 211, 252, 0.6));
  }

  @media (max-width: 768px) {
    .computer-terminal {
      width: 100px;
      height: 100px;
      bottom: 15%;
    }
  }

  .computer-terminal:hover {
    transform: scale(1.15) rotate(5deg);
    filter: drop-shadow(0 0 40px rgba(125, 211, 252, 1));
  }

  .computer-terminal img {
    width: 100%;
    height: 100%;
  }

  .repair-interface {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .repair-panel {
    width: 95%;
    max-width: 1200px;
    height: 95vh;
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1629 100%);
    border: 2px solid #7dd3fc;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    .repair-panel {
      width: 100%;
      height: 100vh;
      margin: 0;
      border-radius: 0;
    }
  }

  .panel-header {
    background: linear-gradient(90deg, #7dd3fc 0%, #0ea5e9 100%);
    padding: 15px 20px;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 768px) {
    .panel-header h2 {
      font-size: 18px;
    }
  }

  .panel-header h2 {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .close-button {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: rotate(90deg);
  }

  .panel-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: calc(95vh - 140px);
  }

  @media (max-width: 768px) {
    .panel-body {
      padding: 15px;
      gap: 15px;
      max-height: calc(100vh - 130px);
    }
  }

  .stage-progress {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }

  .stage-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2a3451;
    border: 3px solid #4a5578;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .stage-dot.active {
    background: #7dd3fc;
    border-color: #0ea5e9;
    color: #000;
    transform: scale(1.2);
  }

  .stage-dot.completed {
    background: #10b981;
    border-color: #059669;
    color: white;
  }

  .instructions-box {
    background: rgba(125, 211, 252, 0.1);
    border: 1px solid #7dd3fc;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    font-size: 16px;
    line-height: 1.6;
  }

  .sorting-area {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 30px;
    flex: 1;
  }

  @media (max-width: 768px) {
    .sorting-area {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .prompt-source {
    background: rgba(30, 41, 59, 0.5);
    border: 2px dashed #475569;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 500px;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .prompt-source {
      max-height: 300px;
    }
  }

  .prompt-card {
    background: linear-gradient(135deg, #3b4a6b 0%, #2c3e5f 100%);
    border: 2px solid #4a5578;
    border-radius: 10px;
    padding: 18px;
    cursor: move;
    transition: all 0.3s ease;
    font-size: 14px;
    line-height: 1.4;
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    white-space: normal; /* allow wrapping */
    word-break: break-word;
    min-height: 64px; /* taller by default */
    display: flex;
    align-items: flex-start; /* align multi-line content at top */
  }

  .prompt-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.3), transparent);
    transition: left 0.5s ease;
  }

  .prompt-card:hover::before {
    left: 100%;
  }

  .prompt-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: #7dd3fc;
  }

  .prompt-card.dragging {
    opacity: 0.5;
    transform: rotate(5deg);
  }

  .prompt-card p {
    margin: 0;
    width: 100%;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .category-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .category-box {
    background: rgba(30, 41, 59, 0.3);
    border: 2px solid #475569;
    border-radius: 12px;
    padding: 20px;
    min-height: 200px;
    transition: all 0.3s ease;
    position: relative;
  }

  @media (max-width: 768px) {
    .category-box {
      min-height: 150px;
      padding: 15px;
    }
  }

  .category-box.drag-over {
    background: rgba(125, 211, 252, 0.1);
    border-color: #7dd3fc;
    transform: scale(1.02);
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #475569;
  }

  .category-icon {
    font-size: 24px;
  }

  .category-title {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .category-effective { background: rgba(34, 197, 94, 0.1); border-color: #10b981; }
  .category-ineffective { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }

  .category-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 100px;
    align-items: stretch; /* ensure children stretch to container width */
  }

  .control-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    background: rgba(30, 41, 59, 0.3);
    border-top: 1px solid #475569;
  }

  @media (max-width: 768px) {
    .control-buttons {
      flex-direction: column;
      padding: 15px;
    }
  }

  .action-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  @media (max-width: 768px) {
    .action-btn {
      width: 100%;
      padding: 12px 20px;
      font-size: 14px;
    }
  }

  .action-btn::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.5s ease, height 0.5s ease;
  }

  .action-btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .action-btn.primary {
    background: linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%);
    color: #000;
  }

  .action-btn.secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: #fff;
  }

  .action-btn.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    display: none;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .feedback-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1629 100%);
    border: 3px solid #7dd3fc;
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    z-index: 2000;
    display: none;
    animation: slideIn 0.5s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  .feedback-message h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .feedback-success { border-color: #10b981; }
  .feedback-error { border-color: #ef4444; }

  .prompt-counter {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(125, 211, 252, 0.2);
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
  }
</style>

<div class="main-container">
  <div class="backdrop"></div>
  
  <div class="computer-terminal" onclick="openRepairInterface()">
    <img src="{{ '/images/digital-famine/end-3-computer.png' | relative_url }}" alt="Repair Terminal">
  </div>

  <div class="repair-interface" id="repairInterface">
    <div class="repair-panel">
      <div class="panel-header">
        <h2>🤖 AI Prompt Effectiveness Analyzer</h2>
        <button class="close-button" onclick="closeRepairInterface()">✕</button>
      </div>

      <div class="panel-body">
        <div class="instructions-box" id="instructions">
          <strong>🎯 AI PROMPT TRAINING MODULE</strong><br>
          Help train the ship's AI by categorizing prompts as either effective or ineffective.<br>
          Sort the prompts into the correct categories to restore optimal AI performance.<br>
          ✅ <strong>Effective Prompts</strong> | ❌ <strong>Ineffective Prompts</strong>
        </div>

        <div class="sorting-area">
          <div class="prompt-source" id="promptSource">
            <div class="prompt-counter" id="promptCounter">8 prompts</div>
            <!-- Prompts will be added here -->
          </div>

          <div class="category-grid">
            <div class="category-box category-effective" data-category="effective">
              <div class="category-header">
                <span class="category-icon">✅</span>
                <span class="category-title">Effective Prompts</span>
              </div>
              <div class="category-content" id="effective-content"></div>
            </div>

            <div class="category-box category-ineffective" data-category="ineffective">
              <div class="category-header">
                <span class="category-icon">❌</span>
                <span class="category-title">Ineffective Prompts</span>
              </div>
              <div class="category-content" id="ineffective-content"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="control-buttons">
        <button class="action-btn primary" onclick="verifySort()">Verify Categories</button>
        <button class="action-btn secondary" onclick="resetStage()">Reset Stage</button>
        <button class="action-btn success" id="returnBtn" onclick="window.history.back()">
          🚀 Autopilot Restored - Return to Mission
        </button>
      </div>
    </div>
  </div>

  <div class="feedback-message" id="feedbackMessage">
    <h3 id="feedbackTitle"></h3>
    <p id="feedbackText"></p>
  </div>
</div>

<script>
const prompts = [
  { text: "Create a detailed marketing strategy for a new eco-friendly product line, including target audience analysis, competitive positioning, and specific promotional channels", category: "effective" },
  { text: "make me a website", category: "ineffective" },
  { text: "Design a Python function that processes customer data to identify buying patterns and generate personalized recommendations. Include error handling and documentation", category: "effective" },
  { text: "fix my code", category: "ineffective" },
  { text: "Write a comprehensive analysis of the latest climate change research paper, focusing on methodology, key findings, and implications for policy makers", category: "effective" },
  { text: "do my homework", category: "ineffective" },
  { text: "Develop a step-by-step workout plan for someone recovering from a knee injury, including exercise descriptions, progression timeline, and safety considerations", category: "effective" },
  { text: "tell me what to do", category: "ineffective" },
  { text: "Create a detailed recipe for a vegan chocolate cake, including ingredients with exact measurements, preparation steps, baking instructions, and presentation tips", category: "effective" },
  { text: "idk just help me", category: "ineffective" }
];

let currentStage = 1;
let draggedElement = null;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

  function openRepairInterface() {
    document.getElementById('repairInterface').style.display = 'flex';
    loadPrompts();
  }

  function closeRepairInterface() {
    document.getElementById('repairInterface').style.display = 'none';
  }function loadPrompts() {
  // Clear all areas
  document.getElementById('promptSource').innerHTML = '<div class="prompt-counter" id="promptCounter"></div>';
  ['effective', 'ineffective'].forEach(cat => {
    document.getElementById(`${cat}-content`).innerHTML = '';
  });
  
  // Load and shuffle prompts
  const shuffled = shuffle(prompts);
  
  shuffled.forEach((prompt, index) => {
    const card = createPromptCard(prompt.text, prompt.category, index);
    document.getElementById('promptSource').appendChild(card);
  });
  
  updatePromptCounter();
  document.getElementById('returnBtn').style.display = 'none';
}

function createPromptCard(text, category, index) {
  const card = document.createElement('div');
  card.className = 'prompt-card';
  card.draggable = true;
  card.textContent = text;
  card.dataset.category = category;
  card.dataset.id = `prompt-${index}`;
  
  // Drag events
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);
  
  // Click to move (mobile friendly)
  card.addEventListener('click', handleCardClick);
  
  return card;
}

function handleDragStart(e) {
  draggedElement = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedElement = null;
  updatePromptCounter();
}

function handleCardClick(e) {
  const card = e.target;
  if (card.parentElement.id === 'promptSource') {
    // Auto-place in first category (mobile-friendly)
    const categories = ['effective', 'ineffective'];
    for (let cat of categories) {
      const content = document.getElementById(`${cat}-content`);
      // place into the first category (keeps behavior simple on tap)
      content.appendChild(card);
      updatePromptCounter();
      break;
    }
  } else {
    // Return to source
    document.getElementById('promptSource').appendChild(card);
    updatePromptCounter();
  }
}

// Setup drop zones
document.querySelectorAll('.category-box').forEach(box => {
  box.addEventListener('dragover', e => {
    e.preventDefault();
    box.classList.add('drag-over');
  });
  
  box.addEventListener('dragleave', () => {
    box.classList.remove('drag-over');
  });
  
  box.addEventListener('drop', e => {
    e.preventDefault();
    box.classList.remove('drag-over');
    
    if (draggedElement) {
      const content = box.querySelector('.category-content');
      content.appendChild(draggedElement);
    }
  });
});

// Allow dropping back to source
document.getElementById('promptSource').addEventListener('dragover', e => {
  e.preventDefault();
});

document.getElementById('promptSource').addEventListener('drop', e => {
  e.preventDefault();
  if (draggedElement) {
    document.getElementById('promptSource').appendChild(draggedElement);
  }
});

function updatePromptCounter() {
  const remaining = document.getElementById('promptSource').querySelectorAll('.prompt-card').length;
  document.getElementById('promptCounter').textContent = `${remaining} prompts`;
}

  function verifySort() {
    const categories = ['effective', 'ineffective'];
    let allCorrect = true;
    let totalCards = 0;
    
    // Check if all prompts are sorted
    const remaining = document.getElementById('promptSource').querySelectorAll('.prompt-card').length;
    if (remaining > 0) {
      showFeedback('error', '⚠️ Incomplete', `Please sort all ${remaining} remaining prompts!`);
      return;
    }
    
    // Check each category
    categories.forEach(cat => {
      const content = document.getElementById(`${cat}-content`);
      const cards = content.querySelectorAll('.prompt-card');
      
      cards.forEach(card => {
        totalCards++;
        if (card.dataset.category !== cat) {
          allCorrect = false;
          card.style.border = '2px solid #ef4444';
          setTimeout(() => {
            card.style.border = '';
          }, 2000);
        }
      });
    });
    
    if (allCorrect) {
      showFeedback('success', '🎉 Training Complete!', 'All prompts correctly categorized! The AI is now optimized.');
      setTimeout(() => {
        document.getElementById('returnBtn').style.display = 'block';
      }, 2000);
    } else {
      showFeedback('error', '❌ Incorrect', 'Some prompts are in the wrong categories. Try again!');
    }
  }

function resetStage() {
  // Reload the shuffled prompts for the single-stage AI prompt game
  loadPrompts();
}

function showFeedback(type, title, text) {
  const msg = document.getElementById('feedbackMessage');
  const titleEl = document.getElementById('feedbackTitle');
  const textEl = document.getElementById('feedbackText');
  
  msg.className = `feedback-message feedback-${type}`;
  titleEl.textContent = title;
  textEl.textContent = text;
  
  msg.style.display = 'block';
  
  setTimeout(() => {
    msg.style.display = 'none';
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeRepairInterface();
  }
});
</script>

<script type="module">
  import { initEndModuleProgression } from '{{site.baseurl}}/assets/js/digitalFamine/endModuleProgression.js';
  
  // Initialize progression system for this module
  initEndModuleProgression();
</script>