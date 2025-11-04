---
layout: post
title: "Final Sequence — The Vault"
description: "Unlock the Sacred Vault — Finish the quiz, assemble the three code fragments, authenticate, and retrieve the Sacred Page."
permalink: /digital-famine/cybersecurity-game/vault-quiz
categories: [CSP, Submodule, Vault]
tags: [vault, final, mission, security]
author: Arnav Pallapotu, Sathwik Kintada
date: 2025-10-26
microblog: True
breadcrumb: True
footer:
  previous: /digital-famine/cybersecurity-game/mission-3-lesson/
  home: /digital-famine/cybersecurity-game
---
<style>
.quiz-container {
  max-width: 700px;
  margin: auto;
  background: #0b0f19;
  padding: 20px;
  border-radius: 15px;
  color: white;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 0 20px rgba(0, 255, 150, 0.4);
}
.question {
  font-size: 1.2em;
  margin-bottom: 20px;
}
.options button {
  display: block; 
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background-color: #1c2333;
  color: white;
  font-size: 1em;
  transition: 0.2s;
}
.options button:hover {
  background-color: #2b3247;
  cursor: pointer;
}
.feedback {
  margin-top: 15px;
  font-size: 1em;
  padding: 10px;
  border-radius: 8px;
}
.correct {
  background: #145a32;
}
.wrong {
  background: #641e16;
}
.next-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #00ff99;
  color: black;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}
.progress {
  margin-bottom: 15px;
  text-align: center;
  color: #00ff99;
}
.retry-btn {
  background: #ff4444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
}
.retry-btn:hover {
  background: #ff6666;
}
.hint {
  background: rgba(0, 255, 150, 0.1);
  color: #00ff99;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
.progress-bar-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: 20px;
  margin-bottom: 25px;
  box-shadow: 0 0 10px rgba(0, 255, 153, 0.2);
}

.progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #00ff99, #00cc66);
  box-shadow: 0 0 12px #00ff99;
  transition: width 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  background: linear-gradient(90deg, #00ff99, #00cc66);
}

</style>

<div class="progress-bar-container">
  <div class="progress-bar" id="progress-bar"></div>
</div>

<div class="quiz-container">
  <h1>Cybersecurity Quiz</h1>
  <div class="progress" id="progress"></div>
  <div id="quiz-content">
    <div class="question" id="question"></div>
    <div class="options" id="options"></div>
    <div id="feedback" class="feedback"></div>
    <button class="next-btn" id="next-btn" style="display:none;">Next Question</button>
  </div>
</div>

<div style="text-align:center; margin-top:20px;">
  <button id="reset-quiz" class="retry-btn">🔁 Restart & Reshuffle Quiz</button>
</div>

<script>
const questions = [
  // Mission 1
  {question:"What is a database schema?",options:["The actual data stored in tables","A blueprint defining table structure, columns, and constraints","A backup file of the database","The SQL queries used to retrieve data"],correct:1,hint:"Think about blueprints and architectural plans.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},
  {question:"Which constraint uniquely identifies each record in a table?",options:["NOT NULL","PRIMARY KEY","UNIQUE","FOREIGN KEY"],correct:1,hint:"Every table needs one to identify rows.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},
  {question:"What does a FOREIGN KEY do in the earth_base.db?",options:["Encrypts sensitive data","Links two tables by referencing another table's PRIMARY KEY","Makes queries run faster","Prevents duplicate entries"],correct:1,hint:"Think about the verified_by column connecting Agents to Alien_Sightings.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/mission-1-lesson/"},
  {question:"Which SQL statement adds new agents to the database?",options:["CREATE TABLE Agents","INSERT INTO Agents","UPDATE Agents","SELECT FROM Agents"],correct:1,hint:"You're putting new data INTO the table.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},
  {question:"What happens if you delete an agent who verified alien sightings?",options:["Everything deletes automatically","The database prevents deletion to maintain integrity","The agent deletes but sightings remain unchanged","All sightings become unverified"],correct:1,hint:"Consider referential integrity and orphaned records.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},
  {question:"Which data type stores clearance_level values (1-10)?",options:["TEXT","REAL","INTEGER","BLOB"],correct:2,hint:"These are whole numbers, not decimals or text.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},
  {question:"What does CHECK(threat_level >= 1 AND threat_level <= 5) do?",options:["Checks for database corruption","Validates data meets conditions before insertion","Checks for duplicate values","Automatically fixes invalid data"],correct:1,hint:"This enforces business rules on data values.",mission:1,lessonUrl:"/digital-famine/cybersecurity-game/submodule_1"},

  // Mission 2
  {question:"What is SQL Injection?",options:["A method to speed up queries","A vulnerability where attackers insert malicious SQL into inputs","A database backup technique","A tool for debugging SQL"],correct:1,hint:"Malicious code inserted through user input fields.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"Which login input could be a SQL injection attempt?",options:["username: 'john_doe'","username: 'admin' OR '1'='1'","username: 'user@email.com'","username: 'agent_007'"],correct:1,hint:"Look for SQL operators like OR and quotes.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"What's the best defense against SQL injection?",options:["Using longer passwords","Using parameterized queries with placeholders","Encrypting the database","Limiting login attempts"],correct:1,hint:"Separate SQL code from user data using placeholders.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"Why is string concatenation vulnerable?",options:["It uses SELECT statement","User input is directly concatenated into the SQL string","It doesn't check clearance levels","The table name is incorrect"],correct:1,hint:"When you use + to combine user input with SQL queries.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"Which payload could expose ALL agent records?",options:["' OR 1=1 --","DELETE FROM Agents","CREATE TABLE hacked","UPDATE Agents SET clearance=10"],correct:0,hint:"Make the WHERE clause always true, then comment out the rest.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"What does input validation prevent?",options:["Slow queries","Malicious data from being processed by the system","Users from creating accounts","Database backups from failing"],correct:1,hint:"Checking data format before processing.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/submodule_2"},
  {question:"In SQL injection attacks, what does '--' do?",options:["Subtracts two numbers","Starts a comment, ignoring everything after it","Creates a new table","Encrypts the query"],correct:1,hint:"Everything after this symbol is ignored.",mission:2,lessonUrl:"/digital-famine/cybersecurity-game/mission-2-lesson/"},

  // Mission 3
  {question:"What's the difference between hashing and encryption?",options:["Hashing is faster than encryption","Hashing is one-way (irreversible), encryption is two-way (reversible)","Hashing works on text, encryption on numbers","There's no difference"],correct:1,hint:"Can you reverse the process or not?",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/submodule_3"},
  {question:"How many characters is a SHA-256 hash output?",options:["32 hexadecimal characters","64 hexadecimal characters","128 hexadecimal characters","Varies based on input length"],correct:1,hint:"It's always the same length - 256 bits = 64 hex characters.",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/submodule_3"},
  {question:"What is the 'avalanche effect' in SHA-256?",options:["Hashing multiple launch codes simultaneously","A tiny change in input creates a completely different hash","The hash gets longer as input increases","Multiple inputs produce the same hash"],correct:1,hint:"Change one letter, get a completely different result.",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/submodule_3"},
  {question:"Why hash launch codes instead of storing them in plaintext?",options:["To save storage space","To make verification faster","So aliens can't read codes even if they breach the database","Because it's required by defense protocols"],correct:2,hint:"Protection if the database is breached.",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/submodule_3"},
  {question:"If you hash 'ALPHA-001' today and tomorrow, will the hashes match?",options:["No - hashes change daily","Yes - hashing is deterministic (same input = same output)","Only if using the same computer","Depends on the time of day"],correct:1,hint:"Is hashing deterministic or random?",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/submodule_3"},
  {question:"What is 'salt' in password hashing?",options:["A secret decryption key","Random data added to passwords before hashing to prevent rainbow table attacks","A specific type of hashing algorithm","A compression method for long passwords"],correct:1,hint:"Random data added to defeat pre-computed hash tables.",mission:3,lessonUrl:"/digital-famine/cybersecurity-game/mission-3-lesson/"}
];
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function prepareShuffledQuestions() {
  // Group by mission
  const missions = [1, 2, 3];
  let shuffledAll = [];

  missions.forEach(missionNum => {
    let missionQs = questions.filter(q => q.mission === missionNum);
    missionQs = shuffleArray(missionQs);

    // Shuffle options for each question
    missionQs.forEach(q => {
      const optionIndexes = q.options.map((_, idx) => idx);
      const shuffledIndexes = shuffleArray(optionIndexes);
      const shuffledOpts = shuffledIndexes.map(i => q.options[i]);
      const newCorrect = shuffledIndexes.indexOf(q.correct);
      q.options = shuffledOpts;
      q.correct = newCorrect;
    });

    shuffledAll = shuffledAll.concat(missionQs);
  });

  return shuffledAll;
}

// Load or initialize shuffled question order
let shuffledQuestions = JSON.parse(localStorage.getItem('vaultQuizQuestions'));

if (!shuffledQuestions) {
  shuffledQuestions = prepareShuffledQuestions();
  localStorage.setItem('vaultQuizQuestions', JSON.stringify(shuffledQuestions));
}

let currentQuestion = 0;
let score = 0;
let retryMode = false;

function saveProgress() {
  const progress = {
    currentQuestion,
    score,
    retryMode
  };
  localStorage.setItem('vaultQuizProgress', JSON.stringify(progress));
  localStorage.setItem('vaultQuizQuestions', JSON.stringify(shuffledQuestions));

}

function loadProgress() {
  const saved = JSON.parse(localStorage.getItem('vaultQuizProgress'));
  if (saved) {
    currentQuestion = saved.currentQuestion || 0;
    score = saved.score || 0;
    retryMode = saved.retryMode || false;
  }
}

function clearProgress() {
  localStorage.removeItem('vaultQuizProgress');
}

function showQuestion() {
  const q = shuffledQuestions[currentQuestion];
  document.getElementById("progress").textContent = `Question ${currentQuestion + 1} of ${questions.length} | Score: ${score}`;
  document.getElementById("question").textContent = q.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("feedback").innerHTML = "";
  document.getElementById("next-btn").style.display = "none";
  
  updateProgressBar();

}

function checkAnswer(selected) {
  const q = shuffledQuestions[currentQuestion];
  const feedback = document.getElementById("feedback");

  if (selected === q.correct) {
    feedback.textContent = "✅ Correct!";
    feedback.className = "feedback correct";
    if (!retryMode) score += 5;
    document.getElementById("next-btn").style.display = "inline-block";
  } else {
    if (!retryMode) {
      retryMode = true;
      feedback.innerHTML = `❌ Incorrect. Try again!<div class="hint">💡 Hint: ${q.hint}</div><p>Lesson reference: <a href="${q.lessonUrl}" style="color:#00ff99;">Go to Lesson</a></p>`;
      feedback.className = "feedback wrong";
    } else {
      feedback.innerHTML = `❌ Still incorrect. Review the material: <a href="${q.lessonUrl}" style="color:#00ff99;">Go to Lesson</a>`;
      feedback.className = "feedback wrong";
      document.getElementById("next-btn").style.display = "inline-block";
    }
  }
  saveProgress();

}

document.getElementById("next-btn").onclick = () => {
  retryMode = false;
  currentQuestion++;
  saveProgress();
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
};

function updateProgressBar() {
  const percent = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}


function finishQuiz() {
  const percent = (score / (questions.length * 5)) * 100;
  const quizContent = document.getElementById("quiz-content");
  if (percent >= 80) {
    quizContent.innerHTML = `<h2>🎉 Quiz Complete! Score: ${percent}%</h2><p>Great job, Agent! You’ve unlocked the Vault.</p><a href="/digital-famine/cybersecurity-game/vault/final-vault/" class="next-btn">Enter the Vault</a>`;
  } else {
    quizContent.innerHTML = `<h2>❌ Score: ${percent}%</h2><p>You need at least 80% to unlock the Vault.</p><button class="retry-btn" onclick="restartQuiz()">Retry Quiz</button>`;
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  retryMode = false;

  // Restore original quiz HTML
  document.getElementById("quiz-content").innerHTML = `
    <div class="question" id="question"></div>
    <div class="options" id="options"></div>
    <div id="feedback" class="feedback"></div>
    <button class="next-btn" id="next-btn" style="display:none;">Next Question</button>
  `;

  // Reattach event listener for Next button
  document.getElementById("next-btn").onclick = () => {
    retryMode = false;
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  };

  showQuestion();
}

document.getElementById("reset-quiz").addEventListener("click", () => {
  // Clear all saved progress and reshuffle
  localStorage.removeItem('vaultQuizProgress');
  localStorage.removeItem('vaultQuizQuestions');
  alert("Quiz progress cleared and questions reshuffled!");
  location.reload(); // Reload the page to start fresh
});


loadProgress();

// If user already finished all questions, show results immediately
if (currentQuestion >= questions.length) {
  finishQuiz();
} else {
  showQuestion();
}


</script>
