import Game from "./GameEngine/Game.js";
class Quiz {
    constructor(game = null) {
        this.game = game;
        this.isOpen = false;
        this.dim = false;
        this.currentNpc = null;
        this.currentPage = 0;
        this.injectStyles(); // Inject CSS styles dynamically
        this.answeredQuestionsByNpc = {}; 
    }

    // Inject CSS styles directly into the document
    injectStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            /* Pixelated font */
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

            /************************************************
             * EXTREME, PARTY-TIME THEME
             * Multiple waves of confetti, swirling background,
             * spinning container, and rainbow glow edges!
             ************************************************/

            /* SCROLL APPEARANCE & RAINBOW GLOW ANIMATION */
            .scroll-edge {
                position: relative;
                border: 8px solid #5c3b0b; /* Dark wood-like color */
                padding: 15px;
                background: repeating-linear-gradient(
                    45deg,
                    rgba(245, 194, 7, 0.15) 0px,
                    rgba(245, 194, 7, 0.15) 20px,
                    rgba(245, 194, 7, 0.2) 20px,
                    rgba(245, 194, 7, 0.2) 40px
                );
                border-radius: 10px;
                /* Animated rainbow border glow */
                animation: rainbowGlow 3s infinite;
                box-shadow:
                    0px 0px 20px rgba(255, 255, 255, 0.4),
                    0px 0px 50px rgba(255, 255, 255, 0.2) inset;
            }

            /* Rainbow Glow: cycles through the hue spectrum */
            @keyframes rainbowGlow {
                0% {
                    box-shadow:
                        0 0 20px hsl(0, 100%, 50%),
                        0 0 50px rgba(255, 255, 255, 0.2) inset;
                    border-color: hsl(0, 100%, 50%);
                }
                25% {
                    box-shadow:
                        0 0 20px hsl(90, 100%, 50%),
                        0 0 50px rgba(255, 255, 255, 0.2) inset;
                    border-color: hsl(90, 100%, 50%);
                }
                50% {
                    box-shadow:
                        0 0 20px hsl(180, 100%, 50%),
                        0 0 50px rgba(255, 255, 255, 0.2) inset;
                    border-color: hsl(180, 100%, 50%);
                }
                75% {
                    box-shadow:
                        0 0 20px hsl(270, 100%, 50%),
                        0 0 50px rgba(255, 255, 255, 0.2) inset;
                    border-color: hsl(270, 100%, 50%);
                }
                100% {
                    box-shadow:
                        0 0 20px hsl(360, 100%, 50%),
                        0 0 50px rgba(255, 255, 255, 0.2) inset;
                    border-color: hsl(360, 100%, 50%);
                }
            }

            /* Optional circles for "scroll corners" */
            .scroll-edge::before,
            .scroll-edge::after {
                content: '';
                position: absolute;
                width: 60px;
                height: 60px;
                background: #5c3b0b;
                border: 8px solid #5c3b0b;
                border-radius: 50%;
                box-shadow: inset 0 0 15px rgba(0,0,0,0.6);
            }
            .scroll-edge::before {
                top: -38px;
                left: -38px;
            }
            .scroll-edge::after {
                bottom: -38px;
                right: -38px;
            }

            /* QUIZ POPUP (NOW WITH SPIN) */
            .quiz-popup {
                position: fixed;
                width: 50%;
                top: 15%;
                left: 50%;
                transform: translate(-50%, 0);
                z-index: 9999;
                max-height: 70vh;
                display: flex;
                flex-direction: column;
                font-family: 'Press Start 2P', cursive;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #f5c207;
                opacity: 0;  /* Start hidden for fade/ spin in */
                animation: fadeIn 0.3s ease-in-out forwards;
            }

            /* Spin it after submission */
            .celebration-spin {
                animation: spinMe 1s ease-in-out forwards;
            }
            @keyframes spinMe {
                0% { transform: translate(-50%, 0) rotate(0deg); }
                100% { transform: translate(-50%, 0) rotate(360deg) scale(1.1); }
            }

            /* Fade-in animation for the panel */
            @keyframes fadeIn {
                to { 
                    opacity: 1; 
                }
            }

            /* SCROLLABLE QUESTION AREA WITH SWIRLING BG */
            .quiz-content {
                overflow-y: auto;
                max-height: 50vh;
                padding: 10px;
                border-radius: 5px;
                animation: swirlBG 6s linear infinite;
            }

            /* Swirl BG: moves from top-left to bottom-right in a cyclical pattern */
            @keyframes swirlBG {
                0% {
                    background: radial-gradient(circle at 0% 0%, #000000, #1a1005, #462b07);
                }
                25% {
                    background: radial-gradient(circle at 100% 0%, #100f31, #461116, #720707);
                }
                50% {
                    background: radial-gradient(circle at 100% 100%, #000000, #070640, #46116f);
                }
                75% {
                    background: radial-gradient(circle at 0% 100%, #000000, #1a1005, #462b07);
                }
                100% {
                    background: radial-gradient(circle at 0% 0%, #000000, #1a1005, #462b07);
                }
            }

            /* TABLE */
            .quiz-table {
                width: 100%;
                border-collapse: collapse;
            }
            .quiz-table th {
                background: rgba(245, 194, 7, 0.3);
                color: #ffe567;
                padding: 12px;
                text-align: left;
                font-size: 18px;
                text-shadow: 0 0 8px rgba(245, 194, 7, 0.8);
                border-bottom: 3px solid #f5c207;
            }
            .quiz-table td {
                padding: 12px;
                border-bottom: 1px solid rgba(255, 229, 103, 0.2);
                color: #ffffff;
                font-size: 16px;
            }

            /* INPUT FIELDS */
            .quiz-input {
                width: 95%;
                padding: 8px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                background: #faf2d0;
                border-radius: 5px;
                font-size: 16px;
                margin-top: 5px;
                font-family: 'Press Start 2P', cursive;
                transition: all 0.2s ease-in-out;
            }
            .quiz-input:focus {
                outline: none;
                border: 2px solid #f5c207;
                box-shadow: 0 0 8px rgba(245, 194, 7, 0.6);
                background: #fff8d0;
            }

            /* SUBMIT BUTTON */
            .quiz-submit {
                background-color: #2ecc71;
                color: #ffffff;
                border: none;
                padding: 12px 20px;
                font-size: 18px;
                cursor: pointer;
                border-radius: 5px;
                margin-top: 15px;
                transition: 0.3s ease-in-out;
                font-family: 'Press Start 2P', cursive;
                letter-spacing: 1px;
                text-transform: uppercase;
                box-shadow: 0 0 6px #2ecc71;
            }
            .quiz-submit:hover {
                background-color: #27ae60;
                box-shadow: 0 0 15px #2ecc71;
                transform: translateY(-2px);
            }

            /* DIMMED BACKGROUND (click to close) */
            #dim {
                position: fixed;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9998;
                top: 0;
                left: 0;
                cursor: pointer;
            }

            /************************************************
             * CONFETTI & STAR CONFETTI STYLES
             ************************************************/
            .confetti-piece, .star-confetti {
                position: fixed;
                top: -20px; /* start above the viewport */
                width: 10px;
                height: 10px;
                opacity: 0.8;
                z-index: 10000;
                pointer-events: none;
                animation: confettiFall linear forwards;
            }

            /* Square confetti default color */
            .confetti-piece {
                background-color: #f5c207;
            }

            /* We'll override each piece's animation-duration 
               and horizontal movement with inline styles in JS */
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100px) rotateZ(0deg);
                }
                100% {
                    transform: translateY(110vh) rotateZ(720deg);
                }
            }

            /* STAR confetti: using a star shape trick with clip-path */
            .star-confetti {
                background: none;
                clip-path: polygon(
                    50% 0%,
                    61% 35%,
                    98% 35%,
                    68% 57%,
                    79% 91%,
                    50% 70%,
                    21% 91%,
                    32% 57%,
                    2% 35%,
                    39% 35%
                );
                background-color: #ff0055;
            }
        `;
        document.head.appendChild(style);
    }

    backgroundDim = {
        create: () => {
            this.dim = true;
            const dimDiv = document.createElement("div");
            dimDiv.id = "dim";
            document.body.append(dimDiv);
            dimDiv.addEventListener("click", () => {
                this.closePanel();
            });
        },

        remove: () => {
            this.dim = false;
            const dimDiv = document.getElementById("dim");
            if (dimDiv) dimDiv.remove();
            
            // Don't directly modify isOpen here - let closePanel handle that
            const promptTitle = document.getElementById("promptTitle");
            if (promptTitle) promptTitle.style.display = "none";
            
            const promptDropDown = document.getElementById("promptDropDown");
            if (promptDropDown) {
                // Reset the position but don't remove it completely
                promptDropDown.style.opacity = "0";
                promptDropDown.classList.remove("celebration-spin");
                
                // Use setTimeout to ensure the closing animation completes
                setTimeout(() => {
                    if (this.isOpen === false) {
                        // Only reset the position if the panel is actually closed
                        promptDropDown.style.top = "0";
                        promptDropDown.style.left = "-100%";
                        promptDropDown.style.width = "0";
                    }
                }, 300);
            }
        },
    };

    createDisplayTable() {
        const table = document.createElement("table");
        table.className = "quiz-table";

        const header = document.createElement("tr");
        const th = document.createElement("th");
        th.colSpan = 2;
        th.innerText = "Answer the Questions Below:";
        header.appendChild(th);
        table.appendChild(header);

        return table;
    }

    updateTable() {
        const table = document.createElement("table");
        table.className = "quiz-table";

        // Create question row
        const questionRow = document.createElement("tr");
        const questionCell = document.createElement("td");
        questionCell.colSpan = 2;
        questionCell.innerHTML = this.currentNpc?.question || "No question available";
        questionRow.appendChild(questionCell);
        table.appendChild(questionRow);

        // Create answer input based on question type
        const answerRow = document.createElement("tr");
        const answerCell = document.createElement("td");
        answerCell.colSpan = 2;

        if (this.currentNpc?.type === "multiple-choice") {
            // Create radio buttons for multiple choice
            this.currentNpc.options.forEach((option, index) => {
                const optionDiv = document.createElement("div");
                optionDiv.style.marginBottom = "10px";
                
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "answer";
                radio.value = index;
                radio.id = `option${index}`;
                
                const label = document.createElement("label");
                label.htmlFor = `option${index}`;
                label.textContent = option;
                label.style.marginLeft = "10px";
                
                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                answerCell.appendChild(optionDiv);
            });
        } else {
            // Create text input for free response
            const input = document.createElement("input");
            input.type = "text";
            input.className = "quiz-input";
            input.placeholder = "Type your answer here...";
            answerCell.appendChild(input);
        }

        answerRow.appendChild(answerCell);
        table.appendChild(answerRow);

        // Create submit button
        const submitRow = document.createElement("tr");
        const submitCell = document.createElement("td");
        submitCell.colSpan = 2;
        submitCell.style.textAlign = "center";

        const submitButton = document.createElement("button");
        submitButton.className = "quiz-submit";
        submitButton.textContent = "Submit Answer";
        submitButton.onclick = () => this.handleSubmit();
        submitCell.appendChild(submitButton);
        submitRow.appendChild(submitCell);
        table.appendChild(submitRow);

        // Wrap the table in a container div
        const container = document.createElement("div");
        container.className = "quiz-content";
        container.appendChild(table);
        return container;
    }

    /* 
     * Confetti effect with two waves:
     * 1) Regular square confetti
     * 2) Star-shaped confetti
     */
    triggerConfetti() {
        // Some bright colors for squares
        const confettiColors = [
            "#f5c207", "#f58b07", "#f55707", 
            "#07f5ce", "#07adf5", "#a507f5", 
            "#f507b8", "#07f53b", "#ffef00", "#f50039"
        ];
        // Additional bright colors for star confetti
        const starColors = [
            "#ff00f5", "#9100ff", "#00ffe2", "#ff00c8", "#ff8400", "#ff0000"
        ];

        /* 1) SQUARE CONFETTI */
        const confettiCount1 = 40; // Adjust for more or less
        for (let i = 0; i < confettiCount1; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti-piece");
            // Randomize color
            confetti.style.backgroundColor = 
                confettiColors[Math.floor(Math.random() * confettiColors.length)];
            // Random horizontal start (0% to 100% of viewport width)
            confetti.style.left = Math.random() * 100 + "%";
            // Random falling duration between 1s and 3s
            const fallDuration = (Math.random() * 2 + 1).toFixed(2);
            confetti.style.animationDuration = fallDuration + "s";

            document.body.appendChild(confetti);

            // Remove the piece after animation ends
            setTimeout(() => {
                confetti.remove();
            }, fallDuration * 1000);
        }

        /* 2) STAR CONFETTI */
        const confettiCount2 = 20;
        setTimeout(() => {
            for (let i = 0; i < confettiCount2; i++) {
                const star = document.createElement("div");
                star.classList.add("star-confetti");
                // Random color for the star
                star.style.backgroundColor =
                    starColors[Math.floor(Math.random() * starColors.length)];
                // Random horizontal start
                star.style.left = Math.random() * 100 + "%";
                // Random falling duration
                const starFall = (Math.random() * 2 + 1).toFixed(2);
                star.style.animationDuration = starFall + "s";

                document.body.appendChild(star);

                // Remove star after its animation
                setTimeout(() => {
                    star.remove();
                }, starFall * 1000);
            }
        }, 500); 
        // Wait half a second so the star confetti starts
        // after the squares, creating a 2-wave effect
    }
async openPanel(npcData, callback) {
  console.log("Opening quiz panel with data:", npcData);

  if (this.isOpen) {
    this.closePanel();
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  let promptDropDown = document.getElementById("promptDropDown");
  if (!promptDropDown) {
    this.initialize();
    promptDropDown = document.getElementById("promptDropDown");
  } else {
    promptDropDown.innerHTML = "";
  }

  this.isOpen = true;

  let formattedQuestion;
  try {

    const response = await this.game.quizManager.fetchQuestionByCategory(npcData);
    const questions = response?.questions || [];

    if (questions.length === 0) {
      console.error("No questions found for category:", npcData);
      this.isOpen = false;
      return;
    }


    if (!this.answeredQuestionsByNpc[npcData]) {
      this.answeredQuestionsByNpc[npcData] = new Set();
    }
    const answered = this.answeredQuestionsByNpc[npcData];

    const availableQuestions = questions.filter(
      q => !answered.has(q.question.id)
    );

    if (availableQuestions.length === 0) {
      alert("You've answered all available questions from this NPC!");
      this.isOpen = false;
      return;
    }

    const questionEntry = availableQuestions[0];

    formattedQuestion = {
      title: npcData + " Quiz",
      npcCategory: npcData,
      question: questionEntry.question.content,
      type: "multiple-choice",
      options: questionEntry.choices.map(c => c.choice),
      correctAnswer: questionEntry.choices.findIndex(c => c.is_correct),
      questionId: questionEntry.question.id,
      choiceIds: questionEntry.choices.map(c => c.id)
    };
  } catch (error) {
    console.error("Error fetching question:", error);
    this.isOpen = false;
    return;
  }

  this.currentNpc = formattedQuestion;
  this.callback   = callback;

  promptDropDown.style.display   = "block";
  promptDropDown.style.position  = "fixed";
  promptDropDown.style.width     = "50%";
  promptDropDown.style.left      = "50%";
  promptDropDown.style.top       = "15%";
  promptDropDown.style.transform = "translateX(-50%)";
  promptDropDown.style.zIndex    = "9999";

  const newPromptTitle = document.createElement("div");
  newPromptTitle.id = "promptTitle";
  newPromptTitle.style.display = "block";
  newPromptTitle.innerHTML = formattedQuestion.title;
  promptDropDown.appendChild(newPromptTitle);

  const scrollEdge = document.createElement("div");
  scrollEdge.className = "scroll-edge";
  scrollEdge.appendChild(this.updateTable());
  promptDropDown.appendChild(scrollEdge);

  this.backgroundDim.create();
  promptDropDown.classList.add("quiz-popup");
}

    
    

    async handleSubmit() {
        let isCorrect = false;
        const submitButton = document.querySelector(".quiz-submit");
        const questionType = this.currentNpc?.type;
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
        if (questionType === "multiple-choice") {
            if (selectedAnswer) {
                const answerIndex = parseInt(selectedAnswer.value);
                isCorrect = answerIndex === this.currentNpc.correctAnswer;
    
                const questionId = this.currentNpc.questionId; 
                const choiceId = this.currentNpc.choiceIds?.[answerIndex]; 
                const personId = 1;
    
                try {
                    if (this.game && this.game.statsManager) {
                        await this.game.statsManager.updateStatsMCQ(questionId, choiceId, personId);
                    }
                } catch (error) {
                    console.error("Error updating MCQ stats:", error);
                }
            }
        } else {
            const answerInput = document.querySelector(".quiz-input");
            if (answerInput) {
                const userAnswer = answerInput.value.trim().toLowerCase();
                isCorrect = this.currentNpc.acceptableAnswers.some(
                    answer => answer.toLowerCase() === userAnswer
                );
            }
        }
    
        // Visual feedback
        submitButton.style.backgroundColor = isCorrect ? "#2ecc71" : "#e74c3c";
        submitButton.textContent = isCorrect ? "Correct!" : "Try Again";
        submitButton.disabled = true;
    
        if (isCorrect) this.triggerConfetti();
    
        const callback = this.callback;
        const npcCategory = this.currentNpc?.npcCategory;
    
        if (isCorrect && npcCategory) {
            if (!this.answeredQuestionsByNpc[npcCategory]) {
                this.answeredQuestionsByNpc[npcCategory] = new Set();
            }
            this.answeredQuestionsByNpc[npcCategory].add(this.currentNpc.questionId);
            
            // Award NPC cookie for correct answer
            try {
                if (this.game && this.game.giveNpcCookie) {
                    this.game.giveNpcCookie(npcCategory, "completed", "Great job answering the quiz questions! You've demonstrated your knowledge.");
                    console.log(`NPC Cookie awarded for ${npcCategory}`);
                }
            } catch (error) {
                console.error("Error awarding NPC cookie:", error);
            }
        }
        
    
        setTimeout(() => {
            if (callback) callback(isCorrect);
    
            // Chain next question if available
            if (npcCategory) {
                this.openPanel(npcCategory, callback);
            } else {
                this.closePanel();
            }
        }, 1500);
    }
    
    

    closePanel() {
        const promptDropDown = document.querySelector('.promptDropDown');
        const submitButton = document.querySelector(".quiz-submit");
        
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#2ecc71";
            submitButton.textContent = "Submit Answer";
        }

        this.backgroundDim.remove();
        promptDropDown.classList.remove("quiz-popup");
        
        // Clear the content of the promptDropDown
        promptDropDown.innerHTML = "";
        
        // Reset properties so the quiz can be shown again
        this.isOpen = false;
        this.callback = null;
        this.currentNpc = null;
        
        // Restore the title element
        const promptTitle = document.createElement("div");
        promptTitle.id = "promptTitle";
        promptTitle.style.display = "none";
        promptDropDown.appendChild(promptTitle);
    }

    initialize() {
        // Check if promptDropDown exists, if not create it
        let promptDropDown = document.getElementById("promptDropDown");
        if (!promptDropDown) {
            promptDropDown = document.createElement("div");
            promptDropDown.id = "promptDropDown";
            promptDropDown.className = "promptDropDown";
            promptDropDown.style.zIndex = "9999";
            document.getElementById("gameContainer").appendChild(promptDropDown);
        }

        // Ensure promptDropDown has necessary styles
        promptDropDown.style.position = "fixed";
        promptDropDown.style.width = "50%";
        promptDropDown.style.left = "50%";
        promptDropDown.style.top = "15%";
        promptDropDown.style.transform = "translateX(-50%)";
        promptDropDown.style.zIndex = "9999";

        // Create the title element if it doesn't exist
        let promptTitle = document.getElementById("promptTitle");
        if (!promptTitle) {
            promptTitle = document.createElement("div");
            promptTitle.id = "promptTitle";
            promptTitle.style.display = "none";
            promptDropDown.appendChild(promptTitle);
        }
    }
}

export default Quiz;