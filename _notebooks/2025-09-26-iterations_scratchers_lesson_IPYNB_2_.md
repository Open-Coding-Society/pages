---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Iterations']
lesson_language: Python
lesson_topic: Iterations
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.8 Iterations
description: An introduction to College Board's Big Idea 3.8 Iterations. This will help you understand how to write loops in Python and JavaScript.
permalink: /csp/big-idea-3/scratchers/iterations/p4/lesson
---

## Iteration Lesson – Big Idea 3.8



## Warm-Up
Think about these questions:
- How do you brush your teeth every morning?
- Do you repeat steps until your teeth feel clean?
- What are other examples in daily life where we repeat steps?

Iteration is like repeating those steps in code until a condition is met.


## Key Vocabulary
- **Loop** – A structure that repeats instructions.  
- **For loop** – Repeats a block of code a specific number of times.  
- **While loop** – Repeats a block of code as long as a condition is true.  
- **Iteration** – Each repetition of the loop body.  


## Language comparison: Python vs JavaScript


Short notes for beginners:
- Python uses indentation to mark the loop body; JavaScript uses braces `{}`.
- Python commonly uses `range()` and direct iteration over lists; JavaScript often uses `for`, `for...of`, or array methods like `.forEach()`.
- Behavior of `break` and `continue` is the same in both languages but the syntax differs slightly.
- When converting between languages, focus on the loop's goal (counting, iterating, waiting for a condition) and pick the matching pattern in the target language.

## For loops 

A `for` loop is used when you know (or can determine) how many times you want to repeat something. In Python, `for variable in sequence:` runs the body once for each item in the sequence.

`for` loops are **definate** loops meaning they only run for a definate amount of variables

Key parts:
- `variable`: a name that refers to the current item or index each iteration.
- `sequence`: something you can loop over (like `range()`, lists, strings).

### What happens during a `for` loop (step-by-step)

Let's look at a tiny loop and trace exactly what the computer does each step. This helps us see how the loop variable changes and when the loop stops.

Code to trace:
```python
for i in range(1, 4):
    print('i is', i)
```

Step-by-step explanation:
1. `range(1, 4)` creates the sequence [1, 2, 3].
2. The loop picks the first item (1) and assigns it to `i`.
3. The body `print('i is', i)` runs and shows `i is 1`.
4. The loop picks the next item (2), assigns to `i`, runs the body, prints `i is 2`.
5. The loop picks the next item (3), prints `i is 3`.
6. There are no more items, so the loop ends.

Try changing the range numbers to see more or fewer iterations.


```python
# Run the tiny loop so you can see the trace
for i in range(1, 4):
    print('current value of i =', i)

```

### `for` Popcorn Hack: Iterate a list of names
Example: iterate a list of names and greet each person.


```python
blanks = ['', '', '']
for blank in blanks:
    print('Hello,', blank)

```

### Python vs JavaScript: `for` Loops

### 1) Simple `for` loop (counting)
Python explanation: `for i in range(start, end)` runs i through a sequence of numbers.
```python
for i in range(1, 6):
    print(i)  # prints 1,2,3,4,5
```
JavaScript explanation: `for (let i = start; i < end; i++)` is the usual counting loop.
```javascript
for (let i = 1; i <= 5; i++) {
  console.log(i); // prints 1,2,3,4,5
}
```
### 2) Looping over an array/list
Python (list): use `for item in list:`
```python
names = ['Anwita','Nicholas','Varada']
for name in names:
    print('Hello', name)
```
JavaScript (array): use `for...of` or index loop
```javascript
const names = ['Anwita','Nicholas','Varada'];
for (const name of names) {
  console.log('Hello', name);
}
```

## while Loop

A `while` loop repeats as long as a condition remains true. Use `while` when you don’t know in advance how many iterations you need — just the condition that should stop the loop.

A `while` loop  is an **indefinate** loop meaning it will repeat as long as a condition is true
Important ideas:
- Ensure something in the loop eventually makes the condition false (like updating a counter).
- Be careful with input-driven loops — always validate and provide a clear exit path.

Example: Create a list of numbers and end and 5

We are going to use what we learned previously in math expressions!


```python
# Initialize a variable
num = 1

# While loop starts
while num <= 5: # This loop will continue as long as num is less than or equal to 5
    print(num) # Print the current value of the number
    num += 1  # This is equivalent to num = num + 1
# End of the loop
```

## Homework help!

To do what we did above with the list of names, you can also use a while loop!


```python
names = ['Anwita', 'Nicholas', 'Varada']

# i = 0 # Initialize a variable i to 0
# while i < ___(names): # Loop continues as long as i is less than the length of the names list (The length is 3)
#    print('Hello', names[i]) # Print the name at index i
#   i += 1
```

### Doubling using `while` loops

This loop will continue as long as the number is less than or equal to 100 starting at 2


```python
# Keep doubling until the number is greater than 100
num = 2 # Start with 2
while num <= 100: # This loop will continue as long as num is less than or equal to 100
    print(num) # Print the current value of the number
    num = num * 2 # This is equivalent to num *= 2
```

### JavaScript equivalent
Here is the same behavior in JavaScript (prints to console):


```javascript
%%js
// Start with 2, keep doubling while <= 100
let num = 2;
while (num <= 100) {
  console.log(num);
  num = num * 2; // or num *= 2 for shorter syntax
}
```

###  `while` Popcorn Hack: countdown with a safety counter

This `while` loop counts down from 10 to 1. Let's built a countdown to blast off with `while` loops!


```python
n = 10
# while n > 0:  
#    print('T minus', n)
#    n -= 1 # same as n = n - 1

#print('Blast off!') 
```

## JavaScript vs. Python: `while` Loops
### 3) `while` loop (indefinite)
Python: repeat until condition false
```python
count = 1
while count <= 5:
    print(count)
    count += 1
```
JavaScript: similar structure, but different syntax
```javascript
let count = 1;
while (count <= 5) {
  console.log(count);
  count += 1;
}
```
### `while` loop in arrays/lists

```python
names = ['Anwita', 'Nicholas', 'Varada']
i = 0
while i < len(names):
    print('Hello', names[i])
    i += 1

```

```javascript
let names = ['Anwita', 'Nicholas', 'Varada'];
let i = 0;
while (i < names.length) {
    console.log('Hello ' + names[i]);
    i++;
}
```


## Control flow inside loops: break and continue

- `break` exits the entire loop immediately.
- `continue` skips the rest of the current iteration and goes to the next one.

Example: print numbers 1–6 but skip 3 and stop when you reach 5.


```python
for n in range(1, 8): # numbers 1 to 8
    if n == 3: # when n is 3
        continue  # skip number 3
    if n == 6: # when n is 6
        break  # stop the whole loop at 6
    print(n) # what number is printed

# Output: 1
#         2
#         4
#         5
```

### 4) `break` and `continue`
Python:
```python
for i in range(1, 6):
    if i == 3:
        continue  # skip the rest of this iteration
    if i == 5:
        break     # exit the loop early
    print(i) 
```
JavaScript:
```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  if (i === 5) break;
  console.log(i);
}
```

## Iterations Game — Multiple Choice (JavaScript / Python)
Choose a language, read the snippet, and pick the correct output or behavior. You will get immediate "Correct" or "Incorrect" feedback and an explanation.
<div id="quiz">
  <div style="margin-bottom:10px;color: white;font-weight:bold;">
    <label><input type="radio" name="lang" value="js" checked> JavaScript</label>
    <label style="margin-left:10px;color: white;font-weight:bold;"><input type="radio" name="lang" value="py"> Python</label>
  </div>

  <div id="card" style="border:1px solid #ccc;padding:12px;border-radius:6px;background: #bc7e7eff;">
    <h3 id="qnum">Question 1</h3>
    <pre id="code" style="background:#272822;color: #f8f8f2;padding:10px;border-radius:4px;overflow:auto;"></pre>
    <div id="choices"></div>
    <div style="margin-top:8px;">
      <button id="submit">Submit</button>
      <button id="next" style="margin-left:8px;">Next</button>
      <button id="explain" style="margin-left:8px;">Show Explanation</button>
    </div>
    <p id="result" style="font-weight:bold;margin-top:8px;color:black"></p>
    <div id="explainText" style="margin-top:6px;color:#333;"></div>
  </div>
</div>

<style>
  button {
    background-color: #5e3434ff;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-family: "Segoe UI", sans-serif;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    margin-left: 8px;
  }

  button:first-child {
    margin-left: 0;
  }

  button:hover {
    background-color: #5e3434ff;
    transform: translateY(-2px);
  }

  button:active {
    transform: translateY(0);
  }
</style>

<script>
(function(){
  const questions = [
    {
      codeJS: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
      codePy: "for i in range(3):\n    print(i)",
      choices: ["0 1 2", "1 2 3", "0 1 2 3", "Error"],
      answer: 0,
      explain: "Loops start at 0 and run while i < 3, producing 0,1,2."
    },
    {
      codeJS: "let i = 0;\nwhile (i < 3) {\n  i += 2;\n  console.log(i);\n}",
      codePy: "i = 0\nwhile i < 3:\n    i += 2\n    print(i)",
      choices: ["0 2", "2 4", "2", "0 1 2"],
      answer: 1,
      explain: "Each loop iteration increases i by 2 then prints. Values printed: 2 then 4."
    },
    {
      codeJS: "const arr = [1,2,3];\nfor (const x of arr) console.log(x * 2);",
      codePy: "for x in [1,2,3]:\n    print(x * 2)",
      choices: ["2 4 6", "1 2 3", "2,4,6,8", "Error"],
      answer: 0,
      explain: "Each element is multiplied by 2: 2,4,6."
    },
    {
      codeJS: "for (let i=0;i<5;i++){\n  if (i===2) break;\n  console.log(i);\n}",
      codePy: "for i in range(5):\n    if i == 2:\n        break\n    print(i)",
      choices: ["0 1", "0 1 2", "2 3 4", "0 1 2 3 4"],
      answer: 0,
      explain: "break stops the loop when i equals 2, so only 0 and 1 are printed."
    },
    {
      codeJS: "for (let i=0;i<4;i++){\n  if (i%2===0) continue;\n  console.log(i);\n}",
      codePy: "for i in range(4):\n    if i % 2 == 0:\n        continue\n    print(i)",
      choices: ["1 3", "0 2", "0 1 2 3", "0 1 3"],
      answer: 0,
      explain: "continue skips even i (0 and 2), so only odd values 1 and 3 are printed."
    },
    {
      codeJS: "for (let i=0;i<5;i++){\n  if (i===3) break;\n  console.log(i);\n}",
      codePy: "for i in range(5):\n    if i == 3:\n        break\n    print(i)",
      choices: ["0 1 2", "0 1 2 3", "1 2 3", "0 1"],
      answer: 0,
      explain: "The loop stops completely when i reaches 3, so it prints 0, 1, 2."
    },
    {
      codeJS: "for(let i=0;i<5;i++){\n  if(i%2!==0) continue;\n  console.log(i);\n}",
      codePy: "for i in range(5):\n    if i % 2 != 0:\n        continue\n    print(i)",
      choices: ["0 2 4", "1 3", "0 1 2 3 4", "2 4"],
      answer: 0,
      explain: "continue skips odd numbers, so only even numbers 0,2,4 are printed."
    },
    {
      codeJS: "let sum = 0;\nfor(let i=1;i<=3;i++){\n  sum += i;\n}\nconsole.log(sum);",
      codePy: "sum = 0\nfor i in range(1,4):\n    sum += i\nprint(sum)",
      choices: ["6", "5", "3", "Error"],
      answer: 0,
      explain: "The loop adds 1+2+3 to sum, resulting in 6."
    },
    {
      codeJS: "let i = 1;\nwhile(i < 10) {\n  i *= 2;\n}\nconsole.log(i);",
      codePy: "i = 1\nwhile i < 10:\n    i *= 2\nprint(i)",
      choices: ["16", "8", "10", "Error"],
      answer: 0,
      explain: "i doubles each loop: 1,2,4,8, then 16 which breaks the loop. Final i is 16."
    },
    {
      codeJS: "const arr = [2,4,6];\nlet prod = 1;\nfor(const x of arr) {\n  prod *= x;\n}\nconsole.log(prod);",
      codePy: "arr = [2,4,6]\nprod = 1\nfor x in arr:\n    prod *= x\nprint(prod)",
      choices: ["48", "12", "24", "Error"],
      answer: 0,
      explain: "The loop multiplies all elements: 1*2=2, 2*4=8, 8*6=48."
    },
    {
      codeJS: "for(let i=0;i<3;i++){\n  for(let j=0;j<2;j++){\n    console.log(i,j);\n  }\n}",
      codePy: "for i in range(3):\n    for j in range(2):\n        print(i,j)",
      choices: ["0 0,0 1,1 0,1 1,2 0,2 1", "0 0,1 0,2 0", "0 1,1 1,2 1", "Error"],
      answer: 0,
      explain: "Nested loops produce all combinations of i (0-2) and j (0-1)."
    },
    {
      codeJS: "let count = 0;\nfor(let i=0;i<5;i++){\n  if(i%2===0) count++;\n}\nconsole.log(count);",
      codePy: "count = 0\nfor i in range(5):\n    if i % 2 == 0:\n        count += 1\nprint(count)",
      choices: ["3", "2", "5", "Error"],
      answer: 0,
      explain: "The loop counts even numbers (0,2,4), resulting in count=3."
    },
    {  
      codeJS: "let i=0;\nwhile(i<4){\n  i++;\n  if(i===2) continue;\n  console.log(i);\n}",
      codePy: "i = 0\nwhile i < 4:\n    i += 1\n    if i == 2:\n        continue\n    print(i)",
      choices: ["1 3 4", "1 2 3 4", "2 3 4", "Error"],
      answer: 0,
      explain: "The loop increments i then prints unless i is 2. So it prints 1,3,4."
    },
    {
      codeJS: "let total = 0;\nfor(let i=1;i<=4;i++){\n  if(i===3) break;\n  total += i;\n}\nconsole.log(total);",
      codePy: "total = 0\nfor i in range(1,5):\n    if i == 3:\n        break\n    total += i\nprint(total)",
      choices: ["3", "6", "10", "Error"],
      answer: 0,
      explain: "The loop adds 1+2 then breaks before adding 3, so total=3."
    },
    {
      codeJS: "const arr = [1,2,3,4];\nlet sum=0;\nfor(const x of arr){\n  if(x%2===0) continue;\n  sum+=x;\n}\nconsole.log(sum);",
      codePy: "arr = [1,2,3,4]\nsum = 0\nfor x in arr:\n    if x % 2 == 0:\n        continue\n    sum += x\nprint(sum)",
      choices: ["4", "10", "6", "Error"],
      answer: 0,
      explain: "The loop sums only odd numbers (1 and 3), resulting in sum=4."
    }
  ];

  let idx = 0;
  let selected = null;

  const codeEl = document.getElementById('code');
  const choicesEl = document.getElementById('choices');
  const resultEl = document.getElementById('result');
  const explainEl = document.getElementById('explainText');
  const qnumEl = document.getElementById('qnum');

  function getLang() {
    return document.querySelector('input[name="lang"]:checked').value;
  }

  function render() {
    const q = questions[idx];
    qnumEl.textContent = "Question " + (idx+1);
    const lang = getLang();
    codeEl.textContent = (lang === 'js') ? q.codeJS : q.codePy;
    // render choices
    choicesEl.innerHTML = '';
    q.choices.forEach((c, i) => {
      const id = 'opt' + i;
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '6px';
      wrapper.innerHTML = `<label><input type="radio" name="choice" value="${i}" id="${id}"> ${escapeHtml(c)}</label>`;
      choicesEl.appendChild(wrapper);
    });
    resultEl.textContent = '';
    explainEl.textContent = '';
    selected = null;
    document.querySelectorAll('input[name="choice"]').forEach(r => r.addEventListener('change', e=> selected = parseInt(e.target.value)));
  }

  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  document.getElementById('submit').addEventListener('click', ()=>{
    if (selected === null) { resultEl.textContent = "Pick an answer first."; resultEl.style.color = "darkorange"; return; }
    const q = questions[idx];
    if (selected === q.answer) {
      resultEl.textContent = "Correct";
      resultEl.style.color = "green";
    } else {
      resultEl.textContent = "Incorrect";
      resultEl.style.color = "red";
    }
  });

  document.getElementById('next').addEventListener('click', ()=>{
    idx = (idx + 1) % questions.length;
    render();
  });

  document.getElementById('explain').addEventListener('click', ()=>{
    explainEl.textContent = questions[idx].explain;
  });

  document.querySelectorAll('input[name="lang"]').forEach(r=> r.addEventListener('change', render));

  // initial render
  render();
})();
</script>
## Check for Understanding

**Question:** What will this code output?  
```python
for i in range(3):
    print("hi")
```

- A) `hi`  
- B) `hi hi`  
- C) `hi hi hi`  
- D) Nothing  

**Correct Answer:** C  

