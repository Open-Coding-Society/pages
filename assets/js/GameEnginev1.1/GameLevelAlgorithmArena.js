// GameLevelAlgorithmArena - Teaches sorting algorithms through interactive gameplay
// Includes: Player, Quiz Master NPC, AI Professor NPC, Leaderboard
import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import AiNpc from './essentials/AiNpc.js';

class GameLevelAlgorithmArena {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // ===== BACKGROUND =====
    const image_data_arena = {
      name: 'Algorithm Arena',
      greeting: "Welcome to the Algorithm Arena! Learn about sorting algorithms.",
      src: `${path}/images/gamify/city.png`,
      pixels: { height: 1024, width: 1024 }
    };

    // ===== PLAYER (Chill Guy) =====
    const sprite_src_player = `${path}/images/gamify/chillguy.png`;
    const PLAYER_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Player',
      greeting: "I'm ready to learn about sorting algorithms!",
      src: sprite_src_player,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 0, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
      velocity: { x: 5, y: 5 }
    };

    // ===== QUIZ STATE (closure-scoped, persists across interactions) =====
    let quizScore = 0;
    let currentQuestionIndex = 0;
    const quizQuestions = [
      {
        question: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 2
      },
      {
        question: "Which sorting algorithm divides the array in half, sorts each half, then merges?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        correctIndex: 2
      },
      {
        question: "Selection Sort works by repeatedly finding the _____ element from the unsorted portion.",
        options: ["Maximum", "Minimum", "Median", "Random"],
        correctIndex: 1
      },
      {
        question: "What is the time complexity of Merge Sort in ALL cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctIndex: 1
      },
      {
        question: "Which of these sorting algorithms is stable by default?",
        options: ["Selection Sort", "Heap Sort", "Merge Sort", "Quick Sort"],
        correctIndex: 2
      },
      {
        question: "Bubble Sort compares _____ elements and swaps them if needed.",
        options: ["Random", "Adjacent", "First and last", "Every other"],
        correctIndex: 1
      },
      {
        question: "What is the space complexity of Merge Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2
      },
      {
        question: "Which sorting algorithm has the best worst-case performance?",
        options: ["Bubble Sort - O(n²)", "Selection Sort - O(n²)", "Merge Sort - O(n log n)", "Insertion Sort - O(n²)"],
        correctIndex: 2
      },
      {
        question: "In Big-O notation, O(n²) means the runtime grows _____ with input size.",
        options: ["Linearly", "Logarithmically", "Quadratically", "Exponentially"],
        correctIndex: 2
      },
      {
        question: "What is the best-case time complexity of Bubble Sort (with early termination)?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctIndex: 0
      }
    ];

    // ===== QUIZ MASTER NPC (Robot) =====
    const sprite_src_quizmaster = `${path}/images/gamify/robot.png`;
    const sprite_data_quizmaster = {
      id: 'QuizMaster',
      greeting: "I am the Quiz Master! Press E to test your sorting knowledge!",
      src: sprite_src_quizmaster,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 100,
      pixels: { height: 316, width: 627 },
      INIT_POSITION: { x: width * 0.25, y: height * 0.3 },
      orientation: { rows: 3, columns: 6 },
      down: { row: 1, start: 0, columns: 6 },
      left: { row: 1, start: 0, columns: 6 },
      right: { row: 1, start: 0, columns: 6 },
      up: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Welcome to Algorithm Arena! I'll quiz you on sorting algorithms.",
        "Bubble Sort, Selection Sort, Merge Sort... do you know the differences?",
        "Press E near me to answer a quiz question!",
        "Each correct answer earns you 10 points!"
      ],
      reaction: function () {
        if (this.dialogueSystem) {
          this.showReactionDialogue();
        }
      },
      interact: function () {
        // Remove any existing quiz overlay
        const existing = document.getElementById('quiz-overlay');
        if (existing) existing.remove();

        // Get the next question (cycle through)
        const q = quizQuestions[currentQuestionIndex % quizQuestions.length];
        currentQuestionIndex++;

        // Build quiz overlay
        const overlay = document.createElement('div');
        overlay.id = 'quiz-overlay';
        Object.assign(overlay.style, {
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.75)', zIndex: '9999', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        });

        const panel = document.createElement('div');
        Object.assign(panel.style, {
          background: '#1a1a2e', color: '#e0e0e0', padding: '30px',
          borderRadius: '12px', maxWidth: '520px', width: '90%',
          fontFamily: 'monospace', fontSize: '16px', border: '2px solid #f5c207'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
          display: 'flex', justifyContent: 'space-between', marginBottom: '16px'
        });
        const title = document.createElement('span');
        title.textContent = `Question ${currentQuestionIndex}`;
        title.style.fontWeight = 'bold';
        title.style.fontSize = '18px';
        title.style.color = '#f5c207';
        const scoreEl = document.createElement('span');
        scoreEl.textContent = `Score: ${quizScore}`;
        scoreEl.style.color = '#2ecc71';
        scoreEl.style.fontWeight = 'bold';
        header.appendChild(title);
        header.appendChild(scoreEl);
        panel.appendChild(header);

        const questionEl = document.createElement('p');
        questionEl.textContent = q.question;
        questionEl.style.marginBottom = '16px';
        questionEl.style.lineHeight = '1.5';
        panel.appendChild(questionEl);

        let answered = false;
        q.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.textContent = opt;
          Object.assign(btn.style, {
            display: 'block', width: '100%', margin: '8px 0', padding: '12px',
            background: '#16213e', color: '#fff', border: '2px solid #334155',
            borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
            fontFamily: 'monospace', textAlign: 'left', transition: 'all 0.2s'
          });
          btn.onmouseenter = () => { if (!answered) btn.style.borderColor = '#f5c207'; };
          btn.onmouseleave = () => { if (!answered) btn.style.borderColor = '#334155'; };

          btn.addEventListener('click', () => {
            if (answered) return;
            answered = true;

            if (idx === q.correctIndex) {
              quizScore += 10;
              btn.style.background = '#166534';
              btn.style.borderColor = '#22c55e';
              btn.textContent += ' ✓ Correct! +10 pts';
              scoreEl.textContent = `Score: ${quizScore}`;

              // Submit score to leaderboard
              try {
                const lb = gameEnv.gameControl?.game?.leaderboardInstance;
                if (lb) {
                  lb.submitScore('Player', quizScore, 'AlgorithmArena');
                }
              } catch (e) {
                console.warn('Leaderboard submit failed:', e);
              }
            } else {
              btn.style.background = '#7f1d1d';
              btn.style.borderColor = '#ef4444';
              btn.textContent += ' ✗ Wrong';
              // Highlight the correct answer
              panel.querySelectorAll('.quiz-option')[q.correctIndex].style.background = '#166534';
              panel.querySelectorAll('.quiz-option')[q.correctIndex].style.borderColor = '#22c55e';
            }
            // Disable all buttons
            panel.querySelectorAll('.quiz-option').forEach(b => {
              b.style.cursor = 'default';
              b.disabled = true;
            });
            // Auto-close after delay
            setTimeout(() => overlay.remove(), 2000);
          });

          // Prevent keyboard events from propagating to game
          ['keydown', 'keyup', 'keypress'].forEach(evt => {
            btn.addEventListener(evt, e => e.stopPropagation());
          });

          btn.classList.add('quiz-option');
          panel.appendChild(btn);
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close (or click outside)';
        Object.assign(closeBtn.style, {
          marginTop: '16px', padding: '8px 20px', background: 'transparent',
          color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px',
          cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace'
        });
        closeBtn.addEventListener('click', () => overlay.remove());
        ['keydown', 'keyup', 'keypress'].forEach(evt => {
          closeBtn.addEventListener(evt, e => e.stopPropagation());
        });
        panel.appendChild(closeBtn);

        overlay.appendChild(panel);
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
      }
    };

    // ===== AI PROFESSOR NPC (Owl) =====
    const sprite_src_professor = `${path}/images/gamify/owl.png`;
    const sprite_greet_professor = "Hello! I'm Professor Ada, an AI expert in sorting algorithms and computational complexity!";
    const sprite_data_professor = {
      id: 'Professor_Ada',
      greeting: sprite_greet_professor,
      src: sprite_src_professor,
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      pixels: { height: 1068, width: 1078 },
      INIT_POSITION: { x: width * 0.65, y: height * 0.3 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

      // AI-specific properties (required for AiNpc utility)
      expertise: "sorting_algorithms",
      chatHistory: [],
      dialogues: [
        "Ask me anything about sorting algorithms!",
        "I can explain Big-O notation, time complexity, and space complexity.",
        "Want to understand why Merge Sort is O(n log n)?",
        "Curious about when to use which sorting algorithm?",
        "I love discussing the trade-offs between sorting methods!"
      ],
      knowledgeBase: {
        sorting_algorithms: [
          {
            question: "What is Bubble Sort and how does it work?",
            answer: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. It has O(n^2) worst-case time complexity."
          },
          {
            question: "How does Merge Sort work?",
            answer: "Merge Sort divides the array in half recursively until single elements remain, then merges them back in sorted order. It has O(n log n) time complexity in all cases."
          },
          {
            question: "What is Selection Sort?",
            answer: "Selection Sort finds the minimum element from the unsorted portion and puts it at the beginning. It has O(n^2) time complexity but makes fewer swaps than Bubble Sort."
          },
          {
            question: "What does Big-O notation mean?",
            answer: "Big-O notation describes the upper bound of an algorithm's growth rate. O(n^2) means the time grows quadratically with input size, while O(n log n) grows much slower."
          }
        ]
      },

      reaction: function () {
        if (this.dialogueSystem) {
          this.showReactionDialogue();
        } else {
          console.log(sprite_greet_professor);
        }
      },

      interact: function () {
        AiNpc.showInteraction(this);
      }
    };

    // ===== ASSEMBLE GAME OBJECTS =====
    this.classes = [
      { class: GameEnvBackground, data: image_data_arena },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_quizmaster },
      { class: Npc, data: sprite_data_professor },
    ];
  }
}

export default GameLevelAlgorithmArena;
