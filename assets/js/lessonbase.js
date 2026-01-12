// -------------------- FLASHCARDS (MUST BE FIRST) --------------------
// Define ALL flashcard functions immediately in global scope
window.flashcardsData = null;

window.flipCard = function(cardId) {
  console.log('flipCard called with:', cardId); // Debug log
  const card = document.getElementById(cardId);
  if (!card) {
    console.log('Card not found:', cardId);
    return;
  }
  const inner = card.querySelector('.flashcard-inner');
  if (inner) {
    inner.classList.toggle('flipped');
  }
};

window.navigateCards = function(direction) {
  console.log('navigateCards called with:', direction); // Debug log
  if (!window.flashcardsData) {
    console.log('flashcardsData not initialized');
    return;
  }
  
  let newIndex = window.flashcardsData.currentIndex;
  
  if (direction === 'next' && window.flashcardsData.currentIndex < window.flashcardsData.totalCards) {
    newIndex = window.flashcardsData.currentIndex + 1;
  } else if (direction === 'prev' && window.flashcardsData.currentIndex > 1) {
    newIndex = window.flashcardsData.currentIndex - 1;
  }
  
  if (newIndex !== window.flashcardsData.currentIndex) {
    window.flashcardsData.currentIndex = newIndex;
    showCard(newIndex);
    updateNavButtons();
    saveFlashcardsData();
  }
};

window.markCard = function(status) {
  console.log('markCard called with:', status); // Debug log
  if (!window.flashcardsData) {
    console.log('flashcardsData not initialized');
    return;
  }
  
  const currentCard = document.querySelector('[id^="card-"]:not(.hidden)');
  if (!currentCard) {
    console.log('No current card found');
    return;
  }
  
  const cardIndex = parseInt(currentCard.dataset.index);
  const statusEl = document.getElementById(`status-${cardIndex}`);
  
  // Remove card from both arrays
  window.flashcardsData.knownCards = window.flashcardsData.knownCards.filter(idx => idx !== cardIndex);
  window.flashcardsData.reviewCards = window.flashcardsData.reviewCards.filter(idx => idx !== cardIndex);
  
  // Add to appropriate array
  if (status === 'know') {
    window.flashcardsData.knownCards.push(cardIndex);
    if (statusEl) statusEl.innerHTML = '<span style="color: #00E676;">✓ You know this card</span>';
  } else if (status === 'review') {
    window.flashcardsData.reviewCards.push(cardIndex);
    if (statusEl) statusEl.innerHTML = '<span style="color: #FFAB00;">↻ Marked for review</span>';
  }
  
  // Update progress and save
  updateProgressBar();
  populateReviewSidebar();
  saveFlashcardsData();
  
  // Award badge for using flashcards
  if (typeof unlockBadge === 'function') {
    unlockBadge('flashcards');
  }
  
  // Auto-advance to next card
  if (cardIndex < window.flashcardsData.totalCards) {
    setTimeout(() => window.navigateCards('next'), 500);
  }
};

window.jumpToCard = function(index) {
  console.log('jumpToCard called with:', index); // Debug log
  if (!window.flashcardsData) {
    console.log('flashcardsData not initialized');
    return;
  }
  
  window.flashcardsData.currentIndex = index;
  showCard(index);
  updateNavButtons();
  saveFlashcardsData();
};

// Helper functions for flashcards
function showCard(index) {
  // Hide all cards
  document.querySelectorAll('[id^="card-"]').forEach(card => {
    card.classList.add('hidden');
    // Reset flip status
    const inner = card.querySelector('.flashcard-inner');
    if (inner) inner.classList.remove('flipped');
  });
  
  // Show the requested card
  const card = document.getElementById(`card-${index}`);
  if (card) {
    card.classList.remove('hidden');
  }
  
  updateNavButtons();
}

function updateNavButtons() {
  if (!window.flashcardsData) return;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) {
    prevBtn.disabled = window.flashcardsData.currentIndex <= 1;
  }
  
  if (nextBtn) {
    nextBtn.disabled = window.flashcardsData.currentIndex >= window.flashcardsData.totalCards;
  }
}

function updateProgressBar() {
  if (!window.flashcardsData) return;
  
  const progressBar = document.getElementById('flashcard-progress');
  if (!progressBar) return;
  
  const totalCards = window.flashcardsData.totalCards;
  const uniqueKnown = new Set(window.flashcardsData.knownCards);
  const knownPercentage = (uniqueKnown.size / totalCards) * 100;
  
  progressBar.style.width = `${knownPercentage}%`;
}

function populateReviewSidebar() {
  if (!window.flashcardsData) return;
  
  const reviewList = document.getElementById('review-list');
  if (!reviewList) return;
  
  reviewList.innerHTML = "";
  
  window.flashcardsData.reviewCards.forEach(cardIdx => {
    const cardEl = document.getElementById(`card-${cardIdx}`);
    if (!cardEl) return;
    
    const frontText = cardEl.querySelector(".flashcard-front h3");
    const text = frontText ? frontText.textContent : `Card ${cardIdx}`;
    
    const li = document.createElement('li');
    li.innerHTML = `<button onclick="jumpToCard(${cardIdx})">${text}</button>`;
    reviewList.appendChild(li);
  });
}

function saveFlashcardsData() {
  if (!window.flashcardsData) return;
  
  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  const flashcardsKey = `flashcards-${lessonKey}`;
  localStorage.setItem(flashcardsKey, JSON.stringify(window.flashcardsData));
}

// Initialize flashcards when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for flashcards...'); // Debug log
  
  // Check if flashcards are enabled on this page
  if (!document.querySelector('.flashcards-section')) {
    console.log('No flashcards section found');
    return;
  }
  
  console.log('Flashcards section found, initializing...'); // Debug log
  
  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  const flashcardsKey = `flashcards-${lessonKey}`;
  
  // Initialize flashcards data
  const totalCards = document.querySelectorAll('[id^="card-"]').length;
  const saved = localStorage.getItem(flashcardsKey);
  
  console.log('Total cards found:', totalCards); // Debug log
  
  window.flashcardsData = saved ? JSON.parse(saved) : {
    knownCards: [],
    reviewCards: [],
    currentIndex: 1,
    totalCards: totalCards,
    lastVisited: new Date().toISOString()
  };
  
  console.log('Flashcards data initialized:', window.flashcardsData); // Debug log
  
  // Initialize the flashcards display
  updateProgressBar();
  showCard(window.flashcardsData.currentIndex);
  populateReviewSidebar();
  updateNavButtons();
});

// -------------------- TIME TRACKER --------------------
(function () {
  const display = document.getElementById("total-time");
  const statusEl = document.getElementById("timer-status");
  if (!display || !statusEl) return;

  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  let startTime = Date.now();
  let totalTime = parseInt(localStorage.getItem(`lesson-time-${lessonKey}`)) || 0;
  let isActive = true;

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function update() {
    if (!isActive) return;
    const current = totalTime + (Date.now() - startTime);
    display.textContent = formatTime(current);
    if (current >= 60000) unlockBadge(lessonKey); // 1 min badge
  }

  function pause() {
    if (!isActive) return;
    totalTime += Date.now() - startTime;
    isActive = false;
    statusEl.textContent = "Paused";
    statusEl.className = "timer-status paused";
    localStorage.setItem(`lesson-time-${lessonKey}`, totalTime);
  }

  function resume() {
    if (isActive) return;
    startTime = Date.now();
    isActive = true;
    statusEl.textContent = "Active";
    statusEl.className = "timer-status active";
  }

  setInterval(update, 1000);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
  window.addEventListener("beforeunload", () => {
    if (isActive) totalTime += Date.now() - startTime;
    localStorage.setItem(`lesson-time-${lessonKey}`, totalTime);
  });
})();

// -------------------- PROGRESS TRACKER --------------------
(function () {
  const bar = document.getElementById("lesson-progress");
  const text = document.getElementById("progress-text");
  const resetBtn = document.getElementById("reset-progress");
  if (!bar || !text) return;

  // Get total lessons from config, default to 6
  let TOTAL_LESSONS = 6;
  const configEl = document.getElementById('progress-config');
  if (configEl) {
    try {
      const config = JSON.parse(configEl.textContent);
      TOTAL_LESSONS = config.totalLessons || 6;
    } catch (e) {
      console.warn('Could not parse progress config, using default of 6 lessons');
    }
  }

  const PROGRESS_INCREMENT = 100 / TOTAL_LESSONS;
  
  const key = "lesson-progress";
  const lessonKey = window.location.pathname.split("/").pop() || "lesson";

  let progress = JSON.parse(localStorage.getItem(key)) || {};
  progress[lessonKey] = true;
  localStorage.setItem(key, JSON.stringify(progress));

  const done = Object.keys(progress).length;
  const percent = Math.min(Math.round(done * PROGRESS_INCREMENT), 100);
  
  bar.style.width = percent + "%";
  text.textContent = percent + "% complete";

  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm("Reset all progress and time data?")) {
        localStorage.removeItem(key);
        localStorage.removeItem("lesson-badges");
        // Generate lesson keys dynamically based on total lessons
        for (let i = 1; i <= TOTAL_LESSONS; i++) {
          localStorage.removeItem(`lesson-time-lesson-${i}`);
        }
        location.reload();
      }
    };
  }
})();

// -------------------- DYNAMIC BADGES --------------------
// Get badge configuration from frontmatter
function getBadgeConfig() {
  const configEl = document.getElementById('badge-config');
  if (!configEl) return { availableBadges: [], lessonKey: '' };
  
  try {
    const config = JSON.parse(configEl.textContent);
    return {
      availableBadges: config.lessonBadges || [],
      lessonKey: config.lessonKey || ''
    };
  } catch (e) {
    console.warn('Could not parse badge config');
    return { availableBadges: [], lessonKey: '' };
  }
}

function unlockBadge(badgeName) {
  const config = getBadgeConfig();
  
  // Only unlock if badge is in the available badges list
  if (config.availableBadges.length > 0 && !config.availableBadges.includes(badgeName)) {
    console.log(`Badge "${badgeName}" not available for this lesson`);
    return;
  }
  
  let badges = JSON.parse(localStorage.getItem("lesson-badges")) || [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    localStorage.setItem("lesson-badges", JSON.stringify(badges));
    renderBadges(badges);
    showCongratsPopup(badgeName);
  }
}

function renderBadges(badges) {
  const badgeContainer = document.getElementById("badges");
  if (!badgeContainer) return;
  
  const config = getBadgeConfig();
  badgeContainer.innerHTML = "";
  
  badges.forEach((badgeName) => {
    // Only show badges that are available for this lesson (or all if no restriction)
    if (config.availableBadges.length > 0 && !config.availableBadges.includes(badgeName)) {
      return;
    }
    
    const span = document.createElement("span");
    span.className = "badge";
    span.innerHTML = `🏅 ${badgeName}`;
    badgeContainer.appendChild(span);
  });
  
  if (badgeContainer.innerHTML === "") {
    badgeContainer.innerHTML = "No badges yet...";
  }
}

function showCongratsPopup(badgeName) {
  const popup = document.createElement("div");
  popup.className = "congrats-popup";
  popup.innerHTML = `🎉 Congrats! You earned the <b>"${badgeName}"</b> badge!`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 50);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  let saved = JSON.parse(localStorage.getItem("lesson-badges")) || [];
  renderBadges(saved);
});

// -------------------- SANDBOX --------------------
(function () {
  const runBtn = document.getElementById("run-sandbox");
  const codeBox = document.getElementById("sandbox-code");
  const output = document.getElementById("sandbox-output");
  if (!runBtn || !codeBox || !output) return;

  runBtn.addEventListener("click", () => {
    try {
      const result = eval(codeBox.value);
      output.textContent = String(result ?? "✅ Code ran successfully.");
    } catch (e) {
      output.textContent = "❌ Error: " + e.message;
    }
  });
})();

// -------------------- QUIZ / REFLECTION --------------------
(function () {
  const saveBtn = document.getElementById("save-reflection");
  const box = document.getElementById("reflection-box");
  const status = document.getElementById("reflection-status");
  if (!saveBtn || !box || !status) return;

  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  const refKey = "reflection-" + lessonKey;
  box.value = localStorage.getItem(refKey) || "";

  saveBtn.addEventListener("click", () => {
    localStorage.setItem(refKey, box.value);
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
    unlockBadge('reflection'); // Badge for writing reflection
  });
})();

// -------------------- BLACKBOARD --------------------
(function () {
  const canvasEl = document.getElementById('blackboard-canvas');
  if (!canvasEl) return;
  
  // Only initialize if fabric.js is loaded
  if (typeof fabric !== 'undefined') {
    const canvas = new fabric.Canvas('blackboard-canvas');
    canvas.isDrawingMode = true; // enable free drawing
    canvas.freeDrawingBrush.color = "white";
    canvas.freeDrawingBrush.width = 5;
    document.addEventListener("keydown", e => {
      if(e.key === "r") canvas.freeDrawingBrush.color = "red";
      if(e.key === "b") canvas.freeDrawingBrush.color = "blue";
      if(e.key === "g") canvas.freeDrawingBrush.color = "green";
      if(e.key === "w") canvas.freeDrawingBrush.color = "white";
      if(e.key === "c") canvas.clear();
    });
  }
})();

(function(){
  const toggle = document.getElementById("demo-toggle");
  const canvas = document.getElementById("demo-canvas-wrapper");
  const code = document.getElementById("demo-code");

  if (!toggle || !canvas || !code) return;

  // default: unchecked → canvas visible
  toggle.checked = false;

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      canvas.style.display = "none";
      code.style.display = "block";
    } else {
      code.style.display = "none";
      canvas.style.display = "block";
    }
  });
})();

