---
layout: lessonbase
title: Rock Paper Scissors Lesson
type: issues
enable_timer: true
enable_progress: true
enable_badges: true
enable_sandbox: true
enable_quiz: true
enable_flashcards: true
flashcards: "rps-flashcards"
comments: True
permalink: /rock_paper_scissors/lessons
authors: Nithika Vivek, Saanvi Dogra, Eshika Pallapotu
---




# Rock Paper Scissors Console Learning

*A hands-on introduction to browser developer tools through interactive gameplay*


> **Try the game now!** Open your browser's developer tools (F12 or right-click → Inspect), go to the Console tab, and type: `playRPS("rock")`


**Game Buttons:**

Rock | Paper | Scissors
--- | --- | ---
`playRPS('rock')` | `playRPS('paper')` | `playRPS('scissors')`


<div align="center" style="margin-bottom:24px; color:#fff; font-size:1.1em;">
Click any icon to customize using the console
</div>


## What is Browser Console Development?

Browser developer tools are built-in debugging environments that let you interact with web pages behind the scenes. The **Console** is where developers test JavaScript code, debug programs, and explore how web applications work in real-time.

The console is a powerful tool for learning and experimenting with JavaScript. You can type commands, run code, and see results instantly. This makes it a great way to test ideas, debug problems, and understand how code works.

In this lesson, you'll use the console to play Rock Paper Scissors, customize buttons, and learn about programming concepts like functions and OOP.


### Understanding the Developer Tools Interface

#### Console Tab Features:

- **Interactive JavaScript Environment:** Type commands and see immediate results
- **Function Testing:** Call functions directly without needing buttons or forms
- **Output Tracking:** View console.log() statements and error messages
- **Live Code Execution:** Test code changes without modifying source files


#### Inspect Element Features:

- **HTML Structure:** See the actual markup that creates the webpage
- **CSS Styling:** View and modify styles applied to elements
- **Network Activity:** Monitor requests and responses between browser and server

#### What is the Console and Why is it Powerful?

The browser console is a built-in tool for developers to interact with web pages using JavaScript. It allows you to run code, inspect variables, debug errors, and even change how a page looks or behaves in real time. The console is like a playground for experimentation and learning.

- **Debugging:** You can see error messages, warnings, and logs that help you find and fix problems in your code.
- **Live Coding:** Type any JavaScript command and see the result instantly. This is great for testing ideas or learning how code works.
- **Inspecting Objects:** You can explore the properties and methods of any object, including elements on the page, by typing their names in the console.
- **Changing the Page:** You can modify HTML, CSS, and even run scripts to change how the page looks or behaves, all without reloading.
- **Learning Tool:** The console is perfect for beginners to experiment with code, see immediate feedback, and build confidence in programming.
- **Advanced Features:** You can profile performance, monitor network requests, and automate repetitive tasks using the console.

**Example:** Try typing `document.body.style.background = '#222'` in the console to instantly change the page background color. Or use `console.log('Hello!')` to print a message. The console is your direct line to the browser's engine.

**Why use the console in this lesson?** By playing Rock Paper Scissors in the console, you learn how to call functions, pass arguments, and see results. You also get comfortable with the developer tools, which are essential for any web developer.



---
**Checkpoint: Console Basics**

<input class="checkpoint-input" id="checkpoint1-input" type="text" placeholder="Type a command to print Hello in the console">
<button class="show-answer-btn" id="checkpoint1-show" type="button">Show Correct Answer</button>


## The Rock Paper Scissors Console Game

This interactive lesson teaches console navigation through a familiar game. Instead of clicking buttons, you'll execute JavaScript functions directly in the console.

The game logic is written in JavaScript and can be triggered by calling the `playRPS()` function in the console. You can pass "rock", "paper", or "scissors" as arguments to play the game.

Try experimenting with different inputs and see how the game responds!


### Game Setup Process

#### Step-by-Step Instructions:
1. **Access Developer Tools**
    - Right-click anywhere on this page
    - Select "Inspect" or "Inspect Element" from the menu
    - Alternative: Use keyboard shortcuts
        - Windows/Linux: Ctrl + Shift + I or F12
        - Mac: Cmd + Option + I
2. **Navigate to Console**
    - Click "Console" to switch to the interactive environment
    - You should see a command prompt (usually > symbol)
3. **Execute Game Commands**
    - Type exactly: `playRPS("rock")` and press Enter
    - Try other choices: `playRPS("paper")` or `playRPS("scissors")`
    - Watch the console display your results in real-time


#### Sample Console Interaction

```
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
```
        </div>


---
**Checkpoint: Run the Game**

<input class="checkpoint-input" id="checkpoint2-input" type="text" placeholder="Type the command to play rock">
<button class="show-answer-btn" id="checkpoint2-show" type="button">Show Correct Answer</button>


## Learning Workflow (Flow Chart)

The following visual flow represents how students progress through console skills:

**Phase 1: Basic Console Navigation**
- Open developer tools confidently
- Navigate between Console and Elements tabs
- Execute simple JavaScript commands
- Read and interpret console output

↓

**Phase 2: Function Interaction**
- Call functions with different parameters
- Understand how arguments affect results
- Recognize patterns in program behavior
- Predict outcomes based on code logic

↓

**Phase 3: Code Analysis**
- Read JavaScript code and understand its purpose
- Identify key programming concepts (variables, functions, conditionals)
- Trace execution flow from input to output
- Connect console results to underlying code logic


---
**Checkpoint: Function Arguments**

<input class="checkpoint-input" id="checkpoint3-input" type="text" placeholder="Type the command to play scissors">
<button class="show-answer-btn" id="checkpoint3-show" type="button">Show Correct Answer</button>


## Object-Oriented Programming (OOP) in Rock Paper Scissors

**What is OOP?**  
Object-Oriented Programming (OOP) is a programming paradigm that focuses on organizing code into **objects**. Objects are like digital "things" that have both properties (data) and methods (actions they can perform). OOP helps you break down complex programs into smaller, reusable pieces that are easier to understand and maintain. For example, in a game, you might have objects for players, buttons, or even the game itself, each with their own behaviors and data.

**How to add OOP in code?**  
In JavaScript, you can use `class` to define a blueprint for objects. A class describes what properties and methods an object should have. When you create an object from a class, it's called an "instance." For example, you might have a `Button` class that describes how a button should look and behave, and then create three instances for rock, paper, and scissors. Using classes makes your code more organized and lets you reuse logic easily.

**How do we use OOP here?**  
In this Rock Paper Scissors game, OOP is used to animate the buttons. Each button (rock, paper, scissors) can be represented as an object with properties like position, color, and size, and methods like `animateOver()` to move one button over another. When you play, the winning button animates and moves over the losing button, all controlled by methods in the button objects. This makes the animation logic clean and easy to update or extend.

```js
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
```


---
**Checkpoint: OOP Concept**

<input class="checkpoint-input" id="checkpoint4-input" type="text" placeholder="Type the keyword for a blueprint in OOP">
<button class="show-answer-btn" id="checkpoint4-show" type="button">Show Correct Answer</button>


## Console Commands

Each button is customizable using the browser console. Try these commands to change their appearance or behavior:

- **Rock:** Change border color  
    `rock.setBorder('4px solid lime');`
- **Paper:** Rotate the button  
    `paper.rotate(15);`
- **Scissors:** Change button size  
    `scissors.setWidth(150);`

You can use the console to directly manipulate the appearance of elements on the page. This is a powerful way to experiment and see how changes affect the user interface in real time.

Try changing the color, size, or rotation of the buttons above using the commands provided. You can also try your own ideas!


---
**Checkpoint: Console Command Practice**

<input class="checkpoint-input" id="checkpoint5-input" type="text" placeholder="Type the command to rotate the paper button">
<button class="show-answer-btn" id="checkpoint5-show" type="button">Show Correct Answer</button>

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
        "paper.rotate(15);",
        'paper.rotate(15);'
    ],
    "checkpoint5-show",
    "paper.rotate(15);"
);
</script>