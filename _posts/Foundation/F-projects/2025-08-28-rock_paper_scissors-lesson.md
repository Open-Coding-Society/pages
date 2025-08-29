---
layout: opencs
title: Rock Paper Scissors Lesson
comments: True
permalink: /rock_paper_scissors/lessons
authors: Nithika Vivek, Saanvi Dogra, Eshika Pallapotu
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rock Paper Scissors Console Learning</title>
    <style>
      :root {
          color-scheme: dark !important;
      }
      body, body * {
          color: #fff !important;
          background: #18181b !important;
      }
      h1, h2, h3, h4, h5, h6 {
          color: #fff !important;
      }
      p, li, span, div {
          color: #fff !important;
      }
      body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
          margin: 0;
          padding: 20px;
          line-height: 1.6;
          min-height: 100vh;
      }
      .container {
          max-width: 900px;
          margin: 0 auto;
          background: #232336;
          padding: 40px;
          border: 3px solid #000;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      h1 {
          color: #fff;
          text-align: center;
          font-size: 2.5em;
          margin-bottom: 10px;
          border-bottom: 3px solid #fff;
          padding-bottom: 10px;
          font-weight: bold;
      }
      h2 {
          color: #fff;
          font-size: 1.8em;
          border-left: 4px solid #c06c84;
          padding-left: 15px;
          margin-top: 30px;
          font-weight: bold;
      }
      h3 {
          color: #fff;
          font-size: 1.4em;
          margin-top: 25px;
          font-weight: bold;
      }
      h4 {
          color: #fff;
          font-size: 1.2em;
          margin-top: 20px;
          font-weight: bold;
      }
      .subtitle {
          text-align: center;
          color: #fff;
          font-style: italic;
          font-size: 1.2em;
          margin-bottom: 30px;
      }
      .game-buttons {
          text-align: center;
          margin: 30px 0;
      }
      button {
          background: linear-gradient(45deg, #ffd700, #c06c84);
          color: #1f2937;
          border: none;
          padding: 15px 30px;
          margin: 0 10px;
          border-radius: 8px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      button:hover {
          background: linear-gradient(45deg, #c06c84, #6a4c93);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      }
      button:active {
          transform: translateY(-1px);
      }
      .console-example {
          background: #1a1a1a;
          color: #fff;
          padding: 20px;
          font-family: 'Courier New', monospace;
          margin: 20px 0;
          border: 2px solid #6a4c93;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.95em;
      }
      .code-block {
          background: #1a1a1a;
          color: #fff !important;
          padding: 20px;
          font-family: 'Courier New', monospace;
          margin: 20px 0;
          border: 2px solid #c06c84;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.9em;
          border-left: 4px solid #6a4c93;
      }
      .section-highlight {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(192, 108, 132, 0.1));
          padding: 25px;
          margin: 25px 0;
          border: 1px solid #c06c84;
          border-radius: 8px;
      }
      .phase-section {
          background: rgba(106, 76, 147, 0.1);
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #6a4c93;
          border-radius: 5px;
      }
      ul, ol {
          margin: 15px 0;
          padding-left: 30px;
      }
      li {
          margin: 8px 0;
          color: #fff;
      }
      p {
          color: #fff;
          margin: 15px 0;
      }
      strong {
          color: #fff;
          font-weight: bold;
      }
      .success-indicators {
          background: rgba(255, 215, 0, 0.15);
          padding: 25px;
          margin: 30px 0;
          border: 2px solid #ffd700;
          border-radius: 8px;
      }
      .activities-section {
          background: rgba(192, 108, 132, 0.1);
          padding: 25px;
          margin: 25px 0;
          border: 1px solid #c06c84;
          border-radius: 8px;
      }
      .play-instructions {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #1f2937;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          margin: 20px 0;
          border: 2px solid #d97706;
      }
      .checkpoint-section {
          margin: 32px 0 24px 0;
          padding: 24px;
          background: #232336;
          border-radius: 12px;
          border: 2px solid #ffd700;
          box-shadow: 0 2px 12px #0004;
      }
      .checkpoint-label {
          font-weight: bold;
          color: #ffd700;
          font-size: 1.1em;
          margin-bottom: 8px;
          display: block;
      }
      .checkpoint-input {
          width: 100%;
          padding: 10px;
          font-size: 1em;
          border-radius: 6px;
          border: 2px solid #444;
          margin-bottom: 10px;
          background: #18181b;
          color: #fff;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
      }
      .checkpoint-input.correct {
          border: 2px solid #22c55e;
          box-shadow: 0 0 8px #22c55e;
          background: #1e2e1e;
      }
      .checkpoint-input.incorrect {
          border: 2px solid #ef4444;
          box-shadow: 0 0 8px #ef4444;
          background: #2e1e1e;
      }
      .checkpoint-feedback {
          font-weight: bold;
          margin-bottom: 8px;
          min-height: 24px;
      }
      .checkpoint-feedback.correct {
          color: #22c55e;
      }
      .checkpoint-feedback.incorrect {
          color: #ef4444;
      }
      .show-answer-btn {
          background: #6a4c93;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 8px;
          margin-bottom: 0;
      }
      .show-answer-btn:hover {
          background: #8e6fc4;
      }
      /* Flowchart white outline */
      .flowchart-box {
          border: 2px solid #fff !important;
          background: #232336;
          border-radius: 8px;
          max-width: 500px;
          text-align: left;
          padding: 1rem 1.5rem;
      }
      .flowchart-arrow {
          color: #fff !important;
          font-size: 2.5rem;
      }
    </style>
</head>
<body>

<div class="container">
    <h1>Rock Paper Scissors Console Learning</h1>
    <p class="subtitle">A hands-on introduction to browser developer tools through interactive gameplay</p>

    <div class="play-instructions">
        Try the game now! Open your browser's developer tools (F12 or right-click → Inspect), 
        go to the Console tab, and type: playRPS("rock")
    </div>

    <div class="game-buttons">
        <button onclick="playRPS('rock')">Rock</button>
        <button onclick="playRPS('paper')">Paper</button>
        <button onclick="playRPS('scissors')">Scissors</button>
    </div>

    <div style="text-align:center; margin-bottom:24px; color:#fff; font-size:1.1em;">
        Click any icon to customize using the console
    </div>

    <h2>What is Browser Console Development?</h2>
    <p>
        Browser developer tools are built-in debugging environments that let you interact with web pages behind the scenes. The <strong>Console</strong> is where developers test JavaScript code, debug programs, and explore how web applications work in real-time.
    </p>
    <p>
        The console is a powerful tool for learning and experimenting with JavaScript. You can type commands, run code, and see results instantly. This makes it a great way to test ideas, debug problems, and understand how code works.
    </p>
    <p>
        In this lesson, you'll use the console to play Rock Paper Scissors, customize buttons, and learn about programming concepts like functions and OOP.
    </p>

    <h3>Understanding the Developer Tools Interface</h3>
    <div class="section-highlight">
        <h4>Console Tab Features:</h4>
        <ul>
            <li><strong>Interactive JavaScript Environment:</strong> Type commands and see immediate results</li>
            <li><strong>Function Testing:</strong> Call functions directly without needing buttons or forms</li>
            <li><strong>Output Tracking:</strong> View console.log() statements and error messages</li>
            <li><strong>Live Code Execution:</strong> Test code changes without modifying source files</li>
        </ul>

        <h4>Inspect Element Features:</h4>
        <ul>
            <li><strong>HTML Structure:</strong> See the actual markup that creates the webpage</li>
            <li><strong>CSS Styling:</strong> View and modify styles applied to elements</li>
            <li><strong>Network Activity:</strong> Monitor requests and responses between browser and server</li>
        </ul>
        <h4>What is the Console and Why is it Powerful?</h4>
        <p>
            The browser console is a built-in tool for developers to interact with web pages using JavaScript. It allows you to run code, inspect variables, debug errors, and even change how a page looks or behaves in real time. The console is like a playground for experimentation and learning.
        </p>
        <ul>
            <li><strong>Debugging:</strong> You can see error messages, warnings, and logs that help you find and fix problems in your code.</li>
            <li><strong>Live Coding:</strong> Type any JavaScript command and see the result instantly. This is great for testing ideas or learning how code works.</li>
            <li><strong>Inspecting Objects:</strong> You can explore the properties and methods of any object, including elements on the page, by typing their names in the console.</li>
            <li><strong>Changing the Page:</strong> You can modify HTML, CSS, and even run scripts to change how the page looks or behaves, all without reloading.</li>
            <li><strong>Learning Tool:</strong> The console is perfect for beginners to experiment with code, see immediate feedback, and build confidence in programming.</li>
            <li><strong>Advanced Features:</strong> You can profile performance, monitor network requests, and automate repetitive tasks using the console.</li>
        </ul>
        <p>
            <strong>Example:</strong> Try typing <code>document.body.style.background = '#222'</code> in the console to instantly change the page background color. Or use <code>console.log('Hello!')</code> to print a message. The console is your direct line to the browser's engine.
        </p>
        <p>
            <strong>Why use the console in this lesson?</strong> By playing Rock Paper Scissors in the console, you learn how to call functions, pass arguments, and see results. You also get comfortable with the developer tools, which are essential for any web developer.
        </p>
    </div>

    <!-- Checkpoint 1: Console Basics -->
    <div class="checkpoint-section">
        <span class="checkpoint-label">Checkpoint: Console Basics</span>
        <div class="checkpoint-feedback" id="checkpoint1-feedback"></div>
        <input class="checkpoint-input" id="checkpoint1-input" type="text" placeholder="Type a command to print Hello in the console">
        <button class="show-answer-btn" id="checkpoint1-show" type="button">Show Correct Answer</button>
    </div>

    <h2>The Rock Paper Scissors Console Game</h2>
    <p>
        This interactive lesson teaches console navigation through a familiar game. Instead of clicking buttons, you'll execute JavaScript functions directly in the console.
    </p>
    <p>
        The game logic is written in JavaScript and can be triggered by calling the <code>playRPS()</code> function in the console. You can pass "rock", "paper", or "scissors" as arguments to play the game.
    </p>
    <p>
        Try experimenting with different inputs and see how the game responds!
    </p>

    <div class="section-highlight">
        <h3>Game Setup Process</h3>
        <h4>Step-by-Step Instructions:</h4>
        <ol>
            <li>
                <strong>Access Developer Tools</strong>
                <ul>
                    <li>Right-click anywhere on this page</li>
                    <li>Select "Inspect" or "Inspect Element" from the menu</li>
                    <li>Alternative: Use keyboard shortcuts
                        <ul>
                            <li>Windows/Linux: Ctrl + Shift + I or F12</li>
                            <li>Mac: Cmd + Option + I</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                <strong>Navigate to Console</strong>
                <ul>
                    <li>Click "Console" to switch to the interactive environment</li>
                    <li>You should see a command prompt (usually > symbol)</li>
                </ul>
            </li>
            <li>
                <strong>Execute Game Commands</strong>
                <ul>
                  <li>Type exactly: playRPS(&quot;rock&quot;) and press Enter</li>
                  <li>Try other choices: playRPS(&quot;paper&quot;) or playRPS(&quot;scissors&quot;)</li>
                  <li>Watch the console display your results in real-time</li>
                </ul>
            </li>
        </ol>

        <h4>Sample Console Interaction</h4>
        <div class="console-example" style="background:#cce7ff; color:#0f0;">
> playRPS("rock")
You chose: ROCK
Computer chose: SCISSORS  
Result: You Win!

> playRPS("paper")
You chose: PAPER
Computer chose: PAPER
Result: Tie!

> playRPS("scissors")
You chose: SCISSORS
Computer chose: ROCK
Result: You Lose!
        </div>
    </div>

    <!-- Checkpoint 2: Run the Game -->
    <div class="checkpoint-section">
        <span class="checkpoint-label">Checkpoint: Run the Game</span>
        <div class="checkpoint-feedback" id="checkpoint2-feedback"></div>
        <input class="checkpoint-input" id="checkpoint2-input" type="text" placeholder="Type the command to play rock">
        <button class="show-answer-btn" id="checkpoint2-show" type="button">Show Correct Answer</button>
    </div>

    <h2>Learning Workflow (Flow Chart)</h2>
    <p>
        The following visual flow represents how students progress through console skills:
    </p>
    <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; margin:2rem 0; font-family:sans-serif;">
        <!-- Phase 1 -->
        <div class="flowchart-box">
            <h3 style="margin:0 0 0.5rem 0;">Phase 1: Basic Console Navigation</h3>
            <ul>
                <li>Open developer tools confidently</li>
                <li>Navigate between Console and Elements tabs</li>
                <li>Execute simple JavaScript commands</li>
                <li>Read and interpret console output</li>
            </ul>
        </div>
        <div class="flowchart-arrow">&#8595;</div>
        <!-- Phase 2 -->
        <div class="flowchart-box">
            <h3 style="margin:0 0 0.5rem 0;">Phase 2: Function Interaction</h3>
            <ul>
                <li>Call functions with different parameters</li>
                <li>Understand how arguments affect results</li>
                <li>Recognize patterns in program behavior</li>
                <li>Predict outcomes based on code logic</li>
            </ul>
        </div>
        <div class="flowchart-arrow">&#8595;</div>
        <!-- Phase 3 -->
        <div class="flowchart-box">
            <h3 style="margin:0 0 0.5rem 0;">Phase 3: Code Analysis</h3>
            <ul>
                <li>Read JavaScript code and understand its purpose</li>
                <li>Identify key programming concepts (variables, functions, conditionals)</li>
                <li>Trace execution flow from input to output</li>
                <li>Connect console results to underlying code logic</li>
            </ul>
        </div>
    </div>

    <!-- Checkpoint 3: Function Arguments -->
    <div class="checkpoint-section">
        <span class="checkpoint-label">Checkpoint: Function Arguments</span>
        <div class="checkpoint-feedback" id="checkpoint3-feedback"></div>
        <input class="checkpoint-input" id="checkpoint3-input" type="text" placeholder="Type the command to play scissors">
        <button class="show-answer-btn" id="checkpoint3-show" type="button">Show Correct Answer</button>
    </div>

    <h2>Object-Oriented Programming (OOP) in Rock Paper Scissors</h2>
    <p>
        <strong>What is OOP?</strong><br>
        Object-Oriented Programming (OOP) is a programming paradigm that focuses on organizing code into <strong>objects</strong>. Objects are like digital "things" that have both properties (data) and methods (actions they can perform). OOP helps you break down complex programs into smaller, reusable pieces that are easier to understand and maintain. For example, in a game, you might have objects for players, buttons, or even the game itself, each with their own behaviors and data.
    </p>
    <p>
        <strong>How to add OOP in code?</strong><br>
        In JavaScript, you can use <code>class</code> to define a blueprint for objects. A class describes what properties and methods an object should have. When you create an object from a class, it's called an "instance." For example, you might have a <code>Button</code> class that describes how a button should look and behave, and then create three instances for rock, paper, and scissors. Using classes makes your code more organized and lets you reuse logic easily.
    </p>
    <p>
        <strong>How do we use OOP here?</strong><br>
        In this Rock Paper Scissors game, OOP is used to animate the buttons. Each button (rock, paper, scissors) can be represented as an object with properties like position, color, and size, and methods like <code>animateOver()</code> to move one button over another. When you play, the winning button animates and moves over the losing button, all controlled by methods in the button objects. This makes the animation logic clean and easy to update or extend.
    </p>
    <div class="console-example" style="background:#1a1a1a; color:#fff;">
        <pre>
class GameButton {
    constructor(element) {
        this.element = element;
        // You could add more properties like position, color, etc.
    }
    animateOver(target) {
        // Move this button over the target button
        // For example, you could change the position or add a CSS class for animation
    }
}
        </pre>
    </div>

    <!-- Checkpoint 4: OOP Concept -->
    <div class="checkpoint-section">
        <span class="checkpoint-label">Checkpoint: OOP Concept</span>
        <div class="checkpoint-feedback" id="checkpoint4-feedback"></div>
        <input class="checkpoint-input" id="checkpoint4-input" type="text" placeholder="Type the keyword for a blueprint in OOP">
        <button class="show-answer-btn" id="checkpoint4-show" type="button">Show Correct Answer</button>
    </div>

    <h2>Console Commands</h2>
    <p>
        Each button is customizable using the browser console. Try these commands to change their appearance or behavior:
    </p>
    <ul>
        <li>
            <strong>Rock:</strong> Change border color<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'rock\')"]').style.border = '4px solid lime';</div>
        </li>
        <li>
            <strong>Paper:</strong> Rotate the button<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'paper\')"]').style.transform = 'rotate(15deg)';</div>
        </li>
        <li>
            <strong>Scissors:</strong> Change button size<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'scissors\')"]').style.fontSize = '2em';</div>
        </li>
        <li>
            <strong>Rock:</strong> Add a glowing effect<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'rock\')"]').style.boxShadow = '0 0 20px 5px #ffd700';</div>
        </li>
        <li>
            <strong>Paper:</strong> Remove all custom styles<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'paper\')"]').removeAttribute('style');</div>
        </li>
        <li>
            <strong>Scissors:</strong> Change button text<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'scissors\')"]').textContent = '✂️ Scissors!';</div>
        </li>
        <li>
            <strong>Rock:</strong> Make button transparent<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'rock\')"]').style.opacity = '0.5';</div>
        </li>
        <li>
            <strong>Paper:</strong> Add a red border and shadow<br>
            <div class="code-block">document.querySelector('button[onclick="playRPS(\'paper\')"]').style.boxShadow = '0 0 10px 2px red'; document.querySelector('button[onclick="playRPS(\'paper\')"]').style.border = '3px solid red';</div>
        </li>
    </ul>
    <p>
        You can use the console to directly manipulate the appearance of elements on the page. This is a powerful way to experiment and see how changes affect the user interface in real time.
    </p>
    <p>
        Try changing the color, size, or rotation of the buttons above using the commands provided. You can also try your own ideas!
    </p>

    <!-- Checkpoint 5: Console Command Practice -->
    <div class="checkpoint-section">
        <span class="checkpoint-label">Checkpoint: Console Command Practice</span>
        <div class="checkpoint-feedback" id="checkpoint5-feedback"></div>
        <input class="checkpoint-input" id="checkpoint5-input" type="text" placeholder="Type the command to rotate the paper button">
        <button class="show-answer-btn" id="checkpoint5-show" type="button">Show Correct Answer</button>
    </div>
</div>

<script>
window.playRPS = function(playerChoice) {
    if (!playerChoice || typeof playerChoice !== 'string') {
        console.error('Please provide a valid choice: "rock", "paper", or "scissors"');
        return;
    }
    playerChoice = playerChoice.toLowerCase();
    const choices = ["rock", "paper", "scissors"];
    if (!choices.includes(playerChoice)) {
        console.error('Invalid choice! Please use "rock", "paper", or "scissors"');
        return;
    }
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultText;
    if (playerChoice === computerChoice) {
        resultText = "Tie!";
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        resultText = "You Win!";
    } else {
        resultText = "You Lose!";
    }
    console.log(`%cYou chose: ${playerChoice.toUpperCase()}`, 'color: #3b82f6; font-weight: bold;');
    console.log(`%cComputer chose: ${computerChoice.toUpperCase()}`, 'color: #ef4444; font-weight: bold;');
    console.log(`%c${resultText}`, 'color: #10b981; font-size: 16px; font-weight: bold;');
    console.log('---');
    return { player: playerChoice, computer: computerChoice, result: resultText };
};

console.log('%cRock Paper Scissors Console Game Ready!', 'color: #ffd700; font-size: 18px; font-weight: bold;');
console.log('%cTry: playRPS("rock"), playRPS("paper"), or playRPS("scissors")', 'color: #6366f1; font-weight: bold;');

// --- Checkpoint logic ---
function checkpointCheck(inputId, feedbackId, correctAnswers, showBtnId, showValue) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    const showBtn = document.getElementById(showBtnId);
    input.addEventListener('input', function() {
        let val = input.value.trim();
        let correct = false;
        for (let ans of correctAnswers) {
            if (val === ans) correct = true;
        }
        if (correct) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            feedback.textContent = "Correct!";
            feedback.className = "checkpoint-feedback correct";
            showBtn.style.display = "none";
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            feedback.textContent = "Not quite. Try again!";
            feedback.className = "checkpoint-feedback incorrect";
            showBtn.style.display = "inline-block";
        }
    });
    showBtn.onclick = function() {
        input.value = showValue;
        input.dispatchEvent(new Event('input'));
    };
}

// Checkpoint 1: Print Hello
checkpointCheck(
    "checkpoint1-input",
    "checkpoint1-feedback",
    ["console.log('Hello')", 'console.log("Hello")'],
    "checkpoint1-show",
    "console.log('Hello')"
);

// Checkpoint 2: playRPS("rock")
checkpointCheck(
    "checkpoint2-input",
    "checkpoint2-feedback",
    ['playRPS("rock")', "playRPS('rock')"],
    "checkpoint2-show",
    'playRPS("rock")'
);

// Checkpoint 3: playRPS("scissors")
checkpointCheck(
    "checkpoint3-input",
    "checkpoint3-feedback",
    ['playRPS("scissors")', "playRPS('scissors')"],
    "checkpoint3-show",
    'playRPS("scissors")'
);

// Checkpoint 4: OOP keyword
checkpointCheck(
    "checkpoint4-input",
    "checkpoint4-feedback",
    ['class'],
    "checkpoint4-show",
    'class'
);

// Checkpoint 5: Console command for paper rotate
checkpointCheck(
    "checkpoint5-input",
    "checkpoint5-feedback",
    [
        "document.querySelector('button[onclick=\"playRPS(\\'paper\\')\"]').style.transform = 'rotate(15deg)';",
        'document.querySelector("button[onclick=\'playRPS(\\\'paper\\\')\']").style.transform = \'rotate(15deg)\';'
    ],
    "checkpoint5-show",
    "document.querySelector('button[onclick=\"playRPS(\\'paper\\')\"]').style.transform = 'rotate(15deg)';"
);
</script>
</body>
</html>
