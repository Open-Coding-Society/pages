---
layout: post
courses: {'csse': {'week': 5}}
categories: ['JavaScript', 'Functions']
lesson_language: JavaScript
lesson_topic: Functions
lesson_part: interactive
lesson_type: lesson
toc: False
title: Functions
description: This lesson explains JavaScript functions.
author: Tinkerers - Anish G, James B, Vihaan B
---

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}

  .hw-btn {
      background-color: #007bff;       /* blue */
      color: white;                    /* white text */
      padding: 12px 20px;              /* spacing */
      border: none;                    /* remove default border */
      border-radius: 12px;             /* rounded corners */
      font-size: 16px;                 /* slightly larger text */
      cursor: pointer;                 /* pointer on hover */
      transition: background-color 0.3s ease; /* smooth hover transition */
  }

  .hw-btn:hover {
      background-color: #0056b3; /* darker blue on hover */
  }

</style>

<table>
	<tr>
		<th>Role</th>
		<th>Name</th>
	</tr>
	<tr>
		<td>📋 Scrum Master</td>
		<td>Anish Gupta</td>
	</tr>
	<tr>
		<td>💻 Scrummer</td>
		<td>James Blazek</td>
	</tr>
	<tr>
		<td>💻 Scummer</td>
		<td>Vihaan Budhraja</td>
	</tr>
</table>

<br>

<h2 class="glowing-text">Setup</h2>
Copy the homework file into your personal repository by doing this:

1. Open the `Open-Coding-Society/pages` repo in one VSCode window and your own `portfolio` repo in the other
2. Drag and drop `2025-09-29-functions_tinkerers_js_hw.ipynb` from pages to your own repo. It is in `_notebooks/CSSE/JavaScriptLessons/Functions`.

Alternatively, you can use wget: 

```bash
# First cd to the base of your repo

mkdir -p _notebooks/CSSE/JavascriptLessons/Functions

wget -O _notebooks/CSSE/JavascriptLessons/Functions/2025-09-29-functions_js_tinkerers_hw "https://raw.githubusercontent.com/Open-Coding-Society/pages/main/_notebooks/CSSE/JavaScriptLessons/Functions/2025-09-29-functions_js_tinkerers_hw.ipynb"
```


Your homework is now copied into your personal repo! This notebook also contains popcorn hacks #1 and #2.



<h2 class="glowing-text">What are functions?</h2>


> Functions in programming are modular units of code designed to perform specific tasks. They encapsulate a set of instructions, allowing for code reuse and organization. - GeeksForGeeks

Functions allow you to take a piece of code, and almost put it into a box so you can reuse it a lot of times. It also let you modularize code. For example, let's look at the code below.


```python
%%html

<div>
    <h3>Program Output</h3>
    <p id="output1"></p>
</div>

<script>
(() => {
let myname = "Alice";
let myage = 16;
let message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += message;


myname = "Bob";
myage = 999999999;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;

myname = "Charlie";
myage = 1;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;


myname = "Daniel";
myage = 67;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;
})();

</script>
```



<div>
    <h3>Program Output</h3>
    <p id="output1"></p>
</div>

<script>
(() => {
let myname = "Alice";
let myage = 16;
let message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += message;


myname = "Bob";
myage = 999999999;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;

myname = "Charlie";
myage = 1;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;


myname = "Daniel";
myage = 67;
message = "Hello, " + myname + " (" + myage + ")!";
document.getElementById("output1").innerText += "\n" + message;
})();

</script>



This code, while it works, has a lot of code that is reused. We can modularize this code as shown below.


```python
%%html

<div>
    <h3>Program Output</h3>
    <p id="output2"></p>
</div>

<script>
(() => {
    function greet(myname, myage){
        message = "Hello, " + myname + " (" + myage + ")!";
        document.getElementById("output2").innerText += "\n" + message;
    }

    greet("Alice", 16);
    greet("Bob", 999999999);
    greet("Charlie", 1);
    greet("Daniel", 67);

})();

</script>

```



<div>
    <h3>Program Output</h3>
    <p id="output2"></p>
</div>

<script>
(() => {
    function greet(myname, myage){
        message = "Hello, " + myname + " (" + myage + ")!";
        document.getElementById("output2").innerText += "\n" + message;
    }

    greet("Alice", 16);
    greet("Bob", 999999999);
    greet("Charlie", 1);
    greet("Daniel", 67);

})();

</script>



<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h2 class="glowing-text">Try it out for yourself!</h2>

<br>


```python
%%html

<div>
    <h3>Program Output</h3>
    <p id="output3"></p>

    <hr>
    <label for="nameInput">Name:</label>
    <input type="text" id="nameInput" placeholder="Enter name">
    <label for="ageInput">Age:</label>
    <input type="number" id="ageInput" placeholder="Enter age">
    <button id="greetButton">Greet</button>
</div>

<script>
(() => {

    // Define greet() func

    function greet(myname, myage){
        let message = "Hello, " + myname + " (" + myage + ")!";
        document.getElementById("output3").innerText += "\n" + message;
    }

    // calling it a few times with a few fixed parameters
    greet("Alice", 16);
    greet("Bob", 999999999);
    greet("Charlie", 1);
    greet("Daniel", 67);

    // user input
    const nameInput = document.getElementById("nameInput");
    const ageInput = document.getElementById("ageInput");
    const greetButton = document.getElementById("greetButton");

    greetButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value, 10);
        if(name && !isNaN(age)){
            greet(name, age);
            nameInput.value = "";
            ageInput.value = "";
        } else {
            alert("Please enter a valid name and age!");
        }
    });


})();
</script>

```



<div>
    <h3>Program Output</h3>
    <p id="output3"></p>

    <hr>
    <label for="nameInput">Name:</label>
    <input type="text" id="nameInput" placeholder="Enter name">
    <label for="ageInput">Age:</label>
    <input type="number" id="ageInput" placeholder="Enter age">
    <button id="greetButton">Greet</button>
</div>

<script>
(() => {

    // Define greet() func

    function greet(myname, myage){
        let message = "Hello, " + myname + " (" + myage + ")!";
        document.getElementById("output3").innerText += "\n" + message;
    }

    // calling it a few times with a few fixed parameters
    greet("Alice", 16);
    greet("Bob", 999999999);
    greet("Charlie", 1);
    greet("Daniel", 67);

    // user input
    const nameInput = document.getElementById("nameInput");
    const ageInput = document.getElementById("ageInput");
    const greetButton = document.getElementById("greetButton");

    greetButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value, 10);
        if(name && !isNaN(age)){
            greet(name, age);
            nameInput.value = "";
            ageInput.value = "";
        } else {
            alert("Please enter a valid name and age!");
        }
    });


})();
</script>



<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true });
</script>

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<br><br>
<div class="mermaid">
flowchart LR
    A["Inputs: Alice, 16"] --> B["greet() function"]
    B --> C["Output: Hello, Alice (16)!"]
    A2[Inputs: Bob, 999999999] --> B
    B --> C2["Output: Hello, Bob (999999999)!"]
    A3[Inputs: Charlie, 1] --> B
    B --> C3["Output: Hello, Charlie (1)!"]
    A4[Inputs: myname, myage] --> B
    B --> C4["Output: Hello, [myname] ([myage])!"]

    classDef func fill:#4169e1,stroke:#333,stroke-width:2px,color:#ffffff;
    class B func;
</div>

<hr>

<h2 class="glowing-text">Defining Functions & Function Syntax</h2>

The code to create a function is as follows:

![](https://lh3.googleusercontent.com/proxy/8HuWupeaffPfTzROp_TE2Y4MlniKWW3BoSvSc3oJ35aCJHQbZR0_lmdvqF_bEVNEXzzG53puMLbuIzD1tcH5tfGfRx7sOMAJL_K07adSUML6FbJYOkxSF1pFGoMgXZEtmlxXC-Lq)

Let's look at the below code.

```
function add(a, b) {
    return a + b;
}
```

`add` is the name of the function. A common JavaScript convention is to use camelCase. Function names are usually verbs- like calculateSum(), drawText(), startGame(), etc. because they do something.

`a` and `b` are parameters. You aren't fixed to 2 parameters: you can have one, three, zero, or five hundred (if you want to for some reason).
Parameters are like the input to a function: information that the function takes in to be proccessed.

(Side note: Parameters are the variables listed in the function definition. Arguments are the actual values you pass when calling the function.)

Next, we use curly braces { } to represent that "hey, the code for **this function specifically** starts/ends here!"

The `return` keyword is the output of a function: Mozilla says that
> The return statement ends function execution and specifies a value to be returned to the function caller.

Here's an example:

```js
function add(a, b) {
    return a + b;
}

let result = add(5, 6);
console.log(result); // Logs 11
```



Let's do a practice: what will the below function output and why?

```js
function add(a, b){
  console.log(a+b);
}

let result = add(5, 6);
console.log(result);
```

<details>
    <summary>
        View solution
    </summary>

    The first log to the console will display 11. The second log will say undefined.
    This is because the function is not returning anything, and result is being set to a value that does not exist.

</details>


<h2 class="glowing-text">Example of Returning in Word Game</h2>


```

function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = wordCtx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine); // Add the last line
    return lines;
}

```

<hr>

<h2 class="glowing-text">🍿 POPCORN HACK NO. 1 🍿</h2>

Let's start making our own functions :)
Head over to `2025-09-29-functions_tinkerers_js_hw.ipynb` to do the popcorn hack.
Didn't download it yet? Check the **setup section** at the top of this lesson.

<hr>


<h2 class="glowing-text">More Function Use Cases</h2>

![](https://media.geeksforgeeks.org/wp-content/uploads/20250721183631453591/Why-Use-Functions__.webp)


> Functions can be used to reuse code.

Let's say I have a function that I need to call multiple times. For example, in Word Game, there is a function called drawText() with this code:

```js
function drawText(text) {
    wordCtx.clearRect(0, 0, wordCanvas.width, wordCanvas.height);
    wordCtx.font = '24px "Times New Roman", Times, serif';
    wordCtx.fillStyle = '#dededeff';
    wordCtx.textAlign = 'center';

    const maxWidth = wordCanvas.width - 20; // Leave some padding
    const lineHeight = 30; // Line height for wrapped text
    const lines = wrapText(text, maxWidth);

    const startY = (wordCanvas.height - lines.length * lineHeight) / 2; // Center vertically
    lines.forEach((line, index) => {
        wordCtx.fillText(line, wordCanvas.width / 2, startY + index * lineHeight);
    });
}
```

This function is called *twice* in wordgame.md: once when the game starts and once to clear the canvas after done typing.

This keeps us from having to write this code twice. Instead, we can define it ONCE and call it whenever we want: if we wanted to call it 67 times for some reason, instead of copy pasting the code 67 times, we can just call drawText() whenever needed.

<h2 class="glowing-text">Functions for Abstraction & Modularity</h2>

<strong>ABSTRACTION</strong>

> Functions in Programming allow programmers to abstract the details of a particular operation. Instead of dealing with the entire implementation, a programmer can use a function with a clear interface, relying on its functionality without needing to understand the internal complexities. *Functions hide the details of their operation, allowing the programmer to think at a higher level.* - GeeksForGeeks

<strong>MODULARITY</strong>

Using word game as an example, instead of implementing the whole program, we can tackle the steps one by one. These functions are:

- `drawText(text)` – Draws the prompt text centered on the canvas
- `wrapText(text, maxWidth)` – Splits text into lines that fit within `maxWidth`
- `drawUserText(prompt, input)` – Draws the prompt and user input, highlighting correct/incorrect chars and showing the caret
- `updateStats(prompt, input, startTime)` – Updates WPM and accuracy stats
- `finishGame(prompt, input, startTime)` – Handles game end, calculates mistakes, and shows finish overlay
- `startGame()` – Starts a new game, picks a prompt, and sets up key input handling
- `setProgress(percent)` – Updates the progress bar width and text
- `updateProgress(prompt, input)` – Computes progress from input length and updates the bar
- `createOptionButton(text, val)` – Creates a modal button to select string length
- `escHandler(ev)` – Handles Escape key to close the options menu

<hr>

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h2 class="glowing-text">Scope</h2>

Scope is a common pitfall for those learning functions. Press the button below to run the following code snippet.


```python
%%html

<button id="runButton">Click me!</button>

<p id="scope_demo1"></p>
<p id="scope_demo2"></p>


<script>

function onClick() {

    // myFunction() taken from W3Schools
    function myFunction() {
        let carName = "Volvo";
        let text = "Inside (" + typeof carName + ") - " + carName; 
        document.getElementById("scope_demo2").innerHTML = text;
    }

    myFunction();
    let text = "Outside - " + typeof carName;
    document.getElementById("scope_demo1").innerHTML = text;

}

document.getElementById("runButton").addEventListener("click", onClick);
</script>

```



<button id="runButton">Click me!</button>

<p id="scope_demo1"></p>
<p id="scope_demo2"></p>


<script>

function onClick() {

    // myFunction() taken from W3Schools
    function myFunction() {
        let carName = "Volvo";
        let text = "Inside (" + typeof carName + ") - " + carName; 
        document.getElementById("scope_demo2").innerHTML = text;
    }

    myFunction();
    let text = "Outside - " + typeof carName;
    document.getElementById("scope_demo1").innerHTML = text;

}

document.getElementById("runButton").addEventListener("click", onClick);
</script>



<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h3 class="glowing-text">This is because of <i>SCOPE</i>!</h3>

Essentially, we have things called
- **Local** variables, and
- **Global** variables

Variables defined within a JavaScript function become LOCAL TO THAT FUNCTION.

If I define a variable called `x` inside of a function, it can only be accessed within that function. Even if we use `var`, it will remain stuck inside that function. You should avoid polluting the global scope, but if you absolutely have to (which you don't), you can write something similar to the below code:

```
function makeGlobal() {
    let localVar = "I am local";
    window.globalVar = localVar; // now accessible globally
}

makeGlobal();
console.log(globalVar); // Outputs "I am local"
```

<hr>

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h2 class="glowing-text">🍿 POPCORN HACK NO. 2 🍿</h2>

Let's practice using functions!

Head over to the homework notebook to do the popcorn hack.

<hr>

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h2 class="glowing-text">Recursion</h2>

We won't spend too much time on this, but we'll just do an overview of what recursion is.

Recursion is where a function continuously calls itself. View the example below for a factorial recursion function:

```js
function factorial(n) {
  // If n is 0 or 1, the factorial is 1.
  // This condition prevents infinite recursion.
  if (n === 0 || n === 1) {
    return 1;
  } 
  // Recursive case: the function calls itself with a smaller value of n.
  else {
    return n * factorial(n - 1);
  }
}
```

If we run factorial(5), it will do:
- factorial(5) = 5 * factorial(4), which calls:
- factorial(4) = 4 * factorial(3)
- factorial(3) = 3 * factorial(2)
- factorial(2) = 2 * factorial (1)
- factorial(1) = 1

### Demo


```python
%%html

<p>Factorial Recursion Demo</p>

<input type="number" id="fInput" placeholder="Enter input (less than 100 please!)">
<button id="calcFactorial">Calculate</button>

<div id="fDemo">Your results will appear here.</div>

<script>
    (() => {
        function factorial(n) {
            // If n is 0 or 1, the factorial is 1.
            // This condition prevents infinite recursion.
            if (n === 0 || n === 1) {
                return 1;
            }
            // Recursive case: the function calls itself with a smaller value of n.
            else {
                return n * factorial(n - 1);
            }
        }

        const button = document.getElementById("calcFactorial");
        const input = document.getElementById("fInput");
        const output = document.getElementById("fDemo");

        button.addEventListener("click", () => {
            let val = Number(input.value);
            if (val > 100){
                output.innerText += "\n" + "Please enter a value less than or equal to 100. (" + val + ")";
                console.log("Please enter a value less than or equal to 100. (" + val + ")");
            } else {
                let result = BigInt(factorial(val));
                output.innerText += "\n" + val + "! = " + result; 
                console.log(val + "! = " + result);
            }
        });
    })();

</script>
```



<html>
<body>

<p>Factorial Rescursion Demo</p>

<input type="number" id="fInput" placeholder="Enter input (less than 100 please!)">
<button id="calcFactorial">Calculate</button>

<div id="fDemo">Your results will appear here.</div>

<script>
    (() => {
        function factorial(n) {
            // If n is 0 or 1, the factorial is 1.
            // This condition prevents infinite recursion.
            if (n === 0 || n === 1) {
                return 1;
            }
            // Recursive case: the function calls itself with a smaller value of n.
            else {
                return n * factorial(n - 1);
            }
        }

        const button = document.getElementById("calcFactorial");
        const input = document.getElementById("fInput");
        const output = document.getElementById("fDemo");

        button.addEventListener("click", () => {
            let val = Number(input.value);
            if (val > 100){
                output.innerText += "\n" + "Please enter a value less than or equal to 100. (" + val + ")";
                console.log("Please enter a value less than or equal to 100. (" + val + ")");
            } else {
                let result = BigInt(factorial(val));
                output.innerText += "\n" + val + "! = " + result; 
                console.log(val + "! = " + result);
            }
        });
    })();

</script>
</body>
</html>



<hr>

<style>
.glowing-text {
  color: #fff; /* Set the text color to white or a light color for better contrast */
  text-shadow: 0 0 10px #8a2be2, /* Purple glow */
               0 0 20px #8a2be2, /* Deeper purple glow */
               0 0 30px #4169e1, /* Blue glow */
               0 0 40px #4169e1; /* Deeper blue glow */

  font-weight: bold;
}
</style>

<h2 class="glowing-text">Arrow Functions (if time)</h2>

Arrow functions are a more concise way to write functions. Use case scenario:



```python
%%html

<h3>Result</h3>
<button id="arrowfuncs_button">Click Me</button>
<div id="arrowfuncs_result"></div>

<script>
  document.getElementById("arrowfuncs_button").addEventListener("click", () => {
  document.getElementById("arrowfuncs_result").innerText = "Button clicked";
})
</script>
```



<h3>Result</h3>
<button id="arrowfuncs_button">Click Me</button>
<div id="arrowfuncs_result"></div>

<script>
  document.getElementById("arrowfuncs_button").addEventListener("click", () => {
  document.getElementById("arrowfuncs_result").innerText = "Button clicked";
})
</script>





<h2 class="glowing-text">HOMEWORK 😈</h2>


The homework for functions is located at `2025-09-29-functions_tinkerers_js_hw.ipynb`.
Make sure to attempt all the challenges and turn in your notebook URL to the link on that page.
