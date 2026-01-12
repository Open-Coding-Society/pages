---
layout: post
title: Sprint 2 - Introduction to Python for RNG Interactive
description:  Lesson for python For RNG
breadcrumbs: True
permalink: /csp/big-idea-3/RandomPY/p3/Demo
---

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
