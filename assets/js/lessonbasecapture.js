// -------------------- API CONFIG LOADER --------------------
import { javaURI, fetchOptions } from '/assets/js/api/config.js';
async function getApiConfig() {
  return { javaURI, fetchOptions };
}

// -------------------- FLASHCARDS (MUST BE FIRST) --------------------
// Define ALL flashcard functions immediately in global scope
window.flashcardsData = null;
window.lessonProgress = null;

window.flipCard = function(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const inner = card.querySelector('.flashcard-inner');
  if (inner) inner.classList.toggle('flipped');
};

window.navigateCards = function(direction) {
  if (!window.flashcardsData) return;

  let newIndex = window.flashcardsData.currentIndex;
  if (direction === 'next' && newIndex < window.flashcardsData.totalCards) newIndex++;
  else if (direction === 'prev' && newIndex > 1) newIndex--;

  if (newIndex !== window.flashcardsData.currentIndex) {
    window.flashcardsData.currentIndex = newIndex;
    window.lessonProgress.currentFlashcardIndex = newIndex;
    showCard(newIndex);
    updateNavButtons();
    syncLessonProgress();
  }
};

window.markCard = function(status) {
  if (!window.flashcardsData) return;
  const currentCard = document.querySelector('[id^="card-"]:not(.hidden)');
  if (!currentCard) return;
  const cardIndex = parseInt(currentCard.dataset.index);
  const statusEl = document.getElementById(`status-${cardIndex}`);

  // Remove from both sets
  window.flashcardsData.knownCards = window.flashcardsData.knownCards.filter(i => i !== cardIndex);
  window.flashcardsData.reviewCards = window.flashcardsData.reviewCards.filter(i => i !== cardIndex);

  // Add to appropriate set
  if (status === 'know') {
    window.flashcardsData.knownCards.push(cardIndex);
    if (statusEl) statusEl.innerHTML = '<span style="color: #00E676;">✓ You know this card</span>';
  } else if (status === 'review') {
    window.flashcardsData.reviewCards.push(cardIndex);
    if (statusEl) statusEl.innerHTML = '<span style="color: #FFAB00;">↻ Marked for review</span>';
  }

  updateProgressBar();
  populateReviewSidebar();
  syncLessonProgress();

  unlockBadge('flashcards');
  if (cardIndex < window.flashcardsData.totalCards) setTimeout(() => window.navigateCards('next'), 500);
};

window.jumpToCard = function(index) {
  if (!window.flashcardsData) return;
  window.flashcardsData.currentIndex = index;
  window.lessonProgress.currentFlashcardIndex = index;
  showCard(index);
  updateNavButtons();
  syncLessonProgress();
};

// Helper functions for flashcards
function showCard(index) {
  document.querySelectorAll('[id^="card-"]').forEach(card => {
    card.classList.add('hidden');
    const inner = card.querySelector('.flashcard-inner');
    if (inner) inner.classList.remove('flipped');
  });
  const card = document.getElementById(`card-${index}`);
  if (card) card.classList.remove('hidden');
  updateNavButtons();
}

function updateNavButtons() {
  if (!window.flashcardsData) return;
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = window.flashcardsData.currentIndex <= 1;
  if (nextBtn) nextBtn.disabled = window.flashcardsData.currentIndex >= window.flashcardsData.totalCards;
}

function updateProgressBar() {
  const progressBar = document.getElementById('flashcard-progress');
  if (!window.flashcardsData || !progressBar) return;
  const total = window.flashcardsData.totalCards;
  const uniqueKnown = new Set(window.flashcardsData.knownCards);
  const percent = (uniqueKnown.size / total) * 100;
  progressBar.style.width = `${percent}%`;
}

function populateReviewSidebar() {
  const reviewList = document.getElementById('review-list');
  if (!window.flashcardsData || !reviewList) return;
  reviewList.innerHTML = '';
  window.flashcardsData.reviewCards.forEach(cardIdx => {
    const cardEl = document.getElementById(`card-${cardIdx}`);
    if (!cardEl) return;
    const text = cardEl.querySelector('.flashcard-front h3')?.textContent || `Card ${cardIdx}`;
    const li = document.createElement('li');
    li.innerHTML = `<button onclick="jumpToCard(${cardIdx})">${text}</button>`;
    reviewList.appendChild(li);
  });
}

// -------------------- LESSON PROGRESS LOADER --------------------
async function loadLessonProgress() {
  const loggedIn = await isUserLoggedIn();
  if (!loggedIn) {
    console.log("User not logged in — skipping lesson progress tracking.");
    showLoginMessage("lesson");
    return;
  }

  const { javaURI, fetchOptions } = await getApiConfig();
  const lessonKey = window.location.pathname.split("/").pop() || "lesson";
  const URL = `${javaURI}/api/lesson-progress/${lessonKey}`;

  const res = await fetch(URL, { ...fetchOptions, credentials: 'include' });
  if (!res.ok) return console.warn("No lesson progress found");
  const progress = await res.json();

  window.lessonProgress = progress;
  window.lessonProgress.lessonKey = lessonKey;

  const totalCards = document.querySelectorAll('[id^="card-"]').length;
  window.flashcardsData = {
    knownCards: [],
    reviewCards: [],
    currentIndex: progress.currentFlashcardIndex || 1,
    totalCards: totalCards
  };

  // Time display
  totalTime = progress.totalTimeMs || 0;
  const timeEl = document.getElementById("total-time");
  if (timeEl) timeEl.textContent = formatTime(totalTime);

  // Reflection
  const box = document.getElementById("reflection-box");
  if (box && progress.reflectionText) box.value = progress.reflectionText;

  renderBadges(progress.badges || []);
  updateProgressBar();
  showCard(window.flashcardsData.currentIndex);
  populateReviewSidebar();
  updateNavButtons();
}



document.addEventListener("DOMContentLoaded", loadLessonProgress);

// -------------------- TIME TRACKER --------------------
let totalTime = 0, startTime = 0, isActive = true;
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

(function() {
  const display = document.getElementById("total-time");
  const statusEl = document.getElementById("timer-status");
  if (!display || !statusEl) return;

  function update() {
    if (!isActive || !window.lessonProgress) return;
    const elapsed = totalTime + (Date.now() - startTime);
    display.textContent = formatTime(elapsed);
    if (elapsed >= 60000) unlockBadge(window.lessonProgress.lessonKey);
  }

  function pause() {
    if (!isActive) return;
    totalTime += Date.now() - startTime;
    isActive = false;
    statusEl.textContent = "Paused";
    statusEl.className = "timer-status paused";
    if (window.lessonProgress) {
      window.lessonProgress.totalTimeMs = totalTime;
      syncLessonProgress();
    }
  }

  function resume() {
    if (isActive) return;
    startTime = Date.now();
    isActive = true;
    statusEl.textContent = "Active";
    statusEl.className = "timer-status active";
  }

  startTime = Date.now();
  setInterval(update, 1000);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
  window.addEventListener("beforeunload", pause);
})();

// -------------------- REFLECTION / QUIZ --------------------
(function() {
  const saveBtn = document.getElementById("save-reflection");
  const box = document.getElementById("reflection-box");
  const status = document.getElementById("reflection-status");
  if (!saveBtn || !box || !status) return;

  saveBtn.addEventListener("click", async () => {
    if (!window.lessonProgress) return;
    window.lessonProgress.reflectionText = box.value;
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
    unlockBadge('reflection');
    await syncLessonProgress();
  });
})();

// -------------------- BADGES --------------------
function getBadgeConfig() {
  const el = document.getElementById("badge-config");
  if (!el) return { availableBadges: [], lessonKey: '' };
  try {
    return JSON.parse(el.textContent);
  } catch {
    return { availableBadges: [], lessonKey: '' };
  }
}

function unlockBadge(badgeName) {
  if (!window.lessonProgress) return;
  const config = getBadgeConfig();
  if (config.availableBadges.length && !config.availableBadges.includes(badgeName)) return;
  const badges = window.lessonProgress.badges || [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    window.lessonProgress.badges = badges;
    renderBadges(badges);
    showCongratsPopup(badgeName);
    syncLessonProgress();
  }
}

function renderBadges(badges) {
  const container = document.getElementById("badges");
  if (!container) return;
  container.innerHTML = "";
  badges.forEach(b => {
    const span = document.createElement("span");
    span.className = "badge";
    span.innerHTML = `🏅 ${b}`;
    container.appendChild(span);
  });
  if (!badges.length) container.innerHTML = "No badges yet...";
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

// -------------------- BLACKBOARD --------------------
(function() {
  const canvasEl = document.getElementById("blackboard-canvas");
  if (!canvasEl) return;
  if (typeof fabric !== "undefined") {
    const canvas = new fabric.Canvas("blackboard-canvas");
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "white";
    canvas.freeDrawingBrush.width = 5;
    document.addEventListener("keydown", e => {
      if (e.key === "r") canvas.freeDrawingBrush.color = "red";
      if (e.key === "b") canvas.freeDrawingBrush.color = "blue";
      if (e.key === "g") canvas.freeDrawingBrush.color = "green";
      if (e.key === "w") canvas.freeDrawingBrush.color = "white";
      if (e.key === "c") canvas.clear();
    });
  }
})();

// -------------------- DEMO TOGGLE --------------------
(function() {
  const toggle = document.getElementById("demo-toggle");
  const canvas = document.getElementById("demo-canvas-wrapper");
  const code = document.getElementById("demo-code");
  if (!toggle || !canvas || !code) return;
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

// -------------------- LOGIN / SYNC HELPERS --------------------
// -------------------- LOGIN / SYNC HELPERS --------------------

// Match OpenCS convention: check via /api/person/get instead of cookies
async function isUserLoggedIn() {
  const { javaURI, fetchOptions } = await getApiConfig();
  try {
    const response = await fetch(`${javaURI}/api/person/get`, fetchOptions);
    if (!response.ok) {
      throw new Error(`Spring server response: ${response.status}`);
    }
    return true;
  } catch (err) {
    console.warn("User not authenticated:", err);
    return false;
  }
}

function showLoginMessage(feature) {
  const message = document.createElement("div");
  message.className = "login-popup";
  message.style.position = "fixed";
  message.style.top = "20px";
  message.style.left = "50%";
  message.style.transform = "translateX(-50%)";
  message.style.background = "#f44336";
  message.style.color = "white";
  message.style.padding = "1rem";
  message.style.borderRadius = "8px";
  message.style.zIndex = "9999";
  message.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  message.innerHTML = `
    🔒 Please log in to save your ${feature} progress
    <a href="/login" style="color:white; margin-left:1rem; text-decoration:underline;">Go to Login</a>
  `;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 4000);
}


async function syncLessonProgress() {
  const loggedIn = await isUserLoggedIn();
  if (!loggedIn || !window.lessonProgress) {
    console.log("Skipping sync — user not logged in.");
    return;
  }

  try {
    const { javaURI, fetchOptions } = await getApiConfig();
    const lessonKey = window.lessonProgress.lessonKey;
    const URL = `${javaURI}/api/lesson-progress/${lessonKey}`;

    // Fetch existing record (backend ensures it exists)
    const getRes = await fetch(URL, { ...fetchOptions, credentials: 'include' });
    if (!getRes.ok) throw new Error(`GET failed ${getRes.status}`);
    const progress = await getRes.json();

    // Merge fields
    progress.totalTimeMs = window.lessonProgress.totalTimeMs || 0;
    progress.lastVisited = new Date().toISOString();
    progress.badges = window.lessonProgress.badges || [];
    progress.reflectionText = window.lessonProgress.reflectionText || "";
    progress.currentFlashcardIndex = window.flashcardsData?.currentIndex || 1;

    // Completion logic
    const hasReflection = progress.reflectionText.trim().length > 0;
    const hasTime = progress.totalTimeMs > 30000;
    const hasFlash = (window.flashcardsData?.knownCards?.length || 0) > 0;
    progress.completed = hasReflection && hasTime && hasFlash;

    // Update backend
    const putRes = await fetch(`${javaURI}/api/lesson-progress/${progress.id}`, {
      ...fetchOptions,
      method: 'PUT',
      headers: { ...fetchOptions.headers, 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(progress)
    });

    if (!putRes.ok) throw new Error(`PUT failed ${putRes.status}`);
    console.log("✅ Lesson progress synced");
  } catch (err) {
    console.warn("Lesson progress sync failed:", err);
  }
}
