---
layout: post
title: "Microblogging Multiple Choice"
description: "Microblog Multiple Choice Quiz for Microblogging Planet"
permalink: /digital-famine/microblog/mcq/
parent: "AI Usage"
team: "Unzippers"
submodule: 1
categories: [CSP, Submodule, Microblogging]
tags: [microblogging, submodule, unzippers]
author: "Krishna Visvanath, Sloane Sommers"
date: 2025-10-21
breadcrumb: true
---

# Submodule 1

## You must get 8 correct to continue!!

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multiple Choice Quiz Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .quiz-container {
            background-color: #37096bff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .options {
            display: grid;
            gap: 10px;
            margin: 15px 0;
        }
        button {
            padding: 10px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            background-color: #4b4b4bff;
            color: white;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
        .option-button {
            background-color: #6a2e3d;
            color: #131313ff;
            border: 1px solid #ddd;
        }
        .option-button:hover {
            background-color: #f0f0f0;
        }
        .result {
            margin-top: 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .feedback {
            color: #ffffffff;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="quiz-container">
        <h1>Multiple Choice Quiz</h1>
        <div id="quiz">
            <div id="question"></div>
            <div class="options" id="options"></div>
            <button id="submit" type="button">Submit Answer</button>
        </div>
        <div id="results" style="display: none;">
            <div class="result">Your Score: <span id="score">0</span>/10</div>
            <button id="restart">Restart Quiz</button>
        </div>
    </div>

    <script>
        const questions = [
            {
                question: "What does PII stand for?",
                options: ["Peer Investigation Information", "Personally Identifiable Information", "Please Invert Intestine", "Personal Identifying Infirmary"],
                correct: 1
            },
            {
                question: "Why do we protect PII?",
                options: ["Because mean people want to stop us from making friends", "Because we're mysterious and nonchalant, sharing PII would diminsh that", "To prevent hackers, scammers, and others with ill intent from harming us", "Because Kai Cenat told us to"],
                correct: 2
            },
            {
                question: "What is the most important piece of PII to protect?",
                options: ["Your address", "The name of your pet", "How many w's you spammed today", "Your first name"],
                correct: 0 
            },
            {
                question: "Which of the following usernames best protect Sloane's PII?",
                options: ["SloaneSommers1234TulipStreet 1", "SloaneS.", "s.sommers1234", "colorfulZebra"],
                correct: 3
            },
            {
                question: "You should click on links from unfamiliar websites that don't start with \"https://\"",
                options: ["True", "False"],
                correct: 1
            },
            {
                question: "You should keep your passwords easy to guess",
                options: ["True", "False"],
                correct: 1
            },
            {
                question: "Where is the safest place to store your passwords?",
                options: ["Microsoft Authenticator/Google Password Manager", "safepasswordstorage.com;p", "The notes app", "A Google document"],
                correct: 0
            },
            {
                question: "Which of these people should you share your passwords with?",
                options: ["Your estranged cousin who visits every 3 years", "Your classmates", "Your favorite streamer", "Your parents"],
                correct: 3
            },
            {
                question: "If the wrong people get ahold of your PII, there can be real life consequences, such as monetary loss or exposure of private information",
                options: ["True", "False"],
                correct: 0
            },
            {
                question: "What websites should you use the same passwords on?",
                options: ["Every website I visit", "Any website except my bank", "No two websites should have the same password", "Gaming websites can have identical passwords, but other websites will differentiate"],
                correct: 2
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;

        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('options');
        const submitBtn = document.getElementById('submit');
        const quizEl = document.getElementById('quiz');
        const resultsEl = document.getElementById('results');
        const scoreEl = document.getElementById('score');
        const restartBtn = document.getElementById('restart');

        function displayQuestion() {
            const question = questions[currentQuestion];
            questionEl.textContent = question.question;
            
            optionsEl.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option;
                button.onclick = () => selectOption(index);
                optionsEl.appendChild(button);
            });
            
            submitBtn.disabled = true;
        }

        function selectOption(index) {
            const buttons = optionsEl.getElementsByClassName('option-button');
            for (let button of buttons) {
                button.style.backgroundColor = '#ffffff';
            }
            buttons[index].style.backgroundColor = '#e0e0e0';
            selectedOption = index;
            submitBtn.disabled = false;
        }

        function submitAnswer() {
            if (selectedOption === questions[currentQuestion].correct) {
                score++;
            }
            
            currentQuestion++;
            if (currentQuestion < questions.length) {
                selectedOption = null;
                displayQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            quizEl.style.display = 'none';
            resultsEl.style.display = 'block';
            scoreEl.textContent = score;
        }

        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            selectedOption = null;
            quizEl.style.display = 'block';
            resultsEl.style.display = 'none';
            displayQuestion();
        }

        submitBtn.onclick = submitAnswer;
        restartBtn.onclick = restartQuiz;

        // Start the quiz
        displayQuestion();
    </script>
</body>
</html>