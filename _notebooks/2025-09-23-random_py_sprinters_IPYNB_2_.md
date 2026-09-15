---
layout: post
courses: {'csp': {'week': 1}}
categories: ['Python', 'Random-Values']
lesson_language: Python
lesson_topic: Random-Values
lesson_part: interactive
lesson_type: lesson
toc: True
comments: False
title: 3.15 Random Numbers (py)
description: Random Numbers in Python
breadcrumbs: True
permalink: /csp/big-idea-3/RandomPY/p3/Lesson
authors: Rudra J, Darshan S.
---

<style>
/* 🌌 Full Page Background */
body {
  background: linear-gradient(-45deg, #000000, #001100, #003300, #000000);
  background-size: 400% 400%;
  animation: bgMove 18s ease infinite;
  color: #e6ffe6;
  font-family: "Segoe UI", sans-serif;
  margin: 0;
  padding: 0;
}
@keyframes bgMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 🎲 Python Lesson Box */
.py-lesson {
  background: linear-gradient(135deg, #0a0f0a, #001a00, #002b00);
  border: 2px solid #00ff88;
  border-radius: 12px;
  padding: 25px;
  margin: 25px auto;
  max-width: 900px;
  font-family: "Segoe UI", sans-serif;
  color: #e6ffe6;
  box-shadow: 0 0 25px rgba(0, 255, 136, 0.5);
  line-height: 1.7em;
}

.py-lesson h1 {
  font-size: 2.2em;
  color: #00ff88;
  text-shadow: 0 0 12px rgba(0,255,136,0.9);
  margin-bottom: 15px;
}

.py-lesson h2 {
  color: #66ffcc;
  text-shadow: 0 0 8px rgba(102,255,204,0.8);
  margin-top: 15px;
}

.py-lesson code {
  background: #001100;
  padding: 2px 6px;
  border-radius: 5px;
  color: #00ff88;
  font-family: "Courier New", monospace;
}
</style>

<div class="py-lesson">
  <h1>🎲 Random Numbers</h1>

  <h2>The Random Module</h2>
  <p>
    To make anything random in Python, you need a module called <code>random</code>.  
    This module must be imported into your script beforehand like this:
  </p>
</div>



```python
import random
```

<style>
/* 🪄 Spellbook Background */
body {
  background: linear-gradient(-45deg, #000000, #0a0f0a, #001a00, #000000);
  background-size: 400% 400%;
  animation: bgFlow 20s ease infinite;
  color: #e6ffe6;
  font-family: "Segoe UI", serif;
  margin: 0;
  padding: 0;
}
@keyframes bgFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 📖 Spellbook Section */
.spellbook {
  background: linear-gradient(145deg, #0b0f0b, #001a00, #003300);
  border: 2px solid #00ff88;
  border-radius: 15px;
  padding: 30px;
  margin: 30px auto;
  max-width: 900px;
  font-family: "Garamond", "Georgia", serif;
  color: #e6ffe6;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
  line-height: 1.8em;
}

/* ✨ Spellbook Headings */
.spellbook h1 {
  font-size: 2.4em;
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0,255,136,1);
  margin-bottom: 20px;
  font-family: "Cinzel Decorative", serif;
}

.spellbook h2 {
  color: #66ffcc;
  text-shadow: 0 0 10px rgba(102,255,204,0.9);
  margin-top: 20px;
  font-family: "Cinzel Decorative", serif;
}

/* 🔮 Inline code = glowing runes */
.spellbook code {
  background: #001100;
  padding: 3px 7px;
  border-radius: 6px;
  color: #00ff88;
  font-family: "Courier New", monospace;
  text-shadow: 0 0 6px rgba(0,255,136,0.8);
}
</style>

<div class="spellbook">
  <h1>📖 The Spellbook of Randomness</h1>
  
  <p>
    Think of this as a <b>spellbook</b>! Every Python spell must derive from the spellbook.  
    In this case, that spellbook we need is <code>random</code>.
  </p>

  <h2>🔮 A Basic Number Generator</h2>
  <p>
    Let’s analyze the following generator:
  </p>
</div>



```python
import random
# Generate a random integer between 1 and 10 (inclusive)
random_integer = random.randint(1, 10)
print(f"Random Integer: {random_integer}")
```

    Random Integer: 2


<style>
/* 📜 Spell Explanation Box */
.incantation {
  background: linear-gradient(135deg, #0a0a0a, #001000, #002200);
  border: 2px solid #00ff88;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  font-family: "Courier New", monospace;
  color: #e6ffe6;
  box-shadow: 0 0 15px rgba(0,255,136,0.5);
  line-height: 1.6em;
}

.incantation code {
  color: #00ff88;
  font-weight: bold;
  text-shadow: 0 0 6px rgba(0,255,136,0.9);
}

.spellbook h2 {
  color: #66ffcc;
  text-shadow: 0 0 10px rgba(102,255,204,0.9);
  margin-top: 20px;
  font-family: "Cinzel Decorative", serif;
}
</style>

<div class="spellbook">

  <div class="incantation">
    <p><code>import random</code>: Allows us to access the random module</p>
    <p><code>random_integer</code>: This is our variable to hold the number we generate</p>
    <p><code>random.randint(1,10)</code>: This basically says “from the random module, use the <b>randint</b> function and use parameters 1 and 10.”  
    Randint is the function used to determine a random integer in a range. In this case, that range is 1 and 10.</p>
    <p><code>print(f"Random Integer: {random_integer}")</code>: Prints the number</p>
  </div>

  <h2>✨ Another Type of Generator</h2>
  <p>Let’s look at one more generator:</p>

</div>



```python
import random
# Generate a random float between 0 and 1 (inclusive)
random_float = random.uniform(0, 1)
print(f"Random Float: {random_float}")
```

    Random Float: 0.1742626429831371


<style>
/* 📜 Comparison Scroll */
.scroll {
  background: linear-gradient(135deg, #0b0b0b, #001100, #002200);
  border: 2px solid #00ff88;
  border-radius: 12px;
  padding: 20px;
  margin: 25px auto;
  max-width: 900px;
  font-family: "Georgia", serif;
  color: #e6ffe6;
  box-shadow: 0 0 20px rgba(0,255,136,0.4);
  line-height: 1.7em;
}

.scroll h2 {
  color: #66ffcc;
  text-shadow: 0 0 10px rgba(102,255,204,0.9);
  font-family: "Cinzel Decorative", serif;
  margin-bottom: 10px;
}

.scroll strong {
  color: #00ff88;
  text-shadow: 0 0 6px rgba(0,255,136,0.7);
}

/* 🪄 Hacks Section */
.hacks {
  background: linear-gradient(135deg, #0a0000, #220000, #330000);
  border: 2px solid #ff4d4d;
  border-radius: 12px;
  padding: 20px;
  margin: 25px auto;
  max-width: 900px;
  font-family: "Georgia", serif;
  color: #ffeaea;
  box-shadow: 0 0 25px rgba(255,0,0,0.5);
  line-height: 1.7em;
}

.hacks h2 {
  color: #ff4d4d;
  text-shadow: 0 0 12px rgba(255,77,77,0.9);
  font-family: "Cinzel Decorative", serif;
  margin-bottom: 10px;
}
</style>

<div class="scroll">
  <h2>📜 Before We Begin: Types of Random</h2>

  <p><strong>Randint</strong>:  
  - What it does: Picks a whole number between two values, with equal chance for each.  
  - Distribution type: <b>Discrete</b> uniform distribution.</p>

  <p><strong>Uniform</strong>:  
  - What it does: Picks a decimal (float) between two numbers, again with equal chance for every value in that range.  
  - Distribution type: <b>Continuous</b> uniform distribution.</p>

  <p><strong>Normalvariate</strong>:  
  - What it does: Picks a number where values near the average (mean) are more likely, and extreme values are rare.  
  - Distribution type: <b>Normal</b> (bell curve).</p>

  <p>This code right here uses <b>Uniform</b>. It needs to pick a <b>float</b> or <b>decimal</b> and the <b>Uniform</b> function works best when dealing with decimals between 2 numbers with equal chance to roll it.</p>
</div>

<div class="hacks">
  <h2>🪄 Hacks!</h2>
  <p>Here are a few challenges you can try making with the concept of RNG in Python:</p>
  <ol>
    <li>🎲 Dice or Lottery Numbers</li>
    <li>📏 Random Decimal Precision</li>
    <li>🔀 Random Shuffle with Numbers</li>
  </ol>
</div>



<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Learn About Random Module & RNG</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, sans-serif;
      margin: 20px;
      background: #1e1e2f; /* dark background */
      color: #e4e4e4;      /* light text */
    }
    h1 {
      text-align: center;
      color: #ffb347; /* orange accent */
    }
    .section {
      background: #2c2c3c;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    h2 {
      color: #50fa7b; /* teal accent */
    }
    button {
      padding: 8px 15px;
      margin-top: 10px;
      border: none;
      border-radius: 5px;
      background: #ff7f50; /* coral/orange */
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #ff5c1a;
    }
    input {
      padding: 5px;
      margin: 5px;
      width: 70px;
      border-radius: 5px;
      border: 1px solid #555;
      background: #1e1e2f;
      color: #e4e4e4;
      text-align: center;
    }
    #output-random, #output-randint, #output-uniform {
      font-weight: bold;
      color: #50fa7b;
      margin-top: 12px;
    }
    code {
      background: #444;
      padding: 3px 6px;
      border-radius: 4px;
      color: #ffb347;
    }
  </style>
</head>
<body>

  <h1>Learn the Random Module & Try RNGs</h1>

  <div class="section">
    <h2>About Python’s <code>random</code> Module</h2>
    <p>The <code>random</code> module in Python is used to generate random numbers. Some key functions include:</p>
    <ul>
      <li><code>random()</code>: Returns a float between <code>0.0</code> and <code>1.0</code>.</li>
      <li><code>randint(a, b)</code>: Returns an integer between <code>a</code> and <code>b</code> (inclusive).</li>
      <li><code>uniform(a, b)</code>: Returns a float between <code>a</code> and <code>b</code>.</li>
      <li><code>choice(seq)</code>: Returns a random element from a sequence.</li>
    </ul>
  </div>

  <div class="section">
    <h2>Generate Random Float (0.0 – 1.0)</h2>
    <button onclick="generateRandom()">Generate</button>
    <div id="output-random"></div>
  </div>

  <div class="section">
    <h2>Generate Random Integer (<code>randint(a, b)</code>)</h2>
    <label>Min: <input type="number" id="min" value="1"></label>
    <label>Max: <input type="number" id="max" value="10"></label>
    <br>
    <button onclick="generateRandInt()">Generate</button>
    <div id="output-randint"></div>
  </div>

  <div class="section">
    <h2>Generate Random Float in Range (<code>uniform(a, b)</code>)</h2>
    <label>Min: <input type="number" id="minf" value="0"></label>
    <label>Max: <input type="number" id="maxf" value="1"></label>
    <br>
    <button onclick="generateUniform()">Generate</button>
    <div id="output-uniform"></div>
  </div>

  <script>
    function generateRandom() {
      const num = Math.random();
      document.getElementById("output-random").innerText = "Random float: " + num;
    }

    function generateRandInt() {
      const min = parseInt(document.getElementById("min").value);
      const max = parseInt(document.getElementById("max").value);
      if (min > max) {
        document.getElementById("output-randint").innerText = "Error: Min ≤ Max required";
        return;
      }
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      document.getElementById("output-randint").innerText = "Random integer: " + num;
    }

    function generateUniform() {
      const min = parseFloat(document.getElementById("minf").value);
      const max = parseFloat(document.getElementById("maxf").value);
      if (min > max) {
        document.getElementById("output-uniform").innerText = "Error: Min ≤ Max required";
        return;
      }
      const num = Math.random() * (max - min) + min;
      document.getElementById("output-uniform").innerText = "Random float in range: " + num;
    }
  </script>

</body>
</html>


<style>
/* 🧪 Demo Spell Box */
.demo-spell {
  background: linear-gradient(135deg, #0a0f0a, #001a00, #002b00);
  border: 2px solid #00ff88;
  border-radius: 10px;
  padding: 20px;
  margin: 25px auto;
  max-width: 900px;
  font-family: "Georgia", serif;
  color: #e6ffe6;
  box-shadow: 0 0 18px rgba(0,255,136,0.5);
  line-height: 1.6em;
}

.demo-spell h2 {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0,255,136,0.9);
  font-family: "Cinzel Decorative", serif;
  margin-bottom: 12px;
}

.demo-spell p {
  margin-bottom: 10px;
}
</style>

<div class="demo-spell">
  <h2>🧪 Extra Demos (Python)</h2>
  <p>
    Below are small, self-contained Python snippets you can run inside the notebook.  
    They use the standard <code>random</code> module and a tiny seeded helper so results can be reproduced for tests.
  </p>
</div>



```python
# Seeded RNG helper using random.Random (reproducible)
from random import Random, choices, randint, shuffle, uniform, gauss

def make_rng(seed):
    return Random(seed)

rng = make_rng(42)
print('rng sample floats:', [rng.random() for _ in range(3)])

```


```python
# Two-dice simulation and heatmap (counts for face1 vs face2)
import numpy as np
import matplotlib.pyplot as plt
from random import Random

def two_dice_heatmap(trials=10000, seed=1):
    rng = Random(seed)
    grid = np.zeros((6,6), dtype=int)
    for _ in range(trials):
        a = rng.randint(1,6) - 1
        b = rng.randint(1,6) - 1
        grid[a,b] += 1
    return grid

g = two_dice_heatmap(5000, seed=7)
print(g)
# If matplotlib is available, show a simple heatmap (optional)
try:
    plt.imshow(g, cmap='viridis')
    plt.colorbar()
    plt.title('Two-dice frequency heatmap (face1 x face2)')
    plt.xlabel('Die 2 face (1-6)')
    plt.ylabel('Die 1 face (1-6)')
    plt.show()
except Exception as e:
    print('matplotlib display skipped:', e)

```


```python
# Loot box simulator (with adjustable probabilities)
from random import Random

def simulate_loot(n=1000, seed=0, pool=None):
    if pool is None:
        pool = [('Common',0.7), ('Rare',0.25), ('Epic',0.045), ('Legendary',0.005)]
    rng = Random(seed)
    names = [p[0] for p in pool]
    weights = [p[1] for p in pool]
    counts = {name:0 for name in names}
    for _ in range(n):
        pick = rng.random()
        s = 0
        for name,w in zip(names, weights):
            s += w
            if pick < s: counts[name] += 1; break
    return counts

print(simulate_loot(1000, seed=42))

```


```python
# Seeded shuffle and reproducible playlist example
from random import Random

def seeded_shuffle(arr, seed):
    rng = Random(seed)
    a = list(arr)
    rng.shuffle(a)
    return a

songs = ['Song A','Song B','Song C','Song D','Song E']
print('seed=1:', seeded_shuffle(songs,1))
print('seed=1 again:', seeded_shuffle(songs,1))
print('seed=2:', seeded_shuffle(songs,2))

```
