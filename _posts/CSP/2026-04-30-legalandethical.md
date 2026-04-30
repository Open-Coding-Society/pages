---
layout: opencs
title: IP & Ethics Review
description: AP CSP legal and ethical computing review
permalink: /legal_ethics/
---

# IP & Ethics Review

<style>
  :root {
    --ip-bg: #f4efe4;
    --ip-paper: #fffdf8;
    --ip-ink: #1d2428;
    --ip-muted: #505d66;
    --ip-accent: #b84f3a;
    --ip-accent-2: #2f6b62;
    --ip-line: #d7cab6;
    --ip-good: #1f8a56;
    --ip-bad: #b83d3d;
  }

  .ip-wrap {
    max-width: 1020px;
    margin: 1.2rem auto 0;
    padding: 0.75rem;
    color: var(--ip-ink);
  }

  .ip-hero {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--ip-line);
    border-radius: 20px;
    padding: 1.2rem;
    background:
      radial-gradient(circle at 10% 0%, #f5dcc4 0%, transparent 35%),
      radial-gradient(circle at 85% 100%, #d8eee7 0%, transparent 42%),
      linear-gradient(140deg, #fffcf6, #f6efe2 70%);
    box-shadow: 0 18px 38px rgba(36, 29, 10, 0.1);
    margin-bottom: 1rem;
  }

  .ip-kicker {
    display: inline-block;
    margin: 0 0 0.55rem;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    border: 1px solid #d8baa9;
    color: #7d3121;
    font-size: 0.76rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: 700;
    background: #fff5ee;
  }

  .ip-hero h2 {
    margin: 0;
    font-size: clamp(1.35rem, 2.8vw, 2rem);
    line-height: 1.2;
    color: #000000 !important;
  }

  .ip-hero p {
    margin: 0.65rem 0 0;
    color: #2d2222 !important;
    max-width: 68ch;
    line-height: 1.5;
  }

  .ip-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .ip-panel {
    background: var(--ip-paper);
    border: 1px solid var(--ip-line);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: 0 8px 20px rgba(22, 22, 17, 0.04);
  }

  .ip-panel h3 {
    margin: 0 0 0.6rem;
    font-size: 1.04rem;
    line-height: 1.3;
    color: #000000 !important;
  }

  .ip-panel ul {
    margin: 0;
    padding-left: 1.1rem;
    color: #000000 !important;
  }

  .ip-panel li {
    margin-bottom: 0.42rem;
    line-height: 1.45;
    color: #000000 !important;
  }

  .concerns-bottom {
    margin-top: 0.9rem;
    background: #f9f5ea;
  }

  .ip-divider {
    margin: 1.5rem 0 1rem;
    border: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c8b79f, transparent);
  }

  .interactive-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .interactive-card {
    background: #fff;
    border: 1px solid var(--ip-line);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: 0 10px 24px rgba(38, 22, 14, 0.06);
  }

  .interactive-card h3 {
    margin: 0 0 0.55rem;
    color: #342713;
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
    color: #4e5e67;
    font-size: 0.92rem;
  }

  .bar {
    height: 10px;
    background: #e8dfd0;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 0.85rem;
  }

  .bar > div {
    height: 100%;
    transition: width 0.28s ease;
    border-radius: 999px;
  }

  #quiz-progress {
    background: linear-gradient(90deg, #b84f3a, #d67546);
  }

  #sprint-timer-bar {
    background: linear-gradient(90deg, #2f6b62, #4a9185);
  }

  .options-grid {
    display: grid;
    gap: 0.55rem;
  }

  .choice-btn,
  .action-btn,
  .tag-btn {
    border-radius: 10px;
    border: 1px solid #cfbfaa;
    background: #fffdf9;
    color: #2f3d45;
    padding: 0.64rem 0.74rem;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    font: inherit;
  }

  .choice-btn {
    text-align: left;
  }

  .choice-btn:hover,
  .action-btn:hover,
  .tag-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(29, 25, 15, 0.09);
    background: #fffbf3;
  }

  .tag-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    margin-top: 0.7rem;
  }

  .feedback {
    margin: 0.8rem 0 0;
    min-height: 1.25rem;
    color: #40525d;
  }

  .result {
    display: none;
    margin-top: 0.9rem;
    border-radius: 10px;
    padding: 0.8rem;
    font-weight: 600;
  }

  .result.good {
    display: block;
    background: #e6f7ee;
    color: #18633f;
    border: 1px solid #b7e2cb;
  }

  .result.warn {
    display: block;
    background: #fff0f0;
    color: #873333;
    border: 1px solid #efcaca;
  }

  .sprint-statement {
    margin: 0;
    padding: 0.8rem;
    border-radius: 10px;
    border: 1px dashed #cab293;
    background: #fffaf2;
    line-height: 1.42;
    color: #2c3a41 !important;
    font-weight: 600;
    min-height: 64px;
  }

  .sprint-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.8rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .subtle {
    color: #5f6e78;
    font-size: 0.9rem;
  }

  @media (max-width: 840px) {
    .interactive-grid,
    .ip-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="ip-wrap">
  <section class="ip-hero">
    <span class="ip-kicker">AP CSP Review Zone</span>
    <h2>Legal and Ethical Computing</h2>
  </section>

  <div class="ip-grid">
    <section class="ip-panel">
      <h3>Intellectual Property (IP)</h3>
      <ul>
        <li>A work or invention that is the result of creativity to which one has rights.</li>
        <li>Can be saved on the computer, making it faster and easier to access and distribute.</li>
        <li>Raises concerns about ownership and whether someone is allowed to use someone else's creations.</li>
      </ul>
    </section>

    <section class="ip-panel">
      <h3>Copyright</h3>
      <ul>
        <li>Protects IP and prevents anyone from using it unless they have permission.</li>
      </ul>
    </section>

    <section class="ip-panel">
      <h3>Legal Ways to Use Materials Created by Someone Else</h3>
      <ul>
        <li><strong>Creative Commons</strong>: Provides free licenses that allow creators to specify how others may use their creation and clearly tells users what to do and not do with the IP.</li>
        <li><strong>Open Source</strong>: Programs that are freely available for anyone to use and can be redistributed or modified by others.</li>
        <li><strong>Open Access</strong>: Online research output free of restrictions on access and many restrictions on use.</li>
      </ul>
    </section>

    <section class="ip-panel">
      <h3>Plagiarism</h3>
      <ul>
        <li>Using work that is not one's own and presenting it as one's own.</li>
      </ul>
    </section>

  </div>

  <section class="ip-panel concerns-bottom">
    <h3>Legal and Ethical Concerns</h3>
    <ul>
      <li>Broad access to digital information has been made easier through technology.</li>
      <li>Open source programs may be created with good intentions (free, modifiable) but can be used to harm others.</li>
      <li>Software that allows downloads and access, plus devices that collect and analyze data, create concerns about monitoring individual activities.</li>
      <li>Software including algorithms could have built-in bias.</li>
      <li><strong>Digital Divide</strong>: unequal distribution of access to technology. Not everyone has equal access to or understanding of how to use the internet and technologies, and access to free resources does not mean equal access for everyone.</li>
    </ul>
  </section>
</div>

<hr class="ip-divider" />

<div class="interactive-grid">
  <section id="ip-ethics-quiz" class="interactive-card">
    <h3>Quick Check: 5-Question Progression</h3>
    <div class="status-row">
      <span id="quiz-step">Question 1 of 5</span>
      <span class="subtle">Checkpoint mode</span>
    </div>

    <div class="bar">
      <div id="quiz-progress" style="width:20%;"></div>
    </div>

    <p id="quiz-question" class="sprint-statement"></p>
    <div id="quiz-options" class="options-grid"></div>

    <p id="quiz-feedback" class="feedback"></p>
    <div class="sprint-footer">
      <span class="subtle">Answer to continue.</span>
      <button id="quiz-next" type="button" class="action-btn" disabled>Next</button>
    </div>
    <div id="quiz-result" class="result"></div>
  </section>

  <section id="ethics-sprint" class="interactive-card">
    <h3>Game: Ethics Sprint (60s)</h3>
    <div class="status-row">
      <span id="sprint-timer">Time: 60s</span>
      <span id="sprint-score">Score: 0</span>
    </div>

    <div class="bar">
      <div id="sprint-timer-bar" style="width:100%;"></div>
    </div>

    <p id="sprint-statement" class="sprint-statement">Press Start to begin the scenario sprint.</p>

    <div class="tag-row" id="sprint-tags">
      <button type="button" class="tag-btn" data-tag="Legal">Legal</button>
      <button type="button" class="tag-btn" data-tag="Ethical">Ethical</button>
      <button type="button" class="tag-btn" data-tag="Both">Both</button>
      <button type="button" class="tag-btn" data-tag="Neither">Neither</button>
    </div>

    <p id="sprint-feedback" class="feedback"></p>

    <div class="sprint-footer">
      <button id="sprint-start" type="button" class="action-btn">Start Game</button>
      <span id="sprint-best" class="subtle">Best: 0</span>
    </div>
    <div id="sprint-result" class="result"></div>
  </section>
</div>

<script>
  (function () {
    const quizQuestions = [
      {
        q: "What does copyright primarily do?",
        options: [
          "Makes all work free to copy",
          "Protects intellectual property from unauthorized use",
          "Only applies to physical books",
          "Removes the need for attribution"
        ],
        answer: 1
      },
      {
        q: "Which option is a legal way to use someone else's creative work?",
        options: [
          "Copying it without credit",
          "Using a Creative Commons licensed version under its terms",
          "Claiming it as your own",
          "Ignoring license restrictions"
        ],
        answer: 1
      },
      {
        q: "Plagiarism is best described as:",
        options: [
          "Learning from examples",
          "Reusing your own old work",
          "Presenting someone else's work as your own",
          "Asking permission before use"
        ],
        answer: 2
      },
      {
        q: "What is one ethical concern with algorithms?",
        options: [
          "They always remove bias",
          "They can include built-in bias",
          "They cannot make decisions",
          "They only work offline"
        ],
        answer: 1
      },
      {
        q: "The digital divide refers to:",
        options: [
          "A split between hardware brands",
          "Unequal access to technology and internet resources",
          "Different coding languages",
          "A gap between legal and illegal downloads"
        ],
        answer: 1
      }
    ];

    const questionEl = document.getElementById("quiz-question");
    const optionsEl = document.getElementById("quiz-options");
    const feedbackEl = document.getElementById("quiz-feedback");
    const resultEl = document.getElementById("quiz-result");
    const nextBtn = document.getElementById("quiz-next");
    const stepEl = document.getElementById("quiz-step");
    const progressEl = document.getElementById("quiz-progress");

    if (!questionEl || !optionsEl || !feedbackEl || !resultEl || !nextBtn || !stepEl || !progressEl) {
      return;
    }

    let index = 0;
    let score = 0;
    let answered = false;

    function renderQuestion() {
      const item = quizQuestions[index];
      answered = false;
      nextBtn.disabled = true;
      feedbackEl.textContent = "";
      resultEl.className = "result";
      resultEl.textContent = "";

      stepEl.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
      progressEl.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
      questionEl.textContent = item.q;

      optionsEl.innerHTML = "";
      item.options.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = choice;
        btn.className = "choice-btn";

        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;

          const isCorrect = i === item.answer;
          if (isCorrect) {
            score += 1;
            btn.style.background = "#e2f6eb";
            btn.style.borderColor = "#1f8a56";
            feedbackEl.textContent = "Correct.";
          } else {
            btn.style.background = "#ffeded";
            btn.style.borderColor = "#b83d3d";
            feedbackEl.textContent = `Not quite. Correct answer: ${item.options[item.answer]}`;
          }

          Array.from(optionsEl.children).forEach((child, childIndex) => {
            child.disabled = true;
            if (childIndex === item.answer) {
              child.style.background = "#e2f6eb";
              child.style.borderColor = "#1f8a56";
            }
          });

          nextBtn.disabled = false;
          nextBtn.textContent = index === quizQuestions.length - 1 ? "Finish" : "Next";
        });

        optionsEl.appendChild(btn);
      });
    }

    nextBtn.addEventListener("click", () => {
      if (index < quizQuestions.length - 1) {
        index += 1;
        renderQuestion();
        return;
      }

      questionEl.textContent = "Quiz complete.";
      optionsEl.innerHTML = "";
      feedbackEl.textContent = "";
      nextBtn.style.display = "none";
      stepEl.textContent = "Done";
      progressEl.style.width = "100%";

      const percent = Math.round((score / quizQuestions.length) * 100);
      resultEl.className = percent >= 80 ? "result good" : "result warn";
      resultEl.textContent = `You scored ${score}/${quizQuestions.length} (${percent}%).`;
    });

    renderQuestion();
  })();
</script>

<script>
  (function () {
    const statements = [
      {
        text: "You use an image from the web in your project without permission or attribution.",
        tag: "Legal"
      },
      {
        text: "A recommendation algorithm consistently disadvantages one group because of biased training data.",
        tag: "Ethical"
      },
      {
        text: "You release your code under an open-source license and include the required license file.",
        tag: "Both"
      },
      {
        text: "A student writes notes in their own words after reading a textbook chapter.",
        tag: "Neither"
      },
      {
        text: "An app tracks location in the background without clearly informing users.",
        tag: "Ethical"
      },
      {
        text: "You copy text from a classmate's work and submit it as your own.",
        tag: "Both"
      },
      {
        text: "You remix a song labeled Creative Commons BY and credit the creator.",
        tag: "Legal"
      },
      {
        text: "A company provides free internet hotspots to reduce unequal access.",
        tag: "Ethical"
      }
    ];

    const timerEl = document.getElementById("sprint-timer");
    const scoreEl = document.getElementById("sprint-score");
    const statementEl = document.getElementById("sprint-statement");
    const feedbackEl = document.getElementById("sprint-feedback");
    const bestEl = document.getElementById("sprint-best");
    const resultEl = document.getElementById("sprint-result");
    const startBtn = document.getElementById("sprint-start");
    const timerBar = document.getElementById("sprint-timer-bar");
    const tagsWrap = document.getElementById("sprint-tags");

    if (!timerEl || !scoreEl || !statementEl || !feedbackEl || !bestEl || !resultEl || !startBtn || !timerBar || !tagsWrap) {
      return;
    }

    const tagButtons = Array.from(tagsWrap.querySelectorAll("button[data-tag]"));
    const gameTime = 60;
    let current = null;
    let score = 0;
    let secondsLeft = gameTime;
    let loop = null;
    let running = false;

    const storedBest = Number(localStorage.getItem("ethicsSprintBest") || 0);
    let best = Number.isFinite(storedBest) ? storedBest : 0;
    bestEl.textContent = `Best: ${best}`;

    function pickRandomStatement() {
      current = statements[Math.floor(Math.random() * statements.length)];
      statementEl.textContent = current.text;
    }

    function updateTimerUI() {
      timerEl.textContent = `Time: ${secondsLeft}s`;
      timerBar.style.width = `${(secondsLeft / gameTime) * 100}%`;
    }

    function endGame() {
      running = false;
      if (loop) clearInterval(loop);
      loop = null;
      tagButtons.forEach((btn) => {
        btn.disabled = true;
      });

      if (score > best) {
        best = score;
        localStorage.setItem("ethicsSprintBest", String(best));
        bestEl.textContent = `Best: ${best}`;
      }

      resultEl.className = score >= 6 ? "result good" : "result warn";
      resultEl.textContent = `Round complete. Final score: ${score}.`;
      startBtn.textContent = "Play Again";
      statementEl.textContent = "Round ended. Start again to try new scenarios.";
    }

    function startGame() {
      running = true;
      score = 0;
      secondsLeft = gameTime;
      scoreEl.textContent = "Score: 0";
      feedbackEl.textContent = "";
      resultEl.className = "result";
      resultEl.textContent = "";
      startBtn.textContent = "Running...";

      tagButtons.forEach((btn) => {
        btn.disabled = false;
      });

      pickRandomStatement();
      updateTimerUI();

      if (loop) clearInterval(loop);
      loop = setInterval(() => {
        secondsLeft -= 1;
        updateTimerUI();
        if (secondsLeft <= 0) {
          endGame();
        }
      }, 1000);
    }

    tagButtons.forEach((btn) => {
      btn.disabled = true;
      btn.addEventListener("click", () => {
        if (!running || !current) return;

        const chosen = btn.getAttribute("data-tag");
        const correct = chosen === current.tag;
        if (correct) {
          score += 1;
          feedbackEl.textContent = "Correct tag.";
          feedbackEl.style.color = "var(--ip-good)";
        } else {
          score = Math.max(0, score - 1);
          feedbackEl.textContent = `Incorrect. This one was: ${current.tag}.`;
          feedbackEl.style.color = "var(--ip-bad)";
        }

        scoreEl.textContent = `Score: ${score}`;
        pickRandomStatement();
      });
    });

    startBtn.addEventListener("click", () => {
      if (running) return;
      startGame();
    });
  })();
</script>
