---
layout: post
title: "Cyber Defense Protocol"
description: "Phase 1/2 Cyber Defense & Final Sequence (Vault) - End Quest"
permalink: /digital-famine/end/submodule_4/
parent: "End Quest"
team: "CodeMaxxers"
submodule: 4
microblog: true
categories: [CSP, Submodule, End]
tags: [end, submodule, codemaxxers]
author: "David, Aaryan"
microblog: true
date: 2025-10-24
---

# Cyber Defense Protocol

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Famine: Mission Control</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Custom theme configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'cyber-dark': '#0f172a', // Slate 900
                        'cyber-blue': '#38bdf8', // Sky 400 (Neon accent)
                        'cyber-green': '#10b981', // Emerald 500 (Success)
                        'cyber-red': '#ef4444', // Red 500 (Failure)
                        'cyber-text': '#e2e8f0', // Slate 200
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    boxShadow: {
                        'cyber-glow': '0 0 15px rgba(56, 189, 248, 0.5)',
                        'cyber-success': '0 0 15px rgba(16, 189, 129, 0.5)',
                        'cyber-error': '0 0 15px rgba(239, 68, 68, 0.5)',
                    }
                }
            }
        }
    </script>
    <style>
        /* Apply the custom background and font */
        body {
            background-color: #020410;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            font-family: 'Inter', sans-serif;
            /* Subtle dotted background pattern */
            background-image: radial-gradient(#0f172a 1px, transparent 0);
            background-size: 50px 50px;
        }

        /* Styling for the main terminal card */
        .terminal-card {
            background-color: #0f172a;
            border: 2px solid #38bdf8;
            box-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
            max-width: 600px;
        }

        /* Button hover effects */
        .cyber-button {
            transition: all 0.2s;
        }
        .cyber-button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .cyber-button.true-btn:hover {
            box-shadow: 0 0 10px #10b981;
        }
        .cyber-button.false-btn:hover {
            box-shadow: 0 0 10px #ef4444;
        }
        
        /* Input styling for the final sequence game */
        .cyber-input {
            background-color: #0f172a;
            border: 2px solid #38bdf8;
            color: #10b981;
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            letter-spacing: 0.5rem;
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
            padding: 0.5rem;
        }
    </style>
</head>
<body>

    <!-- Phase 1: Quiz Container (Missions 1, 2, 3) -->
    <div id="quiz-container" class="terminal-card rounded-xl p-8 w-full">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cyber-blue tracking-wider mb-2">
                <span class="text-cyber-green">PHASE 1:</span> Cyber Defense Protocol
            </h1>
            <p class="text-sm text-gray-400 border-b border-cyber-blue/30 pb-3">Mission: Validate knowledge from Submodules 1, 2, & 3</p>
        </div>

        <!-- Question Display -->
        <div id="question-area" class="bg-cyber-dark/50 p-6 rounded-lg mb-8 border border-cyber-blue/50 min-h-[150px] flex flex-col justify-center shadow-inner">
            <p id="question-text" class="text-xl text-cyber-text font-medium text-center">
                Loading mission data...
            </p>
            <p id="question-concept" class="text-sm text-gray-500 mt-2 text-center"></p>
        </div>

        <!-- Buttons -->
        <div id="button-area" class="flex gap-4">
            <button id="true-btn" class="cyber-button true-btn flex-1 bg-cyber-green/90 text-cyber-dark font-bold py-3 rounded-lg shadow-cyber-success border border-cyber-green"
                    onclick="checkAnswer(true)">
                [ A ] TRUE
            </button>
            <button id="false-btn" class="cyber-button false-btn flex-1 bg-cyber-red/90 text-cyber-dark font-bold py-3 rounded-lg shadow-cyber-error border border-cyber-red"
                    onclick="checkAnswer(false)">
                [ B ] FALSE
            </button>
        </div>

        <!-- Feedback & Score -->
        <div class="mt-8 pt-4 border-t border-gray-700/50 flex justify-between items-center">
            <p class="text-md font-semibold text-cyber-blue">
                Score: <span id="current-score" class="text-2xl text-cyber-green">0</span>
            </p>
            <p class="text-md text-gray-400">
                Question <span id="current-q-num">1</span> of <span id="total-q-num">10</span>
            </p>
        </div>

        <!-- Result Screen (Initially hidden) -->
        <div id="result-screen" class="hidden text-center p-8 bg-cyber-dark rounded-xl border-4 border-cyber-blue/80 shadow-cyber-glow">
            <h2 id="result-title" class="text-4xl font-extrabold mb-4 text-cyber-green">MISSION COMPLETE</h2>
            <p id="result-message" class="text-xl text-cyber-text mb-6">Secured 0 out of 10 core systems.</p>
            <div id="fragment-display" class="mb-6 text-left p-4 bg-cyber-dark/50 rounded-lg hidden">
                <p class="text-lg font-semibold text-cyber-blue mb-2">Code Fragments Secured:</p>
                <!-- Fragments will be inserted here -->
            </div>
            <button id="next-phase-btn" class="cyber-button bg-cyber-blue/90 text-cyber-dark font-bold py-3 px-8 rounded-lg shadow-cyber-glow border border-cyber-blue"
                    onclick="startFinalSequence()">
                PROCEED TO FINAL SEQUENCE
            </button>
        </div>

        <!-- Custom Feedback Modal -->
        <div id="feedback-modal" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div id="modal-content" class="bg-cyber-dark p-8 rounded-xl border-4 border-gray-700 max-w-sm text-center">
                <h3 id="modal-title" class="text-2xl font-bold mb-3">Feedback</h3>
                <p id="modal-message" class="mb-5"></p>
                <p id="modal-explanation" class="text-sm italic text-gray-400 mb-5"></p>
                <button onclick="closeModal()" class="py-2 px-6 rounded-lg font-semibold text-cyber-dark bg-cyber-blue/90">
                    CONTINUE
                </button>
            </div>
        </div>
    </div>
    
    <!-- Phase 2: Final Sequence Vault (Mission 4) -->
    <div id="vault-container" class="terminal-card rounded-xl p-8 w-full hidden">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cyber-red tracking-wider mb-2">
                <span class="text-cyber-blue">PHASE 2:</span> Final Sequence - Vault Unlock
            </h1>
            <p class="text-sm text-gray-400 border-b border-cyber-red/30 pb-3">Objective: Synthesize the 4-Digit PIN from the Fragments</p>
        </div>

        <div id="vault-fragment-hint" class="text-sm text-gray-400 text-center mb-4 p-3 bg-cyber-dark/50 rounded">
            <p><strong>Fragments Secured:</strong></p>
            <p>ALPHA-**7**X9K, BRAVO-**4**M8Q, CHARLIE-**2**N5P</p>
            <p class="text-cyber-red font-bold mt-2">PIN Structure: [Alpha Digit] [Bravo Digit] [Charlie Digit] [Total Missions (4)]</p>
        </div>

        <div class="text-center mb-6">
            <label for="pin-input" class="text-xl text-cyber-blue block mb-4">ENTER 4-DIGIT VAULT PIN</label>
            <input type="text" id="pin-input" maxlength="4" class="cyber-input w-2/3 p-2 rounded-lg" pattern="[0-9]{4}" oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4)" />
        </div>
        
        <div class="flex justify-center mb-6">
            <button id="pin-submit-btn" class="cyber-button bg-cyber-green/90 text-cyber-dark font-bold py-3 px-8 rounded-lg shadow-cyber-success border border-cyber-green"
                    onclick="checkVaultPin()">
                INITIATE UNLOCK PROTOCOL
            </button>
        </div>

        <!-- Vault Status/Feedback Area -->
        <div id="vault-feedback" class="p-4 bg-cyber-dark/50 rounded-lg border border-gray-700">
            <p id="vault-status" class="text-center text-cyber-text mt-4">Synthesize the final PIN to recover the Sacred Page.</p>
        </div>
        
        <button class="cyber-button bg-gray-700/90 text-white font-bold py-2 px-6 rounded-lg mt-6 w-full"
                onclick="initializeQuiz()">
            RETURN TO QUIZ START
        </button>

    </div>

    <script>
        // --- Data Definitions (The Quiz Questions for M1, M2, M3) ---
        const quizData = [
            // Mission 1: Build the Base Database (SQL Fundamentals)
            {
                question: "The SQL command INSERT is used to add new rows of data into a database table.",
                concept: "M1: Database Creation (SQL)",
                answer: true,
                explanation: "Correct. INSERT is the command used for adding records (rows) into tables."
            },
            {
                question: "In SQL, column names and data types should be drafted before any tables are created.",
                concept: "M1: Database Schema",
                answer: true,
                explanation: "Correct. Planning the schema (column names and data types) is essential for proper database architecture."
            },
            // Mission 2: Patch the Wormhole (SQL Injection Defense)
            {
                question: "A vulnerable login path can be exploited using the payload ' OR '1'='1 to bypass authentication.",
                concept: "M2: SQL Injection Exploit",
                answer: true,
                explanation: "Correct. This payload tricks the database into always evaluating the login condition as true."
            },
            {
                question: "Parameterized statements are a safe method to prevent SQL injection by separating the SQL command from user input.",
                concept: "M2: SQL Injection Defense",
                answer: true,
                explanation: "Correct. Parameterized statements treat user input strictly as data, not executable code."
            },
            // Mission 3: Encrypt the Launch Codes (Hashing/Cryptography)
            {
                question: "Hashing with SHA-256 is a reversible encryption method.",
                concept: "M3: Hashing & Cryptography",
                answer: false,
                explanation: "Incorrect. Hashing is a one-way, irreversible function designed for integrity checking, not decryption."
            },
            {
                question: "A digest is the long string of characters created when a launch key is processed through SHA-256.",
                concept: "M3: Cryptography Terminology",
                answer: true,
                explanation: "Correct. The output of a hash function is called a hash, digest, or hash value."
            },
            // General Security (Supporting Concepts)
            {
                question: "A firewall's primary job is to block all incoming and outgoing network traffic regardless of safety.",
                concept: "Concept: Network Security / Firewalls",
                answer: false,
                explanation: "Incorrect. A firewall filters traffic based on a defined set of security rules, allowing necessary traffic while blocking unsafe traffic."
            },
            {
                question: "Spear phishing targets a large, general audience rather than a specific individual.",
                concept: "Concept: Social Engineering / Phishing",
                answer: false,
                explanation: "Incorrect. Spear phishing is highly targeted and customized (like a laser beam, not a wide net)."
            },
            {
                question: "Two-Factor Authentication (2FA) is a requirement for strong passwords.",
                concept: "Concept: Authentication",
                answer: false,
                explanation: "Incorrect. 2FA is a separate layer of security (an extra step), while strong passwords are about length and complexity."
            },
            {
                question: "A Distributed Denial of Service (DDoS) attack overwhelms a server with junk traffic.",
                concept: "Concept: Denial of Service",
                answer: true,
                explanation: "Correct. DDoS uses many computers to flood a server, making it unavailable to legitimate users."
            }
        ];

        // --- Global State Variables ---
        let currentQuestionIndex = 0;
        let score = 0;
        const PASS_SCORE = 6;
        
        // Final Vault PIN based on fragment numbers and total missions (4): 7424
        const FINAL_VAULT_PIN = '7424'; 
        const FRAGMENTS = {
            ALPHA: 'ALPHA-7X9K', // Digit 7
            BRAVO: 'BRAVO-4M8Q', // Digit 4
            CHARLIE: 'CHARLIE-2N5P' // Digit 2
        };


        // --- DOM Elements ---
        let questionTextEl, questionConceptEl, scoreEl, currentQNumEl, totalQNumEl, buttonAreaEl, quizContainerEl, resultScreenEl, feedbackModalEl, modalContentEl, modalTitleEl, modalMessageEl, modalExplanationEl, fragmentDisplayEl;
        let vaultContainerEl, pinInputEl, pinSubmitBtn, vaultStatusEl;

        function getDOMElements() {
            // Quiz Elements
            questionTextEl = document.getElementById('question-text');
            questionConceptEl = document.getElementById('question-concept');
            scoreEl = document.getElementById('current-score');
            currentQNumEl = document.getElementById('current-q-num');
            totalQNumEl = document.getElementById('total-q-num');
            buttonAreaEl = document.getElementById('button-area');
            quizContainerEl = document.getElementById('quiz-container');
            resultScreenEl = document.getElementById('result-screen');
            feedbackModalEl = document.getElementById('feedback-modal');
            modalContentEl = document.getElementById('modal-content');
            modalTitleEl = document.getElementById('modal-title');
            modalMessageEl = document.getElementById('modal-message');
            modalExplanationEl = document.getElementById('modal-explanation');
            fragmentDisplayEl = document.getElementById('fragment-display');
            
            // Vault Elements
            vaultContainerEl = document.getElementById('vault-container');
            pinInputEl = document.getElementById('pin-input');
            pinSubmitBtn = document.getElementById('pin-submit-btn');
            vaultStatusEl = document.getElementById('vault-status');
        }

        // --- Phase 1: Quiz Functions ---

        function initializeQuiz() {
            getDOMElements(); 
            totalQNumEl.textContent = quizData.length;
            currentQuestionIndex = 0;
            score = 0;
            scoreEl.textContent = score;
            
            // Switch view to Quiz
            quizContainerEl.classList.remove('hidden');
            vaultContainerEl.classList.add('hidden');

            // Reset Quiz UI
            quizContainerEl.querySelector('#question-area').classList.remove('hidden');
            buttonAreaEl.classList.remove('hidden');
            resultScreenEl.classList.add('hidden');
            fragmentDisplayEl.classList.add('hidden');
            document.getElementById('next-phase-btn').onclick = startFinalSequence; // Default to final sequence if passing
            document.getElementById('next-phase-btn').classList.remove('bg-cyber-red/90');
            document.getElementById('next-phase-btn').classList.add('bg-cyber-blue/90');

            displayQuestion();
        }

        function displayQuestion() {
            const q = quizData[currentQuestionIndex];
            questionTextEl.textContent = q.question;
            questionConceptEl.textContent = q.concept;
            currentQNumEl.textContent = currentQuestionIndex + 1;
        }

        window.checkAnswer = function(userAnswer) {
            const currentQ = quizData[currentQuestionIndex];
            const isCorrect = userAnswer === currentQ.answer;

            if (isCorrect) {
                score++;
                scoreEl.textContent = score;
                showModal('ACCESS GRANTED', 'System Secured!', currentQ.explanation, 'text-cyber-green', 'border-cyber-green');
            } else {
                showModal('BREACH DETECTED', 'Security Failure!', currentQ.explanation, 'text-cyber-red', 'border-cyber-red');
            }
        }

        function advanceQuiz() {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                displayQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            quizContainerEl.querySelector('#question-area').classList.add('hidden');
            buttonAreaEl.classList.add('hidden');
            resultScreenEl.classList.remove('hidden');

            const total = quizData.length;
            const percentage = Math.round((score / total) * 100);
            const nextPhaseBtnEl = document.getElementById('next-phase-btn');
            
            document.getElementById('result-title').textContent = "MISSION COMPLETE";
            document.getElementById('result-title').className = `text-4xl font-extrabold mb-4`;
            
            // Logic for awarding fragments and unlocking Phase 2
            if (score >= PASS_SCORE) {
                document.getElementById('result-title').classList.add('text-cyber-green');
                document.getElementById('result-message').textContent = `Success! You scored ${score} out of ${total} (${percentage}%). All three fragments are decrypted and ready for synthesis.`;
                
                // Display Fragments
                fragmentDisplayEl.classList.remove('hidden');
                fragmentDisplayEl.innerHTML = `
                    <p class="text-lg font-semibold text-cyber-blue mb-2">Code Fragments Secured:</p>
                    <p class="text-cyber-green font-mono">1. ${FRAGMENTS.ALPHA}</p>
                    <p class="text-cyber-green font-mono">2. ${FRAGMENTS.BRAVO}</p>
                    <p class="text-cyber-green font-mono">3. ${FRAGMENTS.CHARLIE}</p>
                    <p class="text-sm text-gray-400 mt-2">PIN Sequence hint: The vault PIN starts with the first digit of each fragment, followed by the total number of primary modules (4).</p>
                `;
                
                nextPhaseBtnEl.textContent = 'PROCEED TO FINAL SEQUENCE (M4)';
                nextPhaseBtnEl.onclick = startFinalSequence;

            } else {
                document.getElementById('result-title').classList.add('text-cyber-red');
                document.getElementById('result-message').textContent = `FAILURE. You scored ${score} out of ${total} (${percentage}%). Minimum score of ${PASS_SCORE} required. Fragments locked.`;
                fragmentDisplayEl.classList.add('hidden');
                
                nextPhaseBtnEl.textContent = 'RE-INITIALIZE PROTOCOL';
                nextPhaseBtnEl.onclick = initializeQuiz;
                nextPhaseBtnEl.classList.remove('bg-cyber-blue/90');
                nextPhaseBtnEl.classList.add('bg-cyber-red/90');
            }
        }

        function showModal(title, message, explanation, titleColor, borderColor) {
            modalTitleEl.textContent = title;
            modalMessageEl.textContent = message;
            modalExplanationEl.textContent = explanation;
            modalTitleEl.className = `text-2xl font-bold mb-3 ${titleColor}`;

            modalContentEl.classList.remove('border-gray-700', 'border-cyber-green', 'border-cyber-red', 'border-cyber-blue');
            modalContentEl.classList.add(borderColor);

            feedbackModalEl.classList.remove('hidden');
        }

        window.closeModal = function() {
            feedbackModalEl.classList.add('hidden');
            advanceQuiz();
        }

        // --- Phase 2: Vault Functions ---
        
        window.startFinalSequence = function() {
            // 1. Hide Quiz, Show Vault
            quizContainerEl.classList.add('hidden');
            vaultContainerEl.classList.remove('hidden');

            // 2. Reset Vault UI
            pinInputEl.value = '';
            pinInputEl.disabled = false;
            pinSubmitBtn.disabled = false;
            vaultStatusEl.textContent = 'Synthesize the final PIN to recover the Sacred Page.';
            vaultStatusEl.className = 'text-center text-cyber-text mt-4';
        }

        window.checkVaultPin = function() {
            const userInput = pinInputEl.value;
            
            if (userInput.length !== 4) {
                vaultStatusEl.textContent = 'ERROR: PIN must be 4 digits. Sequence aborted.';
                vaultStatusEl.className = 'text-center text-cyber-red mt-4';
                return;
            }

            // --- Win Condition ---
            if (userInput === FINAL_VAULT_PIN) {
                vaultStatusEl.innerHTML = `
                    <span class="text-4xl font-bold text-cyber-green">VAULT UNLOCKED!</span> <br> 
                    <span class="text-xl">The Sacred Page is retrieved. Earth is SAFE. Mission Complete!</span>
                `;
                vaultStatusEl.className = 'text-center text-cyber-green mt-4 mb-4';
                pinInputEl.disabled = true;
                pinSubmitBtn.disabled = true;
            } else {
                // Fail Condition
                vaultStatusEl.innerHTML = `
                    <span class="text-4xl font-bold text-cyber-red">AUTHENTICATION FAILED</span> <br> 
                    <span class="text-xl">Incorrect PIN sequence. Check your fragment order and try again.</span>
                `;
                vaultStatusEl.className = 'text-center text-cyber-red mt-4 mb-4';
            }
        }

        // --- Start the Quiz on load ---
        window.onload = initializeQuiz;
    </script>
    
    <script type="module">
        import { initEndModuleProgression } from '{{site.baseurl}}/assets/js/digitalFamine/endModuleProgression.js';
        
        // Initialize progression system for this module
        initEndModuleProgression();
    </script>

</body>
</html>