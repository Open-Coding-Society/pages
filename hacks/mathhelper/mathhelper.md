---
layout: post
title: Math Helper! 
author: Yash Parikh, Mihir Bapat, Ansh Kumar
permalink: /mathhelper
breadcrumb: True
---


<div class="quiz-container">
  <h1>Math Quiz Challenge</h1>

  <div class="user-form">
    <label for="username">Enter your name: </label>
    <input type="text" id="username" placeholder="Your name" required>
  </div>

  <div id="quiz-section" style="display: none;">
    <div class="question-section">
      <div class="question" id="question">Question will appear here</div>
      <input type="number" id="answer-input" class="answer-input" placeholder="Your answer">
      <button id="submit-answer" class="submit-btn">Submit Answer</button>
    </div>

    <div class="score-display">
      Score: <span id="current-score">0</span> / <span id="total-questions">10</span>
    </div>

    <div id="message"></div>
  </div>

  <button id="start-quiz" class="submit-btn">Start Quiz</button>

  <div class="leaderboard">
    <h2>Top Scores</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody id="leaderboard-body">
        <!-- Leaderboard data will be populated here -->
      </tbody>
    </table>
  </div>
</div>

<script type="module">
  import { javaURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  // Quiz state
  let currentQuestion = 0;
  let score = 0;
  let totalQuestions = 10;
  let questions = [];

  // API URLs
  const baseURL = `${javaURI}/api/quiz`;
  const scoreURL = `${baseURL}/score`;
  const topScoresURL = `${baseURL}/top?limit=10`;

  // DOM elements
  const usernameInput = document.getElementById('username');
  const startQuizBtn = document.getElementById('start-quiz');
  const quizSection = document.getElementById('quiz-section');
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answer-input');
  const submitAnswerBtn = document.getElementById('submit-answer');
  const currentScoreElement = document.getElementById('current-score');
  const totalQuestionsElement = document.getElementById('total-questions');
  const messageElement = document.getElementById('message');
  const leaderboardBody = document.getElementById('leaderboard-body');

  // Generate random math questions
  function generateQuestions() {
    questions = [];
    for (let i = 0; i < totalQuestions; i++) {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const operators = ['+', '-', '*'];
      const operator = operators[Math.floor(Math.random() * operators.length)];

      let answer;
      switch(operator) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          answer = num1 - num2;
          break;
        case '*':
          answer = num1 * num2;
          break;
      }

      questions.push({
        question: `${num1} ${operator} ${num2} = ?`,
        answer: answer
      });
    }
  }

  // Display current question
  function displayQuestion() {
    if (currentQuestion < totalQuestions) {
      questionElement.textContent = `Question ${currentQuestion + 1}: ${questions[currentQuestion].question}`;
      answerInput.value = '';
      answerInput.focus();
    } else {
      endQuiz();
    }
  }

  // Start quiz
  startQuizBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) {
      showMessage('Please enter your name!', 'error');
      return;
    }

    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    generateQuestions();

    // Update UI
    startQuizBtn.style.display = 'none';
    quizSection.style.display = 'block';
    usernameInput.disabled = true;
    currentScoreElement.textContent = score;
    totalQuestionsElement.textContent = totalQuestions;
    messageElement.innerHTML = '';

    displayQuestion();
  });

  // Submit answer
  submitAnswerBtn.addEventListener('click', checkAnswer);
  answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = questions[currentQuestion].answer;

    if (isNaN(userAnswer)) {
      showMessage('Please enter a valid number!', 'error');
      return;
    }

    if (userAnswer === correctAnswer) {
      score++;
      currentScoreElement.textContent = score;
      showMessage('Correct!', 'success');
    } else {
      showMessage(`Wrong! The correct answer was ${correctAnswer}`, 'error');
    }

    currentQuestion++;

    setTimeout(() => {
      if (currentQuestion < totalQuestions) {
        displayQuestion();
        messageElement.innerHTML = '';
      } else {
        endQuiz();
      }
    }, 1000);
  }

  // End quiz and save score
  function endQuiz() {
    quizSection.style.display = 'none';

    const username = usernameInput.value.trim();
    const finalScore = score;

    showMessage(`Quiz Complete! Your score: ${finalScore}/${totalQuestions}`, 'success');

    // Save score to backend
    const postOptions = {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({
        username: username,
        score: finalScore
      })
    };

    fetch(scoreURL, postOptions)
      .then(response => {
        if (response.status !== 201) {
          console.error('Failed to save score: ' + response.status);
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          console.log('Score saved:', data);
          showMessage(`Score saved! You scored ${finalScore}/${totalQuestions}`, 'success');
          // Refresh leaderboard
          loadLeaderboard();
        }
      })
      .catch(err => {
        console.error('Error saving score:', err);
        showMessage('Failed to save score to server', 'error');
      });

    // Reset for new quiz
    setTimeout(() => {
      startQuizBtn.style.display = 'block';
      usernameInput.disabled = false;
    }, 2000);
  }

  // Load leaderboard
  function loadLeaderboard() {
    fetch(topScoresURL, fetchOptions)
      .then(response => {
        if (response.status !== 200) {
          console.error('Failed to load leaderboard: ' + response.status);
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          displayLeaderboard(data);
        }
      })
      .catch(err => {
        console.error('Error loading leaderboard:', err);
        leaderboardBody.innerHTML = '<tr><td colspan="3">Failed to load leaderboard</td></tr>';
      });
  }

  // Display leaderboard data
  function displayLeaderboard(scores) {
    leaderboardBody.innerHTML = '';

    if (scores.length === 0) {
      leaderboardBody.innerHTML = '<tr><td colspan="3">No scores yet. Be the first!</td></tr>';
      return;
    }

    scores.forEach((score, index) => {
      const tr = document.createElement('tr');

      const rankTd = document.createElement('td');
      rankTd.textContent = index + 1;

      const usernameTd = document.createElement('td');
      usernameTd.textContent = score.username;

      const scoreTd = document.createElement('td');
      scoreTd.textContent = score.score;

      tr.appendChild(rankTd);
      tr.appendChild(usernameTd);
      tr.appendChild(scoreTd);

      leaderboardBody.appendChild(tr);
    });
  }

  // Show message helper
  function showMessage(msg, type) {
    messageElement.className = type === 'error' ? 'error-msg' : 'success-msg';
    messageElement.textContent = msg;
  }

  // Load leaderboard on page load
  loadLeaderboard();
</script>
